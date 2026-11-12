/* MODELED-EN */
/* telas-extra.js: módulos do Premium (Desafio de 7 dias, Compras, Checklist semanal). */

/* observações dos dados: mostra só as frases para a leitora (tira notas técnicas de extração) */
function obsLimpa(t) {
  if (!t) return '';
  return String(t).split(/(?<=\.)\s+/).filter(function (f) {
    return !/PDF|texto extra[ií]do|pareamento|ordem de leitura/i.test(f);
  }).join(' ');
}
function obsHTML(t) { var x = obsLimpa(t); return x ? '<p class="obs">' + esc(x) + '</p>' : ''; }
function seloHTML(s) {
  if (!s) return '';
  return String(s).split('/').map(function (p) {
    p = p.trim(); var c = norm(p);
    return '<span class="selo s-' + esc(c) + '">' + esc(p) + '</span>';
  }).join('');
}
function marcavel(grupo, chave, titulo, detalhe, marcado, extra) {
  return '<li class="marcavel">' + ck('data-acao="marca" data-g="' + grupo + '" data-k="' + esc(chave) + '" id="m-' + grupo + '-' + esc(chave) + '"', marcado, titulo) +
    '<div class="corpo"><div class="t">' + esc(titulo) + (extra || '') + '</div>' + (detalhe ? '<div class="d">' + detalhe + '</div>' : '') + '</div></li>';
}
function marcado(grupo, chave) { var g = S[grupo] || {}; return !!g[chave]; }
function escala5(grupo, sub, item, valor) {
  var h = '<div class="nota5"><div class="rot">' + esc(item) + '</div><div class="seg" role="group" aria-label="' + esc(item) + '">';
  for (var n = 1; n <= 5; n++) h += '<button data-acao="escala" data-g="' + grupo + '" data-sub="' + esc(sub) + '" data-item="' + esc(item) + '" data-v="' + n + '" aria-pressed="' + (valor === n ? 'true' : 'false') + '">' + n + '</button>';
  return h + '</div></div>';
}
function sub(grupo, k) { S[grupo] = S[grupo] || {}; if (!S[grupo][k] || typeof S[grupo][k] !== 'object') S[grupo][k] = {}; return S[grupo][k]; }
function campoTexto(grupo, k, rotulo, valor, id) {
  return '<label class="lbl" for="' + id + '">' + esc(rotulo) + '</label><textarea id="' + id + '" data-campo="texto" data-g="' + grupo + '" data-k="' + esc(k) + '">' + esc(valor || '') + '</textarea>';
}

