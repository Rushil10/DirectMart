import React, { Component , useState } from 'react';
import { Text , View , Dimensions,ScrollView , StyleSheet , Image , TextInput , TouchableOpacity, KeyboardAvoidingView} from 'react-native';
import Navbar from '../../components/Navbar'
import ErrorModal from '../consumer/ConsumerComponents/ErrorModal';


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

function SellerSignUp2 (props) {

    
    const [add , setAdd] = useState("");
    const [num , setNum] = useState("");
    const [desc , setDesc] = useState("");
    const [time , setTime] = useState("");
    const [id , setId] = useState("");

    const [err,showErr] = React.useState(false);
    const [heading,setHeading] = React.useState('')
    const [error,setError] = React.useState('')
    let data = props.route.params.decode;

      React.useEffect(() => {
        // console.log(props.route.params.type);
        if(props.route.params.type === "edit")
        {
            //WE CAN EDIT PROFILE FROM HERE
            console.log(props.route.params.decode);
            setAdd(data.shop_location);
            setNum(data.shop_contact);
            setDesc(data.shop_description)
            setTime(data.shop_timing)
            setId(data.shop_upiId)
        }
    } , []);

    const closeErr = () => { 
        showErr(false)
    }

    const goToSignup3 = () => {
        if(add.length === 0 || num.length === 0 || desc.length===0){
            setHeading('Invalid Credential')
            setError('Shop Address , Contact Number and Shop Description must Not be empty !')
            showErr(true)
        } else if(num.length>10 || num.length<10){
            setHeading('Invalid Phone Number')
            setError('Contact Number must be of 10 digits !')
            showErr(true)
        } else {
            if(props.route.params.type === "edit"){
                props.navigation.navigate("SellerSignUp3" , {
                    sname : props.route.params.sname,
                    oname : props.route.params.oname,
                    uname : props.route.params.uname,
                    pass  : props.route.params.pass ,
                    rpass : props.route.params.rpass,
                    image : props.route.params.image,
                    shop_latitude: data.shop_latitude|| '',
                    shop_longitude: data.shop_longitude || '',
                    add   : add ,
                    num   : num ,
                    desc  : desc,
                    time  : time,
                    id    : id ,
                    type: props.route.params.type
                })
            } else {
                props.navigation.navigate("SellerSignUp3" , {
                    sname : props.route.params.sname,
                    oname : props.route.params.oname,
                    uname : props.route.params.uname,
                    pass  : props.route.params.pass ,
                    rpass : props.route.params.rpass,
                    image : props.route.params.image,
                    add   : add ,
                    num   : num ,
                    desc  : desc,
                    time  : time,
                    id    : id ,
                    type: props.route.params.type
                })
            }
        }
    }

    return (
        <View style={{flex: 1}}>
           <ErrorModal color='#0ae38c' visible={err} onClose={closeErr} heading={heading} error={error} />
           <View style={{position:'absolute',top:0}}>
            <Image
              style={{
                height: windowHeight*0.08,
                width: windowHeight*0.08,
                marginTop: -1
              }}
              source={require('../../../assets/loginImages/AngleTopLeft.png')}
            />
            </View>
            
            <ScrollView style={{flex:1}}>
            <KeyboardAvoidingView>
            <View style={{marginTop: windowHeight*0.08}}>
                <Text style={[styles.labels , {marginLeft: windowWidth*0.1}]}>Shop Address</Text>
                <View>
                    <TextInput 
                    numberOfLines={3}
                    multiline={true}
                    style={styles.input}
                        onChangeText={(text) => {
                            setAdd(text)
                        }}
                        value={add}
                        placeholder="Shop Address"
                    />
                </View>
            </View>
            <View style={{marginTop: 20}}>
                <Text style={[styles.labels , {marginLeft: windowWidth*0.1}]}>Contact No.</Text>
                <View>
                    <TextInput 
                    keyboardType='numeric'
                        style={styles.input}
                        onChangeText={(text) => {
                            setNum(text)
                        }}
                        value={num}
                        placeholder="Contact No." 
                    /> 
                </View>
            </View>
            <View style={{marginTop: 20}}>
                <Text style={[styles.labels , {marginLeft: windowWidth*0.1}]}>Description of Shop</Text>
                <View>
                    <TextInput
                    //keyboardType='number-pad'
                    numberOfLines={5} 
                    multiline={true}
                        style={styles.input}
                        onChangeText={(text) => {
                            setDesc(text)
                        }}
                        value={desc}
                        placeholder="Description of Your Shop" 
                    /> 
                </View>
            </View>
            {/* <View style={{marginTop: 20}}>
                <Text style={[styles.labels , {marginLeft: windowWidth*0.1}]}>Shop Timings</Text>
                <View>
                    <TextInput 
                        style={styles.input}
                        onChangeText={(text) => {
                            setTime(text)
                        }}
                        value={time}
                        placeholder="Shop Timings" 
                    /> 
                </View>
            </View> */}
            <View style={{marginTop: 20}}>
                <Text style={[styles.labels , {marginLeft: windowWidth*0.1}]}>UPI-ID </Text>
                <View>
                    <TextInput 
                        style={styles.input}
                        onChangeText={(text) => {
                            setId(text)
                        }}
                        value={id}
                        placeholder="UPI-ID" 
                    /> 
                </View>
                <Text style={{marginLeft:0.1*windowWidth,marginTop:9}}>This can be Gpay , Paytm or Phonepe upi id.</Text>
                <Text style={{marginLeft:0.1*windowWidth}}>Upi Id is not mandatory</Text>
            </View>
           <View style={{alignItems: "center" , marginTop: 15}}>
                <TouchableOpacity style={styles.submit} onPress={goToSignup3}>
                     <Text style={{color: "white" , fontFamily: 'Montserrat-Bold' , fontSize: windowHeight*0.025 }} >
                         Next
                     </Text>
                </TouchableOpacity>
            </View>   
            </KeyboardAvoidingView>   
        </ScrollView>

            <View style={{
                position:'absolute',
                bottom:0,
                right:0
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
    width: windowWidth*0.8,
    marginLeft: windowWidth*0.1 ,
    marginTop: 8,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: "#7c7c7c",
    fontFamily: "Montserrat-Light",
    padding: 10,
    textAlignVertical:'top'
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

export default SellerSignUp2;