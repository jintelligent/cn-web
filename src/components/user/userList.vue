<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right" class="crumb">
      <el-breadcrumb-item :to="{ path: '/dashboard' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>人员管理</el-breadcrumb-item>
    </el-breadcrumb>
    <!--检索条-->
    <el-col class="toolbar" style="padding-top: 15px;">
      <el-form :inline="true" :model="filters">
        <!-- <el-form-item>
          <el-input v-model="filters.keyword" placeholder="关键字"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getUsers()">查询</el-button>
        </el-form-item> -->
      </el-form>
    </el-col>
    <!-- table 内容 -->
    <el-table 
      :data="userList.slice((currentPage-1)*pageSize,currentPage*pageSize)"
      style="width: 100%" :border='true'>
      <el-table-column label="用户名" prop="userName">
      </el-table-column>
      <el-table-column label="创建地区" prop="city">
      </el-table-column>
      <!-- <el-table-column label="邮箱" prop="email">
      </el-table-column> -->
      <el-table-column label="是否锁定" prop="isLock" :formatter="IsLock">
      </el-table-column>
      <el-table-column label="创建时间" prop="opTime">
      </el-table-column>
      <el-table-column label="角色" prop="roleId" :formatter="RoleId">
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="block">
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page.sync="currentPage"
      :page-sizes="[5, 10, 50, 100]"
      :page-size="pageSize"
      layout="sizes, prev, pager, next"
      :total="pageCount">
    </el-pagination>
  </div>

  </div>
</template>
<script>
import md5 from "js-md5";
import { selCommonUser } from '@/axios/api';
export default {
  data() {
    return {
      userList: [], //用户列表
      currentPage: 1,
      pageSize: 5,
      pageCount: 1,

      // 搜索关键字
      filters: {
        keyword: ""
      }
    };
  },
  methods: {
    handleCurrentChange(val) {
      this.currentPage = val
    },

    handleSizeChange(val) {
      this.pageSize = val
    },
    /*
         1、获取管理员列表 渲染列表
         2、分页
         3、格式化是否锁定
      */
    getInfo() {
      //调用接口
      selCommonUser().then(res => {
          //控制跳转
          if(res.returnCode == '1111'){
              this.userList = res.result;
              this.pageCount = res.result.length     
          }else if(res.returnCode == '0000'){
            this.$message.warning(res.returnMessage);
          }else{
            this.$message.error(res.message);
          }
      })
    },

    IsLock(row, lock) {
      var lock = row[lock.property];
      return lock == '0' ? "是" : "否";
    },
    RoleId(row, id) {
      switch(row[id.property]){
        case 1:
          return "管理员";
        case 2:
          return "普通用户";
        case 5:
          return "游客";
      }
    }

  },
  mounted() {
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
