import { createApp } from 'vue'
import { VueDapp } from "vue-dapp";
import router from './router/index';
import App from './App.vue'
import PrimeVue from 'primevue/config';
import 'primevue/resources/themes/saga-green/theme.css'      //theme
import 'primevue/resources/primevue.min.css';                 //core css
import 'primeicons/primeicons.css';                           //icons

import Button from 'primevue/button';

const app = createApp(App);
app.use(VueDapp);
app.use(PrimeVue);
app.use(router);

app.component('Button', Button);
app.mount('#app')
