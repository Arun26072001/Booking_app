import { Tabs } from "expo-router";
import { useContext } from "react";
import { EssentialValues } from "../_layout";
import { Platform, TouchableHighlight, StyleSheet } from "react-native";

// icons font-family
import Entypo from '@expo/vector-icons/Entypo';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import AntDesign from '@expo/vector-icons/AntDesign';

export default function TabsLayout() {
  const { data, logout } = useContext(EssentialValues);

  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        tabBarStyle: Platform.select({
          ios: { position: "absolute" },
          default: {},
        }),
        headerRight: () => (
          <TouchableHighlight
            onPress={async () => {
              console.log("logout pressed");
              await logout(); // Ensure logout is awaited if it's asynchronous
            }}
            underlayColor="#ddd"
            style={styles.touchableHighlight}
          >
            <FontAwesome6 name="arrow-right-from-bracket" size={25} color="#000" />
          </TouchableHighlight>
        ),
      }}
    >
      <Tabs.Screen
        name="Home"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => <Entypo name="home" size={24} color={color} />,
        }}
      />

      {data?.account && ["1", "4"].includes(data.account) && (
        <Tabs.Screen
          name="TripCompleted"
          options={{
            title: "Trip Completed",
            tabBarIcon: ({ color }) => <AntDesign name="checkcircle" size={24} color={color} />,
          }}
        />
      )}

      <Tabs.Screen
        name="history"
        options={{
          title: "History",
          tabBarIcon: ({ color }) => <MaterialIcons name="manage-history" size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  touchableHighlight: {
    padding: 10,
  },
});