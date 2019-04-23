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

import { selectPower, updatePower } from '@/axios/api';

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
        //调用接口
        updatePower({
          'menus' : this.$refs.tree2.getCheckedKeys(),
          'rolesId' : this.rolesId
        }).then(res => {
          //控制跳转
          if(res.returnCode == '1111'){
            this.$message.success(res.returnMessage);
            location. reload();          
          }else if(res.returnCode == '0000'){
            this.$message.warning(res.returnMessage);
          }else{
            this.$message.error(res.message);
          }
        })
      },
    /*
           1、获取列表 渲染列表
        */
    getInfo(id) {
      //调用接口
        selectPower({
          'parentId' : 0,
          'rolesId' : this.rolesId
        }).then(res => {
          //控制跳转
          if(res.returnCode == '1111'){
              this.treeData = res.result.tree;
              this.powerList = res.result.powers;         
          }else if(res.returnCode == '0000'){
            this.$message.warning(res.returnMessage);
          }else{
            this.$message.error(res.message);
          }
        })
    },
  },
  mounted() {
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
