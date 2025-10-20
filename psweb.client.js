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
                        const response = await $fetch(`${this.apiRoot}websites/version/${this.apiId}/${this.apiKey}`);
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
         * Agrega un comentario al sitio web.
         * @param {string} nombre - Nombre del usuario que comenta.
         * @param {string} empresa - Empresa del usuario que comenta.
         * @param {string} correo - Correo electrónico del usuario que comenta.
         * @param {string} telefono - Teléfono del usuario que comenta.
         * @param {string} comentarios - El comentario del usuario.
         * @returns 
         */
        addComentario(nombre, empresa, correo, telefono, comentarios) {
            if (this.apiOnline) {
                return $fetch(`${this.apiRoot}websites/comment/${this.apiId}/${this.apiKey}`, {
                    method: "POST",
                    body: { nombre, empresa, correo, telefono, comentarios }
                });
            } else {
                return null;
            }
        }

        /**
         * Obtiene el texto canónico para SEO.
         * @param {string} texto - El texto a convertir.
         * @returns {Promise<string|null>} El texto canónico o null si la API no está en línea.
         */
        getCannonical(texto) {
            if (this.apiOnline) {
                return $fetch(`${this.apiRoot}websites/cannonical/${this.apiId}/${this.apiKey}`, {
                    method: "POST",
                    body: { texto }
                });
            } else {
                return null;
            }
        }

        /**
         * Obtiene un valor de configuración global de Portal Services.
         * @param {string} clave - La clave de la configuración a obtener.
         * @returns {Promise<string>} El valor de la configuración o "#N/A" si la API no está en línea. 
         */
        getSetting(clave) {
            if (this.apiOnline){
                var url = `${this.apiRoot}websites/settings/${this.apiId}/${this.apiKey}/${clave}`;
                return $fetch(url);
            } else {
                return "#N/A"
            }
        }

        /**
         * Obtiene un valor de configuración específico del sitio web. 
         * @param {string} clave - La clave de la configuración a obtener.
         * @returns {Promise<string>} El valor de la configuración o "#N/A" si la API no está en línea.
         */
        getConfig(clave) {
            if (this.apiOnline){
                return $fetch(`${this.apiRoot}websites/config/${this.apiId}/${this.apiKey}/${clave}`);
            } else {
                return "#N/A"
            }
        }

        /**
         * Obtiene los elementos del menú del sitio web.
         * @returns {Promise<Array|null>} Un array con los elementos del menú o null si la API no está en línea. 
         */
        getMenuItems() {
            if (this.apiOnline) {
                return $fetch(`${this.apiRoot}websites/menu/${this.apiId}/${this.apiKey}`);
            } else {
                return null;
            }
        }

        /**
         * Obtiene los datos de una página específica por su ID.
         * @param {int} id - El ID de la página a obtener.
         * @returns {Promise<Object|null>} Un objeto con los datos de la página o null si la API no está en línea.
         */
        getPagina(id) {
            if (this.apiOnline) {
                return $fetch(`${this.apiRoot}paginas/get/${this.apiId}/${this.apiKey}/${id}`);
            } else {
                return null;
            }
        }

        /**
         * Obtiene las páginas hijas de una página específica.
         * @param {int} id - El ID de la página padre.
         * @param {int} tipo - El tipo de páginas a obtener (1=Páginas personalizadas, 2=Catálogos de contenido, 3=Todos los hijos, 4=Entradas de blog (solo para id=0)). Por defecto es 3.
         * @returns {Promise<Array|null>} Un array con las páginas hijas o null si la API no está en línea.
         */
        getPaginaChilds(id, tipo = 3) {
            if (this.apiOnline) {
                return $fetch(`${this.apiRoot}paginas/active/${this.apiId}/${this.apiKey}/${id}/${tipo}`);
            } else {
                return null;
            }
        }

        /**
         * Obtiene un campo específico de una página por su clave.
         * @param {string} key - La clave de la página.
         * @param {string} field - El campo específico a obtener (por ejemplo, "Titulo", "Contenido", "Keywords", etc.).
         * @returns {Promise<string|null>} El valor del campo solicitado o null si la API no está en línea.
         */
        getPaginaField(key, field) {
            if (this.apiOnline) {
                return $fetch(`${this.apiRoot}paginas/field/${this.apiId}/${this.apiKey}/${key}/${field}`);
            } else {
                return null;
            }
        }

        /**
         * Actualiza el contador de vistas de una página específica.
         * @param {int} id - El ID de la página a actualizar.
         */
        updatePaginaVisto(id) {
            if (this.apiOnline) {
                return $fetch(`${this.apiRoot}paginas/visto/${this.apiId}/${this.apiKey}/${id}`);
            } else {
                return null;
            }            
        }

        /**
         * Obtiene un elemento de galería por su ID.
         * @param {int} id - El ID del elemento de galería a obtener.
         * @returns {Promise<Object|null>} Un objeto con los datos del elemento de galería o null si la API no está en línea.
         */
        getGaleriaItem(id) {
            if (this.apiOnline) {
                return $fetch(`${this.apiRoot}galeria/get/${this.apiId}/${this.apiKey}/${id}`);
            } else {
                return null;
            }
        }

        /**
         * Obtiene los elementos de una galería específica por su ID de página.
         * @param {int} id - El ID de la página contenedora.
         * @returns {Promise<Array|null>} Un array con los elementos de la galería o null si la API no está en línea.
         */
        getGaleria(id) {
            if (this.apiOnline) {
                return $fetch(`${this.apiRoot}galeria/active/${this.apiId}/${this.apiKey}/${id}`);
            } else {
                return null;
            }
        }

        /**
         * Obtiene todos los elementos de galería del sitio web.
         * @param {int} tipo - El tipo de elementos a obtener. Por defecto es 2.
         * @returns {Promise<Array|null>} Un array con todos los elementos de galería o null si la API no está en línea.
         */
        getGaleriaAll(tipo = 2) {
            if (this.apiOnline) {
                return $fetch(`${this.apiRoot}galeria/all/${this.apiId}/${this.apiKey}/${tipo}`);
            } else {
                return null;
            }
        }

        /**
         * Obtiene una categoría de FAQ por su ID.
         * @param {int} id - El ID de la categoría de FAQ a obtener.
         * @returns {Promise<Object|null>} Un objeto con los datos de la categoría de FAQ o null si la API no está en línea.
         */
        getFaqCategoria(id) {
            if (this.apiOnline) {
                return $fetch(`${this.apiRoot}faqCategorias/get/${this.apiId}/${this.apiKey}/${id}`);
            } else {
                return null;
            }
        }

        /**
         * Obtiene las categorías de FAQ activas del sitio web.
         * @returns {Promise<Array|null>} Un array con las categorías de FAQ activas o null si la API no está en línea.
         */
        getFaqCategorias() {
            if (this.apiOnline) {
                return $fetch(`${this.apiRoot}faqCategorias/active/${this.apiId}/${this.apiKey}`);
            } else {
                return null;
            }
        }

        /**
         * Obtiene las categorías hijas de una categoría de FAQ específica.
         * @param {int} id - El ID de la categoría padre.
         * @returns {Promise<Array|null>} Un array con las categorías hijas o null si la API no está en línea.
         */
        getFaqCategoriaChildren(id) {
            if (this.apiOnline) {
                return $fetch(`${this.apiRoot}faqCategorias/children/${this.apiId}/${this.apiKey}/${id}`);
            } else {
                return null;
            }
        }

        /**
         * Verifica si las categorías de FAQ están habilitadas en el sitio web.
         * @returns {Promise<boolean|null>} True si están habilitadas, false si no, o null si la API no está en línea.
         */
        isFaqCategoriasEnabled() {
            if (this.apiOnline) {
                return $fetch(`${this.apiRoot}faqCategorias/enabled/${this.apiId}/${this.apiKey}`);
            } else {
                return null;
            }            
        }

        /**
         * Obtiene una FAQ específica por su ID.
         * @param {int} id - El ID de la FAQ a obtener.
         * @returns {Promise<Object|null>} Un objeto con los datos de la FAQ o null si la API no está en línea.
         */
        getFaq(id) {
            if (this.apiOnline) {
                return $fetch(`${this.apiRoot}faq/get/${this.apiId}/${this.apiKey}/${id}`);
            } else {
                return null;
            }
        }

        /**
         * Obtiene las FAQs activas de una categoría específica.
         * @param {int} id - El ID de la categoría de FAQ.
         * @returns {Promise<Array|null>} Un array con las FAQs activas o null si la API no está en línea.
         */
        getFaqs(id) {
            if (this.apiOnline) {
                return $fetch(`${this.apiRoot}faq/active/${this.apiId}/${this.apiKey}/${id}`);
            } else {
                return null;
            }
        }

        /**
         * Obtiene la encuesta actual del sitio web.
         * @returns {Promise<Object|null>} Un objeto con los datos de la encuesta actual o null si la API no está en línea.
         */
        getCurrentEncuesta() {
            if (this.apiOnline) {
                return $fetch(`${this.apiRoot}encuestas/current/${this.apiId}/${this.apiKey}`);
            } else {
                return null;
            }
        }

        /**
         * Obtiene las encuestas activas del sitio web.
         * @returns {Promise<Array|null>} Un array con las encuestas activas o null si la API no está en línea.
         */
        getEncuestas() {
            if (this.apiOnline) {
                return $fetch(`${this.apiRoot}encuestas/active/${this.apiId}/${this.apiKey}`);
            } else {
                return null;
            }
        }

        /**
         * Obtiene una categoría de archivos descargables por su ID.
         * @param {int} id - El ID de la categoría de archivos a obtener.
         * @returns {Promise<Object|null>} Un objeto con los datos de la categoría de archivos o null si la API no está en línea.
         */
        getArchivoCategoria(id) {
            if (this.apiOnline) {
                return $fetch(`${this.apiRoot}archivosCategorias/get/${this.apiId}/${this.apiKey}/${id}`);
            } else {
                return null;
            }
        }

        /**
         * Verifica si las categorías de archivos están habilitadas en el sitio web.
         * @returns {Promise<boolean|null>} True si están habilitadas, false si no, o null si la API no está en línea.
         */
        isArchivoCategoriasEnabled() {
            if (this.apiOnline) {
                return $fetch(`${this.apiRoot}archivosCategorias/enabled/${this.apiId}/${this.apiKey}`);
            } else {
                return null;
            }
        }

        /**
         * Obtiene las subcategorías hijas de una categoría de archivos específica.
         * @param {int} id - El ID de la categoría padre.
         * @returns {Promise<Array|null>} Un array con las subcategorías hijas o null si la API no está en línea.
         */
        getArchivoCategoriaChilds(id) {
            if (this.apiOnline) {
                return $fetch(`${this.apiRoot}archivosCategorias/children/${this.apiId}/${this.apiKey}/${id}`);
            } else {
                return null;
            }
        }

        /**
         * Obtiene un archivo específico por su ID.
         * @param {int} id - El ID del archivo a obtener.
         * @returns {Promise<Object|null>} Un objeto con los datos del archivo o null si la API no está en línea.
         */
        getArchivo(id) {
            if (this.apiOnline) {
                return $fetch(`${this.apiRoot}archivos/get/${this.apiId}/${this.apiKey}/${id}`);
            } else {
                return null;
            }
        }

        /**
         * Obtiene los archivos activos de una categoría específica.
         * @param {int} id - El ID de la categoría de archivos.
         * @returns {Promise<Array|null>} Un array con los archivos activos o null si la API no está en línea.
         */
        getArchivos(id) {
            if (this.apiOnline) {
                return $fetch(`${this.apiRoot}archivos/active/${this.apiId}/${this.apiKey}/${id}`);
            } else {
                return null;
            }
        }

        /**
         * Obtiene los archivos más descargados de una categoría.
         * @param {int} id - El ID de la categoría de archivos. 
         * @returns {Promise<Array|null>} Un array con los archivos más descargados o null si la API no está en línea.
         */
        getArchivosPopulares(id) {
            if (this.apiOnline) {
                return $fetch(`${this.apiRoot}archivos/popular/${this.apiId}/${this.apiKey}/${id}`);
            } else {
                return null;
            }
        }

        /**
         * Obtiene los archivos más recientes del sitio web.
         * @returns {Promise<Array|null>} Un array con los archivos más recientes o null si la API no está en línea.
         */
        getArchivosRecientes() {
            if (this.apiOnline) {
                return $fetch(`${this.apiRoot}archivos/recent/${this.apiId}/${this.apiKey}`);
            } else {
                return null;
            }
        }

        /**
         * Actualiza el contador de descargas de un archivo específico.
         * @param {int} id - El ID del archivo a actualizar.
         */
        updateArchivoDescargado(id) {
            if (this.apiOnline) {
                return $fetch(`${this.apiRoot}archivos/update/${this.apiId}/${this.apiKey}/${id}`);
            } else {
                return null;
            }        
        }

        /**
         * Actualiza el título de la página en el navegador.
         * @param {string} title - El nuevo título de la página, se le agregará al final el nombre del sitio web.
         */
        async setTitle(title) {
            const websiteName = await this.getConfig("WebsiteName");
            useHead({ title: title + ' - ' + websiteName });
        }

        /**
         * Actualiza las meta etiquetas para SEO y redes sociales.
         * @param {string} title Titulo de la página, se le agregará al final el nombre del sitio web.
         * @param {string} description Descripción de la página.
         * @param {string} keywords Palabras clave separadas por comas.
         * @param {string} imageUrl URL de la imagen representativa.
         * @param {string} path Ruta relativa de la página, se le agregará al inicio la raíz configurada en PSWeb para el sitio web.
         */
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

        /**
         * Elimina las etiquetas innecesarias generadas por el editor.
         * @param {string} html Texto a limpiar.
         * @returns Contenido útil del HTML.
         */
        removeUnnecesaryTags(html) {
            return html.replace('<!DOCTYPE html>', '')
                .replace('<html>', '')
                .replace('<head>', '')
                .replace('</head>', '')
                .replace('<body>', '')
                .replace('</body>', '')
                .replace('</html>', '')
                .replace('<script', '[script]')
                .replace('</script', '[/script]');
        }

        getFechaPublicacion(date) {
            const valor = date;
            if (!valor) return '';
      
            const fecha = new Date(valor);
      
            // Opciones de formateo (para DD-MM-YYYY)
            const partes = fecha.toLocaleDateString('es-ES', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit'
            }).split('/');
      
            const fechaStr = `${partes[0]}-${partes[1]}-${partes[2]}`; // DD-MM-YYYY
      
            // Opciones de formateo (para HH:mm:ss)
            const horaStr = fecha.toLocaleTimeString('es-ES', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false
            });

            return `Publicado el ${fechaStr} a las ${horaStr}`;
        }

        fechaDiaMes(fecha) {
            const dateObj = new Date(fecha);
            if (isNaN(dateObj)) {
                return "Fecha inválida"; 
            }
            const opciones = {
                day: 'numeric',
                month: 'short'
            };
            const resultado = dateObj.toLocaleDateString('es-ES', opciones);
            return resultado.replace(' de ', ' ').replace('.', '');
        }

        fechaAnio(fecha) {
            const dateObj = new Date(fecha);
            if (isNaN(dateObj)) {
                return "Fecha inválida"; 
            }
            const anio = dateObj.getFullYear();
            return String(anio);
        }

        getCanonico(title) {
            if (!title) return '';
            return String(title)
                .toLowerCase()
                .trim()
                .replace(/\s+/g, '-')       // Reemplaza espacios por guiones
                .replace(/[^\w\-]+/g, '')   // Remueve caracteres no alfanuméricos (excepto guiones)
                .replace(/\-\-+/g, '-')     // Reemplaza múltiples guiones por uno solo
                .replace(/^-+/, '')         // Remueve guiones al inicio
                .replace(/-+$/, '');        // Remueve guiones al final
        }

        imageUrlBase() {
            return 'https://contents.lncproducciones.com/gallery/get/';
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
