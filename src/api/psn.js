import request from '@/utils/request'

export function getTrophySummary() {
  return request({
    url: '/ps/trophy_summary',
    method: 'GET',
  })
}

export function getGameCareer() {
  return request({
    url: '/ps/game/career',
    method: 'GET',
  })
}
export function getLastPlay() {
  return request({
    url: '/ps/game/last_play',
    method: 'GET',
  })
}

export function getGameCalendar(year) {
  return request({
    url: '/ps/trophy/calendar/' + year,
    method: 'GET',
  })
}

export function getLastTrophy() {
  return request({
    url: '/ps/trophy/last',
    method: 'GET',
  })
}

export function getSetting() {
  return request({
    url: '/ps/setting',
    method: 'GET',
  })
}

export function updateNpsso(npsso) {
  return request({
    url: '/ps/setting/npsso/' + npsso,
    method: 'PUT',
  })
}

export function getGameList() {
  return request({
    url: '/ps/game_trophy/game/list',
    method: 'GET',
  })
}

export function getTrophyListByNpCommunicationId(npCommunicationId) {
  return request({
    url: `/ps/trophy/group/${npCommunicationId}`,
    method: 'GET',
  })
}
