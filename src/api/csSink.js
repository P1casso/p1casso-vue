import request from '@/utils/request'

export function getListeningSkinList(data) {
  return request({
    url: '/cs_skin/tracking',
    method: 'POST',
    data: data,
  })
}
export function deleteTrackingSkin(id) {
  return request({
    url: '/cs_skin/track/' + id,
    method: 'DELETE',
  })
}


export function addTrackSkin(id) {
  return request({
    url: '/cs_skin/track/' + id,
    method: 'POST',
  })
}

export function getPriceHistoryById(id) {
  return request({
    url: '/cs_skin/price/history/' + id,
    method: 'GET',
  })
}
