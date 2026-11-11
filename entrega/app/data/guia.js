/* MODELED-EN */
/*
Adapted for American women 40+ and 50+, with appearance-only language and consistent recipe names.
Replaced fresh aloe with store-bought gel; removed guaranteed storage periods and boiling-water bottle cleaning.
Preserved all keys, IDs, numeric data, references, and list counts. Recipe formulas were not supplied.
Safety references: [AAD sunscreen guidance](https://www.aad.org/public/everyday-care/sun-protection/shade-clothing-sunscreen/how-to-apply-sunscreen), [FDA cosmetic hygiene guidance](https://www.fda.gov/cosmetics/potential-contaminants-cosmetics/microbiological-safety-and-cosmetics).
*/
var GUIA = {
  boasVindas: {
    titulo: "Your ritual starts here",
    texto: [
      "Skincare can be simple and still feel like a little time just for you.",
      "Korean Silk Method brings together 30 homemade recipes and rituals inspired by Korean skincare, with a simple approach: hydrate first, add comfort, then focus on a fresh glow and the look of smoother skin. In your 40s, 50s, and beyond, let your skin's comfort guide you.",
      "You don't need to memorize 30 recipes. Start with the 6 Essential Rituals, introducing one at a time, and explore the others when you'd like a little variety.",
      "You'll find familiar grocery store and drugstore ingredients, with short, easy steps. Start with a patch test before trying anything new. Then take a breath, grab a clean bowl, and make a little room for yourself."
    ]
  },

  regrasDeOuro: [
    { n: 1, titulo: "Patch test first", texto: "Apply a small amount to your inner forearm or behind your ear. Follow the recipe's contact time, rinse if directed, and wait 24 hours before broader use. If itching, burning, redness, or swelling occurs, rinse and stop. A patch test cannot guarantee that a reaction won't happen later." },
    { n: 2, titulo: "Sunscreen, every day", texto: "Apply broad-spectrum SPF 30+ sunscreen every morning, rain or shine. Follow the label and reapply as directed, especially outdoors or after swimming or sweating. Homemade skincare never replaces sunscreen." },
    { n: 3, titulo: "Keep everything clean", texto: "Wash your hands and use thoroughly cleaned, dry bowls, spoons, and containers. Glass or ceramic bowls work well. Clean spray bottles according to their care instructions and let them dry completely; don't assume they can withstand boiling water. Clean equipment does not make a mixture sterile." },
    { n: 4, titulo: "Make it fresh", texto: "Make only enough for one use and discard leftovers. Mixtures containing water, tea, fruit, yogurt, or aloe have no tested preservation system. Oil-and-butter mixtures also have no guaranteed shelf life. A refrigerator does not make a homemade mixture reliably safe to store." },
    { n: 5, titulo: "Give sensitive skin extra care", texto: "Keep homemade mixtures off broken, irritated, or sunburned skin and away from your eyes. If you have sensitive skin, a skin condition such as inflammatory acne, rosacea, or eczema, or are pregnant, check with a dermatologist before starting." },
    { n: 6, titulo: "Keep expectations gentle", texto: "These rituals are about how skin looks and feels: softness, a fresh glow, and comfort. Any effects may be temporary, and results vary. They are cosmetic care, not medical advice." }
  ],

  inspiracao: "These recipes take inspiration from Korean skincare's emphasis on hydration, gentle care, and consistency. They are accessible homemade interpretations, not a claim that each recipe represents an authentic Korean tradition.",

  metodo: {
    titulo: "The 3-layer method",
    subtitulo: "A simple order for choosing your care.",
    camadas: [
      { n: 1, id: "hidratar", nome: "Hydrate", foco: "Softness, a fresh glow, and a rested look",
        texto: "Start light. These skin splashes, toners, gels, and lightweight masks may leave skin feeling refreshed and softer, with a more rested appearance.",
        tipos: "Skin splashes · Toners · Gels · Lightweight masks" },
      { n: 2, id: "nutrir", nome: "Nourish", foco: "Comfort and smoother-looking texture",
        texto: "Next, add comfort where you need it. Creamy masks, creams, and oils can leave dry-feeling skin softer and give its surface a smoother look.",
        tipos: "Rich masks · Creams · Oils · Gentle exfoliation" },
      { n: 3, id: "rejuvenescer", nome: "Refresh", foco: "A fresh look at every age",
        texto: "Finish with a little extra attention to a fresh-looking face, comfortable skin, and often-overlooked areas such as your neck and upper chest. Keep homemade mixtures away from your eyes.",
        tipos: "Smoother-looking skin · Eye-area care · Neck and chest · Massage" }
    ],
    sequencia: ["Cleanse", "Hydrate", "Nourish", "Refresh", "Sunscreen"],
    regraDaSequencia: "Apply leave-on products from lightest to richest: skin splashes and gels first, then creams or oils. Use rinse-off masks after cleansing and rinse fully before leave-on steps. The layers organize your choices; you don't need every layer or every recipe in one session. Introduce one recipe at a time and follow its directions. Every morning, finish with broad-spectrum SPF 30+ sunscreen."
  },

  essenciais: [1, 11, 12, 14, 3, 23],

  rotinasProntas: {
    manha: {
      nome: "Fresh Start Morning Ritual", duracao: "Morning · 5 to 8 minutes",
      passos: [
        { titulo: "Cleanse your face", detalhe: "Use lukewarm water or your usual gentle cleanser. Pat dry without rubbing.", receita: null },
        { titulo: "Rice Water Skin Splash", detalhe: "Apply a freshly made portion with a cotton round, avoiding your eyes. Let dry.", receita: 1 },
        { titulo: "Fresh Glow Gel", detalhe: "Apply a thin layer. Allow 2 minutes for it to settle.", receita: 3 },
        { titulo: "Eye-Area Comfort Cream", detalhe: "Pat a tiny amount onto the outer cheekbones, well away from eyes, eyelids, and lash lines.", receita: 23 },
        { titulo: "Sunscreen", detalhe: "Apply broad-spectrum SPF 30+ as directed on the label. Make it your daily finishing step.", receita: null }
      ]
    },
    noite: {
      nome: "Soft Skin Evening Ritual", duracao: "Evening · 15 to 25 minutes",
      passos: [
        { titulo: "Take off makeup and cleanse", detalhe: "Use your usual gentle cleanser and makeup remover as needed.", receita: null },
        { titulo: "Gentle Green Tea Toner", detalhe: "Or try freshly made Rice Water Skin Splash. Let either cool fully before applying.", receita: 4, alternativas: [1] },
        { titulo: "Choose an evening mask", detalhe: "Try Creamy Rice Mask, Evening Comfort Mask, or Smooth Look Mask. Follow the contact time and rinse as directed; don't extend wear overnight.", receita: 11, alternativas: [14, 21] },
        { titulo: "Silky Feel Serum", detalhe: "Apply a thin layer with gentle palm presses. Avoid rubbing or pulling.", receita: 22 },
        { titulo: "Eye-Area Comfort Cream", detalhe: "Use a tiny amount on the outer cheekbones, keeping clear of eyes, eyelids, and lash lines.", receita: 23 },
        { titulo: "Rich Comfort Cream", detalhe: "For your neck and upper chest, choose Neck & Chest Comfort Cream instead if you prefer.", receita: 12, alternativas: [25] },
        { titulo: "Silky Lips Balm", detalhe: "Smooth a comfortable layer onto your lips before bed, following the recipe's directions.", receita: 9 }
      ]
    },
    dica: "On busy days, keep it simple: cleanse gently, use a moisturizer you already tolerate, and apply broad-spectrum SPF 30+ every morning. A freshly made rice water step is optional. Consistency matters more than a long routine."
  },

  rotinasObjetivo: [
    { id: "opaca", nome: "Dull-Looking Skin Routine", para: "For a fresher glow. These frequencies are optional starting points, not a checklist.",
      itens: [{ receita: 1, uso: "daily, if comfortable" }, { receita: 17, uso: "1 time per week, only if tolerated" }, { receita: 11, uso: "1 to 2 times per week" }, { receita: 3, uso: "3 to 4 times per week" }] },
    { id: "cansada", nome: "Rested Look Routine", para: "For a refreshed feeling and a more rested appearance. Choose what feels comfortable.",
      itens: [{ receita: 24, uso: "as needed, keeping clear of the eyes" }, { receita: 2, uso: "as needed during the day; make fresh each time" }, { receita: 14, uso: "2 to 3 times per week, if tolerated" }, { receita: 23, uso: "morning and evening, if tolerated" }] },
    { id: "firmeza40", nome: "Smooth Look Routine 40+", para: "For skin that could use a softer feel and a smoother appearance.",
      itens: [{ receita: 22, uso: "daily, if tolerated" }, { receita: 28, uso: "3 to 5 times per week, if comfortable" }, { receita: 21, uso: "1 to 2 times per week" }, { receita: 12, uso: "at night, as needed" }] },
    { id: "nutricao50", nome: "Extra Comfort Routine 50+", para: "For skin that wants richer textures and a little more comfort.",
      itens: [{ receita: 15, uso: "1 time per week" }, { receita: 13, uso: "1 time per week" }, { receita: 29, uso: "2 to 3 times per week, if tolerated" }, { receita: 25, uso: "each evening, if comfortable" }] },
    { id: "hidratacao", nome: "Dry-Feeling Skin Routine", para: "For skin that feels tight or thirsty. Start slowly and use fewer steps if needed.",
      itens: [{ receita: 1, uso: "up to 2 times daily, if comfortable; make fresh each time" }, { receita: 7, uso: "2 times per week, if tolerated" }, { receita: 10, uso: "1 to 2 times per week" }, { receita: 3, uso: "3 to 4 times per week" }] },
    { id: "noturna", nome: "Evening Wind-Down Routine", para: "For a comfortable end to the day. Alternate recipes instead of using everything together.",
      itens: [{ receita: 4, uso: "each evening, if tolerated" }, { receita: 26, uso: "1 time per week, only if comfortable" }, { receita: 29, uso: "2 to 3 times per week" }, { receita: 12, uso: "3 to 5 nights per week, if needed" }] }
  ],

  ingredientes: [
    { nome: "Rice (water and flour)", paraQueServe: "May leave skin feeling soft and silky", cuidado: "Use plain jasmine rice or plain rice flour. Make rice water fresh, use immediately, and discard leftovers; never ferment it." },
    { nome: "100% pure aloe vera gel", paraQueServe: "A light gel base that can feel cool and refreshing", cuidado: "Choose a store-bought product labeled 100% pure aloe vera gel, without added fragrance, color, or drying alcohol. Don't use gel or yellow sap from a freshly cut leaf." },
    { nome: "Green tea", paraQueServe: "Refreshing toners and compresses", cuidado: "Use plain, lightly brewed tea. Cool fully, use immediately, and discard leftovers." },
    { nome: "Honey", paraQueServe: "May leave skin feeling softer and more comfortable", cuidado: "Choose plain honey without added flavors. Avoid if you have a known allergy to honey or bee products." },
    { nome: "Rolled oats", paraQueServe: "A soft texture for gentle, comforting masks", cuidado: "Choose plain, unflavored oats and grind finely when directed. Don't scrub, and avoid if you're allergic to oats." },
    { nome: "Plain yogurt", paraQueServe: "A creamy, cooling texture for rinse-off masks", cuidado: "Use plain, unsweetened yogurt made with pasteurized milk. Avoid with a milk allergy, and discard leftovers." },
    { nome: "Flaxseed", paraQueServe: "A gel that may give skin a temporarily smoother look", cuidado: "Use plain flaxseed. Make the gel fresh, cool fully, and discard leftovers." },
    { nome: "Shea butter and sweet almond oil", paraQueServe: "Rich textures that can soften dry-feeling skin", cuidado: "Choose fragrance-free products. Avoid almond oil with an almond allergy; use sparingly if rich textures feel heavy." },
    { nome: "Avocado and banana", paraQueServe: "Creamy masks that may leave skin feeling softer", cuidado: "Use fresh, ripe fruit and keep to the recipe's contact time. Avoid known allergens; don't substitute lemon, lime, or other acidic fruit juices." },
    { nome: "Rosehip oil", paraQueServe: "An optional finishing oil for a softer skin feel", cuidado: "Choose a fragrance-free cosmetic oil and use sparingly. Follow its storage label and wear broad-spectrum SPF 30+ every day." }
  ],
  kitBasico: "Small glass or ceramic bowls · silicone spoon or spatula · small glass containers with lids for preparing single-use portions · easy-to-clean spray bottle, if needed · cotton rounds · soft washcloth and clean towel · headband.",

  faq: [
    { p: "Can I use every recipe in the same week?", r: "There's no need. Start with the 6 Essential Rituals as a menu of options, introducing one recipe at a time after a 24-hour patch test. Routine frequencies are optional, not goals to reach. Use fewer steps if your skin feels dry, tight, or uncomfortable." },
    { p: "Should I save the mixtures for later?", r: "Make a single-use portion and discard leftovers. A refrigerator does not replace a tested preservation system, even for rice water or toner. Oil-and-butter mixtures also have no guaranteed 30-day shelf life. Without formula-specific safety and stability testing, don't assume a homemade mixture is safe to store. Make a new portion after your patch-test waiting period." },
    { p: "How do I choose for my skin type?", r: "Use each recipe's cautions and your skin's current comfort as your guide. Dry-feeling skin may prefer richer Layer 2 textures; oily skin may feel more comfortable with lighter Layer 1 options. Combination skin can use different textures in different areas. Your preferences may change over time, so start small rather than following age alone." },
    { p: "What if I have allergies or sensitive skin?", r: "Avoid any ingredient you're allergic to, even if it's a familiar food. Always patch test and wait 24 hours before broader use. If you have sensitive skin, a skin condition such as inflammatory acne, rosacea, or eczema, or are pregnant, check with a dermatologist before starting. Stop and rinse if irritation occurs." },
    { p: "When might I notice a difference?", r: "You may notice a softer feel or a refreshed appearance after use, but effects can be temporary and some people notice no change. Results vary, and there is no promised timeline. These rituals are for cosmetic appearance and comfort; daily sunscreen remains part of your routine." },
    { p: "Can I use these with my regular products?", r: "Keep your usual gentle cleanser, moisturizer, and broad-spectrum SPF 30+ sunscreen. Introduce only one new recipe at a time. If you use retinoids, exfoliating acids, or prescription skincare, ask your dermatologist how to fit homemade care into your routine. Don't mix homemade ingredients into your sunscreen or other packaged products." }
  ],

  avisoImportante: "This guide provides general information about cosmetic skincare and personal well-being, not medical advice. It is not intended to diagnose or address any disease or skin condition and does not replace professional care. Any benefits refer only to skin's appearance or feel; effects may be temporary, and results vary. Patch test every new mixture and wait 24 hours before broader use. Wear broad-spectrum SPF 30+ sunscreen every day. If you have sensitive skin, a skin condition, or are pregnant, consult a dermatologist before starting. Keep homemade mixtures away from eyes, eyelids, lash lines, and broken or irritated skin. Make single-use portions and discard leftovers. These recipes are inspired by Korean skincare and do not represent specific authentic traditions. Stop use if irritation occurs and seek professional guidance for a reaction or concern.",

  mensagemFinal: {
    titulo: "Your skin deserves a little care.",
    texto: "Explore the 6 Essential Rituals and choose one to start with after your patch test. Make skincare a small moment that's yours: simple, unhurried, and guided by what feels comfortable."
  }
};
