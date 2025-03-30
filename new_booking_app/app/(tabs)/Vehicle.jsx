import React, { useContext, useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { Box, Heading, VStack, FormControl, Input, Button, HStack, Stack, Center } from "native-base";
import axios from 'axios';
import { EssentialValues } from "../_layout";
import Toast from 'react-native-toast-message';
import { API_BASEURL } from "@env";
import { useRouter } from 'expo-router';
import { Table, TableWrapper, Row } from 'react-native-table-component';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Loader from '@/components/ui/Loader';
import styles from "../TablePageStyle";

export default function Vehicle() {
    const router = useRouter();
    const { data } = useContext(EssentialValues);
    const { token } = data;
    const [vehicle, setVehicle] = useState({});
    const [vehicles, setVehicles] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isWorkingApi, setIsWorkingApi] = useState(false);
    const [isChangeVehicle, setIsChangevehicle] = useState(false);
    const [vehicleName, setVehicleName] = useState('');
    const tableHead = ['Name', 'PerKm', 'PerDay', 'Capacity', 'VehicleNo', "Action"];
    const columnWidths = [120, 80, 80, 100, 150, 80];
    const [filteredVehicles, setFilteredVehicles] = useState([]);

    function addVehicleObj(value, name) {
        setVehicle((pre) => ({
            ...pre,
            [name]: value
        }));
    }


    // add vehicle
    async function addVehicle() {
        setIsWorkingApi(true);
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
            setVehicle({});
            router.push("/Vehicle");
        } catch (error) {

            Toast.show({
                type: "error",
                text1: "Failed",
                text2: error.response.data.error
            });
        } finally {
            setIsWorkingApi(false);
        }
    }

    // get vehicle data by id
    async function fetchVehicleData(name) {
        try {
            const res = await axios.get(`${API_BASEURL}/api/vehicle/${name}`, {
                headers: {
                    Authorization: token || ""
                }
            })
            setVehicle(res.data);
            handleChangeVehicle();
        } catch (error) {
            console.log("error in fetch vehicle data", error);

        }
    }

    // get all vehicles data
    async function fetchVehicles() {
        setIsLoading(true)
        try {
            const res = await axios.get(`${API_BASEURL}/api/vehicle`, {
                headers: {
                    Authorization: token || ""
                }
            })
            setVehicles(res.data.map((item) => [
                item.name,
                item.perKm,
                item.perDay,
                item.capacity,
                item.vehicleNo,
                <Text style={{ width: "100%", textAlign: "center" }}>
                    <TouchableOpacity key={item.vehicleNo} onPress={() => fetchVehicleData(item.vehicleNo)}>
                        <FontAwesome name="pencil" size={24} color="black" />
                    </TouchableOpacity>
                </Text>
            ]));
            setFilteredVehicles(res.data.map((item) => [
                item.name,
                item.perKm,
                item.perDay,
                item.capacity,
                item.vehicleNo,
                <Text style={{ width: "100%", textAlign: "center" }}>
                    <TouchableOpacity key={item.vehicleNo} onPress={() => fetchVehicleData(item.vehicleNo)}>
                        <FontAwesome name="pencil" size={24} color="black" />
                    </TouchableOpacity>
                </Text>
            ]))
        } catch (error) {
            console.log("error in fetch vehicles", error);
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        // Filter customers based on search term
        if (vehicleName === "") {
            setVehicles(filteredVehicles)
        } else {
            setVehicles(filteredVehicles?.filter((taxi) => taxi?.some((field) => field.toString().toLowerCase().includes(vehicleName))))
        }
    }, [vehicleName])

    function handleChangeVehicle() {
        if (isChangeVehicle) {
            setVehicle({})
        }
        setIsChangevehicle(!isChangeVehicle)
    }

    async function editVehicle() {
        setIsWorkingApi(true);
        try {
            const res = await axios.put(`${API_BASEURL}/api/vehicle/${vehicle._id}`, vehicle,
                {
                    headers: {
                        Authorization: token || ""
                    }
                });
            Toast.show({
                type: "success",
                text1: "Success",
                text2: res.data.message
            })
            setVehicle({});
            fetchVehicles();
            setIsChangevehicle(false);
        } catch (error) {
            Toast.show({
                type: "error",
                text1: "Failed",
                text2: error.response.data.error
            })
        } finally {
            setIsWorkingApi(false);
        }
    }

    useEffect(() => {
        fetchVehicles();
    }, [])

    return (
        isChangeVehicle ?
            <Center>
                <Box safeArea p="2" py="2" w="90%" maxW="290">
                    <Heading size="lg" fontWeight="600" color="coolGray.800">
                        {vehicle._id ? "Edit" : "New"} Vehicle Details
                    </Heading>
                    <VStack space={3} mt="5">
                        <FormControl>
                            <FormControl.Label>Vehicle Name</FormControl.Label>
                            <Input
                                value={vehicle?.name || ""}
                                onChangeText={(value) => addVehicleObj(value, "name")}
                            />
                        </FormControl>
                        <FormControl>
                            <FormControl.Label>Vehicle Per/Km</FormControl.Label>
                            <Input
                                keyboardType='numeric'
                                value={vehicle?.perKm ? String(vehicle?.perKm) : ""}
                                onChangeText={(value) => addVehicleObj(value, "perKm")}
                            />
                        </FormControl>
                        <FormControl>
                            <FormControl.Label>Vehicle Per/Day</FormControl.Label>
                            <Input
                                keyboardType='numeric'
                                value={vehicle?.perDay ? String(vehicle?.perDay) : ""}
                                onChangeText={(value) => addVehicleObj(value, "perDay")}
                            />
                        </FormControl>
                        <FormControl>
                            <FormControl.Label>Vehicle Capacity</FormControl.Label>
                            <Input
                                keyboardType='numeric'
                                value={vehicle?.capacity ? String(vehicle?.capacity) : ""}
                                onChangeText={(value) => addVehicleObj(value, "capacity")}
                            />
                        </FormControl>
                        <FormControl>
                            <FormControl.Label>Vehicle Number</FormControl.Label>
                            <Input
                                value={vehicle?.vehicleNo ? String(vehicle?.vehicleNo) : ""}
                                onChangeText={(value) => addVehicleObj(value, "vehicleNo")}
                            />
                        </FormControl>
                        <HStack style={{ justifyContent: "space-around" }}>
                            <Button variant={"outline"} onPress={handleChangeVehicle}>
                                Cancel
                            </Button>
                            <Button onPress={vehicle._id ? editVehicle : addVehicle}>
                                {isWorkingApi ? <Loader color={"white"} /> : "Add Vehicle"}
                            </Button>
                        </HStack>
                    </VStack>
                </Box>
            </Center> :
            <View style={{ flex: 1 }}>
                <Input
                    placeholder="Search by any field..."
                    value={vehicleName}
                    onChangeText={(text) => setVehicleName(text.toLowerCase())}
                    style={styles.searchInput}
                    variant="filled"
                />
                <ScrollView horizontal>
                    <View style={styles.container}>
                        {
                            isLoading ? <Loader size={"lg"} /> :
                                <Table borderStyle={styles.tableBorder}>
                                    <Row
                                        data={tableHead}
                                        widthArr={columnWidths}
                                        style={styles.tableHead}
                                        textStyle={styles.headerText}
                                    />
                                    {vehicles?.length > 0 ? (
                                        <TableWrapper>
                                            {vehicles?.map((rowData, rowIndex) => (
                                                <Row
                                                    key={rowIndex}
                                                    widthArr={columnWidths}
                                                    data={rowData}
                                                    textStyle={styles.rowText}
                                                />
                                            ))}
                                        </TableWrapper>
                                    ) : (
                                        <Text style={styles.noDataText}>No Vehicles found</Text>
                                    )}
                                </Table>
                        }
                    </View>
                </ScrollView>
                <TouchableOpacity style={styles.floatingButton} onPress={handleChangeVehicle}>
                    <FontAwesome6 name="plus" size={24} color="white" />
                </TouchableOpacity>
            </View>
    );
}
