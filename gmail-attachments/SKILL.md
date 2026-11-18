---
name: gmail-attachments
description: Use when downloading, extracting, saving or reading the contents of an attachment on a Gmail message - the Gmail connector exposes attachment metadata but never the bytes, so a RAW MIME workaround is required. Triggers on "gmail attachment", "download the attachment", "email attachment", "attached file", "the PDF/CSV/xlsx they emailed me", "get the file off that email".
---

# Downloading Gmail Attachments

## The trap

`mcp__claude_ai_Gmail__get_message` with `FULL_CONTENT` or `PLAIN_TEXT` returns:

- `attachments`: `[{filename, mimeType, id}, ...]`
- `attachmentIds`: `[...]`

This is **metadata only. No bytes.** No connector tool converts an attachment `id` into content. Gmail's REST API has `users.messages.attachments.get`, but the connector does not expose it.

Do not go looking for a download tool, and do not tell the user it can't be done. Use the RAW route below.

## The workaround: RAW MIME

Raw MIME carries every attachment as a base64-encoded part, and `get_message` can return it.

### 1. Find the message

`search_threads` with `has:attachment` (add `smaller:2000000`, `filename:pdf`, `from:` etc. to narrow).

Take the **message id**, not the thread id. Note that `has:attachment` matches at *thread* level — some returned messages have no attachment of their own. Confirm with a `PLAIN_TEXT` fetch that an `attachments` array is actually present before spending a RAW call.

### 2. Fetch RAW

```
get_message  messageId=<id>  messageFormat=RAW
```

Expect this to come back as an error:

```
Error: result (60,156 characters) exceeds maximum allowed tokens.
Output has been saved to <session-dir>/tool-results/mcp-claude_ai_Gmail-get_message-<timestamp>.txt
```

**That is the success case, not a failure.** The base64 is now on disk and never entered context. Copy that path.

If the message is small enough not to overflow, the base64 lands in context instead — wasteful but harmless. To avoid it, run the fetch inside a subagent.

### 3. Decode and extract

The saved file is JSON: `{historyId, id, internalDate, labelIds, raw, sizeEstimate, threadId}`, where `raw` is the base64url-encoded MIME message. Run this in Bash — the bytes go disk-to-disk and never touch context:

```bash
python3 - <<'EOF'
import json, base64, email, os

src = "<PATH FROM THE ERROR MESSAGE>"
outdir = "attachments"          # change as needed

d = json.load(open(src))
raw = base64.urlsafe_b64decode(d["raw"] + "===")   # padding is safe to over-supply
msg = email.message_from_bytes(raw)

os.makedirs(outdir, exist_ok=True)
for part in msg.walk():
    fn = part.get_filename()
    if not fn:
        continue
    # drop inline logos/signature images; keep only real attachments
    if part.get_content_disposition() != "attachment":
        continue
    payload = part.get_payload(decode=True)
    if payload is None:
        continue
    path = os.path.join(outdir, fn)
    open(path, "wb").write(payload)
    print(f"saved {fn}  {len(payload)} bytes  ({part.get_content_type()})")
EOF
```

`get_payload(decode=True)` handles base64 and quoted-printable transparently, so binary files work the same as text. Confirmed on PDF: a 4 MB extract opened cleanly (`file` reports `PDF document, version 1.4, 1 page(s)`).

### 4. Verify before reporting success

Never claim the extraction worked off the "saved" line alone. Check the bytes are real:

```bash
file *; wc -l *.csv; head -3 <one-file>
```

Garbled output means the base64 padding or the part walk went wrong, not that the attachment is corrupt.

## Caveats

- **Verified to 5.5 MB.** RAW pulls the *entire* message, so the base64 runs ~1.33x message size. Confirmed end to end on a 5.5 MB message holding a 4 MB PDF — 7.4M characters spilled to disk, decoded in 0.2s. Gmail caps attachments at 25 MB, so most real messages are within reach; the hard ceiling above 5.5 MB is still untested.
- **The spill path is not predictable.** It must be read off the error message each run.
- Filtering on `Content-Disposition: attachment` (step 3) is what keeps embedded signature logos out of the output. Drop that check if you deliberately want inline images.
