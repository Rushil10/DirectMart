// In App.js in a new project

import * as React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
// import AccountScreen from './src/screens/Accounts';
import Products from './src/screens/Products';
import LoadingScreen from './src/screens/LoadingScreen'
import Profile from './src/screens/Profile';
import HomeScreen from './src/screens/HomeScreen';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import SignupScreen from './src/screens/Signup';
import SignInScreen from './src/screens/Signin';
import ChooseType from './src/screens/ChooseType';
import ConsumerSignin from './src/screens/consumer/ConsumerSignin';
import ConsumerSignup1 from './src/screens/consumer/ConsumerSignup1';
import ConsumerSignup2 from './src/screens/consumer/ConsumerSignup2';
import SellerSignin from './src/screens/seller/SellerSignin';
import SellerSignUp from './src/screens/seller/SellerSignUp';
import SellerSignUp2 from './src/screens/seller/sellerSignUp2';
import SellerSignUp3 from './src/screens/seller/sellerSignUp3';
import AddProducts from './src/screens/seller/AddProducts';
import NearbyShops from './src/screens/consumer/NearbyShops';
import SellerScreen from './src/screens/seller/SellerScreen';
import sellerOverview from './src/screens/seller/sellerOverview';
import productsScreen from './src/screens/seller/productsScreen';
import OrderDetails from './src/screens/seller/OrderDetails';
import ProductDetails from './src/screens/seller/ProductDetails';
import Orders from './src/screens/consumer/Orders';
import ConsumerProfile from './src/screens/consumer/ConsumerProfile';
import { Provider } from 'react-redux';
import store from './src/redux/store';
import Icon2 from 'react-native-vector-icons/Fontisto'
import Icon3 from 'react-native-vector-icons/SimpleLineIcons'
import ShopProducts from './src/screens/consumer/ShopProducts';
import CartIcon from './src/screens/consumer/ConsumerComponents/CartIcon';
import Cart from './src/screens/consumer/Cart';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import CurrentOrders from './src/screens/consumer/CurrentOrder';
import OutForDelivery from './src/screens/consumer/OutForDelivery';
import Delivered from './src/screens/consumer/Delivered';
import ConsumerOrderDetails from './src/screens/consumer/OrderDetails';
import AllAddress from './src/screens/consumer/AllAddress';
import SellerProfile from './src/screens/seller/SellerProfile';
import ordersOutForDelivery from './src/screens/seller/ordersStatus/ordersOutForDelivery';
import deliveredOrders from './src/screens/seller/ordersStatus/deliveredOrders';
import OrderSummary from './src/screens/consumer/OrderSummary';
import AddAddress from './src/screens/consumer/AddAddress';
import Icon from 'react-native-vector-icons/FontAwesome5';
import ConsumerSearch from './src/screens/consumer/ConsumerSearch';



const OrdersTab = createMaterialTopTabNavigator();

const Stack = createStackNavigator();

const MainStack = createBottomTabNavigator();

const Drawer = createDrawerNavigator();

const ConsumerStack = createBottomTabNavigator();

const SellerStack = createBottomTabNavigator();

const NearbyShopStack = createStackNavigator();

const Pending = createStackNavigator();

const COFD = createStackNavigator();

const CD = createStackNavigator();

const CProfileStack = createStackNavigator();

const SellerOverViewStack = createStackNavigator();

const SellerTopTabsStack = createStackNavigator();


function SOS() {
  return (
    <SellerOverViewStack.Navigator screenOptions={{
      headerShown: false
    }}>
      <SellerOverViewStack.Screen name="sellerOverview" component={sellerOverview} />
      <SellerOverViewStack.Screen name="OrderDetails" component={OrderDetails} />
    </SellerOverViewStack.Navigator>
  )
}

function STT() {
  return (
    <SellerTopTabsStack.Navigator screenOptions={{
      headerShown: false
    }}>
      <SellerTopTabsStack.Screen name="SellerTopTabs" component={SellerTopTabs} />
      <SellerTopTabsStack.Screen name="OrderDetails" component={OrderDetails} />
    </SellerTopTabsStack.Navigator>
  )
}

