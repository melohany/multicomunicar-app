import { useState } from "react";

export default function ModBlock({ m }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="mod">
      <div className="mh" onClick={() => setOpen((o) => !o)}>
        <div className="mnum">{m.id}</div>
        <span className="mt-text">{m.title}</span>
        <span style={{ fontSize: 13, color: "var(--soft)", flexShrink: 0 }}>
          {open ? "▲" : "▼"}
        </span>
      </div>

      {open && (
        <div className="mb">
          {m.lessons.map((lesson, i) => (
            <div key={i} className="lr">
              <span className="ld" />
              {lesson}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
