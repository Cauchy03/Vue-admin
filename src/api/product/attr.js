import requestx from '@/utils/requestx'

// 获取一级分类 /admin/product/getCategory1
export const reqGetCategory1 = () => {
  return requestx({ url: '/admin/product/getCategory1', method: 'get' })
}
// 获取二级分类 /admin/product/getCategory2/{category1Id}
export const reqGetCategory2 = (category1Id) => {
  return requestx({ url: `/admin/product/getCategory2/${category1Id}`, method: 'get' })
}
// 获取三级分类 /admin/product/getCategory3/{category2Id}
export const reqGetCategory3 = (category2Id) => {
  return requestx({ url: `/admin/product/getCategory3/${category2Id}`, method: 'get' })
}

// 获取categoryInfo信息 /admin/product/attrInfoList/{category1Id}/{category2Id}/{category3Id}
export const reqCategoryInfo = ({ category1Id, category2Id, category3Id }) => {
  return requestx({ url: `/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`, method: 'get' })
}

// 添加属性与属性值接口 /admin/product/saveAttrInfo  post
export const reqAddOrSaveAttrInfo = (attrInfo) => {
  return requestx({ url: '/admin/product/saveAttrInfo', method: 'post', data: attrInfo })
}