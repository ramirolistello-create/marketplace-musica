console.log("ARTISTAS: INICIO");


const SUPABASE_URL =
    "https://zyyvjbtsldxehaulgmgt.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_KtoC3FL-i8Dr9eiVdcfE-g_3UZQyHBI";


async function cargarArtistas() {

    const contenedor =
        document.getElementById("artistas");


    if (!contenedor) {

        console.log(
            "No se encontró #artistas"
        );

        return;
    }


    try {

        const respuesta = await fetch(

            SUPABASE_URL +
            "/rest/v1/perfiles?select=id,nombre,tipo,avatar_url&tipo=eq.artista&order=nombre.asc",

            {
                headers: {
                    "apikey": SUPABASE_KEY
                }
            }

        );


        console.log(
            "RESPUESTA ARTISTAS:",
            respuesta.status
        );


        if (!respuesta.ok) {

            const error =
                await respuesta.text();


            console.error(
                "ERROR ARTISTAS:",
                error
            );


            contenedor.innerHTML =
                "<p>No se pudieron cargar los artistas.</p>";


            return;
        }


        const artistas =
            await respuesta.json();


        console.log(
            "ARTISTAS:",
            artistas
        );


        if (artistas.length === 0) {

            contenedor.innerHTML =
                "<p>Todavía no hay artistas registrados.</p>";

            return;
        }


        contenedor.innerHTML = "";


        artistas.forEach(artista => {


            /*
             * TARJETA DEL ARTISTA
             */

            const tarjeta =
                document.createElement("div");


            tarjeta.className =
                "artist-card";


            /*
             * HACEMOS QUE LA TARJETA SEA CLICKEABLE
             */

            tarjeta.style.cursor =
                "pointer";


            /*
             * AVATAR
             */

            const avatar =
                artista.avatar_url
                    ? artista.avatar_url
                    : "https://via.placeholder.com/160";


            tarjeta.innerHTML = `

                <img
                    src="${avatar}"
                    alt="${artista.nombre || "Artista"}"
                >

                <div class="artist-card-info">

                    <h2>
                        ${artista.nombre || "Artista sin nombre"}
                    </h2>

                    <p>
                        Artista independiente
                    </p>

                </div>

            `;


            /*
             * AL HACER CLIC
             * ENTRAMOS A LA PÁGINA DEL ARTISTA
             */

            tarjeta.addEventListener(
                "click",
                function () {

                    window.location.href =
                        "./artista.html?id=" +
                        artista.id;

                }
            );


            contenedor.appendChild(
                tarjeta
            );

        });


    } catch (error) {

        console.error(
            "ERROR:",
            error
        );


        contenedor.innerHTML =
            "<p>Ocurrió un error al cargar los artistas.</p>";

    }

}


cargarArtistas();