/* ---------- Desafio de 7 dias ---------- */
function telaDesafio() {
  var D = DESAFIO, atual = diaAtual();
  if (UI.desafioDia == null) UI.desafioDia = atual && atual <= 7 ? atual : 0;
  var sel = UI.desafioDia;
  var h = topo('materials') + '<section class="hero desafio-hero"><p class="kicker">Premium · guided mode</p><h1>' + esc(D.titulo) + '</h1><p class="mt">' + esc(D.subtitulo) + '</p>' +
    '<div class="linha-info"><span class="chip-d">' + ico('sol') + 'Morning ' + esc(D.intro.ritmoPorDia.manha) + '</span><span class="chip-d">' + ico('lua') + 'Evening ' + esc(D.intro.ritmoPorDia.noite) + '</span></div>' +
    '<div class="nao-promessa">' + ico('alerta') + '<span><b>A sequence of care steps, with no promise of results.</b> ' + esc(D.balancoFinal.lembrete) + '</span></div></section>';
  h += '<div class="dsel" role="group" aria-label="Choose a Challenge day">' +
    '<button data-acao="d-dia" data-v="0" aria-pressed="' + (sel === 0) + '"><b>0</b>Day before</button>' +
    D.dias.map(function (d) { return '<button data-acao="d-dia" data-v="' + d.n + '" aria-pressed="' + (sel === d.n) + '"><b>' + d.n + '</b>' + (atual === d.n ? 'today' : 'day') + '</button>'; }).join('') +
    '<button data-acao="d-dia" data-v="8" aria-pressed="' + (sel === 8) + '"><b>' + ico('check') + '</b>Review</button></div>';
  if (sel === 0) h += desafioVespera();
  else if (sel === 8) h += desafioBalanco();
  else h += desafioDia(D.dias[sel - 1], atual);
  h += desafioAjuda();
  return h + rodape();
}
function desafioIntro() {
  var I = DESAFIO.intro;
  return '<div class="card"><h3>' + esc(I.boasVindas.titulo) + '</h3><p>' + esc(I.boasVindas.texto) + '</p><p class="hand mt">' + esc(I.boasVindas.fecho) + '</p></div>' +
    '<div class="card"><h3>' + esc(I.comoFunciona.titulo) + '</h3><p class="muted">' + esc(I.comoFunciona.subtitulo) + '</p>' +
    I.comoFunciona.combinados.map(function (c) { return '<div class="regra"><span class="n">' + c.n + '</span><div><b>' + esc(c.titulo) + '</b>' + esc(c.texto) + '</div></div>'; }).join('') + '</div>' +
    '<div class="card pastel"><h3>' + esc(I.sobreODesafio.titulo) + '</h3><p><b>Pace:</b> ' + esc(I.sobreODesafio.ritmo) + '</p><p class="mt"><b>A good choice for:</b> ' + esc(I.sobreODesafio.boaEscolhaPara) + '</p><p class="mt">' + esc(I.sobreODesafio.umCaminhoPorVez) + '</p>' +
    '<h3 class="mt">The 7 days at a glance</h3>' + listaOL(I.diasEmUmOlhar.map(function (d) { return d.titulo; })) + '</div>';
}
function desafioVespera() {
  var V = DESAFIO.vespera, sd = sub('desafio', 'partida');
  var h = desafioIntro() + '<section class="secao"><h2>' + esc(DESAFIO.diaZero.titulo) + '</h2><p class="sub">' + esc(DESAFIO.diaZero.subtitulo) + '</p>' +
    '<div class="card"><h3>' + esc(V.testeDeContato.titulo) + '</h3><p>' + esc(V.testeDeContato.instrucao) + '</p><ul class="marcaveis">' +
    V.testeDeContato.ingredientes.map(function (i, k) { return marcavel('desafio', 'teste-' + k, i, '', marcado('desafio', 'teste-' + k)); }).join('') + '</ul></div>' +
    '<div class="card"><h3>' + esc(V.prepareHoje.titulo) + '</h3>' + V.prepareHoje.itens.map(function (it) {
      return '<p class="mt"><b>' + esc(it.nome) + '</b><br>' + esc(it.texto) + '</p><div class="rlinks">' + rlink(it.receita) + '</div>';
    }).join('') + '<p class="peq muted mt">' + esc(V.prepareHoje.nota) + '</p></div>' +
    '<div class="card"><h3>' + esc(V.pontoDePartida.titulo) + '</h3><p class="muted">' + esc(V.pontoDePartida.instrucao) + '</p><div class="notas5">' +
    V.pontoDePartida.itens.map(function (it) { return escala5('desafio', 'partida', it, sd[it]); }).join('') + '</div><p class="peq muted mt">' + esc(V.pontoDePartida.fotoOpcional) + '</p></div>';
  var LC = V.listaDeCompras;
  function lc(arr, p) {
    return '<ul class="marcaveis">' + arr.map(function (it, k) {
      var det = esc(it.para) + '<br>You will use: ' + esc(it.vaiUsar) + ' · Buy: ' + esc(it.compre);
      return marcavel('desafio', 'lc-' + p + k, it.item, det, marcado('desafio', 'lc-' + p + k), seloHTML(it.tag));
    }).join('') + '</ul>';
  }
  h += '<div class="card"><h3>' + esc(LC.titulo) + '</h3><p class="muted">' + esc(LC.subtitulo) + '</p><h3 class="mt">Grocery store and farmers market</h3>' + lc(LC.mercadoEFeira, 'm') +
    '<h3 class="mt">Pharmacy and health food stores</h3>' + lc(LC.farmaciaELojasNaturais, 'f') + '<p class="peq muted mt">' + esc(LC.nota) + '</p></div>' +
    '<div class="card"><h3>' + esc(V.receitasDaVespera.titulo) + '</h3><p class="muted">' + esc(V.receitasDaVespera.subtitulo) + '</p><div class="rlinks">' + V.receitasDaVespera.receitas.map(rlink).join('') + '</div></div>' +
    '<div class="card"><h3>' + esc(V.utensilios.titulo) + '</h3>' + listaUL(V.utensilios.itens) + '</div>' +
    '<div class="card"><h3>' + esc(V.checklist.titulo) + '</h3><ul class="marcaveis">' + V.checklist.itens.map(function (i, k) { return marcavel('desafio', 'vchk-' + k, i, '', marcado('desafio', 'vchk-' + k)); }).join('') + '</ul></div></section>';
  return h;
}
function desafioDia(dd, atual) {
  function bloco(b, qual) {
    return '<div class="card"><h3>' + ico(qual === 'manha' ? 'sol' : 'lua') + ' ' + (qual === 'manha' ? 'Morning' : 'Evening') + ' · ' + esc(b.nome) + '</h3><p class="peq muted">' + esc(b.duracao) + '</p><ol class="lista">' +
      b.passos.map(function (p) { return '<li><b>' + esc(p.titulo) + '</b><br>' + esc(p.texto) + (p.receitas.length ? '<div class="rlinks">' + p.receitas.map(rlink).join('') + '</div>' : '') + '</li>'; }).join('') + '</ol></div>';
  }
  var resp = sub('desafio', 'd' + dd.n);
  var h = '<section class="secao"><p class="kicker">Day ' + dd.n + ' of 7</p><h2>' + esc(dd.titulo) + '</h2><p class="sub">' + esc(dd.foco) + '</p><p class="mt">' + esc(dd.porQueHoje) + '</p>';
  if (atual && dd.n <= atual) h += '<div class="btns"><a class="btn block" href="#dia-' + dd.n + '">Check off the steps on the Today screen' + ico('seta') + '</a></div>';
  h += bloco(dd.manha, 'manha') + bloco(dd.noite, 'noite');
  h += '<div class="card"><h3>Prep the night before</h3><p class="peq muted">For the next day, before bed.</p>' + dd.preparoNaVespera.map(function (p) {
    return '<p class="mt"><b>' + esc(p.quando) + ':</b> ' + esc(p.texto) + '</p>' + (p.receitas && p.receitas.length ? '<div class="rlinks">' + p.receitas.map(rlink).join('') + '</div>' : '');
  }).join('') + '</div>';
  h += '<div class="card"><h3>Today\'s recipes</h3><div class="rlinks">' + dd.receitasDoDia.map(rlink).join('') + '</div></div>';
  h += '<div class="card pastel"><h3>Today\'s self-care gesture: ' + esc(dd.gestoDoDia.titulo) + '</h3><p>' + esc(dd.gestoDoDia.texto) + '</p></div>';
  h += '<div class="card pastel"><h3>If your day gets busy</h3><p>' + esc(dd.seODiaApertar) + '</p></div>';
  (dd.observacoes || []).forEach(function (o) { h += '<div class="aviso-lim">' + ico('alerta') + '<span>' + esc(o) + '</span></div>'; });
  h += '<div class="card"><h3>Notes to make</h3>' + dd.perguntasParaAnotar.map(function (q, i) {
    if (/!\s*$/.test(q)) return '<ul class="marcaveis">' + marcavel('desafio', 'fiz-' + dd.n, q, '', marcado('desafio', 'fiz-' + dd.n)) + '</ul>';
    return campoTexto('desafio', 'd' + dd.n + '.' + i, q, resp[i], 'dq-' + dd.n + '-' + i);
  }).join('') + '</div></section>';
  return h;
}
function desafioBalanco() {
  var B = DESAFIO.balancoFinal, resp = sub('desafio', 'fim'), cmp = sub('desafio', 'compara'), partida = sub('desafio', 'partida');
  var h = '<section class="secao"><h2>' + esc(B.titulo) + '</h2><p class="sub">' + esc(B.subtitulo) + '</p>' +
    '<div class="card"><h3>My 7 days</h3><ul class="marcaveis">' + DESAFIO.intro.diasEmUmOlhar.map(function (d) {
      return marcavel('desafio', 'meus7-' + d.n, 'Day ' + d.n + ' · ' + d.titulo, '', marcado('desafio', 'meus7-' + d.n));
    }).join('') + '</ul></div>' +
    '<div class="card">' + B.perguntas.map(function (q, i) { return campoTexto('desafio', 'fim.' + i, q, resp[i], 'bf-' + i); }).join('') + '</div>' +
    '<div class="card"><h3>Compare with Day 0</h3><p class="muted">' + esc(B.compareComODia0.instrucao) + '</p><div class="notas5">' +
    B.compareComODia0.itens.map(function (it) {
      return escala5('desafio', 'compara', it, cmp[it]) + (partida[it] ? '<p class="peq muted">On Day 0, you selected ' + partida[it] + '.</p>' : '');
    }).join('') + '</div></div>' +
    '<div class="card"><h3>My next step</h3><ul class="marcaveis">' + B.meuProximoPasso.map(function (p, i) { return marcavel('desafio', 'prox-' + i, p, '', marcado('desafio', 'prox-' + i)); }).join('') + '</ul></div>' +
    '<p class="peq muted mt">' + esc(B.lembrete) + '</p>';
  var O = B.oQueVemDepois;
  h += '<div class="card pastel"><h3>' + esc(O.titulo) + '</h3><p class="muted">' + esc(O.subtitulo) + '</p>' + O.opcoes.map(function (o) {
    return '<p class="mt"><b>' + o.n + '. ' + esc(o.titulo) + '</b><br>' + esc(o.texto) + '</p>';
  }).join('') + '<div class="btns"><a class="btn ghost block" href="#g-objetivos">Choose a routine by goal</a><a class="btn ghost block" href="#g-essenciais">View the 6 Essential Rituals</a></div></div>' +
    '<div class="card"><h3>How long each preparation lasts</h3><div class="tabela-mini">' + O.quantoDuraCadaPreparo.map(function (q) { return '<div><b>' + esc(q.preparo) + '</b><span>' + esc(q.validade) + '</span></div>'; }).join('') + '</div></div>' +
    '<div class="card plano-card"><h3>' + esc(O.fechamento.titulo) + '</h3><p>' + esc(O.fechamento.texto) + '</p></div>';

  return h + '</section>';
}
function desafioAjuda() {
  var A = DESAFIO.seOdiaApertar, V = A.versaoEssencial;
  var h = '<details class="dobra mt2"><summary><span>' + esc(A.titulo) + ' · ' + esc(A.subtitulo) + '</span>' + ico('seta') + '</summary><div class="dentro">' +
    ['diaCorrido', 'esqueciUmDia', 'peleReagiu'].map(function (k) { return '<p class="mt"><b>' + esc(V[k].titulo) + '</b><br>' + esc(V[k].texto) + '</p>'; }).join('') +
    '<h3 class="mt">' + esc(A.trocas.titulo) + '</h3><div class="tabela-mini">' + A.trocas.itens.map(function (t) {
      return '<div><b>' + esc(t.emVezDe) + ' → ' + esc(t.podeUsar) + '</b><span>' + esc(t.emQualReceita) + '</span></div>';
    }).join('') + '</div>' +
    '<h3 class="mt">' + esc(A.cadaPeleUmAjuste.titulo) + '</h3>' + A.cadaPeleUmAjuste.itens.map(function (i) { return '<p class="mt"><b>' + esc(i.pele) + ':</b> ' + esc(i.texto) + '</p>'; }).join('') +
    '<p class="mt">' + esc(A.cadaPeleUmAjuste.usarComOutrosProdutos) + '</p></div></details>' +
    '<details class="dobra"><summary><span>All Challenge precautions (' + DESAFIO.avisos.length + ')</span>' + ico('seta') + '</summary><div class="dentro">' + listaUL(DESAFIO.avisos) + '</div></details>';
  return h;
}

