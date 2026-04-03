// v3.2 — Base v3.1 + 13º salário opcional + justificativa no PDF + r2 reforçado
import { useState, useRef } from “react”;

const C = {
verde: “#1a6b3a”, verdeClaro: “#2d8a50”, verdePale: “#e8f5ee”,
cinza: “#4a4a4a”, cinzaClaro: “#f5f5f5”, branco: “#ffffff”,
borda: “#d0d0d0”, vermelho: “#c0392b”, azul: “#1a5276”,
};

const r2 = (v) => Math.round((Number(v)||0) * 100) / 100;
const fmt = (v) => “R$ “ + r2(v).toFixed(2).replace(”.”, “,”).replace(/\B(?=(\d{3})+(?!\d))/g, “.”);
const fmtMes = (mes, ano) => {
const n = [“Jan”,“Fev”,“Mar”,“Abr”,“Mai”,“Jun”,“Jul”,“Ago”,“Set”,“Out”,“Nov”,“Dez”];
return mes === 13 ? `13º/${ano}` : `${n[mes-1]}/${ano}`;
};

// Máscara processo PJe
function maskProcesso(raw) {
let d = raw.replace(/\D/g,””).slice(0,17);
let r = “”;
for (let i = 0; i < d.length; i++) {
if (i===7) r += “-”;
if (i===9) r += “.”;
if (i===13) r += “.8.18.”;
r += d[i];
}
return r;
}

const SALARIO_MINIMO = {
“2020-01”:1045,“2020-02”:1045,“2020-03”:1045,“2020-04”:1045,“2020-05”:1045,“2020-06”:1045,
“2020-07”:1045,“2020-08”:1045,“2020-09”:1045,“2020-10”:1045,“2020-11”:1045,“2020-12”:1045,
“2021-01”:1100,“2021-02”:1100,“2021-03”:1100,“2021-04”:1100,“2021-05”:1100,“2021-06”:1100,
“2021-07”:1100,“2021-08”:1100,“2021-09”:1100,“2021-10”:1100,“2021-11”:1100,“2021-12”:1100,
“2022-01”:1212,“2022-02”:1212,“2022-03”:1212,“2022-04”:1212,“2022-05”:1212,“2022-06”:1212,
“2022-07”:1212,“2022-08”:1212,“2022-09”:1212,“2022-10”:1212,“2022-11”:1212,“2022-12”:1212,
“2023-01”:1320,“2023-02”:1320,“2023-03”:1320,“2023-04”:1320,“2023-05”:1320,“2023-06”:1320,
“2023-07”:1320,“2023-08”:1320,“2023-09”:1320,“2023-10”:1320,“2023-11”:1320,“2023-12”:1320,
“2024-01”:1412,“2024-02”:1412,“2024-03”:1412,“2024-04”:1412,“2024-05”:1412,“2024-06”:1412,
“2024-07”:1412,“2024-08”:1412,“2024-09”:1412,“2024-10”:1412,“2024-11”:1412,“2024-12”:1412,
“2025-01”:1518,“2025-02”:1518,“2025-03”:1518,“2025-04”:1518,“2025-05”:1518,“2025-06”:1518,
“2025-07”:1518,“2025-08”:1518,“2025-09”:1518,“2025-10”:1518,“2025-11”:1518,“2025-12”:1518,
“2026-01”:1621,“2026-02”:1621,“2026-03”:1621,“2026-04”:1621,“2026-05”:1621,“2026-06”:1621,
“2026-07”:1621,“2026-08”:1621,“2026-09”:1621,“2026-10”:1621,“2026-11”:1621,“2026-12”:1621,
};
const getSM = (m, a) => SALARIO_MINIMO[`${a}-${String(m).padStart(2,"0")}`] || 1621;

const IPCA_E = {
“2022-01”:0.54,“2022-02”:0.58,“2022-03”:1.05,“2022-04”:1.06,“2022-05”:0.81,“2022-06”:0.68,
“2022-07”:-0.07,“2022-08”:-0.04,“2022-09”:0.24,“2022-10”:0.40,“2022-11”:0.54,“2022-12”:0.54,
“2023-01”:0.53,“2023-02”:0.39,“2023-03”:0.17,“2023-04”:0.23,“2023-05”:0.22,“2023-06”:0.06,
“2023-07”:0.18,“2023-08”:0.37,“2023-09”:0.26,“2023-10”:0.24,“2023-11”:0.33,“2023-12”:0.44,
“2024-01”:0.42,“2024-02”:0.40,“2024-03”:0.36,“2024-04”:0.38,“2024-05”:0.40,“2024-06”:0.39,
“2024-07”:0.43,“2024-08”:0.44,“2024-09”:0.44,“2024-10”:0.56,“2024-11”:0.39,“2024-12”:0.48,
“2025-01”:0.41,“2025-02”:1.23,“2025-03”:0.44,
};

function corrigirAte(saldo, mesVenc, anoVenc, mesAlvo, anoAlvo) {
let fator = 1, m = mesVenc, a = anoVenc;
while (a < anoAlvo || (a === anoAlvo && m < mesAlvo)) {
const k = `${a}-${String(m).padStart(2,"0")}`;
if (IPCA_E[k] !== undefined) fator *= (1 + IPCA_E[k] / 100);
m++; if (m > 12) { m = 1; a++; }
}
const venc = new Date(anoVenc, mesVenc - 1, 1);
const alvo = new Date(anoAlvo, mesAlvo - 1, 1);
const meses = Math.max(0, (alvo.getFullYear() - venc.getFullYear()) * 12 + (alvo.getMonth() - venc.getMonth()));
const corrigido = r2(saldo * fator);
const juros = r2(corrigido * meses * 0.01);
return { fator: r2(fator * 1000000) / 1000000, corrigido, juros, total: r2(corrigido + juros), mesesAtraso: meses };
}

function corrigir(saldo, mes, ano) {
const mesCorr = mes === 13 ? 12 : mes; // 13º usa dezembro
const h = new Date();
return corrigirAte(saldo, mesCorr, ano, h.getMonth() + 1, h.getFullYear());
}

const MESES = [“Janeiro”,“Fevereiro”,“Março”,“Abril”,“Maio”,“Junho”,“Julho”,“Agosto”,“Setembro”,“Outubro”,“Novembro”,“Dezembro”];

const DEFENSORES = {
“Dr. Robert Rios Júnior”: { lotacao: “2ª Defensoria Itinerante”, senha: “Robert2027” },
“Dra. Andrea Melo de Carvalho”: { lotacao: “1ª Defensoria de Família”, senha: “Andrea2027” },
“Dra. Dayana Sampaio Mendes Magalhães”: { lotacao: “2ª Defensoria Pública Regional de Altos”, senha: “Dayana2027” },
“Dr. Eric Leonardo Pires de Melo”: { lotacao: “7ª Defensoria de Família”, senha: “Eric2027” },
“Dr. Marcos Martins de Oliveira”: { lotacao: “2ª Defensoria de Floriano”, senha: “Marcos2027” },
“Dra. Priscila Gimenes do Nascimento Godói”: { lotacao: “2ª Defensoria Regional de União”, senha: “Priscila2027” },
“Dra. Julyanne Cristine Douglas Leone”: { lotacao: “Assessora - 2ª Defensoria Itinerante”, senha: “Julyanne2027” },
};

