import { createRoot } from "react-dom/client";
import "./index.css";

// No StrictMode: its double-mounted effects would start every animation twice and skew captures.
const root = createRoot(document.getElementById("root")!);
const match = location.pathname.match(/^\/c\/([\w-]+)\/?$/);

if (match) {
  import("./gallery/Stage").then(({ Stage }) => root.render(<Stage slug={match[1]} />));
} else {
  import("./gallery/Gallery").then(({ Gallery }) => root.render(<Gallery />));
}
