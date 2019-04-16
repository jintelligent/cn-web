<template>
  <div id="app">
    <!-- header -->
    <div>
      <el-header>
        <div style="float: left;height: 60px;">
          <img src="../assets/1.png" style="height:50px;width:50px;" alt="">
        </div>
        <div v-if="welcome" style="float: left;height: 60px;color:#fff;width:500px">  菜鸟管理系统</div>
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
          <!-- <img src="../assets/logo.png" style="width:30px;height:30px;" alt="" @click="closeNav()"> -->
        </div>
        <el-menu class="el-menu-vertical-demo el-theme--color" :default-active="$route.path" router :unique-opened='true'
          @select="handleSelect" :collapse='iscloseNav'>
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
        <el-main v-if="collapsed">
          <router-view></router-view>
        </el-main>
        <el-main v-else>
          <h2>后台管理</h2>
          <h2>友情链接：</h2>
          <ul>
            <li>
              <a href="https://vuejs.org" target="_blank">官网</a>
            </li>
            <li>
              <a href="https://forum.vuejs.org" target="_blank">微博</a>
            </li>
          </ul>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>

import md5 from "js-md5";
import axios from 'axios';

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
      userName: "",
      collapsed: false,
      iscloseNav: false,
      welcome: true
    };
  },
  created: function () {
    setInterval(this.showMarquee, 5000)
  },
  mounted() {
    var tt = this;
    if(sessionStorage.getItem("username") == "" || sessionStorage.getItem("username") == null){
      tt.$router.push({
                  path: "/login"
                });
    }
    
    var w = window.innerWidth;
    if (w < 500) {
      this.welcome = false;
    }
    this.userName = sessionStorage.getItem("username");
    var url = window.location.href;
    if (url.split("#")[1] == "/") {
    } else {
      this.collapsed = true;
    }
    
    // if (getCookie("token")) {
      this.$http
        .post("/app/menus/get"
        , {
          'username' : sessionStorage.getItem("username")
        }
        )
        .then(
          function(response) {
            var returnCode = response.data.returnCode;
            if (returnCode == "1111") {
              this.menuList = response.data.result;
              // localStorage.setItem(
              //   "menulist",
              //   JSON.stringify(response.data.Result)
              // );
            } else if (returnCode === 40001) {
              this.$message({
                showClose: true,
                type: "warning",
                message: response.data.returnMessage
              });
              setTimeout(() => {
                tt.$router.push({
                  path: "/login"
                });
              }, 1500);
            }
          }.bind(this)
        )
        .catch(
          function(error) {
            this.$notify.error({
              title: "错误",
              message: "错误：请检查网络"
            });
          }.bind(this)
        );
    // } else {
    //   this.$message({
    //     showClose: true,
    //     type: "warning",
    //     message: "请先登陆"
    //   });
    //   setTimeout(() => {
    //     tt.$router.push({
    //       path: "/login"
    //     });
    //   }, 1500);
    // }
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

      try {
        // 表单验证
        await this.$refs[formName].validate()

        //发送登录验证请求
        const res = await axios.post(
          '/app/user/changePass/',
          {
            'userName': sessionStorage.getItem("username"),
            'oldPass': md5(this.changeForm.oldPass),
            'newPass': md5(this.changeForm.newPass)
          })

        //控制跳转
        if(res.data.returnCode == '1111'){
          this.$message.warning(res.data.returnMessage);
          this.$router.push({path: '/login'})
          
        }else{
          this.$message.error(res.data.returnMessage);
        }
        
      } catch (err) {
        console.log(err)
      }
    },
    // 	index: 选中菜单项的 index, indexPath: 选中菜单项的 index path
    handleSelect(index) {
      this.collapsed = true;
      // this.defaultActiveIndex = [index];
      // console.log(this.$route.path);
    },
    // 个人中心  修改密码
    jumpTo(url) {
      this.defaultActiveIndex = url;
      this.$router.push(url);
    },
    // 退出
    logout() {
      let that = this;
      this.$confirm("确认退出吗?", "提示", {
        confirmButtonClass: "el-button--warning"
      })
        .then(() => {
          //确认
          that.loading = true;
          delCookie("token");
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
</style>
