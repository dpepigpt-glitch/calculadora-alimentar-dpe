// v3.1 — Acesso convidado + Login para defensores com restrição ao PDF
import { useState, useRef } from "react";

const C = {
  verde: "#1a6b3a", verdeClaro: "#2d8a50", verdePale: "#e8f5ee",
  cinza: "#4a4a4a", cinzaClaro: "#f5f5f5", branco: "#ffffff",
  borda: "#d0d0d0", vermelho: "#c0392b", azul: "#1a5276",
};

const fmt = (v) => Number(v).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
const fmtMes = (mes, ano) => {
  const n = ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"];
  return `${n[mes-1]}/${ano}`;
};

// ... (manter todo o objeto SALARIO_MINIMO e IPCA_E igual) ...

function corrigir(saldo, mes, ano) {
  const hoje = new Date();
  const aAtual = hoje.getFullYear(), mAtual = hoje.getMonth() + 1;
  let fator = 1, m = mes, a = ano;
  while (a < aAtual || (a === aAtual && m < mAtual)) {
    const k = `${a}-${String(m).padStart(2,"0")}`;
    if (IPCA_E[k] !== undefined) fator *= (1 + IPCA_E[k] / 100);
    m++; if (m > 12) { m = 1; a++; }
  }
  const venc = new Date(ano, mes - 1, 1);
  const mesesAtraso = Math.max(0,
    (hoje.getFullYear() - venc.getFullYear()) * 12 + (hoje.getMonth() - venc.getMonth())
  );
  const corrigido = saldo * fator;
  const juros = corrigido * mesesAtraso * 0.01;
  return { fator, corrigido, juros, total: corrigido + juros, mesesAtraso };
}

const MESES = ["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];

const DEFENSORES = {
  "Dr. Robert Rios Júnior": "2ª Defensoria Itinerante",
  "Dra. Andrea Melo de Carvalho": "1ª Defensoria de Família",
  "Dra. Dayana Sampaio Mendes Magalhães": "2ª Defensoria Pública Regional de Altos",
  "Dra. Priscila Gimenes do Nascimento Godói": "2ª Defensoria Regional de União",
  "DoutorIS Brucha Lalasca": "1º D-INF",
};
const SENHA_CORRETA = "JB2027";

function usuarioEstaLogado(nome, senha) {
  return DEFENSORES[nome] && senha === SENHA_CORRETA;
}

// ── Logo cache (carrega 1x, usa no PDF) ────────────────────────
let _logoB64 = null;
function carregarLogo() {
  if (_logoB64) return Promise.resolve(_logoB64);
  return new Promise((res) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      try {
        const cv = document.createElement("canvas");
        cv.width = img.naturalWidth; cv.height = img.naturalHeight;
        cv.getContext("2d").drawImage(img, 0, 0);
        _logoB64 = cv.toDataURL("image/png");
        res(_logoB64);
      } catch { res(null); }
    };
    img.onerror = () => res(null);
    img.src = "/logo-apidep.png";
  });
}
carregarLogo();

