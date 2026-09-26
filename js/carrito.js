const carritoContenedor =
document.getElementById("carrito");

const totalElemento =
document.getElementById("total");

let carrito =
JSON.parse(localStorage.getItem("carrito")) || [];

function mostrarCarrito() {


carritoContenedor.innerHTML = "";


if (carrito.length === 0) {

    carritoContenedor.innerHTML = `
        <div class="carrito-vacio">

            <h2>
                Tu carrito está vacío
            </h2>

            <p>
                Todavía no agregaste ningún álbum.
            </p>

            <a href="./albumes.html">
                Ver álbumes
            </a>

        </div>
    `;

    totalElemento.textContent = "$0";

    return;
}


let total = 0;


carrito.forEach((album, indice) => {

    total += Number(album.precio);


    const item =
        document.createElement("div");

    item.className =
        "album-card";


    item.innerHTML = `

        <div class="album-info">

            <img
                src="${album.portada_url || "https://via.placeholder.com/300"}"
                alt="${album.titulo}"
            >

            <div>

                <h3>
                    ${album.titulo}
                </h3>

                <p>
                    ${album.artista || "Artista"}
                </p>

                <div class="precio">
                    $${Number(album.precio)}
                </div>

            </div>

        </div>


        <button
            class="boton-eliminar"
            data-indice="${indice}"
            title="Eliminar"
        >
            ×
        </button>

    `;


    carritoContenedor.appendChild(item);

});


totalElemento.textContent =
    "$" + total;


const resumen =
    document.createElement("div");

resumen.className =
    "resumen-carrito";


resumen.innerHTML = `

    <h2>
        Total: $${total}
    </h2>

    <button
        id="boton-pagar"
        type="button"
    >
        Pagar
    </button>

`;


carritoContenedor.appendChild(resumen);


document
    .querySelectorAll(".boton-eliminar")
    .forEach(boton => {

        boton.addEventListener(
            "click",
            () => {

                const indice =
                    Number(
                        boton.dataset.indice
                    );


                carrito.splice(
                    indice,
                    1
                );


                localStorage.setItem(
                    "carrito",
                    JSON.stringify(carrito)
                );


                mostrarCarrito();

            }
        );

    });


const botonPagar =
    document.getElementById("boton-pagar");


if (botonPagar) {

    botonPagar.addEventListener(
        "click",
        () => {

            if (carrito.length === 0) {
                return;
            }


            window.location.href =
                "./checkout.html";

        }
    );

}


}

mostrarCarrito();