/* ---------- Compras ---------- */
function telaCompras() {
  var C = COMPRAS, aba = UI.comprasAba;
  var abas = [['kit', 'Starter kit'], ['semanas', 'By week'], ['mestra', 'Master list'], ['utensilios', 'Tools'], ['dicas', 'Tips']];
  var h = topo('materials') + '<p class="kicker">Premium</p><h1>' + esc(C.titulo) + '</h1><p class="mt">' + esc(C.subtitulo.charAt(0).toUpperCase() + C.subtitulo.slice(1)) + '.</p>' +
    '<div class="card pastel"><h3>' + esc(C.boasVindas.titulo) + '</h3><p>' + esc(C.boasVindas.destaque) + '</p><p class="peq muted mt">' + esc(C.comoUsar.marcar) + '</p></div>' +
    '<div class="abas" role="group" aria-label="Lists">' + abas.map(function (a) { return '<button data-acao="c-aba" data-v="' + a[0] + '" aria-pressed="' + (aba === a[0]) + '">' + a[1] + '</button>'; }).join('') + '</div>';
  if (aba === 'kit') h += comprasKit();
  else if (aba === 'semanas') h += comprasSemanas();
  else if (aba === 'mestra') h += comprasMestra();
  else if (aba === 'utensilios') h += comprasUtensilios();
  else h += comprasDicas();
  h += '<details class="dobra mt2"><summary><span>Legend and measurements</span>' + ico('seta') + '</summary><div class="dentro"><div class="tabela-mini">' +
    C.comoUsar.legenda.filter(function (l) { return !/^S1/.test(l.selo); }).map(function (l) { return '<div><b>' + esc(l.selo) + '</b><span>' + esc(l.significado) + '</span></div>'; }).join('') +
    '</div><p class="mt peq">' + esc(C.comoUsar.medidas) + '</p><p class="mt peq muted">' + esc(C.comoUsar.comoCalculamos) + '</p></div></details>' +
    '<p class="peq muted mt">' + esc(C.avisoLegal) + '</p>';
  return h + rodape();
}
function itemCompra(k, it, qtd) {
  var det = [];
  if (it.para) det.push(esc(it.para));
  if (it.uso) det.push(esc(it.uso));
  if (qtd) det.push(qtd);
  if (it.quando) det.push('When: ' + esc(it.quando));
  if (it.compre) det.push('Buy: ' + esc(it.compre));
  return marcavel('compras', k, it.item, det.join('<br>'), marcado('compras', k), seloHTML(it.selo));
}
function comprasKit() {
  var K = COMPRAS.kitInicial;
  return '<div class="card"><h3>' + esc(K.titulo) + '</h3><p class="muted">' + esc(K.subtitulo) + '</p><p class="mt">' + esc(K.descricao) + '</p><ul class="marcaveis">' +
    K.itens.map(function (it, i) { return itemCompra('kit-' + i, it) + ''; }).join('') + '</ul>' + obsHTML(K.observacoes) + '</div>' +
    '<div class="card"><h3>Essential tools</h3><ul class="marcaveis">' + K.utensiliosMinimos.map(function (u, i) { return marcavel('compras', 'kitu-' + i, u, '', marcado('compras', 'kitu-' + i)); }).join('') + '</ul></div>' +
    '<div class="card"><h3>Items you already have at home</h3><ul class="marcaveis">' + K.jaTemEmCasa.map(function (u, i) { return marcavel('compras', 'kitc-' + i, u.item, esc(u.nota), marcado('compras', 'kitc-' + i)); }).join('') + '</ul></div>' +
    '<div class="atencao">' + ico('alerta') + '<div><b>Patch test</b>' + esc(K.testeDeContato) + '</div></div>';
}
function comprasSemanas() {
  var h = obsHTML(COMPRAS.observacoes);
  COMPRAS.semanas.forEach(function (s) {
    h += '<div class="card"><p class="kicker">Week ' + s.numero + ' · ' + esc(s.dias) + '</p><h3>' + esc(s.titulo) + '</h3><p class="peq muted">Buy by: ' + esc(s.compreAte) + '</p>' +
      '<h3 class="mt">Grocery store and farmers market</h3><ul class="marcaveis">' + s.mercadoEFeira.map(function (it, i) { return itemCompra('s' + s.numero + 'm-' + i, it, it.quantidade ? 'Quantity: ' + esc(it.quantidade) : ''); }).join('') + '</ul>' +
      '<h3 class="mt">Pharmacy and health food stores</h3><ul class="marcaveis">' + s.farmaciaELojasNaturais.map(function (it, i) { return itemCompra('s' + s.numero + 'f-' + i, it, it.quantidade ? 'Quantity: ' + esc(it.quantidade) : ''); }).join('') + '</ul>' +
      (s.planejeASemana ? '<p class="mt"><b>Plan your week:</b> ' + esc(s.planejeASemana) + '</p>' : '') +
      (s.utensiliosDaSemana ? '<p class="mt"><b>This week\'s tools:</b> ' + esc(s.utensiliosDaSemana) + '</p>' : '') + obsHTML(s.observacoes) + '</div>';
  });
  return h;
}
function comprasMestra() {
  var L = COMPRAS.listaMestra, M = L.mercadoEFeira, F = L.farmaciaELojasNaturais;
  function lista(arr, p) { return '<ul class="marcaveis">' + arr.map(function (it, i) { return itemCompra('lm' + p + '-' + i, it, it.vaiUsarEm21Dias ? 'You will use over 21 days: ' + esc(it.vaiUsarEm21Dias) : ''); }).join('') + '</ul>'; }
  return '<div class="card"><h3>' + esc(L.titulo) + '</h3><p class="muted">' + esc(L.subtitulo) + '</p>' + obsHTML(L.observacoes) + '</div>' +
    '<div class="card"><h3>' + esc(M.titulo) + '</h3>' + (M.subtitulo ? '<p class="muted">' + esc(M.subtitulo) + '</p>' : '') +
    '<h3 class="mt">' + esc(M.despensa.titulo) + '</h3>' + lista(M.despensa.itens, 'd') + '<h3 class="mt">' + esc(M.frescos.titulo) + '</h3>' + lista(M.frescos.itens, 'r') + '</div>' +
    '<div class="card"><h3>' + esc(F.titulo) + '</h3><p class="muted">' + esc(F.subtitulo) + '</p>' + lista(F.itens, 'f') +
    '<p class="mt peq">' + esc(F.ondeAcharCadaItem) + '</p><p class="mt peq muted">' + esc(F.rosaMosquetaOpcional) + '</p></div>';
}
function comprasUtensilios() {
  var U = COMPRAS.utensilios;
  return '<div class="card"><h3>' + esc(U.titulo) + '</h3><p class="muted">' + esc(U.subtitulo) + '</p><ul class="marcaveis">' +
    U.kit.map(function (u, i) { return marcavel('compras', 'ut-' + i, u.item, esc(u.paraQue) + (u.quando ? '<br>When: ' + esc(u.quando) : ''), marcado('compras', 'ut-' + i)); }).join('') + '</ul>' +
    '<p class="mt"><b>Hygiene:</b> ' + esc(U.higiene) + '</p><p class="mt"><b>Tip:</b> ' + esc(U.dica) + '</p>' + obsHTML(U.observacoes) + '</div>';
}
function comprasDicas() {
  var P = COMPRAS.comoEscolherNaPrateleira, CV = COMPRAS.conservacaoEValidade, T = COMPRAS.trocasECuidados;
  function prat(arr) { return arr.map(function (x) { return '<div class="card"><h3>' + esc(x.item) + '</h3>' + (x.lugar ? '<p class="peq muted">' + esc(x.lugar) + '</p>' : '') + '<p class="mt"><b>Look for:</b> ' + esc(x.procure) + '</p><p class="mt"><b>Avoid:</b> ' + esc(x.evite) + '</p></div>'; }).join(''); }
  return '<section class="secao"><h2>' + esc(P.titulo) + '</h2><p class="sub">' + esc(P.subtitulo) + '</p>' + prat(P.farmaciaELojasNaturais) + prat(P.mercadoEEmCasa) + '</section>' +
    '<section class="secao"><h2>' + esc(CV.titulo) + '</h2><p class="sub">' + esc(CV.subtitulo) + '</p><div class="card"><div class="tabela-mini">' +
    CV.preparos.map(function (p) { return '<div><b>' + esc(p.preparo) + '</b><span>' + esc(p.dura) + '<br>' + esc(p.ondeGuardar) + '</span></div>'; }).join('') + '</div>' + obsHTML(CV.observacoes) + '</div>' +
    '<div class="card"><h3>Storing your purchases</h3>' + listaUL(CV.guardandoOQueComprou) + '<h3 class="mt">When to discard</h3>' + listaUL(CV.quandoDescartar) + '</div></section>' +
    '<section class="secao"><h2>' + esc(T.titulo) + '</h2><p class="sub">' + esc(T.subtitulo) + '</p><div class="card"><div class="tabela-mini">' +
    T.trocas.map(function (t) { return '<div><b>' + esc(t.emVezDe) + ' → ' + esc(t.podeUsar) + '</b><span>' + esc(t.receitaOuUso) + '</span></div>'; }).join('') + '</div></div>' +
    '<div class="card"><h3>Allergies</h3>' + listaUL(T.alergias) + '<p class="mt">' + esc(T.naoAchouUmItem) + '</p></div></section>' +
    '<div class="card plano-card"><h3>' + esc(COMPRAS.encerramento.titulo) + '</h3><p>' + esc(COMPRAS.encerramento.texto) + '</p></div>';
}

