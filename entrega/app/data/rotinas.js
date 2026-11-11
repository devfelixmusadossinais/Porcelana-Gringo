/* MODELED-EN */
/* Localized the brand and visible labels into natural U.S. English. Preserved technical identifiers, settings, and schedules. This file contains no recipes, measurements, or cosmetic claims to adapt. */
/* Configuração do app. Script clássico (abre com duplo clique, sem servidor).
   Edite aqui o plano padrão e os módulos. Conteúdo das receitas fica nos outros arquivos de data/. */
var CONFIG = {
  NOME: 'Korean Silk Method',

  /* plano padrão quando a URL não traz ?plano=basico|premium */
  PLANO: 'premium',

  planos: {
    basico:  { nome: 'Basic',  desafio: false, compras: false, checklist: false },
    premium: { nome: 'Premium', desafio: true,  compras: true,  checklist: true  }
  },

  /* calendario: bloco DESAFIO.balancoFinal.oQueVemDepois.calendarioDe21Dias
     é de um produto à parte que ainda não existe. Deixe false. */
  MODULOS: { calendario: false },

  /* lógica dos 21 dias (ver LEIA-ME.md) */
  plano21: {
    totalDias: 21,
    diasDoDesafio: 7,          /* no premium, dias 1 a 7 seguem DESAFIO.dias */
    focoAPartirDoDia: 8,       /* rotina por objetivo entra como foco a partir daqui */
    mascaraDaNoite: {
      tituloDoPasso: 'Night mask',   /* passo de GUIA.rotinasProntas.noite que troca */
      opcoes: [11, 14, 21],                /* as opções que o próprio passo lista */
      /* rodízio de 7 noites: 14 x3 (máx 3), 11 x2 (máx 2), 21 x2 (máx 2) */
      rodizio: [14, 11, 21, 14, 11, 21, 14]
    },
    /* receitas que no ritual da manhã entram em camada fina e não contam
       para o limite semanal (folha semanal: "Gel Renovador de Viço (camada fina): todo dia";
       o limite de 3 a 4 vezes do cardápio é para o uso como máscara) */
    camadaFinaNaoConta: [3]
  },

  chaveStorage: 'pele-de-porcelana-v1'
};