// ── Tela de Login com opção de Acesso Convidado ──────────────────
const TelaLogin = ({ onLogin, onGuestAccess }) => {
  const [nome, setNome] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  
  const tentar = () => {
    if (!usuarioEstaLogado(nome, senha)) {
      setErro("Esse aplicativo está disponibilizado em fase experimental apenas para Defensores Legais, se você não tem senha, você não deve ser legal.");
      return;
    }
    onLogin({ nome, lotacao: DEFENSORES[nome] });
  };
  
  return (
    <div style={{ minHeight: "100vh", background: "#f0f2f0", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ background: "#fff", borderRadius: 12, padding: 40, width: 400, boxShadow: "0 8px 32px rgba(0,0,0,0.15)" }}>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <img src="/logo-apidep.png" alt="APIDEP" crossOrigin="anonymous" style={{ height: 60, objectFit: "contain", marginBottom: 12 }} onError={e => e.target.style.display = "none"} />
          <div style={{ fontWeight: 800, fontSize: 16, color: C.verde }}>Calculadora de Débitos Alimentares</div>
          <div style={{ fontSize: 12, color: "#888", marginTop: 4 }}>APIDEP — Acesso restrito</div>
        </div>
        
        <div style={{ marginBottom: 14 }}>
          <label style={{ display: "block", fontWeight: 600, marginBottom: 6, fontSize: 13, color: C.cinza }}>Nome do Defensor</label>
          <select value={nome} onChange={e => setNome(e.target.value)} style={{ width: "100%", padding: "10px 12px", borderRadius: 6, border: "1px solid #d0d0d0", fontSize: 14, boxSizing: "border-box" }}>
            <option value="">— Selecione —</option>
            {Object.keys(DEFENSORES).map((d, i) => <option key={i} value={d}>{d}</option>)}
          </select>
          {nome && <div style={{ fontSize: 12, color: C.verde, marginTop: 4, paddingLeft: 4 }}>📍 {DEFENSORES[nome]}</div>}
        </div>
        
        <div style={{ marginBottom: 20 }}>
          <label style={{ display: "block", fontWeight: 600, marginBottom: 6, fontSize: 13, color: C.cinza }}>Senha de Acesso</label>
          <input type="password" value={senha} onChange={e => setSenha(e.target.value)} onKeyDown={e => e.key === "Enter" && tentar()} placeholder="Digite a senha"
            style={{ width: "100%", padding: "10px 12px", borderRadius: 6, border: "1px solid #d0d0d0", fontSize: 14, boxSizing: "border-box" }} />
        </div>
        
        {erro && <div style={{ background: "#fdecea", border: "1px solid #e57373", borderRadius: 6, padding: "10px 12px", fontSize: 12, color: C.vermelho, marginBottom: 16, lineHeight: 1.5 }}>🚫 {erro}</div>}
        
        <button onClick={tentar} style={{ width: "100%", background: C.verde, color: "#fff", border: "none", borderRadius: 6, padding: "12px", fontSize: 15, fontWeight: 700, cursor: "pointer", touchAction: "manipulation", marginBottom: 10 }}>
          Acessar como Defensor
        </button>
        
        <button onClick={onGuestAccess} style={{ width: "100%", background: C.azul, color: "#fff", border: "none", borderRadius: 6, padding: "12px", fontSize: 15, fontWeight: 700, cursor: "pointer", touchAction: "manipulation" }}>
          Acessar como Convidado
        </button>
        
        <div style={{ textAlign: "center", fontSize: 11, color: "#aaa", marginTop: 16 }}>Convidados podem calcular, mas não geram PDFs</div>
      </div>
    </div>
  );
};

const Btn = ({ children, onClick, cor = C.verde, outline = false, small = false, disabled = false }) => (
  <button onClick={onClick} disabled={disabled} style={{
    background: outline ? "transparent" : cor, color: outline ? cor : "#fff",
    border: `2px solid ${cor}`, borderRadius: 6,
    padding: small ? "6px 14px" : "10px 22px",
    cursor: disabled ? "not-allowed" : "pointer",
    fontWeight: 600, fontSize: small ? 13 : 15,
    opacity: disabled ? 0.5 : 1, touchAction: "manipulation",
  }}>{children}</button>
);

const Input = ({ label, value, onChange, placeholder, type = "text", disabled }) => (
  <div style={{ marginBottom: 14 }}>
    {label && <label style={{ display: "block", fontWeight: 600, marginBottom: 4, color: C.cinza, fontSize: 13 }}>{label}</label>}
    <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} disabled={disabled}
      style={{ width: "100%", padding: "9px 12px", borderRadius: 6, border: `1px solid ${C.borda}`, fontSize: 14, boxSizing: "border-box", background: disabled ? C.cinzaClaro : C.branco }} />
  </div>
);

const Card = ({ children, style = {} }) => (
  <div style={{ background: C.branco, borderRadius: 10, border: `1px solid ${C.borda}`, padding: 24, marginBottom: 20, ...style }}>{children}</div>
);

