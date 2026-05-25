import { useState } from "react";

export default function AdminAnnouncements({ announcements, workshops, onAdd, toast }) {
  const [wsId, setWsId] = useState(workshops[0]?.id ?? null);
  const [text, setText] = useState("");

  const submit = () => {
    if (!text.trim()) return;
    if (!wsId) { toast("Selecione um workshop primeiro."); return; }
    onAdd(wsId, text.trim());
    setText("");
    toast("Aviso publicado! 📢");
  };

  return (
    <div>
      <div className="card" style={{ marginBottom: 22 }}>
        <p className="stitle">Novo aviso</p>

        <div className="fg">
          <label>Workshop destinatário</label>
          {workshops.length === 0 ? (
            <div style={{ fontSize: 13, color: "var(--soft)", marginTop: 4 }}>
              Nenhum workshop cadastrado ainda.
            </div>
          ) : (
            <select value={wsId ?? ""} onChange={(e) => setWsId(Number(e.target.value))}>
              {workshops.map((w) => (
                <option key={w.id} value={w.id}>{w.emoji} {w.title}</option>
              ))}
            </select>
          )}
        </div>

        <div className="fg">
          <label>Mensagem</label>
          <textarea
            placeholder="Escreva o aviso aqui..."
            style={{ minHeight: 110 }}
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>

        <button className="bt bt-sm" onClick={submit} disabled={workshops.length === 0}>
          Publicar aviso 📢
        </button>
      </div>

      <hr className="dv" />
      <p className="stitle">Avisos publicados ({announcements.length})</p>

      {announcements.length === 0 ? (
        <div className="empty"><div className="eico">📢</div><p>Nenhum aviso publicado ainda.</p></div>
      ) : (
        [...announcements].reverse().map((a) => {
          const ws = workshops.find((w) => w.id === a.workshopId);
          return (
            <div key={a.id} className="ann">
              <span style={{ fontSize: 18 }}>📣</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 800, fontSize: 11, color: "var(--teal-dark)", marginBottom: 3, textTransform: "uppercase" }}>
                  {ws ? `${ws.emoji} ${ws.title}` : "Geral"} · {a.date}
                </div>
                <span className="ann-t">{a.text}</span>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
