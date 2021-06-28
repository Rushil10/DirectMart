import * as React from 'react';
import jwtDecode from 'jwt-decode';
import { View, Text, AsyncStorage,Image,Dimensions,FlatList, TouchableOpacity, StyleSheet , ScrollView, TouchableWithoutFeedback, ActivityIndicator } from 'react-native';
import { url } from '../../api/api'
import axios from 'axios';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Header from '../consumer/ConsumerComponents/Header';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Share from 'react-native-share'
import messaging from '@react-native-firebase/messaging';
import ImgToBase64 from 'react-native-image-base64';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;


function SellerProfile(props) {

    const [info , setInfo] = React.useState([]);
    const [shareLoading,setShareLoading] = React.useState(false)

    const getDetails = async () => {
        var token = await AsyncStorage.getItem('shop_token');
        var decode = jwtDecode(token);
        setInfo(decode);
    }

    React.useEffect(() => {
        getDetails()
    })

    const shareHandler = () => {
        let img = ""
        setShareLoading(true);
        ImgToBase64.getBase64String(info.shop_image)
        .then(base64String => {
         img = 'data:image/jpeg;base64,' + base64String
         Share.open({
            title:`Share My Shop ${info.shop_name}`,
            message:`Checkout products of my shop ${info.shop_name} on localapp by clicking on this link https://www.localapp.in/shop/${info.shop_name}/${info.shop_id} \n\n If you have not installed the app install it from playstore by this link `,
            url:img
        }
        ).then((res) => {
            console.log(res)
            setShareLoading(false)
        }).catch((err) => {
            console.log(err)
            setShareLoading(false)
        })
        })
    }

    return(
        <ScrollView style={{backgroundColor: "white"}}>
            {/* <TouchableOpacity onPress={() => {
                AsyncStorage.clear()
            }}>
                <View style={{height: 100 , width: 100 , backgroundColor: "orange"}}>
                    <Text>LOG OUT</Text>
                </View>
            </TouchableOpacity> */}
            <Header style={{color: "white" , fontFamily: "Montserrat-ExtraBold" , fontSize: 19}}  backgroundColor='#0ae38c' header='Profile' height={55} width={windowWidth} />
            <View style={{
                alignItems: "center",
                paddingTop:15
            }} > 
                <Image
                    style={{
                        height: windowHeight*0.3,
                        width: windowWidth,
                        resizeMode:'cover'
                    }}
                    source={{
                        uri: info.shop_image
                    }}

                />
            </View>

            <View style={{
                backgroundColor: "#0ae38c",
                width: windowWidth,
                height: windowHeight*0.06,
                alignItems: "center",
                justifyContent: "center"
            }}>
                <Text style={styles.labels}>{info.shop_name}</Text>
            </View>

            <View style={{ flexDirection: "row"}}>
                
            <View style={{flex: 0.5 ,alignItems: "center" , marginLeft: 20, justifyContent: "center"}}>
                <View>
                    <Text style={styles.text}>
                        {info.shop_owner}
                    </Text>
                </View>
                <View>
                    <Text style={styles.text}>
                         {info.shop_email}
                    </Text>
                </View>
            </View>

            <View style={{flex: 0.5 ,marginRight: windowWidth*0.08 , alignItems: "flex-end"}}>
                <Image
                    style={{
                        height: windowHeight*0.12      ,
                        width: windowHeight*0.12 ,
                        marginTop: 20
                    }}
                    source={require('../../images/user.png')}
                />
            </View>

            </View>

                    {/* order status */}

                    {/* <View style={{flexDirection: "row" , marginTop: 20}}>
                        <View style={{width: windowWidth*0.5 , height: windowHeight*0.1 , backgroundColor: "#FF616D" , alignItems: "center" , justifyContent: "center"}}>
                            <Text style={styles.text1}>Active Orders</Text>
                            <Text style={styles.text1}>10</Text>
                        </View>
                        <View style={{width: windowWidth*0.5 , height: windowHeight*0.1 , backgroundColor: "#0ae38c", alignItems: "center" , justifyContent: "center"}}>
                            <Text style={styles.text1}>Total Orders</Text>
                            <Text style={styles.text1}>20</Text>
                        </View>
                    </View> */}

                    {/* BASIC INFO STARTS */}
            <View style={{padding:9}}>
                <TouchableWithoutFeedback onPress={shareHandler}>
                    <View style={{paddingVertical:9,backgroundColor:'#ff616d',borderRadius:9}}>
                        {
                            !shareLoading
                            ?
                            <View style={{paddingVertical:0,alignItems:'center',borderRadius:9,flexDirection:'row',justifyContent:'center',backgroundColor:'#ff616d'}}>
                                <AntDesign name='sharealt' size={29} color='white' />
                        <Text style={{color:'white',fontSize:19,marginLeft:15}}>Share My Shop {info.shop_name}</Text>
                                </View>
                        :
                        <ActivityIndicator color='white' size={29} />
                        }
                    </View>
                </TouchableWithoutFeedback>
                </View>

            <View style={{}}>

            <View style={{marginLeft : windowWidth*0.05 , flexDirection: "row" , marginTop: 10}}>
            <MaterialCommunityIcons name="clock-time-four-outline" color={"black"} size={24} />
            <View style={{justifyContent: "center" , marginLeft: 10}}>
                <Text style={styles.text}>
                    TIMINGS
                </Text>
                <Text style={[styles.text]}>
                    {info.shop_timing}
                </Text>
            </View>
            </View>

            <View style={{marginLeft : windowWidth*0.05 , flexDirection: "row" , marginTop: 10}}>
            <MaterialCommunityIcons name="map-marker" color={"black"} size={24} />
            <View style={{justifyContent: "center" , marginLeft: 10}}>
                <Text style={styles.text}>
                    LOCATION 
                </Text>
                <Text style={[styles.text]}>
                    {info.shop_location}
                </Text>
            </View>
            </View>

            <View style={{marginLeft : windowWidth*0.05 , flexDirection: "row" , marginTop: 10}}>
            <MaterialCommunityIcons name="phone-outline" color={"black"} size={24} />
            <View style={{justifyContent: "center" , marginLeft: 10}}>
                <Text style={styles.text}>
                    CONTACT 
                </Text>
                <Text style={[styles.text]}>
                    {info.shop_contact}
                </Text>
            </View>
            </View>

            
            <View style={{marginLeft : windowWidth*0.05 , flexDirection: "row" , marginTop: 10}}>
            <MaterialCommunityIcons name="cash-multiple" color={"black"} size={24} />
            <View style={{justifyContent: "center" , marginLeft: 10}}>
                <Text style={styles.text}>
                    UPI ID 
                </Text>
                <Text style={[styles.text]}>
                    {info.shop_upiID ? info.shop_upiID : "9999999999"}
                </Text>
            </View>
            </View>


            </View>
            
                    <View style={{flexDirection : "column" , alignItems: "center" , justifyContent: "center" , marginTop: 10 , marginBottom: 10}}>

            <TouchableOpacity  onPress={async () => {


                 
                //  const e = await messaging().hasPermission();

                //  console.log("e" , e);

                //  if(e)
                //  {
                //     let fcm = await AsyncStorage.read(fcmToken)
                //     console.log("fcm" , fcm);
                //  }

                console.log("HELLo");


                messaging().onNotificationOpenedApp(remoteMessage => {
                    console.log(
                      'Notification caused app to open from background state:',
                      remoteMessage.notification,
                    );
                    navigation.navigate(remoteMessage.data.type);
                  });
              
                  // Check whether an initial notification is available
                  messaging()
                    .getInitialNotification()
                    .then(remoteMessage => {
                      if (remoteMessage) {
                        console.log(
                          'Notification caused app to open from quit state:',
                          remoteMessage.notification,
                        );
                        setInitialRoute(remoteMessage.data.type); // e.g. "Settings"
                      }
                    });

                }}>
                <View style={styles.submit2}>
                <MaterialCommunityIcons name="pencil-outline" color={"white"} size={24} />
                    <Text style={[styles.text1 , {marginLeft: windowWidth*0.03 ,}]}>Edit Profile</Text>
                </View>
            </TouchableOpacity>

             <TouchableOpacity style={{marginTop: 20}} onPress={async () => {
                 await AsyncStorage.clear();
                 props.navigation.navigate("ChooseType");
                }}>
                <View style={styles.submit}>
                <MaterialCommunityIcons name="logout" color={"white"} size={24} />
                    <Text style={[styles.text1 , {marginLeft: windowWidth*0.03 ,}]}>Log Out</Text>
                </View>
            </TouchableOpacity>
                </View>

        </ScrollView>
        
    )
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
      fontSize: windowWidth*0.06 , fontFamily: "Montserrat-Bold" , color: "white"
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
        flexDirection: "row",
        width: windowWidth*0.5,
        height: windowHeight*0.06,
        backgroundColor: "#0ae38c",
        borderRadius: 40,
        alignItems: "center",
        justifyContent: "center"
    },
    text: {
        fontSize: windowWidth*0.04 , 
        fontFamily: "Montserrat-Bold"
    },
    text1: {
        fontSize: windowWidth*0.04 , 
        fontFamily: "Montserrat-ExtraBold",
        color: "white"
    },
    submit2: {
        flexDirection: "row",
        width: windowWidth*0.5,
        height: windowHeight*0.06,
        backgroundColor: "#FF616D",
        borderRadius: 40,
        alignItems: "center",
        justifyContent: "center"
    },
  });

export default SellerProfile