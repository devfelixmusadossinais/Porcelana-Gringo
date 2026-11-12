/* MODELED-EN */
/* estado.js: armazenamento, estado e lógica dos 21 dias. Script clássico. */
var Store = (function () {
  var ok = true, mem = {};
  function get(k) {
    try { var v = window.localStorage.getItem(k); return v; }
    catch (e) { ok = false; return Object.prototype.hasOwnProperty.call(mem, k) ? mem[k] : null; }
  }
  function set(k, v) {
    mem[k] = v;
    try { window.localStorage.setItem(k, v); }
    catch (e) { ok = false; }
  }
  function del(k) {
    delete mem[k];
    try { window.localStorage.removeItem(k); }
    catch (e) { ok = false; }
  }
  function teste() {
    try {
      var t = '__pp_teste__';
      window.localStorage.setItem(t, '1');
      window.localStorage.removeItem(t);
    } catch (e) { ok = false; }
    return ok;
  }
  return { get: get, set: set, del: del, teste: teste, ok: function () { return ok; } };
})();

/* ---------- utilidades ---------- */
function esc(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
  });
}
function norm(s) {
  return String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
}
function hojeISO() {
  var d = new Date();
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
}
function parseISO(s) {
  var p = String(s).split('-');
  return new Date(+p[0], +p[1] - 1, +p[2]);
}
function difDias(a, b) { /* b - a, em dias de calendário */
  return Math.round((parseISO(b) - parseISO(a)) / 864e5);
}
function dataBR(iso) {
  if (!iso) return '';
  var p = iso.split('-');
  return p[1] + '/' + p[2] + '/' + p[0];
}
function somaDias(iso, n) {
  var d = parseISO(iso); d.setDate(d.getDate() + n);
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
}

/* ---------- receitas ---------- */
var RX = {};
RECEITAS.forEach(function (r) { RX[r.n] = r; });
var CARDAPIO = {};
(CHECKLIST.cardapio && CHECKLIST.cardapio.receitas || []).forEach(function (c) { CARDAPIO[c.receita] = c; });
function rec(n) { return RX[n] || null; }
function nomeRec(n) { var r = RX[n]; return r ? r.nome : ''; }
function maxSemana(n) {
  var r = RX[n];
  return r && r.freq && r.freq.periodo === 'semana' && r.freq.max ? r.freq.max : null;
}
function maxDia(n) {
  var r = RX[n];
  return r && r.freq && r.freq.periodo === 'dia' && r.freq.max ? r.freq.max : null;
}
var CAMADAS = { hidratar: 'Hydrate', nutrir: 'Nourish', rejuvenescer: 'Rejuvenate' };

/* ---------- estado ---------- */
function estadoVazio() {
  return {
    v: 1,
    extras: null,         /* ?extras= from the URL: 'calendar', 'pantry', 'calendar,pantry' or 'none' */
    unlock: {},           /* add-ons unlocked on this device by email: { calendar:true, pantry:true } (no email is stored) */
    plano: null,          /* gravado quando a URL traz ?plano= */
    aceitouRegras: false,
    inicio: null,         /* 'YYYY-MM-DD' do dia 1 */
    objetivo: null,       /* id de GUIA.rotinasObjetivo */
    dias: {},             /* '1': { feitos:{chave:[n]}, concluido, pele, nota, mascara } */
    receitas: {},         /* '11': { fav, aval:'funcionou'|'mais'|'nao', nota } */
    domingo: {},          /* '1': { cor, notas:{}, resp:[] } */
    desafio: {},          /* respostas do modo guiado */
    compras: {},
    checklist: {}
  };
}
var S = estadoVazio();

function carregar() {
  var raw = Store.get(CONFIG.chaveStorage);
  if (!raw) return;
  try {
    var o = JSON.parse(raw);
    if (o && typeof o === 'object' && o.v === 1) S = mesclar(estadoVazio(), o);
  } catch (e) { /* estado corrompido: começa vazio */ }
}
function mesclar(base, o) {
  for (var k in base) if (Object.prototype.hasOwnProperty.call(o, k)) base[k] = o[k];
  return base;
}
function salvar() {
  try { Store.set(CONFIG.chaveStorage, JSON.stringify(S)); } catch (e) { /* memória */ }
  if (typeof avisoStore === 'function') avisoStore();
}
function zerar() {
  var plano = S.plano, extras = S.extras, unlock = S.unlock;
  S = estadoVazio();
  S.plano = plano;
  S.extras = extras;
  S.unlock = unlock || {};
  Store.del(CONFIG.chaveStorage);
  salvar();
}

