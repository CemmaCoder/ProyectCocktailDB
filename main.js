
const obtenerCategoria= async() => {
    const url=`https://www.thecocktaildb.com/api/json/v1/1/list.php?c=list`;
    const resp = await axios.get(url);
    console.log(resp);

    let selectCategorias = document.querySelector("#categoria");
    let selectHTML = `<option value="">- Seleccionar una Categoria -</option>`;

    resp.data.drinks.map(drink=> {
        selectHTML+= `<option value="${drink.strCategory}">${drink.strCategory}</option>`;
    });

    selectCategorias.innerHTML=selectHTML;
};

// ----------------------------------------------------------------

const obtenerRecetas = async () => {
    let ingrediente = document.querySelector("#nombre").value;
    let categoria = document.querySelector("#categoria").value;

    if(ingrediente.trim()==="" || categoria.trim()===""){
        mostrarError("#msj-error", "FALTAN SELECCIONAR CAMPOS");
        return;
    }

    const url=`https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=${ingrediente}&c=${categoria}`;
    const resp = await axios.get(url);

    let divListadoRecetas = document.querySelector("#divListadoRecetas");

    let listadoHTML= `<div class="row mt-5">`;
    resp.data.drinks.map(drink =>{
        listadoHTML += `
        <div class="col-md-3 mb-3"> 
            <div class="card">
                <h4 class="card-header" "text-center">${drink.strDrink}</h4>
                <img class="card-img-top" src="${drink.strDrinkThumb}" alt="${drink.strDrink}" />
                <div class="card-body">
                    <button type="button" class="btn btn-secondary" data-bs-toggle="modal" data-bs-target="#verModal" onclick="verReceta(${drink.idDrink})">Ver Receta</button>
                </div>    
            </div>               
        </div>`;
    });
    listadoHTML += `</div>`;
    divListadoRecetas.innerHTML = listadoHTML;

};

// ---------------------------------------------------------------- 

const verReceta = async (idReceta) => {
    let tituloReceta = document.querySelector("#tituloReceta");
    let instrucciones = document.querySelector("#intruccionesReceta");
    let ingredientes = document.querySelector("#ingredientesReceta");
    let imagen = document.querySelector("#imagenReceta");

    if(!idReceta) return;

    const url=`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${idReceta}`; 
    
    const resp = await axios.get(url);
    console.log(resp);

    let info = resp.data.drinks[0];
    tituloReceta.innerHTML = info.strDrink;
    instrucciones.innerHTML = info.strInstructions;
    imagen.src = info.strDrinkThumb;
    ingredientes.innerHTML = listarIngredientes(info);

    // cuando se esconde el modal se limpia el contenido
    const recipeModal = document.getElementById('verModal')
    recipeModal.addEventListener('hide.bs.modal', function () {
        tituloReceta.innerHTML = "" 
        instrucciones.innerHTML = ""
        ingredientes.innerHTML = ""
        imagen.src = ""
    })
};

// ----------------------------------------------------------------

const listarIngredientes = (info) => {
    let listadoIngredientesHTML = ``;

    for(let i=1; i<=15; i++){
        if(info[`strIngredient${i}`]){
            listadoIngredientesHTML += `<li>${info[`strIngredient${i}`]} - ${info[`strMeasure${i}`]} </li>`;
        };
    };
    return listadoIngredientesHTML;
};

// ----------------------------------------------------------------

const borrarRecetas = () => {
    Swal.fire({
    text: "Desea limpiar la busqueda?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Si",
    cancelButtonText: "No",
    }).then((result) => {
    if (result.isConfirmed) {
        document.querySelector("#nombre").value = "";
        document.querySelector("#categoria").value = "";
        document.querySelector("#divListadoRecetas").innerHTML = "";
        Swal.fire(
        "Su busqueda se ha limpiado",
        "Presione para continuar",
        "success"
            );
        }
    });
};

// ----------------------------------------------------------------

const mostrarError = (elemento, mensaje) => {
    Toastify({
    text: mensaje,
    gravity: "top", // `top` or `bottom`
    duration: 3000,
    style: {
        "background-color": "#dc3545",
        "background-image":
        "linear-gradient(180deg, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0))",
    },
    close: true,
    }).showToast();
    // divError = document.querySelector(elemento);
    // divError.innerHTML=`<p class="text-center alert alert-danger">${mensaje}</p>`;
    // setTimeout(() => {
    //     divError.innerHTML=``;
    // }, 5000);
};

// ----------------------------------------------------------------
