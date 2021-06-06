import React, { Component } from 'react';
import { Text , View , Dimensions , StyleSheet , Image} from 'react-native';
import Navbar from '../../components/Navbar'
import SigninComponent from '../../components/SigninComponent'



const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

function SellerSignin (props) {



    return (
        <View style={{flex: 1}}>
          {/* <Navbar /> */}
            <View>
            <Image
              style={{
                height: windowHeight*0.08,
                width: windowHeight*0.08,
                marginTop: -1
              }}
              source={require('../../../assets/loginImages/AngleTopLeft.png')}
            />
            <SigninComponent signIn={props.navigation}/>
            
            
            </View>
            <View style={{
                flex: 1,
                alignItems: "flex-end",
                justifyContent: "flex-end",
                }}>
           
            <Image
              style={{
                height: windowHeight*0.08,
                width: windowHeight*0.08,
                marginLeft: windowWidth*0.85
              }}
              source={require('../../../assets/loginImages/AngleBottomRight.png')}
            />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
  navbar: {
    width: windowWidth, 
    height: windowHeight*0.1, 
    backgroundColor: "#162239",
    alignItems: "center",
    justifyContent: "center"
  },
  navbarIcon1: {
    width: windowWidth*0.8, 
    height: windowHeight*0.05,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"

  }
});

export default SellerSignin;