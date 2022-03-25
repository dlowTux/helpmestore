let cartform = document.getElementById("cart");
var txtcount = document.getElementById("txtcount");
var load = document.getElementById("load");
var toastLiveExample = document.getElementById("liveToast");

cartform.addEventListener("submit", (e) => {
    e.preventDefault();
    AddCart(GetDatCarForm());
});
const GetDatCarForm = () => {
    ShowLoaderIndicator();
    const data = JSON.stringify({
        color: color,
        amount: txtcount.value,
        photo: Photo[color],
    });
    return data;
};

const AddCart = (data) => {
    fetch("/addcart", {
        method: "POST",
        body: data,
        headers: {
            "Content-Type": "application/json",
        },
    })
        .then((response) => response.json())
        .then((response) => {
            console.log(response);
            cartform.reset();
            ShowMessage();
        });
};

const ShowLoaderIndicator = () => {
    load.innerHTML = ` 
     <div class="spinner-border" role="status">
  <span class="visually-hidden">Loading...</span>
</div>
    `;
};
const ShowMessage = () => {
    location.reload();
};
const UpdateCart = (number) => {
    fetch("/addmore/" + number, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    })
        .then((response) => response.json())
        .then((response) => {
            UpdateCartContainer(response)
        });
};
const LessCart = (number) => {
    fetch("/lessproduct/" + number, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    })
        .then((response) => response.json())
        .then((response) => {
            UpdateCartContainer(response)
        });
};
const UpdateCartContainer = (response) => {
    //Redo the car var
    let number = 0;
    let cart_items = document.getElementById("items_cart");
    cart_items.innerHTML = "";
    price = 0
    response["response"].forEach((item) => {

        cart_items.innerHTML += DrwaItem(item, number);
        price += parseInt(item["amount"]) * 500
        number++;
    });
    if (number == 0) {
        //message to no product in the shopping car
        cart_items.innerHTML = "<h3>Añade productos a tu carrito para poder visualizarlos</h3>"
    } else {
        let buttom = document.getElementById("buttom")

        buttom.innerHTML = `
        <div>
                    <button class="btn size">
                        <h5 class="">Total de ${price}</h5>
                    </button>
                </div>
                <a class="btn btn-primary size" href="/checkout">
                    <h5>Continuar</h5>
                </a>
        `

        const updateb = document.querySelectorAll(".update");
        updateb.forEach((element) => element.addEventListener("click", data));
        const deletebuttons = document.querySelectorAll(".delete");
        deletebuttons.forEach((element) => element.addEventListener("click", datadelete));

    }

}
const updatebuttons = document.querySelectorAll(".update");
updatebuttons.forEach((element) => element.addEventListener("click", data));

const deletebuttons = document.querySelectorAll(".delete");
deletebuttons.forEach((element) => element.addEventListener("click", datadelete));

function datadelete() {
    position_array = this.dataset.id;
    LessCart(position_array);

}

function data() {
    position_array = this.dataset.id;
    UpdateCart(position_array);
}

const Photo = {
    Dark: "../static/assets/img/portfolio/dark.jpg",
    Ruby: "../static/assets/img/portfolio/red.jpg",
    Marine: "../static/assets/img/portfolio/marine.jpg",
    Grape: "../static/assets/img/portfolio/purple.webp",
    Nature: "../static/assets/img/portfolio/verde.jpg",
    Radiance: "../static/assets/img/portfolio/amarillo.jpeg",
};

const DrwaItem = (pro, number) => {
    let cards = `
    <div class="card">
                <div class="card-body">
                    <div class="row">
                        <div class="col">
                            <img src="${pro["photo"]}" width="100%" height="100%" />
                        </div>
                        <div class="col">
                            SmartBand ${pro["color"]}
                            <input type="number" class="mt-1 form-control" value="${pro["amount"]}"
                                readonly />
                            <button class="btn btn-success mt-2 update" data-id="${number}">
                                <small><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                        fill="currentColor" class="bi bi-plus-square-fill" viewBox="0 0 16 16">
                                        <path
                                            d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm6.5 4.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3a.5.5 0 0 1 1 0z" />
                                    </svg></small>

                            </button>
                            <button class="btn btn-danger mt-2 delete" data-id="${number}">
                                <small>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                        class="bi bi-file-minus-fill" viewBox="0 0 16 16">
                                        <path
                                            d="M12 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zM6 7.5h4a.5.5 0 0 1 0 1H6a.5.5 0 0 1 0-1z" />
                                    </svg>
                                </small>

                            </button>
                         <p class="mt-2 h5">$${pro["amount"] * 500}</p>

                        </div>
                    </div>
                </div>
                <div class="card-footer text-muted">
                    <a class="link-danger" href='/removeitem/${number}'>Eliminar</a>
                </div>
            </div>
    `;
    return cards;
};

