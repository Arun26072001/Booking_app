import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text } from "react-native";
import { Button, Box, Heading, VStack, FormControl, Input, Link, HStack, Spinner } from "native-base";
import axios from "axios";
import Toast from "react-native-toast-message";
import { API_BASEURL } from "@env";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';

export default function Register() {
    const router = useRouter();
    const [token, setToken] = useState("");
    const [isWorkingApi, setIsWorkingApi] = useState(false);
    const [registerData, setRegisterData] = useState({
        name: "",
        email: "",
        password: "",
        work: "",
        contact: "",
    });

    function updateRegisterData(value, name) {
        console.log(name, value);
        setRegisterData((prev) => ({
            ...prev,
            [name]: value,
        }));
    }

    async function addEmployee() {
        setIsWorkingApi(true);
        try {
            const addEmp = await axios.post(`${API_BASEURL}/api/auth`, registerData, {
                headers: {
                    Authorization: token || ""
                }
            });

            Toast.show({
                type: "success",
                text1: "success",
                text2: addEmp.data.message
            });
            setRegisterData({
                name: "",
                email: "",
                password: "",
                work: "",
                contact: "",
            });
            router.push("/Home");
        } catch (error) {
            Toast.show({
                type: "error",
                text1: "failed",
                text2: error?.response?.data?.error
            });
        }
        setIsWorkingApi(false);
    }

    useEffect(() => {
        const getToken = async () => {
            const tokenData = await AsyncStorage.getItem("token");
            setToken(tokenData);
        };

        getToken();
    }, []);

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Box safeArea p="2" py="2" w="90%" maxW="290">
                <Heading size="lg" fontWeight="600" color="coolGray.800">
                    Register a New User
                </Heading>
                <Heading mt="1" color="coolGray.600" fontWeight="medium" size="xs">
                    Sign up to continue!
                </Heading>
                <VStack space={3} mt="5">
                    <FormControl>
                        <FormControl.Label>Name</FormControl.Label>
                        <Input
                            value={registerData.name}
                            onChangeText={(value) => updateRegisterData(value, "name")}
                        />
                    </FormControl>
                    <FormControl>
                        <FormControl.Label>Work</FormControl.Label>
                        <Picker style={{ borderWidth: 1 }} onValueChange={(value) => updateRegisterData(value, "work")}>
                            <Picker.Item label="Select Employee Role" />
                            <Picker.Item label="Driver" value="Driver" />
                            <Picker.Item label="Booking Officer" value="Booking Officer" />
                            <Picker.Item label="Taxi Alloter" value="Taxi Alloter" />
                            <Picker.Item label="Admin" value="admin" />
                        </Picker>
                    </FormControl>
                    <FormControl>
                        <FormControl.Label>Contact</FormControl.Label>
                        <Input
                            keyboardType="numeric"
                            value={registerData.contact}
                            onChangeText={(value) => updateRegisterData(value, "contact")}
                        />
                    </FormControl>
                    <FormControl>
                        <FormControl.Label>Email ID</FormControl.Label>
                        <Input
                            value={registerData.email}
                            onChangeText={(value) => updateRegisterData(value, "email")}
                        />
                    </FormControl>
                    <FormControl>
                        <FormControl.Label>Password</FormControl.Label>
                        <Input
                            type="password"
                            value={registerData.password}
                            onChangeText={(value) => updateRegisterData(value, "password")}
                        />
                    </FormControl>
                    <Button mt="5" p="3" colorScheme="indigo" onPress={addEmployee} >
                        {isWorkingApi ? <Spinner color={"white"} /> : "Add Employee"}
                    </Button>
                </VStack>
            </Box>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff",
    },
});
