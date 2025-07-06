import api from '../api';

import {
    CART_ADD_ITEM,
    CART_REMOVE_ITEM,
    CART_SAVE_SHIPPING_ADDRESS,
    APPLY_COUPON_SUCCESS,
    CART_SAVE_PAYMENT_METHOD,
} from '../constants/cartConstant'

import { toast } from 'react-toastify'

export const addToCart = (id, qty) => async (dispatch, getState) => {
    const { data } = await api.get(`/api/products/${id}`)

    dispatch({
        type: CART_ADD_ITEM,
        payload: {
            product: data._id,
            name: data.name,
            image: data.image,
            price: data.price,
            countInStock: data.countInStock,
            qty
        }
    })
    localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems))
    toast.success('Item added successfully!')
}



export const removeFromCart = (id) => (dispatch, getState) => {
    dispatch({
        type: CART_REMOVE_ITEM,
        payload: id,
    })

    localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems))
    toast.success('Item Removed!')
}


export const saveShippingAddress = (shippingData) => (dispatch) => {
    dispatch({
        type: CART_SAVE_SHIPPING_ADDRESS,
        payload: shippingData,
    })

    localStorage.setItem('shippingAddress', JSON.stringify(shippingData))
    toast.success('Address Saved successfully!')
}

export const savePaymentMethod = (data) => (dispatch) => {
    dispatch({
        type: CART_SAVE_PAYMENT_METHOD,
        payload: data,
    })

    localStorage.setItem('paymentMethod', JSON.stringify(data))
    
}

export const applyCoupon = (couponCode, cartTotal) => async (dispatch) => {
    try {
      const { data } = await api.post('/api/coupons/apply_coupon/', {
        coupon_code: couponCode,
        cart_total: cartTotal,
      });
  
      dispatch({
        type: APPLY_COUPON_SUCCESS,
        payload: data, // should include { discount, new_total }
      });
  
      toast.success(`Coupon applied! Discount: ₹${data.discount}`);
    } catch (error) {
      toast.error("Error applying coupon");
    }
  };
