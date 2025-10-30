class Pokedeck {


    static async reloadAllCard() {

    }



    static async addRandomCard() {
        await this.addCard();
    }

    // Añadir carta
    static async addCard(pokemonId = Utils.randomPokemonNumber()) {

        // Desactivar botón

        document.querySelector(".addcard").disabled = true;
        // document.querySelector(".addcard").innerHTML ="Loading...";

        let deck = document.querySelector(".deck");



        deck.innerHTML += ` 
               <!-- CARD  https://getbootstrap.com/docs/5.3/components/card/ -->
            <div data-pokenumber="" class=" m-2 card shadow d-inline-block " style="width: 18rem;">
                <img src="#" class="card-img-top" alt="...">
                <div class="card-body">
                    <h5 class="card-title">Card title</h5>
                    <p class="card-text">Some quick example text to build on the card title and make up the bulk of the
                        card's content.</p>
                </div>
                <ul class="list-group list-group-flush">
                    <li class="list-group-item">An item</li>
                    <li class="list-group-item">A second item</li>
                    <li class="list-group-item">A third item</li>
                </ul> 
                 <ul class="list-group list-group-flush">
                  <div id="pokemon-types" class="pokemon-types p-2"></div>
                 </ul>
                <div class="card-body">
                 <div class="evolution"></div>
                 <div class="varieties"></div>
                  <div class="forms"></div>
                    <a href="#" class=" btn btn-info card-link" onclick="Pokedeck.rellenaCarta(this.closest('.card'),Utils.randomPokemonNumber())">🔃</a>
                    <button class="btn btn-danger card-link" onclick="this.parentNode.parentNode.remove()">⏏</button>

                    <button class=" addCard btn btn-warning"
                        data-id="0"
                        data-name="pikachu"
                        data-img="pika.png"
                        onclick="PokeCart.addPokemon(this.dataset)">❤️</button>
                    
                </div>

            </div>
            <!-- END CARD -->
            `;

        // rellena carta 

        let cards = document.querySelectorAll('.card');
        await Pokedeck.rellenaCarta(cards[cards.length - 1], pokemonId);

        // Reactivar Botón
        document.querySelector(".addcard").disabled = false;
        // document.querySelector(".addcard").innerHTML ="Add Card";

    }


    // Update carta,rellenar la nueva

    static async rellenaCarta(card, pokemon) {

        let url = "https://pokeapi.co/api/v2/pokemon/" + pokemon;
        let pokemonData = await Utils.pokeAPI(url);

        console.log(pokemonData);

        card.dataset.pokenumber = pokemonData.id;
        // Añadir el evento PokeCart.addItem
        let buttonCart = card.querySelector('.addCard');
        buttonCart.dataset.id = pokemonData.id;
        buttonCart.dataset.name = pokemonData.name;
        buttonCart.dataset.img = pokemonData.sprites.front_default;


        // querySelector(selector CSS) --> devuelve la PRIMERA etiqueta que cumple con el selector

        // Imagen
        let img = card.querySelector('img');

        // Posibilidad shiny
        if (0.8 > Math.random()) {
            img.src = pokemonData.sprites.front_default;
        } else {
            img.src = pokemonData.sprites.front_shiny;
        }

        // Evoluciones shiny


        // Nombre
        card.querySelector('h5').innerHTML = pokemonData.name;

        // Descripción, accede a los textos en species y filtra por idioma
        let species = await Utils.pokeAPI(pokemonData.species.url); // nueva llamada a la API
        console.log(species);

        card.style.borderColor = species.color.name; 


        let texts = species.flavor_text_entries; 
        let filtrados = texts.filter((text) => text.language.name == 'es'); //Español


        if (filtrados.length > 0) {
            card.querySelector('.card-text').innerHTML = filtrados[0].flavor_text; 
        } else {
            // si no hay traducción en el idioma deseado mete el primero que haya
            card.querySelector('.card-text').innerHTML = texts[0].flavor_text;
        }

        // Lista UL de habilidades
        let abilitiesList = card.querySelector('.list-group');
        abilitiesList.innerHTML = '';


        for (let a of pokemonData.abilities) {
            // abilitiesList.innerHTML += '<li class="list-group-item">' + a.ability.name + '</li>'

            // OPCION 2:  Crear etiquetas desde Javascript
            let item = document.createElement('li'); 
            item.className = "list-group-item"; 
            item.innerHTML = a.ability.name; 

            abilitiesList.appendChild(item); // la mete dentro del padre (para que aparezca en el documento)
        }


        // Lista de estadísticas (stats)
        let statsList = card.querySelectorAll('.list-group')[1]; 
        statsList.innerHTML = ''; 

        pokemonData.stats.forEach(stat => {
            let statItem = document.createElement('li');
            statItem.classList.add('list-group-item');
            statItem.classList.add(stat.stat.name); 
            statItem.textContent = `${stat.stat.name}: ${stat.base_stat}`;
            statsList.appendChild(statItem);
        });




        // Evoluciones de los pokemons
        let evolution = card.querySelector(".evolution");
        let evolutionchain = await Utils.pokeAPI(species.evolution_chain.url);
        evolution.innerHTML = '';

        // Primera evolución (Pokémon base)
        let evpokemon = await Utils.pokeAPI("https://pokeapi.co/api/v2/pokemon/" + evolutionchain.chain.species.name);
        evolution.innerHTML += `<p>${evolutionchain.chain.species.name}</p>`;
        if (img.src == pokemonData.sprites.front_default) {
            evolution.innerHTML += `<img src="${evpokemon.sprites.front_default}">`; // Aquí está el cambio
        } else {
            evolution.innerHTML += `<img src="${evpokemon.sprites.front_shiny}">`; // Aquí está el cambio
        }


        // Segunda y tercera evolución
        for (let evol of evolutionchain.chain.evolves_to) {
            evpokemon = await Utils.pokeAPI("https://pokeapi.co/api/v2/pokemon/" + evol.species.name);
            evolution.innerHTML += `<p>${evol.species.name}</p>`;

            if (img.src == pokemonData.sprites.front_default) {
                evolution.innerHTML += `<img src="${evpokemon.sprites.front_default}">`; // Aquí está el cambio
            } else {
                evolution.innerHTML += `<img src="${evpokemon.sprites.front_shiny}">`; // Aquí está el cambio
            }


            for (let evo of evol.evolves_to) {
                evpokemon = await Utils.pokeAPI("https://pokeapi.co/api/v2/pokemon/" + evo.species.name);
                evolution.innerHTML += `<p>${evo.species.name}</p>`;

                if (img.src == pokemonData.sprites.front_default) {
                    evolution.innerHTML += `<img src="${evpokemon.sprites.front_default}">`; // Aquí está el cambio
                } else {
                    evolution.innerHTML += `<img src="${evpokemon.sprites.front_shiny}">`; // Aquí está el cambio
                }

            }
        }

        // variedades del Pokémon 
        let varietiesSection = card.querySelector(".varieties");
        varietiesSection.innerHTML = '';
        if (species.varieties && species.varieties.length > 1) {
            for (let variety of species.varieties) {
                if (!variety.is_default) {
                    let varietyData = await Utils.pokeAPI(variety.pokemon.url);
                    varietiesSection.innerHTML += `
                             <p>${varietyData.name}</p>
                             <img src="${varietyData.sprites.front_default}" alt="${varietyData.name}">
                     `;
                }
            }
        } else {

            varietiesSection.innerHTML = '';
        }

        // formas  Pokémon 
        let formsSection = card.querySelector(".forms");
        formsSection.innerHTML = '';

        if (pokemonData.forms && pokemonData.forms.length > 1) {
            for (let form of pokemonData.forms) {
                let formData = await Utils.pokeAPI(form.url);
                if (formData.name !== pokemonData.name) {
                    formsSection.innerHTML += `
                        <p>${formData.name}</p>
                        <img src="${formData.sprites.front_default || '#'}" alt="${formData.name}">
                `;
                }
            }

        } else {
            formsSection.innerHTML = '';
        }

    }

    // Comparar cartas

    static compareTeams() {
        let team1 = PokeCart.items.filter(item => item.team == 0);
        let team2 = PokeCart.items.filter(item => item.team == 1);

        if (team1.length == 0 || team2.length == 0) {
            alert("Both teams must have at least one card to compare.");
            return;
        }

        // Comparar las cartas una por una
        for (let i = 0; i < Math.min(team1.length, team2.length); i++) {
            let card1 = team1[i];
            let card2 = team2[i];

            if (card1.totalStats > card2.totalStats) {
                alert(`Team 1's ${card1.name} wins!`);
                this.removeCard(card2); // Eliminar la carta perdedora (Team 2)
            } else if (card2.totalStats > card1.totalStats) {
                alert(`Team 2's ${card2.name} wins!`);
                this.removeCard(card1); // Eliminar la carta perdedora (Team 1)
            } else {
                alert(`It's a tie between ${card1.name} and ${card2.name}!`);
            }
        }
    }

    static getPokemonStats(pokemonId) {
        let card = document.querySelector(`.card[data-pokenumber="${pokemonId}"]`);
        if (!card) return 0;

        let stats = card.querySelectorAll('.list-group-item');
        let totalStats = 0;

        stats.forEach(stat => {
            let parts = stat.textContent.split(':');
            if (parts.length > 1) {
                totalStats += parseInt(parts[1]) || 0; // Si no es un número, suma 0
            }
        });

        return totalStats;
    }

    static removeCard(card) {
        // Eliminar la carta del carrito
        PokeCart.removePokemon(card.id);

        // Eliminar la carta del DOM
        let cardElement = document.querySelector(`.card[data-pokenumber="${card.id}"]`);
        if (cardElement) {
            cardElement.remove();
        }    
        PokeCart.display();
    }

}
