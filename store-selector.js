window.addEventListener("DOMContentLoaded", function() {

  var DID_REDIRECT_STORE_URL_PARAM = 'did-redirect-from-store';
  var DID_SELECT_STORE_LOCALSTORAGE_KEY = 'did-select-store';
  
  var renderShadowContainer = function() {
    var wrapper = document.createElement('div');
    wrapper.className = 'shadow-container';
    wrapper.id = 'shadow-container';
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
    button.addEventListener('click', function(event) {
      event.preventDefault();
      containerToRemove.style.display = 'none';
      document.body.style.overflow = 'scroll';
      // Se o usuário fechar a janela, não pergunte mais qual
      // loja selecionar. Deixo selecionar pelo botão de escolher loja
      localStorage.setItem(DID_SELECT_STORE_LOCALSTORAGE_KEY, 'true');
    });
  }

  /**
   * Renderiza o seletor de lojas
   * e considera as lojas suportadas no momento */
  var renderStoreSelector = function(container, stores) {
    var storeLocatorWrapper = document.createElement('div');
    storeLocatorWrapper.className = 'store-locator-container';
    renderHeader('h3', 'store-locator-header', 'Por favor, escolha a loja mais próxima de você:', storeLocatorWrapper);
    renderHeader('h5', 'store-locator-subheader', 'Venda online para todo o brasil!', storeLocatorWrapper);
    var renderStoreButton = function(name, url) {
      var a = document.createElement('a');
      a.className = 'store-locator-button';
      a.href = url + '?' + DID_REDIRECT_STORE_URL_PARAM + '=1';
      a.innerText = name;
      storeLocatorWrapper.appendChild(a);
    };
    
    // Renderiza botoes de lojas
    for(var i = 0; i < stores.length; i++) {
      var button = renderStoreButton(stores[i].name, stores[i].url);
    }

    renderHeader('h5', 'store-locator-subheader', 'ou', storeLocatorWrapper);

    var noSelectionButton = document.createElement('a');
    noSelectionButton.className = 'store-locator-no-selection';
    noSelectionButton.innerText = 'Continuar sem escolher uma cidade';
    noSelectionButton.href = '#';
    bindCloseEvent(noSelectionButton, container);
    storeLocatorWrapper.appendChild(noSelectionButton);

    var closeButton = renderCloseButton(storeLocatorWrapper);
    bindCloseEvent(closeButton, container);

    container.appendChild(storeLocatorWrapper);
    return storeLocatorWrapper;
  };

  /** Exibe loja atual em banner no topo 
   * Permite o usuário escolher qual loja deseja utilizar */
  var renderStoreLocationBanner = function(stores) {
    var storeName = 'mudar loja';
    for (var i = 0; i < stores.length; i++) {
      if (stores[i].hostname === location.hostname) {
        storeName = stores[i].name;
      }
    }
    var node = document.createElement('div');
    node.className = 'store-locator-banner';
    var img = document.createElement('img');
    img.src = 'https://cdn.jsdelivr.net/gh/brunojppb/larshop-scripts@master/location-pin.svg';
    img.className = 'map-pin';
    node.appendChild(img);
    var a = document.createElement('a');
    a.href = '#';
    a.className = 'link';
    a.innerText = storeName;
    node.appendChild(a);
    a.addEventListener('click', function(event) {
      event.preventDefault();
      showStoreSelector();
    });
    var header = document.getElementsByTagName('header')[0];
    header.insertAdjacentElement('beforebegin', node);
  };

  var showStoreSelector = function() {
    // Previne página de scrollar durante a exibição do container
    document.body.style.overflow = 'hidden';
    var existingSelector = document.getElementById('shadow-container');
    if (existingSelector) {
      existingSelector.style.display = 'flex';
    } else {
      var shadowContainer = renderShadowContainer();
      renderStoreSelector(shadowContainer, stores);
    }
  };


  /** main */
  var stores = [
    {
      name: 'Brasília - DF',
      url: 'https://larshopdf.commercesuite.com.br',
      hostname: 'larshopdf.commercesuite.com.br',
    },
    {
      name: 'João Pessoa - PB',
      url: 'https://www.larshoputilidades.com.br',
      hostname: 'www.larshoputilidades.com.br',
    },
    {
      name: 'Campina Grande - PB',
      url: 'https://larshopcg.commercesuite.com.br/',
      hostname: 'larshopcg.commercesuite.com.br',
    },
    {
      name: 'Belém - PA',
      url: 'https://larshopbelem.commercesuite.com.br/',
      hostname: 'larshopbelem.commercesuite.com.br',
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
    showStoreSelector();
  }

  // Mostre a loja atual do usuário. e permite a mudança de loja
  renderStoreLocationBanner(stores);

});