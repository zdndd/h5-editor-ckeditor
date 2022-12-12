import mockjs from 'mockjs'
import { getUserList } from './user'

const Mock = require('mockjs')
// 获取用户表格数据
Mock.mock('/web/user/getUserList', 'get', getUserList)

export default mockjs