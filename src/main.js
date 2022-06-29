import { createApp } from 'vue';
import { VueDapp } from 'vue-dapp';
import { createPinia } from 'pinia';
import 'primevue/resources/themes/saga-green/theme.css'; // theme
import 'primevue/resources/primevue.min.css'; // core css
import 'primeicons/primeicons.css'; // icons
import PrimeVue from 'primevue/config';
import Dropdown from 'primevue/dropdown';
import Button from 'primevue/button';
import Divider from 'primevue/divider';
import ToastService from 'primevue/toastservice';
import InputText from 'primevue/inputtext';
import OverlayPanel from 'primevue/overlaypanel';
import Card from 'primevue/card';
import SplitButton from 'primevue/splitbutton';
import Dialog from 'primevue/dialog';
import ProgressSpinner from 'primevue/progressspinner';
import Badge from 'primevue/badge';
import router from './router/index';
import App from './App.vue';

const pinia = createPinia();

const app = createApp(App);
app.use(pinia);
app.use(router);
app.use(VueDapp);
app.use(PrimeVue);
app.use(ToastService);

app.component('PProgressSpinner', ProgressSpinner);
app.component('PBadge', Badge);
app.component('PDialog', Dialog);
app.component('PSplitButton', SplitButton);
app.component('PInputText', InputText);
app.component('PDropdown', Dropdown);
app.component('POverlayPanel', OverlayPanel);
app.component('PButton', Button);
app.component('PCard', Card);
app.component('PDivider', Divider);
app.mount('#app');
