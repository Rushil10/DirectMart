import { url } from "../../../api/api"
import axios from "axios"
import { AsyncStorage } from "react-native"
import { FETCH_PRODUCTS , ADD_PRODUCTS , UPDATE_PRODUCT } from "../types"

export const fetchProducts = () => async dispatch => {
    console.log("Comming for redux"); 
    var token = await AsyncStorage.getItem('shop_token');

    axios.get(`${url}/shop/products`,{
        headers: {
            'Content-Type': 'application/json',
            "Authorization": `Bearer ${token}`
        }
    }).then(res => {
        console.log(res.data)
        dispatch({type:FETCH_PRODUCTS,products: res.data})
    }).catch(err => {
        console.log("error");
        console.log(err)
    })

}

export const addProducts = (products) => async dispatch => {
    console.log("Comming for redux"); 
    var token = await AsyncStorage.getItem('shop_token');

    axios.post(`${url}/shop/product`, products , {
        headers: {
            'Content-Type': 'application/json',
            "Authorization": `Bearer ${token}`
        }
        })
    .then(async(res) => {
        console.log("response");
        console.log(res.data);
        dispatch({type:ADD_PRODUCTS,product: res.data})
    })
    .catch(err => {
        console.log(err);
    })
}

export const updateProducts = (products) => async dispatch => {
    console.log("1234567890"); 
    console.log(products);
    var token = await AsyncStorage.getItem('shop_token');

    axios.post(`${url}/shop/product/${products.product_id}`, products , {
        headers: {
            'Content-Type': 'application/json',
            "Authorization": `Bearer ${token}`
        }
        })
    .then(async(res) => {
        console.log("response");
        console.log(res.data);
        console.log("1234567890"); 
        dispatch({type:UPDATE_PRODUCT,product: products})
    })
    .catch(err => {
        console.log(err);
    })
}