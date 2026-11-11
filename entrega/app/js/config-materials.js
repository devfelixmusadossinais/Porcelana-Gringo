/* config-materials.js: Materials tab settings (e-book reader, add-ons, unlock). Classic script, loaded after data/rotinas.js.
   data/ is not edited; this file only extends CONFIG. */
CONFIG.MODULOS = CONFIG.MODULOS || {};
CONFIG.MODULOS.calendario = !!CONFIG.MODULOS.calendario;
CONFIG.MODULOS.pantry = !!CONFIG.MODULOS.pantry;   /* true = The Backyard Pantry always unlocked */

/* E-book reader sizing. Pages are US Letter (816 x 1056 px). Reading the iframe DOM is impossible under file://,
   so the reader uses a fixed height: `altura` (px, measured at 816 px width) or paginas x 1075 + 8.
   Re-measure `altura` if an e-book is regenerated with a different page count.
   An e-book may also post {type:'ksm-ebook-height', height:<px>} to window.parent to set it exactly. */
CONFIG.EBOOKS = {
  main:      { paginas: 47, altura: 50496 },
  challenge: { paginas: 31, altura: 33312 },
  shopping:  { paginas: 23, altura: 24720 },
  checklist: { paginas: 39, altura: 41904 },
  pantry:    { paginas: 44, altura: 47080 },
  calendar:  { paginas: 65 }   /* being rebuilt: estimated, not measured */
};

/* Order bumps. preco is in USD (starting values, change freely). checkout opens in a new tab. */
CONFIG.ADDONS = {
  calendar: { preco: 7, checkout: '#CHECKOUT_CALENDAR' },
  pantry:   { preco: 5, checkout: '#CHECKOUT_PANTRY' }
};

/* 'open'   : any valid email unlocks the add-on on this device (trust based, no server).
   'strict' : only emails listed in data/unlock.js unlock (create that file: var UNLOCK = { "a@b.com": ["calendar","pantry"] };). */
CONFIG.UNLOCK_MODE = 'open';
