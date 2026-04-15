import request from '@/utils/request'

const api = {
  list: '/stock/list',
  create: '/stock/create',
  update: '/stock/update',
  delete: '/stock/delete'
}
export const getStockList = (parameter) => {
  return request({
    url: api.list,
    method: 'get',
    params: parameter
  })
}

export const createStock = (parameter) => {
  return request({
    url: api.create,
    method: 'post',
    data: parameter
  })
}

export const updateStock = (parameter) => {
  return request({
    url: api.update,
    method: 'post',
    data: parameter
  })
}

export const deleteStock = (id) => {
  return request({
    url: api.delete,
    method: 'DELETE',
    data: { id }
  })
}
