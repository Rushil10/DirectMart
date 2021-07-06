import axios from "axios"
import React, {useEffect, useState } from 'react';
import { Text , View , Dimensions,FlatList , StyleSheet , Image , TextInput , TouchableOpacity , ScrollView ,AsyncStorage ,ActivityIndicator} from 'react-native';
import ImageCropPicker from 'react-native-image-crop-picker';
import storage from '@react-native-firebase/storage';
import DropDownPicker from 'react-native-dropdown-picker';
import { updateProducts } from '../../redux/seller/actions/productActions';
import { connect } from 'react-redux';
import url from '../../api/api'
import Icon from 'react-native-vector-icons/AntDesign'
import ErrorModal from "../consumer/ConsumerComponents/ErrorModal";
import { setStatusBarNetworkActivityIndicatorVisible } from "expo-status-bar";
import Share from 'react-native-share'
import messaging from '@react-native-firebase/messaging';
import ImgToBase64 from 'react-native-image-base64';

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

function ProductDetails (props) {
    
    const [id , setId] = useState("");
    const [product,setPr] = React.useState({})
    const [name , setName] = useState("");
    const [price , setPrice] = useState("");
    const [qty , setQty] = useState("");
    const [description , setDescription] = useState("");
    const [path,setPath] = React.useState(null);
    const [img , setImg] = useState("")
    const [open, setOpen] = useState(false);
    const flatListRef =React.useRef(null);
    const [loading, setLoading] = useState(false);
    const [value, setValue] = useState('packaged');
    const [items, setItems] = useState([
        {label: 'Packaged', value: 'packaged'},
        {label: 'Clothing', value: 'Clothing'},
        {label: 'Daily Needs', value: 'Daily Needs'},
        {label: 'Others', value: 'Others'}
     ]);
    const [mimages,setMimages] = React.useState([])
    const [si,setSi] = React.useState(0);
    const [index, setIndex] = React.useState(0);
    const indexRef = React.useRef(index);
    const [pl,setPl] = React.useState(false);
    const [mloading,setMloading] = React.useState(true);
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

    const shareHandler = () => {
        setSl(true)
        console.log("called")
        let img = ""
       // setShareLoading(true);
        ImgToBase64.getBase64String(product.product_image[0])
        .then(base64String => {
         img = 'data:image/jpeg;base64,' + base64String
         Share.open({
            title:`Share My Shop ${product.product_name}`,
            message:`Checkout this product ${product.product_name} of my shop of just Rs ${product.product_price} on localapp by clicking on this link \n https://www.localapp.in/shop/product/${product.product_id} \n\n If you have not installed the app install it from playstore by this link `,
            url:img
        }
        ).then((res) => {
            console.log(res)
            setSl(false)
            //setShareLoading(false)
        }).catch((err) => {
            console.log(err)
            setSl(false)
            //setShareLoading(false)
        })
        })
    }

    const [err,showErr] = React.useState(false);
    const [heading,setHeading] = React.useState('')
    const [error,setError] = React.useState('')
    const [sl,setSl] = React.useState(false)

    const closeErr = () => {
        showErr(false)
    }
    const [tot,setTot] = React.useState("")
    const [inc,setInc] = React.useState("0")
    const [dec,setDec] = React.useState("0")

    const selectImage = () => {
        ImageCropPicker.openPicker({
            cropping:true
        }).then(image => {
            setMloading(true);
            console.log(image);
            var [category, extension] = image.mime.split("/")
            console.log(category);
            const media=[];
             var media1 = { uri: image.path,isUploaded:false, width: image.width, height: image.height, mime:image.mime, type: category }
             media.push(media1)
             setPath(media)
             var prev = mimages
             prev.push(media)
             setMimages(prev)
             setMloading(false)
        })
    }

    React.useEffect(() => {
        //console.warn(index);
        setIndex(index);
        setSi(index)
    }, [index]);


     const fetchProductDetails = (product) => {

        console.log("&*^" , product);
        setPr(product)
        setId(product.product_id);
        setPrice(product.product_price.toString()); 
        setName(product.product_name);
        setValue(product.product_type)
        console.log("******");
        setQty(product.product_quantity.toString()); 
        setTot(product.product_quantity.toString())
        setDescription(product.product_description)
        setImg(product.product_image[0])
        setPath(product.product_image[0])
        // setItems({label: product.product_type})
     }

     const uploadToFireabse = async() => {
        var images = []
        if(name.length===0 || qty.length===0 || price.length===0 || description.length===0) {
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
        } else if(Number(price)===0) {
            setHeading('Invalid Price')
            setError('Product Price must be greater than 0 !')
            showErr(true)
        } else {
            setPl(true);
            for(var i=0;i<mimages.length;i++){
                if(!mimages[i][0].isUploaded){
                    const name = generateString(9);
                console.log(name)
                console.log(mimages[i][0].uri)
                let reference = storage().ref(name.toString())
                await reference.putFile(mimages[i][0].uri)
                let url = await reference.getDownloadURL()
                images.push(url)
                } else {
                    images.push(mimages[i][0].uri)
                }
            }
            editHandler(images)
        }
     }

    const editHandler = (images) => {
        let product = {
            product_id: id,
            product_name: name,
            product_price: price,
            product_quantity: qty, 
            product_description: description,
            product_image: images,
            product_type: value,
            increase_quantity: inc,
            decrease_quantity: dec
        }

        props.updateProducts(product)
        setPl(false)

        props.navigation.navigate("Seller")

    }

    const setImageDetails = (product) => {
        setMloading(true)
        console.log(product.product_image)
        var allImages = []
        product.product_image.map(img => {
            var image = []
            var nimg = {uri:img,isUploaded:true}
            image.push(nimg)
            allImages.push(image)
        })
        setMimages(allImages)
        setMloading(false)
    }

    useEffect(() => {
        setLoading(true)
        console.log("HERE I AMA");
        console.log(props.route.params.item.item);
        fetchProductDetails(props.route.params.item.item);
        setImageDetails(props.route.params.item.item)
        setLoading(false)
    },[])

    const removeImage = async(index) => {
        console.log('called ')
        await setMloading(true)
        var mim = mimages
        mim.splice(index, 1)
        setMimages(mim)
        setMloading(false)
    }

    return (<View style={{flex:1}}>
        <View style={{
                position:'absolute',
                top:0,
                left:0,
                zIndex:1}}>
        <Image
          style={{
              height: windowHeight*0.08,
              width: windowHeight*0.08,
          }}
          source={require('../../../assets/loginImages/AngleTopLeft.png')}
          />
        </View> 
        {loading ?  <ActivityIndicator size="large" color="#00ff00" /> :
         <ScrollView style={{flex: 1, backgroundColor: "white"}}>
        <View>


            {/* {path == null ? <View style={{marginTop: 20 , alignItems: "center"}}>
            <TouchableOpacity onPress={() => {}}>
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
          source={{
              uri: img
          }}
        />
        </View> } */}
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
                    <View style={{position:'absolute',top:0,right:25}}>
                        <TouchableOpacity onPress={shareHandler} style={{width:45,height:45,padding:7.5,borderRadius:7.5,alignItems:'center',justifyContent:'center',backgroundColor:'#ff616d'}}>
                        {
                            !sl ?
                            <Icon name='sharealt' size={25} color='white' />
                            :
                            <ActivityIndicator color='white' size={21} />
                        }
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity onPress={selectImage} style={{alignItems:'center',width:windowWidth/2-45,backgroundColor:'#0ae38c',borderRadius:9}}>
                <View style={{padding:9}}>
                    <Text style={{color:'white',fontSize:19}}>Add Image</Text>
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
                    placeholder="Product Price"
                />
            </View>
        </View>
        <ErrorModal color='#0ae387' visible={err} onClose={closeErr} heading={heading} error={error} />
        <View style={{marginTop: 20}}>
            <Text style={[styles.labels , {marginLeft: windowWidth*0.1}]}>Product Quantity</Text>
            <View>
                <TextInput 
                keyboardType='number-pad'
                    style={styles.input}
                    /* onChangeText={(text) => {
                        setQty(text)
                    }} */
                    value={qty}
                    placeholder="Product Quantity"
                />
            </View>
        </View>
        <View style={{marginTop: 20}}>
            <Text style={[styles.labels , {marginLeft: windowWidth*0.1}]}>Increase Quantity By</Text>
            <View>
                <TextInput 
                keyboardType='number-pad'
                    style={styles.input}
                     onChangeText={(text) => {
                        setInc(text)
                        if(text.length>0){
                            var newTot = Number(qty) + Number(text) - Number(dec)
                        setTot(newTot.toString())
                        } else {
                            var newTot = Number(qty) - Number(dec)
                            setTot(newTot.toString())
                        }
                    }} 
                    value={inc}
                    placeholder="Increase Quantity BY"
                />
            </View>
        </View>
        <View style={{marginTop: 20}}>
            <Text style={[styles.labels , {marginLeft: windowWidth*0.1}]}>Decrease Quantity By</Text>
            <View>
                <TextInput 
                keyboardType='number-pad'
                    style={styles.input}
                     onChangeText={(text) => {
                        setDec(text)
                        if(text.length>0){
                            var newTot = Number(qty) - Number(text) + Number(inc)
                        setTot(newTot.toString())
                        } else {
                            var newTot = Number(qty) + Number(inc)
                            setTot(newTot.toString())
                        }
                    }} 
                    value={dec}
                    placeholder="Decrease Quantity By"
                />
            </View>
        </View>
        <View style={{marginTop: 20}}>
            <Text style={[styles.labels , {marginLeft: windowWidth*0.1}]}>Final Quantity</Text>
            <View>
                <TextInput 
                keyboardType='number-pad'
                    style={styles.input}
                     /* onChangeText={(text) => {
                        setDec(text)
                        var newTot = Number(tot) - Number(text)
                        setTot(newTot.toString())
                    }}  */
                    value={tot}
                    placeholder="Final Quantity"
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
                    placeholder="Description of your product"
                />
            </View>
        </View>
            
    </View>
    

    {
        !pl ?
        <View style={{alignItems: "center" , marginTop: 15,marginBottom:45}}>
            <TouchableOpacity style={styles.submit} onPress={uploadToFireabse}>
                 <Text style={{color: "white" , fontFamily: 'Montserrat-Bold' , fontSize: windowHeight*0.025 }} >
                     Save Changes
                 </Text>
            </TouchableOpacity>
        </View>  
        :
        <View style={{alignItems: "center" , marginTop: 25,marginBottom:45}}>
           <ActivityIndicator color='#0ae387' size={45} />
       </View>
    }

        
</ScrollView>
        }
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

const mapStateToProps = (state) => {
    return{
        products : state.sproducts.products
    }
}

const mapDispatchToProps = { 
    updateProducts
}

export default connect(mapStateToProps , mapDispatchToProps)(ProductDetails);