<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right" class="crumb">
      <el-breadcrumb-item :to="{ path: '/dashboard' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>杨海东的个人简历</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card" >
      <div slot="header" class="clearfix">
        <span style="color: blue">个人信息</span>
      </div>
      <el-row type="flex" class="row-bg">
        <el-col :span="6">姓名：杨海东</el-col>
        <el-col :span="6">出生日期:1994-05-30</el-col>
        <el-col :span="6">籍贯:辽宁</el-col>
        <el-col :span="6">性别: 男</el-col>
      </el-row>
    <el-row type="flex" class="row-bg">
      <el-col :span="9">电子邮件:haidong.y@outlook.com</el-col>
      <el-col :span="9">电话:188-4202-5646</el-col>
    </el-row>
    <el-row type="flex" class="row-bg">
      <el-col :span="6">工作经验:两年以上</el-col>
    </el-row>

    </el-card>

    <el-card class="box-card" >
      <div slot="header" class="clearfix">
        <span style="color: blue">求职意向</span>
      </div>
    <el-row type="flex" class="row-bg">
      <el-col :span="6">软件工程师 （Java）</el-col>
    </el-row>

    </el-card>

    <el-card class="box-card" >
      <div slot="header" class="clearfix">
        <span style="color: blue">专业技能</span>
      </div>
    <el-row type="flex" class="row-bg">
      <el-col :span="24">熟练使用Java,Spring Boot,Mybatis,熟悉Spring Cloud</el-col>
    </el-row>
    <el-row type="flex" class="row-bg">
      <el-col :span="24">熟练使用Maven，Gradle等构建工具</el-col>
    </el-row>
    <el-row type="flex" class="row-bg">
      <el-col :span="24">熟练使用Eclipse,IntelliJ IDEA,VS Code等开发工具</el-col>
    </el-row>
    <el-row type="flex" class="row-bg">
      <el-col :span="24">熟练使用Git,Svn等版本管理工具</el-col>
    </el-row>
    <el-row type="flex" class="row-bg">
      <el-col :span="24">熟练使用MySql数据库,熟悉Oracle数据库,能够对Hbase进行数据检索</el-col>
    </el-row>
    <el-row type="flex" class="row-bg">
      <el-col :span="24">熟练使用Restful风格接口编程以及Jersey框架</el-col>
    </el-row>
    <el-row type="flex" class="row-bg">
      <el-col :span="24">能够配置Nginx反向代理服务器</el-col>
    </el-row>
    <el-row type="flex" class="row-bg">
      <el-col :span="24">熟悉MQTT协议，能够搭建Apollo消息中间件服务器</el-col>
    </el-row>
    <el-row type="flex" class="row-bg">
      <el-col :span="24">能够使用Vue+Element ui进行页面开发，能够使用Node js,Webpack进行项目创建及构建</el-col>
    </el-row>
    <el-row type="flex" class="row-bg">
      <el-col :span="24">熟悉单点登录以及鉴权</el-col>
    </el-row>
    <el-row type="flex" class="row-bg">
      <el-col :span="24">熟悉Linux系统常用命令</el-col>
    </el-row>
    <el-row type="flex" class="row-bg">
      <el-col :span="24">拥有自己开发的网站</el-col>
    </el-row>
    </el-card>

    <el-card class="box-card" >
      <div slot="header" class="clearfix">
        <span style="color: blue">项目经历</span>
      </div>
    <el-row type="flex" class="row-bg">
      <span style="font-weight: 700;">
        项目1：思特奇物联网运营平台 2018.6 - 至今
      </span>
    </el-row>
    <el-row type="flex" class="row-bg">
      <el-col :span="24">工作中完成：</el-col>
    </el-row>
    <el-row type="flex" class="row-bg">
      <el-col :span="24">1.采用Spring Boot搭建系统框架，持久层使用mybatis，数据库Mysql，Hbase，页面使用Vue + Element UI；</el-col>
    </el-row>
    <el-row type="flex" class="row-bg">
      <el-col :span="24">2.垂直行业应用开发：人脸识别考勤系统（应用于思特奇北京总部）,智慧焊接系统,设备管理模块开发；</el-col>
    </el-row>
    <el-row type="flex" class="row-bg">
      <el-col :span="24">3.工程上线发布；</el-col>
    </el-row>
    <el-row type="flex" class="row-bg">
      <el-col :span="24">4.配合领导进行任务下发,项目进度跟踪与日常管理。</el-col>
    </el-row>
    <el-row type="flex" class="row-bg">
      <el-col :span="24">5.带领实习生完成开发工作，下发开发任务。</el-col>
    </el-row>
    <el-row type="flex" class="row-bg">
      <el-col :span="24">6.组织会议，知识分享；</el-col>
    </el-row>

