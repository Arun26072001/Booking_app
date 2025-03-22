import { Tabs } from "expo-router";
import React from "react";
import { Platform } from "react-native";

// import { HapticTab } from "@/components/HapticTab";
// import { IconSymbol } from "@/components/ui/IconSymbol";
// import TabBarBackground from "@/components/ui/TabBarBackground";

import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import Entypo from "@expo/vector-icons/Entypo";
import Fontisto from "@expo/vector-icons/Fontisto";
import AntDesign from "@expo/vector-icons/AntDesign";

export default function App() {
  // const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        // tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
        // tabBarButton: HapticTab,
        // tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: "absolute",
          },
          default: {},
        }),
      }}
    >
      <Tabs.Screen
        name="Home"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <Entypo name="home" size={24} color="white" />
          ),
        }}
      />
      <Tabs.Screen
        name="Allotment"
        options={{
          title: "Allotment",
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="taxi-alert" size={24} color="white" />
          ),
        }}
      />
      <Tabs.Screen
        name="Booking"
        options={{
          title: "Booking",
          tabBarIcon: ({ color }) => (
            <FontAwesome6 name="ticket" size={24} color="white" />
          ),
        }}
      />
      <Tabs.Screen
        name="Customers"
        options={{
          title: "Customers",
          tabBarIcon: ({ color }) => (
            <FontAwesome6 name="users" size={24} color="white" />
          ),
        }}
      />
      <Tabs.Screen
        name="Register"
        options={{
          title: "Register",
          tabBarIcon: ({ color }) => (
            <Entypo name="add-user" size={24} color="white" />
          ),
        }}
      />
      <Tabs.Screen
        name="Vehicle"
        options={{
          title: "Vehicle",
          tabBarIcon: ({ color }) => (
            <Fontisto name="taxi" size={24} color="white" />
          ),
        }}
      />
      <Tabs.Screen
        name="TripCompleted"
        options={{
          title: "TripCompleted",
          tabBarIcon: ({ color }) => (
            <AntDesign name="checkcircle" size={24} color="white" />
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: "history",
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="manage-history" size={24} color="white" />
          ),
        }}
      />
    </Tabs>
  );
}
