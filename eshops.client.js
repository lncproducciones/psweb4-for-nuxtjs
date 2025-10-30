// plugins/eshops.client.js

/**
 * Este plugin implementa las funcionalidades del API de Portal Services
 * para EShops, reemplazando las llamadas a $.ajax con $fetch de Nuxt.
 * Se ejecuta solo en el cliente.
 */

/**
 * @typedef {object} PedidoItem
 * @property {string} imageUrl - URL de la imagen del producto.
 * @property {string} titulo - Nombre del producto.
 * @property {number} productoId - ID del producto en el pedido.
 * @property {number} unitario - Precio unitario del producto (float).
 * @property {number} cantidad - Cantidad solicitada del producto (int).
 * @property {number} monto - Monto total de la línea (unitario * cantidad) (float).
 */

/**
 * @typedef {object} PedidoCliente
 * @property {number} tipoDocumento - ID del tipo de documento de identificacion.
 * @property {string} identidad - Numero de documento de identificacion.
 * @property {string} nombres - Nombre del cliente.
 * @property {string} apellidos - Apellidos del cliente.
 * @property {string} correo - Direccion de correo electronico.
 * @property {string} telefono - Numero de telefono de contacto.
 * @property {string} direccion1 - Direccion de envio.
 * @property {string} direccion2 - Direccion de envio (linea 2).
 * @property {string} referencia - Punto de referencia.
 * @property {number} ciudad - ID de la ciudad.
 * @property {number} municipio - ID del municipio.
 * @property {number} estado - ID del departamento.
 * @property {number} pais - ID del pais.
 */

