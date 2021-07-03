import React, { Component , useState , useEffect } from 'react';
import { Text , View , Dimensions , StyleSheet , Image , TextInput , TouchableOpacity , KeyboardAvoidingView, ScrollView , AsyncStorage} from 'react-native';
import Navbar from '../../components/Navbar'
import ErrorModal from '../consumer/ConsumerComponents/ErrorModal';
import jwtDecode from 'jwt-decode';



const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

function SellerSignUp (props) {

    const [sname , setSname] = useState("");
    const [oname , setOname] = useState("");
    const [uname , setUname] = useState("");
    const [pass , setPass] = useState("");
    const [rpass , setrpass] = useState("");

    const [err,showErr] = React.useState(false);
    const [heading,setHeading] = React.useState('')
    const [error,setError] = React.useState('')

    const closeErr = () => {
        showErr(false)
    }

    useEffect(() => {
        // console.log(props.route.params.type);
        if(props.route.params.type = "edit")
        {
            //WE CAN EDIT PROFILE FROM HERE
            getDetails()
            
        }
    } , []);

    var pattern = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/; 

    const getDetails = async () => {
        var token = await AsyncStorage.getItem('shop_token');
        var decode = jwtDecode(token);
        console.log(decode);
        setSname(decode.shop_name)
        setOname(decode.shop_owner)
        setUname(decode.shop_email)
        setPass("XXXXXXXXX")
        setrpass("XXXXXXXXX")
    }

    const goToSignup2 = () => {
        if(sname.length===0 || oname.length===0 || uname.length===0 || pass.length===0 || rpass.length===0){
            setHeading('Invalid Credential')
            setError('Shop Name , Owner Name , Email and Password must Not be empty !')
            showErr(true)
            //setLoading(false)
        } else if(!uname.match(pattern)) {
            setHeading('Invalid Credential')
                setError('Enter a Valid Email !')
                showErr(true)
                //setLoading(false)
        } else {
            props.navigation.push("SellerSignUp2" , {
                sname : sname,
                oname : oname,
                uname : uname,
                pass  : pass ,
                rpass : rpass,
                type: props.route.params.type
            })
        }
    }

    return (
      
        <ScrollView style={{flex: 1}}>
            <View>
            <Image
              style={{
                height: windowHeight*0.08,
                width: windowHeight*0.08,
                marginTop: -1
              }}
              source={require('../../../assets/loginImages/AngleTopLeft.png')}
            />
            </View>

            <KeyboardAvoidingView>
            <ScrollView>
            <ErrorModal visible={err} onClose={closeErr} heading={heading} error={error} />
            <View>
            <View style={{marginLeft: windowWidth*0.1 , marginTop: windowHeight*0.04}}>
                <Text style={{fontSize: windowWidth*0.075 , fontFamily: "Montserrat-Bold"}}>New to SHOPY!</Text>
                <Text style={styles.labels}>Register Here</Text>
            </View>
            <View style={{marginTop: 20}}>
                <Text style={[styles.labels , {marginLeft: windowWidth*0.1}]}>Shop Name</Text>
                <View>
                    <TextInput 
                        style={styles.input}
                        onChangeText={(text) => {
                            setSname(text);
                        }}
                        value={sname}
                        placeholder="Shop Name"
                    />
                </View>
            </View>
            <View style={{marginTop: 20}}>
                <Text style={[styles.labels , {marginLeft: windowWidth*0.1}]}>Owner Name</Text>
                <View>
                    <TextInput 
                        style={styles.input}
                        onChangeText={(text) => {
                            setOname(text);
                        }}
                        value={oname}
                        placeholder="Owner Name" 
                    /> 
                </View>
            </View>
            <View style={{marginTop: 20}}>
                <Text style={[styles.labels , {marginLeft: windowWidth*0.1}]}>Email/Username</Text>
                <View>
                    <TextInput 
                        style={styles.input}
                        onChangeText={(text) => {
                            setUname(text);
                        }}
                        value={uname}
                        placeholder="Email/Username" 
                    /> 
                </View>
            </View>
            <View style={{marginTop: 20}}>
                <Text style={[styles.labels , {marginLeft: windowWidth*0.1}]}>Password</Text>
                <View>
                    <TextInput 
                        style={styles.input}
                        onChangeText={(text) => {
                            setPass(text);
                        }}
                        value={pass}
                        placeholder="Password" 
                    /> 
                </View>
            </View>
            <View style={{marginTop: 20}}>
                <Text style={[styles.labels , {marginLeft: windowWidth*0.1}]}>Repeat Password</Text>
                <View>
                    <TextInput 
                        style={styles.input}
                        onChangeText={(text) => {
                            setrpass(text);
                        }}
                        value={rpass}
                        placeholder="Repeat Password" 
                    /> 
                </View>
            </View>
           <View style={{alignItems: "center" , marginTop: 15}}>
                <TouchableOpacity style={styles.submit} onPress={goToSignup2}>
                     <Text style={{color: "white" , fontFamily: 'Montserrat-Bold' , fontSize: windowHeight*0.025 }} >
                         Next
                     </Text>
                </TouchableOpacity>
            </View>      
        </View>
        </ScrollView>
    </KeyboardAvoidingView>

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

        </ScrollView>
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