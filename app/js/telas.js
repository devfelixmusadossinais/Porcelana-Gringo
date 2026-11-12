/* MODELED-EN */
/* telas.js: telas principais (primeiro acesso, hoje, 21 dias, receitas, balanço, guia). */
var UI = {
  unlockAberto: null, unlockMsg: null,
  onb: 0, aceite: false,
  diaVisto: null,
  filtro: { camada: '', ess: false, fav: false, obj: '', q: '' },
  desafioDia: null, comprasAba: 'kit', checkAba: 'folha', checkSemana: 1, checkDia: 0
};

/* ---------- componentes ---------- */
function ico(id, cls) { return '<svg class="ic' + (cls ? ' ' + cls : '') + '" aria-hidden="true"><use href="#i-' + id + '"/></svg>'; }
function ck(attrs, marcado, rotulo) {
  return '<span class="ck"><input type="checkbox" ' + attrs + (marcado ? ' checked' : '') + ' aria-label="' + esc(rotulo) + '"><span class="caixa"><svg aria-hidden="true"><use href="#i-check"/></svg></span></span>';
}
function rlink(n) {
  var r = rec(n); if (!r) return '';
  return '<a class="rlink" href="#receita-' + n + '">' + esc(r.nome) + ico('seta') + '</a>';
}
function topo(voltar, titulo) {
  var plano = CONFIG.planos[planoAtual()];
  var esq = voltar
    ? '<button class="voltar" data-acao="voltar" data-para="' + esc(voltar) + '">' + ico('voltar') + 'Back</button>'
    : '<span class="marca"><i>Korean Silk Method</i></span>';
  return '<header class="topo">' + esq + (titulo ? '' : '') + '<span class="plano">' + esc(plano ? plano.nome : '') + '</span></header>';
}
function rodape() {
  return '<p class="rodape">' + esc('Korean Silk Method') + ' · informational and wellness content. <a href="#g-aviso">Important notice</a></p>';
}
function lembreteSol() {
  var r = GUIA.regrasDeOuro[1];
  return '<div class="lembrete" role="note">' + ico('sol') + '<div><b>' + esc(r.titulo) + '</b>' + esc(r.texto) + '</div></div>';
}
function paragrafos(arr) { return (arr || []).map(function (t) { return '<p class="mt">' + esc(t) + '</p>'; }).join(''); }
function listaUL(arr) { return '<ul class="lista">' + (arr || []).map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('') + '</ul>'; }
function listaOL(arr) { return '<ol class="lista">' + (arr || []).map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('') + '</ol>'; }

/* ---------- 1. primeiro acesso ---------- */
function telaOnboarding() {
  var bolas = '<div class="passos-onb" aria-hidden="true">' + [0, 1, 2].map(function (i) { return '<i class="' + (i <= UI.onb ? 'on' : '') + '"></i>'; }).join('') + '</div>';
  var h = '<div class="onb">' + bolas;
  if (UI.onb === 0) {
    var bv = GUIA.boasVindas;
    h += '<div class="foto"><img src="img/mulher-retrato.webp" width="400" height="535" alt="Smiling woman with well-cared-for skin"></div>' +
      '<p class="hand mt" style="text-align:center">your 21-day ritual</p>' +
      '<h1 style="text-align:center;margin-top:6px">' + esc(bv.titulo) + '</h1>' + paragrafos(bv.texto) +
      '<div class="btns"><button class="btn block" data-acao="onb" data-p="1">Continue' + ico('seta') + '</button></div>';
  } else if (UI.onb === 1) {
    h += '<p class="kicker mt">Before you begin</p><h1>The 6 golden rules</h1>' +
      '<div class="card">' + GUIA.regrasDeOuro.map(function (r) {
        return '<div class="regra"><span class="n">' + r.n + '</span><div><b>' + esc(r.titulo) + '</b>' + esc(r.texto) + '</div></div>';
      }).join('') + '</div>' +
      '<label class="aceite">' + ck('id="aceite" data-acao="aceite"', UI.aceite, 'I have read and understand the golden rules') + '<span>I have read and understand the 6 golden rules</span></label>' +
      '<div class="btns"><button class="btn block" data-acao="onb" data-p="2"' + (UI.aceite ? '' : ' disabled') + '>Continue' + ico('seta') + '</button>' +
      '<button class="btn ghost block" data-acao="onb" data-p="0">Back</button></div>';
  } else {
    h += telaDia0Corpo() +
      '<div class="btns"><button class="btn block" data-acao="comecar">Start my day 1' + ico('seta') + '</button>' +
      '<button class="btn ghost block" data-acao="depois">My 24-hour patch test is still in progress</button></div>' +
      '<p class="peq muted mt">Day 1 begins on the date you tap "Start my day 1".</p>';
  }
  return h + '</div>' + rodape();
}
function telaDia0Corpo() {
  var dz = DESAFIO.diaZero, tc = DESAFIO.vespera.testeDeContato;
  return '<p class="kicker mt">' + esc(dz.titulo) + '</p><h1>' + esc(tc.titulo) + '</h1>' +
    '<p class="mt">' + esc(dz.subtitulo) + '</p>' +
    '<div class="foto"><img src="img/ritual-cozinha.webp" width="960" height="717" alt="Ritual ingredients on the kitchen counter" loading="lazy"></div>' +
    '<div class="card"><h3>How to do it</h3><p>' + esc(tc.instrucao) + '</p>' +
    '<h3 class="mt">Ingredients to patch test</h3>' + listaUL(tc.ingredientes) + '</div>' +
    '<div class="atencao" role="note">' + ico('alerta') + '<div><b>Caution</b>' + esc(GUIA.regrasDeOuro[4].texto) + '</div></div>';
}

