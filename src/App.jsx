// v3.0 — Correções: logo no PDF, créditos dentro do bloco, sem total geral somando blocos,
// sem duplicação de meses, SM 2026 = R$1.621
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

const SALARIO_MINIMO = {
  "2020-01":1045,"2020-02":1045,"2020-03":1045,"2020-04":1045,"2020-05":1045,"2020-06":1045,
  "2020-07":1045,"2020-08":1045,"2020-09":1045,"2020-10":1045,"2020-11":1045,"2020-12":1045,
  "2021-01":1100,"2021-02":1100,"2021-03":1100,"2021-04":1100,"2021-05":1100,"2021-06":1100,
  "2021-07":1100,"2021-08":1100,"2021-09":1100,"2021-10":1100,"2021-11":1100,"2021-12":1100,
  "2022-01":1212,"2022-02":1212,"2022-03":1212,"2022-04":1212,"2022-05":1212,"2022-06":1212,
  "2022-07":1212,"2022-08":1212,"2022-09":1212,"2022-10":1212,"2022-11":1212,"2022-12":1212,
  "2023-01":1320,"2023-02":1320,"2023-03":1320,"2023-04":1320,"2023-05":1320,"2023-06":1320,
  "2023-07":1320,"2023-08":1320,"2023-09":1320,"2023-10":1320,"2023-11":1320,"2023-12":1320,
  "2024-01":1412,"2024-02":1412,"2024-03":1412,"2024-04":1412,"2024-05":1412,"2024-06":1412,
  "2024-07":1412,"2024-08":1412,"2024-09":1412,"2024-10":1412,"2024-11":1412,"2024-12":1412,
  "2025-01":1518,"2025-02":1518,"2025-03":1518,"2025-04":1518,"2025-05":1518,"2025-06":1518,
  "2025-07":1518,"2025-08":1518,"2025-09":1518,"2025-10":1518,"2025-11":1518,"2025-12":1518,
  "2026-01":1621,"2026-02":1621,"2026-03":1621,"2026-04":1621,"2026-05":1621,"2026-06":1621,
  "2026-07":1621,"2026-08":1621,"2026-09":1621,"2026-10":1621,"2026-11":1621,"2026-12":1621,
};
const getSM = (m, a) => SALARIO_MINIMO[`${a}-${String(m).padStart(2,"0")}`] || 1621;

const IPCA_E = {
  "2022-01":0.54,"2022-02":0.58,"2022-03":1.05,"2022-04":1.06,"2022-05":0.81,"2022-06":0.68,
  "2022-07":-0.07,"2022-08":-0.04,"2022-09":0.24,"2022-10":0.40,"2022-11":0.54,"2022-12":0.54,
  "2023-01":0.53,"2023-02":0.39,"2023-03":0.17,"2023-04":0.23,"2023-05":0.22,"2023-06":0.06,
  "2023-07":0.18,"2023-08":0.37,"2023-09":0.26,"2023-10":0.24,"2023-11":0.33,"2023-12":0.44,
  "2024-01":0.42,"2024-02":0.40,"2024-03":0.36,"2024-04":0.38,"2024-05":0.40,"2024-06":0.39,
  "2024-07":0.43,"2024-08":0.44,"2024-09":0.44,"2024-10":0.56,"2024-11":0.39,"2024-12":0.48,
  "2025-01":0.41,"2025-02":1.23,"2025-03":0.44,
};

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
// dispara carregamento assim que o módulo é importado
carregarLogo();

// ── Tela de Login ──────────────────────────────────────────────
const TelaLogin = ({ onLogin }) => {
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
        <button onClick={tentar} style={{ width: "100%", background: C.verde, color: "#fff", border: "none", borderRadius: 6, padding: "12px", fontSize: 15, fontWeight: 700, cursor: "pointer", touchAction: "manipulation" }}>Entrar</button>
        <div style={{ textAlign: "center", fontSize: 11, color: "#aaa", marginTop: 16 }}>Acesso exclusivo para membros da APIDEP</div>
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
          <input value={lotacao} disabled style={{ width: "100%", padding: "9px 12px", borderRadius: 6, border: `1px solid ${C.borda}`, fontSize: 14, boxSizing: "border-box", background: C.cinzaClaro, color: C.cinza }} />
        </div>
        <div style={{ marginBottom: 14 }}>
          <label style={{ display: "block", fontWeight: 600, marginBottom: 4, color: C.cinza, fontSize: 13 }}>Chave de API (Anthropic) — opcional</label>
          <div style={{ position: "relative" }}>
            <input type={showKey ? "text" : "password"} value={apiKey} onChange={e => setApiKey(e.target.value)} placeholder="sk-ant-..."
              style={{ width: "100%", padding: "9px 40px 9px 12px", borderRadius: 6, border: `1px solid ${C.borda}`, fontSize: 13, boxSizing: "border-box" }} />
            <button onClick={() => setShowKey(s => !s)} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", fontSize: 16 }}>{showKey ? "🙈" : "👁"}</button>
          </div>
          <div style={{ fontSize: 11, color: "#888", marginTop: 4 }}>Necessária apenas para leitura automática de sentença. <a href="https://console.anthropic.com/keys" target="_blank" rel="noreferrer" style={{ color: C.verde }}>console.anthropic.com/keys</a></div>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <Btn onClick={() => { onSave({ nome, lotacao, apiKey }); onClose(); }}>Salvar</Btn>
          <Btn onClick={onClose} outline cor={C.cinza}>Cancelar</Btn>
        </div>
      </div>
    </div>
  );
};

