import { useState, useEffect, useRef } from "react";

// ── Paleta DPE/PI ──────────────────────────────────────────────
const C = {
  verde: "#1a6b3a",
  verdeClaro: "#2d8a50",
  verdePale: "#e8f5ee",
  cinza: "#4a4a4a",
  cinzaClaro: "#f5f5f5",
  branco: "#ffffff",
  borda: "#d0d0d0",
  vermelho: "#c0392b",
  azul: "#1a5276",
};

// ── Utilitários ────────────────────────────────────────────────
const fmt = (v) =>
  Number(v).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const fmtMes = (mes, ano) => {
  const nomes = ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"];
  return `${nomes[mes - 1]}/${ano}`;
};

// Salário mínimo histórico por mês/ano
const SALARIO_MINIMO = {
  "2020-01":1045,"2020-02":1045,"2020-03":1045,"2020-04":1045,"2020-05":1045,
  "2020-06":1045,"2020-07":1045,"2020-08":1045,"2020-09":1045,"2020-10":1045,
  "2020-11":1045,"2020-12":1045,
  "2021-01":1100,"2021-02":1100,"2021-03":1100,"2021-04":1100,"2021-05":1100,
  "2021-06":1100,"2021-07":1100,"2021-08":1100,"2021-09":1100,"2021-10":1100,
  "2021-11":1100,"2021-12":1100,
  "2022-01":1212,"2022-02":1212,"2022-03":1212,"2022-04":1212,"2022-05":1212,
  "2022-06":1212,"2022-07":1212,"2022-08":1212,"2022-09":1212,"2022-10":1212,
  "2022-11":1212,"2022-12":1212,
  "2023-01":1320,"2023-02":1320,"2023-03":1320,"2023-04":1320,"2023-05":1320,
  "2023-06":1320,"2023-07":1320,"2023-08":1320,"2023-09":1320,"2023-10":1320,
  "2023-11":1320,"2023-12":1320,
  "2024-01":1412,"2024-02":1412,"2024-03":1412,"2024-04":1412,"2024-05":1412,
  "2024-06":1412,"2024-07":1412,"2024-08":1412,"2024-09":1412,"2024-10":1412,
  "2024-11":1412,"2024-12":1412,
  "2025-01":1518,"2025-02":1518,"2025-03":1518,"2025-04":1518,"2025-05":1518,
  "2025-06":1518,"2025-07":1518,"2025-08":1518,"2025-09":1518,"2025-10":1518,
  "2025-11":1518,"2025-12":1518,
  "2026-01":1518,"2026-02":1518,"2026-03":1518,"2026-04":1518,
};

function getSalarioMinimo(mes, ano) {
  const chave = `${ano}-${String(mes).padStart(2,"0")}`;
  return SALARIO_MINIMO[chave] || 1518; // fallback para o mais recente
}

// IPCA-E acumulado mensal simplificado (base real — valores aproximados para demonstração)
// Em produção, deve-se buscar via API do BCB
const IPCA_E = {
  "2022-01":0.54,"2022-02":0.58,"2022-03":1.05,"2022-04":1.06,"2022-05":0.81,
  "2022-06":0.68,"2022-07":-0.07,"2022-08":-0.04,"2022-09":0.24,"2022-10":0.40,
  "2022-11":0.54,"2022-12":0.54,"2023-01":0.53,"2023-02":0.39,"2023-03":0.17,
  "2023-04":0.23,"2023-05":0.22,"2023-06":0.06,"2023-07":0.18,"2023-08":0.37,
  "2023-09":0.26,"2023-10":0.24,"2023-11":0.33,"2023-12":0.44,"2024-01":0.42,
  "2024-02":0.40,"2024-03":0.36,"2024-04":0.38,"2024-05":0.40,"2024-06":0.39,
  "2024-07":0.43,"2024-08":0.44,"2024-09":0.44,"2024-10":0.56,"2024-11":0.39,
  "2024-12":0.48,"2025-01":0.41,"2025-02":1.23,"2025-03":0.44,
};