/* ---------- Checklist semanal ---------- */
function telaChecklist() {
  var C = CHECKLIST, aba = UI.checkAba;
  var abas = [['folha', 'Weekly sheet'], ['cardapio', 'Recipe menu'], ['modelos', 'Templates'], ['estoque', 'Inventory'], ['mes', 'Monthly review'], ['como', 'How to use']];
  var h = topo('materials') + '<p class="kicker">Premium</p><h1>' + esc(C.titulo) + '</h1><p class="mt">' + esc(C.subtitulo.charAt(0).toUpperCase() + C.subtitulo.slice(1)) + '.</p>' +
    '<div class="abas" role="group" aria-label="Checklist sections">' + abas.map(function (a) { return '<button data-acao="k-aba" data-v="' + a[0] + '" aria-pressed="' + (aba === a[0]) + '">' + a[1] + '</button>'; }).join('') + '</div>';
  if (aba === 'folha') h += checkFolha();
  else if (aba === 'cardapio') h += checkCardapio();
  else if (aba === 'modelos') h += checkModelos();
  else if (aba === 'estoque') h += checkEstoque();
  else if (aba === 'mes') h += checkMes();
  else h += checkComo();
  h += '<p class="peq muted mt">' + esc(C.avisoLegal) + '</p>';
  return h + rodape();
}
function checkFolha() {
  var F = CHECKLIST.folhaSemanal, sem = UI.checkSemana, dia = UI.checkDia, info = sub('checklist', 'sem' + sem);
  var h = '<div class="card pastel"><h3>' + esc(CHECKLIST.regrasDeUsoComPlanoGuiado.titulo) + '</h3>' + listaUL(CHECKLIST.regrasDeUsoComPlanoGuiado.regras) + '</div>' +
    '<div class="card"><label class="lbl" for="k-sem" style="margin-top:0">Week</label><select id="k-sem" data-campo="k-sem">' +
    [1, 2, 3, 4, 5, 6, 7, 8].map(function (n) { return '<option value="' + n + '"' + (n === sem ? ' selected' : '') + '>Week ' + n + ' (month ' + (n <= 4 ? 1 : 2) + ')</option>'; }).join('') + '</select>' +
    '<p class="mt"><b>This week\'s focus</b></p><div class="seg">' + F.foco.map(function (f) {
      return '<button data-acao="k-foco" data-v="' + esc(f) + '" aria-pressed="' + (info.foco === f) + '">' + esc(f) + '</button>';
    }).join('') + '</div>' +
    '<p class="mt"><b>Day</b></p><div class="dias7" role="group" aria-label="Day of the week">' + F.dias.map(function (d, i) {
      return '<button data-acao="k-dia" data-v="' + i + '" aria-pressed="' + (i === dia) + '">' + esc(d) + '</button>';
    }).join('') + '</div></div>';
  function grupo(bloco, gid) {
    var x = '<div class="card"><h3>' + esc(bloco.titulo) + '</h3>' + (bloco.subtitulo ? '<p class="peq muted">' + esc(bloco.subtitulo) + '</p>' : '') + '<ul class="marcaveis">';
    bloco.itens.forEach(function (it, i) {
      var nome = typeof it === 'string' ? it : it.nome, k = 's' + sem + '-' + dia + '-' + gid + '-' + i;
      var det = '';
      if (typeof it === 'object') {
        if (it.linhaEmBranco) {
          var nk = 's' + sem + '-' + gid + '-' + i + '-nome';
          det = '<label class="sr" for="kn-' + nk + '">' + esc(nome) + ' (recipe name)</label><input type="text" id="kn-' + nk + '" data-campo="texto" data-g="checklist" data-k="' + nk + '" value="' + esc((S.checklist || {})[nk] || '') + '" placeholder="Enter the recipe name">';
        }
        det += (det ? '<br>' : '') + 'Limit: ' + esc(it.limite);
      }
      x += marcavel('checklist', k, nome, det, marcado('checklist', k));
    });
    return x + '</ul></div>';
  }
  h += grupo(F.base, 'b') + grupo(F.camada1, 'c1') + grupo(F.camada2, 'c2') + grupo(F.camada3, 'c3');
  return h;
}
function checkCardapio() {
  var C = CHECKLIST.cardapio;
  return '<div class="card pastel"><h3>' + esc(C.titulo) + '</h3><p>' + esc(C.subtitulo) + '</p></div><ul class="rlista">' + C.receitas.map(function (c) {
    var r = rec(c.receita), cam = r ? r.camada : 'hidratar';
    return '<li class="rcard cam-' + cam + '"><span class="num" aria-hidden="true">' + c.receita + '</span><div class="info"><a class="nome" href="#receita-' + c.receita + '">' + esc(c.nome) + '</a>' +
      '<div class="st"><b>Limit:</b> ' + esc(c.limiteSemanal) + '</div><div class="st">When: ' + esc(c.quando) + ' · Time: ' + esc(c.tempo) + (c.dura ? ' · Lasts: ' + esc(c.dura) : '') + '</div></div></li>';
  }).join('') + '</ul>';
}
function checkModelos() {
  var M = CHECKLIST.modelosDeSemana;
  var h = '<div class="card pastel"><h3>' + esc(M.titulo) + '</h3><p>' + esc(M.subtitulo) + '</p><p class="peq muted mt">' + esc(M.nota) + '</p></div>';
  M.modelos.forEach(function (m) {
    h += '<details class="dobra"><summary><span>' + m.semana + '. ' + esc(m.nome) + '</span>' + ico('seta') + '</summary><div class="dentro"><p>' + esc(m.descricao) + '</p>' +
      '<p class="mt"><b>Every day:</b> ' + esc(m.todoDia.texto) + '</p><div class="tabela-mini mt">' + m.dias.map(function (d) {
        var txt = d.receitas && d.receitas.length ? d.receitas.map(nomeRec).join(' + ') : (d.texto || '');
        return '<div><b>' + esc(d.dia) + '</b><span>' + esc(txt) + '</span></div>';
      }).join('') + '</div></div></details>';
  });
  return h;
}
function checkEstoque() {
  var E = CHECKLIST.estoque, reg = sub('checklist', 'estoque');
  var h = '<div class="card"><h3>' + esc(E.titulo) + '</h3><p class="muted">' + esc(E.subtitulo) + '</p><div class="tabela-mini">' +
    E.validadeDosPreparos.map(function (p, i) {
      var k = 'prep-' + i;
      return '<div style="flex-wrap:wrap"><b>' + esc(p.preparo) + '</b><span>' + esc(p.dura) + '</span>' +
        '<label class="sr" for="kd-' + k + '">' + esc(E.colunas[0]) + ': ' + esc(p.preparo) + '</label><input type="text" inputmode="numeric" id="kd-' + k + '" data-campo="texto" data-g="checklist" data-k="estoque.' + k + '" value="' + esc(reg[k] || '') + '" placeholder="' + esc(E.colunas[0]) + ' (mm/dd)" style="flex-basis:100%">' + '</div>';
    }).join('') + '</div><div class="aviso-lim">' + ico('alerta') + '<span>' + esc(E.aviso) + '</span></div></div>' +
    '<div class="card"><h3>This week\'s restock</h3><p class="peq muted">' + esc(E.notaReposicao) + '</p><ul class="marcaveis">' +
    E.reposicaoDaSemana.map(function (it, i) { return marcavel('checklist', 'rep-' + i, it, '', marcado('checklist', 'rep-' + i)); }).join('') + '</ul></div>';
  return h;
}
function checkMes() {
  var B = CHECKLIST.balancoDoMes;
  var h = '<div class="card pastel"><h3>' + esc(B.titulo) + '</h3><p>' + esc(B.subtitulo) + '</p></div>';
  B.meses.forEach(function (m) {
    var reg = sub('checklist', 'mes' + m.mes);
    h += '<details class="dobra"' + (m.mes === 1 ? ' open' : '') + '><summary><span>Month ' + m.mes + '</span>' + ico('seta') + '</summary><div class="dentro">';
    m.semanas.forEach(function (w) {
      h += '<p class="mt"><b>Week ' + w + '</b></p><div class="seg">' + B.corDeCadaSemana.map(function (c) {
        return '<button data-acao="k-cor" data-m="' + m.mes + '" data-w="' + w + '" data-v="' + esc(c) + '" aria-pressed="' + (reg['cor' + w] === c) + '">' + esc(c) + '</button>';
      }).join('') + '</div>' +
        '<label class="sr" for="kr-' + m.mes + '-' + w + '">Week ' + w + ': ' + esc(B.campoPorSemana) + '</label><input class="mt" type="text" id="kr-' + m.mes + '-' + w + '" data-campo="texto" data-g="checklist" data-k="mes' + m.mes + '.rec' + w + '" value="' + esc(reg['rec' + w] || '') + '" placeholder="' + esc(B.campoPorSemana) + '">';
    });
    h += '<p class="mt"><b>Compare with the beginning</b></p><p class="peq muted">' + esc(B.compareComOInicio.instrucao) + '</p><div class="notas5">';
    B.compareComOInicio.itens.forEach(function (it) {
      B.compareComOInicio.colunas.forEach(function (col) {
        var cmp = sub('checklist', 'mes' + m.mes + 'cmp' + col);
        h += escala5('checklist', 'mes' + m.mes + 'cmp' + col, it, cmp[it]).replace('<div class="rot">' + esc(it) + '</div>', '<div class="rot">' + esc(it) + ' · ' + esc(col) + '</div>');
      });
    });
    h += '</div>' + B.perguntas.map(function (q, i) { return campoTexto('checklist', 'mes' + m.mes + '.q' + i, q, reg['q' + i], 'kq-' + m.mes + '-' + i); }).join('') + '</div></details>';
  });
  return h + '<p class="peq muted mt">' + esc(B.lembrete) + '</p>';
}
function checkComo() {
  var CF = CHECKLIST.comoFunciona, CI = CHECKLIST.checkInDaPele;
  return '<div class="card"><h3>' + esc(CF.titulo) + '</h3><p>' + esc(CF.introducao) + '</p></div>' +
    '<div class="card">' + CF.passos.map(function (p) { return '<div class="regra"><span class="n">' + p.numero + '</span><div><b>' + esc(p.titulo) + '</b>' + esc(p.texto) + '</div></div>'; }).join('') + '</div>' +
    '<div class="card pastel"><h3>Sequence</h3><div class="seq">' + CF.sequenciaDoMetodo.map(function (s, i) { return '<span>' + (i + 1) + '. ' + esc(s) + '</span>'; }).join('') + '</div><p class="mt">' + esc(CF.sequenciaNota) + '</p></div>' +
    '<div class="card"><h3>Skin type</h3><div class="tabela-mini">' + CF.tipoDePele.map(function (t) { return '<div><b>' + esc(t.tipo) + '</b><span>' + esc(t.dica) + '</span></div>'; }).join('') + '</div><p class="mt">' + esc(CF.diasCorridos) + '</p></div>' +
    '<div class="card"><h3>' + esc(CI.receitaNova.titulo) + '</h3>' + CI.receitaNova.passos.map(function (p) { return '<div class="regra"><span class="n">' + p.numero + '</span><div><b>' + esc(p.titulo) + '</b>' + esc(p.texto) + '</div></div>'; }).join('') +
    '<p class="mt">' + esc(CI.semanaMinima) + '</p></div>' +
    '<div class="card plano-card"><h3>' + esc(CHECKLIST.encerramento.titulo) + '</h3><p>' + esc(CHECKLIST.encerramento.texto) + '</p></div>';
}
/* ---------- Materials: your method, premium bonuses, add-ons and the e-book reader ---------- */
var LIVROS_EXTRAS = {
  method:    { arquivo: 'korean-silk-method-3-layer-ritual', cfg: 'main', titulo: 'Korean Silk Method: 3-Layer Ritual', descricao: GUIA.metodo.subtitulo, rota: 'metodo', icone: 'folha' },
  challenge: { arquivo: '7-day-challenge', cfg: 'challenge', titulo: '7-Day Challenge', descricao: 'Guided mode for days 1 through 7', rota: 'desafio', modulo: 'desafio', icone: 'chama' },
  shopping:  { arquivo: 'shopping-lists', cfg: 'shopping', titulo: 'Shopping Lists', descricao: 'Starter kit, weekly lists, and master list', rota: 'compras', modulo: 'compras', icone: 'sacola' },
  checklist: { arquivo: 'weekly-checklist', cfg: 'checklist', titulo: 'Weekly Checklist', descricao: 'Weekly sheet, schedule, and supplies', rota: 'checklist', modulo: 'checklist', icone: 'lista' },
  calendar:  { arquivo: '21-day-calendar', cfg: 'calendar', titulo: '21-Day Calendar', descricao: 'Your 21 days laid out day by day, so you can see the whole ritual at a glance.', addon: 'calendar', icone: 'grade' },
  pantry:    { arquivo: 'backyard-pantry', cfg: 'pantry', titulo: 'The Backyard Pantry', descricao: '24 ingredients, 27 recipes, and a 7-day routine for everyday kitchen wellness.', addon: 'pantry', icone: 'folha' }
};
function chaveLivro(livro) { return Object.keys(LIVROS_EXTRAS).filter(function (k) { return LIVROS_EXTRAS[k] === livro; })[0]; }
function livroLiberado(livro) {
  if (livro.addon) return temAddon(livro.addon);
  if (livro.modulo) return temModulo(livro.modulo);
  return true;
}
function acoesLivro(livro, noApp, noEbook) {
  var titulo = esc(livro.titulo), h = '<div class="btns extra-acoes" role="group" aria-label="' + titulo + '">';
  if (livro.rota && !noApp) h += '<a class="btn block" href="#' + livro.rota + '" aria-label="' + (livro === LIVROS_EXTRAS.method ? 'Read in the app' : 'Open in the app') + ': ' + titulo + '">' + ico('livro') + (livro === LIVROS_EXTRAS.method ? 'Read in the app' : 'Open in the app') + '</a>';
  if (!noEbook) h += '<a class="btn ghost block" href="#ebook-' + chaveLivro(livro) + '" aria-label="Open the e-book: ' + titulo + '">' + ico('livro') + 'Open the e-book</a>';
  h += '<a class="btn ghost block" href="ebooks/' + livro.arquivo + '.pdf" download aria-label="Download PDF: ' + titulo + '">' + ico('baixar') + 'Download PDF</a>';
  return h + '</div>';
}
/* Cover: real PNG from ebooks/covers/; if the file is missing the image removes itself and the placeholder underneath shows. */
function capaLivro(livro, selo) {
  return '<div class="capa-wrap" aria-hidden="true"><div class="capa-livro"><div class="capa-ph">' + ico(livro.icone) + '<span>' + esc(livro.titulo) + '</span></div>' +
    '<img src="ebooks/covers/' + livro.arquivo + '.png" alt="" onerror="this.remove()">' +
    (selo ? '<span class="selo-lib">' + ico('check') + 'Unlocked</span>' : '') + '</div></div>';
}
function cardExtra(livro, opc) {
  opc = opc || {};
  return '<article class="card extra-card' + (opc.grande ? ' extra-grande' : '') + '">' + capaLivro(livro, opc.selo) + '<div class="extra-corpo"><h3>' + esc(livro.titulo) + '</h3>' +
    (livro.descricao ? '<p class="muted">' + esc(livro.descricao) + '</p>' : '') + acoesLivro(livro) + '</div></article>';
}
function cardAddon(livro) {
  var nome = livro.addon, cf = CONFIG.ADDONS[nome] || {}, k = chaveLivro(livro);
  if (temAddon(nome)) return cardExtra(livro, { selo: true });
  var aberto = UI.unlockAberto === nome, msg = UI.unlockMsg && UI.unlockMsg.nome === nome ? UI.unlockMsg.texto : '';
  var preco = cf.preco != null ? '$' + cf.preco : '';
  return '<article class="card extra-card addon-bloqueado" id="addon-' + k + '">' + capaLivro(livro, false) + '<div class="extra-corpo"><h3>' + esc(livro.titulo) + '</h3><p class="muted">' + esc(livro.descricao) + '</p>' +
    '<div class="addon-preco"><span class="selo-bloq">' + ico('cadeado') + 'Locked</span>' + (preco ? '<b>' + esc(preco) + '</b><small>one-time</small>' : '') + '</div>' +
    '<a class="btn block" href="' + esc(cf.checkout || '#') + '" target="_blank" rel="noopener" aria-label="Get ' + esc(livro.titulo) + (preco ? ' for ' + esc(preco) : '') + '">' + ico('sacola') + 'Get it' + (preco ? ' · ' + esc(preco) : '') + '</a>' +
    '<button class="link-unlock" data-acao="unlock-abrir" data-v="' + nome + '" aria-expanded="' + aberto + '">Already bought it? Enter your email to unlock</button>' +
    (aberto ? '<form class="form-unlock" data-form="unlock" data-v="' + nome + '" novalidate><label class="sr" for="ul-' + nome + '">Email address</label>' +
      '<input type="email" id="ul-' + nome + '" name="email" inputmode="email" autocomplete="email" autocapitalize="off" placeholder="you@example.com" required>' +
      '<button type="submit" class="btn">Unlock</button></form>' : '') +
    '<p class="unlock-msg" role="status" aria-live="polite">' + esc(msg) + '</p></div></article>';
}
function telaExtras() {
  var h = topo() + '<p class="kicker">Refer to it anytime</p><h1>Materials</h1>' +
    '<section class="secao" aria-labelledby="metodo-titulo"><h2 id="metodo-titulo">' + ico('folha') + 'Your method</h2>' + cardExtra(LIVROS_EXTRAS.method, { grande: true }) + '</section>';
  var bonus = ['challenge', 'shopping', 'checklist'].filter(function (k) { return temModulo(LIVROS_EXTRAS[k].modulo); });
  if (bonus.length) h += '<section class="secao extras-premium" aria-labelledby="bonus-titulo"><h2 id="bonus-titulo">' + ico('estrela') + 'Premium bonuses</h2><div class="extras-grade">' + bonus.map(function (k) { return cardExtra(LIVROS_EXTRAS[k]); }).join('') + '</div></section>';
  h += '<section class="secao extras-premium" aria-labelledby="addons-titulo"><h2 id="addons-titulo">' + ico('grade') + 'Add-ons</h2><div class="extras-grade addons-grade">' +
    cardAddon(LIVROS_EXTRAS.calendar) + cardAddon(LIVROS_EXTRAS.pantry) + '</div></section>';
  return h + rodape();
}

