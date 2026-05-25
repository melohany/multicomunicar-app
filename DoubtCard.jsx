export default function DoubtCard({ d }) {
  return (
    <div className="dc">
      <div className="dh">
        <div className="dav">{d.userName[0]}</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: 14 }}>{d.userName}</div>
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
        <div className="dpend">⏳ Aguardando resposta da Carla…</div>
      )}
    </div>
  );
}
