let form = document.getElementById("form");
//Inputs
let txtname = document.getElementById("txtnombre");
let txtlastname = document.getElementById("txtapellido");
let txtemail = document.getElementById("txtemail");
let txtpassword = document.getElementById("txtpass");
// Divs
let error = document.getElementById("errors");
var toastLiveExample = document.getElementById('liveToast')

form.addEventListener("submit", (e) => {
    e.preventDefault();
    //Get data from form

    signup(GetData());
});

const GetData = () => {
    ShowLoader();
    const data = JSON.stringify({
        email: txtemail.value,
        password: txtpassword.value,
        name: txtname.value,
        lastname: txtlastname.value,
    });
    return data;
};

const signup = (data) => {
    fetch("/signup", {
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
                showToast();
                HideLoader();
                showButton();
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
const HideLoader = () => {
    error.innerHTML = ` `;
};
const ShowMessageError = () => {
    error.innerHTML = `<div class="alert alert-danger" role="alert">Error el correo ya esta registrado</div>`;
};

const showToast = () => {
    var toast = new bootstrap.Toast(toastLiveExample)
    toast.show()
}
const showButton = () => {
    form.innerHTML = `
    <div class="card">
  <h5 class="card-header">Hola, te damos bienvenida</h5>
  <div class="card-body">
    <h5 class="card-title">Ahora podrás comprar todos nuestros productos</h5>
    <p class="card-text">Pulsa en el siguiente botón para poder navegar en nuestra tienda en linea y descubir todo lo que tenemos para ofrecerte</p>
    <a href="/" class="btn btn-warning">Continuar</a>
  </div>
</div>
    `
}
