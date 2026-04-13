<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>DPE-PI | Diretoria Itinerante</title>
<style>
:root{--v:#2E7D32;--v2:#43A047;--v3:#1B5E20;--vc:#F1F8E9;--vm:#C8E6C9;--bg:#f4f6f4;--bd:#ccc;}
*{margin:0;padding:0;box-sizing:border-box;font-family:'Segoe UI',system-ui,sans-serif;}
body{background:var(--bg);color:#222;padding-bottom:80px;line-height:1.5;}
.wrap{max-width:1040px;margin:0 auto;padding:20px;}
.card{background:#fff;padding:20px;border-radius:8px;box-shadow:0 2px 8px rgba(0,0,0,.07);margin-bottom:16px;}
h2{color:var(--v);border-bottom:2px solid var(--vm);padding-bottom:6px;margin-bottom:14px;font-size:15px;}
h3{color:var(--v3);font-size:14px;margin-bottom:10px;}
.row{display:flex;gap:12px;flex-wrap:wrap;margin-bottom:10px;}
.fg{flex:1;min-width:150px;}
.fg label{display:block;font-size:12px;font-weight:700;margin-bottom:3px;color:var(--v3);}
.fg input,.fg select,.fg textarea{width:100%;padding:7px 9px;border:1px solid var(--bd);border-radius:5px;font-size:13px;}
.fg input:focus,.fg select:focus{outline:2px solid var(--v2);}
.btn{padding:8px 14px;border:none;border-radius:5px;cursor:pointer;font-weight:700;font-size:13px;}
.bv{background:var(--v);color:#fff;} .bv:hover{background:var(--v3);}
.bo{background:transparent;border:2px solid var(--v);color:var(--v);}
.br{background:#c62828;color:#fff;}
.by{background:#f9a825;color:#fff;}
.bsm{padding:5px 10px;font-size:12px;}
.chips{display:flex;flex-wrap:wrap;gap:7px;margin-top:7px;}
.chip{position:relative;}
.chip input{position:absolute;opacity:0;width:0;height:0;}
.chip label{display:flex;align-items:center;gap:4px;padding:5px 11px;border:2px solid var(--bd);border-radius:20px;cursor:pointer;font-size:12px;font-weight:600;color:#555;background:#fff;white-space:nowrap;}
.chip label:hover,.chip input:checked+label{border-color:var(--v);background:var(--v);color:#fff;}
.divid{height:1px;background:var(--bd);margin:14px 0;}
.errmsg{color:#c62828;font-size:12px;margin-top:7px;display:none;}
.pcard{border:2px solid var(--bd);border-radius:8px;padding:10px 13px;cursor:pointer;display:flex;align-items:center;gap:11px;margin-bottom:7px;}
.pcard:hover,.pcard.sel{border-color:var(--v);background:var(--vc);}
#loginScreen{display:flex;justify-content:center;align-items:center;min-height:90vh;}
#dashboard{display:none;}
.topbar{display:flex;justify-content:space-between;align-items:center;background:#fff;padding:11px 16px;border-radius:8px;margin-bottom:16px;box-shadow:0 2px 6px rgba(0,0,0,.05);flex-wrap:wrap;gap:9px;border-left:5px solid var(--v);}
.badge{background:var(--vc);border:1px solid var(--vm);padding:4px 10px;border-radius:6px;font-weight:700;color:var(--v3);font-size:13px;}
.tabs{display:flex;gap:9px;margin-bottom:16px;flex-wrap:wrap;}
.tab{padding:7px 15px;background:#fff;border:2px solid var(--bd);border-radius:5px;cursor:pointer;font-weight:700;font-size:13px;}
.tab.on{background:var(--v);color:#fff;border-color:var(--v);}
.hi{background:var(--vc);border:1px solid var(--vm);padding:11px;margin-bottom:7px;border-radius:6px;display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:7px;}
.hi h3{font-size:13px;color:var(--v3);margin-bottom:2px;}
.hi p{font-size:11px;color:#555;}
.mbg{display:none;position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:9999;align-items:center;justify-content:center;}
.mbox{background:#fff;border-radius:8px;padding:24px;max-width:420px;width:90%;}
.noprint{}
.iprint{display:none;}
@media print{
body{margin:0;padding:0;}
body > *{display:none !important;}
.iprint{display:block !important;position:static !important;}
.iprint .secprint{display:none;}
.iprint .secprint.ativa{display:block;}
@page{margin:1.2cm 1.8cm;size:A4 portrait;}
.qbra{page-break-after:always;}
.qbra:last-child{page-break-after:auto;}
}
.ofcard{border:2px solid var(--vm);border-radius:8px;padding:14px;margin-bottom:12px;background:#fff;}
.titular-bloco{border:1px solid var(--bd);border-radius:6px;padding:12px;margin-bottom:10px;background:#f9fbf9;}
.titular-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;}
.titular-title{font-weight:700;font-size:13px;color:var(--v3);}
.doc-item{background:#F1F8E9;border:1px solid var(--vm);border-radius:5px;padding:8px 10px;margin-bottom:6px;display:flex;justify-content:space-between;align-items:center;font-size:12px;}
.doc-item-txt{flex:1;}
.fw{font-family:Arial,sans-serif;font-size:8.5pt;}
.ftp{display:flex;align-items:center;gap:14px;border-bottom:3px solid #4CAF50;padding-bottom:10px;margin-bottom:10px;}
.ftp img{width:80px;height:auto;display:block;flex-shrink:0;}
.ftx{flex:1;text-align:center;}
.ftx .ft1{color:#2E7D32;font-size:12pt;font-weight:700;text-transform:uppercase;letter-spacing:.5px;}
.ftx .ft2{color:#43A047;font-size:8.5pt;font-weight:700;margin-top:2px;}
.ftx .ft3{color:#66BB6A;font-size:7.5pt;}
.ftx .ft4{color:#888;font-size:7pt;margin-top:1px;}
.fsc{background:#43A047;color:#fff;padding:2px 7px;font-size:7.5pt;font-weight:700;text-transform:uppercase;margin:7px 0 4px;border-radius:2px;}
.fl{display:flex;border-bottom:1px solid #ccc;padding:2px 0;align-items:flex-end;gap:6px;margin-bottom:2px;}
.fr{font-size:7pt;font-weight:700;text-transform:uppercase;color:#2E7D32;white-space:nowrap;flex-shrink:0;}
.fv{flex:1;border-bottom:1px dotted #aaa;min-height:12px;font-size:8pt;padding-left:3px;}
.fop{display:flex;flex-wrap:wrap;gap:6px;margin:4px 0;}
.fo{display:flex;align-items:center;gap:2px;font-size:7.5pt;}
.fck{width:8px;height:8px;border:1.5px solid #43A047;display:inline-flex;align-items:center;justify-content:center;font-size:6.5pt;flex-shrink:0;}
.dbox{margin-top:8px;padding:8px;border:1.5px solid #66BB6A;font-size:7.5pt;line-height:1.35;text-align:justify;background:#fafff8;}
.dtit{font-weight:700;text-transform:uppercase;text-align:center;margin-bottom:6px;font-size:8.5pt;color:#2E7D32;}
.dp{margin-bottom:6px;}
.das{margin-top:26px;text-align:center;}
.dln{border-top:1px solid #000;width:58%;margin:0 auto 3px;}
.ow{font-family:Arial,sans-serif;font-size:10pt;line-height:1.65;text-align:justify;}
.otp{display:flex;align-items:center;gap:16px;border-bottom:3px solid #4CAF50;padding-bottom:10px;margin-bottom:16px;}
.otp img{width:80px;height:auto;display:block;flex-shrink:0;}
.otx{flex:1;text-align:center;}
.otx .ot1{color:#2E7D32;font-size:12pt;font-weight:700;text-transform:uppercase;}
.otx .ot2{color:#43A047;font-size:9pt;font-weight:700;}
.otx .ot3{color:#66BB6A;font-size:8pt;}
.onr{display:flex;justify-content:space-between;margin-bottom:14px;border-bottom:1px solid #A5D6A7;padding-bottom:7px;}
.onl{font-size:9.5pt;font-weight:700;color:#2E7D32;}
.odt{font-size:9.5pt;font-weight:700;color:#333;}
.ode{margin-bottom:10px;font-size:9.5pt;}
.oas{margin-bottom:11px;font-weight:700;font-size:9.5pt;padding:4px 8px;background:#F1F8E9;border-left:3px solid #66BB6A;border-radius:0 3px 3px 0;}
.op{margin-bottom:9px;text-indent:28px;font-size:9.5pt;}
.ofu{margin:10px 0;font-size:9.5pt;}
.ofu ol{padding-left:18px;margin-top:4px;}
.ofu li{margin-bottom:5px;}
.oob{font-style:italic;padding:4px 8px;border-left:3px solid #A5D6A7;margin:8px 0;font-size:9.5pt;background:#F9FBE7;}
.osn{margin-top:38px;text-align:center;}
.osl{border-top:1px solid #000;width:55%;margin:0 auto 4px;}
.osn2{font-weight:700;font-size:10pt;}
.ord{border-top:1px solid #ddd;margin-top:16px;padding-top:5px;font-size:7.5pt;color:#666;}
.cb{border:1px solid #A5D6A7;border-radius:4px;padding:7px 10px;margin-bottom:8px;background:#F9FBE7;}
.cbt{font-weight:700;font-size:9pt;color:#2E7D32;margin-bottom:4px;}
#mEditOf{display:none;position:fixed;inset:0;background:rgba(0,0,0,.6);z-index:10000;align-items:flex-start;justify-content:center;overflow-y:auto;padding:20px 10px;}
#mEditOf.open{display:flex;}
.meof{background:#fff;border-radius:10px;padding:22px;max-width:680px;width:100%;margin:auto;}
.meof h2{color:var(--v);border-bottom:2px solid var(--vm);padding-bottom:6px;margin-bottom:14px;font-size:15px;}
.meof-tit-bloco{border:1px solid var(--bd);border-radius:6px;padding:12px;margin-bottom:10px;background:#f9fbf9;}
.meof-tit-hdr{display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;}
.meof-doc-item{background:#F1F8E9;border:1px solid var(--vm);border-radius:5px;padding:7px 10px;margin-bottom:5px;display:flex;justify-content:space-between;align-items:center;font-size:12px;}
.meof-sec{background:#E8F5E9;border-radius:6px;padding:12px;margin-bottom:12px;}
.meof-sec-tit{font-weight:700;font-size:13px;color:var(--v3);margin-bottom:8px;}
</style>
</head>
<body>

<!-- TELA INICIAL -->
<div id="loginScreen" class="noprint">
<div style="max-width:520px;width:100%;margin:0 auto;padding:20px;">
<!-- TABS LOGIN - 3 abas: Entrar / Busca / Histórico -->
<div style="display:flex;border-radius:8px 8px 0 0;overflow:hidden;">
<div id="ltab1" onclick="ltab('login')" style="flex:1;padding:11px;text-align:center;background:var(--v);color:#fff;font-weight:700;font-size:12px;cursor:pointer;">Entrar</div>
<div id="ltab2" onclick="ltab('busca')" style="flex:1;padding:11px;text-align:center;background:#888;color:#fff;font-weight:700;font-size:12px;cursor:pointer;">Busca</div>
<div id="ltab3" onclick="ltab('histórico')" style="flex:1;padding:11px;text-align:center;background:#555;color:#fff;font-weight:700;font-size:12px;cursor:pointer;">&#128203; Histórico</div>
</div>

<!-- PAINEL LOGIN -->
<div id="lPanelLogin" style="background:#fff;padding:22px;border-radius:0 0 8px 8px;box-shadow:0 4px 12px rgba(0,0,0,.12);">
<div style="font-size:13px;font-weight:700;color:var(--v3);text-align:center;margin-bottom:14px;">DEFENSORIA PÚBLICA DO ESTADO DO PIAUÍ<br><span style="font-size:11px;font-weight:400;color:#666;">Diretoria Itinerante</span></div>
<div style="font-size:12px;font-weight:700;color:var(--v3);margin-bottom:10px;">Selecione o perfil:</div>
<div id="pcards"></div>
<div class="fg" style="margin-bottom:10px;"><label>Jornada / Defensoria:</label><select id="lgJ"><option value="">Selecione...</option></select></div>
<div class="fg" style="margin-bottom:14px;"><label>Senha:</label><input type="password" id="lgS" placeholder="..." onkeydown="if(event.key==='Enter')doLogin()"></div>
<button class="btn bv" style="width:100%;" onclick="doLogin()">ENTRAR</button>
<div class="errmsg" id="lerr" style="text-align:center;">Senha, perfil ou jornada incorretos.</div>
<div style="border-top:1px dashed var(--bd);margin-top:16px;padding-top:14px;">
<div style="font-size:12px;font-weight:700;color:var(--v3);margin-bottom:8px;">Reabrir Jornada Encerrada:</div>
<div style="display:flex;gap:8px;flex-wrap:wrap;align-items:flex-end;">
<div class="fg"><select id="rlSel"><option value="">Selecione...</option></select></div>
<div class="fg" style="max-width:160px;"><label style="font-size:11px;font-weight:700;color:var(--v3);">Senha:</label><input type="password" id="rlPw" placeholder="..." onkeydown="if(event.key==='Enter')doReabrir()"></div>
<button class="btn bo bsm" onclick="doReabrir()" style="height:38px;">Reabrir</button>
</div>
<div class="errmsg" id="rlErr" style="font-size:11px;">Senha incorreta ou perfil nao selecionado.</div>
<div style="font-size:11px;color:#888;margin-top:5px;">A numeração retoma de onde parou.</div>
</div>
</div>

<!-- PAINEL BUSCA -->
<div id="lPanelBusca" style="display:none;background:#fff;padding:22px;border-radius:0 0 8px 8px;box-shadow:0 4px 12px rgba(0,0,0,.12);">
<div style="background:var(--vc);border-left:4px solid var(--v);padding:9px 12px;margin-bottom:14px;font-size:12px;color:var(--v3);border-radius:0 4px 4px 0;">Busca em todos os atendimentos salvos.</div>
<div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:10px;align-items:flex-end;">
<div class="fg" style="flex:2;"><label style="font-size:12px;font-weight:700;color:var(--v3);">Nome do requerente:</label><input type="text" id="lbNm" placeholder="Ex: Maria, Joao Silva..." oninput="this.value=this.value.toUpperCase()" onkeydown="if(event.key==='Enter')doLbuscar()" style="width:100%;padding:7px 9px;border:1px solid var(--bd);border-radius:5px;font-size:13px;"></div>
<div class="fg" style="max-width:200px;"><label style="font-size:12px;font-weight:700;color:var(--v3);">CPF:</label><input type="text" id="lbCP" placeholder="000.000.000-00" maxlength="14" oninput="mcpf(this)" onkeydown="if(event.key==='Enter')doLbuscar()" style="width:100%;padding:7px 9px;border:1px solid var(--bd);border-radius:5px;font-size:13px;"></div>
<button class="btn bv" style="height:38px;padding:0 20px;" onclick="doLbuscar()">Buscar</button>
<button class="btn bo" style="height:38px;padding:0 14px;" onclick="doLlimpar()">Limpar</button>
</div>
<div id="lbInfo" style="font-size:12px;color:#666;margin-bottom:8px;"></div>
<div id="lbRes" style="max-height:400px;overflow-y:auto;"></div>
<div style="margin-top:18px;">
<div style="font-weight:700;font-size:13px;color:var(--v3);border-bottom:2px solid var(--vm);padding-bottom:5px;margin-bottom:10px;">Relatórios de Jornadas Encerradas</div>
<div id="lbRel" style="max-height:280px;overflow-y:auto;"></div>
</div>
</div>

<!-- PAINEL HISTORICO (senha DITI2027) -->
<div id="lPanelHistorico" style="display:none;background:#fff;padding:22px;border-radius:0 0 8px 8px;box-shadow:0 4px 12px rgba(0,0,0,.12);">
<div id="lhAuth">
<div style="font-size:13px;font-weight:700;color:var(--v3);margin-bottom:12px;">Acesso restrito - Histórico de Jornadas</div>
<div style="display:flex;gap:8px;align-items:flex-end;">
<div class="fg"><label>Senha:</label><input type="password" id="lhSe" placeholder="..." onkeydown="if(event.key==='Enter')doAutHistórico()"></div>
<button class="btn bv" style="height:38px;" onclick="doAutHistórico()">Acessar</button>
</div>
<div class="errmsg" id="lhErr">Senha incorreta.</div>
</div>
<div id="lhPain" style="display:none;">
<div style="font-weight:700;font-size:14px;color:var(--v3);margin-bottom:12px;">Relatórios de Jornadas Encerradas</div>
<div id="lhRelLista" style="max-height:450px;overflow-y:auto;"></div>
</div>
</div>

</div>
</div>

<!-- DASHBOARD -->
<div id="dashboard" class="noprint">
<div class="wrap">
<div class="topbar">
<div>
<div style="font-weight:700;font-size:15px;color:var(--v3);" id="titPag">Novo Atendimento</div>
<div style="font-size:11px;color:#666;" id="infoS"></div>
</div>
<div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;">
<div class="badge" id="bdg">Proximo Ofício: 001</div>
<button class="btn bv bsm" id="btnNJ" style="display:none;" onclick="abrirModal()">+ Nova Jornada</button>
<button class="btn br bsm" onclick="doEncerrar()">Encerrar Jornada</button>
<button class="btn bo bsm" onclick="doSair()">Sair</button>
</div>
</div>
<div class="tabs">
<div class="tab on" id="tN" onclick="aba('n')">Atendimento</div>
<div class="tab" id="tH" onclick="aba('h')">Histórico</div>
</div>

<!-- ABA ATENDIMENTO -->
<div id="abaN">
<div class="card" id="secRequerente">
<h2>1. Dados do(a) Requerente</h2>
<div style="background:var(--vc);border-left:4px solid var(--v);padding:9px 12px;margin-bottom:14px;font-size:12px;color:var(--v3);border-radius:0 4px 4px 0;">Estes dados definem o requerente de todos os ofícios deste atendimento e compoem a Ficha + Declaração de Hipossuficiência.</div>
<div class="row">
<div class="fg" style="flex:3;"><label>Nome Completo:</label><input id="rN" type="text" oninput="this.value=this.value.toUpperCase()"></div>
<div class="fg"><label>CPF:</label><input id="rC" type="text" maxlength="14" placeholder="000.000.000-00" oninput="mcpf(this)"></div>
</div>
<div class="row">
<div class="fg"><label>Data de Nascimento:</label><input id="rD" type="text" maxlength="10" placeholder="DD/MM/AAAA" oninput="mdat(this)"></div>
<div class="fg"><label>Telefone:</label><input id="rT" type="text" maxlength="15" placeholder="(00) 00000-0000" oninput="mtel(this)"></div>
<div class="fg"><label>Estado Civil:</label><select id="rEC"><option value="">-</option><option>Solteiro(a)</option><option>Casado(a)</option><option>Divorciado(a)</option><option>Viúvo(a)</option><option>União Estável</option></select></div>
<!-- NOVO: Campo Sexo -->
<div class="fg"><label>Sexo:</label><select id="rSX"><option value="">-</option><option value="Masculino">Masculino</option><option value="Feminino">Feminino</option><option value="Não-binário">Não-binário</option><option value="Não quer declarar">Não quer declarar</option></select></div>
</div>
<div class="row">
<div class="fg"><label>Nome do Pai:</label><input id="rP" type="text" oninput="this.value=ctit(this.value)"></div>
<div class="fg"><label>Nome da Mãe:</label><input id="rM" type="text" oninput="this.value=ctit(this.value)"></div>
</div>
<div class="row">
<div class="fg"><label>Profissão:</label><input id="rPr" type="text" oninput="this.value=ctit(this.value)"></div>
<div class="fg"><label>Renda Média Familiar:</label><input id="rR" type="text" placeholder="R$ 0,00" oninput="mrnd(this)" onfocus="irnd(this)"></div>
<div class="fg" style="flex:2;"><label>Endereço:</label><input id="rE" type="text" oninput="this.value=ctit(this.value)"></div>
</div>
<div class="divid"></div>
<div>
<span style="font-size:12px;font-weight:700;color:var(--v3);">Cor / Raça (IBGE)</span>
<div class="chips">
<div class="chip"><input type="radio" name="cor" id="cr1" value="Branca"><label for="cr1">Branca</label></div>
<div class="chip"><input type="radio" name="cor" id="cr2" value="Parda"><label for="cr2">Parda</label></div>
<div class="chip"><input type="radio" name="cor" id="cr3" value="Preta"><label for="cr3">Preta</label></div>
<div class="chip"><input type="radio" name="cor" id="cr4" value="Amarela"><label for="cr4">Amarela</label></div>
<div class="chip"><input type="radio" name="cor" id="cr5" value="Indígena"><label for="cr5">Indígena</label></div>
<div class="chip"><input type="radio" name="cor" id="cr6" value="Não Declarar"><label for="cr6">Não Declarar</label></div>
</div>
</div>
<div class="divid"></div>
<div>
<span style="font-size:12px;font-weight:700;color:var(--v3);">Ação Pretendida (pode marcar mais de uma)</span>
<div class="chips">
<div class="chip"><input type="checkbox" name="ac" id="a1" value="Documentos"><label for="a1">Documentos</label></div>
<div class="chip"><input type="checkbox" name="ac" id="a2" value="Alimentos"><label for="a2">Alimentos</label></div>
<div class="chip"><input type="checkbox" name="ac" id="a3" value="Guarda/Filiação"><label for="a3">Guarda/Filiação</label></div>
<div class="chip"><input type="checkbox" name="ac" id="a4" value="Criminal"><label for="a4">Criminal</label></div>
<div class="chip"><input type="checkbox" name="ac" id="a5" value="Saúde"><label for="a5">Saúde</label></div>
<div class="chip"><input type="checkbox" name="ac" id="a6" value="Interdição/Curatela"><label for="a6">Interdição/Curatela</label></div>
<div class="chip"><input type="checkbox" name="ac" id="a7" value="Previdência/INSS"><label for="a7">Previdência/INSS</label></div>
<div class="chip"><input type="checkbox" name="ac" id="a8" value="Outras"><label for="a8">Outras</label></div>
</div>
<input type="text" id="aOu" placeholder="Especifique Outras..." style="display:none;margin-top:8px;width:100%;padding:7px 10px;border:1px solid var(--bd);border-radius:4px;font-size:12px;">
</div>
<div style="margin-top:14px;text-align:right;">
<button class="btn bv" onclick="doGerarFicha()">Declaração de Hipossuficiência</button>
</div>
</div>

<!-- ETAPA 2: OFICIOS -->
<div class="card">
<h2>2. Solicitacoes de Ofício</h2>
<div style="background:#fff8e1;border-left:4px solid #f9a825;padding:9px 12px;margin-bottom:14px;font-size:12px;color:#5d4037;border-radius:0 4px 4px 0;">Cada Solicitação = 1 Ofício = 1 Cartório de destino. Adicione quantas solicitacoes precisar.</div>
<div id="ofListaView"></div>
<div id="ofForm">
<div style="border:2px solid var(--v);border-radius:8px;padding:16px;background:#F9FBE7;">
<div style="font-weight:700;font-size:14px;color:var(--v3);margin-bottom:12px;" id="ofFormTit">Solicitação #1 - Novo Ofício</div>
<div style="background:#E8F5E9;border-radius:6px;padding:12px;margin-bottom:14px;">
<div style="font-weight:700;font-size:13px;color:var(--v3);margin-bottom:8px;">Destino do Ofício</div>
<div class="row" style="margin-bottom:0;">
<div class="fg" style="flex:2;"><label>Cartório / Ofício:</label><input id="ofCartorio" type="text" placeholder="Ex: 1 Ofício de Registro Civil" oninput="this.value=ctit(this.value)"></div>
<div class="fg"><label>Cidade / Comarca:</label><input id="ofCidade" type="text" placeholder="Ex: Teresina/PI" oninput="this.value=ctit(this.value)"></div>
</div>
</div>
<div id="titularesBloco">
<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
<div style="font-weight:700;font-size:13px;color:var(--v3);">Titulares e Documentos</div>
</div>
<div id="titSalvosList"></div>
<div id="titForm" style="border:1px solid var(--bd);border-radius:6px;padding:12px;background:#fff;margin-bottom:10px;">
<div style="font-weight:700;font-size:13px;color:var(--v3);margin-bottom:8px;" id="titFormTit">Titular #1</div>
<div class="row">
<div class="fg">
<label>O titular é — em relação ao requerente:</label>
<select id="tPar" onchange="onParChange(this)">
<option value="">- selecione -</option>
<option value="proprio">O próprio requerente</option>
<option value="filho">Filho(a) do requerente</option>
<option value="genitor">Pai / Mãe do requerente</option>
<option value="conjuge">Cônjuge / Companheiro(a) do requerente</option>
<option value="irmao">Irmão / Irmã do requerente</option>
<option value="avo">Avô / Avó do requerente</option>
<option value="neto">Neto(a) do requerente</option>
<option value="tio">Tio(a) do requerente</option>
<option value="sobrinho">Sobrinho(a) do requerente</option>
<option value="tutor">Tutelado(a) / Curatelado(a) do requerente</option>
<option value="outro">Outro vinculo (especificar na observação)</option>
</select>
</div>
</div>
<div id="tAvisoProprio" style="display:none;background:#E8F5E9;border-left:4px solid var(--v);padding:8px 12px;margin-bottom:8px;font-size:12px;color:var(--v3);border-radius:0 4px 4px 0;">Dados de nome, CPF e nascimento serao preenchidos automaticamente com os do requerente.</div>
<div id="tCamposNome" class="row" style="display:none;">
<div class="fg" style="flex:3;"><label>Nome do Titular:</label><input id="tNome" type="text" placeholder="Nome completo do titular" oninput="this.value=ctit(this.value)"></div>
</div>
<div id="tCamposCPFNasc" class="row" style="display:none;">
<div class="fg"><label>CPF do Titular:</label><input id="tCPF" type="text" maxlength="14" placeholder="000.000.000-00" oninput="mcpf(this)"></div>
<div class="fg"><label>Data de Nascimento:</label><input id="tNasc" type="text" maxlength="10" placeholder="DD/MM/AAAA" oninput="mdat(this)"></div>
</div>
<div style="text-align:right;margin-top:8px;">
<button class="btn bv bsm" onclick="salvarTitular()">Salvar titular e adicionar documentos</button>
</div>
</div>
<div id="docForm" style="display:none;border:1px solid var(--vm);border-radius:6px;padding:12px;background:#F1F8E9;margin-bottom:10px;">
<div style="font-weight:700;font-size:13px;color:var(--v3);margin-bottom:8px;" id="docFormTit">Documentos para este titular</div>
<div id="docSalvosList"></div>
<div id="docNovoForm" style="border:1px dashed var(--bd);border-radius:5px;padding:10px;background:#fff;margin-bottom:8px;">
<div class="row">
<div class="fg" style="flex:2;"><label>Tipo de Documento:</label>
<select id="dTipo">
<option value="">Selecione...</option>
<option value="nasc">2ª Via da Certidão de Nascimento</option>
<option value="cas">2ª Via da Certidão de Casamento</option>
<option value="obi">2ª Via da Certidão de Óbito</option>
<option value="int">Certidão de Inteiro Teor</option>
</select>
</div>
</div>
<div class="row">
<div class="fg"><label>N.º Registro / Termo:</label><input id="dNR" type="text"></div>
<div class="fg"><label>Livro:</label><input id="dLivro" type="text" oninput="this.value=this.value.toUpperCase()"></div>
<div class="fg"><label>Folha:</label><input id="dFolha" type="text"></div>
<div class="fg" style="flex:2;"><label>Matrícula (opcional):</label><input id="dMat" type="text"></div>
</div>
<div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:6px;">
<button class="btn bv bsm" onclick="salvarDoc(false)">+ Salvar e adicionar outro documento</button>
<button class="btn bo bsm" onclick="salvarDoc(true)">Concluir documentos deste titular</button>
</div>
</div>
</div>
<div id="btnNovoTitular" style="display:none;margin-bottom:10px;">
<button class="btn by bsm" onclick="iniciarNovoTitular()">+ Adicionar outro titular neste ofício</button>
</div>
</div>
<div class="fg" style="margin-bottom:12px;">
<label>Observação para este Ofício (opcional):</label>
<textarea id="ofObs" rows="2" style="width:100%;padding:7px 9px;border:1px solid var(--bd);border-radius:5px;font-size:13px;" placeholder="Ex: Pedido tambem encaminhado pelo CRC JUD..."></textarea>
</div>
<div style="display:flex;gap:10px;flex-wrap:wrap;">
<button class="btn bv" onclick="salvarOfício(false)">Salvar e criar proximo ofício</button>
<button class="btn bo" onclick="salvarOfício(true)">Salvar e concluir</button>
<button class="btn by" id="btnDescartarOf" style="display:none;" onclick="descartarRascunhoOfício()">Descartar rascunho e concluir</button>
</div>
</div>
</div>
<div id="ofConcluido" style="display:none;padding:16px;background:var(--vc);border-radius:8px;border:1px solid var(--vm);">
<div style="font-weight:700;color:var(--v3);margin-bottom:12px;" id="ofConcluidoMsg"></div>
<div id="ofBotoesGerar"></div>
<div style="margin-top:10px;"><button class="btn bo bsm" onclick="reabrirOfícios()">Editar solicitações</button></div>
</div>
</div>
<div style="text-align:center;padding-top:8px;padding-bottom:20px;">
<button class="btn bo bsm" onclick="doLimpar()">Novo Atendimento (limpar tudo)</button>
</div>
</div><!-- /abaN -->

<!-- ABA HISTORICO -->
<div id="abaH" style="display:none;">
<div class="card">
<h2>Histórico da Jornada</h2>
<div id="lHist"></div>
</div>
<!-- RELATORIOS SALVOS NA ABA HISTORICO INTERNA -->
<div class="card">
<h2>Relatórios de Jornadas Encerradas</h2>
<div id="histRelLista"></div>
</div>
</div>

</div><!-- /wrap -->
</div><!-- /dashboard -->

<!-- MODAL JORNADA -->
<div class="mbg" id="mJor">
<div class="mbox">
<h2 style="margin-bottom:14px;">Nova Jornada</h2>
<div class="fg" style="margin-bottom:12px;"><label>Nome:</label><input type="text" id="nJN" placeholder="Ex: Jornada de Oeiras" oninput="this.value=ctit(this.value)"></div>
<div style="display:flex;gap:10px;margin-bottom:14px;">
<button class="btn bv" style="flex:1;" onclick="doCriarJ()">Criar</button>
<button class="btn bo" style="flex:1;" onclick="fecharModal()">Cancelar</button>
</div>
<div style="font-size:12px;font-weight:700;color:var(--v3);margin-bottom:8px;">Jornadas existentes:</div>
<div id="lJA"></div>
</div>
</div>

<!-- BOTAO FICHA MANUAL -->
<div class="noprint" style="position:fixed;bottom:18px;right:18px;z-index:998;">
<button onclick="doFichaManual()" style="background:#1B5E20;color:#fff;border:none;border-radius:8px;padding:10px 14px;font-size:11px;font-weight:700;cursor:pointer;box-shadow:0 3px 10px rgba(0,0,0,.25);line-height:1.3;text-align:center;">Ficha Manual<br>(caneta)</button>
</div>

<!-- AREA DE IMPRESSAO -->
<div class="iprint" id="printArea">
<!-- SECAO: FICHA + HIPO -->
<div id="pF" class="secprint qbra">
<div class="fw">
<div class="ftp">
<img id="lgF" alt="DPE-PI" style="width:80px;height:auto;display:block;flex-shrink:0;">
<div class="ftx">
<div class="ft1">Ficha de Atendimento</div>
<div class="ft2">Defensoria Pública do Estado do Piauí</div>
<div class="ft3">Diretoria Itinerante</div>
<div class="ft4">Uso exclusivo do servico</div>
</div>
</div>
<div class="fsc">Identificação do(a) Requerente</div>
<div class="fl"><span class="fr">Nome:</span><span class="fv" id="pRN"></span></div>
<div style="display:flex;gap:8px;">
<div style="flex:1;"><div class="fl"><span class="fr">CPF:</span><span class="fv" id="pRC"></span></div></div>
<div style="flex:1;"><div class="fl"><span class="fr">Nascimento:</span><span class="fv" id="pRD"></span></div></div>
<div style="flex:1;"><div class="fl"><span class="fr">Telefone:</span><span class="fv" id="pRT"></span></div></div>
</div>
<div style="display:flex;gap:8px;">
<div style="flex:1;"><div class="fl"><span class="fr">Pai:</span><span class="fv" id="pRP"></span></div></div>
<div style="flex:1;"><div class="fl"><span class="fr">Mãe:</span><span class="fv" id="pRM"></span></div></div>
</div>
<div style="display:flex;gap:8px;">
<div style="flex:1;"><div class="fl"><span class="fr">Est. Civil:</span><span class="fv" id="pREC"></span></div></div>
<div style="flex:1;"><div class="fl"><span class="fr">Sexo:</span><span class="fv" id="pRSX"></span></div></div>
<div style="flex:1;"><div class="fl"><span class="fr">Profissão:</span><span class="fv" id="pRPr"></span></div></div>
<div style="flex:2;"><div class="fl"><span class="fr">Renda:</span><span class="fv" id="pRR"></span></div></div>
</div>
<div class="fl"><span class="fr">Endereço:</span><span class="fv" id="pRE"></span></div>
<div style="display:flex;gap:0;margin-top:8px;border:1px solid #A5D6A7;border-radius:3px;overflow:hidden;">
<div style="flex:1;padding:5px 8px;border-right:2px solid #A5D6A7;">
<div style="background:#43A047;color:#fff;padding:2px 6px;font-size:7pt;font-weight:700;text-transform:uppercase;border-radius:2px;margin-bottom:4px;">Cor / Raça (IBGE)</div>
<div class="fop" id="pCor"></div>
</div>
<div style="flex:2;padding:5px 8px;">
<div style="background:#2E7D32;color:#fff;padding:2px 6px;font-size:7pt;font-weight:700;text-transform:uppercase;border-radius:2px;margin-bottom:4px;">Ação Pretendida</div>
<div class="fop" id="pAc"></div>
<div id="pOu" style="font-size:7pt;font-style:italic;margin-top:2px;"></div>
</div>
</div>
<div class="dbox">
<div class="dtit">Declaração de Hipossuficiência</div>
<div class="dp" id="pDecl"></div>
<div class="dp">Outrossim, declaro estar ciente de que a prestacao de informações falsas perante funcionário público poderá tipificar o crime de falsidade ideológica, previsto no art. 299 do Codigo Penal Brasileiro, cuja pena e de reclusao de 1 a 5 anos e multa.</div>
<div class="dp"><strong>AUTORIZAÇÃO LGPD</strong> - Conforme a Lei n. 13.709/2018, AUTORIZO a Defensoria Pública do Estado do Piauí a incluir meus dados pessoais nas peças processuais relacionadas a assistência jurídica prestada, para fins exclusivamente legais e processuais.</div>
<div class="das"><div style="height:28px;"></div><div class="dln"></div><div style="font-size:8pt;margin-top:2px;" id="pNAs"></div><div style="font-size:7.5pt;color:#555;">Requerente</div></div>
<div style="text-align:right;margin-top:5px;font-size:7.5pt;" id="pDtF"></div>
</div>
</div>
</div>

<!-- SECAO: OFICIO -->
<div id="pOficio" class="secprint qbra"></div>

<!-- SECAO: FICHA MANUAL -->
<div id="pM" class="secprint qbra">
<div style="font-family:Arial,sans-serif;font-size:8.5pt;">
<div style="display:flex;align-items:center;gap:14px;border-bottom:3px solid #4CAF50;padding-bottom:10px;margin-bottom:10px;">
<img id="lgM" alt="DPE-PI" style="width:80px;height:auto;display:block;flex-shrink:0;">
<div style="flex:1;text-align:center;">
<div style="color:#2E7D32;font-size:12pt;font-weight:700;text-transform:uppercase;">Ficha de Atendimento</div>
<div style="color:#43A047;font-size:8.5pt;font-weight:700;margin-top:2px;">Defensoria Pública do Estado do Piauí</div>
<div style="color:#66BB6A;font-size:7.5pt;">Diretoria Itinerante</div>
</div>
</div>
<div style="background:#43A047;color:#fff;padding:2px 7px;font-size:7.5pt;font-weight:700;text-transform:uppercase;border-radius:2px;margin-bottom:6px;">Identificação do(a) Requerente</div>
<div style="margin-bottom:7px;"><div style="font-size:7pt;font-weight:700;text-transform:uppercase;color:#2E7D32;margin-bottom:1px;">Nome Completo:</div><div style="border-bottom:1px solid #aaa;min-height:20px;"></div></div>
<div style="display:flex;gap:10px;margin-bottom:7px;">
<div style="flex:1;"><div style="font-size:7pt;font-weight:700;text-transform:uppercase;color:#2E7D32;margin-bottom:1px;">CPF:</div><div style="border-bottom:1px solid #aaa;min-height:20px;"></div></div>
<div style="flex:1;"><div style="font-size:7pt;font-weight:700;text-transform:uppercase;color:#2E7D32;margin-bottom:1px;">Nascimento:</div><div style="border-bottom:1px solid #aaa;min-height:20px;"></div></div>
<div style="flex:1;"><div style="font-size:7pt;font-weight:700;text-transform:uppercase;color:#2E7D32;margin-bottom:1px;">Telefone:</div><div style="border-bottom:1px solid #aaa;min-height:20px;"></div></div>
</div>
<div style="display:flex;gap:10px;margin-bottom:7px;">
<div style="flex:1;"><div style="font-size:7pt;font-weight:700;text-transform:uppercase;color:#2E7D32;margin-bottom:1px;">Nome do Pai:</div><div style="border-bottom:1px solid #aaa;min-height:20px;"></div></div>
<div style="flex:1;"><div style="font-size:7pt;font-weight:700;text-transform:uppercase;color:#2E7D32;margin-bottom:1px;">Nome da Mãe:</div><div style="border-bottom:1px solid #aaa;min-height:20px;"></div></div>
</div>
<div style="display:flex;gap:10px;margin-bottom:7px;">
<div style="flex:1;"><div style="font-size:7pt;font-weight:700;text-transform:uppercase;color:#2E7D32;margin-bottom:1px;">Estado Civil:</div><div style="border-bottom:1px solid #aaa;min-height:20px;"></div></div>
<div style="flex:1;"><div style="font-size:7pt;font-weight:700;text-transform:uppercase;color:#2E7D32;margin-bottom:1px;">Sexo:</div><div style="border-bottom:1px solid #aaa;min-height:20px;"></div></div>
<div style="flex:1;"><div style="font-size:7pt;font-weight:700;text-transform:uppercase;color:#2E7D32;margin-bottom:1px;">Profissão:</div><div style="border-bottom:1px solid #aaa;min-height:20px;"></div></div>
<div style="flex:1;"><div style="font-size:7pt;font-weight:700;text-transform:uppercase;color:#2E7D32;margin-bottom:1px;">Renda:</div><div style="border-bottom:1px solid #aaa;min-height:20px;"></div></div>
</div>
<div style="margin-bottom:8px;"><div style="font-size:7pt;font-weight:700;text-transform:uppercase;color:#2E7D32;margin-bottom:1px;">Endereço:</div><div style="border-bottom:1px solid #aaa;min-height:20px;"></div></div>
<div style="display:flex;gap:0;margin-bottom:8px;border:1px solid #A5D6A7;border-radius:3px;overflow:hidden;">
<div style="flex:1;padding:5px 8px;border-right:2px solid #A5D6A7;">
<div style="background:#43A047;color:#fff;padding:2px 6px;font-size:7pt;font-weight:700;text-transform:uppercase;border-radius:2px;margin-bottom:4px;">Cor / Raça (IBGE)</div>
<div style="display:flex;flex-wrap:wrap;gap:5px;">
<span style="display:flex;align-items:center;gap:2px;font-size:7.5pt;"><span style="width:8px;height:8px;border:1.5px solid #43A047;display:inline-block;"></span> Branca</span>
<span style="display:flex;align-items:center;gap:2px;font-size:7.5pt;"><span style="width:8px;height:8px;border:1.5px solid #43A047;display:inline-block;"></span> Parda</span>
<span style="display:flex;align-items:center;gap:2px;font-size:7.5pt;"><span style="width:8px;height:8px;border:1.5px solid #43A047;display:inline-block;"></span> Preta</span>
<span style="display:flex;align-items:center;gap:2px;font-size:7.5pt;"><span style="width:8px;height:8px;border:1.5px solid #43A047;display:inline-block;"></span> Amarela</span>
<span style="display:flex;align-items:center;gap:2px;font-size:7.5pt;"><span style="width:8px;height:8px;border:1.5px solid #43A047;display:inline-block;"></span> Indígena</span>
<span style="display:flex;align-items:center;gap:2px;font-size:7.5pt;"><span style="width:8px;height:8px;border:1.5px solid #43A047;display:inline-block;"></span> Não Declarar</span>
</div>
</div>
<div style="flex:2;padding:5px 8px;">
<div style="background:#2E7D32;color:#fff;padding:2px 6px;font-size:7pt;font-weight:700;text-transform:uppercase;border-radius:2px;margin-bottom:4px;">Ação Pretendida</div>
<div style="display:flex;flex-wrap:wrap;gap:5px;">
<span style="display:flex;align-items:center;gap:2px;font-size:7.5pt;"><span style="width:8px;height:8px;border:1.5px solid #43A047;display:inline-block;"></span> Documentos</span>
<span style="display:flex;align-items:center;gap:2px;font-size:7.5pt;"><span style="width:8px;height:8px;border:1.5px solid #43A047;display:inline-block;"></span> Alimentos</span>
<span style="display:flex;align-items:center;gap:2px;font-size:7.5pt;"><span style="width:8px;height:8px;border:1.5px solid #43A047;display:inline-block;"></span> Guarda/Filiação</span>
<span style="display:flex;align-items:center;gap:2px;font-size:7.5pt;"><span style="width:8px;height:8px;border:1.5px solid #43A047;display:inline-block;"></span> Criminal</span>
<span style="display:flex;align-items:center;gap:2px;font-size:7.5pt;"><span style="width:8px;height:8px;border:1.5px solid #43A047;display:inline-block;"></span> Saúde</span>
<span style="display:flex;align-items:center;gap:2px;font-size:7.5pt;"><span style="width:8px;height:8px;border:1.5px solid #43A047;display:inline-block;"></span> Interdição/Curatela</span>
<span style="display:flex;align-items:center;gap:2px;font-size:7.5pt;"><span style="width:8px;height:8px;border:1.5px solid #43A047;display:inline-block;"></span> Previdência/INSS</span>
<span style="display:flex;align-items:center;gap:2px;font-size:7.5pt;"><span style="width:8px;height:8px;border:1.5px solid #43A047;display:inline-block;"></span> Outras: <span style="border-bottom:1px dotted #999;display:inline-block;width:50px;">&nbsp;</span></span>
</div>
</div>
</div>
<div style="padding:8px;border:1.5px solid #66BB6A;font-size:7.5pt;line-height:1.35;text-align:justify;background:#fafff8;">
<div style="font-weight:700;text-transform:uppercase;text-align:center;margin-bottom:6px;font-size:8.5pt;color:#2E7D32;">Declaração de Hipossuficiência</div>
<div style="margin-bottom:6px;"><strong>DECLARO</strong>, para fins de obtenção de <strong>ASSISTÊNCIA JURÍDICA</strong> pela <strong>DEFENSORIA PÚBLICA DO ESTADO DO PIAUÍ</strong>, que sou pessoa pobre na forma da lei. O(A) Requerente atua como <span style="border-bottom:1px solid #555;display:inline-block;width:110px;vertical-align:bottom;">&nbsp;</span>, auferindo renda média de R$<span style="border-bottom:1px solid #555;display:inline-block;width:130px;vertical-align:bottom;">&nbsp;</span>.</div>
<div style="margin-bottom:6px;">Outrossim, declaro estar ciente que informações falsas poderão tipificar o crime de falsidade ideológica (art. 299 CP).</div>
<div style="margin-bottom:6px;"><strong>AUTORIZAÇÃO LGPD</strong> - Autorizo a DPE-PI a incluir meus dados pessoais nas peças processuais para fins exclusivamente legais.</div>
<div style="margin-top:28px;text-align:center;"><div style="border-top:1px solid #000;width:58%;margin:0 auto 3px;"></div><div style="font-size:7.5pt;color:#555;">Assinatura do(a) Requerente</div></div>
<div style="text-align:right;margin-top:8px;font-size:7.5pt;"><span style="border-bottom:1px dotted #555;display:inline-block;width:110px;">&nbsp;</span>, <span style="border-bottom:1px dotted #555;display:inline-block;width:16px;">&nbsp;</span> de <span style="border-bottom:1px dotted #555;display:inline-block;width:70px;">&nbsp;</span> de <span style="border-bottom:1px dotted #555;display:inline-block;width:34px;">&nbsp;</span>.</div>
</div>
</div>
</div>
</div><!-- /printArea -->

<!-- MODAL EDICAO DE OFICIO -->
<div id="mEditOf" style="display:none;position:fixed;inset:0;background:rgba(0,0,0,.6);z-index:10000;align-items:flex-start;justify-content:center;overflow-y:auto;padding:20px 10px;">
<div class="meof">
<h2 id="meof-titulo">Editar Ofício</h2>
<div class="meof-sec">
<div class="meof-sec-tit">Destino do Ofício</div>
<div class="row" style="margin-bottom:0;">
<div class="fg" style="flex:2;"><label>Cartório / Ofício:</label><input id="meof-cartorio" type="text" oninput="this.value=ctit(this.value)"></div>
<div class="fg"><label>Cidade / Comarca:</label><input id="meof-cidade" type="text" oninput="this.value=ctit(this.value)"></div>
</div>
</div>
<div class="meof-sec">
<div class="meof-sec-tit">Titulares e Documentos</div>
<div id="meof-titulares-lista"></div>
<button class="btn by bsm" onclick="meofNovoTitular()" style="margin-top:6px;">+ Adicionar titular</button>
</div>
<div class="fg" style="margin-bottom:14px;">
<label>Observação (opcional):</label>
<textarea id="meof-obs" rows="2" style="width:100%;padding:7px 9px;border:1px solid var(--bd);border-radius:5px;font-size:13px;"></textarea>
</div>
<div style="display:flex;gap:10px;flex-wrap:wrap;">
<button class="btn bv" onclick="meofSalvar()">Salvar Alterações</button>
<button class="btn bo" onclick="meofFechar()">Cancelar</button>
</div>
</div>
</div>
<script>
(function(){
var PW='DITI2027';
var LURL='https://raw.githubusercontent.com/dpepigpt-glitch/rr/main/defcalc.png';
var LB='';
var MSA=['janeiro','fevereiro','março','abril','maio','junho','julho','agosto','setembro','outubro','novembro','dezembro'];
var PF=[
{id:'robert',nm:'Dr. Robert Rios Júnior',un:'2ª Defensoria Pública Itinerante',adm:true},
{id:'adriano',nm:'Dr. Adriano Moreti Batista',un:'1ª Defensoria Pública Itinerante',adm:false},
{id:'alessandro',nm:'Dr. Alessandro Andrade Spíndola',un:'Diretor da Defensoria Itinerante',adm:false}
];
var PFN=[
{id:'robert',nm:'Dr. Robert Rios Júnior',un:'2ª Defensoria Pública Itinerante'},
{id:'adriano',nm:'Dr. Adriano Moreti Batista',un:'1ª Defensoria Pública Itinerante'},
{id:'alessandro',nm:'Dr. Alessandro Andrade Spíndola',un:'Diretor da Defensoria Itinerante'}
];
var JD=[
{id:'cantodoburiti',nm:'Jornada de Canto do Buriti',fix:false,pw:PW,perfil:null},
{id:'saojosedopeixe',nm:'Jornada de São José do Peixe',fix:false,pw:PW,perfil:null},
{id:'def1',nm:'1ª Defensoria Pública Itinerante',fix:true,pw:'MO2027',perfil:'adriano'},
{id:'def2',nm:'2ª Defensoria Pública Itinerante',fix:true,pw:'RR2027',perfil:'robert'}
];
var SS=null;
var CA=null;
var ofíciosSalvos=[];
var titularesDOF=[];
var docsTIT=[];
var titAtual=null;

/* ===== UTIL ===== */
function mcpf(e){var v=e.value.replace(/\D/g,'');if(v.length>11)v=v.slice(0,11);v=v.replace(/(\d{3})(\d)/,'$1.$2');v=v.replace(/(\d{3})(\d)/,'$1.$2');v=v.replace(/(\d{3})(\d{1,2})$/,'$1-$2');e.value=v;}
function mdat(e){var v=e.value.replace(/\D/g,'');if(v.length>8)v=v.slice(0,8);v=v.replace(/(\d{2})(\d)/,'$1/$2');v=v.replace(/(\d{2})(\d)/,'$1/$2');e.value=v;}
function mtel(e){var v=e.value.replace(/\D/g,'');if(v.length>11)v=v.slice(0,11);if(v.length<=10){v=v.replace(/(\d{2})(\d)/,'($1) $2');v=v.replace(/(\d{4})(\d)/,'$1-$2');}else{v=v.replace(/(\d{2})(\d)/,'($1) $2');v=v.replace(/(\d{5})(\d)/,'$1-$2');}e.value=v;}
function irnd(e){if(!e.value)e.value='R$ ';}
function mrnd(e){var r=e.value.replace(/[^\d]/g,'');if(!r){e.value='R$ ';return;}var n=parseInt(r,10),rs=Math.floor(n/100),cs=n%100;e.value='R$ '+rs.toString().replace(/\B(?=(\d{3})+(?!\d))/g,'.')+(','+(cs<10?'0':'')+cs);}
function ctit(s){return s.replace(/(?:^|[\s\-])\S/g,function(c){return c.toUpperCase();});}
function rnum(s){if(!s||s==='R$ ')return 0;return parseFloat(s.replace('R$ ','').replace(/\./g,'').replace(',','.'))||0;}
function tlbl(t){var m={nasc:'2ª Via da Certidão de Nascimento',cas:'2ª Via da Certidão de Casamento',obi:'2ª Via da Certidão de Óbito',int:'Certidão de Inteiro Teor'};return m[t]||t;}

function ext(n){
var u=['zero','um','dois','tres','quatro','cinco','seis','sete','oito','nove','dez','onze','doze','treze','quatorze','quinze','dezesseis','dezessete','dezoito','dezenove'];
var d=['','','vinte','trinta','quarenta','cinquenta','sessenta','setenta','oitenta','noventa'];
var c=['','cem','duzentos','trezentos','quatrocentos','quinhentos','seiscentos','setecentos','oitocentos','novecentos'];
function g(x){if(x<=19)return u[x];if(x<100)return d[Math.floor(x/10)]+(x%10?' e '+u[x%10]:'');var ct=Math.floor(x/100),rx=x%100;if(rx===0)return c[ct];if(ct===1)return'cento e '+g(rx);return c[ct]+' e '+g(rx);}
var rs=Math.floor(n),cs=Math.round((n-rs)*100),p=[];
if(rs>0){if(rs<1000)p.push(g(rs)+(rs===1?' real':' reais'));else{var m=Math.floor(rs/1000),rx=rs%1000;var ms=m===1?'mil':g(m)+' mil';p.push((rx===0?ms:ms+(rx<100?' e ':' ')+g(rx))+(rs===1?' real':' reais'));}}
if(cs>0)p.push(g(cs)+(cs===1?' centavo':' centavos'));
return p.join(' e ')||'zero reais';
}

function gJ(){
var j=JSON.parse(localStorage.getItem('dpe_j')||'null');
if(!j){j=JD;localStorage.setItem('dpe_j',JSON.stringify(j));}
j.forEach(function(jorn){var def=JD.find(function(d){return d.id===jorn.id;});if(def&&def.fix){jorn.pw=def.pw;jorn.perfil=def.perfil;jorn.nm=def.nm;}});
return j;
}
function kA(id){return 'dpe_a_'+id;}
function kS(id){return 'dpe_s_'+id;}
function proxSeqNum(){return parseInt(localStorage.getItem(kS(SS.jid))||'0',10)+1;}
function consumirSeq(){var n=proxSeqNum();localStorage.setItem(kS(SS.jid),String(n));return n;}
function fmtNum(n){var s=String(n);while(s.length<3)s='0'+s;return s;}
function fmtNumOfício(n){var ano=new Date().getFullYear();var jnm=(SS&&SS.jnm)?SS.jnm:'DITI';return fmtNum(n)+'/'+ano+' - '+jnm;}
function updBdg(){var n=fmtNum(proxSeqNum());document.getElementById('bdg').innerText='Proximo Ofício: '+n;}

function ativarSecao(secId){
document.querySelectorAll('.secprint').forEach(function(el){el.classList.remove('ativa');});
var el=document.getElementById(secId);if(el)el.classList.add('ativa');
}
function desativarSecoes(){document.querySelectorAll('.secprint').forEach(function(el){el.classList.remove('ativa');});}

function carregarLogo(){
var img=new Image();img.crossOrigin='anonymous';
img.onload=function(){try{var cv=document.createElement('canvas');cv.width=img.naturalWidth;cv.height=img.naturalHeight;cv.getContext('2d').drawImage(img,0,0);LB=cv.toDataURL('image/png');}catch(e){LB=LURL;}alogos();};
img.onerror=function(){LB=LURL;alogos();};
img.src=LURL+'?t='+Date.now();
}
function alogos(){
var src=LB||LURL;
['lgF','lgM'].forEach(function(id){var el=document.getElementById(id);if(el){el.src=src;el.style.width='80px';el.style.height='auto';el.style.display='block';}});
document.querySelectorAll('.lgOf').forEach(function(el){el.src=src;el.style.width='80px';el.style.height='auto';el.style.display='block';});
}

window.onload=function(){
carregarLogo();
try{
var s=JSON.parse(localStorage.getItem('dpe_ss')||'null');
if(s&&s.pid){var jj2=gJ();var j2=jj2.find(function(j){return j.id===s.jid;});if(j2){s.jnm=j2.nm;if(j2.fix)s.un=j2.nm;}SS=s;init();}
}catch(e){}
rperfis();rjornadas();carregarRlSel();
var a8=document.getElementById('a8');
if(a8)a8.addEventListener('change',function(){var el=document.getElementById('aOu');if(el)el.style.display=this.checked?'block':'none';});
};

/* ===== ABAS TELA LOGIN ===== */
window.ltab=function(t){
var t1=document.getElementById('ltab1'),t2=document.getElementById('ltab2'),t3=document.getElementById('ltab3');
if(t1)t1.style.background=t==='login'?'var(--v)':'#888';
if(t2)t2.style.background=t==='busca'?'var(--v)':'#888';
if(t3)t3.style.background=t==='histórico'?'var(--v)':'#555';
var p1=document.getElementById('lPanelLogin'),p2=document.getElementById('lPanelBusca'),p3=document.getElementById('lPanelHistorico');
if(p1)p1.style.display=t==='login'?'block':'none';
if(p2)p2.style.display=t==='busca'?'block':'none';
if(p3)p3.style.display=t==='histórico'?'block':'none';
if(t==='busca')carregarRelsLogin();
};

/* ===== AUTENTICACAO HISTORICO ===== */
window.doAutHistórico=function(){
var s=(document.getElementById('lhSe').value||'').trim();
if(s!==PW){var er=document.getElementById('lhErr');if(er){er.style.display='block';}return;}
var er=document.getElementById('lhErr');if(er)er.style.display='none';
var auth=document.getElementById('lhAuth');if(auth)auth.style.display='none';
var pain=document.getElementById('lhPain');if(pain)pain.style.display='block';
carregarHistóricoLogin();
};

function carregarHistóricoLogin(){
var lista=document.getElementById('lhRelLista');if(!lista)return;lista.innerHTML='';
var rl=JSON.parse(localStorage.getItem('dpe_rl')||'[]');
if(!rl.length){lista.innerHTML='<div style="color:#888;font-size:13px;padding:10px;">Nenhum relatório salvo ainda.</div>';return;}
rl.slice().reverse().forEach(function(r,i){
var idx=rl.length-1-i;
var totalAt=r.totalAt||0;
var totalDocs=r.totalDocs||0;
var div=document.createElement('div');
div.style.cssText='border:1px solid var(--vm);border-radius:6px;padding:12px;margin-bottom:10px;background:#F9FBE7;';
div.innerHTML='<div style="font-weight:700;color:var(--v3);font-size:13px;">'+r.jnm+'</div>'
+'<div style="font-size:11px;color:#555;margin-top:3px;">Encerrada em: '+(r.dtEnc||'')+(r.hrEnc?' as '+r.hrEnc:'')
+' | Defensor(a): '+(r.def||r.defensor||'')
+' | Atendimentos: '+totalAt+' | Docs: '+totalDocs+'</div>'
+'<div style="margin-top:8px;display:flex;gap:8px;flex-wrap:wrap;">'
+'<button class="btn bv bsm" onclick="imprimirRelatorioSalvo('+idx+')">Imprimir Relatório</button>'
+'</div>';
lista.appendChild(div);
});
}

/* ===== LOGIN ===== */
function rperfis(){
var c=document.getElementById('pcards');if(!c)return;c.innerHTML='';
PF.forEach(function(p){
var dn=PFN.find(function(x){return x.id===p.id;});
var d=document.createElement('div');d.className='pcard';d.id='pc_'+p.id;
d.innerHTML='<span style="font-size:22px;">&#128100;</span><div><div style="font-weight:700;font-size:13px;color:var(--v3);">'+(dn?dn.nm:p.nm)+(p.adm?' *':'')+'</div><div style="font-size:11px;color:#666;">'+(dn?dn.un:p.un)+'</div></div>';
d.onclick=function(){document.querySelectorAll('.pcard').forEach(function(x){x.classList.remove('sel');});d.classList.add('sel');};
c.appendChild(d);
});
}

function rjornadas(){
var sel=document.getElementById('lgJ');if(!sel)return;
var jj=gJ();sel.innerHTML='<option value="">Selecione...</option>';
var campo=jj.filter(function(j){return !j.fix;}),fixas=jj.filter(function(j){return j.fix;});
if(campo.length){var g1=document.createElement('optgroup');g1.label='Jornadas Itinerantes';campo.forEach(function(j){var o=document.createElement('option');o.value=j.id;o.textContent=j.nm;g1.appendChild(o);});sel.appendChild(g1);}
if(fixas.length){var g2=document.createElement('optgroup');g2.label='Defensorias (atendimento diário)';fixas.forEach(function(j){var o=document.createElement('option');o.value=j.id;o.textContent=j.nm;g2.appendChild(o);});sel.appendChild(g2);}
}

window.doLogin=function(){
var sel=document.querySelector('.pcard.sel');if(!sel){mostrarErro('Selecione um perfil.');return;}
var pid=sel.id.replace('pc_','');
var pf=PF.find(function(p){return p.id===pid;});
var jid=document.getElementById('lgJ').value;
var pw=document.getElementById('lgS').value;
if(!jid||!pw){mostrarErro('Preencha todos os campos.');return;}
var jj=gJ();var jorn=jj.find(function(j){return j.id===jid;});if(!jorn){mostrarErro('Jornada não encontrada.');return;}
if(pw!==(jorn.pw||PW)){mostrarErro('Senha incorreta.');return;}
if(jorn.fix&&jorn.perfil&&pid!==jorn.perfil){mostrarErro('Este perfil não tem acesso a esta defensoria.');return;}
limparErro();
var dn=PFN.find(function(x){return x.id===pid;});
SS={pid:pid,nm:dn?dn.nm:pf.nm,un:jorn.fix?jorn.nm:(dn?dn.un:pf.un),adm:pf.adm,jid:jid,jnm:jorn.nm};
try{localStorage.setItem('dpe_ss',JSON.stringify(SS));}catch(e){}
init();
};

function mostrarErro(m){var el=document.getElementById('lerr');el.innerText=m;el.style.display='block';}
function limparErro(){document.getElementById('lerr').style.display='none';}

function carregarRlSel(){
var sel=document.getElementById('rlSel');if(!sel)return;
var jj=gJ();sel.innerHTML='<option value="">Selecione...</option>';
jj.forEach(function(j){
var atds=JSON.parse(localStorage.getItem(kA(j.id))||'[]');
var seq=parseInt(localStorage.getItem(kS(j.id))||'0',10);
if(atds.length>0||seq>0){
var o=document.createElement('option');o.value=j.id+'|'+j.pw;o.textContent=j.nm+' ('+atds.length+' atend.)';sel.appendChild(o);
}
});
}

window.doReabrir=function(){
var sel=document.getElementById('rlSel');
if(!sel||!sel.value){alert('Selecione uma jornada encerrada.');return;}
var pw=(document.getElementById('rlPw').value||'').trim();
if(!pw){document.getElementById('rlErr').style.display='block';return;}
var parts=sel.value.split('|');var jid=parts[0];
var jj=gJ();var jorn=jj.find(function(j){return j.id===jid;});
if(!jorn){alert('Jornada não encontrada.');return;}
if(pw!==(jorn.pw||PW)){document.getElementById('rlErr').style.display='block';document.getElementById('rlPw').value='';return;}
document.getElementById('rlErr').style.display='none';
var sel2=document.querySelector('.pcard.sel');
if(!sel2){alert('Selecione um perfil acima.');return;}
var pid=sel2.id.replace('pc_','');
var pf=PF.find(function(p){return p.id===pid;});
if(jorn.fix&&jorn.perfil&&pid!==jorn.perfil){alert('Este perfil não tem acesso a esta defensoria.');return;}
var dn=PFN.find(function(x){return x.id===pid;});
SS={pid:pid,nm:dn?dn.nm:pf.nm,un:jorn.fix?jorn.nm:(dn?dn.un:pf.un),adm:pf.adm,jid:jid,jnm:jorn.nm};
try{localStorage.setItem('dpe_ss',JSON.stringify(SS));}catch(e){}
var rl=JSON.parse(localStorage.getItem('dpe_rl')||'[]');
var relJ=rl.filter(function(r){return r.jid===jid;});
if(relJ.length){var ult=relJ[relJ.length-1];if(ult.ats&&ult.ats.length){localStorage.setItem(kA(jid),JSON.stringify(ult.ats));localStorage.setItem(kS(jid),String(ult.seqFinal||0));}}
init();
};

function init(){
document.getElementById('loginScreen').style.display='none';
document.getElementById('dashboard').style.display='block';
document.getElementById('infoS').innerText=SS.nm+' | '+SS.jnm;
var bn=document.getElementById('btnNJ');if(bn)bn.style.display=SS.adm?'inline-block':'none';
updBdg();renderOfListaView();
}

window.doSair=function(){if(confirm('Sair?')){localStorage.removeItem('dpe_ss');location.reload();}};

/* ===== ABAS DASHBOARD ===== */
window.aba=function(nm){
['abaN','abaH'].forEach(function(id){var el=document.getElementById(id);if(el)el.style.display='none';});
['tN','tH'].forEach(function(id){var el=document.getElementById(id);if(el)el.classList.remove('on');});
var ae=document.getElementById(nm==='n'?'abaN':'abaH'),te=document.getElementById(nm==='n'?'tN':'tH');
if(ae)ae.style.display='block';if(te)te.classList.add('on');
document.getElementById('titPag').innerText=nm==='n'?'Atendimento':'Histórico';
if(nm==='h'){rhist();carregarHistóricoDashboard();}
};

/* Relatorios na aba histórico do dashboard */
function carregarHistóricoDashboard(){
var lista=document.getElementById('histRelLista');if(!lista)return;lista.innerHTML='';
var rl=JSON.parse(localStorage.getItem('dpe_rl')||'[]');
if(!rl.length){lista.innerHTML='<div style="color:#888;font-size:13px;">Nenhum relatório salvo ainda.</div>';return;}
rl.slice().reverse().forEach(function(r,i){
var idx=rl.length-1-i;
var div=document.createElement('div');
div.style.cssText='border:1px solid var(--vm);border-radius:6px;padding:12px;margin-bottom:10px;background:#F9FBE7;';
div.innerHTML='<div style="font-weight:700;color:var(--v3);font-size:13px;">'+r.jnm+'</div>'
+'<div style="font-size:11px;color:#555;margin-top:3px;">Encerrada em: '+(r.dtEnc||'')+(r.hrEnc?' as '+r.hrEnc:'')
+' | Defensor(a): '+(r.def||r.defensor||'')
+' | Atendimentos: '+(r.totalAt||0)+' | Docs: '+(r.totalDocs||0)+'</div>'
+'<div style="margin-top:8px;">'
+'<button class="btn bv bsm" onclick="imprimirRelatorioSalvo('+idx+')">Imprimir Relatório</button>'
+'</div>';
lista.appendChild(div);
});
}

/* ===== ENCERRAR JORNADA ===== */
window.doEncerrar=function(){
var s=prompt('Senha para encerrar jornada:');
if(!s)return;
if(s!==PW){alert('Senha incorreta.');return;}
if(!confirm('Encerrar jornada "'+SS.jnm+'"? O relatório será salvo e os dados desta jornada serão removidos.'))return;
/* Salvar relatorio antes de limpar */
var ats=JSON.parse(localStorage.getItem(kA(SS.jid))||'[]');
var seqFinal=parseInt(localStorage.getItem(kS(SS.jid))||'0',10);
var totalDocs=0;
ats.forEach(function(a){
if(a.ofícios){a.ofícios.forEach(function(of){if(of.titulares)of.titulares.forEach(function(t){totalDocs+=(t.docs?t.docs.length:0);});});}
else if(a.certs){totalDocs+=a.certs.length;}
});
var rl=JSON.parse(localStorage.getItem('dpe_rl')||'[]');
rl.push({
id:Date.now(),
jid:SS.jid,
jnm:SS.jnm,
dtEnc:new Date().toLocaleDateString('pt-BR'),
hrEnc:new Date().toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'}),
def:SS.nm,
un:SS.un,
totalAt:ats.length,
totalDocs:totalDocs,
seqFinal:seqFinal,
ats:ats
});
try{localStorage.setItem('dpe_rl',JSON.stringify(rl));}catch(e){}
/* Gera relatorio na janela */
imprimirRelatorioSalvo(rl.length-1);
/* Limpar dados da jornada */
setTimeout(function(){
localStorage.removeItem(kA(SS.jid));
localStorage.removeItem(kS(SS.jid));
localStorage.removeItem('dpe_ss');
location.reload();
},500);
};

/* ===== IMPRIMIR RELATORIO SALVO ===== */
window.imprimirRelatorioSalvo=function(idx){
var rl=JSON.parse(localStorage.getItem('dpe_rl')||'[]');
var r=rl[idx];if(!r)return;
var ats=r.ats||[];
var janela=window.open('','_blank','width=900,height=700');
if(!janela){alert('Popup bloqueado. Habilite popups para este site e tente novamente. O relatorio esta salvo no Histórico.');return;}
var linhas='';
ats.forEach(function(a,i){
var nomeRaw=a.req?(a.req.nome||a.nome||''):(a.nome||'');
var nome=nomeRaw.replace(/(?:^|[\s\-])\S/g,function(c){return c.toUpperCase();});
var docs='';
if(a.ofícios){
var dd=[];a.ofícios.forEach(function(of){if(of.titulares)of.titulares.forEach(function(t){t.docs.forEach(function(d){dd.push(tlbl(d.tipo));});});});
docs=dd.join('; ');
}else if(a.certs){
docs=(a.certs||[]).map(function(c){return tlbl(c.tipo);}).join('; ');
}
var nos=a.ofícios?(a.ofícios.map(function(o){return o.no?'Ofício '+o.no:'';}).filter(Boolean).join(', ')):'';
linhas+='<tr style="background:'+(i%2===0?'#f9fbf9':'#fff')+';">'
+'<td style="padding:4px 7px;border:1px solid #ddd;">'+(i+1)+'</td>'
+'<td style="padding:4px 7px;border:1px solid #ddd;font-weight:700;">'+nome+'</td>'
+'<td style="padding:4px 7px;border:1px solid #ddd;">'+nos+'</td>'
+'<td style="padding:4px 7px;border:1px solid #ddd;">'+docs+'</td>'
+'</tr>';
});
var logoSrcRel=LB||LURL;
var html='<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8"><title>Relatório - '+r.jnm+'</title>'
+'<style>body{font-family:Arial,sans-serif;font-size:9pt;padding:20px;}@media print{.noprint{display:none;}}</style>'
+'</head>'
+'<body>'
+'<div style="display:flex;align-items:center;gap:14px;border-bottom:3px solid #2E7D32;padding-bottom:10px;margin-bottom:16px;">'
+'<img src="'+logoSrcRel+'" style="width:70px;height:auto;display:block;" alt="DPE-PI">'
+'<div><div style="font-size:14pt;font-weight:700;color:#2E7D32;">Defensoria Pública do Estado do Piauí</div>'
+'<div style="font-size:10pt;color:#43A047;font-weight:700;">Diretoria Itinerante</div></div>'
+'</div>'
+'<div style="font-size:12pt;font-weight:700;color:#1B5E20;margin-bottom:8px;">Relatório de Encerramento de Jornada</div>'
+'<table style="width:100%;border-collapse:collapse;margin-bottom:12px;">'
+'<tr><td style="padding:3px 0;font-size:9pt;"><strong>Jornada:</strong> '+r.jnm+'</td>'
+'<td style="padding:3px 0;font-size:9pt;"><strong>Encerrada em:</strong> '+(r.dtEnc||'')+' as '+(r.hrEnc||'')+'</td></tr>'
+'<tr><td style="padding:3px 0;font-size:9pt;"><strong>Defensor(a):</strong> '+(r.def||r.defensor||'')+'</td>'
+'<td style="padding:3px 0;font-size:9pt;"><strong>Total de atendimentos:</strong> '+(r.totalAt||0)+'</td></tr>'
+'</table>'
+'<table style="width:100%;border-collapse:collapse;font-size:8.5pt;">'
+'<thead><tr style="background:#2E7D32;color:#fff;">'
+'<th style="padding:5px 7px;border:1px solid #1B5E20;text-align:left;width:4%;">#</th>'
+'<th style="padding:5px 7px;border:1px solid #1B5E20;text-align:left;width:30%;">Requerente</th>'
+'<th style="padding:5px 7px;border:1px solid #1B5E20;text-align:left;width:20%;">Ofícios</th>'
+'<th style="padding:5px 7px;border:1px solid #1B5E20;text-align:left;">Documentos</th>'
+'</tr></thead><tbody>'+linhas+'</tbody></table>'
+'<div style="margin-top:50px;text-align:center;">'
+'<div style="border-top:1px solid #000;width:55%;margin:0 auto 4px;"></div>'
+'<div style="font-weight:700;font-size:10pt;">'+(r.def||r.defensor||'')+'</div>'
+'<div style="font-size:9pt;">Defensor(a) Público(a)</div>'
+'</div>'
+'<div style="border-top:1px solid #ccc;margin-top:20px;padding-top:6px;font-size:7.5pt;color:#555;text-align:center;">Relatório gerado pelo Sistema — DPE-PI — Diretoria Itinerante</div>'
+'<div style="text-align:center;margin-top:20px;">'
+'<button onclick="window.print()" style="background:#2E7D32;color:#fff;border:none;padding:10px 28px;border-radius:6px;font-size:13px;font-weight:700;cursor:pointer;">Imprimir Relatório</button>'
+'</div>'
+'</body></html>';
janela.document.write(html);janela.document.close();
};

/* Relatorios na aba busca login */
function carregarRelsLogin(){
var d=document.getElementById('lbRel');if(!d)return;d.innerHTML='';
var rl=JSON.parse(localStorage.getItem('dpe_rl')||'[]');
if(!rl.length){d.innerHTML='<div style="color:#888;font-size:12px;">Nenhum relatório salvo.</div>';return;}
rl.slice().reverse().forEach(function(r,i){
var idx=rl.length-1-i;
var div=document.createElement('div');
div.style.cssText='border:1px solid var(--vm);border-radius:5px;padding:10px;margin-bottom:8px;background:#F9FBE7;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:7px;';
div.innerHTML='<div><div style="font-weight:700;font-size:12px;color:var(--v3);">'+r.jnm+'</div>'
+'<div style="font-size:11px;color:#555;">'+(r.dtEnc||'')+' | '+(r.def||r.defensor||'')+' | '+(r.totalAt||0)+' atend.</div></div>'
+'<button class="btn bv bsm" onclick="imprimirRelatorioSalvo('+idx+')">Imprimir</button>';
d.appendChild(div);
});
}

/* ===== OFICIOS ===== */
function renderOfListaView(){
var d=document.getElementById('ofListaView');if(!d)return;d.innerHTML='';
ofíciosSalvos.forEach(function(of,i){
var div=document.createElement('div');
div.style.cssText='border:1px solid var(--vm);border-radius:6px;padding:12px;margin-bottom:10px;background:#F9FBE7;';
var titResume=of.titulares.map(function(t){var nm=t.nome||'(Próprio Requerente)';var docs=t.docs.map(function(d){return tlbl(d.tipo);}).join(', ');return nm+': '+docs;}).join(' | ');
var noLabel=of.no?' - Ofício '+of.no:'';
div.innerHTML='<div style="display:flex;justify-content:space-between;align-items:flex-start;">'
+'<div><div style="font-weight:700;color:var(--v3);font-size:13px;">Ofício '+(i+1)+noLabel+' - '+of.cartório+', '+of.cidade+'</div>'
+'<div style="font-size:11px;color:#555;margin-top:3px;">'+titResume+'</div></div>'
+'<div style="display:flex;gap:6px;flex-shrink:0;margin-left:10px;">'
+'<button class="btn by bsm" onclick="abrirEditarOfício('+i+')">Editar</button>'
+'<button class="btn bv bsm" onclick="gerarOfícioPDF('+i+')">Imprimir Ofício</button>'
+'<button class="btn br bsm" onclick="removerOfício('+i+')">X</button>'
+'</div></div>';
d.appendChild(div);
});
var ft=document.getElementById('ofFormTit');
if(ft)ft.innerText='Solicitação #'+(ofíciosSalvos.length+1)+' - Novo Ofício';
}

function concluirTitularComDocs(){
if(!titAtual)return true;
if(docsTIT.length===0){alert('Adicione ao menos um documento para este titular.');return false;}
titAtual.docs=JSON.parse(JSON.stringify(docsTIT));
titularesDOF.push(JSON.parse(JSON.stringify(titAtual)));
titAtual=null;docsTIT=[];
return true;
}

var PAR_LABEL={'proprio':null,'filho':'filho(a)','genitor':'pai/mãe','conjuge':'cônjuge/companheiro(a)','irmao':'irmão/irmã','avo':'avô/avó','neto':'neto(a)','tio':'tio(a)','sobrinho':'sobrinho(a)','tutor':'tutelado(a)/curatelado(a)','outro':null};

function parTextoTitular(parKey){if(!parKey||parKey==='proprio'||parKey==='outro')return null;var l=PAR_LABEL[parKey];return l?('é '+l+' do(a) requerente'):null;}

window.onParChange=function(sel){
var v=sel.value;var proprio=(v==='proprio');
var avisoProprio=document.getElementById('tAvisoProprio');
var camposNome=document.getElementById('tCamposNome');
var camposCPF=document.getElementById('tCamposCPFNasc');
if(!v){if(avisoProprio)avisoProprio.style.display='none';if(camposNome)camposNome.style.display='none';if(camposCPF)camposCPF.style.display='none';return;}
if(avisoProprio)avisoProprio.style.display=proprio?'block':'none';
if(camposNome)camposNome.style.display=proprio?'none':'';
if(camposCPF)camposCPF.style.display=proprio?'none':'';
if(proprio){var n=document.getElementById('tNome'),c=document.getElementById('tCPF'),d=document.getElementById('tNasc');if(n)n.value='';if(c)c.value='';if(d)d.value='';}
var btn=document.getElementById('btnDescartarOf');
if(btn)btn.style.display=ofíciosSalvos.length>0?'inline-block':'none';
};

window.salvarTitular=function(){
var par=(document.getElementById('tPar').value||'').trim();
if(!par){alert('Selecione o vínculo do titular com o requerente.');return;}
var proprio=(par==='proprio');
var nome=(document.getElementById('tNome').value||'').trim();
var cpf=(document.getElementById('tCPF').value||'').trim();
var nasc=(document.getElementById('tNasc').value||'').trim();
titAtual={nome:nome,cpf:cpf,nasc:nasc,par:par,proprio:proprio,docs:[]};
docsTIT=[];
document.getElementById('titForm').style.display='none';
document.getElementById('docForm').style.display='block';
document.getElementById('btnNovoTitular').style.display='none';
var nomeExib=proprio?'(Próprio Requerente)':(nome||'(sem nome informado)');
document.getElementById('docFormTit').innerText='Documentos para: '+nomeExib;
document.getElementById('docSalvosList').innerHTML='';
limpDocForm();
};

window.salvarDoc=function(concluir){
var tipo=(document.getElementById('dTipo').value||'').trim();
if(!tipo){alert('Selecione o tipo de documento.');return;}
var doc={tipo:tipo,nr:(document.getElementById('dNR').value||'').trim(),livro:(document.getElementById('dLivro').value||'').trim(),folha:(document.getElementById('dFolha').value||'').trim(),mat:(document.getElementById('dMat').value||'').trim()};
docsTIT.push(doc);
var d=document.getElementById('docSalvosList');
var it=document.createElement('div');it.className='doc-item';
it.innerHTML='<span class="doc-item-txt">'+tlbl(doc.tipo)+(doc.nr?' | Reg.: '+doc.nr:'')+(doc.livro?' | Livro: '+doc.livro:'')+(doc.folha?' | Folha: '+doc.folha:'')+'</span>'
+'<button class="btn br bsm" onclick="removerDoc('+(docsTIT.length-1)+')">X</button>';
d.appendChild(it);
limpDocForm();
if(concluir){if(!concluirTitularComDocs())return;document.getElementById('docForm').style.display='none';document.getElementById('titForm').style.display='none';document.getElementById('btnNovoTitular').style.display='block';renderTitSalvos();}
};

window.removerDoc=function(i){
docsTIT.splice(i,1);
var d=document.getElementById('docSalvosList');d.innerHTML='';
docsTIT.forEach(function(doc,idx){
var it=document.createElement('div');it.className='doc-item';
it.innerHTML='<span class="doc-item-txt">'+tlbl(doc.tipo)+(doc.nr?' | Reg.: '+doc.nr:'')+(doc.livro?' | Livro: '+doc.livro:'')+(doc.folha?' | Folha: '+doc.folha:'')+'</span>'
+'<button class="btn br bsm" onclick="removerDoc('+idx+')">X</button>';
d.appendChild(it);
});
};

function renderTitSalvos(){
var d=document.getElementById('titSalvosList');d.innerHTML='';
titularesDOF.forEach(function(t,i){
var div=document.createElement('div');div.className='titular-bloco';
var docsStr=t.docs.map(function(d){return tlbl(d.tipo);}).join(', ');
var vinculo=t.proprio?'Próprio requerente':(parTextoTitular(t.par)||t.par||'');
div.innerHTML='<div class="titular-header"><span class="titular-title">Titular '+(i+1)+': '+(t.proprio?'(Próprio Requerente)':(t.nome||'(sem nome)'))+(vinculo?' - '+vinculo:'')+'</span>'
+'<button class="btn br bsm" onclick="removerTitular('+i+')">Remover</button></div>'
+'<div style="font-size:12px;color:#555;">Documentos: '+docsStr+'</div>';
d.appendChild(div);
});
}

window.removerTitular=function(i){titularesDOF.splice(i,1);renderTitSalvos();};

window.descartarRascunhoOfício=function(){
if(ofíciosSalvos.length===0){alert('Nenhuma solicitação salva ainda.');return;}
if(!confirm('Descartar os dados nao salvos deste ofício?'))return;
titularesDOF=[];titAtual=null;docsTIT=[];
document.getElementById('ofCartório').value='';document.getElementById('ofCidade').value='';document.getElementById('ofObs').value='';
document.getElementById('titSalvosList').innerHTML='';document.getElementById('docSalvosList').innerHTML='';
limpTitForm();limpDocForm();
document.getElementById('ofForm').style.display='none';
document.getElementById('ofConcluido').style.display='block';
document.getElementById('ofConcluidoMsg').innerText=ofíciosSalvos.length+' solicitação(oes) prontas.';
renderBotoesGerar();
};

window.iniciarNovoTitular=function(){
var nTit=titularesDOF.length+1;
document.getElementById('titFormTit').innerText='Titular #'+nTit;
limpTitForm();
document.getElementById('titForm').style.display='block';
document.getElementById('docForm').style.display='none';
document.getElementById('btnNovoTitular').style.display='none';
};

function limpDocForm(){document.getElementById('dTipo').value='';document.getElementById('dNR').value='';document.getElementById('dLivro').value='';document.getElementById('dFolha').value='';document.getElementById('dMat').value='';}
function limpTitForm(){
var n=document.getElementById('tNome'),c=document.getElementById('tCPF'),d=document.getElementById('tNasc'),p=document.getElementById('tPar');
if(n)n.value='';if(c)c.value='';if(d)d.value='';if(p)p.value='';
var av=document.getElementById('tAvisoProprio'),cn=document.getElementById('tCamposNome'),cc=document.getElementById('tCamposCPFNasc');
if(av)av.style.display='none';if(cn)cn.style.display='none';if(cc)cc.style.display='none';
var bd=document.getElementById('btnDescartarOf');if(bd)bd.style.display=ofíciosSalvos.length>0?'inline-block':'none';
}

window.salvarOfício=function(concluir){
if(titAtual){if(!concluirTitularComDocs())return;}
var cartório=(document.getElementById('ofCartório').value||'').trim();
var cidade=(document.getElementById('ofCidade').value||'').trim();
if(!cartório||!cidade){alert('Informe o Cartório e a Cidade de destino do ofício.');return;}
if(titularesDOF.length===0){alert('Adicione ao menos um titular com documentos neste ofício.');return;}
var obs=(document.getElementById('ofObs').value||'').trim();
var of={cartório:cartório,cidade:cidade,titulares:JSON.parse(JSON.stringify(titularesDOF)),obs:obs};
ofíciosSalvos.push(of);
titularesDOF=[];titAtual=null;docsTIT=[];
document.getElementById('ofCartório').value='';document.getElementById('ofCidade').value='';document.getElementById('ofObs').value='';
document.getElementById('titSalvosList').innerHTML='';document.getElementById('docSalvosList').innerHTML='';
limpTitForm();limpDocForm();
document.getElementById('titForm').style.display='block';document.getElementById('docForm').style.display='none';document.getElementById('btnNovoTitular').style.display='none';
renderOfListaView();
if(concluir){document.getElementById('ofForm').style.display='none';document.getElementById('ofConcluido').style.display='block';document.getElementById('ofConcluidoMsg').innerText=ofíciosSalvos.length+' solicitação(oes) prontas.';renderBotoesGerar();}
else{document.getElementById('ofFormTit').innerText='Solicitação #'+(ofíciosSalvos.length+1)+' - Novo Ofício';}
};

function renderBotoesGerar(){
var botoes=document.getElementById('ofBotoesGerar');botoes.innerHTML='';
var bF=document.createElement('button');bF.className='btn bv';bF.style.cssText='margin-bottom:8px;width:100%;';
bF.innerText='Gerar Ficha + Hipo';bF.onclick=function(){doGerarFicha();};botoes.appendChild(bF);
ofíciosSalvos.forEach(function(of,i){
var b=document.createElement('button');b.className='btn bv';b.style.cssText='width:100%;margin-bottom:8px;';
var noLabel=of.no?(' - Ofício N. '+of.no):'';
b.innerText='Gerar Ofício '+(i+1)+noLabel+' - '+of.cartório;
b.onclick=(function(idx){return function(){gerarOfícioPDF(idx);};})(i);
botoes.appendChild(b);
});
var bT=document.createElement('button');bT.className='btn bo';bT.style.cssText='width:100%;margin-bottom:8px;';
bT.innerText='Salvar Atendimento no Histórico';bT.onclick=function(){salvarAtendimento();};botoes.appendChild(bT);
}

window.reabrirOfícios=function(){
document.getElementById('ofConcluido').style.display='none';
document.getElementById('ofForm').style.display='block';
renderOfListaView();
};

window.removerOfício=function(i){
if(!confirm('Remover este ofício?'))return;
ofíciosSalvos.splice(i,1);
renderOfListaView();
if(ofíciosSalvos.length===0){document.getElementById('ofConcluido').style.display='none';document.getElementById('ofForm').style.display='block';}
else{renderBotoesGerar();}
};

/* ===== GERAR FICHA + HIPO ===== */
window.doGerarFicha=function(){
var nm=(document.getElementById('rN').value||'').trim();
if(!nm){alert('Informe o nome do requerente.');return;}
var cpf=(document.getElementById('rC').value||'').trim();
var dn=(document.getElementById('rD').value||'').trim();
var tel=(document.getElementById('rT').value||'').trim();
var ec=(document.getElementById('rEC').value||'').trim();
var sx=(document.getElementById('rSX').value||'').trim();
var pai=(document.getElementById('rP').value||'').trim();
var mae=(document.getElementById('rM').value||'').trim();
var prof=(document.getElementById('rPr').value||'').trim();
var rnd=(document.getElementById('rR').value||'').trim();
var end=(document.getElementById('rE').value||'').trim();
var cor='';document.querySelectorAll('input[name="cor"]').forEach(function(r){if(r.checked)cor=r.value;});
var acs=[];document.querySelectorAll('input[name="ac"]').forEach(function(c){if(c.checked)acs.push(c.value);});
var ou=(document.getElementById('aOu').value||'').trim();
/* Preencher ficha */
var set=function(id,v){var el=document.getElementById(id);if(el)el.innerText=v;};
set('pRN',nm);set('pRC',cpf);set('pRD',dn);set('pRT',tel);set('pRP',pai);set('pRM',mae);set('pREC',ec);set('pRSX',sx);set('pRPr',prof);set('pRR',rnd);set('pRE',end);
/* Cor */
var pc=document.getElementById('pCor');if(pc){pc.innerHTML='';['Branca','Parda','Preta','Amarela','Indígena','Não Declarar'].forEach(function(c){var f=document.createElement('div');f.className='fo';var chk=document.createElement('span');chk.className='fck';if(c===cor||(!cor&&c==='Não Declarar'))chk.innerHTML='&#10003;';f.appendChild(chk);var t=document.createTextNode(' '+c);f.appendChild(t);pc.appendChild(f);});}
/* Acao */
var pa=document.getElementById('pAc');if(pa){pa.innerHTML='';var acAll=['Documentos','Alimentos','Guarda/Filiação','Criminal','Saúde','Interdição/Curatela','Previdência/INSS','Outras'];acAll.forEach(function(a){var f=document.createElement('div');f.className='fo';var chk=document.createElement('span');chk.className='fck';if(acs.indexOf(a)>=0)chk.innerHTML='&#10003;';f.appendChild(chk);var t=document.createTextNode(' '+a);f.appendChild(t);pa.appendChild(f);});}
var po=document.getElementById('pOu');if(po)po.innerText=(ou&&acs.indexOf('Outras')>=0)?'Outras: '+ou:'';
/* Declaracao Hipo */
var rdVal=rnum(rnd);
var rdExt=rdVal>0?ext(rdVal)+' reais':'nao informada';
var hoje=new Date();var dia=hoje.getDate();var mes=MSA[hoje.getMonth()];var ano=hoje.getFullYear();
var nmCap=ctit(nm.toLowerCase());
var pDecl=document.getElementById('pDecl');
if(pDecl)pDecl.innerHTML='<strong>DECLARO</strong>, para fins de obtenção de <strong>ASSISTÊNCIA JURÍDICA</strong> pela <strong>DEFENSORIA PÚBLICA DO ESTADO DO PIAUÍ</strong>, que sou pessoa pobre na forma da lei, sendo incapaz de contratar advogado particular sem prejudicar o próprio sustento ou de minha família. Trabalho como <strong>'+(prof||'nao informado')+'</strong>, auferindo renda média de <strong>'+rnd+(rdVal>0?' ('+rdExt+')':'')+'</strong>.';
var pNAs=document.getElementById('pNAs');if(pNAs)pNAs.innerText=nmCap;
var pDtF=document.getElementById('pDtF');if(pDtF)pDtF.innerText=SS.un+', '+dia+' de '+mes+' de '+ano+'.';
alogos();
ativarSecao('pF');
window.print();
setTimeout(function(){desativarSecoes();},1000);
};

/* ===== GERAR OFICIO PDF ===== */
window.gerarOfícioPDF=function(idx){
var of=ofíciosSalvos[idx];if(!of)return;
/* Consumir numero se ainda nao tem */
if(!of.no){of.no=fmtNumOfício(consumirSeq());updBdg();}
var nm=(document.getElementById('rN').value||'').trim();
var cpf=(document.getElementById('rC').value||'').trim();
var dn=(document.getElementById('rD').value||'').trim();
var rnd=(document.getElementById('rR').value||'').trim();
var prof=(document.getElementById('rPr').value||'').trim();
var hoje=new Date();var dia=hoje.getDate();var mes=MSA[hoje.getMonth()];var ano=hoje.getFullYear();
var logoSrc=LB||LURL;
var html='<div class="ow">';
html+='<div class="otp"><img class="lgOf" src="'+logoSrc+'" style="width:80px;height:auto;display:block;flex-shrink:0;" alt="DPE-PI"><div class="otx"><div class="ot1">Defensoria Pública do Estado do Piauí</div><div class="ot2">'+SS.un+'</div><div class="ot3">Diretoria Itinerante</div></div></div>';
html+='<div class="onr"><div class="onl">Ofício N. '+of.no+'</div><div class="odt">'+SS.un+', '+dia+' de '+mes+' de '+ano+'</div></div>';
/* Enderecamento */
html+='<div class="ode">Ao(A) Excelentissimo(a) Sr.(a)<br><strong>'+of.cartório+'</strong><br>'+of.cidade+'</div>';
html+='<div class="oas">Assunto: Solicitação de Documentos - Assistencia Juridica Gratuita</div>';
/* Corpo */
var nmFmt=ctit(nm.toLowerCase());
var rdVal=rnum(rnd);var rdExt=rdVal>0?ext(rdVal)+' reais':'';
html+='<div class="op">A Defensoria Pública do Estado do Piauí, no exercicio de suas atribuicoes constitucionais previstas no art. 134 da Constituicao Federal, vem respeitosamente solicitar a V.Sa. a expedição dos documentos abaixo relacionados em favor de <strong>'+nmFmt+'</strong>'+(cpf?', CPF '+cpf:'')+(dn?', nascido(a) em '+dn:'')+'.</div>';
html+='<div class="op">O(A) requerente e pessoa hipossuficiente, na condição de assistido(a) desta Defensoria Pública, fazendo jus à gratuidade nos termos do art. 1.512 do Código Civil e da Lei n. 9.534/1997, que assegura gratuidade no fornecimento de certidões de registro civil.'+(rdVal>0?' Sua renda familiar é de '+rnd+' ('+rdExt+').':'')+'</div>';
/* Documentos */
html+='<div class="ofu"><strong>Documentos solicitados:</strong><ol>';
of.titulares.forEach(function(t){
var titNome=t.proprio?nm:(t.nome||'');
t.docs.forEach(function(d){
var li='<strong>'+tlbl(d.tipo)+'</strong>';
if(titNome)li+=' - Titular: '+titNome;
if(t.nasc||(t.proprio&&dn))li+=' | Nasc.: '+(t.proprio?dn:t.nasc);
var campos=[];
if(d.mat)campos.push('Matricula: '+d.mat);
if(d.nr)campos.push('Registro/Termo: '+d.nr);
if(d.livro)campos.push('Livro: '+d.livro);
if(d.folha)campos.push('Folha: '+d.folha);
if(campos.length)li+=' | '+campos.join(' | ');
if(t.par&&t.par!=='proprio'&&t.par!=='outro')li+=' | Vínculo: '+(PAR_LABEL[t.par]||t.par)+' do(a) requerente';
html+='<li>'+li+'</li>';
});
});
html+='</ol></div>';
if(of.obs)html+='<div class="oob">Observação: '+of.obs+'</div>';
html+='<div class="op">Atenciosamente, aguardamos o retorno de V.Sa. no prazo de 30 (trinta) dias, nos termos da legislação vigente.</div>';
html+='<div class="osn"><div style="height:20px;"></div><div style="font-size:9.5pt;margin-bottom:30px;">'+SS.un+', '+dia+' de '+mes+' de '+ano+'.</div><div class="osl"></div><div class="osn2">'+SS.nm+'</div><div style="font-size:9pt;">Defensor(a) Público(a)</div><div style="font-size:9pt;">'+SS.un+'</div></div>';
html+='<div class="ord">Ofício gerado pelo Sistema DPE-PI - Diretoria Itinerante</div>';
html+='</div>';
var cont=document.getElementById('pOficio');if(cont)cont.innerHTML=html;
alogos();
ativarSecao('pOficio');
window.print();
setTimeout(function(){desativarSecoes();},1000);
};

/* ===== SALVAR ATENDIMENTO NO HISTORICO ===== */
function salvarAtendimento(){
var nm=(document.getElementById('rN').value||'').trim();
if(!nm){alert('Informe o nome do requerente.');return;}
if(ofíciosSalvos.length===0){alert('Nenhum ofício registrado.');return;}
var dn=(document.getElementById('rD').value||'').trim();
var cpf=(document.getElementById('rC').value||'').trim();
var tel=(document.getElementById('rT').value||'').trim();
var sx=(document.getElementById('rSX').value||'').trim();
var at={id:Date.now(),req:{nome:nm,dn:dn,cpf:cpf,tel:tel,sx:sx},ofícios:JSON.parse(JSON.stringify(ofíciosSalvos)),dt:new Date().toLocaleDateString('pt-BR')};
var lista=JSON.parse(localStorage.getItem(kA(SS.jid))||'[]');
lista.push(at);
try{localStorage.setItem(kA(SS.jid),JSON.stringify(lista));}catch(e){alert('Erro ao salvar. localStorage cheio.');}
doLimpar();
alert('Atendimento salvo!');
}

/* ===== HISTORICO DA JORNADA ===== */
function rhist(){
var d=document.getElementById('lHist');if(!d)return;d.innerHTML='';
var lista=JSON.parse(localStorage.getItem(kA(SS.jid))||'[]');
if(!lista.length){d.innerHTML='<div style="color:#888;font-size:13px;">Nenhum atendimento salvo nesta jornada.</div>';return;}
lista.slice().reverse().forEach(function(a,i){
var div=document.createElement('div');div.className='hi';
var nms=a.req?a.req.nome:a.nome;
var nos=(a.ofícios||[]).map(function(o){return o.no?'Ofício '+o.no:'';}).filter(Boolean).join(', ');
div.innerHTML='<div><h3>'+nms+'</h3><p>'+(a.dt||'')+(nos?' | '+nos:'')+'</p></div>'
+'<div style="display:flex;gap:6px;flex-wrap:wrap;">'
+'<button class="btn bv bsm" onclick="verAtend(\''+a.id+'\')">Ver/Imprimir</button>'
+'<button class="btn br bsm" onclick="excluirAtend(\''+a.id+'\')">Excluir</button>'
+'</div>';
d.appendChild(div);
});
}

window.verAtend=function(id){
var lista=JSON.parse(localStorage.getItem(kA(SS.jid))||'[]');
var a=lista.find(function(x){return String(x.id)===String(id);});
if(!a)return;
var req=a.req||{};
var info='Requerente: '+(req.nome||a.nome||'')+'\n'+'Nascimento: '+(req.dn||'')+'\n'+'CPF: '+(req.cpf||'')+'\n'+'Sexo: '+(req.sx||'nao informado')+'\n';
if(a.ofícios&&a.ofícios.length){
info+='Ofícios:\n';
a.ofícios.forEach(function(o){info+='  - '+o.cartório+', '+o.cidade+(o.no?' ('+o.no+')':'')+'\n';});
}
alert(info);
};

window.excluirAtend=function(id){
if(!confirm('Excluir este atendimento do histórico?'))return;
var lista=JSON.parse(localStorage.getItem(kA(SS.jid))||'[]');
lista=lista.filter(function(a){return String(a.id)!==String(id);});
localStorage.setItem(kA(SS.jid),JSON.stringify(lista));
rhist();updBdg();
};

/* ===== LIMPAR FORMULARIO ===== */
window.doLimpar=function(){
if(!confirm('Limpar formulario? Dados salvos no histórico nao serao perdidos.'))return;
['rN','rC','rD','rT','rP','rM','rPr','rR','rE','ofCartório','ofCidade','ofObs','aOu','tNome','tCPF','tNasc','dNR','dLivro','dFolha','dMat'].forEach(function(id){var el=document.getElementById(id);if(el)el.value='';});
document.querySelectorAll('input[name="cor"],input[name="ac"]').forEach(function(i){i.checked=false;});
['rEC','rSX','dTipo','tPar'].forEach(function(id){var el=document.getElementById(id);if(el)el.value='';});
var aOu=document.getElementById('aOu');if(aOu)aOu.style.display='none';
ofíciosSalvos=[];titularesDOF=[];titAtual=null;docsTIT=[];
document.getElementById('ofListaView').innerHTML='';
document.getElementById('titSalvosList').innerHTML='';
document.getElementById('docSalvosList').innerHTML='';
document.getElementById('ofForm').style.display='block';
document.getElementById('ofConcluido').style.display='none';
document.getElementById('ofFormTit').innerText='Solicitação #1 - Novo Ofício';
limpTitForm();limpDocForm();
};

/* ===== FICHA MANUAL ===== */
window.doFichaManual=function(){
ativarSecao('pM');alogos();
window.print();
setTimeout(function(){desativarSecoes();},1000);
};

/* ===== BUSCA GLOBAL ===== */
window.doLbuscar=function(){
var nm=(document.getElementById('lbNm').value||'').trim().toUpperCase();
var cpf=(document.getElementById('lbCP').value||'').replace(/\D/g,'');
if(!nm&&!cpf){document.getElementById('lbInfo').innerText='Informe nome ou CPF para buscar.';return;}
var jj=gJ();var res=[];
jj.forEach(function(j){
var lista=JSON.parse(localStorage.getItem(kA(j.id))||'[]');
lista.forEach(function(a){
var req=a.req||{};var nome=(req.nome||a.nome||'').toUpperCase();var acpf=(req.cpf||'').replace(/\D/g,'');
var ok=true;
if(nm&&nome.indexOf(nm)<0)ok=false;
if(cpf&&acpf.indexOf(cpf)<0)ok=false;
if(ok)res.push({jnm:j.nm,a:a});
});
});
var d=document.getElementById('lbRes');d.innerHTML='';
document.getElementById('lbInfo').innerText='Encontrados: '+res.length+' resultado(s).';
if(!res.length){d.innerHTML='<div style="color:#888;font-size:12px;padding:8px;">Nenhum resultado.</div>';return;}
res.forEach(function(r){
var div=document.createElement('div');
div.style.cssText='border:1px solid var(--vm);border-radius:5px;padding:10px;margin-bottom:8px;background:#F9FBE7;';
var req=r.a.req||{};var nome=req.nome||r.a.nome||'';
var nos=(r.a.ofícios||[]).map(function(o){return o.no||'';}).filter(Boolean).join(', ');
div.innerHTML='<div style="font-weight:700;font-size:13px;color:var(--v3);">'+nome+'</div>'
+'<div style="font-size:11px;color:#555;">'+(r.a.dt||'')+' | '+r.jnm+(nos?' | Ofícios: '+nos:'')+(req.sx?' | Sexo: '+req.sx:'')+'</div>';
d.appendChild(div);
});
};

window.doLlimpar=function(){
document.getElementById('lbNm').value='';document.getElementById('lbCP').value='';
document.getElementById('lbInfo').innerText='';document.getElementById('lbRes').innerHTML='';
};

/* ===== MODAL NOVA JORNADA ===== */
window.abrirModal=function(){
if(!SS||!SS.adm){alert('Apenas o administrador pode criar novas jornadas.');return;}
document.getElementById('mJor').style.display='flex';
rListaJornadas();
};
window.fecharModal=function(){document.getElementById('mJor').style.display='none';};
window.doCriarJ=function(){
var nm=(document.getElementById('nJN').value||'').trim();
if(!nm){alert('Informe um nome para a jornada.');return;}
var jj=gJ();
var id=nm.toLowerCase().replace(/\s+/g,'').replace(/[^a-z0-9]/g,'');
if(jj.find(function(j){return j.id===id;})){alert('Jornada com este nome já existe.');return;}
jj.push({id:id,nm:nm,fix:false,pw:PW,perfil:null});
localStorage.setItem('dpe_j',JSON.stringify(jj));
document.getElementById('nJN').value='';
rListaJornadas();
rjornadas();
};
function rListaJornadas(){
var d=document.getElementById('lJA');if(!d)return;d.innerHTML='';
var jj=gJ();
jj.filter(function(j){return !j.fix;}).forEach(function(j){
var div=document.createElement('div');
div.style.cssText='display:flex;justify-content:space-between;align-items:center;padding:7px;border:1px solid var(--bd);border-radius:5px;margin-bottom:6px;font-size:12px;';
div.innerHTML='<span>'+j.nm+'</span>';
if(SS&&SS.adm){
var btn=document.createElement('button');btn.className='btn br bsm';btn.innerText='Excluir';
btn.onclick=(function(jid){return function(){if(confirm('Excluir jornada "'+jid+'"? Atendimentos associados serão perdidos.')){var jj2=gJ().filter(function(x){return x.id!==jid;});localStorage.setItem('dpe_j',JSON.stringify(jj2));localStorage.removeItem(kA(jid));localStorage.removeItem(kS(jid));rListaJornadas();rjornadas();}};})(j.id);
div.appendChild(btn);
}
d.appendChild(div);
});
}

/* ===== MODAL EDICAO OFICIO ===== */
var meofIdx=-1;
window.abrirEditarOfício=function(i){
meofIdx=i;var of=ofíciosSalvos[i];
document.getElementById('meof-cartorio').value=of.cartório||'';
document.getElementById('meof-cidade').value=of.cidade||'';
document.getElementById('meof-obs').value=of.obs||'';
renderMeofTitulares(of.titulares||[]);
document.getElementById('mEditOf').style.display='flex';
document.getElementById('meof-titulo').innerText='Editar Ofício '+(i+1);
};
window.meofFechar=function(){document.getElementById('mEditOf').style.display='none';meofIdx=-1;};

function renderMeofTitulares(tits){
var d=document.getElementById('meof-titulares-lista');if(!d)return;d.innerHTML='';
tits.forEach(function(t,i){
var div=document.createElement('div');div.className='meof-tit-bloco';
div.innerHTML='<div class="meof-tit-hdr"><span style="font-weight:700;font-size:13px;color:var(--v3);">Titular '+(i+1)+': '+(t.proprio?'Próprio Requerente':(t.nome||'(sem nome)'))+'</span>'
+'<button class="btn br bsm" onclick="meofRemTit('+i+')">Remover</button></div>';
t.docs.forEach(function(d,di){
var it=document.createElement('div');it.className='meof-doc-item';
it.innerHTML='<span>'+tlbl(d.tipo)+(d.nr?' | Reg.: '+d.nr:'')+(d.livro?' | Livro: '+d.livro:'')+(d.folha?' | Folha: '+d.folha:'')+'</span>'
+'<button class="btn br bsm" onclick="meofRemDoc('+i+','+di+')">X</button>';
div.appendChild(it);
});
d.appendChild(div);
});
}

window.meofRemTit=function(i){if(meofIdx<0)return;ofíciosSalvos[meofIdx].titulares.splice(i,1);renderMeofTitulares(ofíciosSalvos[meofIdx].titulares);};
window.meofRemDoc=function(ti,di){if(meofIdx<0)return;ofíciosSalvos[meofIdx].titulares[ti].docs.splice(di,1);renderMeofTitulares(ofíciosSalvos[meofIdx].titulares);};
window.meofNovoTitular=function(){if(meofIdx<0)return;ofíciosSalvos[meofIdx].titulares.push({nome:'(Novo)',proprio:false,par:'outro',docs:[{tipo:'nasc',nr:'',livro:'',folha:'',mat:''}]});renderMeofTitulares(ofíciosSalvos[meofIdx].titulares);};
window.meofSalvar=function(){
if(meofIdx<0)return;
ofíciosSalvos[meofIdx].cartório=document.getElementById('meof-cartorio').value||'';
ofíciosSalvos[meofIdx].cidade=document.getElementById('meof-cidade').value||'';
ofíciosSalvos[meofIdx].obs=document.getElementById('meof-obs').value||'';
meofFechar();renderOfListaView();renderBotoesGerar();
};

window.mcpf=mcpf;
window.mdat=mdat;
window.mtel=mtel;
window.irnd=irnd;
window.mrnd=mrnd;

})();
</script>
</body>
</html>
