import { useState, useRef } from "react";

// ── Paleta ──────────────────────────────────────────────────────
const C = {
  verde: "#1a6b3a", verdeClaro: "#2d8a50", verdePale: "#e8f5ee",
  cinza: "#4a4a4a", cinzaClaro: "#f5f5f5", branco: "#fff",
  borda: "#d0d0d0", vermelho: "#c0392b", azul: "#1a5276",
};

// ── Utilitários ─────────────────────────────────────────────────
const fmt = v => Number(v).toLocaleString("pt-BR",{style:"currency",currency:"BRL"});
const MESES_NOME = ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"];
const MESES = ["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];
const fmtMes = (m,a) => `${MESES_NOME[m-1]}/${a}`;

// Máscara processo PJe: 0000000-00.0000.8.18.0000
function maskProcesso(raw) {
  const d = raw.replace(/\D/g,"").slice(0,17);
  let r = "";
  for (let i = 0; i < d.length; i++) {
    if (i===7) r += "-";
    if (i===9) r += ".";
    if (i===13) r += ".8.18.";
    r += d[i];
  }
  return r;
}

// Salário mínimo histórico
const SM = {
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
  "2026-01":1518,"2026-02":1518,"2026-03":1518,"2026-04":1518,"2026-05":1518,"2026-06":1518,
  "2026-07":1518,"2026-08":1518,"2026-09":1518,"2026-10":1518,"2026-11":1518,"2026-12":1518,
};
const getSM = (m,a) => SM[`${a}-${String(m).padStart(2,"0")}`] || 1518;

// IPCA-E mensal
const IPCA_E = {
  "2022-01":0.54,"2022-02":0.58,"2022-03":1.05,"2022-04":1.06,"2022-05":0.81,"2022-06":0.68,
  "2022-07":-0.07,"2022-08":-0.04,"2022-09":0.24,"2022-10":0.40,"2022-11":0.54,"2022-12":0.54,
  "2023-01":0.53,"2023-02":0.39,"2023-03":0.17,"2023-04":0.23,"2023-05":0.22,"2023-06":0.06,
  "2023-07":0.18,"2023-08":0.37,"2023-09":0.26,"2023-10":0.24,"2023-11":0.33,"2023-12":0.44,
  "2024-01":0.42,"2024-02":0.40,"2024-03":0.36,"2024-04":0.38,"2024-05":0.40,"2024-06":0.39,
  "2024-07":0.43,"2024-08":0.44,"2024-09":0.44,"2024-10":0.56,"2024-11":0.39,"2024-12":0.48,
  "2025-01":0.41,"2025-02":1.23,"2025-03":0.44,
};

function corrigir(valor, mes, ano) {
  const hoje = new Date();
  const aAtual = hoje.getFullYear(), mAtual = hoje.getMonth()+1;
  let fator = 1, m = mes, a = ano;
  while (a < aAtual || (a === aAtual && m < mAtual)) {
    const k = `${a}-${String(m).padStart(2,"0")}`;
    if (IPCA_E[k] !== undefined) fator *= (1 + IPCA_E[k]/100);
    m++; if (m > 12) { m=1; a++; }
  }
  const venc = new Date(ano, mes-1, 1);
  const meses = Math.max(0, (hoje.getFullYear()-venc.getFullYear())*12 + (hoje.getMonth()-venc.getMonth()));
  const corrigido = valor * fator;
  const juros = corrigido * meses * 0.01;
  return { fator, corrigido, juros, total: corrigido+juros, mesesAtraso: meses };
}

// ── UI Components ───────────────────────────────────────────────
const Btn = ({children,onClick,cor=C.verde,outline=false,small=false,disabled=false}) => (
  <button onClick={onClick} disabled={disabled} style={{
    background: outline ? "transparent" : cor, color: outline ? cor : "#fff",
    border: `2px solid ${cor}`, borderRadius:8, padding: small?"7px 14px":"11px 22px",
    fontWeight:700, fontSize: small?12:14, cursor: disabled?"not-allowed":"pointer",
    opacity: disabled?0.5:1, touchAction:"manipulation", WebkitTapHighlightColor:"transparent",
  }}>{children}</button>
);

const Card = ({children,style={}}) => (
  <div style={{background:C.branco, borderRadius:10, padding:"20px 22px", marginBottom:18, boxShadow:"0 2px 8px rgba(0,0,0,0.06)", ...style}}>{children}</div>
);

const Input = ({label,value,onChange,placeholder="",type="text"}) => (
  <div style={{marginBottom:12}}>
    <label style={{display:"block",fontWeight:600,marginBottom:4,color:C.cinza,fontSize:13}}>{label}</label>
    <input type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder}
      style={{width:"100%",padding:"9px 12px",borderRadius:6,border:`1px solid ${C.borda}`,fontSize:14,boxSizing:"border-box"}}/>
  </div>
);

