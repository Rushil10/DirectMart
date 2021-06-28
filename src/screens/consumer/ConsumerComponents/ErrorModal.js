import * as React from 'react';
import { View, Text,Button,Modal,FlatList,TouchableWithoutFeedback,ActivityIndicator,Dimensions, ScrollView ,Image} from 'react-native';

const {height,width} = Dimensions.get('window')

function ErrorModal(props) {
    return (
        <Modal visible={props.visible} onRequestClose={props.onClose} transparent>
            <View style={{backgroundColor:'rgba(52,52,52,0.85)',flex:1,justifyContent:'center',alignItems:'center'}}>
                <View style={{backgroundColor:'white',width:width/1.25,borderRadius:9}}>
                    <View style={{backgroundColor:'#ff6347',alignItems:'center',justifyContent:'center',paddingVertical:9,borderRadius:9}}>
                        <Text style={{color:'white',fontSize:22.5}}>{props.heading}</Text>
                    </View>
                    <View style={{padding:9}}>
                        <Text style={{fontSize:19}}>{props.error}</Text>
                    </View>
                    <TouchableWithoutFeedback onPress={props.onClose}>
                        <View style={{alignItems:'center',justifyContent:'center',padding:9,borderTopWidth:0.25,}}>
                            <Text style={{fontSize:19,color:'#ff6237'}}>Close</Text>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
                </View>
        </Modal>
    )
}

export default ErrorModal