/* Reader: the e-book pages are 816 px wide (US Letter), so the iframe stays 816 px wide and is scaled to the screen width. */
var EBOOK_LARGURA = 816, EBOOK_PX_POR_PAGINA = 1075;
function alturaEbook(livro) {
  var c = CONFIG.EBOOKS[livro.cfg] || {};
  return c.altura || ((c.paginas || 40) * EBOOK_PX_POR_PAGINA + 8);
}
function telaEbook(livro) {
  var pdf = 'ebooks/' + livro.arquivo + '.pdf', t = esc(livro.titulo);
  return '<header class="topo ebook-barra"><a class="voltar" href="#materials" aria-label="Back to Materials">' + ico('voltar') + 'Back</a>' +
    '<a class="btn ghost" href="' + pdf + '" download aria-label="Download PDF: ' + t + '">' + ico('baixar') + 'Download PDF</a></header>' +
    '<h1 class="ebook-titulo">' + t + '</h1>' +
    '<div class="ebook-links">' + (livro.rota ? '<a class="rlink" href="#' + livro.rota + '">' + ico('livro') + (livro === LIVROS_EXTRAS.method ? 'Read in the app' : 'Open in the app') + '</a>' : '') +
    '<a class="rlink" href="' + pdf + '" target="_blank" rel="noopener">' + ico('seta') + 'Open PDF in new tab</a></div>' +
    '<div class="ebook-wrap" data-h="' + alturaEbook(livro) + '"><iframe class="ebook-frame" src="ebooks/' + livro.arquivo + '.html" title="' + t + ' e-book" scrolling="no"></iframe></div>';
}
/* Phone mode (window <= 720 px): the e-book reflows as a single column, so the iframe is 100% wide, unscaled, and as tall as the
   content. The e-book reports its height with postMessage({type:'ebook-height', height}); until the first message the iframe is 100vh. */
