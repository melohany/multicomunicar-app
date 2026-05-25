export default function Announcements({ myWorkshops, announcements }) {
  const myWsIds = new Set(myWorkshops.map((w) => w.id));
  const visible = announcements.filter((a) => myWsIds.has(a.workshopId));

  if (visible.length === 0) {
    return (
      <div className="empty">
        <div className="eico">📢</div>
        <p>Nenhum aviso no momento.</p>
      </div>
    );
  }

  return (
    <div>
      {visible.map((a) => {
        const ws = myWorkshops.find((w) => w.id === a.workshopId);
        return (
          <div key={a.id} className="ann">
            <span style={{ fontSize: 20 }}>📣</span>
            <div>
              {ws && (
                <div
                  style={{
                    fontWeight: 800,
                    fontSize: 11,
                    color: "var(--teal-dark)",
                    marginBottom: 4,
                    textTransform: "uppercase",
                    letterSpacing: .5,
                  }}
                >
                  {ws.emoji} {ws.title}
                </div>
              )}
              <span className="ann-t">{a.text}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
