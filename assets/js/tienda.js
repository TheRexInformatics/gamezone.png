document.addEventListener('DOMContentLoaded', () => {
    const allGames = loadAllGames();
    const genres = getAllGenres(allGames);
    
    const container = document.getElementById('game-cards-container');
    const searchBar = document.getElementById('search-bar');
    const genreFilter = document.getElementById('genre-filter');
    const sortFilter = document.getElementById('sort-filter');
    
    let cart = JSON.parse(sessionStorage.getItem('cart')) || [];

    const cartModal = document.getElementById('cart-modal-overlay');
    const cartButton = document.getElementById('cart-button');
    const closeCartBtn = document.getElementById('close-cart-modal-btn');
    const cartItemsContainer = document.getElementById('cart-items-container');
    const cartTotalPrice = document.getElementById('cart-total-price');
    const cartBadge = document.getElementById('cart-badge');
    const emptyCartBtn = document.getElementById('empty-cart-btn');
    const checkoutBtn = document.getElementById('checkout-btn');

    genreFilter.innerHTML = '<option value="todos">Todos los Géneros</option>';
    genres.forEach(genre => {
        const option = document.createElement('option');
        option.value = genre;
        option.textContent = genre;
        genreFilter.appendChild(option);
    });

    function loadAllGames() {
        let games = JSON.parse(localStorage.getItem('games')) || [];
        
        if (games.length === 0) {
            games = [
                { id: '1', title: 'Five Nights at Freddy\'s 1', genre: 'Terror', price: 2400, image: 'assets/img/fnaf1.png', description: 'Juego de terror' },
                { id: '2', title: 'Five Nights at Freddy\'s 2', genre: 'Terror', price: 3800, image: 'assets/img/fnaf2.png', description: 'Juego de terror' },
                { id: '3', title: 'Five Nights at Freddy\'s 3', genre: 'Terror', price: 3800, image: 'assets/img/fnaf3.png', description: 'Juego de terror' },
                { id: '4', title: 'Five Nights at Freddy\'s 4', genre: 'Terror', price: 3800, image: 'assets/img/fnaf4.png', description: 'Juego de terror' },
                { id: '5', title: 'Five Nights at Freddy\'s: Sister Location', genre: 'Terror', price: 3800, image: 'assets/img/fnaf5.png', description: 'Juego de terror' },
                { id: '6', title: 'Five Nights at Freddy\'s: Pizzeria Simulator', genre: 'Terror', price: 0, image: 'assets/img/fnaf6.png', description: 'Juego de terror' },
                { id: '7', title: 'Bendy and the Ink Machine', genre: 'Terror', price: 10500, image: 'assets/img/bendy1.png', description: 'Juego de terror' },
                { id: '8', title: 'Bendy and the Dark Revival', genre: 'Terror', price: 16000, image: 'assets/img/bendy2.png', description: 'Juego de terror' },
                { id: '9', title: 'Dead By Daylight', genre: 'Terror', price: 11994, image: 'assets/img/dbd.png', description: 'Juego de terror' },
                { id: '10', title: 'Poppy Playtime', genre: 'Terror', price: 0, image: 'assets/img/pp.png', description: 'Juego de terror' },
                { id: '11', title: 'Outlast', genre: 'Terror', price: 8300, image: 'assets/img/outlast.png', description: 'Juego de terror' },
                { id: '12', title: 'Alien: Isolation', genre: 'Terror', price: 23000, image: 'assets/img/alien.png', description: 'Juego de terror' },
                { id: '13', title: 'Dead Space', genre: 'Terror', price: 46900, image: 'assets/img/deadspace.png', description: 'Juego de terror' },

                { id: '14', title: 'Hollow Knight', genre: 'Indies', price: 8300, image: 'assets/img/hollowknight.png', description: 'Juego indie' },
                { id: '15', title: 'Hollow Knight: Silksong', genre: 'Indies', price: 10500, image: 'assets/img/silksong.png', description: 'Juego indie' },
                { id: '16', title: 'Celeste', genre: 'Indies', price: 10500, image: 'assets/img/celeste.png', description: 'Juego indie' },
                { id: '17', title: 'Katana Zero', genre: 'Indies', price: 8300, image: 'assets/img/katana.png', description: 'Juego indie' },
                { id: '18', title: 'Nine Sols', genre: 'Indies', price: 15500, image: 'assets/img/ninesols.png', description: 'Juego indie' },
                { id: '19', title: 'Hotline Miami', genre: 'Indies', price: 5750, image: 'assets/img/hotline.png', description: 'Juego indie' },
                { id: '20', title: 'OneShot', genre: 'Indies', price: 5750, image: 'assets/img/oneshot.png', description: 'Juego indie' },
                { id: '21', title: 'Undertale', genre: 'Indies', price: 5500, image: 'assets/img/undertale.png', description: 'Juego indie' },
                { id: '22', title: 'Deltarune', genre: 'Indies', price: 13000, image: 'assets/img/deltarune.png', description: 'Juego indie' },
                { id: '23', title: 'ULTRAKILL', genre: 'Indies', price: 13000, image: 'assets/img/ultrakill.png', description: 'Juego indie' },
                { id: '24', title: 'Cuphead', genre: 'Indies', price: 9500, image: 'assets/img/cuphead.png', description: 'Juego indie' },
                { id: '25', title: 'Shovel Knight', genre: 'Indies', price: 14900, image: 'assets/img/shovel.png', description: 'Juego indie' },
                { id: '26', title: 'Dead Cells', genre: 'Indies', price: 12990, image: 'assets/img/deadcells.png', description: 'Juego indie' },
                { id: '27', title: 'Stray', genre: 'Indies', price: 9999, image: 'assets/img/stray.png', description: 'Juego indie' },
                { id: '28', title: 'Ori and the Blind Forest', genre: 'Indies', price: 13990, image: 'assets/img/ori.png', description: 'Juego indie' },

                { id: '29', title: 'Wuthering Waves', genre: 'Gacha', price: 0, image: 'assets/img/wuwa.png', description: 'Juego gacha' },
                { id: '30', title: 'Honkai: Star Rail', genre: 'Gacha', price: 0, image: 'assets/img/honkai.png', description: 'Juego gacha' },
                { id: '31', title: 'Genshin Impact', genre: 'Gacha', price: 0, image: 'assets/img/genshin.png', description: 'Juego gacha' },
                { id: '32', title: 'Zenless Zone Zero', genre: 'Gacha', price: 0, image: 'assets/img/zzz.png', description: 'Juego gacha' },

                { id: '33', title: 'Elden Ring', genre: 'Dark Souls', price: 45499, image: 'assets/img/elden.png', description: 'Juego soulslike' },
                { id: '34', title: 'Black Myth: Wukong', genre: 'Dark Souls', price: 39999, image: 'assets/img/wukong.png', description: 'Juego soulslike' },
                { id: '35', title: 'Ghost of Tsushima', genre: 'Dark Souls', price: 42000, image: 'assets/img/ghost.png', description: 'Juego soulslike' },
                { id: '36', title: 'Sekiro: Shadows Die Twice', genre: 'Dark Souls', price: 46650, image: 'assets/img/sekiro.png', description: 'Juego soulslike' },
                { id: '37', title: 'Dark Souls', genre: 'Dark Souls', price: 25499, image: 'assets/img/darksouls.png', description: 'Juego soulslike' },

                { id: '38', title: 'Subnautica', genre: 'Supervivencia y Exploración', price: 20300, image: 'assets/img/subnautica.png', description: 'Juego de supervivencia' },
                { id: '39', title: 'The Forest', genre: 'Supervivencia y Exploración', price: 7700, image: 'assets/img/forest.png', description: 'Juego de supervivencia' },
                { id: '40', title: 'Sons of the Forest', genre: 'Supervivencia y Exploración', price: 15500, image: 'assets/img/sons.png', description: 'Juego de supervivencia' },
                { id: '41', title: 'Far Cry Primal', genre: 'Supervivencia y Exploración', price: 26999, image: 'assets/img/primal.png', description: 'Juego de supervivencia' },
                { id: '42', title: 'Minecraft', genre: 'Supervivencia y Exploración', price: 34990, image: 'assets/img/minecraf.png', description: 'Juego de supervivencia' },
                { id: '43', title: 'Green Hell', genre: 'Supervivencia y Exploración', price: 10500, image: 'assets/img/greenhell.png', description: 'Juego de supervivencia' },

                { id: '44', title: 'Call of Duty 4: Modern Warfare', genre: 'Combate', price: 19000, image: 'assets/img/modernwarfareIV.png', description: 'Juego de combate' },
                { id: '45', title: 'Call of Duty: Modern Warfare 2', genre: 'Combate', price: 19000, image: 'assets/img/modernwarfareII.png', description: 'Juego de combate' },
                { id: '46', title: 'Call of Duty: Modern Warfare 3', genre: 'Combate', price: 38000, image: 'assets/img/modernwarfareIII.png', description: 'Juego de combate' },
                { id: '47', title: 'Call of Duty: Black Ops 2', genre: 'Combate', price: 57000, image: 'assets/img/blackopsII.png', description: 'Juego de combate' },
                { id: '48', title: 'Call of Duty: Black Ops 3', genre: 'Combate', price: 57000, image: 'assets/img/blackopsIII.png', description: 'Juego de combate' },
                { id: '49', title: 'Call of Duty: World at War', genre: 'Combate', price: 19000, image: 'assets/img/worldatwar.png', description: 'Juego de combate' },
                { id: '50', title: 'Battlefield 3', genre: 'Combate', price: 31900, image: 'assets/img/battlefield.png', description: 'Juego de combate' },
                { id: '51', title: 'Battlefield 4', genre: 'Combate', price: 31900, image: 'assets/img/battlefieldIV.png', description: 'Juego de combate' },
                { id: '52', title: 'Sniper Elite V2', genre: 'Combate', price: 18000, image: 'assets/img/sniper.png', description: 'Juego de combate' },
                { id: '53', title: 'Call of Duty Ghosts', genre: 'Combate', price: 57000, image: 'assets/img/ghosts.jpg', description: 'Juego de combate' },

                { id: '54', title: 'Street Fighter 6', genre: 'Peleas', price: 29990, image: 'assets/img/street.png', description: 'Juego de peleas' },
                { id: '55', title: 'Mortal Kombat 9', genre: 'Peleas', price: 32990, image: 'assets/img/mortal.png', description: 'Juego de peleas' },
                { id: '56', title: 'Super Smash Bros Ultimate', genre: 'Peleas', price: 69990, image: 'assets/img/smash.png', description: 'Juego de peleas' },
                { id: '57', title: 'Dragon Ball FighterZ', genre: 'Peleas', price: 42499, image: 'assets/img/dragonball.png', description: 'Juego de peleas' },
                { id: '58', title: 'Killer Instinct', genre: 'Peleas', price: 0, image: 'assets/img/killer.png', description: 'Juego de peleas' },

                { id: '59', title: 'Geometry Dash', genre: 'Música', price: 3990, image: 'assets/img/geometrydash.png', description: 'Juego de música' },
                { id: '60', title: 'Geometry Dash SubZero', genre: 'Música', price: 1990, image: 'assets/img/subzero.png', description: 'Juego de música' },
                { id: '61', title: 'Osu!', genre: 'Música', price: 0, image: 'assets/img/osu.png', description: 'Juego de música' },
                { id: '62', title: 'Beat Saber', genre: 'Música', price: 24990, image: 'assets/img/saber.png', description: 'Juego de música' },
                { id: '63', title: 'Guitar Hero', genre: 'Música', price: 29990, image: 'assets/img/guitarhero.png', description: 'Juego de música' }
            ];
            
            localStorage.setItem('games', JSON.stringify(games));
        }
        
        return games;
    }

    function getAllGenres(games) {
        const genres = [...new Set(games.map(game => game.genre))];
        return genres;
    }

    function updateCartBadge() {
        if (cart.length > 0) {
            cartBadge.textContent = cart.length;
            cartBadge.classList.remove('hidden');
        } else {
            cartBadge.classList.add('hidden');
        }
    }

    function renderCartItems() {
        cartItemsContainer.innerHTML = '';
        let total = 0;
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p>Tu carrito está vacío.</p>';
        } else {
            cart.forEach(item => {
                const cartItem = document.createElement('div');
                cartItem.className = 'cart-item';
                cartItem.innerHTML = `
                    <img src="${item.image}" alt="${item.title}">
                    <div class="cart-item-info">
                        <h4>${item.title}</h4>
                        <p>$${item.price.toLocaleString('es-CL')}</p>
                    </div>
                    <button class="remove-from-cart-btn" data-id="${item.id}"><i class="fas fa-times-circle"></i></button>
                `;
                cartItemsContainer.appendChild(cartItem);
                total += item.price;
            });
        }
        cartTotalPrice.textContent = `$${total.toLocaleString('es-CL')}`;
        updateCartBadge();
    }

    function saveCart() {
        sessionStorage.setItem('cart', JSON.stringify(cart));
        renderCartItems();
    }

    cartButton.addEventListener('click', () => cartModal.classList.remove('hidden'));
    closeCartBtn.addEventListener('click', () => cartModal.classList.add('hidden'));
    cartModal.addEventListener('click', (e) => {
        if (e.target === cartModal) cartModal.classList.add('hidden');
    });

    emptyCartBtn.addEventListener('click', () => {
        if (confirm('¿Estás seguro de que quieres vaciar el carrito?')) {
            cart = [];
            saveCart();
        }
    });

    cartItemsContainer.addEventListener('click', e => {
        if (e.target.closest('.remove-from-cart-btn')) {
            const gameId = e.target.closest('.remove-from-cart-btn').dataset.id;
            cart = cart.filter(item => item.id !== gameId);
            saveCart();
        }
    });

    function renderStore() {
        const searchTerm = searchBar.value.toLowerCase();
        const selectedGenre = genreFilter.value;
        const sortOrder = sortFilter.value;

        let filteredGames = allGames.filter(game => {
            const matchesSearch = game.title.toLowerCase().includes(searchTerm);
            const matchesGenre = (selectedGenre === 'todos') || (game.genre === selectedGenre);
            return matchesSearch && matchesGenre;
        });

        switch (sortOrder) {
            case 'price-asc':
                filteredGames.sort((a, b) => a.price - b.price);
                break;
            case 'price-desc':
                filteredGames.sort((a, b) => b.price - a.price);
                break;
            case 'alpha-asc':
                filteredGames.sort((a, b) => a.title.localeCompare(b.title));
                break;
            case 'alpha-desc':
                filteredGames.sort((a, b) => b.title.localeCompare(a.title));
                break;
        }

        container.innerHTML = '';
        if (filteredGames.length === 0) {
            container.innerHTML = '<p>No se encontraron juegos con estos criterios.</p>';
            return;
        }

        filteredGames.forEach(game => {
            const card = document.createElement('div');
            card.className = 'game-card';
            card.innerHTML = `
                <img src="${game.image}" alt="Portada de ${game.title}">
                <div class="game-card-content">
                    <h3>${game.title}</h3>
                    <p class="game-genre">${game.genre}</p>
                    <p class="game-price">$${game.price.toLocaleString('es-CL')}</p>
                    <button class="cta-button buy-btn" data-id="${game.id}">Añadir al Carrito</button>
                </div>
            `;
            container.appendChild(card);
        });
    }

    searchBar.addEventListener('input', renderStore);
    genreFilter.addEventListener('change', renderStore);
    sortFilter.addEventListener('change', renderStore);

    container.addEventListener('click', (e) => {
        if (e.target.classList.contains('buy-btn')) {
            const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
            if (!currentUser) {
                alert('Necesitas iniciar sesión para comprar un juego.');
                window.location.href = 'index.html#login';
                return;
            }
            const gameId = e.target.dataset.id;
            const gameToAdd = allGames.find(game => game.id === gameId);
            const isAlreadyInCart = cart.some(item => item.id === gameId);

            if (isAlreadyInCart) {
                alert('Este juego ya está en tu carrito.');
            } else {
                cart.push(gameToAdd);
                saveCart();
                alert(`"${gameToAdd.title}" fue añadido al carrito.`);
            }
        }
    });

    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            if (cart.length > 0) {
                window.location.href = 'checkout.html';
            } else {
                alert('Tu carrito está vacío.');
            }
        });
    }

    // Inicializar
    renderStore();
    renderCartItems();
});