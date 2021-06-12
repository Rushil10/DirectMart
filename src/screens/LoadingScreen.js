import jwtDecode from 'jwt-decode';
import * as React from 'react';
import { View,Image, Text,AsyncStorage ,Dimensions} from 'react-native';
import PropTypes from 'prop-types';
import {connect} from 'react-redux'
import { setLocation } from '../redux/consumer/actions/latlngactions';
import { setCartProducts } from '../redux/consumer/actions/cartActions';

const {height,width} = Dimensions.get('window')

function LoadingScreen(props) {

    const check = async() => {
        var user_token = await AsyncStorage.getItem('user_token')
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
            return props.navigation.reset({
                index: 0,
                routes: [{name: 'Consumer'}],
            });
        }
        //for shop add redux settlement

        // var shop_token = await AsyncStorage.getItem('shop_token')
        // if(shop_token!==null){
        //     var decode = jwtDecode(user_token);
        //     return props.navigation.reset({
        //         index: 0,
        //         routes: [{name: 'seller'}],
        //     });
        // }


        props.navigation.replace("ChooseType")
    }

    React.useEffect(() => {
        //Check if user is logged in using a token
        //props.navigation.replace("MainNav",{screen:'Main',screen:'Home'})
        setTimeout(() => {
            check()
        }, 1500);
    },[])

    return (
        <View style={{alignItems:'center'}}>
            <Image source={require('../images/si.gif')} style={{height:width,width:width,resizeMode:'contain'}}/>
            <Image source={require('../images/giphy.gif')} style={{height:width+25,width:width}}/>
        </View>
    )
}

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