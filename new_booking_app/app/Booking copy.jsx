import { ScrollView, ActivityIndicator, TouchableOpacity, StyleSheet, View } from 'react-native';
import React, { useState, useEffect } from 'react';
import Toast from "react-native-toast-message";
import { Center, Box, Heading, VStack, FormControl, Input } from "native-base";
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from "axios";
import { API_BASEURL } from "@env";
import { useRouter } from 'expo-router';

export default function Booking() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [show, setShow] = useState(null);
    const [pickupDate, setPickupDate] = useState("");
    const [pickupTime, setPickupTime] = useState("");
    const [dropDate, setDropDate] = useState("");
    const [dropTime, setDropTime] = useState("");

    function handlePickupChange(event, value) {
        if (show === "pickupDate") {
            const datevalue = `${new Date(value).getDate()}-${new Date(value).getMonth()}-${new Date(value).getFullYear()}`;
            setPickupDate(datevalue)
            setShow("")
        } else {
            const timeValue = `${new Date(value).getHours()}:${new Date(value).getMinutes()}`;
            setPickupTime(timeValue)
            setShow("")
        }
    }

    function handleDropChange(event, value) {
        if (show === "dropDate") {
            const datevalue = `${new Date(value).getDate()}-${new Date(value).getMonth()}-${new Date(value).getFullYear()}`;
            setDropDate(datevalue)
            setShow("")
        } else {
            const timeValue = `${new Date(value).getHours()}:${new Date(value).getMinutes()}`;
            setDropTime(timeValue)
            setShow("")
        }
    }

    useEffect(() => {
        setIsLoading(true);
        const fetchData = async () => {
            try {
                await axios.get(`${API_BASEURL}/api/vehicle`);
                await axios.get(`${API_BASEURL}/api/state`);
            } catch (error) {
                Toast.show({
                    type: "error",
                    text1: "Error",
                    text2: "Failed to fetch initial data",
                });
            }
            setIsLoading(false);
        };
        fetchData();
    }, []);

    return (
        <ScrollView>
            {isLoading ? (
                <ActivityIndicator size="large" color="blue" />
            ) : (
                <Center w="100%">
                    <Box safeArea p="2" w="90%" maxW="290" py="8">
                        <Heading size="lg" fontWeight="semibold">
                            Trip Booking
                        </Heading>
                        <VStack space={3} mt="5">
                            <FormControl>
                                <FormControl.Label>Pickup Date & Time</FormControl.Label>
                                <View style={styles.container}>
                                    <TouchableOpacity style={styles.bookingDetails}>
                                        <Input size="xl" style={[styles.input, { borderWidth: 0 }]} value={pickupDate} onFocus={() => setShow("pickupDate")} placeholder="Select Pickup Date" />
                                        <Input size="xl" style={[styles.input, { borderWidth: 0 }]} value={pickupTime} onFocus={() => setShow("pickupTime")} placeholder="Select Pickup Time" />
                                        {show === "pickupDate" && <DateTimePicker value={new Date()} mode="date" display="default" onChange={handlePickupChange} />}
                                        {show === "pickupTime" && <DateTimePicker value={new Date()} mode="time" display="default" onChange={handlePickupChange} />}
                                    </TouchableOpacity>
                                </View>
                            </FormControl>
                            <FormControl>
                                <FormControl.Label>Drop Date & Time</FormControl.Label>
                                <View style={styles.container}>
                                    <TouchableOpacity style={styles.bookingDetails}>
                                        <Input size="xl" style={[styles.input, { borderWidth: 0 }]} value={dropDate} onFocus={() => setShow("dropDate")} placeholder="Select Drop Date" />
                                        <Input size="xl" style={[styles.input, { borderWidth: 0 }]} value={dropTime} onFocus={() => setShow("dropTime")} placeholder="Select Drop Time" />
                                        {show === "dropDate" && <DateTimePicker value={new Date()} mode="date" display="default" onChange={handleDropChange} />}
                                        {show === "dropTime" && <DateTimePicker value={new Date()} mode="time" display="default" onChange={handleDropChange} />}
                                    </TouchableOpacity>
                                </View>
                            </FormControl>
                        </VStack>
                    </Box>
                </Center>
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    bookingDetails: {
        padding: 20,
        backgroundColor: "#fff",
        borderRadius: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        width: "100%",
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        fontSize: 16,
        color: "#333",
    },
});
