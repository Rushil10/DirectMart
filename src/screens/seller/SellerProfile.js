import * as React from 'react';
import jwtDecode from 'jwt-decode';
import { View, Text, AsyncStorage,Image,Dimensions,FlatList, TouchableOpacity, StyleSheet , ScrollView } from 'react-native';
import { url } from '../../api/api'
import axios from 'axios';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;


function SellerProfile(props) {

    const [info , setInfo] = React.useState([]);

    const getDetails = async () => {
        var token = await AsyncStorage.getItem('shop_token');
        var decode = jwtDecode(token);
        setInfo(decode);
    }

    React.useEffect(() => {
        getDetails()
    })

    return(
        <ScrollView style={{backgroundColor: "white"}}>
            {/* <TouchableOpacity onPress={() => {
                AsyncStorage.clear()
            }}>
                <View style={{height: 100 , width: 100 , backgroundColor: "orange"}}>
                    <Text>LOG OUT</Text>
                </View>
            </TouchableOpacity> */}

            <View style={{
                alignItems: "center"
            }} > 
                <Image
                    style={{
                        height: windowHeight*0.3      ,
                        width: windowWidth
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

                    <View style={{flexDirection: "row" , marginTop: 20}}>
                        <View style={{width: windowWidth*0.5 , height: windowHeight*0.1 , backgroundColor: "#FF616D" , alignItems: "center" , justifyContent: "center"}}>
                            <Text style={styles.text1}>Active Orders</Text>
                            <Text style={styles.text1}>10</Text>
                        </View>
                        <View style={{width: windowWidth*0.5 , height: windowHeight*0.1 , backgroundColor: "#0ae38c", alignItems: "center" , justifyContent: "center"}}>
                            <Text style={styles.text1}>Total Orders</Text>
                            <Text style={styles.text1}>20</Text>
                        </View>
                    </View>

                    {/* BASIC INFO STARTS */}

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

            <TouchableOpacity  onPress={() => {
                 console.log(props);
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