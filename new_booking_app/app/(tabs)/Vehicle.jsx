import React, { useContext, useState } from 'react';
import { ScrollView, StyleSheet, Button } from "react-native";
import { Center, Box, Heading, VStack, FormControl, Input } from "native-base";
import axios from 'axios';
import { EssentialValues } from "../_layout";
import Toast from 'react-native-toast-message';
import { API_BASEURL } from "@env";
import { useRouter } from 'expo-router';

export default function Vehicle() {
    const router = useRouter();
    const { data } = useContext(EssentialValues);
    const { token } = data;
    const [vehicle, setVehicle] = useState({
        name: "",
        perKm: "",
        perDay: "",
        capacity: ""
    });

    function addVehicleObj(value, name) {
        setVehicle((pre) => ({
            ...pre,
            [name]: value
        }));
    }

    async function addVehicle() {
        try {
            const addVehicle = await axios.post(`${API_BASEURL}/api/vehicle`, vehicle,
                {
                    headers: {
                        Authorization: token || ""
                    }
                }
            );
            Toast.show({
                type: "success",
                text1: "Success",
                text2: addVehicle.data.message
            });
            setVehicle({
                name: "",
                perKm: "",
                perDay: "",
                capacity: ""
            });
            router.push("/home");
        } catch (error) {
            Toast.show({
                type: "error",
                text1: "Failed",
                text2: error.response.data.error
            });
            setVehicle({
                name: "",
                perKm: "",
                perDay: "",
                capacity: ""
            });
        }
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Box safeArea p="2" py="2" w="90%" maxW="290">
                <Heading size="lg" fontWeight="600" color="coolGray.800">
                    New Vehicle Details
                </Heading>
                <VStack space={3} mt="5">
                    <FormControl>
                        <FormControl.Label>Vehicle Name</FormControl.Label>
                        <Input
                            value={vehicle.name}
                            onChangeText={(value) => addVehicleObj(value, "name")}
                        />
                    </FormControl>
                    <FormControl>
                        <FormControl.Label>Vehicle Per/Km</FormControl.Label>
                        <Input
                            keyboardType='numeric'
                            value={vehicle.perKm}
                            onChangeText={(value) => addVehicleObj(value, "perKm")}
                        />
                    </FormControl>
                    <FormControl>
                        <FormControl.Label>Vehicle Per/Day</FormControl.Label>
                        <Input
                            keyboardType='numeric'
                            value={vehicle.perDay}
                            onChangeText={(value) => addVehicleObj(value, "perDay")}
                        />
                    </FormControl>
                    <FormControl>
                        <FormControl.Label>Vehicle Capacity</FormControl.Label>
                        <Input
                            keyboardType='numeric'
                            value={vehicle.capacity}
                            onChangeText={(value) => addVehicleObj(value, "capacity")}
                        />
                    </FormControl>
                    <Button mt="5" p="3" colorScheme="indigo" onPress={addVehicle} title="Add Vehicle" />
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