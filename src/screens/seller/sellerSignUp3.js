import React, { Component , useState } from 'react';
import { Text , View , Dimensions , StyleSheet , Image , TextInput,Platform , TouchableOpacity ,ActivityIndicator , AsyncStorage} from 'react-native';
import Navbar from '../../components/Navbar'
import GetLocation from 'react-native-get-location'
import axios from 'axios';
import {url} from '../../api/api'
import ErrorModal from '../consumer/ConsumerComponents/ErrorModal';
import messaging from '@react-native-firebase/messaging';
import jwtDecode from 'jwt-decode';
import Geolocation from 'react-native-geolocation-service';
import { PermissionsAndroid } from 'react-native';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

function SellerSignUp (props) {
  
  const[location , setLocation] = useState(null)
  const[loader , setLoader] = useState(false)
  const [fl,setFl] = React.useState(false)

  const [err,showErr] = React.useState(false);
    const [heading,setHeading] = React.useState('')
    const [error,setError] = React.useState('')

    const closeErr = () => {
        showErr(false)
    }

    React.useEffect(() => {
      if(props.route.params.type === "edit")
      {
        let l = {
            latitude: props.route.params.shop_latitude,
            longitude: props.route.params.shop_longitude
          }
          console.log(location);
        setLocation(l);
        console.log(location);
      }
    },[])
  
  const submitHandler = async () => {
    if(location){

      setFl(true)

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
    let image    = props.route.params.image 
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
     shop_description : desc,
     shop_image : image
    }


    if(props.route.params.type === "edit") {
      var token = await AsyncStorage.getItem('shop_token')
        console.log("HERE BABY !!!!!!!!!!!!!!!!!!!!!!!!!@@@@@@@@@@@@@@@@");
        
        await axios.post(`${url}/shop/update`,seller, {
          headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
          }
      }).then(async(res) => {
          console.log(res.data);
          if(res.data.token){
            var token = res.data.token;
          await AsyncStorage.setItem('shop_token', token)
          await setFcmToken(token)
          setFl(false)
          props.navigation.reset({
            index: 0,
            routes: [{name: 'Seller'}],
        });
          } else if (res.data.error) {
            setFl(false)
          } else {
            setFl(false)
          }
      }) 



      } else {

        var token = await AsyncStorage.getItem('shop_token');

        await axios.post(`${url}/shop/signup`,seller, {
          headers: {
            'Content-Type': 'application/json',
            "Authorization": `Bearer ${token}`
        }
      }).then(async(res) => {
          console.log(res.data);
         if(res.data.token){
          var token = res.data.token;
          await AsyncStorage.setItem('shop_token', token)
          await setFcmToken(token)
          props.navigation.reset({
            index: 0,
            routes: [{name: 'SellerSlides'}],
        });
         } else if (res.data.error) {
          setFl(false)
          setHeading('Signup Error !')
          setError(res.data.error)
          showErr(true)
        } else {
          setFl(false)
          setHeading('Signup Error !')
          setError('Error During SIgnup ! PLease Try Again')
          showErr(true)
        }
      }) 
        }

      }

     else {
      setHeading('Location Unaccessible')
            setError('Please Turn On your location to setup your address and complete signup.\n\nWe require your location to make your shop available to consumer in your 15km range . \n\n Thank You')
            showErr(true)
                      setLoader(false)
    }
  }

  const setFcmToken = async(token) => {
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
    })
}

    return (
        <View style={{flex: 1}}>
            <View>
            <ErrorModal color='#0ae38c' visible={err} onClose={closeErr} heading={heading} error={error} />
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
                    <TouchableOpacity style={{alignItems: "center"}} onPress={async() => {
                      setLoader(true);
                      if (Platform.OS === 'ios') {
                        Geolocation.requestAuthorization();
                        Geolocation.setRNConfiguration({
                          skipPermissionRequests: false,
                         authorizationLevel: 'whenInUse',
                       });
                      }
                    if (Platform.OS === 'android') {
                        await PermissionsAndroid.request(
                          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                        );
                    }
                      Geolocation.getCurrentPosition(async(position) => {
                        var location = position.coords
                        setLocation(location);
                      setLoader(false);
                      },
                      (error) => {
                        setHeading('Location Unaccessible')
            setError('Please Turn On your location to setup your address and complete signup.\n\nWe require your location to make your shop available to consumer in your 15km range . \n\n Thank You')
            showErr(true)
                      setLoader(false)
                      },
                      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 ,forceRequestLocation:true}
                      )
                      /* GetLocation.getCurrentPosition({
                        enableHighAccuracy: true,
                        timeout: 15000,
                    }).then((res) => {
                      console.log(location);
                      console.log(res);
                      setLocation(res);
                      setLoader(false);
                    }).catch(err => {
                      setHeading('Location Unaccessible')
            setError('Please Turn On your location to setup your address and complete signup.\n\nWe require your location to make your shop available to consumer in your 15km range . \n\n Thank You')
            showErr(true)
                      setLoader(false)
                    }) */
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

                {props.route.params.type === "edit" ?  <View>
                    <TouchableOpacity style={{alignItems: "center"}} onPress={async() => {
                      setLoader(true);
                      if (Platform.OS === 'ios') {
                        Geolocation.requestAuthorization();
                        Geolocation.setRNConfiguration({
                          skipPermissionRequests: false,
                         authorizationLevel: 'whenInUse',
                       });
                      }
                    if (Platform.OS === 'android') {
                        await PermissionsAndroid.request(
                          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                        );
                    }
                      Geolocation.getCurrentPosition(async(position) => {
                        var location = position.coords
                        setLocation(location);
                      setLoader(false);
                      },
                      (error) => {
                        setHeading('Location Unaccessible')
            setError('Please Turn On your location to setup your address and complete signup.\n\nWe require your location to make your shop available to consumer in your 15km range . \n\n Thank You')
            showErr(true)
                      setLoader(false)
                      },
                      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000,forceRequestLocation:true }
                      )
                      /* GetLocation.getCurrentPosition({
                        enableHighAccuracy: true,
                        timeout: 15000,
                    }).then((res) => {
                      console.log(location);
                      console.log(res);
                      setLocation(res);
                      setLoader(false);
                    }).catch(err => {
                      setHeading('Location Unaccessible')
            setError('Please Turn On your location to setup your address and complete signup.\n\nWe require this location to locate shops in your 15 km range and this will be required only once during signup.\n\n Thank You')
            showErr(true)
                      setLoader(false)
                    }) */
                    }}>
                      <View style={{height: windowHeight*0.1 , width: windowWidth*0.9 ,alignItems: "center" , justifyContent: "center", backgroundColor: "#0ae38c" , marginTop: 20 , borderRadius: 10}}>
                        <Text style={{color: "white" , fontFamily: 'Montserrat-Bold' , fontSize: windowHeight*0.025 }}>Provide new location</Text>
                      </View>
                    </TouchableOpacity>
                </View> : <View /> }

               
           <View style={{alignItems: "center" , marginTop: 25}}>
                {
                  fl ?
                  <ActivityIndicator color='#0ae38c' size={29} />
                  :
                  <TouchableOpacity style={styles.submit} onPress={() => {  
                    submitHandler()
                }}>
                     <Text style={{color: "white" , fontFamily: 'Montserrat-Bold' , fontSize: windowHeight*0.025 }} >
                         {props.route.params.type === "edit" ? "Save Changes" : "Submit"}
                     </Text>
                </TouchableOpacity>
                }
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