# Korean Silk Method (demo)

Dois sites estaticos no mesmo repositorio (sem build). No Netlify, um site por area:

1. **Vendas** (publicar a raiz do repositorio): `/Laurakim.of/`, `/nora_wong/`, `/hannah_soojin/`
2. **Entrega** (Base directory = `entrega`):
   - `/thanks-basic/` e `/thanks-premium/`: paginas de obrigado (abertas, noindex)
   - `/app/`: web app (aceita `?plano=basico` ou `?plano=premium`)
   - `/app/ebooks/`: e-books em PDF e HTML

Placeholders ainda abertos: `#UPSELL_CHECKOUT` (obrigado Basic) e `#CHECKOUT_*` (vendas).
