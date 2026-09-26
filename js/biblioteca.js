console.log("BIBLIOTECA INICIADA");

var URL_SUPABASE =
"https://zyyvjbtsldxehaulgmgt.supabase.co";

var KEY_SUPABASE =
"sb_publishable_KtoC3FL-i8Dr9eiVdcfE-g_3UZQyHBI";

var token =
localStorage.getItem("access_token");

var contenedor =
document.getElementById("biblioteca");

/* =====================================================
COMPROBAR SESIÓN
===================================================== */

if (!token) {


console.log(
    "NO HAY SESIÓN"
);

if (contenedor) {

    contenedor.innerHTML =
        "<p>Debes iniciar sesión para ver tu biblioteca.</p>";

}


} else {


try {

    var partes =
        token.split(".");

    var payload =
        JSON.parse(
            atob(
                partes[1]
                    .replace(/-/g, "+")
                    .replace(/_/g, "/")
            )
        );

    var usuarioAuthId =
        payload.sub;

    console.log(
        "USUARIO AUTH:",
        usuarioAuthId
    );

    console.log(
        "CORREO:",
        payload.email
    );

    cargarBiblioteca(
        usuarioAuthId
    );

} catch (error) {

    console.error(
        "ERROR LEYENDO TOKEN:",
        error
    );

    if (contenedor) {

        contenedor.innerHTML =
            "<p>La sesión no es válida. Vuelve a iniciar sesión.</p>";

    }

}


}

/* =====================================================
CARGAR BIBLIOTECA
===================================================== */

function cargarBiblioteca(
usuarioAuthId
) {


console.log(
    "BUSCANDO PERFIL:",
    usuarioAuthId
);

var urlPerfil =
    URL_SUPABASE +
    "/rest/v1/perfiles?select=id,nombre,usuario_id&usuario_id=eq." +
    encodeURIComponent(
        usuarioAuthId
    );

var solicitudPerfil =
    new XMLHttpRequest();

solicitudPerfil.open(
    "GET",
    urlPerfil,
    true
);

solicitudPerfil.setRequestHeader(
    "apikey",
    KEY_SUPABASE
);

solicitudPerfil.setRequestHeader(
    "Authorization",
    "Bearer " + token
);

solicitudPerfil.addEventListener(
    "load",
    function() {

        console.log(
            "RESPUESTA PERFIL:",
            solicitudPerfil.status
        );

        if (
            solicitudPerfil.status !== 200
        ) {

            if (contenedor) {

                contenedor.innerHTML =
                    "<p>No se pudo cargar tu perfil.</p>";

            }

            return;

        }

        var perfiles;

        try {

            perfiles =
                JSON.parse(
                    solicitudPerfil.responseText
                );

        } catch (error) {

            console.error(
                "ERROR PARSEANDO PERFIL:",
                error
            );

            return;

        }

        if (
            !perfiles ||
            perfiles.length === 0
        ) {

            console.log(
                "NO SE ENCONTRÓ PERFIL"
            );

            if (contenedor) {

                contenedor.innerHTML =
                    "<p>No se encontró tu perfil.</p>";

            }

            return;

        }

        var perfilId =
            perfiles[0].id;

        console.log(
            "ID PERFIL:",
            perfilId
        );

        cargarCompras(
            perfilId
        );

    }
);

solicitudPerfil.addEventListener(
    "error",
    function() {

        console.error(
            "ERROR DE CONEXIÓN CON PERFIL"
        );

        if (contenedor) {

            contenedor.innerHTML =
                "<p>No se pudo conectar con Supabase.</p>";

        }

    }
);

solicitudPerfil.send();


}

/* =====================================================
CARGAR COMPRAS
===================================================== */

function cargarCompras(
perfilId
) {


console.log(
    "BUSCANDO COMPRAS DEL PERFIL:",
    perfilId
);

var urlCompras =
    URL_SUPABASE +
    "/rest/v1/compras?select=id,album_id,precio_pagado,estado,created_at&usuario_id=eq." +
    encodeURIComponent(
        perfilId
    ) +
    "&estado=eq.aprobado&order=created_at.desc";

var solicitudCompras =
    new XMLHttpRequest();

solicitudCompras.open(
    "GET",
    urlCompras,
    true
);

solicitudCompras.setRequestHeader(
    "apikey",
    KEY_SUPABASE
);

solicitudCompras.setRequestHeader(
    "Authorization",
    "Bearer " + token
);

solicitudCompras.addEventListener(
    "load",
    function() {

        console.log(
            "RESPUESTA COMPRAS:",
            solicitudCompras.status
        );

        if (
            solicitudCompras.status !== 200
        ) {

            if (contenedor) {

                contenedor.innerHTML =
                    "<p>No se pudieron cargar tus compras.</p>";

            }

            return;

        }

        var compras;

        try {

            compras =
                JSON.parse(
                    solicitudCompras.responseText
                );

        } catch (error) {

            console.error(
                "ERROR PARSEANDO COMPRAS:",
                error
            );

            return;

        }

        if (
            !compras ||
            compras.length === 0
        ) {

            if (contenedor) {

                contenedor.innerHTML =
                    "<p>Todavía no tienes compras.</p>";

            }

            return;

        }

        console.log(
            "COMPRAS ENCONTRADAS:",
            compras
        );

        if (contenedor) {

            contenedor.innerHTML = "";

        }

        compras.forEach(
            function(compra) {

                cargarAlbum(
                    compra.album_id,
                    compra
                );

            }
        );

    }
);

solicitudCompras.addEventListener(
    "error",
    function() {

        console.error(
            "ERROR DE CONEXIÓN CON COMPRAS"
        );

        if (contenedor) {

            contenedor.innerHTML =
                "<p>No se pudo conectar con Supabase.</p>";

        }

    }
);

solicitudCompras.send();


}

