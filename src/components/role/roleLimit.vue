<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right" class="crumb">
      <el-breadcrumb-item :to="{ path: '/' }">后台</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/role' }">角色管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- table 内容 -->
    <table class="table">
      <tbody>
        <tr>
          <td width="200px">角色名称</td>
          <td width="">
            {{name}}
          </td>
        </tr>
        <tr>
          <td>权限</td>
          <td>
            
            <el-form :inline="true">
              <el-form-item>
                <el-input placeholder="输入关键字进行过滤" v-model="filterText"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="powerSave()">保存权限</el-button>
              </el-form-item>
            </el-form>
            <el-tree
              :data="treeData"
              show-checkbox
              node-key="id"
              accordion
              :default-checked-keys="powerList"
              :props="defaultProps"
              :filter-node-method="filterNode"
              ref="tree2">
            </el-tree>
          </td>
        </tr>
      </tbody>
    </table>

  </div>
</template>
<script>
export default {
  watch: {
      filterText(val) {
        this.$refs.tree2.filter(val);
      }
    },
  data() {
    return {
      powerList: [],
      rolesId: '',
      filterText: '',
      name:"",
      treeData: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    };
  },
  methods: {
     filterNode(value, data) {
        if (!value) return true;
        return data.label.indexOf(value) !== -1;
      },
      powerSave() {
        this.$http
        .post("/app/roles/updatePower", {
          'menus' : this.$refs.tree2.getCheckedKeys(),
          'rolesId' : this.rolesId
        })
        .then(
          function(response) {
            var returnCode = response.data.returnCode;
            console.log(returnCode)
            if (returnCode == '1111') {
              location. reload();
              this.$notify.success({
              title: "提示",
              message: "权限修改成功！"
            });
              this.getInfo(this.rolesId);
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
            console.log(error)
            this.$notify.error({
              title: "错误",
              message: "错误：请检查网络"
            });
          }.bind(this)
        );
      },
    /*
           1、获取列表 渲染列表
        */
    getInfo(id) {
      this.$http
        .post("/app/roles/selectPower", {
          'parentId' : 0,
          'rolesId' : this.rolesId
        })
        .then(
          function(response) {
            var returnCode = response.data.returnCode;
            if (returnCode == '1111') {
              this.treeData = response.data.result.tree;
              this.powerList = response.data.result.powers;
              
            } else if (status === 40001) {
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
  },
  mounted() {
    var _this = this;
    if(sessionStorage.getItem("username") == "" || sessionStorage.getItem("username") == null){
      _this.$router.push({ path: "/login"});
    }
    var id = window.location.href.split("id=")[1].split("&rolename")[0];
    this.rolesId = decodeURI(id);
    var name = window.location.href.split("&rolename=")[1];
    this.name = decodeURI(name);
    this.getInfo(id);
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

table {
  width: 100%;
  border-collapse: collapse;
  /*关键代码*/
}

tr td {
  padding: 12px 15px;
  min-width: 0;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  text-overflow: ellipsis;
  vertical-align: middle;
  position: relative;
  border: 1px solid #ebeef5;
}

.miantable li a {
  display: inline-block;
  border-radius: 6px;
  text-align: left;
  margin-bottom: 5px;
  padding: 3px 0;
}

.seconuntable {
  margin-left: 48px;
  display: block;
}
</style>
