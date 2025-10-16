document.addEventListener('DOMContentLoaded', () => {
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    if (!currentUser) {
        window.location.href = 'index.html';
        return; 
    }

    let users = JSON.parse(localStorage.getItem('users')) || [];

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

    const infoForm = document.getElementById('info-form');
    const emailInput = document.getElementById('account-email');
    const usernameInput = document.getElementById('account-username');
    const bioInput = document.getElementById('account-bio');
    const picPreview = document.getElementById('profile-pic-preview');
    const picUpload = document.getElementById('profile-pic-upload');
    const removePicBtn = document.getElementById('remove-pic-btn');

    const defaultPicURL = 'assets/img/new-user.png';
    function updateRemoveButtonVisibility() {
        if (picPreview.src === defaultPicURL) {
            removePicBtn.classList.add('hidden');
        } else {
            removePicBtn.classList.remove('hidden');
        }
    }

    emailInput.value = currentUser.email;
    usernameInput.value = currentUser.username;
    bioInput.value = currentUser.bio || '';
    picPreview.src = currentUser.profilePic || defaultPicURL;

    updateRemoveButtonVisibility();

    picUpload.addEventListener('change', () => {
        const file = picUpload.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                picPreview.src = e.target.result;
                updateRemoveButtonVisibility();
            };
            reader.readAsDataURL(file);
        }
    });

    removePicBtn.addEventListener('click', (e) => {
        e.preventDefault();
        picPreview.src = defaultPicURL;
        updateRemoveButtonVisibility();
    });

    infoForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const userIndex = users.findIndex(user => user.email === currentUser.email);
        if (userIndex === -1) return alert('Error: no se encontró al usuario.');

        users[userIndex].username = usernameInput.value;
        users[userIndex].bio = bioInput.value;
        users[userIndex].profilePic = picPreview.src;

        localStorage.setItem('users', JSON.stringify(users));
        sessionStorage.setItem('currentUser', JSON.stringify(users[userIndex]));

        alert('Información actualizada correctamente.');
        window.location.reload();
    });

    const passwordForm = document.getElementById('password-form');
    passwordForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const currentPassword = document.getElementById('current-password').value;
        const newPassword = document.getElementById('new-password').value;
        const confirmPassword = document.getElementById('confirm-password').value;
        
        if (currentPassword !== currentUser.password) {
            return alert('La contraseña actual es incorrecta.');
        }
        if (newPassword !== confirmPassword) {
            return alert('Las nuevas contraseñas no coinciden.');
        }

        const userIndex = users.findIndex(user => user.email === currentUser.email);
        users[userIndex].password = newPassword;
        localStorage.setItem('users', JSON.stringify(users));
        sessionStorage.setItem('currentUser', JSON.stringify(users[userIndex]));

        alert('Contraseña actualizada correctamente.');
        passwordForm.reset();
    });

    const deleteBtn = document.getElementById('delete-account-btn');
    deleteBtn.addEventListener('click', () => {
        const isConfirmed = confirm('¿Estás seguro de que quieres eliminar tu cuenta? Esta acción es irreversible.');

        if (isConfirmed) {
            const updatedUsers = users.filter(user => user.email !== currentUser.email);
            
            localStorage.setItem('users', JSON.stringify(updatedUsers));
            sessionStorage.removeItem('currentUser');
            
            alert('Cuenta eliminada.');
            window.location.href = 'index.html';
        }
    });
});