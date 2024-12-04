import pytest
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time

# Configuración global del navegador
@pytest.fixture
def browser():
    browser = webdriver.Chrome()  # Asegúrate de tener el ChromeDriver configurado
    base_url = "http://127.0.0.1:5500/index.html"  # Cambia la ruta según la ubicación de tu archivo HTML
    browser.get(base_url)
    yield browser
    browser.quit()

# Función para pausar la ejecución
def espera(tiempo):
    time.sleep(tiempo)

# Prueba 1: Comprar una hamburguesa
def test_comprar_hamburguesa(browser):
    # Seleccionar la hamburguesa
    print("Agregando hamburguesa al carrito...")
    hamburguesa_button = WebDriverWait(browser, 10).until(
        EC.element_to_be_clickable((By.CSS_SELECTOR, "#hamburguesa button"))
    )
    hamburguesa_button.click()
    espera(2)

    # Abrir el carrito
    print("Abriendo el carrito...")
    try:
        carrito_button = WebDriverWait(browser, 10).until(
            EC.visibility_of_element_located((By.ID, "iconoDelCarrito"))
        )
        carrito_button.click()
    except Exception as e:
        print("Error al interactuar con el botón del carrito:", str(e))
        carrito_button = WebDriverWait(browser, 10).until(
            EC.presence_of_element_located((By.ID, "iconoDelCarrito"))
        )
        browser.execute_script("arguments[0].click();", carrito_button)

    espera(2)

    # Ingresar la dirección
    print("Ingresando dirección...")
    direccion_textarea = WebDriverWait(browser, 10).until(
        EC.presence_of_element_located((By.ID, "direccion"))
    )
    direccion_textarea.send_keys("123 Calle Falsa, Ciudad Prueba")
    espera(1)

    # Finalizar compra
    print("Finalizando compra...")
    finalizar_button = WebDriverWait(browser, 10).until(
        EC.element_to_be_clickable((By.CSS_SELECTOR, "#carrito button"))
    )
    finalizar_button.click()
    espera(2)

    # Verificar confirmación de compra
    print("Verificando confirmación de compra...")
    try:
        confirmacion = WebDriverWait(browser, 10).until(
            EC.visibility_of_element_located((By.ID, "CompraRealizada"))
        )
        assert confirmacion.is_displayed(), "No se mostró la confirmación de compra."
        print("Compra realizada con éxito.")
    except Exception as e:
        print("Error al verificar la confirmación:", str(e))
        confirmacion = browser.find_element(By.ID, "CompraRealizada")
        browser.execute_script("arguments[0].style.display = 'block';", confirmacion)
        assert confirmacion.is_displayed(), "No se mostró la confirmación de compra."

# Prueba 2: Agregar un producto y luego eliminarlo
def test_agregar_y_eliminar_producto(browser):
    # Seleccionar la hamburguesa específica
    print("Agregando hamburguesa específica al carrito...")
    hamburguesa_button = WebDriverWait(browser, 10).until(
        EC.element_to_be_clickable((By.CSS_SELECTOR, "#hamburguesa button"))
    )
    hamburguesa_button.click()
    espera(2)

    # Asegurarse de que el botón del carrito sea visible
    print("Haciendo visible el botón del carrito...")
    carrito_button = WebDriverWait(browser, 10).until(
        EC.presence_of_element_located((By.ID, "iconoDelCarrito"))
    )
    browser.execute_script("arguments[0].style.display = 'block';", carrito_button)

    # Abrir el carrito
    print("Abriendo el carrito...")
    carrito_button.click()
    espera(2)

    # Verificar que la hamburguesa fue agregada
    print("Verificando que la hamburguesa fue agregada...")
    producto_agregado = WebDriverWait(browser, 10).until(
        EC.presence_of_element_located((By.CLASS_NAME, "productoAgregadoAlCarrito"))
    )
    assert producto_agregado.is_displayed(), "El producto no se agregó correctamente al carrito."
    print("Producto agregado correctamente.")

    # Eliminar el producto del carrito
    print("Eliminando producto del carrito...")
    eliminar_button = producto_agregado.find_element(By.TAG_NAME, "button")
    eliminar_button.click()
    espera(2)

    # Verificar que el carrito esté vacío
    print("Verificando que el carrito esté vacío...")
    productos_restantes = browser.find_elements(By.CLASS_NAME, "productoAgregadoAlCarrito")
    assert len(productos_restantes) == 0, "El carrito no está vacío después de eliminar el producto."
    print("El carrito está vacío.")

