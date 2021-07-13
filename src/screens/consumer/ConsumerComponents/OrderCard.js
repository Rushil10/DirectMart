import * as React from 'react';
import axios from 'axios'
import { View, Text, AsyncStorage,Dimensions,Image ,StyleSheet,TouchableOpacity,TouchableWithoutFeedback} from 'react-native';
import Icon from 'react-native-vector-icons/Feather'
import { useNavigation } from '@react-navigation/native';
import { url } from '../../../api/api';
import { addToCart , removeFromCart} from '../../../redux/consumer/actions/cartActions';
import PropTypes from 'prop-types';
import {connect} from 'react-redux'
import dayjs from 'dayjs';

const {height,width} = Dimensions.get('window')

function OrderCard(props){

    const navigation = useNavigation();

    var relativeTime = require('dayjs/plugin/relativeTime')
    dayjs.extend(relativeTime)

    return (
        <TouchableWithoutFeedback onPress={() => navigation.push('orderDetails',{orderId:props.item.order_cart_id,status:props.status,item:props.item})}>
            <View style={{paddingLeft:15,paddingTop:15,paddingBottom:15,paddingRight:15,borderRadius:10.5,borderColor:'#ff6347',borderWidth:1,marginTop:9,marginBottom:5}}>
            <View style={{flexDirection : "row"}}>
                <Image
                    style={{height: width*0.125 , width: width*0.125}}
                    source={require('../../../images/user.png')}
                />

                <View style={[{flexDirection: "column" ,justifyContent: "center" , marginLeft: 9,flex:1,paddingTop:0}]}>
                    <Text style={styles.text}>{props.item.shop_name}</Text>
                    <View style={{flexDirection:'row',paddingTop:2.5,alignItems:'center'}}>
                    <Icon color="#ff6437" name='phone-call' size={16.5} style={{marginRight:9}}/>
                    <Text style={{fontSize:14,fontFamily: "Montserrat-Medium"}}>{props.item.shop_contact}</Text>
                    </View>
                </View>
                
                <View style={{justifyContent: "center" }}>
                    <Text style={{fontFamily: "Montserrat-Bold",paddingRight:9,fontSize:16}}>Rs {props.item.order_cart_total}</Text>
                </View>
            </View>
            <View style={{paddingTop:15,paddingBottom:15}}>
                <View>
                    <Text style={{fontSize:15,fontFamily:"Montserrat-Bold"}}>STATUS : {props.status}</Text>
                </View>
                <View style={{marginTop:5}}>
                    <Text style={{fontSize:15,fontFamily:"Montserrat-Bold"}}>PAYMENT : {props.item.payment_status}</Text>
                </View>
                <View style={{marginTop:5}}>
                    <Text style={{fontSize:15,fontFamily:"Montserrat-Bold"}}>ITEMS : {props.item.total_items}</Text>
                </View>
            </View>
            <View style={styles.bottom}>
                <View style={{justifyContent: "center" , marginLeft: 0}}>
                    <Text style={styles.text}>ORDERED ON</Text>
                </View>
                    <Text style={styles.text}>{dayjs(props.item.ordered_time).format('DD MMMM')}</Text>
            </View>
        </View>
        </TouchableWithoutFeedback>
    )
}

const styles = StyleSheet.create({
    renderItem: {
        flex: 1,
        height: height*0.28 , 
        width: width*0.95 ,  
        margin: 8 , 
        backgroundColor: "white",
        borderRadius: 20 ,
        borderWidth: 1.5 , 
        borderColor: "#0ae38c" 
    },
    upper: {
        flex: 0.3,
        // backgroundColor: "orange",
        borderRadius: 20,
        justifyContent: "center"
    },
    text: {
        fontFamily: "Montserrat-Bold",
        fontSize: 15,
    },
    mid: {
        flexDirection: "row",
    },
    bottom: {
        flex: 0.4,
        justifyContent: "center",
        alignItems: "center"
    }
  });

export default OrderCard