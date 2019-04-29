<template>
  	<div class="login_page fillcontain">
	  	<transition name="form-fade" mode="in-out">
	  		<section class="form_contianer">
		  		<div class="manage_tip">
		  			<p>今天干了啥</p>
		  		</div>
<!--           <el-tabs type="border-card">
          <el-tab-pane label="登录"> -->
            <el-form :model="loginForm" :rules="rules" ref="loginForm">
              <el-form-item prop="username">
                <el-input v-model="loginForm.username" placeholder="用户名"></el-input>
              </el-form-item>
              <el-form-item prop="password">
                <el-input type="password" placeholder="密码" v-model="loginForm.password"></el-input>
              </el-form-item>
              <el-form-item>
                  <el-button type="primary" @click="submitForm('loginForm')" class="submit_btn">登录</el-button>
                </el-form-item>
                 <el-form-item>
                  <p>Tip:首次登陆将被注册</p>
                <!-- <router-link to="#" class="to_forget" >Tip:首次登陆将被注册</router-link> -->
              </el-form-item> 
            </el-form>
<!--           </el-tab-pane> -->
          <!--
          <el-tab-pane label="注册">
            <el-form :model="registerForm" :rules="rules2" ref="registerForm" >
              <el-form-item prop="username">
                <el-input v-model="registerForm.username" placeholder="用户名" auto-complete="off" ></el-input>
              </el-form-item>  
               <el-form-item label="性别">
                <el-select v-model="registerForm.sex" placeholder="请选择性别">
                  <el-option label="男" value="男"></el-option>
                  <el-option label="女" value="女"></el-option>
                </el-select>
              </el-form-item> 
              <el-form-item prop="password">
                <el-input type="password" placeholder="密码" v-model="registerForm.password" auto-complete="off" ></el-input>
              </el-form-item>
              <el-form-item prop="email">
                <el-input v-model="registerForm.email" placeholder="邮箱-用于找回密码"></el-input>
              </el-form-item>             
              <el-form-item label="确认密码" prop="checkPass">
                <el-input type="password" v-model="registerForm.checkPass" auto-complete="off" ></el-input>
              </el-form-item> 
               <el-form-item label="年龄" prop="age">
                <el-input v-model.number="registerForm.age" ></el-input>
              </el-form-item> 
              <el-form-item>
                <el-button type="primary" @click="resetForm('registerForm')" class="submit_btn">注册</el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>-->
<!--         </el-tabs> -->
		    	
	  		</section>
	  	</transition>
  	</div>
</template>

<script>
import md5 from "js-md5";
import axios from 'axios';
import { login, register } from '@/axios/api';// 导入我们的api接口
export default {
  data() {
    return {
      registerForm: {
          username: '',
          email: '',
          password: ''
        },
        rules2: {
          username: [
            { required: true, message: '请输入用户名', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' }
          ],
          email:[
            { required: true, message: '请输入邮箱地址', trigger: 'blur' },
            { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur','change'] }
          ]
        },
      loginForm: {
        username: "",
        password: ""
      },
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" }
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }]
      }
    };
  },

  methods: {
      
      async submitForm (formName) {
        //表单验证
        await this.$refs[formName].validate()
        register({
          'username': this.loginForm.username,
          'password': md5(this.loginForm.password)
        }).then(res => {
          //控制跳转
          if(res.returnCode == '1111'){
            sessionStorage.setItem("username", this.loginForm.username)
            sessionStorage.setItem("token", res.token)
            this.$router.push({path: '/dashboard'})
            
          }else if(res.returnCode == '0000'){
            this.$message.warning(res.returnMessage);
          }else{
            this.$message.error(res.returnMessage);
          }
        })
    },

    async resetForm (formName) {

        // 表单验证
        await this.$refs[formName].validate()
        register({
            'username': this.registerForm.username,
            'password': md5(this.registerForm.password),
            'email': this.registerForm.email
        }).then(res => {
          console.log(res)
          //控制跳转
          if(res.returnCode == '1111'){
            this.$message.success(res.returnMessage);
            sessionStorage.setItem("username", this.registerForm.username)
            sessionStorage.setItem("token", res.token)
            this.$router.push({path: '/dashboard'})                       
          }else if(res.returnCode == '0000'){
            this.$message.warning(res.returnMessage);
          }else{
            this.$message.error(res.returnMessage);
          }
        })
    }
  }
};
</script>

<style scoped>
@import "../../static/css/mixin.css";
.login_page {
  background-color: #324057;
  height: 100%;
  text-align: center;
}
.manage_tip {
  /* position: absolute; */
  width: 100%;
  /* top: -100px; */
  left: 0;
}
.manage_tip p {
  font-size: 34px;
  padding: 20px 0;
}
.form_contianer {
  position: absolute;
  left: calc(50% - 190px);
  top: calc(50% - 210px);
  /* .wh(320px, 210px);
  .ctp(320px, 210px); */
  width: 320px;
  /* height: 210px; */
  padding: 30px;
  /* box-sizing: border-box; */
  border-radius: 5px;
  text-align: center;
  background-color: #fff;
}
.submit_btn {
  width: 100%;
  font-size: 16px;
}
.form-fade-enter-active,
.form-fade-leave-active {
  transition: all 1s;
}
.form-fade-enter,
.form-fade-leave-active {
  transform: translate3d(0, -50px, 0);
  opacity: 0;
}
</style>
