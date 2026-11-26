import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Hexagon, MessageSquarePlus, Orbit, Pencil, Pin, PinOff, Search, Sparkle, Trash2, Triangle, X } from "lucide-react";
import clsx from "clsx";
import "./thread-list.css";

type ModelId = "nova" | "atlas" | "orbit" | "kite";
type Group = "Pinned" | "Today" | "Yesterday" | "Previous 7 days";
interface Chat { id: string; title: string; model: ModelId; group: Group; pinned?: boolean }

const GROUPS: Group[] = ["Pinned", "Today", "Yesterday", "Previous 7 days"];
const MODEL_NAME: Record<ModelId, string> = { nova: "Nova", atlas: "Atlas", orbit: "Orbit", kite: "Kite" };
const MARKS: Record<ModelId, { Icon: typeof Sparkle; color: string }> = {
  nova: { Icon: Sparkle, color: "#c2623d" },
  atlas: { Icon: Hexagon, color: "#26231f" },
  orbit: { Icon: Orbit, color: "#2f7f78" },
  kite: { Icon: Triangle, color: "#3d63c2" },
};

const SEED: Chat[] = [
  { id: "c1", title: "Harvest menu board copy", model: "nova", group: "Pinned", pinned: true },
  { id: "c2", title: "Q4 studio budget", model: "atlas", group: "Pinned", pinned: true },
  { id: "c3", title: "Walnut desk quote vs reorder sheet", model: "nova", group: "Today" },
  { id: "c4", title: "Harbor Street opening checklist", model: "kite", group: "Today" },
  { id: "c5", title: "Rewrite the launch post", model: "atlas", group: "Yesterday" },
  { id: "c6", title: "Compare oat milk suppliers", model: "orbit", group: "Yesterday" },
  { id: "c7", title: "Handoff notes for the menu board", model: "nova", group: "Previous 7 days" },
  { id: "c8", title: "Why was the payout lower?", model: "kite", group: "Previous 7 days" },
  { id: "c9", title: "Rota for December", model: "atlas", group: "Previous 7 days" },
];

const autoplayEnabled = () => {
  try { return new URLSearchParams(window.location.search).get("autoplay") !== "0"; } catch { return true; }
};

