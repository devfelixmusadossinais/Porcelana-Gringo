/* MODELED-EN */
/* app.js: rotas, render e eventos. Script clássico. */
(function () {
  var $app = document.getElementById('app');
  var $nav = document.getElementById('nav');
  var $modal = document.getElementById('modal');
  var $toast = document.getElementById('toast');
  var ultimaRota = null, pilha = [], tToast = null, tSalvar = null;

  window.avisoStore = function () {
    var el = document.getElementById('aviso-armazenamento');
    if (el) el.hidden = Store.ok();
  };

  function rota() { var h = (window.location.hash || '').replace(/^#/, ''); return h || 'hoje'; }
  function ir(h) { if (rota() === h) render(); else window.location.hash = h; }

  function render() {
    var r = rota(), html = '', navKey = null, mostrarNav = true;
    var premium = { desafio: 'desafio', compras: 'compras', checklist: 'checklist' };
    var base = r.split('-')[0];
    if (premium[base] && !temModulo(premium[base])) { window.location.replace('#materials'); return; }

    if (!S.aceitouRegras && r !== 'g-aviso') {
      html = telaOnboarding(); mostrarNav = false;
    } else if (r === 'dia0') {
      if (S.inicio) { window.location.replace('#hoje'); return; }
      UI.onb = 2; html = '<header class="topo"><button class="voltar" data-acao="voltar" data-para="hoje">' + ico('voltar') + 'Back</button></header>' + telaOnboarding(); navKey = 'hoje';
    } else if (r === 'hoje') { UI.diaVisto = null; html = telaHoje(); navKey = 'hoje'; }
    else if (/^dia-\d+$/.test(r)) { UI.diaVisto = +r.split('-')[1]; html = telaHoje(); navKey = 'hoje'; }
    else if (r === 'dias') { html = telaDias(); navKey = 'dias'; }
    else if (r === 'receitas') { html = telaReceitas(); navKey = 'receitas'; }
    else if (/^receita-\d+$/.test(r)) { html = telaReceita(+r.split('-')[1]); navKey = 'receitas'; }
    else if (r === 'balanco') { html = telaBalanco(); navKey = 'balanco'; }
    else if (r === 'guia' || r === 'extras') { window.location.replace('#materials'); return; }
    else if (r === 'materials') { html = telaExtras(); navKey = 'materials'; }
    else if (r === 'metodo') { html = telaGuia(); navKey = 'materials'; }
    else if (/^ebook-/.test(r)) {
      var livro = LIVROS_EXTRAS[r.slice(6)];
      if (!livro || !livroLiberado(livro)) { window.location.replace('#materials'); return; }
      html = telaEbook(livro); navKey = 'materials';
    }
    else if (/^g-/.test(r)) { html = telaGuiaPagina(r); navKey = 'materials'; }
    else if (r === 'desafio' || /^desafio-\d+$/.test(r)) { if (r !== 'desafio') UI.desafioDia = +r.split('-')[1]; html = telaDesafio(); navKey = 'materials'; }
    else if (r === 'compras') { html = telaCompras(); navKey = 'materials'; }
    else if (r === 'checklist') { html = telaChecklist(); navKey = 'materials'; }
    else { window.location.replace('#hoje'); return; }

    var mudou = r !== ultimaRota;
    var foco = document.activeElement && document.activeElement.id && $app.contains(document.activeElement) ? document.activeElement.id : null;
    var y = window.scrollY;
    $app.innerHTML = '<div class="' + (mudou ? 'view' : '') + '">' + html + '</div>';
    $app.classList.toggle('sem-nav', !mostrarNav);
    $app.classList.toggle('larga', navKey === 'materials' && (r === 'materials' || /^ebook-/.test(r)));
    $nav.hidden = !mostrarNav;
    Array.prototype.forEach.call($nav.querySelectorAll('a'), function (a) {
      if (a.getAttribute('data-nav') === navKey) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
    ajustarEbook();
    if (mudou) { window.scrollTo(0, 0); ultimaRota = r; }
    else {
      window.scrollTo(0, y);
      if (foco) { var el = document.getElementById(foco); if (el) { try { el.focus({ preventScroll: true }); } catch (e) { el.focus(); } } }
    }
  }

  function toast(msg) {
    $toast.textContent = msg;
    $toast.classList.add('on');
    clearTimeout(tToast);
    tToast = setTimeout(function () { $toast.classList.remove('on'); }, 2600);
  }
  function salvarDepois() { clearTimeout(tSalvar); tSalvar = setTimeout(salvar, 250); }

  /* modal de confirmação */
  var aoConfirmar = null, focoAntes = null;
  function confirmar(titulo, texto, rotuloOk, perigo, fn) {
    focoAntes = document.activeElement;
    aoConfirmar = fn;
    $modal.innerHTML = '<div class="caixa-m" role="dialog" aria-modal="true" aria-labelledby="m-tit"><h2 id="m-tit">' + esc(titulo) + '</h2><p>' + esc(texto) + '</p>' +
      '<div class="btns"><button class="btn block' + (perigo ? ' perigo cheio' : '') + '" data-modal="ok">' + esc(rotuloOk) + '</button><button class="btn ghost block" data-modal="nao">Cancel</button></div></div>';
    $modal.hidden = false;
    var b = $modal.querySelector('[data-modal="nao"]'); if (b) b.focus();
  }
  function fecharModal() { $modal.hidden = true; $modal.innerHTML = ''; aoConfirmar = null; if (focoAntes && focoAntes.focus) focoAntes.focus(); }
  $modal.addEventListener('click', function (e) {
    var b = e.target.closest('[data-modal]');
    if (e.target === $modal) { fecharModal(); return; }
    if (!b) return;
    var fn = aoConfirmar;
    fecharModal();
    if (b.getAttribute('data-modal') === 'ok' && fn) fn();
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !$modal.hidden) fecharModal(); });

  /* backup */
  function exportarArquivo() {
    try {
      var blob = new Blob([exportarJSON()], { type: 'application/json' });
      var url = URL.createObjectURL(blob), a = document.createElement('a');
      a.href = url; a.download = 'Korean Silk Method-progress-' + hojeISO() + '.json';
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(function () { URL.revokeObjectURL(url); }, 4000);
      toast('File exported.');
    } catch (e) { toast('Could not export the file. Use the text code.'); }
  }
  function restaurar(txt) {
    var o;
    try { o = lerBackup(txt); } catch (e) { toast('This file or code is not a valid progress backup.'); return; }
    confirmar('Restore progress?', 'The current progress on this device will be replaced with the progress you imported.', 'Yes, restore', false, function () {
      aplicarBackup(o); UI.diaVisto = null; toast('Progress restored.'); ir('hoje');
    });
  }
  function copiar(txt, el) {
    function fallback() {
      try { el.focus(); el.select(); var ok = document.execCommand('copy'); toast(ok ? 'Code copied.' : 'Select the code and copy it.'); }
      catch (e) { toast('Select the code and copy it.'); }
    }
    try {
      if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(txt).then(function () { toast('Code copied.'); }, fallback);
      else fallback();
    } catch (e) { fallback(); }
  }

  /* cliques */
  document.addEventListener('click', function (e) {
    var el = e.target.closest('[data-acao]');
    if (!el || el.tagName === 'INPUT') return;
    var a = el.getAttribute('data-acao'), ds = el.dataset, d = +ds.dia;
    switch (a) {
      case 'onb':
        if (+ds.p === 2 && !UI.aceite) return;
        UI.onb = +ds.p; render(); window.scrollTo(0, 0); break;
      case 'comecar':
        S.aceitouRegras = true;
        if (!S.inicio) S.inicio = hojeISO();
        salvar(); UI.onb = 0; toast('Your day 1 starts today.'); ir('hoje'); break;
      case 'depois':
        S.aceitouRegras = true; salvar(); UI.onb = 0; ir('hoje'); break;
      case 'ir-dia0': ir('dia0'); break;
      case 'dia-ant': ir('dia-' + Math.max(1, (UI.diaVisto || diaAtual()) - 1)); break;
      case 'dia-prox':
        var prox = (UI.diaVisto || diaAtual()) + 1;
        ir(prox >= diaAtual() ? 'hoje' : 'dia-' + prox); break;
      case 'mascara':
        var rg = regDia(d), n = +ds.n;
        rg.mascara = n;
        if (rg.feitos[ds.chave]) rg.feitos[ds.chave] = [n];
        salvar(); render(); break;
      case 'pele':
        var rp = regDia(d); rp.pele = rp.pele === ds.v ? null : ds.v; salvar(); render(); break;
      case 'concluir':
        var rc = regDia(d); rc.concluido = !rc.concluido; salvar(); render();
        if (rc.concluido) toast('Day ' + d + ' completed.');
        break;
      case 'f-camada': UI.filtro.camada = ds.v; render(); break;
      case 'f-ess': UI.filtro.ess = !UI.filtro.ess; render(); break;
      case 'f-fav': UI.filtro.fav = !UI.filtro.fav; render(); break;
      case 'fav':
        var sr = S.receitas[ds.n] || (S.receitas[ds.n] = {}); sr.fav = !sr.fav; salvar(); render();
        toast(sr.fav ? 'Saved to favorites.' : 'Removed from favorites.'); break;
      case 'aval':
        var sa = S.receitas[ds.n] || (S.receitas[ds.n] = {}); sa.aval = sa.aval === ds.v ? null : ds.v; salvar(); render(); break;
      case 'objetivo':
        S.objetivo = S.objetivo === ds.v ? null : ds.v; salvar(); render();
        toast(S.objetivo ? 'Focus selected. It appears in Today starting on day ' + CONFIG.plano21.focoAPartirDoDia + '.' : 'Focus cleared.'); break;
      case 'dom-cor':
        var dc = S.domingo[ds.w] || (S.domingo[ds.w] = {}); dc.cor = dc.cor === ds.v ? null : ds.v; salvar(); render(); break;
      case 'dom-nota':
        var dn = S.domingo[ds.w] || (S.domingo[ds.w] = {}); dn.notas = dn.notas || {};
        dn.notas[ds.item] = dn.notas[ds.item] === +ds.v ? null : +ds.v; salvar(); render(); break;
      case 'escala':
        var es = sub(ds.g, ds.sub); es[ds.item] = es[ds.item] === +ds.v ? null : +ds.v; salvar(); render(); break;
      case 'exportar': exportarArquivo(); break;
      case 'gerar-codigo':
        var ta = document.getElementById('codigo-exp'), cod = codigoDeTexto(); ta.value = cod; copiar(cod, ta); break;
      case 'restaurar-codigo':
        var ti = document.getElementById('codigo-imp'); if (!ti.value.trim()) { toast('Paste the code first.'); return; } restaurar(ti.value); break;
      case 'zerar':
        confirmar('Reset everything?', 'This deletes the start date, checkmarks, notes, and favorites on this device. This cannot be undone. You can export your progress first.', 'Yes, delete everything', true, function () {
          zerar(); UI.onb = 0; UI.aceite = false; UI.diaVisto = null; UI.desafioDia = null; toast('Everything has been reset.'); ir('hoje');
        }); break;
      case 'voltar':
        if (pilha.length > 1) window.history.back(); else ir(ds.para || 'hoje'); break;
      case 'unlock-abrir':
        UI.unlockAberto = UI.unlockAberto === ds.v ? null : ds.v; UI.unlockMsg = null; render();
        if (UI.unlockAberto) { var ie = document.getElementById('ul-' + ds.v); if (ie) { try { ie.focus(); } catch (x) {} } }
        break;
      case 'd-dia': UI.desafioDia = +ds.v; ir('desafio-' + ds.v); break;
      case 'c-aba': UI.comprasAba = ds.v; render(); break;
      case 'k-aba': UI.checkAba = ds.v; render(); break;
      case 'k-foco':
        var kf = sub('checklist', 'sem' + UI.checkSemana); kf.foco = kf.foco === ds.v ? null : ds.v; salvar(); render(); break;
      case 'k-dia': UI.checkDia = +ds.v; render(); break;
      case 'k-cor':
        var km = sub('checklist', 'mes' + ds.m); km['cor' + ds.w] = km['cor' + ds.w] === ds.v ? null : ds.v; salvar(); render(); break;
    }
  });

  /* unlock by email (front-end only: nothing is sent anywhere) */
  document.addEventListener('submit', function (e) {
    var f = e.target.closest ? e.target.closest('[data-form="unlock"]') : null;
    if (!f) return;
    e.preventDefault();
    var nome = f.getAttribute('data-v'), em = f.querySelector('input[name="email"]').value;
    tentarLiberar(em, nome, function (res) {
      if (res.ok) { UI.unlockAberto = null; UI.unlockMsg = { nome: nome, texto: 'Unlocked on this device' }; toast('Unlocked on this device.'); }
      else {
        UI.unlockMsg = { nome: nome, texto: res.motivo === 'invalid' ? 'Enter a valid email address, like name@example.com.' :
          res.motivo === 'unknown' ? 'We could not find that email. Use the address from your purchase.' : 'The unlock list is unavailable right now. Try again later.' };
      }
      render();
      if (!res.ok) { var i = document.getElementById('ul-' + nome); if (i) { i.value = em; i.focus(); } }
    });
  });

  /* checkboxes e selects */
  document.addEventListener('change', function (e) {
    var el = e.target, a = el.getAttribute('data-acao'), c = el.getAttribute('data-campo');
    if (a === 'aceite') { UI.aceite = el.checked; render(); return; }
    if (a === 'passo') {
      var d = +el.dataset.dia, rg = regDia(d), conta = el.dataset.conta ? el.dataset.conta.split(',').filter(Boolean).map(Number) : [];
      if (el.checked) rg.feitos[el.dataset.chave] = conta; else delete rg.feitos[el.dataset.chave];
      salvar(); render(); return;
    }
    if (a === 'marca') {
      var g = el.dataset.g; S[g] = S[g] || {};
      if (el.checked) S[g][el.dataset.k] = true; else delete S[g][el.dataset.k];
      salvar(); render(); return;
    }
    if (c === 'f-obj') { UI.filtro.obj = el.value; render(); return; }
    if (c === 'k-sem') { UI.checkSemana = +el.value; render(); return; }
    if (c === 'arquivo-imp') {
      var f = el.files && el.files[0]; if (!f) return;
      var fr = new FileReader();
      fr.onload = function () { restaurar(String(fr.result || '')); el.value = ''; };
      fr.onerror = function () { toast('Could not read the file.'); };
      fr.readAsText(f);
    }
  });

  /* textos (salvam sem redesenhar) */
  document.addEventListener('input', function (e) {
    var el = e.target, c = el.getAttribute('data-campo'), ds = el.dataset;
    if (!c) return;
    if (c === 'busca') {
      UI.filtro.q = el.value;
      var box = document.getElementById('rlista-box'); if (box) box.innerHTML = listaReceitasHTML();
      return;
    }
    if (c === 'nota-dia') { regDia(+ds.dia).nota = el.value; }
    else if (c === 'nota-rec') { var sr = S.receitas[ds.n] || (S.receitas[ds.n] = {}); sr.nota = el.value; }
    else if (c === 'dom-resp') { var dm = S.domingo[ds.w] || (S.domingo[ds.w] = {}); dm.resp = dm.resp || []; dm.resp[+ds.i] = el.value; }
    else if (c === 'texto') {
      var g = ds.g, k = ds.k, p = k.indexOf('.');
      S[g] = S[g] || {};
      if (p > 0) sub(g, k.slice(0, p))[k.slice(p + 1)] = el.value; else S[g][k] = el.value;
    } else return;
    salvarDepois();
  });

  window.addEventListener('hashchange', function () {
    var r = rota();
    if (pilha.length > 1 && pilha[pilha.length - 2] === r) pilha.pop(); else pilha.push(r);
    render();
  });

  /* início */
  pilha.push(rota());
  Store.teste();
  carregar();
  lerPlanoDaURL();
  lerExtrasDaURL();
  avisoStore();
  render();
})();
