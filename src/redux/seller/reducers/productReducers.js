import { FETCH_PRODUCTS , ADD_PRODUCTS , UPDATE_PRODUCT} from "../types";

const initialState = {
    products:[],
    total:0,
    number:0
}

export default function(state=initialState,action) {

    console.log("ACCESSING THIS REDUCER");
    console.log("ACTION" , action);

    switch (action.type){
        case FETCH_PRODUCTS:
            return {
                ...state,
                products: action.products
            }
        case ADD_PRODUCTS:
            return {
                ...state,
                products:[
                    action.product,
                    ...state.products
                ]
            }
        case UPDATE_PRODUCT: 
        let newArray = state.products.filter((obj) => 
            obj.product_id !== action.product.product_id
            ) 
            return {
                ...state,
                products : [
                    ...newArray,
                    action.item
                ]
            }
        default:
            return state
    }
}