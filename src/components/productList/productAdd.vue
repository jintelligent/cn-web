<template>
  <div>
    <el-header>
      <el-breadcrumb separator-class="el-icon-arrow-right" class="crumb">
        <el-breadcrumb-item :to="{ path: '/' }">后台</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/P_GetProductList' }">学习笔记</el-breadcrumb-item>
        <el-breadcrumb-item>添加笔记</el-breadcrumb-item>
      </el-breadcrumb>
    </el-header>

    <el-main style="width:70%;">
      <el-form :model="addForm" :rules="rules" ref="addForm" label-width="150px" class="demo-addForm">
        <el-form-item label="笔记标题" prop="noteHead">
          <el-input v-model="addForm.noteHead"></el-input>
        </el-form-item>       

        <el-form-item label="笔记类别" prop="IsFreeShipping">
          <el-radio-group v-model="addForm.IsFreeShipping">
            <el-radio class="radio" :label="1">Java</el-radio>
            <el-radio class="radio" :label="2">Vue</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="笔记内容" prop="noteBody">
          <el-button type="info" @click="clickOpenDetail()">点击添加笔记内容</el-button>
        </el-form-item>
        
        <el-form-item label="学习感受" prop="studyFeel">
          <el-input type="textarea" v-model="addForm.studyFeel"></el-input>
        </el-form-item>

<!--         <el-form-item label="添加图片" prop="Image">
          <el-upload v-model="addForm.Image" class="avatar-uploader" 
            :limit="5" 
            :action="action" :on-preview="handlePictureCardPreview"
            list-type="picture-card" 
            :file-list="Images" 
            :on-success="handleAvatarSuccess" 
            :on-remove="handleRemove">
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="">
          </el-dialog>
          <span>最多上传五张，且图片宽高比为：1/1</span>
        </el-form-item> -->

        <el-form-item>
          <el-button type="primary" @click="submitForm('addForm')">立即添加</el-button>
          <el-button @click="resetForm('addForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-main>
    <!-- 弹出框 添加笔记内容 -->
    <el-dialog title="添加笔记内容" :visible.sync="openDetails">
      <div class="edit_container">
            <quill-editor
                v-model="content" 
                ref="myQuillEditor"> 
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
import UEditor from "../UEditor.vue";

export default {
  data() {

    return {
      content: ``,
      editorOption: {},
      //上传图片接口地址
      action: "",
      //展示图片
      dialogImageUrl: "",
      dialogVisible: false,
      Images: [],

      addForm: {
        noteHead: "", //名称
        Image: [], //图片
        noteType: 0, //邮费选择
        studyFeel: "", //简介
        noteBody: ""
      },
      
      rules: {
        noteHead: [{ required: true,message: "请输入商品名称笔记标题",trigger: "blur" }],
        noteType: [{required: true,message: "请选择笔记类别",trigger: "change"}],
        // Image: [
        //   {
        //     type: "array",
        //     required: true,
        //     message: "请上传图片",
        //     trigger: "change"
        //   }
        // ],
        studyFeel: [{required: true,message: "请输入学习感受",trigger: "blur"}],
        noteBody: [{ required: true,  message: "图文详情不能为空", trigger: "blur"}]
      },
      // 图文详情
      openDetails: false,

      config: {
        initialFrameWidth: null,
        initialFrameHeight: 350
      }
    };
  },
  components: { UEditor },
  methods: {
    // 添加提交
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          //判断是否填写完整  --true
          this.$confirm("确认提交吗？", "提示", {}).then(() => {
            this.addLoading = true;
            var para = Object.assign({}, this.addForm);
            // para.Image = para.Image.join(",");

            this.$http
              .post("/app/studyNotes/add",
                {
                  'username' : sessionStorage.getItem("username"),
                  'noteHead' : para.noteHead,
                  'noteBody' : para.noteBody,
                  'noteType' : para.noteType,
                  'studyFeel' : para.studyFeel
                })
              .then(
                function(response) {
                  this.addLoading = false;
                  var returnCode = response.data.returnCode;
                  if (returnCode == '1111') {
                    this.$message({
                      showClose: true,
                      type: "success",
                      message: response.data.returnMessage
                    });
                    // 表单重置
                    this.$refs["addForm"].resetFields();
                    this.addFormVisible = false;
                    this.$router.push({
                      path: "/P_GetProductList"
                    });
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
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 查看图片
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    /*
       移除图片 
        handleRemove(file, fileList)  移除的文件，（需要重新打印查看返回参数）
      */
    handleRemove(file, fileList) {
      var newArr = [];
      for (let index = 0; index < fileList.length; index++) {
        var element = [fileList[index].response.Result[0]];
        newArr = newArr.concat(element);
      }
      this.addForm.Image = newArr;
    },
    /*
      上传成功的回调函数
        handleAvatarSuccess(response, file, fileList) 
        respomse:请求回调，返回上传的图片地址
        file：该图片的参数信息
        fileList 返回当前所有的图片数组，
      */
    handleAvatarSuccess(response, file, fileList) {
      var arrImg = [];
      arrImg = arrImg.concat(response.Result[0]);
      this.addForm.Image = this.addForm.Image.concat(arrImg);
    },
    /*
      点击打开图文详情框
      
      */

    // clickOpenDetail(detail) {
    //   this.openDetails = true;
    //   this.content = decodeURIComponent(detail);
    // },
      clickOpenDetail() {
      this.openDetails = true;
    },
    addSubmit() {
      // var content = this.$refs.ueditor.getUEContent();
      this.addForm.noteBody = encodeURIComponent(this.content);
      console.log(this.addForm.noteBody)
      this.openDetails = false;
    },
    /*
      重置表单
      */
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  },
  mounted() {}
};
</script>
<style scoped>

</style>
