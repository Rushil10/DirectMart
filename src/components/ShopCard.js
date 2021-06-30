import * as React from 'react';
import { View, Text, AsyncStorage,Dimensions,Image ,TouchableOpacity,TouchableWithoutFeedback} from 'react-native';
import Icon from 'react-native-vector-icons/Feather'
import { useNavigation } from '@react-navigation/native';

const {height,width} = Dimensions.get('window')

function ShopCard({item}) {
    const navigation = useNavigation();
    return (
        <TouchableWithoutFeedback onPress={() => navigation.push("ShopProducts",{shop:item})}>
            <View style={{marginLeft:7.5,marginRight:7.5,padding:15,borderBottomWidth:0.5,marginBottom:5,borderColor:'#101010'}}>
            <View style={{flexDirection:'row'}}>
                <Image source={{uri:item.shop_image}} style={{height:width/3.25,width:width/3.25,borderRadius:15,marginRight:15}} />
                <View style={{paddingTop:9,flex:1}}>
                    <Text numberOfLines={2} style={{fontSize:21,color:'#101010',fontFamily:'Montserrat-medium'}}>{item.shop_name}</Text>
                    <Text style={{fontSize:16.5,marginLeft:-4.5,paddingTop:5}}> Distance : {item.D<1 ? 1 : parseInt(item.D)} km</Text>
                    <View style={{flexDirection:'row',alignItems:'center',marginTop:9}}>
                        <Icon color="#ff6437" name='phone-call' size={19} style={{marginRight:9}}/>
                        <Text style={{fontSize:15}}>{item.shop_contact}</Text>
                    </View>
                </View>
            </View>
            {
                item.shop_description &&
                <View style={{marginTop:9}}>
                <Text numberOfLines={2} style={{fontSize:15}}>{item.shop_description}</Text>
            </View>
            }
            </View>
        </TouchableWithoutFeedback>
    )
}

export default ShopCard;