import * as React from 'react';
import { View, Text,Dimensions,AsyncStorage,ActivityIndicator,TouchableWithoutFeedback,ScrollView,Image,FlatList,StatusBar, TouchableOpacity } from 'react-native';
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
import { setLocation } from '../../redux/consumer/actions/latlngactions';

const {height,width} = Dimensions.get('window')

function AllAddress(props) {

    const [all,setAll] = React.useState([])
    const [loading,setLoading] = React.useState(true)
    const [si,setSi] = React.useState(0);
    const [consumer,setConsumer] = React.useState([])
    const [lb,setLb] = React.useState(false)
    const [sa,setSa] = React.useState([])

    const getAll = async() => {
        var userToken = await AsyncStorage.getItem('user_token')
        var consumer= jwtDecode(userToken)
        setConsumer(consumer)
        setSi(consumer.addressId)
        axios.get(`${url}/consumer/address`,{
            headers: {
               Authorization : `Bearer ${userToken}` 
            }
        }).then( res => {
            //console.log(res.data)
            setAll(res.data)
            setLoading(false)
        }).catch(err => {
            console.log(err)
            setLoading(false)
        })
    }

    React.useEffect(() => {
        getAll()
    },[])

    const onPressAdd = (index,item) => {
        setSi(index);
        setSa(item)
    }

    const changeAddress = async(address) => {
        setLb(true);
        var userToken = await AsyncStorage.getItem('user_token')
        var res = await axios.get(`${url}/consumer/address/update/${address.addressId}`,{
            headers: {
                Authorization : `Bearer ${userToken}` 
            }
        })
        console.log(res.data)
        var newAddress = {
            consumer_address:address.consumer_address,
            addressId:address.addressId,
            latitude:address.latitude,
            longitude:address.longitude,
            state:address.consumer_state
        }
        var resp = await axios.post(`${url}/consumer/changeAddress`,newAddress,{
            headers: {
                Authorization : `Bearer ${userToken}` 
            }
        })
        props.setLocation(address.latitude,address.longitude)
        console.log(resp.data)
        var a = jwtDecode(userToken)
        var b = jwtDecode(resp.data.token)
        console.log(jwtDecode(resp.data.token))
        await AsyncStorage.setItem('user_token',resp.data.token)
        setLb(false);
        props.navigation.pop();
    }

    const addNewAddress = (item) => {
        //var old = all;
        console.log(item);
        setLoading(true);
        setAll([item,...all]);
        setLoading(false);
    }

    React.useEffect(() => {
        console.log("Params Changed")
        console.log(props.route)
        if(props.route.params){
            console.log("HIIIIIII")
            addNewAddress(props.route.params.item)
        }
    },[props.route.params])

    return (
        <View style={{flex:1}}>
            <HeaderWithButton callback={() => props.navigation.push('addAddress')} backgroundColor='#ff6347' header='All Addresses' height={55} icon='plus' width={width} />
            {
                loading ?
                <View style={{backgroundColor:'white',flex:1,alignItems:'center',justifyContent:'center'}}>
                    <Image source={require('../../images/l2.gif')} resizeMode='contain' style={{width:width}} />
                </View>
                :
                <View style={{backgroundColor:'white',flex:1}}>
                    <FlatList
                    data={all}
                    renderItem={({item,index}) => (
                        <TouchableWithoutFeedback onPress={() => onPressAdd(item.addressId,item)}>
                            <View style={{padding:9,margin:9,borderWidth:0.5,borderRadius:7.5,backgroundColor:item.addressId===si ?'rgba(255,195,175,0.55)' : 'white'}}>
                                <View>
                                <View style={{flexDirection:'row'}}>
                                <Text style={{color:'black',fontSize:19,fontFamily:"Montserrat-Bold"}}>{item.address_name}</Text>
                                    <View style={{flex:1}}>
                                        </View>
                                        {
                                            item.addressId===consumer.addressId &&
                                            <Text style={{color:'#ff6347',fontSize:15,fontFamily:"Montserrat-Bold"}}>current</Text>
                                        }
                                    </View>
                                        <Text numberOfLines={3} style={{color:'black',fontSize:19,fontFamily:"Montserrat-Medium"}}>{item.consumer_address}</Text>
                                    <Text numberOfLines={3} style={{color:'black',fontSize:16.5,fontFamily:"Montserrat-Medium"}}>{item.consumer_state}</Text>
                                </View>
                            </View>
                        </TouchableWithoutFeedback>
                    ) }
                    />
                    <TouchableWithoutFeedback onPress={() => changeAddress(sa)}>
                        <View style={{marginBottom:5,padding:7.5,borderRadius:9,backgroundColor:'#ff6347',alignItems:'center',justifyContent:'center',marginLeft:9,marginRight:9}}>
                        {
                            !lb ?
                            <Text style={{color:'white',fontSize:19,fontFamily:"Montserrat-Medium"}}>Change Address</Text>
                            :
                            <ActivityIndicator color="white" size="large" />
                        }                       
                         </View>
                    </TouchableWithoutFeedback>
                </View>
            }
        </View>
    )
}

AllAddress.propTypes = {
    setLocation: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => ({
    latlng:state.latlng
})

const mapActionsToProps = {
    setLocation,
}

export default connect(mapStateToProps,mapActionsToProps)(AllAddress);