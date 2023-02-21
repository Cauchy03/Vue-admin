<template>
  <div>
    <!-- :model="form" -->
    <el-form ref="form1"
             label-width="80px">
      <el-form-item label="SPU名称">
        {{spu.spuName}}
      </el-form-item>

      <el-form-item label="SKU名称">
        <el-input placeholder="SKU名称"
                  v-model="sku.skuName"></el-input>
      </el-form-item>

      <el-form-item label="价格(元)">
        <el-input placeholder="价格(元)"
                  type="number"
                  v-model="sku.price"></el-input>
      </el-form-item>

      <el-form-item label="重量(千克)">
        <el-input placeholder="重量(千克)"
                  v-model="sku.weight"
                  type="number"></el-input>
      </el-form-item>

      <el-form-item label="规格描述">
        <el-input type="textarea"
                  rows="4"
                  placeholder="规格描述"
                  v-model="sku.skuDesc"></el-input>
      </el-form-item>

      <el-form-item label="平台属性">

        <el-form :inline="true"
                 ref="form2"
                 label-width="80px">

          <el-form-item :label="attr.attrName"
                        v-for="attr in attrInfo"
                        :key="attr.id">
            <el-select v-model="attr.attrIdAndValueId"
                       placeholder="请选择">
              <el-option :label="attrValue.valueName"
                         :value="`${attrValue.attrId}:${attrValue.id}`"
                         v-for="attrValue in attr.attrValueList"
                         :key="attrValue.id"></el-option>
            </el-select>
          </el-form-item>

        </el-form>
      </el-form-item>

      <el-form-item label="销售属性">
        <el-form :inline="true"
                 ref="form3"
                 label-width="80px">
          <el-form-item :label="saleAttr.saleAttrName"
                        v-for="saleAttr in  spuSaleAttrList"
                        :key="saleAttr.id">
            <el-select placeholder="请选择"
                       v-model="saleAttr.saleAttrIdAndValueId">
              <el-option :label="saleAttrValue.saleAttrValueName"
                         :value="`${saleAttrValue.baseSaleAttrId}:${saleAttrValue.id}`"
                         v-for="saleAttrValue in  saleAttr.spuSaleAttrValueList"
                         :key="saleAttrValue.id"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>

      <el-form-item label="图片列表">
        <el-table style="width: 100%"
                  border
                  :data="spuImageList"
                  @selection-change="handleSelectionChange">

          <el-table-column type="selection"
                           prop="prop"
                           width="80">
          </el-table-column>

          <el-table-column prop="imgUrl"
                           label="图片"
                           width="width"
                           align="center">
            <template slot-scope="{row}">
              <img :src="row.imgUrl"
                   alt=""
                   width="120px"
                   height="110px">
            </template>
          </el-table-column>

          <el-table-column prop="imgName"
                           label="名称"
                           width="width">
          </el-table-column>

          <el-table-column prop="prop"
                           label="操作"
                           width="width">
            <template slot-scope="{row}">
              <el-button type="primary"
                         v-if="row.isDefault === 0"
                         @click="changeDefault(row)">设为默认</el-button>
              <el-button v-else>默认</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>

      <el-form-item>
        <el-button type="primary"
                   @click="saveData">确定</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'SkuForm',
  data() {
    return {
      spuImageList: [],//spu图片的数据
      spuSaleAttrList: [],//spu销售属性的数据
      attrInfo: [],//平台属性的数据
      sku: {
        // 第一类数据,父组件传递的数据
        category3Id: 0,
        spuId: 0,
        tmId: 0,
        // 第二类数据,v-model双向绑定获取
        skuName: "",
        price: 0,
        weight: 0,
        skuDesc: "",//描述
        skuAttrValueList: [
          // {
          //   attrId: 0,
          //   attrName: "",
          //   id: 0,
          //   skuId: 0,
          //   valueId: 0,
          //   valueName: ""
          // }
        ],
        skuDefaultImg: "",//默认图片
        skuImageList: [
          {
            id: 0,
            imgName: "",
            imgUrl: "",
            isDefault: "",
            skuId: 0,
            spuImgId: 0
          }
        ],//sku图片数据
        skuSaleAttrValueList: [
          // {
          //   id: 0,
          //   saleAttrId: 0,
          //   saleAttrName: "",
          //   saleAttrValueId: 0,
          //   saleAttrValueName: "",
          //   skuId: 0,
          //   spuId: 0
          // }
        ]
      },//sku信息 需要带给服务器的数据,先设置初始值
      spu: {},//当前spu
      imgList: []//选中图片时收集的数据,处理后存到sku当中
    }
  },
  methods: {
    // 初始化数据,发送请求
    async initData({ row, category1Id, category2Id, category3Id }) {
      // 收集父组件传递的数据
      this.sku.category3Id = category3Id
      this.sku.spuId = row.id
      this.sku.tmId = row.tmId
      this.spu = row

      // 获取SPU图片的数据
      let spuImageResult = await this.$API.spu.reqSpuImageList(row.id)
      if (spuImageResult.code === 200) {
        let listArr = spuImageResult.data
        // 由于照片墙显示图片的数据需要name和url(element组件封装好的)，所以处理一下数据
        listArr.forEach(item => {
          // 设置默认值
          item.isDefault = 0
        })
        this.spuImageList = listArr
      }

      // 获取SPU销售属性信息的数据
      let spusaleAttrResult = await this.$API.spu.reqSpuSaleAttrList(row.id)
      if (spusaleAttrResult.code === 200) {
        this.spuSaleAttrList = spusaleAttrResult.data
      }

      // 获取平台属性信息的数据
      let attrInfoResult = await this.$API.spu.reqattrInfoList(category1Id, category2Id, category3Id)
      if (attrInfoResult.code === 200) {
        this.attrInfo = attrInfoResult.data
      }
    },
    // 选中图片的回调
    handleSelectionChange(params) {
      this.imgList = params
    },
    // 改变图片的默认值
    changeDefault(row) {
      // 排他
      this.spuImageList.forEach(item => {
        item.isDefault = 0
      })
      row.isDefault = 1
      this.sku.skuDefaultImg = row.imgUrl
    },
    // 取消操作
    cancel() {
      this.$emit('changeScene', { scene: 0 })
      // 清除数据
      Object.assign(this._data, this.$options.data())
    },
    // 保存操作
    saveData() {
      // 解构对象
      let { attrInfo, spuSaleAttrList, imgList, sku } = this
      // 整理数据 平台属性,销售属性,图片列表
      sku.skuAttrValueList = attrInfo.reduce((prev, item) => {
        if (item.attrIdAndValueId) {
          let [attrId, valueId] = item.attrIdAndValueId.split(':')
          prev.push({ attrId, valueId })
        }
        return prev
      }, [])

      sku.skuSaleAttrValueList = spuSaleAttrList.reduce((prev, item) => {
        if (item.saleAttrIdAndValueId) {
          let [saleAttrId, saleAttrValueId] = item.saleAttrIdAndValueId.split(':')
          prev.push({ saleAttrId, saleAttrValueId })
        }
        return prev
      }, [])

      sku.skuImageList = imgList.map(item => {
        return {
          imgName: item.imgName,
          imgUrl: item.imgUrl,
          isDefault: item.isDefault,
          spuImgId: item.id
        }
      })
      // 发送请求
      this.$API.spu.reqSaveSkuInfo(this.sku).then(() => {
        this.$message({ type: 'success', message: '保存成功' })
        this.cancel()
      }).catch((reason) => {
        this.$message.error(`${reason}`)
      })

    }

  }
}
</script>

<style>
</style>