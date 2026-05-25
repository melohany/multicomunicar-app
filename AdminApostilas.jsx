import { useState } from "react";

// ATENÇÃO: Esta página foi substituída pelo editor de workshops (AdminWorkshops).
// Apostilas agora são gerenciadas diretamente dentro de cada workshop no painel admin.
// Este arquivo é mantido apenas como referência histórica.

export default function AdminApostilas({ apostilas = [], onAdd, onRemove, toast }) {
  const [wsId, setWsId] = useState(1);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("Fga. Carla Augusto Corrêa · CRFa1-12390");
  const [url, setUrl] = useState("");
  const [showTip, setShowTip] = useState(false);

  const reset = () => { setTitle(""); setUrl(""); };

  const submit = () => {
    if (!title.trim() || !url.trim()) {
      toast("Preencha o título e o link da apostila.");
      return;
    }
    if (!url.includes("drive.google.com") && !url.includes("dropbox.com") && !url.startsWith("https://")) {
      toast("Use um link válido (Google Drive, Dropbox ou https://).");
      return;
    }

    // Converte link de compartilhamento do Google Drive para link de incorporação
    let finalUrl = url.trim();
    const driveMatch = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
    if (driveMatch && !url.includes("/preview")) {
      finalUrl = `https://drive.google.com/file/d/${driveMatch[1]}/preview`;
    }

    onAdd({
      id: `ap-${Date.now()}`,
      workshopId: Number(wsId),
      title: title.trim(),
      filename: title.trim().toLowerCase().replace(/\s+/g, "-") + ".pdf",
      author: author.trim(),
      source: "url",
      url: finalUrl,
    });
    reset();
    toast("Apostila adicionada! 📄");
  };

  return (
    <div>
      {/* Formulário de nova apostila */}
      <div className="card" style={{ marginBottom: 22 }}>
        <p className="stitle">Adicionar nova apostila</p>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <div className="fg">
            <label>Workshop</label>
            <select value={wsId} onChange={(e) => setWsId(e.target.value)}>
              {[].map((w) => (
                <option key={w.id} value={w.id}>{w.emoji} {w.title}</option>
              ))}
            </select>
          </div>

          <div className="fg">
            <label>Título da apostila</label>
            <input
              placeholder="Ex: Apostila Módulo 3"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
        </div>

        <div className="fg">
          <label>Nome do autor</label>
          <input
            placeholder="Fga. Carla Augusto Corrêa · CRFa1-12390"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
          />
        </div>

        <div className="fg">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
            <label style={{ margin: 0 }}>Link do Google Drive (ou Dropbox)</label>
            <button
              onClick={() => setShowTip((v) => !v)}
              style={{ background: "none", border: "none", color: "var(--teal-dark)", fontSize: 12, cursor: "pointer", fontWeight: 700, fontFamily: "Nunito" }}
            >
              {showTip ? "Fechar dica ▲" : "Como obter o link? ▼"}
            </button>
          </div>

          {showTip && (
            <div style={{ background: "var(--teal-light)", border: "1.5px solid var(--teal)", borderRadius: "var(--rs)", padding: "12px 14px", marginBottom: 10, fontSize: 13, lineHeight: 1.7, color: "var(--text)" }}>
              <strong>Como pegar o link do Google Drive:</strong><br />
              1. Abra o PDF no Google Drive<br />
              2. Clique com o botão direito → <strong>Compartilhar</strong><br />
              3. Mude para <strong>"Qualquer pessoa com o link pode ver"</strong><br />
              4. Clique em <strong>Copiar link</strong> e cole aqui abaixo<br />
              <br />
              O sistema converte o link automaticamente para incorporação.
            </div>
          )}

          <input
            placeholder="https://drive.google.com/file/d/..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
        </div>

        <div className="row-gap">
          <button className="bt bt-sm" onClick={submit}>Adicionar apostila 📄</button>
          <button className="bt-out" onClick={reset}>Limpar</button>
        </div>
      </div>

      {/* Lista de apostilas adicionadas */}
      <hr className="dv" />
      <p className="stitle">Apostilas adicionadas pelo painel ({apostilas.length})</p>

      {apostilas.length === 0 ? (
        <div className="empty">
          <div className="eico">📄</div>
          <p>Nenhuma apostila adicionada ainda. Use o formulário acima.</p>
          <p style={{ fontSize: 12, marginTop: 6 }}>As apostilas do arquivo (incluídas no código) aparecem automaticamente no workshop.</p>
        </div>
      ) : (
        apostilas.map((ap) => {
          const ws = null; // (página legada — não mais em uso)
          return (
            <div key={ap.id} className="link-row" style={{ marginBottom: 10 }}>
              <span style={{ fontSize: 26 }}>📄</span>
              <div className="link-info">
                <div className="link-title">{ap.title}</div>
                <div className="link-desc">
                  {ws ? `${ws.emoji} ${ws.title}` : "Workshop"} · {ap.author}
                </div>
              </div>
              <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                <a href={ap.url} target="_blank" rel="noreferrer" style={{ textDecoration: "none" }}>
                  <button className="bt-out" style={{ padding: "7px 14px", fontSize: 13 }}>Ver</button>
                </a>
                <button
                  className="bt-rose"
                  style={{ padding: "7px 14px", fontSize: 13 }}
                  onClick={() => { onRemove(ap.id); toast("Apostila removida."); }}
                >
                  Remover
                </button>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