function corrigirParcela(valor, mesVenc, anoVenc) {
  const hoje = new Date();
  const anoAtual = hoje.getFullYear();
  const mesAtual = hoje.getMonth() + 1;

  let fator = 1;
  let m = mesVenc, a = anoVenc;
  while (a < anoAtual || (a === anoAtual && m < mesAtual)) {
    const chave = `${a}-${String(m).padStart(2,"0")}`;
    const taxa = IPCA_E[chave];
    if (taxa !== undefined) fator *= (1 + taxa / 100);
    m++;
    if (m > 12) { m = 1; a++; }
  }

  // Juros moratórios 1% a.m.
  const hoje2 = new Date();
  const venc = new Date(anoVenc, mesVenc - 1, 1);
  const mesesAtraso = Math.max(0,
    (hoje2.getFullYear() - venc.getFullYear()) * 12 +
    (hoje2.getMonth() - venc.getMonth())
  );
  const juros = mesesAtraso * 0.01;

  const corrigido = valor * fator;
  const comJuros = corrigido * (1 + juros);
  return { original: valor, fator, corrigido, juros: comJuros - corrigido, total: comJuros, mesesAtraso };
}

// ── Componentes de UI ──────────────────────────────────────────
const Btn = ({ children, onClick, cor = C.verde, outline = false, small = false, disabled = false }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    style={{
      background: outline ? "transparent" : cor,
      color: outline ? cor : C.branco,
      border: `2px solid ${cor}`,
      borderRadius: 6,
      padding: small ? "6px 14px" : "10px 22px",
      cursor: disabled ? "not-allowed" : "pointer",
      fontWeight: 600,
      fontSize: small ? 13 : 15,
      opacity: disabled ? 0.5 : 1,
      transition: "all .2s",
    }}
  >
    {children}
  </button>
);

const Input = ({ label, value, onChange, placeholder, type = "text", disabled }) => (
  <div style={{ marginBottom: 14 }}>
    {label && <label style={{ display: "block", fontWeight: 600, marginBottom: 4, color: C.cinza, fontSize: 13 }}>{label}</label>}
    <input
      type={type}
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      disabled={disabled}
      style={{
        width: "100%", padding: "9px 12px", borderRadius: 6,
        border: `1px solid ${C.borda}`, fontSize: 14, boxSizing: "border-box",
        background: disabled ? C.cinzaClaro : C.branco,
      }}
    />
  </div>
);

const Card = ({ children, style = {} }) => (
  <div style={{ background: C.branco, borderRadius: 10, border: `1px solid ${C.borda}`, padding: 24, marginBottom: 20, ...style }}>
    {children}
  </div>
);

const Badge = ({ children, cor }) => (
  <span style={{ background: cor, color: C.branco, borderRadius: 20, padding: "3px 12px", fontSize: 12, fontWeight: 700 }}>
    {children}
  </span>
);