const ModalPerfil = ({ perfil, onSave, onClose }) => {
  const [nome, setNome] = useState(perfil.nome || "");
  const [apiKey, setApiKey] = useState(perfil.apiKey || "");
  const [showKey, setShowKey] = useState(false);
  const lotacao = DEFENSORES[nome] || perfil.lotacao || "";
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ background: C.branco, borderRadius: 12, padding: 32, width: 460, boxShadow: "0 8px 32px rgba(0,0,0,0.2)" }}>
        <h2 style={{ margin: "0 0 20px", color: C.verde }}>⚙ Configurar Perfil</h2>
        <div style={{ marginBottom: 14 }}>
          <label style={{ display: "block", fontWeight: 600, marginBottom: 4, color: C.cinza, fontSize: 13 }}>Nome do Defensor</label>
          <select value={nome} onChange={e => setNome(e.target.value)} style={{ width: "100%", padding: "9px 12px", borderRadius: 6, border: `1px solid ${C.borda}`, fontSize: 14, boxSizing: "border-box" }}>
            <option value="">— Selecione —</option>
            {Object.keys(DEFENSORES).map((d, i) => <option key={i} value={d}>{d}</option>)}
          </select>
        </div>
        <div style={{ marginBottom: 14 }}>
          <label style={{ display: "block", fontWeight: 600, marginBottom: 4, color: C.cinza, fontSize: 13 }}>Defensoria (automática)</label>
          <input value={lotacao} disabled style={{ width: "100%", padding: "9px 12px", borderRadius: 6, border: `1px solid ${C.borda}`, fontSize: 14, boxSizing: "border-box", background: C.cinzaClaro }} />
        </div>
        <div style={{ marginBottom: 14 }}>
          <label style={{ display: "block", fontWeight: 600, marginBottom: 4, color: C.cinza, fontSize: 13 }}>Chave de API (Anthropic) — opcional</label>
          <div style={{ position: "relative" }}>
            <input type={showKey ? "text" : "password"} value={apiKey} onChange={e => setApiKey(e.target.value)} placeholder="sk-ant-..."
              style={{ width: "100%", padding: "9px 40px 9px 12px", borderRadius: 6, border: `1px solid ${C.borda}`, fontSize: 13, boxSizing: "border-box" }} />
            <button onClick={() => setShowKey(s => !s)} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", fontSize: 16 }}>
              {showKey ? "👁️" : "👁️‍🗨️"}
            </button>
          </div>
          <div style={{ fontSize: 11, color: "#888", marginTop: 4 }}>Necessária apenas para leitura automática de sentença.</div>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <Btn onClick={() => { onSave({ nome, lotacao, apiKey }); onClose(); }}>Salvar</Btn>
          <Btn onClick={onClose} outline cor={C.cinza}>Cancelar</Btn>
        </div>
      </div>
    </div>
  );
};

const Header = ({ perfil, usuario, onPerfil, onLogout, ehConvidado }) => (
  <div style={{ background: C.verde, color: "#fff", padding: "12px 28px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
      <img src="/logo-apidep.png" alt="APIDEP" crossOrigin="anonymous" style={{ height: 56, objectFit: "contain" }} onError={e => e.target.style.display = "none"} />
      <div>
        <div style={{ fontWeight: 800, fontSize: 16 }}>Calculadora de Débitos Alimentares</div>
        <div style={{ fontSize: 12, opacity: .8 }}>
          {ehConvidado ? "Acesso Convidado" : "APIDEP — Associação Piauiense das Defensoras e Defensores Públicos"}
        </div>
      </div>
    </div>
    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
      {!ehConvidado && (
        <button onClick={onPerfil} style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.4)", borderRadius: 6, color: "#fff", padding: "7px 14px", cursor: "pointer", fontSize: 12, fontWeight: 600 }}>
          ⚙ Perfil
        </button>
      )}
      <button onClick={onLogout} style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.3)", borderRadius: 6, color: "#fff", padding: "7px 12px", cursor: "pointer", fontSize: 12, fontWeight: 600 }}>
        🚪 Sair
      </button>
    </div>
  </div>
);

function novaParcela() {
  const h = new Date();
  return { id: Date.now(), mes: h.getMonth() + 1, ano: h.getFullYear(), valor: "", pago: "" };
}

