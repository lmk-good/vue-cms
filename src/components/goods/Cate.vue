<template>
  <div class="Cate">
    <!-- 面包屑区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/Home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 页面卡片 -->
    <el-card>
        <el-button type="primary" @click="addCate">添加分类</el-button>
        <tree-table
        class="treetable"
        :data="cateList"
        :columns='columns'
        :selection-type='false'
        :expand-type="false"
        show-index
        index-text='#'
        border
        :show-row-hover='false'>
        <!-- 是否有效 -->
        <template slot="isOk" slot-scope="scope">
            <i class="el-icon-success" v-if="scope.row.cat_deleted===false" style="color:lightgreen"></i>
            <i class="el-icon-error" v-else style="color:red"></i>
        </template>
        <!-- 排序 -->
        <template slot="Order" slot-scope="scope">
            <el-tag size="mini" v-if="scope.row.cat_level===0">一级</el-tag>
            <el-tag size="mini" type="success" v-else-if="scope.row.cat_level===1">二级</el-tag>
            <el-tag size="mini" type="warning" v-else>三级</el-tag>
        </template>
        <!-- 操作 -->
        <template slot="opt" slot-scope="" width="300px">
            <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
        </template>
        </tree-table>
        <!-- 分页区域 -->
        <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
        </el-pagination>
    </el-card>
    <!-- 添加商品分类对话框 -->
    <el-dialog
    title="商品分类"
    :visible.sync="CateDialogVisible"
    width="50%"
    @close="addCateDialogClosed">
  <el-form :model="CateForm" :rules="CateRules" ref="CateRef" label-width="100px" class="demo-ruleForm">
  <el-form-item label="活动名称" prop="cat_name">
    <el-input v-model="CateForm.cat_name"></el-input>
  </el-form-item>
    <el-form-item label="父级分类">
      <el-cascader
      expand-trigger="hover"
       v-model="selectKeys"
       :options="ParentCateList"
       :props="cascaderProps"
       @change="parenCateChanged"
       clearable></el-cascader>
    </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="CateDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addCategory">确 定</el-button>
  </span>
</el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 查询条件
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      // 商品分类的数据列表，默认为空
      cateList: [],
      total: 0,
      // 为table指定列的定义
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        {
          label: '是否有效',
          // 表示当前列定义为模板列
          type: 'template',
          // 表示当前这一列使用模板名称
          template: 'isOk'
        },
        {
          label: '排序',
          // 表示当前列定义为模板列
          type: 'template',
          // 表示当前这一列使用模板名称
          template: 'Order'
        },
        {
          label: '操作',
          // 表示当前列定义为模板列
          type: 'template',
          // 表示当前这一列使用模板名称
          template: 'opt'
        }
      ],
      CateDialogVisible: false,
      CateForm: {
        cat_name: '',
        // 父id
        cat_pid: 0,
        // 等级
        cat_level: 0
      },
      CateRules: {
        cat_name: { required: true, message: '请输入分类名称', tigger: 'blur' }
      },
      // 父级分类
      ParentCateList: [],
      // 指定级联选择器的配置对象
      cascaderProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      // 选中的父级分类的id数组
      selectKeys: []
    }
  },
  created () {
    this.getCateList()
  },
  methods: {
    async getCateList() {
      const { data: res } = await this.$http.get('categories', { params: this.queryInfo })
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品分类失败')
      }
      this.cateList = res.data.result
      console.log(this.cateList)
      this.total = res.data.total
    },
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.getCateList()
    },
    handleCurrentChange (newPage) {
      this.queryInfo.pagenum = newPage
      this.getCateList()
    },
    // 添加商品分类
    addCate () {
      // 先获取父级列表
      this.getParentCateList()
      // 在展示对话框
      this.CateDialogVisible = true
    },
    // 获取父级分类的数据列表
    async getParentCateList () {
      const { data: res } = await this.$http.get('categories', { params: { type: 2 } })
      if (res.meta.status !== 200) {
        return this.$message.error('获取父级分类数据失败')
      }
      this.ParentCateList = res.data
    },
    // 选择项发生变化触发这个函数
    parenCateChanged() {
      console.log(this.selectKeys)
      // 如果selectedKeys 数组中的length大于0，证明选中的父级分类
      // 反之，就说明没有选中任何父级分类
      if (this.selectKeys.length > 0) {
        // 父级分类的id
        this.CateForm.cat_pid = this.selectKeys[this.selectKeys.length - 1]
        // 为当前分类的等级赋值
        this.CateForm.cat_level = this.selectKeys.length
        // eslint-disable-next-line no-useless-return
        return
      } else {
        this.CateForm.cat_pid = 0
        this.CateForm.cat_level = 0
      }
    },
    // 点击确定完成添加分类
    addCategory () {
      this.$refs.CateRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('categories', this.CateForm)
        if (res.meta.status !== 201) {
          return this.$message.error('添加分类失败')
        }
        this.$message.success('添加分类成功')
        this.getCateList()
        this.CateDialogVisible = false
      })
    },
    addCateDialogClosed() {
      this.$refs.CateRef.resetFields()
      this.selectKeys = []
      this.CateForm.cat_level = 0
      this.CateForm.cat_pid = 0
    }
  }
}
</script>

<style>
.treetable {
    margin-top: 20px;
}
.el-cascader {
    width: 100%;
}
</style>