// ── Header ─────────────────────────────────────────────────────
const Header = ({ perfil, onPerfil }) => (
  <div style={{ background: C.verde, color: C.branco, padding: "12px 28px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
      <img
        src="/logo-apidep.png"
        alt="APIDEP"
        style={{ height: 48, objectFit: "contain", background: C.branco, borderRadius: 6, padding: "3px 6px" }}
        onError={e => { e.target.style.display = "none"; }}
      />
      <div>
        <div style={{ fontWeight: 800, fontSize: 16 }}>Calculadora de Débitos Alimentares</div>
        <div style={{ fontSize: 12, opacity: .8 }}>APIDEP — Associação Piauiense das Defensoras e Defensores Públicos</div>
      </div>
    </div>
    <button onClick={onPerfil} style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.4)", borderRadius: 6, color: C.branco, padding: "7px 14px", cursor: "pointer", fontSize: 13 }}>
      {perfil.nome ? `👤 ${perfil.nome.split(" ")[0]}` : "⚙ Configurar Perfil"}
    </button>
  </div>
);

// ── Modal Perfil ───────────────────────────────────────────────
const ModalPerfil = ({ perfil, onSave, onClose }) => {
  const [nome, setNome] = useState(perfil.nome || "");
  const [lotacao, setLotacao] = useState(perfil.lotacao || "");
  const [apiKey, setApiKey] = useState(perfil.apiKey || "");
  const [showKey, setShowKey] = useState(false);
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ background: C.branco, borderRadius: 12, padding: 32, width: 460, boxShadow: "0 8px 32px rgba(0,0,0,0.2)" }}>
        <h2 style={{ margin: "0 0 20px", color: C.verde }}>⚙ Configurar Perfil</h2>
        <Input label="Nome completo do(a) Defensor(a)" value={nome} onChange={setNome} placeholder="Dr(a). Fulano de Tal" />
        <Input label="Lotação / Defensoria" value={lotacao} onChange={setLotacao} placeholder="2ª Defensoria Itinerante — Jaicós/PI" />

        <div style={{ marginBottom: 14 }}>
          <label style={{ display: "block", fontWeight: 600, marginBottom: 4, color: C.cinza, fontSize: 13 }}>
            Chave de API (Claude/Anthropic)
          </label>
          <div style={{ position: "relative" }}>
            <input
              type={showKey ? "text" : "password"}
              value={apiKey}
              onChange={e => setApiKey(e.target.value)}
              placeholder="sk-ant-..."
              style={{ width: "100%", padding: "9px 40px 9px 12px", borderRadius: 6, border: `1px solid ${C.borda}`, fontSize: 13, boxSizing: "border-box" }}
            />
            <button onClick={() => setShowKey(s => !s)}
              style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", fontSize: 16 }}>
              {showKey ? "🙈" : "👁"}
            </button>
          </div>
          <div style={{ fontSize: 11, color: "#888", marginTop: 5 }}>
            Obtenha sua chave em{" "}
            <a href="https://console.anthropic.com/keys" target="_blank" rel="noreferrer" style={{ color: C.verde }}>
              console.anthropic.com/keys
            </a>
            . Fica salva apenas neste computador.
          </div>
        </div>

        <div style={{ background: "#fff8e1", border: "1px solid #f0c040", borderRadius: 6, padding: "10px 14px", fontSize: 12, marginBottom: 16 }}>
          ⚠️ A chave é necessária apenas para a função de leitura automática de sentença. O cálculo funciona sem ela.
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <Btn onClick={() => { onSave({ nome, lotacao, apiKey }); onClose(); }}>Salvar</Btn>
          <Btn onClick={onClose} outline cor={C.cinza}>Cancelar</Btn>
        </div>
      </div>
    </div>
  );
};

