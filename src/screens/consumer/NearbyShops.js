import * as React from 'react';
import { View, Text, AsyncStorage,Dimensions,Image,FlatList,StatusBar,Alert } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Header from './ConsumerComponents/Header';
import axios from 'axios';
import { url } from '../../api/api';
import ShopCard from '../../components/ShopCard';
import { Linking } from 'react-native';
import VersionCheck from 'react-native-version-check';

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

    const createTwoButtonAlert = (res) =>
    Alert.alert(
        "Update Available",
        "New Version of App is available",
        [
            {
                text: "Cancel",
                onPress: () => console.log("Cancel Pressed"),
                style: "cancel"
            },
            { text: "Update", onPress: () => Linking.openURL(res.storeUrl) }
        ],
        { cancelable: true }
    );

    const getToken = async() => {
        setL(true);
        var token = await AsyncStorage.getItem('user_token');
        setT(token)
        console.log(token);
        setL(false);
    }

    React.useEffect(() => {
        VersionCheck.needUpdate()
            .then(async res => {
                //createTwoButtonAlert(res)
                if (res.isNeeded) {
                    createTwoButtonAlert(res);  // open store if update is needed.
                }
        });
        getNearByShops()
    },[])

    React.useEffect(() => {
        getNearByShops()
    },[props.latlng])

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
                    {
                        shops.length > 0 ?
                        <FlatList
                    data={shops}
                    renderItem={({item,index}) => <ShopCard item={item} /> }
                    />
                    :
                    <View style={{flex:1,justifyContent:'center',alignItems:'center',padding:9}}>
                        <Text style={{fontSize:22.5,color:'#ff6347'}}>No Shops Have Registered</Text>
                        <Text style={{fontSize:22.5,color:'#ff6347'}}> In Your 15 km Range</Text>

                        <Text style={{fontSize:19,color:'gray',marginTop:5}}>Help Us in Spreading Awareness and educate the small buisness owners to take advantage of this app and register themselves.</Text>
                        <Text style={{fontSize:22.5,color:'#ff6347',marginTop:15}}>Thank You</Text>
                        </View>
                    }
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