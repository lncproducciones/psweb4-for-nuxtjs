// plugins/eshops.client.js

/**
 * Este plugin implementa las funcionalidades del API de Portal Services
 * para EShops, reemplazando las llamadas a $.ajax con $fetch de Nuxt.
 * Se ejecuta solo en el cliente.
 */

export default defineNuxtPlugin(async (nuxtApp) => {
    // Obtenemos las variables públicas de entorno del archivo nuxt.config.ts
    const config = useRuntimeConfig();

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
            this.apiVersion = null;
            this.apiOnline = false;
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
                        const response = await $fetch(`${this.apiRoot}sys/version`);
                        this.apiVersion = response.Resultado;
                        this.apiOnline = true;
                    } catch (error) {
                        console.warn("No se ha podido conectar con el servidor de la API. Modo offline.");
                        this.apiVersion = "4.0.0.0-local";
                    }
                    useHead({ meta: [ { name: 'generator', content: 'Portal Services for Web v.' + this.apiVersion } ] });
                    console.log("Versión " + this.apiVersion);
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
                var url = `${this.apiRoot}prods/top/${this.pswebId}/${totalItems}/${this.apiKey}`;
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
                var url = `${this.apiRoot}prods/filter/${this.pswebId}/${filter}/${this.apiKey}`;
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
            if (this.apiOnline) {
                var url = `${this.apiRoot}prods/list/${this.pswebId}/${this.apiKey}`;
                return $fetch(url);
            } else {
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
                var url = `${this.apiRoot}prods/bymark/${this.pswebId}/${marcaId}/${this.apiKey}`;
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
                var url = `${this.apiRoot}prods/bycat/${this.pswebId}/${categoriaId}/${this.apiKey}`;
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
                var url = `${this.apiRoot}pedidos/add/${this.pswebId}/${this.apiKey}`;
                return $fetch(url, {
                    method: "POST",
                    body: p
                });
            } else {
                return null;
            }
        }

        getMarcasActivas() {
            if (this.apiOnline) {
                var url = `${this.apiRoot}adm/mar-active/${this.pswebId}/${this.apiKey}`;
                return $fetch(url);
            } else {
                return null;
            }
        }

        getCategoriasActivas() {
            if (this.apiOnline) {
                var url = `${this.apiRoot}adm/cat-active/${this.pswebId}/${this.apiKey}`;
                return $fetch(url);
            } else {
                return null;
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