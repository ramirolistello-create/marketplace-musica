console.log("ARTISTA: INICIO");


const SUPABASE_URL =
    "https://zyyvjbtsldxehaulgmgt.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_KtoC3FL-i8Dr9eiVdcfE-g_3UZQyHBI";


/*
=====================================================
OBTENER ID DEL ARTISTA
=====================================================
*/

const parametros =
    new URLSearchParams(window.location.search);

const artistaId =
    parametros.get("id");


console.log(
    "ID DEL ARTISTA:",
    artistaId
);


/*
=====================================================
ELEMENTOS DE LA PÁGINA
=====================================================
*/

const contenedorArtista =
    document.getElementById("artista");

const contenedorAlbumes =
    document.getElementById("albumes-artista");


/*
=====================================================
VERIFICAR ID
=====================================================
*/

if (!artistaId) {

    contenedorArtista.innerHTML =
        "<p>No se encontró el artista.</p>";

    contenedorAlbumes.innerHTML =
        "<p>No se encontró el artista.</p>";

} else {

    cargarArtista();

    cargarAlbumes();

}


/*
=====================================================
CARGAR INFORMACIÓN DEL ARTISTA
=====================================================
*/

async function cargarArtista() {

    try {

        const respuesta =
            await fetch(

                SUPABASE_URL +
                "/rest/v1/perfiles" +
                "?select=id,nombre,tipo,avatar_url" +
                "&id=eq." +
                artistaId,

                {
                    headers: {
                        "apikey": SUPABASE_KEY
                    }
                }

            );


        console.log(
            "RESPUESTA ARTISTA:",
            respuesta.status
        );


        if (!respuesta.ok) {

            const error =
                await respuesta.text();

            console.error(
                "ERROR ARTISTA:",
                error
            );

            contenedorArtista.innerHTML =
                "<p>No se pudo cargar el artista.</p>";

            return;
        }


        const artistas =
            await respuesta.json();


        console.log(
            "DATOS ARTISTA:",
            artistas
        );


        if (artistas.length === 0) {

            contenedorArtista.innerHTML =
                "<p>Artista no encontrado.</p>";

            return;
        }


        const artista =
            artistas[0];


        const avatar =
            artista.avatar_url
                ? artista.avatar_url
                : "https://via.placeholder.com/200";


        contenedorArtista.innerHTML = `

            <div class="artist-card">

                <img
                    src="${avatar}"
                    alt="${artista.nombre || "Artista"}"
                >

                <div class="artist-card-info">

                    <h1>
                        ${artista.nombre || "Artista sin nombre"}
                    </h1>

                    <p>
                        Artista independiente
                    </p>

                </div>

            </div>

        `;


    } catch (error) {

        console.error(
            "ERROR:",
            error
        );


        contenedorArtista.innerHTML =
            "<p>Ocurrió un error al cargar el artista.</p>";

    }

}


/*
=====================================================
CARGAR ÁLBUMES DEL ARTISTA
=====================================================
*/

async function cargarAlbumes() {

    try {

        const respuesta =
            await fetch(

                SUPABASE_URL +
                "/rest/v1/albumes" +
                "?select=id,titulo,descripcion,precio,portada_url,artista_id" +
                "&artista_id=eq." +
                artistaId +
                "&order=created_at.desc",

                {
                    headers: {
                        "apikey": SUPABASE_KEY
                    }
                }

            );


        console.log(
            "RESPUESTA ÁLBUMES DEL ARTISTA:",
            respuesta.status
        );


        if (!respuesta.ok) {

            const error =
                await respuesta.text();

            console.error(
                "ERROR ÁLBUMES:",
                error
            );


            contenedorAlbumes.innerHTML = `

                <h2 class="section-title">
                    Álbumes
                </h2>

                <p>
                    No se pudieron cargar los álbumes.
                </p>

            `;

            return;
        }


        const albumes =
            await respuesta.json();


        console.log(
            "ÁLBUMES DEL ARTISTA:",
            albumes
        );


        if (albumes.length === 0) {

            contenedorAlbumes.innerHTML = `

                <h2 class="section-title">
                    Álbumes
                </h2>

                <p>
                    Este artista todavía no tiene álbumes publicados.
                </p>

            `;

            return;
        }


        let html = `

            <h2 class="section-title">
                Álbumes
            </h2>

            <div class="albums">

        `;


        albumes.forEach(album => {


            const portada =
                album.portada_url
                    ? album.portada_url
                    : "https://via.placeholder.com/300";


            html += `

                <div
                    class="album-card"
                    onclick="window.location.href='./album.html?id=${album.id}'"
                    style="cursor:pointer;"
                >

                    <img
                        src="${portada}"
                        alt="${album.titulo || "Álbum"}"
                    >

                    <div class="album-info">

                        <h3>
                            ${album.titulo || "Álbum sin título"}
                        </h3>

                        <p>
                            ${album.descripcion || ""}
                        </p>

                        <strong>
                            $${Number(album.precio || 0).toLocaleString("es-AR")}
                        </strong>

                    </div>

                </div>

            `;

        });


        html += `

            </div>

        `;


        contenedorAlbumes.innerHTML =
            html;


    } catch (error) {

        console.error(
            "ERROR:",
            error
        );


        contenedorAlbumes.innerHTML = `

            <h2 class="section-title">
                Álbumes
            </h2>

            <p>
                Ocurrió un error al cargar los álbumes.
            </p>

        `;

    }

}