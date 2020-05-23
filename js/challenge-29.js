(function($) {
  'use strict';

  /*
  Vamos estruturar um pequeno app utilizando módulos.
  Nosso APP vai ser um cadastro de carros. Vamos fazê-lo por partes.
  A primeira etapa vai ser o cadastro de veículos, de deverá funcionar da
  seguinte forma:
  - No início do arquivo, deverá ter as informações da sua empresa - nome e
  telefone (já vamos ver como isso vai ser feito)
  - Ao abrir a tela, ainda não teremos carros cadastrados. Então deverá ter
  um formulário para cadastro do carro, com os seguintes campos:
    - Imagem do carro (deverá aceitar uma URL)
    - Marca / Modelo
    - Ano
    - Placa
    - Cor
    - e um botão "Cadastrar"

  Logo abaixo do formulário, deverá ter uma tabela que irá mostrar todos os
  carros cadastrados. Ao clicar no botão de cadastrar, o novo carro deverá
  aparecer no final da tabela.

  Agora você precisa dar um nome para o seu app. Imagine que ele seja uma
  empresa que vende carros. Esse nosso app será só um catálogo, por enquanto.
  Dê um nome para a empresa e um telefone fictício, preechendo essas informações
  no arquivo company.json que já está criado.

  Essas informações devem ser adicionadas no HTML via Ajax.

  Parte técnica:
  Separe o nosso módulo de DOM criado nas últimas aulas em
  um arquivo DOM.js.

  E aqui nesse arquivo, faça a lógica para cadastrar os carros, em um módulo
  que será nomeado de "app".
  */
    var app = (function appController() {
    return {
      init: function() {
        this.companyInfo();
        this.addCar();
        this.getData();
      },

      companyInfo: function companyInfo() {
        var ajax = new XMLHttpRequest();
        ajax.open('GET', '/company.json');
        ajax.send();
        ajax.addEventListener('readystatechange', this.getCompanyInfo, true);
      },

      getCompanyInfo: function getCompanyInfo() {
        if(app.isReady.call(this)) {
          var data = JSON.parse(this.responseText);
          var $companyName = $('[data-js="company-name"]').get();
          var $companyPhone = $('[data-js="company-phone"]').get();
          $companyName.textContent = data.name;
          $companyPhone.textContent = data.phone;
        }
      },

      isReady: function isReady() {
        return this.readyState === 4 && this.status === 200;
      },

      addCar: function addCar() {
        $('[data-js="main-form"]').on('submit', this.submitEvent);
      },

      submitEvent: function submitEvent(event) {
        event.preventDefault();
        appController().registerCar();
      },

      removeCar: function removeCar() {
        this.parentNode.remove();
      },

      carInfo: function carInfo() {
        var carInfo = {
          image: $('[data-js="imagem"]').get().value,
          brandModel: $('[data-js="marca-modelo"]').get().value,
          year: $('[data-js="ano"]').get().value,
          price: $('[data-js="preco"]').get().value,
          color: $('[data-js="cor"]').get().value
        };
        return carInfo;
      },

      registerCar: function registerCar() {
        var carInfo = appController().carInfo();
        var ajax = new XMLHttpRequest();
        ajax.open('POST', 'http://localhost:3000/car');
        ajax.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        ajax.send(
          'image='+carInfo.image+'&brandModel='+carInfo.brandModel+'&year='+carInfo.year+'&plate='+carInfo.price+'&color='+carInfo.color          
        );

        ajax.onreadystatechange = function() {
          if(ajax.readyState === 4 && ajax.status === 200){
            console.log("Carro cadastrado!");
            appController().cleanInputs();
            appController().getData();
          }
        };
        
      },

      cleanInputs: function cleanInputs(){
        $('[data-js="imagem"]').get().value = '';
        $('[data-js="marca-modelo"]').get().value = '';
        $('[data-js="ano"]').get().value = '';
        $('[data-js="cor"]').get().value = '';
        $('[data-js="preco"]').get().value = '';
      },

      getData: function getData() {
        var ajax = new XMLHttpRequest();
        ajax.open('GET', 'http://localhost:3000/car');
        ajax.send();

        ajax.onreadystatechange = function() {
          if(ajax.readyState === 4 && ajax.status === 200){
            console.log("Carro adicionado na tabela!");
            appController().createNewCar(ajax);
          }
        };
      },

      createNewCar: function createNewCar(ajax) {
        var dataResquest = JSON.parse(ajax.responseText);
        var $table = $('[data-js="table"]').get();

        dataResquest.forEach(function(item){
          var $fragment = document.createDocumentFragment();
          var $tr = document.createElement('tr');
          var $tdImagem = document.createElement('td');
          var $imagem = document.createElement('img');
          var $tdMarcaModelo = document.createElement('td');
          var $tdAno = document.createElement('td');
          var $tdCor = document.createElement('td');
          var $tdPreco =  document.createElement('td');
          var $tdRemove =  document.createElement('td');
          var $btnRemove =  document.createElement('button');

          $imagem.setAttribute('src', item.image);
          $tdImagem.appendChild($imagem);

          $tdMarcaModelo.textContent = item.brandModel;
          $tdAno.textContent = item.year;
          $tdCor.textContent = item.color;
          $tdPreco.textContent = item.plate;
          $btnRemove.textContent = 'x';

          $tr.appendChild($tdImagem);
          $tr.appendChild($tdMarcaModelo);
          $tr.appendChild($tdAno);
          $tr.appendChild($tdCor);
          $tr.appendChild($tdPreco);
          $tdRemove.appendChild($btnRemove);
          $tr.appendChild($tdRemove);
          
          $fragment.appendChild($tr);
          $table.appendChild($fragment);

          $tdRemove.addEventListener('click', appController().removeCar, false);
        
        });
      }
    }

  })();

  app.init();
})(window.DOM);