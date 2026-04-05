// v3.5 — Imputação correta: parcelas corrigidas até data do pagamento; pagamento nominal; saldo remanescente corrigido até data-base
import { useState, useRef } from "react";

const C = {
  verde: "#1a6b3a", verdeClaro: "#2d8a50", verdePale: "#e8f5ee",
  cinza: "#4a4a4a", cinzaClaro: "#f5f5f5", branco: "#ffffff",
  borda: "#d0d0d0", vermelho: "#c0392b", azul: "#1a5276",
};

const r2 = (v) => Math.round((Number(v)||0) * 100) / 100;
const fmt = (v) => "R$ " + r2(v).toFixed(2).replace(".", ",").replace(/\B(?=(\d{3})+(?!\d))/g, ".");
const fmtMes = (mes, ano) => {
  const n = ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"];
  return mes === 13 ? "13\u00BA/" + ano : n[mes-1] + "/" + ano;
};

function maskProcesso(raw) {
  var d = raw.replace(/\D/g,"").slice(0,17);
  var r = "";
  for (var i = 0; i < d.length; i++) {
    if (i===7) r += "-";
    if (i===9) r += ".";
    if (i===13) r += ".8.18.";
    r += d[i];
  }
  return r;
}

var SALARIO_MINIMO = {
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
  "2026-07":1621,"2026-08":1621,"2026-09":1621,"2026-10":1621,"2026-11":1621,"2026-12":1621
};
var getSM = function(m, a) { return SALARIO_MINIMO[a + "-" + String(m).padStart(2,"0")] || 1621; };

var IPCA_E = {
  "2022-01":0.54,"2022-02":0.58,"2022-03":1.05,"2022-04":1.06,"2022-05":0.81,"2022-06":0.68,
  "2022-07":-0.07,"2022-08":-0.04,"2022-09":0.24,"2022-10":0.40,"2022-11":0.54,"2022-12":0.54,
  "2023-01":0.53,"2023-02":0.39,"2023-03":0.17,"2023-04":0.23,"2023-05":0.22,"2023-06":0.06,
  "2023-07":0.18,"2023-08":0.37,"2023-09":0.26,"2023-10":0.24,"2023-11":0.33,"2023-12":0.44,
  "2024-01":0.42,"2024-02":0.40,"2024-03":0.36,"2024-04":0.38,"2024-05":0.40,"2024-06":0.39,
  "2024-07":0.43,"2024-08":0.44,"2024-09":0.44,"2024-10":0.56,"2024-11":0.39,"2024-12":0.48,
  "2025-01":0.41,"2025-02":1.23,"2025-03":0.44
};

function corrigirAte(saldo, mesVenc, anoVenc, mesAlvo, anoAlvo) {
  var fator = 1, m = mesVenc, a = anoVenc;
  while (a < anoAlvo || (a === anoAlvo && m < mesAlvo)) {
    var k = a + "-" + String(m).padStart(2,"0");
    if (IPCA_E[k] !== undefined) fator *= (1 + IPCA_E[k] / 100);
    m++; if (m > 12) { m = 1; a++; }
  }
  var venc = new Date(anoVenc, mesVenc - 1, 1);
  var alvo = new Date(anoAlvo, mesAlvo - 1, 1);
  var meses = Math.max(0, (alvo.getFullYear() - venc.getFullYear()) * 12 + (alvo.getMonth() - venc.getMonth()));
  var corrigido = r2(saldo * fator);
  var juros = r2(corrigido * meses * 0.01);
  return { fator: r2(fator * 1000000) / 1000000, corrigido: corrigido, juros: juros, total: r2(corrigido + juros), mesesAtraso: meses };
}

function corrigir(saldo, mes, ano) {
  // 13º vence em dezembro do respectivo ano
  var mesCorr = mes === 13 ? 12 : mes;
  var h = new Date();
  return corrigirAte(saldo, mesCorr, ano, h.getMonth() + 1, h.getFullYear());
}