/* ---------- 2. hoje ---------- */
function telaHoje() {
  var atual = diaAtual();
  var h = topo();
  if (!atual) {
    h += '<section class="hero"><p class="kicker">Today</p><h1>Start your day 1</h1>' +
      '<p class="mt">Do a 24-hour patch test and begin once everything looks and feels fine.</p>' +
      '<div class="btns"><button class="btn claro block" data-acao="ir-dia0">View Day 0 and get started' + ico('seta') + '</button></div></section>' +
      lembreteSol() + previaRitual() + rodape();
    return h;
  }
  var d = UI.diaVisto && UI.diaVisto <= atual ? UI.diaVisto : atual;
  var total = CONFIG.plano21.totalDias;
  var p = planoDoDia(d), r = verDia(d) || { feitos: {}, concluido: false };
  var c = contagemDia(d);
  var titulo = d <= total ? 'Day ' + d + '<small>of ' + total + '</small>' : 'Day ' + d + '<small>self-guided ritual</small>';
  var data = dataDoDia(d);
  h += '<section class="hero" aria-label="Your day">' +
    '<p class="kicker">' + (d === atual ? 'Today' : 'Previous day') + ' · ' + esc(dataBR(data).replace(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/, '$2/$1/$3')) + '</p>' +
    '<div class="dia-num">' + titulo + '</div>' +
    (d > total ? '<p class="mt">The 21 days are complete. Your morning and evening ritual is still here, every day.</p>' : '') +
    '<div class="barra" role="progressbar" aria-valuemin="0" aria-valuemax="' + c.tot + '" aria-valuenow="' + c.feitos + '"><span style="transform:scaleX(' + (c.tot ? c.feitos / c.tot : 0) + ')"></span></div>' +
    '<div class="linha-info"><span id="contador-hoje">' + c.feitos + ' of ' + c.tot + ' completed today</span>' + (r.concluido ? '<span class="chip-d">' + ico('check') + 'Day complete</span>' : '') + '</div>' +
    '<div class="navdia"><button data-acao="dia-ant"' + (d <= 1 ? ' disabled' : '') + '>' + ico('voltar') + 'Day ' + Math.max(1, d - 1) + '</button>' +
    '<button data-acao="dia-prox"' + (d >= atual ? ' disabled' : '') + '>' + (d >= atual ? 'Today' : 'Day ' + (d + 1)) + ico('seta') + '</button></div>' +
    '</section>';
  h += lembreteSol();
  if (p.desafio) {
    h += '<div class="card plano-card"><p class="kicker" style="color:var(--ouro-d)">7-day challenge · Day ' + d + '</p>' +
      '<h3>' + esc(p.desafio.titulo) + '</h3><p>' + esc(p.desafio.foco) + '</p>' +
      '<p class="peq muted mt">A sequence of skin care steps, with no promise of results.</p>' +
      '<div class="btns"><a class="btn ghost block" href="#desafio-' + d + '">View the full challenge day' + ico('seta') + '</a></div></div>';
  }
  h += blocoRitual('manha', p.manha, d, r) + blocoRitual('noite', p.noite, d, r);
  h += blocoFoco(d, r);
  h += '<div class="card pastel"><h3>When your day gets busy</h3><p>' + esc(p.desafio ? p.desafio.seODiaApertar : GUIA.rotinasProntas.dica) + '</p></div>';
  h += blocoCheckin(d, r);
  h += '<div class="card"><label class="lbl" for="nota-dia" style="margin-top:0">Daily note</label>' +
    '<textarea id="nota-dia" data-campo="nota-dia" data-dia="' + d + '" placeholder="How your skin looked and felt, what you noticed...">' + esc(r.nota || '') + '</textarea></div>';
  h += '<div class="btns mt2"><button class="btn block' + (r.concluido ? ' feito' : '') + '" data-acao="concluir" data-dia="' + d + '" aria-pressed="' + (r.concluido ? 'true' : 'false') + '">' +
    (r.concluido ? ico('check') + 'Day complete (tap to undo)' : 'Day complete') + '</button></div>';
  return h + rodape();
}
function previaRitual() {
  var RP = GUIA.rotinasProntas;
  return '<div class="card"><h3>What your ritual will look like</h3><p><b>' + esc(RP.manha.nome) + '</b> · ' + esc(RP.manha.duracao) + '</p>' +
    '<p class="mt"><b>' + esc(RP.noite.nome) + '</b> · ' + esc(RP.noite.duracao) + '</p>' +
    '<div class="btns"><a class="btn ghost block" href="#g-regras">Review the golden rules</a></div></div>';
}
function blocoRitual(qual, b, d, r) {
  var titulo = qual === 'manha' ? 'Morning' : 'Evening';
  var h = '<section class="secao"><h2>' + ico(qual === 'manha' ? 'sol' : 'lua') + titulo + '</h2>' +
    '<p class="sub"><b>' + esc(b.nome) + '</b> · ' + esc(b.duracao) + '</p><div class="card" style="margin-top:8px"><ul class="passos">';
  b.passos.forEach(function (ps) {
    var marcado = !!(r.feitos && r.feitos[ps.chave]);
    var avisos = ps.conta.map(function (n) { return avisoLimite(n, d, marcado); }).filter(Boolean);
    h += '<li class="passo' + (marcado ? ' ok' : '') + '">' +
      ck('data-acao="passo" data-dia="' + d + '" data-chave="' + ps.chave + '" data-conta="' + ps.conta.join(',') + '" id="ck-' + d + '-' + ps.chave + '"', marcado, ps.titulo) +
      '<div class="corpo"><div class="t">' + tituloPasso(ps) + '</div><div class="d">' + esc(ps.texto) + '</div>';
    if (ps.escolha) {
      h += '<div class="escolha"><div class="rot">Today\'s mask (change it if you like):</div><div class="seg">' +
        ps.escolha.map(function (n) {
          return '<button data-acao="mascara" data-dia="' + d + '" data-n="' + n + '" data-chave="' + ps.chave + '" aria-pressed="' + (ps.receitas[0] === n ? 'true' : 'false') + '">' + esc(nomeRec(n)) + '</button>';
        }).join('') + '</div></div>';
    }
    var outras = ps.receitas.filter(function (n) { return !(ps.receitas.length === 1 && nomeRec(n) === ps.titulo); });
    if (outras.length) h += '<div class="rlinks">' + outras.map(rlink).join('') + '</div>';
    avisos.forEach(function (a) { h += '<div class="aviso-lim" role="note">' + ico('alerta') + '<span>' + esc(a) + '</span></div>'; });
    h += '</div></li>';
  });
  return h + '</ul></div></section>';
}
function tituloPasso(ps) {
  if (ps.receitas.length === 1 && nomeRec(ps.receitas[0]) === ps.titulo) return '<a class="tlink" href="#receita-' + ps.receitas[0] + '">' + esc(ps.titulo) + ico('seta') + '</a>';
  return esc(ps.titulo);
}
function blocoFoco(d, r) {
  var aPartir = CONFIG.plano21.focoAPartirDoDia;
  if (d < aPartir) return '';
  var obj = objetivoAtual();
  if (!obj) {
    return '<div class="card plano-card"><h3>Choose a goal-based routine</h3>' +
      '<p>Starting on day ' + aPartir + ', your morning and evening ritual continues, and you can add a goal-based routine as your focus.</p>' +
      '<div class="btns"><a class="btn ghost block" href="#g-objetivos">View goal-based routines' + ico('seta') + '</a></div></div>';
  }
  var h = '<section class="secao"><h2>' + ico('estrela') + 'Your focus</h2><p class="sub"><b>' + esc(obj.nome) + '</b> · ' + esc(obj.para) + '</p>' +
    '<div class="card" style="margin-top:8px"><p class="peq muted">Check off what you do today. Follow the directions for each recipe.</p><ul class="passos">';
  obj.itens.forEach(function (it) {
    var chave = 'f' + it.receita, marcado = !!(r.feitos && r.feitos[chave]);
    var av = avisoLimite(it.receita, d, marcado);
    h += '<li class="passo' + (marcado ? ' ok' : '') + '">' +
      ck('data-acao="passo" data-dia="' + d + '" data-chave="' + chave + '" data-conta="' + it.receita + '" id="ck-' + d + '-' + chave + '"', marcado, nomeRec(it.receita)) +
      '<div class="corpo"><div class="t"><a class="tlink" href="#receita-' + it.receita + '">' + esc(nomeRec(it.receita)) + ico('seta') + '</a></div><div class="d">Use: ' + esc(it.uso) + '</div>' +
      (av ? '<div class="aviso-lim" role="note">' + ico('alerta') + '<span>' + esc(av) + '</span></div>' : '') + '</div></li>';
  });
  return h + '</ul><div class="btns"><a class="btn ghost block" href="#g-objetivos">Change your focus</a></div></div></section>';
}
function blocoCheckin(d, r) {
  var ci = CHECKLIST.checkInDaPele, sel = null;
  var h = '<section class="secao"><h2>' + ico('gota') + 'Skin check-in</h2><p class="sub">' + esc(ci.perguntaPrincipal) + '</p><div class="estados">';
  ci.estados.forEach(function (e) {
    if (r.pele === e.id) sel = e;
    h += '<button class="estado ' + esc(e.cor) + '" data-acao="pele" data-dia="' + d + '" data-v="' + esc(e.id) + '" aria-pressed="' + (r.pele === e.id ? 'true' : 'false') + '"><span class="bola" aria-hidden="true"></span><span>' + esc(e.rotulo.charAt(0).toUpperCase() + e.rotulo.slice(1)) + '<br><span class="peq muted" style="font-weight:600">' + esc(e.quando) + '</span></span></button>';
  });
  h += '</div>';
  if (sel) h += '<div class="oque" role="status"><b>' + esc(sel.titulo) + '</b>' + esc(sel.oQueFazer) + '</div>';
  return h + '</section>';
}

