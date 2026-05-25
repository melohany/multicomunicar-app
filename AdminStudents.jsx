import { useState } from "react";

export default function AdminStudents({ students, workshops, onAddStudent, onToggleWs, onToggleStatus, toast }) {
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "", wsIds: [] });

  const set = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  const toggleWsInForm = (wsId) => {
    setForm((prev) => ({
      ...prev,
      wsIds: prev.wsIds.includes(wsId)
        ? prev.wsIds.filter((x) => x !== wsId)
        : [...prev.wsIds, wsId],
    }));
  };

  const submit = () => {
    if (!form.name || !form.email || !form.password) {
      toast("Preencha todos os campos.");
      return;
    }
    onAddStudent(form);
    setForm({ name: "", email: "", password: "", wsIds: [] });
    setShowAdd(false);
  };

  // Apenas workshops ativos aparecem para seleção
  const activeWorkshops = workshops.filter((w) => w.status === "active");

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <p className="stitle" style={{ margin: 0 }}>Alunas cadastradas</p>
        <button className="bt bt-sm" onClick={() => setShowAdd(true)}>+ Nova aluna</button>
      </div>

      {showAdd && (
        <div className="card" style={{ marginBottom: 18 }}>
          <p style={{ fontFamily: "Montserrat,sans-serif", fontWeight: 800, fontSize: 14, marginBottom: 14 }}>
            Cadastrar nova aluna
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <div className="fg">
              <label>Nome completo</label>
              <input placeholder="Nome" value={form.name} onChange={(e) => set("name", e.target.value)} />
            </div>
            <div className="fg">
              <label>E-mail</label>
              <input placeholder="email@exemplo.com" value={form.email} onChange={(e) => set("email", e.target.value)} />
            </div>
            <div className="fg">
              <label>Senha inicial</label>
              <input type="password" placeholder="Senha" value={form.password} onChange={(e) => set("password", e.target.value)} />
            </div>
          </div>

          <div className="fg">
            <label>Workshops liberados</label>
            {activeWorkshops.length === 0 ? (
              <div style={{ fontSize: 13, color: "var(--soft)", marginTop: 6 }}>
                Nenhum workshop ativo. Crie um workshop primeiro.
              </div>
            ) : (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 6 }}>
                {activeWorkshops.map((w) => (
                  <label key={w.id} style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer", fontSize: 13, fontWeight: 700 }}>
                    <input
                      type="checkbox"
                      checked={form.wsIds.includes(w.id)}
                      onChange={() => toggleWsInForm(w.id)}
                    />
                    {w.emoji} {w.title}
                  </label>
                ))}
              </div>
            )}
          </div>

          <div className="row-gap">
            <button className="bt bt-sm" onClick={submit}>Salvar aluna</button>
            <button className="bt-out" onClick={() => setShowAdd(false)}>Cancelar</button>
          </div>
        </div>
      )}

      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table className="dt">
            <thead>
              <tr>
                <th>Aluna</th>
                <th>E-mail</th>
                <th>Workshops</th>
                <th>Status</th>
                <th>Cadastro</th>
              </tr>
            </thead>
            <tbody>
              {students.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: "center", color: "var(--soft)", padding: "24px 0" }}>
                    Nenhuma aluna cadastrada ainda.
                  </td>
                </tr>
              ) : (
                students.map((u) => (
                  <tr key={u.id}>
                    <td><strong>{u.name}</strong></td>
                    <td style={{ color: "var(--soft)" }}>{u.email}</td>
                    <td>
                      {activeWorkshops.length === 0 ? (
                        <span style={{ fontSize: 12, color: "var(--soft)" }}>—</span>
                      ) : (
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                          {activeWorkshops.map((w) => (
                            <button
                              key={w.id}
                              className={"wtog " + (u.workshopIds?.includes(w.id) ? "won" : "woff")}
                              onClick={() => onToggleWs(u.id, w.id)}
                            >
                              {w.emoji} {w.title.split(" ").slice(0, 2).join(" ")}
                            </button>
                          ))}
                        </div>
                      )}
                    </td>
                    <td>
                      <button
                        onClick={() => onToggleStatus(u.id)}
                        style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
                      >
                        <span className={u.status === "active" ? "sta" : "sta-off"}>
                          {u.status === "active" ? "Ativo" : "Inativo"}
                        </span>
                      </button>
                    </td>
                    <td style={{ color: "var(--soft)" }}>{u.joinedAt}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
