document.addEventListener('DOMContentLoaded', () => {
    const categoryCards = document.querySelectorAll('.category-card');
    
    categoryCards.forEach(card => {
        card.addEventListener('click', () => {
            const categoryName = card.querySelector('h3').textContent.toLowerCase();
            
            const categoryFiles = {
                'terror': 'terror.html',
                'indies': 'indies.html',
                'gacha': 'gacha.html',
                'dark souls': 'darksouls.html',
                'supervivencia y exploración': 'supervivencia.html',
                'combate': 'combate.html',
                'peleas': 'peleas.html',
                'música': 'musica.html'
            };
            
            const file = categoryFiles[categoryName];
            if (file) {
                window.location.href = file;
            } else {
                alert('Página de categoría no encontrada');
            }
        });
    });
});