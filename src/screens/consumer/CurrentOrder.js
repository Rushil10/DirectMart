import * as React from 'react';
import { View, Text, AsyncStorage,Image,Dimensions,FlatList } from 'react-native';
import { setCurrentOrders } from '../../redux/consumer/actions/orders';
import PropTypes from 'prop-types';
import {connect} from 'react-redux'
import OrderCard from './ConsumerComponents/OrderCard';

const {height,width} = Dimensions.get('window')

function CurrentOrders(props) {

    const [loading,setLoading] = React.useState(true);
    const [orders,setOrders] = React.useState([])
    const [token,setToken] = React.useState(null)

    const getOrders = async() => {
        setLoading(true)
        var token = await AsyncStorage.getItem('user_token')
        setToken(token);
        await props.setCurrentOrders(token)
        await setOrders(props.orders.current)
        console.log(orders,'allOrders',props.orders.current)
        setLoading(false)
    }

    React.useEffect(() => {
        getOrders()
    },[])

    React.useEffect(() => {
        setLoading(true);
        setOrders(props.orders.current)
        setLoading(false);
    },[props.orders.current])

    return (
        <View style={{flex:1}}>
            {
                props.orders.currLoading ?
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
                    renderItem={({item,index}) => <OrderCard item={item} status="NOT DELIVERED" /> }
                    />
                    :
                    <View style={{flex:1,justifyContent:'center',alignItems:'center',padding:9}}>
                        <Image source={require('../../images/gifs/empty.gif')}
                 style={{
                    width:width*0.6,
                    height:width*0.6  ,
                    marginBottom: 20,
                }} 
                /> 
                        <Text style={{fontSize:25,color:'gray'}}>No Orders are Currently Placed</Text> 
                        </View>
                    }
                </View>
            }
        </View>
    )
}

CurrentOrders.propTypes = {
    setCurrentOrders:PropTypes.func.isRequired
}

const mapStateToProps = (state) => ({
    orders:state.orders
})

const mapActionsToProps = {
    setCurrentOrders
}

export default connect(mapStateToProps,mapActionsToProps)(CurrentOrders);