export default function ThreadList() {
  const [chats, setChats] = useState<Chat[]>(SEED);
  const [selected, setSelected] = useState("c3");
  const [query, setQuery] = useState("");
  const [renaming, setRenaming] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [removing, setRemoving] = useState<string | null>(null);
  const [fresh, setFresh] = useState<string | null>(null);
  const [toast, setToast] = useState<{ chat: Chat; index: number; out?: boolean } | null>(null);
  const [hot, setHot] = useState<string | null>(null);
  const toastTimer = useRef<number>(0);
  const idN = useRef(100);
  const listRef = useRef<HTMLDivElement>(null);

  const q = query.trim().toLowerCase();
  const groups = useMemo(
    () => GROUPS.map((g) => ({ g, items: chats.filter((c) => c.group === g && (!q || c.title.toLowerCase().includes(q))) })).filter((x) => x.items.length),
    [chats, q],
  );

  const chatsRef = useRef(chats);
  chatsRef.current = chats;

  const dismissToast = useCallback(() => {
    window.clearTimeout(toastTimer.current);
    setToast((t) => (t ? { ...t, out: true } : t));
    toastTimer.current = window.setTimeout(() => setToast(null), 230);
  }, []);

  /* the toast appears with the fade, the collapse starts 85 ms in and the row leaves the list at 310 ms */
  const del = useCallback((id: string) => {
    const index = chatsRef.current.findIndex((c) => c.id === id);
    if (index < 0) return;
    const chat = chatsRef.current[index];
    setRemoving(id);
    setToast({ chat, index });
    window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(dismissToast, 5000);
    window.setTimeout(() => {
      setChats((cs) => cs.filter((c) => c.id !== id));
      setRemoving(null);
    }, 310);
  }, [dismissToast]);

  const undo = useCallback(() => {
    if (!toast || toast.out) return;
    const { chat, index } = toast;
    setChats((cs) => {
      if (cs.some((c) => c.id === chat.id)) return cs;
      const n = cs.slice(); n.splice(Math.min(index, n.length), 0, chat); return n;
    });
    setFresh(chat.id);
    dismissToast();
  }, [toast, dismissToast]);

  const newChat = useCallback(() => {
    const id = `n${idN.current++}`;
    setQuery("");
    setChats((cs) => {
      const i = cs.findIndex((c) => c.group === "Today");
      const n = cs.slice();
      n.splice(i < 0 ? n.length : i, 0, { id, title: "New chat", model: "nova", group: "Today" });
      return n;
    });
    setFresh(id); setSelected(id);
    if (listRef.current) listRef.current.scrollTop = 0;
  }, []);

  const togglePin = (id: string) =>
    setChats((cs) => cs.map((c) => c.id !== id ? c : c.pinned ? { ...c, pinned: false, group: "Today" } : { ...c, pinned: true, group: "Pinned" }));

  const startRename = (c: Chat) => { setRenaming(c.id); setDraft(c.title); };
  const commitRename = () => {
    if (!renaming) return;
    const t = draft.trim();
    if (t) setChats((cs) => cs.map((c) => (c.id === renaming ? { ...c, title: t } : c)));
    setRenaming(null);
  };

  const onListKey = (e: React.KeyboardEvent) => {
    if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
    const rows = Array.from(listRef.current?.querySelectorAll<HTMLElement>("[data-chat-row]") ?? []);
    const i = rows.indexOf(document.activeElement as HTMLElement);
    if (i < 0) return;
    e.preventDefault();
    rows[Math.max(0, Math.min(rows.length - 1, i + (e.key === "ArrowDown" ? 1 : -1)))]?.focus();
  };

  const undoRef = useRef(undo);
  undoRef.current = undo;

  /* gallery autoplay: hover row, delete it, undo, new chat, search, clear */
  useEffect(() => {
    if (!autoplayEnabled()) return;
    const T: number[] = [];
    const at = (ms: number, fn: () => void) => T.push(window.setTimeout(fn, ms));
    at(700, () => setHot("c4"));
    at(1100, () => { setHot(null); del("c4"); });
    at(2700, () => undoRef.current());
    at(3300, () => newChat());
    at(4300, () => setQuery("o"));
    at(4450, () => setQuery("oa"));
    at(4600, () => setQuery("oat"));
    at(5600, () => setQuery(""));
    return () => T.forEach(window.clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="tl-root">
      <nav className="tl-nav" aria-label="Chats">
        <div className="tl-head">
          <h3>Chats</h3>
          <button type="button" className="tl-new" onClick={newChat}><MessageSquarePlus size={16} strokeWidth={1.5} />New chat</button>
        </div>
        <div className="tl-search-wrap">
          <div className="tl-search">
            <Search size={16} strokeWidth={1.5} aria-hidden />
            <input type="search" aria-label="Search chats" placeholder="Search chats" value={query} onChange={(e) => setQuery(e.target.value)} />
            {query && <button type="button" className="tl-clear" aria-label="Clear search" onClick={() => setQuery("")}><X size={14} /></button>}
          </div>
        </div>
        <div className="tl-list" ref={listRef} onKeyDown={onListKey}>
          {groups.length === 0 && <div className="tl-empty">No chats match “{query}”</div>}
          {groups.map(({ g, items }) => (
            <div className="tl-group" role="group" aria-label={g} key={g}>
              <h4>{g}</h4>
              <ul>
                {items.map((c) => {
                  const { Icon, color } = MARKS[c.model];
                  const isR = renaming === c.id;
                  return (
                    <li key={c.id} className={clsx("tl-item", fresh === c.id && "tl-in", removing === c.id && "tl-out")} onAnimationEnd={() => fresh === c.id && setFresh(null)}>
                      <div className={clsx("tl-row", selected === c.id && "tl-sel", hot === c.id && "tl-hot")}>
                        {isR ? (
                          <>
                            <span className="tl-mark tl-rowmark-r" style={{ color }}><Icon size={18} fill="currentColor" strokeWidth={1.5} /></span>
                            <input className="tl-rename" autoFocus value={draft} aria-label="Rename chat" onFocus={(e) => e.currentTarget.select()}
                              onChange={(e) => setDraft(e.target.value)} onBlur={commitRename}
                              onKeyDown={(e) => { if (e.key === "Enter") commitRename(); if (e.key === "Escape") setRenaming(null); }} />
                          </>
                        ) : (
                          <>
                            <button type="button" data-chat-row className="tl-main" aria-current={selected === c.id ? "page" : undefined} onClick={() => setSelected(c.id)}>
                              <span className="tl-mark" style={{ color }}><Icon size={18} fill="currentColor" strokeWidth={1.5} /></span>
                              <span className="tl-title">{c.title}<span style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0 0 0 0)" }}>, {MODEL_NAME[c.model]}</span></span>
                            </button>
                            <div className="tl-acts">
                              <button type="button" className="tl-act" title={c.pinned ? "Unpin" : "Pin"} aria-label={`${c.pinned ? "Unpin" : "Pin"} ${c.title}`} onClick={() => togglePin(c.id)}>{c.pinned ? <PinOff size={16} strokeWidth={1.5} /> : <Pin size={16} strokeWidth={1.5} />}</button>
                              <button type="button" className="tl-act" title="Rename" aria-label={`Rename ${c.title}`} onClick={() => startRename(c)}><Pencil size={16} strokeWidth={1.5} /></button>
                              <button type="button" className="tl-act" title="Delete" aria-label={`Delete ${c.title}`} onClick={() => del(c.id)}><Trash2 size={16} strokeWidth={1.5} /></button>
                            </div>
                          </>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
        {toast && (
          <div className={clsx("tl-toast", toast.out && "tl-toast-out")} role="status">
            <span>Deleted <b>· {toast.chat.title}</b></span>
            <button type="button" className="tl-undo" onClick={undo}>Undo</button>
          </div>
        )}
      </nav>
    </div>
  );
}
