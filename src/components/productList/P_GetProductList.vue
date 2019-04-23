<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right" class="crumb">
      <el-breadcrumb-item :to="{ path: '/' }">后台</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/studyNote' }">学习笔记</el-breadcrumb-item>
    </el-breadcrumb>
    <!--检索条-->
    <el-col class="toolbar" style="padding-top: 15px;">
      <el-form :inline="true" :model="filters">
        <el-form-item>
          <el-input v-model="filters.keyword" placeholder="关键字"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getNotes()">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleAdd()">新增</el-button>
        </el-form-item>
      </el-form>
    </el-col>
    <!-- table 内容 -->
    <el-table :data="NoteList" style="width: 100%" :border='true'>
    <el-table-column type="expand">
      <template slot-scope="props">
        <el-form label-position="left" inline class="demo-table-expand">
          <el-form-item label="学习感受:">
            <span>{{ props.row.studyFeel }}</span>
            <!-- {{ props.row.name }}<img v-for="(item,index) in props.row.Image" :key="index" :src="mainurl+item" width="200" style="margin-left:20px;" /> -->
          </el-form-item>
        </el-form>
      </template>
    </el-table-column>
      <el-table-column label="笔记标题" prop="noteHead">
      </el-table-column>
      <!-- <el-table-column label="商品图片" prop="Image" >
        <template slot-scope="scope">
            <img v-for="(item,index) in scope.row.Image" :key="index" :src="mainurl+item" width="200" />
        </template>
      </el-table-column> -->
      <el-table-column label="笔记类别" prop="noteType" sortable>
      </el-table-column>
      <el-table-column label="创建时间" prop="opTime" sortable>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini"  type="primary" plain icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="block">
      <el-pagination @current-change="handleCurrentChange"
       layout="prev, pager, next,jumper" :page-count="pageCount">
      </el-pagination>
    </div>

    <!-- 弹出框 图文详情 -->
    <el-dialog title="你有多少知识，我就有多么宽广" :visible.sync="openDetails">
        <div class="edit_container">
            <!-- <span></span> -->
            <quill-editor
                v-model="content" 
                ref="myQuillEditor" 
                :options="editorOption" 
                @blur="onEditorBlur($event)" @focus="onEditorFocus($event)"
                @change="onEditorChange($event)">
            </quill-editor>
            
        </div>
       <div slot="footer" class="dialog-footer">
        <el-button @click.native="openDetails=false">取消</el-button>
        <el-button type="primary" @click.native="addSubmit">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import md5 from "js-md5";

