class PokeCart {
    constructor() {
        this.item = [];
    }


    static loadStorage() {
        // Carga el carrito del localstorage
        this.items = JSON.parse(localStorage.getItem("pokecart")) || [];
        this.display();
    }

    static saveStorage() {
        // Lo guarda en el localStorage
        localStorage.setItem("pokecart", JSON.stringify(this.items));
    }

    static async calculateTotalStats(pokemonId) {
        let url = "https://pokeapi.co/api/v2/pokemon/" + pokemonId;
        let pokemonData = await Utils.pokeAPI(url);

        if (!pokemonData) return 0;

        // Sumar todas las estadísticas base del Pokémon
        return pokemonData.stats.reduce((sum, stat) => sum + stat.base_stat, 0);
    }

    static async addPokemon(data) {
        console.log("Has metido a " + data.name);
        if (!this.items) {
            this.items = [];
        }

        let totalStats = await PokeCart.calculateTotalStats(data.id);
        
        // Si existe en el carrito aumentamos en 1 su cantidad
        // Si no existe lo añade
        let index = this.items.findIndex((item) => item.id == data.id);
        if (index == -1) {
            this.items.push(
                {
                    id: data.id,
                    name: data.name,
                    img: data.img,
                    quantity: 1,
                    team: Math.floor(Math.random() * 2) ,// 1 o 2
                    totalStats: totalStats

                }


            );
        } else {
            // this.items[index].quantity ++; Que sume uno a la cifra del pokemon
            this.removePokemon(data.id);
        }



        this.saveStorage();
        this.display();
        console.log(this.items);


    }

    static getQuantity(id) {

    }

    static setQuantity(id, newQuantity) {
        // Busca el elemento con el ID y le asigna la nueva cantidad

    }

    static removePokemon(id) {
        // Borra el pokemon del carrito
        console.log("Borrando " + id)
        // Localizar la posición del elemento
        let index = this.items.findIndex((item) => item.id == id);
        // Borrar esa posición
        this.items.splice(index, 1);
        this.display();
        this.saveStorage();
    }

    static removeAll() {
        // Borra todo
        localStorage.clear();
        this.items = [];
        this.display();
    }

    static display() {
        let carrito = document.querySelector('#pokeCart');
        let carrito2 = document.querySelector('#pokeCart2');
        carrito.innerHTML = "";
        carrito2.innerHTML = "";

        for (let item of this.items) {
            if (item.team == 0) {
                carrito.innerHTML += `<img src="${item.img}" onclick="Pokedeck.addCard(${item.id})"> 
            <span>${item.quantity}</span>
            <button class="btn btn-danger" onclick="PokeCart.removePokemon(${item.id})" >X</button>`
            }else{
                carrito2.innerHTML += `<img src="${item.img}" onclick="Pokedeck.addCard(${item.id})"> 
                <span>${item.quantity}</span>
                <button class="btn btn-danger" onclick="PokeCart.removePokemon(${item.id})" >X</button>`
            }
        }
    }
}