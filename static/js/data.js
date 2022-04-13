let inputs;
let user_info;
const DrawData = (data_user) => {
    let inputs = {
        txtnombre: document.getElementById("txtnombre"),
        txtapellido: document.getElementById("txtapellido"),
        txtelefono: document.getElementById("txtnumber"),
    };
    inputs["txtnombre"].value = data_user["name"];
    inputs["txtapellido"].value = data_user["lastname"];
    inputs["txtelefono"].value = data_user["phone"];
    return inputs;
};
const DrawDirecction = (data) => {
    var direcciones = document.getElementById("direc");

    data["adress"].forEach((adress) => {
        direcciones.innerHTML = `
        <div class="col">
        <div class="card" style="width: 18rem;">
  <div class="card-body">
    <h5 class="card-title">Dirección</h5>
    <p class="card-text">
    ${adress["calle"]} #${adress["num_inter"]} ${adress["num_exte"]} c.p. ${adress["cp"]}
    ${adress["colonia"]} ${adress["municipio"]} ${adress["estado"]} ${adress["referencia"]}
    </p>
    <a href="#" class="card-link">Editar</a>
    <a href="#" class="card-link">Borrar</a>
  </div>
</div>
</div>
        `;
    });
};
const GetDataUser = () => {
    fetch("/getdatauser")
        .then((data) => data.json())
        .then((data) => {
            user_info = data["response"];
            console.log(user_info);
            inputs = DrawData(data["response"]);
            DrawDirecction(data["response"]);
        });
};
const SetLoading = (status) => {
    let load = document.getElementById("loadspiner");
    if (status) {
        load.innerHTML += `<div class="spinner-border" role="status">
  <span class="visually-hidden">Loading...</span>
</div>`;
    } else {
        load.innerHTML = "";
    }
};
const ChangeData = () => {
    let form = document.getElementById("form-data");
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        SetLoading(true);
        user_info["name"] = inputs["txtnombre"].value;
        user_info["lastname"] = inputs["txtapellido"].value;
        user_info["phone"] = inputs["txtelefono"].value;

        fetch("/updatedata", {
            method: "POST",
            body: JSON.stringify(user_info),
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((data) => data.json())
            .then((data) => {
                inputs = DrawData(data["response"]);
                SetLoading(false);
            });
    });
};
window.addEventListener("DOMContentLoaded", (event) => {
    GetDataUser();
    ChangeData();
});