const Header = ({ perfil, onPerfil, onLogout }) => (
  <div style={{ background: C.verde, color: "#fff", padding: "12px 28px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
      <img src="/logo-apidep.png" alt="APIDEP" crossOrigin="anonymous" style={{ height: 56, objectFit: "contain" }} onError={e => e.target.style.display = "none"} />
      <div>
        <div style={{ fontWeight: 800, fontSize: 16 }}>Calculadora de Débitos Alimentares</div>
        <div style={{ fontSize: 12, opacity: .8 }}>APIDEP — Associação Piauiense das Defensoras e Defensores Públicos</div>
      </div>
    </div>
    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
      <button onClick={onPerfil} style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.4)", borderRadius: 6, color: "#fff", padding: "7px 14px", cursor: "pointer", fontSize: 13, touchAction: "manipulation" }}>👤 {perfil.nome}</button>
      <button onClick={onLogout} style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.3)", borderRadius: 6, color: "#fff", padding: "7px 12px", cursor: "pointer", fontSize: 12, touchAction: "manipulation" }}>Sair</button>
    </div>
  </div>
);

function novaParcela() {
  const h = new Date();
  return { id: Date.now(), mes: h.getMonth() + 1, ano: h.getFullYear(), valor: "", pago: "" };
}

export default function App() {
  const [logado, setLogado] = useState(() => { try { return JSON.parse(sessionStorage.getItem("dpe_logado") || "null"); } catch { return null; } });
  const fazerLogin = (u) => { sessionStorage.setItem("dpe_logado", JSON.stringify(u)); setLogado(u); };
  const fazerLogout = () => { sessionStorage.removeItem("dpe_logado"); setLogado(null); };
  if (!logado) return <TelaLogin onLogin={fazerLogin} />;
  return <AppInterno usuario={logado} onLogout={fazerLogout} />;
}