const CartStack = createStackNavigator();

function CartS() {
  return (
    <CartStack.Navigator screenOptions={{
      headerShown: false
    }}>
      <CartStack.Screen name="CartItems" component={Cart} />
      <CartStack.Screen name="OrderSummary" component={OrderSummary} />
    </CartStack.Navigator>
  )
}

function CPS() {
  return (
    <CProfileStack.Navigator screenOptions={{
      headerShown: false
    }}>
      <CProfileStack.Screen name="myprofile" component={ConsumerProfile} />
      <CProfileStack.Screen name="allAddress" component={AllAddress} />
      <CProfileStack.Screen name="addAddress" component={AddAddress} />
    </CProfileStack.Navigator>
  )
}

function CDS() {
  return (
    <CD.Navigator screenOptions={{
      headerShown: false
    }}>
      <CD.Screen name="current" component={Delivered} />
      <CD.Screen name="orderDetails" component={ConsumerOrderDetails} />
    </CD.Navigator>
  )
}

function PendingOrders() {
  return (
    <Pending.Navigator screenOptions={{
      headerShown: false
    }}>
      <Pending.Screen name="current" component={CurrentOrders} />
      <Pending.Screen name="orderDetails" component={ConsumerOrderDetails} />
    </Pending.Navigator>
  )
}

function COFDS() {
  return (
    <COFD.Navigator screenOptions={{
      headerShown: false
    }}>
      <COFD.Screen name="current" component={OutForDelivery} />
      <COFD.Screen name="orderDetails" component={ConsumerOrderDetails} />
    </COFD.Navigator>
  )
}

function NearbyShopss() {
  return (
    <NearbyShopStack.Navigator screenOptions={{
      headerShown: false
    }}>
      <NearbyShopStack.Screen name="allShops" component={NearbyShops} />
      <NearbyShopStack.Screen name="ShopProducts" component={ShopProducts} />
    </NearbyShopStack.Navigator>
  )
}

function MyTabs() {
  return (
    <OrdersTab.Navigator tabBarOptions={{
      labelStyle: { fontSize: 12 },
      style: { backgroundColor: '#ff6347' },
      activeTintColor:'#ff6347',
      inactiveTintColor:'white',
      indicatorStyle:{backgroundColor:'white',height:'100%',borderTopLeftRadius:15,borderTopRightRadius:15},
    }}>
      <OrdersTab.Screen options={{ tabBarLabel: 'Orders Placed' }} name="Currentorders" component={PendingOrders} />
      <OrdersTab.Screen options={{ tabBarLabel: 'Out For Delivery' }} name="OutForDelivery" component={COFDS} />
      <OrdersTab.Screen options={{ tabBarLabel: 'Delivered' }} name="Delivered" component={CDS} />
    </OrdersTab.Navigator>
  );
}


function SellerTopTabs() {
  return (
    <OrdersTab.Navigator tabBarOptions={{
      labelStyle: { fontSize: 14.5 , fontFamily: "Montserrat-ExtraBold" },
      style: { backgroundColor: '#0ae38c' },
      activeTintColor:'#0ae38c',
      inactiveTintColor:'white',
      indicatorStyle:{backgroundColor:'white',height:'100%',borderTopLeftRadius:15,borderTopRightRadius:15},
    }}> 
      <OrdersTab.Screen options={{ tabBarLabel: 'Out For Delivery' }} name="OutForDelivery" component={ordersOutForDelivery} />
      <OrdersTab.Screen options={{ tabBarLabel: 'Delivered' }} name="Delivered" component={deliveredOrders} />
    </OrdersTab.Navigator>
  );
}


