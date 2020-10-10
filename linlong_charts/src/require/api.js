import { get } from './http'

export const apiWhole = data => get('/flask_data/whole', data)

export const apiDetails = (or, data) => get(`/flask_data/${or}_metrics`, data)

export const apiComparte = data => get('/flask_data/play', data)

export const apiTopic = data => get('/flask_data/topic', data)

export const apiAuthor = data => get('/flask_data/author', data)

export const apiClickNums = data => get('/flask_data/click_nums', data)
