import mockjs from 'mockjs'
import { getUserList } from './user'
import { selectList } from './select'

const Mock = require('mockjs')
// 获取用户表格数据
Mock.mock('/web/user/getUserList', 'get', getUserList)
Mock.mock('/zdn/selectList', 'get', selectList)

export default mockjs