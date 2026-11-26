# thread-list — candidate selection

Candidates reviewed (one screenshot each, plus hover, delete, undo, search, rename and new-chat probes on UIStacks):

1. **assistant-ui "Thread list"** (https://www.assistant-ui.com/elements/thread-list). It loaded. It is a plain list with a New Thread button, a search box and Today/Yesterday groups, with Loading, Empty, Untitled and Long list variants. It has no visible row actions in the preview, and it is the simplest of the set.
2. **assistant-ui "Thread list sidebar"** (https://www.assistant-ui.com/elements/thread-list-sidebar). It loaded. It is the same list placed in a sidebar shell next to a chat, so it is mostly the chat shell. This is covered by `chat-thread`.
3. **Kobra "Chat History"** (https://kobra.systems/components/chat-history). It loaded, with a paywall for the code. It is a history button in the composer that gathers questions, which is a different pattern. Preview-only and paid.
4. **UIStacks "Conversation list"** (https://uistacks.dev/components/conversation-list). It loaded (the paid code is hidden, but the preview is live and interactive). **Winner.**
   - Groups: Pinned, Today, Yesterday, Previous 7 days.
   - A model mark on every row.
   - Search that filters as you type, with an empty state.
   - Hover actions: pin, rename, delete.
   - Inline rename.
   - New chat row that grows in.
   - Delete that fades, collapses and offers Undo.
   - It is the most complete of the set and the best polished, and it reads clearly as an AI chat-history pattern.
5. **assistant-ui "Thread search"** (https://www.assistant-ui.com/elements/thread-search). It loaded. **Runner-up.**
   - Pinned, Today, Yesterday and Earlier groups.
   - A preview line under each title.
   - A filtered state, a no-matches state, a read-only state and a long-titles state.
   - A search box.
   - No rename or delete in the preview.
6. **assistant-ui "Search in conversation"** (https://www.assistant-ui.com/elements/conversation-search). Captured but not reviewed in depth: it searches inside one conversation, not the history list.
7. **assistant-ui "Conversation map"** (https://www.assistant-ui.com/elements/conversation-map). Not captured. It is a minimap of one conversation rather than a history list.

None failed to load. UIStacks hit a networkidle timeout once in a probe, and `domcontentloaded` with a wait fixed it.

**Why UIStacks:** it is the only candidate that covers the whole concept (new thread, select, rename and delete with Undo, search with groups). License played no part in the choice; because UIStacks is paid, the clone is motion-faithful with original styling.
