import * as React from 'react';
import axios from 'axios';
import { View, Text, AsyncStorage,Dimensions , TouchableOpacity , ActivityIndicator , FlatList , StyleSheet ,Image , ScrollView , Alert} from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Header from '../consumer/ConsumerComponents/Header';
import { url } from '../../api/api';
import ListComponent from '../../components/ListComponent'
import { fetchOrders , orderReadyForDelivery , orderDelivered } from '../../redux/seller/actions/ordersActions';
import FastImage from 'react-native-fast-image';


const {height,width} = Dimensions.get('window')

function OrderDetails(props) {

const [loading , setLoading] = React.useState(false);
const [data , setData] = React.useState([]);
const [orders , setOrders] = React.useState([]);

const orderReadyForDeliveryAlert = (data) =>
    Alert.alert(
      "Order Ready ?",
      "Are you sure that the Order of " + data.consumer_name + " is ready for delivery",
      [
        {
          text: "No",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        { text: "Yes", onPress: async () => {
            setLoading(true)
            console.log("Yes");
            console.log(data);
            console.log(props);
            props.orderReadyForDelivery(data);
            setTimeout(function(){ 
                setLoading(false)
             }, 3000);
        } }
      ]
    );

    const orderDeliveredAlert = (data) =>
    Alert.alert(
      "Order Delivered ?",
      "Are you sure that the Order of " + data.consumer_name + " is delivered",
      [
        {
          text: "No",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        { text: "Yes", onPress: async () => {
            setLoading(true)
            props.orderDelivered(data);
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

const OrderDetails =async (DATA) => {
    setLoading(true)
    console.log(DATA);
    var token = await AsyncStorage.getItem('shop_token');
    console.log("ALL THE DETAILS");
    console.log(token);
    axios.get(`${url}/shop/orders/${DATA.order_cart_id}`,{
        headers: {
            'Content-Type': 'application/json',
            "Authorization": `Bearer ${token}`
        }
    }).then(res => {
        console.log(":::::::::::::::::");
        console.log("LMAO");
        setOrders(res.data);
        console.log(res.data)
        console.log(":::::::::::::::::");
    }).catch(err => {
        console.log(err)
    })

    setLoading(false)
}

React.useEffect(() => {
    // setLoading(true);
    console.log("STARTING HERE");
    console.log(props.route.params.item.item);
    setData(props.route.params.item.item);
    console.log("data here" , data);
    OrderDetails(props.route.params.item.item);
    // setLoading(fal);
}, [])
const renderItem = ({item}) => {

    return(
        <View style={{flexDirection: "row" , marginTop: 10 , justifyContent: "space-between" , marginRight: width*0.1}}>


                    <View style={{marginLeft: 15 , flexDirection: "row"}}>
                        <View>
                            <FastImage 
                                source={{uri : item.product_image[0]}}
                                style= {{height: 40 , width: 40 , marginRight: 10}}
                            />
                        </View>
                        <View>
                        <Text style={{fontFamily: "Montserrat" , fontSize: width*0.04 ,}}>{item.product_name}</Text>
                        <Text style={{fontFamily: "Montserrat" , fontSize: width*0.04 , marginLeft: 5}}>{item.product_price} X {item.quantity}</Text>
                        </View>
                    </View>

                    <View style={{}}>
                        <Text style={{fontFamily: "Montserrat" , fontSize: width*0.04 ,}}>
                        {item.total}
                        </Text>
                    </View>
                    
                </View> 
    )
}


    return (
        <ScrollView style={{flex: 1 , backgroundColor: "white"}}>
            <Text style={{marginLeft : width*0.05 , fontFamily: "Montserrat-ExtraBold" , fontSize: width*0.06 , marginTop: height*0.05 , color: "#0ae38c"}}>ORDER SUMMARY</Text>
            
            <View style={{marginLeft: width*0.08 , marginTop: height*0.01}}>
                <Text style={{fontFamily: "Montserrat-ExtraBold" , fontSize: width*0.05 }}>DELIVER TO</Text>   
                <View style={{marginTop: 5}}>
                <Text style={{fontFamily: "Montserrat-Bold" , fontSize: width*0.04 , marginLeft: 5 }}>{data.consumer_name}</Text> 
                <Text style={{fontFamily: "Montserrat-Bold" , fontSize: width*0.04 , marginLeft: 5  }}>{data.consumer_address}</Text>   
                </View>
            </View>

            <View style={{marginLeft: width*0.08 , marginTop: height*0.04}}>
                <Text style={{fontFamily: "Montserrat-ExtraBold" , fontSize: width*0.05 }}>STATUS</Text> 

                <View style={{justifyContent: "center"}}>
                            <View style={{marginTop: 5 , marginLeft: 5  }}>

                            <Text style={{fontFamily: "Montserrat-Bold" , fontSize: width*0.04}}>STATUS</Text>
                            <View style={{backgroundColor: "#0ae38c" ,width: width*0.5 , alignItems: "center"}}>
                             <Text style={{color :"white" , fontSize: width*0.04, marginLeft: 5 , fontFamily: "Montserrat-Bold"}}>{data.delivery_status}</Text>
                            </View>
                            <Text style={{fontFamily: "Montserrat-Bold" , fontSize: width*0.04}}>PAYMENT</Text>
                            <View style={{backgroundColor: "#0ae38c" ,width: width*0.5 , alignItems: "center"}}>
                             <Text style={{color :"white" , fontSize: width*0.04, marginLeft: 5 ,fontFamily: "Montserrat-Bold" }}>{data.payment_status}</Text>
                            </View>
                            </View> 
                </View> 
            </View>

            <TouchableOpacity style={{alignItems: "center" , marginTop: 20}} onPress={() => {
                        if(data.delivery_status == "pending")
                        orderReadyForDeliveryAlert(data)
                        else if(data.delivery_status == "Out For Delivery")
                        orderDeliveredAlert(data)
                        else if(data.delivery_status == "Delivered")
                        DeliveredAlert()
                    }}>
                        <View style={styles.order}>
                            <Text style={[styles.text , {color: "white"}]}>
                                {data.delivery_status == "pending" ? "Order Ready For Delivery/Pickup" :  data.delivery_status == "Out For Delivery" ? "Click if Order is Delivered" : "Delivered" }
                            </Text>
                        </View>
                    </TouchableOpacity>

            <View style={{marginLeft: width*0.08 , marginTop: height*0.04}}>
                <Text style={{fontFamily: "Montserrat-ExtraBold" , fontSize: width*0.05 }}>ORDER</Text> 

                {!loading ? <FlatList
                    data={orders}
                    renderItem={renderItem}
                    keyExtractor={item => item.product_id}
                /> : <ActivityIndicator size="large" color="#00ff00" /> }                
            </View>
 
            <View style={{alignItems: "center" , marginTop: 20}}>
                <View style={{backgroundColor: "#0ae38c" ,width: width*0.8 ,alignItems: "center" , justifyContent: "center" , flexDirection: "row" , justifyContent: "space-between"}}>
                  <Text style={{color :"white" , fontSize: width*0.05, marginLeft: 5 , fontFamily: "Montserrat-Bold"}}>GRAND TOTAL</Text>
                  <Text style={{color :"white" , fontSize: width*0.05, marginRight: 5 , fontFamily: "Montserrat-Bold"}}>₹ {data.order_cart_total}</Text>
                </View>
            </View>

            <View style={{marginLeft: width*0.1}}>
              <Text style={{fontFamily: "Montserrat-ExtraBold" , fontSize: width*0.05 ,marginTop: 20 }}>MORE DETAILS</Text> 
              <View style={{marginTop: 5}}>
                <Text style={{fontFamily: "Montserrat-Bold" , fontSize: width*0.04 , marginLeft: 5 }}>ORDER ID</Text> 
                <Text style={{fontFamily: "Montserrat" , fontSize: width*0.04 , marginLeft: 15 }}>{data.order_cart_id}</Text> 
                <Text style={{fontFamily: "Montserrat-Bold" , fontSize: width*0.04 , marginLeft: 5 , marginTop: 3 }}>PAYMENT TYPE</Text> 
                <Text style={{fontFamily: "Montserrat" , fontSize: width*0.04 , marginLeft: 15 }}>{data.payment_mode}</Text> 
                <Text style={{fontFamily: "Montserrat-Bold" , fontSize: width*0.04 , marginLeft: 5 , marginTop: 3}}>DATE AND TIME</Text> 
                <Text style={{fontFamily: "Montserrat" , fontSize: width*0.04 , marginLeft: 15 }}>{data.ordered_time}</Text> 
                <Text style={{fontFamily: "Montserrat-Bold" , fontSize: width*0.04 , marginLeft: 5 , marginTop: 3 }}>CONTACT NUMBER</Text> 
                <Text style={{fontFamily: "Montserrat" , fontSize: width*0.04 , marginLeft: 15 }}>{data.consumer_contact}</Text> 
              </View>


            </View>

        </ScrollView>
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
        width: width*0.8 , 
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

export default connect(mapStateToProps , mapDispatchToProps)(OrderDetails);