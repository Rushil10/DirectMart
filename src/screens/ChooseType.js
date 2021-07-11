import axios from 'axios';
import * as React from 'react';
import { View, Text,Button,FlatList,ActivityIndicator,Dimensions,Image,StatusBar } from 'react-native';
import StyleButton from '../components/Button';
import LinearGradient from 'react-native-linear-gradient';

const {height,width} = Dimensions.get('window')
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

function ChooseType(props) {
    return (
        <View style={{flex:1,backgroundColor:'white',alignItems:'center',justifyContent:'center'}}>
            <StatusBar backgroundColor='black' />
            <LinearGradient colors={['#434343', '#000000']} style={{flex:1,alignItems:'center',justifyContent:'center',width:windowWidth}}>
            <Text style={{fontSize:width*0.059,marginBottom:20 ,color:'#ff9933', fontFamily: "Montserrat-ExtraBold"}}>Describe Yourself ?
            </Text>
            <StyleButton image={<Image
                    style={{
                        height: windowHeight*0.19      ,
                        width: windowHeight*0.19,
                        borderRadius: windowHeight*0.38,
                        marginTop: 20
                    }}
                    source={require('../images/con2.jpg')}
                />} onPressButton={() => props.navigation.push("ConsumerSignin")} color='#ff9933' fontSize={width*0.05} height={height*0.3} width={height*0.3} borderRadius={200} title='Consumer' />
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
                />} onPressButton={() => props.navigation.push("SellerSignin")} color='#ff9933' fontSize={width*0.05} height={height*0.3} width={height*0.3}  borderRadius={200} title='Shop Owner' />
            </LinearGradient>
        </View> 
    )
}

export default ChooseType;