/* ---------- 3. 21 dias ---------- */
function telaDias() {
  var atual = diaAtual(), total = CONFIG.plano21.totalDias;
  var feitos = diasConcluidos(), pct = Math.round(feitos / total * 100);
  var h = topo() + '<p class="kicker">Your journey</p><h1>21 days</h1>';
  if (!atual) h += '<div class="card pastel"><p>Your day 1 hasn\'t started yet.</p><div class="btns"><button class="btn block" data-acao="ir-dia0">Start my day 1</button></div></div>';
  h += '<div class="resumo"><div><b>' + pct + '%</b><span>complete</span></div><div><b>' + feitos + '</b><span>of ' + total + ' days</span></div><div><b>' + sequencia() + '</b><span>days in a row</span></div></div>' +
    '<div class="barra clara" style="margin-top:12px" aria-hidden="true"><span style="transform:scaleX(' + feitos / total + ')"></span></div>' +
    '<div class="legenda"><span><i style="background:var(--cta);border-color:var(--cta)"></i>done</span><span><i style="background:var(--ouro-p);border-color:var(--ouro)"></i>today</span><span><i></i>pending</span></div>';
  for (var w = 1; w <= 3; w++) h += blocoSemana(w, atual);
  return h + rodape();
}
function blocoSemana(w, atual) {
  var ds = diasDaSemana(w), feitos = ds.filter(function (d) { var r = verDia(d); return r && r.concluido; }).length;
  var fim = ds[6], passou = atual && atual >= fim;
  var marco = feitos === 7 ? '<span class="marco ok">' + ico('check') + 'Week complete</span>' : '<span class="marco">' + feitos + ' of 7 days</span>';
  var h = '<div class="card"><div class="semana-h"><h3 style="margin:0">Week ' + w + ' <span class="muted peq" style="font-family:var(--body)">· days ' + ds[0] + ' to ' + fim + '</span></h3>' + marco + '</div><div class="grade">';
  ds.forEach(function (d) {
    var r = verDia(d), cls = 'cel', st = 'pending';
    if (r && r.concluido) { cls += ' feito'; st = 'done'; }
    if (atual && d === atual) { cls += ' hoje'; st = (r && r.concluido) ? 'done' : 'today'; }
    else if (atual && d < atual && !(r && r.concluido)) { cls += ' perdido'; }
    if (!atual || d > atual) {
      h += '<div class="' + cls + ' futuro" aria-label="Day ' + d + ', not here yet"><b>' + d + '</b><span>coming soon</span></div>';
    } else {
      h += '<a class="' + cls + '" href="#dia-' + d + '" aria-label="Day ' + d + ', ' + st + (d === atual ? ', today' : '') + '"><b>' + d + '</b><span>' + st + '</span></a>';
    }
  });
  h += '</div>' + blocoDomingo(w, passou) + '</div>';
  return h;
}
function blocoDomingo(w, aberto) {
  var bd = CHECKLIST.balancoDeDomingo, reg = S.domingo[String(w)] || {}, notas = reg.notas || {}, resp = reg.resp || [];
  var cores = ['verde', 'amarelo', 'vermelho'];
  var h = '<details class="dobra"' + (aberto && !reg.cor ? ' open' : '') + '><summary><span>' + esc(bd.titulo) + ' · week ' + w + (reg.cor ? ' <span class="pill">' + esc({ verde: 'green', amarelo: 'yellow', vermelho: 'red' }[reg.cor] || reg.cor) + '</span>' : '') + '</span>' + ico('seta') + '</summary><div class="dentro">' +
    '<p class="peq muted">At the end of the week, look back and take notes.</p><div class="estados">';
  bd.escalaCor.forEach(function (txt, i) {
    var c = cores[i];
    h += '<button class="estado ' + c + '" data-acao="dom-cor" data-w="' + w + '" data-v="' + c + '" aria-pressed="' + (reg.cor === c ? 'true' : 'false') + '"><span class="bola" aria-hidden="true"></span>' + esc(txt) + '</button>';
  });
  h += '</div><p class="mt"><b>Ratings from ' + esc(bd.notas.escala) + '</b></p><div class="notas5">';
  bd.notas.itens.forEach(function (it) {
    h += '<div class="nota5"><div class="rot">' + esc(it) + '</div><div class="seg" role="group" aria-label="' + esc(it) + '">';
    for (var n = 1; n <= 5; n++) h += '<button data-acao="dom-nota" data-w="' + w + '" data-item="' + esc(it) + '" data-v="' + n + '" aria-pressed="' + (notas[it] === n ? 'true' : 'false') + '">' + n + '</button>';
    h += '</div></div>';
  });
  h += '</div>';
  bd.perguntas.forEach(function (q, i) {
    var id = 'dom-' + w + '-' + i;
    h += '<label class="lbl" for="' + id + '">' + esc(q) + '</label><textarea id="' + id + '" data-campo="dom-resp" data-w="' + w + '" data-i="' + i + '">' + esc(resp[i] || '') + '</textarea>';
  });
  return h + '</div></details>';
}

