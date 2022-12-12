import Mock from 'mockjs'

const code = 200
export let selectList = () => {
  return {
    data: Mock.mock({
      list: [
        { name: '111', value: '目前（2022.11）加息还未结束，美元资产价格毫无疑问还会继续跌，所以显然要手握现金，等资产价格跌到位再行动' },
        { name: '333', value: '所以大家就盯着美国房产，特别是纽约的房产，萧条周期中再跌个15-20%很正常' },
        { name: '444', value: '我的观点，除了自住的房子，如果不是核心城市的核心地段的次新大户型，优先卖，其次换。' }
      ]
    }),
    code: code
  }
}

