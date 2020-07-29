<template>
  <!-- 面包屑区域 -->
  <div class="Report">
       <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/Home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>
  <!-- 卡片视图 -->
    <el-card>
         <div id="main" style="width: 600px;height:400px;"></div>
    </el-card>
  </div>
</template>

<script>
// 导入echarts
import echarts from 'echarts'
export default {
  async mounted() {
    var myChart = echarts.init(document.getElementById('main'))
    const { data: res } = await this.$http.get('reports/type/1')
    if (res.meta.status !== 200) {
      return this.$message.error('获取折线图数据失败')
    }
    myChart.setOption(res.data)
  }

}
</script>

<style>

</style>