<el-row type="flex" class="row-bg">
      <span style="font-weight: 700;">
        项目2：汽车租赁系统 2016.11 - 2018.3
      </span>
    </el-row>
    <el-row type="flex" class="row-bg">
      <el-col :span="24">项目中完成：</el-col>
    </el-row>
    <el-row type="flex" class="row-bg">
      <el-col :span="24">1.功能开发：采用Spring MVC，ibatis，angular2进行开发，数据库使用oracle11g；</el-col>
    </el-row>
    <el-row type="flex" class="row-bg">
      <el-col :span="24">2.系统维护：系统代码比较混乱，采用java嵌入在jsp中的写法。</el-col>
    </el-row>
    <el-row type="flex" class="row-bg">
      <el-col :span="24">3.日常维护：项目组服务器维护，VSS权限配置，域控服务器配置，项目组成员电脑维护等；</el-col>
    </el-row>
    <el-row type="flex" class="row-bg">
      <el-col :span="24">4.代码托管在github；</el-col>
    </el-row>
    <el-row type="flex" class="row-bg">
      <el-col :span="24">5.经过此阶段对软件开发有了整体的认识</el-col>
    </el-row>

    </el-card>


    <el-card class="box-card" >
      <div slot="header" class="clearfix">
        <span style="color: blue">工作经历</span>
      </div>
    <el-row type="flex" class="row-bg">
      <span style="font-weight: 700;">
        2018.6～至今：北京思特奇信息技术股份有限公司
      </span>
    </el-row>
    <el-row type="flex" class="row-bg">
      <el-col :span="24">1.任职思特奇公司物联网实验室，主要致力于物联网运营平台的研发工作；</el-col>
    </el-row>
    <el-row type="flex" class="row-bg">
      <el-col :span="24">2.工作中涉及垂直行业应用开发,平台搭建.主要包括人脸识别系统,智慧焊接,设备接入,设备管理等.</el-col>
    </el-row>
    <el-row type="flex" class="row-bg">
      <el-col :span="24">3.数据存储在分布式MySQL以及HBase；</el-col>
    </el-row>
    <el-row type="flex" class="row-bg">
      <el-col :span="24">4.网关与平台通过MQTT协议进行消息传输,数据均采用JSON格式；</el-col>
    </el-row>
    <el-row type="flex" class="row-bg">
      <el-col :span="24">5.系统前后端分离,页面侧采用vue进行开发。</el-col>
    </el-row>
    <el-row type="flex" class="row-bg">
      <el-col :span="24">6.项目部署在公司内网服务器，主要应用技术包括：spring boot,springcloud,vue,持久层采用mybatis,接口采用restful风格。</el-col>
    </el-row>

<el-row type="flex" class="row-bg">
      <span style="font-weight: 700;">
        2016.10～2018.3 ：大连华信计算机技术股份有限公司
      </span>
    </el-row>
    <el-row type="flex" class="row-bg">
      <el-col :span="24">实习期间从事汽车租赁系统的运维工作，主要正常cr作业，配合现场人员完成功能的增改以及bug修复。</el-col>
    </el-row>
    <el-row type="flex" class="row-bg">
      <el-col :span="24">主要语言Java，Jsp，Js等；</el-col>
    </el-row>
    <el-row type="flex" class="row-bg">
      <el-col :span="24">转正后从事汽车租赁系统开发工作,使用框架及工具有：anjular2，type script，bootstrap，adminlte，Java，spring mvc，ibatis，Oracle11g，Git等。</el-col>
    </el-row>
    <el-row type="flex" class="row-bg">
      <el-col :span="24">在公司期间一直担任设备管理员，熟悉机器常用配置，熟悉VSS权限管理，熟悉域控服务器权限管理。对Java以及Jsp使用熟练。</el-col>
    </el-row>
    </el-card>

    <el-card class="box-card" >
      <div slot="header" class="clearfix">
        <span style="color: blue">教育背景</span>
      </div>
    <el-row type="flex" class="row-bg">
      <el-col :span="6">2013-9 ~ 2017-06：</el-col>
      <el-col :span="6">辽宁科技大学</el-col>
      <el-col :span="6">网络工程专业</el-col>
    </el-row>
    </el-card>

    <el-card class="box-card" >
      <div slot="header" class="clearfix">
        <span style="color: blue">培训经历</span>
      </div>
    <el-row type="flex" class="row-bg">
      <el-col :span="6">2016.07 ~ 2016.10 Java培训</el-col>
    </el-row>
    <el-row type="flex" class="row-bg">
      <el-col :span="6">培训机构：沈阳华信</el-col>
    </el-row>
    <el-row type="flex" class="row-bg">
      <el-col :span="12">主要培训内容：html页面，java，struts2，oracle；</el-col>
    </el-row>
    </el-card>

    <el-card class="box-card" >
      <div slot="header" class="clearfix">
        <span style="color: blue">自我评价</span>
      </div>
    <el-row type="flex" class="row-bg">
      <el-col :span="24">1.外向，喜欢活跃的氛围以及工作环境；</el-col>
    </el-row>
    <el-row type="flex" class="row-bg">
      <el-col :span="24">2.对新语言的学习能力强，喜欢探索新知识，喜欢在imooc了解与学习新技术；</el-col>
    </el-row>
    <el-row type="flex" class="row-bg">
      <el-col :span="24">3.对工作认真负责，能够独立解决开发中遇到的问题；</el-col>
    </el-row>
    <el-row type="flex" class="row-bg">
      <el-col :span="24">4.拥有自己独自开发的网站，托管在Github；</el-col>
    </el-row>
    </el-card>
    

  </div>
</template>

<script>

export default {
  data() {
    return {
    };
  },
  methods: {}
};
</script>

<style scoped>
/* 面包屑 */

.crumb {
  height: 36px;
  line-height: 36px;
}

.row-bg {
    padding: 10px 0;
    /*background-color: #f9fafc;*/
  }
</style>
