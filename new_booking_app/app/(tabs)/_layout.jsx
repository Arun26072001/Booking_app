import { Tabs } from "expo-router";
import { useContext } from "react";
import { EssentialValues } from "../_layout";
import { Platform, TouchableHighlight, StyleSheet, TouchableOpacity } from "react-native";

// icons font-family
import Entypo from '@expo/vector-icons/Entypo';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

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

      {data?.account && ["1", "3"].includes(data.account) && (
        <Tabs.Screen
          name="Allotment"
          options={({ route }) => ({
            title: "Allotment",
            tabBarIcon: ({ color }) => (
              <MaterialIcons name="taxi-alert" size={24} color={color} />
            ),
            tabBarButton: (props) => {
              const id = route?.params?.id;
              const isDisabled = !id;

              return (
                <TouchableOpacity {...props} disabled={isDisabled} style={{ opacity: isDisabled ? 0.4 : 1 }}>
                  {props.children}
                </TouchableOpacity>
              );
            },
          })}
        />
      )}

      {data?.account && ["1", "2"].includes(data.account) && (
        <Tabs.Screen
          name="Booking"
          options={{
            title: "Booking",
            tabBarIcon: ({ color }) => <FontAwesome6 name="ticket" size={24} color={color} />,
          }}
        />
      )}

      {data?.account && ["1", "2", "3"].includes(data.account) && (
        <Tabs.Screen
          name="Customers"
          options={{
            title: "Customers",
            tabBarIcon: ({ color }) => <FontAwesome6 name="users" size={24} color={color} />,
          }}
        />
      )}

      {data?.account && ["1", "2"].includes(data.account) && (
        <Tabs.Screen
          name="Employees"
          options={{
            title: "Employees",
            tabBarIcon: ({ color }) => <FontAwesome5 name="user-tie" size={24} color={color} />,
          }}
        />
      )}

      {data?.account && ["1"].includes(data.account) && (
        <Tabs.Screen
          name="Vehicle"
          options={{
            title: "Vehicle",
            tabBarIcon: ({ color }) => <FontAwesome6 name="taxi" size={24} color={color} />,
          }}
        />
      )}

      {data?.account && ["1", "4"].includes(data.account) && (
        <Tabs.Screen
          name="TripCompleted"
          options={({ route }) => ({
            title: "Trip Completed",
            tabBarIcon: ({ color }) => (
              <AntDesign name="checkcircle" size={24} color={color} />
            ),
            tabBarButton: (props) => {
              // Get params from the current route if needed
              const id = route?.params?.id;
              const isDisabled = !id;

              return (
                <TouchableOpacity {...props} disabled={isDisabled} style={{ opacity: isDisabled ? 0.4 : 1 }}>
                  {props.children}
                </TouchableOpacity>
              );
            },
          })}
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