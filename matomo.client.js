// plugins/matomo.client.js

// Este plugin se ejecuta solo en el navegador (en el cliente)
// y está diseñado para inicializar el script de Matomo Analytics.

export default defineNuxtPlugin((nuxtApp) => {
  // Obtenemos la configuración de tiempo de ejecución.
  // 'matomoId' está disponible aquí porque se definió como público en nuxt.config.ts
  const config = useRuntimeConfig();

  // Verificamos si existe el ID de Matomo para evitar errores.
  const matomoId = config.public.matomoId;
  if (!matomoId) {
    console.warn('Matomo Analytics no se ha inicializado. Falta el ID del sitio web (NUXT_PUBLIC_MATOMO_ID).');
    return;
  }

  // Obtenemos la URL del sitio web de Matomo.
  // Puedes usar una variable de entorno para esto también si es necesario.
  const matomoUrl = 'https://analytics.lncproducciones.com/';

  // Usamos useHead() para inyectar dinámicamente el script de seguimiento de Matomo
  // en el <head> de la página.
  useHead({
    script: [
      {
        // La propiedad 'innerHTML' nos permite agregar el script completo.
        innerHTML: `
          var _paq = window._paq = window._paq || [];
          /* tracker methods like "setCustomDimension" should be called before "trackPageView" */
          _paq.push(['trackPageView']);
          _paq.push(['enableLinkTracking']);
          (function() {
            var u="${matomoUrl}";
            _paq.push(['setTrackerUrl', u+'matomo.php']);
            _paq.push(['setSiteId', '${matomoId}']);
            var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
            g.type='text/javascript'; g.async=true; g.src=u+'matomo.js'; s.parentNode.insertBefore(g,s);
          })();
        `,
        // Evitamos que se agregue como un script externo.
        type: 'text/javascript'
      }
    ]
  });
});
