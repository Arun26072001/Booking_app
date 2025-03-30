import { useContext, useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { Button, Box, Heading, VStack, FormControl, Input, Spinner, Center, HStack } from "native-base";
import axios from "axios";
import Toast from "react-native-toast-message";
import { API_BASEURL } from "@env";
import { Picker } from '@react-native-picker/picker';
import { EssentialValues } from "../_layout";
import { Table, TableWrapper, Row } from 'react-native-table-component';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Loader from "@/components/ui/Loader";
import styles from "../TablePageStyle";

export default function Employees() {
    const { data } = useContext(EssentialValues);
    const [isWorkingApi, setIsWorkingApi] = useState(false);
    const [employees, setEmployees] = useState([]);
    const [filteredEmps, setfilteredEmps] = useState([]);
    const [empData, setEmpData] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [isChangeEmp, setIsChangeEmp] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const tableHead = ["Name", "Email", "Password", "Contact", "Work", "Action"];
    const columnWidths = [120, 200, 100, 150, 120, 100];

    function updateRegisterData(value, name) {
        setEmpData((prev) => ({
            ...prev,
            [name]: value,
        }));
    }

    function handleToggleForm() {
        setIsChangeEmp(!isChangeEmp);
    }

    async function fetchEmployeeData(email) {
        try {
            const res = await axios.get(`${API_BASEURL}/api/auth/${email}`, {
                headers: {
                    Authorization: data.token || ""
                }
            })
            setEmpData(res.data)
            handleToggleForm();
        } catch (error) {
            console.log(error);
        }
    }

    async function fetchEmployees() {
        setIsLoading(true);
        try {
            const res = await axios.get(`${API_BASEURL}/api/auth`, {
                headers: { Authorization: data.token || "" }
            });
            setEmployees(res.data.map(item => [
                item.name, item.email, "*****", item.contact, item.work,
                <Text style={{ width: "100%", textAlign: "center" }}>
                    <TouchableOpacity key={item.email} onPress={() => fetchEmployeeData(item.email)}>
                        <FontAwesome name="pencil" size={24} color="black" />
                    </TouchableOpacity>
                </Text>
            ]));
            setfilteredEmps(res.data.map(item => [
                item.name, item.email, "*****", item.contact, item.work,
                <Text style={{ width: "100%", textAlign: "center" }}>
                    <TouchableOpacity key={item.email} onPress={() => fetchEmployeeData(item.email)}>
                        <FontAwesome name="pencil" size={24} color="black" />
                    </TouchableOpacity>
                </Text>
            ]))
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }

    async function addEmployee() {
        setIsWorkingApi(true);
        try {
            const response = await axios.post(`${API_BASEURL}/api/auth`, empData, {
                headers: { Authorization: data.token || "" }
            });
            Toast.show({ type: "success", text1: "Success", text2: response.data.message });
            setEmpData({});
            fetchEmployees();
            setIsChangeEmp(false);
        } catch (error) {
            Toast.show({ type: "error", text1: "Failed", text2: error?.response?.data?.error || "An error occurred" });
        } finally {
            setIsWorkingApi(false);
        }
    }

    async function fetchEmployeeData(email) {
        try {
            const res = await axios.get(`${API_BASEURL}/api/auth/${email}`, {
                headers: {
                    Authorization: data.token || ""
                }
            })
            setEmpData(res.data)
            handleToggleForm();
        } catch (error) {
            console.log(error.response.data.error);
        }
    }

    async function editEmp() {
        try {
            const res = await axios.put(`${API_BASEURL}/api/auth/${empData._id}`, empData, {
                headers: {
                    Authorization: data.token || ""
                }
            })
            Toast.show({ type: "success", text1: "Success", "text2": res.data.message })
            setIsChangeEmp(false);
            fetchEmployees();
            setEmpData({});
        } catch (error) {
            Toast.show({ type: "error", text1: "Error", text2: error.response.data.error })
        }
    }

    // Filter customers based on search term
    useEffect(() => {
        if (searchTerm === "") {
            setEmployees(filteredEmps)
        } else {
            setEmployees(filteredEmps.filter((emp) =>
                emp?.some((field) =>
                    field.toString().toLowerCase().includes(searchTerm.toLowerCase())
                )
            ))
        }
    }, [searchTerm])

    useEffect(() => {
        fetchEmployees();
    }, []);

    return (
        isChangeEmp ? <Center>
            <Box safeArea p="2" py="2" w="90%" maxW="290">
                <Heading size="lg">{empData._id ? "Update" : "Register"} a {empData._id ? "Exist" : "New"} User</Heading>
                <Heading mt="1" size="xs" color="gray.600">Sign up to continue!</Heading>
                <VStack space={3} mt="5">
                    <FormControl><FormControl.Label>Name</FormControl.Label>
                        <Input value={empData?.name} onChangeText={(value) => updateRegisterData(value, "name")} />
                    </FormControl>
                    <FormControl><FormControl.Label>Work</FormControl.Label>
                        <Picker selectedValue={empData?.work} onValueChange={(value) => updateRegisterData(value, "work")}>
                            <Picker.Item label="Select Employee Role" value="" />
                            <Picker.Item label="Driver" value="Driver" />
                            <Picker.Item label="Booking Officer" value="Booking Officer" />
                            <Picker.Item label="Taxi Alloter" value="Taxi Alloter" />
                            <Picker.Item label="Admin" value="Admin" />
                            <Picker.Item label="Manager" value="Manager" />
                        </Picker>
                    </FormControl>
                    <FormControl><FormControl.Label>Contact</FormControl.Label>
                        <Input keyboardType="numeric" value={empData?.contact} onChangeText={(value) => updateRegisterData(value, "contact")} />
                    </FormControl>
                    <FormControl><FormControl.Label>Email ID</FormControl.Label>
                        <Input value={empData?.email} onChangeText={(value) => updateRegisterData(value, "email")} />
                    </FormControl>
                    <FormControl><FormControl.Label>Password</FormControl.Label>
                        <Input type="password" value={empData?.password} onChangeText={(value) => updateRegisterData(value, "password")} />
                    </FormControl>
                    <HStack style={{ justifyContent: "space-around" }}>
                        <Button mt="5" p="3" variant={"outline"} colorScheme="indigo" onPress={handleToggleForm}>
                            Cancel
                        </Button>
                        <Button mt="5" p="3" colorScheme="indigo" onPress={empData._id ? editEmp : addEmployee} isLoading={isWorkingApi}>
                            {empData._id ? "Update" : "Add"}
                        </Button>
                    </HStack>
                </VStack>
            </Box>
        </Center> :
            <View style={{ flex: 1 }}>
                <Input placeholder="Search..." value={searchTerm} onChangeText={setSearchTerm} style={styles.searchInput} />
                <ScrollView horizontal>
                    <View style={styles.container}>
                        {isLoading ? <Loader size="lg" /> : (
                            <Table borderStyle={styles.tableBorder}>
                                <Row data={tableHead} widthArr={columnWidths} style={styles.tableHead} textStyle={styles.headerText} />
                                <TableWrapper>
                                    {employees.length > 0 ? employees.map((rowData, rowIndex) => (
                                        <Row key={rowIndex} widthArr={columnWidths} data={rowData} textStyle={styles.rowText} />
                                    )) : <Text style={styles.noDataText}>No Employees found</Text>}
                                </TableWrapper>
                            </Table>
                        )}
                    </View>
                </ScrollView>
                <TouchableOpacity style={styles.floatingButton} onPress={handleToggleForm}>
                    <FontAwesome6 name="plus" size={24} color="white" />
                </TouchableOpacity>
            </View>
    );
}

