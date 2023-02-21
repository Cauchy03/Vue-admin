<template>
  <div>
    <el-card style="margin-top: 20px">
      <CategorySelect @getGategoryId="getGategoryId"
                      :isShowTable="!isShowTable" />
    </el-card>
    <el-card style="margin-top: 30px">
      <div v-show="isShowTable">
        <el-button type="primary"
                   icon="el-icon-plus"
                   :disabled="!category3Id"
                   @click="addAttr">添加属性</el-button>
        <el-table :data="attrList"
                  style="width: 100%"
                  border>
          <el-table-column type="index"
                           label="序号"
                           width="80px"
                           align="center"></el-table-column>
          <el-table-column prop="attrName"
                           label="属性名称"
                           width="150px"
                           align="center"></el-table-column>
          <el-table-column prop="attrValueList"
                           label="属性列表"
                           width="width">
            <template slot-scope="{ row }">
              <el-tag type="success"
                      v-for="tag in row.attrValueList"
                      :key="tag.id"
                      style="margin: 0px 15px">{{
                tag.valueName }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="attrName"
                           label="操作"
                           width="200px">
            <template slot-scope="{ row }">
              <el-button type="warning"
                         icon="el-icon-edit"
                         size="mini"
                         @click="editAttr(row)"></el-button>
              <el-button type="danger"
                         icon="el-icon-delete"
                         size="mini"></el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 添加|编辑属性结构 -->
      <div v-show="!isShowTable">
        <el-form :inline="true"
                 class="demo-form-inline"
                 :model="attrInfo">
          <el-form-item label="属性名">
            <el-input placeholder="请输入属性名"
                      v-model="attrInfo.attrName"></el-input>
          </el-form-item>
        </el-form>
        <el-button type="primary"
                   icon="el-icon-plus"
                   size="mini"
                   @click="addAttribute"
                   :disabled="!attrInfo.attrName">
          添加属性值</el-button>
        <el-table style="width: 100%; margin-top: 20px"
                  border
                  :data="attrInfo.attrValueList">
          <el-table-column label="序号"
                           width="80"
                           type="index"
                           align="center">
          </el-table-column>
          <el-table-column label="属性值名称"
                           width="width">
            <template slot-scope="{ row }">
              <el-input v-model="row.valueName"
                        placeholder="请输入属性值"
                        size="mini"
                        v-if="row.flag"
                        @blur="loseFocus(row)"
                        ref="focusInput"></el-input>
              <div v-if="!row.flag"
                   @click="changeAndfocus(row)">{{row.valueName}}</div>
            </template>
          </el-table-column>
          <el-table-column prop="id"
                           label="操作">
            <template slot-scope="{ row, $index }">
              <el-button type="warning"
                         icon="el-icon-edit"
                         size="mini"
                         @click="changeAndfocus(row)"></el-button>

              <el-popconfirm title="确定删除吗？"
                             @onConfirm="deleteAttrValue($index)">
                <el-button type="danger"
                           icon="el-icon-delete"
                           size="mini"
                           slot="reference"></el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-button type="primary"
                   style="margin-top: 20px"
                   @click="saveAttrInfo"
                   :disabled='attrInfo.attrValueList.length<1'>保存</el-button>
        <el-button type="info"
                   @click="cancelOperate">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
// 引入lodash中的深拷贝 cloneDeep是一个函数
import cloneDeep from "lodash/cloneDeep";
export default {
  name: "Attr",
  data() {
    return {
      category1Id: "",
      category2Id: "",
      category3Id: "",
      attrList: [],
      isShowTable: true,
      attrInfo: {
        attrName: "", //属性名
        attrValueList: [], //属性名中的属性值
        categoryId: "", //category3Id
        categoryLevel: 3,
      }
    }
  },
  methods: {
    // 获取子组件传过来的分类id
    getGategoryId({ categoryId, level }) {
      if (level == 1) {
        this.category1Id = categoryId;
        this.category2Id = "";
        this.category3Id = "";
      } else if (level == 2) {
        this.category2Id = categoryId;
        this.category3Id = "";
      } else {
        this.category3Id = categoryId;
        this.getCategoryInfo();
      }
    },
    // 发送请求 获取categoryInfo 渲染列表
    async getCategoryInfo() {
      const { category1Id, category2Id, category3Id } = this;
      let result = await this.$API.attr.reqCategoryInfo({
        category1Id,
        category2Id,
        category3Id,
      });
      if (result.code === 200) {
        this.attrList = result.data;
      }
    },
    // 添加操作并清除数据和传递三级分类id
    addAttr() {
      this.isShowTable = false;
      // 清除数据  获取三级分类id
      this.attrInfo = {
        attrName: "",
        attrValueList: [],
        categoryId: this.category3Id,
        categoryLevel: 3,
      };
    },
    // 编辑操作
    editAttr(row) {
      this.isShowTable = false;
      // this.attrInfo = {...row}; //浅拷贝数据 该数据含复杂结构
      // this.attrInfo = JSON.parse(JSON.stringify(row)); //深拷贝可以采用JSON转化
      this.attrInfo = cloneDeep(row); //深拷贝 用lodash的cloneDeep函数
      // 给已有的属性值新增一个响应式flag属性 用于切换模式
      this.attrInfo.attrValueList.forEach(item => {
        this.$set(item, 'flag', false);
      })
    },
    // 取消操作清除数据
    cancelOperate() {
      this.isShowTable = true;
      // 清除数据
      this.attrInfo = {
        attrName: '',
        attrValueList: [],
        categoryId: "",
        categoryLevel: 3,
      };
    },
    // 添加属性值
    addAttribute() {
      // {attrId:'', valueName: ''}
      // 如果数组本身为空直接添加
      // 判断上一个属性值不能为空 然后push方法添加attrValueList
      if (this.attrInfo.attrValueList.length !== 0) {
        if (this.attrInfo.attrValueList[this.attrInfo.attrValueList.length - 1].valueName.trim() !== '') {
          this.attrInfo.attrValueList.push({
            attrId: this.attrInfo.id,
            valueName: "",
            flag: true /*flag属性判断处于编辑还是修改模式*/,
          });
          // 让input框获取焦点
          this.$nextTick(() => this.$refs.focusInput.focus())
        }
      } else {
        this.attrInfo.attrValueList.push({
          attrId: this.attrInfo.id,
          valueName: "",
          flag: true /*flag属性判断处于编辑还是修改模式*/,
        });
        // 让input框获取焦点
        this.$nextTick(() => this.$refs.focusInput.focus())
      }

    },
    // 失去焦点操作 判断是否为空或者重复 row是当前用户操作的属性值
    loseFocus(row) {
      // 判断不能为空
      if (row.valueName.trim() === "") {
        this.$message("不能为空");
        // 让input框获取焦点
        // this.$refs.focusInput.focus()
        return;
      }
      // 新增的属性值不能重复 遍历数组
      let repeat = this.attrInfo.attrValueList.some((item) => {
        // 将row从数组中去除再判断
        if (row !== item) {
          // 如果有重复则返回为真 并申明一个变量接收
          return row.valueName === item.valueName;
        }
      });
      if (repeat) {
        this.$message("不能重复");
        // this.$refs.focusInput.focus()
        return;
      }
      row.flag = false;
    },
    // 切换编辑修改模式 并且获取焦点
    changeAndfocus(row) {
      row.flag = true
      this.$nextTick(function () { this.$refs.focusInput.focus() });
    },
    // 删除属性值 气泡弹出框的回调函数
    deleteAttrValue(index) {
      // 删除索引为index
      this.attrInfo.attrValueList.splice(index, 1)
    },
    // 保存属性与属性值操作
    async saveAttrInfo() {
      // 遍历数组 属性值为空则删除 且传个服务器的数据要删除flag属性，
      this.attrInfo.attrValueList = this.attrInfo.attrValueList.filter(item => {
        if (item.valueName.trim() !== '') {
          return delete item.flag
        }
      })
      // 过滤完元素 发送请求
      try {
        await this.$API.attr.reqAddOrSaveAttrInfo(this.attrInfo)
        this.$message({ type: 'success', message: '保存成功' })
        this.isShowTable = true
        // 重新渲染列表
        this.getCategoryInfo()
      } catch (error) {
        this.$message({ type: 'warning', message: error })
      }
    }
  }
}
</script>

<style>
</style>