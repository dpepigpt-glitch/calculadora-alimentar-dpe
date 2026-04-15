// v4.0 última MODAL — SELIC + Atualização de Débito (penhora e prisão civil)
import { useState, useRef } from "react";

var C = {
  verde: "#1a6b3a", verdeClaro: "#2d8a50", verdePale: "#e8f5ee",
  cinza: "#4a4a4a", cinzaClaro: "#f5f5f5", branco: "#ffffff",
  borda: "#d0d0d0", vermelho: "#c0392b", azul: "#1a5276",
  laranja: "#c0580a",
};

var r2 = function(v) { return Math.round((Number(v)||0) * 100) / 100; };
var fmt = function(v) { return "R$ " + r2(v).toFixed(2).replace(".", ",").replace(/\B(?=(\d{3})+(?!\d))/g, "."); };

var parseMoney = function(s) {
  if (!s && s !== 0) return 0;
  var str = String(s).trim().replace(/R\$\s*/g, "");
  if (str.indexOf(".") !== -1 && str.indexOf(",") !== -1) {
    str = str.replace(/\./g, "").replace(",", ".");
  } else if (str.indexOf(",") !== -1) {
    str = str.replace(",", ".");
  }
  var n = parseFloat(str);
  return isNaN(n) ? 0 : n;
};

var fmtInput = function(raw) {
  var digits = raw.replace(/[^0-9]/g, "");
  if (!digits) return "";
  while (digits.length < 3) digits = "0" + digits;
  var cents = digits.slice(-2);
  var reais = digits.slice(0, -2).replace(/^0+/, "") || "0";
  reais = reais.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return reais + "," + cents;
};

var fmtMes = function(mes, ano) {
  var n = ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"];
  return mes === 13 ? "13º/" + ano : n[mes-1] + "/" + ano;
};

var capitalizarNome = function(str) {
  if (!str) return str;
  return str.replace(/\b\w/g, function(c) { return c.toUpperCase(); });
};

function maskProcesso(digits) {
  var d = (digits || "").replace(/\D/g, "").slice(0, 17);
  var out = "";
  for (var i = 0; i < d.length; i++) {
    if (i === 7) out += "-";
    if (i === 9) out += ".";
    if (i === 13) out += ".8.18.";
    out += d[i];
  }
  return out;
}

function digitsFromDisplay(display) {
  var all = (display || "").replace(/\D/g, "");
  if (all.length > 13) {
    var antes = all.slice(0, 13);
    var depois = all.slice(13);
    var idx = depois.indexOf("818");
    if (idx >= 0 && idx <= 1) {
      depois = depois.slice(0, idx) + depois.slice(idx + 3);
    }
    return (antes + depois).slice(0, 17);
  }
  return all.slice(0, 17);
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

var getSM = function(m, a) {
  return SALARIO_MINIMO[a + "-" + String(m).padStart(2,"0")] || 1621;
};

var IPCA_E = {
  "2022-01":0.54,"2022-02":0.58,"2022-03":1.05,"2022-04":1.06,"2022-05":0.81,"2022-06":0.68,
  "2022-07":-0.07,"2022-08":-0.04,"2022-09":0.24,"2022-10":0.40,"2022-11":0.54,"2022-12":0.54,
  "2023-01":0.53,"2023-02":0.39,"2023-03":0.17,"2023-04":0.23,"2023-05":0.22,"2023-06":0.06,
  "2023-07":0.18,"2023-08":0.37,"2023-09":0.26,"2023-10":0.24,"2023-11":0.33,"2023-12":0.44,
  "2024-01":0.42,"2024-02":0.40,"2024-03":0.36,"2024-04":0.38,"2024-05":0.40,"2024-06":0.39,
  "2024-07":0.43,"2024-08":0.44,"2024-09":0.44,"2024-10":0.56,"2024-11":0.39,"2024-12":0.48,
  "2025-01":0.16,"2025-02":1.31,"2025-03":0.56,"2025-04":0.43,"2025-05":0.26,"2025-06":0.24,
  "2025-07":0.26,"2025-08":-0.11,"2025-09":0.48,"2025-10":0.09,"2025-11":-0.09,"2025-12":0.33,
  "2026-01":0.33,"2026-02":0.70,"2026-03":0.31,"2026-04":0.31,"2026-05":0.31,"2026-06":0.31,
  "2026-07":0.31,"2026-08":0.31,"2026-09":0.31,"2026-10":0.31,"2026-11":0.31,"2026-12":0.31
};

var SELIC = {
  "2022-01":0.73,"2022-02":0.76,"2022-03":0.93,"2022-04":0.83,"2022-05":1.03,"2022-06":1.03,
  "2022-07":1.03,"2022-08":1.07,"2022-09":1.07,"2022-10":1.07,"2022-11":1.07,"2022-12":1.07,
  "2023-01":1.07,"2023-02":0.98,"2023-03":1.07,"2023-04":1.03,"2023-05":1.07,"2023-06":1.03,
  "2023-07":1.07,"2023-08":1.07,"2023-09":1.00,"2023-10":0.92,"2023-11":0.89,"2023-12":0.89,
  "2024-01":0.89,"2024-02":0.83,"2024-03":0.83,"2024-04":0.83,"2024-05":0.83,"2024-06":0.83,
  "2024-07":0.83,"2024-08":0.83,"2024-09":0.83,"2024-10":0.96,"2024-11":1.00,"2024-12":1.07,
  "2025-01":1.07,"2025-02":1.07,"2025-03":1.16,"2025-04":1.07,"2025-05":1.07,"2025-06":1.07,
  "2025-07":1.07,"2025-08":1.07,"2025-09":1.07,"2025-10":1.07,"2025-11":1.07,"2025-12":1.07,
  "2026-01":1.07,"2026-02":1.07,"2026-03":1.07,"2026-04":1.07,"2026-05":1.07,"2026-06":1.07,
  "2026-07":1.07,"2026-08":1.07,"2026-09":1.07,"2026-10":1.07,"2026-11":1.07,"2026-12":1.07
};

function corrigirAteIPCA(saldo, mesVenc, anoVenc, mesAlvo, anoAlvo) {
  var fator = 1;
  var m = mesVenc; var a = anoVenc;
  while (a < anoAlvo || (a === anoAlvo && m < mesAlvo)) {
    var k = a + "-" + String(m).padStart(2,"0");
    if (IPCA_E[k] !== undefined) fator *= (1 + IPCA_E[k] / 100);
    m++; if (m > 12) { m = 1; a++; }
  }
  var meses = Math.max(0, (anoAlvo - anoVenc) * 12 + (mesAlvo - mesVenc));
  var corrigido = r2(saldo * fator);
  var juros = r2(corrigido * meses * 0.01);
  return {
    fator: r2(fator * 1000000) / 1000000,
    corrigido: corrigido,
    juros: juros,
    total: r2(corrigido + juros),
    mesesAtraso: meses,
    indiceLabel: "IPCA-E + Juros 1% a.m."
  };
}

function corrigirAteSELIC(saldo, mesVenc, anoVenc, mesAlvo, anoAlvo) {
  var fator = 1;
  var m = mesVenc; var a = anoVenc;
  while (a < anoAlvo || (a === anoAlvo && m < mesAlvo)) {
    var k = a + "-" + String(m).padStart(2,"0");
    var tx = SELIC[k] !== undefined ? SELIC[k] : 1.07;
    fator *= (1 + tx / 100);
    m++; if (m > 12) { m = 1; a++; }
  }
  var meses = Math.max(0, (anoAlvo - anoVenc) * 12 + (mesAlvo - mesVenc));
  var total = r2(saldo * fator);
  return {
    fator: r2(fator * 1000000) / 1000000,
    corrigido: total,
    juros: 0,
    total: total,
    mesesAtraso: meses,
    indiceLabel: "SELIC (acumulada)"
  };
}

function corrigirAte(saldo, mesVenc, anoVenc, mesAlvo, anoAlvo, indice) {
  if (indice === "selic") return corrigirAteSELIC(saldo, mesVenc, anoVenc, mesAlvo, anoAlvo);
  return corrigirAteIPCA(saldo, mesVenc, anoVenc, mesAlvo, anoAlvo);
}

function corrigir(saldo, mes, ano, indice) {
  var mesCorr = mes === 13 ? 12 : mes;
  var h = new Date();
  return corrigirAte(saldo, mesCorr, ano, h.getMonth() + 1, h.getFullYear(), indice);
}

var MESES = [
  "Janeiro","Fevereiro","Março","Abril","Maio","Junho",
  "Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"
];

var DEFENSORES = {
  "Dr. Robert Rios Júnior": { lotacao: "2ª Defensoria Itinerante", senha: "RR2027" },
  "Dra. Andrea Melo de Carvalho": { lotacao: "1ª Defensoria de Família", senha: "Andrea2027" },
  "Dra. Dayana Sampaio Mendes Magalhães": { lotacao: "2ª Defensoria Pública Regional de Altos", senha: "Dayana2027" },
  "Dr. Eric Leonardo Pires de Melo": { lotacao: "7ª Defensoria de Família", senha: "Eric2027" },
  "Dr. Jeiko Leal Melo Hohmann Brito": { lotacao: "13ª Defensoria de Família", senha: "JK2027" },
  "Dr. João Batista Viana do Lago Neto": { lotacao: "10ª Defensoria de Família", senha: "JB2027" },
  "Dr. João Castelo Branco de Vasconcelos Neto": { lotacao: "3ª Defensoria de Família", senha: "JN2027" },
  "Dra. Lívia de Oliveira Revorêado": { lotacao: "3ª Defensoria Pública Regional de São Raimundo Nonato", senha: "Livia2027" },
  "Dr. Marcos Martins de Oliveira": { lotacao: "2ª Defensoria de Floriano", senha: "Marcos2027" },
  "Dra. Priscila Gimenes do Nascimento Godoi": { lotacao: "2ª Defensoria Pública Regional de União", senha: "Priscila2027" },
  "Dr. Silvio César Queiroz Costa": { lotacao: "4ª Defensoria de Família", senha: "SC2027" },
  "Dra. Wênia Silva Moura": { lotacao: "3ª Defensoria Pública Regional de Campo Maior", senha: "Wenia2027" },
  "Dra. Julyanne Cristine Douglas Leone": { lotacao: "Assessora — 2ª Defensoria Itinerante", senha: "Julyanne2027" },
  "Dra. Giulia Mazza": { lotacao: "Assessora — 2ª Defensoria Regional de Piripiri", senha: "Giulia2027" }
};

var _logoB64 = null;
var _logoRatio = 4.0;

function renderizarLogoComFundo(b64, bgColor) {
  return new Promise(function(res) {
    var img = new Image();
    img.onload = function() {
      try {
        var cv = document.createElement("canvas");
        cv.width = img.naturalWidth; cv.height = img.naturalHeight;
        var ctx = cv.getContext("2d");
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, cv.width, cv.height);
        ctx.drawImage(img, 0, 0);
        _logoRatio = img.naturalWidth / img.naturalHeight;
        res(cv.toDataURL("image/png"));
      } catch(e) { res(b64); }
    };
    img.onerror = function() { res(b64); };
    img.src = b64;
  });
}

var _logoCache = {};

function carregarLogo(bgColor) {
  var cor = bgColor || "#1a6b3a";
  if (_logoCache[cor]) return Promise.resolve(_logoCache[cor]);
  return fetch("/logo-apidep.png")
    .then(function(r) { return r.blob(); })
    .then(function(blob) {
      return new Promise(function(res) {
        var reader = new FileReader();
        reader.onload = function() {
          renderizarLogoComFundo(reader.result, cor).then(function(b64final) {
            _logoCache[cor] = b64final;
            if (!_logoB64) _logoB64 = b64final;
            res(b64final);
          });
        };
        reader.onerror = function() { res(null); };
        reader.readAsDataURL(blob);
      });
    })
    .catch(function() { return null; });
}

// ===================== MODAL DE ACESSO RESTRITO =====================

function ModalAcesso(props) {
  if (!props.visivel) return null;
  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.60)",
      zIndex: 2000, display: "flex", alignItems: "center", justifyContent: "center"
    }}>
      <div style={{
        background: "#fff", borderRadius: 18, padding: "40px 44px 36px",
        width: 400, maxWidth: "90vw", textAlign: "center",
        boxShadow: "0 16px 56px rgba(0,0,0,0.30)"
      }}>
        <img
          src="/figurinha.png"
          alt="VOCÊ NÃO TEM PIX !!!"
          style={{ width: 120, height: 120, objectFit: "contain", marginBottom: 22 }}
          onError={function(e){ e.target.style.display = "none"; }}
        />
        <div style={{ fontWeight: 800, fontSize: 18, color: C.verde, marginBottom: 10 }}>
          {"Acesso Restrito"}
        </div>
        <div style={{ fontSize: 14, color: C.cinza, lineHeight: 1.7, marginBottom: 28 }}>
          {"Essa calculadora é somente para defensores legais."}
        </div>
        <button
          onClick={props.onClose}
          style={{
            background: C.verde, color: "#fff", border: "none",
            borderRadius: 8, padding: "11px 36px",
            fontSize: 15, fontWeight: 700, cursor: "pointer",
            width: "100%"
          }}>
          {"CAÍ FORA}
        </button>
      </div>
    </div>
  );
}

// ===================== COMPONENTES BASE =====================

function TelaLogin(props) {
  var _s1 = useState(""); var nome = _s1[0]; var setNome = _s1[1];
  var _s2 = useState(""); var senha = _s2[0]; var setSenha = _s2[1];
  var _s3 = useState(""); var erro = _s3[0]; var setErro = _s3[1];
  var tentar = function() {
    var def = DEFENSORES[nome];
    if (!nome || !def) { setErro("Selecione um defensor."); return; }
    if (senha !== def.senha) { setErro("Senha incorreta."); return; }
    props.onLogin({ nome: nome, lotacao: def.lotacao, autenticado: true });
  };
  return (
    <div style={{ minHeight:"100vh", background:"#f0f2f0", display:"flex", alignItems:"center", justifyContent:"center" }}>
      <div style={{ background:"#fff", borderRadius:12, padding:40, width:400, boxShadow:"0 8px 32px rgba(0,0,0,0.15)" }}>
        <div style={{ textAlign:"center", marginBottom:28 }}>
          <img src="/logo-apidep.png" alt="DEFCALC"
            style={{ height:60, objectFit:"contain", marginBottom:12 }}
            onError={function(e){e.target.style.display="none";}} />
          <div style={{ fontWeight:800, fontSize:16, color:C.verde }}>{"Calculadora de Débitos Alimentares"}</div>
          <div style={{ fontSize:12, color:"#888", marginTop:4 }}>{"Fase teste — Apenas Defensores Legais"}</div>
        </div>
        <div style={{ marginBottom:14 }}>
          <label style={{ display:"block", fontWeight:600, marginBottom:6, fontSize:13, color:C.cinza }}>{"Nome do Defensor"}</label>
          <select value={nome} onChange={function(e){setNome(e.target.value);}}
            style={{ width:"100%", padding:"10px 12px", borderRadius:6, border:"1px solid #d0d0d0", fontSize:14, boxSizing:"border-box" }}>
            <option value="">{"-- Selecione --"}</option>
            {Object.keys(DEFENSORES).map(function(d,i){ return <option key={i} value={d}>{d}</option>; })}
          </select>
          {nome && DEFENSORES[nome] && (
            <div style={{ fontSize:12, color:C.verde, marginTop:4, paddingLeft:4 }}>{"» "}{DEFENSORES[nome].lotacao}</div>
          )}
        </div>
        <div style={{ marginBottom:20 }}>
          <label style={{ display:"block", fontWeight:600, marginBottom:6, fontSize:13, color:C.cinza }}>{"Senha de Acesso"}</label>
          <input type="password" value={senha}
            onChange={function(e){setSenha(e.target.value);}}
            onKeyDown={function(e){if(e.key==="Enter")tentar();}}
            placeholder={"Digite a senha"}
            style={{ width:"100%", padding:"10px 12px", borderRadius:6, border:"1px solid #d0d0d0", fontSize:14, boxSizing:"border-box" }} />
        </div>
        {erro && (
          <div style={{ background:"#fdecea", border:"1px solid #e57373", borderRadius:6, padding:"10px 12px", fontSize:12, color:C.vermelho, marginBottom:16 }}>{erro}</div>
        )}
        <button onClick={tentar}
          style={{ width:"100%", background:C.verde, color:"#fff", border:"none", borderRadius:6, padding:12, fontSize:15, fontWeight:700, cursor:"pointer", marginBottom:10 }}>
          {"Entrar"}
        </button>
        <button onClick={props.onVisitante}
          style={{ width:"100%", background:"transparent", color:C.cinza, border:"1px solid "+C.borda, borderRadius:6, padding:10, fontSize:13, cursor:"pointer" }}>
          {"Entrar sem login (visitante)"}
        </button>
      </div>
    </div>
  );
}

