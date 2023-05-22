localStorage.clear();

let ListaArticulos  = []; 
let ListaCarrito    = []; 

const tabla          = document.getElementById('items');
const comboProductos = document.getElementById('productos')
const botonAgregar   = document.getElementById('agregar');
const botonVaciar    = document.getElementById('vaciar');
let   txtCantidad    = document.getElementById('textoCantidad');
let   txtSuma        = document.getElementById('textoSuma');

ListaArticulos.push(new Articulo('smartphone','samsung',60000));
ListaArticulos.push(new Articulo('auriculares','noga',15000));
ListaArticulos.push(new Articulo('cargador inalambrico','xiaomi',60000));
ListaArticulos.push(new Articulo('parlante bluetooth','JBL',35200));
ListaArticulos.push(new Articulo('cable hdmi','generico',7500));

console.log(ListaArticulos)

localStorage.setItem('ListaArticulos',JSON.stringify(ListaArticulos));

function allEventListeners()
{
    window.addEventListener('DOMContentLoaded', cargarArticulos);
    
    botonVaciar.addEventListener('click', vaciarCarrito);
    
    botonAgregar.addEventListener('submit', (el) =>
    {
        el.preventDefault();            
        const seleccion = ListaArticulos[+comboProductos.value];
        const nuevoItem = new Item(seleccion,1);

        const indiceSeleccion = ListaCarrito.findIndex((nuevoItem) => { return nuevoItem.producto.nombre == seleccion.nombre});
        
        if (indiceSeleccion != -1)
        {
            ListaCarrito[indiceSeleccion].cantidad++;
        } else {            
            ListaCarrito.push(nuevoItem);  
        }

        updateTablaListaCarrito();
        localStorage.setItem('ListaCarrito', JSON.stringify(ListaCarrito));
    });    
}

allEventListeners();

function cargarArticulos()
{    
    ListaArticulos = JSON.parse(localStorage.getItem('ListaArticulos')) || []
    ListaCarrito = JSON.parse(localStorage.getItem('ListaCarrito')) || [];
    llenarCombo();
}

function vaciarCarrito()
{
    if(ListaCarrito.length == 0){
        const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
            }
        })          
        Toast.fire({
            icon: 'info',
            title: 'No hay artículos en el carrito'
        })
    }else{        
        ListaCarrito = [];
        localStorage.setItem('ListaCarrito',JSON.stringify(ListaCarrito));
        updateTablaListaCarrito();  
        
        txtCantidad.innerText = "Cantidad de articulos en el carrito => 0"
        txtSuma.innerText     = "Totales $ de articulos en el carrito => 0"

        const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
            }
        })          
        Toast.fire({
            icon: 'info',
            title: 'El carrito se vacio correctamente'
        })
    }
}


function updateTablaListaCarrito()
{
    tabla.innerHTML = '';
    ListaCarrito.forEach((item) => {nuevaFila(item)});
}

function llenarCombo()
{
    ListaArticulos.forEach((producto,index) => {
    const option = document.createElement('option');
    option.innerText = `${producto.nombre}   :   ${producto.marca}   :   ${producto.precio}`;
    option.value = index;
    comboProductos.appendChild(option);
    });
}

function nuevaFila(item)
{
    console.log(item);

    const fila = document.createElement('tr');
    let td = document.createElement('td');
    const posicion = ListaCarrito.indexOf(item);

    td.classList.add('font-white');
    td.textContent = item.producto.nombre;
    fila.appendChild(td);
    
    td.classList.add('font-white');
    td = document.createElement('td');
    td.textContent = item.producto.marca;
    fila.appendChild(td);

    td.classList.add('font-white');
    td = document.createElement('td');
    td.textContent = item.producto.precio;
    fila.appendChild(td);    

    td.classList.add('font-white');
    td = document.createElement('td');
    td.textContent = item.cantidad;
    fila.appendChild(td);    

    const botonEliminar = document.createElement('button');
    botonEliminar.className = 'btn btn-danger';
    botonEliminar.textContent = 'Eliminar';

    botonEliminar.onclick = () => 
    {        
        ListaCarrito.splice(posicion,1);
        updateTablaListaCarrito();
        localStorage.setItem('ListaCarrito',JSON.stringify(ListaCarrito));
    }

    td = document.createElement('td')
    td.appendChild(botonEliminar);
    fila.appendChild(td);
    tabla.appendChild(fila); 

    let resultadoCantidad = ListaCarrito.reduce((acc,el) => acc + el.cantidad,0);
    let resultadoSuma     = ListaCarrito.reduce((acc,el) => acc + el.producto.precio * el.cantidad,0);

    txtCantidad.innerText = "Cantidad de articulos en el carrito => " +resultadoCantidad;
    txtSuma.innerText     = "Totales $ de articulos en el carrito => "+resultadoSuma;

}