/* =====================================================
CARGAR DATOS DEL ÁLBUM
===================================================== */

function cargarAlbum(
albumId,
compra
) {


console.log(
    "BUSCANDO ÁLBUM:",
    albumId
);

var urlAlbum =
    URL_SUPABASE +
    "/rest/v1/albumes?select=id,titulo,descripcion,precio,portada_url&id=eq." +
    encodeURIComponent(
        albumId
    );

var solicitudAlbum =
    new XMLHttpRequest();

solicitudAlbum.open(
    "GET",
    urlAlbum,
    true
);

solicitudAlbum.setRequestHeader(
    "apikey",
    KEY_SUPABASE
);

solicitudAlbum.setRequestHeader(
    "Authorization",
    "Bearer " + token
);

solicitudAlbum.addEventListener(
    "load",
    function() {

        console.log(
            "RESPUESTA ÁLBUM:",
            solicitudAlbum.status
        );

        if (
            solicitudAlbum.status !== 200
        ) {

            return;

        }

        var albumes;

        try {

            albumes =
                JSON.parse(
                    solicitudAlbum.responseText
                );

        } catch (error) {

            console.error(
                "ERROR PARSEANDO ÁLBUM:",
                error
            );

            return;

        }

        if (
            !albumes ||
            albumes.length === 0
        ) {

            console.log(
                "NO SE ENCONTRÓ EL ÁLBUM"
            );

            return;

        }

        mostrarAlbum(
            albumes[0],
            compra
        );

    }
);

solicitudAlbum.addEventListener(
    "error",
    function() {

        console.error(
            "ERROR DE CONEXIÓN CON ÁLBUM"
        );

    }
);

solicitudAlbum.send();


}

/* =====================================================
MOSTRAR ÁLBUM
===================================================== */

function mostrarAlbum(
album,
compra
) {


if (!contenedor) {
    return;
}

var tarjeta =
    document.createElement("div");

tarjeta.className =
    "biblioteca-card";


/* =================================================
   PORTADA
================================================= */

if (
    album.portada_url
) {

    var portada =
        document.createElement("img");

    portada.src =
        album.portada_url;

    portada.alt =
        album.titulo;

    tarjeta.appendChild(
        portada
    );

}


/* =================================================
   TÍTULO
================================================= */

var titulo =
    document.createElement("h3");

titulo.textContent =
    album.titulo;

tarjeta.appendChild(
    titulo
);


/* =================================================
   DESCRIPCIÓN
================================================= */

var descripcion =
    document.createElement("p");

descripcion.textContent =
    album.descripcion ||
    "Sin descripción.";

tarjeta.appendChild(
    descripcion
);


/* =================================================
   ESTADO
================================================= */

var estado =
    document.createElement("p");

estado.className =
    "estado-compra";

estado.textContent =
    "Compra aprobada";

tarjeta.appendChild(
    estado
);


/* =================================================
   BOTÓN DESCARGAR
================================================= */

var boton =
    document.createElement("button");

boton.className =
    "boton-descargar";

boton.type =
    "button";

boton.textContent =
    "Descargar álbum";

boton.addEventListener(
    "click",
    function() {

        descargarAlbum(
            album.id
        );

    }
);

tarjeta.appendChild(
    boton
);


/* =================================================
   AGREGAR TARJETA
================================================= */

contenedor.appendChild(
    tarjeta
);

console.log(
    "TARJETA DE BIBLIOTECA CREADA:",
    album.id
);


}

/* =====================================================
DESCARGAR ÁLBUM
===================================================== */

function descargarAlbum(
albumId
) {


console.log(
    "DESCARGAR ÁLBUM:",
    albumId
);

var solicitud =
    new XMLHttpRequest();

solicitud.open(
    "POST",
    URL_SUPABASE +
    "/functions/v1/descargar-album",
    true
);

solicitud.setRequestHeader(
    "Content-Type",
    "application/json"
);

solicitud.setRequestHeader(
    "apikey",
    KEY_SUPABASE
);

solicitud.setRequestHeader(
    "Authorization",
    "Bearer " + token
);

solicitud.addEventListener(
    "load",
    function() {

        console.log(
            "RESPUESTA DESCARGA:",
            solicitud.status
        );

        if (
            solicitud.status !== 200
        ) {

            var error;

            try {

                error =
                    JSON.parse(
                        solicitud.responseText
                    );

            } catch (e) {

                error = {
                    error:
                        "No se pudo realizar la descarga."
                };

            }

            alert(
                error.error ||
                "No se pudo realizar la descarga."
            );

            return;

        }

        var respuesta;

        try {

            respuesta =
                JSON.parse(
                    solicitud.responseText
                );

        } catch (error) {

            console.error(
                "ERROR PARSEANDO DESCARGA:",
                error
            );

            alert(
                "Respuesta inválida del servidor."
            );

            return;

        }

        if (
            !respuesta.download_url
        ) {

            alert(
                "No se recibió la URL de descarga."
            );

            return;

        }

        console.log(
            "URL DE DESCARGA RECIBIDA"
        );

        window.location.href =
            respuesta.download_url;

    }
);

solicitud.addEventListener(
    "error",
    function() {

        console.error(
            "ERROR DE CONEXIÓN CON DESCARGA"
        );

        alert(
            "No se pudo conectar con el servidor de descarga."
        );

    }
);

solicitud.send(
    JSON.stringify({
        album_id: albumId
    })
);


}
