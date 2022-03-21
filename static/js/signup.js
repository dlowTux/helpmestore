let form = document.getElementById("form");
//Inputs
let txtname = document.getElementById("txtnombre");
let txtlastname = document.getElementById("txtapellido");
let txtemail = document.getElementById("txtemail");
let txtpassword = document.getElementById("txtpass");
// Divs
let error = document.getElementById("errors");

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
            if (response["response"] === "Error el correo ya esta en uso") {
                console.log("Error");

                ShowMessageError();
            } else {
                HideLoader();
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
