import { createContext, useContext, useState } from 'react'
import commonAPI from '../services/commonAPI'
import { server_url } from '../services/server_url'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user') || 'null'))
    const [token, setToken] = useState(() => localStorage.getItem('token'))

    const register = async (userData) => {
        return await commonAPI('post', `${server_url}/register`, userData)
    }

    const login = async (userData) => {
        const response = await commonAPI('post', `${server_url}/login`, userData)
        if (response.status === 200 && response.data.token) {
            localStorage.setItem('token', response.data.token)
            localStorage.setItem('user', JSON.stringify(response.data.user))
            setToken(response.data.token)
            setUser(response.data.user)
        }
        return response
    }

    const logout = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        setToken(null)
        setUser(null)
    }

    return (
        <AuthContext.Provider value={{ user, token, register, login, logout, setUser }}>
            {children}
        </AuthContext.Provider>
    )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext)