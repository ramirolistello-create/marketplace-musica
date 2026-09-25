console.log("CHECKOUT.JS INICIADO");

var carrito = JSON.parse(
    localStorage.getItem("carrito")
) || [];

var contenedor =
    document.querySelector("#checkout");

console.log(
    "CARRITO:",
    carrito
);


/* ============================= */
/* COMPROBAR SESIÓN */
/* ============================= */

var tokenUsuario =
    localStorage.getItem("access_token");

if (!tokenUsuario) {

    contenedor.innerHTML =
        "<p>Tenés que iniciar sesión para comprar.</p>" +
        "<a href='login.html'>Iniciar sesión</a>";

} else if (carrito.length === 0) {

    contenedor.innerHTML =
        "<p>No hay productos en tu carrito.</p>" +
        "<a href='index.html'>Volver a la tienda</a>";

} else {

    var total = 0;

    var contenido = "";


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

        contenido +=

            "<div class='album-card'>" +

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

            "</div>";
    }


    contenido +=

        "<h2>Total de la compra: $" +
        total +
        "</h2>" +

        "<h3>Datos del comprador</h3>" +

        "<input id='nombre' type='text' placeholder='Nombre completo'>" +

        "<input id='email' type='email' placeholder='Correo electrónico'>" +

        "<button id='boton-pagar'>" +
        "Continuar al pago" +
        "</button>";


    contenedor.innerHTML =
        contenido;


    var botonPagar =
        document.querySelector(
            "#boton-pagar"
        );


    botonPagar.addEventListener(
        "click",
        async function() {

            var nombre =
                document
                    .querySelector("#nombre")
                    .value
                    .trim();

            var email =
                document
                    .querySelector("#email")
                    .value
                    .trim();


            if (nombre === "") {

                alert(
                    "Ingresá tu nombre."
                );

                return;
            }


            if (email === "") {

                alert(
                    "Ingresá tu correo electrónico."
                );

                return;
            }


            if (carrito.length !== 1) {

                alert(
                    "Por ahora la compra debe contener un solo álbum."
                );

                return;
            }


            var album =
                carrito[0];


            botonPagar.disabled =
                true;

            botonPagar.textContent =
                "Creando pago...";


            try {

                var respuesta =
                    await fetch(
                        "https://zyyvjbtsldxehaulgmgt.supabase.co/functions/v1/crear-pago",
                        {

                            method:
                                "POST",

                            headers: {

                                "Authorization":
                                    "Bearer " +
                                    tokenUsuario,

                                "apikey":
                                    "sb_publishable_KtoC3FL-i8Dr9eiVdcfE-g_3UZQyHBI",

                                "Content-Type":
                                    "application/json"

                            },

                            body:
                                JSON.stringify({

                                    titulo:
                                        album.titulo,

                                    precio:
                                        Number(
                                            album.precio
                                        ),

                                    email:
                                        email,

                                    album_id:
                                        album.id

                                })

                        }
                    );


                var resultado =
                    await respuesta.json();


                console.log(
                    "RESPUESTA CREAR-PAGO:",
                    resultado
                );


                if (!respuesta.ok) {

                    console.error(
                        "ERROR CREAR-PAGO:",
                        resultado
                    );

                    alert(
                        "No se pudo crear el pago.\n\n" +
                        (
                            resultado.error ||
                            "Error desconocido"
                        )
                    );

                    botonPagar.disabled =
                        false;

                    botonPagar.textContent =
                        "Continuar al pago";

                    return;
                }


                if (
                    !resultado.checkout_url
                ) {

                    alert(
                        "Mercado Pago no devolvió el enlace de pago."
                    );

                    botonPagar.disabled =
                        false;

                    botonPagar.textContent =
                        "Continuar al pago";

                    return;
                }


                console.log(
                    "REDIRIGIENDO A MERCADO PAGO:",
                    resultado.checkout_url
                );


                window.location.href =
                    resultado.checkout_url;


            } catch (error) {

                console.error(
                    "ERROR DE CONEXIÓN:",
                    error
                );

                alert(
                    "No se pudo conectar con el sistema de pago."
                );

                botonPagar.disabled =
                    false;

                botonPagar.textContent =
                    "Continuar al pago";

            }

        }
    );

}