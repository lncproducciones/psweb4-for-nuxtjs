// plugins/psweb.client.js

/**
 * Este plugin implementa las funcionalidades del API de Portal Services
 * para web, reemplazando las llamadas a $.ajax con $fetch de Nuxt.
 * Se ejecuta solo en el cliente.
 */

export default defineNuxtPlugin(async (nuxtApp) => {
    // Obtenemos las variables públicas de entorno del archivo nuxt.config.ts
    const config = useRuntimeConfig();

    /**
     * @class Website
     * Contiene las rutinas para consumir el API de Portal Services.
     */
    class Website {

        /**
         * @constructor
         * @param {string} apiId - El ID del sitio web.
         * @param {string} apiKey - La clave del sitio web.
         */
        constructor(apiId, apiKey) {
            console.log("PSWeb4 for Nuxt.js");

            this.apiId = apiId;
            this.apiKey = apiKey;
            this.apiRoot = "https://api.psweb.me/api/";
            this.apiVersion = null;
        }
        
        /**
         * Inicia la conexión con el servidor y valida la versión.
         */
        async init() {
            if (!this.apiKey) {
                console.error("*** No se ha detectado la configuración del sitio web. ***");
                window.location.href = "https://www.lncproducciones.com/web";
            }
            else {
                try {
                    const response = await $fetch(`${this.apiRoot}websites/version/${this.apiId}/${this.apiKey}`);
                    this.apiVersion = response.Resultado;
                    useHead({ meta: [ { name: 'generator', content: 'Portal Services for Web v.' + this.apiVersion } ] });
                    console.log("Versión " + this.apiVersion);
                } catch (error) {
                    console.error("Error al conectar con el servidor de la API:", error);
                }
            }
        }

        getCurrentVersion() {
            return this.apiVersion;
        }

        addComentario(nombre, empresa, correo, telefono, comentarios) {
            return $fetch(`${this.apiRoot}websites/comment/${this.apiId}/${this.apiKey}`, {
                method: "POST",
                body: { nombre, empresa, correo, telefono, comentarios }
            });
        }

        getCannonical(texto) {
            return $fetch(`${this.apiRoot}websites/cannonical/${this.apiId}/${this.apiKey}`, {
                method: "POST",
                body: { texto }
            });
        }

        getSetting(clave) {
            return $fetch(`${this.apiRoot}websites/settings/${this.apiId}/${this.apiKey}/${clave}`);
        }

        getConfig(clave) {
            return $fetch(`${this.apiRoot}websites/config/${this.apiId}/${this.apiKey}/${clave}`);
        }

        getMenuItems() {
            return $fetch(`${this.apiRoot}websites/menu/${this.apiId}/${this.apiKey}`);
        }

        getPagina(id) {
            return $fetch(`${this.apiRoot}paginas/get/${this.apiId}/${this.apiKey}/${id}`);
        }

        getPaginaChilds(id, tipo = 3) {
            return $fetch(`${this.apiRoot}paginas/active/${this.apiId}/${this.apiKey}/${id}/${tipo}`);
        }

        getPaginaField(key, field) {
            return $fetch(`${this.apiRoot}paginas/field/${this.apiId}/${this.apiKey}/${key}/${field}`);
        }

        updatePaginaVisto(id) {
            return $fetch(`${this.apiRoot}paginas/visto/${this.apiId}/${this.apiKey}/${id}`);
        }

        getGaleriaItem(id) {
            return $fetch(`${this.apiRoot}galeria/get/${this.apiId}/${this.apiKey}/${id}`);
        }

        getGaleria(id) {
            return $fetch(`${this.apiRoot}galeria/active/${this.apiId}/${this.apiKey}/${id}`);
        }

        getGaleriaAll(tipo = 2) {
            return $fetch(`${this.apiRoot}galeria/all/${this.apiId}/${this.apiKey}/${tipo}`);
        }

        getFaqCategoria(id) {
            return $fetch(`${this.apiRoot}faqCategorias/get/${this.apiId}/${this.apiKey}/${id}`);
        }

        getFaqCategorias() {
            return $fetch(`${this.apiRoot}faqCategorias/active/${this.apiId}/${this.apiKey}`);
        }

        getFaqCategoriaChildren(id) {
            return $fetch(`${this.apiRoot}faqCategorias/children/${this.apiId}/${this.apiKey}/${id}`);
        }

        isFaqCategoriasEnabled() {
            return $fetch(`${this.apiRoot}faqCategorias/enabled/${this.apiId}/${this.apiKey}`);
        }

        getFaq(id) {
            return $fetch(`${this.apiRoot}faq/get/${this.apiId}/${this.apiKey}/${id}`);
        }

        getFaqs(id) {
            return $fetch(`${this.apiRoot}faq/active/${this.apiId}/${this.apiKey}/${id}`);
        }

        getCurrentEncuesta() {
            return $fetch(`${this.apiRoot}encuestas/current/${this.apiId}/${this.apiKey}`);
        }

        getEncuestas() {
            return $fetch(`${this.apiRoot}encuestas/active/${this.apiId}/${this.apiKey}`);
        }

        getArchivoCategoria(id) {
            return $fetch(`${this.apiRoot}archivosCategorias/get/${this.apiId}/${this.apiKey}/${id}`);
        }

        isArchivoCategoriasEnabled() {
            return $fetch(`${this.apiRoot}archivosCategorias/enabled/${this.apiId}/${this.apiKey}`);
        }

        getArchivoCategoriaChilds(id) {
            return $fetch(`${this.apiRoot}archivosCategorias/children/${this.apiId}/${this.apiKey}/${id}`);
        }

        getArchivo(id) {
            return $fetch(`${this.apiRoot}archivos/get/${this.apiId}/${this.apiKey}/${id}`);
        }

        getArchivos(id) {
            return $fetch(`${this.apiRoot}archivos/active/${this.apiId}/${this.apiKey}/${id}`);
        }

        getArchivosPopulares(id) {
            return $fetch(`${this.apiRoot}archivos/popular/${this.apiId}/${this.apiKey}/${id}`);
        }

        getArchivosRecientes() {
            return $fetch(`${this.apiRoot}archivos/recent/${this.apiId}/${this.apiKey}`);
        }

        updateArchivoDescargado(id) {
            return $fetch(`${this.apiRoot}archivos/update/${this.apiId}/${this.apiKey}/${id}`);
        }

        async setTitle(title) {
            const websiteName = await this.getConfig("WebsiteName");
            useHead({ title: title + ' - ' + websiteName });
        }

        async setMetaTags(title, description, keywords, imageUrl, path) {
            const websiteName = await this.getConfig("WebsiteName");
            const websiteUrl = await this.getConfig("WebsiteUrl");
            const fullUrl = websiteUrl + path;

            useHead({
                title: title + ' - ' + websiteName,
                meta:[
                    { name: 'description', content: description },
                    { name: 'keywords', content: keywords },

                    { property: 'og:title', content: title },
                    { property: 'og:description', content: description },
                    { property: 'og:image', content: imageUrl },
                    { property: 'og:url', content: fullUrl},
                    { property: 'og:type', content: 'website' },

                    { name: 'twitter:card', content: 'summary_large_image' },
                    { name: 'twitter:title', content: title },
                    { name: 'twitter:description', content: description },
                    { name: 'twitter:image', content: imageUrl }
                ]
            });
        }
    }

    // Instanciamos la clase con las variables de entorno de Nuxt.
    const pswebClient = new Website(config.public.pswebId, config.public.pswebKey);

    // Inicializamos la conexión.
    await pswebClient.init();

    // Hacemos el cliente disponible globalmente en la aplicación de Nuxt.
    // Ahora puedes acceder a sus métodos usando `$psweb`.
    nuxtApp.provide('psweb', pswebClient);
});
