console.log("ALBUM.JS INICIADO");

var URL_SUPABASE =
    "https://zyyvjbtsldxehaulgmgt.supabase.co";

var KEY_SUPABASE =
    "sb_publishable_KtoC3FL-i8Dr9eiVdcfE-g_3UZQyHBI";


var parametros =
    new URLSearchParams(
        window.location.search
    );

var idAlbum =
    parametros.get("id");


console.log(
    "ID DEL ÁLBUM:",
    idAlbum
);


var contenedor =
    document.querySelector("#album");


if (!contenedor) {

    console.error(
        "NO SE ENCONTRÓ #album"
    );

} else if (!idAlbum) {

    contenedor.innerHTML =
        "<p>No se especificó ningún álbum.</p>";

} else {

    var url =
        URL_SUPABASE +
        "/rest/v1/albumes" +
        "?select=id,titulo,descripcion,precio,portada_url,artista_id,perfiles(nombre)" +
        "&id=eq." +
        encodeURIComponent(idAlbum);


    console.log(
        "URL ÁLBUM:",
        url
    );


    var headers = {

        "apikey":
            KEY_SUPABASE,

        "Accept":
            "application/json"

    };


    var token =
        localStorage.getItem(
            "access_token"
        );


    if (token) {

        headers["Authorization"] =
            "Bearer " + token;

    }


    fetch(
        url,
        {
            method: "GET",
            headers: headers
        }
    )
    .then(function (respuesta) {

        console.log(
            "RESPUESTA:",
            respuesta.status
        );


        return respuesta.text()
            .then(function (texto) {

                console.log(
                    "RESPUESTA SUPABASE:",
                    texto
                );


                if (!respuesta.ok) {

                    throw new Error(
                        "HTTP " +
                        respuesta.status +
                        ": " +
                        texto
                    );

                }


                return texto;

            });

    })
    .then(function (texto) {

        var albumes;


        try {

            albumes =
                JSON.parse(texto);

        } catch (error) {

            console.error(
                "ERROR PARSEANDO RESPUESTA:",
                error
            );

            throw new Error(
                "La respuesta de Supabase no es JSON válido."
            );

        }


        console.log(
            "ÁLBUM:",
            albumes
        );


        if (
            !albumes ||
            albumes.length === 0
        ) {

            contenedor.innerHTML =
                "<p>Álbum no encontrado.</p>";

            return;

        }


        var album =
            albumes[0];


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
                "<img src='" +
                album.portada_url +
                "' alt='" +
                album.titulo +
                "'>";

        }


        contenedor.innerHTML =

            portadaHTML +

            "<h1>" +
            album.titulo +
            "</h1>" +

            "<h2>Por: " +
            nombreArtista +
            "</h2>" +

            "<p>" +
            (album.descripcion || "") +
            "</p>" +

            "<p>$" +
            album.precio +
            "</p>" +

            "<button id='boton-comprar'>" +
            "Agregar al carrito" +
            "</button>";


        var botonComprar =
            document.querySelector(
                "#boton-comprar"
            );


        if (!botonComprar) {

            console.error(
                "NO SE ENCONTRÓ #boton-comprar"
            );

            return;

        }


        botonComprar.addEventListener(
            "click",
            function () {

                var carrito;


                try {

                    carrito =
                        JSON.parse(
                            localStorage.getItem(
                                "carrito"
                            )
                        ) || [];

                } catch (error) {

                    carrito = [];

                }


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
                    false;


                for (
                    var i = 0;
                    i < carrito.length;
                    i++
                ) {

                    if (
                        carrito[i].id ===
                        producto.id
                    ) {

                        yaExiste =
                            true;

                        break;

                    }

                }


                if (!yaExiste) {

                    carrito.push(
                        producto
                    );


                    localStorage.setItem(
                        "carrito",
                        JSON.stringify(
                            carrito
                        )
                    );


                    alert(
                        "Álbum agregado al carrito."
                    );


                    window.location.href =
                        "carrito.html";


                } else {

                    alert(
                        "Este álbum ya está en tu carrito."
                    );


                    window.location.href =
                        "carrito.html";

                }

            }
        );

    })
    .catch(function (error) {

        console.error(
            "ERROR AL CARGAR ÁLBUM:",
            error
        );


        contenedor.innerHTML =
            "<p>Error al cargar el álbum.</p>";

    });

}