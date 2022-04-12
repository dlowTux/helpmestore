//form 
var form = document.getElementById("login")
//inputs
var txtemail = document.getElementById("txtemail")
var txtpass = document.getElementById("txtpassword")
//DIV
var error = document.getElementById("errors")

form.addEventListener("submit", (e) => {
    e.preventDefault();
    SignIn(GetData());
});

const GetData = () => {
    ShowLoader();
    const data = JSON.stringify({
        email: txtemail.value,
        password: txtpass.value
    });
    return data;
};

const SignIn = (data) => {
    fetch("/signin", {
        method: "POST",
        body: data,
        headers: {
            "Content-Type": "application/json",
        },
    })
        .then((response) => response.json())
        .then((response) => {
            if (response["response"] == "0") {
                console.log("Error");

                ShowMessageError();
            } else {
                location.reload();

                //window.location.assign("/");
            }
        });
};

const ShowLoader = () => {
    error.innerHTML = ` 
     <div class="spinner-border" role="status">
  <span class="visually-hidden">Loading...</span>
</div>
    `;
};

const ShowMessageError = () => {
    error.innerHTML = `<div class="alert alert-danger" role="alert">Correo o contraseña incorrectos</div>`;
};


