import React, { useContext, useEffect, useState } from "react";
import { Box, Heading, VStack, FormControl, Input, Button, Center, ScrollView } from "native-base";
import { StyleSheet } from "react-native";
import {EssentialValues} from "./_layout";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Login = () => {
  const { loginUser } = useContext(EssentialValues);
  const router = useRouter();
  const [loginData, setLoginData] = useState({
    email: "",
    password: ""
  });

  function updateLoginData(value, name) {
    setLoginData((prev) => ({
      ...prev,
      [name]: value
    }));
  }

  useEffect(() => {
    const performLogin = async () => {
      const token = await AsyncStorage.getItem("token") || "";
      if (token) {
        router.replace("/Home");
      }
    };
    performLogin();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Center w="100%">
        <Box safeArea p="2" py="8" w="90%" maxW="290">
          <Heading size="lg" fontWeight="600" color="coolGray.800">
            Welcome
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
            <Button mt="2" colorScheme="indigo" onPress={() => loginUser(loginData, router)}>
              Login
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
