<template>
  <div>
    <el-card>
      <CategorySelect @getGategoryId="getGategoryId"
                      :isShowTable="scene !== 0" />
    </el-card>
    <el-card>
      <div v-show="scene === 0">
        <el-button type="primary"
                   icon="el-icon-plus"
                   @click="addSpu"
                   :disabled="!category3Id">添加</el-button>
        <el-table style="width: 100% "
                  border
                  :data="records">

          <el-table-column type="index"
                           label="序号"
                           width="80"
                           align="center">
          </el-table-column>
          <el-table-column prop="spuName"
                           label="spu名称"
                           width="width">
          </el-table-column>
          <el-table-column prop="description"
                           label="spu描述"
                           width="width">
          </el-table-column>
          <el-table-column prop="prop"
                           label="操作"
                           width="width">
            <template slot-scope="{row}">
              <el-button type="primary"
                         icon="el-icon-plus"
                         size="mini"
                         title="添加"
                         @click="addSku(row)"></el-button>
              <hint-button type="warning"
                           icon="el-icon-edit"
                           size="mini"
                           title="编辑"
                           @click="editSpu(row)"></hint-button>
              <hint-button type="info"
                           icon="el-icon-info"
                           size="mini"
                           title="信息"
                           @click="checkSku(row)"></hint-button>
              <el-popconfirm title="这是一段内容确定删除吗？"
                             @onConfirm="deleteSpu(row)">
                <hint-button type="danger"
                             icon="el-icon-delete"
                             size="mini"
                             title="删除"
                             slot="reference"></hint-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination @size-change="handleSizeChange"
                       @current-change="handleCurrentChange"
                       :current-page="page"
                       :page-sizes="[3, 5, 10]"
                       :page-size="limit"
                       layout="jumper, prev, pager, next, -> ,total, sizes"
                       style="margin-top:20px; text-align:center"
                       :total="total">
        </el-pagination>
      </div>
      <SpuForm v-show="scene === 1"
               @changeScene="changeScene"
               ref="SpuForm" />
      <SkuForm v-show="scene === 2"
               @changeScene="changeScene"
               ref="SkuForm" />
    </el-card>

    <el-dialog :title="`${spuName}的sku列表`"
               :visible.sync="dialogTableVisible"
               :before-close="close">
      <el-table :data="gridData"
                border
                v-loading="loading">
        <el-table-column property="skuName"
                         label="名称"
                         width="width"></el-table-column>
        <el-table-column property="price"
                         label="价格(元)"
                         width="width"></el-table-column>
        <el-table-column property="weight"
                         label="重量(千克)"
                         width="width"></el-table-column>
        <el-table-column property="prop"
                         label="默认图片"
                         width="width">
          <template slot-scope="{row}">
            <img :src="row.skuDefaultImg"
                 alt=""
                 width="100px"
                 height="100px">
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import SpuForm from '@/views/product/Spu/SpuForm'
import SkuForm from '@/views/product/Spu/SkuForm'
export default {
  name: 'Spu',
  data() {
    return {
      category1Id: '',
      category2Id: '',
      category3Id: '',
      page: 1,//当前第几页
      limit: 3,//每页多少条数据
      total: 0,//总数据条数
      records: [],//保存spu列表数据
      scene: 0,//用于切换模块
      dialogTableVisible: false,//控制对话框的控制与显示
      gridData: [],//查看时发送数据的存储
      spuName: '',//查看时skuName的保存
      loading: true//loading效果
    }
  },
  components: {
    SpuForm,
    SkuForm
  },
  methods: {
    // 获取categoryid
    getGategoryId({ categoryId, level }) {
      if (level === 1) {
        this.category1Id = categoryId
        this.category2Id = ''
        this.category3Id = ''
      } else if (level === 2) {
        this.category2Id = categoryId
        this.category3Id = ''
      } else {
        this.category3Id = categoryId
        // 发送请求 获取数据
        this.getSpuList()
      }
    },
    // 发送请求获取数据
    async getSpuList() {
      let { page, limit, category3Id } = this
      let result = await this.$API.spu.reqSpuList(page, limit, category3Id)
      if (result.code === 200) {
        this.total = result.data.total
        this.records = result.data.records
      }
    },
    // 更改每页数据条数
    handleSizeChange(limit) {
      this.limit = limit
      // 重新发送数据
      this.getSpuList()
    },
    // 跳转页数
    handleCurrentChange(page) {
      this.page = page
      // 重新发送数据
      this.getSpuList()
    },
    // 添加Spu
    addSpu() {
      this.scene = 1
      this.$refs.SpuForm.initAddSpu(this.category3Id)
    },
    // 编辑Spu
    editSpu(row) {
      this.scene = 1
      // 调用子组件的方法发送请求
      this.$refs.SpuForm.initSpuData(row)
    },
    // 删除Spu
    deleteSpu(row) {
      // 发送请求
      this.$API.spu.reqDeleteSpu(row.id).then(_ => {
        // 当前页数数据为0时跳转上一页
        let pager = this.records.length > 1 ? this.page : this.page - 1
        this.handleCurrentChange(pager)
        this.$message({ type: 'success', message: '删除成功' })
      }).catch(reason => {
        this.$message.error(`${reason}`)
      })

    },
    // 切换场景
    changeScene({ scene, flag }) {
      // flag判断是否是修改还是添加 用于跳转页数
      this.scene = scene
      if (flag) {
        flag === '修改' ? this.handleCurrentChange(this.page) : this.handleCurrentChange(1)
      }
    },
    // 添加Sku
    addSku(row) {
      this.scene = 2
      // 处理当前category1Id,category2Id,category3Id传递给子组件
      let { category1Id, category2Id, category3Id } = this
      // 调用子组件的方法发送请求
      this.$refs.SkuForm.initData({ row, category1Id, category2Id, category3Id })
    },
    // 查看Sku
    checkSku(row) {
      this.dialogTableVisible = true
      this.spuName = row.spuName
      this.$API.spu.reqBySpuId(row.id).then(result => {
        this.gridData = result.data
        this.loading = false
      }).catch((reason) => { this.$message.error(`${reason}`) })

    },
    // 关闭对话框
    close(done) {
      // 切换loading效果
      this.loading = true
      // 清空数据
      this.gridData = []
      // 关闭对话框
      done();
    }
  }
}
</script>

<style>
</style>