// ── Header ──────────────────────────────────────────────────────
const Header = ({perfil,onPerfil}) => (
  <div style={{background:C.verde,color:"#fff",padding:"12px 28px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
    <div style={{display:"flex",alignItems:"center",gap:14}}>
      <div><div style={{fontWeight:800,fontSize:16}}>Calculadora de Débitos Alimentares</div>
        <div style={{fontSize:11,opacity:.8}}>APIDEP — Defensoria Pública do Piauí</div></div>
    </div>
    <button onClick={onPerfil} style={{background:"rgba(255,255,255,0.15)",border:"none",color:"#fff",padding:"8px 16px",borderRadius:8,fontWeight:600,fontSize:13,cursor:"pointer"}}>
      {perfil.nome ? `👤 ${perfil.nome.split(" ")[0]}` : "⚙ Configurar Perfil"}
    </button>
  </div>
);

// ── Modal Perfil ────────────────────────────────────────────────
const ModalPerfil = ({perfil,onSave,onClose}) => {
  const [nome,setNome] = useState(perfil.nome||"");
  const [lotacao,setLotacao] = useState(perfil.lotacao||"");
  const [apiKey,setApiKey] = useState(perfil.apiKey||"");
  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center"}}>
      <div style={{background:C.branco,borderRadius:12,padding:32,width:440,maxWidth:"90vw",boxShadow:"0 8px 32px rgba(0,0,0,0.2)"}}>
        <h2 style={{margin:"0 0 20px",color:C.verde}}>⚙ Configurar Perfil</h2>
        <Input label="Nome completo do(a) Defensor(a)" value={nome} onChange={setNome} placeholder="Dr(a). Fulano de Tal"/>
        <Input label="Lotação / Defensoria" value={lotacao} onChange={setLotacao} placeholder="2ª Defensoria Itinerante — Jaicós/PI"/>
        <Input label="Chave API Claude (opcional — para importação com IA)" value={apiKey} onChange={setApiKey} placeholder="sk-ant-..."/>
        <div style={{display:"flex",gap:10,marginTop:8}}>
          <Btn onClick={()=>{onSave({nome,lotacao,apiKey});onClose();}}>Salvar</Btn>
          <Btn onClick={onClose} outline cor={C.cinza}>Cancelar</Btn>
        </div>
      </div>
    </div>
  );
};

// ── Parcela helper ──────────────────────────────────────────────
function novaParcela() {
  const h = new Date();
  return {id:Date.now(), mes:h.getMonth()+1, ano:h.getFullYear(), valor:"", pago:""};
}

// ════════════════════════════════════════════════════════════════
// APP PRINCIPAL
// ════════════════════════════════════════════════════════════════
export default function App() {
  const [perfil,setPerfil] = useState(()=>{ try{return JSON.parse(localStorage.getItem("dpe_perfil")||"{}") }catch{return{}} });
  const [showPerfil,setShowPerfil] = useState(false);
  const [tab,setTab] = useState("calc");
  const [historico,setHistorico] = useState(()=>{ try{return JSON.parse(localStorage.getItem("dpe_historico")||"[]")}catch{return[]} });

  // Form
  const [processo,setProcesso] = useState("");
  const [alimentado,setAlimentado] = useState("");
  const [alimentante,setAlimentante] = useState("");
  const [comarca,setComarca] = useState("");
  const [diaVencimento,setDiaVencimento] = useState("5");
  const [tipoAlimento,setTipoAlimento] = useState("sm");
  const [percentualSM,setPercentualSM] = useState("");
  const [valorFixoAlimento,setValorFixoAlimento] = useState("");
  const [parcelas,setParcelas] = useState([novaParcela()]);
  const [showIntervalo,setShowIntervalo] = useState(false);
  const [intervalo,setIntervalo] = useState({mesIni:1,anoIni:2024,mesFim:12,anoFim:2024,tipo:"fixo",valor:"",fracao:"",pago:""});
  const [resultado,setResultado] = useState(null);
  const [loading,setLoading] = useState(false);
  const [loadingIA,setLoadingIA] = useState(false);
  const [msgIA,setMsgIA] = useState("");
  const fileRef = useRef();

  const salvarPerfil = p => { setPerfil(p); localStorage.setItem("dpe_perfil",JSON.stringify(p)); };
  const addParcela = () => setParcelas(p=>[...p,novaParcela()]);
  const removeParcela = id => setParcelas(p=>p.filter(x=>x.id!==id));
  const editParcela = (id,campo,val) => setParcelas(p=>p.map(x=>x.id===id?{...x,[campo]:val}:x));

  const contarParcelas = () => {
    let n=0,m=intervalo.mesIni,a=intervalo.anoIni;
    while(a<intervalo.anoFim||(a===intervalo.anoFim&&m<=intervalo.mesFim)){n++;m++;if(m>12){m=1;a++;}}
    return n;
  };

  const addIntervalo = () => {
    const novas = [];
    let m=intervalo.mesIni, a=intervalo.anoIni;
    while(a<intervalo.anoFim||(a===intervalo.anoFim&&m<=intervalo.mesFim)){
      const valor = intervalo.tipo==="sm" ? (getSM(m,a)*Number(intervalo.fracao||0)/100).toFixed(2) : intervalo.valor;
      novas.push({id:Date.now()+novas.length,mes:m,ano:a,valor,pago:intervalo.pago});
      m++;if(m>12){m=1;a++;}
    }
    setParcelas(p=>[...p,...novas]);
    setShowIntervalo(false);
  };

  // ── Upload IA ─────────────────────────────────────────────────
  const handleUpload = async e => {
    const file = e.target.files[0]; if(!file) return;
    setLoadingIA(true); setMsgIA("Lendo documento com IA…");
    if(!perfil.apiKey){setMsgIA("❌ Configure sua chave de API no perfil.");setLoadingIA(false);return;}
    try {
      const base64 = await new Promise((res,rej)=>{const r=new FileReader();r.onload=()=>res(r.result.split(",")[1]);r.onerror=rej;r.readAsDataURL(file);});
      const block = file.type==="application/pdf"
        ? {type:"document",source:{type:"base64",media_type:"application/pdf",data:base64}}
        : {type:"image",source:{type:"base64",media_type:file.type||"image/jpeg",data:base64}};
      const resp = await fetch("https://api.anthropic.com/v1/messages",{
        method:"POST",
        headers:{"Content-Type":"application/json","x-api-key":perfil.apiKey,"anthropic-version":"2023-06-01","anthropic-dangerous-direct-browser-access":"true"},
        body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:2000,
          messages:[{role:"user",content:[block,{type:"text",text:`Extraia os dados desta sentença/decisão de alimentos. Responda SOMENTE em JSON, sem backticks: {"processo":"","alimentado":"","alimentante":"","comarca":"","parcelas":[{"mes":1,"ano":2024,"valor":"500.00","pago":"0"}]}`}]}]
        })
      });
      const data = await resp.json();
      const txt = data.content?.map(c=>c.text||"").join("")||"";
      const clean = txt.replace(/```json|```/g,"").trim();
      const parsed = JSON.parse(clean);
      if(parsed.processo) setProcesso(maskProcesso(parsed.processo.replace(/\D/g,"")));
      if(parsed.alimentado) setAlimentado(parsed.alimentado);
      if(parsed.alimentante) setAlimentante(parsed.alimentante);
      if(parsed.comarca) setComarca(parsed.comarca);
      if(parsed.parcelas?.length) setParcelas(parsed.parcelas.map((p,i)=>({id:Date.now()+i,...p})));
      setMsgIA("✅ Dados extraídos! Revise antes de calcular.");
    } catch(err) { setMsgIA("❌ Erro: "+err.message); }
    setLoadingIA(false);
    if(fileRef.current) fileRef.current.value="";
  };

  // ── Cálculo ───────────────────────────────────────────────────
  const calcular = () => {
    setLoading(true); setResultado(null);
    setTimeout(()=>{
      const detalhes = parcelas
        .filter(p=>p.valor && Number(p.valor)>0)
        .sort((a,b)=>a.ano!==b.ano?a.ano-b.ano:a.mes-b.mes)
        .map(p=>{
          const nominal=Number(p.valor), pago=Number(p.pago)||0, saldo=nominal-pago;
          const calc = corrigir(Math.max(0,saldo),p.mes,p.ano);
          return {...calc, mes:p.mes, ano:p.ano, label:fmtMes(p.mes,p.ano), smVig:getSM(p.mes,p.ano), nominal, pago, saldo, isCredito:saldo<0};
        });
      if(!detalhes.length){setLoading(false);return;}

      let saldoCredito = 0;
      const processadas = detalhes.map(p=>{
        let s = p.saldo;
        if(saldoCredito>0 && s>0){const ded=Math.min(saldoCredito,s);s-=ded;saldoCredito-=ded;}
        if(s<0){saldoCredito+=Math.abs(s);s=0;}
        const calc=corrigir(s,p.mes,p.ano);
        return {...p,saldo:s,...calc};
      });

      const debitos=processadas.filter(p=>p.total>0);
      const prisao=debitos.slice(-3);
      const penhora=debitos.slice(0,-3);
      const soma=arr=>arr.reduce((s,x)=>s+x.total,0);

      const res = {
        processo,alimentado,alimentante,comarca,diaVencimento,
        tipoAlimento,percentualSM,valorFixoAlimento,
        detalhes:processadas,prisao,penhora,
        totalPrisao:soma(prisao),totalPenhora:soma(penhora),total:soma(debitos),
        data:new Date().toLocaleDateString("pt-BR"),
        defensor:perfil.nome||"",lotacao:perfil.lotacao||"",
      };
      setResultado(res);
      const hist=[{id:Date.now(),...res},...historico].slice(0,50);
      setHistorico(hist);localStorage.setItem("dpe_historico",JSON.stringify(hist));
      setLoading(false);
    },400);
  };

  // ── PDF ────────────────────────────────────────────────────────
  const gerarPDF = () => {
    if(!resultado) return;
    const jsPDFLib = window.jspdf?.jsPDF || window.jsPDF;
    if(!jsPDFLib){alert("Biblioteca PDF não carregada. Recarregue.");return;}

    const doc = new jsPDFLib({orientation:"landscape",unit:"mm",format:"a4"});
    const W=297,mg=12; let y=0;

    // Cabeçalho
    doc.setFillColor(26,107,58);doc.rect(0,0,W,28,"F");
    doc.setTextColor(255,255,255);
    doc.setFontSize(14);doc.setFont("helvetica","bold");doc.text("MEMORIAL DE CÁLCULO",W/2,9,{align:"center"});
    doc.setFontSize(9);doc.setFont("helvetica","normal");doc.text("Débito Alimentar — Execução de Alimentos (art. 528 CPC c/c art. 1.694 CC)",W/2,16,{align:"center"});
    if(resultado.lotacao) doc.text(resultado.lotacao,W/2,23,{align:"center"});
    y=36;

    // Dados
    doc.setTextColor(26,107,58);doc.setFontSize(10);doc.setFont("helvetica","bold");doc.text("DADOS DO PROCESSO",mg,y);y+=5;
    doc.setDrawColor(26,107,58);doc.setLineWidth(0.3);doc.line(mg,y,W-mg,y);y+=5;
    doc.setTextColor(60,60,60);doc.setFont("helvetica","normal");doc.setFontSize(9);
    if(resultado.processo){doc.text(`Processo: ${resultado.processo}`,mg,y);y+=5;}
    if(resultado.alimentado){doc.text(`Alimentado(a)/Exequente: ${resultado.alimentado}`,mg,y);y+=5;}
    if(resultado.alimentante){doc.text(`Alimentante/Executado: ${resultado.alimentante}`,mg,y);y+=5;}
    if(resultado.comarca){doc.text(`Vara/Comarca: ${resultado.comarca}`,mg,y);y+=5;}
    doc.text(`Data do cálculo: ${resultado.data}`,mg,y);y+=8;

    // Tabela
    doc.setTextColor(26,107,58);doc.setFont("helvetica","bold");doc.text("MEMÓRIA DE CÁLCULO",mg,y);y+=5;
    doc.line(mg,y,W-mg,y);y+=4;

    doc.setFillColor(232,245,238);doc.rect(mg,y-2,W-mg*2,7,"F");
    doc.setTextColor(26,107,58);doc.setFontSize(7.5);
    const cols=[mg,mg+22,mg+52,mg+80,mg+108,mg+138,mg+168,mg+198,mg+228];
    ["Competência","SM Vigente","Valor Devido","Valor Pago","Saldo","Correção IPCA-E","Juros 1%/m","Total Corrigido","Meses"].forEach((h,i)=>doc.text(h,cols[i],y+3));
    y+=8;

    doc.setTextColor(60,60,60);doc.setFont("helvetica","normal");doc.setFontSize(7.5);
    resultado.detalhes.forEach((p,i)=>{
      if(y>185){doc.addPage();y=15;}
      if(i%2===0){doc.setFillColor(250,250,250);doc.rect(mg,y-2,W-mg*2,6,"F");}
      doc.text(p.label,cols[0],y+2);
      doc.text(fmt(p.smVig||0),cols[1],y+2);
      doc.text(fmt(p.nominal),cols[2],y+2);
      doc.text(fmt(p.pago),cols[3],y+2);
      doc.text(fmt(p.saldo),cols[4],y+2);
      doc.text(fmt(p.corrigido-(p.saldo)),cols[5],y+2);
      doc.text(fmt(p.juros),cols[6],y+2);
      doc.text(fmt(p.total),cols[7],y+2);
      doc.text(`${p.mesesAtraso}m`,cols[8],y+2);
      y+=6;
    });

    y+=6;
    const bloco = (titulo,cor,items,total) => {
      if(y>175){doc.addPage();y=15;}
      doc.setFillColor(...cor);doc.rect(mg,y-2,W-mg*2,7,"F");
      doc.setTextColor(255,255,255);doc.setFont("helvetica","bold");doc.setFontSize(9);
      doc.text(`${titulo}: ${fmt(total)}`,mg+4,y+3);y+=10;
      doc.setTextColor(60,60,60);doc.setFont("helvetica","normal");doc.setFontSize(8);
      items.forEach(p=>{if(y>185){doc.addPage();y=15;}doc.text(`${p.label} — ${fmt(p.total)}`,mg+4,y);y+=5;});
      y+=4;
    };
    bloco("BLOCO 1 — PRISÃO CIVIL (últimas 3 parcelas)",[192,57,43],resultado.prisao,resultado.totalPrisao);
    bloco("BLOCO 2 — PENHORA (demais parcelas)",[26,82,118],resultado.penhora,resultado.totalPenhora);

    // Total geral
    doc.setFillColor(26,107,58);doc.rect(mg,y-2,W-mg*2,10,"F");
    doc.setTextColor(255,255,255);doc.setFont("helvetica","bold");doc.setFontSize(11);
    doc.text(`TOTAL GERAL: ${fmt(resultado.total)}`,W/2,y+4,{align:"center"});y+=16;

    // Assinatura
    if(resultado.defensor){
      doc.setTextColor(26,107,58);doc.setFont("helvetica","bold");doc.setFontSize(9);
      doc.text(resultado.defensor,W/2,y,{align:"center"});y+=5;
      doc.setFont("helvetica","normal");doc.setTextColor(100,100,100);
      doc.text("Defensor(a) Público(a)",W/2,y,{align:"center"});
    }

    const filename = `Debitos_Alimentares_${resultado.processo||"calculo"}_${resultado.data.replace(/\//g,"-")}.pdf`;
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    if(isIOS){
      const uri = doc.output("datauristring");
      const w = window.open("","_blank");
      if(w) w.document.write(`<html><body style="margin:0"><iframe src="${uri}" style="width:100%;height:100vh;border:none"></iframe></body></html>`);
      else alert("Permita pop-ups para gerar o PDF.");
    } else { doc.save(filename); }
  };

  // ════════════════════════════════════════════════════════════════
  // RENDER
  // ════════════════════════════════════════════════════════════════
  return (
    <div style={{fontFamily:"'Segoe UI',Arial,sans-serif",minHeight:"100vh",background:"#f0f2f0"}}>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
      <Header perfil={perfil} onPerfil={()=>setShowPerfil(true)}/>
      {showPerfil && <ModalPerfil perfil={perfil} onSave={salvarPerfil} onClose={()=>setShowPerfil(false)}/>}

      {/* Tabs */}
      <div style={{background:"#fff",borderBottom:"1px solid #d0d0d0",display:"flex",padding:"0 28px"}}>
        {[["calc","🧮 Novo Cálculo"],["historico","📋 Histórico"]].map(([id,label])=>(
          <button key={id} onClick={()=>setTab(id)} style={{padding:"14px 20px",border:"none",background:"transparent",cursor:"pointer",fontWeight:600,fontSize:14,color:tab===id?C.verde:C.cinza,borderBottom:tab===id?`3px solid ${C.verde}`:"3px solid transparent"}}>{label}</button>
        ))}
      </div>

      <div style={{maxWidth:900,margin:"0 auto",padding:"24px 16px"}}>
        {tab==="calc" && <>
          {!perfil.nome && (
            <div style={{background:"#fff8e1",border:"1px solid #f0c040",borderRadius:8,padding:"12px 18px",marginBottom:18,fontSize:14}}>
              ⚠️ <strong>Configure seu perfil</strong> para que seu nome apareça nos PDFs.{" "}
              <span style={{color:C.verde,cursor:"pointer",textDecoration:"underline"}} onClick={()=>setShowPerfil(true)}>Configurar agora</span>
            </div>
          )}

          {/* Opções de entrada */}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:20}}>
            <Card style={{margin:0,borderTop:`3px solid ${C.azul}`}}>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
                <span style={{fontSize:20}}>🤖</span>
                <div>
                  <div style={{fontWeight:700,color:C.azul,fontSize:14}}>Opção A — Importar com IA</div>
                  <div style={{fontSize:11,color:"#666"}}>Envie a sentença e a IA preenche tudo</div>
                </div>
              </div>
              <input ref={fileRef} type="file" accept=".pdf,image/*" onChange={handleUpload} style={{display:"none"}}/>
              <Btn onClick={()=>fileRef.current.click()} disabled={loadingIA} cor={C.azul} small>
                {loadingIA?"⏳ Processando…":"📄 Selecionar PDF ou imagem"}
              </Btn>
              {msgIA && <div style={{marginTop:8,fontSize:12,color:msgIA.startsWith("✅")?C.verde:C.vermelho}}>{msgIA}</div>}
              {!perfil.apiKey && <div style={{marginTop:6,fontSize:11,color:"#999"}}>⚠️ Requer chave de API no perfil.</div>}
            </Card>
            <Card style={{margin:0,borderTop:`3px solid ${C.verde}`}}>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
                <span style={{fontSize:20}}>✏️</span>
                <div>
                  <div style={{fontWeight:700,color:C.verde,fontSize:14}}>Opção B — Inserir manualmente</div>
                  <div style={{fontSize:11,color:"#666"}}>Sempre disponível, sem conta ou chave</div>
                </div>
              </div>
              <div style={{fontSize:12,color:"#555"}}>Preencha os dados do processo e parcelas abaixo.</div>
              <div style={{marginTop:10}}><span style={{background:C.verdePale,color:C.verde,borderRadius:20,padding:"3px 10px",fontSize:11,fontWeight:600}}>✅ Sempre disponível</span></div>
            </Card>
          </div>

          {/* Dados do Processo */}
          <Card>
            <h3 style={{margin:"0 0 16px",color:C.verde,fontSize:15}}>📁 Dados do Processo</h3>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 16px"}}>
              <div style={{marginBottom:12}}>
                <label style={{display:"block",fontWeight:600,marginBottom:4,color:C.cinza,fontSize:13}}>Número do Processo</label>
                <input type="text" inputMode="numeric" value={processo} onChange={e=>setProcesso(maskProcesso(e.target.value))}
                  placeholder="0000000-00.0000.8.18.0000"
                  style={{width:"100%",padding:"9px 12px",borderRadius:6,border:`1px solid ${C.borda}`,fontSize:14,boxSizing:"border-box",fontFamily:"monospace",letterSpacing:"0.5px"}}/>
              </div>
              <Input label="Vara/Comarca" value={comarca} onChange={setComarca} placeholder="1ª Vara — Itaueira/PI"/>
              <Input label="Nome do Alimentado(a) / Exequente" value={alimentado} onChange={setAlimentado} placeholder="Nome completo"/>
              <Input label="Nome do Alimentante / Executado" value={alimentante} onChange={setAlimentante} placeholder="Nome completo"/>
            </div>

            {/* Tipo de alimento */}
            <div style={{marginBottom:14}}>
              <label style={{display:"block",fontWeight:600,marginBottom:8,color:C.cinza,fontSize:13}}>Alimentos fixados em</label>
              <div style={{display:"flex",gap:10,marginBottom:10}}>
                {[["sm","% do Salário Mínimo"],["fixo","Valor fixo (R$)"]].map(([val,label])=>(
                  <button key={val} onClick={()=>setTipoAlimento(val)} style={{padding:"7px 16px",borderRadius:6,border:`2px solid ${tipoAlimento===val?C.verde:C.borda}`,background:tipoAlimento===val?C.verde:C.branco,color:tipoAlimento===val?"#fff":C.cinza,fontWeight:600,fontSize:13,cursor:"pointer",touchAction:"manipulation"}}>{label}</button>
                ))}
              </div>
              {tipoAlimento==="sm"
                ? <div style={{display:"flex",alignItems:"center",gap:8}}>
                    <input type="number" value={percentualSM} onChange={e=>setPercentualSM(e.target.value)} placeholder="ex: 20" style={{width:100,padding:"9px 12px",borderRadius:6,border:`1px solid ${C.borda}`,fontSize:14,boxSizing:"border-box"}}/>
                    <span style={{fontSize:14,color:C.cinza}}>% do salário mínimo federal</span>
                  </div>
                : <div style={{display:"flex",alignItems:"center",gap:8}}>
                    <span style={{fontSize:14,color:C.cinza}}>R$</span>
                    <input type="number" value={valorFixoAlimento} onChange={e=>setValorFixoAlimento(e.target.value)} placeholder="0,00" style={{width:150,padding:"9px 12px",borderRadius:6,border:`1px solid ${C.borda}`,fontSize:14,boxSizing:"border-box"}}/>
                  </div>
              }
            </div>
            <div style={{maxWidth:200}}><Input label="Dia de vencimento" value={diaVencimento} onChange={setDiaVencimento} placeholder="5" type="number"/></div>
          </Card>

          {/* Parcelas */}
          <Card>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
              <h3 style={{margin:0,color:C.verde,fontSize:15}}>💰 Parcelas em Atraso</h3>
              <div style={{display:"flex",gap:8}}>
                <Btn small onClick={()=>setShowIntervalo(s=>!s)} cor={C.azul}>📅 Adicionar por intervalo</Btn>
                <Btn small onClick={addParcela} cor={C.verdeClaro}>+ Parcela avulsa</Btn>
              </div>
            </div>

            {/* Painel intervalo */}
            {showIntervalo && (
              <div style={{background:C.azul+"11",border:`1px solid ${C.azul}`,borderRadius:8,padding:16,marginBottom:16}}>
                <div style={{fontWeight:700,color:C.azul,marginBottom:10,fontSize:13}}>📅 Gerar parcelas por intervalo {contarParcelas()>0 && `(${contarParcelas()} parcelas)`}</div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:10,marginBottom:10}}>
                  <div><label style={{fontSize:11,fontWeight:600,color:C.cinza}}>Mês inicial</label><select value={intervalo.mesIni} onChange={e=>setIntervalo({...intervalo,mesIni:Number(e.target.value)})} style={{width:"100%",padding:6,borderRadius:6,border:`1px solid ${C.borda}`}}>{MESES.map((m,i)=><option key={i} value={i+1}>{m}</option>)}</select></div>
                  <div><label style={{fontSize:11,fontWeight:600,color:C.cinza}}>Ano inicial</label><input type="number" value={intervalo.anoIni} onChange={e=>setIntervalo({...intervalo,anoIni:Number(e.target.value)})} style={{width:"100%",padding:6,borderRadius:6,border:`1px solid ${C.borda}`,boxSizing:"border-box"}}/></div>
                  <div><label style={{fontSize:11,fontWeight:600,color:C.cinza}}>Mês final</label><select value={intervalo.mesFim} onChange={e=>setIntervalo({...intervalo,mesFim:Number(e.target.value)})} style={{width:"100%",padding:6,borderRadius:6,border:`1px solid ${C.borda}`}}>{MESES.map((m,i)=><option key={i} value={i+1}>{m}</option>)}</select></div>
                  <div><label style={{fontSize:11,fontWeight:600,color:C.cinza}}>Ano final</label><input type="number" value={intervalo.anoFim} onChange={e=>setIntervalo({...intervalo,anoFim:Number(e.target.value)})} style={{width:"100%",padding:6,borderRadius:6,border:`1px solid ${C.borda}`,boxSizing:"border-box"}}/></div>
                </div>
                <div style={{display:"flex",gap:10,marginBottom:10}}>
                  {[["fixo","Valor fixo"],["sm","% do SM"]].map(([v,l])=>(
                    <button key={v} onClick={()=>setIntervalo({...intervalo,tipo:v})} style={{padding:"5px 12px",borderRadius:6,border:`2px solid ${intervalo.tipo===v?C.azul:C.borda}`,background:intervalo.tipo===v?C.azul:C.branco,color:intervalo.tipo===v?"#fff":C.cinza,fontWeight:600,fontSize:12,cursor:"pointer"}}>{l}</button>
                  ))}
                </div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                  {intervalo.tipo==="fixo"
                    ? <div><label style={{fontSize:11,fontWeight:600,color:C.cinza}}>Valor devido (R$)</label><input type="number" value={intervalo.valor} onChange={e=>setIntervalo({...intervalo,valor:e.target.value})} style={{width:"100%",padding:6,borderRadius:6,border:`1px solid ${C.borda}`,boxSizing:"border-box"}}/></div>
                    : <div><label style={{fontSize:11,fontWeight:600,color:C.cinza}}>Fração do SM (%)</label><input type="number" value={intervalo.fracao} onChange={e=>setIntervalo({...intervalo,fracao:e.target.value})} placeholder="ex: 30" style={{width:"100%",padding:6,borderRadius:6,border:`1px solid ${C.borda}`,boxSizing:"border-box"}}/></div>
                  }
                  <div><label style={{fontSize:11,fontWeight:600,color:C.cinza}}>Valor pago (R$)</label><input type="number" value={intervalo.pago} onChange={e=>setIntervalo({...intervalo,pago:e.target.value})} placeholder="0" style={{width:"100%",padding:6,borderRadius:6,border:`1px solid ${C.borda}`,boxSizing:"border-box"}}/></div>
                </div>
                <div style={{marginTop:10,display:"flex",gap:8}}>
                  <Btn small onClick={addIntervalo} cor={C.azul}>✅ Gerar {contarParcelas()} parcelas</Btn>
                  <Btn small onClick={()=>setShowIntervalo(false)} outline cor={C.cinza}>Cancelar</Btn>
                </div>
              </div>
            )}

            {/* Lista de parcelas */}
            {parcelas.map((p,i)=>(
              <div key={p.id} style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr auto",gap:10,alignItems:"end",marginBottom:10,padding:12,background:C.cinzaClaro,borderRadius:8}}>
                <div>
                  <label style={{fontSize:12,fontWeight:600,color:C.cinza,display:"block",marginBottom:4}}>Mês</label>
                  <select value={p.mes} onChange={e=>editParcela(p.id,"mes",Number(e.target.value))} style={{width:"100%",padding:8,borderRadius:6,border:`1px solid ${C.borda}`,fontSize:13}}>
                    {MESES.map((m,idx)=><option key={idx} value={idx+1}>{m}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{fontSize:12,fontWeight:600,color:C.cinza,display:"block",marginBottom:4}}>Ano</label>
                  <input type="number" value={p.ano} onChange={e=>editParcela(p.id,"ano",Number(e.target.value))} style={{width:"100%",padding:8,borderRadius:6,border:`1px solid ${C.borda}`,fontSize:13,boxSizing:"border-box"}}/>
                </div>
                <div>
                  <label style={{fontSize:12,fontWeight:600,color:C.cinza,display:"block",marginBottom:4}}>Valor devido (R$)</label>
                  <input type="number" value={p.valor} onChange={e=>editParcela(p.id,"valor",e.target.value)} placeholder="0,00" style={{width:"100%",padding:8,borderRadius:6,border:`1px solid ${C.borda}`,fontSize:13,boxSizing:"border-box"}}/>
                </div>
                <div>
                  <label style={{fontSize:12,fontWeight:600,color:C.cinza,display:"block",marginBottom:4}}>Valor pago (R$)</label>
                  <input type="number" value={p.pago} onChange={e=>editParcela(p.id,"pago",e.target.value)} placeholder="0" style={{width:"100%",padding:8,borderRadius:6,border:`1px solid ${C.borda}`,fontSize:13,boxSizing:"border-box"}}/>
                </div>
                <button onClick={()=>removeParcela(p.id)} style={{background:C.vermelho,color:"#fff",border:"none",borderRadius:6,width:34,height:34,fontSize:16,cursor:"pointer",touchAction:"manipulation"}}>✕</button>
              </div>
            ))}

            <div style={{marginTop:16,display:"flex",gap:10}}>
              <Btn onClick={calcular} disabled={loading}>{loading?"Calculando…":"🧮 Calcular Débito"}</Btn>
              <Btn onClick={()=>{setParcelas([novaParcela()]);setResultado(null);setProcesso("");setAlimentado("");setAlimentante("");setComarca("");}} outline cor={C.cinza}>🗑 Limpar tudo</Btn>
            </div>
          </Card>

          {/* Resultado */}
          {resultado && (
            <Card style={{borderTop:`4px solid ${C.verde}`}}>
              <h3 style={{margin:"0 0 16px",color:C.verde,fontSize:16}}>📊 Resultado do Cálculo</h3>

              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12,marginBottom:20}}>
                <div style={{background:"#fdecea",borderRadius:8,padding:14,textAlign:"center"}}>
                  <div style={{fontSize:12,color:C.vermelho,fontWeight:600}}>Bloco 1 — Prisão Civil</div>
                  <div style={{fontSize:20,fontWeight:800,color:C.vermelho}}>{fmt(resultado.totalPrisao)}</div>
                  <div style={{fontSize:11,color:"#666"}}>{resultado.prisao.length} parcela(s)</div>
                </div>
                <div style={{background:"#e8f0f8",borderRadius:8,padding:14,textAlign:"center"}}>
                  <div style={{fontSize:12,color:C.azul,fontWeight:600}}>Bloco 2 — Penhora</div>
                  <div style={{fontSize:20,fontWeight:800,color:C.azul}}>{fmt(resultado.totalPenhora)}</div>
                  <div style={{fontSize:11,color:"#666"}}>{resultado.penhora.length} parcela(s)</div>
                </div>
                <div style={{background:C.verdePale,borderRadius:8,padding:14,textAlign:"center"}}>
                  <div style={{fontSize:12,color:C.verde,fontWeight:600}}>Total Geral</div>
                  <div style={{fontSize:22,fontWeight:800,color:C.verde}}>{fmt(resultado.total)}</div>
                </div>
              </div>

              {/* Tabela detalhada */}
              <div style={{overflowX:"auto",marginBottom:16}}>
                <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
                  <thead><tr style={{background:C.verdePale}}>
                    {["Competência","SM Vig.","Devido","Pago","Saldo","Corrigido","Juros","Total","Meses"].map(h=>(
                      <th key={h} style={{padding:"8px 6px",textAlign:"right",color:C.verde,fontWeight:700,fontSize:11,borderBottom:`2px solid ${C.verde}`}}>{h}</th>
                    ))}
                  </tr></thead>
                  <tbody>{resultado.detalhes.map((p,i)=>(
                    <tr key={i} style={{background:i%2===0?"#fafafa":"#fff"}}>
                      <td style={{padding:"6px",fontWeight:600}}>{p.label}</td>
                      <td style={{padding:"6px",textAlign:"right"}}>{fmt(p.smVig||0)}</td>
                      <td style={{padding:"6px",textAlign:"right"}}>{fmt(p.nominal)}</td>
                      <td style={{padding:"6px",textAlign:"right"}}>{fmt(p.pago)}</td>
                      <td style={{padding:"6px",textAlign:"right",color:p.saldo<0?C.verde:C.cinza}}>{fmt(p.saldo)}</td>
                      <td style={{padding:"6px",textAlign:"right"}}>{fmt(p.corrigido)}</td>
                      <td style={{padding:"6px",textAlign:"right"}}>{fmt(p.juros)}</td>
                      <td style={{padding:"6px",textAlign:"right",fontWeight:700}}>{fmt(p.total)}</td>
                      <td style={{padding:"6px",textAlign:"right"}}>{p.mesesAtraso}m</td>
                    </tr>
                  ))}</tbody>
                </table>
              </div>

              <Btn onClick={gerarPDF} cor={C.verde}>📄 Gerar PDF</Btn>
            </Card>
          )}
        </>}

        {/* Histórico */}
        {tab==="historico" && (
          <Card>
            <h3 style={{margin:"0 0 16px",color:C.verde}}>📋 Histórico de Cálculos</h3>
            {historico.length===0 ? <p style={{color:"#999"}}>Nenhum cálculo salvo ainda.</p> :
              historico.map((h,i)=>(
                <div key={h.id||i} style={{padding:"12px 16px",borderBottom:`1px solid ${C.borda}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <div>
                    <div style={{fontWeight:700,color:C.cinza}}>{h.processo||"Sem processo"}</div>
                    <div style={{fontSize:12,color:"#999"}}>{h.alimentado} × {h.alimentante} — {h.data}</div>
                  </div>
                  <div style={{fontWeight:800,color:C.verde,fontSize:16}}>{fmt(h.total)}</div>
                </div>
              ))
            }
            {historico.length>0 && <div style={{marginTop:12}}><Btn small outline cor={C.vermelho} onClick={()=>{setHistorico([]);localStorage.removeItem("dpe_historico");}}>🗑 Limpar histórico</Btn></div>}
          </Card>
        )}
      </div>
    </div>
  );
}