/* ---------- plano ---------- */
function planoAtual() {
  var q = null;
  try { q = new URLSearchParams(window.location.search).get('plano'); } catch (e) { q = null; }
  if (q === 'basico' || q === 'premium') return q;
  if (S.plano === 'basico' || S.plano === 'premium') return S.plano;
  return CONFIG.PLANO;
}
function lerPlanoDaURL() {
  var q = null;
  try { q = new URLSearchParams(window.location.search).get('plano'); } catch (e) { q = null; }
  if ((q === 'basico' || q === 'premium') && S.plano !== q) { S.plano = q; salvar(); }
}
/* Add-ons: unlocked by URL (?extras=calendar,pantry), by email (S.unlock) or by CONFIG.MODULOS. They add up. */
var ADDONS_VALIDOS = ['calendar', 'pantry'];
function lerExtrasDaURL() {
  var q = null;
  try { q = new URLSearchParams(window.location.search).get('extras'); } catch (e) {}
  if (q == null) return;
  var partes = String(q).toLowerCase().split(/[\s,]+/).filter(Boolean), v;
  if (partes.indexOf('none') >= 0) v = 'none';
  else {
    var ok = ADDONS_VALIDOS.filter(function (a) { return partes.indexOf(a) >= 0; });
    if (!ok.length) return;
    v = ok.join(',');
  }
  if (S.extras !== v) { S.extras = v; salvar(); }
}
function temAddon(nome) {
  var m = CONFIG.MODULOS || {};
  if (nome === 'calendar' && m.calendario) return true;
  if (nome === 'pantry' && m.pantry) return true;
  if (S.unlock && S.unlock[nome]) return true;
  return String(S.extras || '').split(',').indexOf(nome) >= 0;
}
function temCalendario() { return temAddon('calendar'); }
function liberarAddon(nome) { S.unlock = S.unlock || {}; S.unlock[nome] = true; salvar(); }
function emailValido(e) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e) && e.length <= 254; }
/* Resolves with {ok:true, addons:[...]} or {ok:false, motivo:'invalid'|'unknown'|'list'}. Nothing leaves the device. */
function tentarLiberar(email, nome, cb) {
  email = String(email || '').trim().toLowerCase();
  if (!emailValido(email)) { cb({ ok: false, motivo: 'invalid' }); return; }
  function aplicar() {
    var lista = (typeof UNLOCK !== 'undefined' && UNLOCK) ? UNLOCK : {};
    var chave = null;
    Object.keys(lista).forEach(function (k) { if (String(k).trim().toLowerCase() === email) chave = k; });
    var itens = chave ? (lista[chave] || []).filter(function (a) { return ADDONS_VALIDOS.indexOf(a) >= 0; }) : [];
    if (!itens.length) { cb({ ok: false, motivo: 'unknown' }); return; }
    itens.forEach(liberarAddon); cb({ ok: true, addons: itens });
  }
  if (CONFIG.UNLOCK_MODE !== 'strict') { liberarAddon(nome); cb({ ok: true, addons: [nome] }); return; }
  if (typeof UNLOCK !== 'undefined') { aplicar(); return; }
  var sc = document.createElement('script');
  sc.src = 'data/unlock.js';
  sc.onload = aplicar;
  sc.onerror = function () { cb({ ok: false, motivo: 'list' }); };
  document.head.appendChild(sc);
}
function temModulo(m) {
  var p = CONFIG.planos[planoAtual()] || CONFIG.planos.premium;
  return !!p[m];
}

/* ---------- dias ---------- */
function diaAtual() { /* null se não começou */
  if (!S.inicio) return null;
  var d = difDias(S.inicio, hojeISO()) + 1;
  return d < 1 ? 1 : d;
}
function semanaDoDia(d) { return Math.floor((d - 1) / 7) + 1; }
function diasDaSemana(w) { var a = []; for (var i = 1; i <= 7; i++) a.push((w - 1) * 7 + i); return a; }
function regDia(d) {
  var k = String(d);
  if (!S.dias[k]) S.dias[k] = { feitos: {}, concluido: false, pele: null, nota: '', mascara: null };
  if (!S.dias[k].feitos) S.dias[k].feitos = {};
  return S.dias[k];
}
function verDia(d) { return S.dias[String(d)] || null; }
function dataDoDia(d) { return S.inicio ? somaDias(S.inicio, d - 1) : null; }

/* usos de uma receita na semana do plano, sem contar o dia `exceto` */
function usosNaSemana(n, d, exceto) {
  var w = semanaDoDia(d), total = 0;
  diasDaSemana(w).forEach(function (x) {
    if (x === exceto) return;
    total += usosNoDia(n, x);
  });
  return total;
}
function usosNoDia(n, d) {
  var r = verDia(d), t = 0;
  if (!r || !r.feitos) return 0;
  for (var k in r.feitos) {
    var v = r.feitos[k];
    if (Array.isArray(v) && v.indexOf(n) >= 0) t++;
  }
  return t;
}

/* máscara da noite: rodízio de CONFIG respeitando o limite semanal */
function mascaraPadrao(d) {
  var cfg = CONFIG.plano21.mascaraDaNoite;
  var pref = cfg.rodizio[(d - 1) % 7];
  var ordem = [pref].concat(cfg.opcoes.filter(function (x) { return x !== pref; }));
  for (var i = 0; i < ordem.length; i++) {
    var m = ordem[i], max = maxSemana(m);
    if (max == null || usosNaSemana(m, d, d) < max) return m;
  }
  return pref;
}
function mascaraDoDia(d) {
  var r = verDia(d);
  return r && r.mascara ? r.mascara : mascaraPadrao(d);
}

