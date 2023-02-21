import requestx from '@/utils/requestx'

// 获取SpuList列表 /admin/product/{page}/{limit}
export const reqSpuList = (page, limit, category3Id) => {
  return requestx({ url: `/admin/product/${page}/${limit}`, method: 'get', params: { category3Id } })
}

// 获取单个SPU信息 /admin/product/getSpuById/{spuId} 
export const reqSpu = (spuId) => {
  return requestx({ url: `/admin/product/getSpuById/${spuId}`, method: 'get' })
}

// 获取品牌信息 /admin/product/baseTrademark/getTrademarkList
export const reqTrademarkList = () => {
  return requestx({ url: '/admin/product/baseTrademark/getTrademarkList', method: 'get' })
}

// 获取SPU图片信息 /admin/product/spuImageList/{spuId}
export const reqSpuImageList = (spuId) => {
  return requestx({ url: `/admin/product/spuImageList/${spuId}`, method: 'get' })
}

// 获取平台全部基础销售属性 ---- 整个平台属性一共三个 /admin/product/baseSaleAttrList
export const reqSaleAttrList = () => {
  return requestx({ url: '/admin/product/baseSaleAttrList', method: 'get' })
}

// 添加或编辑更新Spu信息 /admin/product/saveSpuInfo /admin/product/updateSpuInfo
export const reqAddOrUpdateSpu = (spuInfo) => {
  if (spuInfo.id) {
    console.log('更新');
    return requestx({ url: '/admin/product/updateSpuInfo', method: 'post', data: spuInfo })
  } else {
    console.log('添加');
    return requestx({ url: '/admin/product/saveSpuInfo', method: 'post', data: spuInfo })
  }
}

// 删除Spu /admin/product/deleteSpu/{spuId}
export const reqDeleteSpu = (spuId) => {
  return requestx({ url: `/admin/product/deleteSpu/${spuId}`, method: 'delete' })
}

// ---------------------------------------------------------------------------------------------//
// ---------------------------------------------------------------------------------------------//

// 获取SPU图片信息 /admin/product/spuImageList/{spuId}
// export const reqSpuImageList = (spuId) => {
//   return requestx({ url: `/admin/product/spuImageList/${spuId}`, method: 'get' })
// }

// 获取Spu销售属性值列表 /admin/product/spuSaleAttrList/{spuId}
export const reqSpuSaleAttrList = (spuId) => {
  return requestx({ url: `/admin/product/spuSaleAttrList/${spuId}`, method: 'get' })
}

// 获取平台属性的数据 /admin/product/attrInfoList/{category1Id}/{category2Id}/{category3Id}
export const reqattrInfoList = (category1Id, category2Id, category3Id) => {
  return requestx({ url: `/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`, method: 'get' })
}

// 保存sku信息 /admin/product/saveSkuInfo
export const reqSaveSkuInfo = (skuInfo) => {
  return requestx({ url: '/admin/product/saveSkuInfo', method: 'post', data: skuInfo })
}

// ---------------------------------------------------------------------------------------------//
// ---------------------------------------------------------------------------------------------//

// 获取Sku列表数据 /admin/product/findBySpuId/{spuId}
export const reqBySpuId = (spuId) => {
  return requestx({ url: `/admin/product/findBySpuId/${spuId}`, method: 'get' })
}