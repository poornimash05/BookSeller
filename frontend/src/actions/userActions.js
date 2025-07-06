import axios from 'axios'
import {
  USER_LOGIN_REQUEST,
  USER_LOGIN_SUCCESS,
  USER_LOGIN_FAIL,

  USER_LOGOUT,

  USER_REGISTER_REQUEST,
  USER_REGISTER_SUCCESS,
  USER_REGISTER_FAIL,

  USER_DETAILS_REQUEST,
  USER_DETAILS_SUCCESS,
  USER_DETAILS_FAIL,
  USER_DETAILS_RESET,

  USER_UPDATE_PROFILE_REQUEST,
  USER_UPDATE_PROFILE_SUCCESS,
  USER_UPDATE_PROFILE_FAIL,

  USER_LIST_REQUEST,
  USER_LIST_SUCCESS,
  USER_LIST_FAIL,
  USER_LIST_RESET,

  USER_DELETE_REQUEST,
  USER_DELETE_SUCCESS,
  USER_DELETE_FAIL,

  USER_UPDATE_REQUEST,
  USER_UPDATE_SUCCESS,
  USER_UPDATE_FAIL,
} from '../constants/userConstant'

import { ORDER_LIST_MY_RESET } from '../constants/orderConstant'
import { toast } from 'react-toastify'

// 🔹 Helper to get token from localStorage
const getToken = () => {
  const userInfo = localStorage.getItem('userInfo')
    ? JSON.parse(localStorage.getItem('userInfo'))
    : null
  return userInfo?.token
}

// 🔹 Save FCM Token to Backend
export const saveFcmToken = (fcmToken) => async (dispatch) => {
  try {
    const token = getToken()

    await axios.post(
      '/api/save-token/',
      { token: fcmToken },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    )
    console.log('✅ FCM token saved successfully')
  } catch (error) {
    console.error('❌ Error saving FCM token:', error.response?.data || error.message)
  }
}

// 🔹 Login Action
export const login = (email, password) => async (dispatch) => {
  try {
    dispatch({ type: USER_LOGIN_REQUEST })

    const config = {
      headers: { 'Content-type': 'application/json' },
    }

    const { data } = await axios.post(
      '/api/users/login/',
      {email, password },
      config
    )

    dispatch({ type: USER_LOGIN_SUCCESS, payload: data })
    localStorage.setItem('userInfo', JSON.stringify(data))
    toast.success('Login successful!')
  } catch (error) {
    console.log('LOGIN ERROR:', error.response?.data)
    dispatch({
      type: USER_LOGIN_FAIL,
      payload: error.response?.data?.detail || error.message,
    })
    toast.error('Invalid email or password')
  }
}

// 🔹 Logout Action
export const logout = () => (dispatch) => {
  localStorage.removeItem('userInfo')
  dispatch({ type: USER_LOGOUT })
  dispatch({ type: USER_DETAILS_RESET })
  dispatch({ type: ORDER_LIST_MY_RESET })
  dispatch({ type: USER_LIST_RESET })
}

// 🔹 Register Action
export const register = (name, email, password) => async (dispatch) => {
  try {
    dispatch({ type: USER_REGISTER_REQUEST })

    const config = {
      headers: { 'Content-type': 'application/json' },
    }

    const { data } = await axios.post(
      '/api/users/register/',
      { name, email, password },
      config
    )

    dispatch({ type: USER_REGISTER_SUCCESS, payload: data })
    dispatch({ type: USER_LOGIN_SUCCESS, payload: data })

    localStorage.setItem('userInfo', JSON.stringify(data))
    toast.success('Registration successful!')

  } catch (error) {
    dispatch({
      type: USER_REGISTER_FAIL,
      payload: error.response?.data?.detail || error.message,
    })
  }
}

// 🔹 Get User Details
export const getUserDetails = (id) => async (dispatch) => {
  try {
    dispatch({ type: USER_DETAILS_REQUEST })

    const token = getToken()
    const config = {
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }

    const { data } = await axios.get(`/api/users/${id}/`, config)
    dispatch({ type: USER_DETAILS_SUCCESS, payload: data })

  } catch (error) {
    dispatch({
      type: USER_DETAILS_FAIL,
      payload: error.response?.data?.detail || error.message,
    })
  }
}

// 🔹 Update User Profile
export const updateUserProfile = (user) => async (dispatch) => {
  try {
    dispatch({ type: USER_UPDATE_PROFILE_REQUEST })

    const token = getToken()
    const config = {
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }

    const { data } = await axios.put(`/api/users/profile/update/`, user, config)

    dispatch({ type: USER_UPDATE_PROFILE_SUCCESS, payload: data })
    dispatch({ type: USER_LOGIN_SUCCESS, payload: data })
    localStorage.setItem('userInfo', JSON.stringify(data))

  } catch (error) {
    dispatch({
      type: USER_UPDATE_PROFILE_FAIL,
      payload: error.response?.data?.detail || error.message,
    })
  }
}

// 🔹 Save User Address
export const saveUserAddress = (address) => (dispatch, getState) => {
  dispatch({
    type: 'USER_SAVE_ADDRESS',
    payload: address,
  })

  const {
    userLogin: { userInfo },
  } = getState()

  let savedAddresses = userInfo?.savedAddresses || []
  savedAddresses.push(address)
  localStorage.setItem('savedAddresses', JSON.stringify(savedAddresses))
}

// 🔹 List All Users (Admin)
export const listUsers = () => async (dispatch) => {
  try {
    dispatch({ type: USER_LIST_REQUEST })

    const token = getToken()
    const config = {
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }

    const { data } = await axios.get(`/api/users/`, config)
    dispatch({ type: USER_LIST_SUCCESS, payload: data })

  } catch (error) {
    dispatch({
      type: USER_LIST_FAIL,
      payload: error.response?.data?.detail || error.message,
    })
  }
}

// 🔹 Delete User (Admin)
export const deleteUser = (id) => async (dispatch) => {
  try {
    dispatch({ type: USER_DELETE_REQUEST })

    const token = getToken()
    const config = {
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }

    const { data } = await axios.delete(`/api/users/delete/${id}/`, config)
    dispatch({ type: USER_DELETE_SUCCESS, payload: data })

  } catch (error) {
    dispatch({
      type: USER_DELETE_FAIL,
      payload: error.response?.data?.detail || error.message,
    })
  }
}

// 🔹 Update User (Admin)
export const updateUser = (user) => async (dispatch) => {
  try {
    dispatch({ type: USER_UPDATE_REQUEST })

    const token = getToken()
    const config = {
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }

    const { data } = await axios.put(`/api/users/update/${user._id}/`, user, config)

    dispatch({ type: USER_UPDATE_SUCCESS })
    dispatch({ type: USER_DETAILS_SUCCESS, payload: data })

  } catch (error) {
    dispatch({
      type: USER_UPDATE_FAIL,
      payload: error.response?.data?.detail || error.message,
    })
  }
}
