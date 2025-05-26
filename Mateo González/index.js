function buscarPorNombre() {
    let nom = document.getElementById("nombreP").value;
    console.log(nom);
    fetch("https://pokeapi.co/api/v2/pokemon/"+nom)
    .then(res => res.json())
    .then((json) => { 
        console.dir(json)
        let nombre = json.name;
        let uriImg = json.sprites.other.home.front_default;
        let div = document.querySelector("#ConteinerCard")

        let html = `<div class="card" style="width: 18rem;">
    <img src="` +
            uriImg +
            `" class="card-img-top" alt="...">
    <div class="card-body">
      <h5 class="card-title">` +
            nombre +
            `</h5>
      <p class="card-text"></p>
      <a href="#" class="btn btn-primary">Go somewhere</a>
    </div>
  </div>`;
  div.innerHTML = html;
    })
}



  function buscar() {
    let tarjetas = document.querySelector("#ConteinerCard");
    var data = document.querySelector("#nPokemon").data;
    var busqueda = document.querySelector("#nPokemon").value - 1;
    var url = data.results[busqueda].url;
  
    if (busqueda >= 0) {
      var objXMLHttpRequest = new XMLHttpRequest();
  
      objXMLHttpRequest.onreadystatechange = function () {
        if (objXMLHttpRequest.readyState === 4) {
          if (objXMLHttpRequest.status === 200) {
            let json = JSON.parse(objXMLHttpRequest.responseText);
            let nombre = json.name;
            let uriImg = json.sprites.other.home.front_default;
            let html =
              `<div class="card" style="width: 18rem;">
    <img src="` +
              uriImg +
              `" class="card-img-top" alt="...">
    <div class="card-body">
      <h5 class="card-title">` +
              nombre +
              `</h5>
      <p class="card-text"></p>
      <a href="#" class="btn btn-primary">Go somewhere</a>
    </div>
  </div>`;
            tarjetas.innerHTML = html;
          } else {
            alert("Error Code: " + objXMLHttpRequest.status);
            alert("Error Message: " + objXMLHttpRequest.statusText);
          }
        }
      };
      objXMLHttpRequest.open("GET", url);
      objXMLHttpRequest.send();
    } else {
      alert("Debe ingresar un numero de 1 a 20 para obtener un Pokemon valido");
    }
  }