let _logoB64 = null;
let _logoRatio = 1.5;
function carregarLogo() {
if (_logoB64) return Promise.resolve(_logoB64);
return new Promise((res) => {
const img = new Image();
img.crossOrigin = “anonymous”;
img.onload = () => {
try {
const cv = document.createElement(“canvas”);
cv.width = img.naturalWidth; cv.height = img.naturalHeight;
cv.getContext(“2d”).drawImage(img, 0, 0);
_logoB64 = cv.toDataURL(“image/png”);
_logoRatio = img.naturalWidth / img.naturalHeight;
res(_logoB64);
} catch { res(null); }
};
img.onerror = () => res(null);
img.src = “/logo-apidep.png”;
});
}
carregarLogo();

// ── Tela de Login ──────────────────────────────────────────────
const TelaLogin = ({ onLogin, onVisitante }) => {
const [nome, setNome] = useState(””);
const [senha, setSenha] = useState(””);
const [erro, setErro] = useState(””);
const tentar = () => {
const def = DEFENSORES[nome];
if (!def || senha !== def.senha) { setErro(“Credenciais inválidas.”); return; }
onLogin({ nome, lotacao: def.lotacao, autenticado: true });
};
return (
<div style={{ minHeight:“100vh”, background:”#f0f2f0”, display:“flex”, alignItems:“center”, justifyContent:“center” }}>
<div style={{ background:”#fff”, borderRadius:12, padding:40, width:400, boxShadow:“0 8px 32px rgba(0,0,0,0.15)” }}>
<div style={{ textAlign:“center”, marginBottom:28 }}>
<img src=”/logo-apidep.png” alt=“APIDEP” crossOrigin=“anonymous” style={{ height:60, objectFit:“contain”, marginBottom:12 }} onError={e=>e.target.style.display=“none”} />
<div style={{ fontWeight:800, fontSize:16, color:C.verde }}>Calculadora de Débitos Alimentares</div>
<div style={{ fontSize:12, color:”#888”, marginTop:4 }}>APIDEP — Acesso restrito</div>
</div>
<div style={{ marginBottom:14 }}>
<label style={{ display:“block”, fontWeight:600, marginBottom:6, fontSize:13, color:C.cinza }}>Nome do Defensor</label>
<select value={nome} onChange={e=>setNome(e.target.value)} style={{ width:“100%”, padding:“10px 12px”, borderRadius:6, border:“1px solid #d0d0d0”, fontSize:14, boxSizing:“border-box” }}>
<option value="">— Selecione —</option>
{Object.keys(DEFENSORES).map((d,i)=><option key={i} value={d}>{d}</option>)}
</select>
{nome && DEFENSORES[nome] && <div style={{ fontSize:12, color:C.verde, marginTop:4, paddingLeft:4 }}>📍 {DEFENSORES[nome].lotacao}</div>}
</div>
<div style={{ marginBottom:20 }}>
<label style={{ display:“block”, fontWeight:600, marginBottom:6, fontSize:13, color:C.cinza }}>Senha de Acesso</label>
<input type=“password” value={senha} onChange={e=>setSenha(e.target.value)} onKeyDown={e=>e.key===“Enter”&&tentar()} placeholder=“Digite a senha”
style={{ width:“100%”, padding:“10px 12px”, borderRadius:6, border:“1px solid #d0d0d0”, fontSize:14, boxSizing:“border-box” }} />
</div>
{erro && <div style={{ background:”#fdecea”, border:“1px solid #e57373”, borderRadius:6, padding:“10px 12px”, fontSize:12, color:C.vermelho, marginBottom:16 }}>🚫 {erro}</div>}
<button onClick={tentar} style={{ width:“100%”, background:C.verde, color:”#fff”, border:“none”, borderRadius:6, padding:12, fontSize:15, fontWeight:700, cursor:“pointer”, touchAction:“manipulation”, marginBottom:10 }}>Entrar</button>
<button onClick={onVisitante} style={{ width:“100%”, background:“transparent”, color:C.cinza, border:`1px solid ${C.borda}`, borderRadius:6, padding:10, fontSize:13, cursor:“pointer”, touchAction:“manipulation” }}>Entrar sem login (visitante)</button>
</div>
</div>
);
};

const Btn = ({children,onClick,cor=C.verde,outline=false,small=false,disabled=false}) => (
<button onClick={onClick} disabled={disabled} style={{
background:outline?“transparent”:cor, color:outline?cor:”#fff”,
border:`2px solid ${cor}`, borderRadius:6, padding:small?“6px 14px”:“10px 22px”,
cursor:disabled?“not-allowed”:“pointer”, fontWeight:600, fontSize:small?13:15,
opacity:disabled?0.5:1, touchAction:“manipulation”,
}}>{children}</button>
);

const Input = ({label,value,onChange,placeholder,type=“text”,disabled}) => (

  <div style={{ marginBottom:14 }}>
    {label && <label style={{ display:"block", fontWeight:600, marginBottom:4, color:C.cinza, fontSize:13 }}>{label}</label>}
    <input type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} disabled={disabled}
      style={{ width:"100%", padding:"9px 12px", borderRadius:6, border:`1px solid ${C.borda}`, fontSize:14, boxSizing:"border-box", background:disabled?C.cinzaClaro:C.branco }} />
  </div>
);

const Card = ({children,style={}}) => (

  <div style={{ background:C.branco, borderRadius:10, border:`1px solid ${C.borda}`, padding:24, marginBottom:20, ...style }}>{children}</div>
);

const ModalPerfil = ({perfil,onSave,onClose}) => {
const [nome,setNome] = useState(perfil.nome||””);
const [apiKey,setApiKey] = useState(perfil.apiKey||””);
const [showKey,setShowKey] = useState(false);
const [senhaModal,setSenhaModal] = useState(””);
const [erroModal,setErroModal] = useState(””);
const lotacaoModal = DEFENSORES[nome]?.lotacao||””;
const salvar = () => {
if (nome && DEFENSORES[nome] && senhaModal !== DEFENSORES[nome].senha) { setErroModal(“Senha incorreta.”); return; }
onSave({ nome, lotacao:lotacaoModal, apiKey }); onClose();
};
return (
<div style={{ position:“fixed”, inset:0, background:“rgba(0,0,0,0.5)”, zIndex:1000, display:“flex”, alignItems:“center”, justifyContent:“center” }}>
<div style={{ background:C.branco, borderRadius:12, padding:32, width:460, maxWidth:“90vw”, boxShadow:“0 8px 32px rgba(0,0,0,0.2)” }}>
<h2 style={{ margin:“0 0 20px”, color:C.verde }}>⚙ Configurar Perfil</h2>
<div style={{ marginBottom:14 }}>
<label style={{ display:“block”, fontWeight:600, marginBottom:4, color:C.cinza, fontSize:13 }}>Nome do Defensor</label>
<select value={nome} onChange={e=>{setNome(e.target.value);setErroModal(””);setSenhaModal(””);}} style={{ width:“100%”, padding:“9px 12px”, borderRadius:6, border:`1px solid ${C.borda}`, fontSize:14, boxSizing:“border-box” }}>
<option value="">— Nenhum (visitante) —</option>
{Object.keys(DEFENSORES).map((d,i)=><option key={i} value={d}>{d}</option>)}
</select>
</div>
{nome && DEFENSORES[nome] && (<>
<div style={{ marginBottom:14 }}>
<label style={{ display:“block”, fontWeight:600, marginBottom:4, color:C.cinza, fontSize:13 }}>Defensoria</label>
<input value={lotacaoModal} disabled style={{ width:“100%”, padding:“9px 12px”, borderRadius:6, border:`1px solid ${C.borda}`, fontSize:14, boxSizing:“border-box”, background:C.cinzaClaro }} />
</div>
<div style={{ marginBottom:14 }}>
<label style={{ display:“block”, fontWeight:600, marginBottom:4, color:C.cinza, fontSize:13 }}>🔒 Senha</label>
<input type=“password” value={senhaModal} onChange={e=>{setSenhaModal(e.target.value);setErroModal(””);}} onKeyDown={e=>e.key===“Enter”&&salvar()} placeholder=“Senha”
style={{ width:“100%”, padding:“9px 12px”, borderRadius:6, border:`1px solid ${erroModal?C.vermelho:C.borda}`, fontSize:14, boxSizing:“border-box” }} />
{erroModal && <div style={{ fontSize:12, color:C.vermelho, marginTop:4 }}>🚫 {erroModal}</div>}
</div>
</>)}
<div style={{ marginBottom:14 }}>
<label style={{ display:“block”, fontWeight:600, marginBottom:4, color:C.cinza, fontSize:13 }}>Chave API (opcional)</label>
<div style={{ position:“relative” }}>
<input type={showKey?“text”:“password”} value={apiKey} onChange={e=>setApiKey(e.target.value)} placeholder=“sk-ant-…”
style={{ width:“100%”, padding:“9px 40px 9px 12px”, borderRadius:6, border:`1px solid ${C.borda}`, fontSize:13, boxSizing:“border-box” }} />
<button onClick={()=>setShowKey(s=>!s)} style={{ position:“absolute”, right:10, top:“50%”, transform:“translateY(-50%)”, background:“none”, border:“none”, cursor:“pointer”, fontSize:16 }}>{showKey?“🙈”:“👁”}</button>
</div>
</div>
<div style={{ display:“flex”, gap:10 }}>
<Btn onClick={salvar}>Salvar</Btn>
<Btn onClick={onClose} outline cor={C.cinza}>Cancelar</Btn>
</div>
</div>
</div>
);
};

const Header = ({perfil,onPerfil,onLogout}) => (

  <div style={{ background:C.verde, color:"#fff", padding:"12px 28px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
    <div style={{ display:"flex", alignItems:"center", gap:14 }}>
      <img src="/logo-apidep.png" alt="APIDEP" crossOrigin="anonymous" style={{ height:56, objectFit:"contain" }} onError={e=>e.target.style.display="none"} />
      <div><div style={{ fontWeight:800, fontSize:16 }}>Calculadora de Débitos Alimentares</div><div style={{ fontSize:12, opacity:.8 }}>APIDEP — Associação Piauiense das Defensoras e Defensores Públicos</div></div>
    </div>
    <div style={{ display:"flex", gap:8, alignItems:"center" }}>
      <button onClick={onPerfil} style={{ background:"rgba(255,255,255,0.15)", border:"1px solid rgba(255,255,255,0.4)", borderRadius:6, color:"#fff", padding:"7px 14px", cursor:"pointer", fontSize:13, touchAction:"manipulation" }}>👤 {perfil.nome||"Visitante"}</button>
      <button onClick={onLogout} style={{ background:"rgba(255,255,255,0.1)", border:"1px solid rgba(255,255,255,0.3)", borderRadius:6, color:"#fff", padding:"7px 12px", cursor:"pointer", fontSize:12, touchAction:"manipulation" }}>Sair</button>
    </div>
  </div>
);

function novaParcela() {
const h = new Date();
return { id:Date.now(), mes:h.getMonth()+1, ano:h.getFullYear(), valor:””, pago:””, is13:false };
}

export default function App() {
const [logado,setLogado] = useState(null);
const fazerLogout = () => { localStorage.removeItem(“dpe_perfil”); localStorage.removeItem(“dpe_historico”); setLogado(null); setTimeout(()=>window.location.reload(),50); };
if (!logado) return <TelaLogin onLogin={u=>setLogado(u)} onVisitante={()=>setLogado({nome:””,lotacao:””,autenticado:false})} />;
return <AppInterno usuario={logado} onLogout={fazerLogout} />;
}

function AppInterno({ usuario, onLogout }) {
const [perfil,setPerfil] = useState(()=>{
if(usuario.autenticado) return {nome:usuario.nome,lotacao:usuario.lotacao,apiKey:””};
try{return JSON.parse(localStorage.getItem(“dpe_perfil”)||”{}”)}catch{return{}}
});
const [showPerfil,setShowPerfil] = useState(false);
const [tab,setTab] = useState(“calc”);
const [historico,setHistorico] = useState(()=>{try{return JSON.parse(localStorage.getItem(“dpe_historico”)||”[]”)}catch{return[]}});

const [processo,setProcesso] = useState(””);
const [alimentado,setAlimentado] = useState(””);
const [alimentante,setAlimentante] = useState(””);
const [comarca,setComarca] = useState(””);
const [diaVencimento,setDiaVencimento] = useState(“5”);
const [tipoAlimento,setTipoAlimento] = useState(“sm”);
const [percentualSM,setPercentualSM] = useState(””);
const [valorFixoAlimento,setValorFixoAlimento] = useState(””);
const [parcelas,setParcelas] = useState([novaParcela()]);
const [showIntervalo,setShowIntervalo] = useState(false);
const [intervalo,setIntervalo] = useState({mesIni:1,anoIni:2024,mesFim:12,anoFim:2024,pago:””});
const [incluir13,setIncluir13] = useState(false);
const [justificativa,setJustificativa] = useState(””);
const [resultado,setResultado] = useState(null);
const [loading,setLoading] = useState(false);
const [loadingIA,setLoadingIA] = useState(false);
const [msgIA,setMsgIA] = useState(””);
const fileRef = useRef();

const salvarPerfil = p => {setPerfil(p);localStorage.setItem(“dpe_perfil”,JSON.stringify(p));};
const addParcela = () => setParcelas(p=>[…p,novaParcela()]);
const removeParcela = id => setParcelas(p=>p.filter(x=>x.id!==id));
const editParcela = (id,campo,val) => setParcelas(p=>p.map(x=>x.id===id?{…x,[campo]:val}:x));
const limparParcelas = () => { if(window.confirm(“Apagar todas as parcelas?”)) setParcelas([]); };

const contarParcelas = () => {
let n=0,m=intervalo.mesIni,a=intervalo.anoIni;
while(a<intervalo.anoFim||(a===intervalo.anoFim&&m<=intervalo.mesFim)){n++;m++;if(m>12){m=1;a++;}}
return n;
};

const addIntervalo = () => {
const novas=[];
let m=intervalo.mesIni,a=intervalo.anoIni;
while(a<intervalo.anoFim||(a===intervalo.anoFim&&m<=intervalo.mesFim)){
let valor;
if(tipoAlimento===“sm”) valor=r2(getSM(m,a)*Number(percentualSM)/100).toFixed(2);
else valor=Number(valorFixoAlimento).toFixed(2);
novas.push({id:Date.now()+novas.length,mes:m,ano:a,valor,pago:intervalo.pago?Number(intervalo.pago).toFixed(2):””,is13:false});
m++;if(m>12){m=1;a++;}
}
setParcelas(prev=>{
const existentes=new Set(prev.map(p=>`${p.ano}-${p.mes}`));
const unicas=novas.filter(n=>!existentes.has(`${n.ano}-${n.mes}`));
if(unicas.length<novas.length) alert(`${novas.length-unicas.length} parcela(s) duplicada(s) ignorada(s).`);
return […prev,…unicas];
});
setIntervalo(i=>({…i,pago:””}));
};

const handleUpload = async e => {
const file=e.target.files[0];if(!file)return;
if(!perfil.apiKey){setMsgIA(“❌ Configure sua chave de API no perfil.”);return;}
setLoadingIA(true);setMsgIA(“Lendo documento com IA…”);
try{
const base64=await new Promise((res,rej)=>{const r=new FileReader();r.onload=()=>res(r.result.split(”,”)[1]);r.onerror=rej;r.readAsDataURL(file);});
const block=file.type===“application/pdf”?{type:“document”,source:{type:“base64”,media_type:“application/pdf”,data:base64}}:{type:“image”,source:{type:“base64”,media_type:file.type,data:base64}};
const resp=await fetch(“https://api.anthropic.com/v1/messages”,{
method:“POST”,headers:{“Content-Type”:“application/json”,“x-api-key”:perfil.apiKey,“anthropic-version”:“2023-06-01”,“anthropic-dangerous-direct-browser-access”:“true”},
body:JSON.stringify({model:“claude-sonnet-4-20250514”,max_tokens:1000,messages:[{role:“user”,content:[block,{type:“text”,text:‘Extraia: número do processo CNJ, alimentado, alimentante, parcelas. Responda SOMENTE em JSON: {“processo”:””,“alimentado”:””,“alimentante”:””,“parcelas”:[{“mes”:1,“ano”:2024,“valor”:1500.00}]}’}]}]})
});
const data=await resp.json();
const text=data.content?.find(b=>b.type===“text”)?.text||””;
const parsed=JSON.parse(text.replace(/`json|`/g,””).trim());
if(parsed.processo) setProcesso(maskProcesso(parsed.processo.replace(/\D/g,””)));
if(parsed.alimentado) setAlimentado(parsed.alimentado);
if(parsed.alimentante) setAlimentante(parsed.alimentante);
if(parsed.parcelas?.length) setParcelas(parsed.parcelas.map((p,i)=>({id:Date.now()+i,mes:p.mes,ano:p.ano,valor:String(r2(p.valor)),pago:””,is13:false})));
setMsgIA(`✅ ${parsed.parcelas?.length||0} parcela(s) extraída(s). Revise antes de calcular.`);
}catch{setMsgIA(“❌ Não foi possível ler o documento.”);}
setLoadingIA(false);
if(fileRef.current) fileRef.current.value=””;
};

// ── CÁLCULO — crédito cascata v3.1 + 13º ──────────────────
const calcular = () => {
if(!usuario.autenticado&&!perfil.nome){alert(“Faça login no perfil (👤) para continuar.”);return;}
setLoading(true);setResultado(null);
setTimeout(()=>{
let raw = parcelas
.filter(p=>p.valor&&Number(p.valor)>0)
.sort((a,b)=>a.ano!==b.ano?a.ano-b.ano:a.mes-b.mes)
.map(p=>({
mes:p.mes, ano:p.ano, label:fmtMes(p.mes,p.ano), smVig:getSM(p.mes===13?12:p.mes,p.ano),
nominal:r2(Number(p.valor)), pago:r2(Number(p.pago||0)), is13:!!p.is13,
}));

```
  // Gerar 13º se ativado
  if(incluir13){
    const anos=[...new Set(raw.filter(p=>!p.is13).map(p=>p.ano))];
    const parcelas13=[];
    anos.forEach(ano=>{
      const doAno=raw.filter(p=>p.ano===ano&&!p.is13);
      if(doAno.length>0){
        const ja13=raw.find(p=>p.ano===ano&&p.is13);
        if(!ja13){
          const media=r2(doAno.reduce((s,p)=>s+p.nominal,0)/doAno.length);
          parcelas13.push({mes:13,ano,label:`13º/${ano}`,smVig:getSM(12,ano),nominal:media,pago:0,is13:true});
        }
      }
    });
    raw=[...raw,...parcelas13].sort((a,b)=>a.ano!==b.ano?a.ano-b.ano:a.mes-b.mes);
  }

  if(!raw.length){setLoading(false);return;}

  const creditos=[];
  const parcelasComSaldo=raw.map(p=>{
    const saldoBruto=r2(p.nominal-p.pago);
    if(saldoBruto<0){
      creditos.push({valor:r2(Math.abs(saldoBruto)),mesPgto:p.mes===13?12:p.mes,anoPgto:p.ano});
      return {...p,saldoBruto:0,quitadoPorPagamento:true};
    }
    return {...p,saldoBruto};
  });

  const prisaoRaw=parcelasComSaldo.slice(-3);
  const penhoraRaw=parcelasComSaldo.slice(0,-3);

  function aplicarCreditosCascata(blocoArr,creds){
    const h=new Date(),mH=h.getMonth()+1,aH=h.getFullYear();
    let credsR=creds.map(c=>{const cc=corrigirAte(c.valor,c.mesPgto,c.anoPgto,mH,aH);return {...c,valorCorrigido:cc.total};});
    let totalCredDisp=credsR.reduce((s,c)=>s+c.valorCorrigido,0);
    const resultado=blocoArr.map(p=>{
      if(p.quitadoPorPagamento) return {...p,saldoFinal:0,creditoAplicado:0,quitado:true,...corrigir(0,p.mes,p.ano)};
      const calc=corrigir(p.saldoBruto,p.mes,p.ano);
      let totalDevido=calc.total,creditoAplicado=0;
      if(totalCredDisp>0&&totalDevido>0){
        const abate=r2(Math.min(totalCredDisp,totalDevido));
        creditoAplicado=abate;totalDevido=r2(totalDevido-abate);totalCredDisp=r2(totalCredDisp-abate);
      }
      return {...p,...calc,total:totalDevido,creditoAplicado,saldoFinal:totalDevido>0?p.saldoBruto:0,quitado:totalDevido<=0};
    });
    return {items:resultado,creditoSobrando:r2(totalCredDisp)};
  }

  const b2=aplicarCreditosCascata(penhoraRaw,creditos);
  const credsRest=b2.creditoSobrando>0?[{valor:b2.creditoSobrando,mesPgto:new Date().getMonth()+1,anoPgto:new Date().getFullYear(),valorCorrigido:b2.creditoSobrando}]:[];
  const b1=aplicarCreditosCascata(prisaoRaw,credsRest);

  const soma=arr=>r2(arr.reduce((s,x)=>s+x.total,0));
  const res={
    processo,alimentado,alimentante,comarca,diaVencimento,tipoAlimento,percentualSM,valorFixoAlimento,justificativa,
    prisao:b1.items,penhora:b2.items,totalPrisao:soma(b1.items),totalPenhora:soma(b2.items),
    data:new Date().toLocaleDateString("pt-BR"),defensor:perfil.nome||"",lotacao:perfil.lotacao||"",
  };
  setResultado(res);
  const hist=[{id:Date.now(),...res,total:r2(soma(b1.items)+soma(b2.items))},...historico].slice(0,50);
  setHistorico(hist);localStorage.setItem("dpe_historico",JSON.stringify(hist));
  setLoading(false);
},400);
```

};

// ── PDF — v3.1 layout + justificativa + 13º destaque ──────
const gerarPDF = async () => {
if(!resultado)return;
const jsPDFLib=window.jspdf?.jsPDF||window.jsPDF;
if(!jsPDFLib){alert(“PDF não carregou. Recarregue.”);return;}
const logoData=await carregarLogo();
const doc=new jsPDFLib({orientation:“landscape”,unit:“mm”,format:“a4”});
const W=297,mg=12;let y=0;

```
// Cabeçalho
doc.setFillColor(26,107,58);doc.rect(0,0,W,28,"F");
if(logoData){try{const lh=22,lw=Math.max(lh*_logoRatio,30);doc.addImage(logoData,"PNG",6,3,lw,lh);doc.addImage(logoData,"PNG",W-6-lw,3,lw,lh);}catch{}}
doc.setTextColor(255,255,255);doc.setFontSize(14);doc.setFont("helvetica","bold");
doc.text("MEMORIAL DE CÁLCULO",W/2,10,{align:"center"});
doc.setFontSize(9);doc.setFont("helvetica","normal");
doc.text("Débito Alimentar — Execução de Alimentos (art. 528 CPC)",W/2,16,{align:"center"});
doc.setFontSize(7.5);doc.text("APIDEP — Associação Piauiense das Defensoras e Defensores Públicos",W/2,22,{align:"center"});
y=36;

// Dados
doc.setFillColor(232,245,238);doc.rect(mg,y,W-mg*2,28,"F");
doc.setDrawColor(26,107,58);doc.setLineWidth(0.3);doc.rect(mg,y,W-mg*2,28);
doc.setFillColor(26,107,58);doc.rect(mg,y,W-mg*2,7,"F");
doc.setTextColor(255,255,255);doc.setFont("helvetica","bold");doc.setFontSize(8.5);
doc.text("DADOS DO PROCESSO",mg+3,y+5);y+=9;
const c1=mg+3,c2=mg+100,c3=mg+195;
doc.setTextColor(40,40,40);doc.setFontSize(8);
const lb=(l,v,x,yy)=>{doc.setFont("helvetica","bold");doc.text(l,x,yy);doc.setFont("helvetica","normal");doc.text(v||"—",x+doc.getTextWidth(l)+2,yy);};
lb("Processo nº:",resultado.processo,c1,y);lb("Vara/Comarca:",resultado.comarca,c2,y);lb("Data-base:",resultado.data,c3,y);y+=6;
lb("Exequente:",resultado.alimentado,c1,y);lb("Executado:",resultado.alimentante,c2,y);y+=6;
const tl=resultado.tipoAlimento==="sm"?`${resultado.percentualSM}% do salário mínimo federal`:`${fmt(Number(resultado.valorFixoAlimento||0))} (valor fixo)`;
lb("Alimentos fixados:",tl,c1,y);lb("Vencimento:",`Dia ${resultado.diaVencimento}`,c2,y);lb("Índice:","IPCA-E",c3,y);y+=6;
lb("Juros de mora:","1% ao mês — art. 406 CC c/c art. 161 §1º CTN",c1,y);y+=8;

// Justificativa
if(resultado.justificativa){
  doc.setTextColor(26,107,58);doc.setFont("helvetica","bold");doc.setFontSize(8.5);
  doc.text("JUSTIFICATIVA / OBSERVAÇÕES",mg,y);y+=5;
  doc.setDrawColor(26,107,58);doc.line(mg,y,W-mg,y);y+=4;
  doc.setTextColor(40,40,40);doc.setFont("helvetica","normal");doc.setFontSize(8);
  const linhas=doc.splitTextToSize(resultado.justificativa,W-mg*2);
  linhas.forEach(l=>{if(y>185){doc.addPage();y=15;}doc.text(l,mg,y);y+=4.5;});
  y+=4;
}

// Tabela
const desenharTabela=(titulo,corRGB,items,subtotal,numI)=>{
  if(y>150){doc.addPage();y=15;}
  doc.setFillColor(...corRGB);doc.rect(mg,y,W-mg*2,7,"F");
  doc.setTextColor(255,255,255);doc.setFont("helvetica","bold");doc.setFontSize(8.5);
  doc.text(titulo,mg+3,y+5);y+=9;
  const cw=[8,18,20,20,20,18,18,18,20,20,10,18,20];
  const cx=[mg];cw.forEach((w,i)=>cx.push(cx[i]+w+1));
  const hd=["#","Compet.","Vcto.","SM Vig.","Nominal","Pago","Créd.Apl.","Saldo","Fator","Corrigido","M.","Juros","Total"];
  doc.setFillColor(230,230,230);doc.rect(mg,y-2,W-mg*2,6,"F");
  doc.setTextColor(40,40,40);doc.setFont("helvetica","bold");doc.setFontSize(6);
  hd.forEach((h,i)=>doc.text(h,cx[i],y+2));y+=7;
  items.forEach((p,i)=>{
    if(y>182){doc.addPage();y=15;}
    if(p.is13){doc.setFillColor(255,248,225);doc.rect(mg,y-2,W-mg*2,5.5,"F");}
    else if(i%2===0){doc.setFillColor(248,250,248);doc.rect(mg,y-2,W-mg*2,5.5,"F");}
    const mesCorr=p.mes===13?12:p.mes;
    const vcto=`${String(resultado.diaVencimento).padStart(2,"0")}/${String(mesCorr).padStart(2,"0")}/${p.ano}`;
    doc.setTextColor(p.is13?C.azul:"#282828");doc.setFont("helvetica","normal");doc.setFontSize(6);
    doc.text(String(numI+i),cx[0],y+2);doc.text(p.label,cx[1],y+2);doc.text(vcto,cx[2],y+2);
    doc.text(fmt(p.smVig),cx[3],y+2);doc.text(fmt(p.nominal),cx[4],y+2);
    if(p.pago>0){doc.setTextColor(26,107,58);doc.setFont("helvetica","bold");}
    doc.text(fmt(p.pago),cx[5],y+2);doc.setTextColor(40,40,40);doc.setFont("helvetica","normal");
    if(p.creditoAplicado>0){doc.setTextColor(26,82,118);doc.setFont("helvetica","bold");doc.text(fmt(p.creditoAplicado),cx[6],y+2);doc.setTextColor(40,40,40);doc.setFont("helvetica","normal");}
    else doc.text("—",cx[6],y+2);
    doc.setFont("helvetica","bold");
    if(p.quitado){doc.setTextColor(26,107,58);doc.text("QUITADO",cx[7],y+2);}
    else{doc.setTextColor(40,40,40);doc.text(fmt(p.saldoBruto),cx[7],y+2);}
    doc.setTextColor(40,40,40);doc.setFont("helvetica","normal");
    doc.text(p.fator.toFixed(6),cx[8],y+2);doc.text(p.quitado?"—":fmt(p.corrigido),cx[9],y+2);
    doc.text(`${p.mesesAtraso}`,cx[10],y+2);doc.text(p.quitado?"—":fmt(p.juros),cx[11],y+2);
    doc.setFont("helvetica","bold");
    if(p.quitado){doc.setTextColor(26,107,58);doc.text("—",cx[12],y+2);}
    else{doc.setTextColor(40,40,40);doc.text(fmt(p.total),cx[12],y+2);}
    y+=5.5;
  });
  doc.setFillColor(...corRGB);doc.rect(mg,y,W-mg*2,6,"F");
  doc.setTextColor(255,255,255);doc.setFont("helvetica","bold");doc.setFontSize(8);
  doc.text(`SUBTOTAL: ${fmt(subtotal)}`,W-mg-3,y+4,{align:"right"});y+=10;
};

if(resultado.penhora.length>0) desenharTabela("BLOCO 2 — DÉBITO ANTERIOR (art. 528, §8º CPC)",[26,82,118],resultado.penhora,resultado.totalPenhora,1);
if(resultado.prisao.length>0) desenharTabela("BLOCO 1 — ÚLTIMAS 3 PARCELAS (art. 528, §3º CPC)",[26,107,58],resultado.prisao,resultado.totalPrisao,resultado.penhora.length+1);

// Resumo
if(y>165){doc.addPage();y=15;}
const bW=(W-mg*2-4)/2;
doc.setFillColor(26,107,58);doc.rect(mg,y,bW,22,"F");
doc.setTextColor(255,255,255);doc.setFont("helvetica","bold");doc.setFontSize(8);
doc.text("BLOCO 1 — PRISÃO CIVIL",mg+3,y+7);doc.setFontSize(7);doc.setFont("helvetica","normal");
doc.text("Últimas 3 parcelas — art. 528, §3° CPC",mg+3,y+12);doc.setFont("helvetica","bold");doc.setFontSize(12);
doc.text(fmt(resultado.totalPrisao),mg+bW/2,y+19,{align:"center"});
const x2=mg+bW+4;
doc.setFillColor(26,82,118);doc.rect(x2,y,bW,22,"F");
doc.setTextColor(255,255,255);doc.setFont("helvetica","bold");doc.setFontSize(8);
doc.text("BLOCO 2 — PENHORA",x2+3,y+7);doc.setFontSize(7);doc.setFont("helvetica","normal");
doc.text("Parcelas anteriores — art. 528, §8° CPC",x2+3,y+12);doc.setFont("helvetica","bold");doc.setFontSize(12);
doc.text(fmt(resultado.totalPenhora),x2+bW/2,y+19,{align:"center"});y+=30;

// Observações
if(y>170){doc.addPage();y=15;}
doc.setTextColor(40,40,40);doc.setFont("helvetica","bold");doc.setFontSize(8);doc.text("Observações:",mg,y);y+=5;
doc.setFont("helvetica","normal");doc.setFontSize(7.5);
["1. Correção monetária pelo IPCA-E (Res. CJF nº 134/2010).","2. Juros de mora 1% a.m. sobre valor corrigido (art. 406 CC c/c art. 161 §1º CTN).",
 `3. Data-base: ${resultado.data}. Sujeitos a complementação até efetivo pagamento.`,
 "4. Créditos (pagamentos excedentes) corrigidos e abatidos das parcelas mais antigas.",
].forEach(o=>{doc.text(o,mg,y);y+=4.5;});y+=8;

// Assinatura
if(y>185){doc.addPage();y=15;}
doc.setFont("helvetica","normal");doc.setFontSize(9);doc.text(resultado.data,W/2,y,{align:"center"});y+=16;
doc.setDrawColor(80,80,80);doc.setLineWidth(0.3);doc.line(W/2-45,y,W/2+45,y);y+=5;
doc.setFont("helvetica","bold");doc.setFontSize(9.5);doc.text(resultado.defensor||"",W/2,y,{align:"center"});y+=5;
doc.setFont("helvetica","normal");doc.setFontSize(8.5);doc.text("Defensor(a) Público(a)",W/2,y,{align:"center"});y+=4;
if(resultado.lotacao) doc.text(resultado.lotacao,W/2,y,{align:"center"});

const fn=`Memorial_Calculo_${resultado.processo||"calculo"}_${resultado.data.replace(/\//g,"-")}.pdf`;
if(/iPad|iPhone|iPod/.test(navigator.userAgent)){const w=window.open();if(w)w.document.write(`<iframe src="${doc.output("datauristring")}" style="width:100%;height:100vh;border:none;"></iframe>`);}
else doc.save(fn);
```

};

const inpStyle={width:“100%”,padding:“8px”,borderRadius:6,border:`1px solid ${C.borda}`,fontSize:13,boxSizing:“border-box”};

return (
<div style={{ fontFamily:”‘Segoe UI’,Arial,sans-serif”, minHeight:“100vh”, background:”#f0f2f0” }}>
<Header perfil={perfil} onPerfil={()=>setShowPerfil(true)} onLogout={onLogout}/>
{showPerfil&&<ModalPerfil perfil={perfil} onSave={salvarPerfil} onClose={()=>setShowPerfil(false)}/>}
<div style={{ background:C.branco, borderBottom:`1px solid ${C.borda}`, display:“flex”, padding:“0 28px” }}>
{[[“calc”,“🧮 Novo Cálculo”],[“historico”,“📋 Histórico”]].map(([id,label])=>(
<button key={id} onClick={()=>setTab(id)} style={{ padding:“14px 20px”, border:“none”, background:“transparent”, cursor:“pointer”, fontWeight:600, fontSize:14, color:tab===id?C.verde:C.cinza, borderBottom:tab===id?`3px solid ${C.verde}`:“3px solid transparent”, touchAction:“manipulation” }}>{label}</button>
))}
</div>
<div style={{ maxWidth:900, margin:“0 auto”, padding:“24px 16px” }}>
{tab===“calc”&&(<>
{!perfil.nome&&(
<div style={{ background:”#fff8e1”, border:“1px solid #f0c040”, borderRadius:8, padding:“12px 18px”, marginBottom:18, fontSize:14 }}>
⚠️ <strong>Configure seu perfil</strong> para aparecer nos PDFs.{” “}
<span style={{ color:C.verde, cursor:“pointer”, textDecoration:“underline” }} onClick={()=>setShowPerfil(true)}>Configurar agora</span>
</div>
)}
{/* Opções */}
<div style={{ display:“grid”, gridTemplateColumns:“1fr 1fr”, gap:16, marginBottom:20 }}>
<Card style={{ margin:0, borderTop:`3px solid ${C.azul}` }}>
<div style={{ display:“flex”, alignItems:“center”, gap:8, marginBottom:8 }}><span style={{ fontSize:20 }}>🤖</span><div><div style={{ fontWeight:700, color:C.azul, fontSize:14 }}>Opção A — Importar com IA</div><div style={{ fontSize:11, color:”#666” }}>Envie a sentença e a IA preenche</div></div></div>
<input ref={fileRef} type=“file” accept=”.pdf,image/*” onChange={handleUpload} style={{ display:“none” }}/>
<Btn onClick={()=>fileRef.current.click()} disabled={loadingIA} cor={C.azul} small>{loadingIA?“⏳ Processando…”:“📄 Selecionar PDF ou imagem”}</Btn>
{msgIA&&<div style={{ marginTop:8, fontSize:12, color:msgIA.startsWith(“✅”)?C.verde:C.vermelho }}>{msgIA}</div>}
{!perfil.apiKey&&<div style={{ marginTop:6, fontSize:11, color:”#999” }}>⚠️ Opcional. Requer chave API no perfil.</div>}
</Card>
<Card style={{ margin:0, borderTop:`3px solid ${C.verde}` }}>
<div style={{ display:“flex”, alignItems:“center”, gap:8, marginBottom:8 }}><span style={{ fontSize:20 }}>✏️</span><div><div style={{ fontWeight:700, color:C.verde, fontSize:14 }}>Opção B — Manual</div><div style={{ fontSize:11, color:”#666” }}>Sempre disponível</div></div></div>
<div style={{ fontSize:12, color:”#555” }}>Preencha os dados abaixo.</div>
<div style={{ marginTop:10 }}><span style={{ background:C.verdePale, color:C.verde, borderRadius:20, padding:“3px 10px”, fontSize:11, fontWeight:600 }}>✅ Sem conta necessária</span></div>
</Card>
</div>
{/* Dados */}
<Card>
<h3 style={{ margin:“0 0 16px”, color:C.verde, fontSize:15 }}>📁 Dados do Processo</h3>
<div style={{ display:“grid”, gridTemplateColumns:“1fr 1fr”, gap:“0 16px” }}>
<div style={{ marginBottom:14 }}>
<label style={{ display:“block”, fontWeight:600, marginBottom:4, color:C.cinza, fontSize:13 }}>Número do Processo</label>
<input type=“text” inputMode=“numeric” value={processo} onChange={e=>setProcesso(maskProcesso(e.target.value))} placeholder=“0000000-00.0000.8.18.0000”
style={{ width:“100%”, padding:“9px 12px”, borderRadius:6, border:`1px solid ${C.borda}`, fontSize:14, boxSizing:“border-box”, fontFamily:“monospace”, letterSpacing:“0.5px” }}/>
</div>
<Input label="Vara/Comarca" value={comarca} onChange={setComarca} placeholder="1ª Vara — Itaueira/PI"/>
<Input label="Alimentado(a) / Exequente" value={alimentado} onChange={setAlimentado} placeholder="Nome completo"/>
<Input label="Alimentante / Executado" value={alimentante} onChange={setAlimentante} placeholder="Nome completo"/>
</div>
<div style={{ marginBottom:14 }}>
<label style={{ display:“block”, fontWeight:600, marginBottom:8, color:C.cinza, fontSize:13 }}>Alimentos fixados em</label>
<div style={{ display:“flex”, gap:10, marginBottom:10 }}>
{[[“sm”,”% do Salário Mínimo”],[“fixo”,“Valor fixo (R$)”]].map(([v,l])=>(
<button key={v} onClick={()=>setTipoAlimento(v)} style={{ padding:“7px 16px”, borderRadius:6, border:`2px solid ${tipoAlimento===v?C.verde:C.borda}`, background:tipoAlimento===v?C.verde:C.branco, color:tipoAlimento===v?”#fff”:C.cinza, fontWeight:600, fontSize:13, cursor:“pointer”, touchAction:“manipulation” }}>{l}</button>
))}
</div>
{tipoAlimento===“sm”
?<div style={{ display:“flex”, alignItems:“center”, gap:8 }}><input type=“number” value={percentualSM} onChange={e=>setPercentualSM(e.target.value)} placeholder=“ex: 20” style={{ width:100, padding:“9px 12px”, borderRadius:6, border:`1px solid ${C.borda}`, fontSize:14, boxSizing:“border-box” }}/><span style={{ fontSize:14, color:C.cinza }}>% do salário mínimo federal</span></div>
:<div style={{ display:“flex”, alignItems:“center”, gap:8 }}><span style={{ fontSize:14, color:C.cinza }}>R$</span><input type=“number” value={valorFixoAlimento} onChange={e=>setValorFixoAlimento(e.target.value)} placeholder=“0,00” style={{ width:150, padding:“9px 12px”, borderRadius:6, border:`1px solid ${C.borda}`, fontSize:14, boxSizing:“border-box” }}/></div>
}
</div>
<div style={{ maxWidth:200 }}><Input label="Dia de vencimento" value={diaVencimento} onChange={setDiaVencimento} placeholder="5" type="number"/></div>
</Card>
{/* Opções adicionais: 13º + justificativa */}
<Card>
<h3 style={{ margin:“0 0 16px”, color:C.verde, fontSize:15 }}>⚙ Opções Adicionais</h3>
<div style={{ display:“flex”, alignItems:“center”, gap:10, marginBottom:16, padding:“12px 16px”, background:incluir13?”#fff8e1”:”#f9f9f9”, border:`1px solid ${incluir13?"#f0c040":C.borda}`, borderRadius:8 }}>
<input type=“checkbox” checked={incluir13} onChange={e=>setIncluir13(e.target.checked)} style={{ width:20, height:20, cursor:“pointer” }}/>
<div>
<div style={{ fontWeight:700, fontSize:13, color:C.cinza }}>Incluir 13º salário</div>
<div style={{ fontSize:11, color:”#888” }}>Gera parcela de 13º ao final de cada ano (média dos meses). Valor editável manualmente nas parcelas.</div>
</div>
</div>
<div>
<label style={{ display:“block”, fontWeight:600, marginBottom:4, color:C.cinza, fontSize:13 }}>Justificativa / Observações (aparece no PDF)</label>
<textarea value={justificativa} onChange={e=>setJustificativa(e.target.value)} rows={4}
placeholder=“Ex.: Cálculo elaborado com base na sentença proferida nos autos, considerando o período de inadimplência de janeiro/2023 a dezembro/2024…”
style={{ width:“100%”, padding:“10px 12px”, borderRadius:6, border:`1px solid ${C.borda}`, fontSize:13, boxSizing:“border-box”, resize:“vertical”, fontFamily:“inherit”, lineHeight:1.5 }}/>
</div>
</Card>
{/* Parcelas */}
<Card>
<div style={{ display:“flex”, justifyContent:“space-between”, alignItems:“center”, marginBottom:16 }}>
<h3 style={{ margin:0, color:C.verde, fontSize:15 }}>💰 Parcelas em Atraso</h3>
<div style={{ display:“flex”, gap:8 }}>
<Btn small onClick={()=>setShowIntervalo(s=>!s)} cor={C.azul}>📅 Intervalo</Btn>
<Btn small onClick={addParcela} cor={C.verdeClaro}>+ Avulsa</Btn>
{parcelas.length>0&&<Btn small onClick={limparParcelas} cor={C.vermelho} outline>🗑 Limpar</Btn>}
</div>
</div>
{showIntervalo&&(
<div style={{ background:”#e8f0f820”, border:`1px solid ${C.azul}`, borderRadius:8, padding:16, marginBottom:16 }}>
<div style={{ fontWeight:700, color:C.azul, marginBottom:8 }}>📅 Adicionar intervalo</div>
<div style={{ fontSize:12, color:”#555”, marginBottom:12, background:”#e8f0f8”, padding:“8px 12px”, borderRadius:6 }}>
Valor: <strong>{tipoAlimento===“sm”?`${percentualSM||"?"}% do SM vigente`:`R$ ${valorFixoAlimento||"?"} (fixo)`}</strong>
</div>
<div style={{ display:“grid”, gridTemplateColumns:“repeat(5,1fr)”, gap:8, alignItems:“end” }}>
<div><label style={{ fontSize:11, fontWeight:600, color:C.cinza, display:“block”, marginBottom:3 }}>Mês ini</label><select value={intervalo.mesIni} onChange={e=>setIntervalo(i=>({…i,mesIni:Number(e.target.value)}))} style={inpStyle}>{MESES.map((m,idx)=><option key={idx} value={idx+1}>{m}</option>)}</select></div>
<div><label style={{ fontSize:11, fontWeight:600, color:C.cinza, display:“block”, marginBottom:3 }}>Ano ini</label><input type=“number” value={intervalo.anoIni} onChange={e=>setIntervalo(i=>({…i,anoIni:Number(e.target.value)}))} style={inpStyle}/></div>
<div><label style={{ fontSize:11, fontWeight:600, color:C.cinza, display:“block”, marginBottom:3 }}>Mês fim</label><select value={intervalo.mesFim} onChange={e=>setIntervalo(i=>({…i,mesFim:Number(e.target.value)}))} style={inpStyle}>{MESES.map((m,idx)=><option key={idx} value={idx+1}>{m}</option>)}</select></div>
<div><label style={{ fontSize:11, fontWeight:600, color:C.cinza, display:“block”, marginBottom:3 }}>Ano fim</label><input type=“number” value={intervalo.anoFim} onChange={e=>setIntervalo(i=>({…i,anoFim:Number(e.target.value)}))} style={inpStyle}/></div>
<div><label style={{ fontSize:11, fontWeight:600, color:C.cinza, display:“block”, marginBottom:3 }}>Pago (R$)</label><input type=“number” value={intervalo.pago} onChange={e=>setIntervalo(i=>({…i,pago:e.target.value}))} placeholder=“0,00” style={inpStyle}/></div>
</div>
<div style={{ marginTop:12, display:“flex”, gap:8, alignItems:“center” }}>
<Btn small onClick={addIntervalo} cor={C.azul}>✅ Adicionar {contarParcelas()} parcelas</Btn>
<Btn small onClick={()=>setShowIntervalo(false)} outline cor={C.cinza}>Fechar</Btn>
</div>
</div>
)}
{parcelas.map(p=>(
<div key={p.id} style={{ display:“grid”, gridTemplateColumns:“1fr 1fr 1fr 1fr auto”, gap:10, alignItems:“end”, marginBottom:10, padding:12, background:p.is13?”#fff8e1”:C.cinzaClaro, borderRadius:8, border:p.is13?“1px solid #f0c040”:“none” }}>
<div>
<label style={{ fontSize:12, fontWeight:600, color:C.cinza, display:“block”, marginBottom:3 }}>{p.is13?“13º Salário”:“Mês”}</label>
{p.is13
?<div style={{ padding:8, fontSize:13, color:C.azul, fontWeight:700 }}>13º/{p.ano}</div>
:<select value={p.mes} onChange={e=>editParcela(p.id,“mes”,Number(e.target.value))} style={inpStyle}>{MESES.map((m,idx)=><option key={idx} value={idx+1}>{m}</option>)}</select>
}
</div>
<div><label style={{ fontSize:12, fontWeight:600, color:C.cinza, display:“block”, marginBottom:3 }}>Ano</label><input type=“number” value={p.ano} onChange={e=>editParcela(p.id,“ano”,Number(e.target.value))} style={inpStyle}/></div>
<div><label style={{ fontSize:12, fontWeight:600, color:C.cinza, display:“block”, marginBottom:3 }}>Valor (R$)</label><input type=“number” value={p.valor} onChange={e=>editParcela(p.id,“valor”,e.target.value)} placeholder=“0,00” style={inpStyle}/></div>
<div><label style={{ fontSize:12, fontWeight:600, color:C.cinza, display:“block”, marginBottom:3 }}>Pago (R$)</label><input type=“number” value={p.pago} onChange={e=>editParcela(p.id,“pago”,e.target.value)} placeholder=“0,00” style={inpStyle}/></div>
<button onClick={()=>removeParcela(p.id)} style={{ background:“transparent”, border:“none”, cursor:“pointer”, color:C.vermelho, fontSize:18, paddingBottom:4, touchAction:“manipulation” }}>✕</button>
</div>
))}
<div style={{ marginTop:16 }}><Btn onClick={calcular} disabled={loading||parcelas.every(p=>!p.valor)}>{loading?“⏳ Calculando…”:“🧮 Calcular Débito”}</Btn></div>
</Card>
{/* Resultado */}
{resultado&&(
<Card style={{ borderLeft:`4px solid ${C.verde}` }}>
<div style={{ display:“flex”, justifyContent:“space-between”, alignItems:“center”, marginBottom:20 }}>
<h3 style={{ margin:0, color:C.verde }}>📊 Resultado</h3>
<Btn onClick={gerarPDF} cor={C.azul}>📄 Gerar PDF</Btn>
</div>
{resultado.processo&&<p style={{ margin:“0 0 4px”, fontSize:13, color:”#666” }}>Processo: <strong>{resultado.processo}</strong></p>}
{resultado.alimentado&&<p style={{ margin:“0 0 16px”, fontSize:13, color:”#666” }}>Alimentado(a): <strong>{resultado.alimentado}</strong></p>}
{resultado.prisao.length>0&&(
<div style={{ background:C.verdePale, border:`1px solid ${C.verde}`, borderRadius:8, padding:16, marginBottom:12 }}>
<div style={{ display:“flex”, justifyContent:“space-between”, alignItems:“center”, marginBottom:8 }}>
<div style={{ fontWeight:700, color:C.verde }}>BLOCO 1 — Prisão Civil</div>
<span style={{ background:C.verde, color:”#fff”, borderRadius:20, padding:“3px 12px”, fontSize:12, fontWeight:700 }}>{fmt(resultado.totalPrisao)}</span>
</div>
{resultado.prisao.map((p,i)=>(
<div key={i} style={{ display:“flex”, justifyContent:“space-between”, fontSize:13, marginTop:4 }}>
<span>{p.label}{p.is13&&” 🎄”}{p.pago>0&&<span style={{ color:C.verde, fontSize:11 }}> (pago: {fmt(p.pago)})</span>}{p.creditoAplicado>0&&<span style={{ color:C.azul, fontSize:11 }}> (créd: {fmt(p.creditoAplicado)})</span>}{p.quitado&&<span style={{ color:C.verde, fontSize:11, fontWeight:700 }}> ✅ QUITADO</span>}</span>
<span style={{ fontWeight:600, color:p.quitado?C.verde:“inherit” }}>{p.quitado?”—”:fmt(p.total)}</span>
</div>
))}
</div>
)}
{resultado.penhora.length>0&&(
<div style={{ background:”#e8f0f8”, border:`1px solid ${C.azul}`, borderRadius:8, padding:16, marginBottom:12 }}>
<div style={{ display:“flex”, justifyContent:“space-between”, alignItems:“center”, marginBottom:8 }}>
<div style={{ fontWeight:700, color:C.azul }}>BLOCO 2 — Penhora</div>
<span style={{ background:C.azul, color:”#fff”, borderRadius:20, padding:“3px 12px”, fontSize:12, fontWeight:700 }}>{fmt(resultado.totalPenhora)}</span>
</div>
{resultado.penhora.map((p,i)=>(
<div key={i} style={{ display:“flex”, justifyContent:“space-between”, fontSize:13, marginTop:4 }}>
<span>{p.label}{p.is13&&” 🎄”}{p.pago>0&&<span style={{ color:C.verde, fontSize:11 }}> (pago: {fmt(p.pago)})</span>}{p.creditoAplicado>0&&<span style={{ color:C.azul, fontSize:11 }}> (créd: {fmt(p.creditoAplicado)})</span>}{p.quitado&&<span style={{ color:C.verde, fontSize:11, fontWeight:700 }}> ✅ QUITADO</span>}</span>
<span style={{ fontWeight:600, color:p.quitado?C.verde:“inherit” }}>{p.quitado?”—”:fmt(p.total)}</span>
</div>
))}
</div>
)}
<div style={{ display:“grid”, gridTemplateColumns:“1fr 1fr”, gap:8, marginTop:8 }}>
<div style={{ background:C.verde, borderRadius:8, padding:“12px 16px”, textAlign:“center” }}>
<div style={{ color:”#fff”, fontSize:11, opacity:.8 }}>BLOCO 1 — Prisão Civil</div>
<div style={{ color:”#fff”, fontWeight:800, fontSize:18 }}>{fmt(resultado.totalPrisao)}</div>
</div>
<div style={{ background:C.azul, borderRadius:8, padding:“12px 16px”, textAlign:“center” }}>
<div style={{ color:”#fff”, fontSize:11, opacity:.8 }}>BLOCO 2 — Penhora</div>
<div style={{ color:”#fff”, fontWeight:800, fontSize:18 }}>{fmt(resultado.totalPenhora)}</div>
</div>
</div>
</Card>
)}
</>)}
{tab===“historico”&&(
<Card>
<h3 style={{ margin:“0 0 16px”, color:C.verde }}>📋 Histórico</h3>
{historico.length===0?<p style={{ color:”#888”, textAlign:“center”, padding:32 }}>Nenhum cálculo ainda.</p>
:historico.map(h=>(
<div key={h.id} style={{ borderBottom:`1px solid ${C.borda}`, padding:“14px 0”, display:“flex”, justifyContent:“space-between”, alignItems:“center” }}>
<div><div style={{ fontWeight:600, fontSize:14 }}>{h.alimentado||”—”}</div><div style={{ fontSize:12, color:”#888” }}>{h.processo||“Sem nº”} • {h.data}</div></div>
<div style={{ fontWeight:700, color:C.verde, fontSize:15 }}>{fmt(h.total||0)}</div>
</div>
))
}
{historico.length>0&&<div style={{ marginTop:16 }}><Btn small outline cor={C.vermelho} onClick={()=>{if(confirm(“Limpar histórico?”)){setHistorico([]);localStorage.removeItem(“dpe_historico”);}}}>🗑 Limpar</Btn></div>}
</Card>
)}
</div>
</div>
);
}