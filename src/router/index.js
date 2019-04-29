import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'

// 路由页面导入
import login from '@/components/Login.vue'
import home from '@/components/Home.vue'
// import error from '@/components/404.vue'  //404错误
import map from '@/components/Map.vue'  //地图
// import manage from '@/components/manage/manage.vue'
var manage = resolve => require(['@/components/manage/manage.vue'], resolve)
// var detail = resolve => require(['../components/manage/detail.vue'], resolve)

var role = resolve => require(['@/components/role/role.vue'], resolve)
var roleLimit = resolve => require(['@/components/role/roleLimit.vue'], resolve)
// var power = resolve => require(['../components/role/power.vue'], resolve)

var user = resolve => require(['../components/user/userList.vue'], resolve)
var notes = resolve => require(['../components/study_notes/study_notes.vue'], resolve)
var notesEdit = resolve => require(['../components/study_notes/notesEdit.vue'], resolve)
var notesAdd = resolve => require(['../components/study_notes/notesAdd.vue'], resolve)

var upload = resolve => require(['@/components/file/upload.vue'], resolve)
//待办事项
var schedule = resolve => require(['@/components/schedule/scheduleList.vue'], resolve)

var dashboard = resolve => require(['@/components/dashboard/dashboard.vue'], resolve)

// 懒加载方式，当路由被访问的时候才加载对应组件
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/login',
    },
    {
      path: '/login',
      name: '登录',
      component: login
    },
    {
      path: '/home',
      name: '首页',
      component: home,
      children: [
        // 404
        { path: '/map', component: map, name: '地图' },
        // manage
        { path: '/manage', component: manage, name: '管理员管理', },
        // role
        { path: '/role', component: role, name: '权限管理' },
        { path: '/role/rolelimit/:id', component: roleLimit, name: '权限设置' },
        // banner
        { path: '/user', component: user, name: '人员管理' },
        // productList
        { path: '/notes', component: notes, name: '学习笔记' },
        { path: '/notes/notesEdit/:id', component: notesEdit, name: '编辑笔记' },
        { path: '/notes/notesAdd', component: notesAdd, name: '添加笔记' },        

        //文件上传
        { path: '/upload', component: upload, name: '上传' },
        //待办事项
        { path: '/schedule', component: schedule, name: '日程安排' },

        { path: '/dashboard', component: dashboard, name: '首页展示' },
        
      ]
    },
  ]
})
