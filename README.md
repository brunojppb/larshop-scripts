# Larshop Scripts

Scripts para a loja [Larshop Utilidades](https://www.larshoputilidades.com.br/) e seus afiliados.

## How to

Adicione o link do JSDelivr dentro da tag `head` em seu template:

```html
<!-- Seletor de loja - INICIO -->
<link rel="stylesheet"
      type="text/css"
      href="https://cdn.jsdelivr.net/gh/brunojppb/larshop-scripts@master/store-selector.min.css">

<script type="application/javascript"
        src="https://cdn.jsdelivr.net/gh/brunojppb/larshop-scripts@master/store-selector.min.js"></script>
<!-- Seletor de loja - FIM -->
```

Para atualizar os scripts, execute um GET request para as URLs:

Javascript
```
https://purge.jsdelivr.net/gh/brunojppb/larshop-scripts@master/store-selector.min.js
```

CSS
```
https://purge.jsdelivr.net/gh/brunojppb/larshop-scripts@master/store-selector.min.css
```

Isso vai fazer com que JSDelivr faça o purge desses assets no CDN e seu site carregara a nova versao dos scripts.