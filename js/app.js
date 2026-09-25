var URL_ALBUMES = "https://zyyvjbtsldxehaulgmgt.supabase.co/rest/v1/albumes?select=id,titulo,descripcion,precio,portada_url,artista_id,perfiles(nombre)";
var URL_PERFILES = "https://zyyvjbtsldxehaulgmgt.supabase.co/rest/v1/perfiles?select=id,nombre,tipo,usuario_id";
var KEY_SUPABASE = "sb_publishable_KtoC3FL-i8Dr9eiVdcfE-g_3UZQyHBI";

console.log("INICIO");



/* ============================= */
/* CARGAR ÁLBUMES */
/* ============================= */

var solicitud = new XMLHttpRequest();

solicitud.open("GET", URL_ALBUMES, true);

solicitud.setRequestHeader(
    "apikey",
    KEY_SUPABASE
);

solicitud.addEventListener(
    "load",
    function() {

        console.log(
            "RESPUESTA RECIBIDA"
        );

        console.log(
            solicitud.status
        );

        if (solicitud.status !== 200) {

            console.log(
                "ERROR SUPABASE:",
                solicitud.responseText
            );

            return;
        }

        var albumes =
            JSON.parse(
                solicitud.responseText
            );

        console.log(
            "ALBUMES:",
            albumes
        );

        var contenedor =
            document.querySelector(
                ".albums"
            );

        if (!contenedor) {

            console.log(
                "No se encontró .albums"
            );

            return;
        }

        contenedor.innerHTML = "";

        for (
            var i = 0;
            i < albumes.length;
            i++
        ) {

            var album =
                albumes[i];

            var nombreArtista =
                "Artista";

            if (
                album.perfiles &&
                album.perfiles.nombre
            ) {

                nombreArtista =
                    album.perfiles.nombre;

            }

            var tarjeta =
                document.createElement(
                    "div"
                );

            tarjeta.className =
                "album-card";

            tarjeta.innerHTML =

                "<img src='" +
                album.portada_url +
                "'>" +

                "<h3>" +
                album.titulo +
                "</h3>" +

                "<p>Por: " +
                nombreArtista +
                "</p>" +

                "<p>" +
                album.descripcion +
                "</p>" +

                "<p class='precio'>$" +
                album.precio +
                "</p>" +

                "<a href='album.html?id=" +
                album.id +
                "' class='boton-comprar'>" +
                "Comprar álbum" +
                "</a>";

            contenedor.appendChild(
                tarjeta
            );

        }

    }
);


solicitud.addEventListener(
    "error",
    function() {

        console.log(
            "ERROR DE CONEXIÓN CON SUPABASE"
        );

    }
);


solicitud.send();

console.log(
    "SOLICITUD ENVIADA"
);



/* ============================= */
/* USUARIO Y PERFIL */
/* ============================= */

var usuarioSesion =
    document.getElementById(
        "usuarioSesion"
    );

var token =
    localStorage.getItem(
        "access_token"
    );


if (
    token &&
    usuarioSesion
) {

    try {

        var partesToken =
            token.split(".");

        var datosToken =
            JSON.parse(
                atob(
                    partesToken[1]
                        .replace(/-/g, "+")
                        .replace(/_/g, "/")
                )
            );

        var usuarioId =
            datosToken.sub;

        var correoUsuario =
            datosToken.email;


        if (usuarioId) {

            var solicitudPerfil =
                new XMLHttpRequest();

            solicitudPerfil.open(
                "GET",
                URL_PERFILES +
                "&usuario_id=eq." +
                usuarioId,
                true
            );

            solicitudPerfil.setRequestHeader(
                "apikey",
                KEY_SUPABASE
            );

            solicitudPerfil.addEventListener(
                "load",
                function() {

                    if (
                        solicitudPerfil.status !== 200
                    ) {

                        console.error(
                            "ERROR CARGANDO PERFIL:",
                            solicitudPerfil.responseText
                        );

                        if (correoUsuario) {

                            usuarioSesion.textContent =
                                correoUsuario;

                        }

                        return;
                    }

                    var perfiles =
                        JSON.parse(
                            solicitudPerfil.responseText
                        );

                    console.log(
                        "PERFIL USUARIO:",
                        perfiles
                    );


                    if (
                        perfiles.length > 0 &&
                        perfiles[0].nombre
                    ) {

                        usuarioSesion.textContent =
                            perfiles[0].nombre;

                        console.log(
                            "NOMBRE DEL PERFIL MOSTRADO:",
                            perfiles[0].nombre
                        );

                    } else {

                        usuarioSesion.textContent =
                            correoUsuario;

                    }


                    usuarioSesion.href =
                        "#";


                    /* ============================= */
                    /* CERRAR SESIÓN */
                    /* ============================= */

                    usuarioSesion.addEventListener(
                        "click",
                        function(event) {

                            event.preventDefault();

                            var cerrarSesion =
                                confirm(
                                    "¿Querés cerrar sesión?"
                                );

                            if (!cerrarSesion) {

                                return;

                            }

                            localStorage.removeItem(
                                "access_token"
                            );

                            localStorage.removeItem(
                                "refresh_token"
                            );

                            localStorage.removeItem(
                                "usuario_id"
                            );

                            console.log(
                                "SESIÓN CERRADA"
                            );

                            window.location.href =
                                "index.html";

                        }
                    );

                }
            );


            solicitudPerfil.addEventListener(
                "error",
                function() {

                    console.error(
                        "ERROR DE CONEXIÓN AL CARGAR PERFIL"
                    );

                }
            );


            solicitudPerfil.send();

        }

    } catch (error) {

        console.error(
            "No se pudo leer el usuario:",
            error
        );

    }

}
/* ============================= */
/* CONTADOR DEL CARRITO */
/* ============================= */

function actualizarContadorCarrito() {

```
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
```

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
