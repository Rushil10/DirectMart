import * as React from 'react';
import { View, Text, AsyncStorage,Dimensions,Image,FlatList,StatusBar } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Header from './ConsumerComponents/Header';
import axios from 'axios';
import { url } from '../../api/api';
import ShopCard from '../../components/ShopCard';

const {height,width} = Dimensions.get('window')

function NearbyShops(props) {

    const [l,setL] = React.useState(false);
    const [t,setT] = React.useState('')
    const [loading,setLoading] = React.useState(true);
    const [shops,setShops] = React.useState([])
    const [error,setError] = React.useState('')

    getNearByShops = async() => {
        setLoading(true);
        var location = {
            latitude:props.latlng.latitude,
            longitude:props.latlng.longitude
        }
        var token = await AsyncStorage.getItem('user_token');
        axios.post(`${url}/consumer/shops`,location,{
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${token}`
            }
        }).then(response => {
            console.log(response.data);
            setShops(response.data)
            setLoading(false)
        })
        .catch(error => {
            setError('Error')
            setLoading(false);
        })
    }

    const getToken = async() => {
        setL(true);
        var token = await AsyncStorage.getItem('user_token');
        setT(token)
        console.log(token);
        setL(false);
    }

    React.useEffect(() => {
        getNearByShops()
    },[])

    return (
        <View style={{flex:1}}>
            <StatusBar backgroundColor="#ff6347" />
            <Header backgroundColor='#ff6347' header='Nearby Shops' height={55} width={width} />
            {
                loading ?
                <View style={{backgroundColor:'white',flex:1,alignItems:'center',justifyContent:'center'}}>
                    <Image source={require('../../images/l2.gif')} resizeMode='contain' style={{width:width}} />
                </View>
                :
                <View style={{backgroundColor:'white',flex:1}}>
                    <FlatList
                    data={shops}
                    renderItem={({item,index}) => <ShopCard item={item} /> }
                    />
                </View>
            }
        </View>
    )
}

NearbyShops.propTypes = {
    latlng:PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
    latlng:state.latlng
})

export default connect(mapStateToProps)(NearbyShops);