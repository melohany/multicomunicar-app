export default function StudentHome({ user, myWorkshops, go, setSelectedWsId }) {
  const goWorkshop = (wsId) => {
    setSelectedWsId(wsId);
    go("ws");
  };

  return (
    <div>
      <div className="wb">
        <div className="bi">👋</div>
        <div>
          <h2>Olá, {user.name.split(" ")[0]}! Bem-vinda de volta.</h2>
          <p>Acesse seus workshops abaixo e continue sua jornada na CAA. 💙</p>
        </div>
      </div>

      <p className="stitle">
        {myWorkshops.length === 1 ? "Seu Workshop" : "Seus Workshops"}
      </p>

      {myWorkshops.length === 0 ? (
        <div className="empty">
          <div className="eico">📭</div>
          <p>Nenhum workshop disponível ainda. Entre em contato com a Carla.</p>
        </div>
      ) : (
        <div className="cgrid">
          {myWorkshops.map((w) => {
            const aps  = w.apostilas?.length ?? 0;
            const vids = w.videos?.length    ?? 0;
            const mods = w.modules?.length   ?? 0;
            return (
              <div
                key={w.id}
                className="wsc"
                onClick={() => goWorkshop(w.id)}
                style={{ borderTop: `4px solid ${w.color}` }}
              >
                <div
                  className="wsc-top"
                  style={{
                    background: w.coverUrl
                      ? `linear-gradient(rgba(0,0,0,.4), rgba(0,0,0,.4)), url(${w.coverUrl}) center/cover`
                      : `linear-gradient(135deg,${w.color}dd,${w.color})`,
                  }}
                >
                  <div className="wsc-title">{w.emoji} {w.title}</div>
                  <div className="wsc-desc">{w.description}</div>
                </div>
                <div className="wsc-bot">
                  <span className="badge-teal">✓ Liberado</span>
                  <span style={{ fontSize: 12, color: "var(--soft)", fontWeight: 600 }}>
                    {mods} módulo{mods !== 1 ? "s" : ""}
                    {aps > 0  ? ` · ${aps} apostila${aps !== 1 ? "s" : ""}`    : ""}
                    {vids > 0 ? ` · ${vids} vídeo${vids !== 1 ? "s" : ""}` : ""}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
