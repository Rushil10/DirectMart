import axios from "axios"
import React, {useState } from 'react';
import { Text , View , Dimensions , StyleSheet , Image , TextInput , TouchableOpacity , ScrollView ,AsyncStorage , ActivityIndicator} from 'react-native';
import ImageCropPicker from 'react-native-image-crop-picker';
import storage from '@react-native-firebase/storage';
import DropDownPicker from 'react-native-dropdown-picker';
import url from '../../api/api'

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

function generateString(length) {
    let result = ' ';
    const charactersLength = characters.length;
    for ( let i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

function AddProducts (props) {
    
    const [name , setName] = useState("");
    const [price , setPrice] = useState("");
    const [qty , setQty] = useState("");
    const [description , setDescription] = useState("");
    const [path,setPath] = React.useState(null);
    const [img , setImg] = useState("")
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [value, setValue] = useState(null);
    const [items, setItems] = useState([
      {label: 'Type 1', value: '1'},
      {label: 'Type 2', value: '2'},
      {label: 'Type 3', value: '3'}
     ]);


    const selectImage = () => {
        ImageCropPicker.openPicker({
            cropping:true
        }).then(image => {
            console.log(image);
            var [category, extension] = image.mime.split("/")
            console.log(category);
            const media=[];
             var media1 = { uri: image.path, width: image.width, height: image.height, mime:image.mime, type: category }
             media.push(media1)
             setPath(media)
        })
    }

    const uploadImageToFirebase = async() => {
        if(path){
            
            const name = generateString(9);
            let reference = storage().ref(name);
            await reference.putFile(path[0].uri)
            let url = await reference.getDownloadURL();
            setImg(url);
            console.log(url);
        } else {
            console.log("No image");
        }
    }

    const submitHandler = async() => {
        setLoading(true);
        await uploadImageToFirebase();
        let product = {
            product_name: name,
            product_price: price,
            product_quantity: qty, 
            product_description: description,
            product_image: img,
            product_type: value
        }

        var token = await AsyncStorage.getItem('shop_token');
        console.log(token);

        console.log(product);

        console.log(props);
        props.route.params.addProducts(product)

        setTimeout(function(){ 
            setLoading(false)
         }, 3000);

    }



    return (
        <View style={{flex: 1 , backgroundColor: "white"}}>
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

            { loading ? <View style={{backgroundColor:'white',flex:1,alignItems:'center',justifyContent:'center'}}>
                    <Image source={require('../../../assets/loader/1490.gif')} resizeMode='contain' style={{width:windowWidth}} />
                </View> :  


              <ScrollView>
            <View>


                {path == null ? <View style={{marginTop: 20 , alignItems: "center"}}>
                <TouchableOpacity onPress={() => {selectImage()}}>
                 <Image
                    style={{
                    height: windowHeight*0.08,
                    width: windowHeight*0.08,
                  }}
                     source={require('../../images/addImageIcon.png')}
                 />
                </TouchableOpacity>
                <Text style={[styles.labels ]}>Add Product Images</Text>
            </View> : <View style={{alignItems: "center"}}>
            <Image
              style={{
                height: windowHeight*0.2,
                width: windowHeight*0.2,
                borderRadius: 20
              }}
              source={path}
            />
            </View> }

            

            <View style={{marginTop: 20}}>
                <Text style={[styles.labels , {marginLeft: windowWidth*0.1}]}>Product Name</Text>
                <View>
                    <TextInput 
                        style={styles.input}
                        onChangeText={(text) => {
                            setName(text)
                        }}
                        value={name}
                        placeholder="Shop Address"
                    />
                </View>
            </View>
            <View style={{marginTop: 20}}>
                <Text style={[styles.labels , {marginLeft: windowWidth*0.1}]}>Product Price</Text>
                <View>
                    <TextInput 
                        style={styles.input}
                        onChangeText={(text) => {
                            setPrice(text)
                        }}
                        value={price}
                        placeholder="Shop Address"
                    />
                </View>
            </View>
            <View style={{marginTop: 20}}>
                <Text style={[styles.labels , {marginLeft: windowWidth*0.1}]}>Product Quantity</Text>
                <View>
                    <TextInput 
                        style={styles.input}
                        onChangeText={(text) => {
                            setQty(text)
                        }}
                        value={qty}
                        placeholder="Shop Address"
                    />
                </View>
            </View>
            <View style={{marginTop: 20}}>
                <Text style={[styles.labels , {marginLeft: windowWidth*0.1}]}>Product Type</Text>
                <View>
                <DropDownPicker
                 style={styles.input}
                 textStyle={{
                    fontFamily: "Montserrat-Light"
                  }}
                  dropDownContainerStyle={{
                    width: windowWidth*0.8,
                    marginLeft: windowWidth*0.1,
                    marginTop: 8,
                    borderWidth: 1,
                    borderRadius: 5,
                    borderColor: "#7c7c7c",
                    fontFamily: "Montserrat-Light",
                    padding: 10
                  }}
                 open={open}
                 value={value}
                 items={items}
                 setOpen={setOpen}
                 setValue={setValue}
                 setItems={setItems}
               />
                </View>
            </View>

            <View style={{marginTop: 20}}>
                <Text style={[styles.labels , {marginLeft: windowWidth*0.1}]}>Product Description</Text>
                <View>
                    <TextInput 
                        style={styles.input}
                        onChangeText={(text) => {
                            setDescription(text)
                        }}
                        value={description}
                        placeholder="Shop Address"
                    />
                </View>
            </View>
                
        </View>
        

        <View style={{alignItems: "center" , marginTop: 15}}>
                <TouchableOpacity style={styles.submit} onPress={submitHandler}>
                     <Text style={{color: "white" , fontFamily: 'Montserrat-Bold' , fontSize: windowHeight*0.025 }} >
                         Save Product
                     </Text>
                </TouchableOpacity>
            </View>  

        </ScrollView> }

            <View style={{
                flex: 1,
                alignItems: "flex-end",
                justifyContent: "flex-end",
                }}>
           
            <Image
              style={{
                height: windowHeight*0.08,
                width: windowHeight*0.08,
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

export default AddProducts;