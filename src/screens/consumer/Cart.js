import * as React from 'react';
import { View, Text, AsyncStorage,ScrollView,Button,Dimensions,Image,FlatList,StatusBar } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Header from './ConsumerComponents/Header';
import axios from 'axios';
import { url } from '../../api/api';
import CartProduct from './ConsumerComponents/CartProduct';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';

const {height,width} = Dimensions.get('window')

function Cart(props) {

    const [loading,setLoading] = React.useState(true);
    const [data,setData] = React.useState([])
    const [total,setTotal] = React.useState(0)
    const [token,setToken] = React.useState(null)
    const [dict,setDict] = React.useState(null)
    const [sids,SetSids] = React.useState([])

    const groupBy = (array, key) => {
        // Return the end result
        return array.reduce((result, currentValue) => {
          // If an array already present for key, push it to the array. Else create an array and push the object
          (result[currentValue[key]] = result[currentValue[key]] || []).push(
            currentValue
          );
          // Return the current iteration `result` value, this will be taken as next iteration `result` value and accumulate
          return result;
        }, {}); // empty object is the initial value for result object
    };

    const getCartItems = async() => {
        setLoading(true);
        var token = await AsyncStorage.getItem('user_token')
        setToken(token)
        axios.get(`${url}/consumer/cartItems`,{
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${token}`
            }
        }).then(res => {
            //console.log(res.data);
            setData(res.data);
            if(res.data.length > 0){
                setTotal(res.data[0].cart_total)
            }
            const arr = groupBy(data,shop_id)
            console.log(arr)
            setLoading(false);
        }).catch(err => {
            console.log(err);
            setLoading(false);
        })
    }

    const changeTotal = (price,type) => {
        if(type==='inc'){
            setTotal(total+price);
        } else {
            setTotal(total-price)
        }
    }

    const changeData = async() => {
        setLoading(true)
        var token = await AsyncStorage.getItem('user_token')
        setToken(token)
        axios.get(`${url}/consumer/cartItems`,{
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${token}`
            }
        }).then(res => {
            console.log(res.data,data)
            if(res.data!==data){
                if(res.data.length>0){
                    setData(res.data)
                setTotal(res.data[0].cart_total)
                const arr = groupBy(res.data,'shop_id')
                console.log(arr)
                var i;
                var a = Object.keys(arr)
                console.log(a)
                setDict(arr)
                SetSids(a);
                setLoading(false)
                } else {
                    setTotal(0);
                setData([])
                SetSids([]);
                setLoading(false)
                }
            } else {
                setTotal(0);
                setData([])
                SetSids([]);
                setLoading(false)
            }
        })
    }

    /* React.useEffect(() => {
        getCartItems();
    },[]) */

    const makeList = sids.map(i => {
        return (
            !loading &&
            <View style={{borderWidth:1,borderRadius:9,borderColor:'#ff6347',margin:9}}>
                <View style={{alignItems:'center',padding:9}}>
                    <Text style={{fontSize:22.5,color:'#ff6347'}}>{dict[i][0].shop_name}</Text>
                </View>
                <FlatList
                    showsVerticalScrollIndicator={false}
                        data={dict[i]}
                        renderItem={({item,index}) => <CartProduct item={item} token={token} changeTotal={changeTotal} /> }
                    />
                {
                    dict[i][0].quantity>0 &&
                    <TouchableWithoutFeedback onPress={() => props.navigation.push('OrderSummary',{order:dict[i]})}>
                    <View style={{marginTop:5,padding:9,borderRadius:9,alignItems:'center',backgroundColor:"#ff6347"}}>
                        <Text style={{fontSize:19,color:'white'}}>Order From {dict[i][0].shop_name}</Text>
                    </View>
                </TouchableWithoutFeedback>
                }
            </View>
        )
    })

    React.useEffect(() => {
        const unsubscribe = props.navigation.addListener('focus', () => {
          // do something
          setLoading(true);
          console.log('hiiiiiiiiiiiiiiiiiiiiiiii');
          changeData()
        });
    
        return unsubscribe;
      }, [props.navigation]);

      const explore = () => {
        const arr = groupBy(data,'shop_id')
        console.log(arr)
        var i;
        var a = Object.keys(arr)
        console.log(a)
        setDict(arr)
        SetSids(a);
      }

    return (
        <View style={{flex:1,backgroundColor:'white'}}>
            <Header backgroundColor='#ff6347' header='My Cart' height={55} width={width} />
            {
                loading ?
                <Image source={require('../../images/l2.gif')} resizeMode='contain' style={{width:width}} />
                :
                <ScrollView style={{backgroundColor:'white',flex:1}}>
                    <View style={{marginLeft:15,marginTop:9,paddingBottom:9,marginRight:15,borderBottomWidth:0.75,borderColor:'#ff6347'}}>
                        <Text style={{fontSize:21.5,color:'#ff6347',fontWeight:'bold'}}>Cart Total : Rs {total}</Text>
                    </View>
                    {makeList}
                    {/* <FlatList
                    showsVerticalScrollIndicator={false}
                        data={data}
                        renderItem={({item,index}) => <CartProduct item={item} token={token} changeTotal={changeTotal} /> }
                    /> */}
                </ScrollView>
            }
        </View>
    )
}

export default Cart;