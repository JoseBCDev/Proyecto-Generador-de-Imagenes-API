//Variables
const formulario = document.querySelector('#formulario');

const resultado = document.querySelector('#resultado');

const paginadorDiv = document.querySelector('#paginacion');

const registroPorPagina = 40;

let totalPaginas;
let iterador;
let paginaActual = 1;

//Que se cargue la ventana automaticamente
window.onload = ()=>{
    formulario.addEventListener('submit',validarFormulario);
}

function validarFormulario(e){
    e.preventDefault();

    const terminoInput = document.querySelector('#termino').value;

    if(terminoInput === '')
    {
        //Validamos que si esta vacio, muestre la alerta
        mostrarAlerta('Agrega un Término de Búsqueda');

        return;
    }
    //Invocamos la funcion una vez realizada la accion
    buscarImagenes();
}

function mostrarAlerta(mensaje)
{
    //creamos una varaible para detectar a la alerta
    const existeAlerta = document.querySelector('.alerta');

    //en caso que no exista la alerta, mostrar en el html
    if(!existeAlerta)
    {
        const alerta = document.createElement('p');
    
        

        alerta.classList.add('bg-red-100','border-red-400','text-red-700','px-4','py-3','rounded',
            'max-w-lg','mx-auto','mt-6','text-center','alerta');
        
        alerta.innerHTML = `<strong>Error...!!</strong>
            <span class="block sm:inline">${mensaje}</span>`;

        formulario.appendChild(alerta);
        //tiempo de 3s para removerse
        setTimeout(() => {
            alerta.remove();
        }, 3000);
    }
 
}
//2DA FORMA DE CONECTAR CON LA API CON ASYNC AWAIT
async function buscarImagenes()
{
    const termino = document.querySelector('#termino').value;

    //Establecemos los parametros de la API, luego consultamos a la API
    const key = '30646724-28b6ce9c335c39d50d52bf7f8';
    const url = `https://pixabay.com/api/?key=${key}&q=${termino}&per_page=${registroPorPagina}&page=${paginaActual}`;

    try {
        const respuesta = await fetch(url);
        const resultado = await respuesta.json();

        totalPaginas = calcularPaginas(resultado.totalHits);
                mostrarImagenes(resultado.hits);

    } catch (error) {
        console.log(error);
    }
}
/* 

 1ERA FORMA DE CONECTAR CON LA API CON FETCH
function buscarImagenes()
{
    const termino = document.querySelector('#termino').value;

    //Establecemos los parametros de la API, luego consultamos a la API
    const key = '30646724-28b6ce9c335c39d50d52bf7f8';
    const url = `https://pixabay.com/api/?key=${key}&q=${termino}&per_page=${registroPorPagina}&page=${paginaActual}`;

    fetch(url)
        .then(respuesta => respuesta.json())
        .then(resultado =>{
            totalPaginas = calcularPaginas(resultado.totalHits);
            mostrarImagenes(resultado.hits);
        })
} */
function mostrarImagenes(imagenes)
{
    limpiarHTML();

    //Iteramos las imagenes o hits encontramos en la API
    imagenes.forEach(imagen => {
        //Extramos los valores necesarios del objeto
        const {likes,previewURL,largeImageURL,views} = imagen;
        //Creamos un html dinamico por cada iteracion del foreach
        resultado.innerHTML += `
            <div class="w-1/2 md:w-1/3 lg:w-1/4 p-3 mb-4">
                <div class="bg-white">
                    <img class="w-full" src="${previewURL}">
                    <div class="p-4">
                        <p class="font-bold">${likes}<span class="font-light">Me gusta</span></p>
                        <p class="font-bold">${views}<span class="font-light">Veces Vista</span></p>
                        <a 
                            class="block w-full bg-blue-800 hover:bg-blue-500 text-white uppercase font-bold text-center rounded mt-5 p-1"
                            href="${largeImageURL}" target="_blank rel="noopener noreferrer"
                        >Ver imagen</a>
                    </div>
                </div>
            </div>
        `;
    });

    imprimirPaginador();
}

function imprimirPaginador()
{
    limpiarHTMLPaginador();

    //Se crea un Generador para cada paginador
    iterador = crearPaginador(totalPaginas);

    while(true)
    {    //Extraemos los valores del interador
        const {value,done} = iterador.next();

        if(done) return; //cuando done sea false, se rompera el iterador
        
        //Creamos botones hasta q se rompa el iterador
        const boton = document.createElement('a');
        boton.textContent = value;
        boton.classList.add('siguiente','bg-yellow-400','hover:bg-yellow-900','px-4','py-1','mr-2','font-bold','mb-1','uppercase','rounded');
        boton.dataset.pagina = value;
        boton.href = '#';

        boton.onclick = ()=>{
            paginaActual = value;
            buscarImagenes();
        };

        //Agregamos el boton al html
        paginadorDiv.appendChild(boton);
    }

}

//Funcion Generador
function *crearPaginador(totalPaginas)
{   
    for(let i=0; i<totalPaginas; i++)
    {
        //mostramos los valores con su mismo metodo yield
        yield i+1;
    }
}

function limpiarHTML()
{
    while(resultado.firstChild)
    {   //Remueve los hijos
        resultado.removeChild(resultado.firstChild);
    }
}

//Limpiar el HTML de la paginacion
function limpiarHTMLPaginador()
{
    while(paginadorDiv.firstChild)
    {   //Remueve los hijos
        paginadorDiv.removeChild(paginadorDiv.firstChild);
    }
}

//Calcular la cantidad de paginas para el paginador
function calcularPaginas(TotalElements)
{
    //redondeamos hacia arriba la division
    return Math.ceil(TotalElements/registroPorPagina)
}