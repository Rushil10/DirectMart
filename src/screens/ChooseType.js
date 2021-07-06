import axios from 'axios';
import * as React from 'react';
import { View, Text,Button,FlatList,ActivityIndicator,Dimensions,Image } from 'react-native';
import StyleButton from '../components/Button';
import LinearGradient from 'react-native-linear-gradient';

const {height,width} = Dimensions.get('window')
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

function ChooseType(props) {
    return (
        <View style={{flex:1,backgroundColor:'white',alignItems:'center',justifyContent:'center'}}>
            <LinearGradient colors={['#43cea2', '#185a9d']} style={{flex:1,alignItems:'center',justifyContent:'center',width:windowWidth}}>
            <Text style={{fontSize:25,marginBottom:20 ,color:'white', fontFamily: "Montserrat-ExtraBold"}}>Describe Yourself ?
            </Text>
            <StyleButton image={<Image
                    style={{
                        height: windowHeight*0.19      ,
                        width: windowHeight*0.19,
                        borderRadius: windowHeight*0.38,
                        marginTop: 20
                    }}
                    source={require('../images/con2.jpg')}
                />} onPressButton={() => props.navigation.push("ConsumerSignin")} color='white' fontSize={25} height={height*0.3} width={height*0.3} borderRadius={200} title='Consumer' />
            <View style={{height:15}}>

            </View>
            <StyleButton image={<Image
                    style={{
                        height: windowHeight*0.19      ,
                        width: windowHeight*0.19,
                        marginTop: 20,
                        borderRadius: windowHeight*0.38,
                    }}
                    source={require('../images/icon1.png')}
                />} onPressButton={() => props.navigation.push("SellerSignin")} color='white' fontSize={25} height={height*0.3} width={height*0.3}  borderRadius={200} title='Shop Owner' />
            </LinearGradient>
        </View> 
    )
}

export default ChooseType;