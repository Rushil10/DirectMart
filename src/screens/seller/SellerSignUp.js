import React, { Component , useState , useEffect } from 'react';
import { Text , View , Dimensions , StyleSheet , Image , TextInput , TouchableOpacity , KeyboardAvoidingView, ScrollView , AsyncStorage , FlatList} from 'react-native';
import Navbar from '../../components/Navbar'
import ErrorModal from '../consumer/ConsumerComponents/ErrorModal';
import jwtDecode from 'jwt-decode';
import Icon from 'react-native-vector-icons/AntDesign'
import ImageCropPicker from 'react-native-image-crop-picker';
import storage from '@react-native-firebase/storage';
import DropDownPicker from 'react-native-dropdown-picker';



const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

function SellerSignUp (props) {

    const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    const [sname , setSname] = useState("");
    const [oname , setOname] = useState("");
    const [uname , setUname] = useState("");
    const [pass , setPass] = useState("");
    const [rpass , setrpass] = useState("");
    const [mloading,setMloading] = React.useState(false);
    const [mimages,setMimages] = React.useState([])
    const [path,setPath] = React.useState(null);
    const [img , setImg] = useState(null)
    const [pl,setPl] = React.useState(false);
    const [open, setOpen] = useState(false);
    const flatListRef =React.useRef(null);
    const [si,setSi] = React.useState(0);
    const [index, setIndex] = React.useState(0);
    const [loading,setLoading] = React.useState(false);


    
    const [err,showErr] = React.useState(false);
    const [heading,setHeading] = React.useState('')
    const [error,setError] = React.useState('')

    let imgNew = ""

    const closeErr = () => {
        console.log(props.route.params.type);
        showErr(false)
    }

    function generateString(length) {
        let result = ' ';
        const charactersLength = characters.length;
        for ( let i = 0; i < length; i++ ) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }

    useEffect(() => {
        console.log(props.route.params.type);
        console.log("HERE" , mimages);
        if(props.route.params.type === "edit")
        {
            //WE CAN EDIT PROFILE FROM HERE
            getDetails()
            
        }
    } , []);

    const indexRef = React.useRef(index);

    indexRef.current = index;

    const onScroll = React.useCallback((event) => {
        const slideSize = event.nativeEvent.layoutMeasurement.width;
        const index = event.nativeEvent.contentOffset.x / slideSize;
        const roundIndex = Math.round(index);
        console.log(event.nativeEvent,'eventtt')
        const distance = Math.abs(roundIndex - index);
        const isNoMansLand = 0.4 < distance;

        if (roundIndex !== indexRef.current && !isNoMansLand) {
            setIndex(roundIndex);
        }
    }, []);

    var pattern = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/; 

    const selectImage = () => {
        ImageCropPicker.openPicker({
            cropping:true
        }).then(image => {
            setMloading(true);
            console.log(image);
            var [category, extension] = image.mime.split("/")
            console.log(category);
            const media=[];
             var media1 = { uri: image.path, width: image.width, height: image.height, mime:image.mime, type: category }
             media.push(media1)
             setPath(media)
             var prev = mimages
             prev.push(media)
             setMimages(prev)
             setMloading(false)
        })
    }

    const uploadImageToFirebase = async() => {
        if(path){
            const name = generateString(9);
            let reference = storage().ref(name);
            console.log("URL");
            await reference.putFile(path[0].uri)
            let url = await reference.getDownloadURL();
            await setImg(url);
            console.log("*");
            console.log(url);
            imgNew = url;
            console.log("*");
        } else {
            console.log("No image");
        }
    }
    
    const removeImage = async(index) => {
        console.log('called ')
        await setMloading(true)
        var mim = mimages
        mim.splice(index, 1)
        setMimages(mim)
        setMloading(false)
    }

    const uploadMultipleImages = async() => {
        var images = []
        if(name.length===0 || qty.length===0 || price.length===0 || description.length==0) {
            setHeading('Insufficient Data')
            setError('Name , Quantity , Price , Description and Type must Not be empty !')
            showErr(true)
        } else if(mimages.length===0){
            setHeading('Upload Image')
            setError('You must upload atleast 1 image !')
            showErr(true)
        } else if(value.length===0){
            setHeading('Product Type')
            setError('Product Type must not be empty !')
            showErr(true)
        } else {
            setPl(true);
            for(var i=0;i<mimages.length;i++){
                const name = generateString(9);
                console.log(name)
                console.log(mimages[i][0].uri)
                let reference = storage().ref(name.toString())
                await reference.putFile(mimages[i][0].uri)
                let url = await reference.getDownloadURL()
                images.push(url)
            }
            submitHandler(images)
        }
    }

    const getDetails = async () => {
        var token = await AsyncStorage.getItem('shop_token');
        var decode = jwtDecode(token);
        console.log(decode);
        let setter = {
            uri: decode.shop_image
        }
        setSname(decode.shop_name)
        setOname(decode.shop_owner)
        setUname(decode.shop_email)
        setMimages([setter])
        setPass("xxxxxxxxx")
        setrpass("xxxxxxxxx")
    }

    const goToSignup2 = async () => {
        if(sname.length===0 || oname.length===0 || uname.length===0 || pass.length===0 || rpass.length===0){
            setHeading('Invalid Credential')
            setError('Shop Name , Owner Name , Email and Password must Not be empty !')
            console.log(props.route.params.type);
            showErr(true)
            //setLoading(false)
        } else if(!uname.match(pattern)) {
            setHeading('Invalid Credential')
                setError('Enter a Valid Email !')
                showErr(true)
                //setLoading(false)
        } else {
            setLoading(true)
            var token = await AsyncStorage.getItem('shop_token');
            if(token)
            {
                var decode = jwtDecode(token);
            }
            await uploadImageToFirebase();
            setLoading(false)
            props.navigation.push("SellerSignUp2" , {
                sname : sname,
                oname : oname,
                uname : uname,
                pass  : pass ,
                rpass : rpass,
                type: props.route.params.type,
                decode: decode,
                image: imgNew
            })
        }
    }

    return (

         loading ? <View style={{backgroundColor:'white',flex:1,alignItems:'center',justifyContent:'center'}}>
                    <Image source={require('../../../assets/loader/1490.gif')} resizeMode='contain' style={{width:windowWidth}} />
                     <Text style={styles.labels}>Uploading Image...</Text>
                </View> :
      
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
                <Text style={{fontSize: windowWidth*0.075 , fontFamily: "Montserrat-Bold"}}>{props.route.params.type === "edit" ? "Edit your profile" :"New to SHOPY" } </Text>
                <Text style={styles.labels}>{props.route.params.type === "edit" ? "you can edit all your shop details here !" :"Register Here" }</Text>
            </View>
            {
                !mloading &&
                (
                    mimages.length>0 ?
                    <View style={{borderWidth:0.75,borderColor:'gray',marginLeft:9,marginRight:9,borderRadius:5,marginTop:windowHeight*0.08}}>
                    <FlatList
                    ref={flatListRef}
                    onContentSizeChange={() => flatListRef.current.scrollToEnd({animated:true})}
                onScroll={onScroll}
                   style={{height:windowWidth}}
                   showsHorizontalScrollIndicator={false}
                   pagingEnabled={true}
                   data={mimages}
                   horizontal={true}
                   renderItem={({item,index}) => {
                       console.log("ITEM HERE ))))))))))))))))",item);
                       return (
                                <View>
                                    <TouchableOpacity onPress={() => removeImage(index)} style={{position:'absolute',top:0,right:0,padding:9,zIndex:1}}>
                                        <Icon name='delete' color='red' size={29} />
                                        </TouchableOpacity>
                                    <Image resizeMode='contain' source={item} style={{width:windowWidth-18,height:windowWidth}}/>
                                </View>                                                             
                                     
                       )
                   }}
                   />
                    </View>
                    :
                    <View style={{marginTop: 20 , alignItems: "center",height:windowWidth,justifyContent:'center'}}>
                <TouchableOpacity onPress={() => {selectImage()}}>
                 <Image
                    style={{
                    height: windowWidth/2.5,
                    width: windowWidth/2.5,
                  }}
                     source={require('../../images/addImageIcon.png')}
                 />
                </TouchableOpacity>
                <Text style={[styles.labels ]}>Add Your Shop Images</Text>
            </View>
                )
            }
                {
                   mimages &&
                   <View style={{justifyContent:'center',alignItems:'center'}}>
                      <FlatList
                           horizontal
                           data={mimages}
                           renderItem ={({item,index}) => 
                           index===si?
                           <View style={{height:5.5,width:5.5,backgroundColor:'#ff6347',borderRadius:2.75,margin:5}}>
                               </View> :
                               <View style={{height:5,width:5,backgroundColor:'grey',borderRadius:2.5,margin:5}}>
                                   </View>
                       }
                           
                          />
                           </View>
               }
            {/* {
                mimages.length >0 &&
                <View style={{alignItems:'center',marginTop:9}}>
                    <TouchableOpacity style={{alignItems:'center',width:windowWidth/2,backgroundColor:'#0ae38c',borderRadius:9}} onPress={selectImage}>
                <View style={{padding:9}}>
                    <Text style={{color:'white',fontSize:19}}>Add Another Image</Text>
                </View>
                </TouchableOpacity>
                    </View>
            } */}


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
            {props.route.params.type != "edit" ? <View style={{marginTop: 20}}>
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
            </View>  : <View /> }
            {props.route.params.type != "edit" ? <View style={{marginTop: 20}}>
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
            </View> : <View /> }
            {props.route.params.type != "edit" ? <View style={{marginTop: 20}}>
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
            </View> : <View /> }
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