import { View, Text, Image, StyleSheet, Linking, Share, } from "react-native";
import React, { useContext, useEffect, useState } from 'react'
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { useRouter } from "expo-router";
import * as ImagePicker from 'expo-image-picker';
import { warnMsg } from "../ReusableFunctions";
import { API_BASEURL } from "@env";
import Toast from "react-native-toast-message";
import axios from "axios";
import { EssentialValues } from "@/app/_layout";

export default function TripCard({ booking, account, updateTripCompleted, allotments }) {
    const { data } = useContext(EssentialValues);
    const { token } = data;
    const router = useRouter();
    const { _id } = booking;
    const [completedTripData, setCompletedTripData] = useState({});

    const dayMonthFormatter = new Intl.DateTimeFormat("en-GB", {
        day: "2-digit",
        month: "short",
    });

    // Get the time in 12-hour format with AM/PM (e.g., "9:00AM")
    const timeFormatter = new Intl.DateTimeFormat("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
    });

    function handleAllotment(bookingData) {
        if (["1", "3"].includes(account)) {
            router.push({ pathname: `/(tabs${account === "3" ? "_2" : ""})/Allotment`, params: bookingData })
        }
    }

    function makeCallToDriver(bookingId) {
        const isAlloted = allotments.find((allot) => allot.bookingId === bookingId);
        if (isAlloted) {
            return Linking.openURL(`tel:+91${isAlloted.driver.contact}`)
        } else {
            return warnMsg("call")
        }
    }

    function shareData(bookingId) {
        const isAlloted = allotments.find((allot) => allot.bookingId === bookingId);
        if (isAlloted) {
            const { name, contact } = isAlloted.driver;
            return Share.share({
                message: `DriverName: ${name}\nDriverContact: ${contact}\nVehicleName: ${isAlloted.vehicle.name}\nVehicleNumber: ${isAlloted.vehicle.vehicleNo}`
            })
        } else {
            return warnMsg("share");
        }
    }

    async function takePhotoAndUpload(_id) {
        // img upload
        try {
            const photo = await ImagePicker.launchCameraAsync({
                mediaTypes: ["livePhotos", "images"],
                quality: 0.6,
                allowsMultipleSelection: false
            });

            if (!photo.assets || photo.assets.length === 0) {
                console.error('No photo selected');
                return;
            }

            const photoUri = photo.assets[0].uri;

            const data = new FormData();
            data.append('photo', {
                name: photo.assets[0].fileName || `photo-${Date.now()}.jpg`,
                type: 'image/jpeg', // Or 'image/png' based on your photo type
                uri: photoUri,
            });

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

            const result = await response.json();
            try {
                // uploaded img add in trip completed collection
                const imgUpload = await axios.post(`${API_BASEURL}/api/trip-complete/${_id}`, {
                    tripDoc: [result.files[0].filename]
                }, {
                    headers: {
                        Authorization: token || ""
                    }
                })
                Toast.show({
                    type: "success",
                    text1: "Success",
                    text2: "Img uploaded successfully."
                })
                fetchTripCompletedData()
            } catch (error) {
                // console.log("Error in add tripCompleted", error);

                Toast.show({
                    type: "error",
                    text1: "Failed",
                    text2: error.response.data.error
                })
            }
        } catch (error) {
            console.error('Error during upload:', error);
        }
    }

    async function fetchTripCompletedData() {
        try {
            const res = await axios.get(`${API_BASEURL}/api/trip-complete/${_id}`)
            setCompletedTripData(res.data)
        } catch (error) {
            console.log(error);
            setCompletedTripData({});
        }
    }

    useEffect(() => {
        if (_id) {
            fetchTripCompletedData()
        }
    }, [_id])

    return (
        <View style={[styles.bookingItem, booking.tripCompleted ? styles.disabled : null]}  >
            {/* header content */}
            <View style={styles.bookingDetails}>
                <View style={styles.vehicleType} >
                    <FontAwesome6 name="car" size={15} color="#006A67" />
                    <Text style={styles.tripText}>{booking?.vehicleType?.name}</Text>
                </View>
                <View style={[styles.tripType, booking.tripType === "one-way" ? { backgroundColor: "#FAB12F" } : { backgroundColor: "#8ABFA3" }]}>
                    <Text style={styles.tripText}>{booking?.tripType}</Text>
                </View>
            </View>
            <View style={styles.horizontalLine} />
            {/* main contant */}
            <View style={styles.bookingDetails}>
                <View>
                    <View style={styles.vehicleType}>
                        <FontAwesome6 name="location-dot" size={15} color="gray" style={{ padding: 2 }} />
                        <Text style={styles.pickupNdDropText}>Pickup at {"\n"}<Text style={styles.placeText}>{booking.pickupLocation.charAt(0).toUpperCase() + booking.pickupLocation.slice(1)}</Text></Text>
                    </View>
                    <View style={styles.addSpaceLine}>
                        <View style={styles.verticalLine} />
                    </View>
                    <View style={styles.vehicleType}>
                        <FontAwesome6 name="location-arrow" size={15} color="gray" style={{ padding: 2 }} />
                        <Text style={styles.pickupNdDropText}>Destination {"\n"}<Text style={styles.placeText}>{booking.destination.charAt(0).toUpperCase() + booking.destination.slice(1)}</Text></Text>
                    </View>
                </View>
                <View style={styles.bookingDetails}>
                    <Image style={{ width: 25, height: 25 }} source={require("../../assets/images/zigzag.png")} />
                    <Text style={styles.placeText}>{booking.totalKm} KM</Text>
                </View>
            </View>
            <View style={styles.bookingDetails}>
                <View style={[styles.tripInfo, booking.tripCompleted ? styles.btnDisabled : null]}>
                    <Text style={styles.tripInfoTxt} >Pickup Date</Text>
                    <Text style={{ fontWeight: 500, color: "white" }}>{dayMonthFormatter.format(new Date(`${booking.pickupDateTime}`)) + " " + timeFormatter.format(new Date(`${booking.pickupDateTime}`))}</Text>
                </View>
                <View style={[styles.tripInfo, booking.tripCompleted ? styles.btnDisabled : null]}>
                    <Text style={styles.tripInfoTxt}>Extras</Text>
                    <Text style={{ fontWeight: 500, color: "white" }}>₹{booking?.vehicleType?.perKm}/Km</Text>
                </View>
            </View>
            <View style={[styles.horizontalLine, { borderStyle: "dashed", borderColor: "#E4E0E1", borderBottomWidth: 2 }]} />
            <View style={styles.bookingDetails}>
                <View>
                    <Text style={[styles.pickupNdDropText, { paddingVertical: 2 }]}>Remaining Price</Text>
                    <Text style={{ fontWeight: "bold" }}>₹{" " + booking.totalPayment - booking.advancePayment}</Text>
                    <Text style={[styles.pickupNdDropText, { fontSize: 13 }]}>Toll Permit Extra</Text>
                    <View style={[styles.bookingDetails, { justifyContent: "start", gap: 10 }]}>
                        {(account === "1" || account === "3" || account === "2") &&
                            <>
                                <View style={[styles.iconBg, booking.tripCompleted ? styles.btnDisabled : null]} onStartShouldSetResponder={() => handleAllotment(booking)} title="Alloment">
                                    <Image style={{ width: 18, height: 18 }} source={require("../../assets/images/booking.png")} />
                                </View>
                                <View style={[styles.iconBg, booking.tripCompleted ? styles.btnDisabled : null]} onStartShouldSetResponder={() => makeCallToDriver(booking._id)}>
                                    <Text><FontAwesome6 name="phone" size={15} color="#000000" /></Text>
                                </View>
                                <View style={[styles.iconBg, booking.tripCompleted ? styles.btnDisabled : null]} onStartShouldSetResponder={() => shareData(booking._id)}>
                                    <Text><FontAwesome6 name="share" size={15} color="#000000" /></Text>
                                </View>
                            </>
                        }
                        {
                            account === "4" &&
                            <>
                                <View style={[styles.iconBg, booking.tripCompleted ? styles.btnDisabled : null]} onStartShouldSetResponder={() => completedTripData?.tripDoc?.length === 0 ? takePhotoAndUpload(booking._id) : warnMsg("starting km")}>
                                    <Text style={styles.iconTxt} >
                                        Start
                                    </Text>
                                </View>
                                <View style={[styles.iconBg, booking.tripCompleted ? styles.btnDisabled : null]} onStartShouldSetResponder={() => completedTripData?.tripDoc?.length === 1 ? takePhotoAndUpload(booking._id) : warnMsg("closing km")}>
                                    <Text style={styles.iconTxt} >
                                        End
                                    </Text>
                                </View>
                            </>
                        }
                        {
                            ["1", "4"].includes(account) &&
                            <View
                                style={[
                                    styles.iconBg,
                                    booking.tripCompleted ? styles.btnDisabled : null, // Apply disabled style if trip is completed
                                ]}
                                onStartShouldSetResponder={() => updateTripCompleted(booking)} // Allow responder, required for onPress
                            >
                                <Text>
                                    <FontAwesome6 name="check" size={16} color="#000000" />
                                </Text>
                            </View>
                        }
                    </View>
                    {
                        ["1", "4"].includes(account) &&
                        <View
                            style={[
                                styles.iconBg,
                                {
                                    backgroundColor: "#FFD65A",
                                    flexDirection: "row"
                                },

                            ]}
                        >
                            <Text><FontAwesome6 name="circle-exclamation" color="#000000" /> Important: </Text>
                            {
                                booking.placesToVisit.map((data) => {
                                    return <Text key={data}>{data}, </Text>
                                })
                            }
                        </View>
                    }
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    iconBg: {
        backgroundColor: "#8ABFA3",
        padding: 10,
        borderRadius: 5
    },
    iconTxt: {
        fontSize: 15,
        fontWeight: 700
    },
    bookingItem: {
        width: '100%',
        marginBottom: 10,
        padding: 10,
        borderWidth: 1,
        borderRadius: 5,
        borderColor: '#ddd',
        backgroundColor: '#f9f9f9',
    },
    bookingDetails: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'top',
        paddingVertical: 10
    },
    vehicleType: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        // fontSize: 17
    },
    disabled: {
        backgroundColor: "#E4E0E1"
    },
    btnDisabled: {
        backgroundColor: "#B7B7B7"
    },
    tripType: {
        padding: 5,
        borderRadius: 5,
        textTransform: "uppercase"
    },
    tripText: {
        // fontSize: 14,
        color: 'black',
        fontWeight: "bold",
    },
    horizontalLine: {
        borderBottomColor: "gray",
        borderBottomWidth: 1,
        paddingVertical: 4,

    },
    addSpaceLine: {
        flex: 1,
        paddingLeft: 6
    },
    tripInfo: {
        backgroundColor: "#006A67",
        padding: 5,
        borderRadius: 5,
        width: "45%",
        alignItems: "center"
    },
    tripInfoTxt: {
        // fontSize: 10,
        color: "white",
        fontWeight: 500
    },
    verticalLine: {
        width: 0, // Vertical line has no width
        height: 40, // Adjust height of the line
        borderRightWidth: 2, // Border width defines the thickness
        borderRightColor: "#7ED4AD", // Set line color
    },
    pickupNdDropText: {
        // fontSize: 10,
        color: "gray",
        fontWeight: 500
    },
    placeText: {
        // fontSize: 15,
        fontWeight: 600,
        color: "black"
    }
})