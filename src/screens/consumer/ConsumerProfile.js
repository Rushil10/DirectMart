import * as React from 'react';
import { View, Text,Dimensions,Alert,AsyncStorage,ScrollView,Image,FlatList,StatusBar, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Header from './ConsumerComponents/Header';
import axios from 'axios';
import { url } from '../../api/api';
import ShopCard from '../../components/ShopCard';
import jwtDecode from 'jwt-decode';
import Icon from 'react-native-vector-icons/Feather'
import Icon2 from 'react-native-vector-icons/Ionicons'
import HeaderWithButton from './ConsumerComponents/HeaderWithButton';
import FastImage from 'react-native-fast-image';

const {height,width} = Dimensions.get('window')

function ConsumerProfile(props) {

    const [consumer,setConsumer] = React.useState([])
    const [loading,setLoading] = React.useState(true);

    const loadData = async() => {
        setLoading(true);
        var token = await AsyncStorage.getItem('user_token')
        var consumer = jwtDecode(token);
        console.log(consumer)
        setConsumer(consumer)
        setLoading(false);
    }

    React.useEffect(() => {
        loadData()
    },[])

    React.useEffect(() => {
        loadData()
    },[props.latlng])

    const logout = async() => {
        await AsyncStorage.removeItem('user_token')
        props.navigation.replace('ChooseType') 
    }

    const createTwoButtonAlert = () =>
    Alert.alert(
      "Confirm Logout",
      "You will logout from this account.",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        { text: "OK", onPress: logout }
      ]
    );

    return (
       <ScrollView style={{flex:1,backgroundColor:'white'}}>
           <HeaderWithButton callback={createTwoButtonAlert} icon="logout" backgroundColor='#ff6347' header='Profile' height={55} width={width} />
           {
                loading ?
                <View style={{backgroundColor:'white',height:height,flex:1,alignItems:'center',justifyContent:'center'}}>
                    <Image source={require('../../images/l2.gif')} resizeMode='contain' style={{width:width}} />
                </View>
                :
                <View style={{backgroundColor:'white',flex:1}}>
                   <View style={{paddingTop:15,alignItems:'center'}}>
                       <FastImage source={{uri:consumer.consumer_image}} style={{width:width/2,height:width/2,borderRadius:15}} />
                       <Text style={{fontSize:25,paddingTop:9,color:'black',fontFamily:"Montserrat-Medium"}}>{consumer.consumer_name}</Text>
                       <View style={{flexDirection:'row',alignItems:'center',marginTop:9}}>
                            <Icon name="phone-call" color="#ff6347" size={19} />
                            <Text style={{fontSize:19,marginLeft:5,color:'gray',fontFamily:"Montserrat-Medium"}}>{consumer.consumer_contact}</Text>
                       </View>
                       <View style={{flexDirection:'row',alignItems:'center',marginTop:9}}>
                            <Icon name="mail" color="#ff6347" size={21} />
                            <Text style={{fontSize:19,marginLeft:5,color:'gray',fontFamily:"Montserrat-Medium"}}>{consumer.consumer_email}</Text>
                       </View>
                   </View>
                   <View style={{padding:15,marginTop:5,backgroundColor:'white'}}>
                       <View style={{flexDirection:'row',alignItems:'center'}}>
                       <Icon name="home" color="#ff6347" size={22.5} />
                       <View>
                           <Text style={{fontSize:19,marginLeft:5,color:'black',fontFamily:"Montserrat-Medium"}}>Address</Text>
                       </View>
                       <View style={{flex:1}}>

                       </View>
                       <TouchableOpacity onPress={() => props.navigation.push('allAddress')}>
                           <Icon2 name="pencil-sharp" color="#ff6347" size={25} />
                       </TouchableOpacity>
                       </View>
                       <View style={{marginTop:5}}>
                           <Text  style={{fontSize:19,color:'gray',fontFamily:"Montserrat-Medium"}} numberOfLines={3}>{consumer.consumer_address}</Text>
                       </View> 
                   </View>
                </View>
            }
       </ScrollView>
    )
}

ConsumerProfile.propTypes = {
    latlng: PropTypes.object.isRequired,
}

const mapStateToProps = (state) => ({
    latlng:state.latlng
})

export default connect(mapStateToProps)(ConsumerProfile);