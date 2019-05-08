<template>
  <div class="box">
    <el-form :inline="true" :model="locationMsg" :rules="rules" ref="locationMsg" class="demo-form-inline">
      <el-form-item label="关键字搜索">
        <el-input v-model="locationMsg.keyword" placeholder="地址模糊搜索" id="suggestId"></el-input>
      </el-form-item>
      <el-form-item label="经纬度" prop="lnglat">
        <el-input v-model="locationMsg.lnglat" placeholder="鼠标左击获取经纬度" id="lnglat"></el-input>
      </el-form-item>
      <el-form-item label="所在地址" prop="address">
        <el-input v-model="locationMsg.address" placeholder="根据经纬度自动生成" id="address"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm(locationMsg)">确定</el-button>
      </el-form-item>
    </el-form>
    <div id="l-map" style="height:500px"></div>
    <div id="searchResultPanel" style="border:1px solid #C0C0C0;width:150px;height:auto; display:none;"></div>
  </div>
</template>
<script>
import bus from "../../utils/bus.js";
export default {
  props: {
    BMapMsg: {
      keyword: String,
      lnglat: String,
      address: String
    }
  },
  data() {
    return {
      // 百度地图经纬度
      locationMsg: {
        keyword: "",
        lnglat: "",
        address: ""
      },
      // 百度地图确定地址的规则
      rules: {
        lnglat: [
          {
            required: true,
            message: "请输入获取经纬度",
            trigger: "blur"
          }
        ],
        address: [
          {
            required: true,
            message: "根据经纬度自动生成",
            trigger: "blur"
          }
        ]
      }
    };
  },
  methods: {
    // 地图js
    // loadmap
    loadmap() {
      var _this = this;
      // 百度地图API功能
      function G(id) {
        return document.getElementById(id);
      }


      var map = new BMap.Map("l-map");
      map.enableScrollWheelZoom(); //启用滚轮放大缩小，默认禁用
      map.enableContinuousZoom(); //启用地图惯性拖拽，默认禁用
      map.centerAndZoom("北京", 6); // 初始化地图,设置城市和地图级别。

      var point = new BMap.Point(116.312777,39.979958);
      var marker = new BMap.Marker(point);        // 创建标注    
      map.addOverlay(marker);
      marker.addEventListener("click", function(e){    
          alert("当前位置：116.312777,39.979958");    
      })

      var mapPoints = [
                {x:30.312903,y:120.382029},
                {x:30.215855,y:120.024568},
                {x:30.18015,y:120.174968},
                {x:30.324994,y:120.164399},
                {x:30.24884,y:120.305074}
            ];

      var i = 0;
      // 函数 创建多个标注
            function markerFun (points) {
                var markers = new BMap.Marker(points);
                map.addOverlay(markers);
            }
            for (;i<mapPoints.length;i++) {
                var points = new BMap.Point(mapPoints[i].y,mapPoints[i].x);//创建坐标点
                markerFun(points);
            }

            getBoundary();
 
            function   getBoundary(){       
                var bdary = new BMap.Boundary();
                //var name = document.getElementById("districtName").value;
                bdary.get("山西", function(rs){       //获取行政区域
                    //map.clearOverlays();        //清除地图覆盖物       
                    var count = rs.boundaries.length; //行政区域的点有多少个
                    for(var i = 0; i < count; i++){
                        var ply = new BMap.Polygon(rs.boundaries[i], {strokeWeight: 2, strokeColor: "#ff0000"}); //建立多边形覆盖物
                        map.addOverlay(ply);  //添加覆盖物
                        //map.setViewport(ply.getPath());    //调整视野         
                    }                
                });   
            }

      var geoc = new BMap.Geocoder();
      map.addEventListener("click", function(e) {
        var pt = e.point;
        _this.locationMsg.lnglat = pt.lng + "," + pt.lat;
        map.clearOverlays();
        map.addOverlay(new BMap.Marker(pt)); //添加标注
        geoc.getLocation(pt, function(rs) {
          var addComp = rs.address;
          if (addComp == "") {
            _this.locationMsg.address = "";
            _this.$message.error("无法获取当前位置信息");
          } else {
            _this.locationMsg.address = addComp;
          }
        });
      });
      var ac = new BMap.Autocomplete({
        //建立一个自动完成的对象
        input: "suggestId",
        location: map
      });

      ac.addEventListener("onhighlight", function(e) {
        //鼠标放在下拉列表上的事件
        var str = "";
        var _value = e.fromitem.value;
        var value = "";
        if (e.fromitem.index > -1) {
          value =
            _value.province +
            _value.city +
            _value.district +
            _value.street +
            _value.business;
        }
        str =
          "FromItem<br />index = " +
          e.fromitem.index +
          "<br />value = " +
          value;

        value = "";
        if (e.toitem.index > -1) {
          _value = e.toitem.value;
          value =
            _value.province +
            _value.city +
            _value.district +
            _value.street +
            _value.business;
        }
        str +=
          "<br />ToItem<br />index = " +
          e.toitem.index +
          "<br />value = " +
          value;
        G("searchResultPanel").innerHTML = str;
      });

      var myValue;
      ac.addEventListener("onconfirm", function(e) {
        //鼠标点击下拉列表后的事件
        var _value = e.item.value;
        myValue =
          _value.province +
          _value.city +
          _value.district +
          _value.street +
          _value.business;
        G("searchResultPanel").innerHTML =
          "onconfirm<br />index = " +
          e.item.index +
          "<br />myValue = " +
          myValue;

        setPlace();
      });

      function setPlace() {
        map.clearOverlays(); //清除地图上所有覆盖物
        function myFun() {
          // console.log(local.getResults())
          var pp = local.getResults().getPoi(0).point; //获取第一个智能搜索的结果
          console.log(pp);
          map.centerAndZoom(pp, 15);
          map.addOverlay(new BMap.Marker(pp)); //添加标注
        }
        var local = new BMap.LocalSearch(map, {
          //智能搜索
          onSearchComplete: myFun
        });
        local.search(myValue);
      }
    },

    // 点击提交
    submitForm() {
      var _this = this;
      this.$refs.locationMsg.validate(valid => {
        if (valid) {
          bus.$emit("BDialogVisible", false);
          bus.$emit("locationMsg", _this.locationMsg);
          // console.log(_this.locationMsg)
        } else {
          return false;
        }
      });
    }
  },
  mounted() {
    this.loadmap(); //加载地图和相关组件
  }
};
</script>
<style>
.box {
  width: 100%;
  height: 100%;
}
</style>
