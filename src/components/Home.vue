<template>
  <div id="app">
    <!-- header -->
    <div>
      <el-header>
        <div style="float: left;height: 60px;">
          <img src="../assets/0Z939595B9.gif" style="height:50px;width:100px;" alt="">
        </div>
        <div v-if="welcome" style="float: left;height: 60px;color:#fff;width:500px">  开发指南</div>
        <div style="float: left;height: 60px;width:450px;">
            <div class="marquee">
                <!-- <div class="marquee_title">
                  <span>最新战报</span>
                </div> -->
                <div class="marquee_box">
                    <ul class="marquee_list" :class="{marquee_top:animate}">
                        <li v-for="(item, index) in marqueeList">

                            <span>{{item.name}}</span>
                            <span>：</span>
                            <span class="red"> {{item.remark}}</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
<!--         <el-badge :value="200" :max="99" class="item">
          <i class="el-icon-date"></i>
        </el-badge> -->
        <div style="float: right;color:#fff; font-size: 12px;margin-right:50px;">
          <el-dropdown >
            <span class="el-dropdown-link" style="color:#fff;">
                欢迎 {{user}}
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>
                <div @click="changeFormVisible=true">
                  <span style="color: #555;font-size: 14px;">修改密码</span>
                </div>
              </el-dropdown-item>
              <el-dropdown-item divided @click.native="logout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </el-header>
          <el-dialog title="修改密码" :visible.sync="changeFormVisible" 
          :show-close=false>
            <el-form 
              :model="changeForm" 
              :rules="rules" 
              ref="changeForm" 
              :label-position="labelPosition"
              label-width="80px"
            >

              <el-form-item prop="oldPass" label="原密码">
                <el-input type="password" v-model="changeForm.oldPass"></el-input>
              </el-form-item>
              <el-form-item label="新密码" prop="newPass" >
                <el-input type="password" v-model="changeForm.newPass" auto-complete="off" ></el-input>
              </el-form-item>
              <el-form-item label="确认密码" prop="checkPass">
                <el-input type="password" v-model="changeForm.checkPass" auto-complete="off" ></el-input>
              </el-form-item>

              <el-form-item size="large">
                  <el-button type="primary" @click="submitForm('changeForm')">立即修改</el-button>
                  <el-button  @click.native="changeFormVisible=false">取消</el-button>
              </el-form-item>

            </el-form>
          </el-dialog>
    </div>
    <!-- body -->
    <el-container>
      <aside class="el-theme--color">
        <div style="text-align:center">
          <i class="el-icon-setting" @click="closeNav()"></i>
          <!-- router 是否使用 vue-router 的模式，启用该模式会在激活导航时以 index 作为 path 进行路由跳转 -->
        </div>
        <el-menu class="el-menu-vertical-demo el-theme--color" 
          :default-active="$route.path" 
          router 
          :unique-opened='true'
          :collapse='iscloseNav'>
          <template v-for="(item,index) in menuList">
            <el-submenu :index="index+''" :key="index">
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span slot="title" style="color:#303133">{{item.name}}</span>
              </template>
              <el-menu-item v-for="(ll,ii) in item.snippet" :key="ii" :index="'/'+ll.url.split('.')[0]">{{ll.name}}</el-menu-item>
            </el-submenu>
          </template>
        </el-menu>
      </aside>
      <!-- 右侧路由信息 -->
      <el-container>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>

