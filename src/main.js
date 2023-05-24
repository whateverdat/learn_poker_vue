import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import Card from './components/Card.vue';
import SetOfCards from './components/SetOfCards.vue';
import Information from './components/Information.vue';

const app = createApp(App);

app.component('Card', Card);
app.component('SetOfCards', SetOfCards);
app.component('Information', Information);

const mountedApp = app.mount('#app');
