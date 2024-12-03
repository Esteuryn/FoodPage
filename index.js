const listaDeproductosAgregadosAlCarrito = document.querySelector('#productosAgregadosAlCarrito'), tituloDeCarrito = document.querySelector('#tituloDeCarrito'), ElementosDelcarrito = document.querySelector('#carrito').childNodes, total = document.querySelector('#total'), PantallaDeCompraRealizada = document.querySelector('#CompraRealizada')
 

let numeroDeProducto = 0, primeraVez = true

window.onresize = ()=>{
    if(window.outerWidth > 900){
        const carrito = document.querySelector('nav')
        carrito.style = ''
    }
}

function agregarProductoAlCarrito(id) {
// Esta función agrega un producto seleccionado al carrito.
    let producto = document.querySelector('#' + id).childNodes[1].childNodes;
    let [nombre, descripcion, precio] = [producto[1].textContent, (producto[7].value) ? producto[7].value : '', producto[9].childNodes[1].textContent.split('').slice(9, 12).join('').replace(' ', '')]
    let nuevoProductoAgregadoAlCarrito = document.createElement('div');
    nuevoProductoAgregadoAlCarrito.classList.add('productoAgregadoAlCarrito')
    nuevoProductoAgregadoAlCarrito.id = numeroDeProducto
    nuevoProductoAgregadoAlCarrito.innerHTML = "<div><h2>" + nombre + "</h2><h3>" + descripcion + "</h3><h2>Precio: $" + precio + " RD</h2></div><button onclick=\"eliminarProductoDelCarrito(" + numeroDeProducto + ")\"><svg width=\"20\" height=\"20\" viewBox=\"0 0 20 20\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M17.9857 0L10 7.98571L2.01429 0L0 2.01429L7.98571 10L0 17.9857L2.01429 20L10 12.0143L17.9857 20L20 17.9857L12.0143 10L20 2.01429L17.9857 0Z\" fill=\"#fff\" fill-opacity=\"0.75\" /></svg></button>"
    listaDeproductosAgregadosAlCarrito.appendChild(nuevoProductoAgregadoAlCarrito)
    ObtenerTotal(precio, false)
    numeroDeProducto++
    if (primeraVez) {
        //PrimerAnimacionDelCarrito()
        PrimerProductoAgregado()
        primeraVez = false
    }
    else {
        animacionDelTotal()
    }
}

function eliminarProductoDelCarrito(numero) {
// Esta función elimina un producto del carrito y actualiza el total.
    let productoAEliminar = document.getElementById(numero)
    const precio = productoAEliminar.childNodes[0].childNodes[2].textContent.split('').slice(9, 12).join('').replace(' ', '')
    listaDeproductosAgregadosAlCarrito.removeChild(productoAEliminar)
    ObtenerTotal(precio, true)
    if (!listaDeproductosAgregadosAlCarrito.childElementCount) {
        //ReiniciarCarritoAEstadoInicial()
        ReiniciadoDeCarrito()
        primeraVez = true
    }
}

function RealizarCompra() {
// Esta función finaliza la compra, mostrando el total y la dirección ingresada.
    const totalFinal = document.querySelector('#totalFinal'), direccionFinal = document.querySelector('#direccionFinal'), direccionIngresada = document.querySelector('#direccion'), advertencia = document.querySelector('#advertencia')
    if(direccionIngresada.value !== ''){
        totalFinal.textContent = total.textContent
        direccionFinal.textContent = direccionIngresada.value
        PantallaDeCompraRealizada.style= ''
        animacionDePantallaDeCompraRealizada()
        advertencia.classList.add('none')
    }
    else{
        advertencia.classList.remove('none')
    }
}

function cerrarCuadroDeCompraFinalizada (){
// Esta función cierra el cuadro que confirma la compra realizada.
    PantallaDeCompraRealizada.style = 'display: none;'
}

function AbrirElCarrito (){
// Esta función abre o cierra el carrito dependiendo de su estado actual.
    const nav = document.querySelector('nav')
    const botonDeAbrirCarrito = document.querySelector('#iconoDelCarrito')
    if((nav.style.display === '') || (nav.style.display === 'none')){
        nav.style.display= 'block'
        nav.style.animation = 'aparecerdesdeabajo 0.3s linear'
        botonDeAbrirCarrito.textContent = 'Seguir viendo productos'
    }
    else{
        nav.style.animation= 'aparecerdesdeabajo 0.3s linear reverse'
        botonDeAbrirCarrito.textContent = 'Ver mi carrito'
    }
    nav.addEventListener('animationend', ()=>{
        if(nav.style.animation ==='0.3s linear 0s 1 reverse none running aparecerdesdeabajo'){
            nav.style.display= 'none'
        }
        nav.style.animation = ''
        nav.removeEventListener('animationend', ()=>{})
    })
}

function ObtenerTotal(precioDeProductoRecienAgregado, restar) {
// Esta función calcula y actualiza el total del carrito al agregar o quitar productos.

    const obtenerTotal = parseInt(total.textContent.split('').splice(8, total.textContent.length).join('').replace(' ', ''))
    if (restar) {
        total.textContent = 'Total: $' + (obtenerTotal - parseInt(precioDeProductoRecienAgregado))
    }
    else {
        total.textContent = 'Total: $' + (obtenerTotal + parseInt(precioDeProductoRecienAgregado))
    }
}

function PrimerProductoAgregado() {
// Esta función muestra el carrito al agregar el primer producto.
    tituloDeCarrito.textContent = 'Lista de compras'
    ElementosDelcarrito.forEach(elemento => {
        if (elemento.classList) {
            elemento.classList.remove('none')
            animacionDeProductosDelCarritoInicial(elemento)
        }
    })
}

function ReiniciadoDeCarrito() {
// Esta función reinicia el carrito al estado inicial si está vacío.
    tituloDeCarrito.textContent = 'Aquí te mostraremos tu lista de productos'
    ElementosDelcarrito.forEach(elemento => {

        if (elemento.classList) {
            elemento.classList.add('none')
            if (elemento.id === 'tituloDeCarrito') {
                elemento.style = 'animation: aparecer 0.3s linear;'
                elemento.classList.remove('none')
                elemento.addEventListener('animationend', () => {
                    elemento.style = ''
                })
            }
        }
    })
}

function animacionDelTotal() {
// Esta función aplica una animación al total del carrito.
    total.classList.add('animaciondestacar')
    total.addEventListener('animationend', () => {
        total.classList.remove('animaciondestacar')
        total.classList.remove('animacionaparecerdesdelaizquierda')
        total.removeEventListener('animationend', () => { })
    })
}

function animacionDeProductosDelCarritoInicial(elemento) {
// Esta función aplica una animación inicial a los elementos del carrito.
    elemento.style = 'animation: aparecerdesdelaizquierda 0.3s linear;'
    elemento.addEventListener('animationend', () => {
        elemento.style = ''
    })
}

function animacionDePantallaDeCompraRealizada(){
// Esta función aplica una animación al cuadro de compra realizada.
    const contenedorDePantallaFinalAAnimar = PantallaDeCompraRealizada.childNodes[1]
    contenedorDePantallaFinalAAnimar.style = 'animation: extender 0.2s linear;'
    contenedorDePantallaFinalAAnimar.addEventListener('animationend', ()=>{
        contenedorDePantallaFinalAAnimar.style= ''
    })
    
}