function SellerStackScreens() {
  return(
    <SellerStack.Navigator tabBarOptions={{
      style:{
        height:57,
        backgroundColor:'white',
        borderTopLeftRadius:19,
        borderTopRightRadius:19
      },
      activeTintColor:'#0ae38c'
    }}>
      <SellerStack.Screen options={{
       tabBarLabel: 'Products',
       tabBarIcon: ({ color, size }) => ( 
         <Icon name="box-open" color={color} size={25} />
       ),
     }} name="productsScreen" component={productsScreen} />
      <SellerStack.Screen options={{
          tabBarLabel: 'New Orders',
          tabBarIcon: ({ color, size }) => (
            <Icon2 name="shopping-store" color={color} size={25} />
          ),
        }} name="shops" component={SOS} />
      <SellerStack.Screen
      options={{
        tabBarLabel: 'Active Orders',
        tabBarIcon: ({ color, size }) => (
          <Icon name="receipt" color={color} size={size} />
        ),
      }} name="Orders" component={STT} />
      <SellerStack.Screen options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <Icon2 name="person" color={color} size={size} />
          ),
        }} name="Profile" component={SellerProfile} />
      </SellerStack.Navigator>
  )
}



function ConsumerStackScreens() {
  return(
    <ConsumerStack.Navigator tabBarOptions={{
      showLabel:false,
      style:{
        height:57,
        backgroundColor:'white',
        borderTopLeftRadius:19,
        borderTopRightRadius:19
      },
      activeTintColor:'#ff6347'
    }}>
      <ConsumerStack.Screen options={{
          tabBarLabel: 'Shops',
          tabBarIcon: ({ color, size }) => (
            <Icon2 name="shopping-store" color={color} size={25} />
          ),
        }} name="shops" component={NearbyShopss} />
         <ConsumerStack.Screen options={{
          tabBarLabel: 'Shops',
          tabBarIcon: ({ color, size }) => (
            <Icon2 name="search" color={color} size={25} />
          ),
        }} name="search" component={ConsumerSearch} />
        <ConsumerStack.Screen options={{
          tabBarLabel: 'Shops',
          tabBarIcon: ({ color, size }) => (
            <CartIcon color={color} />
          ),
        }} name="cart" component={CartS} />
      <ConsumerStack.Screen
      options={{
        tabBarLabel: 'Orders',
        tabBarIcon: ({ color, size }) => (
          <Icon3 name="bag" color={color} size={size} />
        ),
      }} name="Orders" component={MyTabs} />
      <ConsumerStack.Screen options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <Icon2 name="person" color={color} size={size} />
          ),
        }} name="Profile" component={CPS} />
      </ConsumerStack.Navigator>
  )
}

function MainStackScreens() {
  return (
    <MainStack.Navigator>
      <MainStack.Screen options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home" color={color} size={size} />
          ),
        }} name="Home" component={HomeScreen} />
      <MainStack.Screen options={{
          tabBarLabel: 'Products',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="shopping-music" color={color} size={size} />
          ),
        }} name="Products" component={Products} />
    </MainStack.Navigator>
  )
}



function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
      <Stack.Navigator screenOptions={{
    headerShown: false
  }}>
        <Stack.Screen name="Loading" component={LoadingScreen} />
        <Stack.Screen name="ChooseType" component={ChooseType} />
        <Stack.Screen name="ConsumerSignin" component={ConsumerSignin} />
        <Stack.Screen name="ConsumerSignup1" component={ConsumerSignup1} />
        <Stack.Screen name="ConsumerSignup2" component={ConsumerSignup2} />
        <Stack.Screen name="SellerSignin" component={SellerSignin} />
        <Stack.Screen name="SellerSignUp" component={SellerSignUp} />
        <Stack.Screen name="SellerSignUp2" component={SellerSignUp2} />
        <Stack.Screen name="SellerSignUp3" component={SellerSignUp3} />
        <Stack.Screen name="Consumer" component={ConsumerStackScreens} />
        <Stack.Screen name="Seller" component={SellerStackScreens} />
        <Stack.Screen name="AddProducts" component={AddProducts} />
        <Stack.Screen name="OrderDetails" component={OrderDetails} />
        <Stack.Screen name="ProductDetails" component={ProductDetails} />
      </Stack.Navigator>
    </NavigationContainer>
    </Provider>
  );
}

export default App;