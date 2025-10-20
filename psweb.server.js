// plugins/psweb.server.js

export default defineNuxtPlugin(async (nuxtApp) => {
  // Este código se ejecuta solo en el servidor gracias al sufijo `.server` en el nombre del archivo.
  if (process.server) {
    const config = useRuntimeConfig();

    // Construye la URL completa de forma segura usando las claves públicas del .env
    const scriptUrl = `https://api.psweb.me/blob/ssi/${config.public.pswebKey}/${config.public.pswebId}/CustomLinksJS`;
    const scriptHUrl = `https://api.psweb.me/blob/ssi/${config.public.pswebKey}/${config.public.pswebId}/CustomLinksHeaderJS`;
    const scriptCUrl = `https://api.psweb.me/blob/ssi/${config.public.pswebKey}/${config.public.pswebId}/CustomLinksCss`;
    
    try {
      const response = await $fetch(scriptUrl);
      const scriptRegex = /<script\s+src="([^"]+)"/g;
      const scripts = [];
      let match;
      let items = 0;

      while ((match = scriptRegex.exec(response)) !== null) {
        // match[1] contiene el valor del atributo src
        scripts.push({ src: match[1], tagPosition: 'bodyClose' });
        items++;
      }
      console.log(`${items} scripts al cierre.`);
      items = 0;

      // useHead() se usa para manipular el head de la página en el servidor
      // Nuxt fusionará estos scripts con los que ya existen en nuxt.config.ts
      useHead({
        script: scripts
      });

      const responseH = await $fetch(scriptHUrl);
      const scriptsH = [];
      let matchH;

      while ((matchH = scriptRegex.exec(responseH)) !== null) {
        // match[1]
        scriptsH.push({ src: matchH[1] });
        items++;
      }
      console.log(`${items} scripts al inicio.`);
      items = 0;

      useHead({
        script: scripts
      });

      const responseC = await $fetch(scriptCUrl);
      const cssRegex = /<link\s+rel="stylesheet"\s+href="([^"]+)"/g
      const css = [];
      let matchC;

      while ((matchC = cssRegex.exec(responseC)) !== null) {
        // match[1]
        css.push({ rel: 'stylesheet', href: matchC[1] });
        items++;
      }
      console.log(`${items} hojas de estilo.`);
      items = 0;
      useHead({
        link: css
      });

    } catch (error) {
      console.error('Error al cargar los scripts de psweb:', error);
    }
  }
});
