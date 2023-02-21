<template>
  <div>
    <el-form ref="form"
             label-width="80px"
             :model="spu">

      <el-form-item label="SPU名称">
        <el-input placeholder="SPU描述"
                  v-model="spu.spuName"></el-input>
      </el-form-item>

      <el-form-item label="品牌">
        <el-select placeholder="请选择品牌"
                   v-model="spu.tmId">
          <el-option :label="tm.tmName"
                     :value="tm.id"
                     v-for="tm in trademarkList"
                     :key="tm.id"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="SPU描述">
        <el-input type="textarea"
                  placeholder="SPU描述"
                  rows="4"
                  v-model="spu.description"></el-input>
      </el-form-item>

      <!-- action上传图片地址 /admin/product/fileUpload
           list-type="" 文件列表类型
           on-preview 图片预览时的回调
           on-remove 图片删除时的回调
           file-list 上传文件的列表 -->
      <el-form-item label="SPU图片">
        <el-upload list-type="picture-card"
                   :on-preview="handlePictureCardPreview"
                   :on-success="handleSuccess"
                   :on-remove="handleRemove"
                   action="/api/admin/product/fileUpload"
                   :file-list="spuImageList">
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%"
               :src="dialogImageUrl"
               alt="">
        </el-dialog>
      </el-form-item>

      <el-form-item label="销售属性">
        <el-select v-model="attrIdAndAttrName"
                   :placeholder="`还有${unSelectAttr.length}项未选择`">
          <el-option :label="sale.name"
                     :value="`${sale.id}:${sale.name}`"
                     v-for="sale in unSelectAttr"
                     :key="sale.id"></el-option>
        </el-select>
        <el-button type="primary"
                   icon="el-icon-plus"
                   style="margin-left:4px"
                   :disabled="!attrIdAndAttrName"
                   @click="addSaleAttr">添加销售属性</el-button>
        <el-table style="width: 100%; margin-top:5px"
                  border
                  :data="spu.spuSaleAttrList">
          <el-table-column type="index"
                           label="序号"
                           width="80"
                           align="center">
          </el-table-column>
          <el-table-column prop="saleAttrName"
                           label="属性名"
                           width="240">
          </el-table-column>
          <el-table-column prop="prop"
                           label="属性值名称列表"
                           width="width">
            <template slot-scope="{row}">
              <el-tag :key="tag.id"
                      v-for="tag in row.spuSaleAttrValueList"
                      closable
                      :disable-transitions="false"
                      @close="handleClose(row,tag)">
                {{tag.saleAttrValueName}}
              </el-tag>
              <el-input class="input-new-tag"
                        v-if="row.inputVisible"
                        v-model="row.inputValue"
                        ref="saveTagInput"
                        size="small"
                        @keyup.enter.native="handleInputConfirm(row)"
                        @blur="handleInputConfirm(row)">
              </el-input>
              <el-button v-else
                         class="button-new-tag"
                         size="small"
                         @click="showInput(row)">+ 添 加</el-button>
            </template>
          </el-table-column>
          <el-table-column prop="prop"
                           label="操作"
                           width="300">
            <template slot-scope="{$index}">
              <el-button type="danger"
                         icon="el-icon-delete"
                         @click="spu.spuSaleAttrList.splice($index,1)"></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>

      <el-form-item>
        <el-button type="primary"
                   @click="addOrUpdateSpu">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'SpuForm',
  data() {
    return {
      dialogImageUrl: '',
      dialogVisible: false,
      spu: {
        // "id": 0, 不需要传递id id服务器自己生成
        category3Id: 0,//三级分类的id
        description: "",//描述
        spuName: "",//spu名称
        tmId: "",//平台id
        spuImageList: [
          // {
          //   id: 0,
          //   imgName: "",
          //   imgUrl: "",
          //   spuId: 0}
        ],//收集spu图片信息
        spuSaleAttrList: [
          // {
          //   baseSaleAttrId: 0,
          //   id: 0,
          //   saleAttrName: "",
          //   spuId: 0,
          //   spuSaleAttrValueList: [
          //     {
          //       baseSaleAttrId: 0,
          //       id: 0,
          //       isChecked: "",
          //       saleAttrName: "",
          //       saleAttrValueName: "",
          //       spuId: 0
          //     }
          //   ]
          // }
        ]//平台属性与属性值
      },//spu信息 需要带给服务器的数据,先设置初始值
      trademarkList: [],//品牌信息
      spuImageList: [],//spu图片的数据
      saleAttrList: [],//销售属性的数据
      attrIdAndAttrName: ''//收集为选择的销售属性id(过渡)
    }
  },
  computed: {
    // 计算还未选择的属性
    unSelectAttr() {
      // 第一个return 计算属性的返回值
      // 第二个return filter true为需要的  false为过滤的
      // 第三个return every true为全部满足  有一个不满足条件为false
      return this.saleAttrList.filter(item => {
        return this.spu.spuSaleAttrList.every(spu => {
          return item.name !== spu.saleAttrName
        })
      })
    }
  },
  methods: {
    // 预览图片的回调
    handlePictureCardPreview(file) {
      // 设置对话框的图片地址
      this.dialogImageUrl = file.url;
      // 对话框的显示与隐藏
      this.dialogVisible = true;
    },
    // 上传图片成功的回调
    handleSuccess(response, file, fileList) {
      console.log(response, file, fileList);
      // 保存数据
      this.spuImageList = fileList
    },
    // 删除图片的回调 file删除的图片对象 filelist剩余的图片数组
    handleRemove(file, fileList) {
      console.log(file, fileList);
      this.spuImageList = fileList
    },
    // 初始化数据,更新数据时发送请求
    async initSpuData(row) {
      // 获取SPU信息的数据
      let spuResult = await this.$API.spu.reqSpu(row.id)
      if (spuResult.code === 200) {
        this.spu = spuResult.data
      }
      // 获取品牌的信息
      let trademarkResult = await this.$API.spu.reqTrademarkList()
      if (trademarkResult.code === 200) {
        this.trademarkList = trademarkResult.data
      }
      // 获取SPU图片的数据
      let spuImageResult = await this.$API.spu.reqSpuImageList(row.id)
      if (spuImageResult.code === 200) {
        let listArr = spuImageResult.data
        // 由于照片墙显示图片的数据需要name和url(element组件封装好的)，所以处理一下数据
        listArr.forEach(item => {
          item.name = item.imgName
          item.url = item.imgUrl
        })
        this.spuImageList = listArr
      }
      // 获取平台全部的销售属性
      let saleAttrResult = await this.$API.spu.reqSaleAttrList()
      if (saleAttrResult.code === 200) {
        this.saleAttrList = saleAttrResult.data
      }
    },
    // 初始化数据,更新数据时发送请求
    async initAddSpu(category3Id) {
      // 保存category3Id
      this.spu.category3Id = category3Id
      // 获取品牌的信息
      let trademarkResult = await this.$API.spu.reqTrademarkList()
      if (trademarkResult.code === 200) {
        this.trademarkList = trademarkResult.data
      }
      // 获取平台全部的销售属性
      let saleAttrResult = await this.$API.spu.reqSaleAttrList()
      if (saleAttrResult.code === 200) {
        this.saleAttrList = saleAttrResult.data
      }
    },
    // 添加新的销售属性
    addSaleAttr() {
      let [baseSaleAttrId, saleAttrName] = this.attrIdAndAttrName.split(':')
      let newSaleAttr = { baseSaleAttrId, saleAttrName, spuSaleAttrValueList: [] }
      this.spu.spuSaleAttrList.push(newSaleAttr)
      // 清空下拉框
      this.attrIdAndAttrName = ''
    },
    // tag标签---删除属性值
    handleClose(row, tag) {
      console.log(row, tag);
      row.spuSaleAttrValueList.splice(row.spuSaleAttrValueList.indexOf(tag), 1)
    },
    // tag标签---添加属性值
    showInput(row) {
      // 添加属性值,新增两个响应式属性，用于切换input模式和保存value值
      // inputVisible: false,//tag标签的模式切换
      // inputValue: ''      //tag标签的value值 
      this.$set(row, 'inputVisible', true)
      this.$set(row, 'inputValue', '')
      // 获取焦点
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    // tag标签---切换input模式并保存数据
    handleInputConfirm(row) {
      // 保存一下数据
      let { inputValue, baseSaleAttrId } = row;
      // 判断是否重复
      let noRepeat = row.spuSaleAttrValueList.every(item => {
        return item.saleAttrValueName !== inputValue
      })
      // 不能为空
      if (inputValue.trim() === '') {
        this.$message('不能为空')
      } else if (noRepeat) { //不能重复
        // 不为空且不重复则添加进数组
        let newSaleAttrValue = {
          baseSaleAttrId,
          saleAttrValueName: inputValue,
        }
        row.spuSaleAttrValueList.push(newSaleAttrValue);
      } else { this.$message('不能重复') }
      // 清空数据
      row.inputVisible = false;
      row.inputValue = '';
    },
    // 添加或更新Spu信息
    addOrUpdateSpu() {
      // 处理数据
      this.spu.spuImageList = this.spuImageList.map(item => {
        return {
          imgName: item.name,
          imgUrl: item.response ? item.response.data : item.imgUrl,
        }
      })
      // 发送请求
      this.$API.spu.reqAddOrUpdateSpu(this.spu).then((result) => {
        this.$message({ message: '保存成功', type: 'success' })
        // 切换场景
        this.$emit('changeScene', { scene: 0, flag: this.spu.id ? '修改' : '添加' })
        // 清除数据
        Object.assign(this._data, this.$options.data())
      }).catch((reason) => { this.$message.error(`${reason}`) })
    },
    //取消操作
    cancel() {
      // 切换场景
      this.$emit('changeScene', { scene: 0 })
      // 清除数据
      Object.assign(this._data, this.$options.data())
    }
  }
}
</script>

<style>
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>