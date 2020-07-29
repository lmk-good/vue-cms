<template>
  <div class="params">
      <!-- 面包屑区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/Home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品参数</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card>
        <!-- 警告区域 -->
        <el-alert
        title="只允许为第三级分类设置相关参数"
        type="warning"
        :closable='false'
        show-icon>
        </el-alert>
        <!-- 选择商品分类 -->
        <el-row class="cat_opt">
            <el-col>
                <span>选择商品分类:</span>
                <!-- 选择商品分类的级联选择框 -->
                 <el-cascader
                 v-model="selectedKeys"
                 expand-trigger="hover"
                 :options="catelist"
                 :props="cateProps"
                 @change="handleChange"></el-cascader>
            </el-col>
        </el-row>
        <!-- tab区域 -->
        <el-tabs v-model="activeName" @tab-click="handleTabClick">
          <el-tab-pane label="动态参数" name="first">
            <el-button type="primary" size="mini" :disabled="isBtnDis">添加参数</el-button>
          </el-tab-pane>
          <el-tab-pane label="静态属性" name="second">
            <el-button type="primary" size="mini" :disabled="isBtnDis">添加属性</el-button>
          </el-tab-pane>
        </el-tabs>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 商品分类数组
      catelist: [],
      // 级联选择数据
      cateProps: {
        value: 'cat_pid',
        label: 'cat_name',
        children: 'children'
      },
      // 级联选择
      selectedKeys: [],
      // 被激活的页签名称
      activeName: 'first'
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    async getCateList() {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品分类失败')
      }
      this.catelist = res.data
      console.log(this.catelist)
    },
    // 级联选择框变化会触发这个函数
    handleChange() {
      if (this.selectedKeys.length !== 3) {
        this.selectedKeys = []
        return
      }
      console.log(this.selectedKeys)
    },
    // Tab签
    handleTabClick() {
    }
  },
  computed: {
    isBtnDis() {
      if (this.selectedKeys.length !== 3) {
        return true
      }
      return false
    }
  }
}
</script>

<style>
.cat_opt{
  margin-top: 15px;
}
.el-cascader {
  margin-left: 20px;
}
</style>