export default {
  data() {
    return {
      // Ueditor详情
      openDetails: false,
      //富文本编辑器
      content: ``,
      editorOption: {
        modules:{
            toolbar:[
              ['bold', 'italic', 'underline', 'strike'],    //加粗，斜体，下划线，删除线
              ['blockquote', 'code-block'],     //引用，代码块
              [{ 'header': [1, 2, 3, 4, 5, 6, false] }], 
              // [{ 'header': 1 }, { 'header': 2 }],        // 标题，键值对的形式；1、2表示字体大小
              [{ 'list': 'ordered'}, { 'list': 'bullet' }],     //列表
              [{ 'script': 'sub'}, { 'script': 'super' }],   // 上下标
              [{ 'indent': '-1'}, { 'indent': '+1' }],     // 缩进
              // [{ 'direction': 'rtl' }],             // 文本方向   
              [{ 'size': ['small', false, 'large', 'huge'] }], // 字体大小
                  //几级标题
              [{ 'color': [] }, { 'background': [] }],     // 字体颜色，字体背景颜色
              // [{ 'font': [] }],     //字体
              [{ 'align': [] }]    //对齐方式
              // ,['clean']    //清除字体样式
              // ,['image','video']    //上传图片、上传视频
            ]
          },
        theme:'snow'},

      NoteList: [], //列表
      pageIndex: 1,
      pageSize: 3,
      pageCount: 1,
      mainurl: "",
      roleList: [], //管理员角色列表
      // 搜索关键字
      filters: {
        keyword: ""
      },
      //编辑界面是否显示
      editFormVisible: false,
      editLoading: false,

      //编辑界面数据
      editForm: {
        IsLock: false,
        Name: "",
        Role: "",
        RoleID: "",
        Password: ""
      },
      editFormRules: {
        Name: [
          {
            required: true,
            message: "请输入账户",
            trigger: "blur"
          }
        ],
        Password: [
          {
            required: true,
            message: "请输入密码",
            trigger: "blur"
          }
        ]
      },
      //新增界面是否显示
      addFormVisible: false,
      addLoading: false,
      addFormRules: {
        Name: [
          {
            required: true,
            message: "请输入账户",
            trigger: "blur"
          }
        ],
        Password: [
          {
            required: true,
            message: "请输入密码",
            trigger: "blur"
          }
        ]
      },
      //新增界面数据
      addForm: {
        IsLock: false,
        Name: "",
        RoleID: "",
        Password: ""
      }
    };
  },
  computed: {
        editor() {
            return this.$refs.myQuillEditor.quill;
        },
    },
  methods: {
        onEditorReady(editor) {}, // 准备编辑器       
        onEditorBlur(){}, // 失去焦点事件
        onEditorFocus(){}, // 获得焦点事件
        onEditorChange(){}, // 内容改变事件
    /*
         1、获取列表 渲染列表
         2、搜索关键字
         3、分页
      */
    getInfo() {
      this.$http
        .post("/app/studyNotes/selNotesByUser", {
            'userName' : sessionStorage.getItem("username")
         }
        )
        .then(
          function(response) {
            var returnCode = response.data.returnCode;
            if (returnCode == '1111') {
              this.NoteList = response.data.result;
              //this.pageCount = response.data.Result.Page;
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
        // 请求error
        .catch(
          function(error) {
            this.$notify.error({
              title: "错误",
              message: "错误：请检查网络"
            });
          }.bind(this)
        );
    },
    //
    getNotes() {
      this.getInfo();
    },
    // 分页
    handleCurrentChange(val) {
      this.pageIndex = val;
      this.getInfo();
    },
    /*
        1、添加编辑时获取角色列表，渲染下拉菜单
        2、点击管理员列表的编辑，弹出模态框
        3、点击新增管理严，弹出模态框
        4、保存修改
        5、保存添加
      */
    getRoleList() {
      // 获取角色列表
      this.$http
        .get("/hxmback/api/Role/GetRoles", {
          params: {
            PageIndex: 1,
            PageSize: 999
          }
        })
        .then(
          function(response) {
            var status = response.data.Status;
            if (status === 1) {
              this.roleList = response.data.Result.data;
            } else if (status === 40001) {
              this.$message({
                showClose: true,
                type: "warning",
                message: response.data.Result
              });
              setTimeout(() => {
                tt.$router.push({
                  path: "/login"
                });
              }, 1500);
            }
          }.bind(this)
        )
        // 请求error
        .catch(
          function(error) {
            this.$notify.error({
              title: "错误",
              message: "错误：请检查网络"
            });
          }.bind(this)
        );
    },
    handleEdit(index, row) {
      var obj = Object.assign({}, row);

      this.openDetails = true;
      this.content = decodeURIComponent(obj.noteBody);
    },
    handleDelete(index, row) {
      var obj = Object.assign({}, row);
      this.$confirm("确认删除吗？", "提示", {}).then(() => {
        this.$http
          .get("/hxmback/api/Back/P_ProductDel", {
            params: {
              token: getCookie("token"),
              id: obj.ID
            }
          })
          .then(
            function(response) {
              var status = response.data.Status;
              if (status === 1) {
                this.getInfo();
              } else if (status === 40001) {
                this.$message({
                  showClose: true,
                  type: "warning",
                  message: response.data.Result
                });
                setTimeout(() => {
                  tt.$router.push({
                    path: "/login"
                  });
                }, 1500);
              }
            }.bind(this)
          )
          // 请求error
          .catch(
            function(error) {
              this.$notify.error({
                title: "错误",
                message: "错误：请检查网络"
              });
            }.bind(this)
          );
      });
    },
    handleAdd() {
      this.$router.push("/P_GetProductList/productAdd");
    },
    editSubmit() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          //判断是否填写完整  --true
          this.$confirm("确认提交吗？", "提示", {}).then(() => {
            this.editLoading = true;
            var para = Object.assign({}, this.editForm);
            if (para.Password.length > 20) {
            } else {
              para.Password = md5(para.Password);
            }
            // 将token传入参数中
            para.Token = getCookie("token");
            // 发保存请求
            this.$http
              .get("/hxmback/api/Admin/Edit", {
                params: para
              })
              .then(
                function(response) {
                  this.editLoading = false;
                  var status = response.data.Status;
                  if (status === 1) {
                    // 表单重置
                    this.$refs["editForm"].resetFields();
                    this.editFormVisible = false;
                    this.getInfo();
                  } else if (status === 40001) {
                    this.$message({
                      showClose: true,
                      type: "warning",
                      message: response.data.Result
                    });
                    setTimeout(() => {
                      tt.$router.push({
                        path: "/login"
                      });
                    }, 1500);
                  } else {
                    this.$message({
                      showClose: true,
                      type: "warning",
                      message: response.data.Result
                    });
                  }
                }.bind(this)
              )
              // 请求error
              .catch(
                function(error) {
                  this.$notify.error({
                    title: "错误",
                    message: "错误：请检查网络"
                  });
                }.bind(this)
              );
          });
        }
      });
    },
    addSubmit() {
      console.log(this.content)
      // this.$refs.addForm.validate(valid => {
      //   if (valid) {
      //     //判断是否填写完整  --true
      //     this.$confirm("确认提交吗？", "提示", {}).then(() => {
      //       this.addLoading = true;
      //       //NProgress.start();
      //       var para = Object.assign({}, this.addForm);
      //       if (para.Password.length > 20) {
      //       } else {
      //         para.Password = md5(para.Password);
      //       }
      //       // 将token传入参数中
      //       para.Token = getCookie("token");
      //       // 发保存请求
      //       this.$http
      //         .get("/hxmback/api/Admin/Add", {
      //           params: para
      //         })
      //         .then(
      //           function(response) {
      //             this.addLoading = false;
      //             var status = response.data.Status;
      //             if (status === 1) {
      //               // 表单重置
      //               this.$refs["addForm"].resetFields();
      //               this.addFormVisible = false;
      //               this.getInfo();
      //             } else if (status === 40001) {
      //               this.$message({
      //                 showClose: true,
      //                 type: "warning",
      //                 message: response.data.Result
      //               });
      //               setTimeout(() => {
      //                 tt.$router.push({
      //                   path: "/login"
      //                 });
      //               }, 1500);
      //             } else {
      //               this.$message({
      //                 showClose: true,
      //                 type: "warning",
      //                 message: response.data.Result
      //               });
      //             }
      //           }.bind(this)
      //         )
      //         // 请求error
      //         .catch(
      //           function(error) {
      //             this.$notify.error({
      //               title: "错误",
      //               message: "错误：请检查网络"
      //             });
      //           }.bind(this)
      //         );
      //     });
      //   }
      // });
    }
  },
  mounted() {
    this.mainurl = mainurl;
    this.getInfo();
  }
};
</script>
<style scoped>
/* 面包屑 */

.crumb {
  height: 36px;
  line-height: 36px;
}

.block {
  text-align: center;
  padding: 20px 0;
}

/*#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}*/
/*.quill-editor{
  width: 100%;
  height: 200px;
}*/
</style>
