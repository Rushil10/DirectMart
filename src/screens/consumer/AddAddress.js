import axios from 'axios';
import * as React from 'react';
import { View,ScrollView,AsyncStorage,ImageBackground,TouchableOpacity, Text,Button,FlatList,ActivityIndicator,Platform,Dimensions,Image,TextInput,StyleSheet,KeyboardAvoidingView } from 'react-native';
import { Header } from '@react-navigation/stack';
import GetLocation from 'react-native-get-location'
import {url} from '../../api/api'
import PropTypes from 'prop-types';
import {connect} from 'react-redux'
import { setLocation } from '../../redux/consumer/actions/latlngactions';
import ErrorModal from './ConsumerComponents/ErrorModal';

const {height,width} = Dimensions.get('window')

function AddAddress(props) {
    console.log(props.route.params)
    const [flat,setFlat] = React.useState('');
    const [area,setArea] = React.useState('');
    const [landmark,setLandmark] = React.useState('');
    const [town,setTown] = React.useState('');
    const [latitude,setLatitude] = React.useState(null);
    const [longitude,setLongitude] = React.useState(null);
    const [cll,setCll] = React.useState(false);
    const [aname,setAname] = React.useState('Work')
    const [loading,setLoading] = React.useState(false);
    const [err,showErr] = React.useState(false);
    const [heading,setHeading] = React.useState('')
    const [error,setError] = React.useState('')

    const closeErr = () => {
        showErr(false)
    }

    const signup = async() => {
        setCll(true);
        GetLocation.getCurrentPosition({
            enableHighAccuracy: true,
            timeout: 15000,
        }).then(async(location) => {
            console.log(location);
            setLongitude(location.longitude)
            setLatitude(location.latitude)
            if(flat.length===0 || landmark.length===0 || area.length===0 || town.length===0 || aname.length===0){
                setHeading('Invalide Address')
            setError('Flat , Landmark , Area , Town and Name cannot be empty !')
            showErr(true)
            setCll(false);
            } else {
                await AsyncStorage.setItem('latitude',location.latitude.toString())
            await AsyncStorage.setItem('longitude',location.longitude.toString())
            addAddress(location.latitude,location.longitude)
            }
        })
        .catch(error => {
            const { code, message } = error;
            console.warn(code, message);
            setHeading('Location Unaccessible')
            setError('Please Turn On your location to setup your address and complete signup.\n\nWe require this location to locate shops in your 15 km range and this will be required only once during signup.\n\n Thank You')
            showErr(true)
            setCll(false);
        })
    }

    const addAddress = async(latitude,longitude) => {
        var address = flat + ' , ' + area + ' , ' + landmark + ' , ' + town;
        var newAddress = {
            address:address,
            state:town,
            pincode:town,
            latitude:latitude,
            longitude:longitude,
            name:aname
        }
        console.log(newAddress)
        var token = await AsyncStorage.getItem('user_token');
        console.log(token);
        axios.post(`${url}/consumer/address`,newAddress, {
        headers: {
            'Content-Type': 'application/json',
            "Authorization": `Bearer ${token}`
        }
        }).then(response => {
            console.log(response.data);
            props.navigation.navigate('allAddress',{item:response.data})
        })
    }

    return (
        <KeyboardAvoidingView keyboardVerticalOffset={-500} behavior="padding" enabled style={{flex:1,backgroundColor:'white'}}>
            <ScrollView style={{flex:1}}>
            <ErrorModal visible={err} onClose={closeErr} heading={heading} error={error} />
            <ImageBackground source={require('../../images/bg1.jpg')} resizeMode="cover" style={{height:height/2.75,width:width,justifyContent:'center'}} >
                <Text style={{color:'white',fontSize:29,fontWeight:'600',alignSelf:'center'}}>Add New Address</Text>
                </ImageBackground>
                <View style={{flexDirection:'row'}}>
                    <TextInput style={styles.input} value={flat} placeholder="Flat / Building" onChangeText={(val) => setFlat(val)} />
                </View>
                <View style={{flexDirection:'row'}}>
                    <TextInput style={styles.input} value={area} placeholder="Area / Society" onChangeText={(val) => setArea(val)} />
                </View>
                <View style={{flexDirection:'row'}}>
                    <TextInput style={styles.input} value={landmark} placeholder="Landmark" onChangeText={(val) => setLandmark(val)} />
                </View>
                <View style={{flexDirection:'row'}}>
                    <TextInput style={styles.input} value={town} placeholder="Town" onChangeText={(val) => setTown(val)} />
                </View>
                <View style={{flexDirection:'row'}}>
                    <TextInput style={styles.input} value={aname} placeholder="Address Name" onChangeText={(val) => setAname(val)} />
                </View>
                <View style={{flexDirection:'row',marginLeft:15}}>
                    <Text>Give Your address a name like Work , Home etc</Text>
                    </View>
                <View>
                    <TouchableOpacity onPress={signup} style={{width:width-75,alignItems:'center',marginTop:25,borderRadius:9,height:50,backgroundColor:'#ff4500',alignSelf:'center',justifyContent:'center'}}>
                        <View>
                        {
                            !cll?
                            <Text style={{color:'white',fontSize:21}}>Add New Address</Text>
                            :
                            <ActivityIndicator color="white" size="large" />
                        }
                        </View>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    input:{
        flex:1,
        marginLeft:15,
        marginRight:15,
        fontSize:19,
        borderBottomWidth:1,
        borderColor:'#ff4500',
        marginTop:15,
        paddingBottom:5,
        color:'#101010'
    }
})

AddAddress.propTypes = {
    setLocation: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => ({
    latlng:state.latlng
})

const mapActionsToProps = {
    setLocation
}

export default connect(mapStateToProps,mapActionsToProps)(AddAddress);