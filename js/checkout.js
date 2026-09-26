const URL_SUPABASE =
"https://zyyvjbtsldxehaulgmgt.supabase.co";

const KEY_SUPABASE =
"sb_publishable_KtoC3FL-i8Dr9eiVdcfE-g_3UZQyHBI";

const checkout =
document.getElementById("checkout");

const carrito =
JSON.parse(localStorage.getItem("carrito")) || [];

const token =
localStorage.getItem("access_token");

if (!token) {


checkout.innerHTML = `
    <h2>Iniciá sesión</h2>

    <p>
        Tenés que iniciar sesión para continuar con la compra.
    </p>

    <a href="./login.html">
        Iniciar sesión
    </a>
`;


}

else if (carrito.length === 0) {


checkout.innerHTML = `
    <h2>Carrito vacío</h2>

    <p>
        No hay productos para comprar.
    </p>

    <a href="./albumes.html">
        Ver álbumes
    </a>
`;


}

else {


let total = 0;

carrito.forEach(album => {

    total += Number(album.precio);

});


const album = carrito[0];


checkout.innerHTML = `

    <h1>Checkout</h1>

    <div class="album-card">

        <img
            src="${album.portada_url || "https://via.placeholder.com/300"}"
            alt="${album.titulo}"
        >

        <h2>
            ${album.titulo}
        </h2>

        <p>
            Artista: ${album.artista || "Artista"}
        </p>

        <p class="precio">
            $${total}
        </p>

    </div>


    <h2>
        Datos del comprador
    </h2>


    <input
        type="text"
        id="nombre"
        placeholder="Nombre completo"
    >


    <input
        type="email"
        id="email"
        placeholder="Correo electrónico"
    >


    <button id="boton-pagar">
        Continuar al pago
    </button>

`;


const boton =
    document.getElementById("boton-pagar");


boton.addEventListener("click", async () => {

    const nombre =
        document
            .getElementById("nombre")
            .value
            .trim();


    const email =
        document
            .getElementById("email")
            .value
            .trim();


    if (!nombre) {

        alert("Ingresá tu nombre.");

        return;

    }


    if (!email) {

        alert("Ingresá tu correo electrónico.");

        return;

    }


    if (!email.includes("@")) {

        alert("Ingresá un correo electrónico válido.");

        return;

    }


    if (carrito.length !== 1) {

        alert(
            "Por ahora solo se puede comprar un álbum por vez."
        );

        return;

    }


    boton.disabled = true;

    boton.textContent =
        "Creando pago...";


    try {

        console.log(
            "NOMBRE ENVIADO:",
            nombre
        );


        console.log(
            "EMAIL ENVIADO:",
            email
        );


        console.log(
            "TOKEN EXISTE:",
            !!token
        );


        const respuesta =
            await fetch(
                `${URL_SUPABASE}/functions/v1/crear-pago`,
                {

                    method: "POST",

                    headers: {

                        "Authorization":
                            `Bearer ${token}`,

                        "apikey":
                            KEY_SUPABASE,

                        "Content-Type":
                            "application/json"

                    },

                    body:
                        JSON.stringify({

                            titulo:
                                album.titulo,

                            precio:
                                Number(album.precio),

                            nombre:
                                nombre,

                            email:
                                email,

                            album_id:
                                album.id

                        })

                }
            );


        const texto =
            await respuesta.text();


        console.log(
            "RESPUESTA CREAR-PAGO:",
            respuesta.status,
            texto
        );


        let datos = {};


        try {

            datos =
                JSON.parse(texto);

        }

        catch {

            datos = {};

        }


        if (!respuesta.ok) {

            throw new Error(
                datos.message ||
                datos.error ||
                "No se pudo crear el pago."
            );

        }


        if (!datos.checkout_url) {

            throw new Error(
                "Mercado Pago no devolvió una URL de pago."
            );

        }


        window.location.href =
            datos.checkout_url;


    }

    catch (error) {

        console.error(
            "ERROR CREANDO PAGO:",
            error
        );


        alert(
            error.message ||
            "No se pudo crear el pago."
        );


        boton.disabled = false;

        boton.textContent =
            "Continuar al pago";

    }

});


}
