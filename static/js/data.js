let inputs
let user_info
const DrawData = (data_user) => {
    let inputs = {
        "txtnombre": document.getElementById("txtnombre"),
        "txtapellido": document.getElementById("txtapellido"),
        "txtelefono": document.getElementById("txtnumber")
    }
    inputs["txtnombre"].value = data_user["name"]
    inputs["txtapellido"].value = data_user["lastname"]
    inputs["txtelefono"].value = data_user["phone"]
    return inputs
}
const GetDataUser = () => {
    fetch('/getdatauser')
        .then((data) => data.json())
        .then((data) => {
            user_info = data
            inputs = DrawData(data["response"])

        })
}
const SetLoading = (status) => {

    let load = document.getElementById("loadspiner")
    if (status) {
        load.innerHTML += `<div class="spinner-border" role="status">
  <span class="visually-hidden">Loading...</span>
</div>`

    } else {
        load.innerHTML = ""
    }
}
const ChangeData = () => {
    let form = document.getElementById("form-data")
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        SetLoading(true);
        user_info["name"] = inputs["txtnombre"].value
        user_info["lastname"] = inputs["txtapellido"].value
        user_info["phone"] = inputs["txtelefono"].value

        fetch('/updatedata', {
            method: "POST",
            body: JSON.stringify(user_info),
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((data) => data.json())
            .then((data) => {
                console.log(data)
                SetLoading(false);
            })

    })
}
window.addEventListener('DOMContentLoaded', (event) => {
    GetDataUser();
    ChangeData();
});


