// Variables para mostrar los productos
const productosElement = document.querySelector(".productos");
const productosCarrito = document.querySelector(".productosCarrito");
const precioTotalElement = document.querySelector(".precioTotal");
const itemsEnCarrito = document.querySelector(".itemsEnCarrito");

// Constantes para abrir y cerrar popup
const abrirModal = document.getElementById('openModal');
const popupContainer = document.getElementById('popupContainer');
const fondoTransparente = document.getElementById('fondoTransparente');
const cerrarModal = document.getElementById('closeModal');

// Abrir y cerrar popup
openModal.addEventListener('click', ()=>{
    popupContainer.classList.add('mostrar');
    fondoTransparente.classList.add('mostrar');
});
cerrarModal.addEventListener('click', ()=>{
    popupContainer.classList.remove('mostrar');
    fondoTransparente.classList.remove('mostrar');
});

// Renderizo los productos
function renderProductos(){
    productos.forEach((product) => {
        productosElement.innerHTML += 
        `
            <div class="producto">
                <img src="${product.imgSrc}" alt="${product.nombre}" class="imagenProducto">
                <h5 class="tituloProducto">${product.nombre}</h5>
                <h6 class="precioProducto">$${product.precio}</h6>
                <button onclick="añadirAlCarrito(${product.id})"><i class="fa-solid fa-cart-shopping"></i>Añadir al carrito</button>
            </div>
        `;
    })
}
renderProductos();

let carrito = JSON.parse(localStorage.getItem("CARRITO")) || [];
actualizarCarrito();

// Agregar producto al carrito
function añadirAlCarrito(id){
    // Checkeo si la id del producto existe
    if(carrito.some((item) => item.id === id)){
        cambiarNroUnidades("mas", id);
    }
    else{
        const item = productos.find((product) => product.id === id);
        carrito.push({
            ...item,
            numeroDeUnidades: 1,
        });
    }
    actualizarCarrito();
}   
// Actulizar productos del carrito
function actualizarCarrito(){
    renderItemsCarrito();
    renderPrecioTotal();

    localStorage.setItem("CARRITO", JSON.stringify(carrito))
}

function renderPrecioTotal(){
    let totalPrecio = 0, totalItems = 0;
    carrito.forEach((item) => {
        totalPrecio  += item.precio * item.numeroDeUnidades;
        totalItems += item.numeroDeUnidades;
    });

    precioTotalElement.innerHTML = `
    <h6>total (${totalItems} productos):</h6> 
    <h6>$${totalPrecio.toFixed(2)}</h6>`
    itemsEnCarrito.innerHTML = totalItems;
}
// Compro los productos
function comprarCarrito(){
    carrito.forEach((item) => {
        eliminarItemsCarrito(item.id);
    });
    
}
// Renderizo items del carrito
function renderItemsCarrito(){
    productosCarrito.innerHTML = "";
    carrito.forEach((item) => {
        productosCarrito.innerHTML += 
        `
            <div class="tarjetaProducto">
                <img src="${item.imgSrc}" alt="${item.nombre}" class="imagenProducto">
                <div class="infoProducto">            
                    <h6>${item.nombre}</h6>
                    <h6>$${item.precio}</</h6>
                    <div class="cantidadProducto">
                        <button onclick="cambiarNroUnidades('menos', ${item.id})">-</button>
                        <h6>${item.numeroDeUnidades}</h6>
                        <button onclick="cambiarNroUnidades('mas', ${item.id})">+</button>
                    </div>
                </div>
                <div class="precioYEliminar">
                    <h6 class="itemPrecio">$${item.precio}</</h6>
                    <i onclick="eliminarItemsCarrito(${item.id})" class="fa-regular fa-trash-can"></i>
                </div>
            </div>
        `
    })
}
function eliminarItemsCarrito(id){
    carrito = carrito.filter((item) => item.id !== id);
    actualizarCarrito();
}
// Cambia número de unidades de un item
function cambiarNroUnidades(action, id){
    carrito = carrito.map((item) => {
        let numeroDeUnidades = item.numeroDeUnidades;

        if(item.id === id){
            if(action === "menos" && numeroDeUnidades > 1){
                numeroDeUnidades--;
            }
            else if(action === "mas" && numeroDeUnidades < item.enStock){
                numeroDeUnidades++;
            }
        }
        return{
            ...item,
            numeroDeUnidades,
        };
    });
    actualizarCarrito();
}