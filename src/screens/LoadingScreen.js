import jwtDecode from 'jwt-decode';
import * as React from 'react';
import { View,Image, Text,AsyncStorage ,Dimensions, Linking, Animated,StyleSheet, StatusBar} from 'react-native';
import PropTypes from 'prop-types';
import {connect} from 'react-redux'
import { setLocation } from '../redux/consumer/actions/latlngactions';
import { setCartProducts } from '../redux/consumer/actions/cartActions';
import { CommonActions } from "@react-navigation/native";
import LinearGradient from 'react-native-linear-gradient';
import { Easing } from 'react-native-reanimated';

const {height,width} = Dimensions.get('window')

function LoadingScreen(props) {

    const scalex = new Animated.Value(0)
    const scaley = new Animated.Value(0)

    const check = async() => {
        var user_token = await AsyncStorage.getItem('user_token')
        const url = await Linking.getInitialURL();
        console.log(url,'hmmmmmmmm')
        if(user_token!==null){
            console.log(user_token);
            var decode = jwtDecode(user_token);
            props.setCartProducts(user_token);
            if(decode.latitude){
                props.setLocation(decode.latitude,decode.longitude);
            } else {
                var latitude = await AsyncStorage.getItem('latitude');
                var longitude = await AsyncStorage.getItem('longitude');
                props.setLocation(latitude,longitude);
            }
            if(url){
                var ids = url.split('/')
                var id = ids[ids.length-1]
                var name= ids[ids.length-2]
                if(name==='product'){
                    console.log('here')
                    return props.navigation.dispatch({
                        ...CommonActions.reset({
                          index: 0,
                          routes: [{ name: "Consumer",
                        state:{
                            routes:[{
                                name:'shops',
                                state:{
                                    routes:[{
                                        name:'ProductDet',
                                        params:{
                                            product_id:id
                                        }
                                    }]
                                }
                            }]
                        } }]
                        })
                      });
                } else {
                    var shop = {
                        shop_id:id,
                        shop_name:name,
                    }
                    //return props.navigation.replace('Consumer',{screen:'shops',params:{screen:'allShops',params:{screen:'ShopProducts',params:{shop}}}})
                    return props.navigation.dispatch({
                        ...CommonActions.reset({
                          index: 0,
                          routes: [{ name: "Consumer",
                        state:{
                            routes:[{
                                name:'shops',
                                state:{
                                    routes:[{
                                        name:'ShopProducts',
                                        params:{
                                            shop:shop
                                        }
                                    }]
                                }
                            }]
                        } }]
                        })
                      });

                }
               /*  return props.navigation.reset({
                    index: 2,
                    routes: [{name: 'Consumer'},{name:'shops'}],
                }); */
            } else {
                return props.navigation.reset({
                    index: 0,
                    routes: [{name: 'Consumer'}],
                });
            }           
        }
        //for shop add redux settlement

        var shop_token = await AsyncStorage.getItem('shop_token')
        if(shop_token!==null){
            var decode = jwtDecode(shop_token);
            return props.navigation.reset({
                index: 0,
                routes: [{name: 'Seller'}],
            });
        }


        props.navigation.replace("ChooseType")
        //props.navigation.replace("ConsumerSlides")
    }

    React.useEffect(() => {
        //Check if user is logged in using a token
        //props.navigation.replace("MainNav",{screen:'Main',screen:'Home'})
        Animated.timing(scalex,{
            toValue:1,
            duration:2000,
           // easing:Easing.ease,
            useNativeDriver:true
        }).start()
        Animated.timing(scaley,{
            toValue:1,
            duration:2000,
            //easing:Easing.ease,
            useNativeDriver:true
        }).start()
        setTimeout(() => {
            check()
        }, 2500);
    },[])

    return (
        <View style={{alignItems:'center',flex:1}}>
            {/* <Image source={require('../images/si.gif')} style={{height:width,width:width,resizeMode:'contain'}}/>
            <Image source={require('../images/giphy.gif')} style={{height:width+25,width:width}}/> */}
            <StatusBar backgroundColor='black' />
            <LinearGradient colors={['#555555', '#000000']} style={{flex:1,width:width,justifyContent:'center',alignItems:'center'}}>
            <View style={{position:'absolute',top:15,alignSelf:'center'}}>
            <Text style={{fontSize:width*0.05,color:'white',fontFamily: "Montserrat-Medium",padding:15,paddingTop:19,paddingBottom:0,alignContent:'center',alignSelf:'center' }} >Local Shops And Small Business</Text>
                <Text style={{fontSize:width*0.05,color:'white',fontFamily: "Montserrat-Medium",padding:5,alignContent:'center',alignSelf:'center' }} >Need Your Support Now</Text>
                </View>
                <Animated.Image source={require('../images/2.png')} style={{
                    borderRadius:15,
                    marginBottom:0,
                    transform:[
                        {
                            scaleX:scalex.interpolate({
                                inputRange:[0,1],
                                outputRange:[0,0.75]
                            })
                        },
                        {
                            scaleY:scaley.interpolate({
                                inputRange:[0,1],
                                outputRange:[0,0.75]
                            })
                        }
                    ]
                }} />
                {/* <Text style={{fontSize:41,color:'white',fontFamily: "Montserrat-Bold" }}>DirectMart</Text> */}
                <View style={{position:'absolute',bottom:9,alignItems:'center'}}>
                    <View style={{flexDirection:'row',alignItems:'center'}}>
                        <Image source={require('../images/ind.jpg')} style={{height:29,width:45,marginRight:9,borderRadius:2.5}} />
                        <Text style={{fontSize:15,color:'white',fontFamily: "Montserrat-Medium"}}>Made In India with Love</Text>
                        </View>
                </View>
            </LinearGradient>
        </View>
    )
}

const styles = StyleSheet.create({
    logo: {
        width:125,
        height:125
    }
})

LoadingScreen.propTypes = {
    setLocation: PropTypes.func.isRequired,
    setCartProducts: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => ({
    latlng:state.latlng
})

const mapActionsToProps = {
    setLocation,
    setCartProducts
}

export default connect(mapStateToProps,mapActionsToProps)(LoadingScreen);