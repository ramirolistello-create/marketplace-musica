console.log("ALBUM.JS INICIADO");

var URL_SUPABASE =
"https://zyyvjbtsldxehaulgmgt.supabase.co";

var KEY_SUPABASE =
"sb_publishable_KtoC3FL-i8Dr9eiVdcfE-g_3UZQyHBI";

var parametros =
new URLSearchParams(window.location.search);

var idAlbum =
parametros.get("id");

var contenedor =
document.getElementById("album");

if (!idAlbum) {


contenedor.innerHTML =
    "<p>Álbum no encontrado.</p>";


} else {


var url =
    URL_SUPABASE +
    "/rest/v1/albumes" +
    "?select=id,titulo,descripcion,precio,portada_url,artista_id,perfiles(nombre)" +
    "&id=eq." +
    encodeURIComponent(idAlbum);


fetch(url, {

    method: "GET",

    headers: {

        "apikey": KEY_SUPABASE,

        "Accept": "application/json"

    }

})

.then(function(respuesta) {

    console.log(
        "RESPUESTA:",
        respuesta.status
    );

    return respuesta.text();

})

.then(function(texto) {

    var datos;

    try {

        datos =
            JSON.parse(texto);

    } catch (error) {

        console.error(
            "ERROR JSON:",
            texto
        );

        contenedor.innerHTML =
            "<p>Error al cargar el álbum.</p>";

        return;

    }


    console.log(
        "ÁLBUM:",
        datos
    );


    if (
        !datos ||
        datos.length === 0
    ) {

        contenedor.innerHTML =
            "<p>Álbum no encontrado.</p>";

        return;

    }


    var album =
        datos[0];


    var nombreArtista =
        "Artista";


    if (
        album.perfiles &&
        album.perfiles.nombre
    ) {

        nombreArtista =
            album.perfiles.nombre;

    }


    var portadaHTML =
        "";


    if (album.portada_url) {

        portadaHTML =

            "<img " +
            "class='album-portada' " +
            "src='" +
            album.portada_url +
            "' " +
            "alt='" +
            album.titulo +
            "'>";

    } else {

        portadaHTML =

            "<div " +
            "class='album-portada' " +
            "style='display:flex;align-items:center;justify-content:center;background:#27272a;color:#71717a;font-size:13px;' " +
            ">" +
            "Sin portada" +
            "</div>";

    }


    var previewHTML =
        "";


    if (album.id == 1) {

        var previewURL =
            URL_SUPABASE +
            "/storage/v1/object/public/previews/cancion-1.mp3";


        previewHTML =

            "<div class='preview-player'>" +

                "<h3>Escuchar preview</h3>" +

                "<audio controls preload='metadata'>" +

                    "<source src='" +
                    previewURL +
                    "' type='audio/mpeg'>" +

                    "Tu navegador no puede reproducir este audio." +

                "</audio>" +

                "<p>Preview de 30 segundos</p>" +

            "</div>";

    }


    contenedor.innerHTML =

        "<div class='album-detalle'>" +

            portadaHTML +

            "<div class='album-contenido'>" +

                "<h1>" +
                album.titulo +
                "</h1>" +

                "<h2>Por: " +
                nombreArtista +
                "</h2>" +

                "<p>" +
                (
                    album.descripcion ||
                    ""
                ) +
                "</p>" +

                previewHTML +

                "<div class='album-compra'>" +

                    "<p class='precio'>" +
                    "$" +
                    album.precio +
                    "</p>" +

                    "<button " +
                    "id='boton-comprar' " +
                    "class='boton-comprar'>" +
                    "Agregar al carrito" +
                    "</button>" +

                "</div>" +

            "</div>" +

        "</div>";


    var botonComprar =
        document.getElementById(
            "boton-comprar"
        );


    botonComprar.addEventListener(
        "click",
        function() {

            var carrito =
                JSON.parse(
                    localStorage.getItem(
                        "carrito"
                    )
                ) || [];


            var producto = {

                id:
                    album.id,

                titulo:
                    album.titulo,

                precio:
                    album.precio,

                portada_url:
                    album.portada_url,

                artista:
                    nombreArtista

            };


            var yaExiste =
                carrito.some(
                    function(item) {

                        return item.id ==
                            producto.id;

                    }
                );


            if (yaExiste) {

                mostrarNotificacion(
                    "✓ Este álbum ya está en tu carrito"
                );

            } else {

                carrito.push(
                    producto
                );


                localStorage.setItem(
                    "carrito",
                    JSON.stringify(carrito)
                );


                mostrarNotificacion(
                    "✓ Álbum agregado al carrito"
                );

            }


            setTimeout(
                function() {

                    window.location.href =
                        "./carrito.html";

                },
                900
            );

        }
    );

})

.catch(function(error) {

    console.error(
        "ERROR:",
        error
    );

    contenedor.innerHTML =
        "<p>Error al cargar el álbum.</p>";

});


}

/* =====================================================
NOTIFICACIÓN
===================================================== */

function mostrarNotificacion(
mensaje
) {


var notificacion =
    document.createElement(
        "div"
    );


notificacion.textContent =
    mensaje;


notificacion.style.position =
    "fixed";

notificacion.style.top =
    "20px";

notificacion.style.left =
    "50%";

notificacion.style.transform =
    "translateX(-50%)";

notificacion.style.background =
    "#18181b";

notificacion.style.color =
    "#ffffff";

notificacion.style.padding =
    "10px 18px";

notificacion.style.border =
    "1px solid #27272a";

notificacion.style.borderRadius =
    "6px";

notificacion.style.fontSize =
    "13px";

notificacion.style.zIndex =
    "9999";

notificacion.style.opacity =
    "0";

notificacion.style.transition =
    "opacity 0.2s ease";


document.body.appendChild(
    notificacion
);


setTimeout(
    function() {

        notificacion.style.opacity =
            "1";

    },
    10
);


setTimeout(
    function() {

        notificacion.style.opacity =
            "0";

        setTimeout(
            function() {

                notificacion.remove();

            },
            200
        );

    },
    700
);

}
