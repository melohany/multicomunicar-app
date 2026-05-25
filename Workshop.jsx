import { useState } from "react";
import ModBlock from "../components/ModBlock";
import DoubtCard from "../components/DoubtCard";
import Flipbook from "../components/Flipbook";
import { resolveApostilaUrl } from "../data/content";

export default function Workshop({ ws, user, doubts, announcements, onAddDoubt }) {
  const [wsTab, setWsTab]       = useState("modules");
  const [selectedAp, setSelectedAp] = useState(0);
  const [newDoubt, setNewDoubt] = useState("");

  // Dados vindos diretamente do objeto workshop (dinâmico)
  const aps   = ws.apostilas ?? [];
  const vids  = ws.videos    ?? [];
  const links = ws.links     ?? [];
  const extras = ws.extras   ?? [];
  const ap    = aps[selectedAp];

  const wsAnnouncements = announcements.filter((a) => a.workshopId === ws.id);
  const myDoubts = doubts.filter((d) => d.userId === user.id && d.workshopId === ws.id);

  const tabs = [
    ["modules", "📖 Módulos"],
    ...(aps.length > 0    ? [["apostila", `📄 Apostila${aps.length > 1 ? "s" : ""}`]] : []),
    ...(vids.length > 0   ? [["videos",   "🎬 Vídeos"]]                                  : []),
    ...(links.length > 0  ? [["links",    "🔗 Links úteis"]]                              : []),
    ...(extras.length > 0 ? [["extras",   "📎 Extras"]]                                   : []),
    ["doubts", "💬 Dúvidas"],
  ];

  const submitDoubt = () => {
    if (!newDoubt.trim()) return;
    onAddDoubt(newDoubt, ws.id);
    setNewDoubt("");
  };

  return (
    <div>
      {/* Header */}
      <div
        style={{
          background: ws.coverUrl
            ? `linear-gradient(rgba(0,0,0,.42), rgba(0,0,0,.42)), url(${ws.coverUrl}) center/cover`
            : `linear-gradient(135deg,${ws.color}dd,${ws.color})`,
          borderRadius: "var(--r)",
          padding: "20px 24px",
          color: "white",
          marginBottom: 22,
          boxShadow: "0 4px 18px rgba(58,171,186,.3)",
        }}
      >
        <div style={{ fontFamily: "Montserrat,sans-serif", fontSize: 19, fontWeight: 800 }}>
          {ws.emoji} Workshop {ws.title}
        </div>
        <div style={{ fontSize: 13, opacity: .88, marginTop: 5 }}>
          Fga. Carla Augusto Corrêa · CRFa1-12390 · Multicomunicar
        </div>
        {ws.description && (
          <div style={{ fontSize: 13, opacity: .82, marginTop: 6, lineHeight: 1.5 }}>
            {ws.description}
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="tabs">
        {tabs.map(([t, l]) => (
          <button
            key={t}
            className={"tab" + (wsTab === t ? " on" : "")}
            onClick={() => setWsTab(t)}
          >
            {l}
          </button>
        ))}
      </div>

      {/* ── MÓDULOS ── */}
      {wsTab === "modules" && (
        <div>
          {wsAnnouncements.map((a) => (
            <div key={a.id} className="ann">
              <span style={{ fontSize: 18 }}>📣</span>
              <span className="ann-t">{a.text}</span>
            </div>
          ))}
          <div style={{ marginTop: wsAnnouncements.length > 0 ? 14 : 0 }}>
            {ws.modules.length === 0 ? (
              <div className="empty"><div className="eico">🔜</div><p>Conteúdo em breve!</p></div>
            ) : (
              ws.modules.map((m) => <ModBlock key={m.id} m={m} />)
            )}
          </div>
        </div>
      )}

      {/* ── APOSTILAS ── */}
      {wsTab === "apostila" && (
        <div>
          {aps.length > 1 && (
            <div className="ap-tabs">
              {aps.map((a, i) => (
                <button
                  key={a.id}
                  className={"ap-tab" + (selectedAp === i ? " on" : "")}
                  onClick={() => setSelectedAp(i)}
                >
                  📄 {a.title}
                </button>
              ))}
            </div>
          )}
          {ap && (
            <Flipbook
              key={ap.id}
              src={resolveApostilaUrl(ap)}
              title={ap.title}
              filename={ap.filename}
              author={ap.author}
            />
          )}
        </div>
      )}

      {/* ── VÍDEOS ── */}
      {wsTab === "videos" && (
        <div>
          {vids.length === 0 ? (
            <div className="empty"><div className="eico">🎬</div><p>Nenhum vídeo disponível ainda.</p></div>
          ) : (
            <div className="vgrid">
              {vids.map((v) => (
                <div key={v.id} className="vcard">
                  <div className="vthumb">▶️</div>
                  <div className="vinfo">
                    <div className="vtitle">{v.title}</div>
                    {v.duration && <div className="vdur">⏱ {v.duration}</div>}
                  </div>
                  {v.url && (
                    <a href={v.url} target="_blank" rel="noreferrer">
                      <button className="dbtn" style={{ marginLeft: "auto" }}>Assistir</button>
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── LINKS ── */}
      {wsTab === "links" && (
        <div>
          {links.map((l) => (
            <div key={l.id} className="link-row">
              <span style={{ fontSize: 26 }}>🔗</span>
              <div className="link-info">
                <div className="link-title">{l.title}</div>
                {l.description && <div className="link-desc">{l.description}</div>}
              </div>
              <a href={l.url} target="_blank" rel="noreferrer" style={{ textDecoration: "none" }}>
                <button className="dbtn">Abrir</button>
              </a>
            </div>
          ))}
        </div>
      )}

      {/* ── EXTRAS ── */}
      {wsTab === "extras" && (
        <div>
          {extras.map((e) => (
            <div key={e.id} className="link-row">
              <span style={{ fontSize: 26 }}>📎</span>
              <div className="link-info">
                <div className="link-title">{e.title}</div>
                {e.description && <div className="link-desc">{e.description}</div>}
              </div>
              <a href={e.url} target="_blank" rel="noreferrer" style={{ textDecoration: "none" }}>
                <button className="dbtn">Abrir</button>
              </a>
            </div>
          ))}
        </div>
      )}

      {/* ── DÚVIDAS ── */}
      {wsTab === "doubts" && (
        <div>
          <p className="stitle">Enviar uma dúvida</p>
          <div className="card" style={{ marginBottom: 22 }}>
            <div className="fg">
              <label>Sua pergunta</label>
              <textarea
                placeholder="Escreva sua dúvida sobre o workshop..."
                value={newDoubt}
                onChange={(e) => setNewDoubt(e.target.value)}
              />
            </div>
            <button className="bt bt-sm" onClick={submitDoubt}>Enviar dúvida 💙</button>
          </div>

          <p className="stitle">Histórico de dúvidas</p>
          {myDoubts.length === 0 ? (
            <div className="empty">
              <div className="eico">💬</div>
              <p>Nenhuma dúvida ainda. Envie sua primeira pergunta acima!</p>
            </div>
          ) : (
            myDoubts.map((d) => <DoubtCard key={d.id} d={d} />)
          )}
        </div>
      )}
    </div>
  );
}
