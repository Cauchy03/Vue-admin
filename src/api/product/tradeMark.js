import requestx from '@/utils/requestx'
// 添加baseurl /devapi 两个接口

// 获取品牌信息 /admin/product/baseTrademark/{page}/{limit}
export const reqTradeMarkList = ({page,limit}) => {
    return requestx({
        url: `/admin/product/baseTrademark/${page}/${limit}`,
        method: 'get'
    })
}

// 添加品牌信息 /admin/product/baseTrademark/save
// 修改品牌信息 /admin/product/baseTrademark/update 携带id
export const reqAddOrUpdate = (tradeMark) => {
    if(tradeMark.id){
        return requestx({url: '/admin/product/baseTrademark/update', method: 'put', data: tradeMark})
    } else {
        return requestx({url: '/admin/product/baseTrademark/save', method: 'post', data: tradeMark})
    }
}

// 删除品牌信息 /admin/product/baseTrademark/remove/{id}
export const reqRemoveTrademark = (id) => {
    return requestx({
        url: `/admin/product/baseTrademark/remove/${id}`,
        method: 'delete'
    })
}
