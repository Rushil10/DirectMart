import * as React from 'react';
import axios from 'axios';
import { View, Text, Alert,Dimensions , TouchableOpacity , ActivityIndicator , FlatList , StyleSheet ,Image } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux'; 
import { fetchOrders , orderReadyForDelivery , orderDelivered } from '../redux/seller/actions/ordersActions';
import dayjs from 'dayjs';

const {height,width} = Dimensions.get('window')

function ListComponent({item , navigation , fetchOrders , orderReadyForDelivery , orderDelivered }) {

    const [loading , setLoading] = React.useState(false);

    const orderReadyForDeliveryAlert = () =>
    Alert.alert(
      "Order Ready ?",
      "Are you sure that the Order of " + item.item.consumer_name + " is ready for delivery",
      [
        {
          text: "No",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        { text: "Yes", onPress: async () => {
            setLoading(true)
            console.log("Yes");
            await orderReadyForDelivery(item.item);
            setTimeout(function(){ 
                setLoading(false)
             }, 3000);
        } }
      ]
    );

    const orderDeliveredAlert = () =>
    Alert.alert(
      "Order Delivered ?",
      "Are you sure that the Order of " + item.item.consumer_name + " is delivered",
      [
        {
          text: "No",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        { text: "Yes", onPress: async () => {
            setLoading(true)
            await orderDelivered(item.item);
            setTimeout(function(){ 
                setLoading(false)
             }, 3000);
        } }
      ]
    );

    const DeliveredAlert = () =>
    Alert.alert(
      "Order Delivered ?",
      "This Order of " + item.item.consumer_name + " is already delivered",
    );
    // console.log(item);
    return(

        loading ? <View style={{backgroundColor:'white',flex:1,alignItems:'center',justifyContent:'center'}}>
                    <Image source={require('../../assets/loader/1490.gif')} resizeMode='contain' style={{width:width , height: height*0.25}} />
                </View> : 

        <View>
            <TouchableOpacity onPress={navigation}>
            
                <View style={styles.renderItem}>
                    <View style={styles.upper}>
                        <View style={{flexDirection : "row"}}>
                            <Image
                                style={{height: height*0.065 , width: width*0.13 , marginLeft: 10}}
                                source={require('../images/user.png')}
                            />
                            <View style={[{flexDirection: "column" ,justifyContent: "center" , marginLeft: 5}]}>
                                <Text style={styles.text}>{item.item.consumer_name}</Text>
                                <Text style={styles.text}>{item.item.consumer_contact}</Text>
                            </View>
                            
                            <View style={{justifyContent: "center" , marginLeft: width*0.28}}>
                                <Text style={{fontFamily: "Montserrat-ExtraBold"}}>Price: {item.item.tota}</Text>
                            </View>
                        </View>
                    </View>
                    <View style={styles.mid}>
                        <View style={{justifyContent: "center" , marginLeft: 10}}>
                            <View style={{marginBottom: 5}}> 

                            <Text style={styles.text}>STATUS : {item.item.delivery_status}</Text>
                            </View>
                            <Text style={styles.text}>PAYMENT : {item.item.payment_status}</Text>
                        </View>
                    </View>
                    <View style={styles.bottom}>
                        <View style={{justifyContent: "center" , marginLeft: 10}}>
                            <Text style={styles.text}>ORDERED ON</Text>
                        </View>
                            <Text style={styles.text}>{dayjs(item.item.ordered_time).format('DD MMMM , dddd , h:m a')}</Text>
                    </View>

                    <TouchableOpacity style={{alignItems: "center" , marginBottom: 10}} onPress={() => {
                        if(item.item.delivery_status == "pending")
                        orderReadyForDeliveryAlert()
                        else if(item.item.delivery_status == "Out For Delivery")
                        orderDeliveredAlert()
                        else if(item.item.delivery_status == "Delivered")
                        DeliveredAlert()
                    }}>
                        <View style={styles.order}>
                            <Text style={[styles.text , {color: "white"}]}>
                                {item.item.delivery_status == "pending" ? "Order Ready For Delivery/Pickup" :  item.item.delivery_status == "Out For Delivery" ? "Click if Order is Delivered" : "Delivered" }
                            </Text>
                        </View>
                    </TouchableOpacity>

                </View> 
            </TouchableOpacity> 
        </View> 
        )
}

const styles = StyleSheet.create({
    renderItem: {
        flex: 1,
        height: height*0.38 , 
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
        fontFamily: "Montserrat-Bold"
    },
    mid: {
        flex: 0.3,
        flexDirection: "row",
        borderRadius: 20
    },
    bottom: {
        flex: 0.3,
        justifyContent: "center",
        alignItems: "center"
    },
    order: {
        height: height*0.06 , 
        borderRadius: 20,
        width: width*0.65 , 
        backgroundColor: "red",
        justifyContent: "center",
        alignItems: "center"
    }
  });

  const mapStateToProps = (state) => {
    return{
        orders : state
    }
}

const mapDispatchToProps = { 
  fetchOrders,
  orderReadyForDelivery,
  orderDelivered
}

export default connect(mapStateToProps , mapDispatchToProps)(ListComponent);