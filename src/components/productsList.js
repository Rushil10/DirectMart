import * as React from 'react';
import axios from 'axios';
import { View, Text, AsyncStorage,Dimensions , TouchableOpacity , ActivityIndicator , FlatList , StyleSheet ,Image, TouchableWithoutFeedback } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux'; 
import FastImage from 'react-native-fast-image';

const {height,width} = Dimensions.get('window')

function productsList({item , navigation}) {
    return(
        <View>
            <TouchableWithoutFeedback onPress={navigation}>
                <View style={styles.renderItem}>
                    <View style={styles.upper}>
                        <View style={{alignItems : "center"}}>
                            <FastImage
                                style={{height: width*0.35, width: width*0.35,resizeMode:'cover' , margin:10}}
                                source={{uri: item.item.product_image[0]}}
                            />
                        </View>
                    </View>
                    <View style={styles.mid}>
                        <View style={{justifyContent: "center"}}>
                            {/* <Text style={styles.text}>Name</Text> */}
                            <Text numberOfLines={2} style={styles.text1}>{item.item.product_name}</Text>
                            {/* <Text style={styles.text}>Price</Text> */}
                            <Text style={styles.text1}>₹ {item.item.product_price}</Text>
                            {/* <Text style={styles.text}>Quantity</Text> */}
                            <Text style={styles.text1}>Quantity : {item.item.product_quantity}</Text>
                        </View>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </View>
        )
}

const styles = StyleSheet.create({
    renderItem: {
        flex: 1,
        //height: height*0.35 , 
        width: width*0.45 ,  
        margin: 8 , 
        backgroundColor: "rgba(10,277,140,0.05)",
        borderRadius: 20 ,
        padding:9,
        paddingTop:0,
        borderWidth: 0.5 , 
        borderColor: "#0ae38c" 
        },
    upper: {
        //flex: 0.5,
        // backgroundColor: "orange",
        borderRadius: 20,
        justifyContent: "center",

    },
    text: {
        fontFamily: "Montserrat-Bold",
        color: "black"
    },
    mid: {
        //flex: 0.5,
        flexDirection: "row",
        borderRadius: 20,
        //backgroundColor: "white",
        //marginLeft: 20
        padding:9
    },
    bottom: {
        flex: 0.4,
        justifyContent: "center",
        alignItems: "center"
    },text1: {
        marginLeft: 0,
        fontSize: width*0.03,
        fontFamily: "Montserrat-Medium",
        color: "black",
        marginTop:7.5
    },
  });

export default productsList;