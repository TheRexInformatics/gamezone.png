document.addEventListener('DOMContentLoaded', () => {
    const games = JSON.parse(localStorage.getItem('games')) || [];
    const genres = JSON.parse(localStorage.getItem('genres')) || [];
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

    genres.forEach(genre => {
        const option = document.createElement('option');
        option.value = genre;
        option.textContent = genre;
        genreFilter.appendChild(option);
    });

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

        let filteredGames = games.filter(game => {
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
            const gameToAdd = games.find(game => game.id === gameId);
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

    renderStore();
    renderCartItems();
});

const checkoutBtn = document.getElementById('checkout-btn');
    checkoutBtn.addEventListener('click', () => {
        if (cart.length > 0) {
            window.location.href = 'checkout.html';
        } else {
            alert('Tu carrito está vacío.');
        }
    });