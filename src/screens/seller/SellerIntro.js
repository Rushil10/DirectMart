import React from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import { StyleSheet, View ,Text,Image, Dimensions} from 'react-native';
import AppIntroSlider from 'react-native-app-intro-slider';
import LinearGradient from 'react-native-linear-gradient';

const {height,width} = Dimensions.get('window')

const slides = [
    {
      key: 1,
      title: 'Your Shop will be automatically appear on consumers in your 15 km range !',
      text: 'Keep Adding Products ! ',
      image: require('../../images/sh5.png'),
      backgroundColor: '#ff6347',
     /*  color1:'#fc575e',
      color2:'#f7b42c' */
      color1:'#b621fe',
      color2:'#1fd1f9'
    },
    {
        key: 2,
        title: 'Get Notified Whenever order gets placed on your shop !',
        text: 'Instant Notifications on orders !',
        image: require('../../images/n1.jpg'),
        backgroundColor: '#22bcb5',
        color1:'#0bab64',
        color2:'#3bb78f'
      },
    {
      key: 3,
      title: 'Increase your reach , Share your products and shop on whatsapp easily !',
      text: 'Consumer can view your shop and products easily ',
      image: require('../../images/th1.png'),
      backgroundColor: '#febe29',
      color1:'#20bf55',
      color2:'#01baef'
    },
  ];

function SellerIntro(props) {

    const _renderItem = ({ item }) => {
        return (
          <View style={{flex:1,backgroundColor:item.backgroundColor}}>
              <LinearGradient colors={[item.color1, item.color2]} style={{flex:1,width:width}}>
              <View style={{padding:9,alignItems:'center'}}>
              <Text style={{fontSize:29,marginBottom:15,marginTop:15,color:'white',fontFamily:"Montserrat-Bold"}}>{item.title}</Text>
              </View>
            <Image style={{width:width-25,resizeMode:'contain',alignSelf:'center',borderRadius:15,height:width}} source={item.image} />
            <Text style={{fontSize:25,padding:9,marginBottom:15,marginTop:15,color:'white',fontFamily:"Montserrat-Medium"}}>{item.text}</Text>
              </LinearGradient>
          </View>
        );
      }

    const _onDone = () => {
        //console.log('Done')
        props.navigation.reset({
            index: 0,
            routes: [{name: 'Seller'}],
        });
    }

    return (
        <AppIntroSlider renderItem={_renderItem} data={slides} onDone={_onDone}/>
    )
}

export default SellerIntro