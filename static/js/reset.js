let form_reset = document.getElementById("resetpass");
let text = document.getElementById("txtcorreoreset")

var aviso = new bootstrap.Modal(document.getElementById('aviso'))

var _reset = new bootstrap.Modal(document.getElementById('reset'))
var _loadr = document.getElementById("loadreset")

form_reset.addEventListener("submit", (e) => {
    e.preventDefault()
    _loadr.innerHTML = `
    <div class="spinner-border" role="status">
  <span class="visually-hidden">Loading...</span>
</div>
    `
    fetch('/password_reset', {
        method: "POST", body: JSON.stringify({email: text.value}),
        headers: {
            "Content-Type": "application/json",
        },
    }).then((data) => data.json())
        .then((data) => {
            form_reset.reset();
            _reset.hide()
            aviso.show();
        })
})
