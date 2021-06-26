import * as React from 'react';
import axios from 'axios';
import { View, Text, AsyncStorage,Dimensions , TouchableOpacity , ActivityIndicator , FlatList , StyleSheet ,Image } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Header from '../consumer/ConsumerComponents/Header';
import { url } from '../../api/api';
import ProductsList from '../../components/productsList'
import { fetchProducts , addProducts } from '../../redux/seller/actions/productActions';

const {height,width} = Dimensions.get('window')

function ProductsScreen(props) {

    const [t,setT] = React.useState('')
    const [products , setProducts] = React.useState([]);
    const [loading , setLoading] = React.useState(false);


    const getToken = async () => {
        const value = await AsyncStorage.getItem('shop_token');
        setT(value);
    }

    React.useEffect(() => {
        setLoading(true)
        getToken();
        fetch();
        setLoading(false)
    },[])

    React.useEffect(() => {
        setLoading(true) 
        setProducts(props.products)
        setLoading(false)
    },[props.products])

    const fetch = async() => {
        console.log("HERE");
        var token = await AsyncStorage.getItem('shop_token');
        props.fetchProducts();
        setProducts(props.products)
    }

    const addProducts = async (products) => {
        setLoading(true)
        console.log(7);
        props.addProducts(products)
        props.navigation.navigate("productsScreen")
        setTimeout(function(){ 
            setLoading(false)
         }, 3000);
    }

    const renderItem = (item) => {
        return(
        <ProductsList item={item} navigation={() => {
            props.navigation.navigate("ProductDetails" , {item: item})
        }}/> 
        )
    }

    return (
        <View style={{flex:1 , backgroundColor: "white"}}>
            <Header style={{color: "white" , fontFamily: "Montserrat-ExtraBold" , fontSize: height*0.02}}  backgroundColor='#0ae38c' header='Seller' height={55} width={width} />
            {loading ? <View style={{backgroundColor:'white',flex:1,alignItems:'center',justifyContent:'center'}}>
                    <Image source={require('../../../assets/loader/1490.gif')} resizeMode='contain' style={{width:width}} />
                </View> : 

            <View>

            <TouchableOpacity onPress={() => {props.navigation.navigate("AddProducts" ,{addProducts: addProducts})}} style={{marginTop: 20 , alignItems: "center"}}>
                <View style={{height: height*0.06 , width: width*0.5 , borderRadius: 200 , backgroundColor: "#0ae38c" , alignItems: "center" , justifyContent: "center"}}>
                    <Text style={{color: "white" , fontFamily: "Montserrat-ExtraBold" , fontSize: height*0.02}}>Add More Products</Text>
                </View>
            </TouchableOpacity>
            
            <View style={{marginTop: 10 , alignItems: "center" , marginBottom : height*0.17}}>
                <FlatList 
                    data={products}
                    renderItem={renderItem}
                    keyExtractor={item => item.product_id}
                />
            </View> 

            </View> 
            
            
            }
    
        </View>
    )
}

const styles = StyleSheet.create({
    renderItem: {
        flex: 1,
        height: height*0.28 , 
        width: width*0.95 ,  
        margin: 8 , 
        backgroundColor: "white",
        borderRadius: 20 ,
        borderWidth: 1.5 , 
        borderColor: "#0ae38c" 
    },
    upper: {
        flex: 0.3,
        // backgroundColor: "orange",
        borderRadius: 20,
        justifyContent: "center"
    },
    text: {
        fontFamily: "Montserrat-Bold"
    },
    mid: {
        flex: 0.3,
        flexDirection: "row",
        borderRadius: 20
    },
    bottom: {
        flex: 0.4,
        justifyContent: "center",
        alignItems: "center"
    }
  });

  const mapStateToProps = (state) => {
    return{
        products : state.sproducts.products
    }
}

const mapDispatchToProps = { 
    fetchProducts,
    addProducts
}

export default connect(mapStateToProps , mapDispatchToProps)(ProductsScreen);