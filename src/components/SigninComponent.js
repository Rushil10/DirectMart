import React, { Component } from 'react';
import { Text , View , Dimensions , StyleSheet , Image, TextInput, TouchableOpacity , AsyncStorage} from 'react-native';
import CheckBox from 'react-native-check-box'

import axios from 'axios';
import {url} from '../api/api'

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

class SigninComponent extends Component {

   loginHandler = () => {
    // console.log(this.state.email);
    // console.log(this.state.pass);

    

    this.setState({
      loading: true
    })

    var seller = {
      shop_email:this.state.email,
      shop_password:this.state.pass
  }

  console.log(seller);

  axios.post(`${url}/shop/login`,seller)
    .then(async(res) => {
        console.log(res.data);
        var token = res.data.token;
        await AsyncStorage.setItem('shop_token',token);
        this.props.signIn.reset({
          index: 0,
          routes: [{name: 'Seller'}],
      });
    })
    .catch(err => {
        console.log(err);
    })

      this.setState({
        loading: false
      })    

  }

    state = {
       isChecked: false ,
       loading: false,
       email: "",
       pass: ""
     };
  render() {
    return (

      this.state.loading ?   <View style={{backgroundColor:'white',flex:1,alignItems:'center',justifyContent:'center'}}>
      <Image source={require('../../assets/loader/1490.gif')} resizeMode='contain' style={{width:windowWidth}} />
  </View>  : 
        <View>
            <View style={{marginLeft: windowWidth*0.1 , marginTop: windowHeight*0.04}}>
                <Text style={{fontSize: windowWidth*0.075 , fontFamily: "Montserrat-Bold"}}>Welcome to SHOPY!</Text>
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
                 <View style={{marginLeft: 5}}>
                   <Text style={{color: "#0ae38c" , fontFamily: "Montserrat-Light" , }}>Forgot Password ?</Text>
                 </View>
                     <View>
                        <Text style={{color: "grey" , fontFamily: 'Montserrat-Light'}}>Don't have an account</Text>
                     </View>
             </View>
             <View style={{alignItems: "flex-end" , marginRight: windowWidth*0.1 }}>
                    <TouchableOpacity onPress={() => {this.props.signIn.navigate("SellerSignUp")}}>
                     <Text style={{color: "grey" , fontFamily: 'Montserrat-Light' }}>Sign Up</Text>
                    </TouchableOpacity>
                   </View>
            </View>
           <View style={{alignItems: "center" , marginTop: 15}}>
                <TouchableOpacity style={styles.submit} onPress={() => {
                  this.loginHandler();
                }}>
                     <Text style={{color: "white" , fontFamily: 'Montserrat-Bold' , fontSize: windowHeight*0.025 }} >
                         Login
                     </Text>
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