function AppInterno({ usuario, onLogout }) {
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

  // ── CORREÇÃO: addIntervalo com deduplicação ──────────────────
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
    // Deduplicar: se já existe parcela com mesmo mês/ano, não adiciona novamente
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
          messages: [{ role: "user", content: [block, { type: "text", text: `Analise este documento e extraia: número do processo (CNJ), nome do alimentado, nome do alimentante, parcelas em atraso (mês 1-12, ano, valor). Responda SOMENTE em JSON: {"processo":"","alimentado":"","alimentante":"","parcelas":[{"mes":1,"ano":2024,"valor":1500.00}]}` }] }]
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

  // ── CORREÇÃO: Cálculo com crédito cascata dentro de cada bloco ──
  const calcular = () => {
    setLoading(true); setResultado(null);
    setTimeout(() => {
      // 1) Monta detalhes com saldo bruto (nominal - pago) por parcela
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

      // 2) Separar em blocos ANTES de aplicar créditos
      const prisaoRaw = detalhes.slice(-3);
      const penhoraRaw = detalhes.slice(0, -3);

      // 3) Função: aplicar crédito cascata dentro de um bloco
      //    - parcela com saldo negativo gera crédito
      //    - crédito abate parcelas mais antigas (do início do array) em ordem
      function aplicarCreditos(arr) {
        // Primeiro calcula sem cascata para ter os valores
        let credAcum = 0;
        // Coleta créditos (parcelas onde pago > nominal)
        const items = arr.map(p => ({ ...p, saldoFinal: p.saldoBruto, creditoAplicado: 0 }));
        // Passa 1: identifica créditos
        for (const it of items) {
          if (it.saldoFinal < 0) {
            credAcum += Math.abs(it.saldoFinal);
            it.saldoFinal = 0;
            it.quitado = true;
          }
        }
        // Passa 2: aplica crédito acumulado nas parcelas mais antigas (do início)
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
        // Passa 3: corrige monetariamente o saldo final
        return { items: items.map(it => {
          const calc = corrigir(Math.max(0, it.saldoFinal), it.mes, it.ano);
          return { ...it, ...calc, isCredito: false };
        }), creditoSobrando: credAcum };
      }

      const b2 = aplicarCreditos(penhoraRaw);
      const b1 = aplicarCreditos(prisaoRaw);

      // Se sobrou crédito do bloco 1, abate no bloco 2 (mais antigo primeiro)
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
        defensor: perfil.nome || usuario.nome || "", lotacao: perfil.lotacao || usuario.lotacao || "",
      };
      setResultado(res);
      const hist = [{ id: Date.now(), ...res, total: totalPrisao + totalPenhora }, ...historico].slice(0, 50);
      setHistorico(hist); localStorage.setItem("dpe_historico", JSON.stringify(hist));
      setLoading(false);
    }, 400);
  };

  // ── CORREÇÃO: PDF com logo, sem total geral, créditos dentro dos blocos ──
  const gerarPDF = async () => {
    if (!resultado) return;
    const jsPDFLib = window.jspdf?.jsPDF || window.jsPDF;
    if (!jsPDFLib) { alert("PDF não carregou. Recarregue a página."); return; }

    const logoData = await carregarLogo();
    const doc = new jsPDFLib({ orientation: "landscape", unit: "mm", format: "a4" });
    const W = 297, mg = 12; let y = 0;

    // ── Cabeçalho com logo ──
    doc.setFillColor(26, 107, 58); doc.rect(0, 0, W, 28, "F");
    if (logoData) {
      try { doc.addImage(logoData, "PNG", 8, 3, 22, 22); } catch {}
    }
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14); doc.setFont("helvetica", "bold");
    doc.text("MEMORIAL DE CÁLCULO", W / 2, 10, { align: "center" });
    doc.setFontSize(9); doc.setFont("helvetica", "normal");
    doc.text("Débito Alimentar — Execução de Alimentos (art. 528 CPC)", W / 2, 16, { align: "center" });
    doc.setFontSize(7.5);
    doc.text("APIDEP — Associação Piauiense das Defensoras e Defensores Públicos", W / 2, 22, { align: "center" });
    y = 36;

    // ── Dados do processo ──
    doc.setFillColor(232, 245, 238); doc.rect(mg, y, W - mg * 2, 28, "F");
    doc.setDrawColor(26, 107, 58); doc.setLineWidth(0.3); doc.rect(mg, y, W - mg * 2, 28);
    doc.setFillColor(26, 107, 58); doc.rect(mg, y, W - mg * 2, 7, "F");
    doc.setTextColor(255, 255, 255); doc.setFont("helvetica", "bold"); doc.setFontSize(8.5);
    doc.text("DADOS DO PROCESSO", mg + 3, y + 5);
    y += 9;
    const col1 = mg + 3, col2 = mg + 100, col3 = mg + 195;
    doc.setTextColor(40, 40, 40); doc.setFontSize(8);
    doc.setFont("helvetica", "bold"); doc.text("Processo nº:", col1, y);
    doc.setFont("helvetica", "normal"); doc.text(resultado.processo || "—", col1 + 22, y);
    doc.setFont("helvetica", "bold"); doc.text("Vara/Comarca:", col2, y);
    doc.setFont("helvetica", "normal"); doc.text(resultado.comarca || "—", col2 + 24, y);
    doc.setFont("helvetica", "bold"); doc.text("Data-base:", col3, y);
    doc.setFont("helvetica", "normal"); doc.text(resultado.data, col3 + 18, y);
    y += 6;
    doc.setFont("helvetica", "bold"); doc.text("Exequente:", col1, y);
    doc.setFont("helvetica", "normal"); doc.text(resultado.alimentado || "—", col1 + 18, y);
    doc.setFont("helvetica", "bold"); doc.text("Executado:", col2, y);
    doc.setFont("helvetica", "normal"); doc.text(resultado.alimentante || "—", col2 + 18, y);
    y += 6;
    const tipoLabel = resultado.tipoAlimento === "sm"
      ? `${resultado.percentualSM}% do salário mínimo federal`
      : `R$ ${Number(resultado.valorFixoAlimento || 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 })} (valor fixo)`;
    doc.setFont("helvetica", "bold"); doc.text("Alimentos fixados:", col1, y);
    doc.setFont("helvetica", "normal"); doc.text(tipoLabel, col1 + 30, y);
    doc.setFont("helvetica", "bold"); doc.text("Vencimento:", col2, y);
    doc.setFont("helvetica", "normal"); doc.text(`Dia ${resultado.diaVencimento} de cada mês`, col2 + 20, y);
    doc.setFont("helvetica", "bold"); doc.text("Índice:", col3, y);
    doc.setFont("helvetica", "normal"); doc.text("IPCA-E (Res. CJF nº 134/2010)", col3 + 12, y);
    y += 6;
    doc.setFont("helvetica", "bold"); doc.text("Juros de mora:", col1, y);
    doc.setFont("helvetica", "normal"); doc.text("1% ao mês — art. 406 CC c/c art. 161 §1º CTN", col1 + 24, y);
    y += 8;

    // ── Função de tabela (com coluna "Crédito Aplicado") ──
    const desenharTabela = (titulo, corRGB, items, subtotal, numInicio) => {
      if (y > 150) { doc.addPage(); y = 15; }
      doc.setFillColor(...corRGB); doc.rect(mg, y, W - mg * 2, 7, "F");
      doc.setTextColor(255, 255, 255); doc.setFont("helvetica", "bold"); doc.setFontSize(8.5);
      doc.text(titulo, mg + 3, y + 5);
      y += 9;

      const cw = [8, 18, 20, 20, 20, 18, 18, 18, 20, 20, 10, 18, 20];
      const cx = [mg]; cw.forEach((w, i) => cx.push(cx[i] + w + 1));
      const headers = ["#", "Compet.", "Vcto.", "SM Vig.", "Nominal", "Pago", "Créd.Apl.", "Saldo", "Fator", "Corrigido", "M.", "Juros", "Total"];

      doc.setFillColor(230, 230, 230); doc.rect(mg, y - 2, W - mg * 2, 6, "F");
      doc.setTextColor(40, 40, 40); doc.setFont("helvetica", "bold"); doc.setFontSize(6);
      headers.forEach((h, i) => doc.text(h, cx[i], y + 2));
      y += 7;

      items.forEach((p, i) => {
        if (y > 182) { doc.addPage(); y = 15; }
        if (i % 2 === 0) { doc.setFillColor(248, 250, 248); doc.rect(mg, y - 2, W - mg * 2, 5.5, "F"); }
        const vcto = `${String(resultado.diaVencimento).padStart(2,"0")}/${String(p.mes).padStart(2,"0")}/${p.ano}`;
        const smV = p.smVig || getSM(p.mes, p.ano);
        const fmtN = (v) => `R$ ${Number(v).toLocaleString("pt-BR", {minimumFractionDigits:2})}`;

        doc.setTextColor(40, 40, 40); doc.setFont("helvetica", "normal"); doc.setFontSize(6);
        doc.text(String(numInicio + i), cx[0], y + 2);
        doc.text(p.label, cx[1], y + 2);
        doc.text(vcto, cx[2], y + 2);
        doc.text(fmtN(smV), cx[3], y + 2);
        doc.text(fmtN(p.nominal), cx[4], y + 2);

        // Pago
        if (p.pago > 0) { doc.setTextColor(26, 107, 58); doc.setFont("helvetica", "bold"); }
        doc.text(fmtN(p.pago), cx[5], y + 2);
        doc.setTextColor(40, 40, 40); doc.setFont("helvetica", "normal");

        // Crédito aplicado
        if (p.creditoAplicado > 0) {
          doc.setTextColor(26, 107, 58); doc.setFont("helvetica", "bold");
          doc.text(fmtN(p.creditoAplicado), cx[6], y + 2);
          doc.setTextColor(40, 40, 40); doc.setFont("helvetica", "normal");
        } else {
          doc.text("—", cx[6], y + 2);
        }

        // Saldo
        doc.setFont("helvetica", "bold");
        if (p.quitado) {
          doc.setTextColor(26, 107, 58);
          doc.text("QUITADO", cx[7], y + 2);
        } else {
          doc.setTextColor(40, 40, 40);
          doc.text(fmtN(p.saldoFinal), cx[7], y + 2);
        }
        doc.setTextColor(40, 40, 40); doc.setFont("helvetica", "normal");

        doc.text(p.fator.toFixed(6), cx[8], y + 2);
        doc.text(fmtN(p.corrigido), cx[9], y + 2);
        doc.text(`${p.mesesAtraso}`, cx[10], y + 2);
        doc.text(fmtN(p.juros), cx[11], y + 2);
        doc.setFont("helvetica", "bold");
        if (p.quitado) { doc.setTextColor(26, 107, 58); doc.text("—", cx[12], y + 2); }
        else { doc.setTextColor(40, 40, 40); doc.text(fmt(p.total), cx[12], y + 2); }
        y += 5.5;
      });

      // Subtotal líquido do bloco
      doc.setFillColor(...corRGB); doc.rect(mg, y, W - mg * 2, 6, "F");
      doc.setTextColor(255, 255, 255); doc.setFont("helvetica", "bold"); doc.setFontSize(8);
      doc.text(`SUBTOTAL: ${fmt(subtotal)}`, W - mg - 3, y + 4, { align: "right" });
      y += 10;
    };

    // ── Desenhar Bloco 2 (penhora) e Bloco 1 (prisão) ──
    if (resultado.penhora.length > 0)
      desenharTabela("BLOCO 2 — DÉBITO ANTERIOR (Execução por Quantia Certa — art. 528, §8º CPC)", [26, 82, 118], resultado.penhora, resultado.totalPenhora, 1);
    if (resultado.prisao.length > 0)
      desenharTabela("BLOCO 1 — ÚLTIMAS 3 PARCELAS (Sujeitas a Prisão Civil — art. 528, §3º CPC)", [26, 107, 58], resultado.prisao, resultado.totalPrisao, resultado.penhora.length + 1);

    // ── SEM TOTAL GERAL SOMANDO OS BLOCOS — apenas resumo lado a lado ──
    if (y > 165) { doc.addPage(); y = 15; }
    const boxW = (W - mg * 2 - 4) / 2;
    // Bloco 1 box
    doc.setFillColor(26, 107, 58); doc.rect(mg, y, boxW, 22, "F");
    doc.setTextColor(255, 255, 255); doc.setFont("helvetica", "bold"); doc.setFontSize(8);
    doc.text("BLOCO 1 — PRISÃO CIVIL", mg + 3, y + 7);
    doc.setFontSize(7); doc.setFont("helvetica", "normal");
    doc.text("Últimas 3 parcelas — art. 528, §3° CPC", mg + 3, y + 12);
    doc.setFont("helvetica", "bold"); doc.setFontSize(12);
    doc.text(fmt(resultado.totalPrisao), mg + boxW / 2, y + 19, { align: "center" });
    // Bloco 2 box
    const x2 = mg + boxW + 4;
    doc.setFillColor(26, 82, 118); doc.rect(x2, y, boxW, 22, "F");
    doc.setTextColor(255, 255, 255); doc.setFont("helvetica", "bold"); doc.setFontSize(8);
    doc.text("BLOCO 2 — PENHORA", x2 + 3, y + 7);
    doc.setFontSize(7); doc.setFont("helvetica", "normal");
    doc.text("Parcelas anteriores — art. 528, §8° CPC", x2 + 3, y + 12);
    doc.setFont("helvetica", "bold"); doc.setFontSize(12);
    doc.text(fmt(resultado.totalPenhora), x2 + boxW / 2, y + 19, { align: "center" });
    y += 30;

    // ── Observações ──
    if (y > 170) { doc.addPage(); y = 15; }
    doc.setTextColor(40, 40, 40); doc.setFont("helvetica", "bold"); doc.setFontSize(8);
    doc.text("Observações:", mg, y); y += 5;
    doc.setFont("helvetica", "normal"); doc.setFontSize(7.5);
    [
      "1. Correção monetária aplicada pelo índice IPCA-E, conforme Resolução CJF nº 134/2010.",
      "2. Juros de mora de 1% ao mês, incidentes sobre o valor já corrigido (art. 406 CC c/c art. 161 §1º CTN).",
      `3. Valores calculados até a data-base de ${resultado.data}. Sujeitos a complementação até o efetivo pagamento.`,
      "4. Fonte dos fatores IPCA-E: tabela oficial acumulada mês a mês.",
      "5. Parcelas com pagamento excedente geram crédito aplicado às mais antigas do bloco.",
    ].forEach(o => { doc.text(o, mg, y); y += 4.5; });
    y += 8;

    // ── Assinatura ──
    if (y > 185) { doc.addPage(); y = 15; }
    const cidade = resultado.lotacao?.split("—")[1]?.trim() || resultado.comarca || "Teresina - PI";
    doc.setFont("helvetica", "normal"); doc.setFontSize(9);
    doc.text(`${cidade}, ${resultado.data}.`, W / 2, y, { align: "center" }); y += 12;
    doc.setDrawColor(80, 80, 80); doc.setLineWidth(0.3); doc.line(W / 2 - 45, y, W / 2 + 45, y); y += 5;
    doc.setFont("helvetica", "bold"); doc.setFontSize(9.5);
    doc.text(resultado.defensor || "", W / 2, y, { align: "center" }); y += 5;
    doc.setFont("helvetica", "normal"); doc.setFontSize(8.5);
    doc.text("Defensor(a) Público(a)", W / 2, y, { align: "center" }); y += 4;
    if (resultado.lotacao) doc.text(resultado.lotacao, W / 2, y, { align: "center" });

    const filename = `Memorial_Calculo_${resultado.processo || "calculo"}_${resultado.data.replace(/\//g, "-")}.pdf`;
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    if (isIOS) {
      const win = window.open();
      if (win) win.document.write(`<iframe src="${doc.output("datauristring")}" style="width:100%;height:100vh;border:none;"></iframe>`);
    } else { doc.save(filename); }
  };

  const inpStyle = { width: "100%", padding: "8px", borderRadius: 6, border: `1px solid ${C.borda}`, fontSize: 13, boxSizing: "border-box" };

  return (
    <div style={{ fontFamily: "'Segoe UI', Arial, sans-serif", minHeight: "100vh", background: "#f0f2f0" }}>
      <Header perfil={perfil} onPerfil={() => setShowPerfil(true)} onLogout={onLogout} />
      {showPerfil && <ModalPerfil perfil={perfil} onSave={salvarPerfil} onClose={() => setShowPerfil(false)} />}

      <div style={{ background: C.branco, borderBottom: `1px solid ${C.borda}`, display: "flex", padding: "0 28px" }}>
        {[["calc", "🧮 Novo Cálculo"], ["historico", "📋 Histórico"]].map(([id, label]) => (
          <button key={id} onClick={() => setTab(id)} style={{ padding: "14px 20px", border: "none", background: "transparent", cursor: "pointer", fontWeight: 600, fontSize: 14, color: tab === id ? C.verde : C.cinza, borderBottom: tab === id ? `3px solid ${C.verde}` : "3px solid transparent", touchAction: "manipulation" }}>{label}</button>
        ))}
      </div>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "24px 16px" }}>
        {tab === "calc" && (
          <>
            {!perfil.nome && (
              <div style={{ background: "#fff8e1", border: "1px solid #f0c040", borderRadius: 8, padding: "12px 18px", marginBottom: 18, fontSize: 14 }}>
                ⚠️ <strong>Configure seu perfil</strong> para que seu nome apareça nos PDFs.{" "}
                <span style={{ color: C.verde, cursor: "pointer", textDecoration: "underline" }} onClick={() => setShowPerfil(true)}>Configurar agora</span>
              </div>
            )}

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
              <Card style={{ margin: 0, borderTop: `3px solid ${C.azul}` }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                  <span style={{ fontSize: 20 }}>🤖</span>
                  <div>
                    <div style={{ fontWeight: 700, color: C.azul, fontSize: 14 }}>Opção A — Importar com IA</div>
                    <div style={{ fontSize: 11, color: "#666" }}>Envie a sentença e a IA preenche tudo</div>
                  </div>
                </div>
                <input ref={fileRef} type="file" accept=".pdf,image/*" onChange={handleUpload} style={{ display: "none" }} />
                <Btn onClick={() => fileRef.current.click()} disabled={loadingIA} cor={C.azul} small>
                  {loadingIA ? "⏳ Processando…" : "📄 Selecionar PDF ou imagem"}
                </Btn>
                {msgIA && <div style={{ marginTop: 8, fontSize: 12, color: msgIA.startsWith("✅") ? C.verde : C.vermelho }}>{msgIA}</div>}
                {!perfil.apiKey && <div style={{ marginTop: 6, fontSize: 11, color: "#999" }}>⚠️ Requer chave de API no perfil.</div>}
              </Card>
              <Card style={{ margin: 0, borderTop: `3px solid ${C.verde}` }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                  <span style={{ fontSize: 20 }}>✏️</span>
                  <div>
                    <div style={{ fontWeight: 700, color: C.verde, fontSize: 14 }}>Opção B — Inserir manualmente</div>
                    <div style={{ fontSize: 11, color: "#666" }}>Sempre disponível, sem conta ou chave</div>
                  </div>
                </div>
                <div style={{ fontSize: 12, color: "#555" }}>Preencha os dados do processo e parcelas abaixo.</div>
                <div style={{ marginTop: 10 }}>
                  <span style={{ background: C.verdePale, color: C.verde, borderRadius: 20, padding: "3px 10px", fontSize: 11, fontWeight: 600 }}>✅ Sempre disponível</span>
                </div>
              </Card>
            </div>

            <Card>
              <h3 style={{ margin: "0 0 16px", color: C.verde, fontSize: 15 }}>📁 Dados do Processo</h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
                <Input label="Número do Processo" value={processo} onChange={setProcesso} placeholder="0000000-00.0000.8.18.0000" />
                <Input label="Vara/Comarca" value={comarca} onChange={setComarca} placeholder="1ª Vara — Itaueira/PI" />
                <Input label="Nome do Alimentado(a) / Exequente" value={alimentado} onChange={setAlimentado} placeholder="Nome completo" />
                <Input label="Nome do Alimentante / Executado" value={alimentante} onChange={setAlimentante} placeholder="Nome completo" />
              </div>
              <div style={{ marginBottom: 14 }}>
                <label style={{ display: "block", fontWeight: 600, marginBottom: 8, color: C.cinza, fontSize: 13 }}>Alimentos fixados em</label>
                <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
                  {[["sm", "% do Salário Mínimo"], ["fixo", "Valor fixo (R$)"]].map(([val, label]) => (
                    <button key={val} onClick={() => setTipoAlimento(val)} style={{ padding: "7px 16px", borderRadius: 6, border: `2px solid ${tipoAlimento === val ? C.verde : C.borda}`, background: tipoAlimento === val ? C.verde : C.branco, color: tipoAlimento === val ? "#fff" : C.cinza, fontWeight: 600, fontSize: 13, cursor: "pointer", touchAction: "manipulation" }}>{label}</button>
                  ))}
                </div>
                {tipoAlimento === "sm"
                  ? <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <input type="number" value={percentualSM} onChange={e => setPercentualSM(e.target.value)} placeholder="ex: 20"
                        style={{ width: 100, padding: "9px 12px", borderRadius: 6, border: `1px solid ${C.borda}`, fontSize: 14, boxSizing: "border-box" }} />
                      <span style={{ fontSize: 14, color: C.cinza }}>% do salário mínimo federal</span>
                    </div>
                  : <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: 14, color: C.cinza }}>R$</span>
                      <input type="number" value={valorFixoAlimento} onChange={e => setValorFixoAlimento(e.target.value)} placeholder="0,00"
                        style={{ width: 150, padding: "9px 12px", borderRadius: 6, border: `1px solid ${C.borda}`, fontSize: 14, boxSizing: "border-box" }} />
                    </div>
                }
              </div>
              <div style={{ maxWidth: 200 }}>
                <Input label="Dia de vencimento" value={diaVencimento} onChange={setDiaVencimento} placeholder="5" type="number" />
              </div>
            </Card>

            <Card>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <h3 style={{ margin: 0, color: C.verde, fontSize: 15 }}>💰 Parcelas em Atraso</h3>
                <div style={{ display: "flex", gap: 8 }}>
                  <Btn small onClick={() => setShowIntervalo(s => !s)} cor={C.azul}>📅 Intervalo</Btn>
                  <Btn small onClick={addParcela} cor={C.verdeClaro}>+ Avulsa</Btn>
                  {parcelas.length > 0 && <Btn small onClick={limparParcelas} cor={C.vermelho} outline>🗑 Limpar tudo</Btn>}
                </div>
              </div>

              {showIntervalo && (
                <div style={{ background: "#e8f0f820", border: `1px solid ${C.azul}`, borderRadius: 8, padding: 16, marginBottom: 16 }}>
                  <div style={{ fontWeight: 700, color: C.azul, marginBottom: 8 }}>📅 Adicionar intervalo de parcelas</div>
                  <div style={{ fontSize: 12, color: "#555", marginBottom: 12, background: "#e8f0f8", padding: "8px 12px", borderRadius: 6 }}>
                    Valor automático: <strong>{tipoAlimento === "sm" ? `${percentualSM || "?"}% do SM vigente em cada mês` : `R$ ${valorFixoAlimento || "?"} (fixo)`}</strong>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 8, alignItems: "end" }}>
                    <div>
                      <label style={{ fontSize: 11, fontWeight: 600, color: C.cinza, display: "block", marginBottom: 3 }}>Mês inicial</label>
                      <select value={intervalo.mesIni} onChange={e => setIntervalo(i => ({ ...i, mesIni: Number(e.target.value) }))} style={inpStyle}>
                        {MESES.map((m, idx) => <option key={idx} value={idx + 1}>{m}</option>)}
                      </select>
                    </div>
                    <div>
                      <label style={{ fontSize: 11, fontWeight: 600, color: C.cinza, display: "block", marginBottom: 3 }}>Ano inicial</label>
                      <input type="number" value={intervalo.anoIni} onChange={e => setIntervalo(i => ({ ...i, anoIni: Number(e.target.value) }))} style={inpStyle} />
                    </div>
                    <div>
                      <label style={{ fontSize: 11, fontWeight: 600, color: C.cinza, display: "block", marginBottom: 3 }}>Mês final</label>
                      <select value={intervalo.mesFim} onChange={e => setIntervalo(i => ({ ...i, mesFim: Number(e.target.value) }))} style={inpStyle}>
                        {MESES.map((m, idx) => <option key={idx} value={idx + 1}>{m}</option>)}
                      </select>
                    </div>
                    <div>
                      <label style={{ fontSize: 11, fontWeight: 600, color: C.cinza, display: "block", marginBottom: 3 }}>Ano final</label>
                      <input type="number" value={intervalo.anoFim} onChange={e => setIntervalo(i => ({ ...i, anoFim: Number(e.target.value) }))} style={inpStyle} />
                    </div>
                    <div>
                      <label style={{ fontSize: 11, fontWeight: 600, color: C.cinza, display: "block", marginBottom: 3 }}>Já pago em todos (R$)</label>
                      <input type="number" value={intervalo.pago} onChange={e => setIntervalo(i => ({ ...i, pago: e.target.value }))} placeholder="0,00" style={inpStyle} />
                    </div>
                  </div>
                  <div style={{ marginTop: 12, display: "flex", gap: 8, alignItems: "center" }}>
                    <button onClick={addIntervalo} style={{ padding: "6px 14px", borderRadius: 6, border: `2px solid ${C.azul}`, background: C.azul, color: "#fff", fontWeight: 600, fontSize: 13, cursor: "pointer", touchAction: "manipulation" }}>✅ Adicionar intervalo</button>
                    <button onClick={() => setShowIntervalo(false)} style={{ padding: "6px 14px", borderRadius: 6, border: `2px solid ${C.cinza}`, background: "transparent", color: C.cinza, fontWeight: 600, fontSize: 13, cursor: "pointer", touchAction: "manipulation" }}>Fechar</button>
                    <span style={{ fontSize: 12, color: C.azul }}>→ {contarParcelas()} parcela(s)</span>
                  </div>
                  <div style={{ marginTop: 6, fontSize: 11, color: "#888" }}>💡 Parcelas com mesmo mês/ano já existentes serão ignoradas automaticamente.</div>
                </div>
              )}

              {parcelas.map((p) => (
                <div key={p.id} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr auto", gap: 10, alignItems: "end", marginBottom: 10, padding: 12, background: C.cinzaClaro, borderRadius: 8 }}>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 600, color: C.cinza, display: "block", marginBottom: 3 }}>Mês</label>
                    <select value={p.mes} onChange={e => editParcela(p.id, "mes", Number(e.target.value))} style={inpStyle}>
                      {MESES.map((m, idx) => <option key={idx} value={idx + 1}>{m}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 600, color: C.cinza, display: "block", marginBottom: 3 }}>Ano</label>
                    <input type="number" value={p.ano} onChange={e => editParcela(p.id, "ano", Number(e.target.value))} style={inpStyle} />
                  </div>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 600, color: C.cinza, display: "block", marginBottom: 3 }}>Valor (R$)</label>
                    <input type="number" value={p.valor} onChange={e => editParcela(p.id, "valor", e.target.value)} placeholder="0,00" style={inpStyle} />
                  </div>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 600, color: C.cinza, display: "block", marginBottom: 3 }}>Já pago (R$)</label>
                    <input type="number" value={p.pago} onChange={e => editParcela(p.id, "pago", e.target.value)} placeholder="0,00" style={inpStyle} />
                  </div>
                  <button onClick={() => removeParcela(p.id)} style={{ background: "transparent", border: "none", cursor: "pointer", color: C.vermelho, fontSize: 18, paddingBottom: 4, touchAction: "manipulation" }}>✕</button>
                </div>
              ))}

              <div style={{ marginTop: 16 }}>
                <Btn onClick={calcular} disabled={loading || parcelas.every(p => !p.valor)}>
                  {loading ? "⏳ Calculando…" : "🧮 Calcular Débito"}
                </Btn>
              </div>
            </Card>

            {resultado && (
              <Card style={{ borderLeft: `4px solid ${C.verde}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                  <h3 style={{ margin: 0, color: C.verde }}>📊 Resultado do Cálculo</h3>
                  <Btn onClick={gerarPDF} cor={C.azul}>📄 Gerar PDF</Btn>
                </div>
                {resultado.processo && <p style={{ margin: "0 0 4px", fontSize: 13, color: "#666" }}>Processo: <strong>{resultado.processo}</strong></p>}
                {resultado.alimentado && <p style={{ margin: "0 0 16px", fontSize: 13, color: "#666" }}>Alimentado(a): <strong>{resultado.alimentado}</strong></p>}

                {resultado.prisao.length > 0 && (
                  <div style={{ background: C.verdePale, border: `1px solid ${C.verde}`, borderRadius: 8, padding: 16, marginBottom: 12 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                      <div style={{ fontWeight: 700, color: C.verde }}>BLOCO 1 — Prisão Civil (últimas 3 parcelas)</div>
                      <span style={{ background: C.verde, color: "#fff", borderRadius: 20, padding: "3px 12px", fontSize: 12, fontWeight: 700 }}>{fmt(resultado.totalPrisao)}</span>
                    </div>
                    <div style={{ fontSize: 12, color: "#555", marginBottom: 6 }}>Art. 528, §3° CPC</div>
                    {resultado.prisao.map((p, i) => (
                      <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginTop: 4 }}>
                        <span>
                          {p.label}
                          {p.pago > 0 && <span style={{ color: C.verde, fontSize: 11 }}> (pago: {fmt(p.pago)})</span>}
                          {p.creditoAplicado > 0 && <span style={{ color: C.azul, fontSize: 11 }}> (créd: {fmt(p.creditoAplicado)})</span>}
                          {p.quitado && <span style={{ color: C.verde, fontSize: 11, fontWeight: 700 }}> ✅ QUITADO</span>}
                        </span>
                        <span style={{ fontWeight: 600, color: p.quitado ? C.verde : "inherit" }}>
                          {p.quitado ? "—" : fmt(p.total)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {resultado.penhora.length > 0 && (
                  <div style={{ background: "#e8f0f8", border: `1px solid ${C.azul}`, borderRadius: 8, padding: 16, marginBottom: 12 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                      <div style={{ fontWeight: 700, color: C.azul }}>BLOCO 2 — Penhora (parcelas anteriores)</div>
                      <span style={{ background: C.azul, color: "#fff", borderRadius: 20, padding: "3px 12px", fontSize: 12, fontWeight: 700 }}>{fmt(resultado.totalPenhora)}</span>
                    </div>
                    {resultado.penhora.map((p, i) => (
                      <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginTop: 4 }}>
                        <span>
                          {p.label}
                          {p.pago > 0 && <span style={{ color: C.verde, fontSize: 11 }}> (pago: {fmt(p.pago)})</span>}
                          {p.creditoAplicado > 0 && <span style={{ color: C.azul, fontSize: 11 }}> (créd: {fmt(p.creditoAplicado)})</span>}
                          {p.quitado && <span style={{ color: C.verde, fontSize: 11, fontWeight: 700 }}> ✅ QUITADO</span>}
                        </span>
                        <span style={{ fontWeight: 600, color: p.quitado ? C.verde : "inherit" }}>
                          {p.quitado ? "—" : fmt(p.total)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 8 }}>
                  <div style={{ background: C.verde, borderRadius: 8, padding: "12px 16px", textAlign: "center" }}>
                    <div style={{ color: "#fff", fontSize: 11, opacity: .8 }}>BLOCO 1 — Prisão Civil</div>
                    <div style={{ color: "#fff", fontWeight: 800, fontSize: 18 }}>{fmt(resultado.totalPrisao)}</div>
                  </div>
                  <div style={{ background: C.azul, borderRadius: 8, padding: "12px 16px", textAlign: "center" }}>
                    <div style={{ color: "#fff", fontSize: 11, opacity: .8 }}>BLOCO 2 — Penhora</div>
                    <div style={{ color: "#fff", fontWeight: 800, fontSize: 18 }}>{fmt(resultado.totalPenhora)}</div>
                  </div>
                </div>
                <p style={{ fontSize: 11, color: "#888", marginTop: 10 }}>
                  Correção por IPCA-E + juros 1% a.m. (art. 406 CC c/c art. 528 CPC) • {resultado.data}
                </p>
              </Card>
            )}
          </>
        )}

        {tab === "historico" && (
          <Card>
            <h3 style={{ margin: "0 0 16px", color: C.verde }}>📋 Histórico de Cálculos</h3>
            {historico.length === 0
              ? <p style={{ color: "#888", textAlign: "center", padding: 32 }}>Nenhum cálculo realizado ainda.</p>
              : historico.map(h => (
                <div key={h.id} style={{ borderBottom: `1px solid ${C.borda}`, padding: "14px 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{h.alimentado || "Alimentado não informado"}</div>
                    <div style={{ fontSize: 12, color: "#888" }}>{h.processo || "Sem número"} • {h.data}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontWeight: 700, color: C.verde, fontSize: 15 }}>{fmt(h.total || 0)}</div>
                  </div>
                </div>
              ))
            }
            {historico.length > 0 && (
              <div style={{ marginTop: 16 }}>
                <Btn small outline cor={C.vermelho} onClick={() => { if (confirm("Limpar todo o histórico?")) { setHistorico([]); localStorage.removeItem("dpe_historico"); } }}>🗑 Limpar histórico</Btn>
              </div>
            )}
          </Card>
        )}
      </div>
    </div>
  );
}
