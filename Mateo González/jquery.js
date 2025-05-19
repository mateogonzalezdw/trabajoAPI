
var div2 = document.querySelector(".container");
div2.addEventListener("click",ajaxSinJQuery)
console.dir(div2);

var divj = $(".container");
divj.on("mouseover",ajaxConJQuery)
console.log(divj);

function ajaxSinJQuery() {
    var url = "https://pokeapi.co/api/v2/pokemon/";
    let tarjetas = document.querySelector("#nPokemon");
    var objXMLHttpRequest = new XMLHttpRequest();
  
    objXMLHttpRequest.onreadystatechange = function () {
      if (objXMLHttpRequest.readyState === 4) {
        if (objXMLHttpRequest.status === 200) {
          let json = JSON.parse(objXMLHttpRequest.responseText);
          tarjetas.data = json;
          console.log(json);
        } else {
          alert("Error Code: " + objXMLHttpRequest.status);
          alert("Error Message: " + objXMLHttpRequest.statusText);
        }
      }
    };
    objXMLHttpRequest.open("GET", url);
    objXMLHttpRequest.send();
}

function ajaxConJQuery() {
    var url = "https://pokeapi.co/api/v2/pokemon/";
    let tarjetas = $("#nPokemon");
    $.ajax({
        url: url,
        success: function( result ) {
          console.log(result);
        }
      });
}