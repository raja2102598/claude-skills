export type Status = "connected" | "signin" | "error";
export interface Tool { name: string; kind: "Read" | "Write"; tokens: number; on: boolean }
export interface Server {
  id: string; name: string; status: Status; transport: "Remote" | "Local";
  icon: string; tools: Tool[];
}

const mk = (names: string[], enabled: number, total: number, kinds: ("Read" | "Write")[] = []): Tool[] =>
  names.map((n, i) => ({ name: n, kind: kinds[i] ?? (i % 3 === 2 ? "Write" : "Read"), tokens: Math.round(total / enabled / 10) * 10, on: i < enabled }));

export const SERVERS: Server[] = [
  { id: "forge", name: "Gitforge", status: "connected", transport: "Remote", icon: "git", tools: mk(["list_repos", "read_file", "search_code", "open_issue", "comment", "merge_pr"], 5, 2200) },
  { id: "track", name: "Trackline", status: "connected", transport: "Remote", icon: "layers", tools: mk(["find_tasks", "get_task", "create_task", "set_status", "assign"], 3, 1000) },
  { id: "pages", name: "Pagewise", status: "signin", transport: "Remote", icon: "book", tools: [] },
  { id: "chat", name: "Chatter", status: "connected", transport: "Remote", icon: "chat", tools: mk(["read_channel", "search_msgs", "post_message", "react"], 3, 1000) },
  { id: "watch", name: "Watchtower", status: "error", transport: "Remote", icon: "radar", tools: [] },
  { id: "ledger", name: "Ledgerly", status: "connected", transport: "Remote", icon: "card", tools: mk(["list_invoices", "get_customer", "refund", "create_charge"], 2, 610) },
  { id: "tables", name: "Tabledb", status: "connected", transport: "Local", icon: "db", tools: mk(["query", "describe", "explain"], 3, 730) },
  { id: "sketch", name: "Sketchpad", status: "connected", transport: "Local", icon: "pen", tools: mk(["get_frame", "export_png", "add_comment"], 2, 850) },
];

export const BUDGET = 8000;

/** the tools the Pagewise sign-in discovers */
export const DISCOVERED: Tool[] = [
  { name: "search", kind: "Read", tokens: 380, on: true },
  { name: "fetch", kind: "Read", tokens: 300, on: true },
  { name: "create_pages", kind: "Write", tokens: 520, on: false },
  { name: "update_page", kind: "Write", tokens: 460, on: false },
];

export const fmtTokens = (n: number) => (n >= 1000 ? (n / 1000).toFixed(1) + "k" : String(n));
