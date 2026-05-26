# Etestech — Site Institucional

Site de marketing para a **Etestech**, agência de desenvolvimento web e apps sediada em São Bernardo do Campo, SP.

## Stack

- **Bundler:** Vite JS
- **Linguagens:** HTML5, CSS3 (custom properties), JavaScript ES Modules
- **Fontes:** Inter + Plus Jakarta Sans (Google Fonts)
- **Ícones:** SVG inline
- **Animações:** CSS transitions + IntersectionObserver

## Rodar localmente

```bash
npm install
npm run dev
```

O servidor inicia em `http://localhost:3000`.

## Build de produção

```bash
npm run build
```

Os arquivos ficam em `dist/` — prontos para deploy.

## Deploy

### Vercel

```bash
npm i -g vercel
vercel
```

Ou conecte o repositório em [vercel.com](https://vercel.com) e configure:
- **Framework Preset:** Vite
- **Output Directory:** `dist`

### Netlify

Arraste a pasta `dist/` para [app.netlify.com/drop](https://app.netlify.com/drop), ou conecte o repositório com:
- **Build command:** `npm run build`
- **Publish directory:** `dist`

## Formulário de contato

O formulário usa [Formspree](https://formspree.io). O endpoint atual está configurado em `src/main.js`:

```js
const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xqejyryp'
```

Para trocar, substitua o ID `xqejyryp` pelo seu em [formspree.io](https://formspree.io).

## Estrutura

```
etestech/
├── index.html
├── package.json
├── vite.config.js
├── README.md
└── src/
    ├── main.js
    ├── style.css
    └── assets/
        └── favicon.svg
```
