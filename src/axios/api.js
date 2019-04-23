/** 
 * api接口统一管理
 */
import { get, post } from './http'

//用户挂历
export const login = p => post('/app/user/login/', p); //登录
export const register = p => post('/app/user/register', p); //登录
export const changePassWord = p => post('/app/user/changePass', p); //登录

//菜单管理
export const selectMenus = p => post('/app/menus/get', p); //菜单查询

//待办管理
export const selAllSchedule = p => post('/app/schedule/selectAll', p); //查询所有
export const delSchedule = p => post('/app/schedule/delete', p); //删除
export const saveSchedule = p => post('/app/schedule/add', p); //保存
export const updSchedule = p => post('/app/schedule/edit', p); //更新

//角色管理
export const selectRoles = p => get('app/roles/select', p); //查询所有角色
export const updateRoles = p => post('/app/roles/edit', p); //更新角色
export const insertRoles = p => post('/app/roles/save', p); //保存角色
export const updatePower = p => post('/app/roles/updatePower', p); //保存权限列表
export const selectPower = p => post('/app/roles/selectPower', p); //查询权限列表

//人员管理
export const selectAdmin = p => get('/app/user/selAllUser', p); //查询所有
export const updateAdmin = p => post('/app/user/editAdmin', p); //更新
export const insertAdmin = p => post('/app/user/addAdmin', p); //保存