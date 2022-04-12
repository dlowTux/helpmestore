var stripe;
let inputs;
fetch('/keys')
    .then((response) => response.json())
    .then((data) => {
        stripe = Stripe(data["key"])
        console.log("Success", data)
    })
    .catch((error) => {
    });

// The items the customer wants to buy

let elements;

initialize();
checkStatus();
window.addEventListener('DOMContentLoaded', (event) => {
    formulario = document.getElementById("pago");
    formulario.addEventListener("submit", (e) => {

        e.preventDefault();
        handleSubmit()
    })
});
/*

    */
//formulario.addEventListener("submit", handleSubmit);

// Fetches a payment intent and captures the client secret
async function initialize() {
    const response = await fetch("/create-payment-intent", {
        method: "POST",
    }).then((response) => response.json())
        .then((data) => {
            console.log(data)
            if (data["sin_tarjeta"] == 1) {
                console.log("Tarjetas")
                var frame = document.getElementById("payment-element")
                frame.innerHTML = ""
                PayWithCards(data)
            } else {

                PayWithOutCard(data)
            }
        })


}
const PayWithCards = (data) => {
    var contenedor = document.getElementById("cards");
    data["cards"].map((card) => {
        contenedor.innerHTML += `
        <div class="form-check">
        <input class="form-check-input" type="radio" name="pago_tarjeta" id="pago_tarjeta" required>
        <label class="form-check-label" for="pago_tarjeta">
   <span class="fw-bold"> ${card["card"]["brand"]} </span>      **** ${card["card"]["last4"]}   </label>
</div>
   `
    })
    contenedor.innerHTML += `
        <div class="form-check">
        <input class="form-check-input" type="radio" name="pago_tarjeta" id="pago_tarjeta" required>
        <label class="form-check-label" for="pago_tarjeta"> Agregar una nueva tarjeta</label>
</div>
   `

    InputPay();

}

const InputPay = () => {
    inputs = document.querySelectorAll("#pago_tarjeta");
    var frame = document.getElementById("payment-element")
    inputs.forEach((radio) => {
        if (radio != inputs[inputs.length - 1]) {
            radio.addEventListener('click', () => {
                frame.innerHTML = ""
            })
        }
    })
    inputs[inputs.length - 1].addEventListener("click", () => {
        setLoading(true)
        fetch('/newcard', {
            method: "POST"
        }).then((data) => data.json()).then((data) => {
            PayWithOutCard(data)
            setLoading(false)
        }
        )
    })

}
const PayWithOutCard = (data) => {
    const clientSecret = data["clientSecret"];
    const appearance = {
        theme: 'stripe',
    };
    elements = stripe.elements({appearance, clientSecret});

    const paymentElement = elements.create("payment");
    paymentElement.mount("#payment-element");
}
async function handleSubmit() {

    setLoading(true);

    const {error} = await stripe.confirmPayment({
        elements,
        confirmParams: {
            // Make sure to change this to your payment completion page
            return_url: "https://172.17.0.2:80/paymentcomplete",
        },
    });

    // This point will only be reached if there is an immediate error when
    // confirming the payment. Otherwise, your customer will be redirected to
    // your `return_url`. For some payment methods like iDEAL, your customer will
    // be redirected to an intermediate site first to authorize the payment, then
    // redirected to the `return_url`.
    console.log(error)
    if (error.type === "card_error" || error.type === "validation_error") {
        showMessage(error.message);
    } else {
        showMessage("An unexpected error occured.");
    }

    setLoading(false);
}

// Fetches the payment intent status after payment submission
async function checkStatus() {
    const clientSecret = new URLSearchParams(window.location.search).get(
        "payment_intent_client_secret"
    );

    if (!clientSecret) {
        return;
    }

    const {paymentIntent} = await stripe.retrievePaymentIntent(clientSecret);

    switch (paymentIntent.status) {
        case "succeeded":
            showMessage("Payment succeeded!");
            break;
        case "processing":
            showMessage("Your payment is processing.");
            break;
        case "requires_payment_method":
            showMessage("Your payment was not successful, please try again.");
            break;
        default:
            showMessage("Something went wrong.");
            break;
    }
}

// ------- UI helpers -------

function showMessage(messageText) {
    const messageContainer = document.querySelector("#payment-message");

    messageContainer.classList.remove("hidden");
    messageContainer.textContent = messageText;

    setTimeout(function () {
        messageContainer.classList.add("hidden");
        messageText.textContent = "";
    }, 4000);
}

// Show a spinner on payment submission
function setLoading(isLoading) {
    if (isLoading) {
        spiner = document.getElementById("load");
        spiner.innerHTML = `<div class= "spinner-border" role = "status" >
    <span class="visually-hidden">Loading...</span>
</div > `;

    }
    else {
        spiner.innerHTML = ""
    }

}
