import { useState } from "react";
import { normalizeGDriveUrl } from "../../data/content";

const PALETTE = ["#3AABBA","#2A8A97","#8B7CA8","#5C9E6E","#D4810A","#4A7CB5","#E8948A","#C0392B","#8B6914","#2C3E50"];

const uid = () => `id-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

const EMPTY_WORKSHOP = {
  title: "", emoji: "📚", description: "", color: "#3AABBA",
  coverUrl: "", status: "active", modules: [],
  apostilas: [], videos: [], links: [], extras: [],
};

// ── Seção reutilizável ────────────────────────────────────────────────────────
function Section({ title, children }) {
  return (
    <div className="card" style={{ marginBottom: 16 }}>
      <p className="stitle" style={{ marginBottom: 14 }}>{title}</p>
      {children}
    </div>
  );
}

// ── Linha de item (apostila, vídeo, link, extra) ──────────────────────────────
function ItemRow({ icon, primary, secondary, badge, onRemove, href }) {
  return (
    <div className="link-row" style={{ marginBottom: 8 }}>
      <span style={{ fontSize: 22, flexShrink: 0 }}>{icon}</span>
      <div className="link-info">
        <div className="link-title" style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {primary}
          {badge && <span style={{ fontSize: 10, fontWeight: 800, background: "var(--teal-light)", color: "var(--teal-dark)", padding: "1px 7px", borderRadius: 20 }}>{badge}</span>}
        </div>
        {secondary && <div className="link-desc">{secondary}</div>}
      </div>
      <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
        {href && (
          <a href={href} target="_blank" rel="noreferrer" className="bt-out" style={{ padding: "5px 10px", fontSize: 12, textDecoration: "none" }}>Ver</a>
        )}
        <button className="bt-rose" style={{ padding: "5px 10px", fontSize: 12 }} onClick={onRemove}>Remover</button>
      </div>
    </div>
  );
}

// ── Formulário de adição genérico ─────────────────────────────────────────────
function AddForm({ fields, onAdd, addLabel = "+ Adicionar" }) {
  const init = Object.fromEntries(fields.map((f) => [f.key, ""]));
  const [vals, setVals] = useState(init);
  const set = (k, v) => setVals((p) => ({ ...p, [k]: v }));

  const handleAdd = () => {
    const required = fields.filter((f) => f.required);
    if (required.some((f) => !vals[f.key].trim())) return;
    onAdd(vals);
    setVals(init);
  };

  return (
    <div style={{ background: "var(--cream)", borderRadius: "var(--rs)", padding: "14px 16px", marginTop: 10, border: "1.5px dashed var(--border)" }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 10, marginBottom: 10 }}>
        {fields.map((f) => (
          <div key={f.key} className="fg" style={{ marginBottom: 0 }}>
            <label>{f.label}{f.required ? " *" : ""}</label>
            {f.type === "textarea" ? (
              <textarea style={{ minHeight: 60 }} placeholder={f.placeholder} value={vals[f.key]} onChange={(e) => set(f.key, e.target.value)} />
            ) : (
              <input type={f.type || "text"} placeholder={f.placeholder} value={vals[f.key]} onChange={(e) => set(f.key, e.target.value)} />
            )}
          </div>
        ))}
      </div>
      <button className="bt bt-sm" onClick={handleAdd}>{addLabel}</button>
    </div>
  );
}

// ── Componente principal ───────────────────────────────────────────────────────
export default function WorkshopEditor({ workshop, onSave, onCancel }) {
  const isNew = !workshop;
  const [tab, setTab] = useState("geral");
  const [form, setForm] = useState(() => workshop ? { ...workshop } : { id: Date.now(), ...EMPTY_WORKSHOP });
  const [showColorPicker, setShowColorPicker] = useState(false);

  const setField = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  // ── Módulos ────────────────────────────────────────────────────────────────
  const addModule = () => setField("modules", [
    ...form.modules,
    { id: uid(), title: `Módulo ${form.modules.length + 1}: `, lessons: [] },
  ]);

  const setModuleTitle = (id, title) =>
    setField("modules", form.modules.map((m) => m.id === id ? { ...m, title } : m));

  const removeModule = (id) =>
    setField("modules", form.modules.filter((m) => m.id !== id));

  const addLesson = (mId) =>
    setField("modules", form.modules.map((m) => m.id === mId ? { ...m, lessons: [...m.lessons, ""] } : m));

  const setLesson = (mId, idx, val) =>
    setField("modules", form.modules.map((m) =>
      m.id === mId ? { ...m, lessons: m.lessons.map((l, i) => i === idx ? val : l) } : m
    ));

  const removeLesson = (mId, idx) =>
    setField("modules", form.modules.map((m) =>
      m.id === mId ? { ...m, lessons: m.lessons.filter((_, i) => i !== idx) } : m
    ));

  // ── Apostilas ──────────────────────────────────────────────────────────────
  const addApostila = (v) => {
    if (!v.title.trim() || !v.url.trim()) return;
    setField("apostilas", [...form.apostilas, {
      id: uid(), title: v.title.trim(),
      filename: v.title.trim().toLowerCase().replace(/\s+/g, "-") + ".pdf",
      author: v.author.trim() || "Fga. Carla Augusto Corrêa · CRFa1-12390",
      url: normalizeGDriveUrl(v.url.trim()),
      builtIn: false,
    }]);
  };
  const removeApostila = (id) => setField("apostilas", form.apostilas.filter((a) => a.id !== id));

  // ── Vídeos ─────────────────────────────────────────────────────────────────
  const addVideo = (v) => {
    if (!v.title.trim() || !v.url.trim()) return;
    let url = v.url.trim();
    const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    if (ytMatch) url = `https://www.youtube.com/embed/${ytMatch[1]}`;
    setField("videos", [...form.videos, { id: uid(), title: v.title.trim(), url, duration: v.duration.trim() }]);
  };
  const removeVideo = (id) => setField("videos", form.videos.filter((v) => v.id !== id));

  // ── Links ──────────────────────────────────────────────────────────────────
  const addLink = (v) => {
    if (!v.title.trim() || !v.url.trim()) return;
    setField("links", [...form.links, { id: uid(), title: v.title.trim(), url: v.url.trim(), description: v.description.trim() }]);
  };
  const removeLink = (id) => setField("links", form.links.filter((l) => l.id !== id));

  // ── Extras ─────────────────────────────────────────────────────────────────
  const addExtra = (v) => {
    if (!v.title.trim() || !v.url.trim()) return;
    setField("extras", [...form.extras, { id: uid(), title: v.title.trim(), url: v.url.trim(), description: v.description.trim(), type: "link" }]);
  };
  const removeExtra = (id) => setField("extras", form.extras.filter((e) => e.id !== id));

  // ── Salvar ─────────────────────────────────────────────────────────────────
  const handleSave = () => {
    if (!form.title.trim()) { alert("O título do workshop é obrigatório."); return; }
    onSave({ ...form, createdAt: form.createdAt ?? new Date().toLocaleDateString("pt-BR") });
  };

  const TABS = [
    ["geral",     "⚙️ Geral"],
    ["modulos",   "📖 Módulos"],
    ["apostilas", "📄 Apostilas"],
    ["videos",    "🎬 Vídeos"],
    ["links",     "🔗 Links"],
    ["extras",    "📎 Extras"],
  ];

  return (
    <div>
      {/* Cabeçalho */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
        <button className="bkbtn" onClick={onCancel}>← Voltar</button>
        <div style={{ flex: 1 }}>
          <div className="stitle" style={{ margin: 0 }}>
            {isNew ? "Criar novo workshop" : `Editando: ${form.title || "sem título"}`}
          </div>
        </div>
        <button className="bt bt-sm" onClick={handleSave}>Salvar workshop ✅</button>
      </div>

      {/* Abas */}
      <div className="tabs" style={{ marginBottom: 20 }}>
        {TABS.map(([t, l]) => (
          <button key={t} className={`tab${tab === t ? " on" : ""}`} onClick={() => setTab(t)}>{l}</button>
        ))}
      </div>

      {/* ── ABA: GERAL ── */}
      {tab === "geral" && (
        <div>
          {/* Preview */}
          <div style={{
            background: form.coverUrl
              ? `linear-gradient(rgba(0,0,0,.45), rgba(0,0,0,.45)), url(${form.coverUrl}) center/cover`
              : `linear-gradient(135deg, ${form.color}dd, ${form.color})`,
            borderRadius: "var(--r)", padding: "22px 24px", color: "white",
            marginBottom: 20, boxShadow: "0 4px 18px rgba(0,0,0,.2)",
          }}>
            <div style={{ fontSize: 36, marginBottom: 8 }}>{form.emoji || "📚"}</div>
            <div style={{ fontFamily: "Montserrat,sans-serif", fontSize: 18, fontWeight: 800 }}>{form.title || "Título do workshop"}</div>
            <div style={{ fontSize: 13, opacity: .85, marginTop: 6, lineHeight: 1.5 }}>{form.description || "Descrição do workshop…"}</div>
          </div>

          <Section title="Informações básicas">
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div className="fg" style={{ gridColumn: "1 / -1" }}>
                <label>Título do workshop *</label>
                <input placeholder="Ex: Modelagem de CAA" value={form.title} onChange={(e) => setField("title", e.target.value)} />
              </div>
              <div className="fg">
                <label>Emoji do workshop</label>
                <input placeholder="📚" maxLength={4} value={form.emoji} onChange={(e) => setField("emoji", e.target.value)} style={{ fontSize: 22 }} />
              </div>
              <div className="fg">
                <label>Status</label>
                <select value={form.status} onChange={(e) => setField("status", e.target.value)}>
                  <option value="active">✅ Ativo — visível para alunas</option>
                  <option value="draft">📝 Rascunho — oculto</option>
                </select>
              </div>
            </div>

            <div className="fg">
              <label>Descrição</label>
              <textarea
                placeholder="Descreva o workshop em uma ou duas frases..."
                style={{ minHeight: 80 }}
                value={form.description}
                onChange={(e) => setField("description", e.target.value)}
              />
            </div>

            {/* Cor */}
            <div className="fg">
              <label>Cor do workshop</label>
              <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap", marginTop: 4 }}>
                {PALETTE.map((c) => (
                  <button
                    key={c}
                    onClick={() => setField("color", c)}
                    style={{
                      width: 30, height: 30, borderRadius: "50%", background: c, border: "none",
                      cursor: "pointer", outline: form.color === c ? `3px solid ${c}` : "none",
                      outlineOffset: 2, boxShadow: form.color === c ? `0 0 0 2px white, 0 0 0 4px ${c}` : "none",
                      transition: "all .15s",
                    }}
                    title={c}
                  />
                ))}
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <input
                    type="color"
                    value={form.color}
                    onChange={(e) => setField("color", e.target.value)}
                    style={{ width: 30, height: 30, border: "none", borderRadius: "50%", cursor: "pointer", padding: 0, background: "none" }}
                    title="Cor personalizada"
                  />
                  <span style={{ fontSize: 12, color: "var(--soft)", fontWeight: 700 }}>{form.color}</span>
                </div>
              </div>
            </div>

            {/* Capa */}
            <div className="fg" style={{ marginBottom: 0 }}>
              <label>Imagem de capa (opcional — URL)</label>
              <input
                placeholder="https://... (Google Drive, Imgur, etc.)"
                value={form.coverUrl}
                onChange={(e) => setField("coverUrl", e.target.value)}
              />
              <div style={{ fontSize: 11, color: "var(--soft)", marginTop: 4 }}>
                Cole uma URL de imagem. Sugestão: faça upload no <a href="https://imgur.com" target="_blank" rel="noreferrer" style={{ color: "var(--teal-dark)" }}>Imgur</a> ou compartilhe pelo Google Drive e use o link direto.
              </div>
            </div>
          </Section>
        </div>
      )}

      {/* ── ABA: MÓDULOS ── */}
      {tab === "modulos" && (
        <div>
          {form.modules.length === 0 && (
            <div className="empty" style={{ padding: "30px 20px" }}>
              <div className="eico">📖</div>
              <p>Nenhum módulo ainda. Clique em "Adicionar módulo" para começar.</p>
            </div>
          )}

          {form.modules.map((mod, mIdx) => (
            <div key={mod.id} className="card" style={{ marginBottom: 14 }}>
              {/* Cabeçalho do módulo */}
              <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 12 }}>
                <div className="mnum" style={{ flexShrink: 0 }}>{mIdx + 1}</div>
                <input
                  style={{ flex: 1, padding: "9px 14px", border: "2px solid var(--border)", borderRadius: "var(--rs)", fontFamily: "Nunito", fontSize: 14, fontWeight: 700, outline: "none" }}
                  placeholder="Título do módulo..."
                  value={mod.title}
                  onChange={(e) => setModuleTitle(mod.id, e.target.value)}
                  onFocus={(e) => e.target.style.borderColor = "var(--teal)"}
                  onBlur={(e) => e.target.style.borderColor = "var(--border)"}
                />
                <button className="bt-rose" style={{ padding: "7px 12px", fontSize: 13, flexShrink: 0 }} onClick={() => removeModule(mod.id)}>
                  Excluir módulo
                </button>
              </div>

              {/* Lista de aulas */}
              <div style={{ paddingLeft: 38 }}>
                {mod.lessons.map((lesson, lIdx) => (
                  <div key={lIdx} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 7 }}>
                    <span className="ld" style={{ flexShrink: 0, marginTop: 0 }} />
                    <input
                      style={{ flex: 1, padding: "7px 12px", border: "1.5px solid var(--border)", borderRadius: 8, fontFamily: "Nunito", fontSize: 13, outline: "none", background: "var(--cream)" }}
                      placeholder="Nome da aula..."
                      value={lesson}
                      onChange={(e) => setLesson(mod.id, lIdx, e.target.value)}
                      onFocus={(e) => { e.target.style.borderColor = "var(--teal)"; e.target.style.background = "white"; }}
                      onBlur={(e) => { e.target.style.borderColor = "var(--border)"; e.target.style.background = "var(--cream)"; }}
                    />
                    <button
                      onClick={() => removeLesson(mod.id, lIdx)}
                      style={{ background: "none", border: "none", cursor: "pointer", color: "var(--soft)", fontSize: 18, lineHeight: 1, flexShrink: 0, padding: "2px 4px" }}
                      title="Remover aula"
                    >✕</button>
                  </div>
                ))}
                <button className="bt-out" style={{ marginTop: 8, padding: "7px 16px", fontSize: 13 }} onClick={() => addLesson(mod.id)}>
                  + Adicionar aula
                </button>
              </div>
            </div>
          ))}

          <button className="bt bt-sm" style={{ marginTop: 4 }} onClick={addModule}>+ Adicionar módulo</button>
        </div>
      )}

      {/* ── ABA: APOSTILAS ── */}
      {tab === "apostilas" && (
        <div>
          {form.apostilas.length === 0 && (
            <div className="empty" style={{ padding: "24px 20px" }}>
              <div className="eico">📄</div>
              <p>Nenhuma apostila. Adicione abaixo com link do Google Drive.</p>
            </div>
          )}

          {form.apostilas.map((ap) => (
            <ItemRow
              key={ap.id}
              icon="📄"
              primary={ap.title}
              secondary={ap.author}
              badge={ap.builtIn ? "Embutida" : null}
              href={ap.builtIn ? null : ap.url}
              onRemove={() => removeApostila(ap.id)}
            />
          ))}

          <AddForm
            addLabel="+ Adicionar apostila"
            fields={[
              { key: "title",  label: "Título",             required: true,  placeholder: "Ex: Apostila Módulo 2" },
              { key: "author", label: "Autora",              required: false, placeholder: "Fga. Carla Augusto Corrêa" },
              { key: "url",    label: "Link Google Drive *", required: true,  placeholder: "https://drive.google.com/file/d/..." },
            ]}
            onAdd={addApostila}
          />
          <div style={{ fontSize: 12, color: "var(--soft)", marginTop: 10, lineHeight: 1.6 }}>
            💡 <strong>Como pegar o link:</strong> Abra o PDF no Google Drive → botão direito → Compartilhar → "Qualquer pessoa com o link" → Copiar link. O sistema converte automaticamente.
          </div>
        </div>
      )}

      {/* ── ABA: VÍDEOS ── */}
      {tab === "videos" && (
        <div>
          {form.videos.length === 0 && (
            <div className="empty" style={{ padding: "24px 20px" }}>
              <div className="eico">🎬</div>
              <p>Nenhum vídeo. Adicione um link do YouTube abaixo.</p>
            </div>
          )}

          {form.videos.map((v) => (
            <ItemRow
              key={v.id}
              icon="🎬"
              primary={v.title}
              secondary={v.duration ? `⏱ ${v.duration}` : null}
              href={v.url}
              onRemove={() => removeVideo(v.id)}
            />
          ))}

          <AddForm
            addLabel="+ Adicionar vídeo"
            fields={[
              { key: "title",    label: "Título do vídeo",  required: true,  placeholder: "Ex: Introdução à CAA" },
              { key: "duration", label: "Duração",          required: false, placeholder: "Ex: 18:45" },
              { key: "url",      label: "Link YouTube *",   required: true,  placeholder: "https://youtube.com/watch?v=... ou embed" },
            ]}
            onAdd={addVideo}
          />
          <div style={{ fontSize: 12, color: "var(--soft)", marginTop: 10 }}>
            💡 Cole o link normal do YouTube (youtube.com/watch?v=...) ou o link de incorporação. O sistema converte automaticamente.
          </div>
        </div>
      )}

      {/* ── ABA: LINKS ── */}
      {tab === "links" && (
        <div>
          {form.links.length === 0 && (
            <div className="empty" style={{ padding: "24px 20px" }}>
              <div className="eico">🔗</div>
              <p>Nenhum link útil. Adicione recursos externos abaixo.</p>
            </div>
          )}

          {form.links.map((l) => (
            <ItemRow
              key={l.id}
              icon="🔗"
              primary={l.title}
              secondary={l.description}
              href={l.url}
              onRemove={() => removeLink(l.id)}
            />
          ))}

          <AddForm
            addLabel="+ Adicionar link"
            fields={[
              { key: "title",       label: "Nome do recurso", required: true,  placeholder: "Ex: ARASAAC" },
              { key: "url",         label: "URL *",           required: true,  placeholder: "https://..." },
              { key: "description", label: "Descrição",       required: false, placeholder: "Breve descrição" },
            ]}
            onAdd={addLink}
          />
        </div>
      )}

      {/* ── ABA: EXTRAS ── */}
      {tab === "extras" && (
        <div>
          {form.extras.length === 0 && (
            <div className="empty" style={{ padding: "24px 20px" }}>
              <div className="eico">📎</div>
              <p>Nenhum material extra. Adicione arquivos, templates ou recursos complementares.</p>
            </div>
          )}

          {form.extras.map((e) => (
            <ItemRow
              key={e.id}
              icon="📎"
              primary={e.title}
              secondary={e.description}
              href={e.url}
              onRemove={() => removeExtra(e.id)}
            />
          ))}

          <AddForm
            addLabel="+ Adicionar material"
            fields={[
              { key: "title",       label: "Nome do material", required: true,  placeholder: "Ex: Planilha de Vocabulário" },
              { key: "url",         label: "URL *",            required: true,  placeholder: "https://drive.google.com/..." },
              { key: "description", label: "Descrição",        required: false, placeholder: "O que é esse material?" },
            ]}
            onAdd={addExtra}
          />
          <div style={{ fontSize: 12, color: "var(--soft)", marginTop: 10 }}>
            💡 Use para planilhas, templates, arquivos de imagem, documentos complementares, etc.
          </div>
        </div>
      )}

      {/* Botão salvar no final */}
      <div style={{ display: "flex", gap: 12, marginTop: 24, paddingTop: 20, borderTop: "1.5px solid var(--border)" }}>
        <button className="bt bt-sm" onClick={handleSave}>Salvar workshop ✅</button>
        <button className="bt-out" onClick={onCancel}>Cancelar</button>
      </div>
    </div>
  );
}