// ── Tela Principal ─────────────────────────────────────────────
const MESES = ["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];

function novaParcela() {
  const hoje = new Date();
  return { id: Date.now(), mes: hoje.getMonth() + 1, ano: hoje.getFullYear(), valor: "", pago: "" };
}

export default function App() {
  const [perfil, setPerfil] = useState(() => {
    try { return JSON.parse(localStorage.getItem("dpe_perfil") || "{}"); } catch { return {}; }
  });
  const [showPerfil, setShowPerfil] = useState(false);
  const [tab, setTab] = useState("calc"); // calc | historico
  const [historico, setHistorico] = useState(() => {
    try { return JSON.parse(localStorage.getItem("dpe_historico") || "[]"); } catch { return []; }
  });

  // Form
  const [processo, setProcesso] = useState("");
  const [alimentado, setAlimentado] = useState("");
  const [alimentante, setAlimentante] = useState("");
  const [parcelas, setParcelas] = useState([novaParcela()]);
  const [resultado, setResultado] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingIA, setLoadingIA] = useState(false);
  const [msgIA, setMsgIA] = useState("");
  const fileRef = useRef();

  const salvarPerfil = (p) => {
    setPerfil(p);
    localStorage.setItem("dpe_perfil", JSON.stringify(p));
  };

  const [showIntervalo, setShowIntervalo] = useState(false);
  const [intervalo, setIntervalo] = useState({ mesIni: 1, anoIni: 2024, mesFim: 12, anoFim: 2024, tipo: "fixo", valor: "", fracao: "", pago: "" });

  const addParcela = () => setParcelas(p => [...p, novaParcela()]);
  const removeParcela = (id) => setParcelas(p => p.filter(x => x.id !== id));
  const editParcela = (id, campo, val) => setParcelas(p => p.map(x => x.id === id ? { ...x, [campo]: val } : x));

  const addIntervalo = () => {
    const novas = [];
    let m = intervalo.mesIni, a = intervalo.anoIni;
    const mFim = intervalo.mesFim, aFim = intervalo.anoFim;
    while (a < aFim || (a === aFim && m <= mFim)) {
      let valor;
      if (intervalo.tipo === "sm") {
        valor = (getSalarioMinimo(m, a) * Number(intervalo.fracao)).toFixed(2);
      } else {
        valor = intervalo.valor;
      }
      novas.push({ id: Date.now() + novas.length, mes: m, ano: a, valor, pago: intervalo.pago });
      m++; if (m > 12) { m = 1; a++; }
    }
    setParcelas(p => [...p, ...novas]);
    setShowIntervalo(false);
    setIntervalo({ mesIni: 1, anoIni: 2024, mesFim: 12, anoFim: 2024, tipo: "fixo", valor: "", fracao: "", pago: "" });
  };

  // ── Leitura IA de sentença ──────────────────────────────────
  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setLoadingIA(true);
    setMsgIA("Lendo documento com IA…");
    try {
      const base64 = await new Promise((res, rej) => {
        const r = new FileReader();
        r.onload = () => res(r.result.split(",")[1]);
        r.onerror = rej;
        r.readAsDataURL(file);
      });

      const isImg = file.type.startsWith("image/");
      const isPdf = file.type === "application/pdf";

      const contentBlock = isPdf
        ? { type: "document", source: { type: "base64", media_type: "application/pdf", data: base64 } }
        : { type: "image", source: { type: "base64", media_type: file.type, data: base64 } };

      if (!perfil.apiKey) {
        setMsgIA("❌ Configure sua chave de API no perfil antes de usar esta função.");
        setLoadingIA(false);
        return;
      }

      const resp = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-api-key": perfil.apiKey, "anthropic-version": "2023-06-01" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{
            role: "user",
            content: [
              contentBlock,
              {
                type: "text",
                text: `Você é um assistente jurídico especializado em direito de família brasileiro.
Analise este documento (sentença, decisão ou planilha de débitos alimentares) e extraia:
1. Número do processo (formato CNJ: NNNNNNN-NN.NNNN.N.NN.NNNN)
2. Nome do alimentado (credor de alimentos)
3. Nome do alimentante (devedor de alimentos)
4. Lista de parcelas em atraso: para cada parcela, informe mês (1-12), ano (AAAA) e valor em reais (número com duas casas decimais)

Responda SOMENTE em JSON puro, sem markdown, sem explicações, no formato exato:
{"processo":"","alimentado":"","alimentante":"","parcelas":[{"mes":1,"ano":2024,"valor":1500.00}]}`
              }
            ]
          }]
        })
      });

      const data = await resp.json();
      const text = data.content?.find(b => b.type === "text")?.text || "";
      const clean = text.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);

      if (parsed.processo) setProcesso(parsed.processo);
      if (parsed.alimentado) setAlimentado(parsed.alimentado);
      if (parsed.alimentante) setAlimentante(parsed.alimentante);
      if (parsed.parcelas?.length) {
        setParcelas(parsed.parcelas.map((p, i) => ({
          id: Date.now() + i, mes: p.mes, ano: p.ano, valor: String(p.valor), pago: ""
        })));
      }
      setMsgIA(`✅ ${parsed.parcelas?.length || 0} parcela(s) extraída(s) com sucesso. Revise antes de calcular.`);
    } catch (err) {
      setMsgIA("❌ Não foi possível ler o documento. Verifique o arquivo e tente novamente.");
    }
    setLoadingIA(false);
    fileRef.current.value = "";
  };

  // ── Cálculo ────────────────────────────────────────────────
  const calcular = () => {
    setLoading(true);
    setResultado(null);
    setTimeout(() => {
      const detalhes = parcelas
        .filter(p => p.valor && Number(p.valor) > 0)
        .sort((a, b) => a.ano !== b.ano ? a.ano - b.ano : a.mes - b.mes)
        .map(p => {
          const pago = Number(p.pago) || 0;
          const original = Number(p.valor) - pago;
          if (original <= 0) return null;
          return { ...corrigirParcela(original, p.mes, p.ano), mes: p.mes, ano: p.ano, label: fmtMes(p.mes, p.ano) };
        })
        .filter(Boolean);

      if (!detalhes.length) { setLoading(false); return; }

      // Dois blocos: últimas 3 = prisão civil; restantes = penhora
      const sorted = [...detalhes];
      const prisao = sorted.slice(-3);
      const penhora = sorted.slice(0, -3);

      const soma = arr => arr.reduce((s, x) => s + x.total, 0);

      const res = {
        processo, alimentado, alimentante,
        detalhes, prisao, penhora,
        totalPrisao: soma(prisao),
        totalPenhora: soma(penhora),
        total: soma(detalhes),
        data: new Date().toLocaleDateString("pt-BR"),
        defensor: perfil.nome || "",
        lotacao: perfil.lotacao || "",
      };
      setResultado(res);

      // Salvar histórico
      const novo = { id: Date.now(), ...res };
      const hist = [novo, ...historico].slice(0, 50);
      setHistorico(hist);
      localStorage.setItem("dpe_historico", JSON.stringify(hist));
      setLoading(false);
    }, 400);
  };

  // ── Geração de PDF ─────────────────────────────────────────
  const gerarPDF = async () => {
    if (!resultado) return;
    const { jsPDF } = await import("https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js");
    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

    const W = 210, mg = 20;
    let y = 0;

    // Cabeçalho verde
    doc.setFillColor(26, 107, 58);
    doc.rect(0, 0, W, 38, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14); doc.setFont("helvetica", "bold");
    doc.text("APIDEP", W / 2, 11, { align: "center" });
    doc.setFontSize(9); doc.setFont("helvetica", "normal");
    doc.text("Associação Piauiense das Defensoras e Defensores Públicos", W / 2, 18, { align: "center" });
    doc.setFontSize(11); doc.setFont("helvetica", "bold");
    doc.text("Cálculo de Débitos Alimentares", W / 2, 27, { align: "center" });
    if (resultado.lotacao) { doc.setFontSize(9); doc.setFont("helvetica", "normal"); doc.text(resultado.lotacao, W / 2, 34, { align: "center" }); }
    y = 48;

    // Dados do processo
    doc.setTextColor(26, 107, 58);
    doc.setFontSize(10); doc.setFont("helvetica", "bold");
    doc.text("DADOS DO PROCESSO", mg, y); y += 6;
    doc.setDrawColor(26, 107, 58); doc.setLineWidth(0.3);
    doc.line(mg, y, W - mg, y); y += 5;

    doc.setTextColor(60, 60, 60); doc.setFont("helvetica", "normal");
    if (resultado.processo) { doc.text(`Processo: ${resultado.processo}`, mg, y); y += 5; }
    if (resultado.alimentado) { doc.text(`Alimentado(a): ${resultado.alimentado}`, mg, y); y += 5; }
    if (resultado.alimentante) { doc.text(`Alimentante: ${resultado.alimentante}`, mg, y); y += 5; }
    doc.text(`Data do cálculo: ${resultado.data}`, mg, y); y += 10;

    // Tabela detalhada
    doc.setTextColor(26, 107, 58);
    doc.setFont("helvetica", "bold"); doc.setFontSize(10);
    doc.text("MEMÓRIA DE CÁLCULO — PARCELA A PARCELA", mg, y); y += 6;
    doc.line(mg, y, W - mg, y); y += 4;

    // Cabeçalho tabela
    doc.setFillColor(232, 245, 238);
    doc.rect(mg, y - 2, W - mg * 2, 7, "F");
    doc.setTextColor(26, 107, 58); doc.setFontSize(8.5);
    const cols = [mg, 42, 72, 102, 130, 162];
    ["Competência","Valor Original","Correção IPCA-E","Juros (1%/m)","Total Corrigido","Atraso"].forEach((h, i) => {
      doc.text(h, cols[i], y + 3);
    });
    y += 8;

    doc.setTextColor(60, 60, 60); doc.setFont("helvetica", "normal"); doc.setFontSize(8);
    resultado.detalhes.forEach((p, i) => {
      if (y > 260) { doc.addPage(); y = 20; }
      if (i % 2 === 0) { doc.setFillColor(250, 250, 250); doc.rect(mg, y - 2, W - mg * 2, 6, "F"); }
      doc.text(p.label, cols[0], y + 2);
      doc.text(fmt(p.original), cols[1], y + 2);
      doc.text(fmt(p.corrigido - p.original), cols[2], y + 2);
      doc.text(fmt(p.juros), cols[3], y + 2);
      doc.text(fmt(p.total), cols[4], y + 2);
      doc.text(`${p.mesesAtraso}m`, cols[5], y + 2);
      y += 6;
    });
    y += 6;

    // Blocos
    const bloco = (titulo, cor, items, total) => {
      if (y > 230) { doc.addPage(); y = 20; }
      doc.setFillColor(...cor);
      doc.rect(mg, y, W - mg * 2, 8, "F");
      doc.setTextColor(255, 255, 255); doc.setFont("helvetica", "bold"); doc.setFontSize(10);
      doc.text(titulo, mg + 3, y + 5.5);
      doc.text(fmt(total), W - mg - 3, y + 5.5, { align: "right" });
      y += 12;
      doc.setTextColor(60, 60, 60); doc.setFont("helvetica", "normal"); doc.setFontSize(8.5);
      items.forEach(p => {
        doc.text(`  • ${p.label}: ${fmt(p.total)}`, mg, y); y += 5;
      });
      y += 4;
    };

    if (resultado.prisao.length) bloco("BLOCO I — PRISÃO CIVIL (últimas 3 parcelas)", [26, 107, 58], resultado.prisao, resultado.totalPrisao);
    if (resultado.penhora.length) bloco("BLOCO II — PENHORA (parcelas anteriores)", [26, 82, 118], resultado.penhora, resultado.totalPenhora);

    // Total geral
    if (y > 255) { doc.addPage(); y = 20; }
    doc.setFillColor(30, 30, 30);
    doc.rect(mg, y, W - mg * 2, 10, "F");
    doc.setTextColor(255, 255, 255); doc.setFont("helvetica", "bold"); doc.setFontSize(11);
    doc.text("TOTAL GERAL DO DÉBITO", mg + 3, y + 7);
    doc.text(fmt(resultado.total), W - mg - 3, y + 7, { align: "right" });
    y += 18;

    // Rodapé
    doc.setTextColor(100, 100, 100); doc.setFont("helvetica", "normal"); doc.setFontSize(8);
    doc.text("Correção: IPCA-E acumulado mês a mês | Juros: 1% a.m. (art. 406 CC)", W / 2, y, { align: "center" }); y += 5;
    doc.text("Cálculo elaborado em conformidade com o art. 528 do CPC", W / 2, y, { align: "center" }); y += 8;
    if (resultado.defensor) {
      doc.setFont("helvetica", "bold"); doc.setFontSize(9); doc.setTextColor(26, 107, 58);
      doc.text(`${resultado.defensor}`, W / 2, y, { align: "center" }); y += 5;
      doc.setFont("helvetica", "normal"); doc.setTextColor(100, 100, 100);
      doc.text("Defensor(a) Público(a)", W / 2, y, { align: "center" });
    }

    doc.save(`Debitos_Alimentares_${resultado.processo || "calculo"}_${resultado.data.replace(/\//g, "-")}.pdf`);
  };

  // ── Render ─────────────────────────────────────────────────
  return (
    <div style={{ fontFamily: "'Segoe UI', Arial, sans-serif", minHeight: "100vh", background: "#f0f2f0" }}>
      <Header perfil={perfil} onPerfil={() => setShowPerfil(true)} />
      {showPerfil && <ModalPerfil perfil={perfil} onSave={salvarPerfil} onClose={() => setShowPerfil(false)} />}

      {/* Tabs */}
      <div style={{ background: C.branco, borderBottom: `1px solid ${C.borda}`, display: "flex", padding: "0 28px" }}>
        {[["calc","🧮 Novo Cálculo"],["historico","📋 Histórico"]].map(([id, label]) => (
          <button key={id} onClick={() => setTab(id)} style={{
            padding: "14px 20px", border: "none", background: "transparent", cursor: "pointer",
            fontWeight: 600, fontSize: 14, color: tab === id ? C.verde : C.cinza,
            borderBottom: tab === id ? `3px solid ${C.verde}` : "3px solid transparent",
          }}>{label}</button>
        ))}
      </div>

      <div style={{ maxWidth: 860, margin: "0 auto", padding: "24px 16px" }}>

        {tab === "calc" && (
          <>
            {!perfil.nome && (
              <div style={{ background: "#fff8e1", border: "1px solid #f0c040", borderRadius: 8, padding: "12px 18px", marginBottom: 18, fontSize: 14 }}>
                ⚠️ <strong>Configure seu perfil</strong> para que seu nome apareça nos PDFs gerados.{" "}
                <span style={{ color: C.verde, cursor: "pointer", textDecoration: "underline" }} onClick={() => setShowPerfil(true)}>Configurar agora</span>
              </div>
            )}

            {/* Duas opções de entrada */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 4 }}>
              {/* Opção A — IA */}
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
                {msgIA && (
                  <div style={{ marginTop: 8, fontSize: 12, color: msgIA.startsWith("✅") ? C.verde : msgIA.startsWith("❌") ? C.vermelho : C.cinza }}>
                    {msgIA}
                  </div>
                )}
                {!perfil.apiKey && (
                  <div style={{ marginTop: 8, fontSize: 11, color: "#999" }}>
                    ⚠️ Requer chave de API configurada no perfil.
                  </div>
                )}
              </Card>

              {/* Opção B — Manual */}
              <Card style={{ margin: 0, borderTop: `3px solid ${C.verde}` }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                  <span style={{ fontSize: 20 }}>✏️</span>
                  <div>
                    <div style={{ fontWeight: 700, color: C.verde, fontSize: 14 }}>Opção B — Inserir manualmente</div>
                    <div style={{ fontSize: 11, color: "#666" }}>Preencha os dados diretamente nos campos</div>
                  </div>
                </div>
                <div style={{ fontSize: 12, color: "#555", lineHeight: 1.6 }}>
                  Não precisa de conta Claude nem de documento digital. Preencha o número do processo, nomes e parcelas nos campos abaixo.
                </div>
                <div style={{ marginTop: 10 }}>
                  <span style={{ background: C.verdePale, color: C.verde, borderRadius: 20, padding: "3px 10px", fontSize: 11, fontWeight: 600 }}>
                    ✅ Sempre disponível
                  </span>
                </div>
              </Card>
            </div>

            {/* Dados do processo */}
            <Card>
              <h3 style={{ margin: "0 0 16px", color: C.verde, fontSize: 15 }}>📁 Dados do Processo</h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
                <Input label="Número do Processo" value={processo} onChange={setProcesso} placeholder="0000000-00.0000.8.18.0000" />
                <div /> {/* spacer */}
                <Input label="Nome do Alimentado(a)" value={alimentado} onChange={setAlimentado} placeholder="Nome completo" />
                <Input label="Nome do Alimentante" value={alimentante} onChange={setAlimentante} placeholder="Nome completo" />
              </div>
            </Card>

            {/* Parcelas */}
            <Card>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <h3 style={{ margin: 0, color: C.verde, fontSize: 15 }}>💰 Parcelas em Atraso</h3>
                <Btn small onClick={addParcela} cor={C.verdeClaro}>+ Adicionar parcela</Btn>
              </div>

              {parcelas.map((p, i) => (
                <div key={p.id} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr auto", gap: 10, alignItems: "end", marginBottom: 10, padding: "12px", background: C.cinzaClaro, borderRadius: 8 }}>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 600, color: C.cinza, display: "block", marginBottom: 4 }}>Mês</label>
                    <select value={p.mes} onChange={e => editParcela(p.id, "mes", Number(e.target.value))}
                      style={{ width: "100%", padding: "8px", borderRadius: 6, border: `1px solid ${C.borda}`, fontSize: 13 }}>
                      {MESES.map((m, idx) => <option key={idx} value={idx + 1}>{m}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 600, color: C.cinza, display: "block", marginBottom: 4 }}>Ano</label>
                    <input type="number" value={p.ano} onChange={e => editParcela(p.id, "ano", Number(e.target.value))}
                      style={{ width: "100%", padding: "8px", borderRadius: 6, border: `1px solid ${C.borda}`, fontSize: 13, boxSizing: "border-box" }} />
                  </div>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 600, color: C.cinza, display: "block", marginBottom: 4 }}>Valor (R$)</label>
                    <input type="number" value={p.valor} onChange={e => editParcela(p.id, "valor", e.target.value)}
                      placeholder="0,00"
                      style={{ width: "100%", padding: "8px", borderRadius: 6, border: `1px solid ${C.borda}`, fontSize: 13, boxSizing: "border-box" }} />
                  </div>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 600, color: C.cinza, display: "block", marginBottom: 4 }}>Já pago (R$)</label>
                    <input type="number" value={p.pago} onChange={e => editParcela(p.id, "pago", e.target.value)}
                      placeholder="0,00"
                      style={{ width: "100%", padding: "8px", borderRadius: 6, border: `1px solid ${C.borda}`, fontSize: 13, boxSizing: "border-box" }} />
                  </div>
                  <button onClick={() => removeParcela(p.id)}
                    style={{ background: "transparent", border: "none", cursor: "pointer", color: C.vermelho, fontSize: 18, paddingBottom: 4 }}>✕</button>
                </div>
              ))}

              <div style={{ marginTop: 16 }}>
                <Btn onClick={calcular} disabled={loading || parcelas.every(p => !p.valor)}>
                  {loading ? "⏳ Calculando…" : "🧮 Calcular Débito"}
                </Btn>
              </div>
            </Card>

            {/* Resultado */}
            {resultado && (
              <Card style={{ borderLeft: `4px solid ${C.verde}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                  <h3 style={{ margin: 0, color: C.verde }}>📊 Resultado do Cálculo</h3>
                  <Btn onClick={gerarPDF} cor={C.azul}>📄 Gerar PDF</Btn>
                </div>

                {resultado.processo && <p style={{ margin: "0 0 4px", fontSize: 13, color: "#666" }}>Processo: <strong>{resultado.processo}</strong></p>}
                {resultado.alimentado && <p style={{ margin: "0 0 16px", fontSize: 13, color: "#666" }}>Alimentado(a): <strong>{resultado.alimentado}</strong></p>}

                {/* Bloco Prisão */}
                {resultado.prisao.length > 0 && (
                  <div style={{ background: C.verdePale, border: `1px solid ${C.verde}`, borderRadius: 8, padding: 16, marginBottom: 12 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                      <div style={{ fontWeight: 700, color: C.verde }}>BLOCO I — Prisão Civil</div>
                      <Badge cor={C.verde}>{fmt(resultado.totalPrisao)}</Badge>
                    </div>
                    <div style={{ fontSize: 12, color: "#555" }}>Últimas {resultado.prisao.length} parcela(s) — art. 528, §3° CPC</div>
                    {resultado.prisao.map((p, i) => (
                      <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginTop: 6 }}>
                        <span>{p.label}</span><span style={{ fontWeight: 600 }}>{fmt(p.total)}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Bloco Penhora */}
                {resultado.penhora.length > 0 && (
                  <div style={{ background: "#e8f0f8", border: `1px solid ${C.azul}`, borderRadius: 8, padding: 16, marginBottom: 12 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                      <div style={{ fontWeight: 700, color: C.azul }}>BLOCO II — Penhora</div>
                      <Badge cor={C.azul}>{fmt(resultado.totalPenhora)}</Badge>
                    </div>
                    <div style={{ fontSize: 12, color: "#555" }}>{resultado.penhora.length} parcela(s) anteriores</div>
                    {resultado.penhora.map((p, i) => (
                      <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginTop: 6 }}>
                        <span>{p.label}</span><span style={{ fontWeight: 600 }}>{fmt(p.total)}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Total */}
                <div style={{ background: C.cinza, borderRadius: 8, padding: "14px 18px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ color: C.branco, fontWeight: 700, fontSize: 15 }}>TOTAL GERAL DO DÉBITO</span>
                  <span style={{ color: C.branco, fontWeight: 800, fontSize: 18 }}>{fmt(resultado.total)}</span>
                </div>

                <p style={{ fontSize: 11, color: "#888", marginTop: 10 }}>
                  Correção por IPCA-E acumulado + juros moratórios 1% a.m. (art. 406 CC c/c art. 528 CPC) • Calculado em {resultado.data}
                </p>
              </Card>
            )}
          </>
        )}

        {tab === "historico" && (
          <Card>
            <h3 style={{ margin: "0 0 16px", color: C.verde }}>📋 Histórico de Cálculos</h3>
            {historico.length === 0 ? (
              <p style={{ color: "#888", textAlign: "center", padding: 32 }}>Nenhum cálculo realizado ainda.</p>
            ) : historico.map(h => (
              <div key={h.id} style={{ borderBottom: `1px solid ${C.borda}`, padding: "14px 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{h.alimentado || "Alimentado não informado"}</div>
                  <div style={{ fontSize: 12, color: "#888" }}>{h.processo || "Sem número"} • {h.data}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontWeight: 700, color: C.verde, fontSize: 15 }}>{fmt(h.total)}</div>
                  <div style={{ fontSize: 11, color: "#888" }}>{h.detalhes?.length} parcela(s)</div>
                </div>
              </div>
            ))}
            {historico.length > 0 && (
              <div style={{ marginTop: 16 }}>
                <Btn small outline cor={C.vermelho} onClick={() => {
                  if (confirm("Limpar todo o histórico?")) {
                    setHistorico([]);
                    localStorage.removeItem("dpe_historico");
                  }
                }}>🗑 Limpar histórico</Btn>
              </div>
            )}
          </Card>
        )}
      </div>
    </div>
  );
}
