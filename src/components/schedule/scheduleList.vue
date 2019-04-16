<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right" class="crumb">
      <el-breadcrumb-item :to="{ path: '/home' }">后台</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/schedule' }">日程安排</el-breadcrumb-item>
    </el-breadcrumb>
    <!--检索条-->
    <!-- <el-col class="toolbar" style="padding-top: 15px;">
      <el-form :inline="true" :model="filters">
        <el-form-item label="关键字">
          <el-input v-model="filters.keyword" placeholder="关键字"></el-input>
        </el-form-item>
        <el-form-item label="创建时间">
          <el-col :span="11">
            <el-date-picker type="date" placeholder="开始日期" v-model="filters.StTime" value-format="yyyy-MM-dd" style="width: 100%;"></el-date-picker>
          </el-col>
          <el-col class="line" :span="1">~</el-col>
          <el-col :span="11">
            <el-date-picker type="date" placeholder="结束时间" v-model="filters.EndTime" value-format="yyyy-MM-dd" style="width: 100%;"></el-date-picker>
          </el-col>
        </el-form-item>
        <el-form-item label="日程状态">
          <el-select v-model="filters.Type" placeholder="日程状态">
            <el-option v-for="item in statusList" :key="item.value" :label="item.name" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getUsers()">查询</el-button>
          <el-button type="primary" @click.native="addFormVisible=true">添加待办</el-button>
        </el-form-item>
      </el-form>
    </el-col> -->
    <!--检索条-->
    <el-col class="toolbar" style="padding-top: 15px;">
      <el-form :inline="true" :model="filters">
        <el-form-item>
          <el-input v-model="filters.keyword" placeholder="关键字"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getUsers()">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click.native="addFormVisible=true">添加待办</el-button>
        </el-form-item>
      </el-form>
    </el-col>
    <!-- table 内容 -->
    <el-table 
      :data="scheduleList.slice((currentPage-1)*pageSize,currentPage*pageSize)"
      style="width: 100%" :border='true'>
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="详细描述:">
              <span>{{ props.row.remark }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column label="待办名称" prop="name">
      </el-table-column>
      <el-table-column label="优先级" prop="priority">
      </el-table-column>
      <el-table-column label="状态" prop="status" :formatter="Status">
      </el-table-column>
      <el-table-column label="创建时间" prop="opTime">
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" plain icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <!-- <el-button size="mini" v-if="scope.row.status == 0" type="success" plain icon="el-icon-circle-check-outline" @click="handleSend(scope.$index, scope.row)" disabled>完成</el-button> -->
          <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--编辑界面-->
    <el-dialog title="编辑待办" :visible.sync="editFormVisible">
      <el-form :model="editForm" label-width="80px" ref="editForm" style="width:100%;text-align:center;">
        <el-form-item label="待办名称" prop="name">
          <el-input v-model="editForm.name" disabled></el-input>
        </el-form-item>
        <el-form-item label="优先级" prop="priority" >
          <el-select v-model="editForm.priority" style="width:100%">
            <el-option v-for="item in priorityList" :key="item.value" :label="item.name" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="editForm.status" placeholder="日程状态" style="width:100%">
            <el-option v-for="item in statusList" :key="item.value" :label="item.name" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="详细描述" prop="remark">
          <el-input type="textarea" v-model="editForm.remark"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="editFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
      </div>
    </el-dialog>

    <!--添加界面 :rules="addFormRules"-->
    <el-dialog title="添加待办" :visible.sync="addFormVisible">
      <el-form :model="addForm" label-width="80px"  ref="addForm" style="width:100%;text-align:center;">
        <el-form-item label="待办名称" prop="name">
          <el-input v-model="addForm.name"></el-input>
        </el-form-item>
        <el-form-item label="优先级" prop="priority" >
          <el-select v-model="addForm.priority" style="width:100%">
            <el-option v-for="item in priorityList" :key="item.value" :label="item.name" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="addForm.status" placeholder="日程状态" style="width:100%">
            <el-option v-for="item in statusList" :key="item.value" :label="item.name" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="详细描述" prop="remark">
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
export default {
  data() {
    return {

      scheduleList: [],//待办列表

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
      // 状态数组
      statusList: [
        {
          name: "已完成",
          value: 0
        },
        {
          name: "待办",
          value: 1
        }
      ],

      //优先级数组
      priorityList:[
        {
          name: "低",
          value: "低"
        },
        {
          name: "中",
          value: "中"
        },
        {
          name: "高",
          value: "高"
        }
      ],

      //编辑界面是否显示
      editFormVisible: false,
      editLoading: false,

      //编辑界面数据
      editForm: {
        name: "",
        priority: "",
        status: 0,
        remark: ""
      },

      //添加待办界面是否显示
      addFormVisible: false,
      addLoading: false,

      //发货界面数据
      addForm: {
        name: "",
        priority: "",
        status: 0,
        remark: ""
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

    getScheduleList(){
      try {
        var _this = this
        //发送登录验证请求
        const res = axios.post(
          '/app/schedule/selectAll',
          {
            'username': sessionStorage.getItem("username")
          }).then(
          function(response) {
            var returnCode = response.data.returnCode;
            if (returnCode == "1111") {
                 _this.scheduleList = response.data.result
                 console.log(response.data.result)
                 _this.pageCount = response.data.result.length
            //令牌失效
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

            } else {
                this.$message({
                showClose: true,
                type: "warning",
                message: response.data.returnMessage
                });
            }
           
            //ss.pageCount = response.data.result.length();
          })
        
      } catch (err) {
        console.log(err)
      }
    },

    //关键字搜索
    getUsers() {
      //this.getInfo();
      // console.log(this.filters)
    },
    // 分页
    handleCurrentChange(val) {
      this.currentPage = val
      //this.getInfo();
    },

    handleSizeChange(val) {
      this.pageSize = val
    },

    /*
          1、添加编辑时获取角色列表，渲染下拉菜单
          2、点击管理员列表的编辑，弹出模态框
          3、点击新增管理严，弹出模态框
          4、保存修改
          5、保存添加
        */
    handleEdit(index, row) {
      var obj = Object.assign({}, row);
      console.log(obj);
      this.editForm.name = obj.name;
      this.editForm.priority = obj.priority;
      this.editForm.status = obj.status;
      this.editForm.remark = obj.remark;
      this.editFormVisible = true;
    },

    handleDelete(index, row) {
      // 发删除请求
       var obj = Object.assign({}, row);

            this.$http
              .post("/app/schedule/delete", {
                'id' : obj.id
              })
              .then(
                function(response) {
                  this.editLoading = false;
                  var returnCode = response.data.returnCode;
                  if (returnCode == "1111") {
                    this.$message({
                      showClose: true,
                      type: "success",
                      message: response.data.returnMessage
                    });
                    // 表单重置
                    this.getScheduleList();
                  //令牌失效
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
                  console.log(error)
                  this.$notify.error({
                    title: "错误",
                    message: "错误：请检查网络"
                  });
                }.bind(this)
              );
    },

    editSubmit() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          //判断是否填写完整  --true
          this.$confirm("确认提交吗？", "提示", {}).then(() => {
            this.editLoading = true;

            // 发保存请求
            this.$http
              .post("/app/schedule/edit", {
                'name' : this.editForm.name,
                'priority' : this.editForm.priority,
                'status' : this.editForm.status,
                'remark' : this.editForm.remark,
                'username' : sessionStorage.getItem("username")
              })
              .then(
                function(response) {
                  this.editLoading = false;
                  var returnCode = response.data.returnCode;
                  if (returnCode == "1111") {
                    // 表单重置
                    this.$refs["editForm"].resetFields();
                    this.editFormVisible = false;
                    this.getScheduleList();
                  //令牌失效
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

    //添加待办事项
    addSubmit() {
      this.$refs.addForm.validate(valid => {
        if (valid) {
          //判断是否填写完整  --true
          this.$confirm("确认提交吗？", "提示", {}).then(() => {
            this.sendLoading = true;

            // 发保存请求
            this.$http
              .post("/app/schedule/add", {
                 'name' : this.addForm.name,
                 'priority' : this.addForm.priority,
                 'status' : this.addForm.status,
                 'remark' : this.addForm.remark,
                 'username' : sessionStorage.getItem("username")
              })
              .then(
                function(response) {
                  this.addLoading = false;
                  var returnCode = response.data.returnCode;

                  if (returnCode == "1111") {
                    // 表单重置
                    this.$refs["addForm"].resetFields();
                    this.addFormVisible = false;
                    this.getScheduleList();

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
    this.getScheduleList();
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
</style>
