// v3.0
import { useState, useRef } from "react";

// ── Cores ──────────────────────────────────────────────────────
const C = {
  verde: "#1a6b3a", verdeClaro: "#2d8a50", verdePale: "#e8f5ee",
  cinza: "#4a4a4a", cinzaClaro: "#f5f5f5", branco: "#ffffff",
  borda: "#d0d0d0", vermelho: "#c0392b", azul: "#1a5276",
};

// ── Defensores (lista fechada) ─────────────────────────────────
const DEFENSORES = {
  "Dr. Robert Rios Júnior": "2ª Defensoria Itinerante",
  "Dra. Andrea Melo de Carvalho": "1ª Defensoria de Família",
  "Dra. Dayana Sampaio Mendes Magalhães": "2ª Defensoria Pública Regional de Altos",
  "Dra. Priscila Gimenes do Nascimento Godói": "2ª Defensoria Regional de União",
};
const SENHA_CORRETA = "JB2027";

// ── Salário Mínimo ─────────────────────────────────────────────
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
  "2026-01":1518,"2026-02":1518,"2026-03":1518,"2026-04":1518,
};
const getSM = (mes, ano) => SALARIO_MINIMO[`${ano}-${String(mes).padStart(2,"0")}`] || 1518;

// ── IPCA-E ─────────────────────────────────────────────────────
const IPCA_E = {
  "2022-01":0.54,"2022-02":0.58,"2022-03":1.05,"2022-04":1.06,"2022-05":0.81,"2022-06":0.68,
  "2022-07":-0.07,"2022-08":-0.04,"2022-09":0.24,"2022-10":0.40,"2022-11":0.54,"2022-12":0.54,
  "2023-01":0.53,"2023-02":0.39,"2023-03":0.17,"2023-04":0.23,"2023-05":0.22,"2023-06":0.06,
  "2023-07":0.18,"2023-08":0.37,"2023-09":0.26,"2023-10":0.24,"2023-11":0.33,"2023-12":0.44,
  "2024-01":0.42,"2024-02":0.40,"2024-03":0.36,"2024-04":0.38,"2024-05":0.40,"2024-06":0.39,
  "2024-07":0.43,"2024-08":0.44,"2024-09":0.44,"2024-10":0.56,"2024-11":0.39,"2024-12":0.48,
  "2025-01":0.41,"2025-02":1.23,"2025-03":0.44,
};

// ── Utilitários ────────────────────────────────────────────────
const fmt = (v) => Number(v).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
const fmtMes = (mes, ano) => {
  const n = ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"];
  return `${n[mes-1]}/${ano}`;
};
const toTitle = (str) => str ? str.replace(/\w\S*/g, t => t.charAt(0).toUpperCase() + t.slice(1).toLowerCase()) : "";

// Corrige valor pelo IPCA-E — COM ou SEM juros
function corrigir(valor, mes, ano, comJuros = true) {
  if (valor <= 0) return { fator: 1, corrigido: 0, juros: 0, total: 0, mesesAtraso: 0 };
  const hoje = new Date();
  let fator = 1, m = mes, a = ano;
  while (a < hoje.getFullYear() || (a === hoje.getFullYear() && m < hoje.getMonth() + 1)) {
    const k = `${a}-${String(m).padStart(2,"0")}`;
    if (IPCA_E[k] !== undefined) fator *= (1 + IPCA_E[k] / 100);
    m++; if (m > 12) { m = 1; a++; }
  }
  const mesesAtraso = Math.max(0,
    (hoje.getFullYear() - ano) * 12 + (hoje.getMonth() - (mes - 1))
  );
  const corrigido = valor * fator;
  const juros = comJuros ? corrigido * mesesAtraso * 0.01 : 0;
  return { fator, corrigido, juros, total: corrigido + juros, mesesAtraso };
}

