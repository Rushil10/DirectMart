import * as React from 'react';
import axios from 'axios'
import { View, Text, AsyncStorage,FlatList,ScrollView,Dimensions,Image ,TouchableOpacity,TouchableWithoutFeedback} from 'react-native';
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

const {height,width} = Dimensions.get('window')

function ConsumerProductDetails(props) {

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
            message:`Checkout this product ${product.product_name} of just Rs ${product.product_price} on localapp by clicking on this link https://www.localapp.in/shop/product/${product.product_id} \n\n If you have not installed the app install it from playstore by this link `,
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


    React.useEffect(() => {
        //console.warn(index);
        setIndex(index);
        setSi(index)
    }, [index]);

    React.useEffect(() => {
        var product = props.route.params.product
        setProduct(product);
        setLoading(false);
    })

    const [quantity,setQuantity] = React.useState(0);

    const addProductToCart = async() => {
        //addToCart(item);
        var token =await AsyncStorage.getItem('user_token')
        setQuantity(quantity+1)
        axios.get(`${url}/consumer/cart/${product.product_id}`,{
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${token}`
            }
        }).then(res => {
            console.log(res.data);
            props.addToCart(res.data);
        })
    }

    const subtractFromCart = async() => {
        var token =await AsyncStorage.getItem('user_token')
        props.removeFromCart(product);
        setQuantity(quantity-1)
        axios.delete(`${url}/consumer/cart/${product.product_id}`,{
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${token}`
            }
        }).then(res => {
            console.log(res.data);
        })
    }

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
                                    <Image resizeMode='contain' source={{uri:item}} style={{width:width,height:width}}/>

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
                               <Text numberOfLines={3} style={{color:'gray',fontSize:16.5}}>{product.product_description}</Text>
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
                    {
                        quantity===0 ?
                        <TouchableWithoutFeedback onPress={addProductToCart}>
                            <View style={{paddingLeft:15,margin:15,paddingRight:15,padding:7.5,alignItems:'center',backgroundColor:'#ff6347',borderRadius:9}}>
                                <Text style={{color:'white',fontSize:18.5}}>Add To Cart</Text>
                            </View>
                        </TouchableWithoutFeedback>
                        :
                        <View style={{flexDirection:'row',margin:15}}>
                            <TouchableOpacity onPress={subtractFromCart} style={{alignItems:'center',marginRight:5,width:32.5,justifyContent:'center',padding:9,borderRadius:15,backgroundColor:'#ff6347',height:32.5}}>
                                <Text style={{fontSize:27,lineHeight:32.5,color:'white',alignSelf:'center'}}>-</Text>
                            </TouchableOpacity>
                            <View style={{alignItems:'center',justifyContent:'center',marginRight:5,padding:9,borderRadius:15,backgroundColor:'white',height:32.5}}>
                                <Text style={{fontSize:18.5,lineHeight:32.5,color:'black',alignSelf:'center'}}>{quantity}</Text>
                            </View>
                            <TouchableOpacity onPress={addProductToCart} style={{alignItems:'center',justifyContent:'center',padding:9,borderRadius:15,backgroundColor:'#ff6347',height:32.5}}>
                                <Text style={{fontSize:27,lineHeight:32.5,color:'white',alignSelf:'center'}}>+</Text>
                            </TouchableOpacity>
                        </View>
                    }
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
                </ScrollView>
            }
        </ScrollView>
    )
}

ConsumerProductDetails.propTypes = {
    addToCart: PropTypes.func.isRequired,
    removeFromCart: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => ({
    latlng:state.latlng
})

const mapActionsToProps = {
    addToCart,
    removeFromCart
}

export default connect(mapStateToProps,mapActionsToProps)(ConsumerProductDetails);