<template>
  <div>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="求第二公共单词" name="first">
        <el-form :inline="true" :model="firstForm">
          <el-form-item label="s">
            <el-input v-model="firstForm.s"></el-input>
          </el-form-item>
          <el-form-item label="t">
            <el-input v-model="firstForm.t"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="getS()">查询</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="整数分解成若干连续整数的和" name="second">
        <el-form :inline="true" :model="sumForm">
          <el-form-item label="请输入正整数">
            <el-input v-model="sumForm.num"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="getSum()">查询</el-button>
          </el-form-item>
        </el-form>
        <el-form :inline="true" :model="sumForm">
          <el-form-item label="分解结果">
            <el-input type="textarea" :rows="7" v-model="this.num"></el-input>
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import md5 from "js-md5";
import { fs,fenjie } from '@/axios/api';
export default {
  data() {
    return {
      firstForm:{
        s:"",
        t:""
      },
      sumForm:{
        num:0
      },
      num:""
    };
  },
  methods: {

    getS(){
      fs({
          's': this.firstForm.s,
          't': this.firstForm.t
        })
      .then(res => {
          //控制跳转
          if(res.returnCode == '1111'){
            console.log(res.data)
            this.$alert(res.data, '第二公共单词', {
                confirmButtonText: '确定'
            })
            //this.pageCount = res.result.length
            
          }else if(res.returnCode == '0000'){
            this.$message.warning(res.returnMessage);
          }else{
            this.$message.error(res.message);
          }
        })
        .catch(
          function(error) {
            this.$notify.error({
              title: "错误",
              message: "错误：请检查网络"
            });
          }.bind(this)
        );

    },
    getSum(){
      fenjie({
          'num': this.sumForm.num
        })
      .then(res => {
          //控制跳转
          if(res.returnCode == '1111'){
            this.num = res.data
            //this.pageCount = res.result.length
            
          }else if(res.returnCode == '0000'){
            this.$message.warning(res.returnMessage);
          }else{
            this.$message.error(res.message);
          }
        })
        .catch(
          function(error) {
            this.$notify.error({
              title: "错误",
              message: "错误：请检查网络"
            });
          }.bind(this)
        );

    }
  },
  mounted() {
    //this.getInfo();
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
