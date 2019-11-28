<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right" class="crumb">
      <el-breadcrumb-item :to="{ path: '/dashboard' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>接口管理</el-breadcrumb-item>
    </el-breadcrumb>

    <!--检索条-->
    <el-col class="toolbar" style="padding-top: 15px;">
      <el-form :inline="true" :model="filters">
        <el-form-item>
          <el-input v-model="filters.keyword" placeholder="关键字"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getUsers()" icon="el-icon-search"></el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click.native="addFormVisible=true" icon="el-icon-plus" ></el-button>
        </el-form-item>
      </el-form>
    </el-col>
    <!-- table 内容 -->
    <el-table 
      :data="interList.slice((currentPage-1)*pageSize,currentPage*pageSize)"
      style="width: 100%" :border='true'>
      <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="接口地址">
                <span>{{ props.row.url }}</span>
              </el-form-item>
              <el-form-item label="请求参数">
                <span>{{ props.row.param }}</span>
              </el-form-item>
              <el-form-item label="创建时间">
                <span>{{ props.row.createTime }}</span>
              </el-form-item>
              <el-form-item label="参数描述">
                <span>{{ props.row.remark }}</span>
              </el-form-item>
            </el-form>
          </template>
      </el-table-column>
      <el-table-column type="index" :index="indexMethod">
      </el-table-column>
      <el-table-column label="接口名称" prop="name">
      </el-table-column>
      <el-table-column label="请求方式" prop="method">
      </el-table-column>
      <el-table-column label="创建时间" prop="createTime">
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" plain icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)"></el-button>
          <el-button size="mini" type="danger" icon="el-icon-delete" @click="handleDelete(scope.$index, scope.row)"></el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--编辑界面-->
    <el-dialog title="编辑接口信息" :visible.sync="editFormVisible">
      <el-form :model="editForm" label-width="80px" ref="editForm" style="width:100%;text-align:center;">
        <el-form-item label="接口id" prop="id">
          <el-input v-model="editForm.id" disabled></el-input>
        </el-form-item>
        <el-form-item label="接口名称" prop="name">
          <el-input v-model="editForm.name"></el-input>
        </el-form-item>
        <el-form-item label="接口地址" prop="url">
          <el-input v-model="editForm.url"></el-input>
        </el-form-item>
        <el-form-item label="请求方式" prop="method" >
          <el-select v-model="editForm.method" style="width:100%">
            <el-option v-for="item in methodList" :key="item.value" :label="item.name" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="请求参数" prop="param">
          <el-input type="textarea" v-model="editForm.param"></el-input>
        </el-form-item>
        <el-form-item label="参数描述" prop="remark">
          <el-input type="textarea" v-model="editForm.remark"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="editFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
      </div>
    </el-dialog>

    <!--添加界面 :rules="addFormRules"-->
    <el-dialog title="接口录入" :visible.sync="addFormVisible">
      <el-form :model="addForm" label-width="80px"  ref="addForm" style="width:100%;text-align:center;">
        <el-form-item label="接口名称" prop="name">
          <el-input v-model="addForm.name"></el-input>
        </el-form-item>
        <el-form-item label="接口地址" prop="url">
          <el-input v-model="addForm.url"></el-input>
        </el-form-item>
        <el-form-item label="请求方式" prop="method" >
          <el-select v-model="addForm.method" style="width:100%">
            <el-option v-for="item in methodList" :key="item.value" :label="item.name" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="请求参数" prop="param">
          <el-input type="textarea" v-model="addForm.param"></el-input>
        </el-form-item>
        <el-form-item label="参数描述" prop="remark">
          <el-input type="textarea" v-model="addForm.remark"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="addFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
      </div>
    </el-dialog>
    

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
<!--     <div class="block">
      <el-pagination @current-change="handleCurrentChange" layout="prev, pager, next,jumper" :page-count="pageCount">
      </el-pagination>
    </div> -->
  </div>
</template>
<script>
import axios from 'axios';
// 导入接口
import { selectAllInter, insertInter, updateInter, deleteInter } from '@/axios/api';

