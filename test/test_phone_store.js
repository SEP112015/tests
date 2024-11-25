// Importaciones necesarias
const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const assert = require('assert');
const fs = require('fs');
const path = require('path');

const screenshotDir = 'test/screenshots';

async function takeScreenshot(driver, name) {
    const screenshot = await driver.takeScreenshot();
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    fs.writeFileSync(
        path.join(screenshotDir, `${name}-${timestamp}.png`),
        screenshot,
        'base64'
    );
}

describe('Pruebas Phone Store', function() {
    let driver;

    before(async function() {
        if (!fs.existsSync(screenshotDir)){
            fs.mkdirSync(screenshotDir, { recursive: true });
        }
        driver = await new Builder().forBrowser('chrome').build();
        await driver.manage().window().maximize();
    });

    beforeEach(async function() {
        await driver.get('file://' + path.resolve(__dirname, '../src/phones.html'));
    });

    it('HU001 - Búsqueda de Teléfonos', async function() {
        const searchInput = await driver.findElement(By.css('.search-bar input'));
        await searchInput.sendKeys('iPhone');
        await driver.sleep(1000);
        
        const visibleProducts = await driver.findElements(By.css('.producto-phone[style="display: block;"]'));
        assert(visibleProducts.length > 0);
        await takeScreenshot(driver, 'busqueda-telefono');
    });

    it('HU002 - Agregar al Carrito', async function() {
        const botonAgregar = await driver.findElement(By.className('btn-agregar-telefono'));
        const contadorInicial = await driver.findElement(By.className('carrito-cantidad')).getText();
        
        await botonAgregar.click();
        await driver.sleep(1000);
        
        const contadorNuevo = await driver.findElement(By.className('carrito-cantidad')).getText();
        assert.notEqual(contadorInicial, contadorNuevo);
        await takeScreenshot(driver, 'agregar-al-carrito');
    });

    it('HU003 - Ver Carrito', async function() {
        const botonAgregar = await driver.findElement(By.className('btn-agregar-telefono'));
        await botonAgregar.click();
        await driver.sleep(1000);
        
        const carritoIcon = await driver.findElement(By.className('carrito-phones'));
        await carritoIcon.click();
        
        const modalCarrito = await driver.wait(until.elementLocated(By.id('modal-carrito-phones')), 5000);
        assert(await modalCarrito.isDisplayed());
        await takeScreenshot(driver, 'ver-carrito');
    });

    after(async function() {
        if (driver) {
            await driver.quit();
        }
    });
    it('HU004 - Gestión de Cantidad', async function() {
        await driver.findElement(By.className('btn-agregar-telefono')).click();
        await driver.sleep(1000);
        await driver.findElement(By.className('carrito-phones')).click();
        
        const botonIncrementar = await driver.wait(until.elementLocated(By.className('incrementar-cantidad')), 5000);
        await botonIncrementar.click();
        
        const cantidad = await driver.findElement(By.className('cantidad-phones')).getText();
        assert.equal(cantidad, '2');
        await takeScreenshot(driver, 'gestion-cantidad');
    });

    it('HU005 - Proceso de Pago', async function() {
        await driver.findElement(By.className('btn-agregar-telefono')).click();
        await driver.sleep(1000);
        await driver.findElement(By.className('carrito-phones')).click();
        
        const botonPagar = await driver.wait(until.elementLocated(By.id('pagar-phones')), 5000);
        await botonPagar.click();
        
        await driver.wait(until.alertIsPresent());
        const alert = await driver.switchTo().alert();
        await alert.accept();
        
        const contadorCarrito = await driver.findElement(By.className('carrito-cantidad')).getText();
        assert.equal(contadorCarrito, '0');
        await takeScreenshot(driver, 'proceso-pago');
    });
});
