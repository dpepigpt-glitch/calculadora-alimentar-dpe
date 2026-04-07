<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Sistema DPE-PI | Diretoria Itinerante</title>
<style>
:root{--v:#2E7D32;--v2:#43A047;--v3:#1B5E20;--vc:#F1F8E9;--vm:#C8E6C9;--bg:#f4f6f4;--bd:#ccc;--tx:#222;}
*{margin:0;padding:0;box-sizing:border-box;font-family:'Segoe UI',system-ui,sans-serif;}
body{background:var(--bg);color:var(--tx);padding-bottom:60px;line-height:1.5;}
.wrap{max-width:1020px;margin:0 auto;padding:20px;}
.card{background:#fff;padding:22px;border-radius:8px;box-shadow:0 2px 8px rgba(0,0,0,.07);margin-bottom:18px;}
h2{color:var(--v);border-bottom:2px solid var(--vm);padding-bottom:7px;margin-bottom:16px;font-size:16px;}
.row{display:flex;gap:13px;flex-wrap:wrap;margin-bottom:11px;}
.fg{flex:1;min-width:160px;}
.fg label{display:block;font-size:12px;font-weight:700;margin-bottom:3px;color:var(--v3);}
.fg input,.fg select,.fg textarea{width:100%;padding:8px 10px;border:1px solid var(--bd);border-radius:5px;font-size:13px;}
.fg input:focus,.fg select:focus{outline:2px solid var(--v2);}
.btn{padding:9px 16px;border:none;border-radius:5px;cursor:pointer;font-weight:700;font-size:13px;transition:.15s;}
.bv{background:var(--v);color:#fff;} .bv:hover{background:var(--v3);}
.bo{background:transparent;border:2px solid var(--v);color:var(--v);}
.br{background:#c62828;color:#fff;}
.bsm{padding:5px 10px;font-size:12px;}
.chips{display:flex;flex-wrap:wrap;gap:8px;margin-top:8px;}
.chip{position:relative;}
.chip input{position:absolute;opacity:0;width:0;height:0;}
.chip label{display:flex;align-items:center;gap:5px;padding:6px 12px;border:2px solid var(--bd);border-radius:20px;cursor:pointer;font-size:12px;font-weight:600;color:#555;background:#fff;transition:.15s;white-space:nowrap;}
.chip label:hover{border-color:var(--v2);color:var(--v2);background:var(--vc);}
.chip input:checked+label{border-color:var(--v);background:var(--v);color:#fff;}
.divid{height:1px;background:var(--bd);margin:16px 0;}
#loginScreen{display:flex;justify-content:center;align-items:center;min-height:90vh;}
.lbox{max-width:440px;width:100%;}
.lhd{background:var(--v);color:#fff;padding:18px;border-radius:8px 8px 0 0;text-align:center;}
.lbd{background:#fff;padding:22px;border-radius:0 0 8px 8px;box-shadow:0 4px 12px rgba(0,0,0,.12);}
.perfil-card{border:2px solid var(--bd);border-radius:8px;padding:11px 14px;cursor:pointer;transition:.15s;display:flex;align-items:center;gap:12px;margin-bottom:8px;}
.perfil-card:hover{border-color:var(--v2);background:var(--vc);}
.perfil-card.sel{border-color:var(--v);background:var(--vc);}
.pc-nome{font-weight:700;font-size:13px;color:var(--v3);}
.pc-uni{font-size:11px;color:#666;}
.errmsg{color:#c62828;font-size:12px;text-align:center;margin-top:8px;display:none;}
#dashboard{display:none;}
.topbar{display:flex;justify-content:space-between;align-items:center;background:#fff;padding:12px 18px;border-radius:8px;margin-bottom:18px;box-shadow:0 2px 6px rgba(0,0,0,.05);flex-wrap:wrap;gap:10px;border-left:5px solid var(--v);}
.badge{background:var(--vc);border:1px solid var(--vm);padding:4px 11px;border-radius:6px;font-weight:700;color:var(--v3);font-size:13px;}
.tabs{display:flex;gap:10px;margin-bottom:18px;flex-wrap:wrap;}
.tab{padding:8px 16px;background:#fff;border:2px solid var(--bd);border-radius:5px;cursor:pointer;font-weight:700;font-size:13px;}
.tab.on{background:var(--v);color:#fff;border-color:var(--v);}
.hist-item{background:var(--vc);border:1px solid var(--vm);padding:12px;margin-bottom:8px;border-radius:6px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;}
.hist-item h3{font-size:13px;color:var(--v3);margin-bottom:2px;}
.hist-item p{font-size:11px;color:#555;}
.cert-item{background:#F1F8E9;border:1px solid var(--vm);border-radius:6px;padding:11px;margin-bottom:9px;position:relative;font-size:12px;}
.cert-num{background:var(--v);color:#fff;border-radius:50%;width:20px;height:20px;display:inline-flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;margin-right:5px;}
.cert-remove{position:absolute;top:8px;right:8px;background:#c62828;color:#fff;border:none;border-radius:4px;padding:2px 8px;font-size:11px;cursor:pointer;}
.gerar-area{text-align:center;padding:26px 20px;background:var(--vc);border:2px dashed var(--vm);border-radius:8px;}
.limpar-area{border-top:1px dashed var(--bd);padding-top:16px;margin-top:14px;text-align:center;}
.modal-bg{display:none;position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:9999;align-items:center;justify-content:center;}
.modal-box{background:#fff;border-radius:8px;padding:26px;max-width:400px;width:90%;box-shadow:0 8px 32px rgba(0,0,0,.2);}
.noprint{} 
.iprint{display:none;}
@media print{
  body *{visibility:hidden;}
  .iprint,.iprint *{visibility:visible;}
  .iprint{position:absolute;left:0;top:0;width:100%;display:block!important;padding:0;margin:0;}
  .noprint{display:none!important;}
  @page{margin:1.2cm 1.8cm;size:A4 portrait;}
  .qbra{page-break-after:always;}
  .qbra:last-child{page-break-after:auto;}
}
/* PDF FICHA */
.fw{font-family:Arial,sans-serif;font-size:8.5pt;}
.ftopo{display:flex;align-items:center;gap:12px;border-bottom:3px solid #4CAF50;padding-bottom:9px;margin-bottom:9px;}
.ftopo img{width:72px;height:auto;display:block;flex-shrink:0;}
.ftxt{flex:1;text-align:center;}
.ftxt h2{color:#2E7D32;font-size:12pt;margin:0 0 2px;text-transform:uppercase;letter-spacing:.5px;border:none;padding:0;font-weight:700;}
.ftxt .fi{color:#43A047;font-size:8.5pt;font-weight:700;margin:0 0 1px;}
.ftxt .fs{color:#66BB6A;font-size:7.5pt;margin:0;}
.ftxt .fz{color:#888;font-size:7pt;margin-top:1px;}
.fsec{background:#43A047;color:#fff;padding:2px 7px;font-size:7.5pt;font-weight:700;text-transform:uppercase;margin:7px 0 4px;border-radius:2px;}
.fl{display:flex;border-bottom:1px solid #ccc;padding:2px 0;align-items:flex-end;gap:6px;margin-bottom:2px;}
.fr{font-size:7pt;font-weight:700;text-transform:uppercase;color:#2E7D32;white-space:nowrap;flex-shrink:0;}
.fv{flex:1;border-bottom:1px dotted #aaa;min-height:12px;font-size:8pt;padding-left:3px;}
.fopts{display:flex;flex-wrap:wrap;gap:6px;margin:4px 0;}
.fopt{display:flex;align-items:center;gap:2px;font-size:7.5pt;}
.fchk{width:8px;height:8px;border:1.5px solid #43A047;display:inline-flex;align-items:center;justify-content:center;font-size:6.5pt;flex-shrink:0;}
.dbox{margin-top:8px;padding:8px;border:1.5px solid #66BB6A;font-size:7.5pt;line-height:1.35;text-align:justify;background:#fafff8;}
.dtit{font-weight:700;text-transform:uppercase;text-align:center;margin-bottom:6px;font-size:8.5pt;color:#2E7D32;}
.dp{margin-bottom:6px;}
.dassin{margin-top:26px;text-align:center;}
.dlinha{border-top:1px solid #000;width:58%;margin:0 auto 3px;}
/* PDF OFÍCIO */
.ow{font-family:Arial,sans-serif;font-size:10pt;line-height:1.65;text-align:justify;}
.ocab{display:flex;align-items:center;gap:16px;border-bottom:3px solid #4CAF50;padding-bottom:10px;margin-bottom:16px;}
.ocab img{width:72px;height:auto;display:block;flex-shrink:0;}
.oct{flex:1;text-align:center;}
.oct h3{color:#2E7D32;font-size:12pt;margin:0 0 3px;text-transform:uppercase;letter-spacing:.5px;font-weight:700;}
.oct .ou{color:#43A047;font-size:9pt;font-weight:700;margin:0 0 1px;}
.oct .od{color:#66BB6A;font-size:8pt;margin:0;}
.onlrow{display:flex;justify-content:space-between;align-items:baseline;margin-bottom:14px;border-bottom:1px solid #A5D6A7;padding-bottom:7px;}
.onl{font-size:9.5pt;font-weight:700;color:#2E7D32;}
.odt{font-size:9.5pt;font-weight:700;color:#333;}
.odest{margin-bottom:10px;font-size:9.5pt;}
.oass{margin-bottom:11px;font-weight:700;font-size:9.5pt;padding:4px 8px;background:#F1F8E9;border-left:3px solid #66BB6A;border-radius:0 3px 3px 0;}
.op{margin-bottom:9px;text-indent:28px;font-size:9.5pt;text-align:justify;}
.ofund{margin:10px 0;font-size:9.5pt;}
.ofund ol{padding-left:18px;margin-top:4px;}
.ofund li{margin-bottom:5px;text-align:justify;}
.oobs{font-style:italic;padding:4px 8px;border-left:3px solid #A5D6A7;margin:8px 0;font-size:9.5pt;background:#F9FBE7;}
.oassin{margin-top:38px;text-align:center;}
.oassindt{font-size:9.5pt;margin-bottom:26px;}
.oasslin{border-top:1px solid #000;width:55%;margin:0 auto 4px;}
.oasnome{font-weight:700;font-size:10pt;}
.orod{border-top:1px solid #ddd;margin-top:16px;padding-top:5px;font-size:7.5pt;color:#666;}
.cbloco{border:1px solid #A5D6A7;border-radius:4px;padding:7px 10px;margin-bottom:8px;background:#F9FBE7;}
.cblocoT{font-weight:700;font-size:9pt;color:#2E7D32;margin-bottom:4px;}
</style>
</head>
<body>

<!-- LOGIN -->
<div id="loginScreen" class="noprint">
  <div class="lbox">
    <div class="lhd">
      <div style="font-size:13px;font-weight:700;letter-spacing:.5px;">DEFENSORIA PÚBLICA DO ESTADO DO PIAUÍ</div>
      <div style="font-size:11px;margin-top:2px;opacity:.9;">Diretoria Itinerante — Sistema de Ofícios</div>
    </div>
    <div class="lbd">
      <div style="font-size:12px;font-weight:700;color:var(--v3);margin-bottom:10px;">Selecione o perfil:</div>
      <div id="perfilCards"></div>
      <div class="fg" style="margin-bottom:10px;">
        <label>Jornada:</label>
        <select id="lgJornada"><option value="">Selecione a jornada</option></select>
      </div>
      <div class="fg" style="margin-bottom:14px;">
        <label>Senha de acesso:</label>
        <input type="password" id="lgSenha" placeholder="••••••••" onkeydown="if(event.key==='Enter')fazerLogin()">
      </div>
      <button class="btn bv" style="width:100%;" onclick="fazerLogin()">🔐 ENTRAR NO SISTEMA</button>
      <div class="errmsg" id="erroLogin">❌ Verifique perfil, jornada e senha.</div>
    </div>
  </div>
</div>

<!-- DASHBOARD -->
<div id="dashboard" class="noprint">
  <div class="wrap">
    <div class="topbar">
      <div>
        <div style="font-weight:700;font-size:15px;color:var(--v3);" id="titPag">Novo Atendimento</div>
        <div style="font-size:11px;color:#666;" id="infoSess"></div>
      </div>
      <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;">
        <div class="badge" id="badgeNum">Próximo: Ofício nº 001</div>
        <button class="btn bv bsm" id="btnNovaJornada" style="display:none;" onclick="abrirModal()">➕ Nova Jornada</button>
        <button class="btn br bsm" onclick="encerrarJornada()">🏁 Encerrar Jornada</button>
        <button class="btn bo bsm" onclick="sair()">Sair</button>
      </div>
    </div>

    <div class="tabs">
      <div class="tab on" id="tabNovo" onclick="aba('novo')">Novo Atendimento</div>
      <div class="tab" id="tabHist" onclick="aba('historico')">Histórico</div>
      <div class="tab" id="tabBusca" onclick="aba('busca')">🔍 Busca Global</div>
    </div>

    <!-- ABA NOVO -->
    <div id="abaNovo">
      <div class="card">
        <h2>🧑 Dados do(a) Requerente</h2>
        <div style="background:var(--vc);border-left:4px solid var(--v);padding:9px 12px;margin-bottom:14px;font-size:12px;color:var(--v3);border-radius:0 4px 4px 0;">
          ℹ️ Dados do(a) requerente vão para a Ficha de Atendimento e para a Declaração de Hipossuficiência.
        </div>
        <div class="row">
          <div class="fg" style="flex:3;"><label>Nome Completo:</label><input type="text" id="rNome" oninput="this.value=this.value.toUpperCase()"></div>
          <div class="fg"><label>CPF:</label><input type="text" id="rCPF" maxlength="14" placeholder="000.000.000-00" oninput="mCPF(this)"></div>
        </div>
        <div class="row">
          <div class="fg"><label>Data de Nascimento:</label><input type="text" id="rNasc" maxlength="10" placeholder="DD/MM/AAAA" oninput="mData(this)"></div>
          <div class="fg"><label>Telefone / WhatsApp:</label><input type="text" id="rTel" maxlength="15" placeholder="(00) 00000-0000" oninput="mTel(this)"></div>
          <div class="fg"><label>Estado Civil:</label>
            <select id="rCivil"><option value="">Selecione</option><option>Solteiro(a)</option><option>Casado(a)</option><option>Divorciado(a)</option><option>Viúvo(a)</option><option>União Estável</option></select>
          </div>
        </div>
        <div class="row">
          <div class="fg"><label>Nome do Pai:</label><input type="text" id="rPai" oninput="this.value=this.value.toUpperCase()"></div>
          <div class="fg"><label>Nome da Mãe:</label><input type="text" id="rMae" oninput="this.value=this.value.toUpperCase()"></div>
        </div>
        <div class="row">
          <div class="fg"><label>Profissão:</label><input type="text" id="rProf" oninput="this.value=capTit(this.value)"></div>
          <div class="fg"><label>Renda Média Familiar:</label><input type="text" id="rRenda" placeholder="R$ 0,00" oninput="mRenda(this)" onfocus="iRenda(this)"></div>
          <div class="fg" style="flex:2;"><label>Endereço Completo:</label><input type="text" id="rEnd" oninput="this.value=capTit(this.value)"></div>
        </div>
        <div class="divid"></div>
        <div>
          <span style="font-size:12px;font-weight:700;color:var(--v3);">🎨 Cor / Raça — Autodeclaração (IBGE)</span>
          <div class="chips">
            <div class="chip"><input type="radio" name="cor" id="co1" value="Branca"><label for="co1">Branca</label></div>
            <div class="chip"><input type="radio" name="cor" id="co2" value="Parda"><label for="co2">Parda</label></div>
            <div class="chip"><input type="radio" name="cor" id="co3" value="Preta"><label for="co3">Preta</label></div>
            <div class="chip"><input type="radio" name="cor" id="co4" value="Amarela"><label for="co4">Amarela</label></div>
            <div class="chip"><input type="radio" name="cor" id="co5" value="Indígena"><label for="co5">Indígena</label></div>
            <div class="chip"><input type="radio" name="cor" id="co6" value="Não Declarar"><label for="co6">Não Declarar</label></div>
          </div>
        </div>
        <div class="divid"></div>
        <div>
          <span style="font-size:12px;font-weight:700;color:var(--v3);">⚖️ Ação Pretendida — pode marcar mais de uma</span>
          <div class="chips">
            <div class="chip"><input type="checkbox" name="acao" id="ac1" value="Documentos"><label for="ac1">📄 Documentos</label></div>
            <div class="chip"><input type="checkbox" name="acao" id="ac2" value="Alimentos"><label for="ac2">🍽️ Alimentos</label></div>
            <div class="chip"><input type="checkbox" name="acao" id="ac3" value="Guarda/Filiação"><label for="ac3">👶 Guarda/Filiação</label></div>
            <div class="chip"><input type="checkbox" name="acao" id="ac4" value="Criminal"><label for="ac4">⚖️ Criminal</label></div>
            <div class="chip"><input type="checkbox" name="acao" id="ac5" value="Saúde"><label for="ac5">🏥 Saúde</label></div>
            <div class="chip"><input type="checkbox" name="acao" id="ac6" value="Interdição/Curatela"><label for="ac6">🔒 Interdição/Curatela</label></div>
            <div class="chip"><input type="checkbox" name="acao" id="ac7" value="Previdência/INSS"><label for="ac7">💰 Previdência/INSS</label></div>
            <div class="chip"><input type="checkbox" name="acao" id="ac8" value="Outras"><label for="ac8">➕ Outras</label></div>
          </div>
          <input type="text" id="aOutras" placeholder="Especifique 'Outras'..." style="display:none;margin-top:8px;width:100%;padding:7px 10px;border:1px solid var(--bd);border-radius:4px;font-size:12px;">
        </div>
      </div>

      <div class="card">
        <h2>📄 Certidão(ões) Solicitada(s)</h2>
        <div style="background:#fff8e1;border-left:4px solid #f9a825;padding:9px 12px;margin-bottom:14px;font-size:12px;color:#5d4037;border-radius:0 4px 4px 0;">
          ⚠️ Adicione uma certidão por vez. Use <strong>"Salvar e incluir nova"</strong> para adicionar mais. Ao terminar, clique em <strong>"Salvar e concluir"</strong>.
        </div>
        <div id="certListaView"></div>
        <div id="certForm" style="border:2px solid var(--vm);border-radius:8px;padding:14px;background:#F9FBE7;">
          <div style="font-weight:700;font-size:13px;color:var(--v3);margin-bottom:10px;" id="certFormTit">📋 Certidão #1</div>
          <div class="row">
            <div class="fg" style="flex:2;">
              <label>Tipo de Documento:</label>
              <select id="cTipo">
                <option value="">Selecione o tipo</option>
                <option value="nascimento">2ª Via da Certidão de Nascimento</option>
                <option value="casamento">2ª Via da Certidão de Casamento</option>
                <option value="obito">2ª Via da Certidão de Óbito</option>
                <option value="inteiro_teor">Certidão de Inteiro Teor</option>
              </select>
            </div>
            <div class="fg">
              <label>Parentesco do Req. com o Titular:</label>
              <select id="cPar">
                <option value="">Selecione</option>
                <option>Próprio(a)</option><option>Genitor(a)</option><option>Avô/Avó</option>
                <option>Esposo(a)</option><option>Tio(a)</option><option>Tutor(a)/Curador(a)</option>
                <option>Filho(a)</option><option>Convivente</option><option>Outro(a)</option>
              </select>
            </div>
          </div>
          <div class="row">
            <div class="fg" style="flex:3;"><label>Nome Completo do Titular:</label><input type="text" id="cNome" placeholder="Deixe em branco se for o próprio requerente" oninput="this.value=this.value.toUpperCase()"></div>
            <div class="fg"><label>CPF do Titular:</label><input type="text" id="cCPF" maxlength="14" placeholder="000.000.000-00" oninput="mCPF(this)"></div>
          </div>
          <div class="row">
            <div class="fg"><label>Data de Nascimento do Titular:</label><input type="text" id="cNasc" maxlength="10" placeholder="DD/MM/AAAA" oninput="mData(this)"></div>
            <div class="fg" style="flex:2;"><label>Cartório / Ofício:</label><input type="text" id="cCartorio" oninput="this.value=capTit(this.value)"></div>
            <div class="fg"><label>Cidade / Comarca:</label><input type="text" id="cCidade" oninput="this.value=capTit(this.value)"></div>
          </div>
          <div class="row">
            <div class="fg"><label>N.º Registro / Termo:</label><input type="text" id="cNum"></div>
            <div class="fg"><label>Livro:</label><input type="text" id="cLivro" oninput="this.value=this.value.toUpperCase()"></div>
            <div class="fg"><label>Folha:</label><input type="text" id="cFolha"></div>
            <div class="fg" style="flex:2;"><label>Matrícula (opcional):</label><input type="text" id="cMatricula"></div>
          </div>
          <div style="display:flex;gap:10px;margin-top:8px;flex-wrap:wrap;">
            <button class="btn bv" onclick="salvarCert(false)">💾 Salvar e incluir nova certidão</button>
            <button class="btn bo" onclick="salvarCert(true)">✅ Salvar e concluir</button>
          </div>
        </div>
        <div id="certConcluido" style="display:none;text-align:center;padding:14px;background:var(--vc);border-radius:8px;border:1px solid var(--vm);margin-top:10px;">
          <div style="font-weight:700;color:var(--v3);margin-bottom:8px;" id="certConcluidoMsg"></div>
          <button class="btn bo bsm" onclick="reabrirCerts()">✏️ Editar certidões</button>
        </div>
      </div>

      <div class="card">
        <h2>📝 Observações para o Ofício (opcional)</h2>
        <textarea id="fObs" rows="2" style="width:100%;padding:8px;border:1px solid var(--bd);border-radius:5px;font-size:13px;" placeholder="Ex: O pedido também foi encaminhado pelo sistema CRC JUD..."></textarea>
      </div>

      <div class="gerar-area">
        <div style="font-weight:700;font-size:15px;color:var(--v3);margin-bottom:16px;">📋 Gerar Documentos</div>
        <button class="btn bv" style="padding:13px 32px;font-size:14px;border-radius:8px;" onclick="salvarEGerar()">🖨️ Salvar e Gerar PDF (Ficha + Declaração + Ofício)</button>
        <div class="limpar-area">
          <p style="font-size:12px;color:#888;margin-bottom:10px;">Os dados já salvos no histórico não serão perdidos.</p>
          <button class="btn bo bsm" onclick="limparForm()">🔄 Limpar Formulário</button>
        </div>
      </div>
    </div>

    <!-- ABA HISTÓRICO -->
    <div id="abaHist" style="display:none;">
      <div class="card">
        <h2>📚 Histórico da Jornada</h2>
        <div id="listaHist"></div>
      </div>
    </div>

    <!-- ABA BUSCA -->
    <div id="abaBusca" style="display:none;">
      <div class="card">
        <h2>🔍 Busca Global — Todas as Jornadas</h2>
        <div id="buscaAuth">
          <div style="background:#fff8e1;border-left:4px solid #f9a825;padding:10px 14px;margin-bottom:14px;font-size:12px;color:#5d4037;border-radius:0 4px 4px 0;">
            🔒 A busca global requer autenticação para proteger os dados dos assistidos.
          </div>
          <div style="display:flex;gap:10px;align-items:flex-end;flex-wrap:wrap;">
            <div class="fg" style="max-width:220px;">
              <label>Senha de acesso:</label>
              <input type="password" id="buscaSenha" placeholder="••••••••" onkeydown="if(event.key==='Enter')autenticarBusca()">
            </div>
            <button class="btn bv" style="height:38px;" onclick="autenticarBusca()">🔓 Acessar Busca</button>
          </div>
          <div class="errmsg" id="buscaErro" style="text-align:left;margin-top:8px;">❌ Senha incorreta.</div>
        </div>
        <div id="buscaPainel" style="display:none;">
          <div style="display:flex;gap:10px;flex-wrap:wrap;margin-bottom:14px;align-items:flex-end;">
            <div class="fg">
              <label>Buscar por nome (requerente ou titular):</label>
              <input type="text" id="buscaNome" placeholder="Digite parte do nome..." oninput="this.value=this.value.toUpperCase()" onkeydown="if(event.key==='Enter')executarBusca()">
            </div>
            <div class="fg" style="max-width:200px;">
              <label>Buscar por CPF:</label>
              <input type="text" id="buscaCPF" placeholder="000.000.000-00" maxlength="14" oninput="mCPF(this)" onkeydown="if(event.key==='Enter')executarBusca()">
            </div>
            <button class="btn bv" style="height:38px;padding:0 20px;" onclick="executarBusca()">🔍 Buscar</button>
            <button class="btn bo" style="height:38px;padding:0 14px;" onclick="limparBusca()">✕ Limpar</button>
          </div>
          <div id="buscaInfo" style="font-size:12px;color:#666;margin-bottom:10px;"></div>
          <div id="buscaResultados"></div>
          <div style="margin-top:24px;">
            <div style="font-weight:700;font-size:14px;color:var(--v3);border-bottom:2px solid var(--vm);padding-bottom:6px;margin-bottom:12px;">📁 Relatórios de Jornadas Encerradas</div>
            <div id="listaRelatorios"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- MODAL NOVA JORNADA -->
<div class="modal-bg" id="modalJornada">
  <div class="modal-box">
    <h2 style="margin-bottom:14px;">➕ Nova Jornada</h2>
    <div class="fg" style="margin-bottom:12px;">
      <label>Nome da Jornada:</label>
      <input type="text" id="novaJornadaNome" placeholder="Ex: Jornada de Oeiras" oninput="this.value=capTit(this.value)">
    </div>
    <div style="display:flex;gap:10px;margin-bottom:14px;">
      <button class="btn bv" style="flex:1;" onclick="criarJornada()">✅ Criar</button>
      <button class="btn bo" style="flex:1;" onclick="fecharModal()">Cancelar</button>
    </div>
    <div style="font-size:12px;font-weight:700;color:var(--v3);margin-bottom:8px;">Jornadas existentes:</div>
    <div id="listaJornadasAdmin"></div>
  </div>
</div>

<!-- BOTÃO FICHA MANUAL -->
<div class="noprint" style="position:fixed;bottom:18px;right:18px;z-index:998;">
  <button onclick="imprimirManual()" style="background:#1B5E20;color:#fff;border:none;border-radius:8px;padding:10px 14px;font-size:11px;font-weight:700;cursor:pointer;box-shadow:0 3px 10px rgba(0,0,0,.25);line-height:1.3;text-align:center;">📋 Ficha Manual<br>(caneta)</button>
</div>

<!-- ÁREA DE IMPRESSÃO -->
<div class="iprint">

  <!-- PÁG 1: FICHA + HIPO -->
  <div id="pFicha" class="qbra">
    <div class="fw">
      <div class="ftopo">
        <img id="lFicha" alt="DPE-PI">
        <div class="ftxt">
          <h2>Ficha de Atendimento</h2>
          <div class="fi">Defensoria Pública do Estado do Piauí</div>
          <div class="fs">Diretoria Itinerante</div>
          <div class="fz">Uso exclusivo do serviço · Tratamento sigiloso</div>
        </div>
      </div>
      <div class="fsec">Identificação do(a) Requerente</div>
      <div class="fl"><span class="fr">Nome Completo:</span><span class="fv" id="o_rNome"></span></div>
      <div style="display:flex;gap:8px;">
        <div style="flex:1;"><div class="fl"><span class="fr">CPF:</span><span class="fv" id="o_rCPF"></span></div></div>
        <div style="flex:1;"><div class="fl"><span class="fr">Data Nascimento:</span><span class="fv" id="o_rNasc"></span></div></div>
        <div style="flex:1;"><div class="fl"><span class="fr">Telefone:</span><span class="fv" id="o_rTel"></span></div></div>
      </div>
      <div style="display:flex;gap:8px;">
        <div style="flex:1;"><div class="fl"><span class="fr">Nome do Pai:</span><span class="fv" id="o_rPai"></span></div></div>
        <div style="flex:1;"><div class="fl"><span class="fr">Nome da Mãe:</span><span class="fv" id="o_rMae"></span></div></div>
      </div>
      <div style="display:flex;gap:8px;">
        <div style="flex:1;"><div class="fl"><span class="fr">Estado Civil:</span><span class="fv" id="o_rCivil"></span></div></div>
        <div style="flex:1;"><div class="fl"><span class="fr">Profissão:</span><span class="fv" id="o_rProf"></span></div></div>
        <div style="flex:2;"><div class="fl"><span class="fr">Renda Familiar:</span><span class="fv" id="o_rRenda"></span></div></div>
      </div>
      <div class="fl"><span class="fr">Endereço:</span><span class="fv" id="o_rEnd"></span></div>
      <div style="display:flex;gap:0;margin-top:8px;border:1px solid #A5D6A7;border-radius:3px;overflow:hidden;">
        <div style="flex:1;padding:5px 8px;border-right:2px solid #A5D6A7;">
          <div style="background:#43A047;color:#fff;padding:2px 6px;font-size:7pt;font-weight:700;text-transform:uppercase;border-radius:2px;margin-bottom:4px;">Cor / Raça (IBGE)</div>
          <div class="fopts" id="o_cor"></div>
        </div>
        <div style="flex:2;padding:5px 8px;">
          <div style="background:#2E7D32;color:#fff;padding:2px 6px;font-size:7pt;font-weight:700;text-transform:uppercase;border-radius:2px;margin-bottom:4px;">Ação Pretendida</div>
          <div class="fopts" id="o_acoes"></div>
          <div id="o_outras" style="font-size:7pt;font-style:italic;margin-top:2px;"></div>
        </div>
      </div>
      <div class="dbox">
        <div class="dtit">Declaração de Hipossuficiência</div>
        <div class="dp" id="o_declTexto"></div>
        <div class="dp">Outrossim, declaro estar ciente de que a prestação de informações falsas perante funcionário público poderá tipificar o crime de falsidade ideológica, previsto no art. 299 do Código Penal Brasileiro, cuja pena é de reclusão de 1 (um) a 5 (cinco) anos e multa.</div>
        <div class="dp"><strong>AUTORIZAÇÃO LGPD</strong> — Conforme a Lei Geral de Proteção de Dados Pessoais (Lei n.º 13.709/2018), <strong>AUTORIZO</strong> a Defensoria Pública do Estado do Piauí a incluir meus dados pessoais nas peças processuais e expedientes relacionados à assistência jurídica prestada, para fins exclusivamente legais e processuais.</div>
        <div class="dassin">
          <div style="height:28px;"></div>
          <div class="dlinha"></div>
          <div style="font-size:8pt;margin-top:2px;" id="o_rNomeAssin"></div>
          <div style="font-size:7.5pt;color:#555;">Requerente</div>
        </div>
        <div style="text-align:right;margin-top:5px;font-size:7.5pt;" id="o_dataFicha"></div>
      </div>
    </div>
  </div>

  <!-- PÁG 2: OFÍCIO -->
  <div id="pOficio">
    <div class="ow">
      <div class="ocab">
        <img id="lOficio" alt="DPE-PI">
        <div class="oct">
          <h3>Defensoria Pública do Estado do Piauí</h3>
          <div class="ou" id="o_unidade"></div>
          <div class="od">Diretoria Itinerante</div>
        </div>
      </div>
      <div class="onlrow">
        <span class="onl" id="o_numero"></span>
        <span class="odt" id="o_data"></span>
      </div>
      <div class="odest" id="o_dest"></div>
      <div class="oass"><u>Assunto:</u> <span id="o_assunto"></span></div>
      <div class="op" id="o_intro"></div>
      <div class="op" id="o_sitEcon"></div>
      <div id="o_certBlocos"></div>
      <div class="ofund">
        <strong>FUNDAMENTAÇÃO LEGAL:</strong>
        <ol>
          <li><strong>Lei n.º 9.534/1997:</strong> Garante a gratuidade das certidões de nascimento, casamento e óbito para os reconhecidamente pobres.</li>
          <li><strong>Lei n.º 1.060/1950:</strong> Assegura o acesso à justiça a pessoas em situação de vulnerabilidade econômica.</li>
          <li><strong>Lei Complementar n.º 80/1994, art. 4.º, VII:</strong> Atribui à Defensoria Pública o poder de requisitar documentos necessários à defesa dos direitos dos assistidos.</li>
        </ol>
      </div>
      <div class="op" id="o_encer"></div>
      <div id="o_obsWrap" style="display:none;"><div class="oobs" id="o_obs"></div></div>
      <div class="oassin">
        <div class="oassindt" id="o_dataAssin"></div>
        <div class="oasslin"></div>
        <div class="oasnome" id="o_defNome"></div>
        <div style="font-size:9.5pt;">Defensor(a) Público(a)</div>
        <div style="font-size:9.5pt;" id="o_defUnidade"></div>
      </div>
      <div class="orod" id="o_rodape"></div>
    </div>
  </div>

  <!-- PÁG 3: FICHA MANUAL -->
  <div id="pManual" style="display:none;">
    <div style="font-family:Arial,sans-serif;font-size:8.5pt;">
      <div style="display:flex;align-items:center;gap:12px;border-bottom:3px solid #4CAF50;padding-bottom:9px;margin-bottom:10px;">
        <img id="lManual" alt="DPE-PI" style="width:72px;height:auto;display:block;flex-shrink:0;">
        <div style="flex:1;text-align:center;">
          <div style="color:#2E7D32;font-size:12pt;font-weight:700;text-transform:uppercase;letter-spacing:.5px;">Ficha de Atendimento</div>
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
        <div style="flex:1;"><div style="font-size:7pt;font-weight:700;text-transform:uppercase;color:#2E7D32;margin-bottom:1px;">Renda Média Familiar:</div><div style="border-bottom:1px solid #aaa;min-height:20px;"></div></div>
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
          <span style="display:flex;align-items:center;gap:2px;font-size:7.5pt;"><span style="width:8px;height:8px;border:1.5px solid #43A047;display:inline-block;"></span> 2ª Via da Certidão de Nascimento</span>
          <span style="display:flex;align-items:center;gap:2px;font-size:7.5pt;"><span style="width:8px;height:8px;border:1.5px solid #43A047;display:inline-block;"></span> 2ª Via da Certidão de Casamento</span>
          <span style="display:flex;align-items:center;gap:2px;font-size:7.5pt;"><span style="width:8px;height:8px;border:1.5px solid #43A047;display:inline-block;"></span> 2ª Via da Certidão de Óbito</span>
          <span style="display:flex;align-items:center;gap:2px;font-size:7.5pt;"><span style="width:8px;height:8px;border:1.5px solid #43A047;display:inline-block;"></span> Certidão de Inteiro Teor</span>
        </div>
      </div>
      <div style="padding:8px;border:1.5px solid #66BB6A;font-size:7.5pt;line-height:1.35;text-align:justify;background:#fafff8;">
        <div style="font-weight:700;text-transform:uppercase;text-align:center;margin-bottom:6px;font-size:8.5pt;color:#2E7D32;">Declaração de Hipossuficiência</div>
        <div style="margin-bottom:6px;"><strong>DECLARO</strong>, para fins de obtenção de <strong>ASSISTÊNCIA JURÍDICA</strong> pela <strong>DEFENSORIA PÚBLICA DO ESTADO DO PIAUÍ</strong>, que sou pessoa pobre na forma da lei, não podendo arcar com as custas processuais e honorários advocatícios sem prejuízo do próprio sustento e de minha família, nos termos do art. 5.º, LXXIV, da Constituição Federal c.c. os arts. 1.º a 4.º da Lei n.º 1.060/1950 e art. 1.º da Lei n.º 7.115/1983. O(A) Requerente atua como <span style="border-bottom:1px solid #555;display:inline-block;width:110px;vertical-align:bottom;">&nbsp;</span>, auferindo renda média de R$<span style="border-bottom:1px solid #555;display:inline-block;width:130px;vertical-align:bottom;">&nbsp;</span>.</div>
        <div style="margin-bottom:6px;">Outrossim, declaro estar ciente de que a prestação de informações falsas perante funcionário público poderá tipificar o crime de falsidade ideológica, previsto no art. 299 do Código Penal Brasileiro, cuja pena é de reclusão de 1 (um) a 5 (cinco) anos e multa.</div>
        <div style="margin-bottom:6px;"><strong>AUTORIZAÇÃO LGPD</strong> — Conforme a Lei Geral de Proteção de Dados Pessoais (Lei n.º 13.709/2018), <strong>AUTORIZO</strong> a Defensoria Pública do Estado do Piauí a incluir meus dados pessoais nas peças processuais e expedientes relacionados à assistência jurídica prestada, para fins exclusivamente legais e processuais.</div>
        <div style="margin-top:28px;text-align:center;"><div style="border-top:1px solid #000;width:58%;margin:0 auto 3px;"></div><div style="font-size:7.5pt;color:#555;">Assinatura / Impressão Digital do(a) Requerente</div></div>
        <div style="text-align:right;margin-top:8px;font-size:7.5pt;"><span style="border-bottom:1px dotted #555;display:inline-block;width:110px;">&nbsp;</span>,&nbsp;<span style="border-bottom:1px dotted #555;display:inline-block;width:16px;">&nbsp;</span>&nbsp;de&nbsp;<span style="border-bottom:1px dotted #555;display:inline-block;width:70px;">&nbsp;</span>&nbsp;de&nbsp;<span style="border-bottom:1px dotted #555;display:inline-block;width:34px;">&nbsp;</span>.</div>
        <div style="margin-top:10px;border-top:1px dashed #66BB6A;padding-top:7px;">
          <div style="background:#2E7D32;color:#fff;padding:2px 6px;font-size:7pt;font-weight:700;text-transform:uppercase;border-radius:2px;margin-bottom:6px;display:inline-block;">Dados do Registro Civil — preenchimento posterior</div>
          <div style="margin-bottom:6px;"><div style="font-size:7pt;font-weight:700;text-transform:uppercase;color:#2E7D32;margin-bottom:1px;">Titular do Documento:</div><div style="border-bottom:1px solid #aaa;min-height:17px;"></div></div>
          <div style="display:flex;gap:8px;margin-bottom:6px;">
            <div style="flex:1;"><div style="font-size:7pt;font-weight:700;text-transform:uppercase;color:#2E7D32;margin-bottom:1px;">CPF do Titular:</div><div style="border-bottom:1px solid #aaa;min-height:17px;"></div></div>
            <div style="flex:1;"><div style="font-size:7pt;font-weight:700;text-transform:uppercase;color:#2E7D32;margin-bottom:1px;">Data Nascimento Titular:</div><div style="border-bottom:1px solid #aaa;min-height:17px;"></div></div>
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
var SENHA = 'DITI2027';
var LOGO_URL = 'https://raw.githubusercontent.com/dpepigpt-glitch/rr/main/public/logo-dpe.png';
var LOGO_B64 = '';
var MESES = ['janeiro','fevereiro','marco','abril','maio','junho','julho','agosto','setembro','outubro','novembro','dezembro'];
var PERFIS = [
  {id:'robert', nome:'Dr. Robert Rios Junior', unidade:'2a Defensoria Publica Itinerante', admin:true},
  {id:'adriano', nome:'Dr. Adriano Moreti Batista', unidade:'1a Defensoria Publica Itinerante', admin:false},
  {id:'alessandro', nome:'Dr. Alessandro Andrade Spindola', unidade:'Diretor da Defensoria Itinerante', admin:false}
];
var PERFIS_DISPLAY = [
  {id:'robert', nome:'Dr. Robert Rios Júnior', unidade:'2ª Defensoria Pública Itinerante', admin:true},
  {id:'adriano', nome:'Dr. Adriano Moreti Batista', unidade:'1ª Defensoria Pública Itinerante', admin:false},
  {id:'alessandro', nome:'Dr. Alessandro Andrade Spíndola', unidade:'Diretor da Defensoria Itinerante', admin:false}
];
var JORNADAS_DEFAULT = [
  {id:'cantodoburiti', nome:'Jornada de Canto do Buriti'},
  {id:'saojosedopeixe', nome:'Jornada de São José do Peixe'}
];
var sessao = null;
var certidoes = [];
var atendAtual = null;
var buscaAutenticada = false;

function mCPF(el) {
  var v = el.value.replace(/\D/g,'');
  if (v.length > 11) v = v.slice(0,11);
  v = v.replace(/(\d{3})(\d)/,'$1.$2');
  v = v.replace(/(\d{3})(\d)/,'$1.$2');
  v = v.replace(/(\d{3})(\d{1,2})$/,'$1-$2');
  el.value = v;
}
function mData(el) {
  var v = el.value.replace(/\D/g,'');
  if (v.length > 8) v = v.slice(0,8);
  v = v.replace(/(\d{2})(\d)/,'$1/$2');
  v = v.replace(/(\d{2})(\d)/,'$1/$2');
  el.value = v;
}
function mTel(el) {
  var v = el.value.replace(/\D/g,'');
  if (v.length > 11) v = v.slice(0,11);
  if (v.length <= 10) {
    v = v.replace(/(\d{2})(\d)/,'($1) $2');
    v = v.replace(/(\d{4})(\d)/,'$1-$2');
  } else {
    v = v.replace(/(\d{2})(\d)/,'($1) $2');
    v = v.replace(/(\d{5})(\d)/,'$1-$2');
  }
  el.value = v;
}
function iRenda(el) { if (!el.value) el.value = 'R$ '; }
function mRenda(el) {
  var raw = el.value.replace(/[^\d]/g,'');
  if (!raw) { el.value = 'R$ '; return; }
  var n = parseInt(raw, 10);
  var r = Math.floor(n/100);
  var c = n % 100;
  el.value = 'R$ ' + r.toString().replace(/\B(?=(\d{3})+(?!\d))/g,'.') + ',' + (c < 10 ? '0' : '') + c;
}
function capTit(s) {
  return s.replace(/(?:^|[\s\-])\S/g, function(c) { return c.toUpperCase(); });
}
function rendaNum(s) {
  if (!s || s === 'R$ ') return 0;
  return parseFloat(s.replace('R$ ','').replace(/\./g,'').replace(',','.')) || 0;
}
function porExtenso(n) {
  var u = ['zero','um','dois','tres','quatro','cinco','seis','sete','oito','nove','dez','onze','doze','treze','quatorze','quinze','dezesseis','dezessete','dezoito','dezenove'];
  var d = ['','','vinte','trinta','quarenta','cinquenta','sessenta','setenta','oitenta','noventa'];
  var c = ['','cem','duzentos','trezentos','quatrocentos','quinhentos','seiscentos','setecentos','oitocentos','novecentos'];
  function g(x) {
    if (x <= 19) return u[x];
    if (x < 100) { return d[Math.floor(x/10)] + (x%10 ? ' e ' + u[x%10] : ''); }
    var ct = Math.floor(x/100); var rx = x%100;
    if (rx === 0) return c[ct];
    if (ct === 1) return 'cento e ' + g(rx);
    return c[ct] + ' e ' + g(rx);
  }
  var reais = Math.floor(n);
  var cts = Math.round((n - reais) * 100);
  var p = [];
  if (reais > 0) {
    if (reais < 1000) { p.push(g(reais) + (reais === 1 ? ' real' : ' reais')); }
    else {
      var m = Math.floor(reais/1000); var rx = reais%1000;
      var ms = (m === 1 ? 'mil' : g(m) + ' mil');
      var str = (rx === 0 ? ms : ms + (rx < 100 ? ' e ' : ' ') + g(rx));
      p.push(str + (reais === 1 ? ' real' : ' reais'));
    }
  }
  if (cts > 0) p.push(g(cts) + (cts === 1 ? ' centavo' : ' centavos'));
  return p.join(' e ') || 'zero reais';
}
function tipoLabel(t) {
  var m = {nascimento:'2a Via da Certidao de Nascimento', casamento:'2a Via da Certidao de Casamento', obito:'2a Via da Certidao de Obito', inteiro_teor:'Certidao de Inteiro Teor'};
  return m[t] || t;
}
function tipoLabelExibir(t) {
  var m = {nascimento:'2ª Via da Certidão de Nascimento', casamento:'2ª Via da Certidão de Casamento', obito:'2ª Via da Certidão de Óbito', inteiro_teor:'Certidão de Inteiro Teor'};
  return m[t] || t;
}
function getJornadas() {
  var j = JSON.parse(localStorage.getItem('dpe_jornadas') || 'null');
  if (!j) { j = JORNADAS_DEFAULT; localStorage.setItem('dpe_jornadas', JSON.stringify(j)); }
  return j;
}
function chaveAtend(jid) { return 'dpe_atend_' + jid; }
function chaveSeq(jid) { return 'dpe_seq_' + jid; }

function carregarLogoB64() {
  var img = new Image();
  img.crossOrigin = 'anonymous';
  img.onload = function() {
    try {
      var cv = document.createElement('canvas');
      cv.width = img.naturalWidth; cv.height = img.naturalHeight;
      cv.getContext('2d').drawImage(img, 0, 0);
      LOGO_B64 = cv.toDataURL('image/png');
    } catch(e) { LOGO_B64 = LOGO_URL; }
    aplicarLogos();
  };
  img.onerror = function() { LOGO_B64 = LOGO_URL; aplicarLogos(); };
  img.src = LOGO_URL + '?t=' + Date.now();
}
function aplicarLogos() {
  var src = LOGO_B64 || LOGO_URL;
  ['lFicha','lOficio','lManual'].forEach(function(id) {
    var el = document.getElementById(id);
    if (!el) return;
    el.src = src;
    el.style.cssText = 'width:72px;height:auto;display:block;flex-shrink:0;';
  });
}

window.onload = function() {
  carregarLogoB64();
  window.addEventListener('beforeprint', function() { aplicarLogos(); });
  renderizarPerfis();
  carregarJornadasSelect();
  try {
    var s = JSON.parse(localStorage.getItem('dpe_sessao') || 'null');
    if (s && s.perfilId) { sessao = s; iniciarSistema(); }
  } catch(e) {}
  var ac8 = document.getElementById('ac8');
  if (ac8) ac8.addEventListener('change', function() {
    var el = document.getElementById('aOutras');
    if (el) el.style.display = this.checked ? 'block' : 'none';
  });
};

function renderizarPerfis() {
  var cont = document.getElementById('perfilCards');
  if (!cont) return;
  cont.innerHTML = '';
  PERFIS_DISPLAY.forEach(function(p) {
    var div = document.createElement('div');
    div.className = 'perfil-card';
    div.id = 'pc_' + p.id;
    div.innerHTML = '<span style="font-size:22px;">👤</span><div><div class="pc-nome">' + p.nome + (p.admin ? ' ⭐' : '') + '</div><div class="pc-uni">' + p.unidade + '</div></div>';
    div.onclick = function() {
      document.querySelectorAll('.perfil-card').forEach(function(x) { x.classList.remove('sel'); });
      div.classList.add('sel');
    };
    cont.appendChild(div);
  });
}
function carregarJornadasSelect() {
  var sel = document.getElementById('lgJornada');
  if (!sel) return;
  var jornadas = getJornadas();
  sel.innerHTML = '<option value="">Selecione a jornada</option>';
  jornadas.forEach(function(j) {
    var op = document.createElement('option');
    op.value = j.id; op.textContent = j.nome;
    sel.appendChild(op);
  });
}
function fazerLogin() {
  var sel = document.querySelector('.perfil-card.sel');
  if (!sel) { document.getElementById('erroLogin').style.display = 'block'; return; }
  var pid = sel.id.replace('pc_','');
  var pd = PERFIS_DISPLAY.find(function(p) { return p.id === pid; });
  var jid = document.getElementById('lgJornada').value;
  var senha = document.getElementById('lgSenha').value;
  var err = document.getElementById('erroLogin');
  if (!jid || senha !== SENHA) { err.style.display = 'block'; return; }
  err.style.display = 'none';
  var jornadas = getJornadas();
  var jornada = jornadas.find(function(j) { return j.id === jid; });
  sessao = {perfilId:pid, nome:pd.nome, unidade:pd.unidade, admin:pd.admin, jornadaId:jid, jornadaNome:jornada ? jornada.nome : jid};
  try { localStorage.setItem('dpe_sessao', JSON.stringify(sessao)); } catch(e) {}
  iniciarSistema();
}
function iniciarSistema() {
  document.getElementById('loginScreen').style.display = 'none';
  document.getElementById('dashboard').style.display = 'block';
  document.getElementById('infoSess').innerText = sessao.nome + ' | ' + sessao.jornadaNome;
  var btn = document.getElementById('btnNovaJornada');
  if (btn) btn.style.display = sessao.admin ? 'inline-block' : 'none';
  atualizarBadge();
  renderizarCertLista();
}
function sair() {
  if (confirm('Sair?')) { localStorage.removeItem('dpe_sessao'); location.reload(); }
}
function atualizarBadge() {
  var seq = parseInt(localStorage.getItem(chaveSeq(sessao.jornadaId)) || '0', 10);
  var s = String(seq + 1);
  while (s.length < 3) s = '0' + s;
  document.getElementById('badgeNum').innerText = 'Proximo: Oficio no ' + s;
}

function aba(nome) {
  ['abaNovo','abaHist','abaBusca'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.style.display = 'none';
  });
  ['tabNovo','tabHist','tabBusca'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.classList.remove('on');
  });
  var mapaAbas = {novo:'abaNovo', historico:'abaHist', busca:'abaBusca'};
  var mapaTabs = {novo:'tabNovo', historico:'tabHist', busca:'tabBusca'};
  var aEl = document.getElementById(mapaAbas[nome]);
  var tEl = document.getElementById(mapaTabs[nome]);
  if (aEl) aEl.style.display = 'block';
  if (tEl) tEl.classList.add('on');
  if (nome === 'novo') {
    document.getElementById('titPag').innerText = 'Novo Atendimento';
    if (atendAtual) {
      document.querySelectorAll('#abaNovo input[type="text"],#abaNovo textarea').forEach(function(i) { i.value = ''; });
      document.querySelectorAll('#abaNovo input[type="checkbox"],#abaNovo input[type="radio"]').forEach(function(i) { i.checked = false; });
      document.querySelectorAll('#abaNovo select').forEach(function(s) { s.value = ''; });
      var ao = document.getElementById('aOutras');
      if (ao) ao.style.display = 'none';
      certidoes = []; atendAtual = null;
      renderizarCertLista();
    }
  } else if (nome === 'historico') {
    document.getElementById('titPag').innerText = 'Historico';
    renderizarHist();
  } else if (nome === 'busca') {
    document.getElementById('titPag').innerText = 'Busca Global';
  }
}

function abrirModal() {
  renderizarListaAdmin();
  document.getElementById('modalJornada').style.display = 'flex';
}
function fecharModal() { document.getElementById('modalJornada').style.display = 'none'; }
function criarJornada() {
  var nome = (document.getElementById('novaJornadaNome').value || '').trim();
  if (!nome) { alert('Informe o nome da jornada.'); return; }
  var jornadas = getJornadas();
  var id = nome.toLowerCase().replace(/[^a-z0-9]/g,'');
  if (jornadas.find(function(j) { return j.id === id; })) { alert('Ja existe uma jornada com esse nome.'); return; }
  jornadas.push({id:id, nome:nome});
  localStorage.setItem('dpe_jornadas', JSON.stringify(jornadas));
  document.getElementById('novaJornadaNome').value = '';
  carregarJornadasSelect();
  renderizarListaAdmin();
}
function apagarJornada(id) {
  if (!confirm('Apagar jornada? Todo o historico sera perdido.')) return;
  var jornadas = getJornadas().filter(function(j) { return j.id !== id; });
  localStorage.setItem('dpe_jornadas', JSON.stringify(jornadas));
  localStorage.removeItem(chaveAtend(id));
  localStorage.removeItem(chaveSeq(id));
  carregarJornadasSelect();
  renderizarListaAdmin();
}
function renderizarListaAdmin() {
  var div = document.getElementById('listaJornadasAdmin');
  if (!div) return;
  div.innerHTML = '';
  getJornadas().forEach(function(j) {
    var item = document.createElement('div');
    item.style.cssText = 'display:flex;justify-content:space-between;align-items:center;padding:6px 0;border-bottom:1px solid #eee;font-size:12px;';
    item.innerHTML = '<span>' + j.nome + '</span><button class="btn br bsm" onclick="apagarJornada(\'' + j.id + '\')">Apagar</button>';
    div.appendChild(item);
  });
}

function renderizarCertLista() {
  var div = document.getElementById('certListaView');
  if (!div) return;
  div.innerHTML = '';
  certidoes.forEach(function(c, i) {
    var item = document.createElement('div');
    item.className = 'cert-item';
    item.innerHTML = '<span class="cert-num">' + (i+1) + '</span><strong>' + tipoLabelExibir(c.tipo) + '</strong>'
      + (c.nome ? ' - ' + c.nome : '')
      + (c.cpf ? ' | CPF: ' + c.cpf : '')
      + (c.nasc ? ' | Nasc: ' + c.nasc : '')
      + (c.cartorio ? ' | ' + c.cartorio : '')
      + (c.cidade ? ' - ' + c.cidade : '')
      + (c.num ? ' | Reg.: ' + c.num : '')
      + (c.livro ? ' | Livro: ' + c.livro : '')
      + (c.folha ? ' | Folha: ' + c.folha : '')
      + '<button class="cert-remove" onclick="removerCert(' + i + ')">X</button>';
    div.appendChild(item);
  });
  var formTit = document.getElementById('certFormTit');
  if (formTit) formTit.innerText = 'Certidao #' + (certidoes.length + 1);
  var concl = document.getElementById('certConcluido');
  var form = document.getElementById('certForm');
  var conclMsg = document.getElementById('certConcluidoMsg');
  if (certidoes.length > 0) {
    if (concl) { concl.style.display = 'block'; }
    if (conclMsg) conclMsg.innerText = certidoes.length + ' certidao(oes) cadastrada(s). Adicione mais ou gere o PDF.';
    if (form) form.style.display = 'none';
  } else {
    if (concl) concl.style.display = 'none';
    if (form) form.style.display = 'block';
  }
}
function removerCert(i) { certidoes.splice(i,1); renderizarCertLista(); }
function reabrirCerts() {
  var form = document.getElementById('certForm');
  var concl = document.getElementById('certConcluido');
  if (form) form.style.display = 'block';
  if (concl) concl.style.display = 'none';
}
function limparCertForm() {
  ['cTipo','cPar','cNome','cCPF','cNasc','cCartorio','cCidade','cNum','cLivro','cFolha','cMatricula'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.value = '';
  });
}
function coletarCert() {
  return {
    tipo: (document.getElementById('cTipo').value || '').trim(),
    par: (document.getElementById('cPar').value || '').trim(),
    nome: (document.getElementById('cNome').value || '').trim(),
    cpf: (document.getElementById('cCPF').value || '').trim(),
    nasc: (document.getElementById('cNasc').value || '').trim(),
    cartorio: (document.getElementById('cCartorio').value || '').trim(),
    cidade: (document.getElementById('cCidade').value || '').trim(),
    num: (document.getElementById('cNum').value || '').trim(),
    livro: (document.getElementById('cLivro').value || '').trim(),
    folha: (document.getElementById('cFolha').value || '').trim(),
    matricula: (document.getElementById('cMatricula').value || '').trim()
  };
}
function salvarCert(concluir) {
  var c = coletarCert();
  if (!c.tipo) { alert('Selecione o tipo de documento.'); return; }
  certidoes.push(c);
  limparCertForm();
  renderizarCertLista();
  var form = document.getElementById('certForm');
  var concl = document.getElementById('certConcluido');
  if (concluir) {
    if (form) form.style.display = 'none';
    if (concl) concl.style.display = 'block';
  } else {
    if (form) form.style.display = 'block';
    if (concl) concl.style.display = 'block';
  }
}
function coletarReq() {
  var acoes = [];
  document.querySelectorAll('input[name="acao"]:checked').forEach(function(c) { acoes.push(c.value); });
  var corEl = document.querySelector('input[name="cor"]:checked');
  return {
    nome: (document.getElementById('rNome').value || '').trim(),
    cpf: (document.getElementById('rCPF').value || '').trim(),
    nasc: (document.getElementById('rNasc').value || '').trim(),
    tel: (document.getElementById('rTel').value || '').trim(),
    civil: (document.getElementById('rCivil').value || '').trim(),
    pai: (document.getElementById('rPai').value || '').trim(),
    mae: (document.getElementById('rMae').value || '').trim(),
    prof: (document.getElementById('rProf').value || '').trim(),
    renda: (document.getElementById('rRenda').value || '').trim(),
    end: (document.getElementById('rEnd').value || '').trim(),
    cor: corEl ? corEl.value : '',
    acoes: acoes,
    outras: (document.getElementById('aOutras').value || '').trim(),
    obs: (document.getElementById('fObs').value || '').trim()
  };
}
function salvarEGerar() {
  var req = coletarReq();
  if (!req.nome) { alert('Informe o nome do(a) requerente.'); return; }
  if (certidoes.length === 0) { alert('Adicione ao menos uma certidao.'); return; }
  var lista = JSON.parse(localStorage.getItem(chaveAtend(sessao.jornadaId)) || '[]');
  var seq;
  if (atendAtual && atendAtual.seq) { seq = atendAtual.seq; }
  else { seq = parseInt(localStorage.getItem(chaveSeq(sessao.jornadaId)) || '0', 10) + 1; localStorage.setItem(chaveSeq(sessao.jornadaId), String(seq)); }
  var numStr = String(seq); while (numStr.length < 3) numStr = '0' + numStr;
  var numOficio = numStr + '/' + new Date().getFullYear() + '-DITI';
  var atend = {id: atendAtual ? atendAtual.id : Date.now(), seq:seq, numOficio:numOficio, data:new Date().toLocaleDateString('pt-BR'), sess:sessao, req:req, certs:JSON.parse(JSON.stringify(certidoes))};
  if (atendAtual) {
    var idx = lista.findIndex(function(a) { return a.id === atendAtual.id; });
    if (idx >= 0) lista[idx] = atend; else lista.push(atend);
  } else { lista.push(atend); }
  try { localStorage.setItem(chaveAtend(sessao.jornadaId), JSON.stringify(lista)); } catch(e) {}
  atendAtual = atend;
  preencherFicha(atend);
  preencherOficio(atend);
  aplicarLogos();
  atualizarBadge();
  var nomeArq = 'OF' + numStr + (sessao.jornadaNome || '').replace(/[^a-zA-Z0-9]/g,'') + '.pdf';
  var tOrig = document.title;
  document.title = nomeArq;
  setTimeout(function() { window.print(); setTimeout(function() { document.title = tOrig; }, 2000); }, 400);
}
function preencherFicha(atend) {
  var r = atend.req;
  document.getElementById('o_rNome').innerText = r.nome || '';
  document.getElementById('o_rCPF').innerText = r.cpf || '';
  document.getElementById('o_rNasc').innerText = r.nasc || '';
  document.getElementById('o_rTel').innerText = r.tel || '';
  document.getElementById('o_rCivil').innerText = r.civil || '';
  document.getElementById('o_rPai').innerText = r.pai || '';
  document.getElementById('o_rMae').innerText = r.mae || '';
  document.getElementById('o_rProf').innerText = r.prof || '';
  document.getElementById('o_rRenda').innerText = r.renda || '';
  document.getElementById('o_rEnd').innerText = r.end || '';
  var coresAll = ['Branca','Parda','Preta','Amarela','Indigena','Nao Declarar'];
  var coresExibir = ['Branca','Parda','Preta','Amarela','Indígena','Não Declarar'];
  var corDiv = document.getElementById('o_cor'); corDiv.innerHTML = '';
  coresAll.forEach(function(c, i) {
    var sp = document.createElement('span'); sp.className = 'fopt';
    sp.innerHTML = '<span class="fchk">' + (r.cor === coresExibir[i] ? '✓' : '') + '</span> ' + coresExibir[i];
    corDiv.appendChild(sp);
  });
  var acoesAll = ['Documentos','Alimentos','Guarda/Filiacao','Criminal','Saude','Interdicao/Curatela','Previdencia/INSS','Outras'];
  var acoesExibir = ['Documentos','Alimentos','Guarda/Filiação','Criminal','Saúde','Interdição/Curatela','Previdência/INSS','Outras'];
  var aDiv = document.getElementById('o_acoes'); aDiv.innerHTML = '';
  acoesAll.forEach(function(a, i) {
    var sp = document.createElement('span'); sp.className = 'fopt';
    var ok = r.acoes && r.acoes.indexOf(acoesExibir[i]) >= 0;
    sp.innerHTML = '<span class="fchk">' + (ok ? '✓' : '') + '</span> ' + acoesExibir[i];
    aDiv.appendChild(sp);
  });
  document.getElementById('o_outras').innerText = (r.outras && r.acoes && r.acoes.indexOf('Outras') >= 0) ? 'Especif.: ' + r.outras : '';
  var numRenda = rendaNum(r.renda);
  var rendaStr = (r.renda && r.renda !== 'R$ ') ? r.renda : 'R$ ____________';
  var ext = numRenda > 0 ? porExtenso(numRenda) : '____________';
  var decl = '<strong>DECLARO</strong>, para fins de obtencao de <strong>ASSISTENCIA JURIDICA</strong> pela <strong>DEFENSORIA PUBLICA DO ESTADO DO PIAUI</strong>, que sou pessoa pobre na forma da lei, nao podendo arcar com as custas processuais e honorarios advocaticios sem prejuizo do proprio sustento e de minha familia, nos termos do art. 5., LXXIV, da Constituicao Federal c.c. os arts. 1. a 4. da Lei n. 1.060/1950 e art. 1. da Lei n. 7.115/1983.';
  if (r.prof || numRenda > 0) {
    decl += ' O(A) Requerente';
    if (r.prof) decl += ' atua como <strong>' + r.prof + '</strong>,';
    decl += ' auferindo renda media de <strong>' + rendaStr + ' (' + ext + ')</strong>.';
  }
  document.getElementById('o_declTexto').innerHTML = decl;
  document.getElementById('o_rNomeAssin').innerText = capTit((r.nome || '').toLowerCase());
  var hoje = new Date();
  var cb = (atend.certs && atend.certs[0] && atend.certs[0].cidade) ? atend.certs[0].cidade.split('/')[0].trim() : '';
  document.getElementById('o_dataFicha').innerText = (cb ? cb + ', ' : '') + hoje.getDate() + ' de ' + MESES[hoje.getMonth()] + ' de ' + hoje.getFullYear() + '.';
}
function preencherOficio(atend) {
  var r = atend.req; var s = atend.sess || {}; var certs = atend.certs || [];
  document.getElementById('o_unidade').innerText = s.unidade || '';
  document.getElementById('o_numero').innerText = 'OFICIO N. ' + atend.numOficio;
  var hoje = new Date();
  var dd = String(hoje.getDate()).padStart(2,'0');
  var mm = String(hoje.getMonth()+1).padStart(2,'0');
  var cb = (certs[0] && certs[0].cidade) ? certs[0].cidade.split('/')[0].trim() : '';
  document.getElementById('o_data').innerText = (cb ? cb + ', ' : '') + dd + '-' + mm + '-' + hoje.getFullYear() + '.';
  document.getElementById('o_dataAssin').innerText = (cb ? cb + ', ' : '') + hoje.getDate() + ' de ' + MESES[hoje.getMonth()] + ' de ' + hoje.getFullYear() + '.';
  var dest = 'Ao(A) Senhor(a) Oficial(a) do ' + (certs[0] && certs[0].cartorio ? certs[0].cartorio : 'Cartorio de Registro Civil');
  if (certs[0] && certs[0].cidade) dest += ' da Comarca de ' + certs[0].cidade;
  document.getElementById('o_dest').innerText = dest;
  document.getElementById('o_assunto').innerText = certs.length === 1 ? tipoLabelExibir(certs[0].tipo) : 'Requisicao de certidao(oes) gratuita(s) - ' + certs.length + ' documentos';
  var nomeR = r.nome.toUpperCase();
  var intro = 'A Defensoria Publica do Estado do Piaui, no exercicio de suas atribuicoes constitucionais e legais, vem, respeitosamente, <strong>REQUISITAR</strong> a emissao gratuita ' + (certs.length === 1 ? 'do documento abaixo especificado' : 'dos documentos abaixo especificados') + ', em favor de <strong>' + nomeR + '</strong>, em razao da hipossuficiencia economica do(a) requerente, conforme declaracao de hipossuficiencia anexa, <strong>ISENTA(S) DE CUSTAS E EMOLUMENTOS</strong>.';
  document.getElementById('o_intro').innerHTML = intro;
  var numRenda = rendaNum(r.renda);
  var p2El = document.getElementById('o_sitEcon');
  if (r.prof || numRenda > 0) {
    var c2 = 'O(A) requerente, <strong>' + nomeR + '</strong>';
    if (r.prof) c2 += ', atua como <strong>' + r.prof + '</strong>';
    if (numRenda > 0) c2 += ', auferindo renda media de <strong>' + r.renda + ' (' + porExtenso(numRenda) + ')</strong>';
    c2 += '.';
    p2El.innerHTML = c2; p2El.style.display = 'block';
  } else { p2El.style.display = 'none'; }
  var blocos = document.getElementById('o_certBlocos'); blocos.innerHTML = '';
  certs.forEach(function(c, i) {
    var ehProprio = !c.nome || (c.par === 'Proprio(a)');
    var nomeT = ehProprio ? r.nome.toUpperCase() : (c.nome ? c.nome.toUpperCase() : r.nome.toUpperCase());
    var nascT = ehProprio ? r.nasc : c.nasc;
    var div = document.createElement('div'); div.className = 'cbloco';
    var txt = '<div class="cblocoT">' + (i+1) + '. <strong>' + tipoLabelExibir(c.tipo) + '</strong></div>';
    txt += '<div style="font-size:9.5pt;text-align:justify;">';
    txt += 'Titular: <strong>' + nomeT + '</strong>';
    if (nascT) txt += ', nascido(a) em <strong>' + nascT + '</strong>';
    if (c.cpf) txt += ', CPF <strong>' + c.cpf + '</strong>';
    var reg = [];
    if (c.num) reg.push('Registro n. <strong>' + c.num + '</strong>');
    if (c.livro) reg.push('Livro <strong>' + c.livro + '</strong>');
    if (c.folha) reg.push('Folha <strong>' + c.folha + '</strong>');
    if (reg.length) txt += '. ' + reg.join(', ');
    if (c.cartorio) txt += ', no ' + c.cartorio;
    if (c.cidade) txt += ' da Comarca de ' + c.cidade;
    if (c.matricula) txt += '. Matricula: <strong>' + c.matricula + '</strong>';
    if (!ehProprio && c.par) txt += '. Requerente: <strong>' + nomeR + '</strong> (' + c.par.toLowerCase() + ')';
    txt += '.</div>';
    div.innerHTML = txt; blocos.appendChild(div);
  });
  var enc = 'Diante do exposto, <strong>REQUISITA-SE</strong> a emissao gratuita ' + (certs.length === 1 ? 'da certidao' : 'das certidoes') + ' acima especificada' + (certs.length === 1 ? '' : 's') + ', com entrega ao(a) requerente <strong>' + nomeR + '</strong>, para fins de regularizacao dos interesses do(a) assistido(a).';
  document.getElementById('o_encer').innerHTML = enc;
  if (r.obs) { document.getElementById('o_obs').innerHTML = '* ' + r.obs; document.getElementById('o_obsWrap').style.display = 'block'; }
  else { document.getElementById('o_obsWrap').style.display = 'none'; }
  document.getElementById('o_defNome').innerText = capTit((s.nome || '').toLowerCase());
  document.getElementById('o_defUnidade').innerText = s.unidade || '';
  document.getElementById('o_rodape').innerHTML = '<strong>' + (s.unidade || '') + '</strong> &nbsp;·&nbsp; Diretoria Itinerante &nbsp;·&nbsp; ' + (s.jornadaNome || '') + '<br>Gerado em: ' + hoje.toLocaleDateString('pt-BR') + ' &nbsp;·&nbsp; Oficio n. ' + atend.numOficio;
}
function renderizarHist() {
  var lista = JSON.parse(localStorage.getItem(chaveAtend(sessao.jornadaId)) || '[]');
  var div = document.getElementById('listaHist');
  if (!lista.length) { div.innerHTML = '<p style="color:#888;font-style:italic;">Nenhum atendimento nesta jornada.</p>'; return; }
  div.innerHTML = '';
  for (var i = lista.length - 1; i >= 0; i--) {
    (function(att) {
      var item = document.createElement('div'); item.className = 'hist-item';
      var cDesc = att.certs ? att.certs.map(function(c) { return tipoLabelExibir(c.tipo); }).join(', ') : '';
      item.innerHTML = '<div><h3>' + att.numOficio + ' - ' + (att.req.nome || '') + '</h3><p>' + att.data + ' | ' + cDesc + '</p></div>'
        + '<div style="display:flex;gap:7px;">'
        + '<button class="btn bv bsm" onclick="abrirAtend(' + att.id + ')">Editar</button>'
        + '<button class="btn bv bsm" onclick="reimprimirAtend(' + att.id + ')">Imprimir</button>'
        + '<button class="btn br bsm" onclick="excluirAtend(' + att.id + ')">Excluir</button>'
        + '</div>';
      div.appendChild(item);
    })(lista[i]);
  }
}
function abrirAtend(id) {
  var lista = JSON.parse(localStorage.getItem(chaveAtend(sessao.jornadaId)) || '[]');
  var att = lista.find(function(a) { return a.id === id; });
  if (!att) return;
  atendAtual = att; var r = att.req;
  document.getElementById('rNome').value = r.nome || '';
  document.getElementById('rCPF').value = r.cpf || '';
  document.getElementById('rNasc').value = r.nasc || '';
  document.getElementById('rTel').value = r.tel || '';
  document.getElementById('rCivil').value = r.civil || '';
  document.getElementById('rPai').value = r.pai || '';
  document.getElementById('rMae').value = r.mae || '';
  document.getElementById('rProf').value = r.prof || '';
  document.getElementById('rRenda').value = r.renda || '';
  document.getElementById('rEnd').value = r.end || '';
  document.querySelectorAll('input[name="cor"]').forEach(function(x) { x.checked = (x.value === r.cor); });
  document.querySelectorAll('input[name="acao"]').forEach(function(x) { x.checked = (r.acoes && r.acoes.indexOf(x.value) >= 0); });
  document.getElementById('aOutras').value = r.outras || '';
  document.getElementById('aOutras').style.display = (r.acoes && r.acoes.indexOf('Outras') >= 0) ? 'block' : 'none';
  document.getElementById('fObs').value = r.obs || '';
  certidoes = JSON.parse(JSON.stringify(att.certs || []));
  renderizarCertLista();
  aba('novo');
  document.getElementById('titPag').innerText = 'Editando: ' + att.numOficio;
}
function reimprimirAtend(id) {
  var lista = JSON.parse(localStorage.getItem(chaveAtend(sessao.jornadaId)) || '[]');
  var att = lista.find(function(a) { return a.id === id; });
  if (!att) return;
  preencherFicha(att); preencherOficio(att); aplicarLogos();
  setTimeout(function() { window.print(); }, 300);
}
function excluirAtend(id) {
  if (!confirm('Excluir permanentemente?')) return;
  var lista = JSON.parse(localStorage.getItem(chaveAtend(sessao.jornadaId)) || '[]');
  lista = lista.filter(function(a) { return a.id !== id; });
  localStorage.setItem(chaveAtend(sessao.jornadaId), JSON.stringify(lista));
  renderizarHist(); atualizarBadge();
}
function limparForm() {
  if (!confirm('Limpar formulario?')) return;
  document.querySelectorAll('#abaNovo input[type="text"],#abaNovo textarea').forEach(function(i) { i.value = ''; });
  document.querySelectorAll('#abaNovo input[type="checkbox"],#abaNovo input[type="radio"]').forEach(function(i) { i.checked = false; });
  document.querySelectorAll('#abaNovo select').forEach(function(s) { s.value = ''; });
  document.getElementById('aOutras').style.display = 'none';
  certidoes = []; atendAtual = null;
  renderizarCertLista();
  document.getElementById('titPag').innerText = 'Novo Atendimento';
  atualizarBadge();
}
function autenticarBusca() {
  var s = (document.getElementById('buscaSenha').value || '').trim();
  var err = document.getElementById('buscaErro');
  if (s !== SENHA) { err.style.display = 'block'; document.getElementById('buscaSenha').value = ''; return; }
  err.style.display = 'none';
  buscaAutenticada = true;
  document.getElementById('buscaAuth').style.display = 'none';
  document.getElementById('buscaPainel').style.display = 'block';
  renderizarRelatorios();
}
function executarBusca() {
  if (!buscaAutenticada) return;
  var termNome = (document.getElementById('buscaNome').value || '').trim().toUpperCase();
  var termCPF = (document.getElementById('buscaCPF').value || '').trim();
  if (!termNome && !termCPF) { document.getElementById('buscaInfo').innerText = 'Informe ao menos um criterio.'; document.getElementById('buscaResultados').innerHTML = ''; return; }
  var jornadas = getJornadas();
  var resultados = [];
  jornadas.forEach(function(j) {
    var lista = JSON.parse(localStorage.getItem(chaveAtend(j.id)) || '[]');
    lista.forEach(function(att) {
      var match = false;
      if (termCPF && att.req && att.req.cpf && att.req.cpf.replace(/\D/g,'') === termCPF.replace(/\D/g,'')) match = true;
      if (termNome && att.req && att.req.nome && att.req.nome.toUpperCase().indexOf(termNome) >= 0) match = true;
      if (att.certs) {
        att.certs.forEach(function(c) {
          if (termNome && c.nome && c.nome.toUpperCase().indexOf(termNome) >= 0) match = true;
          if (termCPF && c.cpf && c.cpf.replace(/\D/g,'') === termCPF.replace(/\D/g,'')) match = true;
        });
      }
      if (match) resultados.push({jornada:j, att:att});
    });
  });
  var info = document.getElementById('buscaInfo');
  var div = document.getElementById('buscaResultados');
  if (!resultados.length) { info.innerText = 'Nenhum resultado encontrado.'; div.innerHTML = ''; return; }
  var jSet = {};
  resultados.forEach(function(r) { jSet[r.jornada.id] = true; });
  info.innerText = resultados.length + ' resultado(s) em ' + Object.keys(jSet).length + ' jornada(s).';
  div.innerHTML = '';
  var grupos = {};
  resultados.forEach(function(r) {
    if (!grupos[r.jornada.id]) grupos[r.jornada.id] = {nome:r.jornada.nome, itens:[]};
    grupos[r.jornada.id].itens.push(r.att);
  });
  Object.keys(grupos).forEach(function(jid) {
    var g = grupos[jid];
    var tit = document.createElement('div');
    tit.style.cssText = 'background:var(--v3);color:#fff;padding:5px 10px;border-radius:4px;font-size:12px;font-weight:700;margin-bottom:8px;margin-top:12px;';
    tit.innerText = g.nome + ' (' + g.itens.length + ' atendimento(s))';
    div.appendChild(tit);
    g.itens.forEach(function(att) {
      var item = document.createElement('div'); item.className = 'hist-item';
      var cDesc = att.certs ? att.certs.map(function(c) { return tipoLabelExibir(c.tipo) + (c.nome ? ' - ' + c.nome : ''); }).join(' | ') : '';
      item.innerHTML = '<div><h3>' + att.numOficio + ' - ' + (att.req && att.req.nome ? att.req.nome : '') + '</h3>'
        + '<p>' + att.data + (att.req && att.req.cpf ? ' | CPF: ' + att.req.cpf : '') + (cDesc ? ' | ' + cDesc : '') + '</p></div>'
        + '<div><button class="btn bv bsm" onclick="reimprimirBusca(\'' + jid + '\',' + att.id + ')">Reimprimir</button></div>';
      div.appendChild(item);
    });
  });
}
function reimprimirBusca(jid, id) {
  var lista = JSON.parse(localStorage.getItem(chaveAtend(jid)) || '[]');
  var att = lista.find(function(a) { return a.id === id; });
  if (!att) return;
  preencherFicha(att); preencherOficio(att); aplicarLogos();
  setTimeout(function() { window.print(); }, 300);
}
function limparBusca() {
  document.getElementById('buscaNome').value = '';
  document.getElementById('buscaCPF').value = '';
  document.getElementById('buscaInfo').innerText = '';
  document.getElementById('buscaResultados').innerHTML = '';
}
function renderizarRelatorios() {
  var relatorios = JSON.parse(localStorage.getItem('dpe_relatorios') || '[]');
  var div = document.getElementById('listaRelatorios');
  if (!relatorios.length) { div.innerHTML = '<p style="color:#888;font-style:italic;font-size:12px;">Nenhum relatorio salvo. Sao gerados ao encerrar uma jornada.</p>'; return; }
  div.innerHTML = '';
  for (var i = relatorios.length - 1; i >= 0; i--) {
    (function(rel) {
      var item = document.createElement('div');
      item.style.cssText = 'background:var(--vc);border:1px solid var(--vm);border-radius:6px;padding:12px 14px;margin-bottom:10px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;';
      item.innerHTML = '<div>'
        + '<div style="font-weight:700;font-size:13px;color:var(--v3);">' + rel.jornadaNome + '</div>'
        + '<div style="font-size:11px;color:#555;margin-top:2px;">Encerrada em ' + rel.dataEncerramento + ' as ' + rel.horaEncerramento + ' - ' + rel.totalAtend + ' atendimentos - ' + rel.totalOfic + ' oficios - ' + rel.totalDocs + ' documentos</div>'
        + '<div style="font-size:11px;color:#777;">Responsavel: ' + rel.defensor + '</div>'
        + '</div>'
        + '<div style="display:flex;gap:7px;">'
        + '<button class="btn bv bsm" onclick="reimprimirRelatorio(' + rel.id + ')">Reimprimir</button>'
        + '<button class="btn br bsm" onclick="excluirRelatorio(' + rel.id + ')">Excluir</button>'
        + '</div>';
      div.appendChild(item);
    })(relatorios[i]);
  }
}
function reimprimirRelatorio(id) {
  var relatorios = JSON.parse(localStorage.getItem('dpe_relatorios') || '[]');
  var rel = relatorios.find(function(r) { return r.id === id; });
  if (rel) imprimirRelatorio(rel);
}
function excluirRelatorio(id) {
  if (!confirm('Excluir este relatorio?')) return;
  var relatorios = JSON.parse(localStorage.getItem('dpe_relatorios') || '[]').filter(function(r) { return r.id !== id; });
  localStorage.setItem('dpe_relatorios', JSON.stringify(relatorios));
  renderizarRelatorios();
}
function encerrarJornada() {
  var s = prompt('Senha para encerrar jornada:');
  if (!s) return;
  if (s !== SENHA) { alert('Senha incorreta.'); return; }
  if (!confirm('Encerrar jornada "' + sessao.jornadaNome + '"?\nUm relatorio sera gerado antes de limpar os dados.')) return;
  var lista = JSON.parse(localStorage.getItem(chaveAtend(sessao.jornadaId)) || '[]');
  var totalDocs = 0;
  lista.forEach(function(a) { totalDocs += (a.certs ? a.certs.length : 0); });
  var relatorios = JSON.parse(localStorage.getItem('dpe_relatorios') || '[]');
  var novoRel = {
    id: Date.now(),
    jornadaId: sessao.jornadaId,
    jornadaNome: sessao.jornadaNome,
    dataEncerramento: new Date().toLocaleDateString('pt-BR'),
    horaEncerramento: new Date().toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'}),
    defensor: sessao.nome,
    unidade: sessao.unidade,
    totalAtend: lista.length,
    totalOfic: lista.length,
    totalDocs: totalDocs,
    atendimentos: lista
  };
  relatorios.push(novoRel);
  try { localStorage.setItem('dpe_relatorios', JSON.stringify(relatorios)); } catch(e) {}
  imprimirRelatorio(novoRel);
  setTimeout(function() {
    localStorage.removeItem(chaveAtend(sessao.jornadaId));
    localStorage.removeItem(chaveSeq(sessao.jornadaId));
    localStorage.removeItem('dpe_sessao');
    location.reload();
  }, 800);
}
function imprimirRelatorio(rel) {
  var logoSrc = LOGO_B64 || LOGO_URL;
  var linhas = '';
  rel.atendimentos.forEach(function(a, i) {
    var docs = (a.certs || []).map(function(c) {
      return tipoLabelExibir(c.tipo) + (c.nome && c.nome !== a.req.nome ? ' (titular: ' + capTit(c.nome.toLowerCase()) + ')' : '');
    }).join('; ');
    linhas += '<tr style="background:' + (i%2===0 ? '#F1F8E9' : '#fff') + '">'
      + '<td style="padding:5px 8px;border:1px solid #ccc;text-align:center;">' + a.numOficio + '</td>'
      + '<td style="padding:5px 8px;border:1px solid #ccc;">' + capTit((a.req.nome || '').toLowerCase()) + '</td>'
      + '<td style="padding:5px 8px;border:1px solid #ccc;text-align:center;">' + (a.req.cpf || '-') + '</td>'
      + '<td style="padding:5px 8px;border:1px solid #ccc;text-align:center;">' + (a.data || '-') + '</td>'
      + '<td style="padding:5px 8px;border:1px solid #ccc;">' + (docs || '-') + '</td>'
      + '</tr>';
  });
  var janela = window.open('','_blank','width=900,height=700');
  if (!janela) { alert('Permita popups para imprimir o relatorio.'); return; }
  var html = '<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8"><title>Relatorio ' + rel.jornadaNome + '</title>'
    + '<style>*{margin:0;padding:0;box-sizing:border-box;font-family:Arial,sans-serif;}body{padding:24px;font-size:10pt;}@page{margin:1.5cm 2cm;size:A4 portrait;}@media print{.noprint{display:none;}}</style>'
    + '</head><body>'
    + '<div style="display:flex;align-items:center;gap:14px;border-bottom:3px solid #4CAF50;padding-bottom:10px;margin-bottom:16px;">'
    + '<img src="' + logoSrc + '" style="width:70px;height:auto;" onerror="this.style.display=\'none\'">'
    + '<div style="flex:1;text-align:center;">'
    + '<div style="color:#2E7D32;font-size:13pt;font-weight:700;text-transform:uppercase;">Relatorio de Encerramento de Jornada</div>'
    + '<div style="color:#43A047;font-size:9pt;font-weight:700;margin-top:3px;">Defensoria Publica do Estado do Piaui - Diretoria Itinerante</div>'
    + '</div></div>'
    + '<div style="display:flex;gap:12px;margin-bottom:16px;flex-wrap:wrap;">'
    + '<div style="flex:1;background:#F1F8E9;border:1px solid #C8E6C9;border-radius:6px;padding:10px 14px;">'
    + '<div style="font-size:8pt;font-weight:700;text-transform:uppercase;color:#2E7D32;margin-bottom:4px;">Jornada</div>'
    + '<div style="font-size:10pt;font-weight:700;">' + rel.jornadaNome + '</div>'
    + '<div style="font-size:8.5pt;color:#555;margin-top:3px;">Encerrada em ' + rel.dataEncerramento + ' as ' + rel.horaEncerramento + '</div>'
    + '</div>'
    + '<div style="flex:1;background:#F1F8E9;border:1px solid #C8E6C9;border-radius:6px;padding:10px 14px;">'
    + '<div style="font-size:8pt;font-weight:700;text-transform:uppercase;color:#2E7D32;margin-bottom:4px;">Responsavel</div>'
    + '<div style="font-size:10pt;font-weight:700;">' + rel.defensor + '</div>'
    + '<div style="font-size:8.5pt;color:#555;margin-top:3px;">' + rel.unidade + '</div>'
    + '</div></div>'
    + '<div style="display:flex;gap:12px;margin-bottom:20px;">'
    + '<div style="flex:1;text-align:center;background:#2E7D32;color:#fff;border-radius:8px;padding:12px;">'
    + '<div style="font-size:22pt;font-weight:700;">' + rel.totalAtend + '</div><div style="font-size:8.5pt;margin-top:2px;">Atendimentos</div></div>'
    + '<div style="flex:1;text-align:center;background:#43A047;color:#fff;border-radius:8px;padding:12px;">'
    + '<div style="font-size:22pt;font-weight:700;">' + rel.totalOfic + '</div><div style="font-size:8.5pt;margin-top:2px;">Oficios Expedidos</div></div>'
    + '<div style="flex:1;text-align:center;background:#66BB6A;color:#fff;border-radius:8px;padding:12px;">'
    + '<div style="font-size:22pt;font-weight:700;">' + rel.totalDocs + '</div><div style="font-size:8.5pt;margin-top:2px;">Documentos Solicitados</div></div>'
    + '</div>'
    + '<div style="font-weight:700;font-size:10pt;color:#2E7D32;margin-bottom:8px;">Relacao de Atendimentos</div>'
    + '<table style="width:100%;border-collapse:collapse;font-size:8.5pt;">'
    + '<thead><tr style="background:#2E7D32;color:#fff;">'
    + '<th style="padding:6px 8px;border:1px solid #aaa;text-align:center;">Oficio</th>'
    + '<th style="padding:6px 8px;border:1px solid #aaa;text-align:left;">Requerente</th>'
    + '<th style="padding:6px 8px;border:1px solid #aaa;text-align:center;">CPF</th>'
    + '<th style="padding:6px 8px;border:1px solid #aaa;text-align:center;">Data</th>'
    + '<th style="padding:6px 8px;border:1px solid #aaa;text-align:left;">Documentos Solicitados</th>'
    + '</tr></thead><tbody>' + linhas + '</tbody></table>'
    + '<div style="margin-top:50px;text-align:center;">'
    + '<div style="border-top:1px solid #000;width:55%;margin:0 auto 4px;"></div>'
    + '<div style="font-weight:700;font-size:10pt;">' + capTit(rel.defensor.toLowerCase()) + '</div>'
    + '<div style="font-size:9pt;">Defensor(a) Publico(a)</div>'
    + '<div style="font-size:9pt;">' + rel.unidade + '</div>'
    + '</div>'
    + '<div style="border-top:1px solid #ccc;margin-top:20px;padding-top:6px;font-size:7.5pt;color:#555;text-align:center;">Relatorio gerado pelo Sistema de Oficios - DPE-PI - Diretoria Itinerante</div>'
    + '<div class="noprint" style="text-align:center;margin-top:20px;"><button onclick="window.print()" style="background:#2E7D32;color:#fff;border:none;padding:10px 28px;border-radius:6px;font-size:13px;font-weight:700;cursor:pointer;">Imprimir Relatorio</button></div>'
    + '</body></html>';
  janela.document.write(html);
  janela.document.close();
  janela.onload = function() { janela.print(); };
}
function imprimirManual() {
  var pf = document.getElementById('pFicha');
  var po = document.getElementById('pOficio');
  var pm = document.getElementById('pManual');
  if (pf) pf.style.display = 'none';
  if (po) po.style.display = 'none';
  if (pm) pm.style.display = 'block';
  aplicarLogos();
  var tOrig = document.title;
  document.title = 'Fichamodelo.pdf';
  window.print();
  setTimeout(function() {
    if (pf) pf.style.display = '';
    if (po) po.style.display = '';
    if (pm) pm.style.display = 'none';
    document.title = tOrig;
  }, 1200);
}
</script>
</body>
</html>
