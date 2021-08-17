import * as React from 'react';
import axios from 'axios'
import { View, Text, AsyncStorage,Dimensions,Image ,TouchableOpacity,TouchableWithoutFeedback} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'
import { useNavigation } from '@react-navigation/native';
import { url } from '../../../api/api';
import { addToCart , removeFromCart} from '../../../redux/consumer/actions/cartActions';
import PropTypes from 'prop-types';
import {connect} from 'react-redux'
import FastImage from 'react-native-fast-image';

const {height,width} = Dimensions.get('window')

function ProductCardForDisplay({item}) {
    const navigation = useNavigation();
    
    return (
        <TouchableWithoutFeedback onPress={() => navigation.push('ProductDetailsDisplay',{product:item})}>
            <View style={{marginLeft:7.5,marginRight:7.5,padding:15,borderBottomWidth:0.5,marginBottom:5,borderColor:'#101010'}}>
            <View style={{flexDirection:'row'}}>
                <FastImage source={{uri:item.product_image[0]}} resizeMode='contain' style={{height:width/3.25,width:width/3.25,borderRadius:15,marginRight:15}} />
                <View style={{paddingTop:9,flex:1}}>
                    <Text numberOfLines={2} style={{fontSize:21,color:'#101010',fontFamily:'Montserrat-medium',textTransform:'capitalize'}}>{item.product_name}</Text>
                    <Text style={{fontSize:16.5,marginLeft:0,paddingTop:5,textTransform:'capitalize'}}>Price Rs: {item.product_price}</Text>
                    <Text style={{fontSize:16.5,marginLeft:0,paddingTop:5,textTransform:'capitalize'}}>{item.product_type}</Text>
                </View>
            </View>
            </View>
        </TouchableWithoutFeedback>
    )
}

export default ProductCardForDisplay;