<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <!-- 添加分类按钮 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
        </el-col>
      </el-row>
      <!-- 商品分类列表 -->
      <tree-table class="tree_table" :data="categorieList" :columns="columns" :selection-type="false" :expand-type="false" show-index index-text="#" border :show-row-hover="false">
        <!-- 是否有效 -->
        <template slot="isok" slot-scope="scope">
          <i class="el-icon-success" v-if="scope.row.cat_deleted===false" style="color:lightgreen;"></i>
          <i class="el-icon-error" v-else style="color:lightgreen;"></i>
        </template>
        <!-- 排序 -->
        <template slot="order" slot-scope="scope">
          <el-tag size="mini" v-if="scope.row.cat_level===0">一级</el-tag>
          <el-tag type="success" size="mini" v-else-if="scope.row.cat_level===1">二级</el-tag>
          <el-tag type="warning" size="mini" v-else>三级</el-tag>
        </template>
        <!-- 操作 -->
        <template slot="opt" slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" size="mini" @click="editGoods(scope.row)">编辑</el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteGoods(scope.row)">删除</el-button>
        </template>
      </tree-table>
      <!-- 分页区域 -->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryInfo.pagenum" :page-sizes="[3, 5, 10, 15]" :page-size="queryInfo.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
    </el-card>

    <!-- 添加分类对话框 -->
    <el-dialog title="添加分类" :visible.sync="addCateDialogVisible" width="50%" @close="addCateDialogClosed">
      <!-- 添加分类的表格 -->
      <el-form :model="addCateForm" :rules="addCateFormRules" ref="addCateFormRef" label-width="100px">
        <el-form-item label="分类名称：" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类：">
          <!-- 级联选择器 -->
          <!-- options 用来指定数据源 -->
          <!-- props 用来指定配置对象 -->
          <!-- v-model  选中的父级分类的id数组-->
          <el-cascader clearable v-model="selectedKeys" :options="parentCateList" :props="{ expandTrigger: 'hover', value: 'cat_pid', label: 'cat_name', children: 'children'}"  @change="parentCateChanged"></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'categories',
  data () {
    return {
      // 获取商品分类查询参数
      queryInfo: {
        type: 3, // 显示多少级列表数据
        pagenum: 1, // 当前页数
        pagesize: 5 // 每页显示条数
      },
      // 商品分类列表数据
      categorieList: [],
      // 商品分类列表总条数
      total: 0,
      // 商品分类列表列的定义
      columns: [
        { label: '分类名称', prop: 'cat_name' },
        // 将当前列定义为模板列，模板名称为isok
        { label: '是否有效', type: 'template', template: 'isok' },
        // 将当前列定义为模板列，模板名称为order
        { label: '排序', type: 'template', template: 'order' },
        // 将当前列定义为模板列，模板名称为opt
        { label: '操作', type: 'template', template: 'opt' }
      ],
      // 添加分类对话框是否显示
      addCateDialogVisible: false,
      // 添加分类的表单数据对象
      addCateForm: {
        cat_name: '', // 将要添加的分类名称
        cat_pid: 0, // 父级分类的Id
        cat_level: 0 // 分类的等级，默认要添加的是一级分类
      },
      // 添加分类的表格数据验证规则
      addCateFormRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      },
      // 父级分类列表数据
      parentCateList: [],
      // 指定级联选择器的配置对象
      // cascaderProps: {
      //   value: 'cat_id',
      //   label: 'cat_name',
      //   children: 'children'
      // },
      // 选中的父级分类的id数组
      selectedKeys: []
    }
  },
  created () {
    this.getCategorieList()
  },
  methods: {
    // 获取商品分类数据
    async getCategorieList () {
      const { data: res } = await this.$http.get('categories', { params: this.queryInfo })
      // console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品分类失败')
      }
      this.categorieList = res.data.result
      this.total = res.data.total
    },
    // 每页显示条数发生改变时
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.getCategorieList()
    },
    // 当前页发生改变时
    handleCurrentChange (newPage) {
      this.queryInfo.pagenum = newPage
      this.getCategorieList()
    },
    // 打开添加分类的对话框
    showAddCateDialog () {
      // 获取对话框中父级分类列表数据
      this.getParentCateList()
      // 打开对话框
      this.addCateDialogVisible = true
    },
    // 获取父级分类的数据列表
    async getParentCateList () {
      const { data: res } = await this.$http.get('categories', { params: { type: 2 } })
      if (res.meta.status !== 200) {
        return this.$message.error('获取父级分类数据失败')
      }
      // console.log(res.data)
      this.parentCateList = res.data
    },
    // 选择项发生变化触发这个函数
    parentCateChanged () {
      console.log(this.selectedKeys)
      // 如果selectedKeys数组中的length大于0，证明选中了父级分类
      // 反之，就说明没有选中任何父级分类
      if (this.selectedKeys.length > 0) {
        // 父级分类的Id
        this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1]
        // 为当前分类的等级赋值
        this.addCateForm.cat_level = this.selectedKeys.length
      } else {
        // 父级分类的Id
        this.addCateForm.cat_pid = 0
        // 为当前分类的等级赋值
        this.addCateForm.cat_level = 0
      }
    },
    // 添加分类
    addCate () {
      // console.log(this.addCateForm)
      this.$refs.addCateFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('categories', this.addCateForm)
        if (res.meta.status !== 200) {
          return this.$message.error('添加分类失败')
        }
        this.$message.success('添加分类成功')
        this.getCategorieList()
        this.addCateDialogVisible = false
      })
    },
    // 监听添加分类的对话框关闭事件,重置表单数据
    addCateDialogClosed () {
      this.$refs.addCateFormRef.resetFields()
      this.selectedKeys = []
      this.addCateForm.cat_level = 0
      this.addCateForm.cat_pid = 0
    }
  }
}
</script>
<style lang="less" scoped>
.tree_table{margin-top: 20px;}
.el-cascader{
  width: 100%;
}
</style>