/* ---------- 4. receitas ---------- */
function telaReceitas() {
  var f = UI.filtro;
  var h = topo() + '<p class="kicker">All 30 recipes</p><h1>Recipes</h1>' +
    '<div class="busca">' + ico('busca') + '<label class="sr" for="busca">Search by name or ingredient</label><input id="busca" type="search" data-campo="busca" placeholder="Search by name or ingredient" value="' + esc(f.q) + '" autocomplete="off"></div>' +
    '<div class="filtros" role="group" aria-label="Layer">' +
    [['', 'All'], ['hidratar', 'Hydrate'], ['nutrir', 'Nourish'], ['rejuvenescer', 'Rejuvenate']].map(function (c) {
      return '<button class="filtro" data-acao="f-camada" data-v="' + c[0] + '" aria-pressed="' + (f.camada === c[0] ? 'true' : 'false') + '">' + c[1] + '</button>';
    }).join('') + '</div>' +
    '<div class="filtros"><button class="filtro" data-acao="f-ess" aria-pressed="' + f.ess + '">Essentials</button>' +
    '<button class="filtro" data-acao="f-fav" aria-pressed="' + f.fav + '">Favorites</button></div>' +
    '<label class="lbl" for="f-obj">By goal</label><select id="f-obj" data-campo="f-obj"><option value="">All goals</option>' +
    GUIA.rotinasObjetivo.map(function (o) { return '<option value="' + esc(o.id) + '"' + (f.obj === o.id ? ' selected' : '') + '>' + esc(o.nome) + '</option>'; }).join('') + '</select>' +
    '<div id="rlista-box">' + listaReceitasHTML() + '</div>';
  return h + rodape();
}
function receitasFiltradas() {
  var f = UI.filtro, q = norm(f.q).trim(), obj = null;
  if (f.obj) GUIA.rotinasObjetivo.forEach(function (o) { if (o.id === f.obj) obj = o; });
  var usoObj = {};
  if (obj) obj.itens.forEach(function (it) { usoObj[it.receita] = it.uso; });
  return RECEITAS.filter(function (r) {
    if (f.camada && r.camada !== f.camada) return false;
    if (f.ess && !r.essencial) return false;
    if (f.fav && !(S.receitas[r.n] && S.receitas[r.n].fav)) return false;
    if (obj && !usoObj[r.n]) return false;
    if (q) {
      var alvo = norm(r.nome + ' ' + r.subtitulo + ' ' + (r.ingredientes || []).join(' '));
      var termos = q.split(/\s+/);
      for (var i = 0; i < termos.length; i++) if (alvo.indexOf(termos[i]) < 0) return false;
    }
    return true;
  }).map(function (r) { return { r: r, uso: usoObj[r.n] || '' }; });
}
function listaReceitasHTML() {
  var lista = receitasFiltradas();
  if (!lista.length) return '<p class="vazio" id="rcont">No recipes found. Try another word or clear the filters.</p>';
  var avTxt = { funcionou: 'worked for me', mais: 'so-so', nao: 'didn\'t work for me' };
  return '<p class="peq muted mt" id="rcont">' + lista.length + (lista.length === 1 ? ' recipe' : ' recipes') + '</p><ul class="rlista">' + lista.map(function (x) {
    var r = x.r, st = S.receitas[r.n] || {};
    return '<li class="rcard cam-' + r.camada + '" data-n="' + r.n + '"><span class="num" aria-hidden="true">' + r.n + '</span><div class="info">' +
      '<a class="nome" href="#receita-' + r.n + '">' + esc(r.nome) + '</a><div class="st">' + esc(r.subtitulo) + '</div>' +
      '<div class="pills"><span class="pill cam-' + r.camada + '">' + CAMADAS[r.camada] + '</span>' + (r.essencial ? '<span class="pill ess">Essential</span>' : '') +
      (x.uso ? '<span class="pill">' + esc(x.uso) + '</span>' : '') +
      (st.aval ? '<span class="pill av-' + st.aval + '">' + avTxt[st.aval] + '</span>' : '') + '</div></div>' +
      '<button class="fav" data-acao="fav" data-n="' + r.n + '" aria-pressed="' + (st.fav ? 'true' : 'false') + '" aria-label="' + (st.fav ? 'Remove from favorites: ' : 'Add to favorites: ') + esc(r.nome) + '">' + ico('coracao') + '</button></li>';
  }).join('') + '</ul>';
}

