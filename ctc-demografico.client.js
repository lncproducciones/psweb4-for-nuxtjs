// plugins/ctc-demografico.client.js

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
     * @typedef {object} InfoEmpresa
     * @property {boolean} agenteRetencion - ¿Es agente de retención?
     * @property {string} correo - Correo electrónico
     * @property {string} identidad - Número de documento de identidad
     * @property {string} linkContactos - Enlace a la lista de contactos
     * @property {string} linkDirecciones - Enlace a la lista de direcciones
     * @property {string} razonSocial - Razón social
     * @property {string} rifCompleto - RIF/NIT completo
     * @property {int} status - Status (0: Inactivo, 1: Activo)
     * @property {int} tipoEmpresa - Id del tipo de empresa
     * @property {int} tipoJuridico - Id del tipo de persona jurídica
     * @property {int} uniqueId - Id único de la empresa
     * @property {string} website - URL del sitio web
     */

    /**
     * @typedef {object} InfoEmpresaDireccion
     * @property {int} ciudad - Id de la ciudad
     * @property {string} direccion - Detalle de la dirección
     * @property {int} estado - Id del estado
     * @property {int} id - Id único de la dirección
     * @property {int} municipio - Id del municipio
     * @property {int} pais - Id del país
     * @property {int} status - Status (0: Inactivo, 1: Activo)
     * @property {int} tipoDireccion - Tipo de dirección
     */

    /**
     * @typedef {object} InfoEmpresaPersona
     * @property {string} cargo - Cargo de la persona en la empresa
     * @property {string} cargoCorreo - Correo electrónico corporativo de la persona
     * @property {string} cargoTelefono - Teléfono corporativo de la persona
     * @property {string} nombre - Nombre de la persona
     * @property {int} status - Status (0: Inactivo, 1: Activo)
     * @property {int} tblEmpresas_Id - Id único de la empresa
     * @property {int} tblPersonas_Id - Id único de la persona
     * @property {int} uniqueId - Id único de la persona en la empresa
     */

    /**
     * @typedef {object} InfoDireccion
     * @property {int} ciudad - Id de la ciudad
     * @property {string} correo - Dirección de correo electrónico
     * @property {string} direccion - Detalle de la dirección
     * @property {int} estado - Id del estado
     * @property {string} googleMapsScript - Script de Google Maps para la dirección
     * @property {int} modo - Modo del vínculo
     * @property {int} municipio - Id del municipio
     * @property {int} pais - Id del país
     * @property {int} parroquia - Id de la parroquia
     * @property {string} referencia - Punto de referencia para llegar a la dirección
     * @property {int} status - Status (0: Inactivo, 1: Activo)
     * @property {string} telefono1 - Teléfono 1
     * @property {string} telefono2 - Teléfono 2 (Opcional)
     * @property {int} tipoDireccion - Id del tipo de dirección
     * @property {string} tipoDireccionDescripcion - Texto descriptivo del tipo de dirección
     * @property {int} uniqueId - Id único de la dirección
     * @property {int} vinculoId - Id único de la empresa o persona a quien pertenece la dirección
     */

    /**
     * @typedef {object} InfoPersona
     * @property {string} apellido - Apellido de la persona
     * @property {string} identidad - Documento de identidad
     * @property {string} nombre - Nombre de la persona
     * @property {int} status - Status (0: Inactivo, 1: Activo)
     * @property {int} tipoDocumento - Id del tipo de documento
     * @property {int} tipoJuridico - Id del tipo jurídico
     * @property {int} tipoPersona - Id del tipo de persona
     * @property {int} uniqueId - Id único de la persona
     */

    /**
     * @typedef {object} GetMenuItemCollectionResult
     * @property {ResultadoOperacion} operacion
     * @property {MenuItem[]} items 
     */

    /**
     * @typedef {object} GetInfoEmpresaResult
     * @property {ResultadoOperacion} operacion
     * @property {InfoEmpresa} resultado
     */

    /**
     * @typedef {object} GetEmpresaDireccionResult
     * @property {ResultadoOperacion} operacion
     * @property {InfoEmpresaDireccion} resultado
     */

    /**
     * @typedef {object} GetEmpresaDireccionesResult
     * @property {ResultadoOperacion} operacion
     * @property {InfoEmpresaDireccion[]} items
     */

    /**
     * @typedef {object} GetEmpresaPersonaResult
     * @property {ResultadoOperacion} operacion
     * @property {InfoEmpresaPersona} resultado
     */

    /**
     * @typedef {object} GetEmpresaPersonasResult
     * @property {ResultadoOperacion} operacion
     * @property {InfoEmpresaPersona[]} items
     */

    /**
     * @typedef {object} GetDireccionResult
     * @property {ResultadoOperacion} operacion
     * @property {InfoDireccion} info
     */

    /**
     * @typedef {object} GetPersonaResult
     * @property {ResultadoOperacion} operacion
     * @property {InfoPersona} info
     */

    /**
     * @class Demografico
     * Contiene las rutinas de consumo demográfico del API de CTC.
     */
    class Demografico {

        /**
         * @constructor
         * @param {string} ApiKey Llave de seguridad.
         */
        constructor(ApiKey) {
            console.log("Ctc Demografico Client.");
            this.apiRoot = "https://ctc-demografico.psweb.me/";
            this.apiVersion = "0.0.0.0";
            this.apiOnline = false;
            this.apiKey = ApiKey;
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
            console.log("CTC Demografico Versión " + this.apiVersion);
        }

        /**
         * Obtiene la versión actual del API CTC.
         * @returns {string} Versión actual del API.
         */
        getCurrentVersion() {
            return this.apiVersion;        
        }

        /**
         * Obtiene el listado de tipos de personas juridicas.
         * @returns {GetMenuItemCollectionResult} Listado de tipos.
         */
        getComboTiposJuridicoEmpresas() {
            if (this.apiOnline) {
                return $fetch(`${this.apiRoot}empresas/cbotje/${this.apiKey}`);
            } else {
                return null;
            }
        }

        /**
         * Obtiene el listado de tipos de documento.
         * @returns {GetMenuItemCollectionResult} Listado de tipos.
         */
        getComboTiposDocumento() {
            if (this.apiOnline) {
                return $fetch(`${this.apiRoot}empresas/cbotd/${this.apiKey}`);
            } else {
                return null;
            }
        }

        /**
         * Obtiene la información de una empresa.
         * @param {*} id Id único de la empresa.
         * @returns {GetInfoEmpresaResult} Información de la empresa.
         */
        getEmpresa(id) {
            if (this.apiOnline) {
                return $fetch(`${this.apiRoot}empresas/get/${id}/${this.apiKey}`);
            } else {
                return null;
            }
        }

        /**
         * Obtiene el detalle de una dirección de la empresa.
         * @param {int} empresaId Id único de la empresa a consultar.
         * @returns {GetEmpresaDireccionResult} Información de la dirección.
         */
        getEmpresaDireccion(empresaId) {
            if (this.apiOnline) {
                return $fetch(`${this.apiRoot}empresas/geted/${empresaId}/${this.apiKey}`);
            } else {
                return null;
            }
        }

        /**
         * Obtiene la lista de direcciones de la empresa.
         * @param {int} empresaId Id único de la empresa a consultar.
         * @returns {GetEmpresaDireccionesResult} Listado de direcciones.
         */
        getEmpresaDirecciones(empresaId) {
            if (this.apiOnline) {
                return $fetch(`${this.apiRoot}empresas/actived/${empresaId}/${this.apiKey}`);
            } else {
                return null;
            }
        }

        /**
         * Obtiene la información de una persona vinculada a la empresa.
         * @param {int} id Id de la persona a consultar.
         * @returns {GetEmpresaPersonaResult} Detalle de la persona.
         */
        getEmpresaPersona(id) {
            if (this.apiOnline) {
                return $fetch(`${this.apiRoot}empresas/getep/${id}/${this.apiKey}`);
            } else {
                return null;
            }
        }

        /**
         * Obtiene el listado de las personas vinculadas a una empresa.
         * @param {int} empresaId Id de la empresa a consultar.
         * @returns {GetEmpresaPersonasResult} Listado de las personas vinculadas a la empresa.
         */
        getEmpresaPersonas(empresaId) {
            if (this.apiOnline) {
                return $fetch(`${this.apiRoot}empresas/activeep/${empresaId}/${this.apiKey}`);
            } else {
                return null;
            }
        }

        /**
         * Obtiene el detalle de una dirección.
         * @param {int} id Id de la dirección a consultar.
         * @returns {GetDireccionResult} Detalle de la dirección.
         */
        getDireccion(id) {
            if (this.apiOnline) {
                return $fetch(`${this.apiRoot}direcciones/get/${id}/${this.apiKey}`);
            } else {
                return null;
            }
        }

        /**
         * Obtiene el listado de tipos de personas.
         * @returns {GetMenuItemCollectionResult} Listado de tipos.
         */
        getComboTiposPersonas() {
            if (this.apiOnline) {
                return $fetch(`${this.apiRoot}personas/cbotp/${this.apiKey}`);
            } else {
                return null;
            }
        }

        /**
         * Obtiene el listado de tipos de persona jurídica.
         * @returns {GetMenuItemCollectionResult} Listado de tipos.
         */
        getComboTiposJuridico() {
            if (this.apiOnline) {
                return $fetch(`${this.apiRoot}personas/cbotj/${this.apiKey}`);
            } else {
                return null;
            }
        }

        /**
         * Obtiene el listado de tipos de documento de personas.
         * @returns {GetMenuItemCollectionResult} Listado de tipos.
         */
        getComboTiposDocumento() {
            if (this.apiOnline) {
                return $fetch(`${this.apiRoot}personas/cbotd/${this.apiKey}`);
            } else {
                return null;
            }
        }

        /**
         * Obtiene la información de una persona.
         * @param {int} id Id único de la persona a consultar.
         * @returns {GetPersonaResult} Información de la persona.
         */
        getPersona(id) {
            if (this.apiOnline) {
                return $fetch(`${this.apiRoot}personas/get/${id}/${this.apiKey}`);
            } else {
                return null;
            }
        }

        /**
         * Obtiene la información de una dirección de una persona.
         * @param {int} id Id de la dirección a dirección.
         * @returns {GetEmpresaDireccionResult} Detalle de la dirección.
         */
        getPersonaDireccion(id) {
            if (this.apiOnline) {
                return $fetch(`${this.apiRoot}personas/getpd/${id}/${this.apiKey}`);
            } else {
                return null;
            }        
        }

        /**
         * Obtiene las direcciones de una persona.
         * @param {int} personaId Id de la persona a consultar.
         * @returns {GetEmpresaDireccionesResult} Listado de direcciones.
         */
        getPersonaDirecciones(personaId) {
            if (this.apiOnline) {
                return $fetch(`${this.apiRoot}personas/activepd/${personaId}/${this.apiKey}`);
            } else {
                return null;
            }
        }
    }

    const demograficoClient = new Demografico(config.public.pswebKey);
    await demograficoClient.init();
    nuxtApp.provide('demografico', demograficoClient);
});