import request from '@/utils/request'

const api = {
  list: '/investment-record/list',
  create: '/investment-record/add',
  update: '/investment-record/update',
  delete: '/investment-record/delete',
}

export default api

/**
 * 获取投资记录列表
 * 查询参数通过请求体(RequestBody)传递，分页通过 URL Query Parameter(RequestParam)
 * 默认页大小为 100
 * @param {Object} parameter - 查询参数，支持 stockId, tradeDate, page, pageSize
 */
export const getInvestmentList = (parameter) => {
  return request({
    url: api.list,
    method: 'post',
    data: {
      stockId: parameter.stockId,
      tradeDate: parameter.tradeDate,
    },
    params: {
      page: parameter.page || 1,
      pageSize: parameter.pageSize || 100,
    }
  })
}

/**
 * 创建投资记录
 * @param {Object} parameter - 投资记录数据
 */
export const createInvestment = (parameter) => {
  return request({
    url: api.create,
    method: 'post',
    data: parameter,
  })
}

/**
 * 更新投资记录
 * @param {Object} parameter - 投资记录数据
 */
export const updateInvestment = (parameter) => {
  return request({
    url: api.update,
    method: 'post',
    data: parameter,
  })
}

/**
 * 删除投资记录
 * @param {String} id - 投资记录ID
 */
export const deleteInvestment = (id) => {
  return request({
    url: api.delete,
    method: 'post',
    data: { id },
  })
}

const weeklyApi = {
  list: '/investment-weekly-statistics/list',
  create: '/investment-weekly-statistics/create',
  update: '/investment-weekly-statistics/update',
  delete: '/investment-weekly-statistics/delete',
}

export const getWeeklyStatisticsList = (parameter) => {
  return request({
    url: weeklyApi.list,
    method: 'post',
    data: {
      date: parameter.date,
    },
    params: {
      page: parameter.page || 1,
      pageSize: parameter.pageSize || 100,
    }
  })
}

export const createWeeklyStatistics = (parameter) => {
  return request({
    url: weeklyApi.create,
    method: 'post',
    data: parameter,
  })
}

export const updateWeeklyStatistics = (parameter) => {
  return request({
    url: weeklyApi.update,
    method: 'post',
    data: parameter,
  })
}

export const deleteWeeklyStatistics = (id) => {
  return request({
    url: weeklyApi.delete,
    method: 'delete',
    data: { id },
  })
}

export const getCurrentMarketValue = () => {
  return request({
    url: '/investment-record/current-market-value',
    method: 'get',
  })
}

export const updateCurrentMarketValue = (value) => {
  return request({
    url: '/investment-record/current-market-value',
    method: 'post',
    data: { value },
  })
}

export const getStatistics = () => {
  return request({
    url: '/investment-record/statistics',
    method: 'get',
  })
}