function telaReceita(n) {
  var r = rec(n);
  if (!r) return topo('receitas') + '<p class="vazio">Recipe not found.</p>';
  var st = S.receitas[n] || {}, cd = CARDAPIO[n];
  var h = topo('receitas') + '<section class="rhero cam-' + r.camada + '"><p class="kicker">Recipe ' + r.n + ' · ' + CAMADAS[r.camada] + (r.essencial ? ' · Essential' : '') + '</p>' +
    '<h1>' + esc(r.nome) + '</h1><p class="st">' + esc(r.subtitulo) + '</p>' +
    '<div class="btns"><button class="btn ghost block" data-acao="fav" data-n="' + n + '" aria-pressed="' + (st.fav ? 'true' : 'false') + '">' + ico('coracao') + (st.fav ? 'In favorites' : 'Add to favorites') + '</button></div></section>';
  if (r.atencao) h += '<div class="atencao" role="note" id="atencao">' + ico('alerta') + '<div><b>Caution</b>' + esc(r.atencao) + '</div></div>';
  h += '<p class="mt">' + esc(r.porQue) + '</p>';
  h += '<dl class="fatos"><div><dt>Leave-on time</dt><dd>' + esc(r.tempoAcao) + '</dd></div><div><dt>Frequency</dt><dd>' + esc(r.frequencia) + '</dd></div>' +
    '<div><dt>Best time to use</dt><dd>' + esc(r.melhorMomento) + '</dd></div><div><dt>Shelf life</dt><dd>' + esc(r.validade) + '</dd></div></dl>';
  var max = maxSemana(n), atual = diaAtual();
  if (max != null && atual) {
    var usos = usosNaSemana(n, atual, null);
    h += '<p class="peq mt"><b>This week of your ritual:</b> used ' + usos + (usos === 1 ? ' time' : ' times') + ' (the book recommends a maximum of ' + max + ').</p>';
  }
  if (cd && cd.limiteSemanal) h += '<p class="peq muted mt">Limit in the checklist schedule: ' + esc(cd.limiteSemanal) + '.</p>';
  h += '<div class="card"><h3>Ingredients</h3>' + listaUL(r.ingredientes) + '</div>' +
    '<div class="card"><h3>Preparation</h3>' + listaOL(r.passos) + '</div>' +
    '<div class="card"><h3>How to use</h3><p>' + esc(r.comoUsar) + '</p></div>';
  var objs = GUIA.rotinasObjetivo.filter(function (o) { return o.itens.some(function (it) { return it.receita === n; }); });
  if (objs.length) {
    h += '<div class="card pastel"><h3>Included in these goal-based routines</h3>' + listaUL(objs.map(function (o) {
      var it = o.itens.filter(function (i) { return i.receita === n; })[0];
      return o.nome + ': ' + it.uso;
    })) + '</div>';
  }
  h += '<div class="card"><h3>How did it work for your skin?</h3><div class="aval" role="group" aria-label="Rating">' +
    [['funcionou', 'Worked for me'], ['mais', 'So-so'], ['nao', 'Didn\'t work for me']].map(function (a) {
      return '<button class="a-' + a[0] + '" data-acao="aval" data-n="' + n + '" data-v="' + a[0] + '" aria-pressed="' + (st.aval === a[0] ? 'true' : 'false') + '">' + a[1] + '</button>';
    }).join('') + '</div><label class="lbl" for="nota-rec">My note about this recipe</label>' +
    '<textarea id="nota-rec" data-campo="nota-rec" data-n="' + n + '" placeholder="E.g., my skin liked this better at night">' + esc(st.nota || '') + '</textarea></div>';
  h += '<div class="card pastel"><h3>' + esc(GUIA.regrasDeOuro[0].titulo) + '</h3><p>' + esc(GUIA.regrasDeOuro[0].texto) + '</p></div>';
  return h + rodape();
}