export default function App() {
  const [usuario, setUsuario] = useState(() => { try { return JSON.parse(sessionStorage.getItem("dpe_usuario") || "null"); } catch { return null; } });
  const [ehConvidado, setEhConvidado] = useState(() => { try { return sessionStorage.getItem("dpe_convidado") === "true"; } catch { return false; } });
  
  const fazerLogin = (u) => { sessionStorage.setItem("dpe_usuario", JSON.stringify(u)); sessionStorage.removeItem("dpe_convidado"); setUsuario(u); setEhConvidado(false); };
  const acessarConvidado = () => { sessionStorage.setItem("dpe_convidado", "true"); sessionStorage.removeItem("dpe_usuario"); setEhConvidado(true); setUsuario(null); };
  const fazerLogout = () => { sessionStorage.removeItem("dpe_usuario"); sessionStorage.removeItem("dpe_convidado"); setUsuario(null); setEhConvidado(false); };
  
  if (!usuario && !ehConvidado) return <TelaLogin onLogin={fazerLogin} onGuestAccess={acessarConvidado} />;
  return <AppInterno usuario={usuario} ehConvidado={ehConvidado} onLogout={fazerLogout} />;
}

function AppInterno({ usuario, ehConvidado, onLogout }) {
  const [perfil, setPerfil] = useState(() => { try { return JSON.parse(localStorage.getItem("dpe_perfil") || "{}"); } catch { return {}; } });
  const [showPerfil, setShowPerfil] = useState(false);
  const [tab, setTab] = useState("calc");
  const [historico, setHistorico] = useState(() => { try { return JSON.parse(localStorage.getItem("dpe_historico") || "[]"); } catch { return []; } });

  const [processo, setProcesso] = useState("");
  const [alimentado, setAlimentado] = useState("");
  const [alimentante, setAlimentante] = useState("");
  const [comarca, setComarca] = useState("");
  const [diaVencimento, setDiaVencimento] = useState("5");
  const [tipoAlimento, setTipoAlimento] = useState("sm");
  const [percentualSM, setPercentualSM] = useState("");
  const [valorFixoAlimento, setValorFixoAlimento] = useState("");

  const [parcelas, setParcelas] = useState([novaParcela()]);
  const [showIntervalo, setShowIntervalo] = useState(false);
  const [intervalo, setIntervalo] = useState({ mesIni: 1, anoIni: 2024, mesFim: 12, anoFim: 2024, pago: "" });
  const [resultado, setResultado] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingIA, setLoadingIA] = useState(false);
  const [msgIA, setMsgIA] = useState("");
  const fileRef = useRef();

  const salvarPerfil = (p) => { setPerfil(p); localStorage.setItem("dpe_perfil", JSON.stringify(p)); };
  const addParcela = () => setParcelas(p => [...p, novaParcela()]);
  const removeParcela = (id) => setParcelas(p => p.filter(x => x.id !== id));
  const editParcela = (id, campo, val) => setParcelas(p => p.map(x => x.id === id ? { ...x, [campo]: val } : x));

  const contarParcelas = () => {
    let n = 0, m = intervalo.mesIni, a = intervalo.anoIni;
    while (a < intervalo.anoFim || (a === intervalo.anoFim && m <= intervalo.mesFim)) { n++; m++; if (m > 12) { m = 1; a++; } }
    return n;
  };

  const limparParcelas = () => { if (window.confirm("Apagar todas as parcelas?")) setParcelas([]); };

  const addIntervalo = () => {
    const novas = [];
    let m = intervalo.mesIni, a = intervalo.anoIni;
    while (a < intervalo.anoFim || (a === intervalo.anoFim && m <= intervalo.mesFim)) {
      let valor;
      if (tipoAlimento === "sm") {
        valor = (getSM(m, a) * Number(percentualSM) / 100).toFixed(2);
      } else {
        valor = valorFixoAlimento;
      }
      novas.push({ id: Date.now() + novas.length, mes: m, ano: a, valor, pago: intervalo.pago });
      m++; if (m > 12) { m = 1; a++; }
    }
    setParcelas(prev => {
      const existentes = new Set(prev.map(p => `${p.ano}-${p.mes}`));
      const unicas = novas.filter(n => !existentes.has(`${n.ano}-${n.mes}`));
      if (unicas.length < novas.length) {
        const dup = novas.length - unicas.length;
        alert(`${dup} parcela(s) já existiam e foram ignoradas para evitar duplicação.`);
      }
      return [...prev, ...unicas];
    });
    setIntervalo(i => ({ ...i, pago: "" }));
  };

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!perfil.apiKey) { setMsgIA("❌ Configure sua chave de API no perfil."); return; }
    setLoadingIA(true); setMsgIA("Lendo documento com IA…");
    try {
      const base64 = await new Promise((res, rej) => { const r = new FileReader(); r.onload = () => res(r.result.split(",")[1]); r.onerror = rej; r.readAsDataURL(file); });
      const block = file.type === "application/pdf"
        ? { type: "document", source: { type: "base64", media_type: "application/pdf", data: base64 } }
        : { type: "image", source: { type: "base64", media_type: file.type, data: base64 } };
      const resp = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-api-key": perfil.apiKey, "anthropic-version": "2023-06-01" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514", max_tokens: 1000,
          messages: [{ role: "user", content: [block, { type: "text", text: `Analise este documento e extraia: número do processo (CNJ), nome do alimentado, nome do alimentante, parcelas em atraso (mês, ano, valor). Retorne JSON.` }] }]
        })
      });
      const data = await resp.json();
      const text = data.content?.find(b => b.type === "text")?.text || "";
      const parsed = JSON.parse(text.replace(/```json|```/g, "").trim());
      if (parsed.processo) setProcesso(parsed.processo);
      if (parsed.alimentado) setAlimentado(parsed.alimentado);
      if (parsed.alimentante) setAlimentante(parsed.alimentante);
      if (parsed.parcelas?.length) setParcelas(parsed.parcelas.map((p, i) => ({ id: Date.now() + i, mes: p.mes, ano: p.ano, valor: String(p.valor), pago: "" })));
      setMsgIA(`✅ ${parsed.parcelas?.length || 0} parcela(s) extraída(s). Revise antes de calcular.`);
    } catch { setMsgIA("❌ Não foi possível ler o documento."); }
    setLoadingIA(false);
    if (fileRef.current) fileRef.current.value = "";
  };

  const calcular = () => {
    setLoading(true); setResultado(null);
    setTimeout(() => {
      const detalhes = parcelas
        .filter(p => p.valor && Number(p.valor) > 0)
        .sort((a, b) => a.ano !== b.ano ? a.ano - b.ano : a.mes - b.mes)
        .map(p => {
          const smVig = getSM(p.mes, p.ano);
          const nominal = Number(p.valor) || 0;
          const pago = Number(p.pago) || 0;
          const saldoBruto = nominal - pago;
          return { mes: p.mes, ano: p.ano, label: fmtMes(p.mes, p.ano), nominal, pago, saldoBruto, smVig };
        });

      if (!detalhes.length) { setLoading(false); return; }

      const prisaoRaw = detalhes.slice(-3);
      const penhoraRaw = detalhes.slice(0, -3);

      function aplicarCreditos(arr) {
        let credAcum = 0;
        const items = arr.map(p => ({ ...p, saldoFinal: p.saldoBruto, creditoAplicado: 0 }));
        for (const it of items) {
          if (it.saldoFinal < 0) {
            credAcum += Math.abs(it.saldoFinal);
            it.saldoFinal = 0;
            it.quitado = true;
          }
        }
        for (const it of items) {
          if (credAcum <= 0) break;
          if (it.quitado) continue;
          if (it.saldoFinal <= 0) continue;
          const abate = Math.min(credAcum, it.saldoFinal);
          it.creditoAplicado = abate;
          it.saldoFinal -= abate;
          credAcum -= abate;
          if (it.saldoFinal <= 0) it.quitado = true;
        }
        return { items: items.map(it => {
          const calc = corrigir(Math.max(0, it.saldoFinal), it.mes, it.ano);
          return { ...it, ...calc, isCredito: false };
        }), creditoSobrando: credAcum };
      }

      const b2 = aplicarCreditos(penhoraRaw);
      const b1 = aplicarCreditos(prisaoRaw);

      let creditoExtra = b1.creditoSobrando + b2.creditoSobrando;
      if (creditoExtra > 0) {
        for (const it of b2.items) {
          if (creditoExtra <= 0) break;
          if (it.saldoFinal <= 0) continue;
          const abate = Math.min(creditoExtra, it.saldoFinal);
          it.creditoAplicado = (it.creditoAplicado || 0) + abate;
          it.saldoFinal -= abate;
          creditoExtra -= abate;
          if (it.saldoFinal <= 0) it.quitado = true;
          const calc = corrigir(Math.max(0, it.saldoFinal), it.mes, it.ano);
          Object.assign(it, calc);
        }
      }

      const soma = arr => arr.reduce((s, x) => s + x.total, 0);
      const totalPrisao = soma(b1.items);
      const totalPenhora = soma(b2.items);

      const res = {
        processo, alimentado, alimentante, comarca, diaVencimento,
        tipoAlimento, percentualSM, valorFixoAlimento,
        prisao: b1.items, penhora: b2.items,
        totalPrisao, totalPenhora,
        data: new Date().toLocaleDateString("pt-BR"),
        defensor: perfil.nome || usuario?.nome || "", lotacao: perfil.lotacao || usuario?.lotacao || "",
      };
      setResultado(res);
      const hist = [{ id: Date.now(), ...res, total: totalPrisao + totalPenhora }, ...historico].slice(0, 50);
      setHistorico(hist); localStorage.setItem("dpe_historico", JSON.stringify(hist));
      setLoading(false);
    }, 400);
  };

  const gerarPDF = async () => {
    if (ehConvidado) {
      alert("❌ Acesso restrito. Faça login como Defensor para gerar PDFs.\n\n→ Clique em 'Sair' e faça login com suas credenciais.");
      return;
    }
    if (!resultado) return;
    // ... resto do código de gerarPDF igual ...
  };

  const inpStyle = { width: "100%", padding: "8px", borderRadius: 6, border: `1px solid ${C.borda}`, fontSize: 13, boxSizing: "border-box" };

  return (
    <div style={{ fontFamily: "'Segoe UI', Arial, sans-serif", minHeight: "100vh", background: "#f0f2f0" }}>
      <Header perfil={perfil} usuario={usuario} ehConvidado={ehConvidado} onPerfil={() => setShowPerfil(true)} onLogout={onLogout} />
      {!ehConvidado && showPerfil && <ModalPerfil perfil={perfil} onSave={salvarPerfil} onClose={() => setShowPerfil(false)} />}

      <div style={{ background: C.branco, borderBottom: `1px solid ${C.borda}`, display: "flex", padding: "0 28px" }}>
        {[["calc", "🧮 Novo Cálculo"], ["historico", "📋 Histórico"]].map(([id, label]) => (
          <button key={id} onClick={() => setTab(id)} style={{ padding: "14px 20px", border: "none", background: "transparent", cursor: "pointer", fontWeight: 600, fontSize: 14, color: tab === id ? C.verde : "#999", borderBottom: tab === id ? `3px solid ${C.verde}` : "none" }}>
            {label}
          </button>
        ))}
      </div>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "24px 16px" }}>
        {tab === "calc" && (
          <>
            {ehConvidado && (
              <div style={{ background: "#e3f2fd", border: "1px solid #64b5f6", borderRadius: 8, padding: "12px 18px", marginBottom: 18, fontSize: 14 }}>
                ℹ️ <strong>Acesso como Convidado:</strong> Você pode calcular débitos, mas não pode gerar PDFs assinados. <span style={{ color: C.azul, cursor: "pointer", textDecoration: "underline" }} onClick={onLogout}>Faça login como Defensor</span>
              </div>
            )}

            {!ehConvidado && !perfil.nome && (
              <div style={{ background: "#fff8e1", border: "1px solid #f0c040", borderRadius: 8, padding: "12px 18px", marginBottom: 18, fontSize: 14 }}>
                ⚠️ <strong>Configure seu perfil</strong> para que seu nome apareça nos PDFs. <span style={{ color: C.verde, cursor: "pointer", textDecoration: "underline" }} onClick={() => setShowPerfil(true)}>Configurar agora</span>
              </div>
            )}

            {/* ... resto do componente igual ... */}
          </>
        )}
      </div>
    </div>
  );
}
