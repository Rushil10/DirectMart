import axios from 'axios';
import * as React from 'react';
import { View,TouchableOpacity, Text,Dimensions,FlatList,ActivityIndicator } from 'react-native';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

function StyleButton(props) {
    return (
        <TouchableOpacity onPress={props.onPressButton} style={{height:props.height,alignItems:'center',justifyContent:'center',width:props.width,borderRadius:props.borderRadius,backgroundColor:props.backgroundColor}}>
            {props.image ? props.image : <View />}
            <Text style={{color:props.color,fontSize:props.fontSize ,marginTop: 10 , fontFamily: "Montserrat-ExtraBold"}}>{props.title}</Text>
        </TouchableOpacity>
    )
}

export default StyleButton;