import md5 from "js-md5";
import axios from 'axios';
import { changePassWord, selectMenus } from '@/axios/api';
export default {
  data: function() {
    var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else {
          if (this.changeForm.checkPass !== '') {
            this.$refs.changeForm.validateField('checkPass');
          }
          callback();
        }
      };
      var validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.changeForm.newPass) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
    return {
      animate: false,
      marqueeList: [
                {
                    name: '提示',
                    remark: '一辈子很短',
                },
                {
                    name: '警示',
                    remark: '热爱生活，好好爱身边的人',
                },
                {
                    name: '警示',
                    remark: '努力学习，实现自己的价值',
                }
            ],
      user: sessionStorage.getItem("username"),
      labelPosition: 'right',
      changeForm: {
        oldPass: "",
        newPass: "",
        checkPass: ""
      },
      rules: {
          oldPass: [
            {  required: true, message: "请输入原密码", trigger: "blur" }
          ],
          newPass: [
            { validator: validatePass, trigger: 'blur' }
          ],
          checkPass: [
            { validator: validatePass2, trigger: 'blur' }
          ]
        },
      changeFormVisible : false,
      defaultActiveIndex: ["0"],
      menuList: [],
      iscloseNav: false,
      welcome: true
    };
  },
  created: function () {
    setInterval(this.showMarquee, 5000)
  },
  mounted() {   
    var w = window.innerWidth;
    if (w < 500) {
      this.welcome = false;
    }
    var url = window.location.href;
    
    //调用接口
        selectMenus({
            'username': sessionStorage.getItem("username")
            }).then(res => {
              this.editLoading = false;
              //控制跳转
              if(res.returnCode == '1111'){
                this.menuList = res.result;    
              }else if(res.returnCode == '0000'){
                this.$message.warning(res.returnMessage);
              }else{
                this.$message.error(res.message);
              }
        })
  },
  methods: {
    showMarquee: function () {
                this.animate = true;
                setTimeout(()=>{
                    this.marqueeList.push(this.marqueeList[0]);
                this.marqueeList.shift();
                this.animate = false;
            },500)},
    async submitForm (formName) {


        // 表单验证
        await this.$refs[formName].validate()
        //调用接口
        changePassWord({
            'username': sessionStorage.getItem("username"),
            'password': md5(this.changeForm.oldPass),
            'newPass': md5(this.changeForm.newPass)
            }).then(res => {
              this.editLoading = false;
              //控制跳转
              if(res.returnCode == '1111'){
                // 表单重置
                this.$message.warning(res.returnMessage);
                this.$router.push({path: '/login'})    
              }else if(res.returnCode == '0000'){
                this.$message.warning(res.returnMessage);
              }else{
                this.$message.error(res.message);
              }
            })
    },

    // 退出
    logout() {
      let _this = this;
      this.$confirm("确认退出吗?", "提示", {
        confirmButtonClass: "el-button--warning"
      })
        .then(() => {
          //确认
          _this.loading = true;
          sessionStorage.removeItem("token");
          this.$router.push("/login");
        })
        .catch(() => {});
    },
    closeNav() {
      this.iscloseNav = !this.iscloseNav;
      if (this.iscloseNav) {
        $(".el-aside").css({
          width: "60px"
        });
      }
    }
  }
};
</script>

<style scoped>
/* @import "../../static/css/index.css"; */

.el-header {
  background-color: #409EFF;
  color: #333;
  line-height: 60px;
}

.el-menu--popup {
  background-color: #16181d;
}
.el-theme--color {
  background-color: #409EFF;
}
.el-dropdown-link {
    cursor: pointer;
    color: #409EFF;
  }
.el-icon-arrow-down {
    font-size: 12px;
  }

.marquee {
  width: 100%;
  height: 60px;
  align-items: center;
  color: #3A3A3A;
  display: flex;
  box-sizing: border-box;
}

/*.marquee_title {
  padding: 0 20px;
  height: 30px;
  font-size: 14px;
  border-right: 1px solid #d8d8d8;
  align-items: center;
}*/

.marquee_box {
  display: block;
  position: relative;
  width: 60%;
  height: 30px;
  overflow: hidden;
}

.marquee_list {
  display: block;
  position: absolute;
  top: 0;
  left: 0;
}
.marquee_top {
  transition: all 0.5s;
  margin-top: -30px
}

.marquee_list li {
  height: 30px;
  line-height: 30px;
  font-size: 14px;
  padding-left: 20px;
}

.marquee_list li span {
  padding: 0 2px;
}

.red {
  color: #FF0101;
}

.item {
  margin-top: 10px;
  margin-right: 20px;
}
</style>
