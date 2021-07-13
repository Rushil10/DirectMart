import * as React from 'react';
import { View, Text, AsyncStorage,Dimensions,Image,FlatList,StatusBar,ActivityIndicator,ScrollView } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Header from './ConsumerComponents/Header';
import axios from 'axios';
import { url } from '../../api/api';
import ShopCard from '../../components/ShopCard';
import jwtDecode from 'jwt-decode';
import dayjs from 'dayjs';
import OrderSummaryProduct from './ConsumerComponents/OrderSummaryProduct';

const {height,width} = Dimensions.get('window')

function ConsumerOrderDetails(props) {

    const [loading,setLoading] = React.useState(true);
    const [data,setData] = React.useState([])
    const [token,setToken] = React.useState(null)
    const [user,setUser] = React.useState(null)

    const getOrderDetails = async() => {
        setLoading(true)
        const orderId = props.route.params.orderId
        console.log(orderId);
        var token = await AsyncStorage.getItem('user_token')
        var userDetails = jwtDecode(token);
        setUser(userDetails)
        console.log(userDetails)
        axios.get(`${url}/consumer/orders/${orderId}`,{
            headers:{
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${token}`
            }
        }).then(res => {
            console.log(res.data)
            setData(res.data);
            setLoading(false)
        }).catch(err => {
            console.log(err)
            setLoading(false);
        })
    }

    React.useEffect(() => {
        getOrderDetails();
        console.log(props.route.params)
    },[])

    return (
        <View style={{flex:1}}>
        {
            loading ?
            <View style={{backgroundColor:'white',flex:1,alignItems:'center',justifyContent:'center'}}>
                <ActivityIndicator color="#ff6347" size="large" />
            </View>
            :
            <ScrollView style={{flex:1,backgroundColor:'white',paddingLeft:5,paddingRight:5,paddingTop:15}}>
                <View style={{paddingLeft:15}}>
                    <Text style={{fontFamily: "Montserrat-ExtraBold",fontSize:22.5,color:'#ff6347'}}>ORDER SUMMARY</Text>
                </View>
                <View style={{paddingLeft:25,paddingTop:9}}>
                    <Text style={{fontSize:18,fontFamily: "Montserrat-Bold"}}>DELIVER TO</Text>
                    <Text style={{fontFamily: "Montserrat-Medium",fontSize:16.5}}>{user.consumer_name}</Text>
                    <Text style={{fontFamily: "Montserrat-Medium",fontSize:16.5}}>{props.route.params.item.consumer_address}</Text>
                </View>
                <View style={{paddingLeft:25,paddingTop:15}}>
                    <Text style={{fontSize:18,fontFamily: "Montserrat-Bold"}}>STATUS</Text>
                    <Text style={{fontFamily: "Montserrat-Medium",fontSize:15.5}}>DELIVERY STATUS</Text>
                    <View style={{flexDirection:'row',marginTop:1.5,marginBottom:1.5}}>
                        <View style={{backgroundColor:'#ff6347',alignItems:'center',paddingLeft:29,paddingRight:29,borderRadius:9,padding:2.5}}>
                        <Text style={{color:'white',fontSize:15}}>{props.route.params.status}</Text>
                            </View>
                        <View style={{flex:1}}>
                            </View>
                    </View>
                    <Text style={{fontFamily: "Montserrat-Medium",fontSize:15.5}}>PAYMENT</Text>
                    <View style={{flexDirection:'row',marginTop:1.5,marginBottom:1.5}}>
                        <View style={{backgroundColor:'#ff6347',alignItems:'center',paddingLeft:29,paddingRight:29,borderRadius:9,padding:2.5}}>
                        <Text style={{color:'white',fontSize:15,textTransform:'capitalize'}}>{props.route.params.item.payment_status}</Text>
                            </View>
                        <View style={{flex:1}}>
                            </View>
                    </View>
                </View>
                <View style={{paddingLeft:25,paddingTop:15}}>
                    <Text style={{fontSize:18,fontFamily: "Montserrat-Bold",marginBottom:9}}>ORDER</Text>
                    <FlatList
                    data={data}
                    renderItem={({item,index}) => <OrderSummaryProduct item={item} /> }
                    />
                </View>
                <View style={{paddingLeft:25,paddingTop:15,marginBottom:45}}>
                    <Text style={{fontSize:18,fontFamily: "Montserrat-Bold"}}>MORE DETAILS</Text>
                    <View style={{paddingLeft:15}}>
                    <Text style={{fontFamily: "Montserrat-Bold",fontSize:15.5,marginTop:5}}>ORDER ID</Text>
                    <Text style={{paddingLeft:9,fontFamily: "Montserrat-Medium",fontSize:16.5}}>{props.route.params.item.order_cart_id}</Text>
                    <Text style={{fontFamily: "Montserrat-Bold",fontSize:15.5,marginTop:5}}>PAYMENT TYPE</Text>
                    <Text style={{paddingLeft:9,fontFamily: "Montserrat-Medium",fontSize:16.5}}>{props.route.params.item.payment_mode}</Text>
                    <Text style={{fontFamily: "Montserrat-Bold",fontSize:15.5,marginTop:5}}>DATE AND TIME</Text>
                    <Text style={{paddingLeft:9,fontFamily: "Montserrat-Medium",fontSize:16.5}}>{dayjs(props.route.params.item.ordered_time).format('DD MMMM , dddd , h:m a')}</Text>
                    <Text style={{fontFamily: "Montserrat-Bold",fontSize:15.5,marginTop:5}}>SHOP CONTACT NUMBER</Text>
                    <Text style={{paddingLeft:9,fontFamily: "Montserrat-Medium",fontSize:16.5}}>{props.route.params.item.shop_contact}</Text>
                    <Text style={{fontFamily: "Montserrat-Bold",fontSize:15.5,marginTop:5}}>TOTAL ITEMS</Text>
                    <Text style={{paddingLeft:9,fontFamily: "Montserrat-Medium",fontSize:16.5}}>{props.route.params.item.total_items}</Text>
                    </View>
                </View>
            </ScrollView>
        }
    </View>
    )
}

export default ConsumerOrderDetails;