export default function AdminHome({ students, doubts, workshops, go }) {
  const pending     = doubts.filter((d) => !d.answered);
  const activeWs    = workshops.filter((w) => w.status === "active");
  const totalAps    = workshops.reduce((sum, w) => sum + (w.apostilas?.length ?? 0), 0);

  return (
    <div>
      <div className="wb">
        <div className="bi">🌿</div>
        <div>
          <h2>Olá, Carla! Bem-vinda ao seu painel.</h2>
          <p>Gerencie alunas, workshops e dúvidas da Multicomunicar.</p>
        </div>
      </div>

      <div className="cgrid">
        <div className="sc" onClick={() => go("adm-s")}>
          <div style={{ fontSize: 28, marginBottom: 6 }}>👩‍🎓</div>
          <div className="snum">{students.length}</div>
          <div className="slb">Alunas cadastradas</div>
        </div>

        <div className="sc" onClick={() => go("adm-d")}>
          <div style={{ fontSize: 28, marginBottom: 6 }}>💬</div>
          <div className="snum">{pending.length}</div>
          <div className="slb">Dúvidas pendentes</div>
        </div>

        <div className="sc" onClick={() => go("adm-ws")}>
          <div style={{ fontSize: 28, marginBottom: 6 }}>📚</div>
          <div className="snum">{activeWs.length}</div>
          <div className="slb">Workshops ativos</div>
        </div>

        <div className="sc">
          <div style={{ fontSize: 28, marginBottom: 6 }}>📄</div>
          <div className="snum">{totalAps}</div>
          <div className="slb">Apostilas disponíveis</div>
        </div>
      </div>
    </div>
  );
}