export default {
  data() {
    return {

      interList: [],//待办列表

      currentPage: 1,
      pageSize: 5,
      pageCount: 1,

      // 搜索关键字
      filters: {
        keyword: "",
        StTime: "2018-01-01",
        EndTime: "",
        Type: 0
      },

      //优先级数组
      methodList:[
        {
          name: "Post",
          value: "Post"
        },
        {
          name: "Put",
          value: "Put"
        },
        {
          name: "Get",
          value: "Get"
        },
        {
          name: "Delete",
          value: "Delete"
        }
      ],

      //编辑界面是否显示
      editFormVisible: false,
      editLoading: false,

      //编辑界面数据
      editForm: {
        name: "",
        url: "",
        param: "",
        remark: "",
        id: "",
        method: "Post"
      },

      //添加待办界面是否显示
      addFormVisible: false,
      addLoading: false,

      //发货界面数据
      addForm: {
        name: "",
        url: "",
        param: "",
        remark: "",
        method: "Post"
      }
    };
  },
  methods: {

    Status(row, status) {
      switch(row[status.property]){
        case 0:
          return "已完成";
        case 1:
          return "待办";
      }
    },

    getInterList(){
      var _this = this
      selectAllInter().then(res => {
          //控制跳转
          if(res.returnCode == '1111'){
            _this.interList = res.result
            console.log(res.result)
            _this.pageCount = res.result.length
            
          }else if(res.returnCode == '0000'){
            this.$message.warning(res.returnMessage);
          }else{
            this.$message.error(res.message);
          }
        })

    },

    //关键字搜索
    getUsers() {},
    // 分页
    handleCurrentChange(val) {
      this.currentPage = val
    },

    handleSizeChange(val) {
      this.pageSize = val
    },

    /**
     * 
     * 加载编辑框中信息
     * @param  {[type]} index [description]
     * @param  {[type]} row   [description]
     * @return {[type]}       [description]
     */
    handleEdit(index, row) {
      var obj = Object.assign({}, row);
      console.log(obj);
      this.editForm.id = obj.id;
      this.editForm.name = obj.name;
      this.editForm.url = obj.url;
      this.editForm.param = obj.param;
      this.editForm.remark = obj.remark;
      this.editForm.method = obj.method;
      this.editFormVisible = true;
    },

    //删除按钮
    handleDelete(index, row) {
      // 发删除请求
       var obj = Object.assign({}, row);
       deleteInter({
          'id' : obj.id
        }).then(res => {
          //控制跳转
          if(res.returnCode == '1111'){
            this.$message.success(res.returnMessage);
            // 表单重置
            this.getInterList();            
          }else if(res.returnCode == '0000'){
            this.$message.warning(res.returnMessage);
          }else{
            this.$message.error(res.message);
          }
        })
    },
    indexMethod(index) {
        return this.pageSize * (this.currentPage-1) + index + 1;
    },

    editSubmit() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          //判断是否填写完整  --true
          this.$confirm("确认提交吗？", "提示", {}).then(() => {
            this.editLoading = true;
            console.log()
            //调用接口
            updateInter({
                'id' : this.editForm.id,
                'name' : this.editForm.name,
                'url' : this.editForm.url,
                'param' : this.editForm.param,
                'remark' : this.editForm.remark,
                'method' : this.editForm.method
                }).then(res => {
                  //控制跳转
                  if(res.returnCode == '1111'){
                    this.$message.success(res.returnMessage);
                    this.$refs["editForm"].resetFields();
                    this.editFormVisible = false;
                    this.editLoading = false;
                    // 表单重置
                    this.getInterList();            
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

    //添加待办事项
    addSubmit() {
      this.$refs.addForm.validate(valid => {
        if (valid) {
          //判断是否填写完整  --true
          this.$confirm("确认提交吗？", "提示", {}).then(() => {
            this.sendLoading = true;
            insertInter({
                 'name' : this.addForm.name,
                 'url' : this.addForm.url,
                 'param' : this.addForm.param,
                 'remark' : this.addForm.remark,
                 'method' : this.addForm.method,
                }).then(res => {
                  //控制跳转
                  if(res.returnCode == '1111'){
                    this.$refs["addForm"].resetFields();
                    this.addFormVisible = false;
                    this.sendLoading = false;
                    this.getInterList();           
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
    this.getInterList();
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
/* 弹出框 */
.el-dialog__body .el-form-item {
  width: 60%;
  margin-left: calc(50% - 30%);
}
/* 选择公司 */
.el-select--medium {
  width: 100%;
}
.el-input--medium {
  width: 100%;
}
.demo-table-expand {
    font-size: 0;
  }
.demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
.demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }
</style>
