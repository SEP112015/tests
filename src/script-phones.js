let carrito = [];
let contador = 0;

document.querySelectorAll('.btn-agregar-telefono').forEach((boton, index) => {
    boton.addEventListener('click', () => {
        const producto = boton.parentElement;
        const nombre = producto.querySelector('h3').textContent;
        const precio = parseFloat(producto.querySelector('p').textContent.replace('$', ''));
        
        const itemExistente = carrito.find(item => item.nombre === nombre);
        
        if (itemExistente) {
            itemExistente.cantidad++;
        } else {
            carrito.push({
                nombre: nombre,
                precio: precio,
                cantidad: 1
            });
        }
        
        actualizarContador();
        actualizarCarritoModal();
    });
});

document.querySelector('.carrito-phones').addEventListener('click', () => {
    document.getElementById('modal-carrito-phones').style.display = 'block';
});

window.addEventListener('click', (e) => {
    if (e.target === document.getElementById('modal-carrito-phones')) {
        document.getElementById('modal-carrito-phones').style.display = 'none';
    }
});

document.getElementById('pagar-phones').addEventListener('click', () => {
    if (carrito.length > 0) {
        alert('¡Compra realizada con éxito!');
        carrito = [];
        actualizarContador();
        actualizarCarritoModal();
        document.getElementById('modal-carrito-phones').style.display = 'none';
    }
});

function actualizarContador() {
    contador = carrito.reduce((total, item) => total + item.cantidad, 0);
    document.querySelector('.carrito-cantidad').textContent = contador;
}

function actualizarCarritoModal() {
    const carritoItems = document.querySelector('.carrito-items');
    carritoItems.innerHTML = '';
    let total = 0;

    carrito.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = 'item-telefono';
        itemElement.innerHTML = `
            <span>${item.nombre}</span>
            <div>
                <button class="decrementar-cantidad">-</button>
                <span class="cantidad-phones">${item.cantidad}</span>
                <button class="incrementar-cantidad">+</button>
                <button class="eliminar-telefono">🗑️</button>
            </div>
            <span>$${(item.precio * item.cantidad).toFixed(2)}</span>
        `;

        itemElement.querySelector('.incrementar-cantidad').addEventListener('click', () => {
            item.cantidad++;
            actualizarContador();
            actualizarCarritoModal();
        });

        itemElement.querySelector('.decrementar-cantidad').addEventListener('click', () => {
            if (item.cantidad > 1) {
                item.cantidad--;
                actualizarContador();
                actualizarCarritoModal();
            }
        });

        itemElement.querySelector('.eliminar-telefono').addEventListener('click', () => {
            carrito = carrito.filter(i => i !== item);
            actualizarContador();
            actualizarCarritoModal();
        });

        carritoItems.appendChild(itemElement);
        total += item.precio * item.cantidad;
    });

    document.getElementById('total-amount').textContent = total.toFixed(2);
}

// Add this event listener for the close button
document.querySelector('.cerrar-modal').addEventListener('click', () => {
    document.getElementById('modal-carrito-phones').style.display = 'none';
});

// Agregar la funcionalidad de búsqueda
const searchInput = document.querySelector('.search-bar input');

searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const productos = document.querySelectorAll('.producto-phone');

    productos.forEach(producto => {
        const nombre = producto.querySelector('h3').textContent.toLowerCase();
        const specs = producto.querySelector('.specs').textContent.toLowerCase();
        const precio = producto.querySelector('.precio').textContent.toLowerCase();

        if (nombre.includes(searchTerm) || 
            specs.includes(searchTerm) || 
            precio.includes(searchTerm)) {
            producto.style.display = 'block';
        } else {
            producto.style.display = 'none';
        }
    });
});

// Agregar animación suave para los resultados
const searchStyle = document.createElement('style');
searchStyle.textContent = `
    .producto-phone {
        transition: all 0.3s ease-in-out;
    }
`;
document.head.appendChild(searchStyle);
