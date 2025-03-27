import React, { useContext, useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { Box, Heading, VStack, FormControl, Input, Button, Spinner, HStack, Stack, Center } from "native-base";
import axios from 'axios';
import { EssentialValues } from "../_layout";
import Toast from 'react-native-toast-message';
import { API_BASEURL } from "@env";
import { useRouter } from 'expo-router';
import { Table, TableWrapper, Row } from 'react-native-table-component';

export default function Vehicle() {
    const router = useRouter();
    const { data } = useContext(EssentialValues);
    const { token } = data;
    const [vehicle, setVehicle] = useState({});
    const [vehicles, setVehicles] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isWorkingApi, setIsWorkingApi] = useState(false);
    const [isChangeVehicle, setIsChangevehicle] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const tableHead = ['Name', 'PerKm', 'PerDay', 'Capacity', 'VehicleNo'];

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
                item.vehicleNo
            ]));

        } catch (error) {
            console.log("error in fetch vehicles", error);
        }
        setIsLoading(false)
    }


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
        <ScrollView>
            <Center contentContainerStyle={[styles.container, isChangeVehicle ? { alignItems: "center" } : {}]} >
                {
                    isChangeVehicle ?
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
                                        {isWorkingApi ? <Spinner color={"white"} /> : "Add Vehicle"}
                                    </Button>
                                </HStack>
                            </VStack>
                        </Box> :
                        <View style={styles.container}>
                            {
                                isLoading ? <Spinner size={"lg"} /> :
                                    <>
                                        <Stack alignItems={"center"}>
                                            <Button onPress={handleChangeVehicle} >+ Add Vehicle</Button>
                                        </Stack>

                                        <Input
                                            placeholder="Search by any field..."
                                            value={searchTerm}
                                            onChangeText={(text) => setSearchTerm(text)}
                                            style={styles.searchInput}
                                            variant="filled"
                                        />
                                        <Table borderStyle={styles.tableBorder}>
                                            <Row
                                                data={tableHead}
                                                style={styles.tableHead}
                                                textStyle={styles.headerText}
                                            />
                                            {vehicles?.length > 0 ? (
                                                <TableWrapper>
                                                    {vehicles?.map((rowData, rowIndex) => (
                                                        <TouchableOpacity key={rowIndex} onPress={() => fetchVehicleData(rowData[0])} >
                                                            <Row
                                                                data={rowData}
                                                                textStyle={styles.rowText}
                                                            />
                                                        </TouchableOpacity>
                                                    ))}
                                                </TableWrapper>
                                            ) : (
                                                <Text style={styles.noDataText}>No Vehicles found</Text>
                                            )}
                                        </Table>
                                    </>
                            }
                        </View>
                }
            </Center>
        </ScrollView>
    );
}


const styles = StyleSheet.create({
    container: {
        width: "100%",
        backgroundColor: '#fff',

    },
    searchInput: {
        marginVertical: 10,
        paddingHorizontal: 10,
        fontSize: 16,
        backgroundColor: '#f5f5f5',
        borderRadius: 8
    },
    tableBorder: {
        borderWidth: 1,
        borderColor: '#c8e1ff',
    },
    tableHead: {
        height: 50,
        backgroundColor: '#4CAF50',
    },
    headerText: {
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#fff',
    },
    rowText: {
        fontSize: 14,
        textAlign: 'center',
        padding: 8,
    },
    noDataText: {
        marginTop: 20,
        textAlign: 'center',
        fontSize: 16,
        color: '#888',
    },
});