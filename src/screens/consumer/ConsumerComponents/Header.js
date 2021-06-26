import * as React from 'react';
import { View, Text,Dimensions } from 'react-native';

const {height,width} = Dimensions.get('window')

function Header(props) {
    return (
        <View style={{height: props.height,borderBottomLeftRadius:9,borderBottomRightRadius:9,elevation:5,width: props.width,backgroundColor:props.backgroundColor,justifyContent:'center',paddingLeft:15}}>
            <Text style={{color:'white',fontSize:22,fontFamily: "Montserrat-Bold"}}>{props.header}</Text>
        </View>
    )
}

export default Header