<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right" class="crumb">
      <el-breadcrumb-item :to="{ path: '/' }">后台</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/manage' }">管理员管理</el-breadcrumb-item>
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
        <el-form-item>
          <el-button type="primary" @click="handleAdd()">新增</el-button>
        </el-form-item>
      </el-form>
    </el-col>
    <!-- table 内容 -->
    <el-table :data="manageList" style="width: 100%" :border='true'>
      <el-table-column label="用户名" prop="userName">
      </el-table-column>
      <el-table-column label="邮箱" prop="email">
      </el-table-column>
      <el-table-column label="是否锁定" prop="isLock" :formatter="IsLock">
      </el-table-column>
      <el-table-column label="创建时间" prop="opTime">
      </el-table-column>
      <el-table-column label="角色" prop="roleId" :formatter="RoleId">
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini"  type="primary" plain icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <!-- <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button> -->
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="block">
      <el-pagination @current-change="handleCurrentChange"
       layout="prev, pager, next,jumper" :page-count="pageCount">
      </el-pagination>
    </div>
    <!--编辑界面-->
    <el-dialog title="编辑" :visible.sync="editFormVisible">
      <el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
        <el-form-item label="账号" prop="username">
          <el-input v-model="editForm.username" auto-complete="off" disabled></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="editForm.password" :maxlength="20" :clearable='true'></el-input>
        </el-form-item>
        <el-form-item label="锁定">
          <el-radio-group v-model="editForm.isLock">
          <template v-for="(item, index) in lockList">
            <el-radio
              :label="item.code"
            >{{item.text}}</el-radio>
          </template>
        </el-radio-group>
        </el-form-item>
        <el-form-item label="角色">
          <el-select v-model="editForm.role" placeholder="请选择角色">
            <el-option v-for="item in roleList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
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
        <el-form-item label="账号" prop="username">
          <el-input v-model="addForm.username" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="addForm.password" :maxlength="20" :clearable='true'></el-input>
        </el-form-item>
        <el-form-item label="角色">
          <el-select v-model="addForm.role" placeholder="请选择角色">
            <el-option v-for="item in roleList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
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
import { selectAdmin, updateAdmin, insertAdmin, selectRoles } from '@/axios/api';
export default {
  data() {
    return {
      manageList: [], //管理员列表
      pageIndex: 1,
      pageSize: 2,
      pageCount: 1,
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
        isLock: "",
        username: "",
        role: "",
        password: ""
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
      lockList: [
        {
          text: "已锁定",
          code: "0"
        },
        {
          text: "未锁定",
          code: "1"
        }],
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
        username: "",
        role: "",
        password: ""
      }
    };
  },
  methods: {
    /*
         1、获取管理员列表 渲染列表
         2、分页
         3、格式化是否锁定
      */
    getInfo() {
      //调用接口
      selectAdmin().then(res => {
          //控制跳转
          if(res.returnCode == '1111'){
              this.manageList = res.result;     
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
        
      
      // var id = row[id.property];
      // return id === 1 ? "管理员" : "普通用户";
    },
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
      //调用接口
      selectRoles().then(res => {
          //控制跳转
          if(res.returnCode == '1111'){
              this.roleList = res.result;    
          }else if(res.returnCode == '0000'){
            this.$message.warning(res.returnMessage);
          }else{
            this.$message.error(res.message);
          }
      })
    },

    handleEdit(index, row) {
      var obj = Object.assign({}, row);

      this.editForm.username = obj.userName;
      this.editForm.password = obj.passWord;
      this.editForm.isLock = obj.isLock;
      this.editForm.role = obj.roleId;
      this.getRoleList();
      this.editFormVisible = true;

    },
    handleAdd() {
      this.addFormVisible = true;
      // 获取角色列表
      this.getRoleList();
    },
    editSubmit() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          //判断是否填写完整  --true
          this.$confirm("确认提交吗？", "提示", {}).then(() => {
          this.editLoading = true;
          //调用接口
          updateAdmin({
              'username' : this.editForm.username,
              'password' : md5(this.editForm.password),
              'roles' : this.editForm.role,
              'isLock' : this.editForm.isLock
            }).then(res => {
              this.editLoading = false;
              //控制跳转
              if(res.returnCode == '1111'){
                // 表单重置
                this.$refs["editForm"].resetFields();
                this.editFormVisible = false;
                this.getInfo();     
              }else if(res.returnCode == '0000'){
                this.$message.warning(res.returnMessage);
              }else{
                this.$message.error(res.message);
              }
            })
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
          //调用接口
          insertAdmin({
              'username' : this.addForm.username,
              'password' : md5(this.addForm.password),
              'role' : this.addForm.role
            }).then(res => {
              this.editLoading = false;
              //控制跳转
              if(res.returnCode == '1111'){
                // 表单重置
                this.$refs["addForm"].resetFields();
                this.addFormVisible = false;
                this.getInfo();  
              }else if(res.returnCode == '0000'){
                this.$message.warning(res.returnMessage);
              }else{
                this.$message.error(res.message);
              }
            })
          });
        }
      });
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