/* ---------- 5. meu balanço ---------- */
function telaBalanco() {
  var h = topo() + '<p class="kicker">Just for you</p><h1>My review</h1>' +
    '<div class="resumo"><div><b>' + diasConcluidos() + '</b><span>days completed</span></div><div><b>' + sequencia() + '</b><span>days in a row</span></div><div><b>' + contarFav() + '</b><span>favorites</span></div></div>';
  var grupos = { funcionou: [], mais: [], nao: [] };
  RECEITAS.forEach(function (r) { var s = S.receitas[r.n]; if (s && s.aval && grupos[s.aval]) grupos[s.aval].push(r); });
  function bloco(lista, vazio) {
    if (!lista.length) return '<p class="muted peq">' + vazio + '</p>';
    return '<div class="bloco-res">' + lista.map(function (r) {
      var nt = (S.receitas[r.n] || {}).nota;
      return '<a href="#receita-' + r.n + '">' + esc(r.nome) + (nt ? '<small>' + esc(nt) + '</small>' : '') + '</a>';
    }).join('') + '</div>';
  }
  h += '<div class="card"><h3>What worked for me</h3>' + bloco(grupos.funcionou, 'Mark the recipes that worked for you.') + '</div>';
  h += '<div class="card"><h3>So-so</h3>' + bloco(grupos.mais, 'Nothing here yet.') + '</div>';
  h += '<div class="card"><h3>What didn\'t work for me</h3>' + bloco(grupos.nao, 'Nothing here yet.') + '</div>';
  var favs = RECEITAS.filter(function (r) { return S.receitas[r.n] && S.receitas[r.n].fav; });
  h += '<div class="card"><h3>Favorites</h3>' + bloco(favs, 'Tap the heart on a recipe to save it here.') + '</div>';

  var atual = diaAtual();
  h += '<div class="card"><h3>This week\'s skin check-ins</h3>';
  if (!atual) h += '<p class="muted peq">These will appear starting on your day 1.</p>';
  else {
    var est = {}; CHECKLIST.checkInDaPele.estados.forEach(function (e) { est[e.id] = e; });
    var linhas = diasDaSemana(semanaDoDia(atual)).filter(function (d) { return d <= atual; }).map(function (d) {
      var r = verDia(d), e = r && r.pele ? est[r.pele] : null;
      return '<div><b>Day ' + d + '</b><span>' + (e ? esc(e.rotulo) : 'no check-in') + '</span></div>';
    });
    h += '<div class="tabela-mini">' + linhas.join('') + '</div>';
  }
  h += '</div>';
  var notas = Object.keys(S.dias).map(Number).sort(function (a, b) { return a - b; }).filter(function (d) { return S.dias[d].nota; });
  h += '<div class="card"><h3>Daily notes</h3>' + (notas.length ? '<div class="bloco-res">' + notas.map(function (d) {
    return '<a href="#dia-' + d + '">Day ' + d + '<small>' + esc(S.dias[d].nota) + '</small></a>';
  }).join('') + '</div>' : '<p class="muted peq">The notes you write in Today appear here.</p>') + '</div>';

  h += '<section class="secao"><h2>' + ico('escudo') + 'Save my progress</h2>' +
    '<p class="sub">Everything is stored only on this device. Export your progress to switch phones or keep a backup.</p>' +
    '<div class="card"><h3>File</h3><div class="btns"><button class="btn block" data-acao="exportar">' + ico('baixar') + 'Export file</button>' +
    '<label class="btn ghost block" for="arquivo-imp">' + ico('subir') + 'Import file</label>' +
    '<input id="arquivo-imp" class="sr" type="file" accept=".json,application/json" data-campo="arquivo-imp"></div></div>' +
    '<div class="card"><h3>Text code</h3><p class="peq muted">Copy it and save it in a notes app or send it to yourself.</p>' +
    '<label class="lbl" for="codigo-exp">Your code</label><textarea id="codigo-exp" class="codigo" readonly></textarea>' +
    '<div class="btns"><button class="btn ghost block" data-acao="gerar-codigo">' + ico('copiar') + 'Generate and copy code</button></div>' +
    '<label class="lbl" for="codigo-imp">Paste a code to restore your progress</label><textarea id="codigo-imp" class="codigo" placeholder="Paste the code that starts with PP1: here"></textarea>' +
    '<div class="btns"><button class="btn ghost block" data-acao="restaurar-codigo">Restore from code</button></div></div>' +
    '<div class="card"><h3>Reset everything</h3><p class="peq muted">Deletes the start date, checkmarks, notes, and favorites from this device.</p>' +
    '<div class="btns"><button class="btn perigo block" data-acao="zerar">' + ico('lixo') + 'Reset everything</button></div></div></section>';
  return h + rodape();
}
function contarFav() { var n = 0; for (var k in S.receitas) if (S.receitas[k] && S.receitas[k].fav) n++; return n; }

