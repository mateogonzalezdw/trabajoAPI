async function buscarPorNombre() {
  const nombre = document.getElementById("nombreP").value.trim().toLowerCase();
  const container = document.getElementById("conteiner");
  container.innerHTML = '<div class="loader">Cargando...</div>';
 
  try {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${nombre}`);
    if (!res.ok) throw new Error("Pokémon no encontrado");
    const data = await res.json();

    const resSpecie = await fetch(data.species.url);
    const specieData = await resSpecie.json();

    const resEvo = await fetch(specieData.evolution_chain.url);
    const evoData = await resEvo.json();

    const card = document.createElement("div");
    card.className = "card fade-in";

    const imagen = document.createElement("img");
    imagen.src = data.sprites.front_default;
    imagen.alt = data.name;
    imagen.className = "pokemon-img";

    const info = document.createElement("div");
    info.className = "card-info";

    const nombreLink = document.createElement("a");
    nombreLink.href = `https://www.pokemon.com/es/pokedex/${data.name}`;
    nombreLink.target = "_blank";
    nombreLink.className = "pokemon-name";
    nombreLink.textContent = data.name.toUpperCase();

    const stats = document.createElement("ul");
    stats.className = "stats";
    data.stats.forEach(stat => {
      const li = document.createElement("li");
      const statName = stat.stat.name.charAt(0).toUpperCase() + stat.stat.name.slice(1);
      li.textContent = `${statName}: ${stat.base_stat}`;
      stats.appendChild(li);
    });

    const detallesExtra = document.createElement("ul");
    detallesExtra.classList.add("stats");

    const tipos = data.types.map(t => t.type.name).join(", ");
    const habilidades = data.abilities.map(a => a.ability.name).join(", ");

    const datosAdicionales = [
      ["Tipo", tipos],
      ["Altura", `${data.height / 10} m`],
      ["Peso", `${data.weight / 10} kg`],
      ["Habilidades", habilidades],
      ["Experiencia Base", data.base_experience],
      ["Orden", data.order]
    ];

    datosAdicionales.forEach(([clave, valor]) => {
      const li = document.createElement("li");
      li.textContent = `${clave}: ${valor}`;
      detallesExtra.appendChild(li);
    });

    info.appendChild(nombreLink);
    info.appendChild(stats);
    info.appendChild(detallesExtra);

    card.appendChild(imagen);
    card.appendChild(info);

    function obtenerEvoluciones(chain) {
      const evoluciones = [];
      function recorrer(cadena) {
        evoluciones.push(cadena.species.name);
        cadena.evolves_to.forEach(evo => recorrer(evo));
      }
      recorrer(chain);
      return evoluciones;
    }

    const evoluciones = obtenerEvoluciones(evoData.chain);

    const evolContainer = document.createElement("div");
    evolContainer.className = "evolutions";

    const evoTitle = document.createElement("h3");
    evoTitle.textContent = "Evoluciones";
    evoTitle.className = "evo-title";
    evolContainer.appendChild(evoTitle);

    const evoCards = await Promise.all(evoluciones.map(async (evoName) => {
  try {
    const evoRes = await fetch(`https://pokeapi.co/api/v2/pokemon/${evoName}`);
    const evoData = await evoRes.json();

    const evoCard = document.createElement("div");
    evoCard.className = "evo-card";
    evoCard.innerHTML = `
      <img src="${evoData.sprites.front_default}" alt="${evoName}" class="evo-img">
      <p class="evo-name">${evoName.toUpperCase()}</p>
    `;

    evoCard.addEventListener('click', () => {
      document.getElementById("nombreP").value = evoName;
      buscarPorNombre();
    });

    return evoCard;
  } catch {
    const evoFallback = document.createElement("p");
    evoFallback.textContent = evoName.toUpperCase();
    evoFallback.className = "evo-name";
    return evoFallback;
  }
}));


    evoCards.forEach(card => evolContainer.appendChild(card));

    container.innerHTML = "";
    container.appendChild(card);
    container.appendChild(evolContainer);

    const masterball = document.getElementById('masterball');
    masterball.src = 'img/masterballA.png';
    masterball.classList.add('active');

    setTimeout(() => {
      masterball.src = 'img/masterball.png';
      masterball.classList.remove('active');
    }, 800);

  } catch (error) {
    container.innerHTML = `<p class="error">${error.message}</p>`;
  }
}

document.getElementById('masterball').addEventListener('click', buscarPorNombre);

async function cargarTodosLosPokemones(limit = 1025) {
  const contenedor = document.getElementById('todos-lista');
  contenedor.innerHTML = '';

  for (let i = 1; i <= limit; i++) {
    try {
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${i}`);
      if (!res.ok) throw new Error();
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
    } catch {
      console.warn(`Error al cargar Pokémon con ID ${i}`);
    }
  }
}

window.addEventListener('DOMContentLoaded', () => {
  cargarTodosLosPokemones();
});
