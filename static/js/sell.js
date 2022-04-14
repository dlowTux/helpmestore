//`
const DrawCarrito = (carrito) => {
    let string = ""
    carrito.forEach((car) => {
        string += `
<div class="card mb-3" >
  <div class="row g-0">
    <div class="col-md-2">
      <img src="${car["photo"]}" class="img-fluid rounded-start" width="128px" height="128px">
    </div>
    <div class="col-md-10">
      <div class="card-body">
        <h5 class="card-title">SmartBand ${car["color"]}</h5>
        <p class="card-text"> Cantidad: ${car["amount"]}<br>
        
        </p>
      </div>
    </div>
  </div>
</div>
        `



    })

    return string
}
const DrawSells = (data) => {
    let dsell = document.getElementById("containersell")
    dsell.innerHTML = ""
    let i = 0;
    data.forEach((sell) => {

        carrito = DrawCarrito(sell["data"]["carrito"])
        let estado = ""
        if (sell["data"]["estado"] == undefined) {
            estado = "En proceso"
        } else {
            estado = sell["data"]["estado"]
        }
        let boton = ""
        if (estado == "En proceso") {
            boton += ` <a href="/cancelarcompra/${i}" class="btn btn-primary">Cancelar Compra</a>`

        }
        dsell.innerHTML += `
        <div class="card mt-2">
  <h5 class="card-header">${sell["data"]["date"]}</h5>
  <div class="card-body">
    <h5 class="card-title">${estado}</h5>`
            +
            carrito
            +
            `

    <p class="card-text"> Dirección: ${sell["data"]["adress"]["calle"]} #${sell["data"]["adress"]["num_exte"]} ${sell["data"]["adress"]["num_inter"]} ${sell["data"]["adress"]["colonia"]} ${sell["data"]["adress"]["cp"]}, ${sell["data"]["adress"]["municipio"]} ${sell["data"]["adress"]["estado"]}
</p>

     </div>
</div>
        `
        i++;

    })
}
window.addEventListener('DOMContentLoaded', (event) => {
    //Aqui es donde debemos de cargar todas las ventas
    fetch('/getsells')
        .then((data) => data.json())
        .then((data) => {
            DrawSells(data["response"])
        })

});
