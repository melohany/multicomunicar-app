import { useState } from "react";

export default function AdminDoubts({ doubts, workshops = [], onAnswer }) {
  const [filter, setFilter] = useState("all");
  const [replies, setReplies] = useState({});

  const filtered = doubts.filter((d) =>
    filter === "all"     ? true :
    filter === "pending" ? !d.answered : d.answered
  );

  const setReply = (id, text) =>
    setReplies((prev) => ({ ...prev, [id]: text }));

  const submitAnswer = (id) => {
    const r = replies[id];
    if (!r?.trim()) return;
    onAnswer(id, r);
    setReplies((prev) => { const n = { ...prev }; delete n[id]; return n; });
  };

  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 18, flexWrap: "wrap" }}>
        {[["all", "Todas"], ["pending", "Pendentes"], ["answered", "Respondidas"]].map(([v, l]) => (
          <button
            key={v}
            className={"ap-tab" + (filter === v ? " on" : "")}
            onClick={() => setFilter(v)}
          >
            {l}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="empty"><div className="eico">✅</div><p>Nenhuma dúvida aqui.</p></div>
      ) : (
        filtered.map((d) => {
          const ws = workshops.find((w) => w.id === d.workshopId);
          return (
            <div key={d.id} className="dc" style={{ marginBottom: 14 }}>
              <div className="dh">
                <div className="dav" style={{ background: "var(--teal-light)", color: "var(--teal-dark)" }}>
                  {d.userName[0]}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                    <strong style={{ fontSize: 14 }}>{d.userName}</strong>
                    {ws && (
                      <span style={{ background: "var(--teal-light)", color: "var(--teal-dark)", padding: "2px 9px", borderRadius: 20, fontSize: 11, fontWeight: 800 }}>
                        {ws.emoji} {ws.title}
                      </span>
                    )}
                    {d.answered
                      ? <span style={{ background: "#E8F5EC", color: "#2E7D45", padding: "2px 9px", borderRadius: 20, fontSize: 11, fontWeight: 800 }}>✓ Respondida</span>
                      : <span style={{ background: "#FFF3E0", color: "#D4810A", padding: "2px 9px", borderRadius: 20, fontSize: 11, fontWeight: 800 }}>⏳ Pendente</span>
                    }
                  </div>
                  <div className="dmeta">{d.date}</div>
                  <div className="dq">{d.question}</div>
                </div>
              </div>

              {d.answered ? (
                <div className="dans">
                  <div className="dansl">💙 Resposta da Carla</div>
                  <div className="danst">{d.answer}</div>
                </div>
              ) : (
                <div style={{ padding: "12px 18px", borderTop: "1.5px solid var(--border)" }}>
                  <div className="fg" style={{ marginBottom: 10 }}>
                    <label>Sua resposta</label>
                    <textarea
                      value={replies[d.id] || ""}
                      onChange={(e) => setReply(d.id, e.target.value)}
                      placeholder="Escreva sua resposta..."
                      style={{ minHeight: 80 }}
                    />
                  </div>
                  <button className="bt bt-sm" onClick={() => submitAnswer(d.id)}>
                    Responder 💙
                  </button>
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}
