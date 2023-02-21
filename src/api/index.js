import * as trademark from './product/tradeMark'
import * as attr from './product/attr'
import * as spu from './product/spu'
import * as sku from './product/sku'
// 引入权限管理相关接口文件
import permission from './acl/permission'
import role from './acl/role'
import * as user from './acl/user'

export default {
  trademark,
  attr,
  spu,
  sku,
  permission,
  role,
  user
}