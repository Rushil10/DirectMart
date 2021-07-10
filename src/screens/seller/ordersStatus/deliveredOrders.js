import { View, Text, AsyncStorage,Image,Dimensions,FlatList, TouchableOpacity } from 'react-native';
import React from 'react';
import ListComponent from '../../../components/ListComponent';
import { fetchDOrders } from "../../../redux/seller/actions/ordersActions";
import { connect } from 'react-redux';

const {height,width} = Dimensions.get('window')

function deliveredOrders(props) {
    const [ data , setData ] = React.useState([]) 

    let fetchOrders = async () => {
        await props.fetchDOrders();
        // console.log(props.orders.DOrders); 
        setData(props.orders.DOrders)
    } 

    const renderItem = (item) => {
        return(
        <ListComponent item={item} navigation={() => {
            props.navigation.navigate("OrderDetails" , { item: item })
        }}/>
        )
    }

    React.useEffect(() => {
        setData(props.orders.DOrders)
    },[props.orders.DOrders])
 
    React.useEffect(() => {
        fetchOrders()
    },[])
    
        return(
            <View style={{flex: 1,backgroundColor: "white"}}>
                {data.length> 0 ? <FlatList
                    data={data}
                    renderItem={renderItem}
                /> : 
                
                <View style={{alignItems: "center" , marginTop: 20}}>
                <Text style={{fontSize: width*0.055 , fontFamily: "Montserrat-Bold"}}>No Delivered Order Found !!!</Text>

                <Image source={require('../../../images/gifs/empty.gif')}
                style={{
                   width:width*0.6,
                   height:width*0.6  ,
                   marginBottom: 20,
               }} 
               />
            <Text style={{fontSize: width*0.05 , fontFamily: "Montserrat" }}>No orders are Delivered </Text>
            <Text style={{fontSize: width*0.05 , fontFamily: "Montserrat" , marginHorizontal: 50}}>Customers are waiting </Text>


               </View>
               }
            </View> 
            
        )
}

const mapStateToProps = (state) => {
    return{
        orders : state.sorders
    }
}

const mapDispatchToProps = { 
    fetchDOrders
}

export default connect(mapStateToProps , mapDispatchToProps)(deliveredOrders);