// plugins/ctc-geografico.client.js

/**
 * Este plugin implementa las funcionalidades del API de CTC.
 * Se ejecuta solo en el cliente.
 */
export default defineNuxtPlugin(async (nuxtApp) => {
    // Obtenemos las variables públicas de entorno del archivo nuxt.config.ts
    const config = useRuntimeConfig();

    /**
     * @typedef {object} ResultadoOperacion
     * @property {int} codigo - Código de la operación.
     * @property {int} newItemId - ID del nuevo elemento creado.
     * @property {guid} newItemGuid - ID del nuevo elemento creado (si es GUID).
     * @property {int} affectedRows - Número de filas afectadas por la operación.
     * @property {string} mensaje - Mensaje de la operación.
     * @property {string} detalle - Detalle de la operación.
     */

    /**
     * @typedef {object} MenuItem
     * @property {string} texto - Texto del elemento.
     * @property {string} valor - Valor del elemento.
     */

    /**
     * @typedef {object} InfoPais
     * @property {int} id - Id único del país.
     * @property {string} iso - Código ISO del país.
     * @property {string} pais - Nombre del país.
     * @property {int} monedaId - Id ISO de la moneda.
     * @property {string} monedaISO - Código ISO de la moneda.
     * @property {string} moneda - Nombre de la moneda.
     * @property {string} monedaSimbolo - Símbolo de la moneda.
     */

    /**
     * @typedef {object} InfoEstado
     * @property {int} uniqueId Id único del estado.
     * @property {string} estado Nombre del estado.
     * @property {int} paisId Id del país.
     * @property {int} regionId Id de la región.
     */

    /**
     * @typedef {object} InfoMunicipio
     * @property {int} uniqueId Id único del municipio.
     * @property {string} municipio Nombre del municipio.
     * @property {int} id Id del municipio.
     * @property {int} estadoId Id del estado.
     * @property {int} paisId Id del país.
     */

    /**
     * @typedef {object} InfoCiudad
     * @property {int} uniqueId Id único de la ciudad.
     * @property {string} ciudad Nombre de la ciudad.
     * @property {int} codigoTelefono Código de área de la ciudad.
     * @property {string} zip Código postal de la ciudad.
     * @property {int} municipioId Id del municipio.
     * @property {int} estadoId Id del estado.
     * @property {int} paisId Id del país.
     * @property {int} id Id de la ciudad.
     */

    /**
     * @typedef {object} GetMenuItemCollectionResult
     * @property {ResultadoOperacion} operacion
     * @property {MenuItem[]} items 
     */

    /**
     * @typedef {object} GetInfoPaisResult
     * @property {ResultadoOperacion} operacion
     * @property {InfoPais} info
     */

    /**
     * @typedef {object} GetInfoEstadoResult
     * @property {ResultadoOperacion} operacion
     * @property {InfoEstado} info
     */

    /**
     * @typedef {object} GetInfoMunicipioResult
     * @property {ResultadoOperacion} operacion
     * @property {InfoMunicipio} info
     */

    /**
     * @typedef {object} GetInfoCiudadResult
     * @property {ResultadoOperacion} operacion
     * @property {InfoCiudad} info
     */

    /**
     * @class Geografico
     * Contiene las rutinas de consumo geográfico del API de CTC.
     */
    class Geografico {

        /**
         * @constructor
         */
        constructor() {
            console.log("Ctc Geografico Client.");
            this.apiRoot = "https://ctc-geografico.psweb.me/";
            this.apiVersion = "0.0.0.0";
            this.apiOnline = false;
        }

        /**
         * Inicia la conexión con el servidor y valida la versión.
         */
        async init() {
            try {
                const response = await $fetch(`${this.apiRoot}sys/version`);
                this.apiVersion = response;
                this.apiOnline = true;
            } catch (error) {
                console.warn("No se ha podido conectar con el servidor de la API. Modo offline.");
                this.apiVersion = "4.0.0.0-local";
            }
            console.log("CTC Geografico Versión " + this.apiVersion);
        }

        /**
         * Obtiene la versión actual del API CTC.
         * @returns {string} Versión actual del API.
         */
        getCurrentVersion() {
            return this.apiVersion;
        
        }

        /**
         * Obtiene el listado de paises.
         * @returns {GetMenuItemCollectionResult} Listado de paises registrados en la base de datos.
         */
        getComboPaises() {
            if (this.apiOnline) {
                return $fetch(`${this.apiRoot}paises/list`);
            } else {
                return null;
            }
        }

        /**
         * Obtiene el listado de paises por fitro.
         * @param {string} filter Filtro a aplicar.
         * @returns {GetMenuItemCollectionResult} Listado de los paises obtenidos.
         */
        getComboPaisesByFilter(filter) {
            if (this.apiOnline) {
                return $fetch(`${this.apiRoot}paises/combofilter/${filter}`);
            } else {
                return null;
            }
        }

        /**
         * Carga el listado de monedas registradas.
         * @returns {GetMenuItemCollectionResult} Listado de las monedas registradas.
         */
        getComboMonedas() {
            if (this.apiOnline) {
                return $fetch(`${this.apiRoot}paises/conmonedas`);
            } else {
                return null;
            }
        }

        /**
         * Carga el listado de símbolos de monedas registradas.
         * @returns {GetMenuItemCollectionResult} Listado de las monedas registradas.
         */
        getComboSimbolosMonedas() {
            if (this.apiOnline) {
                return $fetch(`${this.apiRoot}paises/consimbolos`);
            } else {
                return null;
            }
        }

        /**
         * Obtiene la información de un país, basado en su Id.
         * @param {int} paisId Id del país.
         */
        getInfoPais(paisId) {
            if (this.apiOnline) {
                return $fetch(`${this.apiRoot}paises/get/${paisId}`);
            } else {
                return null;
            }
        }

        /**
         * Obtiene el listado de estados de un país.
         * @param {int} paisId Id del país.
         * @returns {GetMenuItemCollectionResult} Listado de los estados registrados.
         */
        getComboEstados(paisId) {
            if (this.apiOnline) {
                return $fetch(`${this.apiRoot}estados/list/${paisId}`);
            } else {
                return null;
            }
        }

        /**
         * Obtiene la información de un estado.
         * @param {int} estadoId Id del estado.
         * @returns {GetInfoEstadoResult} Información del estado.
         */
        getInfoEstado(estadoId) {
            if (this.apiOnline) {
                return $fetch(`${this.apiRoot}estados/get/${estadoId}`);
            } else {
                return null;
            }
        }

        /**
         * Obtiene el listado de municipios de un estado.
         * @param {int} paisId Id del país a consultar.
         * @param {int} estadoId Id del estado a consultar.
         * @returns {GetMenuItemCollectionResult} Listado de los municipios registrados.
         */
        getComboMunicipios(paisId, estadoId) {
            if (this.apiOnline) {
                return $fetch(`${this.apiRoot}municipios/list/${paisId}/${estadoId}`);
            } else {
                return null;
            }        
        }

        /**
         * Obtiene la información de un municipio.
         * @param {int} municipioId Id del municipio a consultar.
         * @returns {GetInfoMunicipioResult} Información del municipio.
         */
        getInfoMunicipio(municipioId) {
            if (this.apiOnline) {
                return $fetch(`${this.apiRoot}municipios/get/${municipioId}`);
            } else {
                return null;
            }
        }

        /**
         * Obtiene el listado de ciudades de un municipio.
         * @param {int} paisId Id del país a consultar.
         * @param {int} estadoId Id del estado a consultar.
         * @param {int} municipioId Id del municipio a consultar.
         * @returns {GetMenuItemCollectionResult} Listado de ciudades registradas.
         */
        getComboCiudades(paisId, estadoId, municipioId) {
            if (this.apiOnline) {
                return $fetch(`${this.apiRoot}ciudades/list/${paisId}/${estadoId}/${municipioId}`);
            } else {
                return null;
            }
        }

        /**
         * Obtiene el listado de ciudades de un estado.
         * @param {int} paisId Id del país a consultar.
         * @param {int} estadoId Id del estado a consultar.
         */
        getComboCiudadesByEstado(paisId, estadoId) {
            if (this.apiOnline) {
                return $fetch(`${this.apiRoot}ciudades/byestado/${paisId}/${estadoId}`);
            } else {
                return null;
            }        
        }

        /**
         * Carga el listado de códigos de área de un país.
         * @param {int} paisId Id del país a consultar.
         * @returns {GetMenuItemCollectionResult} Listado de códigos de área registrados.
         */
        getComboPhoneCodes(paisId) {
            if (this.apiOnline) {
                return $fetch(`${this.apiRoot}ciudades/phonecodes/${paisId}`);
            } else {
                return null;
            }
        }

        /**
         * Obtiene la información de una ciudad.
         * @param {int} ciudadId Id de la ciudad a consultar.
         * @returns {GetInfoCiudadResult} Información de la ciudad.
         */
        getInfoCiudad(ciudadId) {
            if (this.apiOnline) {
                return $fetch(`${this.apiRoot}ciudades/get/${ciudadId}`);
            } else {
                return null;
            }
        }
    }

    const geograficoClient = new Geografico();
    await geograficoClient.init();
    nuxtApp.provide('geografico', geograficoClient);
});