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

  var renderStoreButton = function(container, name, url) {
    var a = document.createElement('a');
    a.className = 'store-locator-button';
    a.href = url + '?' + DID_REDIRECT_STORE_URL_PARAM + '=1';
    a.innerText = name;
    container.appendChild(a);
  };

  var renderLocationButton = function (container, name, totalStores) {
    var a = document.createElement('a');
    a.className = 'store-locator-button multi-store';
    a.href = '#'
    a.innerHTML = '<span>' + name + '</span>' + '<span>' + totalStores + ' lojas' + '</span>';
    container.appendChild(a);
    a.addEventListener('click', function(e) {
      e.preventDefault()
      renderSecondLevel(name)
    })
  }

  var renderSecondLevel = function(topLevelName) {
    var store = getTopLevelStoresByName(topLevelName);
    if (store) {
      const buttonsContainer = document.querySelector('.buttons-container.root');
      buttonsContainer.style.display = 'none';
      const secondLevelContainer = document.createElement('div');
      secondLevelContainer.className = 'buttons-container second-level';
      for (var i = 0; i < store.stores.length; i++) {
        const s = store.stores[i];
        renderStoreButton(secondLevelContainer, s.name, s.url)
      }
      const backButton = document.createElement('a');
      backButton.href = '#';
      backButton.classList = 'back-button'
      backButton.innerText = 'voltar';
      secondLevelContainer.appendChild(backButton)
      buttonsContainer.insertAdjacentElement('beforebegin', secondLevelContainer);
      backButton.addEventListener('click', function(e) {
        e.preventDefault();
        buttonsContainer.style.display = 'flex';
        secondLevelContainer.parentElement.removeChild(secondLevelContainer);
      })
    }
  }

  /**
   * Renderiza o seletor de lojas
   * e considera as lojas suportadas no momento */
  var renderStoreSelector = function(container, stores) {
    var storeLocatorWrapper = document.createElement('div');
    storeLocatorWrapper.className = 'store-locator-container';
    renderHeader('h3', 'store-locator-header', 'Por favor, escolha a loja mais próxima de você:', storeLocatorWrapper);
    renderHeader('h5', 'store-locator-subheader', 'Venda online para todo o brasil!', storeLocatorWrapper);

    const buttonsContainer = document.createElement('div');
    buttonsContainer.className = 'buttons-container root';

    storeLocatorWrapper.appendChild(buttonsContainer);
    
    // Renderiza botoes de lojas
    for(var i = 0; i < stores.length; i++) {
      var store = stores[i]
      // Essa cidade possui mais de uma loja
      // precisamos renderizar um segundo nível de botões
      // quando clicado
      if (store.stores) {
        renderLocationButton(buttonsContainer, store.name, store.stores.length)
      } else {
        renderStoreButton(buttonsContainer, stores[i].name, stores[i].url);
      }
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
      } else if (stores[i].stores) {
        // indo um pouco longe d+ aqui
        // preciso refatorar e usar uma funcao recursiva
        // caso venhamos a ter mais um terceiro nível
        // por agora esse código fedorento resolve
        for (var j = 0; j < stores[i].stores.length; j++) {
          if (stores[i].stores[j].hostname === location.hostname) {
            storeName = stores[i].stores[j].name;
          }
        }
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
      stores: [
        {
          name: 'Tambiá Shopping',
          url: 'https://www.larshoputilidades.com.br',
          hostname: 'www.larshoputilidades.com.br',
        },
        {
          name: 'Mangabeira Shopping',
          url: 'https://larshopmangabeira.commercesuite.com.br',
          hostname: 'larshopmangabeira.commercesuite.com.br', 
        },
        {
          name: 'Liv Mall ',
          url: 'https://larshoplivmall.commercesuite.com.br/',
          hostname: 'larshoplivmall.commercesuite.com.br',
        }
      ]
    },
    {
      name: 'Santa Rita - PB',
      url: 'https://larshopsantarita.commercesuite.com.br/',
      hostname: 'larshopsantarita.commercesuite.com.br',
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

  /** Retorna o primeiro nível de lojas pelo nome. 
   * Undefined case nao encontre */
  var getTopLevelStoresByName = function(name) {
    for (var i=0; i < stores.length; i++) {
      if (stores[i].name === name) {
        return stores[i];
      }
    }
  }

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
