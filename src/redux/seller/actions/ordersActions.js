import { url } from "../../../api/api"
import axios from "axios"
import { AsyncStorage } from "react-native"
import { FETCH_ORDERS ,  FETCH_OFD_ORDERS ,  FETCH_D_ORDERS , ORDER_READY_FOR_DELIVERY , ORDER_DELIVERED} from "../types"

export const fetchOrders = () => async dispatch => {
    console.log("Comming for redux"); 
    var token = await AsyncStorage.getItem('shop_token');
    axios.get(`${url}/shop/orders`,{
    headers: {
        'Content-Type': 'application/json',
        "Authorization": `Bearer ${token}`
    }
}).then(res => {
    // console.log(res.data)
    dispatch({type:FETCH_ORDERS,orders: res.data})
}).catch(err => {
    console.log("error");
    console.log(err)
})
    
}

export const fetchOFDOrders = () => async dispatch => {
    console.log("OFD");
    var token = await AsyncStorage.getItem('shop_token');
        axios.get(`${url}/orders/outForDelivery`,{
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${token}`
            }
        }).then(res => {
            dispatch({type:FETCH_OFD_ORDERS , orders: res.data})
        }).catch(err => {
            console.log("error");
            console.log(err)
        })
}

export const fetchDOrders = () => async dispatch => {
    console.log("D");
    var token = await AsyncStorage.getItem('shop_token');
    axios.get(`${url}/orders/delivered`,{
        headers: {
            'Content-Type': 'application/json',
            "Authorization": `Bearer ${token}`
        }
    }).then(res => {
        console.log("Delivered Orders");
        dispatch({type:FETCH_D_ORDERS , orders: res.data})
    }).catch(err => {
        console.log("error");
        console.log(err)
    })
}

export const orderReadyForDelivery = (item) => async dispatch => {
    console.log("Comming for redux"); 
    var token = await AsyncStorage.getItem('shop_token');

    console.log("IAMHERE_+_++_+_+_+_+_+_+_+_++__+_+_+_+_");

    axios.post(`${url}/notify`, {
        title: "Order ready for delivery/Pickup",
        body: "Your Order of " + item.tota + " rupees is ready for delivery/Pickup you can check the further status on the app ",
        user_id: item.consumer_id,
        user_type: "consumer",
        data: { type: "data is here :)"}
    } , {
        headers: {
            'Content-Type': 'application/json',
            "Authorization": `Bearer ${token}`
        }
        })
    .then(async(res) => {
        console.log("))))))))))))))))))))))))))))))))");
        console.log("Notification Sent");
        console.log("res" , res);
    })
    .catch(err => {
        console.log("((((((((((((((((((((((((((((((((((");
        console.log("Notification not Sent");
        console.log(err);
    })


    axios.post(`${url}/order/${item.order_cart_id}`, {
        type: "OutForDelivery"
    } , {
        headers: {
            'Content-Type': 'application/json',
            "Authorization": `Bearer ${token}`
        }
        })
    .then(async(res) => {
        console.log("))))))))))))))))))))))))))))))))");
        console.log(item);
        item.delivery_status = "Out For Delivery"
        console.log("response");
        console.log(res.data);
        dispatch({type:ORDER_READY_FOR_DELIVERY,item: item})
    })
    .catch(err => {
        console.log("((((((((((((((((((((((((((((((((((");
        console.log("Status not updated");
        console.log(err);
    })



}

export const orderDelivered = (item) => async dispatch => {
    console.log("Comming for redux"); 
    var token = await AsyncStorage.getItem('shop_token');

    console.log("IAMHERE_+_++_+_+_+_+_+_+_+_++__+_+_+_+_");

    axios.post(`${url}/notify`, {
        title: "Order Completed",
        body: "Your Order of " + item.tota + " rupees is delivered/picked up if not you can contact to shop owner via app ",
        user_id: item.consumer_id,
        user_type: "consumer",
        data: { type: "data is here :)"}
    } , {
        headers: {
            'Content-Type': 'application/json',
            "Authorization": `Bearer ${token}`
        }
        })
    .then(async(res) => {
        console.log("))))))))))))))))))))))))))))))))");
        console.log("Notification Sent");
        console.log("res" , res);
    })
    .catch(err => {
        console.log("((((((((((((((((((((((((((((((((((");
        console.log("Notification not Sent");
        console.log(err);
    })

    axios.post(`${url}/order/${item.order_cart_id}`, {
        type: "Delivered"
    } , {
        headers: {
            'Content-Type': 'application/json',
            "Authorization": `Bearer ${token}`
        }
        })
    .then(async(res) => {
        console.log("))))))))))))))))))))))))))))))))");
        item.delivery_status = "Delivered"
        console.log("response");
        console.log(res.data);
        dispatch({type:ORDER_DELIVERED,item: item})
    })
    .catch(err => {
        console.log("((((((((((((((((((((((((((((((((((");
        console.log(err);
    })
}
