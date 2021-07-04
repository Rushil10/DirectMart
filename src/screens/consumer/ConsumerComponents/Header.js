import * as React from 'react';
import { View, Text,Dimensions, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';

const {height,width} = Dimensions.get('window')

function Header(props) {
    return (
        <View style={{ height: props.height,borderBottomLeftRadius:9,borderBottomRightRadius:9,elevation:5,width: props.width,backgroundColor:props.backgroundColor,justifyContent:'center',paddingLeft:15}}>
            <View style={{flexDirection: "row" , justifyContent: "space-between"}}>
            <Text style={{color:'white',fontSize:22,fontFamily: "Montserrat-Bold"}}>{props.header}</Text>
            {props.header == "New Orders" ?<TouchableOpacity onPress={props.refreshFunction} style={{marginRight: 20}}>
            <Icon name="sync" color={"white"} size={23} />
            </TouchableOpacity>  : <View />}
            </View>
            
        </View>
    )
}

export default Header