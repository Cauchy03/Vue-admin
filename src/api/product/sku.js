import requestx from '@/utils/requestx'

// 获取SKU列表 /admin/product/list/{page}/{limit}
export const reqSkuList = (page, limit) => {
  return requestx({ url: `/admin/product/list/${page}/${limit}`, method: 'get' })
}

// 上架商品 /admin/product/onSale/{skuId}
export const reqOnSale = (skuId) => {
  return requestx({ url: `/admin/product/onSale/${skuId}`, method: 'get' })
}

// 下架商品 /admin/product/cancelSale/{skuId}
export const reqCancelSale = (skuId) => {
  return requestx({ url: `/admin/product/cancelSale/${skuId}`, method: 'get' })
}

// 获取sku单个详情信息 /admin/product/getSkuById/{skuId}
export const reqSkuInfo = (skuId) => {
  return requestx({ url: `/admin/product/getSkuById/${skuId}`, method: 'get' })
}