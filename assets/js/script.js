document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('theme-toggle-floating');
    const body = document.body;
    if (themeToggle) {
        const toggleTheme = () => {
            body.classList.toggle('light-theme');
            if (body.classList.contains('light-theme')) {
                localStorage.setItem('theme', 'light');
                themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
            } else {
                localStorage.setItem('theme', 'dark');
                themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
            }
        };
        const currentTheme = localStorage.getItem('theme');
        if (currentTheme === 'light') {
            body.classList.add('light-theme');
            themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        }
        themeToggle.addEventListener('click', toggleTheme);
    }
    updateHeaderUI();
    fetch('modals.html')
        .then(response => response.text())
        .then(html => {
            document.body.insertAdjacentHTML('beforeend', html);
            initializeModalLogic();
        }).catch(err => console.error('Error al cargar modales.', err));
});

function initializeModalLogic() {
    const loginModal = document.getElementById('login-modal-overlay');
    const registerModal = document.getElementById('register-modal-overlay');
    const forgotModal = document.getElementById('forgot-password-modal-overlay');
    
    if (!loginModal || !registerModal || !forgotModal) return;

    const openLoginModal = () => { registerModal.classList.add('hidden'); forgotModal.classList.add('hidden'); loginModal.classList.remove('hidden'); };
    const closeLoginModal = () => loginModal.classList.add('hidden');
    const openRegisterModal = () => { loginModal.classList.add('hidden'); forgotModal.classList.add('hidden'); registerModal.classList.remove('hidden'); };
    const closeRegisterModal = () => registerModal.classList.add('hidden');
    const openForgotModal = () => { loginModal.classList.add('hidden'); registerModal.classList.add('hidden'); forgotModal.classList.remove('hidden'); };
    const closeForgotModal = () => forgotModal.classList.add('hidden');

    document.getElementById('login-button').addEventListener('click', (e) => { e.preventDefault(); openLoginModal(); });
    document.getElementById('close-login-modal-btn').addEventListener('click', closeLoginModal);
    document.getElementById('show-register-link').addEventListener('click', (e) => { e.preventDefault(); openRegisterModal(); });
    
    const registerNowBtn = document.getElementById('register-now-btn');
    if (registerNowBtn) registerNowBtn.addEventListener('click', openRegisterModal);
    
    document.getElementById('close-register-modal-btn').addEventListener('click', closeRegisterModal);
    document.getElementById('show-login-link').addEventListener('click', (e) => { e.preventDefault(); openLoginModal(); });

    document.getElementById('forgot-password-link').addEventListener('click', (e) => { e.preventDefault(); openForgotModal(); });
    document.getElementById('close-forgot-modal-btn').addEventListener('click', closeForgotModal);
    document.getElementById('back-to-login-link').addEventListener('click', (e) => { e.preventDefault(); openLoginModal(); });

    document.getElementById('login-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const validUser = users.find(user => user.email === email && user.password === password);
        if (validUser) {
            sessionStorage.setItem('currentUser', JSON.stringify(validUser));
            closeLoginModal();
            updateHeaderUI();
        } else {
            alert('Email o contraseña incorrectos.');
        }
    });

    document.getElementById('register-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const email = document.getElementById('register-email').value;
        if (users.find(user => user.email === email)) {
            return alert('Este correo electrónico ya está registrado.');
        }
        const newUser = {
            username: document.getElementById('register-username').value,
            email: email,
            password: document.getElementById('register-password').value,
            profilePic: 'https://via.placeholder.com/150/ff4500/FFFFFF?text=USER',
            role: 'user'
        };
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        alert('¡Registro exitoso! Ahora puedes iniciar sesión.');
        openLoginModal();
    });

    document.getElementById('forgot-password-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('forgot-email').value;
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const userFound = users.find(user => user.email === email);
        if (userFound) {
            alert(`Recuperación de contraseña (solo para desarrollo):\nTu contraseña es: ${userFound.password}`);
            openLoginModal();
        } else {
            alert('No se encontró ninguna cuenta con ese correo electrónico.');
        }
    });
}

function updateHeaderUI() {
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    const loginBtn = document.getElementById('login-button');
    const profileMenu = document.getElementById('profile-menu');
    const cartButton = document.getElementById('cart-button');
    const adminPanelLink = document.getElementById('admin-panel-link');
    if (loginBtn && profileMenu && cartButton && adminPanelLink) {
        if (currentUser) {
            loginBtn.classList.add('hidden');
            profileMenu.classList.remove('hidden');
            cartButton.classList.remove('hidden');
            if (currentUser.email === 'admin@gamezone.local') {
                adminPanelLink.classList.remove('hidden');
            } else {
                adminPanelLink.classList.add('hidden');
            }
            const profilePicHeader = document.getElementById('profile-pic-header');
            if (profilePicHeader) {
                profilePicHeader.src = currentUser.profilePic || 'https://via.placeholder.com/150/ff4500/FFFFFF?text=USER';
            }
            const logoutBtn = document.getElementById('logout-btn');
            if (logoutBtn) {
                logoutBtn.addEventListener('click', (event) => {
                    event.preventDefault();
                    sessionStorage.removeItem('currentUser');
                    window.location.href = 'index.html';
                });
            }
        } else {
            loginBtn.classList.remove('hidden');
            profileMenu.classList.add('hidden');
            cartButton.classList.add('hidden');
            adminPanelLink.classList.add('hidden');
        }
    }
}