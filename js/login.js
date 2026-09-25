var SUPABASE_URL = "https://zyyvjbtsldxehaulgmgt.supabase.co";
var SUPABASE_KEY = "sb_publishable_KtoC3FL-i8Dr9eiVdcfE-g_3UZQyHBI";

var emailInput = document.getElementById("email");
var passwordInput = document.getElementById("password");
var loginButton = document.getElementById("loginButton");
var registerButton = document.getElementById("registerButton");
var mensaje = document.getElementById("mensaje");


registerButton.addEventListener("click", function() {

    var email = emailInput.value;
    var password = passwordInput.value;

    if (!email || !password) {

        mensaje.textContent =
            "Completa el correo y la contrasena.";

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
                "Cuenta creada correctamente. Usuario ID: " +
                resultado.id;

            return;
        }

        if (resultado.user && resultado.user.id) {

            mensaje.textContent =
                "Cuenta creada correctamente. Usuario ID: " +
                resultado.user.id;

            return;
        }

        mensaje.textContent =
            "REGISTRO OK. Revisá la consola.";

    })

    .catch(function(error) {

        console.error("ERROR REGISTRO:", error);

        mensaje.textContent =
            "ERROR: " + error.message;

    });

});


loginButton.addEventListener("click", function() {

    var email = emailInput.value;
    var password = passwordInput.value;

    if (!email || !password) {

        mensaje.textContent =
            "Completa el correo y la contrasena.";

        return;
    }

    mensaje.textContent =
        "Iniciando sesion...";

    fetch(
        SUPABASE_URL + "/auth/v1/token?grant_type=password",
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

        console.log("LOGIN:", resultado);

        if (resultado.error) {

            mensaje.textContent =
                resultado.error_description ||
                resultado.error.message ||
                resultado.msg ||
                "Correo o contrasena incorrectos.";

            return;
        }

        if (!resultado.access_token) {

            console.log(
                "RESPUESTA COMPLETA LOGIN:",
                JSON.stringify(resultado)
            );

            mensaje.textContent =
                "Supabase no devolvio el token de acceso.";

            return;
        }

        var partes =
            resultado.access_token.split(".");

        if (partes.length !== 3) {

            mensaje.textContent =
                "El token de Supabase no tiene un formato valido.";

            return;
        }

        try {

            var datosUsuario =
                JSON.parse(
                    atob(
                        partes[1]
                            .replace(/-/g, "+")
                            .replace(/_/g, "/")
                    )
                );

            var usuarioId = datosUsuario.sub;

            if (!usuarioId) {

                mensaje.textContent =
                    "No se pudo obtener el ID del usuario.";

                return;
            }

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
                "Sesion iniciada correctamente.";

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
                "Error procesando el token.";

        }

    })

    .catch(function(error) {

        console.error(
            "ERROR LOGIN:",
            error
        );

        mensaje.textContent =
            "ERROR: " + error.message;

    });

});