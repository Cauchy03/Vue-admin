<template>
  <div>
    <el-table style="width: 100%"
              border
              :data="records">
      <el-table-column label="序号"
                       width="80"
                       type="index"
                       align="center">
      </el-table-column>
      <el-table-column prop="skuName"
                       label="名称"
                       width="width">
      </el-table-column>
      <el-table-column prop="skuDesc"
                       label="描述"
                       width="width">
      </el-table-column>
      <el-table-column prop="prop"
                       label="默认图片"
                       width="130"
                       align="center">
        <template slot-scope="{row}">
          <img :src="row.skuDefaultImg"
               alt=""
               width="80px"
               height="80px">
        </template>
      </el-table-column>
      <el-table-column prop="weight"
                       label="重量(KG)"
                       width="80">
      </el-table-column>
      <el-table-column prop="price"
                       label="价格(元)"
                       width="80">
      </el-table-column>
      <el-table-column prop="prop"
                       label="操作"
                       width="width"
                       align="center">
        <template slot-scope="{row}">
          <el-button type="warning"
                     icon="el-icon-bottom"
                     size="mini"
                     v-if="row.isSale ===1"
                     @click="doneSale(row)"></el-button>
          <el-button type="success"
                     icon="el-icon-top"
                     size="mini"
                     v-else
                     @click="upSale(row)"></el-button>
          <el-button type="primary"
                     icon="el-icon-edit"
                     size="mini"
                     @click="edit"></el-button>
          <el-button type="info"
                     icon="el-icon-info"
                     size="mini"
                     @click="getSkuInfo(row)"></el-button>
          <el-button type="danger"
                     icon="el-icon-delete"
                     size="mini"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器 -->
    <el-pagination @size-change="handleSizeChange"
                   @current-change="handleCurrentChange"
                   :page-sizes="[3, 5, 10]"
                   :current-page.sync="page"
                   :page-size="limit"
                   layout=" prev, pager, next,jumper,->,sizes"
                   :total="total"
                   style="text-align:center">
    </el-pagination>
    <!-- 抽屉详情页 -->
    <el-drawer :visible.sync="drawer"
               size="40%"
               :show-close="false">
      <el-row>
        <el-col :span="5">名称</el-col>
        <el-col :span="16">{{skuInfo.skuName}}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">描述</el-col>
        <el-col :span="16">{{skuInfo.skuDesc}}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">价格</el-col>
        <el-col :span="16">{{skuInfo.price}}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">平台属性</el-col>
        <el-col :span="16">
          <el-tag type="success"
                  v-for="attr in skuInfo.skuAttrValueList"
                  :key="attr.id"
                  style="margin: 5px 5px">{{attr.attrId}}--{{attr.valueId}}</el-tag>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="5">商品图片</el-col>
        <el-col :span="16">
          <!-- 轮播图 -->
          <el-carousel :interval="5000"
                       arrow="always">
            <el-carousel-item v-for="item in skuInfo.skuImageList"
                              :key="item.id">
              <img :src="item.imgUrl"
                   alt=""
                   width="100%"
                   height="100%">
            </el-carousel-item>
          </el-carousel>
        </el-col>
      </el-row>
    </el-drawer>
  </div>
</template>

<script>
export default {
  name: 'Sku',
  data() {
    return {
      records: [],//Sku列表
      page: 1,//当前页数
      limit: 3,//每页数据条数
      total: 0,//总数据条数
      drawer: false,//抽屉效果
      skuInfo: {}//单个sku详情信息
    }
  },
  mounted() {
    this.getskuList()
  },
  methods: {
    // 获取sku列表
    getskuList() {
      let { page, limit } = this
      this.$API.sku.reqSkuList(page, limit).then(result => {
        this.records = result.data.records
        this.total = result.data.total
      }).catch(reason => {
        this.$message.error(reason)
      })
    },
    handleSizeChange(limit) {
      this.limit = limit
      this.getskuList()
    },
    handleCurrentChange(page) {
      this.page = page
      this.getskuList()
    },
    // 下架商品
    doneSale(row) {
      this.$API.sku.reqCancelSale(row.id).then(_ => {
        row.isSale = 0
        this.$message({ type: 'success', message: '下架成功' })
      }).catch(reason => {
        this.$message.error(`下架失败,${reason}`)
      })
    },
    // 上架商品
    upSale(row) {
      this.$API.sku.reqOnSale(row.id).then(_ => {
        row.isSale = 1
        this.$message({ type: 'success', message: '上架成功' })
      }).catch(reason => {
        this.$message.error(`上架失败,${reason}`)
      })
    },
    // 编辑
    edit() {
      this.$message('正在开发中...')
    },
    // sku详情页(抽屉效果)
    getSkuInfo(row) {
      this.drawer = true
      // 发送请求获取详情信息
      this.$API.sku.reqSkuInfo(row.id).then(result => {
        this.skuInfo = result.data
      })

    }
  }
}
</script>

<style>
.el-carousel__item h3 {
  color: #475669;
  font-size: 18px;
  opacity: 0.75;
  line-height: 300px;
  margin: 0;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
</style>

<style scoped>
.el-row .el-col-5 {
  font-size: 18px;
  text-align: right;
}

.el-col {
  margin: 10px 10px;
}
</style>