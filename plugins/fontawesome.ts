import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'


export default defineNuxtPlugin(nuxtApp => {
    library.add(fas)
    nuxtApp.vueApp.component('font-awesome-icon', FontAwesomeIcon)
})

