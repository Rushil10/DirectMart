import { DELIVERED, OUT_FOR_DELIVERY, SET_CURRENT_ORDERS } from "../types";

const initialState = {
    current:[],
    outForDelivery:[],
    delivered:[],
    currLoading:true,
    outLoading:true,
    delLoading:true,
}

export default function(state=initialState,action) {
    switch (action.type){
        case SET_CURRENT_ORDERS:
            return {
                ...state,
                current:action.currentOrders,
                currLoading:false
            }
        case OUT_FOR_DELIVERY:
            return {
                ...state,
                outForDelivery:action.outForDelivery,
                outLoading:false
            }
        case DELIVERED:
            return {
                ...state,
                delivered:action.delivered,
                delLoading:false
            }
        default:
            return state
    }
}