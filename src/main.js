import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import "@/styles/index.scss"; // global css
import "@/icons"; // icon
import "@/permission"; // permission control

import "normalize.css/normalize.css"; // a modern alternative to CSS resets
import "@/styles/element-variables.scss";
import "@/styles/index.scss"; // global css

Vue.config.productionTip = false;
Vue.use(ElementUI);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
