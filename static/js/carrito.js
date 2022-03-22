var cart = document.getElementById("cart");
var txtcount = document.getElementById("txtcount");
var load = document.getElementById("load");
var toastLiveExample = document.getElementById("liveToast");

cart.addEventListener("submit", (e) => {
    e.preventDefault();
    AddCart(GetData());
});
const GetData = () => {
    ShowLoader();
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
            cart.reset();
            ShowMessage()
        });
};

const ShowLoader = () => {
    load.innerHTML = ` 
     <div class="spinner-border" role="status">
  <span class="visually-hidden">Loading...</span>
</div>
    `;
};
const ShowMessage = () => {

    location.reload();

};

const Photo = {
    Dark: "../static/assets/img/portfolio/dark.jpg",
    Ruby: "../static/assets/img/portfolio/red.jpg",
    Marine: "../static/assets/img/portfolio/marine.jpg",
    Grape: "../static/assets/img/portfolio/purple.webp",
    Nature: "../static/assets/img/portfolio/verde.jpg",
    Radiance: "../static/assets/img/portfolio/amarillo.jpeg",
};
