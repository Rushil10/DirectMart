import React from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import { StyleSheet, View ,Text,Image, Dimensions} from 'react-native';
import AppIntroSlider from 'react-native-app-intro-slider';
import LinearGradient from 'react-native-linear-gradient';

const {height,width} = Dimensions.get('window')

const slides = [
    {
      key: 1,
      title: 'Discover Local Business And Shops In Your 15km Range !',
      text: 'Order From these Shops and help promote local businesses ',
      image: require('../../images/l3.jpg'),
      backgroundColor: '#ff6347',
     /*  color1:'#fc575e',
      color2:'#f7b42c' */
      color1:'#fe5858',
      color2:'#ee9617'
    },
    {
      key: 2,
      title: 'Add , Update and Remove products from your cart of different Shops !',
      text: '',
      image: require('../../images/c3.png'),
      backgroundColor: '#febe29',
      color1:'#fe5858',
      color2:'#ee9617'
    },
    {
      key: 3,
      title: 'Get Instantly Notified on Order Status Updates !',
      text: '',
      image: require('../../images/n1.jpg'),
      backgroundColor: '#22bcb5',
      color1:'#fc575e',
      color2:'#f7b42c'
    }
  ];

function ConsumerSlides(props) {

    const _renderItem = ({ item }) => {
        return (
          <View style={{flex:1,backgroundColor:item.backgroundColor}}>
              <LinearGradient colors={[item.color1, item.color2]} style={{flex:1,width:width}}>
              <View style={{padding:9,alignItems:'center'}}>
              <Text style={{fontSize:width*0.05,marginBottom:15,marginTop:15,color:'white',fontFamily:"Montserrat-Bold"}}>{item.title}</Text>
              </View>
            <Image style={{width:width-25,alignSelf:'center',borderRadius:15,height:width}} source={item.image} />
            <Text style={{fontSize:width*0.05,padding:9,marginBottom:15,marginTop:15,color:'white',fontFamily:"Montserrat-Medium"}}>{item.text}</Text>
              </LinearGradient>
          </View>
        );
      }

    const _onDone = () => {
        //console.log('Done')
        props.navigation.reset({
            index: 0,
            routes: [{name: 'Consumer'}],
        });
    }

    return (
        <AppIntroSlider renderItem={_renderItem} data={slides} onDone={_onDone}/>
    )
}

export default ConsumerSlides