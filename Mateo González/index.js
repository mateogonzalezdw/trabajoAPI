async function buscarPorNombre() {
  const nombre = document.getElementById("nombreP").value.toLowerCase();
  const container = document.getElementById("conteiner");
  container.innerHTML = "";

  try {
    // Fetch datos principales del Pokémon
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${nombre}`);
    if (!res.ok) throw new Error("Pokémon no encontrado");
    const data = await res.json();

    // Fetch cadena de evolución
    const resSpecie = await fetch(data.species.url);
    const specieData = await resSpecie.json();

    const resEvo = await fetch(specieData.evolution_chain.url);
    const evoData = await resEvo.json();

   // Crear tarjeta principal
const card = document.createElement("div");
card.className = "card";

// Imagen Pokémon
const imagen = document.createElement("img");
imagen.src = data.sprites.front_default;
imagen.alt = data.name;
imagen.className = "pokemon-img";

// Contenedor info
const info = document.createElement("div");
info.className = "card-info";

// Nombre con link
const nombreLink = document.createElement("a");
nombreLink.href = `https://www.pokemon.com/es/pokedex/${data.name}`;
nombreLink.target = "_blank";
nombreLink.className = "pokemon-name";
nombreLink.textContent = data.name.toUpperCase();

const stats = document.createElement("ul");
stats.className = "stats";
data.stats.forEach(stat => {
  const li = document.createElement("li");
  // Capitalizar el nombre del stat para que quede más prolijo
  const statName = stat.stat.name.charAt(0).toUpperCase() + stat.stat.name.slice(1);
  li.textContent = `${statName}: ${stat.base_stat}`;
  stats.appendChild(li);
});


// Agregar nombre y stats a info
info.appendChild(nombreLink);
info.appendChild(stats);

// Agregar imagen e info a card
card.appendChild(imagen);
card.appendChild(info);



    // ---- Evoluciones ----

    // Función para recorrer la cadena de evoluciones
    function obtenerEvoluciones(chain) {
      const evoluciones = [];
      let current = chain;

      do {
        evoluciones.push(current.species.name);
        current = current.evolves_to[0];
      } while (current && current.hasOwnProperty('evolves_to'));

      return evoluciones;
    }

    const evoluciones = obtenerEvoluciones(evoData.chain);

    // Contenedor evoluciones
    const evolContainer = document.createElement("div");
evolContainer.className = "evolutions";


    const evoTitle = document.createElement("h3");
    evoTitle.textContent = "Evoluciones";
    evoTitle.className = "evo-title";

    evolContainer.appendChild(evoTitle);

    // Mostrar cada evolución con imagen y nombre
    for (const evoName of evoluciones) {
      const evoCard = document.createElement("div");
      evoCard.className = "evo-card";

      // Obtener info del Pokémon evolutivo para la imagen
      try {
        const evoRes = await fetch(`https://pokeapi.co/api/v2/pokemon/${evoName}`);
        if (!evoRes.ok) throw new Error("No se pudo cargar evolución");
        const evoData = await evoRes.json();

        const evoImg = document.createElement("img");
        evoImg.src = evoData.sprites.front_default;
        evoImg.alt = evoName;
        evoImg.className = "evo-img";

        const evoNombre = document.createElement("p");
        evoNombre.textContent = evoName.toUpperCase();
        evoNombre.className = "evo-name";

        evoCard.appendChild(evoImg);
        evoCard.appendChild(evoNombre);
        evolContainer.appendChild(evoCard);
      } catch {
        // Si falla la carga de alguna imagen, solo muestra el nombre
        const evoNombre = document.createElement("p");
        evoNombre.textContent = evoName.toUpperCase();
        evoNombre.className = "evo-name";
        evolContainer.appendChild(evoNombre);
      }
    }
// Agregar card al contenedor
container.appendChild(card);
    container.appendChild(evolContainer);


  } catch (error) {
    container.innerHTML = `<p class="error">${error.message}</p>`;
  }
}
document.getElementById('masterball').addEventListener('click', buscarPorNombre);

async function cargarTodosLosPokemones(limit = 1024) {
  const contenedor = document.getElementById('todos-lista');
  contenedor.innerHTML = '';
  
  for (let i = 1; i <= limit; i++) {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${i}`);
    const data = await res.json();

    const card = document.createElement('div');
    card.classList.add('poke-preview');
    card.innerHTML = `
      <img src="${data.sprites.front_default}" alt="${data.name}">
      <div class="poke-name">${data.name}</div>
    `;

    card.addEventListener('click', () => {
      document.getElementById('nombreP').value = data.name;
      document.getElementById('masterball').click();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    contenedor.appendChild(card);
  }
}

window.addEventListener('DOMContentLoaded', () => {
  cargarTodosLosPokemones();
});
