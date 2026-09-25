console.log("CARRITO.JS INICIADO");

var carrito =
JSON.parse(
localStorage.getItem("carrito")
) || [];

console.log(
"CARRITO GUARDADO:",
carrito
);

var contenedor =
document.querySelector("#carrito");

var contador =
document.querySelector(
"#contador-carrito"
);

/* ============================= */
/* ACTUALIZAR CONTADOR */
/* ============================= */

function actualizarContador() {

```
if (!contador) {
    return;
}

contador.textContent =
    carrito.length;
```

}

/* ============================= */
/* GUARDAR CARRITO */
/* ============================= */

function guardarCarrito() {

```
localStorage.setItem(
    "carrito",
    JSON.stringify(carrito)
);

actualizarContador();
```

}

/* ============================= */
/* MOSTRAR CARRITO */
/* ============================= */

function mostrarCarrito() {

```
actualizarContador();

if (carrito.length === 0) {

    contenedor.innerHTML =

        "<div class='carrito-vacio'>" +

            "<h2>Tu carrito está vacío</h2>" +

            "<p>" +
            "Todavía no agregaste ningún álbum." +
            "</p>" +

            "<a href='index.html'>" +
            "Explorar álbumes" +
            "</a>" +

        "</div>";

    return;
}


var total = 0;

contenedor.innerHTML = "";


/* ============================= */
/* PRODUCTOS */
/* ============================= */

for (
    var i = 0;
    i < carrito.length;
    i++
) {

    var album =
        carrito[i];


    total =
        total +
        Number(album.precio);


    var producto =
        document.createElement("div");


    producto.className =
        "album-card";


    producto.innerHTML =

        "<img src='" +
        album.portada_url +
        "'>" +

        "<h3>" +
        album.titulo +
        "</h3>" +

        "<p>Por: " +
        album.artista +
        "</p>" +

        "<p class='precio'>$" +
        album.precio +
        "</p>" +

        "<button " +
        "class='boton-eliminar' " +
        "data-id='" +
        album.id +
        "'>" +

        "🗑️ Eliminar" +

        "</button>";


    contenedor.appendChild(
        producto
    );
}


/* ============================= */
/* RESUMEN */
/* ============================= */

var resumen =
    document.createElement("div");


resumen.className =
    "resumen-carrito";


resumen.innerHTML =

    "<h2>" +
    "Total: $" +
    total +
    "</h2>" +

    "<button id='boton-pagar'>" +
    "Continuar al pago" +
    "</button>";


contenedor.appendChild(
    resumen
);


/* ============================= */
/* BOTONES ELIMINAR */
/* ============================= */

var botonesEliminar =
    document.querySelectorAll(
        ".boton-eliminar"
    );


for (
    var j = 0;
    j < botonesEliminar.length;
    j++
) {

    botonesEliminar[j]
        .addEventListener(
            "click",
            function() {

                var id =
                    Number(
                        this.getAttribute(
                            "data-id"
                        )
                    );


                var nuevoCarrito =
                    [];


                for (
                    var k = 0;
                    k < carrito.length;
                    k++
                ) {

                    if (
                        carrito[k].id !== id
                    ) {

                        nuevoCarrito.push(
                            carrito[k]
                        );
                    }
                }


                carrito =
                    nuevoCarrito;


                guardarCarrito();

                mostrarCarrito();

            }
        );
}


/* ============================= */
/* IR AL CHECKOUT */
/* ============================= */

var botonPagar =
    document.querySelector(
        "#boton-pagar"
    );


botonPagar.addEventListener(
    "click",
    function() {

        window.location.href =
            "checkout.html";

    }
);
```

}

/* ============================= */
/* INICIAR */
/* ============================= */

mostrarCarrito();
