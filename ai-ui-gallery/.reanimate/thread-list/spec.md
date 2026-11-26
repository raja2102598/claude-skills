Target: UIStacks "Conversation list" live preview (300x422 nav): groups, search, hover actions, rename, delete+Undo, new chat.
Destination: src/clones/thread-list (React 19, plain CSS keyframes).
Fidelity: motion-faithful (license unverified).
Rows (real-clock rAF probe of the reference): delete = opacity 1->0 ~190 ms ease-out then height collapse, total ~300 ms, rows below shift with it; new chat = height 0->33 + opacity 0->1 over ~220 ms ease-out, rows below pushed; hover actions fade in 120 ms; toast "Deleted . title  Undo" at the bottom of the list, 5 s.
