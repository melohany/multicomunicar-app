import logo from "../assets/logo.png";

export default function Sidebar({ user, page, go, myWorkshops, selectedWsId, setSelectedWsId, pendingCount, sbOpen, setSbOpen, logout }) {
  const isOn = (p) => page === p ? " on" : "";

  const goWorkshop = (wsId) => {
    setSelectedWsId(wsId);
    go("ws");
  };

  return (
    <>
      {sbOpen && (
        <div
          className="ov open"
          onClick={() => setSbOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside className={"sb" + (sbOpen ? " open" : "")}>
        <div className="sb-logo">
          <img src={logo} alt="Multicomunicar" />
          <div className="sb-tag">Área Exclusiva de Membros</div>
        </div>

        <nav className="sb-nav">
          {user.role === "student" && (
            <>
              <button className={"ni" + isOn("home")} onClick={() => go("home")}>
                <span className="ico">🏠</span> Início
              </button>

              {myWorkshops.map((w) => (
                <button
                  key={w.id}
                  className={"ni" + (page === "ws" && selectedWsId === w.id ? " on" : "")}
                  onClick={() => goWorkshop(w.id)}
                >
                  <span className="ico">{w.emoji}</span> {w.title}
                </button>
              ))}

              <button className={"ni" + isOn("doubts")} onClick={() => go("doubts")}>
                <span className="ico">💬</span> Minhas Dúvidas
              </button>

              <button className={"ni" + isOn("ann")} onClick={() => go("ann")}>
                <span className="ico">📢</span> Avisos
              </button>
            </>
          )}

          {user.role === "admin" && (
            <>
              <div className="sb-section">Painel</div>
              <button className={"ni" + isOn("home")} onClick={() => go("home")}>
                <span className="ico">📊</span> Visão geral
              </button>

              <div className="sb-section">Conteúdo</div>
              <button className={"ni" + isOn("adm-ws")} onClick={() => go("adm-ws")}>
                <span className="ico">📚</span> Workshops
              </button>

              <div className="sb-section">Gestão</div>
              <button className={"ni" + isOn("adm-s")} onClick={() => go("adm-s")}>
                <span className="ico">👩‍🎓</span> Alunas
              </button>

              <button className={"ni" + isOn("adm-d")} onClick={() => go("adm-d")}>
                <span className="ico">💬</span> Dúvidas
                {pendingCount > 0 && (
                  <span className="badge-pill">{pendingCount}</span>
                )}
              </button>

              <button className={"ni" + isOn("adm-a")} onClick={() => go("adm-a")}>
                <span className="ico">📢</span> Avisos
              </button>
            </>
          )}
        </nav>

        <div className="sb-ft">
          <div className="uchip">
            <div className="uav">{user.name?.[0]}</div>
            <div>
              <div className="uname">{user.name.split(" ").slice(0, 2).join(" ")}</div>
              <div className="urole">{user.role === "admin" ? "Administradora" : "Aluna"}</div>
            </div>
          </div>
          <button className="outbtn" onClick={logout}>Sair da conta</button>
        </div>
      </aside>
    </>
  );
}
