var SUPABASE_URL = "https://zyyvjbtsldxehaulgmgt.supabase.co";
var SUPABASE_KEY = "sb_publishable_KtoC3FL-i8Dr9eiVdcfE-g_3UZQyHBI";

var emailInput = document.getElementById("email");
var passwordInput = document.getElementById("password");
var loginButton = document.getElementById("loginButton");
var registerButton = document.getElementById("registerButton");
var mensaje = document.getElementById("mensaje");

/* =====================================================
REGISTRO
===================================================== */

registerButton.addEventListener("click", function() {


var email = emailInput.value.trim();
var password = passwordInput.value;

if (!email || !password) {

    mensaje.textContent =
        "Completá el correo y la contraseña.";

    return;
}

mensaje.textContent =
    "Creando cuenta...";

fetch(
    SUPABASE_URL + "/auth/v1/signup",
    {
        method: "POST",

        headers: {
            "apikey": SUPABASE_KEY,
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            email: email,
            password: password
        })
    }
)

.then(function(respuesta) {

    return respuesta.json();

})

.then(function(resultado) {

    console.log("REGISTRO:", resultado);

    if (resultado.error) {

        mensaje.textContent =
            resultado.error.message ||
            "No se pudo crear la cuenta.";

        return;
    }

    if (resultado.id) {

        mensaje.textContent =
            "Cuenta creada correctamente.";

        return;
    }

    if (
        resultado.user &&
        resultado.user.id
    ) {

        mensaje.textContent =
            "Cuenta creada correctamente.";

        return;
    }

    mensaje.textContent =
        "Registro realizado correctamente.";

})

.catch(function(error) {

    console.error(
        "ERROR REGISTRO:",
        error
    );

    mensaje.textContent =
        "No se pudo conectar con el servidor.";

});


});

/* =====================================================
LOGIN
===================================================== */

loginButton.addEventListener("click", function() {


var email =
    emailInput.value.trim();

var password =
    passwordInput.value;

if (!email || !password) {

    mensaje.textContent =
        "Completá el correo y la contraseña.";

    return;
}

mensaje.textContent =
    "Iniciando sesión...";

fetch(
    SUPABASE_URL +
    "/auth/v1/token?grant_type=password",
    {
        method: "POST",

        headers: {
            "apikey": SUPABASE_KEY,
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            email: email,
            password: password
        })
    }
)

.then(function(respuesta) {

    return respuesta.json();

})

.then(function(resultado) {

    console.log(
        "LOGIN:",
        resultado
    );


    /* =============================================
       ERROR DE AUTENTICACIÓN
    ============================================= */

    if (
        resultado.error ||
        resultado.error_description ||
        resultado.msg
    ) {

        var mensajeError =
            (
                resultado.error_description ||
                resultado.error ||
                resultado.msg ||
                ""
            ).toLowerCase();


        if (
            mensajeError.includes(
                "invalid login credentials"
            ) ||
            mensajeError.includes(
                "invalid credentials"
            ) ||
            mensajeError.includes(
                "invalid"
            )
        ) {

            mensaje.textContent =
                "Correo o contraseña incorrectos.";

            return;

        }


        if (
            mensajeError.includes(
                "email"
            )
        ) {

            mensaje.textContent =
                "El correo electrónico no es válido.";

            return;

        }


        mensaje.textContent =
            "Correo o contraseña incorrectos.";

        return;
    }


    /* =============================================
       COMPROBAR TOKEN
    ============================================= */

    if (!resultado.access_token) {

        console.log(
            "RESPUESTA COMPLETA LOGIN:",
            JSON.stringify(resultado)
        );

        mensaje.textContent =
            "Correo o contraseña incorrectos.";

        return;
    }


    /* =============================================
       COMPROBAR FORMATO TOKEN
    ============================================= */

    var partes =
        resultado.access_token.split(".");

    if (
        partes.length !== 3
    ) {

        mensaje.textContent =
            "No se pudo iniciar sesión.";

        return;
    }


    /* =============================================
       OBTENER USUARIO
    ============================================= */

    try {

        var datosUsuario =
            JSON.parse(
                atob(
                    partes[1]
                        .replace(/-/g, "+")
                        .replace(/_/g, "/")
                )
            );

        var usuarioId =
            datosUsuario.sub;


        if (!usuarioId) {

            mensaje.textContent =
                "No se pudo iniciar sesión.";

            return;
        }


        /* =========================================
           GUARDAR SESIÓN
        ========================================= */

        localStorage.setItem(
            "access_token",
            resultado.access_token
        );

        localStorage.setItem(
            "refresh_token",
            resultado.refresh_token || ""
        );

        localStorage.setItem(
            "usuario_id",
            usuarioId
        );


        mensaje.textContent =
            "Sesión iniciada correctamente.";


        console.log(
            "USUARIO ID:",
            usuarioId
        );


        setTimeout(function() {

            window.location.href =
                "index.html";

        }, 1000);

    }

    catch (error) {

        console.error(
            "ERROR PROCESANDO TOKEN:",
            error
        );

        mensaje.textContent =
            "No se pudo iniciar sesión.";

    }

})

.catch(function(error) {

    console.error(
        "ERROR LOGIN:",
        error
    );

    mensaje.textContent =
        "No se pudo conectar con el servidor.";

});


});
