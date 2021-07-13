import * as React from 'react';
import { View, Text, AsyncStorage,Image,Dimensions ,FlatList} from 'react-native';
import { setDeliveredOrders } from '../../redux/consumer/actions/orders';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import OrderCard from './ConsumerComponents/OrderCard';

const {height,width} = Dimensions.get('window')

function Delivered(props) {

    const [loading,setLoading] = React.useState(true);
    const [orders,setOrders] = React.useState([])
    const [token,setToken] = React.useState(null)

    const getOrders = async() => {
        setLoading(true)
        var token = await AsyncStorage.getItem('user_token')
        setToken(token);
        await props.setDeliveredOrders(token)
        await setOrders(props.orders.delivered)
        console.log(orders,'allOrders',props.orders.delivered)
        setLoading(false)
    }

    React.useEffect(() => {
        getOrders()
    },[])

    React.useEffect(() => {
        setLoading(true);
        setOrders(props.orders.delivered)
        setLoading(false);
    },[props.orders.delivered])

    return (
        <View style={{flex:1}}>
            {
                props.orders.delLoading ?
                <View style={{backgroundColor:'white',flex:1,alignItems:'center',justifyContent:'center'}}>
                    <Image source={require('../../images/l2.gif')} resizeMode='contain' style={{width:width}} />
                </View>
                :
                <View style={{flex:1,backgroundColor:'white',paddingLeft:5,paddingRight:5,paddingBottom:0}}>
                    {
                        orders.length>0
                        ?
                        <FlatList
                    data={orders}
                    renderItem={({item,index}) => <OrderCard item={item} status="DELIVERED" /> }
                    />
                    :
                    <View style={{flex:1,justifyContent:'center',alignItems:'center',padding:9}}>
                        <Text style={{fontSize:22.5,color:'gray'}}>No Delivered Orders</Text> 
                        </View>
                    }
                </View>
            }
        </View>
    )
}

Delivered.propTypes = {
    setDeliveredOrders:PropTypes.func.isRequired
}

const mapStateToProps = (state) => ({
    orders:state.orders
})

const mapActionsToProps = {
    setDeliveredOrders
}

export default connect(mapStateToProps,mapActionsToProps)(Delivered);