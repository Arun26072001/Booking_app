import { ScrollView, TouchableOpacity, StyleSheet, View, Text } from 'react-native';
import React, { useState, useEffect, useContext } from 'react';
import Toast from "react-native-toast-message";
import { Center, Box, Heading, VStack, FormControl, Input, Button } from "native-base";
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from "axios";
import { API_BASEURL } from "@env";
import { useRouter, useLocalSearchParams } from 'expo-router';
import { EssentialValues } from "../_layout";
import { Picker } from '@react-native-picker/picker';
import Selector from '../../components/ui/Selector';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Loader from '@/components/ui/Loader';

export default function Booking() {
    const router = useRouter();
    const { bookingId } = useLocalSearchParams();
    const { updateBooking, data } = useContext(EssentialValues);
    const [isLoading, setIsLoading] = useState(false);
    const [show, setShow] = useState(null);
    const [employees, setEmployees] = useState([]);
    const [drivers, setDrivers] = useState([]);
    const [vehicles, setVehicles] = useState([]);
    const [pickupDate, setPickupDate] = useState("");
    const [pickupTime, setPickupTime] = useState("");
    const [dropDate, setDropDate] = useState("");
    const [dropTime, setDropTime] = useState("");
    const [bookingObj, setBookingObj] = useState({});
    const [stateData, setStateData] = useState([]);
    const [isWorkingApi, setIsWorkingApi] = useState(false);

    const onSelectedItemsChange = (value) => {
        setBookingObj((prev) => ({
            ...prev,
            placesToVisit: [...new Set([...(prev.placesToVisit || []), value].flat())] // Safely append the value to placesToVisit
        }));
    };

    function handlePickupChange(event, value) {
        if (show === "pickupDate") {
            const datevalue = `${new Date(value).getFullYear()}-${new Date(value).getMonth() + 1}-${new Date(value).getDate()}`;
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
            const datevalue = `${new Date(value).getFullYear()}-${new Date(value).getMonth() + 1}-${new Date(value).getDate()}`;
            setDropDate(datevalue)
            setShow("")

        } else {
            const timeValue = `${new Date(value).getHours()}:${new Date(value).getMinutes()}`;
            setDropTime(timeValue)
            setShow("")
        }

    }

    function fillBookingForm(value, name) {
        const keys = name.split("."); // Split the name by "."
        if (keys.length > 1) {
            setBookingObj((prev) => ({
                ...prev,
                [keys[0]]:
                {
                    ...prev[keys[0]], // Access the first element of the nested array
                    [keys[1]]: value,   // Update the specific nested property
                }
            }));
        } else {
            // If `name` is not nested
            setBookingObj((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    }


    function removePlace(value) {
        setBookingObj((pre) => ({
            ...pre,
            placesToVisit: pre.placesToVisit.filter((place) => place !== value)
        }))
    }

    function resetPickupDropDtTime() {
        setPickupDate("");
        setPickupTime("");
        setDropDate("");
        setDropTime("");
    }

    async function addBooking() {
        setIsWorkingApi(true);
        try {
            const newBooking = {
                ...bookingObj,
                "pickupDateTime": `${pickupDate} ${pickupTime}`,
                "dropDateTime": `${dropDate} ${dropTime}`
            }

            const bookingAdding = await axios.post(`${API_BASEURL}/api/booking/${data._id}`, newBooking, {
                headers: {
                    Authorization: data.token || ""
                }
            })
            Toast.show({
                type: "success",
                text1: bookingAdding.data.message
            })
            resetPickupDropDtTime()
            updateBooking();
            setBookingObj({})
            router.push("/Home");
        } catch (error) {
            Toast.show({
                type: "error",
                text1: error.response.data.error
            })
        }
        setIsWorkingApi(false);
    }

    async function fetchStates() {
        try {
            const states = await axios.get(`${API_BASEURL}/api/state`, {
                headers: { Authorization: data.token }
            });
            setStateData(states.data);
        } catch (error) {
            Toast.show({
                type: "error",
                text1: "failed",
                text2: error.response.data.error
            })
        }
    }

    async function fetchVehicle() {
        try {
            const vehiclesData = await axios.get(`${API_BASEURL}/api/vehicle`, {
                headers: {
                    Authorization: data.token
                }
            });
            setVehicles(vehiclesData.data);

        } catch (error) {
            Toast.show({
                type: "error",
                text1: error?.response?.data?.error
            })
        }
    }

    async function editBooking() {
        setIsWorkingApi(true);
        try {
            const res = await axios.put(`${API_BASEURL}/api/booking/${bookingId}`, bookingObj, {
                headers: {
                    Authorization: data.token || ""
                }
            });
            resetPickupDropDtTime();
            Toast.show({
                type: "success",
                text1: res.data.message
            })
            updateBooking();
            setBookingObj({});
            router.push("/Home");
        } catch (error) {
            Toast.show({
                type: "error",
                text1: "Failed",
                text2: error.response.data.error
            })
        }
        setIsWorkingApi(false);
    }

    useEffect(() => {
        async function fetchBooking() {
            setIsLoading(true);
            try {
                const booking = await axios.get(`${API_BASEURL}/api/booking/${bookingId}`, {
                    headers: { Authorization: data.token }
                });

                setBookingObj(booking.data);
                const { pickupDateTime, dropDateTime } = booking.data
                setPickupDate(pickupDateTime.split(" ")[0]);
                setPickupTime(pickupDateTime.split(" ")[1]);
                setDropDate(dropDateTime.split(" ")[0]);
                setDropTime(dropDateTime.split(" ")[1]);

            } catch (error) {
                Toast.show({
                    type: "error",
                    text1: "Failed",
                    text2: error.response.data.error
                })
            }
            setIsLoading(false)
        }
        if (bookingId) {
            fetchBooking()
        }
    }, [bookingId])


    async function fetchEmps() {
        try {
            const response = await axios.get(`${API_BASEURL}/api/auth`, {
                headers: {
                    Authorization: data.token || ""
                }
            });
            setEmployees(response.data);
            setDrivers(response.data.filter((emp) => emp.account === 4));

        } catch (error) {
            console.error("Error fetching employees:", error.toJSON ? error.toJSON() : error);

            // Show error notification
            Toast.show({
                type: "error",
                text1: "Failed to Fetch Employees",
                text2: error?.response?.data?.error || "An unexpected error occurred. Please try again later.",
            });
        }
    };

    useEffect(() => {
        fetchVehicle();
        fetchEmps();
        fetchStates();
    }, []);


    return (
        <ScrollView>
            {isLoading ? <Loader size="large" color="blue" /> :
                <Center w="100%">
                    <Box safeArea p="2" w="90%" maxW="290" py="8">
                        <Heading size="lg" color="coolGray.800" _dark={{
                            color: "warmGray.50"
                        }} fontWeight="semibold">
                            Trip Booking
                        </Heading>
                        <VStack space={3} mt="5">
                            <FormControl>
                                <FormControl.Label>Customer Name</FormControl.Label>
                                <Input size={"xl"} value={bookingObj.customerName} style={[styles.input, { borderWidth: 0 }]} type="text" onChangeText={(value) => fillBookingForm(value, "customerName")} />
                            </FormControl>
                            <FormControl>
                                <FormControl.Label>Customer Contact</FormControl.Label>
                                <Input size={"xl"} keyboardType='numeric' value={bookingObj?.customerContact} style={[styles.input, { borderWidth: 0 }]} type="text" onChangeText={(value) => fillBookingForm(value, "customerContact")} />
                            </FormControl>
                            <FormControl>
                                <FormControl.Label>Pickup Location</FormControl.Label>
                                <Input size={"xl"} value={bookingObj?.pickupLocation} style={[styles.input, { borderWidth: 0 }]} type="text" onChangeText={(value) => fillBookingForm(value, "pickupLocation")} />
                            </FormControl>
                            <FormControl>
                                <FormControl.Label>Destination</FormControl.Label>
                                <Input size={"xl"} value={bookingObj?.destination} style={[styles.input, { borderWidth: 0 }]} type="text" onChangeText={(value) => fillBookingForm(value, "destination")} />
                            </FormControl>
                            <FormControl>
                                <FormControl.Label>Trip Type</FormControl.Label>
                                <Picker selectedValue={bookingObj?.tripType} onValueChange={(e) => fillBookingForm(e, "tripType")} >
                                    <Picker.Item label='Select Trip type' />
                                    <Picker.Item label='One way' value={"one-way"} />
                                    <Picker.Item label='Round Trip' value={"round-trip"} />
                                </Picker>
                            </FormControl>
                            <FormControl>
                                <FormControl.Label>Customer Email</FormControl.Label>
                                <Input type="email" value={bookingObj?.email} size={"xl"} style={[styles.input, { borderWidth: 0 }]} onChangeText={(value) => fillBookingForm(value, "email")} />
                            </FormControl>
                            <FormControl>
                                <FormControl.Label>Booking Officer</FormControl.Label>
                                <Picker selectedValue={bookingObj?.bookingOfficer || data._id} ValueChange={(e) => fillBookingForm(e, "bookingOfficer")} >
                                    <Picker.Item label='Select Booking Officer' />
                                    {
                                        employees?.map((emp) => {
                                            return <Picker.Item key={emp._id} label={emp.name} value={emp._id} />
                                        })
                                    }
                                </Picker>
                            </FormControl>
                            <FormControl>
                                <FormControl.Label>Vehicle Type</FormControl.Label>
                                <Picker selectedValue={bookingObj?.vehicleType} onValueChange={(e) => fillBookingForm(e, "vehicleType")}>
                                    <Picker.Item label='Select Vehicle Type' />
                                    {
                                        vehicles?.map((vehicle) => {
                                            return <Picker.Item key={vehicle._id} label={vehicle.name + " " + (vehicle.capacity-1 + "+1")} value={vehicle._id} />
                                        })
                                    }
                                </Picker>
                            </FormControl>
                            {/* Pickup Date & Time */}
                            <FormControl>
                                <FormControl.Label>Pickup Date & Time</FormControl.Label>
                                <View style={styles.container}>
                                    <TouchableOpacity style={styles.bookingDetails}>
                                        <Input
                                            size="xl"
                                            style={[styles.input, { borderWidth: 0 }]}
                                            min={new Date()}
                                            value={pickupDate}
                                            onFocus={() => setShow("pickupDate")}
                                            placeholder="Select Pickup Date"
                                        />
                                        <Input
                                            size="xl"
                                            style={[styles.input, { borderWidth: 0 }]}
                                            value={pickupTime}
                                            onFocus={() => setShow("pickupTime")}
                                            placeholder="Select Pickup Time"
                                        />
                                        {show === "pickupDate" && (
                                            <DateTimePicker
                                                value={new Date()}
                                                mode="date"
                                                minimumDate={new Date()}
                                                display="default"
                                                onChange={handlePickupChange}
                                            />
                                        )}
                                        {show === "pickupTime" && (
                                            <DateTimePicker
                                                value={new Date()}
                                                mode="time"
                                                display="default"
                                                onChange={handlePickupChange}
                                            />
                                        )}
                                    </TouchableOpacity>
                                </View>
                            </FormControl>

                            {/* Drop Date & Time */}
                            <FormControl>
                                <FormControl.Label>Drop Date & Time</FormControl.Label>
                                <View style={styles.container}>
                                    <TouchableOpacity style={styles.bookingDetails}>
                                        <Input
                                            size="xl"
                                            style={[styles.input, { borderWidth: 0 }]}
                                            value={dropDate}
                                            onFocus={() => setShow("dropDate")}
                                            placeholder="Select Drop Date"
                                        />
                                        <Input
                                            size="xl"
                                            style={[styles.input, { borderWidth: 0 }]}
                                            value={dropTime}
                                            onFocus={() => setShow("dropTime")}
                                            placeholder="Select Drop Time"
                                        />
                                        {show === "dropDate" && (
                                            <DateTimePicker
                                                value={new Date()}
                                                mode="date"
                                                minimumDate={new Date()}
                                                display="default"
                                                onChange={handleDropChange}
                                            />
                                        )}
                                        {show === "dropTime" && (
                                            <DateTimePicker
                                                value={new Date()}
                                                mode="time"
                                                display="default"
                                                onChange={handleDropChange}
                                            />
                                        )}
                                    </TouchableOpacity>
                                </View>
                            </FormControl>

                            <FormControl>
                                <FormControl.Label>Places to Visit</FormControl.Label>
                                {bookingObj?.placesToVisit?.length > 0 ? (
                                    stateData.map((state) =>
                                        state.stateName === bookingObj?.placesToVisit[0] ? (
                                            <Selector
                                                key={state}
                                                // Ensure the `Selector` has a unique key
                                                items={state.cities}
                                                onChange={onSelectedItemsChange}
                                                name="placesToVisit"
                                            />
                                        ) : null
                                    )
                                ) : (
                                    <Picker onValueChange={(e) => onSelectedItemsChange(e, "placesToVisit")}>
                                        <Picker.Item label="Select the State" />
                                        {stateData.map((state) => (
                                            <Picker.Item key={state._id} label={state.stateName} value={state.stateName} />
                                        ))}
                                    </Picker>
                                )}
                            </FormControl>
                            <ScrollView horizontal={true} >
                                <View style={{ flexDirection: "row", alignSelf: "auto" }}>
                                    {
                                        bookingObj?.placesToVisit?.map((place, index) => {
                                            return <Text style={styles.place} onPress={() => removePlace(place)} key={index}>{place} <FontAwesome6 name="xmark" size={15} color="#006A67" /></Text>
                                        })
                                    }
                                </View>
                            </ScrollView>

                            <FormControl>
                                <FormControl.Label>Total Km</FormControl.Label>
                                <Input size={"xl"} keyboardType='numeric' value={bookingObj?.totalKm ? String(bookingObj?.totalKm) : ""} style={[styles.input, { borderWidth: 0 }]} onChangeText={(value) => fillBookingForm(value, "totalKm")} />
                            </FormControl>
                            <FormControl>
                                <FormControl.Label>Total Payment</FormControl.Label>
                                <Input size={"xl"} keyboardType='numeric' value={bookingObj?.totalPayment ? String(bookingObj?.totalPayment) : ""} style={[styles.input, { borderWidth: 0 }]} onChangeText={(value) => fillBookingForm(value, "totalPayment")} />
                            </FormControl>
                            <FormControl>
                                <FormControl.Label>Advance Payment</FormControl.Label>
                                <Input
                                    size={"xl"}
                                    keyboardType='numeric'
                                    value={bookingObj?.advancePayment ? String(bookingObj?.advancePayment) : ""} style={[styles.input, { borderWidth: 0 }]}
                                    onChangeText={(value) => fillBookingForm(value, "advancePayment")} />
                            </FormControl>
                            {
                                bookingObj?.allotment &&
                                <>
                                    <FormControl>
                                        <FormControl.Label>Allotment Officer</FormControl.Label>
                                        <Picker selectedValue={bookingObj?.allotment?.allotmentOfficer} onValueChange={(value) => fillBookingForm(value, "allotment.allotmentOfficer")} >
                                            <Picker.Item label="Select Allotment Office" />
                                            {
                                                employees?.map((emp) => {
                                                    return <Picker.Item key={emp._id} label={emp.name} value={emp._id} />
                                                })
                                            }
                                        </Picker>
                                    </FormControl>
                                    <FormControl>
                                        <FormControl.Label>Driver</FormControl.Label>
                                        <Picker selectedValue={bookingObj?.allotment?.driver} onValueChange={(value) => fillBookingForm(value, "allotment.driver")} >
                                            <Picker.Item label="Select Driver" />
                                            {
                                                drivers?.map((emp) => {
                                                    return <Picker.Item key={emp._id} label={emp.name} value={emp._id} />
                                                })
                                            }
                                        </Picker>
                                    </FormControl>
                                    <FormControl>
                                        <FormControl.Label>Vehicle</FormControl.Label>
                                        <Picker selectedValue={bookingObj?.allotment?.vehicle} onValueChange={(value) => fillBookingForm(value, "allotment.vehicle")} >
                                            <Picker.Item label="Select Vehicle" />
                                            {
                                                vehicles?.map((taxi) => {
                                                    return <Picker.Item key={taxi._id} label={taxi.name} value={taxi._id} />
                                                })
                                            }
                                        </Picker>
                                    </FormControl>
                                    {
                                        bookingObj.vehicleIntrip &&
                                        <>
                                            <FormControl>
                                                <FormControl.Label>Starting Km</FormControl.Label>
                                                <Input
                                                    keyboardType='numeric'
                                                    value={String(bookingObj?.vehicleInTrip?.startingKm) || ""}
                                                    onChangeText={(value) => fillBookingForm(value, "vehicleInTrip.startingKm")}
                                                />
                                            </FormControl>
                                            <FormControl>
                                                <FormControl.Label>closing Km</FormControl.Label>
                                                <Input
                                                    keyboardType='numeric'
                                                    value={String(bookingObj?.vehicleInTrip?.closingKm) || ""}
                                                    onChangeText={(value) => fillBookingForm(value, "vehicleInTrip.closingKm")}
                                                />
                                            </FormControl>
                                            <FormControl>
                                                <FormControl.Label>Received Amount</FormControl.Label>
                                                <Input
                                                    keyboardType='numeric'
                                                    value={String(bookingObj?.vehicleInTrip?.receivedAmount) || ""}
                                                    onChangeText={(value) => fillBookingForm(value, "vehicleInTrip.receivedAmount")}
                                                />
                                            </FormControl>
                                        </>
                                    }
                                </>
                            }
                            <Button style={{ marginBottom: 20 }} backgroundColor={"#355F2E"} onPress={bookingId ? editBooking : addBooking}  >
                                {isWorkingApi ? <Loader color={"white"} /> : bookingId ? "Update Booking" : "Add Booking"}
                            </Button>
                        </VStack>
                    </Box>
                </Center>}
        </ScrollView >
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
        gap: 10
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        fontSize: 16,
        color: "#333",
    },
    button: {
        marginTop: 10,
        color: "#007BFF",
        textAlign: "center",
        fontSize: 16,
        textTransform: "uppercase",
    },
    place: {
        borderWidth: 1,
        borderColor: "#355F2E",
        padding: 10,
        borderRadius: 10,
        color: "#355F2E",
    }
})
