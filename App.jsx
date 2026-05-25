import { useState } from "react";
import { useStorage } from "./hooks/useStorage";
import {
  INITIAL_USERS,
  INITIAL_DOUBTS,
  INITIAL_ANNOUNCEMENTS,
  INITIAL_WORKSHOPS,
} from "./data/content";

import Login from "./components/Login";
import Sidebar from "./components/Sidebar";
import Toast from "./components/Toast";

import StudentHome from "./pages/StudentHome";
import Workshop from "./pages/Workshop";
import MyDoubts from "./pages/MyDoubts";
import Announcements from "./pages/Announcements";
import AdminHome from "./pages/admin/AdminHome";
import AdminStudents from "./pages/admin/AdminStudents";
import AdminDoubts from "./pages/admin/AdminDoubts";
import AdminAnnouncements from "./pages/admin/AdminAnnouncements";
import AdminWorkshops from "./pages/admin/AdminWorkshops";

export default function App() {
  // ── Auth ──────────────────────────────────────────────────────────────────
  const [user, setUser] = useState(null);
  const [screen, setScreen] = useState("login");  // login | recovery | main
  const [loginErr, setLoginErr] = useState("");
  const [recovEmail, setRecovEmail] = useState("");
  const [recovSent, setRecovSent] = useState(false);

  // ── Navigation ────────────────────────────────────────────────────────────
  const [page, setPage] = useState("home");
  const [selectedWsId, setSelectedWsId] = useState(null);
  const [sbOpen, setSbOpen] = useState(false);
  const [toast, setToast] = useState("");

  // ── Persistent data (survives page reload) ────────────────────────────────
  const [users,         setUsers]         = useStorage("mc-users",         INITIAL_USERS);
  const [doubts,        setDoubts]        = useStorage("mc-doubts",        INITIAL_DOUBTS);
  const [announcements, setAnnouncements] = useStorage("mc-announcements", INITIAL_ANNOUNCEMENTS);
  const [workshops,     setWorkshops]     = useStorage("mc-workshops",     INITIAL_WORKSHOPS);

  // ── Helpers ───────────────────────────────────────────────────────────────
  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3200);
  };

  const go = (p) => {
    setPage(p);
    setSbOpen(false);
  };

  // Workshops visíveis para o usuário logado
  const myWorkshops = user
    ? workshops.filter((w) =>
        user.role === "admin"
          ? true                                        // admin vê todos
          : w.status === "active" && user.workshopIds?.includes(w.id)
      )
    : [];

  // Workshop selecionado na sidebar/navegação
  const currentWs =
    workshops.find((w) => w.id === selectedWsId) ??
    myWorkshops[0] ??
    null;

  const students = users.filter((u) => u.role === "student");
  const pending  = doubts.filter((d) => !d.answered);

  // ── Auth handlers ─────────────────────────────────────────────────────────
  const login = (email, pass) => {
    const found = users.find(
      (u) => u.email === email && u.password === pass && u.status === "active"
    );
    if (found) {
      setUser(found);
      setScreen("main");
      setPage("home");
      setLoginErr("");
    } else {
      setLoginErr("E-mail ou senha incorretos.");
    }
  };

  const logout = () => {
    setUser(null);
    setScreen("login");
    setLoginErr("");
  };

  // ── Student actions ───────────────────────────────────────────────────────
  const addDoubt = (question, wsId) => {
    setDoubts((prev) => [
      {
        id: Date.now(),
        userId: user.id,
        workshopId: wsId,
        userName: user.name,
        question,
        answer: null,
        answered: false,
        date: new Date().toLocaleDateString("pt-BR"),
      },
      ...prev,
    ]);
    showToast("Dúvida enviada! A Carla responderá em breve. 💙");
  };

  // ── Admin actions ─────────────────────────────────────────────────────────
  const answerDoubt = (id, text) => {
    setDoubts((prev) =>
      prev.map((d) => (d.id === id ? { ...d, answer: text, answered: true } : d))
    );
    showToast("Resposta salva! 💙");
  };

  const addStudent = (form) => {
    setUsers((prev) => [
      ...prev,
      {
        id: Date.now(),
        name: form.name,
        email: form.email,
        password: form.password,
        role: "student",
        workshopIds: form.wsIds,
        joinedAt: new Date().toLocaleDateString("pt-BR"),
        status: "active",
      },
    ]);
    showToast("Aluna cadastrada com sucesso!");
  };

  const toggleStudentWs = (uid, wsId) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id !== uid) return u;
        const has = u.workshopIds?.includes(wsId);
        return {
          ...u,
          workshopIds: has
            ? u.workshopIds.filter((x) => x !== wsId)
            : [...(u.workshopIds ?? []), wsId],
        };
      })
    );
    showToast("Acesso atualizado!");
  };

  const toggleStatus = (uid) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id !== uid ? u : { ...u, status: u.status === "active" ? "inactive" : "active" }
      )
    );
    showToast("Status atualizado!");
  };

  const addAnnouncement = (wsId, text) => {
    setAnnouncements((prev) => [
      ...prev,
      {
        id: `ann-${Date.now()}`,
        workshopId: wsId,
        text,
        date: new Date().toLocaleDateString("pt-BR"),
      },
    ]);
  };

  // ── Workshop CRUD ─────────────────────────────────────────────────────────
  const addWorkshop = (ws) => {
    setWorkshops((prev) => [...prev, ws]);
  };

  const updateWorkshop = (ws) => {
    setWorkshops((prev) => prev.map((w) => (w.id === ws.id ? ws : w)));
  };

  const deleteWorkshop = (wsId) => {
    setWorkshops((prev) => prev.filter((w) => w.id !== wsId));
    // Remove workshop from all students' access lists
    setUsers((prev) =>
      prev.map((u) => ({
        ...u,
        workshopIds: u.workshopIds?.filter((id) => id !== wsId) ?? [],
      }))
    );
    // Remove related announcements
    setAnnouncements((prev) => prev.filter((a) => a.workshopId !== wsId));
  };

  // ── Screens ───────────────────────────────────────────────────────────────
  if (screen === "login") {
    return <Login onLogin={login} err={loginErr} onRec={() => setScreen("recovery")} />;
  }

  if (screen === "recovery") {
    return (
      <div className="lp">
        <div className="lc">
          <button className="bkbtn" onClick={() => setScreen("login")}>← Voltar ao login</button>
          <div className="ll">
            <div className="ls" style={{ fontSize: 14, fontWeight: 700, marginTop: 8 }}>
              Recuperação de senha
            </div>
          </div>
          {!recovSent ? (
            <>
              <div className="fg">
                <label>Seu e-mail</label>
                <input
                  type="email"
                  placeholder="seu@email.com"
                  value={recovEmail}
                  onChange={(e) => setRecovEmail(e.target.value)}
                />
              </div>
              <button className="bt" onClick={() => setRecovSent(true)}>
                Enviar link de recuperação
              </button>
            </>
          ) : (
            <div style={{ textAlign: "center", padding: "16px 0" }}>
              <div style={{ fontSize: 48, marginBottom: 10 }}>📧</div>
              <div style={{ fontFamily: "Montserrat,sans-serif", fontSize: 18, fontWeight: 800, marginBottom: 8 }}>
                E-mail enviado!
              </div>
              <div style={{ color: "var(--soft)", fontSize: 14, marginBottom: 20, lineHeight: 1.5 }}>
                Verifique sua caixa de entrada e siga as instruções para redefinir sua senha.
              </div>
              <button
                className="bt"
                onClick={() => { setScreen("login"); setRecovSent(false); setRecovEmail(""); }}
              >
                Voltar ao login
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ── Page titles ───────────────────────────────────────────────────────────
  const pageTitles = {
    home:     user?.role === "admin" ? "Painel" : "Início",
    ws:       currentWs ? `${currentWs.emoji} ${currentWs.title}` : "Workshop",
    doubts:   "Minhas Dúvidas",
    ann:      "Avisos",
    "adm-s":  "Gerenciar Alunas",
    "adm-d":  "Dúvidas das Alunas",
    "adm-a":  "Avisos",
    "adm-ws": "Workshops",
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Toast message={toast} />

      <Sidebar
        user={user}
        page={page}
        go={go}
        myWorkshops={myWorkshops}
        selectedWsId={selectedWsId}
        setSelectedWsId={setSelectedWsId}
        pendingCount={pending.length}
        sbOpen={sbOpen}
        setSbOpen={setSbOpen}
        logout={logout}
      />

      <main className="main">
        <div className="tb">
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button className="hbg" onClick={() => setSbOpen(true)} aria-label="Abrir menu">
              ☰
            </button>
            <span className="tb-title">{pageTitles[page] ?? "Início"}</span>
          </div>
        </div>

        <div className="cnt">
          {/* ── Student pages ── */}
          {page === "home" && user?.role === "student" && (
            <StudentHome
              user={user}
              myWorkshops={myWorkshops}
              go={go}
              setSelectedWsId={setSelectedWsId}
            />
          )}

          {page === "ws" && currentWs && user?.role === "student" && (
            <Workshop
              key={currentWs.id}
              ws={currentWs}
              user={user}
              doubts={doubts}
              announcements={announcements}
              onAddDoubt={addDoubt}
            />
          )}

          {page === "doubts" && user?.role === "student" && (
            <MyDoubts
              user={user}
              myWorkshops={myWorkshops}
              doubts={doubts}
              onAddDoubt={addDoubt}
            />
          )}

          {page === "ann" && user?.role === "student" && (
            <Announcements
              myWorkshops={myWorkshops}
              announcements={announcements}
            />
          )}

          {/* ── Admin pages ── */}
          {page === "home" && user?.role === "admin" && (
            <AdminHome
              students={students}
              doubts={doubts}
              workshops={workshops}
              go={go}
            />
          )}

          {page === "adm-s" && user?.role === "admin" && (
            <AdminStudents
              students={students}
              workshops={workshops}
              onAddStudent={addStudent}
              onToggleWs={toggleStudentWs}
              onToggleStatus={toggleStatus}
              toast={showToast}
            />
          )}

          {page === "adm-d" && user?.role === "admin" && (
            <AdminDoubts doubts={doubts} workshops={workshops} onAnswer={answerDoubt} />
          )}

          {page === "adm-a" && user?.role === "admin" && (
            <AdminAnnouncements
              announcements={announcements}
              workshops={workshops}
              onAdd={addAnnouncement}
              toast={showToast}
            />
          )}

          {page === "adm-ws" && user?.role === "admin" && (
            <AdminWorkshops
              workshops={workshops}
              onAdd={addWorkshop}
              onUpdate={updateWorkshop}
              onDelete={deleteWorkshop}
              toast={showToast}
            />
          )}
        </div>
      </main>
    </div>
  );
}
