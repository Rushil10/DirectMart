import React, { Component } from 'react';
import { Text , View , Dimensions , StyleSheet , Image, TextInput, TouchableOpacity , AsyncStorage , Alert, ActivityIndicator} from 'react-native';
import CheckBox from 'react-native-check-box'

import axios from 'axios';
import {url} from '../api/api'

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
import messaging from '@react-native-firebase/messaging';
import jwtDecode from 'jwt-decode';
import ErrorModal from '../screens/consumer/ConsumerComponents/ErrorModal';

class SigninComponent extends Component {

  checkCredentials = () => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    this.setState({
      //loading: true,
      bl:true
    })
    if(this.state.email.length === 0 || this.state.pass.length===0) {
      this.setState({
        heading:'Invalid Data',
        error:'Email and Password must not be empty !',
        err:true,
        bl:false
      })
    } else if (!re.test(this.state.email)){
      this.setState({
        heading:'Invalid Email',
        error:'Enter a Valid Email !',
        err:true,
        bl:false
      })
    } else {
      this.loginHandler()
    }
  }

   loginHandler = () => {    

    var seller = {
      shop_email:this.state.email,
      shop_password:this.state.pass
    }

  console.log(seller);

  axios.post(`${url}/shop/login`,seller)
    .then(async(res) => {
        console.log(res.data);
        if(res.data.token){
          var token = res.data.token;
        await AsyncStorage.setItem('shop_token',token);
        const fcm_token = await messaging().getToken();
      console.log(fcm_token)
      var shop = jwtDecode(token);
      var data = {
          user_type:'shop',
          user_id:shop.shop_id,
          fcm_token:fcm_token
      }
      console.log(data);
      console.log(token);
      axios.post(`${url}/shop/fcmtoken`,data,{
          headers:{
              Authorization: `Bearer ${token}`
          }
      }).then(res => {
          console.log(res.data);
          this.props.signIn.reset({
            index: 0,
            routes: [{name: 'Seller'}],
        });
      })
        } else {
          this.setState({
            heading:'Invalid User',
            error:res.data.error || 'Login Error',
            err:true,
            bl:false
          })
        }
    })

    setTimeout(() => {
      this.setState({
        loading: false
      }) 
    },3000)
  }

  closeErr = () => {
    this.setState({
      err:false
    })
  }

  
  static re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;    

    state = {
       isChecked: false ,
       loading: false,
       email: "",
       pass: "",
       bl:false,
       err:false,
       heading:'Error',
       error:'Login Error',
     };

  render() {
    return (

      this.state.loading ?   <View style={{backgroundColor:'white',flex:1,alignItems:'center',justifyContent:'center'}}>
      <Image source={require('../../assets/loader/1490.gif')} resizeMode='contain' style={{width:windowWidth}} />
  </View>  : 
        <View>
          <ErrorModal visible={this.state.err} color='#0ae38c' onClose={this.closeErr} heading={this.state.heading} error={this.state.error} />
            <View style={{marginLeft: windowWidth*0.1 , marginTop: windowHeight*0.04}}>
                <Text style={{fontSize: windowWidth*0.065 , fontFamily: "Montserrat-Bold"}}>Welcome to DirectMart !</Text>
                <Text style={styles.labels}>Login to your account</Text>
            </View>
            <View style={{marginTop: 20}}>
                <Text style={[styles.labels , {marginLeft: windowWidth*0.1}]}>Email</Text>
                <View>
                    <TextInput 
                        style={styles.input}
                        onChangeText={(text) => {
                          this.setState({
                            email : text
                          })
                        }}
                        value={this.state.email}
                        placeholder="Email"
                    />
                </View>
            </View>
            <View style={{marginTop: 20}}>
                <Text style={[styles.labels , {marginLeft: windowWidth*0.1}]}>Password</Text>
                <View>
                    <TextInput 
                        style={styles.input}
                        onChangeText={(text) => {
                          this.setState({
                            pass: text
                          })
                        }}
                        value={this.state.pass}
                        placeholder="Password" 
                    /> 
                </View>
            </View>
            <View style={{flexDirection: "row" , marginTop: 10}}>
            <CheckBox
            style={{marginLeft: windowWidth*0.1 }}
            onClick={()=>{
              this.setState({
              isChecked:!this.state.isChecked
              })
             }}
            isChecked={this.state.isChecked}
            />
            <Text style={[styles.labels , {marginTop: 2}]}>REMEMBER ME</Text>
            </View>
            <View style={{marginLeft: windowWidth*0.1 , marginTop: windowHeight*0.025}}>
             <View style={styles.bootombar}>
                 {/* <View style={{marginLeft: 5}}>
                   <Text style={{color: "#0ae38c" , fontFamily: "Montserrat-Light" , }}>Forgot Password ?</Text>
                 </View> */}
                     <View>
                     <TouchableOpacity onPress={() => {this.props.signIn.navigate("SellerSignUp" , {type: "new"})}}>
                        <Text style={{color: "gray",fontSize:16.5 , fontFamily: 'Montserrat-Medium'}}>Don't have an account ? Sign up</Text>
                        </TouchableOpacity>
                     </View>
             </View>
            {/*  <View style={{alignItems: "flex-end" , marginRight: windowWidth*0.1 }}>
                    <TouchableOpacity onPress={() => {this.props.signIn.navigate("SellerSignUp" , {type: "new"})}}>
                     <Text style={{color: "grey" , fontFamily: 'Montserrat-Light' }}>Sign Up</Text>
                    </TouchableOpacity>
                   </View> */}
            </View>
           <View style={{alignItems: "center" , marginTop: 15}}>
                <TouchableOpacity style={styles.submit} onPress={() => {
                  this.checkCredentials()
                }}>
                     {
                       !this.state.bl ?
                       <Text style={{color: "white" , fontFamily: 'Montserrat-Bold' , fontSize: windowHeight*0.025 }} >
                         Login
                     </Text>
                     :
                     <ActivityIndicator color='white' size='large' />
                     }
                </TouchableOpacity>
            </View> 
            
        </View>
    );
  }
}

const styles = StyleSheet.create({
  navbar: {
    width: windowWidth, 
    height: windowHeight*0.1, 
    backgroundColor: "#162239",
    alignItems: "center",
    justifyContent: "center"
  },
  navbarIcon1: {
    width: windowWidth*0.8, 
    height: windowHeight*0.05,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  labels: {
    fontSize: windowWidth*0.035 , fontFamily: "Montserrat-Bold" , color: "#7c7c7c"
  },
  input: {
    height: windowHeight*0.05,
    width: windowWidth*0.8,
    marginLeft: windowWidth*0.1 ,
    marginTop: 8,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: "#7c7c7c",
    fontFamily: "Montserrat-Light",
    padding: 10
  },
  checkbox: {
    alignSelf: "center",
  },
  bootombar: {
    width: windowWidth*0.8, 
    height: windowHeight*0.05,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  submit: {
      width: windowWidth*0.5,
      height: windowHeight*0.06,
      backgroundColor: "#0ae38c",
      borderRadius: 40,
      alignItems: "center",
      justifyContent: "center"
  }
});

export default SigninComponent;