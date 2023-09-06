export default defineNuxtConfig({
    app: {
        pageTransition: { name: 'page', mode: 'out-in' },
        head: {
            title: 'Alexis Balayre - Full Stack Web and Blockchain Developer | Data Engineer',
            htmlAttrs: {
              lang: 'en'
            },
            meta: [
              { charset: 'utf-8' },
              { name: 'viewport', content: 'width=device-width, initial-scale=1 viewport-fit=cover' },
              { hid: 'description', name: 'description', content: 'Data engineer and full stack Web and Blockchain developer specialized in Web3 (Smart Contracts, DApp).', id:"__meta-description"  },
              { name: 'format-detection', content: 'telephone=no' },
              { hid: 'og:type', name: 'og:type', content: 'website' },
              { hid: 'og:site_name', name: 'og:site_name', content: 'Alexis Balayre - Full Stack Web and Blockchain Developer | Data Engineer' },
              { hid: 'og:title', name: 'og:title', content: 'Alexis Balayre - Full Stack Web and Blockchain Developer | Data Engineer' },
              { hid: 'og:description', name: 'og:description', content: 'Data engineer and full stack Web and Blockchain developer specialized in Web3 (Smart Contracts, DApp).', id:"__meta-og:description" },
              { hid: 'og:image', name: 'og:image', content: 'https://alexis.balayre.com/preview.png' },
              { hid: 'twitter:card', name: 'twitter:card', content: 'summary_large_image' },
              { hid: 'twitter:site', name: 'twitter:site', content: '@Belas_Eth' },
              { hid: 'twitter:title', name: 'twitter:title', content: 'Alexis Balayre' },
              { hid: 'twitter:description', name: 'twitter:description', content: 'Data engineer and full stack Web and Blockchain developer specialized in Web3 (Smart Contracts, DApp).', id:"__meta-twitter:description" },
              { hid: 'twitter:image', name: 'twitter:image', content: 'https://alexis.balayre.com/preview.png' },
              { hid: 'keywords', name: 'keywords', content: 'Alexis Balayre, Blockchain, Solidity, Web3, Developer, Full Stack, Ethereum, DApp, Smart Contracts, Data, Data Engineer' },

            ],
            link: [
              { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
              { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
              { rel: 'icon', sizes: '32x32', href: '/favicon-32x32.png' },
              { rel: 'icon', sizes: '16x16', href: '/favicon-16x16.png' },
              { rel: 'manifest', href: '/site.webmanifest' },
              { rel: 'canonical', href: 'https://alexis.balayre.com/' },
            ],
            script: [
              {
                src: "https://cdn.jsdelivr.net/npm/alpinejs@3.13.0/dist/cdn.min.js",
                defer: true,
              }
            ]
        },
    },

    css: [
      '~/assets/css/main.css',
      '~/assets/css/timeline.css',
    ],

    plugins: [
      '~/plugins/fontawesome.ts'
    ],

    postcss: {
        plugins: {
            tailwindcss: {},
            autoprefixer: {},
        },
    },

})