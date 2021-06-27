import axios from 'axios';
import * as React from 'react';
import { View,ScrollView,ImageBackground,TouchableOpacity, Text,Button,FlatList,ActivityIndicator,Platform,Dimensions,Image,TextInput,StyleSheet,KeyboardAvoidingView } from 'react-native';
import { Header } from '@react-navigation/stack';
import ImageCropPicker from 'react-native-image-crop-picker';
import storage from '@react-native-firebase/storage';
import ErrorModal from './ConsumerComponents/ErrorModal';

const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

function generateString(length) {
    let result = ' ';
    const charactersLength = characters.length;
    for ( let i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
}

const {height,width} = Dimensions.get('window')
function ConsumerSignup1(props) {
    const [name,setName] = React.useState('');
    const [contact,setContact] = React.useState('');
    const [imgUrl,setImgUrl] = React.useState('https://firebasestorage.googleapis.com/v0/b/insh-23c7f.appspot.com/o/%20Qmizrk9a0?alt=media&token=0b136c8d-48ca-4671-8815-6bc2f0d84593');
    const [path,setPath] = React.useState(null);
    const [loading,setLoading] = React.useState(false);
    const keyboardVerticalOffset = Platform.OS === 'ios' ? 40 : 40
    const [err,showErr] = React.useState(false);
    const [heading,setHeading] = React.useState('')
    const [error,setError] = React.useState('')

    const closeErr = () => {
        showErr(false)
    }

    console.log(props.route)
    const email = props.route.params.email
    const password = props.route.params.password

    const selectImage = () => {
        ImageCropPicker.openPicker({
            cropping:true
        }).then(image => {
            console.log(image);
            var [category, extension] = image.mime.split("/")
            const media=[];
             var media1 = { uri: image.path, width: image.width, height: image.height, mime:image.mime, type: category }
             media.push(media1)
             setPath(media)
        })
    }

    const checkNameAndContact = () => {
        if(name.length===0 || contact.length===0) {
            setHeading('Invalid Credential')
            setError('Name and Contact Number must Not be empty !')
            showErr(true)
            setLoading(false)
        } else if(contact.length!==10){
            setHeading('Invalid Credential')
            setError('Contact Number must be of 10 digits !')
            showErr(true)
            setLoading(false)
        } else {
            uploadImageToFirebase()
        }
    }

    const uploadImageToFirebase = async() => {
        if(path){
            setLoading(true);
            const name = generateString(9);
            let reference = storage().ref(name);
            await reference.putFile(path[0].uri)
            let url = await reference.getDownloadURL();
            console.log(url);
            await setImgUrl(url);
            setLoading(false);
            return props.navigation.push('ConsumerSignup2',{email,password,name,contact,imgUrl:url})
        } else {
            return props.navigation.push('ConsumerSignup2',{email,password,name,contact,imgUrl})
        }
    }

    return (
        <KeyboardAvoidingView keyboardVerticalOffset={-500} behavior="padding" enabled style={{flex:1,backgroundColor:'white'}}>
            <ScrollView>
            <ErrorModal visible={err} onClose={closeErr} heading={heading} error={error} />
            <ImageBackground source={require('../../images/bg1.jpg')} resizeMode="cover" style={{height:height/1.75,width:width,justifyContent:'center'}} >
                <TouchableOpacity onPress={selectImage}>
                    {
                        path ?
<Image source={path} style={{height:width/2.5,borderRadius:width/5,marginBottom:15,width:width/2.5,alignSelf:'center'}} />                      :
                        <Image source={require('../../images/noimg.webp')} style={{height:width/2.5,borderRadius:width/5,marginBottom:15,width:width/2.5,alignSelf:'center'}} />

                    }
                    </TouchableOpacity>
                <Text style={{color:'white',fontSize:29,fontWeight:'600',alignSelf:'center'}}>Choose Your Profilepic</Text>
                </ImageBackground>
                <View style={{flexDirection:'row'}}>
                    <TextInput style={styles.input} value={name} placeholder="Name" onChangeText={(val) => setName(val)} />
                </View>
                <View style={{flexDirection:'row'}}>
                    <TextInput keyboardType='number-pad' style={styles.input} value={contact} placeholder="Contact" onChangeText={(val) => setContact(val)} />
                </View>
                <View>
                    <TouchableOpacity onPress={checkNameAndContact} style={{width:width-75,alignItems:'center',marginTop:25,borderRadius:9,height:50,backgroundColor:'#ff4500',alignSelf:'center',justifyContent:'center'}}>
                        <View>
                        <Text style={{color:'white',fontSize:21}}>{
                        loading?
                    <ActivityIndicator color="white" size="large" />
                :
                'NEXT'
                }</Text>
                        </View>
                    </TouchableOpacity>
                    <View style={{alignItems:'center',marginTop:15,marginBottom:15}}>
                        <Text>OR</Text>
                    </View>
                    <TouchableOpacity onPress={() => props.navigation.pop()} style={{width:width-75,alignItems:'center',marginTop:0,borderRadius:9,height:50,backgroundColor:'white',borderWidth:1,borderColor:'gray',alignSelf:'center',justifyContent:'center'}}>
                        <View>
                        <Text style={{color:'gray',fontSize:21}}>Log in</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    )
}

//() => props.navigation.push('ConsumerSignup2',{email,password,name,contact})

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

export default ConsumerSignup1;