const MESES = ["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];

// ── Componentes base ───────────────────────────────────────────
const Btn = ({ children, onClick, cor = C.verde, outline = false, small = false, disabled = false }) => (
  <button onClick={onClick} disabled={disabled} style={{
    background: outline ? "transparent" : (disabled ? "#aaa" : cor),
    color: outline ? cor : "#fff",
    border: `2px solid ${disabled ? "#aaa" : cor}`,
    borderRadius: 6, padding: small ? "6px 14px" : "10px 22px",
    cursor: disabled ? "not-allowed" : "pointer",
    fontWeight: 600, fontSize: small ? 13 : 15,
    touchAction: "manipulation", WebkitTapHighlightColor: "transparent",
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
  <div style={{ background: C.branco, borderRadius: 10, border: `1px solid ${C.borda}`, padding: 24, marginBottom: 20, ...style }}>
    {children}
  </div>
);

// ── Modal Perfil ───────────────────────────────────────────────
const ModalPerfil = ({ perfil, onSave, onClose }) => {
  const [nome, setNome] = useState(perfil.nome || "");
  const [senha, setSenha] = useState(perfil.senha || "");
  const [showSenha, setShowSenha] = useState(false);
  const [erro, setErro] = useState("");

  const lotacao = DEFENSORES[nome] || "";

  const salvar = () => {
    if (!nome) { setErro("Selecione um defensor."); return; }
    if (senha !== SENHA_CORRETA) { setErro("Senha incorreta."); return; }
    onSave({ nome, lotacao, senha });
    onClose();
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ background: C.branco, borderRadius: 12, padding: 32, width: 480, boxShadow: "0 8px 32px rgba(0,0,0,0.2)" }}>
        <h2 style={{ margin: "0 0 6px", color: C.verde }}>⚙ Configurar Perfil</h2>
        <p style={{ fontSize: 12, color: "#888", marginBottom: 20 }}>Acesso restrito. Apenas defensores autorizados.</p>

        <div style={{ marginBottom: 14 }}>
          <label style={{ display: "block", fontWeight: 600, marginBottom: 4, color: C.cinza, fontSize: 13 }}>Nome do Defensor</label>
          <select value={nome} onChange={e => setNome(e.target.value)}
            style={{ width: "100%", padding: "9px 12px", borderRadius: 6, border: `1px solid ${C.borda}`, fontSize: 14, boxSizing: "border-box" }}>
            <option value="">— Selecione —</option>
            {Object.keys(DEFENSORES).map(n => <option key={n} value={n}>{n}</option>)}
          </select>
        </div>

        {nome && (
          <div style={{ background: C.verdePale, borderRadius: 6, padding: "8px 12px", marginBottom: 14, fontSize: 13 }}>
            📍 {DEFENSORES[nome]}
          </div>
        )}

        <div style={{ marginBottom: 14 }}>
          <label style={{ display: "block", fontWeight: 600, marginBottom: 4, color: C.cinza, fontSize: 13 }}>Senha de Acesso</label>
          <div style={{ position: "relative" }}>
            <input type={showSenha ? "text" : "password"} value={senha} onChange={e => setSenha(e.target.value)} placeholder="Digite a senha"
              style={{ width: "100%", padding: "9px 40px 9px 12px", borderRadius: 6, border: `1px solid ${C.borda}`, fontSize: 14, boxSizing: "border-box" }} />
            <button onClick={() => setShowSenha(s => !s)}
              style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", fontSize: 16 }}>
              {showSenha ? "🙈" : "👁"}
            </button>
          </div>
        </div>

        {erro && <div style={{ color: C.vermelho, fontSize: 13, marginBottom: 12 }}>⚠️ {erro}</div>}

        <div style={{ display: "flex", gap: 10 }}>
          <Btn onClick={salvar}>Entrar</Btn>
          <Btn onClick={onClose} outline cor={C.cinza}>Cancelar</Btn>
        </div>
      </div>
    </div>
  );
};

// ── Header ─────────────────────────────────────────────────────
const Header = ({ perfil, onPerfil, logado }) => (
  <div style={{ background: C.verde, color: "#fff", padding: "12px 28px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
      <img src="/logo-apidep.png" alt="APIDEP" style={{ height: 56, objectFit: "contain" }} onError={e => e.target.style.display = "none"} />
      <div>
        <div style={{ fontWeight: 800, fontSize: 16 }}>Calculadora de Débitos Alimentares</div>
        <div style={{ fontSize: 12, opacity: .8 }}>APIDEP — Associação Piauiense das Defensoras e Defensores Públicos</div>
      </div>
    </div>
    <button onClick={onPerfil} style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.4)", borderRadius: 6, color: "#fff", padding: "7px 14px", cursor: "pointer", fontSize: 13, touchAction: "manipulation" }}>
      {logado ? `✅ ${perfil.nome.split(" ")[1]}` : "🔒 Fazer Login"}
    </button>
  </div>
);

function novaParcela() {
  const h = new Date();
  return { id: Date.now(), mes: h.getMonth() + 1, ano: h.getFullYear(), valor: "", pago: "" };
}

// ── App Principal ──────────────────────────────────────────────
export default function App() {
  const [perfil, setPerfil] = useState(() => { try { return JSON.parse(localStorage.getItem("dpe_perfil_v3") || "{}"); } catch { return {}; } });
  const [showPerfil, setShowPerfil] = useState(false);
  const [tab, setTab] = useState("calc");
  const [historico, setHistorico] = useState(() => { try { return JSON.parse(localStorage.getItem("dpe_historico_v3") || "[]"); } catch { return []; } });

  const logado = !!(perfil.nome && DEFENSORES[perfil.nome] && perfil.senha === SENHA_CORRETA);

  // Dados do processo
  const [processo, setProcesso] = useState("");
  const [alimentado, setAlimentado] = useState("");
  const [alimentante, setAlimentante] = useState("");
  const [comarca, setComarca] = useState("");
  const [diaVencimento, setDiaVencimento] = useState("5");
  const [tipoAlimento, setTipoAlimento] = useState("sm");
  const [percentualSM, setPercentualSM] = useState("");
  const [valorFixoAlimento, setValorFixoAlimento] = useState("");

  // Parcelas
  const [parcelas, setParcelas] = useState([novaParcela()]);
  const [showIntervalo, setShowIntervalo] = useState(false);
  const [intervalo, setIntervalo] = useState({ mesIni: 1, anoIni: 2024, mesFim: 12, anoFim: 2024, pago: "" });

  const [resultado, setResultado] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingIA, setLoadingIA] = useState(false);
  const [msgIA, setMsgIA] = useState("");
  const fileRef = useRef();

  const salvarPerfil = (p) => { setPerfil(p); localStorage.setItem("dpe_perfil_v3", JSON.stringify(p)); };

  const addParcela = () => setParcelas(p => [...p, novaParcela()]);
  const removeParcela = (id) => setParcelas(p => p.filter(x => x.id !== id));
  const editParcela = (id, campo, val) => setParcelas(p => p.map(x => x.id === id ? { ...x, [campo]: val } : x));
  const limparParcelas = () => { if (window.confirm("Apagar todas as parcelas?")) setParcelas([]); };

  const contarParcelas = () => {
    let n = 0, m = intervalo.mesIni, a = intervalo.anoIni;
    while (a < intervalo.anoFim || (a === intervalo.anoFim && m <= intervalo.mesFim)) { n++; m++; if (m > 12) { m = 1; a++; } }
    return n;
  };

  const addIntervalo = () => {
    const novas = [];
    let m = intervalo.mesIni, a = intervalo.anoIni;
    while (a < intervalo.anoFim || (a === intervalo.anoFim && m <= intervalo.mesFim)) {
      const smVig = getSM(m, a);
      const valor = tipoAlimento === "sm"
        ? (smVig * Number(percentualSM) / 100).toFixed(2)
        : valorFixoAlimento;
      novas.push({ id: Date.now() + novas.length, mes: m, ano: a, valor, pago: intervalo.pago || "" });
      m++; if (m > 12) { m = 1; a++; }
    }
    setParcelas(p => [...p, ...novas]);
    setIntervalo(i => ({ ...i, pago: "" }));
  };

  // ── Upload IA ──────────────────────────────────────────────
  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setLoadingIA(true); setMsgIA("Lendo documento com IA…");
    try {
      const base64 = await new Promise((res, rej) => { const r = new FileReader(); r.onload = () => res(r.result.split(",")[1]); r.onerror = rej; r.readAsDataURL(file); });
      const block = file.type === "application/pdf"
        ? { type: "document", source: { type: "base64", media_type: "application/pdf", data: base64 } }
        : { type: "image", source: { type: "base64", media_type: file.type, data: base64 } };
      const resp = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-api-key": perfil.apiKey || "", "anthropic-version": "2023-06-01" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514", max_tokens: 1000,
          messages: [{ role: "user", content: [block, { type: "text", text: `Analise e extraia: número do processo, nome do alimentado, nome do alimentante, parcelas em atraso. Responda SOMENTE em JSON: {"processo":"","alimentado":"","alimentante":"","parcelas":[{"mes":1,"ano":2024,"valor":1500.00}]}` }] }]
        })
      });
      const data = await resp.json();
      const parsed = JSON.parse((data.content?.find(b => b.type === "text")?.text || "").replace(/```json|```/g, "").trim());
      if (parsed.processo) setProcesso(parsed.processo);
      if (parsed.alimentado) setAlimentado(parsed.alimentado);
      if (parsed.alimentante) setAlimentante(parsed.alimentante);
      if (parsed.parcelas?.length) setParcelas(parsed.parcelas.map((p, i) => ({ id: Date.now() + i, mes: p.mes, ano: p.ano, valor: String(p.valor), pago: "" })));
      setMsgIA(`✅ ${parsed.parcelas?.length || 0} parcela(s) extraída(s). Revise antes de calcular.`);
    } catch { setMsgIA("❌ Não foi possível ler o documento."); }
    setLoadingIA(false);
    if (fileRef.current) fileRef.current.value = "";
  };

  // ── Cálculo (especificação final) ──────────────────────────
  const calcular = () => {
    if (!logado) {
      alert("Esse aplicativo está disponibilizado em fase experimental apenas para Defensores Legais, se você não tem senha, você não deve ser legal.");
      return;
    }
    setLoading(true); setResultado(null);
    setTimeout(() => {
      // 1. Desduplicar por mês/ano (manter apenas a primeira ocorrência)
      const seen = new Set();
      const raw = parcelas
        .filter(p => p.valor && Number(p.valor) > 0)
        .sort((a, b) => a.ano !== b.ano ? a.ano - b.ano : a.mes - b.mes)
        .filter(p => {
          const key = `${p.ano}-${p.mes}`;
          if (seen.has(key)) return false;
          seen.add(key); return true;
        })
        .map(p => ({
          mes: p.mes, ano: p.ano, label: fmtMes(p.mes, p.ano),
          smVig: getSM(p.mes, p.ano),
          nominal: Number(p.valor) || 0,
          pago: Number(p.pago) || 0,
        }));

      if (!raw.length) { setLoading(false); return; }

      // 2. Separar: últimas 3 = prisão, resto = penhora
      const rawPrisao = raw.slice(-3);
      const rawPenhora = raw.slice(0, -3);

      // 3. Calcular créditos (pago > nominal) — corrigidos SEM juros
      const creditos = raw
        .filter(p => p.pago > p.nominal)
        .map(p => {
          const excedente = p.pago - p.nominal;
          const calc = corrigir(excedente, p.mes, p.ano, false); // SEM juros
          return { ...p, excedente, creditoCorrigido: calc.corrigido };
        });
      const totalCreditoCorrigido = creditos.reduce((s, c) => s + c.creditoCorrigido, 0);

      // 4. Calcular débitos do Bloco 1 (prisão) — saldo = nominal - pago (mínimo 0)
      const bloco1 = rawPrisao.map(p => {
        const saldo = Math.max(0, p.nominal - p.pago);
        const calc = corrigir(saldo, p.mes, p.ano, true);
        return { ...p, saldo, ...calc };
      });

      // 5. Calcular débitos do Bloco 2 (penhora) — saldo = nominal - pago (mínimo 0)
      const bloco2 = rawPenhora.map(p => {
        const saldo = Math.max(0, p.nominal - p.pago);
        const calc = corrigir(saldo, p.mes, p.ano, true);
        return { ...p, saldo, ...calc };
      });

      const totalBloco1 = bloco1.reduce((s, p) => s + p.total, 0);
      const totalBloco2Bruto = bloco2.reduce((s, p) => s + p.total, 0);
      const totalBloco2Liquido = Math.max(0, totalBloco2Bruto - totalCreditoCorrigido);

      const res = {
        processo, alimentado, alimentante, comarca, diaVencimento,
        tipoAlimento, percentualSM, valorFixoAlimento,
        bloco1, bloco2, creditos,
        totalBloco1, totalBloco2Bruto, totalCreditoCorrigido, totalBloco2Liquido,
        data: new Date().toLocaleDateString("pt-BR"),
        defensor: perfil.nome || "", lotacao: perfil.lotacao || "",
      };
      setResultado(res);
      const hist = [{ id: Date.now(), ...res }, ...historico].slice(0, 50);
      setHistorico(hist); localStorage.setItem("dpe_historico_v3", JSON.stringify(hist));
      setLoading(false);
    }, 400);
  };

  // ── Geração de PDF ─────────────────────────────────────────
  const gerarPDF = async () => {
    if (!resultado) return;
    if (!logado) { alert("Esse aplicativo está disponibilizado em fase experimental apenas para Defensores Legais, se você não tem senha, você não deve ser legal."); return; }
    const jsPDFLib = window.jspdf?.jsPDF || window.jsPDF;
    if (!jsPDFLib) { alert("PDF não carregou. Recarregue a página."); return; }

    const doc = new jsPDFLib({ orientation: "landscape", unit: "mm", format: "a4" });
    const W = 297, mg = 12; let y = 0;

    // ── Cabeçalho ──
    doc.setFillColor(26, 107, 58); doc.rect(0, 0, W, 30, "F");
    try {
      const resp = await fetch("/logo-apidep.png");
      const blob = await resp.blob();
      const b64 = await new Promise(res => { const r = new FileReader(); r.onload = () => res(r.result); r.readAsDataURL(blob); });
      const img = await new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = b64; });
      const lh = 24, lw = lh * (img.naturalWidth / img.naturalHeight);
      doc.addImage(b64, "PNG", mg, 3, lw, lh);
    } catch (e) { }
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(15); doc.setFont("helvetica", "bold"); doc.text("MEMORIAL DE CÁLCULO", W / 2, 11, { align: "center" });
    doc.setFontSize(9); doc.setFont("helvetica", "normal"); doc.text("Débito Alimentar — Execução de Alimentos (art. 528 CPC)", W / 2, 18, { align: "center" });
    doc.setFontSize(7.5); doc.text("APIDEP — Associação Piauiense das Defensoras e Defensores Públicos", W / 2, 24, { align: "center" });
    y = 38;

    // ── Dados do processo ──
    doc.setFillColor(232, 245, 238); doc.rect(mg, y, W - mg * 2, 30, "F");
    doc.setDrawColor(26, 107, 58); doc.setLineWidth(0.3); doc.rect(mg, y, W - mg * 2, 30);
    doc.setFillColor(26, 107, 58); doc.rect(mg, y, W - mg * 2, 8, "F");
    doc.setTextColor(255, 255, 255); doc.setFont("helvetica", "bold"); doc.setFontSize(8.5);
    doc.text("DADOS DO PROCESSO", mg + 4, y + 5.5);
    y += 11;

    const c1 = mg + 4, c2 = mg + 100, c3 = mg + 200;
    doc.setTextColor(40, 40, 40); doc.setFontSize(8);
    const linha = (label, valor, x, yy) => {
      doc.setFont("helvetica", "bold"); doc.text(label, x, yy);
      doc.setFont("helvetica", "normal"); doc.text(toTitle(valor) || "—", x + doc.getTextWidth(label) + 2, yy);
    };
    linha("Processo nº:", resultado.processo, c1, y);
    linha("Vara/Comarca:", toTitle(resultado.comarca), c2, y);
    linha("Data-base:", resultado.data, c3, y);
    y += 6;
    linha("Exequente:", toTitle(resultado.alimentado), c1, y);
    linha("Executado:", toTitle(resultado.alimentante), c2, y);
    y += 6;
    const tipoLabel = resultado.tipoAlimento === "sm"
      ? `${resultado.percentualSM}% do Salário Mínimo Federal`
      : `R$ ${Number(resultado.valorFixoAlimento || 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 })} (Valor Fixo)`;
    linha("Alimentos Fixados:", tipoLabel, c1, y);
    linha("Vencimento:", `Dia ${resultado.diaVencimento} de Cada Mês`, c2, y);
    linha("Índice:", "IPCA-E (Res. CJF nº 134/2010)", c3, y);
    y += 6;
    doc.setFont("helvetica", "bold"); doc.text("Juros de Mora:", c1, y);
    doc.setFont("helvetica", "normal"); doc.text("1% ao mês — art. 406 CC c/c art. 161 §1º CTN", c1 + 24, y);
    y += 8;

    // ── Função tabela ──
    const tabelaBloco = (titulo, corRGB, items, numInicio) => {
      if (y > 150) { doc.addPage(); y = 15; }
      doc.setFillColor(...corRGB); doc.rect(mg, y, W - mg * 2, 8, "F");
      doc.setTextColor(255, 255, 255); doc.setFont("helvetica", "bold"); doc.setFontSize(8.5);
      doc.text(titulo, mg + 4, y + 5.5);
      y += 10;

      const headers = ["#", "Competência", "Vcto.", "SM Vigente", "Val. Nominal", "Já Pago", "Saldo Dev.", "Fator IPCA-E", "Val. Corrigido", "Meses", "Juros (R$)", "Total Parcela"];
      const cw =     [  7,           18,     18,          22,           22,         18,          20,             20,              22,        12,          20,            22];
      const cx = [mg + 2]; cw.forEach((w, i) => cx.push(cx[i] + w + 1));

      doc.setFillColor(225, 225, 225); doc.rect(mg, y - 2, W - mg * 2, 6, "F");
      doc.setTextColor(40, 40, 40); doc.setFont("helvetica", "bold"); doc.setFontSize(6.5);
      headers.forEach((h, i) => doc.text(h, cx[i], y + 2));
      y += 7;

      items.forEach((p, i) => {
        if (y > 182) { doc.addPage(); y = 15; }
        if (i % 2 === 0) { doc.setFillColor(248, 250, 248); doc.rect(mg, y - 2, W - mg * 2, 5.5, "F"); }
        const vcto = `${String(resultado.diaVencimento).padStart(2,"0")}/${String(p.mes).padStart(2,"0")}/${p.ano}`;
        doc.setTextColor(40, 40, 40); doc.setFont("helvetica", "normal"); doc.setFontSize(6.5);
        doc.text(String(numInicio + i), cx[0], y + 2);
        doc.text(p.label, cx[1], y + 2);
        doc.text(vcto, cx[2], y + 2);
        doc.text(`R$ ${p.smVig.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`, cx[3], y + 2);
        doc.text(`R$ ${p.nominal.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`, cx[4], y + 2);
        if (p.pago > 0) { doc.setTextColor(26, 107, 58); doc.setFont("helvetica", "bold"); }
        doc.text(`R$ ${p.pago.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`, cx[5], y + 2);
        doc.setTextColor(p.saldo === 0 ? 26 : 40, p.saldo === 0 ? 107 : 40, p.saldo === 0 ? 58 : 40);
        doc.setFont("helvetica", p.saldo === 0 ? "bold" : "normal");
        doc.text(p.saldo === 0 ? "QUITADO" : `R$ ${p.saldo.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`, cx[6], y + 2);
        doc.setTextColor(40, 40, 40); doc.setFont("helvetica", "normal");
        doc.text(p.fator.toFixed(6), cx[7], y + 2);
        doc.text(`R$ ${p.corrigido.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`, cx[8], y + 2);
        doc.text(`${p.mesesAtraso}m`, cx[9], y + 2);
        doc.text(`R$ ${p.juros.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`, cx[10], y + 2);
        doc.setFont("helvetica", "bold");
        doc.text(p.saldo === 0 ? "—" : fmt(p.total), cx[11], y + 2);
        y += 5.5;
      });

      doc.setFillColor(...corRGB); doc.rect(mg, y, W - mg * 2, 6, "F");
      doc.setTextColor(255, 255, 255); doc.setFont("helvetica", "bold"); doc.setFontSize(8);
      doc.text(`SUBTOTAL: ${fmt(items.reduce((s, p) => s + p.total, 0))}`, W - mg - 3, y + 4, { align: "right" });
      y += 10;
    };

    // ── Desenhar blocos ──
    if (resultado.bloco2.length > 0)
      tabelaBloco("BLOCO 2 — DÉBITO ANTERIOR (Execução por Quantia Certa — art. 528, §8º CPC)", [26, 82, 118], resultado.bloco2, 1);
    if (resultado.bloco1.length > 0)
      tabelaBloco("BLOCO 1 — ÚLTIMAS 3 PARCELAS (Sujeitas a Prisão Civil — art. 528, §3º CPC)", [26, 107, 58], resultado.bloco1, resultado.bloco2.length + 1);

    // ── Créditos (se houver) ──
    if (resultado.creditos.length > 0) {
      if (y > 160) { doc.addPage(); y = 15; }
      doc.setFillColor(100, 100, 100); doc.rect(mg, y, W - mg * 2, 8, "F");
      doc.setTextColor(255, 255, 255); doc.setFont("helvetica", "bold"); doc.setFontSize(8.5);
      doc.text("CRÉDITOS — Pagamentos Superiores ao Devido (aplicados ao Bloco 2)", mg + 4, y + 5.5);
      y += 10;

      const headers = ["#", "Competência", "Vcto.", "SM Vigente", "Val. Nominal", "Valor Pago", "Excedente", "Fator IPCA-E", "Crédito Corrigido", "Obs."];
      const cw =     [  7,           18,     18,          22,           22,          22,          20,             20,              30,         40];
      const cx = [mg + 2]; cw.forEach((w, i) => cx.push(cx[i] + w + 1));

      doc.setFillColor(225, 225, 225); doc.rect(mg, y - 2, W - mg * 2, 6, "F");
      doc.setTextColor(40, 40, 40); doc.setFont("helvetica", "bold"); doc.setFontSize(6.5);
      headers.forEach((h, i) => doc.text(h, cx[i], y + 2));
      y += 7;

      resultado.creditos.forEach((c, i) => {
        if (y > 182) { doc.addPage(); y = 15; }
        if (i % 2 === 0) { doc.setFillColor(240, 248, 240); doc.rect(mg, y - 2, W - mg * 2, 5.5, "F"); }
        const vcto = `${String(resultado.diaVencimento).padStart(2,"0")}/${String(c.mes).padStart(2,"0")}/${c.ano}`;
        doc.setTextColor(40, 40, 40); doc.setFont("helvetica", "normal"); doc.setFontSize(6.5);
        doc.text(String(resultado.bloco2.length + resultado.bloco1.length + i + 1), cx[0], y + 2);
        doc.text(c.label, cx[1], y + 2);
        doc.text(vcto, cx[2], y + 2);
        doc.text(`R$ ${c.smVig.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`, cx[3], y + 2);
        doc.text(`R$ ${c.nominal.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`, cx[4], y + 2);
        doc.setTextColor(26, 107, 58); doc.setFont("helvetica", "bold");
        doc.text(`R$ ${c.pago.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`, cx[5], y + 2);
        doc.text(`R$ ${c.excedente.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`, cx[6], y + 2);
        doc.setTextColor(40, 40, 40); doc.setFont("helvetica", "normal");
        doc.text(c.fator.toFixed(6), cx[7], y + 2);
        doc.setTextColor(26, 107, 58); doc.setFont("helvetica", "bold");
        doc.text(fmt(c.creditoCorrigido), cx[8], y + 2);
        doc.setTextColor(80, 80, 80); doc.setFont("helvetica", "normal"); doc.setFontSize(6);
        doc.text("Corrigido s/ juros — aplicado ao Bloco 2", cx[9], y + 2);
        y += 5.5;
      });

      doc.setFillColor(100, 100, 100); doc.rect(mg, y, W - mg * 2, 6, "F");
      doc.setTextColor(255, 255, 255); doc.setFont("helvetica", "bold"); doc.setFontSize(8);
      doc.text(`TOTAL CRÉDITOS: ${fmt(resultado.totalCreditoCorrigido)}`, W - mg - 3, y + 4, { align: "right" });
      y += 10;
    }

    // ── RESULTADO FINAL — dois blocos lado a lado ──
    if (y > 160) { doc.addPage(); y = 15; }
    const bw = (W - mg * 2 - 4) / 2;

    // Bloco 1
    doc.setFillColor(26, 107, 58); doc.rect(mg, y, bw, 24, "F");
    doc.setTextColor(255, 255, 255); doc.setFont("helvetica", "bold"); doc.setFontSize(9);
    doc.text("BLOCO 1 — RITO DA PRISÃO", mg + bw / 2, y + 7, { align: "center" });
    doc.setFontSize(7); doc.setFont("helvetica", "normal");
    doc.text("Últimas 3 parcelas — art. 528, §3° CPC", mg + bw / 2, y + 12, { align: "center" });
    doc.setFont("helvetica", "bold"); doc.setFontSize(13);
    doc.text(fmt(resultado.totalBloco1), mg + bw / 2, y + 21, { align: "center" });

    // Bloco 2
    const x2 = mg + bw + 4;
    doc.setFillColor(26, 82, 118); doc.rect(x2, y, bw, 24, "F");
    doc.setTextColor(255, 255, 255); doc.setFont("helvetica", "bold"); doc.setFontSize(9);
    doc.text("BLOCO 2 — RITO DA PENHORA", x2 + bw / 2, y + 7, { align: "center" });
    doc.setFontSize(7); doc.setFont("helvetica", "normal");
    if (resultado.creditos.length > 0) {
      doc.text(`Débitos: ${fmt(resultado.totalBloco2Bruto)}  (−) Créditos: ${fmt(resultado.totalCreditoCorrigido)}`, x2 + bw / 2, y + 12, { align: "center" });
    } else {
      doc.text("Parcelas anteriores — art. 528, §8° CPC", x2 + bw / 2, y + 12, { align: "center" });
    }
    doc.setFont("helvetica", "bold"); doc.setFontSize(13);
    doc.text(fmt(resultado.totalBloco2Liquido), x2 + bw / 2, y + 21, { align: "center" });
    y += 32;

    // ── Observações ──
    if (y > 175) { doc.addPage(); y = 15; }
    doc.setTextColor(40, 40, 40); doc.setFont("helvetica", "bold"); doc.setFontSize(8);
    doc.text("Observações:", mg, y); y += 5;
    doc.setFont("helvetica", "normal"); doc.setFontSize(7.5);
    const obs = [
      "1. Correção monetária: IPCA-E acumulado mês a mês (Res. CJF nº 134/2010).",
      "2. Juros de mora: 1% ao mês sobre o valor corrigido (art. 406 CC c/c art. 161 §1º CTN).",
      "3. Créditos (pagamentos excedentes) corrigidos monetariamente SEM juros e aplicados exclusivamente ao Bloco 2.",
      `4. Data-base: ${resultado.data}. Valores sujeitos a complementação até o efetivo pagamento.`,
    ];
    obs.forEach(o => { doc.text(o, mg, y); y += 4.5; });
    y += 8;

    // ── Assinatura ──
    if (y > 185) { doc.addPage(); y = 15; }
    const cidade = resultado.lotacao?.split("—")[1]?.trim() || toTitle(resultado.comarca) || "Teresina - PI";
    doc.setFont("helvetica", "normal"); doc.setFontSize(9);
    doc.text(`${cidade}, ${resultado.data}.`, W / 2, y, { align: "center" }); y += 12;
    doc.setDrawColor(80, 80, 80); doc.setLineWidth(0.3); doc.line(W / 2 - 50, y, W / 2 + 50, y); y += 5;
    doc.setFont("helvetica", "bold"); doc.setFontSize(10);
    doc.text(resultado.defensor, W / 2, y, { align: "center" }); y += 5;
    doc.setFont("helvetica", "normal"); doc.setFontSize(8.5);
    doc.text("Defensor(a) Público(a)", W / 2, y, { align: "center" }); y += 4;
    doc.text(resultado.lotacao, W / 2, y, { align: "center" });

    const fn = `Memorial_${resultado.processo || "calculo"}_${resultado.data.replace(/\//g,"-")}.pdf`;
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    if (isIOS) {
      const win = window.open();
      if (win) win.document.write(`<iframe src="${doc.output("datauristring")}" style="width:100%;height:100vh;border:none;"></iframe>`);
    } else { doc.save(fn); }
  };

  const inpStyle = { width: "100%", padding: "8px", borderRadius: 6, border: `1px solid ${C.borda}`, fontSize: 13, boxSizing: "border-box" };

  // ── Render ─────────────────────────────────────────────────
  return (
    <div style={{ fontFamily: "'Segoe UI', Arial, sans-serif", minHeight: "100vh", background: "#f0f2f0" }}>
      <Header perfil={perfil} onPerfil={() => setShowPerfil(true)} logado={logado} />
      {showPerfil && <ModalPerfil perfil={perfil} onSave={salvarPerfil} onClose={() => setShowPerfil(false)} />}

      <div style={{ background: C.branco, borderBottom: `1px solid ${C.borda}`, display: "flex", padding: "0 28px" }}>
        {[["calc","🧮 Novo Cálculo"],["historico","📋 Histórico"]].map(([id,label]) => (
          <button key={id} onClick={() => setTab(id)} style={{ padding: "14px 20px", border: "none", background: "transparent", cursor: "pointer", fontWeight: 600, fontSize: 14, color: tab === id ? C.verde : C.cinza, borderBottom: tab === id ? `3px solid ${C.verde}` : "3px solid transparent", touchAction: "manipulation" }}>{label}</button>
        ))}
      </div>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "24px 16px" }}>
        {tab === "calc" && (
          <>
            {!logado && (
              <div style={{ background: "#fff3cd", border: "1px solid #f0c040", borderRadius: 8, padding: "14px 18px", marginBottom: 18, fontSize: 14 }}>
                🔒 <strong>Acesso restrito.</strong> Faça login para usar o sistema.{" "}
                <span style={{ color: C.verde, cursor: "pointer", textDecoration: "underline" }} onClick={() => setShowPerfil(true)}>Fazer login</span>
              </div>
            )}

            {/* Opções A e B */}
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
                <Btn onClick={() => fileRef.current.click()} disabled={loadingIA} cor={C.azul} small>{loadingIA ? "⏳ Processando…" : "📄 Selecionar PDF ou imagem"}</Btn>
                {msgIA && <div style={{ marginTop: 8, fontSize: 12, color: msgIA.startsWith("✅") ? C.verde : C.vermelho }}>{msgIA}</div>}
              </Card>
              <Card style={{ margin: 0, borderTop: `3px solid ${C.verde}` }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                  <span style={{ fontSize: 20 }}>✏️</span>
                  <div>
                    <div style={{ fontWeight: 700, color: C.verde, fontSize: 14 }}>Opção B — Inserir manualmente</div>
                    <div style={{ fontSize: 11, color: "#666" }}>Sempre disponível</div>
                  </div>
                </div>
                <div style={{ fontSize: 12, color: "#555" }}>Preencha os dados do processo e parcelas abaixo.</div>
                <div style={{ marginTop: 10 }}>
                  <span style={{ background: C.verdePale, color: C.verde, borderRadius: 20, padding: "3px 10px", fontSize: 11, fontWeight: 600 }}>✅ Sempre disponível</span>
                </div>
              </Card>
            </div>

            {/* Dados do processo */}
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
                  {[["sm","% do Salário Mínimo"],["fixo","Valor fixo (R$)"]].map(([val,label]) => (
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
                      <span style={{ fontSize: 14 }}>R$</span>
                      <input type="number" value={valorFixoAlimento} onChange={e => setValorFixoAlimento(e.target.value)} placeholder="0,00"
                        style={{ width: 150, padding: "9px 12px", borderRadius: 6, border: `1px solid ${C.borda}`, fontSize: 14, boxSizing: "border-box" }} />
                    </div>
                }
              </div>
              <div style={{ maxWidth: 200 }}>
                <Input label="Dia de vencimento" value={diaVencimento} onChange={setDiaVencimento} placeholder="5" type="number" />
              </div>
            </Card>

            {/* Parcelas */}
            <Card>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <h3 style={{ margin: 0, color: C.verde, fontSize: 15 }}>💰 Parcelas em Atraso</h3>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <Btn small onClick={() => setShowIntervalo(s => !s)} cor={C.azul}>📅 Intervalo</Btn>
                  <Btn small onClick={addParcela} cor={C.verdeClaro}>+ Avulsa</Btn>
                  {parcelas.length > 0 && <Btn small onClick={limparParcelas} cor={C.vermelho} outline>🗑 Limpar</Btn>}
                </div>
              </div>

              {showIntervalo && (
                <div style={{ background: "#e8f0f820", border: `1px solid ${C.azul}`, borderRadius: 8, padding: 16, marginBottom: 16 }}>
                  <div style={{ fontWeight: 700, color: C.azul, marginBottom: 8 }}>📅 Adicionar intervalo de parcelas</div>
                  <div style={{ fontSize: 12, color: "#555", marginBottom: 12, background: "#e8f0f8", padding: "8px 12px", borderRadius: 6 }}>
                    Valor calculado automaticamente: <strong>
                      {tipoAlimento === "sm" ? `${percentualSM || "?"}% do SM vigente em cada mês` : `R$ ${valorFixoAlimento || "?"} (fixo)`}
                    </strong>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 8, alignItems: "end" }}>
                    <div><label style={{ fontSize: 11, fontWeight: 600, color: C.cinza, display: "block", marginBottom: 3 }}>Mês inicial</label>
                      <select value={intervalo.mesIni} onChange={e => setIntervalo(i => ({ ...i, mesIni: Number(e.target.value) }))} style={inpStyle}>
                        {MESES.map((m, idx) => <option key={idx} value={idx+1}>{m}</option>)}
                      </select></div>
                    <div><label style={{ fontSize: 11, fontWeight: 600, color: C.cinza, display: "block", marginBottom: 3 }}>Ano inicial</label>
                      <input type="number" value={intervalo.anoIni} onChange={e => setIntervalo(i => ({ ...i, anoIni: Number(e.target.value) }))} style={inpStyle} /></div>
                    <div><label style={{ fontSize: 11, fontWeight: 600, color: C.cinza, display: "block", marginBottom: 3 }}>Mês final</label>
                      <select value={intervalo.mesFim} onChange={e => setIntervalo(i => ({ ...i, mesFim: Number(e.target.value) }))} style={inpStyle}>
                        {MESES.map((m, idx) => <option key={idx} value={idx+1}>{m}</option>)}
                      </select></div>
                    <div><label style={{ fontSize: 11, fontWeight: 600, color: C.cinza, display: "block", marginBottom: 3 }}>Ano final</label>
                      <input type="number" value={intervalo.anoFim} onChange={e => setIntervalo(i => ({ ...i, anoFim: Number(e.target.value) }))} style={inpStyle} /></div>
                    <div><label style={{ fontSize: 11, fontWeight: 600, color: C.cinza, display: "block", marginBottom: 3 }}>Já pago em todos (R$)</label>
                      <input type="number" value={intervalo.pago} onChange={e => setIntervalo(i => ({ ...i, pago: e.target.value }))} placeholder="0,00 ou vazio" style={inpStyle} /></div>
                  </div>
                  <div style={{ marginTop: 12, display: "flex", gap: 8, alignItems: "center" }}>
                    <button onClick={addIntervalo} style={{ padding: "6px 16px", borderRadius: 6, border: `2px solid ${C.azul}`, background: C.azul, color: "#fff", fontWeight: 600, fontSize: 13, cursor: "pointer", touchAction: "manipulation" }}>
                      ✅ Adicionar intervalo
                    </button>
                    <button onClick={() => setShowIntervalo(false)} style={{ padding: "6px 16px", borderRadius: 6, border: `2px solid ${C.cinza}`, background: "transparent", color: C.cinza, fontWeight: 600, fontSize: 13, cursor: "pointer", touchAction: "manipulation" }}>
                      Fechar
                    </button>
                    <span style={{ fontSize: 12, color: C.azul }}>→ {contarParcelas()} parcela(s)</span>
                  </div>
                  <div style={{ marginTop: 6, fontSize: 11, color: "#888" }}>💡 Clique quantas vezes quiser para acumular vários intervalos.</div>
                </div>
              )}

              {parcelas.map(p => (
                <div key={p.id} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr auto", gap: 10, alignItems: "end", marginBottom: 10, padding: 12, background: C.cinzaClaro, borderRadius: 8 }}>
                  <div><label style={{ fontSize: 12, fontWeight: 600, color: C.cinza, display: "block", marginBottom: 3 }}>Mês</label>
                    <select value={p.mes} onChange={e => editParcela(p.id, "mes", Number(e.target.value))} style={inpStyle}>
                      {MESES.map((m, idx) => <option key={idx} value={idx+1}>{m}</option>)}
                    </select></div>
                  <div><label style={{ fontSize: 12, fontWeight: 600, color: C.cinza, display: "block", marginBottom: 3 }}>Ano</label>
                    <input type="number" value={p.ano} onChange={e => editParcela(p.id, "ano", Number(e.target.value))} style={inpStyle} /></div>
                  <div><label style={{ fontSize: 12, fontWeight: 600, color: C.cinza, display: "block", marginBottom: 3 }}>Valor (R$)</label>
                    <input type="number" value={p.valor} onChange={e => editParcela(p.id, "valor", e.target.value)} placeholder="0,00" style={inpStyle} /></div>
                  <div><label style={{ fontSize: 12, fontWeight: 600, color: C.cinza, display: "block", marginBottom: 3 }}>Já pago (R$)</label>
                    <input type="number" value={p.pago} onChange={e => editParcela(p.id, "pago", e.target.value)} placeholder="0,00" style={inpStyle} /></div>
                  <button onClick={() => removeParcela(p.id)} style={{ background: "transparent", border: "none", cursor: "pointer", color: C.vermelho, fontSize: 18, paddingBottom: 4, touchAction: "manipulation" }}>✕</button>
                </div>
              ))}

              <div style={{ marginTop: 16 }}>
                <Btn onClick={calcular} disabled={loading || parcelas.every(p => !p.valor)}>
                  {loading ? "⏳ Calculando…" : "🧮 Calcular Débito"}
                </Btn>
              </div>
            </Card>

            {/* Resultado na tela */}
            {resultado && (
              <Card style={{ borderLeft: `4px solid ${C.verde}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                  <h3 style={{ margin: 0, color: C.verde }}>📊 Resultado</h3>
                  <button onClick={gerarPDF} style={{ padding: "10px 22px", borderRadius: 6, border: `2px solid ${C.azul}`, background: C.azul, color: "#fff", fontWeight: 600, fontSize: 15, cursor: "pointer", touchAction: "manipulation" }}>📄 Gerar PDF</button>
                </div>

                {resultado.processo && <p style={{ margin: "0 0 16px", fontSize: 13, color: "#666" }}>Processo: <strong>{resultado.processo}</strong> | Exequente: <strong>{toTitle(resultado.alimentado)}</strong></p>}

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                  <div style={{ background: C.verdePale, border: `2px solid ${C.verde}`, borderRadius: 10, padding: 20 }}>
                    <div style={{ fontWeight: 700, color: C.verde, fontSize: 15, marginBottom: 4 }}>BLOCO 1 — Rito da Prisão</div>
                    <div style={{ fontSize: 11, color: "#666", marginBottom: 12 }}>Últimas 3 parcelas — art. 528, §3° CPC</div>
                    <div style={{ fontWeight: 800, color: C.verde, fontSize: 24 }}>{fmt(resultado.totalBloco1)}</div>
                    {resultado.bloco1.map((p, i) => (
                      <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginTop: 6, borderTop: "1px solid #c8e8c8", paddingTop: 4 }}>
                        <span>{p.label}{p.pago > 0 && <span style={{ color: C.verde }}> (pago: {fmt(p.pago)})</span>}</span>
                        <span style={{ fontWeight: 600 }}>{p.saldo === 0 ? "—" : fmt(p.total)}</span>
                      </div>
                    ))}
                  </div>

                  <div style={{ background: "#e8f0f8", border: `2px solid ${C.azul}`, borderRadius: 10, padding: 20 }}>
                    <div style={{ fontWeight: 700, color: C.azul, fontSize: 15, marginBottom: 4 }}>BLOCO 2 — Rito da Penhora</div>
                    <div style={{ fontSize: 11, color: "#666", marginBottom: 12 }}>Parcelas anteriores — art. 528, §8° CPC</div>
                    {resultado.creditos.length > 0 && (
                      <div style={{ fontSize: 12, color: "#666", marginBottom: 8 }}>
                        Débitos: {fmt(resultado.totalBloco2Bruto)}<br />
                        <span style={{ color: C.verde }}>(-) Créditos: {fmt(resultado.totalCreditoCorrigido)}</span>
                      </div>
                    )}
                    <div style={{ fontWeight: 800, color: C.azul, fontSize: 24 }}>{fmt(resultado.totalBloco2Liquido)}</div>
                  </div>
                </div>

                <p style={{ fontSize: 11, color: "#888" }}>
                  Correção IPCA-E + juros 1% a.m. | Créditos corrigidos sem juros aplicados ao Bloco 2 • {resultado.data}
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
                <div key={h.id} style={{ borderBottom: `1px solid ${C.borda}`, padding: "14px 0", display: "flex", justifyContent: "space-between" }}>
                  <div>
                    <div style={{ fontWeight: 600 }}>{toTitle(h.alimentado) || "—"}</div>
                    <div style={{ fontSize: 12, color: "#888" }}>{h.processo || "Sem número"} • {h.data}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 11, color: C.verde }}>Bloco 1: {fmt(h.totalBloco1)}</div>
                    <div style={{ fontSize: 11, color: C.azul }}>Bloco 2: {fmt(h.totalBloco2Liquido)}</div>
                  </div>
                </div>
              ))
            }
            {historico.length > 0 && (
              <div style={{ marginTop: 16 }}>
                <Btn small outline cor={C.vermelho} onClick={() => { if (confirm("Limpar histórico?")) { setHistorico([]); localStorage.removeItem("dpe_historico_v3"); } }}>🗑 Limpar histórico</Btn>
              </div>
            )}
          </Card>
        )}
      </div>
    </div>
  );
}
