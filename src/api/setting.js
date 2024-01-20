import request from '@/utils/request'

export function getNeedMonitorList() {
  return request({
    url: '/monitor/list',
    method: 'get'
  })
}