<template>
  <div>
    <!-- 按钮 -->
    <el-button type="primary"
               icon="el-icon-plus"
               style="margin-top:10px"
               @click="showDialog">添加</el-button>
    <!-- 表格组件 
      data:表格组件需要展示的数据---数组类型
      border:给表格添加边框
      column属性
      lable:显示标题
      align:对齐
      prop: 对应列内容的字段名-->
    <el-table :data="records"
              style="width: 100%; margin-top:20px"
              border>
      <el-table-column label="序号"
                       width="80px"
                       align="center"
                       type="index">
      </el-table-column>
      <el-table-column prop="tmName"
                       label="品牌名称"
                       width="width">
      </el-table-column>
      <el-table-column prop="logoUrl"
                       label="品牌LOGO"
                       width="width">
        <template slot-scope="{row}">
          <img :src="row.logoUrl"
               style="width:120px; height:100px">
        </template>
      </el-table-column>
      <el-table-column label="操作"
                       width="width"
                       prop="id">
        <template slot-scope="{row}">
          <el-button type="primary"
                     size="mini"
                     icon="el-icon-edit"
                     @click="editTrademark(row)">编辑</el-button>
          <el-button type="warning"
                     size="mini"
                     icon="el-icon-delete"
                     @click="removeTrademark(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器
      current-page当前页数,total数据总数,page-size每一页展示条数,pager-count连续页码数-->
    <el-pagination @size-change="handleSizeChange"
                   @current-change="getPageList"
                   :current-page="page"
                   :total="total"
                   :page-size="limit"
                   :pager-count="7"
                   :page-sizes="[3, 5, 10]"
                   layout="jumper, prev, pager, next, -> ,total, sizes"
                   style="margin-top:20px; text-align:center">
    </el-pagination>
    <!-- 对话框
      :visible.sync控制对话框显示与隐藏-->
    <el-dialog :title="trademark.id?'修改品牌':'添加品牌'"
               :visible.sync="dialogFormVisible">
      <!--  form表单
        model	表单数据对象 :model="form" 把表单的数据收集到 trademark对象上
        :rules="rules" 表单验证
        添加验证时要给对应组件添加prop属性-->
      <el-form style="width:80%"
               :rules="rules"
               :model="trademark"
               ref="formRules">
        <el-form-item label="品牌名称"
                      label-width="100px"
                      prop="tmName">
          <el-input v-model="trademark.tmName"
                    autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="品牌LOGO"
                      label-width="100px"
                      prop="logoUrl">
          <!-- upload上传 
            action 图片上传的地址-->
          <el-upload class="avatar-uploader"
                     action="/api/admin/product/fileUpload"
                     :show-file-list="false"
                     :on-success="handleAvatarSuccess"
                     :before-upload="beforeAvatarUpload">
            <img v-if="trademark.logoUrl"
                 :src="trademark.logoUrl"
                 class="avatar">
            <i v-else
               class="el-icon-plus avatar-uploader-icon"></i>
            <div slot="tip"
                 class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="clearTrademark">取 消</el-button>
        <el-button type="primary"
                   @click="addOrUpdate">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'tradeMark',
  data() {
    return {
      page: 1, //当前第几页
      limit: 3, //当前需要展示数据条数
      total: 0, //总数据(返回回来的)
      records: [], //列表战术的数据(返回回来的)
      dialogFormVisible: false,//控制对话框显示与隐藏
      trademark: {
        tmName: '',
        logoUrl: ''//上传图片属性
      },//收集品牌的信息
      // 表单验证的规则
      rules: {
        tmName: [
          { required: true, message: '请输入品牌名称', trigger: 'blur' },
          { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'change' }
        ],
        logoUrl: [
          { required: true, message: '请选择品牌图片' }
        ]
      }
    }
  },
  mounted() {
    this.getPageList()
  },
  methods: {
    // 获取品牌列表数据
    async getPageList(pager = 1) {
      this.page = pager
      const { page, limit } = this//结构参数
      let result = await this.$API.trademark.reqTradeMarkList({ page, limit })
      if (result.code === 200) {
        this.total = result.data.total
        this.records = result.data.records
      }
    },
    // 更改每页展示数据条数
    handleSizeChange: function (limit) {
      this.limit = limit;
      this.getPageList();
    },
    // 清除trademark数据和表单验证
    clearTrademark() {
      this.dialogFormVisible = false //隐藏对话框
      // 清除数据
      this.trademark = { tmName: '', logoUrl: '' },
        // 重置一下表单验证
        this.$refs.formRules.resetFields();
    },
    // 显示添加品牌信息弹框
    showDialog() {
      this.dialogFormVisible = true //显示对话框
      // 清除数据
      this.trademark = { tmName: '', logoUrl: '' }
    },
    // 显示编辑品牌信息弹框
    editTrademark(row) {
      this.dialogFormVisible = true //显示对话框
      // 清除数据
      this.trademark = { ...row } //浅拷贝一份数据
    },
    // 上传图片成功 res是上传成功返回的数据 
    handleAvatarSuccess(res, file) {
      // 收集图片数据
      this.trademark.logoUrl = res.data
    },
    // 上传图片之前,判断一下文件大小
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg';
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
      }
      return isJPG && isLt2M;
    },
    // 添加或编辑品牌信息
    addOrUpdate() {
      // 提交时先进行表单验证
      this.$refs.formRules.validate(async (valid) => {
        if (valid) {
          let result = await this.$API.trademark.reqAddOrUpdate(this.trademark)
          if (result.code === 200) {
            // 判断是否有id
            this.$message({ message: this.trademark.id ? '修改品牌成功' : '添加品牌成功', type: 'success' })
            let totalPage = this.total / this.limit
            this.getPageList(this.trademark.id ? this.page : Math.ceil(totalPage))
          }
          this.dialogFormVisible = false
        } else {
          return false;
        }
      });
    },
    // 删除品牌信息
    removeTrademark(row) {
      // 弹框
      this.$confirm(`确定删除“${row.tmName}”吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        // 确定的删除操作
        console.log(row.id);
        this.$API.trademark.reqRemoveTrademark(row.id)
        this.getPageList(this.page)
        this.$message({ type: 'success', message: '删除成功!' })
      }).catch(() => {
        this.$message({ type: 'info', message: '已取消删除' })
      })
    }
  }
}
</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}

.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>