
const formulario = document.querySelector('#formulario');

const resultado = document.querySelector('#resultado');

window.onload = ()=>{
    formulario.addEventListener('submit',validarFormulario);
}

function validarFormulario(e){
    e.preventDefault();

    const termino = document.querySelector('#termino').value;

    if(termino === '')
    {
        mostrarAlerta('Agrega un Término de Búsqueda');

        return;
    }
}

function mostrarAlerta(mensaje)
{

    const existeAlerta = document.querySelector('.alerta');

    if(!existeAlerta)
    {
        const alerta = document.createElement('p');
    
        

        alerta.classList.add('bg-red-100','border-red-400','text-red-700','px-4','py-3','rounded',
            'max-w-lg','mx-auto','mt-6','text-center','alerta');
        
        alerta.innerHTML = `<strong>Error...!!</strong>
            <span class="block sm:inline">${mensaje}</span>`;

        formulario.appendChild(alerta);

        setTimeout(() => {
            alerta.remove();
        }, 3000);
    }
 
}