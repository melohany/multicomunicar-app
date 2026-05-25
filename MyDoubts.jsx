import { useState } from "react";
import DoubtCard from "../components/DoubtCard";

export default function MyDoubts({ user, myWorkshops, doubts, onAddDoubt }) {
  const [newDoubt, setNewDoubt] = useState("");
  const [newDoubtWsId, setNewDoubtWsId] = useState(myWorkshops[0]?.id ?? 1);

  const myDoubts = doubts.filter((d) => d.userId === user.id);

  const submit = () => {
    if (!newDoubt.trim()) return;
    onAddDoubt(newDoubt, newDoubtWsId);
    setNewDoubt("");
  };

  return (
    <div>
      <div className="card" style={{ marginBottom: 22 }}>
        <p className="stitle">Nova dúvida</p>

        {myWorkshops.length > 1 && (
          <div className="fg">
            <label>Workshop</label>
            <select
              value={newDoubtWsId}
              onChange={(e) => setNewDoubtWsId(Number(e.target.value))}
            >
              {myWorkshops.map((w) => (
                <option key={w.id} value={w.id}>{w.emoji} {w.title}</option>
              ))}
            </select>
          </div>
        )}

        <div className="fg">
          <label>Sua pergunta</label>
          <textarea
            placeholder="Escreva sua dúvida..."
            value={newDoubt}
            onChange={(e) => setNewDoubt(e.target.value)}
          />
        </div>

        <button className="bt bt-sm" onClick={submit}>Enviar 💙</button>
      </div>

      <p className="stitle">Histórico</p>
      {myDoubts.length === 0 ? (
        <div className="empty">
          <div className="eico">💬</div>
          <p>Nenhuma dúvida ainda.</p>
        </div>
      ) : (
        myDoubts.map((d) => <DoubtCard key={d.id} d={d} />)
      )}
    </div>
  );
}