function Btn(props) {
  var cor = props.cor || C.verde;
  return (
    <button onClick={props.onClick} disabled={props.disabled} style={{
      background: props.outline ? "transparent" : cor,
      color: props.outline ? cor : "#fff",
      border: "2px solid " + cor,
      borderRadius: 6,
      padding: props.small ? "6px 14px" : "10px 22px",
      cursor: props.disabled ? "not-allowed" : "pointer",
      fontWeight: 600, fontSize: props.small ? 13 : 15,
      opacity: props.disabled ? 0.5 : 1, touchAction: "manipulation"
    }}>{props.children}</button>
  );
}

function Input(props) {
  return (
    <div style={{ marginBottom:14 }}>
      {props.label && <label style={{ display:"block", fontWeight:600, marginBottom:4, color:C.cinza, fontSize:13 }}>{props.label}</label>}
      <input type={props.type||"text"} value={props.value}
        onChange={function(e){props.onChange(e.target.value);}}
        placeholder={props.placeholder} disabled={props.disabled}
        style={{ width:"100%", padding:"9px 12px", borderRadius:6, border:"1px solid "+C.borda, fontSize:14, boxSizing:"border-box", background: props.disabled ? C.cinzaClaro : C.branco }} />
    </div>
  );
}

function Card(props) {
  return (
    <div style={Object.assign({ background:C.branco, borderRadius:10, border:"1px solid "+C.borda, padding:24, marginBottom:20 }, props.style||{})}>
      {props.children}
    </div>
  );
}

function SeletorIndice(props) {
  var indice = props.indice;
  var setIndice = props.setIndice;
  return (
    <div style={{ marginBottom:16 }}>
      <label style={{ display:"block", fontWeight:700, marginBottom:8, color:C.cinza, fontSize:13 }}>
        {"Índice de Correção e Juros"}
      </label>
      <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
        {[
          ["ipca", "IPCA-E + Juros 1% a.m.", "Correção monetária (IPCA) + juros de mora 1% a.m."],
          ["selic", "SELIC", "Taxa SELIC acumulada — substitui correção e juros"]
        ].map(function(item){
          var v=item[0], l=item[1], desc=item[2];
          var ativo = indice === v;
          return (
            <button key={v} onClick={function(){setIndice(v);}} style={{
              padding:"10px 18px", borderRadius:8,
              border:"2px solid "+(ativo?C.verde:C.borda),
              background: ativo ? C.verdePale : C.branco,
              color: ativo ? C.verde : C.cinza,
              fontWeight: ativo ? 700 : 500, fontSize:13, cursor:"pointer",
              textAlign:"left", touchAction:"manipulation"
            }}>
              <div style={{ fontWeight:700, fontSize:13 }}>{l}</div>
              <div style={{ fontSize:11, color:"#888", marginTop:2 }}>{desc}</div>
            </button>
          );
        })}
      </div>
      {indice === "selic" && (
        <div style={{ marginTop:8, background:"#fff8e1", border:"1px solid #f0c040", borderRadius:6, padding:"8px 12px", fontSize:11, color:"#7a6000" }}>
          {"SELIC: índices oficiais até mar/2026. A partir de abr/2026: projeção de 1,07% a.m. Sujeito a revisão quando publicados os valores definitivos."}
        </div>
      )}
    </div>
  );
}

function ModalPerfil(props) {
  var perfil = props.perfil;
  var _s1 = useState(perfil.nome || ""); var nome = _s1[0]; var setNome = _s1[1];
  var _s2 = useState(perfil.apiKey || ""); var apiKey = _s2[0]; var setApiKey = _s2[1];
  var _s3 = useState(false); var showKey = _s3[0]; var setShowKey = _s3[1];
  var _s4 = useState(""); var senhaModal = _s4[0]; var setSenhaModal = _s4[1];
  var _s5 = useState(""); var erroModal = _s5[0]; var setErroModal = _s5[1];
  var def = DEFENSORES[nome];
  var salvar = function() {
    if (nome && def && senhaModal !== def.senha) { setErroModal("Senha incorreta."); return; }
    props.onSave({ nome: nome, lotacao: def ? def.lotacao : "", apiKey: apiKey });
    props.onClose();
  };
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.5)", zIndex:1000, display:"flex", alignItems:"center", justifyContent:"center" }}>
      <div style={{ background:C.branco, borderRadius:12, padding:32, width:460, maxWidth:"90vw", boxShadow:"0 8px 32px rgba(0,0,0,0.2)" }}>
        <h2 style={{ margin:"0 0 20px", color:C.verde }}>{"Configurar Perfil"}</h2>
        <div style={{ marginBottom:14 }}>
          <label style={{ display:"block", fontWeight:600, marginBottom:4, color:C.cinza, fontSize:13 }}>{"Nome do Defensor"}</label>
          <select value={nome} onChange={function(e){setNome(e.target.value);setErroModal("");setSenhaModal("");}}
            style={{ width:"100%", padding:"9px 12px", borderRadius:6, border:"1px solid "+C.borda, fontSize:14, boxSizing:"border-box" }}>
            <option value="">{"-- Nenhum (visitante) --"}</option>
            {Object.keys(DEFENSORES).map(function(d,i){ return <option key={i} value={d}>{d}</option>; })}
          </select>
        </div>
        {nome && def && (
          <div>
            <div style={{ marginBottom:14 }}>
              <label style={{ display:"block", fontWeight:600, marginBottom:4, color:C.cinza, fontSize:13 }}>{"Defensoria"}</label>
              <input value={def.lotacao} disabled style={{ width:"100%", padding:"9px 12px", borderRadius:6, border:"1px solid "+C.borda, fontSize:14, boxSizing:"border-box", background:C.cinzaClaro }} />
            </div>
            <div style={{ marginBottom:14 }}>
              <label style={{ display:"block", fontWeight:600, marginBottom:4, color:C.cinza, fontSize:13 }}>{"Senha"}</label>
              <input type="password" value={senhaModal}
                onChange={function(e){setSenhaModal(e.target.value);setErroModal("");}}
                onKeyDown={function(e){if(e.key==="Enter")salvar();}}
                placeholder={"Senha"}
                style={{ width:"100%", padding:"9px 12px", borderRadius:6, border:"1px solid "+(erroModal?C.vermelho:C.borda), fontSize:14, boxSizing:"border-box" }} />
              {erroModal && <div style={{ fontSize:12, color:C.vermelho, marginTop:4 }}>{erroModal}</div>}
            </div>
          </div>
        )}
        <div style={{ marginBottom:14 }}>
          <label style={{ display:"block", fontWeight:600, marginBottom:4, color:C.cinza, fontSize:13 }}>{"Chave API (opcional)"}</label>
          <div style={{ position:"relative" }}>
            <input type={showKey?"text":"password"} value={apiKey}
              onChange={function(e){setApiKey(e.target.value);}}
              placeholder={"sk-ant-..."}
              style={{ width:"100%", padding:"9px 40px 9px 12px", borderRadius:6, border:"1px solid "+C.borda, fontSize:13, boxSizing:"border-box" }} />
            <button onClick={function(){setShowKey(!showKey);}}
              style={{ position:"absolute", right:10, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer", fontSize:16 }}>
              {showKey?"✕":"○"}
            </button>
          </div>
        </div>
        <div style={{ display:"flex", gap:10 }}>
          <Btn onClick={salvar}>{"Salvar"}</Btn>
          <Btn onClick={props.onClose} outline cor={C.cinza}>{"Cancelar"}</Btn>
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
        <img src="/logo-apidep.png" alt="DEFCALC"
          style={{ height:56, objectFit:"contain" }}
          onError={function(e){e.target.style.display="none";}} />
        <div>
          <div style={{ fontWeight:800, fontSize:16 }}>{"Calculadora de Débitos Alimentares"}</div>
          <div style={{ fontSize:12, opacity:.8 }}>{"DEFCALC — AMIGOS DA DEFENSORIA"}</div>
        </div>
      </div>
      <div style={{ display:"flex", gap:8, alignItems:"center" }}>
        <button onClick={props.onPerfil}
          style={{ background:"rgba(255,255,255,0.15)", border:"1px solid rgba(255,255,255,0.4)", borderRadius:6, color:"#fff", padding:"7px 14px", cursor:"pointer", fontSize:13 }}>
          {perfil.nome || "Visitante"}
        </button>
        <button onClick={props.onLogout}
          style={{ background:"rgba(255,255,255,0.1)", border:"1px solid rgba(255,255,255,0.3)", borderRadius:6, color:"#fff", padding:"7px 12px", cursor:"pointer", fontSize:12 }}>
          {"Sair"}
        </button>
      </div>
    </div>
  );
}

function novaParcela() {
  var h = new Date();
  return { id: Date.now(), mes: h.getMonth()+1, ano: h.getFullYear(), valor: "", pago: "", is13: false };
}

// ===================== GERADOR PDF COMPLETO =====================

