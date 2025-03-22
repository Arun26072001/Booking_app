import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { createContext, useEffect, useState } from "react";
import "react-native-reanimated";
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import axios from "axios";
import jwtDecode from "jwt-decode";
import { NativeBaseProvider, Text } from "native-base";
import { API_BASEURL } from "@env";

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
      router.replace("Login");
    } catch (error) {
      console.error("Logout Error:", error.message);
    }
  };

  const loginUser = async (credentials) => {
    setIsLoading(true);
    try {
      const response = await axios.post(`${API_BASEURL}/api/auth/login`, credentials);
      console.log(response);

      const decodedData = jwtDecode(response.data.token);

      const { name, email, account, _id } = decodedData;
      setData({ _id, name, email, account: String(account), token: response.data.token });

      await AsyncStorage.multiSet([
        ["_id", _id],
        ["token", response.data.token],
        ["name", name],
        ["email", email],
        ["account", String(account)],
      ]);

      Toast.show({ type: "success", text1: "Login successfully" });
      router.replace("(tabs)");
    } catch (error) {
      console.log(error.response.data.error);

      Toast.show({
        type: "error",
        text1: "Failed",
        text2: error.response?.data?.error || "Something went wrong",
      });
    } finally {
      setIsLoading(false);
    }
  };

  Toast.show({
    type: "error",
    text1: "Failed",
    text2: "Something went wrong",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const _id = (await AsyncStorage.getItem("_id")) || "";
        const token = (await AsyncStorage.getItem("token")) || "";
        const name = (await AsyncStorage.getItem("name")) || "";
        const email = (await AsyncStorage.getItem("email")) || "";
        const account = (await AsyncStorage.getItem("account")) || "";

        setData({ _id, token, name, email, account });
      } catch (error) {
        console.error("Error fetching stored data:", error.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <NativeBaseProvider>
        <Text>Loading...</Text>
      </NativeBaseProvider>
    );
  }

  return (
    <NativeBaseProvider>
      <EssentialValues.Provider value={{ data, loginUser, changeBookings, updateBooking }}>
        <Stack>
          <Stack.Screen name="Login" options={{ headerShown: true }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: true }} />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="auto" />
        <Toast position="top" />
      </EssentialValues.Provider>
    </NativeBaseProvider>
  );
}
