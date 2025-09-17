// psweb.d.ts

import { Website } from '#plugins/psweb.client';

declare module '#app' {
    interface NuxtApp {
        $psweb: Website;
    }
}

declare module 'vue' {
    interface ComponentCustomProperties {
        $psweb: Website;
    }
}

export { };