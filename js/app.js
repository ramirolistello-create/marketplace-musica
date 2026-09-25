/* ============================= */
/* CONTADOR DEL CARRITO */
/* ============================= */

function actualizarContadorCarrito() {


var contador =
    document.querySelector(
        "#contador-carrito"
    );

if (!contador) {
    return;
}

var carrito =
    JSON.parse(
        localStorage.getItem("carrito")
    ) || [];

contador.textContent =
    carrito.length;


}

/* ============================= */
/* ACTUALIZAR AL CARGAR LA PÁGINA */
/* ============================= */

actualizarContadorCarrito();

/* ============================= */
/* ACTUALIZAR SI CAMBIA EL CARRITO */
/* ============================= */

window.addEventListener(
"storage",
function() {


    actualizarContadorCarrito();

}


);
