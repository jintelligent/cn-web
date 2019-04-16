<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right" class="crumb">
      <el-breadcrumb-item :to="{ path: '/' }">后台</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/upload' }">文件上传</el-breadcrumb-item>
    </el-breadcrumb>

    <el-upload
      class="upload-demo"
      drag
      action="https://jsonplaceholder.typicode.com/posts/"
      multiple>
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
      <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
    </el-upload>
  </div>
</template>

<script>

export default {
  data() {
    return {
    };
  },
  methods: {

    getInfo() {
      this.$http
        .get("../../../static/JSON/Roles.json"
        //   "/hxmback/api/Role/GetRoles", 
        // {
        //   params: {
        //     pageIndex: this.pageIndex,
        //     pageSize: this.pageSize
        //   }
        // }
        )
        .then(
          function(response) {
            var status = response.data.Status;
            if (status === 1) {
              this.roleList = response.data.Result.data;
              this.pageCount = response.data.Result.PageIndex;
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
    }
}
};
</script>

<style scoped>
/* 面包屑 */

.crumb {
  height: 36px;
  line-height: 36px;
}
</style>