var EBOOK_MOBILE_MAX = 720;
function ebookMobile() { return window.innerWidth <= EBOOK_MOBILE_MAX; }
function ajustarEbook() {
  var w = document.querySelector('.ebook-wrap'); if (!w) return;
  var fr = w.querySelector('iframe');
  if (ebookMobile()) {
    var hm = +w.getAttribute('data-hm');
    fr.style.width = '100%';
    fr.style.transform = 'none';
    fr.style.height = hm > 0 ? hm + 'px' : '100vh';
    w.style.height = '';
    w.setAttribute('data-modo', 'celular');
    return;
  }
  w.removeAttribute('data-modo');
  var H = +w.getAttribute('data-h') || 40000;
  var s = Math.min(1, w.clientWidth / EBOOK_LARGURA);
  fr.style.width = '';
  fr.style.height = H + 'px';
  fr.style.transform = 'scale(' + s + ')';
  w.style.height = Math.ceil(H * s) + 'px';
}
window.addEventListener('resize', ajustarEbook);
window.addEventListener('orientationchange', function () { setTimeout(ajustarEbook, 150); });
window.addEventListener('message', function (e) {
  var d = e.data, w = document.querySelector('.ebook-wrap');
  if (!w || !d || typeof d !== 'object') return;
  var fr = w.querySelector('iframe');
  if (!fr || e.source !== fr.contentWindow) return;   /* only the reader's own iframe */
  if (d.type === 'ebook-height') {
    if (!ebookMobile() || !isFinite(d.height) || d.height < 100 || d.height > 400000) return;
    w.setAttribute('data-hm', Math.round(d.height)); ajustarEbook();
  } else if (d.type === 'ksm-ebook-height') {   /* legacy desktop message */
    if (!(d.height > 500)) return;
    w.setAttribute('data-h', Math.round(d.height)); ajustarEbook();
  }
});
