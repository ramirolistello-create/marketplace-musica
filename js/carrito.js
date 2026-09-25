console.log("CARRITO.JS INICIADO");

var carrito = JSON.parse(
    localStorage.getItem("carrito")
) || [];

console.log("CARRITO GUARDADO:", carrito);

var contenedor = document.querySelector("#carrito");

if (carrito.length === 0) {

    contenedor.innerHTML =
        "<p>Tu carrito está vacío.</p>";

} else {

    var total = 0;

    contenedor.innerHTML = "";

    for (var i = 0; i < carrito.length; i++) {

        var album = carrito[i];

        total = total + Number(album.precio);

        var producto = document.createElement("div");

        producto.className = "album-card";

        producto.innerHTML =

            "<img src='" + album.portada_url + "'>" +

            "<h3>" + album.titulo + "</h3>" +

            "<p>Por: " + album.artista + "</p>" +

            "<p class='precio'>$" + album.precio + "</p>" +

            "<button class='boton-eliminar' data-id='" +
            album.id +
            "'>Eliminar</button>";

        contenedor.appendChild(producto);
    }


    var resumen = document.createElement("div");

    resumen.innerHTML =

        "<h2>Total: $" + total + "</h2>" +

        "<button id='boton-pagar'>Continuar al pago</button>";

    contenedor.appendChild(resumen);


    var botonesEliminar =
        document.querySelectorAll(".boton-eliminar");


    for (var j = 0; j < botonesEliminar.length; j++) {

        botonesEliminar[j].addEventListener(
            "click",
            function() {

                var id = Number(
                    this.getAttribute("data-id")
                );

                var nuevoCarrito = [];

                for (var k = 0; k < carrito.length; k++) {

                    if (carrito[k].id !== id) {

                        nuevoCarrito.push(carrito[k]);

                    }
                }

                localStorage.setItem(
                    "carrito",
                    JSON.stringify(nuevoCarrito)
                );

                location.reload();

            }
        );
    }


    var botonPagar =
        document.querySelector("#boton-pagar");


    botonPagar.addEventListener(
        "click",
        function() {

            window.location.href =
                "checkout.html";

        }
    );

}