var URL_ALBUMES =
    "https://zyyvjbtsldxehaulgmgt.supabase.co/rest/v1/albumes?select=id,titulo,descripcion,precio,portada_url,artista_id,perfiles(nombre)";

var URL_PERFILES =
    "https://zyyvjbtsldxehaulgmgt.supabase.co/rest/v1/perfiles?select=id,nombre,tipo,usuario_id";

var KEY_SUPABASE =
    "sb_publishable_KtoC3FL-i8Dr9eiVdcfE-g_3UZQyHBI";


console.log("INICIO");



/* ============================= */
/* CARGAR ÁLBUMES */
/* ============================= */

var solicitud =
    new XMLHttpRequest();


solicitud.open(
    "GET",
    URL_ALBUMES,
    true
);


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


        if (
            solicitud.status !== 200
        ) {

            console.log(
                "ERROR SUPABASE:",
                solicitud.responseText
            );

            return;
        }


        var albumes =
            JSON.parse

