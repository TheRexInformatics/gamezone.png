document.addEventListener('DOMContentLoaded', () => {
    const cart = JSON.parse(sessionStorage.getItem('cart')) || [];
    const summaryContainer = document.getElementById('summary-items-container');
    const summaryTotalPrice = document.getElementById('summary-total-price');
    const paymentForm = document.getElementById('payment-form');

    let total = 0;
    summaryContainer.innerHTML = '';

    cart.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'summary-item';
        itemDiv.innerHTML = `
            <img src="${item.image}" alt="${item.title}">
            <span>${item.title}</span>
            <span>$${item.price.toLocaleString('es-CL')}</span>
        `;
        summaryContainer.appendChild(itemDiv);
        total += item.price;
    });

    summaryTotalPrice.textContent = `$${total.toLocaleString('es-CL')}`;

    paymentForm.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('¡Gracias por tu compra! Tu pedido ha sido procesado exitosamente.');
        sessionStorage.removeItem('cart');
        window.location.href = 'index.html';
    });
});