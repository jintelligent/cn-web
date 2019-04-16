<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right" class="crumb">
      <el-breadcrumb-item :to="{ path: '/' }">后台</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/role' }">角色管理</el-breadcrumb-item>
    </el-breadcrumb>
    <!--检索条-->
    <el-col class="toolbar" style="padding-top: 15px;">
      <el-form :inline="true" :model="filters">
        <el-form-item>
          <el-button type="primary" @click="handleAdd()">新增</el-button>
        </el-form-item>
      </el-form>
    </el-col>
    <!-- table 内容 -->
    <el-table :data="roleList" style="width: 100%" :border='true'>
      <el-table-column label="角色名" prop="name">
      </el-table-column>
      <el-table-column label="创建时间" prop="opTime" :formatter="CreateTime">
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" plain icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button size="mini" type="primary" plain icon="el-icon-setting" @click="handleSetting(scope.$index, scope.row)">设置</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--编辑界面-->
    <el-dialog title="编辑" :visible.sync="editFormVisible">
      <el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="editForm.name" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="editFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
      </div>
    </el-dialog>
    <!-- 新增界面 -->
    <el-dialog title="新增" :visible.sync="addFormVisible">
      <el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="addForm.name" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="addFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import md5 from "js-md5";

export default {
  data() {
    return {
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
        Name: "",
        ID: ""
      },
      editFormRules: {
        Name: [
          {
            required: true,
            message: "请输入角色名称",
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
            message: "请输入角色名称",
            trigger: "blur"
          }
        ]
      },
      //新增界面数据
      addForm: {
        Name: "",
        ID: ""
      }
    };
  },
  methods: {
    /*
         1、获取管理员列表 渲染列表
         2、格式化时间
         3、格式化是否锁定
         4、分页
      */
    getInfo() {
      this.$http
        .get("/app/roles/select")
        .then(
          function(response) {
            var returnCode = response.data.returnCode;
            if (returnCode == '1111') {
              this.roleList = response.data.result;
              //this.pageCount = response.data.Result.PageIndex;
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
            }else {
                this.$message({
                showClose: true,
                type: "warning",
                message: response.data.returnMessage
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
    },
    CreateTime(row, time) {
      var date = row[time.property];
      return date.replace("T", " ").split(".")[0];
    },
    IsLock(row, lock) {
      var lock = row[lock.property];
      return lock ? "是" : "否";
    },
    /*
        1、跳转设置页面,
        2、点击管理员列表的编辑，弹出模态框
        3、点击新增管理严，弹出模态框
        4、保存修改
        5、保存添加
      */

    handleSetting(index, row) {
      var obj = Object.assign({}, row);
      var urlId = obj.id;
      this.$router.push("/role/rolelimit/id=" + urlId+"&rolename="+obj.name);
    },
    handleEdit(index, row) {
      var obj = Object.assign({}, row);
      this.editFormVisible = true;
      this.editForm = obj;
    },
    handleAdd() {
      this.addFormVisible = true;
    },

    editSubmit() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          //判断是否填写完整  --true
          this.$confirm("确认提交吗？", "提示", {}).then(() => {
            this.editLoading = true;
            var para = Object.assign({}, this.editForm);

            // 发保存请求
            this.$http
              .post("/app/roles/edit", {
                  'id': para.id,
                  'name': para.name,
              })
              .then(
                function(response) {
                  this.editLoading = false;
                  var returnCode = response.data.returnCode;
                  if (returnCode == '1111') {
                    // 表单重置
                    this.$refs["editForm"].resetFields();
                    this.editFormVisible = false;
                    this.getInfo();
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
                  } else {
                    this.$message({
                      showClose: true,
                      type: "warning",
                      message: response.data.returnMessage
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
      this.$refs.addForm.validate(valid => {
        if (valid) {
          //判断是否填写完整  --true
          this.$confirm("确认提交吗？", "提示", {}).then(() => {
            this.addLoading = true;
            // var para = Object.assign({}, this.addForm);
            // // 将token传入参数中
            // para.Token = getCookie("token");
            // 发保存请求
            this.$http
              .post("/app/roles/save", {
                'name' : this.addForm.name
              })
              .then(
                function(response) {
                  this.addLoading = false;
                  var returnCode = response.data.returnCode;
                  if (returnCode == '1111') {
                    // 表单重置
                    this.$refs["addForm"].resetFields();
                    this.addFormVisible = false;
                    this.getInfo();
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
                  } else {
                    this.$message({
                      showClose: true,
                      type: "warning",
                      message: response.data.returnMessage
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
    }
  },
  mounted() {
    var _this = this;
    if(sessionStorage.getItem("username") == "" || sessionStorage.getItem("username") == null){
      _this.$router.push({ path: "/login"});
    }
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
</style>
