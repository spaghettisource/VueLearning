import { createApp } from 'vue';
import App from './App.vue';
import ToDoFormComponent from './components/ToDoFormComponent.vue';
import ToDoComponent from './components/ToDoComponent.vue';

// Create a Vue app instance
const app = createApp(App);

// Register components globally
app.component('ToDoFormComponent', ToDoFormComponent);
app.component('ToDoComponent', ToDoComponent);

// Mount the app to the DOM
app.mount('#app');
