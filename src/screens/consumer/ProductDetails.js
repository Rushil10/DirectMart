import * as React from 'react';
import axios from 'axios'
import { View, Text, AsyncStorage,FlatList,ScrollView,Dimensions,Image ,TouchableOpacity,TouchableWithoutFeedback} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'
import { useNavigation } from '@react-navigation/native';
import { url } from '../../api/api';
import { addToCart , removeFromCart} from '../../redux/consumer/actions/cartActions';
import PropTypes from 'prop-types';
import {connect} from 'react-redux'

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

    React.useEffect(() => {
        console.warn(index);
        setIndex(index);
        setSi(index)
    }, [index]);

    React.useEffect(() => {
        var product = props.route.params.product
        setProduct(product);
        setLoading(false);
    })

    return (
        <ScrollView style={{flex:1,backgroundColor:'white'}}>
            {
                loading ?
                <View style={{backgroundColor:'white',flex:1,alignItems:'center',justifyContent:'center'}}>
                    <Image source={require('../../images/l2.gif')} resizeMode='contain' style={{width:width}} />
                </View>
                :
                <ScrollView style={{flex:1}}>
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
                </ScrollView>
            }
        </ScrollView>
    )
}

export default ConsumerProductDetails;