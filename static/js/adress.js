
let div;
window.addEventListener('DOMContentLoaded', (event) => {


    div = document.getElementById("direcciones");

    LoadAdress();
});
let direction;
const LoadAdress = () => {
    fetch('/getAdresses')
        .then((data) => data.json())
        .then((data) => {
            direction = data["response"]
            DrawAdress(data["response"])
        })
}
const DrawAdress = (data) => {
    div.innerHTML = "";
    var i = 0;
    data.forEach((adress) => {
        div.innerHTML += `
<div class="form-check">
  <input class="form-check-input" type="radio" name="txtdirecciones" id="txtdirecciones" required value="${i}">
  <label class="form-check-label" for="txtdirecciones">
    ${adress["calle"]} #${adress["num_exte"]} ${adress["num_inter"]} ${adress["colonia"]} ${adress["cp"]}, ${adress["municipio"]} ${adress["estado"]}
  </label>
</div>
`
        i++;
    });
    div.innerHTML += `
    <div class="form-check">
  <input class="form-check-input" type="radio" name="txtdirecciones" id="txtdirecciones" value="${i++}">
  <label class="form-check-label" for="txtdirecciones">
    Agregar una nueva dirección
  </label>
</div>

    `

    let form = document.getElementById("data-ad");
    let inputs = document.querySelectorAll("#txtdirecciones");
    inputs.forEach((radio) => {
        radio.addEventListener("click", () => {
            form.innerHTML = ""
        })
    })
    inputs[inputs.length - 1].addEventListener("click", () => {
        //Despliega un formulario para registrar la nueva dirección

        form.innerHTML = DrawForm()
    })
}


const DrawForm = () => {
    return `
  <div class="col-12">
                            <label for="username" class="form-label"
                                >Calle</label
                            >
                            <div class="input-group has-validation">
                                <input
                                    type="text"
                                    class="form-control"
                                    id="txt_calle"
                                    required
                                />
                                <div class="invalid-feedback">
                                    Calle es requirido
                                </div>
                            </div>
                        </div>
                        <div class="row">
                        <div class="col-sm-6">
                            <label for="username" class="form-label"
                                >Número exterior</label
                            >
                            <div class="input-group has-validation">
                                <input
                                    type="text"
                                    class="form-control"
                                    id="txtnumexterior"
                                    required
                                />
                                <div class="invalid-feedback">
                                    Dato requirido
                                </div>
                            </div>
                        </div>

                        <div class="col-sm-6">
                            <label for="email" class="form-label"
                                >Número interior
                                <span class="text-muted"
                                    >(Opcional)</span
                                ></label
                            >
                            <input
                                type="text"
                                class="form-control"
                                id="txtnuminterior"
                            />
                        </div>
</div>
<div class="row">
                        <div class="col-sm-6">
                            <label for="email" class="form-label"
                                >Estado
                            </label>
                            <input
                                type="text"
                                class="form-control"
                                id="txtestado"
                                required
                            />
                        </div>
                        <div class="col-sm-6">
                            <label for="email" class="form-label"
                                >Municipio
                            </label>
                            <input
                                type="text"
                                class="form-control"
                                id="txtminicipio"
                                required
                            />
                        </div>
                        </div>
                        <div class="row">
                        <div class="col-sm-6">
                            <label for="email" class="form-label"
                                >Colonia
                            </label>
                            <input
                                type="text"
                                class="form-control"
                                id="txtcolonia"
                                required
                            />
                        </div>

                        <div class="col-sm-6">
                            <label class="form-label">Código postal </label>
                            <input
                                type="text"
                                class="form-control"
                                id="txtpostal"
                                required
                            />
                        </div>
                        </div>
                        <div class="col-12">
                            <label for="email" class="form-label"
                                >Referencia
                            </label>
                            <div class="form-floating">
                                <textarea
                                    class="form-control"
                                    placeholder="Da una descripción del lugar"
                                    required
                                    id="txtreferencia"
                                ></textarea>
                            </div>
                        </div>
                       `


}
