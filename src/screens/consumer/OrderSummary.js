import * as React from 'react';
import { View, Text, AsyncStorage,ScrollView,Button,Dimensions,Alert,Image,FlatList,StatusBar } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Header from './ConsumerComponents/Header';
import axios from 'axios';
import { url } from '../../api/api';
import CartProduct from './ConsumerComponents/CartProduct';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import jwtDecode from 'jwt-decode';
import ordersReducer from '../../redux/consumer/reducers/ordersReducer';
import OrderSummaryProduct from './ConsumerComponents/OrderSummaryProduct';
import RNUpiPayment from 'react-native-upi-pay';
import { setDeliveredOrders, setOutForDeliveryOrders,setCurrentOrders } from '../../redux/consumer/actions/orders';
import { setCartProducts } from '../../redux/consumer/actions/cartActions';
import QuantityModal from './ConsumerComponents/InsufficientQuantityModal';

const {height,width} = Dimensions.get('window')

function OrderSummary(props) {

    const [order,setOrder] = React.useState([])
    const [total,setTotal] = React.useState(0)
    const [shop,setShop] = React.useState({})
    const [consumer,setConsumer] = React.useState([])
    const [loading,setLoading] = React.useState(true)
    const [orderDone,setOrderDone] = React.useState(false);
    const [err,showErr] = React.useState(false)
    const [errmsg,setErrmsg] = React.useState('')
    const [errimg,setErrimg] = React.useState('')

    const setData = async() => {
        setLoading(true)
        var token = await AsyncStorage.getItem('user_token')
        var consumer = jwtDecode(token)
        setConsumer(consumer)
        const data = props.route.params.order;
        const resp = await axios.get(`${url}/consumer/cartItemsOfShop/${data[0].shop_id}`,{
            headers: {
                Authorization : `Bearer ${token}`
            }
        })
        console.log(resp.data);
        setOrder(resp.data);
        var total = 0;
        resp.data.map(or => {
            total += or.total
        })
        setTotal(total)
        setLoading(false)
    }

    React.useEffect(() => {
        setData();
    },[])

    function failureCallback(data){
        console.log(data)
        // in case no action taken
    }
    function successCallback(data){
        //
        console.log(data);
    }

    function makeUpiPayment() {
        RNUpiPayment.initializePayment({
            vpa: 'chaitali.nshah.123@oksbi',  		//your upi address like 12345464896@okhdfcbank
            payeeName: ' Chaitali',   			// payee name 
            amount: '1',				//amount
            transactionNote:'Testing Upi',		//note of transaction
            transactionRef: 'aasf-332-aoei-fn'	//some refs to aknowledge the transaction
        },successCallback,failureCallback);
    }

    const placeOrder = async(payment_mode,payment_status) => {
        var token = await AsyncStorage.getItem('user_token')

        var orderP = {
            payment_mode:payment_mode,
            payment_status:payment_status,
            shop_id:order[0].shop_id
        }
        console.log(orderP);
        axios.post(`${url}/consumer/orderFromShop`,orderP,{
            headers :{
                Authorization: `Bearer ${token}`
            }
        }).then(res => {
            console.log(res.data);
            if(!res.data.message){
                setOrderDone(true);
                props.setCartProducts(token);
                props.setCurrentOrders(token);
                props.setOutForDeliveryOrders(token);
                props.setDeliveredOrders(token)
                var notify = {
                    title:'New Order Placed',
                    message:`Order of Rs ${total} placed by ${consumer.consumer_name} on your shop !`,
                    user_id:order[0].shop_id,
                    user_type:'shop',
                    data:{
                        type:'New Order'
                    }
                }
                axios.post(`${url}/notify`,notify).then(res => {
                    console.log(res.data)
                })
            } else {
                showErr(true);
                setErrmsg(res.data.message)
                var images = res.data.faulty.product_image
                var image = images.split(',')
                setErrimg(image[0])
                var notify = {
                    title:`${res.data.faulty.product_name}`,
                    message:`${consumer.consumer_name}  tried to order ${res.data.faulty.product_name} but it's not in stock \n\n Update Quantity Fast !`,
                    user_id:order[0].shop_id,
                    user_type:'shop',
                    data:{
                        type:'New Order'
                    }
                }
                axios.post(`${url}/notify`,notify).then(res => {
                    console.log(res.data)
                })
            }
        })
    }

    const closeErr = () => {
        showErr(false)
    }

    const onPressCOD = () => {
        placeOrder('cod','pending')
    }

    const createTwoButtonAlert = () =>
    Alert.alert(
      "Confirm Order",
      "Payment Method is Cash On Delivery. Pay On delivery.",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        { text: "OK", onPress: onPressCOD }
      ]
    );

    return (
        <View style={{flex:1,backgroundColor:'white'}}>
            <Header backgroundColor='#ff6347' header='Order Details' height={55} width={width} />
            {
                loading ?
                <Image source={require('../../images/l2.gif')} resizeMode='contain' style={{width:width}} />
                :
                order.length > 0 ?
                <ScrollView style={{padding:15,flex:1,paddingBottom:55}}>
                    <QuantityModal visible={err} message={errmsg} image={errimg} onClose={closeErr} />
                    {
                        orderDone &&
                        <View style={{marginTop:0,alignItems:'center',marginBottom:9}}>
                        <Text style={{fontSize:25,marginBottom:9,color:'#ff6347',fontFamily: "Montserrat-Medium"}}>Order Placed</Text>
                        <Image source={require('../../images/os.gif')} style={{width:width,height:width}} />
                    </View>
                    }
                    <Text style={{fontSize:21.5}}>Cart Total : Rs {total}</Text>
                <View style={{marginTop:5,marginBottom:5}}>
                <Text style={{fontSize:18,fontFamily: "Montserrat-Bold"}}>DELIVER TO</Text>
                    <Text style={{fontFamily: "Montserrat-Medium",fontSize:16.5}}>{consumer.consumer_name}</Text>
                    <Text style={{fontFamily: "Montserrat-Medium",fontSize:16.5}}>{consumer.consumer_address}</Text>
                <Text style={{fontFamily: "Montserrat-Bold",fontSize:15.5,marginTop:5}}>SHOP NAME</Text>
                    <Text style={{paddingLeft:9,fontFamily: "Montserrat-Medium",fontSize:16.5}}>{order[0].shop_name}</Text>
                    <Text style={{fontFamily: "Montserrat-Bold",fontSize:15.5,marginTop:5}}>SHOP CONTACT</Text>
                    <Text style={{paddingLeft:9,fontFamily: "Montserrat-Medium",fontSize:16.5}}>{order[0].shop_contact}</Text>
                    <Text style={{fontFamily: "Montserrat-Bold",fontSize:15.5,marginTop:5}}>TOTAL ITEMS</Text>
                    <Text style={{paddingLeft:9,fontFamily: "Montserrat-Medium",fontSize:16.5}}>{order.length}</Text>
                    
                </View>
                <View>
                    <FlatList
                    data={order}
                    renderItem={({item,index}) => <OrderSummaryProduct item={item} /> }
                    />
                </View>
                {
                    !orderDone &&
                    <View>
                        <Text style={{fontSize:22.5,color:'black',fontFamily: "Montserrat-Medium"}}>Payment Method</Text>
                        <View>
                    {/* {
                        order[0].shop_upiId!=='undefined' &&
                        <TouchableWithoutFeedback onPress={makeUpiPayment}>
                            <View style={{padding:7.5,alignItems:'center',backgroundColor:"#ff6347",borderRadius:9}}>
                                <Text style={{fontSize:21.5,color:'white',fontFamily: "Montserrat-Medium"}}>Pay Using UPI</Text>
                            </View>
                        </TouchableWithoutFeedback>
                    } */}
                </View>
                <View style={{marginTop:9}}>
                <TouchableWithoutFeedback onPress={createTwoButtonAlert}>
                    <View style={{padding:7.5,alignItems:'center',marginBottom:25,backgroundColor:"#ff6347",borderRadius:9}}>
                        <Text style={{fontSize:21.5,color:'white',fontFamily: "Montserrat-Medium"}}>Cash On Delivery</Text>
                    </View>
                </TouchableWithoutFeedback>
                </View>
                    </View>
                }
            </ScrollView>
            :
            <View style={{flex:1,justifyContent:'center',alignItems:'center'}} >
                <Text style={{color:'#ff6347',fontSize:19}} >No Items To Order !</Text>
                <Text style={{color:'gray',fontSize:19,marginTop:2.5}}>Increase The Quantity of Products</Text>
            </View>
            }
        </View>
    )
}

OrderSummary.propTypes = {
    setDeliveredOrders:PropTypes.func.isRequired,
    setOutForDeliveryOrders:PropTypes.func.isRequired,
    setCurrentOrders:PropTypes.func.isRequired,
    setCartProducts:PropTypes.func.isRequired
}

const mapStateToProps = (state) => ({
    orders:state.orders
})

const mapActionsToProps = {
    setDeliveredOrders,
    setCurrentOrders,
    setOutForDeliveryOrders,
    setCartProducts
}

export default connect(mapStateToProps,mapActionsToProps)(OrderSummary);