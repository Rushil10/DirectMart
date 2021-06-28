import React, { Component , useState } from 'react';
import { Text , View , Dimensions , StyleSheet , Image , TextInput , TouchableOpacity ,ActivityIndicator , AsyncStorage} from 'react-native';
import Navbar from '../../components/Navbar'
import GetLocation from 'react-native-get-location'
import axios from 'axios';
import {url} from '../../api/api'
import ErrorModal from '../consumer/ConsumerComponents/ErrorModal';


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

function SellerSignUp (props) {
  
  const[location , setLocation] = useState(null)
  const[loader , setLoader] = useState(false)

  const [err,showErr] = React.useState(false);
    const [heading,setHeading] = React.useState('')
    const [error,setError] = React.useState('')

    const closeErr = () => {
        showErr(false)
    }
  
  const submitHandler = async () => {
    if(location){
      let sname = props.route.params.sname
    let oname = props.route.params.oname
    let uname = props.route.params.uname
    let pass  = props.route.params.pass
    let rpass = props.route.params.rpass
    let add   = props.route.params.add 
    let num   = props.route.params.num 
    let desc  = props.route.params.desc 
    let time  = props.route.params.time 
    let id    = props.route.params.id 
    let longi = location.longitude
    let lati  = location.latitude

    //SHOpe image and description remaining here

    let seller = {
     shop_name      : sname ,
     shop_owner     : oname ,
     shop_contact   : num , 
     shop_location  : add , 
     shop_longitude : longi,
     shop_latitude  : lati,
     shop_timing   : time,
     shop_upiId     : id,
     shop_email     : uname ,
     shop_password  : pass,
     shop_description : desc
    }
    await axios.post(`${url}/shop/signup`,seller, {
      headers: {
      'Content-Type': 'application/json'
      }
  }).then(async(res) => {
      console.log(res.data);
      var token = res.data.token;
      await AsyncStorage.setItem('shop_token', token)
      props.navigation.reset({
        index: 0,
        routes: [{name: 'Seller'}],
    });
  }) 
    } else {
      setHeading('Location Unaccessible')
            setError('Please Turn On your location to setup your address and complete signup.\n\nWe require this location to locate shops in your 15 km range and this will be required only once during signup.\n\n Thank You')
            showErr(true)
                      setLoader(false)
    }
  }

    return (
        <View style={{flex: 1}}>
            <View>
            <ErrorModal visible={err} onClose={closeErr} heading={heading} error={error} />
            <Image
              style={{
                height: windowHeight*0.08,
                width: windowHeight*0.08,
                marginTop: -1
              }}
              source={require('../../../assets/loginImages/AngleTopLeft.png')}
            />
            </View>
            <Text style={[styles.labels , {marginLeft: windowWidth*0.1}]}>Provide Location of your Shop/Buisnesses</Text>

                {loader ? <View>
                  <ActivityIndicator size="large" color="#00ff00" />
                </View> :  <View style={{marginTop: 20}}>
                {location ? 
                <View style={{marginTop: 20}}>
                  <Text style={[styles.labels , {marginLeft: windowWidth*0.1}]}>Latitude    :   {location.latitude}</Text>
                  <Text style={[styles.labels , {marginLeft: windowWidth*0.1}]}>Longitude :   {location.longitude}</Text>
                </View> : <View>
                    <TouchableOpacity style={{alignItems: "center"}} onPress={() => {
                      setLoader(true);
                      
                      GetLocation.getCurrentPosition({
                        enableHighAccuracy: true,
                        timeout: 15000,
                    }).then((res) => {
                      console.log(location);
                      setLocation(res);
                      setLoader(false);
                    }).catch(err => {
                      setHeading('Location Unaccessible')
            setError('Please Turn On your location to setup your address and complete signup.\n\nWe require this location to locate shops in your 15 km range and this will be required only once during signup.\n\n Thank You')
            showErr(true)
                      setLoader(false)
                    })
                    }}>
                      <View style={{height: windowHeight*0.07 , width: windowWidth*0.5 ,alignItems: "center" , justifyContent: "center", backgroundColor: "#0ae38c" , marginTop: 20 , borderRadius: 20}}>
                        <Text style={{color: "white" , fontFamily: 'Montserrat-Bold' , fontSize: windowHeight*0.025 }}>Press Here</Text>
                      </View>
                    </TouchableOpacity>
                </View> }
                
            </View>
        }
            <View>

                {/* Add crousal for image and Latitude and Longitude use location */}

               
           <View style={{alignItems: "center" , marginTop: 25}}>
                <TouchableOpacity style={styles.submit} onPress={() => {  
                    submitHandler()
                }}>
                     <Text style={{color: "white" , fontFamily: 'Montserrat-Bold' , fontSize: windowHeight*0.025 }} >
                         Submit
                     </Text>
                </TouchableOpacity>
            </View>      
        </View>

            <View style={{
                flex: 1,
                alignItems: "flex-end",
                justifyContent: "flex-end",
                // marginTop: windowHeight*0.1
                }}>
           
            <Image
              style={{
                height: windowHeight*0.08,
                width: windowHeight*0.08,
                // marginLeft: windowWidth*0.85
              }}
              source={require('../../../assets/loginImages/AngleBottomRight.png')}
            />
            </View>

        </View>
    );
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

export default SellerSignUp;