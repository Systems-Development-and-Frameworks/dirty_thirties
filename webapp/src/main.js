import Vue from 'vue'
import App from './App.vue'

//this is set to false to prevent the production tip on Vue startup
Vue.config.productionTip = false

//creating a new Vue
new Vue({render: h => h(App),}).$mount('#app')
