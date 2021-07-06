import axios from "axios"
import React, {useState } from 'react';
import { Text , View , Dimensions,TouchableWithoutFeedback,FlatList , StyleSheet , Image , TextInput , TouchableOpacity , ScrollView ,AsyncStorage , ActivityIndicator} from 'react-native';
import ImageCropPicker from 'react-native-image-crop-picker';
import storage from '@react-native-firebase/storage';
import DropDownPicker from 'react-native-dropdown-picker';
import Icon from 'react-native-vector-icons/AntDesign'
import url from '../../api/api'
import ErrorModal from "../consumer/ConsumerComponents/ErrorModal";

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

    let imgNew = ""
    
    const [name , setName] = useState("");
    const [price , setPrice] = useState("");
    const [qty , setQty] = useState("");
    const [description , setDescription] = useState("");
    const [path,setPath] = React.useState(null);
    const [img , setImg] = useState(null)
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [value, setValue] = useState('packaged');
    const [pl,setPl] = React.useState(false);
    const flatListRef =React.useRef(null);
    const [items, setItems] = useState([
      {label: 'Packaged', value: 'Packaged'},
      {label: 'Clothing', value: 'Clothing'},
      {label: 'Daily Needs', value: 'Daily Needs'},
      {label: 'Others', value: 'Others'}
     ]);
    const [mimages,setMimages] = React.useState([])
    const [si,setSi] = React.useState(0);
    const [index, setIndex] = React.useState(0);
    const indexRef = React.useRef(index);
    const [mloading,setMloading] = React.useState(false);
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

    const [err,showErr] = React.useState(false);
    const [heading,setHeading] = React.useState('')
    const [error,setError] = React.useState('')

    const closeErr = () => {
        showErr(false)
    }

    React.useEffect(() => {
        //console.warn(index);
        setIndex(index);
        setSi(index)
    }, [index]);


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
        } else if(qty==='0' || price==='0') {
            setHeading('Invalid Data')
            setError('Price And Quantity cannot be 0 !')
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


    const submitHandler = async(images) => {
        setLoading(true);

        let product = {
            product_name: name,
            product_price: price,
            product_quantity: qty, 
            product_description: description,
            product_image: images,
            product_type: value
        }
        
        if(name == null || price== null || qty == null || description == null || value == null)
        {
            console.log("Comming here");
            setHeading("Empty Feild")
            setError("Product Name , price , quantity , description , image or type might not be set please chechk")
            setError(true)
        }
        else{
            setLoading(true);
            await uploadImageToFirebase();       
            var token = await AsyncStorage.getItem('shop_token');
        console.log(token);

        console.log(product);

        console.log(props);
        props.route.params.addProducts(product)

        setTimeout(function(){ 
            setLoading(false)
         }, 3000);
         setPl(false)
    }
    }


    return (
        <View style={{flex: 1 , backgroundColor: "white"}}>
            <View style={{
                position:'absolute',
                top:0,
                left:0
            }}>
            <Image
              style={{
                  height: windowHeight*0.08,
                  width: windowHeight*0.08,
                  marginTop: -1
                }}
              source={require('../../../assets/loginImages/AngleTopLeft.png')}
              />
            </View>
                <ErrorModal visible={err} onClose={closeErr} heading={heading} error={error} />

            { loading ? <View style={{backgroundColor:'white',flex:1,alignItems:'center',justifyContent:'center'}}>
                    <Image source={require('../../../assets/loader/1490.gif')} resizeMode='contain' style={{width:windowWidth}} />
                </View> :  


              <ScrollView style={{flex:1}}>
            <View>
            <ErrorModal color='#0ae387' visible={err} onClose={closeErr} heading={heading} error={error} />
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
                <Text style={[styles.labels ]}>Add Product Images</Text>
            </View>
                )
            }
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
            {
                mimages.length >0 &&
                <View style={{alignItems:'center',marginTop:9}}>
                    <TouchableOpacity style={{alignItems:'center',width:windowWidth/2,backgroundColor:'#0ae38c',borderRadius:9}} onPress={selectImage}>
                <View style={{padding:9}}>
                    <Text style={{color:'white',fontSize:19}}>Add Another Image</Text>
                </View>
                </TouchableOpacity>
                    </View>

            }
            

            <View style={{marginTop: 20}}>
                <Text style={[styles.labels , {marginLeft: windowWidth*0.1}]}>Product Name</Text>
                <View>
                    <TextInput 
                        style={styles.input}
                        onChangeText={(text) => {
                            setName(text)
                        }}
                        value={name}
                        placeholder="Product Name"
                    />
                </View>
            </View>
            <View style={{marginTop: 20}}>
                <Text style={[styles.labels , {marginLeft: windowWidth*0.1}]}>Product Price</Text>
                <View>
                    <TextInput 
                    keyboardType='number-pad'
                        style={styles.input}
                        onChangeText={(text) => {
                            setPrice(text)
                        }}
                        value={price}
                        placeholder="Price"
                        keyboardType="number-pad"
                    />
                </View>
            </View>
            <View style={{marginTop: 20}}>
                <Text style={[styles.labels , {marginLeft: windowWidth*0.1}]}>Product Quantity</Text>
                <View>
                    <TextInput 
                    keyboardType='number-pad'
                        style={styles.input}
                        onChangeText={(text) => {
                            setQty(text)
                        }}
                        value={qty}
                        placeholder="Quantity"
                        keyboardType="number-pad"
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
                    numberOfLines={5} 
                    multiline={true}
                        style={styles.input2}
                        onChangeText={(text) => {
                            setDescription(text)
                        }}
                        value={description}
                        placeholder="Describe your product"
                    />
                </View>
            </View>
                
        </View>
        

       {
           !pl ?
           <View style={{alignItems: "center" , marginTop: 15,marginBottom:45}}>
           <TouchableOpacity style={styles.submit} onPress={uploadMultipleImages}>
                <Text style={{color: "white" , fontFamily: 'Montserrat-Bold' , fontSize: windowHeight*0.025 }} >
                    Save Product
                </Text>
           </TouchableOpacity>
       </View>  
       :
       <View style={{alignItems: "center" , marginTop: 25,marginBottom:45}}>
           <ActivityIndicator color='#0ae387' size={45} />
       </View>
       }

        </ScrollView> }

            <View style={{
                position:'absolute',
                bottom:0,
                right:0
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
  input2:{
    //height: windowHeight*0.05,
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

export default AddProducts