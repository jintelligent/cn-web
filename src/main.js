// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'babel-polyfill'

import Vue from 'vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import App from './App'
import router from './router'
//vue-quill-editor
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

import axios from 'axios'
Vue.use(ElementUI);
Vue.use(VueQuillEditor)
Vue.config.productionTip = false
Vue.prototype.$http = axios;

import echarts from 'echarts';
Vue.prototype.$echarts = echarts
import china from 'echarts/map/json/china.json'
echarts.registerMap('china', china)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