function usaDesafio(d) {
  return temModulo('desafio') && d >= 1 && d <= CONFIG.plano21.diasDoDesafio;
}

/* devolve { manha:{nome,duracao,passos:[...]}, noite:{...}, desafio:objDia|null }
   passo = { chave, titulo, texto, receitas:[n], conta:[n], escolha:[n]|null } */
function planoDoDia(d) {
  var cfg = CONFIG.plano21;
  if (usaDesafio(d)) {
    var dd = DESAFIO.dias[d - 1];
    function conv(bloco, pref) {
      return {
        nome: bloco.nome, duracao: bloco.duracao,
        passos: bloco.passos.map(function (p, i) {
          var rs = (p.receitas || []).slice();
          var conta = rs.filter(function (n) { return !(pref === 'm' && cfg.camadaFinaNaoConta.indexOf(n) >= 0); });
          return { chave: pref + i, titulo: p.titulo, texto: p.texto, receitas: rs, conta: conta, escolha: null };
        })
      };
    }
    return { manha: conv(dd.manha, 'm'), noite: conv(dd.noite, 'n'), desafio: dd };
  }
  var RP = GUIA.rotinasProntas;
  function convG(bloco, pref) {
    return {
      nome: bloco.nome, duracao: bloco.duracao,
      passos: bloco.passos.map(function (p, i) {
        var rs = p.receita ? [p.receita].concat(p.alternativas || []) : [];
        var principal = p.receita ? [p.receita] : [];
        var escolha = null;
        if (pref === 'n' && p.titulo === cfg.mascaraDaNoite.tituloDoPasso) {
          var m = mascaraDoDia(d);
          escolha = cfg.mascaraDaNoite.opcoes.slice();
          principal = [m];
          rs = [m];
        }
        var conta = principal.filter(function (n) { return !(pref === 'm' && cfg.camadaFinaNaoConta.indexOf(n) >= 0); });
        return { chave: pref + i, titulo: p.titulo, texto: p.detalhe, receitas: rs, conta: conta, escolha: escolha, principal: principal };
      })
    };
  }
  return { manha: convG(RP.manha, 'm'), noite: convG(RP.noite, 'n'), desafio: null };
}

function objetivoAtual() {
  if (!S.objetivo) return null;
  for (var i = 0; i < GUIA.rotinasObjetivo.length; i++) if (GUIA.rotinasObjetivo[i].id === S.objetivo) return GUIA.rotinasObjetivo[i];
  return null;
}

function contagemDia(d) {
  var p = planoDoDia(d), r = verDia(d), tot = 0, feitos = 0;
  [p.manha, p.noite].forEach(function (b) {
    b.passos.forEach(function (ps) { tot++; if (r && r.feitos && r.feitos[ps.chave]) feitos++; });
  });
  return { tot: tot, feitos: feitos };
}

function diasConcluidos() {
  var n = 0;
  for (var d = 1; d <= CONFIG.plano21.totalDias; d++) { var r = verDia(d); if (r && r.concluido) n++; }
  return n;
}
function sequencia() {
  var hoje = diaAtual();
  if (!hoje) return 0;
  var d = Math.min(hoje, 9999);
  var r = verDia(d);
  if (!(r && r.concluido)) d--; /* hoje ainda em aberto não quebra a sequência */
  var n = 0;
  while (d >= 1) { var x = verDia(d); if (x && x.concluido) { n++; d--; } else break; }
  return n;
}

/* aviso de limite: devolve texto ou '' */
function avisoLimite(n, d, marcadoHoje) {
  var max = maxSemana(n);
  if (max != null) {
    var outros = usosNaSemana(n, d, d);
    var hojeN = usosNoDia(n, d);
    var total = outros + hojeN;
    if ((marcadoHoje && total > max) || (!marcadoHoje && outros >= max)) {
      var usadas = marcadoHoje ? total : outros;
      return 'This recipe has already been used ' + usadas + (usadas === 1 ? ' time' : ' times') + ' this week; the book recommends a maximum of ' + max + '.';
    }
  }
  var maxd = maxDia(n);
  if (maxd != null && usosNoDia(n, d) > maxd) {
    return 'This recipe has already been used ' + usosNoDia(n, d) + ' times today; the book recommends a maximum of ' + maxd + ' per day.';
  }
  return '';
}

/* ---------- exportar / importar ---------- */
function exportarJSON() { return JSON.stringify(S); }
function codigoDeTexto() {
  return 'PP1:' + btoa(unescape(encodeURIComponent(JSON.stringify(S))));
}
function lerBackup(txt) { /* devolve objeto válido ou lança erro */
  txt = String(txt || '').trim();
  var o;
  if (txt.indexOf('PP1:') === 0) {
    o = JSON.parse(decodeURIComponent(escape(atob(txt.slice(4).replace(/\s+/g, '')))));
  } else {
    o = JSON.parse(txt);
  }
  if (!o || typeof o !== 'object' || o.v !== 1 || typeof o.dias !== 'object') throw new Error('formato');
  return mesclar(estadoVazio(), o);
}
function aplicarBackup(o) { S = o; salvar(); }
