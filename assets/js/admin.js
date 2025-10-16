document.addEventListener('DOMContentLoaded', () => {
    
    const sidebarLinks = document.querySelectorAll('.sidebar-link');
    const contentSections = document.querySelectorAll('.content-section');
    sidebarLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            sidebarLinks.forEach(l => l.classList.remove('active'));
            contentSections.forEach(s => s.classList.remove('active'));
            link.classList.add('active');
            document.getElementById(link.dataset.target).classList.add('active');
        });
    });

    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    const adminPicSidebar = document.getElementById('admin-pic-sidebar');
    if (currentUser && adminPicSidebar) {
        const defaultPicURL = 'https://via.placeholder.com/150/ff4500/FFFFFF?text=ADMIN';
        adminPicSidebar.src = currentUser.profilePic || defaultPicURL;
    }

    const usersTableBody = document.querySelector('#users-table tbody');
    const editUserModal = document.getElementById('edit-user-modal-overlay');
    const closeEditUserModalBtn = document.getElementById('close-edit-user-modal-btn');
    const editUserForm = document.getElementById('edit-user-form');
    let users = JSON.parse(localStorage.getItem('users')) || [];
    let userToEditEmail = null;

    function renderUsersTable() {
        usersTableBody.innerHTML = '';
        users.forEach(user => {
            const row = document.createElement('tr');
            row.innerHTML = `<td>${user.username}</td><td>${user.email}</td><td>${user.role}</td><td><button class="action-btn edit-btn" data-email="${user.email}"><i class="fas fa-edit"></i></button><button class="action-btn delete-btn" data-email="${user.email}"><i class="fas fa-trash"></i></button></td>`;
            usersTableBody.appendChild(row);
        });
        attachUserActionListeners();
    }

    function attachUserActionListeners() {
        document.querySelectorAll('#users-table .delete-btn').forEach(button => button.addEventListener('click', e => {
            const email = e.currentTarget.dataset.email;
            if (email === 'admin@gamezone.local') { return alert('No puedes eliminar al administrador principal.'); }
            if (confirm(`¿Seguro que quieres eliminar al usuario ${email}?`)) {
                users = users.filter(user => user.email !== email);
                localStorage.setItem('users', JSON.stringify(users));
                renderUsersTable();
                document.dispatchEvent(new Event('dataChanged'));
            }
        }));
        document.querySelectorAll('#users-table .edit-btn').forEach(button => button.addEventListener('click', e => {
            const email = e.currentTarget.dataset.email;
            const user = users.find(u => u.email === email);
            if (user) {
                userToEditEmail = email;
                document.getElementById('edit-email').value = user.email;
                document.getElementById('edit-username').value = user.username;
                document.getElementById('edit-role').value = user.role;
                editUserModal.classList.remove('hidden');
            }
        }));
    }
    
    closeEditUserModalBtn.addEventListener('click', () => editUserModal.classList.add('hidden'));
    
    editUserForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const userIndex = users.findIndex(u => u.email === userToEditEmail);
        if (userIndex !== -1) {
            users[userIndex].username = document.getElementById('edit-username').value;
            users[userIndex].role = document.getElementById('edit-role').value;
            localStorage.setItem('users', JSON.stringify(users));
            editUserModal.classList.add('hidden');
            renderUsersTable();
            document.dispatchEvent(new Event('dataChanged'));
        }
    });

    let games = JSON.parse(localStorage.getItem('games')) || [];
    let gameToEditId = null;

    const gamesTableBody = document.querySelector('#games-table tbody');
    const gameModal = document.getElementById('game-modal-overlay');
    const closeGameModalBtn = document.getElementById('close-game-modal-btn');
    const addGameBtn = document.getElementById('add-game-btn');
    const gameForm = document.getElementById('game-form');
    const genreSelect = document.getElementById('game-genre');
    const addGenreBtn = document.getElementById('add-genre-btn');
    const gameModalTitle = document.getElementById('game-modal-title');

    function populateGenreDropdown() {
        genreSelect.innerHTML = '';
        const allGames = JSON.parse(localStorage.getItem('games')) || [];
        const genres = [...new Set(allGames.map(game => game.genre))];
        
        genres.forEach(genre => { 
            const option = document.createElement('option'); 
            option.value = genre; 
            option.textContent = genre; 
            genreSelect.appendChild(option); 
        });
    }

    function renderGamesTable() {
        gamesTableBody.innerHTML = '';
        games.forEach(game => {
            const row = document.createElement('tr');
            row.innerHTML = `<td><img src="${game.image}" alt="${game.title}"></td><td>${game.title}</td><td>${game.genre}</td><td>$${game.price.toLocaleString('es-CL')}</td><td><button class="action-btn edit-btn" data-id="${game.id}"><i class="fas fa-edit"></i></button><button class="action-btn delete-btn" data-id="${game.id}"><i class="fas fa-trash"></i></button></td>`;
            gamesTableBody.appendChild(row);
        });
        attachGameActionListeners();
    }

    function attachGameActionListeners() {
        document.querySelectorAll('#games-table .delete-btn').forEach(button => button.addEventListener('click', e => {
            const gameId = e.currentTarget.dataset.id;
            if (confirm('¿Seguro que quieres eliminar este juego?')) {
                games = games.filter(game => game.id !== gameId);
                localStorage.setItem('games', JSON.stringify(games));
                renderGamesTable();
                document.dispatchEvent(new Event('dataChanged'));
            }
        }));
        document.querySelectorAll('#games-table .edit-btn').forEach(button => button.addEventListener('click', e => {
            const gameId = e.currentTarget.dataset.id;
            const game = games.find(g => g.id === gameId);
            if (game) {
                gameToEditId = gameId;
                gameModalTitle.textContent = 'Editar Juego';
                gameForm.reset();
                document.getElementById('game-title').value = game.title;
                document.getElementById('game-description').value = game.description;
                document.getElementById('game-price').value = game.price;
                document.getElementById('game-image').value = game.image;
                populateGenreDropdown();
                genreSelect.value = game.genre;
                gameModal.classList.remove('hidden');
            }
        }));
    }

    addGameBtn.addEventListener('click', () => {
        gameToEditId = null;
        gameModalTitle.textContent = 'Agregar Nuevo Juego';
        gameForm.reset();
        populateGenreDropdown();
        gameModal.classList.remove('hidden');
    });

    closeGameModalBtn.addEventListener('click', () => gameModal.classList.add('hidden'));

    addGenreBtn.addEventListener('click', () => {
        const newGenre = prompt('Ingresa el nombre del nuevo género:');
        if (newGenre) {
            const allGames = JSON.parse(localStorage.getItem('games')) || [];
            const genres = [...new Set(allGames.map(game => game.genre))];
            
            if (!genres.some(g => g.toLowerCase() === newGenre.toLowerCase())) {
                // Actualizar la lista de géneros en todos los juegos no es necesario aquí
                // ya que los géneros se obtienen dinámicamente de los juegos
                populateGenreDropdown();
                genreSelect.value = newGenre;
            } else { 
                alert('Ese género ya existe.'); 
            }
        }
    });

    gameForm.addEventListener('submit', e => {
        e.preventDefault();
        const gameData = { title: document.getElementById('game-title').value, description: document.getElementById('game-description').value, price: parseInt(document.getElementById('game-price').value), image: document.getElementById('game-image').value, genre: genreSelect.value };
        if (gameToEditId) {
            const gameIndex = games.findIndex(g => g.id === gameToEditId);
            games[gameIndex] = { ...games[gameIndex], ...gameData };
        } else {
            games.push({ ...gameData, id: Date.now().toString() });
        }
        localStorage.setItem('games', JSON.stringify(games));
        gameModal.classList.add('hidden');
        renderGamesTable();
        document.dispatchEvent(new Event('dataChanged'));
    });

    function updateDashboard() {
        const allUsers = JSON.parse(localStorage.getItem('users')) || [];
        const allGames = JSON.parse(localStorage.getItem('games')) || [];
        const genres = [...new Set(allGames.map(game => game.genre))];

        document.getElementById('total-users').textContent = allUsers.length;
        document.getElementById('total-games').textContent = allGames.length;
        
        const genreStatsList = document.getElementById('genre-stats');
        genreStatsList.innerHTML = '';

        genres.forEach(genre => {
            const count = allGames.filter(game => game.genre === genre).length;
            const li = document.createElement('li');
            li.innerHTML = `<span class="genre-name">${genre}:</span> <span>${count} juegos</span>`;
            genreStatsList.appendChild(li);
        });
    }

    renderUsersTable();
    renderGamesTable();
    updateDashboard();

    document.addEventListener('dataChanged', updateDashboard);
});