window.addEventListener("DOMContentLoaded", function() {

  var DID_REDIRECT_STORE_URL_PARAM = 'did-redirect-from-store';
  var DID_SELECT_STORE_LOCALSTORAGE_KEY = 'did-select-store';
  
  var renderShadowContainer = function() {
    var wrapper = document.createElement('div');
    wrapper.className = 'shadow-container';
    document.body.appendChild(wrapper);
    return wrapper;
  };

  var renderHeader = function(headerTag, className, text, container) {
    var header = document.createElement(headerTag);
    header.className = className;
    header.innerHTML = text;
    container.appendChild(header);
  };

  var renderCloseButton = function(container) {
    var button = document.createElement('button');
    button.className = 'close-button';
    button.setAttribute('aria-hidden', true);
    button.setAttribute('aria-label', 'fechar');
    container.appendChild(button);
  }

  var renderStoreSelector = function(container, stores, nationalStore) {
    var storeLocatorWrapper = document.createElement('div');
    storeLocatorWrapper.className = 'store-locator-container';
    renderHeader('h3', 'store-locator-header', 'Escolha uma cidade mais próxima de você:', storeLocatorWrapper);
    var renderStoreButton = function(name, url) {
      var a = document.createElement('a');
      a.className = 'store-locator-button';
      a.href = url + '?' + DID_REDIRECT_STORE_URL_PARAM;
      a.innerText = name;
      storeLocatorWrapper.appendChild(a);
    };
    for(var i = 0; i < stores.length; i++) {
      var button = renderStoreButton(stores[i].name, stores[i].url);
    }

    renderHeader('h4', 'store-locator-subheader', 'Ou compre em nossa Loja Nacional. Entregamos em todo o Brasil.', storeLocatorWrapper);
    renderStoreButton(nationalStore.name, nationalStore.url);
    renderCloseButton(storeLocatorWrapper);

    container.appendChild(storeLocatorWrapper);
    return storeLocatorWrapper;
  };


  /** main */
  var stores = [
    {
      name: 'Brasília - DF',
      url: 'https://larshopdf.commercesuite.com.br'
    }
  ];

  var nationalStore = {
    name: 'Loja Nacional',
    url: 'https://www.larshoputilidades.com.br'
  };

  /** Renderize store locator apenas quando o usuário está entrando no site pela primeira vez */
  var queryString = window.location.search;
  // usuário veio de uma das lojas após escolher uma das opcões.
  // salve localmante e não pergunte mais a esse usuário qual loja escolher
  if (queryString.indexOf(DID_REDIRECT_STORE_URL_PARAM) !== -1) { 
    console.log('loja escolhida através de redirecionamento.');
    localStorage.setItem(DID_SELECT_STORE_LOCALSTORAGE_KEY, 'true');
    // usuário já selecionou uma loja
  } else if(localStorage.getItem(DID_SELECT_STORE_LOCALSTORAGE_KEY)) {
    console.log('Loja já visitada.');
  } else {
    // primeira visita de usuário na loja, pergunte qual loja ele deseja visitar.
    console.log('primeira visita a loja.');
    var shadowContainer = renderShadowContainer();
    renderStoreSelector(shadowContainer, stores, nationalStore);
  }

});