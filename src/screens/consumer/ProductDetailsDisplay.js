import * as React from 'react';
import axios from 'axios'
import { View, Text, AsyncStorage,FlatList,BackHandler,ScrollView,Dimensions,Image ,TouchableOpacity,TouchableWithoutFeedback} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'
import { useNavigation } from '@react-navigation/native';
import { url } from '../../api/api';
import { addToCart , removeFromCart} from '../../redux/consumer/actions/cartActions';
import PropTypes from 'prop-types';
import {connect} from 'react-redux'
import AntDesign from 'react-native-vector-icons/AntDesign';
import Share from 'react-native-share'
import messaging from '@react-native-firebase/messaging';
import ImgToBase64 from 'react-native-image-base64';
import FastImage from 'react-native-fast-image';

const {height,width} = Dimensions.get('window')

function ConsumerProductDetailsDisplay(props) {

    const [product,setProduct] = React.useState([])
    const [loading,setLoading] = React.useState(true)
    const [si,setSi] = React.useState(0);
    const [index, setIndex] = React.useState(0);
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

    const shareHandler = () => {
        console.log("called")
        let img = ""
       // setShareLoading(true);
        ImgToBase64.getBase64String(product.product_image[0])
        .then(base64String => {
         img = 'data:image/jpeg;base64,' + base64String
         Share.open({
            title:`Share My Shop ${product.product_name}`,
            message:`Checkout this product ${product.product_name} of just Rs ${product.product_price} on DirectMart by clicking on this link https://www.localapp.in/shop/product/${product.product_id} \n\n If you have not installed the app install it from playstore by this link \n\n https://play.google.com/store/apps/details?id=com.localApp`,
            url:img
        }
        ).then((res) => {
            console.log(res)
            //setShareLoading(false)
        }).catch((err) => {
            console.log(err)
            //setShareLoading(false)
        })
        })
    }

    const getProductDetails = async() => {
        const id = props.route.params.product_id
        //var token = await AsyncStorage.getItem('user_token')
        axios.get(`${url}/consumer/productForDisplay/${id}`).then((res) => {
            console.log(res.data);
            setProduct(res.data[0])
            setLoading(false)
        })
    }

    React.useEffect(() => {
        //console.warn(index);
        setIndex(index);
        setSi(index)
    }, [index]);

    React.useEffect(() => {
        if(props.route.params.product_id){
            getProductDetails()
        } else {
            var product = props.route.params.product
            setProduct(product);
            setLoading(false);
        }
    },[])

    /* React.useEffect(() => {
        const backAction = () => {
        if(props.route.params.product_id){
            props.navigation.replace('allShops')
        } else {
            props.navigation.pop()
        }
        return true;
        };
    
        const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        backAction
        );
    
        return () => backHandler.remove();
    }, []);  */

    return (
        <ScrollView style={{flex:1,backgroundColor:'white'}}>
            {
                loading ?
                <View style={{backgroundColor:'white',flex:1,alignItems:'center',justifyContent:'center'}}>
                    <Image source={require('../../images/l2.gif')} resizeMode='contain' style={{width:width}} />
                </View>
                :
                <ScrollView style={{flex:1}}>
                       <View style={{paddingHorizontal:15,padding:15}}>
                       <Text numberOfLines={2} style={{color:'black',fontSize:25}}>{product.product_name}</Text>
                       </View>
                    <View>
                    <FlatList
                onScroll={onScroll}
                   style={{height:width}}
                   showsHorizontalScrollIndicator={false}
                   pagingEnabled={true}
                   data={product.product_image}
                   horizontal={true}
                   renderItem={({item,index}) => {
                       return (
                                    <TouchableWithoutFeedback>
                                    <FastImage resizeMode='contain' source={{uri:item}} style={{width:width,height:width}}/>

                                    </TouchableWithoutFeedback>                                                             
                                     
                       )
                   }}
                   />
                        </View>
                   <View style={{justifyContent:'center',alignItems:'center'}}>
                   <FlatList
                        horizontal
                        data={product.product_image}
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
                           product.product_description &&
                           <View style={{paddingHorizontal:15}}>
                               <Text numberOfLines={9} style={{color:'gray',fontSize:16.5}}>{product.product_description}</Text>
                           </View>
                       }
                         <View style={{paddingHorizontal:15,padding:5}}>
                       <Text numberOfLines={2} style={{color:'black',fontSize:25}}>Rs {product.product_price}</Text>
                       </View>
                       <View style={{paddingHorizontal:15}}>
                               <Text numberOfLines={3} style={{color:'gray',fontSize:16.5}}>{product.product_type}</Text>
                        </View>
                        <View>
                        <View>
                </View>
                        </View>
                        <TouchableWithoutFeedback onPress={shareHandler}>
                        <View style={{flexDirection:'row',alignItems:'center',margin:15}}>
                            <TouchableOpacity onPress={shareHandler}>
                            <AntDesign name='sharealt' size={25} color='black'/>
                            </TouchableOpacity>
                            <Text style={{color:'black',fontSize:18.5,marginLeft:5}}>Share this Product</Text>
                        </View>
                        </TouchableWithoutFeedback>
                        <View>
                        <TouchableWithoutFeedback onPress={() => props.navigation.push('ConsumerSignin')}>
                            <View style={{alignItems:'center',backgroundColor:'#ff6347',borderRadius:15,marginBottom:5,marginHorizontal:15,padding:9}}>
                            <Text style={{fontSize:16.5,color:'white'}}>Login to Order</Text>
                            </View>
                        </TouchableWithoutFeedback>
                        </View>
                </ScrollView>
            }
        </ScrollView>
    )
}

export default ConsumerProductDetailsDisplay