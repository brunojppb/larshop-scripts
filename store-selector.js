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
    return button;
  }

  var bindCloseEvent = function(button, containerToRemove) {
    button.addEventListener('click', function() {
      containerToRemove.style.display = 'none';
      document.body.style.overflow = 'scroll';
      // Se o usuário fechar a janela, não pergunte mais qual
      // loja selecionar. Deixo selecionar pelo botão de escolher loja
      localStorage.setItem(DID_SELECT_STORE_LOCALSTORAGE_KEY, 'true');
    });
  }

  var renderStoreSelector = function(container, stores) {
    var storeLocatorWrapper = document.createElement('div');
    storeLocatorWrapper.className = 'store-locator-container';
    renderHeader('h3', 'store-locator-header', 'escolha a loja mais próxima de você:', storeLocatorWrapper);
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

    var closeButton = renderCloseButton(storeLocatorWrapper);
    bindCloseEvent(closeButton, container);

    container.appendChild(storeLocatorWrapper);
    return storeLocatorWrapper;
  };


  /** main */
  var stores = [
    {
      name: 'Brasília - DF',
      url: 'https://larshopdf.commercesuite.com.br'
    },
    {
      name: 'João Pessoa - PB',
      url: 'https://www.larshoputilidades.com.br'
    },
  ];

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
    renderStoreSelector(shadowContainer, stores);
    // Previne página de scrollar durante a exibição do container
    document.body.style.overflow = 'hidden';
  }

});