import * as React from 'react';
import axios from 'axios';
import { View, Text, AsyncStorage,Dimensions , TouchableWithoutFeedback , ActivityIndicator , FlatList , StyleSheet ,Image } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Header from '../consumer/ConsumerComponents/Header';
import { url } from '../../api/api';
import ListComponent from '../../components/ListComponent'
import { fetchOrders , orderReadyForDelivery } from '../../redux/seller/actions/ordersActions';
import { Linking } from 'react-native';
import VersionCheck from 'react-native-version-check';
import Share from 'react-native-share'
import AntDesign from 'react-native-vector-icons/AntDesign';



const {height,width} = Dimensions.get('window')

function SellerScreen(props) {
 
    const [t,setT] = React.useState('') 
    const [products , setProducts] = React.useState([]);
    const [loading , setLoading] = React.useState(false);
    const [shareLoading,setShareLoading] = React.useState(false)
    const [info , setInfo] = React.useState([]);




    const shareHandler = () => {
        let img = ""
        var name = info.shop_name.toString()
        console.log(name)
        var k = name.split(' ')
        console.log(k)
        setShareLoading(true);
        ImgToBase64.getBase64String(info.shop_image)
        .then(base64String => {
         img = 'data:image/jpeg;base64,' + base64String
         Share.open({
            title:`Share My Shop ${info.shop_name}`,
            message:`Checkout products of my shop ${info.shop_name} on localapp by clicking on this link https://www.localapp.in/shop/${k[0]}/${info.shop_id} \n\n If you have not installed the app install it from playstore by this link `,
            url:img
        }
        ).then((res) => {
            console.log(res)
            setShareLoading(false)
        }).catch((err) => {
            console.log(err)
            setShareLoading(false)
        })
        })
    }

    const getToken = async () => {
        const value = await AsyncStorage.getItem('shop_token');
        setT(value);
    }

    const createTwoButtonAlert = (res) =>
    Alert.alert(
        "Update Available",
        "New Version of App is available",
        [
            {
                text: "Cancel",
                onPress: () => console.log("Cancel Pressed"),
                style: "cancel"
            },
            { text: "Update", onPress: () => Linking.openURL(res.storeUrl) }
        ],
        { cancelable: true }
    );

    const getDetails = async () => {
        var token = await AsyncStorage.getItem('shop_token');
        var decode = jwtDecode(token);
        setInfo(decode);
        console.log(decode)
    }

    React.useEffect(() => {
        setLoading(true) 
        VersionCheck.needUpdate()
            .then(async res => {
                //createTwoButtonAlert(res)
                if (res.isNeeded) {
                    createTwoButtonAlert(res);  // open store if update is needed.
                }
        });
        getToken();
        getDetails()
        fetchProducts();
        setLoading(false)
    },[])

    React.useEffect(() => {
        setLoading(true) 
        setProducts(props.orders.sorders.orders)
        setLoading(false)
    },[props.orders.sorders.orders])


    const fetchProducts = async() => {
        console.log("HERE 11");
        var token = await AsyncStorage.getItem('shop_token');
        await props.fetchOrders(token);
        console.log("after redux");
        // console.log(props.orders.sorders.orders);
        await setProducts(props.orders.sorders.orders)
    }

    const renderItem = (item) => {
        return(
        <ListComponent item={item} navigation={() => { 
            props.navigation.navigate("OrderDetails" , { item: item })
        }} />
        )
    }

    const reload = () => {
        setLoading(true) 
        props.fetchOrders
        setTimeout(function(){ 
            setLoading(false)
         }, 3000);
    }

    return (
        <View style={{flex:1 , backgroundColor: "white"}}>
            <Header style={{ color: "white" , fontFamily: "Montserrat-ExtraBold" , fontSize: height*0.02}} backgroundColor='#0ae38c' header='New Orders' height={55} width={width} refreshFunction={reload} />
            {loading ? <View style={{backgroundColor:'white',flex:1,alignItems:'center',justifyContent:'center'}}>               
                <Image source={require('../../../assets/loader/1490.gif')} resizeMode='contain' style={{width:width}} />
                </View>  :
            products.length> 0 ?  
                <View style={{alignItems: "center" , marginBottom : 60}}>
                <FlatList 
                data={products}
                renderItem={renderItem}
                keyExtractor={item => item.order_cart_id}
                />
                </View>
            
            
            :  <View style={{alignItems: "center" , marginTop: 20}}>
            <Text style={{fontSize: width*0.055 , fontFamily: "Montserrat-Bold"}}>No Recent Orders Found !!!</Text>
                <Image source={require('../../images/gifs/empty.gif')}
                 style={{
                    width:width*0.6,
                    height:width*0.6  ,
                    marginBottom: 20,
                }} 
                /> 
                <Text style={{fontSize: width*0.05 , fontFamily: "Montserrat"}}>Try to refresh your orders screen</Text>
                <Text style={{fontSize: width*0.05 , fontFamily: "Montserrat"}}>OR</Text>
                <View style={{padding:9}}>
                <TouchableWithoutFeedback onPress={shareHandler}>
                    <View style={{paddingVertical:9,backgroundColor:'#ff616d',borderRadius:9}}>
                        {
                            !shareLoading
                            ?
                            <View style={{width: width*0.8 ,paddingVertical:0,alignItems:'center',borderRadius:9,flexDirection:'row',justifyContent:'center',backgroundColor:'#ff616d'}}>
                                <AntDesign name='sharealt' size={29} color='white' />
                        <Text style={{color:'white',fontSize:19,marginLeft:15}}>Share Your Shop {info.shop_name}</Text>
                                </View>
                        :
                        <ActivityIndicator color='white' size={29} />
                        }
                    </View>
                </TouchableWithoutFeedback>

            </View>
                <Text style={{fontSize: width*0.05 , fontFamily: "Montserrat" , marginHorizontal: 50}}>Share your shop via app to your customers to increase your buissness</Text>


                
                </View>
                
            }
            
            
        </View>
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
        fontFamily: "Montserrat-Bold"
    },
    mid: {
        flex: 0.3, 
        flexDirection: "row",
        borderRadius: 20
    },
    bottom: {
        flex: 0.4,
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
    orderReadyForDelivery
  }

export default connect(mapStateToProps , mapDispatchToProps)(SellerScreen);