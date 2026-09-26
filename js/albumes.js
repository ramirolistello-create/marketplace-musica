console.log("ÁLBUMES.JS INICIADO");

var URL_SUPABASE =
"https://zyyvjbtsldxehaulgmgt.supabase.co";

var KEY_SUPABASE =
"sb_publishable_KtoC3FL-i8Dr9eiVdcfE-g_3UZQyHBI";

var contenedor =
document.getElementById("albumes");

var url =
URL_SUPABASE +
"/rest/v1/albumes" +
"?select=id,titulo,descripcion,precio,portada_url,artista_id,perfiles(nombre)";

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

return respuesta.json();


})

.then(function(albumes) {


console.log(
    "ÁLBUMES:",
    albumes
);


if (
    !albumes ||
    albumes.length === 0
) {

    contenedor.innerHTML =
        "<p>No hay álbumes disponibles.</p>";

    return;

}


contenedor.innerHTML = "";


albumes.forEach(function(album) {

    var nombreArtista =
        "Artista";


    if (
        album.perfiles &&
        album.perfiles.nombre
    ) {

        nombreArtista =
            album.perfiles.nombre;

    }


    var portada =
        album.portada_url ||
        "https://via.placeholder.com/300";


    var tarjeta =
        document.createElement("div");


    tarjeta.className =
        "album-card";


    tarjeta.innerHTML =

        "<img src='" +
        portada +
        "' alt='" +
        album.titulo +
        "'>" +

        "<div class='album-info'>" +

            "<h2>" +
            album.titulo +
            "</h2>" +

            "<p class='album-artista'>" +
            nombreArtista +
            "</p>" +

            "<p class='album-descripcion'>" +
            (
                album.descripcion ||
                ""
            ) +
            "</p>" +

        "</div>" +

        "<div class='album-precio'>" +

            "$" +
            album.precio +

        "</div>" +

        "<a class='boton-ver' href='./album.html?id=" +
        album.id +
        "'>" +

            "VER" +

        "</a>";


    contenedor.appendChild(
        tarjeta
    );

});


})

.catch(function(error) {


console.error(
    "ERROR:",
    error
);


contenedor.innerHTML =
    "<p>Error al cargar los álbumes.</p>";


});