import { useContext, useEffect, useState } from "react";
import { View, Text, Image, StyleSheet, ScrollView } from "react-native";
import axios from "axios";
import NoFound from "../../components/ui/NoFound";
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { EssentialValues } from "../_layout";
import { API_BASEURL } from "@env";
import Loader from "@/components/ui/Loader";

export default function BookingHistory() {

    const [bookings, setBookings] = useState([]);
    const [allotments, setAllotments] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const { data, changeBookings } = useContext(EssentialValues);
    const { account, _id, token } = data;
    const dayMonthFormatter = new Intl.DateTimeFormat("en-GB", {
        day: "2-digit",
        month: "short",
    });

    const timeFormatter = new Intl.DateTimeFormat("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
    });

    async function fetchAllertedBooking() {
        try {
            const alts = await axios.get(`${API_BASEURL}/api/allotment`, {
                headers: { Authorization: data.token }
            });
            setAllotments(alts.data);
        } catch (error) {
            console.log(error);
        }
    }

    async function getAllotorBooking() {
        setIsLoading(true);
        try {
            const trips = await axios.get(`${API_BASEURL}/api/booking/allotor-booking/${_id}`, {
                headers: {
                    Authorization: token || ""
                }
            });
            setBookings(trips.data.filter((data) => data.tripCompleted === true));
        } catch (error) {
            setErrorMsg(error?.response?.data?.error);
        } finally {
            setIsLoading(false);
        }
    }

    async function getDriverBookings() {
        setIsLoading(true);
        try {
            const trips = await axios.get(`${API_BASEURL}/api/booking/driver-booking/${_id}`, {
                headers: { Authorization: data.token }
            });
            setBookings(trips.data.filter((data) => data.tripCompleted === true));
        } catch (error) {
            setErrorMsg(error?.response?.data?.error);
        }finally{
            setIsLoading(false);
        }
    }

    useEffect(() => {
        const getBookings = async () => {
            setIsLoading(true);
            try {
                const booking = await axios.get(`${API_BASEURL}/api/booking`, {
                    headers: { Authorization: data.token }
                });
                const allBookings = booking.data.filter((data) => data.tripCompleted === true);
                if (account === "1") {
                    setBookings(allBookings);
                } else {
                    setBookings(allBookings.filter((booking) => booking.bookingOfficer === _id));
                }
            } catch (error) {
                setErrorMsg(error?.response?.data?.error);
            }finally{
                setIsLoading(false);
            
            }
        };
        if (["1", "2"].includes(account)) {
            getBookings();
        } else if (account === "3") {
            getAllotorBooking();
        } else if (account === "4") {
            getDriverBookings();
        }
        fetchAllertedBooking();
    }, [changeBookings]);

    return (
        <ScrollView>
            <View style={styles.container}>
                {isLoading ? (
                    <Loader size="large" color="blue" />
                ) : (
                    errorMsg || bookings.length === 0 ? (
                        <NoFound message={errorMsg || "No History of Bookings"} />
                    ) : (
                        bookings.map((booking, index) => (
                            <View key={index} style={[styles.bookingItem, booking.tripCompleted ? styles.disabled : null]} >
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
                                        <Text style={{ fontWeight: 500, color: "white" }}>₹{booking?.allotment?.vehicle?.perKm}/Km</Text>
                                    </View>
                                </View>
                                <View style={[styles.horizontalLine, { borderStyle: "dashed", borderColor: "#E4E0E1", borderBottomWidth: 2 }]} />
                                <View style={styles.bookingDetails}>
                                    <View>
                                        <Text style={[styles.pickupNdDropText, { paddingVertical: 2 }]}>Remaining Price</Text>
                                        <Text style={{ fontWeight: "bold" }}>₹{" " + booking.totalPayment - booking.advancePayment}</Text>
                                        <Text style={[styles.pickupNdDropText, { fontSize: 13 }]}>Toll Permit Extra</Text>
                                        <View style={[styles.bookingDetails, { justifyContent: "start", gap: 10 }]}>
                                            <View style={[styles.iconBg, booking.tripCompleted ? styles.btnDisabled : null]} onStartShouldSetResponder={() => (account === "1" || account === "3") && navigation.navigate("allotment", { id: booking._id })} title="Alloment">
                                                <Image style={{ width: 18, height: 18 }} source={require("../../assets/images/booking.png")} />
                                            </View>
                                            <View style={[styles.iconBg, booking.tripCompleted ? styles.btnDisabled : null]} onStartShouldSetResponder={() => (account === "1" || account === "3" || account === "2") && makeCallForDriver(allotments.find((allot) => allot.bookingId === booking._id && allot))}>
                                                <Text><FontAwesome6 name="phone" size={15} color="#000000" /></Text>
                                            </View>
                                            <View style={[styles.iconBg, booking.tripCompleted ? styles.btnDisabled : null]} onStartShouldSetResponder={() => (account === "1" || account === "3" || account === "2") && shareData(allotments.find((allot) => allot.bookingId === booking._id && allot))}>
                                                <Text><FontAwesome6 name="share" size={15} color="#000000" /></Text>
                                            </View>
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
                                    </View>
                                </View>
                            </View>
                        ))
                    )
                )}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        alignItems: 'center',
        // boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px",
        marginBottom: 40
    },
    iconBg: {
        backgroundColor: "#8ABFA3",
        padding: 10,
        borderRadius: 50
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
});