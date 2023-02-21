<template>
  <div>
    <el-form :model="categoryInfo"
             :inline="true"
             class="demo-form-inline"
             :disabled="isShowTable">
      <el-form-item label="一级分类">
        <el-select placeholder="请选择"
                   v-model="categoryInfo.category1Id"
                   @change="handler1">
          <el-option :label="c1.name"
                     :value="c1.id"
                     v-for="c1 in category1List"
                     :key="c1.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类">
        <el-select placeholder="请选择"
                   v-model="categoryInfo.category2Id"
                   @change="handler2">
          <el-option :label="c2.name"
                     :value="c2.id"
                     v-for="c2 in category2List"
                     :key="c2.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="三级分类">
        <el-select placeholder="请选择"
                   v-model="categoryInfo.category3Id"
                   @change="handler3">
          <el-option :label="c3.name"
                     :value="c3.id"
                     v-for="c3 in category3List"
                     :key="c3.id"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "CategorySelect",
  data() {
    return {
      category1List: [], //一级分类的数据
      category2List: [], //二级分类的数据
      category3List: [], //三级分类的数据
      categoryInfo: {
        category1Id: "",
        category2Id: "",
        category3Id: "",
      }
    }
  },
  // 接收父组件的参数
  props: ['isShowTable'],
  mounted() {
    // 渲染数据
    this.getCategory1List();
  },
  methods: {
    // 获取一级分类
    async getCategory1List() {
      let result = await this.$API.attr.reqGetCategory1();
      if (result.code === 200) {
        this.category1List = result.data;
      }
    },
    // 一级分类的select事件回调(一级分类id发生变化获取二级分类信息)
    async handler1() {
      //清除数据
      this.category2List = [];
      this.category3List = [];
      this.categoryInfo.category2Id = "";
      this.categoryInfo.category3Id = "";
      const { category1Id } = this.categoryInfo;
      //自定义事件 将数据传给父组件 一级id
      this.$emit("getGategoryId", { categoryId: category1Id, level: 1 });
      let result = await this.$API.attr.reqGetCategory2(category1Id);
      if (result.code === 200) {
        this.category2List = result.data;
      }
    },
    // 二级分类的select事件回调(二级分类id发生变化获取三级分类信息)
    async handler2() {
      // 清除数据
      this.category3List = [];
      this.categoryInfo.category3Id = "";
      const { category2Id } = this.categoryInfo;
      //自定义事件 将数据传给父组件 二级id
      this.$emit("getGategoryId", { categoryId: category2Id, level: 2 });
      let result = await this.$API.attr.reqGetCategory3(category2Id);
      if (result.code === 200) {
        this.category3List = result.data;
      }
    },
    handler3() {
      const { category3Id } = this.categoryInfo;
      //自定义事件 将数据传给父组件 二级id
      this.$emit("getGategoryId", { categoryId: category3Id, level: 3 });
    }
  }
}
</script>

<style>
</style>