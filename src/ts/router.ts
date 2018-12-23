import ContactsList from "./components/ContactsList.vue";
import Welcome from './components/welcome.vue';
import ChatArea from './components/ChatArea.vue';

const route = [
    {path: '/', name: 'welcome', component: Welcome},
    {path: '/contacts', name: 'contacts', component: ContactsList},
    {path: '/contacts/:target', name: 'chatArea', component: ChatArea}
];

export default route;
