import ContactsList from "./components/ContactsList.vue";
import Welcome from './components/welcome.vue';

const route = [
    {path: '/', name: 'welcome', component: Welcome},
    {path: '/contacts', name: 'contacts', component: ContactsList}
];

export default route;
