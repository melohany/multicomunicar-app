import { useState } from "react";
import logo from "../assets/logo.png";

export default function Login({ onLogin, err, onRec }) {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");

  const submit = () => onLogin(email, pass);
  const onKey = (e) => e.key === "Enter" && submit();

  return (
    <div className="lp">
      <div className="lc">
        <div className="ll">
          <img src={logo} alt="Multicomunicar" />
          <div className="ls">Área exclusiva de membros · Comunicação Aumentativa e Alternativa</div>
        </div>

        {err && <div className="err">{err}</div>}

        <div className="fg">
          <label>E-mail</label>
          <input
            type="email"
            placeholder="seu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={onKey}
          />
        </div>

        <div className="fg">
          <label>Senha</label>
          <input
            type="password"
            placeholder="••••••••"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            onKeyDown={onKey}
          />
        </div>

        <button className="bt" onClick={submit}>Entrar</button>

        <div style={{ textAlign: "center", marginTop: 14 }}>
          <button className="lnk" onClick={onRec}>Esqueci minha senha</button>
        </div>

      </div>
    </div>
  );
}