function gerarPDFCompleto(resultado, logoData) {
  var jsPDFLib = window.jspdf && window.jspdf.jsPDF || window.jsPDF;
  if (!jsPDFLib) { alert("PDF não carregou. Recarregue a página."); return; }
  var doc = new jsPDFLib({ orientation:"landscape", unit:"mm", format:"a4" });
  var W=297, mg=12, y=0;

  doc.setFillColor(26,107,58); doc.rect(0,0,W,28,"F");
  if (logoData) {
    try { var lh=18, lw=Math.min(Math.max(lh*_logoRatio,30),65); doc.addImage(logoData,"PNG",6,5,lw,lh); doc.addImage(logoData,"PNG",W-6-lw,5,lw,lh); } catch(e){}
  }
  doc.setTextColor(255,255,255);
  doc.setFontSize(14); doc.setFont("helvetica","bold");
  doc.text("MEMORIAL DE CÁLCULO", W/2, 10, {align:"center"});
  doc.setFontSize(9); doc.setFont("helvetica","normal");
  doc.text("Débito Alimentar — Execução de Alimentos (art. 528 CPC)", W/2, 16, {align:"center"});
  doc.setFontSize(7.5);
  doc.text("DEFCALC — AMIGOS DA DEFENSORIA", W/2, 22, {align:"center"});
  y = 36;

  doc.setFillColor(232,245,238); doc.rect(mg,y,W-mg*2,40,"F");
  doc.setDrawColor(26,107,58); doc.setLineWidth(0.3); doc.rect(mg,y,W-mg*2,40);
  doc.setFillColor(26,107,58); doc.rect(mg,y,W-mg*2,7,"F");
  doc.setTextColor(255,255,255); doc.setFont("helvetica","bold"); doc.setFontSize(8.5);
  doc.text("DADOS DO PROCESSO", mg+3, y+5);
  y += 10;
  var c1=mg+4, c2=mg+105, c3=mg+200;
  doc.setTextColor(40,40,40); doc.setFontSize(9.5);
  var lb = function(l,v,x,yy){
    doc.setFont("helvetica","bold"); doc.text(l,x,yy);
    doc.setFont("helvetica","normal"); doc.text(v||"-", x+doc.getTextWidth(l)+2, yy);
  };
  lb("Processo nº:", resultado.processo, c1, y);
  lb("Vara/Comarca:", resultado.comarca, c2, y);
  lb("Data-base:", resultado.data, c3, y);
  y += 8;
  lb("Exequente:", resultado.alimentado, c1, y);
  lb("Executado:", resultado.alimentante, c2, y);
  y += 8;
  var tl = resultado.tipoAlimento==="sm"
    ? resultado.percentualSM+"% do salário mínimo federal"
    : fmt(parseMoney(resultado.valorFixoAlimento||"0"))+" (valor fixo)";
  lb("Alimentos fixados:", tl, c1, y);
  lb("Vencimento:", "Dia "+resultado.diaVencimento, c2, y);
  lb("Índice:", resultado.indiceLabel || "IPCA-E (IBGE)", c3, y);
  y += 8;
  if (resultado.indice === "ipca") {
    lb("Juros de mora:", "1% ao mês — art. 406 CC c/c art. 161, §1º, CTN", c1, y);
  } else {
    lb("SELIC:", "Taxa acumulada mensal (substitui correção e juros)", c1, y);
  }
  y += 10;

  if (resultado.justificativa) {
    doc.setTextColor(26,107,58); doc.setFont("helvetica","bold"); doc.setFontSize(8.5);
    doc.text("JUSTIFICATIVA / OBSERVAÇÕES", mg, y);
    y += 5;
    doc.setDrawColor(26,107,58); doc.line(mg,y,W-mg,y); y += 4;
    doc.setTextColor(40,40,40); doc.setFont("helvetica","normal"); doc.setFontSize(8);
    var linhas = doc.splitTextToSize(resultado.justificativa, W-mg*2);
    linhas.forEach(function(l){ if(y>185){doc.addPage();y=15;} doc.text(l,mg,y); y+=4.5; });
    y += 4;
  }

  var desenharTabela = function(titulo, corRGB, items, subtotal, numI) {
    if (y > 150) { doc.addPage(); y=15; }
    doc.setFillColor(corRGB[0],corRGB[1],corRGB[2]); doc.rect(mg,y,W-mg*2,7,"F");
    doc.setTextColor(255,255,255); doc.setFont("helvetica","bold"); doc.setFontSize(8.5);
    doc.text(titulo, mg+3, y+5); y += 9;
    var cw=[8,18,20,20,20,18,18,18,20,20,10,18,20];
    var cx=[mg];
    cw.forEach(function(w,i){cx.push(cx[i]+w+1);});
    var hd=["#","Compet.","Vcto.","SM Vig.","Nominal","Pago","Créd.Apl.","Saldo","Fator","Corrigido","M.","Juros","Total"];
    doc.setFillColor(230,230,230); doc.rect(mg,y-2,W-mg*2,6,"F");
    doc.setTextColor(40,40,40); doc.setFont("helvetica","bold"); doc.setFontSize(6);
    hd.forEach(function(h,i){doc.text(h,cx[i],y+2);});
    y += 7;
    items.forEach(function(p,i){
      if(y>182){doc.addPage();y=15;}
      if(p.is13){doc.setFillColor(255,248,225);doc.rect(mg,y-2,W-mg*2,5.5,"F");}
      else if(i%2===0){doc.setFillColor(248,250,248);doc.rect(mg,y-2,W-mg*2,5.5,"F");}
      var mesCorr=p.mes===13?12:p.mes;
      var vcto=String(resultado.diaVencimento).padStart(2,"0")+"/"+String(mesCorr).padStart(2,"0")+"/"+p.ano;
      doc.setTextColor(40,40,40); doc.setFont("helvetica","normal"); doc.setFontSize(6);
      doc.text(String(numI+i),cx[0],y+2);
      doc.text(p.label,cx[1],y+2);
      doc.text(vcto,cx[2],y+2);
      doc.text(fmt(p.smVig),cx[3],y+2);
      doc.text(fmt(p.nominal),cx[4],y+2);
      if(p.pagoOriginal>0){doc.setTextColor(26,107,58);doc.setFont("helvetica","bold");}
      doc.text(p.pagoOriginal>0?fmt(p.pagoOriginal):"-",cx[5],y+2);
      doc.setTextColor(40,40,40); doc.setFont("helvetica","normal");
      if(p.creditoAplicado>0){doc.setTextColor(26,82,118);doc.setFont("helvetica","bold");doc.text(fmt(p.creditoAplicado),cx[6],y+2);doc.setTextColor(40,40,40);doc.setFont("helvetica","normal");}
      else{doc.text("-",cx[6],y+2);}
      doc.setFont("helvetica","bold");
      if(p.quitado){doc.setTextColor(26,107,58);doc.text("QUITADO",cx[7],y+2);}
      else{doc.setTextColor(40,40,40);doc.text(fmt(r2(p.saldoBruto)),cx[7],y+2);}
      doc.setTextColor(40,40,40); doc.setFont("helvetica","normal");
      doc.text(p.fator.toFixed(6),cx[8],y+2);
      doc.text(p.quitado?"-":fmt(p.corrigido),cx[9],y+2);
      doc.text(String(p.mesesAtraso),cx[10],y+2);
      doc.text((p.quitado||resultado.indice==="selic")?"-":fmt(p.juros),cx[11],y+2);
      doc.setFont("helvetica","bold");
      if(p.quitado){doc.setTextColor(26,107,58);doc.text("-",cx[12],y+2);}
      else{doc.setTextColor(40,40,40);doc.text(fmt(p.total),cx[12],y+2);}
      y += 5.5;
    });
    doc.setFillColor(corRGB[0],corRGB[1],corRGB[2]); doc.rect(mg,y,W-mg*2,6,"F");
    doc.setTextColor(255,255,255); doc.setFont("helvetica","bold"); doc.setFontSize(8);
    doc.text("SUBTOTAL: "+fmt(subtotal), W-mg-3, y+4, {align:"right"});
    y += 10;
  };

  if (resultado.penhora.length > 0)
    desenharTabela("BLOCO 2 — DÉBITO ANTERIOR (art. 528, §8º, CPC)", [26,82,118], resultado.penhora, resultado.totalPenhora, 1);
  if (resultado.prisao.length > 0)
    desenharTabela("BLOCO 1 — ÚLTIMAS 3 PARCELAS (art. 528, §3º, CPC)", [26,107,58], resultado.prisao, resultado.totalPrisao, resultado.penhora.length+1);

  if(y>165){doc.addPage();y=15;}
  var bW=(W-mg*2-4)/2;
  doc.setFillColor(26,107,58); doc.rect(mg,y,bW,22,"F");
  doc.setTextColor(255,255,255); doc.setFont("helvetica","bold"); doc.setFontSize(8);
  doc.text("BLOCO 1 — PRISÃO CIVIL", mg+3, y+7);
  doc.setFontSize(7); doc.setFont("helvetica","normal");
  doc.text("Últimas 3 parcelas — art. 528, §3º, CPC", mg+3, y+12);
  doc.setFont("helvetica","bold"); doc.setFontSize(12);
  doc.text(fmt(resultado.totalPrisao), mg+bW/2, y+19, {align:"center"});
  var x2=mg+bW+4;
  doc.setFillColor(26,82,118); doc.rect(x2,y,bW,22,"F");
  doc.setTextColor(255,255,255); doc.setFont("helvetica","bold"); doc.setFontSize(8);
  doc.text("BLOCO 2 — PENHORA", x2+3, y+7);
  doc.setFontSize(7); doc.setFont("helvetica","normal");
  doc.text("Parcelas anteriores — art. 528, §8º, CPC", x2+3, y+12);
  doc.setFont("helvetica","bold"); doc.setFontSize(12);
  doc.text(fmt(resultado.totalPenhora), x2+bW/2, y+19, {align:"center"});
  y += 30;

  if(y>170){doc.addPage();y=15;}
  doc.setTextColor(40,40,40); doc.setFont("helvetica","bold"); doc.setFontSize(8);
  doc.text("Observações:", mg, y); y += 5;
  doc.setFont("helvetica","normal"); doc.setFontSize(7.5);
  var obsLines = resultado.indice === "selic" ? [
    "1. Atualização pela taxa SELIC acumulada mensal (substitui correção monetária e juros de mora). Índices oficiais até mar/2026. A partir de abr/2026: projeção de 1,07% a.m. Sujeito a revisão.",
    "2. SELIC como fator único de atualização do débito alimentar (art. 406 CC c/c Lei 9.250/95).",
    "3. Bloco 1 (art. 528, §3º, CPC): últimas 3 parcelas — execução pelo rito da prisão civil.",
    "4. Bloco 2 (art. 528, §8º, CPC): parcelas anteriores — execução pelo rito da penhora.",
    "5. Imputação de pagamentos nos débitos mais antigos (art. 354 CC)."
  ] : [
    "1. Correção monetária pelo IPCA (IBGE). Índices oficiais até fev/2026. A partir de mar/2026: projeção de 0,31% a.m. Sujeito a revisão quando publicados os índices definitivos.",
    "2. Juros de mora: 1% ao mês, pro rata die, sobre o valor corrigido (art. 406 CC c/c art. 161, §1º, CTN).",
    "3. Bloco 1 (art. 528, §3º, CPC): últimas 3 parcelas — execução pelo rito da prisão civil.",
    "4. Bloco 2 (art. 528, §8º, CPC): parcelas anteriores — execução pelo rito da penhora.",
    "5. Imputação de pagamentos nos débitos mais antigos (art. 354 CC)."
  ];
  obsLines.forEach(function(o){ if(y>190){doc.addPage();y=15;} doc.text(o,mg,y); y+=4.5; });
  y += 8;

  if(y>185){doc.addPage();y=15;}
  doc.setFont("helvetica","normal"); doc.setFontSize(9);
  doc.text(resultado.data, W/2, y, {align:"center"}); y+=16;
  doc.setDrawColor(80,80,80); doc.setLineWidth(0.3); doc.line(W/2-45,y,W/2+45,y); y+=5;
  doc.setFont("helvetica","bold"); doc.setFontSize(9.5);
  doc.text(resultado.defensor||"", W/2, y, {align:"center"}); y+=5;
  doc.setFont("helvetica","normal"); doc.setFontSize(8.5);
  doc.text("Defensor(a) Público(a)", W/2, y, {align:"center"}); y+=4;
  if(resultado.lotacao) doc.text(resultado.lotacao, W/2, y, {align:"center"});

  var fn = "Memorial_Calculo_"+(resultado.processo||"calculo")+"_"+resultado.data.replace(/\//g,"-")+".pdf";
  try {
    var blob=doc.output("blob"); var blobUrl=URL.createObjectURL(blob);
    var link=document.createElement("a"); link.href=blobUrl; link.download=fn;
    link.style.display="none"; document.body.appendChild(link); link.click();
    setTimeout(function(){document.body.removeChild(link);URL.revokeObjectURL(blobUrl);},500);
  } catch(e) {
    var w=window.open(); if(w){w.location.href=doc.output("bloburl");}else{doc.save(fn);}
  }
}

// ===================== GERADOR PDF ATUALIZAÇÃO PENHORA =====================

function gerarPDFAtuPenhora(dados, logoData) {
  var jsPDFLib = window.jspdf && window.jspdf.jsPDF || window.jsPDF;
  if (!jsPDFLib) { alert("PDF não carregou."); return; }
  var doc = new jsPDFLib({ orientation:"landscape", unit:"mm", format:"a4" });
  var W=297, mg=12, y=0;

  doc.setFillColor(26,82,118); doc.rect(0,0,W,28,"F");
  if (logoData) {
    try { var lh=18, lw=Math.min(Math.max(lh*_logoRatio,30),65); doc.addImage(logoData,"PNG",6,5,lw,lh); doc.addImage(logoData,"PNG",W-6-lw,5,lw,lh); } catch(e){}
  }
  doc.setTextColor(255,255,255);
  doc.setFontSize(14); doc.setFont("helvetica","bold");
  doc.text("ATUALIZAÇÃO DE DÉBITO — RITO DA PENHORA", W/2, 10, {align:"center"});
  doc.setFontSize(9); doc.setFont("helvetica","normal");
  doc.text("Execução de Alimentos — art. 528, §8º, CPC (expropriação)", W/2, 16, {align:"center"});
  doc.setFontSize(7.5);
  doc.text("DEFCALC — AMIGOS DA DEFENSORIA", W/2, 22, {align:"center"});
  y = 36;

  doc.setFillColor(232,240,250); doc.rect(mg,y,W-mg*2,32,"F");
  doc.setDrawColor(26,82,118); doc.setLineWidth(0.3); doc.rect(mg,y,W-mg*2,32);
  doc.setFillColor(26,82,118); doc.rect(mg,y,W-mg*2,7,"F");
  doc.setTextColor(255,255,255); doc.setFont("helvetica","bold"); doc.setFontSize(8.5);
  doc.text("DADOS DO PROCESSO", mg+3, y+5);
  y += 10;
  var c1=mg+4, c2=mg+105, c3=mg+200;
  doc.setTextColor(40,40,40); doc.setFontSize(9.5);
  var lb = function(l,v,x,yy){
    doc.setFont("helvetica","bold"); doc.text(l,x,yy);
    doc.setFont("helvetica","normal"); doc.text(v||"-", x+doc.getTextWidth(l)+2, yy);
  };
  lb("Processo nº:", dados.processo, c1, y);
  lb("Vara/Comarca:", dados.comarca, c2, y);
  lb("Data-base:", dados.dataBase, c3, y);
  y += 8;
  lb("Exequente:", dados.alimentado, c1, y);
  lb("Executado:", dados.alimentante, c2, y);
  y += 8;
  lb("Índice:", dados.indiceLabel, c1, y);
  y += 12;

  doc.setFillColor(26,82,118); doc.rect(mg,y,W-mg*2,7,"F");
  doc.setTextColor(255,255,255); doc.setFont("helvetica","bold"); doc.setFontSize(8.5);
  doc.text("ATUALIZAÇÃO DO SALDO DEVEDOR", mg+3, y+5);
  y += 10;

  var colsP=[55,40,40,40,40,40];
  var cxP=[mg];
  colsP.forEach(function(w,i){cxP.push(cxP[i]+w+2);});
  var hdP=["Descrição","Data de Ref.","Valor de Ref. (R$)","Fator","Atualizado (R$)","Juros (R$)","Total Atualizado (R$)"];
  doc.setFillColor(230,230,230); doc.rect(mg,y-2,W-mg*2,7,"F");
  doc.setTextColor(40,40,40); doc.setFont("helvetica","bold"); doc.setFontSize(8);
  hdP.forEach(function(h,i){ if(cxP[i]<W-mg) doc.text(h,cxP[i],y+3); });
  y += 8;

  doc.setFillColor(248,250,248); doc.rect(mg,y-2,W-mg*2,7,"F");
  doc.setFont("helvetica","normal"); doc.setFontSize(8.5);
  doc.text("Saldo atualizado", cxP[0], y+3);
  doc.text(dados.dataRef, cxP[1], y+3);
  doc.text(fmt(dados.valorRef), cxP[2], y+3);
  doc.text(dados.fator.toFixed(6), cxP[3], y+3);
  doc.text(fmt(dados.corrigido), cxP[4], y+3);
  doc.text(dados.indice==="selic" ? "-" : fmt(dados.juros), cxP[5], y+3);
  doc.setFont("helvetica","bold");
  doc.text(fmt(dados.total), cxP[6], y+3);
  y += 12;

  doc.setFillColor(26,82,118); doc.rect(mg,y,W-mg*2,14,"F");
  doc.setTextColor(255,255,255); doc.setFont("helvetica","bold"); doc.setFontSize(9);
  doc.text("TOTAL ATUALIZADO (PENHORA) — art. 528, §8º, CPC", mg+4, y+6);
  doc.setFontSize(14);
  doc.text(fmt(dados.total), W-mg-4, y+10, {align:"right"});
  y += 22;

  doc.setTextColor(40,40,40); doc.setFont("helvetica","bold"); doc.setFontSize(8);
  doc.text("Observações:", mg, y); y += 5;
  doc.setFont("helvetica","normal"); doc.setFontSize(7.5);
  var obs = dados.indice === "selic" ? [
    "1. Atualização pela taxa SELIC acumulada mensal, contada a partir da data de referência até a data-base do cálculo.",
    "2. A SELIC substitui a correção monetária e os juros de mora (art. 406 CC c/c Lei 9.250/95).",
    "3. Índices SELIC oficiais até mar/2026. A partir de abr/2026: projeção de 1,07% a.m. Sujeito a revisão.",
    "4. Rito da penhora (expropriação) — art. 528, §8º, CPC."
  ] : [
    "1. Correção monetária pelo IPCA-E (IBGE), contada a partir da data de referência até a data-base do cálculo.",
    "2. Juros de mora: 1% ao mês sobre o valor corrigido (art. 406 CC c/c art. 161, §1º, CTN).",
    "3. Índices oficiais até fev/2026. A partir de mar/2026: projeção de 0,31% a.m. Sujeito a revisão.",
    "4. Rito da penhora (expropriação) — art. 528, §8º, CPC."
  ];
  obs.forEach(function(o){ doc.text(o,mg,y); y+=4.5; });
  if (dados.justificativa) {
    y += 4;
    doc.setFont("helvetica","bold"); doc.setFontSize(8);
    doc.text("Justificativa / Observações adicionais:", mg, y); y += 5;
    doc.setFont("helvetica","normal"); doc.setFontSize(8);
    var linhas=doc.splitTextToSize(dados.justificativa, W-mg*2);
    linhas.forEach(function(l){if(y>190){doc.addPage();y=15;} doc.text(l,mg,y); y+=4.5;});
  }
  y += 10;

  if(y>185){doc.addPage();y=15;}
  doc.setFont("helvetica","normal"); doc.setFontSize(9);
  doc.text(dados.dataBase, W/2, y, {align:"center"}); y+=16;
  doc.setDrawColor(80,80,80); doc.setLineWidth(0.3); doc.line(W/2-45,y,W/2+45,y); y+=5;
  doc.setFont("helvetica","bold"); doc.setFontSize(9.5);
  doc.text(dados.defensor||"", W/2, y, {align:"center"}); y+=5;
  doc.setFont("helvetica","normal"); doc.setFontSize(8.5);
  doc.text("Defensor(a) Público(a)", W/2, y, {align:"center"}); y+=4;
  if(dados.lotacao) doc.text(dados.lotacao, W/2, y, {align:"center"});

  var fn="Atualizacao_Penhora_"+(dados.processo||"calculo")+"_"+dados.dataBase.replace(/\//g,"-")+".pdf";
  try {
    var blob=doc.output("blob"); var blobUrl=URL.createObjectURL(blob);
    var link=document.createElement("a"); link.href=blobUrl; link.download=fn;
    link.style.display="none"; document.body.appendChild(link); link.click();
    setTimeout(function(){document.body.removeChild(link);URL.revokeObjectURL(blobUrl);},500);
  } catch(e) {
    var w=window.open(); if(w){w.location.href=doc.output("bloburl");}else{doc.save(fn);}
  }
}

// ===================== GERADOR PDF ATUALIZAÇÃO PRISÃO =====================

function gerarPDFAtuPrisao(resultado, logoData) {
  var jsPDFLib = window.jspdf && window.jspdf.jsPDF || window.jsPDF;
  if (!jsPDFLib) { alert("PDF não carregou."); return; }
  var doc = new jsPDFLib({ orientation:"landscape", unit:"mm", format:"a4" });
  var W=297, mg=12, y=0;

  doc.setFillColor(26,107,58); doc.rect(0,0,W,28,"F");
  if (logoData) {
    try { var lh=18, lw=Math.min(Math.max(lh*_logoRatio,30),65); doc.addImage(logoData,"PNG",6,5,lw,lh); doc.addImage(logoData,"PNG",W-6-lw,5,lw,lh); } catch(e){}
  }
  doc.setTextColor(255,255,255);
  doc.setFontSize(14); doc.setFont("helvetica","bold");
  doc.text("ATUALIZAÇÃO DE DÉBITO — RITO DA PRISÃO CIVIL", W/2, 10, {align:"center"});
  doc.setFontSize(9); doc.setFont("helvetica","normal");
  doc.text("Execução de Alimentos — art. 528, §3º, CPC (prisão civil)", W/2, 16, {align:"center"});
  doc.setFontSize(7.5);
  doc.text("DEFCALC — AMIGOS DA DEFENSORIA", W/2, 22, {align:"center"});
  y = 36;

  doc.setFillColor(232,245,238); doc.rect(mg,y,W-mg*2,32,"F");
  doc.setDrawColor(26,107,58); doc.setLineWidth(0.3); doc.rect(mg,y,W-mg*2,32);
  doc.setFillColor(26,107,58); doc.rect(mg,y,W-mg*2,7,"F");
  doc.setTextColor(255,255,255); doc.setFont("helvetica","bold"); doc.setFontSize(8.5);
  doc.text("DADOS DO PROCESSO", mg+3, y+5);
  y += 10;
  var c1=mg+4, c2=mg+105, c3=mg+200;
  doc.setTextColor(40,40,40); doc.setFontSize(9.5);
  var lb=function(l,v,x,yy){doc.setFont("helvetica","bold");doc.text(l,x,yy);doc.setFont("helvetica","normal");doc.text(v||"-",x+doc.getTextWidth(l)+2,yy);};
  lb("Processo nº:", resultado.processo, c1, y);
  lb("Vara/Comarca:", resultado.comarca, c2, y);
  lb("Data-base:", resultado.data, c3, y);
  y += 8;
  lb("Exequente:", resultado.alimentado, c1, y);
  lb("Executado:", resultado.alimentante, c2, y);
  y += 8;
  lb("Índice:", resultado.indiceLabel||"IPCA-E (IBGE)", c1, y);
  lb("Vencimento:", "Dia "+resultado.diaVencimento, c2, y);
  y += 12;

  if (resultado.justificativa) {
    doc.setTextColor(26,107,58); doc.setFont("helvetica","bold"); doc.setFontSize(8.5);
    doc.text("JUSTIFICATIVA / OBSERVAÇÕES", mg, y);
    y += 5; doc.setDrawColor(26,107,58); doc.line(mg,y,W-mg,y); y+=4;
    doc.setTextColor(40,40,40); doc.setFont("helvetica","normal"); doc.setFontSize(8);
    var linhas=doc.splitTextToSize(resultado.justificativa, W-mg*2);
    linhas.forEach(function(l){if(y>185){doc.addPage();y=15;}doc.text(l,mg,y);y+=4.5;});
    y+=4;
  }

  if(y>150){doc.addPage();y=15;}
  doc.setFillColor(26,107,58); doc.rect(mg,y,W-mg*2,7,"F");
  doc.setTextColor(255,255,255); doc.setFont("helvetica","bold"); doc.setFontSize(8.5);
  doc.text("PARCELAS EM ABERTO — RITO DA PRISÃO CIVIL (art. 528, §3º, CPC)", mg+3, y+5);
  y += 9;
  var cw=[8,18,20,20,20,18,18,18,20,20,10,18,20];
  var cx=[mg];
  cw.forEach(function(w,i){cx.push(cx[i]+w+1);});
  var hd=["#","Compet.","Vcto.","SM Vig.","Nominal","Pago","Créd.Apl.","Saldo","Fator","Corrigido","M.","Juros","Total"];
  doc.setFillColor(230,230,230); doc.rect(mg,y-2,W-mg*2,6,"F");
  doc.setTextColor(40,40,40); doc.setFont("helvetica","bold"); doc.setFontSize(6);
  hd.forEach(function(h,i){doc.text(h,cx[i],y+2);});
  y+=7;

  resultado.parcelas.forEach(function(p,i){
    if(y>182){doc.addPage();y=15;}
    if(p.is13){doc.setFillColor(255,248,225);doc.rect(mg,y-2,W-mg*2,5.5,"F");}
    else if(i%2===0){doc.setFillColor(248,250,248);doc.rect(mg,y-2,W-mg*2,5.5,"F");}
    var mesCorr=p.mes===13?12:p.mes;
    var vcto=String(resultado.diaVencimento).padStart(2,"0")+"/"+String(mesCorr).padStart(2,"0")+"/"+p.ano;
    doc.setTextColor(40,40,40); doc.setFont("helvetica","normal"); doc.setFontSize(6);
    doc.text(String(i+1),cx[0],y+2);
    doc.text(p.label,cx[1],y+2);
    doc.text(vcto,cx[2],y+2);
    doc.text(fmt(p.smVig),cx[3],y+2);
    doc.text(fmt(p.nominal),cx[4],y+2);
    if(p.pagoOriginal>0){doc.setTextColor(26,107,58);doc.setFont("helvetica","bold");}
    doc.text(p.pagoOriginal>0?fmt(p.pagoOriginal):"-",cx[5],y+2);
    doc.setTextColor(40,40,40); doc.setFont("helvetica","normal");
    if(p.creditoAplicado>0){doc.setTextColor(26,82,118);doc.setFont("helvetica","bold");doc.text(fmt(p.creditoAplicado),cx[6],y+2);doc.setTextColor(40,40,40);doc.setFont("helvetica","normal");}
    else{doc.text("-",cx[6],y+2);}
    doc.setFont("helvetica","bold");
    if(p.quitado){doc.setTextColor(26,107,58);doc.text("QUITADO",cx[7],y+2);}
    else{doc.setTextColor(40,40,40);doc.text(fmt(r2(p.saldoBruto)),cx[7],y+2);}
    doc.setTextColor(40,40,40); doc.setFont("helvetica","normal");
    doc.text(p.fator.toFixed(6),cx[8],y+2);
    doc.text(p.quitado?"-":fmt(p.corrigido),cx[9],y+2);
    doc.text(String(p.mesesAtraso),cx[10],y+2);
    doc.text((p.quitado||resultado.indice==="selic")?"-":fmt(p.juros),cx[11],y+2);
    doc.setFont("helvetica","bold");
    if(p.quitado){doc.setTextColor(26,107,58);doc.text("-",cx[12],y+2);}
    else{doc.setTextColor(40,40,40);doc.text(fmt(p.total),cx[12],y+2);}
    y+=5.5;
  });

  doc.setFillColor(26,107,58); doc.rect(mg,y,W-mg*2,6,"F");
  doc.setTextColor(255,255,255); doc.setFont("helvetica","bold"); doc.setFontSize(8);
  doc.text("TOTAL (PRISÃO CIVIL): "+fmt(resultado.total), W-mg-3, y+4, {align:"right"});
  y+=14;

  if(y>175){doc.addPage();y=15;}
  var bW=W-mg*2;
  doc.setFillColor(26,107,58); doc.rect(mg,y,bW,18,"F");
  doc.setTextColor(255,255,255); doc.setFont("helvetica","bold"); doc.setFontSize(9);
  doc.text("TOTAL — PRISÃO CIVIL — art. 528, §3º, CPC", mg+4, y+7);
  doc.setFontSize(14);
  doc.text(fmt(resultado.total), W-mg-4, y+13, {align:"right"});
  y+=26;

  if(y>170){doc.addPage();y=15;}
  doc.setTextColor(40,40,40); doc.setFont("helvetica","bold"); doc.setFontSize(8);
  doc.text("Observações:", mg, y); y+=5;
  doc.setFont("helvetica","normal"); doc.setFontSize(7.5);
  var obsP = resultado.indice==="selic" ? [
    "1. Atualização pela taxa SELIC acumulada mensal (índices oficiais até mar/2026; projeção 1,07% a.m. a partir de abr/2026).",
    "2. A SELIC substitui a correção monetária e os juros de mora (art. 406 CC c/c Lei 9.250/95).",
    "3. Todas as parcelas estão no rito da prisão civil — art. 528, §3º, CPC.",
    "4. Imputação de pagamentos nos débitos mais antigos (art. 354 CC)."
  ] : [
    "1. Correção monetária pelo IPCA-E (IBGE). Índices oficiais até fev/2026. A partir de mar/2026: projeção de 0,31% a.m.",
    "2. Juros de mora: 1% ao mês, pro rata die, sobre o valor corrigido (art. 406 CC c/c art. 161, §1º, CTN).",
    "3. Todas as parcelas estão no rito da prisão civil — art. 528, §3º, CPC.",
    "4. Imputação de pagamentos nos débitos mais antigos (art. 354 CC)."
  ];
  obsP.forEach(function(o){if(y>190){doc.addPage();y=15;}doc.text(o,mg,y);y+=4.5;});
  y+=8;

  if(y>185){doc.addPage();y=15;}
  doc.setFont("helvetica","normal"); doc.setFontSize(9);
  doc.text(resultado.data, W/2, y, {align:"center"}); y+=16;
  doc.setDrawColor(80,80,80); doc.setLineWidth(0.3); doc.line(W/2-45,y,W/2+45,y); y+=5;
  doc.setFont("helvetica","bold"); doc.setFontSize(9.5);
  doc.text(resultado.defensor||"", W/2, y, {align:"center"}); y+=5;
  doc.setFont("helvetica","normal"); doc.setFontSize(8.5);
  doc.text("Defensor(a) Público(a)", W/2, y, {align:"center"}); y+=4;
  if(resultado.lotacao) doc.text(resultado.lotacao, W/2, y, {align:"center"});

  var fn="Atualizacao_Prisao_"+(resultado.processo||"calculo")+"_"+resultado.data.replace(/\//g,"-")+".pdf";
  try {
    var blob=doc.output("blob"); var blobUrl=URL.createObjectURL(blob);
    var link=document.createElement("a"); link.href=blobUrl; link.download=fn;
    link.style.display="none"; document.body.appendChild(link); link.click();
    setTimeout(function(){document.body.removeChild(link);URL.revokeObjectURL(blobUrl);},500);
  } catch(e) {
    var w=window.open(); if(w){w.location.href=doc.output("bloburl");}else{doc.save(fn);}
  }
}

// ===================== ABA: ATUALIZAÇÃO DE DÉBITO =====================

function TabAtualizacao(props) {
  var perfil = props.perfil;
  var usuario = props.usuario;
  var onSalvarHistorico = props.onSalvarHistorico;
  var onAcessoNegado = props.onAcessoNegado || function(){};

  var _sm = useState("penhora"); var subModo = _sm[0]; var setSubModo = _sm[1];

  var _proc = useState(""); var processo = _proc[0]; var setProcesso = _proc[1];
  var _ali = useState(""); var alimentado = _ali[0]; var setAlimentado = _ali[1];
  var _ali2 = useState(""); var alimentante = _ali2[0]; var setAlimentante = _ali2[1];
  var _com = useState(""); var comarca = _com[0]; var setComarca = _com[1];
  var _ind = useState("ipca"); var indice = _ind[0]; var setIndice = _ind[1];
  var _just = useState(""); var justificativa = _just[0]; var setJustificativa = _just[1];

  var _vref = useState(""); var valorRef = _vref[0]; var setValorRef = _vref[1];
  var _mref = useState(1); var mesRef = _mref[0]; var setMesRef = _mref[1];
  var _aref = useState(2024); var anoRef = _aref[0]; var setAnoRef = _aref[1];
  var _resPen = useState(null); var resPenhora = _resPen[0]; var setResPenhora = _resPen[1];

  var _dia = useState("5"); var diaVencimento = _dia[0]; var setDiaVencimento = _dia[1];
  var _tipo = useState("sm"); var tipoAlimento = _tipo[0]; var setTipoAlimento = _tipo[1];
  var _pct = useState(""); var percentualSM = _pct[0]; var setPercentualSM = _pct[1];
  var _vfix = useState(""); var valorFixoAlimento = _vfix[0]; var setValorFixoAlimento = _vfix[1];
  var _parc = useState([novaParcela()]); var parcelas = _parc[0]; var setParcelas = _parc[1];
  var _si = useState(false); var showIntervalo = _si[0]; var setShowIntervalo = _si[1];
  var _i13 = useState(false); var incluir13 = _i13[0]; var setIncluir13 = _i13[1];
  var _resPri = useState(null); var resPrisao = _resPri[0]; var setResPrisao = _resPri[1];
  var _ld = useState(false); var loading = _ld[0]; var setLoading = _ld[1];

  var calcMesFimPadrao = function() {
    var hoje = new Date(); var dv=Number(diaVencimento)||5;
    var mA=hoje.getMonth()+1, aA=hoje.getFullYear();
    if(hoje.getDate()>=dv) return {mesFim:mA,anoFim:aA};
    var mAnt=mA-1, aAnt=aA; if(mAnt<1){mAnt=12;aAnt--;}
    return {mesFim:mAnt,anoFim:aAnt};
  };
  var padrao = calcMesFimPadrao();
  var _intv = useState({mesIni:1,anoIni:2024,mesFim:padrao.mesFim,anoFim:padrao.anoFim,pago:""});
  var intervalo = _intv[0]; var setIntervalo = _intv[1];

  var inpStyle = { width:"100%", padding:"8px", borderRadius:6, border:"1px solid "+C.borda, fontSize:13, boxSizing:"border-box" };

  var addParcela = function(){ setParcelas(function(p){ return p.concat([novaParcela()]); }); };
  var removeParcela = function(id){ setParcelas(function(p){ return p.filter(function(x){return x.id!==id;}); }); };
  var editParcela = function(id,campo,val){ setParcelas(function(p){ return p.map(function(x){ if(x.id===id){var n=Object.assign({},x);n[campo]=val;return n;} return x; }); }); };

  var contarParcelas = function(){
    var n=0,m=intervalo.mesIni,a=intervalo.anoIni;
    while(a<intervalo.anoFim||(a===intervalo.anoFim&&m<=intervalo.mesFim)){n++;m++;if(m>12){m=1;a++;}}
    return n;
  };
  var addIntervalo = function(){
    var novas=[]; var m=intervalo.mesIni,a=intervalo.anoIni;
    while(a<intervalo.anoFim||(a===intervalo.anoFim&&m<=intervalo.mesFim)){
      var valor; if(tipoAlimento==="sm") valor=r2(getSM(m,a)*Number(percentualSM)/100).toFixed(2); else valor=r2(parseMoney(valorFixoAlimento)).toFixed(2);
      novas.push({id:Date.now()+novas.length,mes:m,ano:a,valor:valor,pago:intervalo.pago?Number(intervalo.pago).toFixed(2):"",is13:false});
      m++;if(m>12){m=1;a++;}
    }
    setParcelas(function(prev){
      var ex={};prev.forEach(function(p){ex[p.ano+"-"+p.mes]=true;});
      var u=novas.filter(function(n){return !ex[n.ano+"-"+n.mes];});
      return prev.concat(u);
    });
    setIntervalo(function(i){return Object.assign({},i,{pago:""});});
  };

  var calcularPenhora = function(){
    var valorRefNum = parseMoney(valorRef);
    if (!valorRef || valorRefNum <= 0) { alert("Informe o valor de referência."); return; }
    var hoje = new Date();
    var mHoje = hoje.getMonth()+1, aHoje = hoje.getFullYear();
    var calc = corrigirAte(valorRefNum, mesRef, anoRef, mHoje, aHoje, indice);
    var labelIndice = indice==="selic" ? "SELIC (acumulada)" : "IPCA-E + Juros 1% a.m.";
    var dataBase = hoje.toLocaleDateString("pt-BR");
    var dataRef = MESES[mesRef-1]+"/"+anoRef;
    var res = {
      processo: maskProcesso(processo),
      alimentado: capitalizarNome(alimentado),
      alimentante: capitalizarNome(alimentante),
      comarca,
      indice, indiceLabel: labelIndice,
      valorRef: valorRefNum,
      dataRef: dataRef,
      dataBase: dataBase,
      mesRef, anoRef,
      fator: calc.fator,
      corrigido: calc.corrigido,
      juros: calc.juros,
      total: calc.total,
      mesesAtraso: calc.mesesAtraso,
      justificativa: justificativa.trim(),
      defensor: perfil.nome||"",
      lotacao: perfil.lotacao||""
    };
    setResPenhora(res);
    onSalvarHistorico({ id:Date.now(), tipo:"atu-penhora", alimentado: capitalizarNome(alimentado), processo:maskProcesso(processo), data:dataBase, total:calc.total });
  };

  var calcularPrisao = function(){
    if (!usuario.autenticado && !perfil.nome) { onAcessoNegado(); return; }
    setLoading(true); setResPrisao(null);
    setTimeout(function(){
      var raw = parcelas
        .filter(function(p){return p.valor&&Number(p.valor)>0;})
        .sort(function(a,b){return a.ano!==b.ano?a.ano-b.ano:a.mes-b.mes;})
        .map(function(p){return {
          mes:p.mes,ano:p.ano,label:fmtMes(p.mes,p.ano),
          smVig:getSM(p.mes===13?12:p.mes,p.ano),
          nominal:r2(Number(p.valor)),pago:r2(Number(p.pago||0)),is13:!!p.is13
        };});

      if (incluir13) {
        var anosSet={};
        raw.filter(function(p){return !p.is13;}).forEach(function(p){anosSet[p.ano]=true;});
        var anos13=Object.keys(anosSet).map(Number);
        var parc13=[];
        anos13.forEach(function(ano){
          var doAno=raw.filter(function(p){return p.ano===ano&&!p.is13;});
          if(doAno.length>0){
            var ja=raw.filter(function(p){return p.ano===ano&&p.is13;}).length>0;
            if(!ja){
              var hoje2=new Date();
              var dez=(ano<hoje2.getFullYear())||(ano===hoje2.getFullYear()&&hoje2.getMonth()>=11);
              if(dez){
                var soma=0;doAno.forEach(function(p){soma+=p.nominal;});
                var media=r2(soma/doAno.length);
                parc13.push({mes:13,ano,label:"13º/"+ano,smVig:getSM(12,ano),nominal:media,pago:0,is13:true});
              }
            }
          }
        });
        raw=raw.concat(parc13).sort(function(a,b){return a.ano!==b.ano?a.ano-b.ano:a.mes-b.mes;});
      }

      if (!raw.length){setLoading(false);return;}

      var pagamentos=[];
      raw.forEach(function(p){if(p.pago>0) pagamentos.push({valor:p.pago,mesPgto:p.mes===13?12:p.mes,anoPgto:p.ano,labelOrigem:p.label});});
      var saldosNominais=raw.map(function(p){return{saldoNominal:p.nominal};});
      var logImp=[];

      pagamentos.forEach(function(pg){
        var saldoPgto=pg.valor;
        for(var i=0;i<raw.length;i++){
          if(saldoPgto<=0)break;
          if(saldosNominais[i].saldoNominal<=0)continue;
          var mesParc=raw[i].mes===13?12:raw[i].mes;
          var calcAtePgto=corrigirAte(saldosNominais[i].saldoNominal,mesParc,raw[i].ano,pg.mesPgto,pg.anoPgto,indice);
          var devidoAtePgto=calcAtePgto.total;
          if(saldoPgto>=devidoAtePgto){
            saldoPgto=r2(saldoPgto-devidoAtePgto);
            logImp.push({parcelaDestino:raw[i].label,valorAbatido:devidoAtePgto,pgtoOrigem:pg.labelOrigem,quitada:true,saldoNominalAntes:saldosNominais[i].saldoNominal});
            saldosNominais[i].saldoNominal=0;
          } else {
            var prop=saldoPgto/devidoAtePgto;
            var nomQuitado=r2(saldosNominais[i].saldoNominal*prop);
            logImp.push({parcelaDestino:raw[i].label,valorAbatido:saldoPgto,pgtoOrigem:pg.labelOrigem,quitada:false,saldoNominalAntes:saldosNominais[i].saldoNominal});
            saldosNominais[i].saldoNominal=r2(saldosNominais[i].saldoNominal-nomQuitado);
            saldoPgto=0;
          }
        }
        if(saldoPgto>0) logImp.push({parcelaDestino:"(crédito excedente)",valorAbatido:saldoPgto,pgtoOrigem:pg.labelOrigem,quitada:false,creditoExcedente:true});
      });

      var parcelasCorrigidas=raw.map(function(p,idx){
        var saldoNom=saldosNominais[idx].saldoNominal;
        var quitado=saldoNom<=0;
        var calc=quitado?{fator:1,corrigido:0,juros:0,total:0,mesesAtraso:0}:corrigir(saldoNom,p.mes,p.ano,indice);
        var calcIntegral=corrigir(p.nominal,p.mes,p.ano,indice);
        var creditoApl=0;
        logImp.forEach(function(l){if(l.parcelaDestino===p.label&&!l.creditoExcedente)creditoApl=r2(creditoApl+l.valorAbatido);});
        return Object.assign({},p,{
          fator:calcIntegral.fator,corrigido:quitado?0:calc.corrigido,juros:quitado?0:calc.juros,
          total:quitado?0:calc.total,mesesAtraso:calcIntegral.mesesAtraso,
          saldoBruto:saldoNom,saldoNominalOriginal:p.nominal,creditoAplicado:creditoApl,
          quitado,pagoOriginal:p.pago
        });
      });

      var total=r2(parcelasCorrigidas.reduce(function(s,p){return s+p.total;},0));
      var creditoExcedente=0;
      logImp.forEach(function(l){if(l.creditoExcedente)creditoExcedente=r2(creditoExcedente+l.valorAbatido);});

      var obsImp="";
      if(pagamentos.length>0){
        var pgLabels=pagamentos.map(function(pg){return pg.labelOrigem+" ("+fmt(pg.valor)+")";});
        var pQ=logImp.filter(function(l){return l.quitada;});
        var pA=logImp.filter(function(l){return !l.quitada&&l.valorAbatido>0&&!l.creditoExcedente;});
        obsImp="IMPUTAÇÃO DE PAGAMENTOS (art. 354 CC): Pagamento(s) efetuado(s) em "+pgLabels.join(", ")+". ";
        obsImp+="Cada parcela foi corrigida até a data do respectivo pagamento e o valor imputado nas mais antigas. ";
        if(pQ.length>0) obsImp+="Parcela(s) quitada(s): "+pQ.map(function(l){return l.parcelaDestino;}).join(", ")+". ";
        if(pA.length>0) obsImp+="Parcela(s) abatida(s): "+pA.map(function(l){return l.parcelaDestino+" (abatido "+fmt(l.valorAbatido)+")"}).join(", ")+". ";
        if(creditoExcedente>0) obsImp+="Crédito excedente: "+fmt(creditoExcedente)+".";
      }

      var justFinal=justificativa.trim();
      if(obsImp){if(justFinal)justFinal+="\n\n";justFinal+=obsImp;}

      var labelIndice=indice==="selic"?"SELIC (acumulada)":"IPCA-E + Juros 1% a.m.";
      var res={
        processo:maskProcesso(processo),
        alimentado:capitalizarNome(alimentado),
        alimentante:capitalizarNome(alimentante),
        comarca,
        diaVencimento,tipoAlimento,percentualSM,valorFixoAlimento,
        indice,indiceLabel:labelIndice,
        justificativa:justFinal,
        parcelas:parcelasCorrigidas,
        total,
        data:new Date().toLocaleDateString("pt-BR"),
        defensor:perfil.nome||"",
        lotacao:perfil.lotacao||"",
        obsImputacao:obsImp,
        creditoRemanescente:creditoExcedente
      };
      setResPrisao(res);
      onSalvarHistorico({id:Date.now(),tipo:"atu-prisao",alimentado:capitalizarNome(alimentado),processo:maskProcesso(processo),data:new Date().toLocaleDateString("pt-BR"),total});
      setLoading(false);
    }, 400);
  };

  return (
    <div>
      <div style={{ display:"flex", gap:0, marginBottom:20, borderRadius:8, overflow:"hidden", border:"1px solid "+C.borda }}>
        {[
          ["penhora", "💰 Atualizar — Rito da Penhora", "Valor de referência + correção"],
          ["prisao", "🔒 Atualizar — Rito da Prisão Civil", "Parcelas vencidas após a distribuição"]
        ].map(function(item, idx){
          var v=item[0], l=item[1], desc=item[2];
          var ativo=subModo===v;
          return (
            <button key={v} onClick={function(){setSubModo(v);}} style={{
              flex:1, padding:"14px 16px", border:"none",
              borderRight: idx===0?"1px solid "+C.borda:"none",
              background: ativo ? (v==="penhora"?C.azul:C.verde) : C.cinzaClaro,
              color: ativo ? "#fff" : C.cinza,
              cursor:"pointer", textAlign:"left", touchAction:"manipulation"
            }}>
              <div style={{ fontWeight:700, fontSize:13 }}>{l}</div>
              <div style={{ fontSize:11, opacity:.8, marginTop:2 }}>{desc}</div>
            </button>
          );
        })}
      </div>

      <Card>
        <h3 style={{ margin:"0 0 16px", color:C.cinza, fontSize:15 }}>{"Dados do Processo"}</h3>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0 16px" }}>
          <div style={{ marginBottom:14 }}>
            <label style={{ display:"block", fontWeight:600, marginBottom:4, color:C.cinza, fontSize:13 }}>{"Número do Processo"}</label>
            <input type="text" inputMode="numeric"
              value={maskProcesso(processo)}
              onChange={function(e){setProcesso(digitsFromDisplay(e.target.value));}}
              placeholder={"0000000-00.0000.8.18.0000"}
              style={{ width:"100%", padding:"9px 12px", borderRadius:6, border:"1px solid "+C.borda, fontSize:14, boxSizing:"border-box", fontFamily:"monospace" }} />
          </div>
          <div style={{ marginBottom:14 }}>
            <label style={{ display:"block", fontWeight:600, marginBottom:4, color:C.cinza, fontSize:13 }}>{"Vara/Comarca"}</label>
            <input type="text" value={comarca}
              onChange={function(e){setComarca(capitalizarNome(e.target.value));}}
              placeholder={"Vara/Comarca"}
              style={{ width:"100%", padding:"9px 12px", borderRadius:6, border:"1px solid "+C.borda, fontSize:14, boxSizing:"border-box" }} />
          </div>
          <div style={{ marginBottom:14 }}>
            <label style={{ display:"block", fontWeight:600, marginBottom:4, color:C.cinza, fontSize:13 }}>{"Alimentado(a) / Exequente"}</label>
            <input type="text" value={alimentado}
              onChange={function(e){setAlimentado(capitalizarNome(e.target.value));}}
              placeholder={"Nome Completo"}
              style={{ width:"100%", padding:"9px 12px", borderRadius:6, border:"1px solid "+C.borda, fontSize:14, boxSizing:"border-box" }} />
          </div>
          <div style={{ marginBottom:14 }}>
            <label style={{ display:"block", fontWeight:600, marginBottom:4, color:C.cinza, fontSize:13 }}>{"Alimentante / Executado"}</label>
            <input type="text" value={alimentante}
              onChange={function(e){setAlimentante(capitalizarNome(e.target.value));}}
              placeholder={"Nome Completo"}
              style={{ width:"100%", padding:"9px 12px", borderRadius:6, border:"1px solid "+C.borda, fontSize:14, boxSizing:"border-box" }} />
          </div>
        </div>
        <SeletorIndice indice={indice} setIndice={setIndice} />
      </Card>

      {subModo === "penhora" && (
        <div>
          <Card>
            <h3 style={{ margin:"0 0 16px", color:C.azul, fontSize:15 }}>{"Saldo de Referência"}</h3>
            <div style={{ background:"#e8f0f8", border:"1px solid "+C.azul, borderRadius:8, padding:"12px 16px", marginBottom:16, fontSize:13, color:C.azul }}>
              {"Informe o valor do débito já constante nos autos (conforme última atualização judicial ou da parte contrária) e o mês/ano a que esse valor se refere. O sistema irá atualizá-lo até hoje."}
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr 1fr", gap:16, alignItems:"end" }}>
              <div>
                <label style={{ display:"block", fontWeight:600, marginBottom:4, color:C.cinza, fontSize:13 }}>{"Valor de Referência (R$)"}</label>
                <input type="text" inputMode="decimal" value={valorRef}
                  onChange={function(e){
                    var raw = e.target.value.replace(/[^0-9]/g, "");
                    setValorRef(fmtInput(raw));
                  }}
                  placeholder={"0,00"}
                  style={{ width:"100%", padding:"9px 12px", borderRadius:6, border:"1px solid "+C.borda, fontSize:14, boxSizing:"border-box" }} />
              </div>
              <div>
                <label style={{ display:"block", fontWeight:600, marginBottom:4, color:C.cinza, fontSize:13 }}>{"Mês de Ref."}</label>
                <select value={mesRef} onChange={function(e){setMesRef(Number(e.target.value));}}
                  style={{ width:"100%", padding:"9px 12px", borderRadius:6, border:"1px solid "+C.borda, fontSize:13, boxSizing:"border-box" }}>
                  {MESES.map(function(m,idx){return <option key={idx} value={idx+1}>{m}</option>;})}
                </select>
              </div>
              <div>
                <label style={{ display:"block", fontWeight:600, marginBottom:4, color:C.cinza, fontSize:13 }}>{"Ano de Ref."}</label>
                <input type="number" value={anoRef}
                  onChange={function(e){setAnoRef(Number(e.target.value));}}
                  style={{ width:"100%", padding:"9px 12px", borderRadius:6, border:"1px solid "+C.borda, fontSize:14, boxSizing:"border-box" }} />
              </div>
            </div>
            <div style={{ marginTop:14 }}>
              <label style={{ display:"block", fontWeight:600, marginBottom:4, color:C.cinza, fontSize:13 }}>{"Justificativa / Observações (opcional)"}</label>
              <textarea value={justificativa} onChange={function(e){setJustificativa(e.target.value);}} rows={3}
                placeholder={"Ex.: Atualização requerida nos autos conforme intimação de ..."}
                style={{ width:"100%", padding:"10px 12px", borderRadius:6, border:"1px solid "+C.borda, fontSize:13, boxSizing:"border-box", resize:"vertical", fontFamily:"inherit" }} />
            </div>
            <div style={{ marginTop:16 }}>
              <Btn onClick={calcularPenhora} cor={C.azul}>{"Calcular Atualização (Penhora)"}</Btn>
            </div>
          </Card>

          {resPenhora && (
            <Card style={{ borderLeft:"4px solid "+C.azul }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
                <h3 style={{ margin:0, color:C.azul }}>{"Resultado — Atualização (Penhora)"}</h3>
                <Btn onClick={function(){carregarLogo("#1a5276").then(function(ld){gerarPDFAtuPenhora(resPenhora,ld);});}} cor={C.azul}>{"Gerar PDF"}</Btn>
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8, marginBottom:12 }}>
                {[
                  ["Valor de Referência", fmt(resPenhora.valorRef)],
                  ["Fator de Correção", resPenhora.fator.toFixed(6)],
                  ["Meses", String(resPenhora.mesesAtraso)]
                ].map(function(item,i){
                  return (
                    <div key={i} style={{ background:C.cinzaClaro, borderRadius:6, padding:"10px 14px" }}>
                      <div style={{ fontSize:11, color:"#888" }}>{item[0]}</div>
                      <div style={{ fontWeight:700, fontSize:14 }}>{item[1]}</div>
                    </div>
                  );
                })}
              </div>
              {resPenhora.indice === "ipca" && (
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:12 }}>
                  <div style={{ background:"#e8f0f8", borderRadius:6, padding:"10px 14px" }}>
                    <div style={{ fontSize:11, color:C.azul }}>{"Valor Corrigido (IPCA-E)"}</div>
                    <div style={{ fontWeight:700, fontSize:14 }}>{fmt(resPenhora.corrigido)}</div>
                  </div>
                  <div style={{ background:"#e8f0f8", borderRadius:6, padding:"10px 14px" }}>
                    <div style={{ fontSize:11, color:C.azul }}>{"Juros de Mora (1% a.m.)"}</div>
                    <div style={{ fontWeight:700, fontSize:14 }}>{fmt(resPenhora.juros)}</div>
                  </div>
                </div>
              )}
              <div style={{ background:C.azul, borderRadius:8, padding:"14px 20px", textAlign:"center" }}>
                <div style={{ color:"#fff", fontSize:11, opacity:.8 }}>{"TOTAL ATUALIZADO — PENHORA"}</div>
                <div style={{ color:"#fff", fontWeight:800, fontSize:22 }}>{fmt(resPenhora.total)}</div>
                <div style={{ color:"rgba(255,255,255,0.7)", fontSize:11, marginTop:4 }}>{"Índice: "+resPenhora.indiceLabel}</div>
              </div>
            </Card>
          )}
        </div>
      )}

      {subModo === "prisao" && (
        <div>
          <Card>
            <h3 style={{ margin:"0 0 12px", color:C.verde, fontSize:15 }}>{"Alimentos Fixados"}</h3>
            <div style={{ display:"flex", gap:10, marginBottom:10 }}>
              {[["sm","% do Salário Mínimo"],["fixo","Valor fixo (R$)"]].map(function(item){
                var v=item[0],l=item[1];
                return (
                  <button key={v} onClick={function(){setTipoAlimento(v);}} style={{
                    padding:"7px 16px", borderRadius:6, border:"2px solid "+(tipoAlimento===v?C.verde:C.borda),
                    background:tipoAlimento===v?C.verde:C.branco, color:tipoAlimento===v?"#fff":C.cinza,
                    fontWeight:600, fontSize:13, cursor:"pointer"
                  }}>{l}</button>
                );
              })}
            </div>
            {tipoAlimento==="sm"
              ? <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                  <input type="text" inputMode="decimal" value={percentualSM} onChange={function(e){setPercentualSM(e.target.value);}} placeholder={"ex: 20"}
                    style={{ width:100, padding:"9px 12px", borderRadius:6, border:"1px solid "+C.borda, fontSize:14, boxSizing:"border-box" }} />
                  <span style={{ fontSize:14, color:C.cinza }}>{"% do salário mínimo federal"}</span>
                </div>
              : <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                  <span style={{ fontSize:14, color:C.cinza }}>{"R$"}</span>
                  <input type="text" inputMode="decimal" value={valorFixoAlimento} onChange={function(e){var raw=e.target.value.replace(/[^0-9]/g,"");setValorFixoAlimento(fmtInput(raw));}} placeholder={"0,00"}
                    style={{ width:150, padding:"9px 12px", borderRadius:6, border:"1px solid "+C.borda, fontSize:14, boxSizing:"border-box" }} />
                </div>
            }
            <div style={{ maxWidth:200, marginTop:12 }}>
              <Input label={"Dia de vencimento"} value={diaVencimento} onChange={setDiaVencimento} placeholder={"5"} type={"number"} />
            </div>
          </Card>

          <Card>
            <h3 style={{ margin:"0 0 4px", color:C.verde, fontSize:15 }}>{"Parcelas em Aberto (todas no Rito da Prisão)"}</h3>
            <p style={{ fontSize:12, color:"#888", marginTop:0, marginBottom:12 }}>{"Inclua todas as parcelas vencidas após a distribuição da execução que devem ser atualizadas pelo rito da prisão civil."}</p>
            <div style={{ display:"flex", justifyContent:"flex-end", gap:8, marginBottom:12 }}>
              <Btn small onClick={function(){
                if(!showIntervalo){var p2=calcMesFimPadrao();setIntervalo(function(prev){return Object.assign({},prev,{mesFim:p2.mesFim,anoFim:p2.anoFim});});}
                setShowIntervalo(!showIntervalo);
              }} cor={C.azul}>{"Intervalo"}</Btn>
              <Btn small onClick={addParcela} cor={C.verdeClaro}>{"+ Avulsa"}</Btn>
              {parcelas.length>0 && <Btn small onClick={function(){if(window.confirm("Apagar todas?"))setParcelas([]);}} cor={C.vermelho} outline>{"Limpar"}</Btn>}
            </div>

            {showIntervalo && (
              <div style={{ background:"#f0f4f8", border:"1px solid "+C.azul, borderRadius:8, padding:16, marginBottom:16 }}>
                <div style={{ fontWeight:700, color:C.azul, marginBottom:8 }}>{"Adicionar intervalo"}</div>
                <div style={{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:8, alignItems:"end" }}>
                  <div>
                    <label style={{ fontSize:11, fontWeight:600, color:C.cinza, display:"block", marginBottom:3 }}>{"Mês ini"}</label>
                    <select value={intervalo.mesIni} onChange={function(e){setIntervalo(Object.assign({},intervalo,{mesIni:Number(e.target.value)}));}} style={inpStyle}>
                      {MESES.map(function(m,idx){return <option key={idx} value={idx+1}>{m}</option>;})}
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize:11, fontWeight:600, color:C.cinza, display:"block", marginBottom:3 }}>{"Ano ini"}</label>
                    <input type="number" value={intervalo.anoIni} onChange={function(e){setIntervalo(Object.assign({},intervalo,{anoIni:Number(e.target.value)}));}} style={inpStyle} />
                  </div>
                  <div>
                    <label style={{ fontSize:11, fontWeight:600, color:C.cinza, display:"block", marginBottom:3 }}>{"Mês fim"}</label>
                    <select value={intervalo.mesFim} onChange={function(e){setIntervalo(Object.assign({},intervalo,{mesFim:Number(e.target.value)}));}} style={inpStyle}>
                      {MESES.map(function(m,idx){return <option key={idx} value={idx+1}>{m}</option>;})}
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize:11, fontWeight:600, color:C.cinza, display:"block", marginBottom:3 }}>{"Ano fim"}</label>
                    <input type="number" value={intervalo.anoFim} onChange={function(e){setIntervalo(Object.assign({},intervalo,{anoFim:Number(e.target.value)}));}} style={inpStyle} />
                  </div>
                  <div>
                    <label style={{ fontSize:11, fontWeight:600, color:C.cinza, display:"block", marginBottom:3 }}>{"Pago (R$)"}</label>
                    <input type="text" inputMode="decimal" value={intervalo.pago} onChange={function(e){setIntervalo(Object.assign({},intervalo,{pago:e.target.value}));}} placeholder={"0,00"} style={inpStyle} />
                  </div>
                </div>
                <div style={{ marginTop:12, display:"flex", gap:8 }}>
                  <Btn small onClick={addIntervalo} cor={C.azul}>{"Adicionar "+contarParcelas()+" parcelas"}</Btn>
                  <Btn small onClick={function(){setShowIntervalo(false);}} outline cor={C.cinza}>{"Fechar"}</Btn>
                </div>
              </div>
            )}

            {parcelas.map(function(p){
              return (
                <div key={p.id} style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr 1fr auto", gap:10, alignItems:"end", marginBottom:10, padding:12, background:p.is13?"#fff8e1":C.cinzaClaro, borderRadius:8, border:p.is13?"1px solid #f0c040":"none" }}>
                  <div>
                    <label style={{ fontSize:12, fontWeight:600, color:C.cinza, display:"block", marginBottom:3 }}>{p.is13?"13º Salário":"Mês"}</label>
                    {p.is13
                      ? <div style={{ padding:8, fontSize:13, color:C.azul, fontWeight:700 }}>{"13º/"+p.ano}</div>
                      : <select value={p.mes} onChange={function(e){editParcela(p.id,"mes",Number(e.target.value));}} style={inpStyle}>
                          {MESES.map(function(m,idx){return <option key={idx} value={idx+1}>{m}</option>;})}
                        </select>
                    }
                  </div>
                  <div>
                    <label style={{ fontSize:12, fontWeight:600, color:C.cinza, display:"block", marginBottom:3 }}>{"Ano"}</label>
                    <input type="number" value={p.ano} onChange={function(e){editParcela(p.id,"ano",Number(e.target.value));}} style={inpStyle} />
                  </div>
                  <div>
                    <label style={{ fontSize:12, fontWeight:600, color:C.cinza, display:"block", marginBottom:3 }}>{"Valor (R$)"}</label>
                    <input type="text" inputMode="decimal" value={p.valor} onChange={function(e){editParcela(p.id,"valor",e.target.value);}} placeholder={"0,00"} style={inpStyle} />
                  </div>
                  <div>
                    <label style={{ fontSize:12, fontWeight:600, color:C.cinza, display:"block", marginBottom:3 }}>{"Pago (R$)"}</label>
                    <input type="text" inputMode="decimal" value={p.pago} onChange={function(e){editParcela(p.id,"pago",e.target.value);}} placeholder={"0,00"} style={inpStyle} />
                  </div>
                  <button onClick={function(){removeParcela(p.id);}} style={{ background:"transparent", border:"none", cursor:"pointer", color:C.vermelho, fontSize:18, paddingBottom:4 }}>{"✕"}</button>
                </div>
              );
            })}

            <div style={{ marginBottom:14 }}>
              <label style={{ display:"block", fontWeight:600, marginBottom:4, color:C.cinza, fontSize:13 }}>{"Justificativa / Observações (opcional)"}</label>
              <textarea value={justificativa} onChange={function(e){setJustificativa(e.target.value);}} rows={3}
                placeholder={"Ex.: Atualização requerida nos autos conforme intimação de ..."}
                style={{ width:"100%", padding:"10px 12px", borderRadius:6, border:"1px solid "+C.borda, fontSize:13, boxSizing:"border-box", resize:"vertical", fontFamily:"inherit" }} />
            </div>

            <div style={{ display:"flex", alignItems:"center", gap:10, padding:"12px 16px", background:incluir13?"#fff8e1":"#f9f9f9", border:"1px solid "+(incluir13?"#f0c040":C.borda), borderRadius:8, marginBottom:16 }}>
              <input type="checkbox" checked={incluir13} onChange={function(e){setIncluir13(e.target.checked);}} style={{ width:20, height:20, cursor:"pointer" }} />
              <div>
                <div style={{ fontWeight:700, fontSize:13, color:C.cinza }}>{"Incluir 13º salário"}</div>
                <div style={{ fontSize:11, color:"#888" }}>{"Gera parcela de 13º ao final de cada ano (média dos meses)."}</div>
              </div>
            </div>

            <Btn onClick={calcularPrisao} disabled={loading||parcelas.every(function(p){return !p.valor;})}>
              {loading?"Calculando...":"Calcular Atualização (Prisão Civil)"}
            </Btn>
          </Card>

          {resPrisao && (
            <Card style={{ borderLeft:"4px solid "+C.verde }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
                <h3 style={{ margin:0, color:C.verde }}>{"Resultado — Atualização (Prisão Civil)"}</h3>
                <Btn onClick={function(){carregarLogo("#1a6b3a").then(function(ld){gerarPDFAtuPrisao(resPrisao,ld);});}} cor={C.verde}>{"Gerar PDF"}</Btn>
              </div>
              {resPrisao.obsImputacao && (
                <div style={{ background:"#fff8e1", border:"1px solid #f0c040", borderRadius:8, padding:"12px 16px", marginBottom:12, fontSize:12, color:"#555", lineHeight:1.6 }}>
                  <div style={{ fontWeight:700, color:"#b8860b", marginBottom:4 }}>{"Imputação de Pagamentos (art. 354 CC)"}</div>
                  {resPrisao.obsImputacao}
                </div>
              )}
              <div style={{ background:C.verdePale, border:"1px solid "+C.verde, borderRadius:8, padding:16, marginBottom:12 }}>
                <div style={{ fontWeight:700, color:C.verde, marginBottom:8 }}>{"Parcelas — Rito da Prisão Civil"}</div>
                {resPrisao.parcelas.map(function(p,i){
                  return (
                    <div key={i} style={{ display:"flex", justifyContent:"space-between", fontSize:13, marginTop:4 }}>
                      <span>
                        {p.label}{p.is13?" [13º]":""}
                        {p.pagoOriginal>0?" (pago: "+fmt(p.pagoOriginal)+")":""}
                        {p.creditoAplicado>0?" (créd.: "+fmt(p.creditoAplicado)+")":""}
                        {p.quitado?" — QUITADO":""}
                      </span>
                      <span style={{ fontWeight:600, color:p.quitado?C.verde:"inherit" }}>{p.quitado?"-":fmt(p.total)}</span>
                    </div>
                  );
                })}
              </div>
              <div style={{ background:C.verde, borderRadius:8, padding:"14px 20px", textAlign:"center" }}>
                <div style={{ color:"#fff", fontSize:11, opacity:.8 }}>{"TOTAL ATUALIZADO — PRISÃO CIVIL"}</div>
                <div style={{ color:"#fff", fontWeight:800, fontSize:22 }}>{fmt(resPrisao.total)}</div>
                <div style={{ color:"rgba(255,255,255,0.7)", fontSize:11, marginTop:4 }}>{"Índice: "+resPrisao.indiceLabel}</div>
              </div>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}

// ===================== APP PRINCIPAL =====================

export default function App() {
  var _s1 = useState(null); var logado = _s1[0]; var setLogado = _s1[1];
  var fazerLogout = function() {
    localStorage.removeItem("dpe_perfil"); localStorage.removeItem("dpe_historico");
    setLogado(null); setTimeout(function(){window.location.reload();},50);
  };
  if (!logado) return (
    <TelaLogin
      onLogin={function(u){setLogado(u);}}
      onVisitante={function(){setLogado({nome:"",lotacao:"",autenticado:false});}} />
  );
  return <AppInterno usuario={logado} onLogout={fazerLogout} />;
}

function AppInterno(props) {
  var usuario = props.usuario;
  var onLogout = props.onLogout;

  var _p = useState(function(){
    if(usuario.autenticado) return {nome:usuario.nome,lotacao:usuario.lotacao,apiKey:""};
    try{return JSON.parse(localStorage.getItem("dpe_perfil")||"{}");} catch(e){return {};}
  }); var perfil = _p[0]; var setPerfil = _p[1];

  var _sp = useState(false); var showPerfil = _sp[0]; var setShowPerfil = _sp[1];
  var _st = useState("calc"); var tab = _st[0]; var setTab = _st[1];

  // ← NOVO: estado do modal de acesso restrito
  var _ma = useState(false); var showModalAcesso = _ma[0]; var setShowModalAcesso = _ma[1];

  var _sh = useState(function(){
    try{return JSON.parse(localStorage.getItem("dpe_historico")||"[]");} catch(e){return [];}
  }); var historico = _sh[0]; var setHistorico = _sh[1];

  var salvarPerfil = function(p) { setPerfil(p); localStorage.setItem("dpe_perfil",JSON.stringify(p)); };

  var salvarHistorico = function(item) {
    setHistorico(function(h){
      var novo=[item].concat(h).slice(0,50);
      localStorage.setItem("dpe_historico",JSON.stringify(novo));
      return novo;
    });
  };

  var _ind = useState("ipca"); var indice = _ind[0]; var setIndice = _ind[1];
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

  var calcMesFimPadrao = function(diaVenc) {
    var hoje=new Date(); var dv=Number(diaVenc)||5;
    var mA=hoje.getMonth()+1, aA=hoje.getFullYear();
    if(hoje.getDate()>=dv) return {mesFim:mA,anoFim:aA};
    var mAnt=mA-1,aAnt=aA; if(mAnt<1){mAnt=12;aAnt--;}
    return {mesFim:mAnt,anoFim:aAnt};
  };
  var padrao=calcMesFimPadrao(diaVencimento);
  var _intv=useState({mesIni:1,anoIni:2024,mesFim:padrao.mesFim,anoFim:padrao.anoFim,pago:""});
  var intervalo=_intv[0]; var setIntervalo=_intv[1];

  var _i13=useState(false); var incluir13=_i13[0]; var setIncluir13=_i13[1];
  var _just=useState(""); var justificativa=_just[0]; var setJustificativa=_just[1];
  var _res=useState(null); var resultado=_res[0]; var setResultado=_res[1];
  var _ld=useState(false); var loading=_ld[0]; var setLoading=_ld[1];
  var _lia=useState(false); var loadingIA=_lia[0]; var setLoadingIA=_lia[1];
  var _mia=useState(""); var msgIA=_mia[0]; var setMsgIA=_mia[1];
  var fileRef=useRef();

  var inpStyle={width:"100%",padding:"8px",borderRadius:6,border:"1px solid "+C.borda,fontSize:13,boxSizing:"border-box"};

  var addParcela=function(){setParcelas(function(p){return p.concat([novaParcela()]);});};
  var removeParcela=function(id){setParcelas(function(p){return p.filter(function(x){return x.id!==id;});});};
  var editParcela=function(id,campo,val){setParcelas(function(p){return p.map(function(x){if(x.id===id){var n=Object.assign({},x);n[campo]=val;return n;}return x;});});};

  var contarParcelas=function(){
    var n=0,m=intervalo.mesIni,a=intervalo.anoIni;
    while(a<intervalo.anoFim||(a===intervalo.anoFim&&m<=intervalo.mesFim)){n++;m++;if(m>12){m=1;a++;}}
    return n;
  };
  var addIntervalo=function(){
    var novas=[]; var m=intervalo.mesIni,a=intervalo.anoIni;
    while(a<intervalo.anoFim||(a===intervalo.anoFim&&m<=intervalo.mesFim)){
      var valor; if(tipoAlimento==="sm") valor=r2(getSM(m,a)*Number(percentualSM)/100).toFixed(2); else valor=r2(parseMoney(valorFixoAlimento)).toFixed(2);
      novas.push({id:Date.now()+novas.length,mes:m,ano:a,valor:valor,pago:intervalo.pago?Number(intervalo.pago).toFixed(2):"",is13:false});
      m++;if(m>12){m=1;a++;}
    }
    setParcelas(function(prev){
      var ex={};prev.forEach(function(p){ex[p.ano+"-"+p.mes]=true;});
      var u=novas.filter(function(n){return !ex[n.ano+"-"+n.mes];});
      return prev.concat(u);
    });
    setIntervalo(function(i){return Object.assign({},i,{pago:""});});
  };

  var handleUpload=function(e){
    var file=e.target.files[0];if(!file)return;
    if(!perfil.apiKey){setMsgIA("Erro: Configure sua chave de API no perfil.");return;}
    setLoadingIA(true);setMsgIA("Lendo documento com IA...");
    var reader=new FileReader();
    reader.onload=function(){
      var base64=reader.result.split(",")[1];
      var block=file.type==="application/pdf"
        ?{type:"document",source:{type:"base64",media_type:"application/pdf",data:base64}}
        :{type:"image",source:{type:"base64",media_type:file.type,data:base64}};
      fetch("https://api.anthropic.com/v1/messages",{
        method:"POST",
        headers:{"Content-Type":"application/json","x-api-key":perfil.apiKey,"anthropic-version":"2023-06-01","anthropic-dangerous-direct-browser-access":"true"},
        body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1000,messages:[{role:"user",content:[block,{type:"text",text:"Extraia: número do processo CNJ, alimentado, alimentante, parcelas. Responda SOMENTE em JSON: {\"processo\":\"\",\"alimentado\":\"\",\"alimentante\":\"\",\"parcelas\":[{\"mes\":1,\"ano\":2024,\"valor\":1500.00}]}"}]}]})
      }).then(function(resp){return resp.json();}).then(function(data){
        var text=(data.content&&data.content[0]&&data.content[0].text)||"";
        var parsed=JSON.parse(text.replace(/```json|```/g,"").trim());
        if(parsed.processo)setProcesso(parsed.processo.replace(/\D/g,"").slice(0,17));
        if(parsed.alimentado)setAlimentado(capitalizarNome(parsed.alimentado));
        if(parsed.alimentante)setAlimentante(capitalizarNome(parsed.alimentante));
        if(parsed.parcelas&&parsed.parcelas.length)
          setParcelas(parsed.parcelas.map(function(p,i){return {id:Date.now()+i,mes:p.mes,ano:p.ano,valor:String(r2(p.valor)),pago:"",is13:false};}));
        setMsgIA("OK! "+(parsed.parcelas?parsed.parcelas.length:0)+" parcela(s) extraída(s). Revise antes de calcular.");
        setLoadingIA(false); if(fileRef.current)fileRef.current.value="";
      }).catch(function(){setMsgIA("Erro: Não foi possível ler o documento.");setLoadingIA(false);if(fileRef.current)fileRef.current.value="";});
    };
    reader.onerror=function(){setMsgIA("Erro ao ler arquivo.");setLoadingIA(false);};
    reader.readAsDataURL(file);
  };

  var calcular=function(){
    // ← ALTERADO: substitui alert por modal customizado
    if(!usuario.autenticado&&!perfil.nome){setShowModalAcesso(true);return;}
    setLoading(true);setResultado(null);
    setTimeout(function(){
      var raw=parcelas
        .filter(function(p){return p.valor&&Number(p.valor)>0;})
        .sort(function(a,b){return a.ano!==b.ano?a.ano-b.ano:a.mes-b.mes;})
        .map(function(p){return {mes:p.mes,ano:p.ano,label:fmtMes(p.mes,p.ano),smVig:getSM(p.mes===13?12:p.mes,p.ano),nominal:r2(Number(p.valor)),pago:r2(Number(p.pago||0)),is13:!!p.is13};});

      if(incluir13){
        var anosSet={};
        raw.filter(function(p){return !p.is13;}).forEach(function(p){anosSet[p.ano]=true;});
        var anos=Object.keys(anosSet).map(Number);
        var parc13=[];
        anos.forEach(function(ano){
          var doAno=raw.filter(function(p){return p.ano===ano&&!p.is13;});
          if(doAno.length>0){
            var ja=raw.filter(function(p){return p.ano===ano&&p.is13;}).length>0;
            if(!ja){
              var hoje2=new Date();
              var dez=(ano<hoje2.getFullYear())||(ano===hoje2.getFullYear()&&hoje2.getMonth()>=11);
              if(dez){var soma=0;doAno.forEach(function(p){soma+=p.nominal;});var media=r2(soma/doAno.length);parc13.push({mes:13,ano,label:"13º/"+ano,smVig:getSM(12,ano),nominal:media,pago:0,is13:true});}
            }
          }
        });
        raw=raw.concat(parc13).sort(function(a,b){return a.ano!==b.ano?a.ano-b.ano:a.mes-b.mes;});
      }

      if(!raw.length){setLoading(false);return;}

      var pagamentos=[];
      raw.forEach(function(p){if(p.pago>0)pagamentos.push({valor:p.pago,mesPgto:p.mes===13?12:p.mes,anoPgto:p.ano,labelOrigem:p.label});});
      var saldosNominais=raw.map(function(p){return{saldoNominal:p.nominal};});
      var logImp=[];

      pagamentos.forEach(function(pg){
        var saldoPgto=pg.valor;
        for(var i=0;i<raw.length;i++){
          if(saldoPgto<=0)break;
          if(saldosNominais[i].saldoNominal<=0)continue;
          var mesParc=raw[i].mes===13?12:raw[i].mes;
          var calcAtePgto=corrigirAte(saldosNominais[i].saldoNominal,mesParc,raw[i].ano,pg.mesPgto,pg.anoPgto,indice);
          var dev=calcAtePgto.total;
          if(saldoPgto>=dev){saldoPgto=r2(saldoPgto-dev);logImp.push({parcelaDestino:raw[i].label,valorAbatido:dev,pgtoOrigem:pg.labelOrigem,quitada:true,saldoNominalAntes:saldosNominais[i].saldoNominal});saldosNominais[i].saldoNominal=0;}
          else{var prop=saldoPgto/dev;var nomQ=r2(saldosNominais[i].saldoNominal*prop);logImp.push({parcelaDestino:raw[i].label,valorAbatido:saldoPgto,pgtoOrigem:pg.labelOrigem,quitada:false,saldoNominalAntes:saldosNominais[i].saldoNominal});saldosNominais[i].saldoNominal=r2(saldosNominais[i].saldoNominal-nomQ);saldoPgto=0;}
        }
        if(saldoPgto>0)logImp.push({parcelaDestino:"(crédito excedente)",valorAbatido:saldoPgto,pgtoOrigem:pg.labelOrigem,quitada:false,creditoExcedente:true});
      });

      var parcelasCorrigidas=raw.map(function(p,idx){
        var saldoNom=saldosNominais[idx].saldoNominal;
        var quitado=saldoNom<=0;
        var calc=quitado?{fator:1,corrigido:0,juros:0,total:0,mesesAtraso:0}:corrigir(saldoNom,p.mes,p.ano,indice);
        var calcIntegral=corrigir(p.nominal,p.mes,p.ano,indice);
        var creditoApl=0;
        logImp.forEach(function(l){if(l.parcelaDestino===p.label&&!l.creditoExcedente)creditoApl=r2(creditoApl+l.valorAbatido);});
        return Object.assign({},p,{fator:calcIntegral.fator,corrigido:quitado?0:calc.corrigido,juros:quitado?0:calc.juros,total:quitado?0:calc.total,mesesAtraso:calcIntegral.mesesAtraso,saldoBruto:saldoNom,saldoNominalOriginal:p.nominal,creditoAplicado:creditoApl,quitado,pagoOriginal:p.pago});
      });

      var prisaoItems=parcelasCorrigidas.slice(-3);
      var penhoraItems=parcelasCorrigidas.slice(0,-3);
      var somaArr=function(arr){var s=0;arr.forEach(function(x){s+=x.total;});return r2(s);};
      var creditoExcedente=0;
      logImp.forEach(function(l){if(l.creditoExcedente)creditoExcedente=r2(creditoExcedente+l.valorAbatido);});

      var obsImp="";
      if(pagamentos.length>0){
        var pgLabels=pagamentos.map(function(pg){return pg.labelOrigem+" ("+fmt(pg.valor)+")";});
        var pQ=logImp.filter(function(l){return l.quitada;});
        var pA=logImp.filter(function(l){return !l.quitada&&l.valorAbatido>0&&!l.creditoExcedente;});
        obsImp="IMPUTAÇÃO DE PAGAMENTOS (art. 354 CC): Pagamento(s) efetuado(s) em "+pgLabels.join(", ")+". Cada parcela devida foi corrigida até a data do respectivo pagamento, e o valor pago foi imputado nas parcelas mais antigas, conforme ordem cronológica. O saldo remanescente de cada parcela não integralmente quitada continua sendo corrigido até a data-base do cálculo. ";
        if(pQ.length>0) obsImp+="Parcela(s) integralmente quitada(s): "+pQ.map(function(l){return l.parcelaDestino;}).join(", ")+". ";
        if(pA.length>0) obsImp+="Parcela(s) parcialmente abatida(s): "+pA.map(function(l){return l.parcelaDestino+" (abatido "+fmt(l.valorAbatido)+")"}).join(", ")+". ";
        if(creditoExcedente>0) obsImp+="Crédito excedente após quitação de todas as parcelas: "+fmt(creditoExcedente)+".";
      }

      var justFinal=justificativa.trim();
      if(obsImp){if(justFinal)justFinal+="\n\n";justFinal+=obsImp;}

      var labelIndice=indice==="selic"?"SELIC (acumulada)":"IPCA-E + Juros 1% a.m.";
      var res={
        processo:maskProcesso(processo),
        alimentado:capitalizarNome(alimentado),
        alimentante:capitalizarNome(alimentante),
        comarca,
        diaVencimento,tipoAlimento,percentualSM,valorFixoAlimento,
        indice,indiceLabel:labelIndice,
        justificativa:justFinal,
        prisao:prisaoItems,penhora:penhoraItems,
        totalPrisao:somaArr(prisaoItems),totalPenhora:somaArr(penhoraItems),
        data:new Date().toLocaleDateString("pt-BR"),
        defensor:perfil.nome||"",lotacao:perfil.lotacao||"",
        obsImputacao:obsImp,creditoRemanescente:creditoExcedente
      };
      setResultado(res);
      salvarHistorico({id:Date.now(),tipo:"novo",alimentado:capitalizarNome(alimentado),processo:maskProcesso(processo),data:res.data,total:r2(somaArr(prisaoItems)+somaArr(penhoraItems))});
      setLoading(false);
    },400);
  };

  return (
    <div style={{ fontFamily:"Segoe UI, Arial, sans-serif", minHeight:"100vh", background:"#f0f2f0" }}>
      <Header perfil={perfil} onPerfil={function(){setShowPerfil(true);}} onLogout={onLogout} />

      {showPerfil && <ModalPerfil perfil={perfil} onSave={salvarPerfil} onClose={function(){setShowPerfil(false);}} />}

      {/* ← NOVO: Modal de acesso restrito com figurinha */}
      <ModalAcesso visivel={showModalAcesso} onClose={function(){setShowModalAcesso(false);}} />

      <div style={{ background:C.branco, borderBottom:"1px solid "+C.borda, display:"flex", padding:"0 28px" }}>
        {[
          ["calc","Novo Cálculo"],
          ["atualizar","Atualização de Débito"],
          ["historico","Histórico"]
        ].map(function(item){
          var id=item[0],label=item[1];
          return (
            <button key={id} onClick={function(){setTab(id);}} style={{
              padding:"14px 20px", border:"none", background:"transparent", cursor:"pointer",
              fontWeight:600, fontSize:14,
              color: tab===id?C.verde:C.cinza,
              borderBottom: tab===id?"3px solid "+C.verde:"3px solid transparent",
              touchAction:"manipulation"
            }}>{label}</button>
          );
        })}
      </div>

      <div style={{ maxWidth:900, margin:"0 auto", padding:"24px 16px" }}>

        {tab==="calc" && (
          <div>
            {!perfil.nome && (
              <div style={{ background:"#fff8e1", border:"1px solid #f0c040", borderRadius:8, padding:"12px 18px", marginBottom:18, fontSize:14 }}>
                {"Configure seu perfil para aparecer nos PDFs. "}
                <span style={{ color:C.verde, cursor:"pointer", textDecoration:"underline" }} onClick={function(){setShowPerfil(true);}}>{"Configurar agora"}</span>
              </div>
            )}

            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:20 }}>
              <Card style={{ margin:0, borderTop:"3px solid "+C.azul }}>
                <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8 }}>
                  <span style={{ fontSize:20 }}>{"A"}</span>
                  <div>
                    <div style={{ fontWeight:700, color:C.azul, fontSize:14 }}>{"Opção A — Importar com IA"}</div>
                    <div style={{ fontSize:11, color:"#666" }}>{"Envie a sentença e a IA preenche"}</div>
                  </div>
                </div>
                <input ref={fileRef} type="file" accept=".pdf,image/*" onChange={handleUpload} style={{ display:"none" }} />
                <Btn onClick={function(){fileRef.current.click();}} disabled={loadingIA} cor={C.azul} small>
                  {loadingIA?"Processando...":"Selecionar PDF ou imagem"}
                </Btn>
                {msgIA && <div style={{ marginTop:8, fontSize:12, color:msgIA.indexOf("OK")===0?C.verde:C.vermelho }}>{msgIA}</div>}
                {!perfil.apiKey && <div style={{ marginTop:6, fontSize:11, color:"#999" }}>{"Opcional. Requer chave API no perfil."}</div>}
              </Card>
              <Card style={{ margin:0, borderTop:"3px solid "+C.verde }}>
                <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8 }}>
                  <span style={{ fontSize:20 }}>{"B"}</span>
                  <div>
                    <div style={{ fontWeight:700, color:C.verde, fontSize:14 }}>{"Cálculo Manual"}</div>
                    <div style={{ fontSize:11, color:"#666" }}>{"Sempre disponível"}</div>
                  </div>
                </div>
                <div style={{ fontSize:12, color:"#555" }}>{"Preencha os dados abaixo."}</div>
                <div style={{ marginTop:10 }}>
                  <span style={{ background:C.verdePale, color:C.verde, borderRadius:20, padding:"3px 10px", fontSize:11, fontWeight:600 }}>{"Sem conta necessária"}</span>
                </div>
              </Card>
            </div>

            <Card>
              <h3 style={{ margin:"0 0 16px", color:C.verde, fontSize:15 }}>{"Dados do Processo"}</h3>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0 16px" }}>
                <div style={{ marginBottom:14 }}>
                  <label style={{ display:"block", fontWeight:600, marginBottom:4, color:C.cinza, fontSize:13 }}>{"Número do Processo"}</label>
                  <input type="text" inputMode="numeric"
                    value={maskProcesso(processo)}
                    onChange={function(e){setProcesso(digitsFromDisplay(e.target.value));}}
                    placeholder={"0000000-00.0000.8.18.0000"}
                    style={{ width:"100%", padding:"9px 12px", borderRadius:6, border:"1px solid "+C.borda, fontSize:14, boxSizing:"border-box", fontFamily:"monospace", letterSpacing:"0.5px" }} />
                </div>
                <div style={{ marginBottom:14 }}>
                  <label style={{ display:"block", fontWeight:600, marginBottom:4, color:C.cinza, fontSize:13 }}>{"Vara/Comarca"}</label>
                  <input type="text" value={comarca}
                    onChange={function(e){setComarca(capitalizarNome(e.target.value));}}
                    placeholder={"Vara/Comarca"}
                    style={{ width:"100%", padding:"9px 12px", borderRadius:6, border:"1px solid "+C.borda, fontSize:14, boxSizing:"border-box" }} />
                </div>
                <div style={{ marginBottom:14 }}>
                  <label style={{ display:"block", fontWeight:600, marginBottom:4, color:C.cinza, fontSize:13 }}>{"Alimentado(a) / Exequente"}</label>
                  <input type="text" value={alimentado}
                    onChange={function(e){setAlimentado(capitalizarNome(e.target.value));}}
                    placeholder={"Nome Completo"}
                    style={{ width:"100%", padding:"9px 12px", borderRadius:6, border:"1px solid "+C.borda, fontSize:14, boxSizing:"border-box" }} />
                </div>
                <div style={{ marginBottom:14 }}>
                  <label style={{ display:"block", fontWeight:600, marginBottom:4, color:C.cinza, fontSize:13 }}>{"Alimentante / Executado"}</label>
                  <input type="text" value={alimentante}
                    onChange={function(e){setAlimentante(capitalizarNome(e.target.value));}}
                    placeholder={"Nome Completo"}
                    style={{ width:"100%", padding:"9px 12px", borderRadius:6, border:"1px solid "+C.borda, fontSize:14, boxSizing:"border-box" }} />
                </div>
              </div>
              <div style={{ marginBottom:14 }}>
                <label style={{ display:"block", fontWeight:600, marginBottom:8, color:C.cinza, fontSize:13 }}>{"Alimentos fixados em"}</label>
                <div style={{ display:"flex", gap:10, marginBottom:10 }}>
                  {[["sm","% do Salário Mínimo"],["fixo","Valor fixo (R$)"]].map(function(item){
                    var v=item[0],l=item[1];
                    return (
                      <button key={v} onClick={function(){setTipoAlimento(v);}} style={{
                        padding:"7px 16px", borderRadius:6, border:"2px solid "+(tipoAlimento===v?C.verde:C.borda),
                        background:tipoAlimento===v?C.verde:C.branco, color:tipoAlimento===v?"#fff":C.cinza,
                        fontWeight:600, fontSize:13, cursor:"pointer"
                      }}>{l}</button>
                    );
                  })}
                </div>
                {tipoAlimento==="sm"
                  ? <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                      <input type="text" inputMode="decimal" value={percentualSM} onChange={function(e){setPercentualSM(e.target.value);}} placeholder={"ex: 20"}
                        style={{ width:100, padding:"9px 12px", borderRadius:6, border:"1px solid "+C.borda, fontSize:14, boxSizing:"border-box" }} />
                      <span style={{ fontSize:14, color:C.cinza }}>{"% do salário mínimo federal"}</span>
                    </div>
                  : <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                      <span style={{ fontSize:14, color:C.cinza }}>{"R$"}</span>
                      <input type="text" inputMode="decimal" value={valorFixoAlimento} onChange={function(e){var raw=e.target.value.replace(/[^0-9]/g,"");setValorFixoAlimento(fmtInput(raw));}} placeholder={"0,00"}
                        style={{ width:150, padding:"9px 12px", borderRadius:6, border:"1px solid "+C.borda, fontSize:14, boxSizing:"border-box" }} />
                    </div>
                }
              </div>
              <div style={{ maxWidth:200 }}>
                <Input label={"Dia de vencimento"} value={diaVencimento} onChange={setDiaVencimento} placeholder={"5"} type={"number"} />
              </div>
              <SeletorIndice indice={indice} setIndice={setIndice} />
            </Card>

            <Card>
              <h3 style={{ margin:"0 0 16px", color:C.verde, fontSize:15 }}>{"Opções Adicionais"}</h3>
              <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:16, padding:"12px 16px", background:incluir13?"#fff8e1":"#f9f9f9", border:"1px solid "+(incluir13?"#f0c040":C.borda), borderRadius:8 }}>
                <input type="checkbox" checked={incluir13} onChange={function(e){setIncluir13(e.target.checked);}} style={{ width:20, height:20, cursor:"pointer" }} />
                <div>
                  <div style={{ fontWeight:700, fontSize:13, color:C.cinza }}>{"Incluir 13º salário"}</div>
                  <div style={{ fontSize:11, color:"#888" }}>{"Gera parcela de 13º ao final de cada ano (média dos meses). Vencimento: dezembro. Valor editável manualmente."}</div>
                </div>
              </div>
              <div>
                <label style={{ display:"block", fontWeight:600, marginBottom:4, color:C.cinza, fontSize:13 }}>{"Justificativa / Observações (aparece no PDF)"}</label>
                <textarea value={justificativa} onChange={function(e){setJustificativa(e.target.value);}} rows={4}
                  placeholder={"Ex.: Cálculo elaborado com base na sentença proferida nos autos..."}
                  style={{ width:"100%", padding:"10px 12px", borderRadius:6, border:"1px solid "+C.borda, fontSize:13, boxSizing:"border-box", resize:"vertical", fontFamily:"inherit", lineHeight:1.5 }} />
              </div>
            </Card>

            <Card>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
                <h3 style={{ margin:0, color:C.verde, fontSize:15 }}>{"Parcelas em Atraso"}</h3>
                <div style={{ display:"flex", gap:8 }}>
                  <Btn small onClick={function(){
                    if(!showIntervalo){var p2=calcMesFimPadrao(diaVencimento);setIntervalo(function(prev){return Object.assign({},prev,{mesFim:p2.mesFim,anoFim:p2.anoFim});});}
                    setShowIntervalo(!showIntervalo);
                  }} cor={C.azul}>{"Intervalo"}</Btn>
                  <Btn small onClick={addParcela} cor={C.verdeClaro}>{"+ Avulsa"}</Btn>
                  {parcelas.length>0 && <Btn small onClick={function(){if(window.confirm("Apagar todas as parcelas?"))setParcelas([]);}} cor={C.vermelho} outline>{"Limpar"}</Btn>}
                </div>
              </div>

              {showIntervalo && (
                <div style={{ background:"#f0f4f8", border:"1px solid "+C.azul, borderRadius:8, padding:16, marginBottom:16 }}>
                  <div style={{ fontWeight:700, color:C.azul, marginBottom:8 }}>{"Adicionar intervalo"}</div>
                  <div style={{ fontSize:12, color:"#555", marginBottom:12, background:"#e8f0f8", padding:"8px 12px", borderRadius:6 }}>
                    {"Valor: "}{tipoAlimento==="sm"?(percentualSM||"?")+"% do SM vigente":"R$ "+(valorFixoAlimento||"?")+" (fixo)"}
                  </div>
                  <div style={{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:8, alignItems:"end" }}>
                    <div>
                      <label style={{ fontSize:11, fontWeight:600, color:C.cinza, display:"block", marginBottom:3 }}>{"Mês ini"}</label>
                      <select value={intervalo.mesIni} onChange={function(e){setIntervalo(Object.assign({},intervalo,{mesIni:Number(e.target.value)}));}} style={inpStyle}>
                        {MESES.map(function(m,idx){return <option key={idx} value={idx+1}>{m}</option>;})}
                      </select>
                    </div>
                    <div>
                      <label style={{ fontSize:11, fontWeight:600, color:C.cinza, display:"block", marginBottom:3 }}>{"Ano ini"}</label>
                      <input type="number" value={intervalo.anoIni} onChange={function(e){setIntervalo(Object.assign({},intervalo,{anoIni:Number(e.target.value)}));}} style={inpStyle} />
                    </div>
                    <div>
                      <label style={{ fontSize:11, fontWeight:600, color:C.cinza, display:"block", marginBottom:3 }}>{"Mês fim"}</label>
                      <select value={intervalo.mesFim} onChange={function(e){setIntervalo(Object.assign({},intervalo,{mesFim:Number(e.target.value)}));}} style={inpStyle}>
                        {MESES.map(function(m,idx){return <option key={idx} value={idx+1}>{m}</option>;})}
                      </select>
                    </div>
                    <div>
                      <label style={{ fontSize:11, fontWeight:600, color:C.cinza, display:"block", marginBottom:3 }}>{"Ano fim"}</label>
                      <input type="number" value={intervalo.anoFim} onChange={function(e){setIntervalo(Object.assign({},intervalo,{anoFim:Number(e.target.value)}));}} style={inpStyle} />
                    </div>
                    <div>
                      <label style={{ fontSize:11, fontWeight:600, color:C.cinza, display:"block", marginBottom:3 }}>{"Pago (R$)"}</label>
                      <input type="text" inputMode="decimal" value={intervalo.pago} onChange={function(e){setIntervalo(Object.assign({},intervalo,{pago:e.target.value}));}} placeholder={"0,00"} style={inpStyle} />
                    </div>
                  </div>
                  <div style={{ marginTop:12, display:"flex", gap:8, alignItems:"center" }}>
                    <Btn small onClick={addIntervalo} cor={C.azul}>{"Adicionar "+contarParcelas()+" parcelas"}</Btn>
                    <Btn small onClick={function(){setShowIntervalo(false);}} outline cor={C.cinza}>{"Fechar"}</Btn>
                  </div>
                </div>
              )}

              {parcelas.map(function(p){
                return (
                  <div key={p.id} style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr 1fr auto", gap:10, alignItems:"end", marginBottom:10, padding:12, background:p.is13?"#fff8e1":C.cinzaClaro, borderRadius:8, border:p.is13?"1px solid #f0c040":"none" }}>
                    <div>
                      <label style={{ fontSize:12, fontWeight:600, color:C.cinza, display:"block", marginBottom:3 }}>{p.is13?"13º Salário":"Mês"}</label>
                      {p.is13
                        ?<div style={{ padding:8, fontSize:13, color:C.azul, fontWeight:700 }}>{"13º/"+p.ano}</div>
                        :<select value={p.mes} onChange={function(e){editParcela(p.id,"mes",Number(e.target.value));}} style={inpStyle}>{MESES.map(function(m,idx){return <option key={idx} value={idx+1}>{m}</option>;})}</select>
                      }
                    </div>
                    <div>
                      <label style={{ fontSize:12, fontWeight:600, color:C.cinza, display:"block", marginBottom:3 }}>{"Ano"}</label>
                      <input type="number" value={p.ano} onChange={function(e){editParcela(p.id,"ano",Number(e.target.value));}} style={inpStyle} />
                    </div>
                    <div>
                      <label style={{ fontSize:12, fontWeight:600, color:C.cinza, display:"block", marginBottom:3 }}>{"Valor (R$)"}</label>
                      <input type="text" inputMode="decimal" value={p.valor} onChange={function(e){editParcela(p.id,"valor",e.target.value);}} placeholder={"0,00"} style={inpStyle} />
                    </div>
                    <div>
                      <label style={{ fontSize:12, fontWeight:600, color:C.cinza, display:"block", marginBottom:3 }}>{"Pago (R$)"}</label>
                      <input type="text" inputMode="decimal" value={p.pago} onChange={function(e){editParcela(p.id,"pago",e.target.value);}} placeholder={"0,00"} style={inpStyle} />
                    </div>
                    <button onClick={function(){removeParcela(p.id);}} style={{ background:"transparent", border:"none", cursor:"pointer", color:C.vermelho, fontSize:18, paddingBottom:4 }}>{"✕"}</button>
                  </div>
                );
              })}
              <div style={{ marginTop:16 }}>
                <Btn onClick={calcular} disabled={loading||parcelas.every(function(p){return !p.valor;})}>
                  {loading?"Calculando...":"Calcular Débito"}
                </Btn>
              </div>
            </Card>

            {resultado && (
              <Card style={{ borderLeft:"4px solid "+C.verde }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
                  <h3 style={{ margin:0, color:C.verde }}>{"Resultado"}</h3>
                  <div style={{ display:"flex", gap:8, alignItems:"center" }}>
                    <span style={{ fontSize:12, color:"#888" }}>{resultado.indiceLabel}</span>
                    <Btn onClick={function(){carregarLogo("#1a6b3a").then(function(ld){gerarPDFCompleto(resultado,ld);});}} cor={C.azul}>{"Gerar PDF"}</Btn>
                  </div>
                </div>
                {resultado.processo && <p style={{ margin:"0 0 4px", fontSize:13, color:"#666" }}>{"Processo: "}<strong>{resultado.processo}</strong></p>}
                {resultado.alimentado && <p style={{ margin:"0 0 16px", fontSize:13, color:"#666" }}>{"Alimentado(a): "}<strong>{resultado.alimentado}</strong></p>}
                {resultado.obsImputacao && (
                  <div style={{ background:"#fff8e1", border:"1px solid #f0c040", borderRadius:8, padding:"12px 16px", marginBottom:16, fontSize:12, color:"#555", lineHeight:1.6 }}>
                    <div style={{ fontWeight:700, color:"#b8860b", marginBottom:4, fontSize:13 }}>{"Imputação de Pagamentos (art. 354 CC)"}</div>
                    {resultado.obsImputacao}
                    {resultado.creditoRemanescente>0 && <div style={{ marginTop:8, fontWeight:700, color:C.verde }}>{"Crédito remanescente: "+fmt(resultado.creditoRemanescente)}</div>}
                  </div>
                )}
                {resultado.prisao.length>0 && (
                  <div style={{ background:C.verdePale, border:"1px solid "+C.verde, borderRadius:8, padding:16, marginBottom:12 }}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
                      <div style={{ fontWeight:700, color:C.verde }}>{"BLOCO 1 — Prisão Civil"}</div>
                      <span style={{ background:C.verde, color:"#fff", borderRadius:20, padding:"3px 12px", fontSize:12, fontWeight:700 }}>{fmt(resultado.totalPrisao)}</span>
                    </div>
                    {resultado.prisao.map(function(p,i){
                      return (
                        <div key={i} style={{ display:"flex", justifyContent:"space-between", fontSize:13, marginTop:4 }}>
                          <span>{p.label}{p.is13?" [13º]":""}{p.pagoOriginal>0?" (pago: "+fmt(p.pagoOriginal)+")":""}{p.creditoAplicado>0?" (créd.: "+fmt(p.creditoAplicado)+")":""}{p.quitado?" QUITADO":""}</span>
                          <span style={{ fontWeight:600, color:p.quitado?C.verde:"inherit" }}>{p.quitado?"-":fmt(p.total)}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
                {resultado.penhora.length>0 && (
                  <div style={{ background:"#e8f0f8", border:"1px solid "+C.azul, borderRadius:8, padding:16, marginBottom:12 }}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
                      <div style={{ fontWeight:700, color:C.azul }}>{"BLOCO 2 — Penhora"}</div>
                      <span style={{ background:C.azul, color:"#fff", borderRadius:20, padding:"3px 12px", fontSize:12, fontWeight:700 }}>{fmt(resultado.totalPenhora)}</span>
                    </div>
                    {resultado.penhora.map(function(p,i){
                      return (
                        <div key={i} style={{ display:"flex", justifyContent:"space-between", fontSize:13, marginTop:4 }}>
                          <span>{p.label}{p.is13?" [13º]":""}{p.pagoOriginal>0?" (pago: "+fmt(p.pagoOriginal)+")":""}{p.creditoAplicado>0?" (créd.: "+fmt(p.creditoAplicado)+")":""}{p.quitado?" QUITADO":""}</span>
                          <span style={{ fontWeight:600, color:p.quitado?C.verde:"inherit" }}>{p.quitado?"-":fmt(p.total)}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginTop:8 }}>
                  <div style={{ background:C.verde, borderRadius:8, padding:"12px 16px", textAlign:"center" }}>
                    <div style={{ color:"#fff", fontSize:11, opacity:.8 }}>{"BLOCO 1 — Prisão Civil"}</div>
                    <div style={{ color:"#fff", fontWeight:800, fontSize:18 }}>{fmt(resultado.totalPrisao)}</div>
                  </div>
                  <div style={{ background:C.azul, borderRadius:8, padding:"12px 16px", textAlign:"center" }}>
                    <div style={{ color:"#fff", fontSize:11, opacity:.8 }}>{"BLOCO 2 — Penhora"}</div>
                    <div style={{ color:"#fff", fontWeight:800, fontSize:18 }}>{fmt(resultado.totalPenhora)}</div>
                  </div>
                </div>
              </Card>
            )}
          </div>
        )}

        {tab==="atualizar" && (
          <TabAtualizacao
            perfil={perfil}
            usuario={usuario}
            onSalvarHistorico={salvarHistorico}
            onAcessoNegado={function(){setShowModalAcesso(true);}}
          />
        )}

        {tab==="historico" && (
          <Card>
            <h3 style={{ margin:"0 0 16px", color:C.verde }}>{"Histórico"}</h3>
            {historico.length===0
              ?<p style={{ color:"#888", textAlign:"center", padding:32 }}>{"Nenhum cálculo ainda."}</p>
              :historico.map(function(h){
                var tipoLabel=h.tipo==="atu-penhora"?"Atualiz. Penhora":h.tipo==="atu-prisao"?"Atualiz. Prisão":"Novo Cálculo";
                var corTipo=h.tipo==="atu-penhora"?C.azul:C.verde;
                return (
                  <div key={h.id} style={{ borderBottom:"1px solid "+C.borda, padding:"14px 0", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                    <div>
                      <div style={{ fontWeight:600, fontSize:14 }}>{h.alimentado||"-"}</div>
                      <div style={{ fontSize:12, color:"#888" }}>{(h.processo||"Sem nº")+" — "+h.data}</div>
                      <span style={{ fontSize:11, color:corTipo, fontWeight:600 }}>{tipoLabel}</span>
                    </div>
                    <div style={{ fontWeight:700, color:C.verde, fontSize:15 }}>{fmt(h.total||0)}</div>
                  </div>
                );
              })
            }
            {historico.length>0 && (
              <div style={{ marginTop:16 }}>
                <Btn small outline cor={C.vermelho} onClick={function(){
                  if(window.confirm("Limpar histórico?")){setHistorico([]);localStorage.removeItem("dpe_historico");}
                }}>{"Limpar"}</Btn>
              </div>
            )}
          </Card>
        )}
      </div>
    </div>
  );
}
