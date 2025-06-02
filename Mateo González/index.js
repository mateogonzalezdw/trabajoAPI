async function buscarPorNombre() {
  const nombre = document.getElementById("nombreP").value.toLowerCase();
  const container = document.getElementById("conteiner");
  container.innerHTML = "";

  try {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${nombre}`);
    if (!res.ok) throw new Error("Pokémon no encontrado");

    const data = await res.json();

    const card = document.createElement("div");
    card.className = "card";

    const imagen = document.createElement("img");
    imagen.src = data.sprites.front_default;
    imagen.alt = data.name;
    imagen.className = "pokemon-img";

    const nombreLink = document.createElement("a");
    nombreLink.href = `https://www.pokemon.com/es/pokedex/${data.name}`;
    nombreLink.target = "_blank";
    nombreLink.className = "pokemon-name";
    nombreLink.textContent = data.name.toUpperCase();

    const stats = document.createElement("ul");
    stats.className = "stats";
    data.stats.forEach(stat => {
      const li = document.createElement("li");
      li.textContent = `${stat.stat.name}: ${stat.base_stat}`;
      stats.appendChild(li);
    });

    card.appendChild(imagen);
    card.appendChild(nombreLink);
    card.appendChild(stats);
    container.appendChild(card);

  } catch (error) {
    container.innerHTML = `<p class="error">${error.message}</p>`;
  }
}