/* ---------- guia ---------- */
function telaGuia() {
  var itens = [
    ['g-metodo', 'folha', GUIA.metodo.titulo, GUIA.metodo.subtitulo],
    ['g-essenciais', 'estrela', 'The 6 Essential Rituals', 'Where to start'],
    ['g-objetivos', 'coracao', 'Goal-based routines', 'Choose your focus starting on day ' + CONFIG.plano21.focoAPartirDoDia],
    ['g-ingredientes', 'gota', 'Ingredient guide', 'What each ingredient does and precautions to take'],
    ['g-kit', 'tigela', 'Basic kit', 'Tools for preparing recipes at home'],
    ['g-faq', 'livro', 'Frequently asked questions', ''],
    ['g-regras', 'escudo', 'The 6 golden rules', 'Patch testing, sunscreen, and more'],
    ['g-aviso', 'alerta', 'Important notice', 'Read before use']
  ];
  function li(x, cls) {
    return '<li><a class="' + (cls || '') + '" href="#' + x[0] + '"><span class="ico">' + ico(x[1]) + '</span><span>' + esc(x[2]) +
      (cls ? '<span class="tag-prem">Premium</span>' : '') + (x[3] ? '<small>' + esc(x[3]) + '</small>' : '') + '</span>' + ico('seta', 'seta') + '</a></li>';
  }
  var h = topo('materials') + '<p class="kicker">Read in the app</p><h1>Korean Silk Method: 3-Layer Ritual</h1>' +
    '<div class="foto"><img src="img/ritual-mascara-02.webp" width="960" height="717" alt="A ritual moment with a homemade face mask" loading="lazy"></div>';
  h += acoesLivro(LIVROS_EXTRAS.method, true) + '<ul class="menu-g">' + itens.map(function (x) { return li(x); }).join('') + '</ul>' +
    '<div class="card pastel mt2"><p class="hand">' + esc(GUIA.mensagemFinal.titulo) + '</p><p>' + esc(GUIA.mensagemFinal.texto) + '</p></div>';
  return h + rodape();
}
function telaGuiaPagina(id) {
  var h = topo('metodo'), G = GUIA;
  if (id === 'g-metodo') {
    var M = G.metodo;
    h += '<p class="kicker">Method</p><h1>' + esc(M.titulo) + '</h1><p class="mt">' + esc(M.subtitulo) + '</p>';
    M.camadas.forEach(function (c) {
      h += '<div class="card cam-' + c.id + '"><div class="camada"><p class="kicker">Layer ' + c.n + '</p><h3>' + esc(c.nome) + '</h3><p><b>' + esc(c.foco) + '</b></p><p class="mt">' + esc(c.texto) + '</p><p class="peq muted mt">' + esc(c.tipos) + '</p></div></div>';
    });
    h += '<div class="card pastel"><h3>The sequence</h3><div class="seq">' + M.sequencia.map(function (s, i) { return '<span>' + (i + 1) + '. ' + esc(s) + '</span>'; }).join('') + '</div><p class="mt">' + esc(M.regraDaSequencia) + '</p></div>';
    if (G.inspiracao) h += '<p class="peq muted mt">' + esc(G.inspiracao) + '</p>';
  } else if (id === 'g-essenciais') {
    h += '<p class="kicker">Where to start</p><h1>The 6 Essential Rituals</h1><ul class="rlista">' + G.essenciais.map(function (n) {
      var r = rec(n);
      return '<li class="rcard cam-' + r.camada + '"><span class="num" aria-hidden="true">' + r.n + '</span><div class="info"><a class="nome" href="#receita-' + n + '">' + esc(r.nome) + '</a><div class="st">' + esc(r.subtitulo) + '</div><div class="pills"><span class="pill cam-' + r.camada + '">' + CAMADAS[r.camada] + '</span></div></div></li>';
    }).join('') + '</ul>';
  } else if (id === 'g-objetivos') {
    h += '<p class="kicker">Goal-based routines</p><h1>Choose your focus</h1><p class="mt">Your morning and evening ritual continues every day. Your chosen routine becomes your focus starting on day ' + CONFIG.plano21.focoAPartirDoDia + ', on the Today screen.</p>';
    G.rotinasObjetivo.forEach(function (o) {
      var sel = S.objetivo === o.id;
      h += '<div class="card' + (sel ? ' plano-card' : '') + '"><h3>' + esc(o.nome) + '</h3><p class="muted">' + esc(o.para) + '</p><div class="tabela-mini">' +
        o.itens.map(function (it) { return '<div><a href="#receita-' + it.receita + '" style="font-weight:800">' + esc(nomeRec(it.receita)) + '</a><span>' + esc(it.uso) + '</span></div>'; }).join('') + '</div>' +
        '<div class="btns"><button class="btn ' + (sel ? 'feito' : 'ghost') + ' block" data-acao="objetivo" data-v="' + esc(o.id) + '" aria-pressed="' + sel + '">' + (sel ? ico('check') + 'This is my focus (tap to deselect)' : 'Choose as my focus') + '</button></div></div>';
    });
  } else if (id === 'g-ingredientes') {
    h += '<p class="kicker">Ingredient guide</p><h1>What each ingredient does</h1>';
    G.ingredientes.forEach(function (i) {
      h += '<div class="card"><h3>' + esc(i.nome) + '</h3><p>' + esc(i.paraQueServe) + '</p><div class="aviso-lim">' + ico('alerta') + '<span><b>Caution:</b> ' + esc(i.cuidado) + '</span></div></div>';
    });
  } else if (id === 'g-kit') {
    h += '<p class="kicker">Basic kit</p><h1>What to gather at home</h1><div class="card">' + listaUL(String(G.kitBasico).replace(/\.\s*$/, '').split(/\s*·\s*/)) + '</div>' +
      '<div class="card pastel"><h3>' + esc(G.regrasDeOuro[2].titulo) + '</h3><p>' + esc(G.regrasDeOuro[2].texto) + '</p></div>';
  } else if (id === 'g-faq') {
    h += '<p class="kicker">Questions</p><h1>Frequently asked questions</h1><div class="card faq">' + G.faq.map(function (f) {
      return '<details><summary><span>' + esc(f.p) + '</span>' + ico('seta') + '</summary><p>' + esc(f.r) + '</p></details>';
    }).join('') + '</div>';
  } else if (id === 'g-regras') {
    h += '<p class="kicker">Always</p><h1>The 6 golden rules</h1><div class="card">' + G.regrasDeOuro.map(function (r) {
      return '<div class="regra"><span class="n">' + r.n + '</span><div><b>' + esc(r.titulo) + '</b>' + esc(r.texto) + '</div></div>';
    }).join('') + '</div>';
  } else if (id === 'g-aviso') {
    h += '<p class="kicker">Read carefully</p><h1>Important notice</h1><div class="atencao">' + ico('alerta') + '<div><b>Notice</b>' + esc(G.avisoImportante) + '</div></div>' +
      '<div class="card"><h3>' + esc(G.regrasDeOuro[4].titulo) + '</h3><p>' + esc(G.regrasDeOuro[4].texto) + '</p><h3 class="mt">' + esc(G.regrasDeOuro[5].titulo) + '</h3><p>' + esc(G.regrasDeOuro[5].texto) + '</p></div>';
  } else {
    h += '<p class="vazio">Page not found.</p>';
  }
  return h + rodape();
}