export default defineNuxtPlugin(async (nuxtApp) => {
    // Obtenemos las variables públicas de entorno del archivo nuxt.config.ts
    const config = useRuntimeConfig();

    class PedidoItem {
        constructor(productoId, titulo, imageUrl, unitario, cantidad, monto) {
            this.productoId = productoId;
            this.titulo = titulo;
            this.imageUrl = imageUrl;
            this.unitario = unitario;
            this.cantidad = cantidad;
            this.monto = monto;
        }
    }

    class EShop {

        /**
         * @constructor
         * @param {string} apiId - El ID del sitio web.
         * @param {string} apiKey - La clave del sitio web.
         */
        constructor(apiId, apiKey) {
            console.log("PSWeb4 EShops for Nuxt.js");

            this.apiId = apiId;
            this.apiKey = apiKey;
            this.apiRoot = "https://eshops-api.psweb.me/";
            /**
             * Version de la API en el servidor.
             */
            this.apiVersion = null;
            /**
             * Indica si el API esta en linea.
             */
            this.apiOnline = false;
            /**
             * Información del pedido.
             */
            this.pedido = this.loadPedido();
        }

        /**
         * Inicia la conexión con el servidor y valida la versión.
         */
        async init() {
            if (!this.apiKey) {
                console.error("*** No se ha detectado la configuración del sitio web. ***");
                if (process.env.NODE_ENV != 'development') {
                    window.location.href = "https://www.lncproducciones.com/web";
                } else {
                    console.warn("*** En entorno de desarrollo. ***");
                }
            }
            else {
                try {
                    try {
                        console.log("Intentando conectar con el servidor de la API.");
                        const response = await $fetch(`${this.apiRoot}sys/version`);
                        this.apiVersion = response;
                        this.apiOnline = true;
                        console.log("Cargando o creando el pedido.");
                        this.loadPedido();
                    } catch (error) {
                        console.warn("No se ha podido conectar con el servidor de la API. Modo offline.");
                        this.apiVersion = "4.0.0.0-local";
                    }
                    useHead({ meta: [ { name: 'generator', content: 'Portal Services for Web v.' + this.apiVersion } ] });
                    console.log("EShops Versión " + this.apiVersion);
                } catch (error) {
                    console.error("Error al conectar con el servidor de la API:", error);
                }
            }
        }

        /**
         * Obtiene la versión actual del API.
         * @returns {string} La versión del API.
         */
        getCurrentVersion() {
            return this.apiVersion;
        }

        /**
         * Obtiene la lista de categorias a las que pertenece un producto.
         * @param {int} productoId Id del producto a consultar.
         * @returns 
         */
        listCategorias(productoId) {
            if (this.apiOnline) {
                var url = `${this.apiRoot}cats/list/${productoId}/${this.apiKey}`;
                return $fetch(url);
            } else {
                return null;
            }
        }

        /**
         * Obtiene los últimos "n" productos publicados.
         * @param {*} totalItems Cantidad de productos a obtener.
         * @returns 
         */
        getProductosActivosTopMost(totalItems) {
            if (this.apiOnline) {
                var url = `${this.apiRoot}prods/top/${this.apiId}/${totalItems}/${this.apiKey}`;
                return $fetch(url);
            } else {
                return null;
            }
        }

        /**
         * Obtiene el listado de productos por un filtro aplicado.
         * @param {*} filter Filtro a aplicar.
         * @returns 
         */
        getProductosByAdvancedFilter(filter) {
            if (this.apiOnline) {
                filter = encodeURIComponent(filter);
                var url = `${this.apiRoot}prods/filter/${this.apiId}/${filter}/${this.apiKey}`;
                return $fetch(url);
            } else {
                return null;
            }
        }

        /**
         * Obtiene el listado de productos activos.
         * @returns 
         */
        getProductosActivos() {
            console.log("Intentando obtener productos activos.");
            if (this.apiOnline) {
                console.log("API online.");
                var url = `${this.apiRoot}prods/list/${this.apiId}/${this.apiKey}`;
                console.info(url);
                return $fetch(url);
            } else {
                console.log("API offline.");
                return null;
            }
        }

        /**
         * Obtiene el listado de productos de una marca indicada por su Id.
         * @param {*} marcaId ID de la marca a consultar.
         * @returns 
         */
        getProductosActivosByMarca(marcaId) {
            if (this.apiOnline) {
                var url = `${this.apiRoot}prods/bymark/${this.apiId}/${marcaId}/${this.apiKey}`;
                return $fetch(url);
            } else {
                return null;
            }
        }

        /**
         * Obtiene el listado de productos de una categoria indicada por su ID.
         * @param {*} categoriaId ID de la categoria a consultar.
         * @returns 
         */
        getProductosActivosByCategoria(categoriaId) {
            if (this.apiOnline) {
                var url = `${this.apiRoot}prods/bycat/${this.apiId}/${categoriaId}/${this.apiKey}`;
                return $fetch(url);
            } else {
                return null;
            }
        }

        /**
         * Registra un nuevo pedido en la plataforma.
         * @param {*} p Datos del nuevo pedido.
         * @returns 
         */
        addPedido(p) {
            if (this.apiOnline) {
                var url = `${this.apiRoot}pedidos/add/${this.apiId}/${this.apiKey}`;
                return $fetch(url, {
                    method: "POST",
                    body: p
                });
            } else {
                return null;
            }
        }

        /**
         * Obtiene el listado de las marcas activas.
         * @returns 
         */
        getMarcasActivas() {
            if (this.apiOnline) {
                var url = `${this.apiRoot}adm/mar-active/${this.apiId}/${this.apiKey}`;
                return $fetch(url);
            } else {
                return null;
            }
        }

        /**
         * Obtiene el listado de las categorias activas.
         * @returns 
         */
        getCategoriasActivas() {
            if (this.apiOnline) {
                var url = `${this.apiRoot}adm/cat-active/${this.apiId}/${this.apiKey}`;
                return $fetch(url);
            } else {
                return null;
            }
        }

        /**
         * Obtiene el detalle de un producto, consultado por su ID.
         * @param {int} id ID único del producto.
         */
        getProducto(id) {
            if (this.apiOnline) {
                var url = `${this.apiRoot}adm/pro-get/${id}/${this.apiKey}`;
                return $fetch(url);
            } else {
                return null;
            }
        }

        /**
         * Actualiza la cantidad de visualizaciones de un producto, basado en su ID.
         * @param {int} id ID único del producto.
         */
        updateProductoVisto(id) {
            var p = { 
                Id: id,
                AlcatrazKey: this.apiKey
            };
            if (this.apiOnline) {
                var url = `${this.apiRoot}adm/pro-visto`;
                return $fetch(url, {
                    method: "POST",
                    body: p
                });
            } else {
                return null;
            }
        }

        /**
         * Obtiene la galeria de imagenes de un producto, basado en su ID.
         * @param {int} id ID único del producto.
         */
        getProductoGaleria(id) {
            if (this.apiOnline) {
                var url = `${this.apiRoot}adm/pro-gal-active/${id}/${this.apiKey}`;
                return $fetch(url);
            } else {
                return null;
            }
        }

        /**
         * Agrega un nuevo elemento al carrito.
         * @param {PedidoItem} item 
         */
        addToCart(item) {
            this.pedido.items.push(item);
            this.recalcularPedido();
        }

        async alCart(id) {
            var prod = await this.getProducto(id).resultado;
            var item = new PedidoItem(prod.productoId, prod.titulo, prod.imageUrl, prod.unitario, 1, prod.unitario);
            this.addToCart(item);
        }

        /**
         * Actualiza la cantidad de elementos de un producto, por su ID.
         * @param {int} productoId ID del producto a actualizar.
         * @param {int} cantidad Nueva cantidad de producto.
         */
        updateItem(productoId, cantidad)
        {
            if (cantidad > 0) {
                const item = this.pedido.items.find(item => item.productoId === productoId);
                if (item) {
                    item.cantidad = cantidad;
                    this.recalcularPedido();
                }
            } else {
                this.removeFromCart(productoId);
                this.recalcularPedido();
            }
        }

        /**
         * Elimina un producto del carrito.
         * @param {int} productoId ID del producto a eliminar
         */
        removeFromCart(productoId)
        {
            this.pedido.items = this.pedido.items.filter(item => item.productoId !== productoId);
            this.recalcularPedido();
        }

        /**
         * Elimina todos los elementos del carrito.
         */
        clearCart() {
            this.pedido.items = [];
            console.info("Carrito vaciado.");
            this.recalcularPedido();
        }

        /**
         * Recalcula los totales del pedido.
         */
        recalcularPedido() {
            this.pedido.resumen.items = this.pedido.items.length;
            this.pedido.resumen.subtotal = 0;
            this.pedido.items.forEach(item => {
                this.pedido.resumen.subtotal += item.monto;
            });
            this.pedido.resumen.total = this.pedido.resumen.subtotal - this.pedido.resumen.descuento;
        }

        /**
         * Establece los descuentos del pedido, y recalcula los totales
         * @param {float} monto Monto a descontar.
         * @param {string} motivo Motivo del descuento, debe estar definido en el backend.
         */
        setDescuento(monto, motivo) {
            this.pedido.resumen.descuento = monto;
            this.pedido.resumen.descuentoMotivo = motivo;
            this.recalcularPedido();
        }

        /**
         * Establece o actualiza los datos del cliente que realiza el pedido.
         * @param {PedidoCliente} datos 
         */
        setDatosCliente(datos) {
            this.pedido.cliente = datos;
        }

        /**
         * Elimina los datos del cliente actual.
         */
        clearDatosCliente() {
            this.pedido.cliente = {
                tipoDocumento: 0,
                identidad: '',
                nombres: '',
                apellidos: '',
                correo: '',
                telefono: '',
                direccion1: '',
                direccion2: '',
                referencia: '',
                ciudad: 0,
                municipio: 0,
                estado: 0,
                pais: 0
            };
        }

        /**
         * Determina si se han cargado los datos del cliente comprador.
         * @returns bool
         */
        hasDatosCliente() {
            return (this.pedido.cliente.tipoDocumento > 0) 
                && (this.pedido.cliente.identidad !== ''
                && this.pedido.cliente.nombres !== ''
                && this.pedido.cliente.apellidos !== ''
                && this.pedido.cliente.correo !== ''
                && this.pedido.cliente.telefono !== ''
                && this.pedido.cliente.direccion1 !== ''
                && this.pedido.cliente.ciudad > 0
                && this.pedido.cliente.municipio > 0
                && this.pedido.cliente.estado > 0
                && this.pedido.cliente.pais > 0
            );
        }

        /**
         * Determina si el carrito tiene elementos.
         * @returns bool
         */
        hasItems() {
            return this.pedido.items.length > 0;
        }

        /**
         * Determina si se puede enviar el pedido al servidor.
         * @returns bool
         */
        canCreatePedido() {
            return this.hasItems() && this.hasDatosCliente();
        }

        loadPedido() {
            if (sessionStorage.getItem('pedido')) {
                return JSON.parse(sessionStorage.getItem('pedido'));
            } else {
                var pedido = {
                    /**
                     * Datos del cliente.
                     */
                    cliente: {
                        /**
                         * ID del tipo de documento de identificacion.
                         */
                        tipoDocumento: 0,
                        /**
                         * Numero de documento de identificacion.
                         */
                        identidad: '',
                        /**
                         * Nombre del cliente.
                         */
                        nombres: '',
                        /**
                         * Apellidos del cliente.
                         */
                        apellidos: '',
                        /**
                         * Direccion de correo electronico.
                         */
                        correo: '',
                        /**
                         * Numero de telefono de contacto.
                         */
                        telefono: '',
                        /**
                         * Direccion de envio.
                         */
                        direccion1: '',
                        /**
                         * Direccion de envio (linea 2).
                         */
                        direccion2: '',
                        /**
                         * Punto de referencia.
                         */
                        referencia: '',
                        /**
                         * ID de la ciudad.
                         */
                        ciudad: 0,
                        /**
                         * ID del municipio.
                         */
                        municipio: 0,
                        /**
                         * ID del departamento.
                         */
                        estado: 0,
                        /**
                         * ID del pais.
                         */
                        pais: 0
                    },
                    /**
                     * Elementos del carrito de compras.
                     * @type {PedidoItem[]}
                     */
                    items: [],
                    /**
                     * Resumen de la operacion.
                     */
                    resumen: {
                        /**
                         * Observaciones del pedido.
                         */
                        observaciones: '',
                        /**
                         * Cantidad de elementos en el carrito de compras.
                         */
                        items: 0,
                        /**
                         * Subtotal a pagar.
                         */
                        subtotal: 0,
                        /**
                         * Monto a descontar.
                         */
                        descuento: 0,
                        /**
                         * Concepto del descuento.
                         */
                        descuentoMotivo: '',
                        /**
                         * Total a pagar.
                         */
                        total: 0
                    }
                };
                sessionStorage.setItem('pedido', JSON.stringify(pedido));
                return pedido;
            }
        }
    }

    // Instanciamos la clase con las variables de entorno de Nuxt.
    const eshopsClient = new EShop(config.public.pswebId, config.public.pswebKey);

    // Inicializamos la conexión.
    eshopsClient.init();

    // Hacemos el cliente disponible globalmente en la aplicación de Nuxt.
    // Ahora puedes acceder a sus métodos usando `$psweb`.
    nuxtApp.provide('eshops', eshopsClient);
});