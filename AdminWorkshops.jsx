import { useState } from "react";
import WorkshopEditor from "./WorkshopEditor";

// ── Card de workshop na listagem ───────────────────────────────────────────────
function WorkshopCard({ ws, onEdit, onDelete }) {
  const totalMods = ws.modules?.length ?? 0;
  const totalAps  = ws.apostilas?.length ?? 0;
  const totalVids = ws.videos?.length ?? 0;
  const totalLnks = ws.links?.length ?? 0;

  return (
    <div className="card" style={{ padding: 0, overflow: "hidden" }}>
      {/* Faixa de cor */}
      <div style={{ height: 5, background: ws.color ?? "#3AABBA" }} />

      <div style={{ padding: "18px 22px" }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 14, flexWrap: "wrap" }}>

          {/* Emoji + info */}
          <div style={{ fontSize: 38, lineHeight: 1, flexShrink: 0 }}>{ws.emoji ?? "📚"}</div>

          <div style={{ flex: 1, minWidth: 180 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
              <span style={{ fontFamily: "Montserrat,sans-serif", fontWeight: 800, fontSize: 16 }}>
                {ws.title}
              </span>
              <span className={ws.status === "active" ? "sta" : "sta-off"}>
                {ws.status === "active" ? "✅ Ativo" : "📝 Rascunho"}
              </span>
            </div>

            {ws.description && (
              <div style={{ fontSize: 13, color: "var(--soft)", marginTop: 5, lineHeight: 1.55, maxWidth: 520 }}>
                {ws.description}
              </div>
            )}

            <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 10 }}>
              {[
                ["📖", totalMods, "módulo"],
                ["📄", totalAps,  "apostila"],
                ["🎬", totalVids, "vídeo"],
                ["🔗", totalLnks, "link"],
              ].map(([ico, n, label]) => (
                <span key={label} style={{ fontSize: 12, fontWeight: 700, color: "var(--soft)" }}>
                  {ico} {n} {label}{n !== 1 ? "s" : ""}
                </span>
              ))}
              {ws.createdAt && (
                <span style={{ fontSize: 12, color: "var(--soft)", fontWeight: 600 }}>
                  · Criado em {ws.createdAt}
                </span>
              )}
            </div>
          </div>

          {/* Ações */}
          <div style={{ display: "flex", gap: 8, flexShrink: 0, alignSelf: "center" }}>
            <button className="bt bt-sm" style={{ padding: "8px 16px" }} onClick={onEdit}>
              ✏️ Editar
            </button>
            <button className="bt-rose" style={{ padding: "8px 14px" }} onClick={onDelete}>
              Excluir
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Componente principal ───────────────────────────────────────────────────────
export default function AdminWorkshops({ workshops, onAdd, onUpdate, onDelete, toast }) {
  // null = listagem | "new" = criar | objeto = editar
  const [editing, setEditing] = useState(null);

  const handleSaveNew = (ws) => {
    onAdd(ws);
    setEditing(null);
    toast("Workshop criado com sucesso! 🎉");
  };

  const handleSaveEdit = (ws) => {
    onUpdate(ws);
    setEditing(null);
    toast("Workshop atualizado! ✅");
  };

  const handleDelete = (ws) => {
    if (!window.confirm(`Excluir o workshop "${ws.title}"?\n\nEssa ação não pode ser desfeita.`)) return;
    onDelete(ws.id);
    toast("Workshop excluído.");
  };

  // ── Editor (criar ou editar) ───────────────────────────────────────────────
  if (editing === "new") {
    return (
      <WorkshopEditor
        workshop={null}
        onSave={handleSaveNew}
        onCancel={() => setEditing(null)}
      />
    );
  }

  if (editing && typeof editing === "object") {
    return (
      <WorkshopEditor
        workshop={editing}
        onSave={handleSaveEdit}
        onCancel={() => setEditing(null)}
      />
    );
  }

  // ── Listagem ───────────────────────────────────────────────────────────────
  return (
    <div>
      {/* Cabeçalho */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 10 }}>
        <p className="stitle" style={{ margin: 0 }}>
          Workshops ({workshops.length})
        </p>
        <button className="bt bt-sm" onClick={() => setEditing("new")}>
          + Novo workshop
        </button>
      </div>

      {/* Dica quando vazio */}
      {workshops.length === 0 && (
        <div className="empty">
          <div className="eico">📚</div>
          <p>Nenhum workshop cadastrado ainda.<br />Clique em "Novo workshop" para começar!</p>
        </div>
      )}

      {/* Cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {workshops.map((ws) => (
          <WorkshopCard
            key={ws.id}
            ws={ws}
            onEdit={() => setEditing({ ...ws })}
            onDelete={() => handleDelete(ws)}
          />
        ))}
      </div>
    </div>
  );
}
