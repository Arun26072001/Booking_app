import React, { useContext, useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Button, ActivityIndicator, View, Image, TouchableOpacity } from "react-native";
import { Box, Heading, VStack, FormControl, Input } from "native-base";
import axios from 'axios';
import Toast from 'react-native-toast-message';
import {EssentialValues} from "../_layout";
import * as ImgUploader from 'expo-image-picker';
import { API_BASEURL } from "@env";

export default function TripCompleted({ navigation, route }) {
    const { id, tripCompleted } = route.params;
    const { data } = useContext(EssentialValues);
    const [isLoading, setIsLoading] = useState(false);
    const [files, setFiles] = useState([]);

    const [tripDetails, setTripDetails] = useState({
        startingKm: "",
        closingKm: "",
        receivedAmount: ""
    })

    async function completeTrip() {
        const body = {
            ...tripDetails,
            // tripDoc: files
        }

        try {
            const addDetails = await axios.post(`${API_BASEURL}/api/trip-complete/${id}`, body, {
                headers: {
                    Authorization: data.token || ""
                }
            });
            Toast.show({
                type: "success",
                text1: "success",
                text2: addDetails.data.message
            })
            setTripDetails({
                startingKm: "",
                closingKm: "",
                receivedAmount: ""
            });
            setFiles([]);
            navigation.navigate("Home");
        } catch (error) {
            Toast.show({
                type: "error",
                text1: "Failed",
                text2: error.response.data.error
            })
        }

    }

    async function updateCompletedTrip() {
        try {
            const updatedTripDetails = {
                bookingId: id,
                startingKm: tripDetails.startingKm,
                closingKm: tripDetails.closingKm,
                receivedAmount: tripDetails.receivedAmount
            }
            const updateTrip = await axios.put(`${API_BASEURL}/api/trip-complete/${id}`, updatedTripDetails, {
                headers: {
                    Authorization: data.token || ""
                }
            })
            Toast.show({
                type: "success",
                text1: "success",
                text2: updateTrip.data.message
            })
            setTripDetails({
                startingKm: "",
                closingKm: "",
                receivedAmount: ""
            });
            setFiles([]);
            navigation.navigate("Home");
        } catch (error) {

            Toast.show({
                type: "error",
                text1: "Failed",
                text2: error.response.data.error
            })
        }
    }
    function updateTripDetails(value, name) {
        setTripDetails((pre) => ({
            ...pre,
            [name]: value
        }))
    }

    async function upload() {
        try {
            const result = await ImgUploader.launchImageLibraryAsync({
                mediaTypes: ["livePhotos"],
                type: "livePhoto",
                quality: 0.7,
                cameraType: "back",
                allowsMultipleSelection: true
            })

            setFiles(result.assets.map((src) => (
                src.uri
            )))
            const data = new FormData();

            if (result.assets.length > 0) {
                result.assets.map((src) => {
                    const photoUri = src.uri;
                    return (
                        data.append('photo', {
                            name: src.fileName || `photo-${Date.now()}.jpg`,
                            type: 'image/jpeg', // Or 'image/png' based on your photo type
                            uri: photoUri,
                        })
                    )
                })
            }
            const response = await fetch(`${API_BASEURL}/api/upload`, {
                method: 'POST',
                body: data,
                headers: {
                    Accept: 'application/json',
                },
            });

            if (!response.ok) {
                console.error('Upload failed with status:', response.status);
                return;
            }

            const op = await response.json();
            console.log(op);
            setTripDetails((pre) => ({
                ...pre,
                "tripDoc": op.files.map((file) => file.filename)
            }))
            // try {
            //     const imgUpload = await axios.post(`${API_BASEURL}/api/trip-complete/${id}`, {
            //         tripDoc: op.files.map((file) => file.filename)
            //     }, {
            //         headers: {
            //             Authorization: token || ""
            //         }
            //     })
            //     Toast.show({
            //         type: "success",
            //         text1: "Success",
            //         text2: "Img uploaded successfully."
            //     })
            // } catch (error) {
            //     Toast.show({
            //         type: "error",
            //         text1: "Failed",
            //         text2: error.response.data.error
            //     })
            // }
        } catch (error) {
            console.log(error);
        }
    }
    console.log(files);


    function removeImage(img) {
        const removedFiles = files.filter((file) => file !== img)
        setFiles(removedFiles);
    }

    useEffect(() => {
        async function fetchTripCompletedDetails() {
            try {
                const tripCompletedDetails = await axios.get(`${API_BASEURL}/api/trip-complete/${id}`);
                const { startingKm, closingKm, receivedAmount, _id } = tripCompletedDetails.data;
                setTripDetails({
                    _id,
                    startingKm: String(startingKm),
                    closingKm: String(closingKm),
                    receivedAmount: String(receivedAmount)
                });
            } catch (error) {
                console.log(error);
                Toast.show({
                    type: "error",
                    text1: "Failed",
                    text2: error.response.data.error
                })
            }
        }

        if (data.account === "1" && tripCompleted) {
            setIsLoading(true);
            fetchTripCompletedDetails();
            setIsLoading(false);
        }
    }, [])

    console.log(tripDetails);


    return (
        <ScrollView contentContainerStyle={styles.container}>
            {/* <Center w="100%"> */}
            {
                isLoading ? <ActivityIndicator size="large" color="blue" /> :
                    <Box safeArea p="2" py="2" w="90%" maxW="290">
                        <Heading size="lg" fontWeight="600" color="coolGray.800">
                            Trip Completed Details
                        </Heading>

                        <VStack space={3} mt="5">
                            <FormControl>
                                <FormControl.Label>Starting Km</FormControl.Label>
                                <Input
                                    keyboardType='numeric'
                                    value={String(tripDetails.startingKm)}
                                    onChangeText={(value) => updateTripDetails(value, "startingKm")}
                                />
                            </FormControl>
                            <FormControl>
                                <FormControl.Label>closing Km</FormControl.Label>
                                <Input
                                    keyboardType='numeric'
                                    value={String(tripDetails.closingKm)}
                                    onChangeText={(value) => updateTripDetails(value, "closingKm")}
                                />
                            </FormControl>
                            <FormControl>
                                <FormControl.Label>Received Amount</FormControl.Label>
                                <Input
                                    keyboardType='numeric'
                                    value={String(tripDetails.receivedAmount)}
                                    onChangeText={(value) => updateTripDetails(value, "receivedAmount")}
                                />
                            </FormControl>
                            {
                                files.length > 0 &&
                                <View style={{ flexDirection: "row" }}>
                                    {
                                        files.map((img) => {
                                            return <TouchableOpacity key={img} onPress={() => removeImage(img)} >
                                                <Image source={{ uri: img }} style={styles.img} />
                                            </TouchableOpacity>
                                        })
                                    }
                                </View>
                            }
                            <Button title='Upload Trip Documents' onPress={upload} />
                            <Button mt="5" p="3" colorScheme="indigo" onPress={data.account === "1" && tripDetails?._id ? updateCompletedTrip : completeTrip} title={data.account === "1" && tripDetails?._id ? "Update Completed Trip" : "Complete Trip"} />
                        </VStack>
                    </Box>
            }
            {/* </Center> */}
        </ScrollView>
    )
}
const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff",
    },
    img: {
        width: 50,
        height: 50,
        objectFit: "cover",
        margin: 5
    }
});