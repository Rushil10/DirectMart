import * as React from 'react';
import { View, Text,Button,Modal,FlatList,TouchableWithoutFeedback,ActivityIndicator,Dimensions, ScrollView ,Image} from 'react-native';
import FastImage from 'react-native-fast-image';

const {height,width} = Dimensions.get('window')

function QuantityModal(props) {
    return (
        <Modal visible={props.visible} onRequestClose={props.onClose} transparent>
            <View style={{backgroundColor:'rgba(52,52,52,0.85)',flex:1,justifyContent:'center',alignItems:'center'}}>
                <View style={{backgroundColor:'white',width:width/1.25,borderRadius:9,alignItems:'center'}}>
                <View style={{padding:9}}>
                        <Text style={{alignSelf:'center',fontSize:21.5,}}>Insufficient Quantity</Text>
                        </View>
                    <View>
                        <FastImage source={{uri:props.image}} style={{width:width/2.5,height:width/2.5}} />
                    </View>
                    <View style={{padding:9}}>
                        <Text style={{alignSelf:'center',fontSize:18.5,}}>{props.message}</Text>
                        </View>
                </View>
                </View>
        </Modal>
    )
}

export default QuantityModal