import * as React from 'react';
import { View, Text, AsyncStorage,Dimensions,Image,BackHandler,FlatList,StatusBar, Linking } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Header from './ConsumerComponents/Header';
import axios from 'axios';
import { url } from '../../api/api';
import ProductCard from './ConsumerComponents/ProductCard';
import ProductCardForDisplay from './ConsumerComponents/ProductCardForDisplay';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';

const {height,width} = Dimensions.get('window')

function ProductsDisplay(props) {
    const shop = props.route.params.shop
    const [loading,setLoading] = React.useState(true);
    const [products,setProducts] = React.useState([])
    const [error,setError] = React.useState('');
    const [userToken,setuserToken] = React.useState(null)
    const [lurl,setLurl] = React.useState(null)

    const getShopProducts = async() => {
        const shop = props.route.params.shop
        //var token = await AsyncStorage.getItem('user_token')
        //setuserToken(token)
        setLoading(true)
        axios.get(`${url}/consumer/${shop.shop_id}/productsForDisplay`).then(res => {
            console.log(res.data);
            setProducts(res.data)
            setLoading(false);
        })
        .catch(err => {
            setError('Error')
            setLoading(false);
        })
    }

    React.useEffect(() => {
        getShopProducts();
    },[])

   
    /* React.useEffect(() => {
        const backAction = () => {
        props.navigation.navigate('ChooseType')
        return true;
        };
    
        const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        backAction
        );
    
        return () => backHandler.remove();
    }, []);  */

    return (
        <View style={{flex:1}}>
            <StatusBar backgroundColor="#ff6347" />
            {
                loading ?
                <View style={{backgroundColor:'white',flex:1,alignItems:'center',justifyContent:'center'}}>
                    <Image source={require('../../images/l2.gif')} resizeMode='contain' style={{width:width}} />
                </View>
                :
                <View style={{flex:1,backgroundColor:'white'}}>
                    <Header backgroundColor='#ff6347' header={shop.shop_name} height={55} width={width} />
                    {
                        products.length>0 ?
                         <FlatList
                        data={products}
                        renderItem={({item,index}) => <ProductCardForDisplay item={item} /> }
                        /> 
                        :
                        <View style={{flex:1,justifyContent:'center',alignItems:'center',padding:9}}>
                        <Text style={{fontSize:22.5,color:'gray'}}>No Products Added By {shop.shop_name}</Text> 
                        </View>

                    }
                    <View>
                        <TouchableWithoutFeedback onPress={() => props.navigation.push('ConsumerSignin')}>
                            <View style={{alignItems:'center',backgroundColor:'#ff6347',borderRadius:15,marginBottom:5,marginHorizontal:15,padding:9}}>
                            <Text style={{fontSize:16.5,color:'white'}}>Login to Order</Text>
                            </View>
                        </TouchableWithoutFeedback>
                        </View>
                </View>
            }
        </View>
    )
}

export default ProductsDisplay;