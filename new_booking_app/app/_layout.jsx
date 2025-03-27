import { Stack, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { createContext, useEffect, useState } from "react";
import "react-native-reanimated";
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { NativeBaseProvider } from "native-base";
// import { API_BASEURL } from "@env";

export const EssentialValues = createContext(null);

export default function RootLayout() {
 
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState({
    _id: "",
    name: "",
    email: "",
    token: "",
    account: "",
  });
  const [changeBookings, setChangeBookings] = useState(false);

  const updateBooking = () => {
    setChangeBookings(!changeBookings);
  };

  const logout = async () => {
    try {
      await AsyncStorage.multiRemove(["_id", "token", "name", "email", "account"]);
      setData({ _id: "", name: "", email: "", token: "", account: "" });
      router.replace("/login"); // ✅ Fixed
    } catch (error) {
      console.error("Logout Error:", error.message);
    }
  };

  const loginUser = async (credentials) => {
    setIsLoading(true);
    try {
      const response = await axios.post(`http://147.79.70.8:3030/api/auth/login`, credentials);

      const decodedData = jwtDecode(response.data); // ✅ Fixed
      console.log("Decoded Data:", decodedData);

      const { name, email, account, _id } = decodedData;

      setData({ _id, name, email, account: String(account), token: response.data });

      await AsyncStorage.multiSet([
        ["_id", _id],
        ["token", response.data],
        ["name", name],
        ["email", email],
        ["account", String(account)],
      ]);

      Toast.show({ type: "success", text1: "Login successful" });
      if (account == 2) {
        router.replace("/(tabs_1)/Home");
      } else if (account == 3) {
        router.replace("/(tabs_2)/Home");
      } else if (account == 4) {
        router.replace("/(tabs_3)/Home");
      }
      else {
        router.replace("/(tabs)/Home");
      }// ✅ Fixed
    } catch (error) {
      console.log("Login Error:", error);

      Toast.show({
        type: "error",
        text1: "Login Failed",
        text2: error?.response?.data?.error || "Something went wrong",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const checkUserSession = async () => {
      try {
        const _id = (await AsyncStorage.getItem("_id")) || "";
        const token = (await AsyncStorage.getItem("token")) || "";
        const name = (await AsyncStorage.getItem("name")) || "";
        const email = (await AsyncStorage.getItem("email")) || "";
        const account = (await AsyncStorage.getItem("account")) || "";
        setData({ _id, token, name, email, account });

        if (_id && token) {
          // ✅ User is logged in, go to (tabs)
          if (account == 2) {
            router.replace("/(tabs_1)/Home");
          } else if (account == 3) {
            router.replace("/(tabs_2)/Home");
          } else if (account == 4) {
            router.replace("/(tabs_3)/Home");
          }
          else {
            router.replace("/(tabs)/Home");
          }
        } else {
          // ✅ User is NOT logged in, go to login
          router.replace("/login");
        }
      } catch (error) {
        console.error("Error fetching stored data:", error.message);
      } finally {
        setIsLoading(false);
      }
    };

    checkUserSession();
  }, []);

  return (
    <NativeBaseProvider>
      <EssentialValues.Provider value={{ data, loginUser, changeBookings, isLoading, updateBooking, logout }}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs_1)" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs_2)" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs_3)" options={{ headerShown: false }} />
          <Stack.Screen name="login" options={{ headerShown: true }} /> {/* ✅ Fixed lowercase */}
          <Stack.Screen name="+not-found" />
        </Stack>
        <Toast position="top" />
        <StatusBar style="auto" />
      </EssentialValues.Provider>
    </NativeBaseProvider>
  );
}
