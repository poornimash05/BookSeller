import axios from 'axios'
import {
    PRODUCT_LIST_REQUEST,
    PRODUCT_LIST_SUCCESS,
    PRODUCT_LIST_FAIL,

    PRODUCT_DETAILS_REQUEST,
    PRODUCT_DETAILS_SUCCESS,
    PRODUCT_DETAILS_FAIL,
} from '../constants/productConstant'

export const listProducts = (
  keyword = '',
  classFilter = '',
  schoolFilter = '',
  priceSort = '',
  minPrice = '',
  maxPrice = ''
) => async (dispatch) => {
  try {
    dispatch({ type: PRODUCT_LIST_REQUEST });

    let query = `?keyword=${keyword}`;

    if (classFilter) query += `&class=${classFilter}`;
    if (schoolFilter) query += `&school=${schoolFilter}`;
    if (priceSort === 'range') {
      query += `&price=range&min_price=${minPrice}&max_price=${maxPrice}`;
    } else if (priceSort) {
      query += `&price=${priceSort}`;
    }

    const { data } = await axios.get(`/api/products/${query}`);

    dispatch({
      type: PRODUCT_LIST_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: PRODUCT_LIST_FAIL,
      payload:
        error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message,
    });
  }
};


export const listProductDetails = (id) => async (dispatch) => {
    try {
        dispatch({ type: PRODUCT_DETAILS_REQUEST })

        const { data } = await axios.get(`/api/products/${id}`)

        dispatch({
            type: PRODUCT_DETAILS_SUCCESS,
            payload: data
        })

    } catch (error) {
        dispatch({
            type: PRODUCT_DETAILS_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message,
        })
    }
}