var MESES = ["Janeiro","Fevereiro","Mar\u00E7o","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];

var DEFENSORES = {
  "Dr. Robert Rios J\u00FAnior": { lotacao: "2\u00AA Defensoria Itinerante", senha: "Robert2027" },
  "Dra. Andrea Melo de Carvalho": { lotacao: "1\u00AA Defensoria de Fam\u00EDlia", senha: "Andrea2027" },
  "Dra. Dayana Sampaio Mendes Magalh\u00E3es": { lotacao: "2\u00AA Defensoria P\u00FAblica Regional de Altos", senha: "Dayana2027" },
  "Dr. Eric Leonardo Pires de Melo": { lotacao: "7\u00AA Defensoria de Fam\u00EDlia", senha: "Eric2027" },
  "Dra. L\u00EDvia de Oliveira Revor\u00EAdo": { lotacao: "3\u00AA Defensoria P\u00FAblica Regional de S\u00E3o Raimundo Nonato", senha: "Livia2027" },
  "Dr. Marcos Martins de Oliveira": { lotacao: "2\u00AA Defensoria de Floriano", senha: "Marcos2027" },
  "Dra. Priscila Gimenes do Nascimento Godoi": { lotacao: "2\u00AA Defensoria P\u00FAblica Regional de Uni\u00E3o", senha: "Priscila2027" },
  "Dra. Julyanne Cristine Douglas Leone": { lotacao: "Assessora - 2\u00AA Defensoria Itinerante", senha: "Julyanne2027" }
};

var _logoB64 = null;
var _logoRatio = 1.5;
function carregarLogo() {
  if (_logoB64) return Promise.resolve(_logoB64);
  return new Promise(function(res) {
    var img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = function() {
      try {
        var cv = document.createElement("canvas");
        cv.width = img.naturalWidth; cv.height = img.naturalHeight;
        cv.getContext("2d").drawImage(img, 0, 0);
        _logoB64 = cv.toDataURL("image/png");
        _logoRatio = img.naturalWidth / img.naturalHeight;
        res(_logoB64);
      } catch(e) { res(null); }
    };
    img.onerror = function() { res(null); };
    img.src = "/logo-apidep.png";
  });
}
carregarLogo();

function TelaLogin(props) {
  var onLogin = props.onLogin;
  var onVisitante = props.onVisitante;
  var _s1 = useState(""); var nome = _s1[0]; var setNome = _s1[1];
  var _s2 = useState(""); var senha = _s2[0]; var setSenha = _s2[1];
  var _s3 = useState(""); var erro = _s3[0]; var setErro = _s3[1];
  var tentar = function() {
    var def = DEFENSORES[nome];
    if (!nome || !def) { setErro("Selecione um defensor."); return; }
    if (senha !== def.senha) { setErro("Senha incorreta."); return; }
    onLogin({ nome: nome, lotacao: def.lotacao, autenticado: true });
  };
  return (
    <div style={{ minHeight:"100vh", background:"#f0f2f0", display:"flex", alignItems:"center", justifyContent:"center" }}>
      <div style={{ background:"#fff", borderRadius:12, padding:40, width:400, boxShadow:"0 8px 32px rgba(0,0,0,0.15)" }}>
        <div style={{ textAlign:"center", marginBottom:28 }}>
          <img src="/logo-apidep.png" alt="APIDEP" crossOrigin="anonymous" style={{ height:60, objectFit:"contain", marginBottom:12 }} onError={function(e){e.target.style.display="none"}} />
          <div style={{ fontWeight:800, fontSize:16, color:C.verde }}>Calculadora de Débitos Alimentares</div>
          <div style={{ fontSize:12, color:"#888", marginTop:4 }}>Fase teste - Apenas Defensores Legais</div>
        </div>
        <div style={{ marginBottom:14 }}>
          <label style={{ display:"block", fontWeight:600, marginBottom:6, fontSize:13, color:C.cinza }}>Nome do Defensor</label>
          <select value={nome} onChange={function(e){setNome(e.target.value)}} style={{ width:"100%", padding:"10px 12px", borderRadius:6, border:"1px solid #d0d0d0", fontSize:14, boxSizing:"border-box" }}>
            <option value="">-- Selecione --</option>
            {Object.keys(DEFENSORES).map(function(d,i){ return <option key={i} value={d}>{d}</option> })}
          </select>
          {nome && DEFENSORES[nome] && <div style={{ fontSize:12, color:C.verde, marginTop:4, paddingLeft:4 }}>{"\u00BB "}{DEFENSORES[nome].lotacao}</div>}
        </div>
        <div style={{ marginBottom:20 }}>
          <label style={{ display:"block", fontWeight:600, marginBottom:6, fontSize:13, color:C.cinza }}>Senha de Acesso</label>
          <input type="password" value={senha} onChange={function(e){setSenha(e.target.value)}} onKeyDown={function(e){if(e.key==="Enter")tentar()}} placeholder="Digite a senha"
            style={{ width:"100%", padding:"10px 12px", borderRadius:6, border:"1px solid #d0d0d0", fontSize:14, boxSizing:"border-box" }} />
        </div>
        {erro && <div style={{ background:"#fdecea", border:"1px solid #e57373", borderRadius:6, padding:"10px 12px", fontSize:12, color:C.vermelho, marginBottom:16 }}>{erro}</div>}
        <button onClick={tentar} style={{ width:"100%", background:C.verde, color:"#fff", border:"none", borderRadius:6, padding:12, fontSize:15, fontWeight:700, cursor:"pointer", touchAction:"manipulation", marginBottom:10 }}>Entrar</button>
        <button onClick={onVisitante} style={{ width:"100%", background:"transparent", color:C.cinza, border:"1px solid " + C.borda, borderRadius:6, padding:10, fontSize:13, cursor:"pointer", touchAction:"manipulation" }}>Entrar sem login (visitante)</button>
      </div>
    </div>
  );
}

function Btn(props) {
  var cor = props.cor || C.verde;
  var outline = props.outline || false;
  var small = props.small || false;
  return (
    <button onClick={props.onClick} disabled={props.disabled} style={{
      background: outline ? "transparent" : cor, color: outline ? cor : "#fff",
      border: "2px solid " + cor, borderRadius:6, padding: small ? "6px 14px" : "10px 22px",
      cursor: props.disabled ? "not-allowed" : "pointer", fontWeight:600, fontSize: small ? 13 : 15,
      opacity: props.disabled ? 0.5 : 1, touchAction:"manipulation"
    }}>{props.children}</button>
  );
}

function Input(props) {
  var type = props.type || "text";
  return (
    <div style={{ marginBottom:14 }}>
      {props.label && <label style={{ display:"block", fontWeight:600, marginBottom:4, color:C.cinza, fontSize:13 }}>{props.label}</label>}
      <input type={type} value={props.value} onChange={function(e){props.onChange(e.target.value)}} placeholder={props.placeholder} disabled={props.disabled}
        style={{ width:"100%", padding:"9px 12px", borderRadius:6, border:"1px solid " + C.borda, fontSize:14, boxSizing:"border-box", background: props.disabled ? C.cinzaClaro : C.branco }} />
    </div>
  );
}

function Card(props) {
  var style = props.style || {};
  return <div style={Object.assign({ background:C.branco, borderRadius:10, border:"1px solid " + C.borda, padding:24, marginBottom:20 }, style)}>{props.children}</div>;
}

function ModalPerfil(props) {
  var perfil = props.perfil;
  var _s1 = useState(perfil.nome || ""); var nome = _s1[0]; var setNome = _s1[1];
  var _s2 = useState(perfil.apiKey || ""); var apiKey = _s2[0]; var setApiKey = _s2[1];
  var _s3 = useState(false); var showKey = _s3[0]; var setShowKey = _s3[1];
  var _s4 = useState(""); var senhaModal = _s4[0]; var setSenhaModal = _s4[1];
  var _s5 = useState(""); var erroModal = _s5[0]; var setErroModal = _s5[1];
  var def = DEFENSORES[nome];
  var lotacaoModal = def ? def.lotacao : "";
  var salvar = function() {
    if (nome && def && senhaModal !== def.senha) { setErroModal("Senha incorreta."); return; }
    props.onSave({ nome: nome, lotacao: lotacaoModal, apiKey: apiKey }); props.onClose();
  };
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.5)", zIndex:1000, display:"flex", alignItems:"center", justifyContent:"center" }}>
      <div style={{ background:C.branco, borderRadius:12, padding:32, width:460, maxWidth:"90vw", boxShadow:"0 8px 32px rgba(0,0,0,0.2)" }}>
        <h2 style={{ margin:"0 0 20px", color:C.verde }}>Configurar Perfil</h2>
        <div style={{ marginBottom:14 }}>
          <label style={{ display:"block", fontWeight:600, marginBottom:4, color:C.cinza, fontSize:13 }}>Nome do Defensor</label>
          <select value={nome} onChange={function(e){setNome(e.target.value);setErroModal("");setSenhaModal("")}} style={{ width:"100%", padding:"9px 12px", borderRadius:6, border:"1px solid " + C.borda, fontSize:14, boxSizing:"border-box" }}>
            <option value="">-- Nenhum (visitante) --</option>
            {Object.keys(DEFENSORES).map(function(d,i){ return <option key={i} value={d}>{d}</option> })}
          </select>
        </div>
        {nome && def && (
          <div>
            <div style={{ marginBottom:14 }}>
              <label style={{ display:"block", fontWeight:600, marginBottom:4, color:C.cinza, fontSize:13 }}>Defensoria</label>
              <input value={def.lotacao} disabled style={{ width:"100%", padding:"9px 12px", borderRadius:6, border:"1px solid " + C.borda, fontSize:14, boxSizing:"border-box", background:C.cinzaClaro }} />
            </div>
            <div style={{ marginBottom:14 }}>
              <label style={{ display:"block", fontWeight:600, marginBottom:4, color:C.cinza, fontSize:13 }}>Senha</label>
              <input type="password" value={senhaModal} onChange={function(e){setSenhaModal(e.target.value);setErroModal("")}} onKeyDown={function(e){if(e.key==="Enter")salvar()}} placeholder="Senha"
                style={{ width:"100%", padding:"9px 12px", borderRadius:6, border:"1px solid " + (erroModal ? C.vermelho : C.borda), fontSize:14, boxSizing:"border-box" }} />
              {erroModal && <div style={{ fontSize:12, color:C.vermelho, marginTop:4 }}>{erroModal}</div>}
            </div>
          </div>
        )}
        <div style={{ marginBottom:14 }}>
          <label style={{ display:"block", fontWeight:600, marginBottom:4, color:C.cinza, fontSize:13 }}>Chave API (opcional)</label>
          <div style={{ position:"relative" }}>
            <input type={showKey ? "text" : "password"} value={apiKey} onChange={function(e){setApiKey(e.target.value)}} placeholder="sk-ant-..."
              style={{ width:"100%", padding:"9px 40px 9px 12px", borderRadius:6, border:"1px solid " + C.borda, fontSize:13, boxSizing:"border-box" }} />
            <button onClick={function(){setShowKey(!showKey)}} style={{ position:"absolute", right:10, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer", fontSize:16 }}>{showKey ? "\u2715" : "\u25CB"}</button>
          </div>
        </div>
        <div style={{ display:"flex", gap:10 }}>
          <Btn onClick={salvar}>Salvar</Btn>
          <Btn onClick={props.onClose} outline cor={C.cinza}>Cancelar</Btn>
        </div>
      </div>
    </div>
  );
}

function Header(props) {
  var perfil = props.perfil;
  return (
    <div style={{ background:C.verde, color:"#fff", padding:"12px 28px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
      <div style={{ display:"flex", alignItems:"center", gap:14 }}>
        <img src="/logo-apidep.png" alt="APIDEP" crossOrigin="anonymous" style={{ height:56, objectFit:"contain" }} onError={function(e){e.target.style.display="none"}} />
        <div><div style={{ fontWeight:800, fontSize:16 }}>Calculadora de Débitos Alimentares</div><div style={{ fontSize:12, opacity:.8 }}>APIDEP -  Associação Piauiense das Defensoras e Defensores Públicos</div></div>
      </div>
      <div style={{ display:"flex", gap:8, alignItems:"center" }}>
        <button onClick={props.onPerfil} style={{ background:"rgba(255,255,255,0.15)", border:"1px solid rgba(255,255,255,0.4)", borderRadius:6, color:"#fff", padding:"7px 14px", cursor:"pointer", fontSize:13, touchAction:"manipulation" }}>{perfil.nome || "Visitante"}</button>
        <button onClick={props.onLogout} style={{ background:"rgba(255,255,255,0.1)", border:"1px solid rgba(255,255,255,0.3)", borderRadius:6, color:"#fff", padding:"7px 12px", cursor:"pointer", fontSize:12, touchAction:"manipulation" }}>Sair</button>
      </div>
    </div>
  );
}

function novaParcela() {
  var h = new Date();
  return { id: Date.now(), mes: h.getMonth()+1, ano: h.getFullYear(), valor: "", pago: "", is13: false };
}

export default function App() {
  var _s1 = useState(null); var logado = _s1[0]; var setLogado = _s1[1];
  var fazerLogout = function() {
    localStorage.removeItem("dpe_perfil");
    localStorage.removeItem("dpe_historico");
    setLogado(null);
    setTimeout(function(){ window.location.reload(); }, 50);
  };
  if (!logado) return <TelaLogin onLogin={function(u){setLogado(u)}} onVisitante={function(){setLogado({nome:"",lotacao:"",autenticado:false})}} />;
  return <AppInterno usuario={logado} onLogout={fazerLogout} />;
}

function AppInterno(props) {
  var usuario = props.usuario;
  var onLogout = props.onLogout;

  var _p = useState(function(){
    if(usuario.autenticado) return {nome:usuario.nome,lotacao:usuario.lotacao,apiKey:""};
    try{return JSON.parse(localStorage.getItem("dpe_perfil")||"{}")}catch(e){return {}}
  }); var perfil = _p[0]; var setPerfil = _p[1];

  var _sp = useState(false); var showPerfil = _sp[0]; var setShowPerfil = _sp[1];
  var _st = useState("calc"); var tab = _st[0]; var setTab = _st[1];
  var _sh = useState(function(){try{return JSON.parse(localStorage.getItem("dpe_historico")||"[]")}catch(e){return []}}); var historico = _sh[0]; var setHistorico = _sh[1];

  var _proc = useState(""); var processo = _proc[0]; var setProcesso = _proc[1];
  var _alim = useState(""); var alimentado = _alim[0]; var setAlimentado = _alim[1];
  var _alim2 = useState(""); var alimentante = _alim2[0]; var setAlimentante = _alim2[1];
  var _com = useState(""); var comarca = _com[0]; var setComarca = _com[1];
  var _dia = useState("5"); var diaVencimento = _dia[0]; var setDiaVencimento = _dia[1];
  var _tipo = useState("sm"); var tipoAlimento = _tipo[0]; var setTipoAlimento = _tipo[1];
  var _pct = useState(""); var percentualSM = _pct[0]; var setPercentualSM = _pct[1];
  var _vfix = useState(""); var valorFixoAlimento = _vfix[0]; var setValorFixoAlimento = _vfix[1];
  var _parc = useState([novaParcela()]); var parcelas = _parc[0]; var setParcelas = _parc[1];
  var _si = useState(false); var showIntervalo = _si[0]; var setShowIntervalo = _si[1];

  // Calcula mês/ano fim padrão: se hoje >= dia de vencimento, mês atual já venceu
  var calcMesFimPadrao = function(diaVenc) {
    var hoje = new Date();
    var dv = Number(diaVenc) || 5;
    var mAtual = hoje.getMonth() + 1; // 1-12
    var aAtual = hoje.getFullYear();
    if (hoje.getDate() >= dv) {
      // Já passou o vencimento deste mês — inclui o mês atual
      return { mesFim: mAtual, anoFim: aAtual };
    } else {
      // Ainda não venceu este mês — último vencido é o mês anterior
      var mAnt = mAtual - 1;
      var aAnt = aAtual;
      if (mAnt < 1) { mAnt = 12; aAnt--; }
      return { mesFim: mAnt, anoFim: aAnt };
    }
  };

  var padrao = calcMesFimPadrao(diaVencimento);
  var _intv = useState({mesIni:1,anoIni:2024,mesFim:padrao.mesFim,anoFim:padrao.anoFim,pago:""}); var intervalo = _intv[0]; var setIntervalo = _intv[1];
  var _i13 = useState(false); var incluir13 = _i13[0]; var setIncluir13 = _i13[1];
  var _just = useState(""); var justificativa = _just[0]; var setJustificativa = _just[1];
  var _res = useState(null); var resultado = _res[0]; var setResultado = _res[1];
  var _ld = useState(false); var loading = _ld[0]; var setLoading = _ld[1];
  var _lia = useState(false); var loadingIA = _lia[0]; var setLoadingIA = _lia[1];
  var _mia = useState(""); var msgIA = _mia[0]; var setMsgIA = _mia[1];
  var fileRef = useRef();

  var salvarPerfil = function(p) { setPerfil(p); localStorage.setItem("dpe_perfil", JSON.stringify(p)); };
  var addParcela = function() { setParcelas(function(p){ return p.concat([novaParcela()]); }); };
  var removeParcela = function(id) { setParcelas(function(p){ return p.filter(function(x){ return x.id !== id; }); }); };
  var editParcela = function(id, campo, val) { setParcelas(function(p){ return p.map(function(x){ if(x.id===id){ var n = Object.assign({}, x); n[campo]=val; return n; } return x; }); }); };
  var limparParcelas = function() { if(window.confirm("Apagar todas as parcelas?")) setParcelas([]); };

  var contarParcelas = function() {
    var n=0, m=intervalo.mesIni, a=intervalo.anoIni;
    while(a<intervalo.anoFim||(a===intervalo.anoFim&&m<=intervalo.mesFim)){n++;m++;if(m>12){m=1;a++;}}
    return n;
  };

  var addIntervalo = function() {
    var novas=[];
    var m=intervalo.mesIni, a=intervalo.anoIni;
    while(a<intervalo.anoFim||(a===intervalo.anoFim&&m<=intervalo.mesFim)){
      var valor;
      if(tipoAlimento==="sm") valor=r2(getSM(m,a)*Number(percentualSM)/100).toFixed(2);
      else valor=Number(valorFixoAlimento).toFixed(2);
      novas.push({id:Date.now()+novas.length,mes:m,ano:a,valor:valor,pago:intervalo.pago?Number(intervalo.pago).toFixed(2):"",is13:false});
      m++;if(m>12){m=1;a++;}
    }
    setParcelas(function(prev){
      var existentes={};
      prev.forEach(function(p){ existentes[p.ano+"-"+p.mes]=true; });
      var unicas=novas.filter(function(n){ return !existentes[n.ano+"-"+n.mes]; });
      if(unicas.length<novas.length) alert((novas.length-unicas.length)+" parcela(s) duplicada(s) ignorada(s).");
      return prev.concat(unicas);
    });
    setIntervalo(function(i){ return Object.assign({}, i, {pago:""}); });
  };

  var handleUpload = function(e) {
    var file=e.target.files[0]; if(!file)return;
    if(!perfil.apiKey){setMsgIA("Erro: Configure sua chave de API no perfil.");return;}
    setLoadingIA(true);setMsgIA("Lendo documento com IA...");
    var reader = new FileReader();
    reader.onload = function() {
      var base64 = reader.result.split(",")[1];
      var block = file.type==="application/pdf"
        ? {type:"document",source:{type:"base64",media_type:"application/pdf",data:base64}}
        : {type:"image",source:{type:"base64",media_type:file.type,data:base64}};
      fetch("https://api.anthropic.com/v1/messages",{
        method:"POST",
        headers:{"Content-Type":"application/json","x-api-key":perfil.apiKey,"anthropic-version":"2023-06-01","anthropic-dangerous-direct-browser-access":"true"},
        body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1000,messages:[{role:"user",content:[block,{type:"text",text:"Extraia: n\u00FAmero do processo CNJ, alimentado, alimentante, parcelas. Responda SOMENTE em JSON: {\"processo\":\"\",\"alimentado\":\"\",\"alimentante\":\"\",\"parcelas\":[{\"mes\":1,\"ano\":2024,\"valor\":1500.00}]}"}]}]})
      }).then(function(resp){return resp.json()}).then(function(data){
        var text=(data.content&&data.content[0]&&data.content[0].text)||"";
        var parsed=JSON.parse(text.replace(/```json|```/g,"").trim());
        if(parsed.processo) setProcesso(maskProcesso(parsed.processo.replace(/\D/g,"")));
        if(parsed.alimentado) setAlimentado(parsed.alimentado);
        if(parsed.alimentante) setAlimentante(parsed.alimentante);
        if(parsed.parcelas&&parsed.parcelas.length) setParcelas(parsed.parcelas.map(function(p,i){return {id:Date.now()+i,mes:p.mes,ano:p.ano,valor:String(r2(p.valor)),pago:"",is13:false}}));
        setMsgIA("OK! " + (parsed.parcelas?parsed.parcelas.length:0) + " parcela(s) extra\u00EDda(s). Revise antes de calcular.");
        setLoadingIA(false);
        if(fileRef.current) fileRef.current.value="";
      }).catch(function(){
        setMsgIA("Erro: N\u00E3o foi poss\u00EDvel ler o documento.");
        setLoadingIA(false);
        if(fileRef.current) fileRef.current.value="";
      });
    };
    reader.onerror = function(){ setMsgIA("Erro ao ler arquivo."); setLoadingIA(false); };
    reader.readAsDataURL(file);
  };

  // =====================================================
  // LÓGICA DE CÁLCULO v3.4
  // - Imputação cronológica (art. 354 CC)
  // - 13º vence em dezembro (não antecipado)
  // =====================================================
  var calcular = function() {
    if(!usuario.autenticado&&!perfil.nome){alert("Fa\u00E7a login no perfil para continuar.");return;}
    setLoading(true);setResultado(null);
    setTimeout(function(){
      var h = new Date();
      var mH = h.getMonth() + 1;
      var aH = h.getFullYear();

      // 1) Montar parcelas brutas ordenadas cronologicamente
      var raw = parcelas
        .filter(function(p){return p.valor&&Number(p.valor)>0})
        .sort(function(a,b){return a.ano!==b.ano?a.ano-b.ano:a.mes-b.mes})
        .map(function(p){return {
          mes:p.mes, ano:p.ano, label:fmtMes(p.mes,p.ano), smVig:getSM(p.mes===13?12:p.mes,p.ano),
          nominal:r2(Number(p.valor)), pago:r2(Number(p.pago||0)), is13:!!p.is13
        }});

      // 2) Incluir 13º se marcado — vence em dezembro do respectivo ano
      if(incluir13){
        var anosSet={};
        raw.filter(function(p){return !p.is13}).forEach(function(p){anosSet[p.ano]=true});
        var anos=Object.keys(anosSet).map(Number);
        var parcelas13=[];
        anos.forEach(function(ano){
          var doAno=raw.filter(function(p){return p.ano===ano&&!p.is13});
          if(doAno.length>0){
            var ja13=raw.filter(function(p){return p.ano===ano&&p.is13}).length>0;
            if(!ja13){
              // Só inclui se dezembro do ano já venceu (ou é o mês atual)
              var hoje = new Date();
              var dezVencido = (ano < hoje.getFullYear()) || (ano === hoje.getFullYear() && hoje.getMonth() >= 11);
              if(dezVencido){
                var soma=0; doAno.forEach(function(p){soma+=p.nominal});
                var media=r2(soma/doAno.length);
                // mes=13 indica 13º; na ordenação fica APÓS dez (mes 12) do mesmo ano
                parcelas13.push({mes:13,ano:ano,label:"13\u00BA/"+ano,smVig:getSM(12,ano),nominal:media,pago:0,is13:true});
              }
            }
          }
        });
        raw=raw.concat(parcelas13).sort(function(a,b){
          // 13º (mes=13) fica após dezembro (mes=12) do mesmo ano
          return a.ano!==b.ano?a.ano-b.ano:a.mes-b.mes;
        });
      }

      if(!raw.length){setLoading(false);return;}

      // 3) Coletar pagamentos (valor nominal, sem correção — produz efeito na data do pagamento)
      var pagamentos = [];
      raw.forEach(function(p) {
        if (p.pago > 0) {
          pagamentos.push({
            valor: p.pago,
            mesPgto: p.mes === 13 ? 12 : p.mes,
            anoPgto: p.ano,
            labelOrigem: p.label
          });
        }
      });

      // 4) IMPUTAÇÃO CRONOLÓGICA COM CORREÇÃO ATÉ A DATA DO PAGAMENTO
      //
      // Para cada pagamento (ordenado cronologicamente):
      //   a) Corrige cada parcela devida (nominal) até a data do pagamento (IPCA-E + juros 1% a.m.)
      //   b) O valor pago NÃO é corrigido — já está no valor do dia
      //   c) Abate da parcela mais antiga para a mais recente
      //   d) Se sobrar saldo devedor nominal numa parcela, ele é registrado como saldo remanescente
      //      (será corrigido até a data-base no passo final)
      //
      // Estrutura: cada parcela mantém um "saldoNominal" que vai sendo reduzido

      // Inicializar saldos nominais
      var saldosNominais = raw.map(function(p) {
        return { saldoNominal: p.nominal }; // começa com o valor integral
      });

      var logImputacao = [];

      // Processar cada pagamento em ordem cronológica
      pagamentos.forEach(function(pg) {
        var saldoPgto = pg.valor; // valor nominal do pagamento

        for (var i = 0; i < raw.length; i++) {
          if (saldoPgto <= 0) break;
          if (saldosNominais[i].saldoNominal <= 0) continue;

          // Corrigir o saldo nominal desta parcela ATÉ a data do pagamento
          var mesParc = raw[i].mes === 13 ? 12 : raw[i].mes;
          var calcAtePgto = corrigirAte(saldosNominais[i].saldoNominal, mesParc, raw[i].ano, pg.mesPgto, pg.anoPgto);
          var devidoAtePgto = calcAtePgto.total; // valor corrigido + juros até a data do pagamento

          if (saldoPgto >= devidoAtePgto) {
            // Pagamento quita integralmente esta parcela
            saldoPgto = r2(saldoPgto - devidoAtePgto);
            logImputacao.push({
              parcelaDestino: raw[i].label,
              valorAbatido: devidoAtePgto,
              pgtoOrigem: pg.labelOrigem,
              quitada: true,
              saldoNominalAntes: saldosNominais[i].saldoNominal
            });
            saldosNominais[i].saldoNominal = 0;
          } else {
            // Pagamento abate parcialmente — calcular quanto do nominal foi quitado
            // Proporção: se pagou X de um total corrigido Y, quitou (X/Y) do nominal
            var proporcao = saldoPgto / devidoAtePgto;
            var nominalQuitado = r2(saldosNominais[i].saldoNominal * proporcao);
            logImputacao.push({
              parcelaDestino: raw[i].label,
              valorAbatido: saldoPgto,
              pgtoOrigem: pg.labelOrigem,
              quitada: false,
              saldoNominalAntes: saldosNominais[i].saldoNominal
            });
            saldosNominais[i].saldoNominal = r2(saldosNominais[i].saldoNominal - nominalQuitado);
            saldoPgto = 0;
          }
        }

        // Se sobrou pagamento após quitar tudo, registrar crédito
        if (saldoPgto > 0) {
          logImputacao.push({
            parcelaDestino: "(cr\u00E9dito excedente)",
            valorAbatido: saldoPgto,
            pgtoOrigem: pg.labelOrigem,
            quitada: false,
            creditoExcedente: true
          });
        }
      });

      // 5) Agora corrigir os saldos nominais remanescentes até a data-base (hoje)
      var parcelasCorrigidas = raw.map(function(p, idx) {
        var saldoNom = saldosNominais[idx].saldoNominal;
        var quitado = saldoNom <= 0;
        var calc;
        if (quitado) {
          calc = { fator: 1, corrigido: 0, juros: 0, total: 0, mesesAtraso: 0 };
        } else {
          calc = corrigir(saldoNom, p.mes, p.ano);
        }
        // Calcular também a correção do nominal integral para exibição
        var calcIntegral = corrigir(p.nominal, p.mes, p.ano);
        // Somar créditos aplicados nesta parcela (para exibição)
        var creditoApl = 0;
        logImputacao.forEach(function(l) {
          if (l.parcelaDestino === p.label && !l.creditoExcedente) {
            creditoApl = r2(creditoApl + l.valorAbatido);
          }
        });
        return Object.assign({}, p, {
          fator: calcIntegral.fator,
          corrigido: quitado ? 0 : calc.corrigido,
          juros: quitado ? 0 : calc.juros,
          total: quitado ? 0 : calc.total,
          mesesAtraso: calcIntegral.mesesAtraso,
          saldoBruto: saldoNom,
          saldoNominalOriginal: p.nominal,
          creditoAplicado: creditoApl,
          quitado: quitado,
          pagoOriginal: p.pago
        });
      });

      // 6) Separar em blocos
      var prisaoItems = parcelasCorrigidas.slice(-3);
      var penhoraItems = parcelasCorrigidas.slice(0, -3);

      var somaArr = function(arr) { var s=0; arr.forEach(function(x){s+=x.total}); return r2(s); };

      // Crédito excedente (se houver)
      var creditoExcedente = 0;
      logImputacao.forEach(function(l) {
        if (l.creditoExcedente) creditoExcedente = r2(creditoExcedente + l.valorAbatido);
      });

      // 7) Gerar texto automático de imputação
      var obsImputacao = "";
      if (pagamentos.length > 0) {
        var pgLabels = [];
        pagamentos.forEach(function(pg) {
          pgLabels.push(pg.labelOrigem + " (" + fmt(pg.valor) + ")");
        });

        var parcelasQuitadas = logImputacao.filter(function(l) { return l.quitada; });
        var parcelasAbatidas = logImputacao.filter(function(l) { return !l.quitada && l.valorAbatido > 0 && !l.creditoExcedente; });

        obsImputacao = "IMPUTA\u00C7\u00C3O DE PAGAMENTOS (art. 354 CC): ";
        obsImputacao += "Pagamento(s) efetuado(s) em " + pgLabels.join(", ") + ". ";
        obsImputacao += "Cada parcela devida foi corrigida (IPCA-E + juros de 1% a.m.) at\u00E9 a data do respectivo pagamento, e o valor pago foi imputado nas parcelas mais antigas, conforme ordem cronol\u00F3gica. ";
        obsImputacao += "O saldo remanescente de cada parcela n\u00E3o integralmente quitada continua sendo corrigido at\u00E9 a data-base do c\u00E1lculo. ";

        if (parcelasQuitadas.length > 0) {
          var nomes = parcelasQuitadas.map(function(l) { return l.parcelaDestino; });
          obsImputacao += "Parcela(s) integralmente quitada(s): " + nomes.join(", ") + ". ";
        }
        if (parcelasAbatidas.length > 0) {
          var nomesP = parcelasAbatidas.map(function(l) { return l.parcelaDestino + " (abatido " + fmt(l.valorAbatido) + ")"; });
          obsImputacao += "Parcela(s) parcialmente abatida(s): " + nomesP.join(", ") + ". ";
        }
        if (creditoExcedente > 0) {
          obsImputacao += "Cr\u00E9dito excedente ap\u00F3s quita\u00E7\u00E3o de todas as parcelas: " + fmt(creditoExcedente) + ".";
        }
      }

      // 9) Justificativa final
      var justFinal = "";
      if (justificativa.trim()) justFinal = justificativa.trim();
      if (obsImputacao) {
        if (justFinal) justFinal += "\n\n";
        justFinal += obsImputacao;
      }

      var res = {
        processo:processo, alimentado:alimentado, alimentante:alimentante, comarca:comarca, diaVencimento:diaVencimento,
        tipoAlimento:tipoAlimento, percentualSM:percentualSM, valorFixoAlimento:valorFixoAlimento,
        justificativa:justFinal,
        prisao:prisaoItems, penhora:penhoraItems, totalPrisao:somaArr(prisaoItems), totalPenhora:somaArr(penhoraItems),
        data:new Date().toLocaleDateString("pt-BR"), defensor:perfil.nome||"", lotacao:perfil.lotacao||"",
        obsImputacao: obsImputacao,
        creditoRemanescente: creditoExcedente
      };
      setResultado(res);
      var hist=[Object.assign({id:Date.now()},res,{total:r2(somaArr(prisaoItems)+somaArr(penhoraItems))})].concat(historico).slice(0,50);
      setHistorico(hist);localStorage.setItem("dpe_historico",JSON.stringify(hist));
      setLoading(false);
    },400);
  };

  var gerarPDF = function() {
    if(!resultado)return;
    var jsPDFLib=window.jspdf&&window.jspdf.jsPDF||window.jsPDF;
    if(!jsPDFLib){alert("PDF n\u00E3o carregou. Recarregue a p\u00E1gina.");return;}
    carregarLogo().then(function(logoData){
      var doc=new jsPDFLib({orientation:"landscape",unit:"mm",format:"a4"});
      var W=297,mg=12,y=0;

      // === CABEÇALHO ===
      doc.setFillColor(26,107,58);doc.rect(0,0,W,28,"F");
      if(logoData){try{var lh=22,lw=Math.max(lh*_logoRatio,30);doc.addImage(logoData,"PNG",6,3,lw,lh);doc.addImage(logoData,"PNG",W-6-lw,3,lw,lh)}catch(e){}}
      doc.setTextColor(255,255,255);doc.setFontSize(14);doc.setFont("helvetica","bold");
      doc.text("MEMORIAL DE C\u00C1LCULO",W/2,10,{align:"center"});
      doc.setFontSize(9);doc.setFont("helvetica","normal");
      doc.text("D\u00E9bito Alimentar \u2014 Execu\u00E7\u00E3o de Alimentos (art. 528 CPC)",W/2,16,{align:"center"});
      doc.setFontSize(7.5);doc.text("APIDEP \u2014 Associa\u00E7\u00E3o Piauiense das Defensoras e Defensores P\u00FAblicos",W/2,22,{align:"center"});
      y=36;

      // === DADOS DO PROCESSO ===
      doc.setFillColor(232,245,238);doc.rect(mg,y,W-mg*2,28,"F");
      doc.setDrawColor(26,107,58);doc.setLineWidth(0.3);doc.rect(mg,y,W-mg*2,28);
      doc.setFillColor(26,107,58);doc.rect(mg,y,W-mg*2,7,"F");
      doc.setTextColor(255,255,255);doc.setFont("helvetica","bold");doc.setFontSize(8.5);
      doc.text("DADOS DO PROCESSO",mg+3,y+5);y+=9;
      var c1=mg+3,c2=mg+100,c3=mg+195;
      doc.setTextColor(40,40,40);doc.setFontSize(8);
      var lb=function(l,v,x,yy){doc.setFont("helvetica","bold");doc.text(l,x,yy);doc.setFont("helvetica","normal");doc.text(v||"-",x+doc.getTextWidth(l)+2,yy)};
      lb("Processo n\u00BA:",resultado.processo,c1,y);lb("Vara/Comarca:",resultado.comarca,c2,y);lb("Data-base:",resultado.data,c3,y);y+=8;
      lb("Exequente:",resultado.alimentado,c1,y);lb("Executado:",resultado.alimentante,c2,y);y+=6;
      var tl=resultado.tipoAlimento==="sm"?resultado.percentualSM+"% do sal\u00E1rio m\u00EDnimo federal":fmt(Number(resultado.valorFixoAlimento||0))+" (valor fixo)";
      lb("Alimentos fixados:",tl,c1,y);lb("Vencimento:","Dia "+resultado.diaVencimento,c2,y);lb("\u00CDndice:","IPCA-E",c3,y);y+=6;
      lb("Juros de mora:","1% ao m\u00EAs \u2014 art. 406 CC c/c art. 161, \u00A71\u00BA, CTN",c1,y);y+=8;

      // === JUSTIFICATIVA / OBSERVAÇÕES ===
      if(resultado.justificativa){
        doc.setTextColor(26,107,58);doc.setFont("helvetica","bold");doc.setFontSize(8.5);
        doc.text("JUSTIFICATIVA / OBSERVA\u00C7\u00D5ES",mg,y);y+=5;
        doc.setDrawColor(26,107,58);doc.line(mg,y,W-mg,y);y+=4;
        doc.setTextColor(40,40,40);doc.setFont("helvetica","normal");doc.setFontSize(8);
        var linhas=doc.splitTextToSize(resultado.justificativa,W-mg*2);
        linhas.forEach(function(l){if(y>185){doc.addPage();y=15}doc.text(l,mg,y);y+=4.5});
        y+=4;
      }

      // === TABELAS ===
      var desenharTabela=function(titulo,corRGB,items,subtotal,numI){
        if(y>150){doc.addPage();y=15}
        doc.setFillColor(corRGB[0],corRGB[1],corRGB[2]);doc.rect(mg,y,W-mg*2,7,"F");
        doc.setTextColor(255,255,255);doc.setFont("helvetica","bold");doc.setFontSize(8.5);
        doc.text(titulo,mg+3,y+5);y+=9;
        var cw=[8,18,20,20,20,18,18,18,20,20,10,18,20];
        var cx=[mg];cw.forEach(function(w,i){cx.push(cx[i]+w+1)});
        var hd=["#","Compet.","Vcto.","SM Vig.","Nominal","Pago","Cr\u00E9d.Apl.","Saldo","Fator","Corrigido","M.","Juros","Total"];
        doc.setFillColor(230,230,230);doc.rect(mg,y-2,W-mg*2,6,"F");
        doc.setTextColor(40,40,40);doc.setFont("helvetica","bold");doc.setFontSize(6);
        hd.forEach(function(h,i){doc.text(h,cx[i],y+2)});y+=7;
        items.forEach(function(p,i){
          if(y>182){doc.addPage();y=15}
          if(p.is13){doc.setFillColor(255,248,225);doc.rect(mg,y-2,W-mg*2,5.5,"F")}
          else if(i%2===0){doc.setFillColor(248,250,248);doc.rect(mg,y-2,W-mg*2,5.5,"F")}
          // 13º: vencimento = dia do vencimento + dezembro do ano
          var mesCorr=p.mes===13?12:p.mes;
          var vcto=String(resultado.diaVencimento).padStart(2,"0")+"/"+String(mesCorr).padStart(2,"0")+"/"+p.ano;
          doc.setTextColor(p.is13?"#1a5276":"#282828");doc.setFont("helvetica","normal");doc.setFontSize(6);
          doc.text(String(numI+i),cx[0],y+2);doc.text(p.label,cx[1],y+2);doc.text(vcto,cx[2],y+2);
          doc.text(fmt(p.smVig),cx[3],y+2);doc.text(fmt(p.nominal),cx[4],y+2);
          if(p.pagoOriginal>0){doc.setTextColor(26,107,58);doc.setFont("helvetica","bold")}
          doc.text(p.pagoOriginal>0?fmt(p.pagoOriginal):"-",cx[5],y+2);doc.setTextColor(40,40,40);doc.setFont("helvetica","normal");
          if(p.creditoAplicado>0){doc.setTextColor(26,82,118);doc.setFont("helvetica","bold");doc.text(fmt(p.creditoAplicado),cx[6],y+2);doc.setTextColor(40,40,40);doc.setFont("helvetica","normal")}
          else doc.text("-",cx[6],y+2);
          doc.setFont("helvetica","bold");
          if(p.quitado){doc.setTextColor(26,107,58);doc.text("QUITADO",cx[7],y+2)}
          else{doc.setTextColor(40,40,40);doc.text(fmt(r2(p.saldoBruto)),cx[7],y+2)}
          doc.setTextColor(40,40,40);doc.setFont("helvetica","normal");
          doc.text(p.fator.toFixed(6),cx[8],y+2);doc.text(p.quitado?"-":fmt(p.corrigido),cx[9],y+2);
          doc.text(String(p.mesesAtraso),cx[10],y+2);doc.text(p.quitado?"-":fmt(p.juros),cx[11],y+2);
          doc.setFont("helvetica","bold");
          if(p.quitado){doc.setTextColor(26,107,58);doc.text("-",cx[12],y+2)}
          else{doc.setTextColor(40,40,40);doc.text(fmt(p.total),cx[12],y+2)}
          y+=5.5;
        });
        doc.setFillColor(corRGB[0],corRGB[1],corRGB[2]);doc.rect(mg,y,W-mg*2,6,"F");
        doc.setTextColor(255,255,255);doc.setFont("helvetica","bold");doc.setFontSize(8);
        doc.text("SUBTOTAL: "+fmt(subtotal),W-mg-3,y+4,{align:"right"});y+=10;
      };

      if(resultado.penhora.length>0) desenharTabela("BLOCO 2 \u2014 D\u00C9BITO ANTERIOR (art. 528, \u00A78\u00BA, CPC)",[26,82,118],resultado.penhora,resultado.totalPenhora,1);
      if(resultado.prisao.length>0) desenharTabela("BLOCO 1 \u2014 \u00DALTIMAS 3 PARCELAS (art. 528, \u00A73\u00BA, CPC)",[26,107,58],resultado.prisao,resultado.totalPrisao,resultado.penhora.length+1);

      // === TOTALIZADORES ===
      if(y>165){doc.addPage();y=15}
      var bW=(W-mg*2-4)/2;
      doc.setFillColor(26,107,58);doc.rect(mg,y,bW,22,"F");
      doc.setTextColor(255,255,255);doc.setFont("helvetica","bold");doc.setFontSize(8);
      doc.text("BLOCO 1 \u2014 PRIS\u00C3O CIVIL",mg+3,y+7);doc.setFontSize(7);doc.setFont("helvetica","normal");
      doc.text("\u00DAltimas 3 parcelas \u2014 art. 528, \u00A73\u00BA, CPC",mg+3,y+12);doc.setFont("helvetica","bold");doc.setFontSize(12);
      doc.text(fmt(resultado.totalPrisao),mg+bW/2,y+19,{align:"center"});
      var x2=mg+bW+4;
      doc.setFillColor(26,82,118);doc.rect(x2,y,bW,22,"F");
      doc.setTextColor(255,255,255);doc.setFont("helvetica","bold");doc.setFontSize(8);
      doc.text("BLOCO 2 \u2014 PENHORA",x2+3,y+7);doc.setFontSize(7);doc.setFont("helvetica","normal");
      doc.text("Parcelas anteriores \u2014 art. 528, \u00A78\u00BA, CPC",x2+3,y+12);doc.setFont("helvetica","bold");doc.setFontSize(12);
      doc.text(fmt(resultado.totalPenhora),x2+bW/2,y+19,{align:"center"});y+=30;

      // === OBSERVAÇÕES FIXAS ===
      if(y>170){doc.addPage();y=15}
      doc.setTextColor(40,40,40);doc.setFont("helvetica","bold");doc.setFontSize(8);doc.text("Observa\u00E7\u00F5es:",mg,y);y+=5;
      doc.setFont("helvetica","normal");doc.setFontSize(7.5);
      var obs=[
        "1. Corre\u00E7\u00E3o monet\u00E1ria pelo IPCA-E (Res. CJF n\u00BA 134/2010).",
        "2. Juros de mora de 1% a.m. sobre valor corrigido (art. 406 CC c/c art. 161, \u00A71\u00BA, CTN).",
        "3. Data-base: "+resultado.data+". Sujeitos a complementa\u00E7\u00E3o at\u00E9 efetivo pagamento.",
        "4. Imputa\u00E7\u00E3o (art. 354 CC): parcelas corrigidas at\u00E9 a data do pagamento; valor pago imputado da mais antiga para a mais recente.",
        "5. Saldo nominal remanescente de parcela parcialmente quitada continua sendo corrigido at\u00E9 a data-base.",
        "6. Coluna \u2018Pago\u2019: m\u00EAs de refer\u00EAncia do pagamento. Coluna \u2018Cr\u00E9d.Apl.\u2019: valor abatido (parcela corrigida at\u00E9 a data do pagamento).",
        "7. 13\u00BA sal\u00E1rio: vencimento em dezembro do respectivo ano. Valor correspondente \u00E0 m\u00E9dia das parcelas do ano."
      ];
      obs.forEach(function(o){if(y>190){doc.addPage();y=15}doc.text(o,mg,y);y+=4.5});y+=8;

      // === ASSINATURA ===
      if(y>185){doc.addPage();y=15}
      doc.setFont("helvetica","normal");doc.setFontSize(9);doc.text(resultado.data,W/2,y,{align:"center"});y+=16;
      doc.setDrawColor(80,80,80);doc.setLineWidth(0.3);doc.line(W/2-45,y,W/2+45,y);y+=5;
      doc.setFont("helvetica","bold");doc.setFontSize(9.5);doc.text(resultado.defensor||"",W/2,y,{align:"center"});y+=5;
      doc.setFont("helvetica","normal");doc.setFontSize(8.5);doc.text("Defensor(a) P\u00FAblico(a)",W/2,y,{align:"center"});y+=4;
      if(resultado.lotacao) doc.text(resultado.lotacao,W/2,y,{align:"center"});

      var fn="Memorial_Calculo_"+(resultado.processo||"calculo")+"_"+resultado.data.replace(/\//g,"-")+".pdf";
      if(/iPad|iPhone|iPod/.test(navigator.userAgent)){var w=window.open();if(w)w.document.write("<html><body style='margin:0'><iframe src='"+doc.output("datauristring")+"' style='width:100%;height:100vh;border:none'></iframe></body></html>")}
      else doc.save(fn);
    });
  };

  var inpStyle = {width:"100%",padding:"8px",borderRadius:6,border:"1px solid "+C.borda,fontSize:13,boxSizing:"border-box"};

  return (
    <div style={{ fontFamily:"Segoe UI, Arial, sans-serif", minHeight:"100vh", background:"#f0f2f0" }}>
      <Header perfil={perfil} onPerfil={function(){setShowPerfil(true)}} onLogout={onLogout}/>
      {showPerfil && <ModalPerfil perfil={perfil} onSave={salvarPerfil} onClose={function(){setShowPerfil(false)}}/>}
      <div style={{ background:C.branco, borderBottom:"1px solid "+C.borda, display:"flex", padding:"0 28px" }}>
        {[["calc","Novo C\u00E1lculo"],["historico","Hist\u00F3rico"]].map(function(item){
          var id=item[0], label=item[1];
          return <button key={id} onClick={function(){setTab(id)}} style={{ padding:"14px 20px", border:"none", background:"transparent", cursor:"pointer", fontWeight:600, fontSize:14, color:tab===id?C.verde:C.cinza, borderBottom:tab===id?"3px solid "+C.verde:"3px solid transparent", touchAction:"manipulation" }}>{label}</button>
        })}
      </div>
      <div style={{ maxWidth:900, margin:"0 auto", padding:"24px 16px" }}>
        {tab==="calc" && (
          <div>
            {!perfil.nome && (
              <div style={{ background:"#fff8e1", border:"1px solid #f0c040", borderRadius:8, padding:"12px 18px", marginBottom:18, fontSize:14 }}>
                {"Configure seu perfil para aparecer nos PDFs. "}
                <span style={{ color:C.verde, cursor:"pointer", textDecoration:"underline" }} onClick={function(){setShowPerfil(true)}}>Configurar agora</span>
              </div>
            )}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:20 }}>
              <Card style={{ margin:0, borderTop:"3px solid "+C.azul }}>
                <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8 }}>
                  <span style={{ fontSize:20 }}>A</span>
                  <div><div style={{ fontWeight:700, color:C.azul, fontSize:14 }}>{"Op\u00E7\u00E3o A \u2014 Importar com IA"}</div><div style={{ fontSize:11, color:"#666" }}>{"Envie a senten\u00E7a e a IA preenche"}</div></div>
                </div>
                <input ref={fileRef} type="file" accept=".pdf,image/*" onChange={handleUpload} style={{ display:"none" }}/>
                <Btn onClick={function(){fileRef.current.click()}} disabled={loadingIA} cor={C.azul} small>{loadingIA ? "Processando..." : "Selecionar PDF ou imagem"}</Btn>
                {msgIA && <div style={{ marginTop:8, fontSize:12, color:msgIA.indexOf("OK")===0?C.verde:C.vermelho }}>{msgIA}</div>}
                {!perfil.apiKey && <div style={{ marginTop:6, fontSize:11, color:"#999" }}>Opcional. Requer chave API no perfil.</div>}
              </Card>
              <Card style={{ margin:0, borderTop:"3px solid "+C.verde }}>
                <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8 }}>
                  <span style={{ fontSize:20 }}>B</span>
                  <div><div style={{ fontWeight:700, color:C.verde, fontSize:14 }}>{"C\u00E1lculo Manual"}</div><div style={{ fontSize:11, color:"#666" }}>{"Sempre dispon\u00EDvel"}</div></div>
                </div>
                <div style={{ fontSize:12, color:"#555" }}>Preencha os dados abaixo.</div>
                <div style={{ marginTop:10 }}><span style={{ background:C.verdePale, color:C.verde, borderRadius:20, padding:"3px 10px", fontSize:11, fontWeight:600 }}>{"Sem conta necess\u00E1ria"}</span></div>
              </Card>
            </div>
            <Card>
              <h3 style={{ margin:"0 0 16px", color:C.verde, fontSize:15 }}>{"Dados do Processo"}</h3>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0 16px" }}>
                <div style={{ marginBottom:14 }}>
                  <label style={{ display:"block", fontWeight:600, marginBottom:4, color:C.cinza, fontSize:13 }}>{`N\u00FAmero do Processo`}</label>
                  <input type="text" inputMode="numeric" value={processo} onChange={function(e){setProcesso(maskProcesso(e.target.value))}} placeholder="0000000-00.0000.8.18.0000"
                    style={{ width:"100%", padding:"9px 12px", borderRadius:6, border:"1px solid "+C.borda, fontSize:14, boxSizing:"border-box", fontFamily:"monospace", letterSpacing:"0.5px" }}/>
                </div>
                <Input label="Vara/Comarca" value={comarca} onChange={setComarca} placeholder="Vara/Comarca"/>
                <Input label="Alimentado(a) / Exequente" value={alimentado} onChange={setAlimentado} placeholder="Nome completo"/>
                <Input label="Alimentante / Executado" value={alimentante} onChange={setAlimentante} placeholder="Nome completo"/>
              </div>
              <div style={{ marginBottom:14 }}>
                <label style={{ display:"block", fontWeight:600, marginBottom:8, color:C.cinza, fontSize:13 }}>Alimentos fixados em</label>
                <div style={{ display:"flex", gap:10, marginBottom:10 }}>
                  {[["sm","% do Sal\u00E1rio M\u00EDnimo"],["fixo","Valor fixo (R$)"]].map(function(item){
                    var v=item[0], l=item[1];
                    return <button key={v} onClick={function(){setTipoAlimento(v)}} style={{ padding:"7px 16px", borderRadius:6, border:"2px solid "+(tipoAlimento===v?C.verde:C.borda), background:tipoAlimento===v?C.verde:C.branco, color:tipoAlimento===v?"#fff":C.cinza, fontWeight:600, fontSize:13, cursor:"pointer", touchAction:"manipulation" }}>{l}</button>
                  })}
                </div>
                {tipoAlimento==="sm"
                  ? <div style={{ display:"flex", alignItems:"center", gap:8 }}><input type="number" value={percentualSM} onChange={function(e){setPercentualSM(e.target.value)}} placeholder="ex: 20" style={{ width:100, padding:"9px 12px", borderRadius:6, border:"1px solid "+C.borda, fontSize:14, boxSizing:"border-box" }}/><span style={{ fontSize:14, color:C.cinza }}>{"% do sal\u00E1rio m\u00EDnimo federal"}</span></div>
                  : <div style={{ display:"flex", alignItems:"center", gap:8 }}><span style={{ fontSize:14, color:C.cinza }}>R$</span><input type="number" value={valorFixoAlimento} onChange={function(e){setValorFixoAlimento(e.target.value)}} placeholder="0,00" style={{ width:150, padding:"9px 12px", borderRadius:6, border:"1px solid "+C.borda, fontSize:14, boxSizing:"border-box" }}/></div>
                }
              </div>
              <div style={{ maxWidth:200 }}><Input label="Dia de vencimento" value={diaVencimento} onChange={setDiaVencimento} placeholder="5" type="number"/></div>
            </Card>
            <Card>
              <h3 style={{ margin:"0 0 16px", color:C.verde, fontSize:15 }}>{"Op\u00E7\u00F5es Adicionais"}</h3>
              <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:16, padding:"12px 16px", background:incluir13?"#fff8e1":"#f9f9f9", border:"1px solid "+(incluir13?"#f0c040":C.borda), borderRadius:8 }}>
                <input type="checkbox" checked={incluir13} onChange={function(e){setIncluir13(e.target.checked)}} style={{ width:20, height:20, cursor:"pointer" }}/>
                <div>
                  <div style={{ fontWeight:700, fontSize:13, color:C.cinza }}>{"Incluir 13\u00BA sal\u00E1rio"}</div>
                  <div style={{ fontSize:11, color:"#888" }}>{"Gera parcela de 13\u00BA ao final de cada ano (m\u00E9dia dos meses). Vencimento: dezembro. Valor edit\u00E1vel manualmente."}</div>
                </div>
              </div>
              <div>
                <label style={{ display:"block", fontWeight:600, marginBottom:4, color:C.cinza, fontSize:13 }}>{"Justificativa / Observa\u00E7\u00F5es (aparece no PDF)"}</label>
                <textarea value={justificativa} onChange={function(e){setJustificativa(e.target.value)}} rows={4}
                  placeholder={"Ex.: C\u00E1lculo elaborado com base na senten\u00E7a proferida nos autos..."}
                  style={{ width:"100%", padding:"10px 12px", borderRadius:6, border:"1px solid "+C.borda, fontSize:13, boxSizing:"border-box", resize:"vertical", fontFamily:"inherit", lineHeight:1.5 }}/>
              </div>
            </Card>
            <Card>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
                <h3 style={{ margin:0, color:C.verde, fontSize:15 }}>Parcelas em Atraso</h3>
                <div style={{ display:"flex", gap:8 }}>
                  <Btn small onClick={function(){
                    if(!showIntervalo){
                      var p2 = calcMesFimPadrao(diaVencimento);
                      setIntervalo(function(prev){return Object.assign({},prev,{mesFim:p2.mesFim,anoFim:p2.anoFim})});
                    }
                    setShowIntervalo(!showIntervalo);
                  }} cor={C.azul}>Intervalo</Btn>
                  <Btn small onClick={addParcela} cor={C.verdeClaro}>+ Avulsa</Btn>
                  {parcelas.length>0 && <Btn small onClick={limparParcelas} cor={C.vermelho} outline>Limpar</Btn>}
                </div>
              </div>
              {showIntervalo && (
                <div style={{ background:"#f0f4f8", border:"1px solid "+C.azul, borderRadius:8, padding:16, marginBottom:16 }}>
                  <div style={{ fontWeight:700, color:C.azul, marginBottom:8 }}>Adicionar intervalo</div>
                  <div style={{ fontSize:12, color:"#555", marginBottom:12, background:"#e8f0f8", padding:"8px 12px", borderRadius:6 }}>
                    {"Valor: "}{tipoAlimento==="sm" ? (percentualSM||"?")+"% do SM vigente" : "R$ "+(valorFixoAlimento||"?")+" (fixo)"}
                  </div>
                  <div style={{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:8, alignItems:"end" }}>
                    <div><label style={{ fontSize:11, fontWeight:600, color:C.cinza, display:"block", marginBottom:3 }}>{"M\u00EAs ini"}</label><select value={intervalo.mesIni} onChange={function(e){setIntervalo(Object.assign({},intervalo,{mesIni:Number(e.target.value)}))}} style={inpStyle}>{MESES.map(function(m,idx){return <option key={idx} value={idx+1}>{m}</option>})}</select></div>
                    <div><label style={{ fontSize:11, fontWeight:600, color:C.cinza, display:"block", marginBottom:3 }}>Ano ini</label><input type="number" value={intervalo.anoIni} onChange={function(e){setIntervalo(Object.assign({},intervalo,{anoIni:Number(e.target.value)}))}} style={inpStyle}/></div>
                    <div><label style={{ fontSize:11, fontWeight:600, color:C.cinza, display:"block", marginBottom:3 }}>{"M\u00EAs fim"}</label><select value={intervalo.mesFim} onChange={function(e){setIntervalo(Object.assign({},intervalo,{mesFim:Number(e.target.value)}))}} style={inpStyle}>{MESES.map(function(m,idx){return <option key={idx} value={idx+1}>{m}</option>})}</select></div>
                    <div><label style={{ fontSize:11, fontWeight:600, color:C.cinza, display:"block", marginBottom:3 }}>Ano fim</label><input type="number" value={intervalo.anoFim} onChange={function(e){setIntervalo(Object.assign({},intervalo,{anoFim:Number(e.target.value)}))}} style={inpStyle}/></div>
                    <div><label style={{ fontSize:11, fontWeight:600, color:C.cinza, display:"block", marginBottom:3 }}>Pago (R$)</label><input type="number" value={intervalo.pago} onChange={function(e){setIntervalo(Object.assign({},intervalo,{pago:e.target.value}))}} placeholder="0,00" style={inpStyle}/></div>
                  </div>
                  <div style={{ marginTop:12, display:"flex", gap:8, alignItems:"center" }}>
                    <Btn small onClick={addIntervalo} cor={C.azul}>{"Adicionar "+contarParcelas()+" parcelas"}</Btn>
                    <Btn small onClick={function(){setShowIntervalo(false)}} outline cor={C.cinza}>Fechar</Btn>
                  </div>
                </div>
              )}
              {parcelas.map(function(p){
                return (
                  <div key={p.id} style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr 1fr auto", gap:10, alignItems:"end", marginBottom:10, padding:12, background:p.is13?"#fff8e1":C.cinzaClaro, borderRadius:8, border:p.is13?"1px solid #f0c040":"none" }}>
                    <div>
                      <label style={{ fontSize:12, fontWeight:600, color:C.cinza, display:"block", marginBottom:3 }}>{p.is13?"13\u00BA Sal\u00E1rio":"M\u00EAs"}</label>
                      {p.is13
                        ? <div style={{ padding:8, fontSize:13, color:C.azul, fontWeight:700 }}>{"13\u00BA/"+p.ano}</div>
                        : <select value={p.mes} onChange={function(e){editParcela(p.id,"mes",Number(e.target.value))}} style={inpStyle}>{MESES.map(function(m,idx){return <option key={idx} value={idx+1}>{m}</option>})}</select>
                      }
                    </div>
                    <div><label style={{ fontSize:12, fontWeight:600, color:C.cinza, display:"block", marginBottom:3 }}>Ano</label><input type="number" value={p.ano} onChange={function(e){editParcela(p.id,"ano",Number(e.target.value))}} style={inpStyle}/></div>
                    <div><label style={{ fontSize:12, fontWeight:600, color:C.cinza, display:"block", marginBottom:3 }}>Valor (R$)</label><input type="number" value={p.valor} onChange={function(e){editParcela(p.id,"valor",e.target.value)}} placeholder="0,00" style={inpStyle}/></div>
                    <div><label style={{ fontSize:12, fontWeight:600, color:C.cinza, display:"block", marginBottom:3 }}>Pago (R$)</label><input type="number" value={p.pago} onChange={function(e){editParcela(p.id,"pago",e.target.value)}} placeholder="0,00" style={inpStyle}/></div>
                    <button onClick={function(){removeParcela(p.id)}} style={{ background:"transparent", border:"none", cursor:"pointer", color:C.vermelho, fontSize:18, paddingBottom:4, touchAction:"manipulation" }}>{"\u2715"}</button>
                  </div>
                );
              })}
              <div style={{ marginTop:16 }}><Btn onClick={calcular} disabled={loading||parcelas.every(function(p){return !p.valor})}>{loading ? "Calculando..." : "Calcular D\u00E9bito"}</Btn></div>
            </Card>
            {resultado && (
              <Card style={{ borderLeft:"4px solid "+C.verde }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
                  <h3 style={{ margin:0, color:C.verde }}>Resultado</h3>
                  <Btn onClick={gerarPDF} cor={C.azul}>Gerar PDF</Btn>
                </div>
                {resultado.processo && <p style={{ margin:"0 0 4px", fontSize:13, color:"#666" }}>{"Processo: "}<strong>{resultado.processo}</strong></p>}
                {resultado.alimentado && <p style={{ margin:"0 0 16px", fontSize:13, color:"#666" }}>{"Alimentado(a): "}<strong>{resultado.alimentado}</strong></p>}

                {resultado.obsImputacao && (
                  <div style={{ background:"#fff8e1", border:"1px solid #f0c040", borderRadius:8, padding:"12px 16px", marginBottom:16, fontSize:12, color:"#555", lineHeight:1.6 }}>
                    <div style={{ fontWeight:700, color:"#b8860b", marginBottom:4, fontSize:13 }}>{"Imputa\u00E7\u00E3o de Pagamentos (art. 354 CC)"}</div>
                    {resultado.obsImputacao}
                    {resultado.creditoRemanescente > 0 && (
                      <div style={{ marginTop:8, fontWeight:700, color:C.verde }}>{"Cr\u00E9dito remanescente: " + fmt(resultado.creditoRemanescente)}</div>
                    )}
                  </div>
                )}

                {resultado.prisao.length>0 && (
                  <div style={{ background:C.verdePale, border:"1px solid "+C.verde, borderRadius:8, padding:16, marginBottom:12 }}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
                      <div style={{ fontWeight:700, color:C.verde }}>{"BLOCO 1 \u2014 Pris\u00E3o Civil"}</div>
                      <span style={{ background:C.verde, color:"#fff", borderRadius:20, padding:"3px 12px", fontSize:12, fontWeight:700 }}>{fmt(resultado.totalPrisao)}</span>
                    </div>
                    {resultado.prisao.map(function(p,i){
                      return (
                        <div key={i} style={{ display:"flex", justifyContent:"space-between", fontSize:13, marginTop:4 }}>
                          <span>{p.label}{p.is13?" [13\u00BA]":""}{p.pagoOriginal>0?(" (pago em ref.: "+fmt(p.pagoOriginal)+")"):""}{p.creditoAplicado>0?(" (cr\u00E9d.apl.: "+fmt(p.creditoAplicado)+")"):""}{p.quitado?" QUITADO":""}</span>
                          <span style={{ fontWeight:600, color:p.quitado?C.verde:"inherit" }}>{p.quitado?"-":fmt(p.total)}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
                {resultado.penhora.length>0 && (
                  <div style={{ background:"#e8f0f8", border:"1px solid "+C.azul, borderRadius:8, padding:16, marginBottom:12 }}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
                      <div style={{ fontWeight:700, color:C.azul }}>{"BLOCO 2 \u2014 Penhora"}</div>
                      <span style={{ background:C.azul, color:"#fff", borderRadius:20, padding:"3px 12px", fontSize:12, fontWeight:700 }}>{fmt(resultado.totalPenhora)}</span>
                    </div>
                    {resultado.penhora.map(function(p,i){
                      return (
                        <div key={i} style={{ display:"flex", justifyContent:"space-between", fontSize:13, marginTop:4 }}>
                          <span>{p.label}{p.is13?" [13\u00BA]":""}{p.pagoOriginal>0?(" (pago em ref.: "+fmt(p.pagoOriginal)+")"):""}{p.creditoAplicado>0?(" (cr\u00E9d.apl.: "+fmt(p.creditoAplicado)+")"):""}{p.quitado?" QUITADO":""}</span>
                          <span style={{ fontWeight:600, color:p.quitado?C.verde:"inherit" }}>{p.quitado?"-":fmt(p.total)}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginTop:8 }}>
                  <div style={{ background:C.verde, borderRadius:8, padding:"12px 16px", textAlign:"center" }}>
                    <div style={{ color:"#fff", fontSize:11, opacity:.8 }}>{"BLOCO 1 \u2014 Pris\u00E3o Civil"}</div>
                    <div style={{ color:"#fff", fontWeight:800, fontSize:18 }}>{fmt(resultado.totalPrisao)}</div>
                  </div>
                  <div style={{ background:C.azul, borderRadius:8, padding:"12px 16px", textAlign:"center" }}>
                    <div style={{ color:"#fff", fontSize:11, opacity:.8 }}>{"BLOCO 2 \u2014 Penhora"}</div>
                    <div style={{ color:"#fff", fontWeight:800, fontSize:18 }}>{fmt(resultado.totalPenhora)}</div>
                  </div>
                </div>
              </Card>
            )}
          </div>
        )}
        {tab==="historico" && (
          <Card>
            <h3 style={{ margin:"0 0 16px", color:C.verde }}>{"Hist\u00F3rico"}</h3>
            {historico.length===0 ? <p style={{ color:"#888", textAlign:"center", padding:32 }}>{"Nenhum c\u00E1lculo ainda."}</p>
              : historico.map(function(h){
                return (
                  <div key={h.id} style={{ borderBottom:"1px solid "+C.borda, padding:"14px 0", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                    <div><div style={{ fontWeight:600, fontSize:14 }}>{h.alimentado||"-"}</div><div style={{ fontSize:12, color:"#888" }}>{(h.processo||"Sem n\u00BA")+" \u2014 "+h.data}</div></div>
                    <div style={{ fontWeight:700, color:C.verde, fontSize:15 }}>{fmt(h.total||0)}</div>
                  </div>
                );
              })
            }
            {historico.length>0 && <div style={{ marginTop:16 }}><Btn small outline cor={C.vermelho} onClick={function(){if(confirm("Limpar hist\u00F3rico?")){setHistorico([]);localStorage.removeItem("dpe_historico")}}}>Limpar</Btn></div>}
          </Card>
        )}
      </div>
    </div>
  );
}
