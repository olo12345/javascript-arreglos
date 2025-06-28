let propiedad_alquiler =
{
    nombre: '',
    src: '',
    descripcion: '',
    ubicacion: '',
    habitaciones: 0,
    costo: 0,
    smoke: false,
    pets: true
}
const fumarFalse = '<i class="fas fa-smoking-ban"></i> No se permite fumar';
const fumarTrue = '<i class="fas fa-smoking"></i> Permitido fumar';
const mascotasFalse = '<i class="fa-solid fa-ban"></i> No se permiten mascotas';
const mascotasTrue = '<i class="fas fa-paw"></i> Mascotas permitidas';

let propiedad_venta =
{
    nombre: '',
    src: '',
    descripcion: '',
    ubicacion: '',
    habitaciones: 0,
    costo: 0,
    smoke: false,
    pets: true
}

async function loadHTML() {
    try {
        const response = await fetch('./index.html');
        const html = await response.text();
        // Initialize the DOM parser
        const parser = new DOMParser();

        // Parse the text
        const doc = parser.parseFromString(html, "text/html");
        // Ahora doc contiene el documento HTML completo y se puede manipular como objeto DOM
        console.log('HTML cargado correctamente');
        return doc;
    } catch (error) {
        return console.error('Error al cargar el HTML:', error);
    }
}

const CargarPropiedades = async (selector) => {
    let propiedades_alquiler_HTML = await loadHTML();
    propiedades_alquiler_HTML = propiedades_alquiler_HTML.querySelector(selector);
    imagenes = propiedades_alquiler_HTML.querySelectorAll('img');
    nombres = propiedades_alquiler_HTML.querySelectorAll("h5");
    parrafos = propiedades_alquiler_HTML.querySelectorAll("p");
    console.log(imagenes, nombres, parrafos);
    let propiedades = [];
    for (let i = 0; i < nombres.length; i++) {
        let propiedad_temp = {}
        //propiedades[i]
        if (imagenes[i]) {
            propiedad_temp.src = imagenes[i].src;
        }
        if (nombres[i]) {
            propiedad_temp.nombre = nombres[i].innerHTML.trim();
        }
        if (parrafos[i]) {
            propiedad_temp.descripcion = parrafos[6 * i].innerText.trim();
            propiedad_temp.ubicacion = parrafos[6 * i + 1].innerText.trim();
            propiedad_temp.habitaciones = parrafos[6 * i + 2].innerText.trim().split(' ')[0];
            propiedad_temp.costo = parrafos[6 * i + 3].innerText;
            propiedad_temp.smoke = !parrafos[6 * i + 4].innerHTML.includes("No se permite fumar");
            propiedad_temp.pets = !parrafos[6 * i + 5].innerHTML.includes("No se permiten mascotas");
        }
        propiedades.push(propiedad_temp);
    }
    console.log('Propiedades llenadas correctamente');
    console.log(propiedades);
    return propiedades;
}

async function loadTemplate(url, insertAfter = null, data = null) {
    return fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .then(html => {
            // If data is provided, replace placeholders in the template
            let div = [];
            if (data) {
                data.forEach((item, index) => {
                    div[index] = document.createElement('div');
                    div[index].className = 'col-md-4 mb-4';
                    div[index].innerHTML = html;
                    div[index].innerHTML = div[index].innerHTML.replace(`\${Nombre}`, item.nombre);
                    div[index].querySelector("img").src = item.src || '';
                    div[index].innerHTML = div[index].innerHTML.replace(`\${Descripción}`, item.descripcion || '');
                    div[index].innerHTML = div[index].innerHTML.replace(`\${Dirección}`, item.ubicacion || '');
                    div[index].innerHTML = div[index].innerHTML.replaceAll(new RegExp(/\${Habitaciones}|\${Baños}/, "g"), item.habitaciones || 0);
                    div[index].innerHTML = div[index].innerHTML.replace(`\${Costo}`, item.costo || 0);
                    div[index].innerHTML = div[index].innerHTML.replace(`\${Fumar}`, item.smoke ? fumarTrue : fumarFalse);
                    div[index].innerHTML = div[index].innerHTML.replace(`\${Mascotas}`, item.pets ? mascotasTrue : mascotasFalse);
                    insertAfter.appendChild(div[index]);
                    console.log(insertAfter.querySelectorAll('p'));
                    insertAfter.querySelectorAll('p')[4 + 6 * index].className = item.smoke ? 'text-success' : 'text-danger';
                    insertAfter.querySelectorAll('p')[5 + 6 * index].className = item.pets ? 'text-success' : 'text-danger';
                });
            }
            else {
                div = document.createElement('div');
                div.className = 'col-md-4 mb-4';
                div.innerHTML = html;
                insertAfter.appendChild(div);
            }
            // Create a new div element

        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
}

if (document.querySelector('#venta')) {
    CargarPropiedades("#venta").then((propiedades) => {
        let contenedor = document.querySelector('#venta .row');
        loadTemplate('template.html', contenedor, propiedades);
    }
    ).catch((error) => {
        console.error('Error al llenar las propiedades de venta:', error);
    });
} else if (document.querySelector('#alquiler')) {
    CargarPropiedades("#alquiler").then((propiedades) => {
        let contenedor = document.querySelector('#alquiler .row');
        loadTemplate('template.html', contenedor, propiedades);
    }
    ).catch((error) => {
        console.error('Error al llenar las propiedades de alquiler:', error);
    });
}
