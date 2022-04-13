let inputs;
let user_info;
let updatenumber;
let updatedateuser = document.getElementById("updatedateuser")


var updatedata = new bootstrap.Modal(document.getElementById('updatedata'))

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
    direcciones.innerHTML = ""
    var i = 0;
    data["adress"].forEach((adress) => {
        direcciones.innerHTML += `
        <div class="col">
        <div class="card" style="width: 18rem;">
  <div class="card-body">
    <h5 class="card-title">Dirección</h5>
    <p class="card-text">
    ${adress["calle"]} #${adress["num_inter"]} ${adress["num_exte"]} c.p. ${adress["cp"]}
    ${adress["colonia"]} ${adress["municipio"]} ${adress["estado"]} ${adress["referencia"]}
    </p>
    <button onclick="deleted(${i})" class="btn btn-danger" >Borrar</button>
    <button onclick="updatedirection(${i})" class="btn btn-primary" >Editar</button>
  </div>
</div>
</div>
        `;
        i++;
    });
};
function deleted(number) {
    user_info["adress"].splice(number, 1)
    SetLoading(true);
    fetch("/updatedata", {
        method: "POST",
        body: JSON.stringify(user_info),
        headers: {
            "Content-Type": "application/json",
        },
    })
        .then((data) => data.json())
        .then((data) => {
            inputs = DrawDirecction(data["response"]);
            SetLoading(false);
        });
}
function updatedirection(number) {


    updatenumber = number;
    document.getElementById("txt_calle").value = user_info["adress"][number]["calle"]
    document.getElementById("txtnumexterior").value = user_info["adress"][number]["num_exte"]
    document.getElementById("txtnuminterior").value = user_info["adress"][number]["num_inter"]
    document.getElementById("txtestado").value = user_info["adress"][number]["estado"]
    document.getElementById("txtminicipio").value = user_info["adress"][number]["municipio"]
    document.getElementById("txtcolonia").value = user_info["adress"][number]["colonia"]
    document.getElementById("txtpostal").value = user_info["adress"][number]["cp"]
    document.getElementById("txtreferencia").value = user_info["adress"][number]["referencia"]
    updatedateuser.addEventListener("submit", (e) => {
        e.preventDefault();

        let loadupdate = document.getElementById("loadupdate");
        console.log(loadupdate)
        SetLoadingUpdate(loadupdate, true);
        user_info["adress"][updatenumber] = LeerFormularioDirecciones()
        fetch("/updatedata", {
            method: "POST",
            body: JSON.stringify(user_info),
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((data) => data.json())
            .then((data) => {
                inputs = DrawDirecction(data["response"]);
                SetLoadingUpdate(loadupdate, false);
            });

    })
    updatedata.show();
}
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
const SetLoadingUpdate = (loadupdate, status) => {
    if (status) {
        loadupdate.innerHTML += `<div class="spinner-border" role="status">
  <span class="visually-hidden">Loading...</span>
</div>`;
    } else {
        loadupdate.innerHTML = "";
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

const LeerFormularioDirecciones = () => {
    return {
        "calle": document.getElementById("txt_calle").value,
        "num_exte": document.getElementById("txtnumexterior").value,
        "num_inter": document.getElementById("txtnuminterior").value,
        "estado": document.getElementById("txtestado").value,
        "municipio": document.getElementById("txtminicipio").value,
        "colonia": document.getElementById("txtcolonia").value,
        "cp": document.getElementById("txtpostal").value,
        "referencia": document.getElementById("txtreferencia").value
    }
}

window.addEventListener("DOMContentLoaded", (event) => {
    GetDataUser();
    ChangeData();
});
