import axios from "axios"
import React, {useEffect, useState } from 'react';
import { Text , View , Dimensions , StyleSheet , Image , TextInput , TouchableOpacity , ScrollView ,AsyncStorage ,ActivityIndicator} from 'react-native';
import ImageCropPicker from 'react-native-image-crop-picker';
import storage from '@react-native-firebase/storage';
import DropDownPicker from 'react-native-dropdown-picker';
import { updateProducts } from '../../redux/seller/actions/productActions';
import { connect } from 'react-redux';
import url from '../../api/api'

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

function generateString(length) {
    let result = ' ';
    const charactersLength = characters.length;
    for ( let i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

function ProductDetails (props) {
    
    const [id , setId] = useState("");
    const [name , setName] = useState("");
    const [price , setPrice] = useState("");
    const [qty , setQty] = useState("");
    const [description , setDescription] = useState("");
    const [path,setPath] = React.useState(null);
    const [img , setImg] = useState("")
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [value, setValue] = useState(null);
    const [items, setItems] = useState([
      {label: 'packaged', value: 'packaged'},
      {label: 'loose', value: 'loose'},
      {label: 'individual', value: 'individual'}
     ]);

     const fetchProductDetails = (product) => {

        console.log("&*^" , product);
        setId(product.product_id);
        setPrice(product.product_price.toString()); 
        setName(product.product_name);
        console.log("******");
        setQty(product.product_quantity.toString()); 
        setImg(product.product_image)
        setPath(product.product_image)
        // setItems({label: product.product_type})
     }

    const editHandler = () => {
        let product = {
            product_id: id,
            product_name: name,
            product_price: price,
            product_quantity: qty, 
            product_description: description,
            product_image: img,
            product_type: value,
            product_increase_quantity: 0,
            product_decrease_quantity: 0
        }

        props.updateProducts(product)


    }

    useEffect(() => {
        setLoading(true)
        console.log("HERE I AMA");
        console.log(props.route.params.item.item);
        fetchProductDetails(props.route.params.item.item);
        setLoading(false)
    },[])



    return (<>
        {loading ?  <ActivityIndicator size="large" color="#00ff00" /> :  <View style={{flex: 1}}>
        <View>
        <Image
          style={{
              height: windowHeight*0.08,
              width: windowHeight*0.08,
              marginTop: -1
          }}
          source={require('../../../assets/loginImages/AngleTopLeft.png')}
          />
        </View>
        <View>


            {path == null ? <View style={{marginTop: 20 , alignItems: "center"}}>
            <TouchableOpacity onPress={() => {}}>
             <Image
                style={{
                height: windowHeight*0.08,
                width: windowHeight*0.08,
              }}
                 source={require('../../images/addImageIcon.png')}
             />
            </TouchableOpacity>
            <Text style={[styles.labels ]}>Add Product Images</Text>
        </View> : <View style={{alignItems: "center"}}>
        <Image
          style={{
            height: windowHeight*0.2,
            width: windowHeight*0.2,
            borderRadius: 20
          }}
          source={{
              uri: img
          }}
        />
        </View> }

        

        <View style={{marginTop: 20}}>
            <Text style={[styles.labels , {marginLeft: windowWidth*0.1}]}>Product Name</Text>
            <View>
                <TextInput 
                    style={styles.input}
                    onChangeText={(text) => {
                        setName(text)
                    }}
                    value={name}
                    placeholder="Shop Address"
                />
            </View>
        </View>
        <View style={{marginTop: 20}}>
            <Text style={[styles.labels , {marginLeft: windowWidth*0.1}]}>Product Price</Text>
            <View>
                <TextInput 
                    style={styles.input}
                    onChangeText={(text) => {
                        setPrice(text)
                    }}
                    value={price}
                    placeholder="Price"
                />
            </View>
        </View>
        <View style={{marginTop: 20}}>
            <Text style={[styles.labels , {marginLeft: windowWidth*0.1}]}>Product Quantity</Text>
            <View>
                <TextInput 
                    style={styles.input}
                    onChangeText={(text) => {
                        setQty(text)
                    }}
                    value={qty}
                    placeholder="Shop Address"
                />
            </View>
        </View>
        <View style={{marginTop: 20}}>
            <Text style={[styles.labels , {marginLeft: windowWidth*0.1}]}>Product Type</Text>
            <View>
            <DropDownPicker
             style={styles.input}
             textStyle={{
                fontFamily: "Montserrat-Light"
              }}
              dropDownContainerStyle={{
                width: windowWidth*0.8,
                marginLeft: windowWidth*0.1,
                marginTop: 8,
                borderWidth: 1,
                borderRadius: 5,
                borderColor: "#7c7c7c",
                fontFamily: "Montserrat-Light",
                padding: 10
              }}
             open={open}
             value={value}
             items={items}
             setOpen={setOpen}
             setValue={setValue}
             setItems={setItems}
           />
            </View>
        </View>

        <View style={{marginTop: 20}}>
            <Text style={[styles.labels , {marginLeft: windowWidth*0.1}]}>Product Description</Text>
            <View>
                <TextInput 
                    style={styles.input}
                    onChangeText={(text) => {
                        setDescription(text)
                    }}
                    value={description}
                    placeholder="Description of your product"
                />
            </View>
        </View>
            
    </View>
    

    <View style={{alignItems: "center" , marginTop: 15}}>
            <TouchableOpacity style={styles.submit} onPress={() => {
                editHandler()
            }}>
                 <Text style={{color: "white" , fontFamily: 'Montserrat-Bold' , fontSize: windowHeight*0.025 }} >
                     Save Changes
                 </Text>
            </TouchableOpacity>
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
          }}
          source={require('../../../assets/loginImages/AngleBottomRight.png')}
        />
        </View>
</View> }
       </>
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
  },
  labels: {
    fontSize: windowWidth*0.035 , fontFamily: "Montserrat-Bold" , color: "#7c7c7c"
  },
  input: {
    height: windowHeight*0.05,
    width: windowWidth*0.8,
    marginLeft: windowWidth*0.1 ,
    marginTop: 8,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: "#7c7c7c",
    fontFamily: "Montserrat-Light",
    padding: 10
  },
  bootombar: {
    width: windowWidth*0.8, 
    height: windowHeight*0.05,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  submit: {
      width: windowWidth*0.5,
      height: windowHeight*0.06,
      backgroundColor: "#0ae38c",
      borderRadius: 40,
      alignItems: "center",
      justifyContent: "center"
  }
});

const mapStateToProps = (state) => {
    return{
        products : state.sproducts.products
    }
}

const mapDispatchToProps = { 
    updateProducts
}

export default connect(mapStateToProps , mapDispatchToProps)(ProductDetails);