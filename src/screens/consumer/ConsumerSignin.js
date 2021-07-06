import axios from 'axios';
import * as React from 'react';
import { View,ScrollView,AsyncStorage,ImageBackground,TouchableOpacity, Text,Button,FlatList,ActivityIndicator,Platform,Dimensions,Image,TextInput,StyleSheet,KeyboardAvoidingView } from 'react-native';
import { NavigationContainer, StackActions } from '@react-navigation/native';
import { Header } from '@react-navigation/stack';
import { url } from '../../api/api';
import PropTypes from 'prop-types';
import {connect} from 'react-redux'
import { setLocation } from '../../redux/consumer/actions/latlngactions';
import jwt_decode from "jwt-decode";
import { setCartProducts } from '../../redux/consumer/actions/cartActions';
import ErrorModal from './ConsumerComponents/ErrorModal';
import messaging from '@react-native-firebase/messaging';
import jwtDecode from 'jwt-decode';

const {height,width} = Dimensions.get('window')
function ConsumerSignin(props) {
    const [email,setEmail] = React.useState('');
    const [password,setPassword] = React.useState('');
    const [loading,setLoading] = React.useState(false);
    const keyboardVerticalOffset = Platform.OS === 'ios' ? 40 : 40
    const [err,showErr] = React.useState(false);
    const [heading,setHeading] = React.useState('')
    const [error,setError] = React.useState('')

    const closeErr = () => {
        showErr(false)
    }

    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    var pattern = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/; 

    const signin = () => {
        setLoading(true);
        if(email.length === 0 || password.length === 0){
            setHeading('Invalid Credential')
            setError('Email and Password must Not be empty !')
            showErr(true)
            setLoading(false)
        } else if(email.split(' ').length>1 || password.split(' ').length>1) {
            if(email.split(' ').length>1 ){
                setHeading('Invalid Credential')
                setError('Email must Not contain space !')
                showErr(true)
                setLoading(false)
            } else {
                setHeading('Invalid Credential')
                setError('Password must Not contain space !')
                showErr(true)
                setLoading(false)
            }
        } else if(!re.test(email)) {
            console.log(re.test(email))
            setHeading('Invalid Credential')
                setError('Enter a Valid Email !')
                showErr(true)
                setLoading(false)
        } else {
            console.log(email.match(pattern))
            var consumer = {
                consumer_email:email,
                consumer_password:password
            }
            axios.post(`${url}/consumer/login`,consumer)
            .then(async(res) => {
                console.log(res.data);
                if(res.data.token){
                    var token = res.data.token;
                var decodedToken = jwt_decode(token);
                await AsyncStorage.setItem('user_token',token);
                await setFcmToken(token);
                props.setLocation(decodedToken.latitude,decodedToken.longitude);
                props.setCartProducts(token);
                setLoading(false);
                props.navigation.reset({
                    index: 0,
                    routes: [{name: 'Consumer'}],
                  });
                } else {
                    setHeading('Invalid Credential')
                setError(res.data.error)
                showErr(true)
                setLoading(false)
                }
            })
            .catch(err => {
                console.log(err,'error');
                setHeading('Invalid Credential')
                //setError(err)
                showErr(true)
                setLoading(false)
            })

        }
    }

    const setFcmToken = async(token) => {
        const fcm_token = await messaging().getToken();
        console.log(fcm_token)
        var consumer = jwtDecode(token);
        var data = {
            user_type:'consumer',
            user_id:consumer.consumer_id,
            fcm_token:fcm_token
        }
        console.log(data);
        console.log(token);
        axios.post(`${url}/consumer/fcmtoken`,data,{
            headers:{
                Authorization: `Bearer ${token}`
            }
        }).then(res => {
            console.log(res.data);
        })
    }

    const goToSignup = () => {
        if(email.length === 0 || password.length === 0){
            setHeading('Invalid Credential')
            setError('Email and Password must Not be empty !')
            showErr(true)
            setLoading(false)
        } else if(email.split(' ').length>1 || password.split(' ').length>1) {
            if(email.split(' ').length>1 ){
                setHeading('Invalid Credential')
                setError('Email must Not contain space !')
                showErr(true)
                setLoading(false)
            } else {
                setHeading('Invalid Credential')
                setError('Password must Not contain space !')
                showErr(true)
                setLoading(false)
            }
        } else if(!email.match(re)) {
            setHeading('Invalid Credential')
                setError('Enter a Valid Email !')
                showErr(true)
                setLoading(false)
        } else {
            props.navigation.push('ConsumerSignup1',{email:email,password:password})
        }
    }

    return (
        <KeyboardAvoidingView keyboardVerticalOffset={-500} behavior="padding" enabled style={{flex:1,backgroundColor:'white'}}>
            <ScrollView>
                <ErrorModal visible={err} onClose={closeErr} heading={heading} error={error} />
            <ImageBackground source={require('../../images/bg1.jpg')} resizeMode="cover" style={{height:height/1.75,width:width,justifyContent:'center'}} >
                <Text style={{color:'white',fontSize:29,fontWeight:'600',padding:15,paddingBottom:0}}>Support Local</Text>
                <Text style={{color:'white',fontSize:29,fontWeight:'600',paddingLeft:15}}>Buisnesses</Text>
                </ImageBackground>
                <View style={{flexDirection:'row'}}>
                    <TextInput style={styles.input} value={email} placeholder="Email" onChangeText={(val) => setEmail(val)} />
                </View>
                <View style={{flexDirection:'row'}}>
                    <TextInput style={styles.input} value={password} placeholder="Password" onChangeText={(val) => setPassword(val)} />
                </View>
                <View>
                    <TouchableOpacity onPress={signin} style={{width:width-75,alignItems:'center',marginTop:25,borderRadius:9,height:50,backgroundColor:'#ff4500',alignSelf:'center',justifyContent:'center'}}>
                        <View>
                        <Text style={{color:'white',fontSize:21}}>{
                            loading ?
                            <ActivityIndicator color="white" size="large" />
                            :
                            'Log in'
}</Text>
                        </View>
                    </TouchableOpacity>
                    <View style={{alignItems:'center',marginTop:15,marginBottom:15}}>
                        <Text>OR</Text>
                    </View>
                    <TouchableOpacity onPress={goToSignup} style={{width:width-75,alignItems:'center',marginTop:0,borderRadius:9,height:50,backgroundColor:'white',borderWidth:1,borderColor:'gray',alignSelf:'center',justifyContent:'center'}}>
                        <View>
                        <Text style={{color:'gray',fontSize:21}}>Signup</Text>
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

ConsumerSignin.propTypes = {
    setLocation: PropTypes.func.isRequired,
    setCartProducts:PropTypes.func.isRequired
}

const mapStateToProps = (state) => ({
    latlng:state.latlng
})

const mapActionsToProps = {
    setLocation,
    setCartProducts
}

export default connect(mapStateToProps,mapActionsToProps)(ConsumerSignin);