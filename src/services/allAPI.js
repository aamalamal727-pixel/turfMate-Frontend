import commonAPI from './commonAPI'
import { server_url } from './server_url'

const getToken = () => localStorage.getItem('token')

const jsonHeader = () => ({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${getToken()}`
})

const authHeader = () => ({
    Authorization: `Bearer ${getToken()}`
})

// ---------- AUTH ----------
export const registerAPI = (data) => commonAPI('post', `${server_url}/register`, data)
export const loginAPI = (data) => commonAPI('post', `${server_url}/login`, data)
export const getProfileAPI = () => commonAPI('get', `${server_url}/profile`, undefined, jsonHeader())
export const updateProfileAPI = (data) => commonAPI('put', `${server_url}/profile`, data, jsonHeader())

// ---------- TURFS ----------
export const getAllTurfsAPI = (query = '') => commonAPI('get', `${server_url}/turfs${query}`, undefined, jsonHeader())
export const getTurfAPI = (id) => commonAPI('get', `${server_url}/turfs/${id}`, undefined, jsonHeader())
export const getMyTurfsAPI = () => commonAPI('get', `${server_url}/my-turfs`, undefined, jsonHeader())
export const addTurfAPI = (data) => commonAPI('post', `${server_url}/turfs`, data, authHeader())
export const updateTurfAPI = (id, data) => commonAPI('put', `${server_url}/turfs/${id}`, data, authHeader())
export const deleteTurfAPI = (id) => commonAPI('delete', `${server_url}/turfs/${id}`, undefined, jsonHeader())

// ---------- BOOKINGS ----------
export const createBookingAPI = (data) => commonAPI('post', `${server_url}/bookings`, data, jsonHeader())
export const getMyBookingsAPI = () => commonAPI('get', `${server_url}/bookings/my`, undefined, jsonHeader())
export const getBookingAPI = (id) => commonAPI('get', `${server_url}/bookings/${id}`, undefined, jsonHeader())
export const cancelBookingAPI = (id) => commonAPI('put', `${server_url}/bookings/cancel/${id}`, {}, jsonHeader())
export const getTurfBookingsAPI = (turfId, date) => commonAPI('get', `${server_url}/turf-bookings/${turfId}?date=${date}`, undefined, jsonHeader())
export const getOwnerBookingsAPI = () => commonAPI('get', `${server_url}/owner/bookings`, undefined, jsonHeader())
export const getOwnerEarningsAPI = () => commonAPI('get', `${server_url}/owner/earnings`, undefined, jsonHeader())
export const updateBookingStatusAPI = (id, status) => commonAPI('put', `${server_url}/bookings/${id}/status`, { status }, jsonHeader())

// ---------- PAYMENTS ----------
export const createPaymentAPI = (data) => commonAPI('post', `${server_url}/payments`, data, jsonHeader())
export const getMyPaymentsAPI = () => commonAPI('get', `${server_url}/payments/my`, undefined, jsonHeader())
export const createCheckoutSessionAPI = (bookingId) => commonAPI('post', `${server_url}/payments/create-checkout-session`, { bookingId }, jsonHeader())
export const getStripeSessionAPI = (sessionId) => commonAPI('get', `${server_url}/payments/session/${sessionId}`, undefined, jsonHeader())

// ---------- TEAMS ----------
export const createTeamAPI = (data) => commonAPI('post', `${server_url}/teams`, data, jsonHeader())
export const getAllTeamsAPI = () => commonAPI('get', `${server_url}/teams`, undefined, jsonHeader())
export const getMyTeamsAPI = () => commonAPI('get', `${server_url}/teams/my`, undefined, jsonHeader())
export const getTeamAPI = (id) => commonAPI('get', `${server_url}/teams/${id}`, undefined, jsonHeader())
export const updateTeamAPI = (id, data) => commonAPI('put', `${server_url}/teams/${id}`, data, jsonHeader())
export const deleteTeamAPI = (id) => commonAPI('delete', `${server_url}/teams/${id}`, undefined, jsonHeader())
export const addPlayerAPI = (teamId, playerId) => commonAPI('post', `${server_url}/teams/${teamId}/players`, { playerId }, jsonHeader())
export const removePlayerAPI = (teamId, playerId) => commonAPI('delete', `${server_url}/teams/${teamId}/players/${playerId}`, undefined, jsonHeader())

// ---------- MATCHES ----------
export const getAllMatchesAPI = () => commonAPI('get', `${server_url}/matches`, undefined, jsonHeader())

// ---------- ADMIN ----------
export const getAllUsersAPI = () => commonAPI('get', `${server_url}/admin/users`, undefined, jsonHeader())
export const getAllOwnersAPI = () => commonAPI('get', `${server_url}/admin/owners`, undefined, jsonHeader())
export const getAllAdminTurfsAPI = () => commonAPI('get', `${server_url}/admin/turfs`, undefined, jsonHeader())
export const getAllAdminBookingsAPI = () => commonAPI('get', `${server_url}/admin/bookings`, undefined, jsonHeader())
export const getAllAdminPaymentsAPI = () => commonAPI('get', `${server_url}/admin/payments`, undefined, jsonHeader())
export const getAdminStatsAPI = () => commonAPI('get', `${server_url}/admin/stats`, undefined, jsonHeader())
export const promoteAPI = (id) => commonAPI('put', `${server_url}/admin/promote/${id}`, {}, jsonHeader())
export const toggleUserAPI = (id) => commonAPI('put', `${server_url}/admin/toggle/${id}`, {}, jsonHeader())
export const deleteUserAPI = (id) => commonAPI('delete', `${server_url}/admin/users/${id}`, undefined, jsonHeader())