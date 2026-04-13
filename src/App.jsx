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
  body *{visibility:hidden;}
  .iprint,.iprint *{visibility:visible;}
  .iprint{position:absolute;left:0;top:0;width:100%;display:block!important;}
  .noprint{display:none!important;}
  @page{margin:1.2cm 1.8cm;size:A4 portrait;}
  .qbra{page-break-after:always;}
  .qbra:last-child{page-break-after:auto;}
}
/* Cartão de ofício no formulário */
.ofcard{border:2px solid var(--vm);border-radius:8px;padding:14px;margin-bottom:12px;background:#fff;}
.ofcard-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;}
.ofcard-title{font-weight:700;color:var(--v3);font-size:14px;}
.ofcard-dest{font-size:12px;color:#555;margin-top:2px;}
.titular-bloco{border:1px solid var(--bd);border-radius:6px;padding:12px;margin-bottom:10px;background:#f9fbf9;}
.titular-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;}
.titular-title{font-weight:700;font-size:13px;color:var(--v3);}
.doc-item{background:#F1F8E9;border:1px solid var(--vm);border-radius:5px;padding:8px 10px;margin-bottom:6px;display:flex;justify-content:space-between;align-items:center;font-size:12px;}
.doc-item-txt{flex:1;}
/* PDF styles */
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
</style>
</head>
<body>

<!-- TELA INICIAL -->
<div id="loginScreen" class="noprint">
<div style="max-width:500px;width:100%;margin:0 auto;padding:20px;">
  <div style="display:flex;border-radius:8px 8px 0 0;overflow:hidden;">
    <div id="ltab1" onclick="ltab('login')" style="flex:1;padding:11px;text-align:center;background:var(--v);color:#fff;font-weight:700;font-size:13px;cursor:pointer;">Entrar no Sistema</div>
    <div id="ltab2" onclick="ltab('busca')" style="flex:1;padding:11px;text-align:center;background:#888;color:#fff;font-weight:700;font-size:13px;cursor:pointer;">Busca de Atendimentos</div>
    <div id="ltab3" onclick="ltab('relatorios')" style="flex:1;padding:11px;text-align:center;background:#888;color:#fff;font-weight:700;font-size:13px;cursor:pointer;">Relatórios</div>
  </div>
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
        <button class="btn bo bsm" onclick="doReabrir()" style="height:38px;">Reabrir</button>
      </div>
      <div style="font-size:11px;color:#888;margin-top:5px;">A numeração retoma de onde parou.</div>
    </div>
  </div>
  <div id="lPanelBusca" style="display:none;background:#fff;padding:22px;border-radius:0 0 8px 8px;box-shadow:0 4px 12px rgba(0,0,0,.12);">
    <div id="lbAuth">
      <div style="background:#fff8e1;border-left:4px solid #f9a825;padding:10px;margin-bottom:12px;font-size:12px;color:#5d4037;border-radius:0 4px 4px 0;">Acesso restrito. Informe a senha para buscar em todas as jornadas.</div>
      <div style="display:flex;gap:8px;align-items:flex-end;">
        <div class="fg"><label>Senha:</label><input type="password" id="lbSe" onkeydown="if(event.key==='Enter')doAutBusca()"></div>
        <button class="btn bv" style="height:38px;" onclick="doAutBusca()">Acessar</button>
      </div>
      <div class="errmsg" id="lbErr">Senha incorreta.</div>
    </div>
    <div id="lbPain" style="display:none;">
      <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:12px;align-items:flex-end;">
        <div class="fg"><label>Nome:</label><input type="text" id="lbNm" placeholder="Requerente ou titular..." oninput="this.value=this.value.toUpperCase()" onkeydown="if(event.key==='Enter')doLbuscar()"></div>
        <div class="fg" style="max-width:190px;"><label>CPF:</label><input type="text" id="lbCP" placeholder="000.000.000-00" maxlength="14" oninput="mcpf(this)" onkeydown="if(event.key==='Enter')doLbuscar()"></div>
        <button class="btn bv" style="height:38px;padding:0 18px;" onclick="doLbuscar()">Buscar</button>
        <button class="btn bo" style="height:38px;padding:0 12px;" onclick="doLlimpar()">Limpar</button>
      </div>
      <div id="lbInfo" style="font-size:12px;color:#666;margin-bottom:8px;"></div>
      <div id="lbRes" style="max-height:350px;overflow-y:auto;"></div>
    </div>
  </div>

  <!-- PAINEL RELATÓRIOS -->
  <div id="lPanelRel" style="display:none;background:#fff;padding:22px;border-radius:0 0 8px 8px;box-shadow:0 4px 12px rgba(0,0,0,.12);">
    <div id="lrAuth">
      <div style="background:#fff8e1;border-left:4px solid #f9a825;padding:10px;margin-bottom:12px;font-size:12px;color:#5d4037;border-radius:0 4px 4px 0;">Acesso restrito. Informe a senha para visualizar os relatórios.</div>
      <div style="display:flex;gap:8px;align-items:flex-end;">
        <div class="fg"><label>Senha:</label><input type="password" id="lrSe" onkeydown="if(event.key==='Enter')doAutRel()"></div>
        <button class="btn bv" style="height:38px;" onclick="doAutRel()">Acessar</button>
      </div>
      <div class="errmsg" id="lrErr">Senha incorreta.</div>
    </div>
    <div id="lrPain" style="display:none;">
      <div style="font-weight:700;font-size:13px;color:var(--v3);margin-bottom:10px;">Relatórios de Jornadas Encerradas</div>
      <div id="lrLista"></div>
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
      <div class="badge" id="bdg">Próximo Ofício: 001</div>
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

    <!-- ETAPA 1: REQUERENTE -->
    <div class="card" id="secRequerente">
      <h2>1. Dados do(a) Requerente</h2>
      <div style="background:var(--vc);border-left:4px solid var(--v);padding:9px 12px;margin-bottom:14px;font-size:12px;color:var(--v3);border-radius:0 4px 4px 0;">
        Estes dados definem o requerente de todos os ofícios deste atendimento e compõem a Ficha + Declaração de Hipossuficiência.
      </div>
      <div class="row">
        <div class="fg" style="flex:3;"><label>Nome Completo:</label><input id="rN" type="text" oninput="this.value=this.value.toUpperCase()"></div>
        <div class="fg"><label>CPF:</label><input id="rC" type="text" maxlength="14" placeholder="000.000.000-00" oninput="mcpf(this)"></div>
      </div>
      <div class="row">
        <div class="fg"><label>Data de Nascimento:</label><input id="rD" type="text" maxlength="10" placeholder="DD/MM/AAAA" oninput="mdat(this)"></div>
        <div class="fg"><label>Telefone:</label><input id="rT" type="text" maxlength="15" placeholder="(00) 00000-0000" oninput="mtel(this)"></div>
        <div class="fg"><label>Estado Civil:</label><select id="rEC"><option value="">-</option><option>Solteiro(a)</option><option>Casado(a)</option><option>Divorciado(a)</option><option>Viúvo(a)</option><option>União Estável</option></select></div>
        <div class="fg"><label>Sexo:</label><select id="rSexo"><option value="">-</option><option>Masculino</option><option>Feminino</option><option>Não-binário</option><option>Não declarado</option></select></div>
      </div>
      <div class="row">
        <div class="fg"><label>Nome do Pai:</label><input id="rP" type="text" oninput="this.value=this.value.toUpperCase()"></div>
        <div class="fg"><label>Nome da Mãe:</label><input id="rM" type="text" oninput="this.value=this.value.toUpperCase()"></div>
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
        <button class="btn bv" onclick="doGerarFicha()">📋 Gerar / Reimprimir Ficha + Hipo</button>
      </div>
    </div>

    <!-- ETAPA 2: OFÍCIOS -->
    <div class="card">
      <h2>2. Solicitações de Ofício</h2>
      <div style="background:#fff8e1;border-left:4px solid #f9a825;padding:9px 12px;margin-bottom:14px;font-size:12px;color:#5d4037;border-radius:0 4px 4px 0;">
        Cada Solicitação = 1 Ofício = 1 Cartório de destino. Adicione quantas solicitações precisar. Cada uma gera um ofício numerado individualmente.
      </div>

      <!-- Lista de ofícios já criados -->
      <div id="ofListaView"></div>

      <!-- Formulário de nova solicitação / ofício em construção -->
      <div id="ofForm">
        <div style="border:2px solid var(--v);border-radius:8px;padding:16px;background:#F9FBE7;">
          <div style="font-weight:700;font-size:14px;color:var(--v3);margin-bottom:12px;" id="ofFormTit">Solicitação #1 — Novo Ofício</div>

          <!-- DESTINO DO OFÍCIO -->
          <div style="background:#E8F5E9;border-radius:6px;padding:12px;margin-bottom:14px;">
            <div style="font-weight:700;font-size:13px;color:var(--v3);margin-bottom:8px;">Destino do Ofício</div>
            <div class="row" style="margin-bottom:0;">
              <div class="fg" style="flex:2;"><label>Cartório / Ofício:</label><input id="ofCartorio" type="text" placeholder="Ex: 1º Ofício de Registro Civil" oninput="this.value=ctit(this.value)"></div>
              <div class="fg"><label>Cidade / Comarca:</label><input id="ofCidade" type="text" placeholder="Ex: Canto do Buriti/PI" oninput="this.value=ctit(this.value)"></div>
            </div>
          </div>

          <!-- TITULARES E DOCUMENTOS -->
          <div id="titularesBloco">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
              <div style="font-weight:700;font-size:13px;color:var(--v3);">Titulares e Documentos</div>
            </div>
            <!-- Titulares salvos neste ofício em construção -->
            <div id="titSalvosList"></div>

            <!-- Formulário do titular atual -->
            <div id="titForm" style="border:1px solid var(--bd);border-radius:6px;padding:12px;background:#fff;margin-bottom:10px;">
              <div style="font-weight:700;font-size:13px;color:var(--v3);margin-bottom:8px;" id="titFormTit">Titular #1</div>
              <div class="row">
                <div class="fg" style="flex:3;"><label>Nome do Titular:</label><input id="tNome" type="text" placeholder="Em branco se for o próprio requerente" oninput="this.value=this.value.toUpperCase()"></div>
                <div class="fg"><label>CPF do Titular:</label><input id="tCPF" type="text" maxlength="14" placeholder="000.000.000-00" oninput="mcpf(this)"></div>
              </div>
              <div class="row">
                <div class="fg"><label>Data de Nascimento:</label><input id="tNasc" type="text" maxlength="10" placeholder="DD/MM/AAAA" oninput="mdat(this)"></div>
                <div class="fg"><label>Parentesco do Req. com Titular:</label>
                  <select id="tPar">
                    <option value="">-</option>
                    <option>Próprio(a)</option><option>Genitor(a)</option><option>Avô/Avó</option>
                    <option>Esposo(a)</option><option>Tio(a)</option><option>Tutor(a)/Curador(a)</option>
                    <option>Filho(a)</option><option>Convivente</option><option>Outro(a)</option>
                  </select>
                </div>
              </div>
              <div style="text-align:right;margin-top:6px;">
                <button class="btn bv bsm" onclick="salvarTitular()">Salvar dados do titular →</button>
              </div>
            </div>

            <!-- Documentos do titular salvo (aparece após salvar titular) -->
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
                  <button class="btn bv bsm" onclick="salvarDoc(false)">+ Salvar e adicionar outro documento para este titular</button>
                  <button class="btn bo bsm" onclick="salvarDoc(true)">✓ Concluir documentos deste titular</button>
                </div>
              </div>
            </div>

            <!-- Botão novo titular (aparece após concluir titular) -->
            <div id="btnNovoTitular" style="display:none;margin-bottom:10px;">
              <button class="btn by bsm" onclick="iniciarNovoTitular()">+ Adicionar outro titular neste ofício</button>
            </div>
          </div>

          <!-- Observação -->
          <div class="fg" style="margin-bottom:12px;">
            <label>Observação para este Ofício (opcional):</label>
            <textarea id="ofObs" rows="2" style="width:100%;padding:7px 9px;border:1px solid var(--bd);border-radius:5px;font-size:13px;" placeholder="Ex: Pedido também encaminhado pelo CRC JUD..."></textarea>
          </div>

          <div style="display:flex;gap:10px;flex-wrap:wrap;">
            <button class="btn bv" onclick="salvarOficio(false)">💾 Salvar Solicitação e criar nova</button>
            <button class="btn bo" onclick="salvarOficio(true)">✅ Salvar e concluir todas as solicitações</button>
          </div>
        </div>
      </div>

      <!-- Área de geração após concluir -->
      <div id="ofConcluido" style="display:none;padding:16px;background:var(--vc);border-radius:8px;border:1px solid var(--vm);">
        <div style="font-weight:700;color:var(--v3);margin-bottom:12px;" id="ofConcluidoMsg"></div>
        <div id="ofBotoesGerar"></div>
        <div style="margin-top:10px;">
          <button class="btn bo bsm" onclick="reabrirOficios()">✏️ Editar solicitações</button>
        </div>
      </div>
    </div>

    <div style="text-align:center;padding-top:8px;padding-bottom:20px;">
      <button class="btn bo bsm" onclick="doLimpar()">🔄 Novo Atendimento (limpar tudo)</button>
    </div>
  </div>

  <!-- ABA HISTÓRICO -->
  <div id="abaH" style="display:none;"><div class="card"><h2>Histórico da Jornada</h2><div id="lHist"></div></div></div>
</div>
</div>

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

<!-- BOTÃO FICHA MANUAL -->
<div class="noprint" style="position:fixed;bottom:18px;right:18px;z-index:998;">
  <button onclick="doFichaManual()" style="background:#1B5E20;color:#fff;border:none;border-radius:8px;padding:10px 14px;font-size:11px;font-weight:700;cursor:pointer;box-shadow:0 3px 10px rgba(0,0,0,.25);line-height:1.3;text-align:center;">Ficha Manual<br>(caneta)</button>
</div>

<!-- ÁREA DE IMPRESSÃO -->
<div class="iprint">
  <!-- FICHA + HIPO -->
  <div id="pF" class="qbra">
  <div class="fw">
    <div class="ftp">
      <img id="lgF" alt="DPE-PI" style="width:80px;height:auto;display:block;flex-shrink:0;">
      <div class="ftx">
        <div class="ft1">Ficha de Atendimento</div>
        <div class="ft2">Defensoria Pública do Estado do Piauí</div>
        <div class="ft3">Diretoria Itinerante</div>
        <div class="ft4">Uso exclusivo do serviço · Tratamento sigiloso</div>
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
      <div class="dp">Outrossim, declaro estar ciente de que a prestação de informações falsas perante funcionário público poderá tipificar o crime de falsidade ideológica, previsto no art. 299 do Código Penal Brasileiro, cuja pena é de reclusão de 1 a 5 anos e multa.</div>
      <div class="dp"><strong>AUTORIZAÇÃO LGPD</strong> — Conforme a Lei n.º 13.709/2018, AUTORIZO a Defensoria Pública do Estado do Piauí a incluir meus dados pessoais nas peças processuais relacionadas à assistência jurídica prestada, para fins exclusivamente legais e processuais.</div>
      <div class="das"><div style="height:28px;"></div><div class="dln"></div><div style="font-size:8pt;margin-top:2px;" id="pNAs"></div><div style="font-size:7.5pt;color:#555;">Requerente</div></div>
      <div style="text-align:right;margin-top:5px;font-size:7.5pt;" id="pDtF"></div>
    </div>
  </div>
  </div>
  <!-- OFÍCIOS (gerados dinamicamente) -->
  <div id="pOficios"></div>
  <!-- FICHA MANUAL -->
  <div id="pM" style="display:none;" class="qbra">
  <div style="font-family:Arial,sans-serif;font-size:8.5pt;">
    <div style="display:flex;align-items:center;gap:14px;border-bottom:3px solid #4CAF50;padding-bottom:10px;margin-bottom:10px;">
      <img id="lgM" alt="DPE-PI" style="width:80px;height:auto;display:block;flex-shrink:0;">
      <div style="flex:1;text-align:center;">
        <div style="color:#2E7D32;font-size:12pt;font-weight:700;text-transform:uppercase;">Ficha de Atendimento</div>
        <div style="color:#43A047;font-size:8.5pt;font-weight:700;margin-top:2px;">Defensoria Pública do Estado do Piauí</div>
        <div style="color:#66BB6A;font-size:7.5pt;">Diretoria Itinerante</div>
        <div style="color:#888;font-size:7pt;margin-top:1px;">Uso exclusivo do serviço · Tratamento sigiloso</div>
      </div>
    </div>
    <div style="background:#43A047;color:#fff;padding:2px 7px;font-size:7.5pt;font-weight:700;text-transform:uppercase;border-radius:2px;margin-bottom:6px;">Identificação do(a) Requerente</div>
    <div style="margin-bottom:7px;"><div style="font-size:7pt;font-weight:700;text-transform:uppercase;color:#2E7D32;margin-bottom:1px;">Nome Completo:</div><div style="border-bottom:1px solid #aaa;min-height:20px;"></div></div>
    <div style="display:flex;gap:10px;margin-bottom:7px;">
      <div style="flex:1;"><div style="font-size:7pt;font-weight:700;text-transform:uppercase;color:#2E7D32;margin-bottom:1px;">CPF:</div><div style="border-bottom:1px solid #aaa;min-height:20px;"></div></div>
      <div style="flex:1;"><div style="font-size:7pt;font-weight:700;text-transform:uppercase;color:#2E7D32;margin-bottom:1px;">Data de Nascimento:</div><div style="border-bottom:1px solid #aaa;min-height:20px;"></div></div>
      <div style="flex:1;"><div style="font-size:7pt;font-weight:700;text-transform:uppercase;color:#2E7D32;margin-bottom:1px;">Telefone:</div><div style="border-bottom:1px solid #aaa;min-height:20px;"></div></div>
    </div>
    <div style="display:flex;gap:10px;margin-bottom:7px;">
      <div style="flex:1;"><div style="font-size:7pt;font-weight:700;text-transform:uppercase;color:#2E7D32;margin-bottom:1px;">Nome do Pai:</div><div style="border-bottom:1px solid #aaa;min-height:20px;"></div></div>
      <div style="flex:1;"><div style="font-size:7pt;font-weight:700;text-transform:uppercase;color:#2E7D32;margin-bottom:1px;">Nome da Mãe:</div><div style="border-bottom:1px solid #aaa;min-height:20px;"></div></div>
    </div>
    <div style="display:flex;gap:10px;margin-bottom:7px;">
      <div style="flex:1;"><div style="font-size:7pt;font-weight:700;text-transform:uppercase;color:#2E7D32;margin-bottom:1px;">Estado Civil:</div><div style="border-bottom:1px solid #aaa;min-height:20px;"></div></div>
      <div style="flex:1;"><div style="font-size:7pt;font-weight:700;text-transform:uppercase;color:#2E7D32;margin-bottom:1px;">Profissão:</div><div style="border-bottom:1px solid #aaa;min-height:20px;"></div></div>
      <div style="flex:1;"><div style="font-size:7pt;font-weight:700;text-transform:uppercase;color:#2E7D32;margin-bottom:1px;">Renda Familiar:</div><div style="border-bottom:1px solid #aaa;min-height:20px;"></div></div>
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
    <div style="margin-bottom:8px;background:#F1F8E9;border:1px solid #A5D6A7;border-radius:3px;padding:6px 8px;">
      <div style="background:#2E7D32;color:#fff;padding:2px 6px;font-size:7pt;font-weight:700;text-transform:uppercase;border-radius:2px;margin-bottom:4px;">Tipo de Certidão Solicitada</div>
      <div style="display:flex;flex-wrap:wrap;gap:8px;">
        <span style="display:flex;align-items:center;gap:2px;font-size:7.5pt;"><span style="width:8px;height:8px;border:1.5px solid #43A047;display:inline-block;"></span> 2ª Via Certidão de Nascimento</span>
        <span style="display:flex;align-items:center;gap:2px;font-size:7.5pt;"><span style="width:8px;height:8px;border:1.5px solid #43A047;display:inline-block;"></span> 2ª Via Certidão de Casamento</span>
        <span style="display:flex;align-items:center;gap:2px;font-size:7.5pt;"><span style="width:8px;height:8px;border:1.5px solid #43A047;display:inline-block;"></span> 2ª Via Certidão de Óbito</span>
        <span style="display:flex;align-items:center;gap:2px;font-size:7.5pt;"><span style="width:8px;height:8px;border:1.5px solid #43A047;display:inline-block;"></span> Certidão de Inteiro Teor</span>
      </div>
    </div>
    <div style="padding:8px;border:1.5px solid #66BB6A;font-size:7.5pt;line-height:1.35;text-align:justify;background:#fafff8;">
      <div style="font-weight:700;text-transform:uppercase;text-align:center;margin-bottom:6px;font-size:8.5pt;color:#2E7D32;">Declaração de Hipossuficiência</div>
      <div style="margin-bottom:6px;"><strong>DECLARO</strong>, para fins de obtenção de <strong>ASSISTÊNCIA JURÍDICA</strong> pela <strong>DEFENSORIA PÚBLICA DO ESTADO DO PIAUÍ</strong>, que sou pessoa pobre na forma da lei. O(A) Requerente atua como <span style="border-bottom:1px solid #555;display:inline-block;width:110px;vertical-align:bottom;">&nbsp;</span>, auferindo renda média de R$<span style="border-bottom:1px solid #555;display:inline-block;width:130px;vertical-align:bottom;">&nbsp;</span>.</div>
      <div style="margin-bottom:6px;">Outrossim, declaro estar ciente que informações falsas poderão tipificar o crime de falsidade ideológica (art. 299 CP).</div>
      <div style="margin-bottom:6px;"><strong>AUTORIZAÇÃO LGPD</strong> — Autorizo a DPE-PI a incluir meus dados pessoais nas peças processuais para fins exclusivamente legais.</div>
      <div style="margin-top:28px;text-align:center;"><div style="border-top:1px solid #000;width:58%;margin:0 auto 3px;"></div><div style="font-size:7.5pt;color:#555;">Assinatura do(a) Requerente</div></div>
      <div style="text-align:right;margin-top:8px;font-size:7.5pt;"><span style="border-bottom:1px dotted #555;display:inline-block;width:110px;">&nbsp;</span>, <span style="border-bottom:1px dotted #555;display:inline-block;width:16px;">&nbsp;</span> de <span style="border-bottom:1px dotted #555;display:inline-block;width:70px;">&nbsp;</span> de <span style="border-bottom:1px dotted #555;display:inline-block;width:34px;">&nbsp;</span>.</div>
      <div style="margin-top:10px;border-top:1px dashed #66BB6A;padding-top:7px;">
        <div style="background:#2E7D32;color:#fff;padding:2px 6px;font-size:7pt;font-weight:700;text-transform:uppercase;border-radius:2px;margin-bottom:6px;display:inline-block;">Dados do Registro Civil — preenchimento posterior</div>
        <div style="margin-bottom:6px;"><div style="font-size:7pt;font-weight:700;text-transform:uppercase;color:#2E7D32;margin-bottom:1px;">Titular:</div><div style="border-bottom:1px solid #aaa;min-height:17px;"></div></div>
        <div style="display:flex;gap:8px;margin-bottom:6px;">
          <div style="flex:1;"><div style="font-size:7pt;font-weight:700;text-transform:uppercase;color:#2E7D32;margin-bottom:1px;">CPF:</div><div style="border-bottom:1px solid #aaa;min-height:17px;"></div></div>
          <div style="flex:1;"><div style="font-size:7pt;font-weight:700;text-transform:uppercase;color:#2E7D32;margin-bottom:1px;">Data Nasc.:</div><div style="border-bottom:1px solid #aaa;min-height:17px;"></div></div>
          <div style="flex:1;"><div style="font-size:7pt;font-weight:700;text-transform:uppercase;color:#2E7D32;margin-bottom:1px;">Parentesco:</div><div style="border-bottom:1px solid #aaa;min-height:17px;"></div></div>
        </div>
        <div style="display:flex;gap:8px;margin-bottom:6px;">
          <div style="flex:2;"><div style="font-size:7pt;font-weight:700;text-transform:uppercase;color:#2E7D32;margin-bottom:1px;">Cartório / Ofício:</div><div style="border-bottom:1px solid #aaa;min-height:17px;"></div></div>
          <div style="flex:1;"><div style="font-size:7pt;font-weight:700;text-transform:uppercase;color:#2E7D32;margin-bottom:1px;">Cidade / Comarca:</div><div style="border-bottom:1px solid #aaa;min-height:17px;"></div></div>
        </div>
        <div style="display:flex;gap:8px;">
          <div style="flex:2;"><div style="font-size:7pt;font-weight:700;text-transform:uppercase;color:#2E7D32;margin-bottom:1px;">N.º Registro / Termo:</div><div style="border-bottom:1px solid #aaa;min-height:17px;"></div></div>
          <div style="flex:1;"><div style="font-size:7pt;font-weight:700;text-transform:uppercase;color:#2E7D32;margin-bottom:1px;">Livro:</div><div style="border-bottom:1px solid #aaa;min-height:17px;"></div></div>
          <div style="flex:1;"><div style="font-size:7pt;font-weight:700;text-transform:uppercase;color:#2E7D32;margin-bottom:1px;">Folha:</div><div style="border-bottom:1px solid #aaa;min-height:17px;"></div></div>
        </div>
      </div>
    </div>
  </div>
  </div>
</div>

<script>
(function(){
var PW='DITI2027';
var LURL='https://raw.githubusercontent.com/dpepigpt-glitch/rr/main/logo-dpe.png';
var LB='';
var MSS=['janeiro','fevereiro','março','abril','maio','junho','julho','agosto','setembro','outubro','novembro','dezembro'];
var PF=[
  {id:'robert',nm:'Dr. Robert Rios Júnior',un:'2ª Defensoria Pública Itinerante',adm:true},
  {id:'adriano',nm:'Dr. Adriano Moreti Batista',un:'1ª Defensoria Pública Itinerante',adm:false},
  {id:'alessandro',nm:'Dr. Alessandro Andrade Spíndola',un:'Diretor da Defensoria Itinerante',adm:false}
];
var JD=[
  {id:'cantodoburiti',nm:'Jornada de Canto do Buriti',fix:false,pw:PW,perfil:null},
  {id:'saojosedopeixe',nm:'Jornada de São José do Peixe',fix:false,pw:PW,perfil:null},
  {id:'def1',nm:'1ª Defensoria Pública Itinerante',fix:true,pw:'MO2027',perfil:'adriano'},
  {id:'def2',nm:'2ª Defensoria Pública Itinerante',fix:true,pw:'RR2027',perfil:'robert'}
];

/* Estado do atendimento atual */
var SS=null;           /* sessão */
var CA=null;           /* atendimento atual (salvo) */
var oficiosSalvos=[];  /* lista de ofícios finalizados neste atendimento */
var titularesDOF=[];   /* titulares do ofício em construção */
var docsTIT=[];        /* docs do titular em construção */
var titAtual=null;     /* titular já salvo mas aguardando docs */
var LBAU=false;

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
  var u=['zero','um','dois','três','quatro','cinco','seis','sete','oito','nove','dez','onze','doze','treze','quatorze','quinze','dezesseis','dezessete','dezoito','dezenove'];
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
function proxSeq(){return parseInt(localStorage.getItem(kS(SS.jid))||'0',10)+1;}
function consumirSeq(){var n=proxSeq();localStorage.setItem(kS(SS.jid),String(n));return n;}
function fmtNum(n){var s=String(n);while(s.length<3)s='0'+s;return s;}

/* ===== LOGO ===== */
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
  window.addEventListener('beforeprint',alogos);
  rperfis();rjornadas();carregarRlSel();
  try{var s=JSON.parse(localStorage.getItem('dpe_ss')||'null');if(s&&s.pid){var jj2=gJ();var j2=jj2.find(function(j){return j.id===s.jid;});if(j2){s.jnm=j2.nm;if(j2.fix)s.un=j2.nm;}SS=s;init();}}catch(e){}
  var a8=document.getElementById('a8');if(a8)a8.addEventListener('change',function(){var el=document.getElementById('aOu');if(el)el.style.display=this.checked?'block':'none';});
};

/* ===== LOGIN ===== */
window.ltab=function(t){
  document.getElementById('ltab1').style.background=t==='login'?'var(--v)':'#888';
  document.getElementById('ltab2').style.background=t==='busca'?'var(--v)':'#888';
  document.getElementById('lPanelLogin').style.display=t==='login'?'block':'none';
  document.getElementById('lPanelBusca').style.display=t==='busca'?'block':'none';
  if(t==='busca')carregarRelsLogin();
};
function rperfis(){var c=document.getElementById('pcards');if(!c)return;c.innerHTML='';PF.forEach(function(p){var d=document.createElement('div');d.className='pcard';d.id='pc_'+p.id;d.innerHTML='<span style="font-size:22px;">👤</span><div><div style="font-weight:700;font-size:13px;color:var(--v3);">'+p.nm+(p.adm?' ★':'')+'</div><div style="font-size:11px;color:#666;">'+p.un+'</div></div>';d.onclick=function(){document.querySelectorAll('.pcard').forEach(function(x){x.classList.remove('sel');});d.classList.add('sel');};c.appendChild(d);});}
function rjornadas(){var sel=document.getElementById('lgJ');if(!sel)return;var jj=gJ();sel.innerHTML='<option value="">Selecione...</option>';var campo=jj.filter(function(j){return !j.fix;}),fixas=jj.filter(function(j){return j.fix;});if(campo.length){var g1=document.createElement('optgroup');g1.label='Jornadas Itinerantes';campo.forEach(function(j){var o=document.createElement('option');o.value=j.id;o.textContent=j.nm;g1.appendChild(o);});sel.appendChild(g1);}if(fixas.length){var g2=document.createElement('optgroup');g2.label='Defensorias (atendimento diário)';fixas.forEach(function(j){var o=document.createElement('option');o.value=j.id;o.textContent=j.nm;g2.appendChild(o);});sel.appendChild(g2);}}
window.doLogin=function(){
  var sel=document.querySelector('.pcard.sel');if(!sel){mostrarErro('Selecione um perfil.');return;}
  var pid=sel.id.replace('pc_','');var pf=PF.find(function(p){return p.id===pid;});
  var jid=document.getElementById('lgJ').value;var pw=document.getElementById('lgS').value;
  if(!jid||!pw){mostrarErro('Preencha todos os campos.');return;}
  var jj=gJ();var jorn=jj.find(function(j){return j.id===jid;});if(!jorn){mostrarErro('Jornada não encontrada.');return;}
  if(pw!==(jorn.pw||PW)){mostrarErro('Senha incorreta.');return;}
  if(jorn.fix&&jorn.perfil&&pid!==jorn.perfil){mostrarErro('Este perfil não tem acesso a esta defensoria.');return;}
  limparErro();
  SS={pid:pid,nm:pf.nm,un:jorn.fix?jorn.nm:pf.un,adm:pf.adm,jid:jid,jnm:jorn.nm};
  try{localStorage.setItem('dpe_ss',JSON.stringify(SS));}catch(e){}
  init();
};
function mostrarErro(m){var el=document.getElementById('lerr');el.innerText=m;el.style.display='block';}
function limparErro(){document.getElementById('lerr').style.display='none';}
window.doReabrir=function(){
  var sel=document.getElementById('rlSel');if(!sel||!sel.value){alert('Selecione uma jornada encerrada.');return;}
  var pw=document.getElementById('lgS').value;var parts=sel.value.split('|');var jid=parts[0];
  var jj=gJ();var jorn=jj.find(function(j){return j.id===jid;});if(!jorn){alert('Jornada não encontrada.');return;}
  if(pw!==(jorn.pw||PW)){alert('Senha incorreta.');return;}
  var sel2=document.querySelector('.pcard.sel');if(!sel2){alert('Selecione um perfil.');return;}
  var pid=sel2.id.replace('pc_','');var pf=PF.find(function(p){return p.id===pid;});
  if(jorn.fix&&jorn.perfil&&pid!==jorn.perfil){alert('Este perfil não tem acesso a esta defensoria.');return;}
  SS={pid:pid,nm:pf.nm,un:jorn.fix?jorn.nm:pf.un,adm:pf.adm,jid:jid,jnm:jorn.nm};
  try{localStorage.setItem('dpe_ss',JSON.stringify(SS));}catch(e){}
  var rl=JSON.parse(localStorage.getItem('dpe_rl')||'[]');var relJ=rl.filter(function(r){return r.jid===jid;});
  if(relJ.length){var ult=relJ[relJ.length-1];var ex=JSON.parse(localStorage.getItem(kA(jid))||'[]');if(!ex.length&&ult.ats&&ult.ats.length){localStorage.setItem(kA(jid),JSON.stringify(ult.ats));localStorage.setItem(kS(jid),String(ult.seqFinal||0));}}
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
function updBdg(){var n=fmtNum(proxSeq());document.getElementById('bdg').innerText='Próximo Ofício: '+n;}

/* ===== ABAS ===== */
window.aba=function(nm){
  ['abaN','abaH'].forEach(function(id){var el=document.getElementById(id);if(el)el.style.display='none';});
  ['tN','tH'].forEach(function(id){var el=document.getElementById(id);if(el)el.classList.remove('on');});
  var ae=document.getElementById(nm==='n'?'abaN':'abaH'),te=document.getElementById(nm==='n'?'tN':'tH');
  if(ae)ae.style.display='block';if(te)te.classList.add('on');
  document.getElementById('titPag').innerText=nm==='n'?'Atendimento':'Histórico';
  if(nm==='h')rhist();
};

/* ===== OFÍCIOS — lógica principal ===== */

/* Renderiza a lista de ofícios já salvos neste atendimento */
function renderOfListaView(){
  var d=document.getElementById('ofListaView');if(!d)return;d.innerHTML='';
  oficiosSalvos.forEach(function(of,i){
    var div=document.createElement('div');
    div.style.cssText='border:1px solid var(--vm);border-radius:6px;padding:12px;margin-bottom:10px;background:#F9FBE7;';
    var titResume=of.titulares.map(function(t){
      var nm=t.nome||'(Próprio Requerente)';
      var docs=t.docs.map(function(d){return tlbl(d.tipo);}).join(', ');
      return nm+': '+docs;
    }).join(' | ');
    div.innerHTML='<div style="display:flex;justify-content:space-between;align-items:flex-start;">'
      +'<div><div style="font-weight:700;color:var(--v3);font-size:13px;">Ofício '+(i+1)+' — '+of.cartorio+', '+of.cidade+'</div>'
      +'<div style="font-size:11px;color:#555;margin-top:3px;">'+titResume+'</div></div>'
      +'<div style="display:flex;gap:6px;flex-shrink:0;margin-left:10px;">'
      +'<button class="btn bv bsm" onclick="gerarOficioPDF('+i+')">🖨 Gerar Ofício</button>'
      +'<button class="btn br bsm" onclick="removerOficio('+i+')">✕</button>'
      +'</div></div>';
    d.appendChild(div);
  });
  var ft=document.getElementById('ofFormTit');
  if(ft)ft.innerText='Solicitação #'+(oficiosSalvos.length+1)+' — Novo Ofício';
}

/* Salvar titular atual com seus docs e adicioná-lo ao ofício em construção */
function concluirTitularComDocs(){
  if(!titAtual)return;
  if(docsTIT.length===0){alert('Adicione ao menos um documento para este titular.');return false;}
  titAtual.docs=JSON.parse(JSON.stringify(docsTIT));
  titularesDOF.push(JSON.parse(JSON.stringify(titAtual)));
  titAtual=null;docsTIT=[];
  return true;
}

/* Salvar titular (sem docs ainda) */
window.salvarTitular=function(){
  var nome=(document.getElementById('tNome').value||'').trim();
  var cpf=(document.getElementById('tCPF').value||'').trim();
  var nasc=(document.getElementById('tNasc').value||'').trim();
  var par=(document.getElementById('tPar').value||'').trim();
  titAtual={nome:nome,cpf:cpf,nasc:nasc,par:par,docs:[]};
  docsTIT=[];
  /* Mostra formulário de documentos */
  document.getElementById('titForm').style.display='none';
  document.getElementById('docForm').style.display='block';
  document.getElementById('btnNovoTitular').style.display='none';
  var nomeExib=nome||'(Próprio Requerente)';
  document.getElementById('docFormTit').innerText='Documentos para: '+nomeExib;
  document.getElementById('docSalvosList').innerHTML='';
  limpDocForm();
};

/* Salvar documento para o titular atual */
window.salvarDoc=function(concluir){
  var tipo=(document.getElementById('dTipo').value||'').trim();
  if(!tipo){alert('Selecione o tipo de documento.');return;}
  var doc={tipo:tipo,nr:(document.getElementById('dNR').value||'').trim(),livro:(document.getElementById('dLivro').value||'').trim(),folha:(document.getElementById('dFolha').value||'').trim(),mat:(document.getElementById('dMat').value||'').trim()};
  docsTIT.push(doc);
  /* Renderiza doc salvo */
  var d=document.getElementById('docSalvosList');
  var it=document.createElement('div');it.className='doc-item';
  it.innerHTML='<span class="doc-item-txt">'+tlbl(doc.tipo)+(doc.nr?' | Reg.: '+doc.nr:'')+(doc.livro?' | Livro: '+doc.livro:'')+(doc.folha?' | Folha: '+doc.folha:'')+'</span>'
    +'<button class="btn br bsm" onclick="removerDoc('+( docsTIT.length-1)+')">✕</button>';
  d.appendChild(it);
  limpDocForm();
  if(concluir){
    /* Conclui titular */
    if(!concluirTitularComDocs())return;
    /* Mostra opção de novo titular */
    document.getElementById('docForm').style.display='none';
    document.getElementById('titForm').style.display='none';
    document.getElementById('btnNovoTitular').style.display='block';
    /* Renderiza titulares salvos */
    renderTitSalvos();
  }
};

window.removerDoc=function(i){docsTIT.splice(i,1);var d=document.getElementById('docSalvosList');d.innerHTML='';docsTIT.forEach(function(doc,idx){var it=document.createElement('div');it.className='doc-item';it.innerHTML='<span class="doc-item-txt">'+tlbl(doc.tipo)+(doc.nr?' | Reg.: '+doc.nr:'')+(doc.livro?' | Livro: '+doc.livro:'')+(doc.folha?' | Folha: '+doc.folha:'')+'</span><button class="btn br bsm" onclick="removerDoc('+idx+')">✕</button>';d.appendChild(it);});};

function renderTitSalvos(){
  var d=document.getElementById('titSalvosList');d.innerHTML='';
  titularesDOF.forEach(function(t,i){
    var div=document.createElement('div');div.className='titular-bloco';
    var docsStr=t.docs.map(function(d){return tlbl(d.tipo);}).join(', ');
    div.innerHTML='<div class="titular-header"><span class="titular-title">Titular '+(i+1)+': '+(t.nome||'(Próprio Requerente)')+'</span>'
      +'<button class="btn br bsm" onclick="removerTitular('+i+')">✕</button></div>'
      +'<div style="font-size:12px;color:#555;">Documentos: '+docsStr+'</div>';
    d.appendChild(div);
  });
}

window.removerTitular=function(i){titularesDOF.splice(i,1);renderTitSalvos();};

window.iniciarNovoTitular=function(){
  var nTit=titularesDOF.length+1;
  document.getElementById('titFormTit').innerText='Titular #'+nTit;
  limpTitForm();
  document.getElementById('titForm').style.display='block';
  document.getElementById('docForm').style.display='none';
  document.getElementById('btnNovoTitular').style.display='none';
};

function limpDocForm(){document.getElementById('dTipo').value='';document.getElementById('dNR').value='';document.getElementById('dLivro').value='';document.getElementById('dFolha').value='';document.getElementById('dMat').value='';}
function limpTitForm(){document.getElementById('tNome').value='';document.getElementById('tCPF').value='';document.getElementById('tNasc').value='';document.getElementById('tPar').value='';}

/* Salvar ofício inteiro */
window.salvarOficio=function(concluir){
  /* Se ainda há titular em edição de docs, tenta concluir */
  if(titAtual){if(!concluirTitularComDocs())return;}
  var cartorio=(document.getElementById('ofCartorio').value||'').trim();
  var cidade=(document.getElementById('ofCidade').value||'').trim();
  if(!cartorio||!cidade){alert('Informe o Cartório e a Cidade de destino do ofício.');return;}
  if(titularesDOF.length===0){alert('Adicione ao menos um titular com documentos neste ofício.');return;}
  var obs=(document.getElementById('ofObs').value||'').trim();
  var of={cartorio:cartorio,cidade:cidade,titulares:JSON.parse(JSON.stringify(titularesDOF)),obs:obs};
  oficiosSalvos.push(of);
  /* Limpa estado do ofício em construção */
  titularesDOF=[];titAtual=null;docsTIT=[];
  document.getElementById('ofCartorio').value='';document.getElementById('ofCidade').value='';document.getElementById('ofObs').value='';
  document.getElementById('titSalvosList').innerHTML='';document.getElementById('docSalvosList').innerHTML='';
  limpTitForm();limpDocForm();
  document.getElementById('titForm').style.display='block';
  document.getElementById('docForm').style.display='none';
  document.getElementById('btnNovoTitular').style.display='none';
  renderOfListaView();
  if(concluir){
    /* Exibe área de geração */
    document.getElementById('ofForm').style.display='none';
    document.getElementById('ofConcluido').style.display='block';
    var msg=oficiosSalvos.length+' solicitação(ões) prontas para gerar ofício(s).';
    document.getElementById('ofConcluidoMsg').innerText=msg;
    var botoes=document.getElementById('ofBotoesGerar');botoes.innerHTML='';
    botoes.innerHTML+='<button class="btn bv" style="margin-bottom:8px;width:100%;" onclick="doGerarFicha()">📋 Gerar Ficha + Hipo</button>';
    oficiosSalvos.forEach(function(of,i){
      var b=document.createElement('button');b.className='btn bv';b.style.cssText='width:100%;margin-bottom:8px;';
      b.innerText='🖨 Gerar Ofício '+(i+1)+' — '+of.cartorio+', '+of.cidade;
      b.onclick=function(){gerarOficioPDF(i);};
      botoes.appendChild(b);
    });
    botoes.innerHTML+='<button class="btn by" style="width:100%;margin-top:6px;" onclick="salvarAtendimento()">💾 Salvar no Histórico</button>';
  } else {
    document.getElementById('ofFormTit').innerText='Solicitação #'+(oficiosSalvos.length+1)+' — Novo Ofício';
  }
};

window.reabrirOficios=function(){document.getElementById('ofForm').style.display='block';document.getElementById('ofConcluido').style.display='none';renderOfListaView();};
window.removerOficio=function(i){if(confirm('Remover esta solicitação?')){oficiosSalvos.splice(i,1);renderOfListaView();}};

/* ===== SALVAR ATENDIMENTO NO HISTÓRICO ===== */
window.salvarAtendimento=function(){
  var req=greq();
  if(!req.nm){alert('Informe o nome do requerente.');return;}
  if(oficiosSalvos.length===0){alert('Nenhuma solicitação cadastrada.');return;}
  /* Aloca números de ofício sequencialmente */
  var numeros=[];
  for(var i=0;i<oficiosSalvos.length;i++){var sq=consumirSeq();numeros.push(sq);}
  var ano=new Date().getFullYear();
  var ofComNums=oficiosSalvos.map(function(of,i){return Object.assign({},of,{sq:numeros[i],no:fmtNum(numeros[i])+'/'+ano+'-DITI'});});
  var lst=JSON.parse(localStorage.getItem(kA(SS.jid))||'[]');
  var at={id:CA?CA.id:Date.now(),dt:new Date().toLocaleDateString('pt-BR'),ss:SS,rq:req,oficios:ofComNums,seqFinal:numeros[numeros.length-1]};
  if(CA){var ix=lst.findIndex(function(a){return a.id===CA.id;});if(ix>=0)lst[ix]=at;else lst.push(at);}
  else lst.push(at);
  try{localStorage.setItem(kA(SS.jid),JSON.stringify(lst));}catch(e){}
  CA=at;
  /* Atualiza officiosSalvos com os números */
  oficiosSalvos=ofComNums;
  renderOfListaView();
  updBdg();
  alert('Atendimento salvo no histórico!');
};

function greq(){
  var ac=[];document.querySelectorAll('input[name="ac"]:checked').forEach(function(c){ac.push(c.value);});
  var cr=document.querySelector('input[name="cor"]:checked');
  return{nm:(document.getElementById('rN').value||'').trim(),cp:(document.getElementById('rC').value||'').trim(),dn:(document.getElementById('rD').value||'').trim(),tel:(document.getElementById('rT').value||'').trim(),ec:(document.getElementById('rEC').value||'').trim(),pa:(document.getElementById('rP').value||'').trim(),ma:(document.getElementById('rM').value||'').trim(),pr:(document.getElementById('rPr').value||'').trim(),rd:(document.getElementById('rR').value||'').trim(),en:(document.getElementById('rE').value||'').trim(),cr:cr?cr.value:'',ac:ac,ou:(document.getElementById('aOu').value||'').trim()};
}

/* ===== GERAR FICHA PDF ===== */
window.doGerarFicha=function(){
  var req=greq();if(!req.nm){alert('Preencha o nome do requerente.');return;}
  preencherFicha(req);alogos();
  /* Oculta ofícios e ficha manual */
  document.getElementById('pOficios').innerHTML='';document.getElementById('pM').style.display='none';
  var to=document.title;document.title='Ficha_'+req.nm.split(' ')[0]+'.pdf';
  setTimeout(function(){window.print();setTimeout(function(){document.title=to;},2000);},400);
};

/* ===== GERAR OFÍCIO PDF (individual) ===== */
window.gerarOficioPDF=function(idx){
  var of=oficiosSalvos[idx];if(!of){alert('Ofício não encontrado.');return;}
  var req=CA?CA.rq:greq();
  if(!req.nm){alert('Preencha o nome do requerente primeiro.');return;}
  /* Limpa área de impressão de ofícios */
  document.getElementById('pF').style.display='none';
  document.getElementById('pM').style.display='none';
  /* Constrói HTML do ofício */
  var html=buildOficioPDF(of,req,SS);
  document.getElementById('pOficios').innerHTML=html;
  alogos();
  var no=of.no||'XXX';
  var to=document.title;document.title='OF'+no.replace(/\//g,'-')+'.pdf';
  setTimeout(function(){window.print();setTimeout(function(){document.getElementById('pF').style.display='';document.getElementById('pOficios').innerHTML='';document.title=to;},2000);},400);
};

function buildOficioPDF(of,req,s){
  var hoje=new Date();
  var dd=String(hoje.getDate()).padStart(2,'0');var mm=String(hoje.getMonth()+1).padStart(2,'0');
  var cb=of.cidade?of.cidade.split('/')[0].trim():'';
  var dataNum=(cb?cb+', ':'')+dd+'-'+mm+'-'+hoje.getFullYear()+'.';
  var dataExt=(cb?cb+', ':'')+hoje.getDate()+' de '+MSS[hoje.getMonth()]+' de '+hoje.getFullYear()+'.';
  var no=of.no||'---';
  var nR=req.nm.toUpperCase();
  var nr=rnum(req.rd);
  /* Blocos dos titulares */
  var blocos='';
  of.titulares.forEach(function(t,i){
    var nomeT=t.nome?t.nome.toUpperCase():nR;
    blocos+='<div class="cb">';
    blocos+='<div class="cbt">Titular '+(i+1)+': <strong>'+nomeT+'</strong>';
    if(t.nasc)blocos+=', nascido(a) em '+t.nasc;
    if(t.cpf)blocos+=', CPF '+t.cpf;
    if(t.par&&t.par!=='Próprio(a)')blocos+=' ('+t.par.toLowerCase()+' do(a) requerente)';
    blocos+='</div>';
    t.docs.forEach(function(d,j){
      blocos+='<div style="font-size:9pt;margin-bottom:4px;padding-left:10px;">';
      blocos+=(j+1)+'. <strong>'+tlbl(d.tipo)+'</strong>';
      var rg=[];if(d.nr)rg.push('Registro n.º '+d.nr);if(d.livro)rg.push('Livro '+d.livro);if(d.folha)rg.push('Folha '+d.folha);
      if(rg.length)blocos+=' — '+rg.join(', ');
      if(d.mat)blocos+=', Matrícula: '+d.mat;
      blocos+=' — Cartório: '+of.cartorio+', Comarca de '+of.cidade+'.';
      blocos+='</div>';
    });
    blocos+='</div>';
  });
  var totalDocs=of.titulares.reduce(function(s,t){return s+t.docs.length;},0);
  var assunto=of.titulares.length===1&&totalDocs===1?tlbl(of.titulares[0].docs[0].tipo):'Requisição de certidão(ões) gratuita(s) — '+totalDocs+' documento(s)';
  var sitEcon='';
  if(req.pr||nr>0){sitEcon='<div class="op">O(A) requerente, <strong>'+nR+'</strong>';if(req.pr)sitEcon+=', atua como <strong>'+req.pr+'</strong>';if(nr>0)sitEcon+=', auferindo renda média de <strong>'+req.rd+' ('+ext(nr)+')</strong>';sitEcon+='.</div>';}
  var obsHtml=of.obs?'<div class="oob">* '+of.obs+'</div>':'';
  return '<div class="qbra"><div class="ow">'
    +'<div class="otp"><img class="lgOf" src="'+(LB||LURL)+'" alt="DPE-PI" style="width:80px;height:auto;display:block;flex-shrink:0;"><div class="otx"><div class="ot1">Defensoria Pública do Estado do Piauí</div><div class="ot2">'+(s.un||'')+'</div><div class="ot3">Diretoria Itinerante</div></div></div>'
    +'<div class="onr"><span class="onl">OFÍCIO N.º '+no+'</span><span class="odt">'+dataNum+'</span></div>'
    +'<div class="ode">Ao(À) Senhor(a) Oficial(a) do <strong>'+of.cartorio+'</strong> da Comarca de <strong>'+of.cidade+'</strong></div>'
    +'<div class="oas">Assunto: '+assunto+'</div>'
    +'<div class="op">A Defensoria Pública do Estado do Piauí, no exercício de suas atribuições constitucionais e legais, vem, respeitosamente, <strong>REQUISITAR</strong> a emissão gratuita do(s) documento(s) abaixo especificado(s), em favor de <strong>'+nR+'</strong>, em razão da hipossuficiência econômica do(a) requerente, conforme declaração de hipossuficiência anexa, <strong>ISENTA(S) DE CUSTAS E EMOLUMENTOS</strong>.</div>'
    +sitEcon
    +blocos
    +'<div class="ofu"><strong>FUNDAMENTAÇÃO LEGAL:</strong><ol>'
    +'<li><strong>Lei n.º 9.534/1997:</strong> Garante a gratuidade das certidões para os reconhecidamente pobres.</li>'
    +'<li><strong>Lei n.º 1.060/1950:</strong> Assegura o acesso à justiça a pessoas em situação de vulnerabilidade econômica.</li>'
    +'<li><strong>LC n.º 80/1994, art. 4.º, VII:</strong> Atribui à Defensoria Pública o poder de requisitar documentos necessários à defesa dos assistidos.</li>'
    +'</ol></div>'
    +'<div class="op">Diante do exposto, <strong>REQUISITA-SE</strong> a emissão gratuita do(s) documento(s) acima especificado(s), com entrega ao(à) requerente <strong>'+nR+'</strong>, para fins de regularização dos interesses do(a) assistido(a).</div>'
    +obsHtml
    +'<div class="osn"><div style="font-size:9.5pt;margin-bottom:26px;">'+dataExt+'</div><div class="osl"></div><div class="osn2">'+ctit((s.nm||'').toLowerCase())+'</div><div style="font-size:9.5pt;">Defensor(a) Público(a)</div><div style="font-size:9.5pt;">'+(s.un||'')+'</div></div>'
    +'<div class="ord"><strong>'+(s.un||'')+'</strong> — Diretoria Itinerante — '+(s.jnm||'')+'<br>Gerado em: '+hoje.toLocaleDateString('pt-BR')+' — Ofício n.º '+no+'</div>'
    +'</div></div>';
}

function preencherFicha(r){
  document.getElementById('pRN').innerText=r.nm||'';document.getElementById('pRC').innerText=r.cp||'';
  document.getElementById('pRD').innerText=r.dn||'';document.getElementById('pRT').innerText=r.tel||'';
  document.getElementById('pREC').innerText=r.ec||'';document.getElementById('pRP').innerText=r.pa||'';
  document.getElementById('pRM').innerText=r.ma||'';document.getElementById('pRPr').innerText=r.pr||'';
  document.getElementById('pRR').innerText=r.rd||'';document.getElementById('pRE').innerText=r.en||'';
  var cores=['Branca','Parda','Preta','Amarela','Indígena','Não Declarar'];
  var cd=document.getElementById('pCor');cd.innerHTML='';
  cores.forEach(function(c){var sp=document.createElement('span');sp.className='fo';sp.innerHTML='<span class="fck">'+(r.cr===c?'✓':'')+'</span> '+c;cd.appendChild(sp);});
  var acs=['Documentos','Alimentos','Guarda/Filiação','Criminal','Saúde','Interdição/Curatela','Previdência/INSS','Outras'];
  var ad=document.getElementById('pAc');ad.innerHTML='';
  acs.forEach(function(a){var sp=document.createElement('span');sp.className='fo';var ok=r.ac&&r.ac.indexOf(a)>=0;sp.innerHTML='<span class="fck">'+(ok?'✓':'')+'</span> '+a;ad.appendChild(sp);});
  document.getElementById('pOu').innerText=(r.ou&&r.ac&&r.ac.indexOf('Outras')>=0)?'Outras: '+r.ou:'';
  var nr=rnum(r.rd),rs=nr>0?r.rd:'R$\u00a0____________',ex2=nr>0?ext(nr):'____________';
  var decl='DECLARO, para fins de obtenção de ASSISTÊNCIA JURÍDICA pela DEFENSORIA PÚBLICA DO ESTADO DO PIAUÍ, que sou pessoa pobre na forma da lei, não podendo arcar com as custas processuais e honorários advocatícios sem prejuízo do próprio sustento e de minha família, nos termos do art. 5.º, LXXIV, da Constituição Federal c.c. os arts. 1.º a 4.º da Lei n.º 1.060/1950 e art. 1.º da Lei n.º 7.115/1983.';
  if(r.pr||nr>0){decl+=' O(A) Requerente';if(r.pr)decl+=' atua como '+r.pr+',';decl+=' auferindo renda média de '+rs+' ('+ex2+').';}
  document.getElementById('pDecl').innerText=decl;
  document.getElementById('pNAs').innerText=ctit((r.nm||'').toLowerCase());
  var hj=new Date();document.getElementById('pDtF').innerText=hj.getDate()+' de '+MSS[hj.getMonth()]+' de '+hj.getFullYear()+'.';
}

/* ===== HISTÓRICO ===== */
function rhist(){
  var lst=JSON.parse(localStorage.getItem(kA(SS.jid))||'[]'),d=document.getElementById('lHist');
  if(!lst.length){d.innerHTML='<p style="color:#888;font-style:italic;">Nenhum atendimento nesta jornada.</p>';return;}
  d.innerHTML='';
  for(var i=lst.length-1;i>=0;i--){
    (function(at){
      var of=at.oficios||[];
      var ofDesc=of.map(function(o){return 'Ofício '+o.no+' → '+o.cartorio+', '+o.cidade;}).join(' | ');
      var titDesc=of.map(function(o){return o.titulares.map(function(t){return t.nome||'(Próprio)'}).join(', ');}).join(' | ');
      var it=document.createElement('div');it.className='hi';
      it.innerHTML='<div style="flex:1;">'
        +'<h3>'+at.dt+' — '+(at.rq.nm||'')+'</h3>'
        +'<p>'+of.length+' ofício(s): '+ofDesc+'</p>'
        +'<p style="margin-top:2px;">Titulares: '+titDesc+'</p>'
        +'</div>'
        +'<div style="display:flex;gap:6px;flex-wrap:wrap;flex-shrink:0;">'
        +'<button class="btn bv bsm" onclick="abrirAtend('+at.id+')">✏️ Editar</button>'
        +'<button class="btn bv bsm" onclick="gerarFichaHist('+at.id+')">📋 Ficha</button>'
        +'<button class="btn br bsm" onclick="exclAtend('+at.id+')">✕</button>'
        +'</div>';
      d.appendChild(it);
    })(lst[i]);
  }
}

window.abrirAtend=function(id){
  var lst=JSON.parse(localStorage.getItem(kA(SS.jid))||'[]'),at=lst.find(function(a){return a.id===id;});if(!at)return;
  CA=at;var r=at.rq;
  document.getElementById('rN').value=r.nm||'';document.getElementById('rC').value=r.cp||'';document.getElementById('rD').value=r.dn||'';document.getElementById('rT').value=r.tel||'';document.getElementById('rEC').value=r.ec||'';document.getElementById('rP').value=r.pa||'';document.getElementById('rM').value=r.ma||'';document.getElementById('rPr').value=r.pr||'';document.getElementById('rR').value=r.rd||'';document.getElementById('rE').value=r.en||'';
  document.querySelectorAll('input[name="cor"]').forEach(function(x){x.checked=(x.value===r.cr);});
  document.querySelectorAll('input[name="ac"]').forEach(function(x){x.checked=(r.ac&&r.ac.indexOf(x.value)>=0);});
  var ao=document.getElementById('aOu');if(ao){ao.value=r.ou||'';ao.style.display=(r.ac&&r.ac.indexOf('Outras')>=0)?'block':'none';}
  oficiosSalvos=JSON.parse(JSON.stringify(at.oficios||[]));
  renderOfListaView();
  /* Mostra área concluída */
  document.getElementById('ofForm').style.display='none';
  document.getElementById('ofConcluido').style.display='block';
  var botoes=document.getElementById('ofBotoesGerar');botoes.innerHTML='';
  botoes.innerHTML+='<button class="btn bv" style="margin-bottom:8px;width:100%;" onclick="doGerarFicha()">📋 Gerar Ficha + Hipo</button>';
  oficiosSalvos.forEach(function(of,i){var b=document.createElement('button');b.className='btn bv';b.style.cssText='width:100%;margin-bottom:8px;';b.innerText='🖨 Gerar Ofício '+(i+1)+' — '+of.cartorio+', '+of.cidade;b.onclick=function(){gerarOficioPDF(i);};botoes.appendChild(b);});
  document.getElementById('ofConcluidoMsg').innerText=oficiosSalvos.length+' ofício(s) neste atendimento.';
  aba('n');document.getElementById('titPag').innerText='Editando atendimento de '+at.dt;
};

window.gerarFichaHist=function(id){
  var lst=JSON.parse(localStorage.getItem(kA(SS.jid))||'[]'),at=lst.find(function(a){return a.id===id;});if(!at)return;
  preencherFicha(at.rq);alogos();document.getElementById('pOficios').innerHTML='';document.getElementById('pM').style.display='none';
  var to=document.title;document.title='Ficha.pdf';setTimeout(function(){window.print();setTimeout(function(){document.getElementById('pF').style.display='';document.title=to;},2000);},400);
};

window.exclAtend=function(id){
  if(!confirm('Excluir permanentemente?'))return;
  var lst=JSON.parse(localStorage.getItem(kA(SS.jid))||'[]').filter(function(a){return a.id!==id;});
  localStorage.setItem(kA(SS.jid),JSON.stringify(lst));rhist();updBdg();
};

window.doLimpar=function(){
  if(!confirm('Iniciar novo atendimento? Dados não salvos serão perdidos.'))return;
  document.querySelectorAll('#abaN input[type="text"],#abaN textarea').forEach(function(i){i.value='';});
  document.querySelectorAll('#abaN input[type="checkbox"],#abaN input[type="radio"]').forEach(function(i){i.checked=false;});
  document.querySelectorAll('#abaN select').forEach(function(s){s.value='';});
  var ao=document.getElementById('aOu');if(ao)ao.style.display='none';
  oficiosSalvos=[];titularesDOF=[];docsTIT=[];titAtual=null;CA=null;
  document.getElementById('ofForm').style.display='block';
  document.getElementById('ofConcluido').style.display='none';
  document.getElementById('titForm').style.display='block';
  document.getElementById('docForm').style.display='none';
  document.getElementById('btnNovoTitular').style.display='none';
  document.getElementById('titSalvosList').innerHTML='';
  renderOfListaView();updBdg();
  document.getElementById('titPag').innerText='Atendimento';
};

/* ===== JORNADAS ADMIN ===== */
window.abrirModal=function(){rlJA();document.getElementById('mJor').style.display='flex';};
window.fecharModal=function(){document.getElementById('mJor').style.display='none';};
window.doCriarJ=function(){var nm=(document.getElementById('nJN').value||'').trim();if(!nm){alert('Informe o nome.');return;}var jj=gJ();var id=nm.toLowerCase().replace(/[^a-z0-9]/g,'');if(jj.find(function(j){return j.id===id;})){alert('Já existe.');return;}jj.push({id:id,nm:nm,fix:false,pw:PW,perfil:null});localStorage.setItem('dpe_j',JSON.stringify(jj));document.getElementById('nJN').value='';rjornadas();rlJA();};
window.doApagJ=function(id){if(!confirm('Apagar jornada?'))return;var jj=gJ().filter(function(j){return j.id!==id;});localStorage.setItem('dpe_j',JSON.stringify(jj));localStorage.removeItem(kA(id));localStorage.removeItem(kS(id));rjornadas();rlJA();};
function rlJA(){var d=document.getElementById('lJA');if(!d)return;d.innerHTML='';gJ().forEach(function(j){var it=document.createElement('div');it.style.cssText='display:flex;justify-content:space-between;align-items:center;padding:6px 0;border-bottom:1px solid #eee;font-size:12px;';it.innerHTML='<span>'+j.nm+'</span>'+(j.fix?'':'<button class="btn br bsm" onclick="doApagJ(\''+j.id+'\')">Apagar</button>');d.appendChild(it);});}

/* ===== ENCERRAR JORNADA ===== */
window.doEncerrar=function(){
  var s=prompt('Senha para encerrar jornada:');if(!s)return;
  var jj=gJ();var jorn=jj.find(function(j){return j.id===SS.jid;});
  if(s!==(jorn&&jorn.pw||PW)){alert('Senha incorreta.');return;}
  if(!confirm('Encerrar jornada "'+SS.jnm+'"?\nUm relatório será gerado.'))return;
  var lst=JSON.parse(localStorage.getItem(kA(SS.jid))||'[]'),td=0,to=0;
  lst.forEach(function(a){to+=(a.oficios?a.oficios.length:0);a.oficios&&a.oficios.forEach(function(of){of.titulares&&of.titulares.forEach(function(t){td+=t.docs?t.docs.length:0;});});});
  var rl=JSON.parse(localStorage.getItem('dpe_rl')||'[]');
  var nr={id:Date.now(),jid:SS.jid,jnm:SS.jnm,de:new Date().toLocaleDateString('pt-BR'),ho:new Date().toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'}),df:SS.nm,dfu:SS.un,ta:lst.length,to:to,td:td,seqFinal:parseInt(localStorage.getItem(kS(SS.jid))||'0',10),ats:lst};
  rl.push(nr);try{localStorage.setItem('dpe_rl',JSON.stringify(rl));}catch(e){}
  prel(nr);
  setTimeout(function(){localStorage.removeItem(kA(SS.jid));localStorage.removeItem(kS(SS.jid));localStorage.removeItem('dpe_ss');location.reload();},800);
};

/* ===== BUSCA GLOBAL ===== */
function carregarRlSel(){var sel=document.getElementById('rlSel');if(!sel)return;var rl=JSON.parse(localStorage.getItem('dpe_rl')||'[]');sel.innerHTML='<option value="">Selecione...</option>';var seen={};for(var i=rl.length-1;i>=0;i--){var r=rl[i];if(!seen[r.jid]){seen[r.jid]=true;var o=document.createElement('option');o.value=r.jid+'|'+r.id;o.textContent=r.jnm+' (enc. '+r.de+')';sel.appendChild(o);}}}
function carregarRelsLogin(){var rl=JSON.parse(localStorage.getItem('dpe_rl')||'[]'),d=document.getElementById('lbRel');if(!d)return;if(!rl.length){d.innerHTML='<p style="color:#888;font-style:italic;font-size:12px;">Nenhum relatório salvo.</p>';return;}d.innerHTML='';for(var i=rl.length-1;i>=0;i--){(function(r){var it=document.createElement('div');it.style.cssText='background:var(--vc);border:1px solid var(--vm);border-radius:6px;padding:10px 12px;margin-bottom:8px;';it.innerHTML='<div style="font-weight:700;font-size:12px;color:var(--v3);">'+r.jnm+'</div><div style="font-size:11px;color:#555;">'+r.de+' — '+r.ta+' atend. / '+r.to+' ofícios / '+r.td+' docs</div><div style="font-size:11px;color:#777;margin-bottom:6px;">'+r.df+'</div><button class="btn bv bsm" onclick="doReimRel('+r.id+')">Reimprimir</button>';d.appendChild(it);})(rl[i]);}}
window.doAutBusca=function(){var s=(document.getElementById('lbSe').value||'').trim();if(s!==PW){document.getElementById('lbErr').style.display='block';document.getElementById('lbSe').value='';return;}document.getElementById('lbErr').style.display='none';LBAU=true;document.getElementById('lbAuth').style.display='none';document.getElementById('lbPain').style.display='block';carregarRelsLogin();};
window.doLbuscar=function(){
  if(!LBAU)return;
  var tn=(document.getElementById('lbNm').value||'').trim().toUpperCase();
  var tc=(document.getElementById('lbCP').value||'').trim();
  if(!tn&&!tc){document.getElementById('lbInfo').innerText='Informe ao menos um critério.';document.getElementById('lbRes').innerHTML='';return;}
  var res=[];
  gJ().forEach(function(j){JSON.parse(localStorage.getItem(kA(j.id))||'[]').forEach(function(at){var ok=false;if(tc&&at.rq&&at.rq.cp&&at.rq.cp.replace(/\D/g,'')===tc.replace(/\D/g,''))ok=true;if(tn&&at.rq&&at.rq.nm&&at.rq.nm.indexOf(tn)>=0)ok=true;if(at.oficios)at.oficios.forEach(function(of){of.titulares&&of.titulares.forEach(function(t){if(tn&&t.nome&&t.nome.indexOf(tn)>=0)ok=true;if(tc&&t.cpf&&t.cpf.replace(/\D/g,'')===tc.replace(/\D/g,''))ok=true;});});if(ok)res.push({j:j,at:at});});});
  var rl=JSON.parse(localStorage.getItem('dpe_rl')||'[]');
  var vR={};rl.forEach(function(r){if(vR[r.jid])return;vR[r.jid]=true;(r.ats||[]).forEach(function(at){var na=res.find(function(x){return x.at.id===at.id;});if(na)return;var ok=false;if(tc&&at.rq&&at.rq.cp&&at.rq.cp.replace(/\D/g,'')===tc.replace(/\D/g,''))ok=true;if(tn&&at.rq&&at.rq.nm&&at.rq.nm.indexOf(tn)>=0)ok=true;if(at.oficios)at.oficios.forEach(function(of){of.titulares&&of.titulares.forEach(function(t){if(tn&&t.nome&&t.nome.indexOf(tn)>=0)ok=true;});});if(ok)res.push({j:{id:r.jid,nm:r.jnm+' (encerrada)'},at:at});});});
  var bi=document.getElementById('lbInfo'),bd=document.getElementById('lbRes');
  if(!res.length){bi.innerText='Nenhum resultado.';bd.innerHTML='';return;}
  var js={};res.forEach(function(r){js[r.j.id]=true;});bi.innerText=res.length+' resultado(s) em '+Object.keys(js).length+' jornada(s).';bd.innerHTML='';
  var gr={};res.forEach(function(r){if(!gr[r.j.id])gr[r.j.id]={nm:r.j.nm,its:[]};gr[r.j.id].its.push(r.at);});
  Object.keys(gr).forEach(function(jid){var g=gr[jid];var t=document.createElement('div');t.style.cssText='background:var(--v3);color:#fff;padding:5px 10px;border-radius:4px;font-size:12px;font-weight:700;margin:10px 0 6px;';t.innerText=g.nm+' ('+g.its.length+')';bd.appendChild(t);g.its.forEach(function(at){var it=document.createElement('div');it.className='hi';var ofDesc=(at.oficios||[]).map(function(o){return(o.no||'?')+' → '+o.cartorio;}).join(' | ');it.innerHTML='<div><h3>'+at.dt+' — '+(at.rq&&at.rq.nm?at.rq.nm:'')+'</h3><p>Ofícios: '+ofDesc+'</p><p style="font-size:10px;color:var(--v3);">'+g.nm+(at.ss&&at.ss.nm?' | '+at.ss.nm:'')+'</p></div>';bd.appendChild(it);});});
};
window.doLlimpar=function(){document.getElementById('lbNm').value='';document.getElementById('lbCP').value='';document.getElementById('lbInfo').innerText='';document.getElementById('lbRes').innerHTML='';};
window.doReimRel=function(id){var rl=JSON.parse(localStorage.getItem('dpe_rl')||'[]'),r=rl.find(function(x){return x.id===id;});if(r)prel(r);};

/* ===== RELATÓRIO ===== */
function prel(r){
  var ls=LB||LURL;var lns='';
  (r.ats||[]).forEach(function(a,i){
    var ofDesc=(a.oficios||[]).map(function(o){return(o.no||'?')+' → '+o.cartorio+', '+o.cidade;}).join('; ');
    lns+='<tr style="background:'+(i%2===0?'#F1F8E9':'#fff')+'"><td style="padding:5px 8px;border:1px solid #ccc;">'+ctit((a.rq.nm||'').toLowerCase())+'</td><td style="padding:5px 8px;border:1px solid #ccc;text-align:center;">'+(a.rq.cp||'—')+'</td><td style="padding:5px 8px;border:1px solid #ccc;text-align:center;">'+(a.dt||'—')+'</td><td style="padding:5px 8px;border:1px solid #ccc;">'+(ofDesc||'—')+'</td></tr>';
  });
  var jn=window.open('','_blank','width=900,height=700');if(!jn){alert('Permita popups.');return;}
  var html='<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8"><title>Relatório</title><style>*{margin:0;padding:0;box-sizing:border-box;font-family:Arial,sans-serif;}body{padding:24px;font-size:10pt;}@page{margin:1.5cm 2cm;size:A4 portrait;}@media print{.np{display:none;}}</style></head><body>'
    +'<div style="display:flex;align-items:center;gap:14px;border-bottom:3px solid #4CAF50;padding-bottom:10px;margin-bottom:16px;"><img src="'+ls+'" style="width:80px;height:auto;" onerror="this.style.display=\'none\'"><div style="flex:1;text-align:center;"><div style="color:#2E7D32;font-size:13pt;font-weight:700;text-transform:uppercase;">Relatório de Encerramento de Jornada</div><div style="color:#43A047;font-size:9pt;font-weight:700;margin-top:3px;">Defensoria Pública do Estado do Piauí — Diretoria Itinerante</div></div></div>'
    +'<div style="display:flex;gap:12px;margin-bottom:16px;"><div style="flex:1;background:#F1F8E9;border:1px solid #C8E6C9;border-radius:6px;padding:10px 14px;"><div style="font-size:8pt;font-weight:700;text-transform:uppercase;color:#2E7D32;">Jornada</div><div style="font-size:10pt;font-weight:700;">'+r.jnm+'</div><div style="font-size:8.5pt;color:#555;">Encerrada em '+r.de+' às '+r.ho+'</div></div><div style="flex:1;background:#F1F8E9;border:1px solid #C8E6C9;border-radius:6px;padding:10px 14px;"><div style="font-size:8pt;font-weight:700;text-transform:uppercase;color:#2E7D32;">Responsável</div><div style="font-size:10pt;font-weight:700;">'+r.df+'</div><div style="font-size:8.5pt;color:#555;">'+(r.dfu||'')+'</div></div></div>'
    +'<div style="display:flex;gap:12px;margin-bottom:20px;"><div style="flex:1;text-align:center;background:#2E7D32;color:#fff;border-radius:8px;padding:12px;"><div style="font-size:22pt;font-weight:700;">'+r.ta+'</div><div>Atendimentos</div></div><div style="flex:1;text-align:center;background:#43A047;color:#fff;border-radius:8px;padding:12px;"><div style="font-size:22pt;font-weight:700;">'+r.to+'</div><div>Ofícios</div></div><div style="flex:1;text-align:center;background:#66BB6A;color:#fff;border-radius:8px;padding:12px;"><div style="font-size:22pt;font-weight:700;">'+r.td+'</div><div>Documentos</div></div></div>'
    +'<table style="width:100%;border-collapse:collapse;font-size:8.5pt;"><thead><tr style="background:#2E7D32;color:#fff;"><th style="padding:6px 8px;border:1px solid #aaa;text-align:left;">Requerente</th><th style="padding:6px 8px;border:1px solid #aaa;">CPF</th><th style="padding:6px 8px;border:1px solid #aaa;">Data</th><th style="padding:6px 8px;border:1px solid #aaa;text-align:left;">Ofícios</th></tr></thead><tbody>'+lns+'</tbody></table>'
    +'<div class="np" style="text-align:center;margin-top:20px;"><button onclick="window.print()" style="background:#2E7D32;color:#fff;border:none;padding:10px 28px;border-radius:6px;font-size:13px;font-weight:700;cursor:pointer;">Imprimir</button></div>'
    +'</body></html>';
  jn.document.write(html);jn.document.close();jn.onload=function(){jn.print();};
}

/* ===== FICHA MANUAL ===== */
window.doFichaManual=function(){
  document.getElementById('pF').style.display='none';document.getElementById('pOficios').innerHTML='';document.getElementById('pM').style.display='block';
  alogos();var to=document.title;document.title='Fichamodelo.pdf';
  window.print();
  setTimeout(function(){document.getElementById('pF').style.display='';document.getElementById('pM').style.display='none';document.title=to;},1200);
};

window.mcpf=mcpf;window.mdat=mdat;window.mtel=mtel;window.irnd=irnd;window.mrnd=mrnd;window.ctit=ctit;
})();
</script>
</body>
</html>
