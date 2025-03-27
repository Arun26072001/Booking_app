import React, { useContext, useEffect, useState } from "react";
import { Box, Heading, VStack, FormControl, Input, Button, Center, ScrollView, Spinner } from "native-base";
import { StyleSheet } from "react-native";
import { EssentialValues } from "./_layout";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const Login = () => {
  const { loginUser, isLoading } = useContext(EssentialValues);
  const router = useRouter();
  const url = "http://147.79.70.8:3030";
  const [testData, setTestdata] = useState("");
  const [loginData, setLoginData] = useState({
    email: "",
    password: ""
  });

  //add credentials in loginData obj
  function updateLoginData(value, name) {
    setLoginData((prev) => ({
      ...prev,
      [name]: value
    }));
  }


  useEffect(() => {
    // to redirect, if user is already loggedIn
    const performLogin = async () => {
      const token = await AsyncStorage.getItem("token") || "";
      const account = await AsyncStorage.getItem("account") || "";
      if (token) {
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
      }
    };
    performLogin();
  }, []);

  useEffect(() => {
    async function fetchbasicApi() {
      try {
        const res = await axios.get(`${url}/`);
        setTestdata(res.data.message);
      } catch (error) {
        console.log(error);
        
        // setTestdata(error);
      }
    }
    fetchbasicApi();
  }, [])

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Center w="100%">
        <Box safeArea p="2" py="8" w="90%" maxW="290">
          <Heading size="lg" fontWeight="600" color="coolGray.800">
            Welcome {testData}
          </Heading>
          <Heading mt="1" color="coolGray.600" fontWeight="medium" size="xs">
            Sign in to continue!
          </Heading>

          <VStack space={3} mt="5">
            <FormControl>
              <FormControl.Label>Email ID</FormControl.Label>
              <Input value={loginData.email} onChangeText={(value) => updateLoginData(value, 'email')} />
            </FormControl>
            <FormControl>
              <FormControl.Label>Password</FormControl.Label>
              <Input type="password" value={loginData.password} onChangeText={(value) => updateLoginData(value, 'password')} />
            </FormControl>
            <Button mt="2" colorScheme="indigo" onPress={() => loginUser(loginData)}>
              {isLoading ? <Spinner color={"white"} /> : "Login"}
            </Button>
          </VStack>
        </Box>
      </Center>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
});

export default Login;
