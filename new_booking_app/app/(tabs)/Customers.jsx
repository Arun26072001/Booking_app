import { View, StyleSheet, ScrollView, Text, TouchableOpacity } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import { Table, TableWrapper, Row } from 'react-native-table-component';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import { Input } from 'native-base';
import CommonModal from '../../components/CommonModal';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { API_BASEURL } from "@env";
import Loader from '@/components/ui/Loader';
import { EssentialValues } from '../_layout';
import styles from "../TablePageStyle";

export default function Customers() {
  const { data } = useContext(EssentialValues)
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState(''); // For search functionality
  const [customerData, setCustomerData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isView, setIsView] = useState(false);
  const tableHead = ['Name', 'Contact', 'Email', 'Pickup', 'Destination', 'TripType', "Action"];
  const cellWidth = [120, 150, 220, 120, 120, 100, 80]

  useEffect(() => {
    async function fetchCustomers() {
      setIsLoading(true);
      try {
        const response = await axios.get(`${API_BASEURL}/api/booking/customers`, {
          headers: { Authorization: data.token }
        });
        const customerData = response.data.customers.map((item) => [
          item.customerName,
          item.customerContact,
          item.email,
          item.pickupLocation,
          item.destination,
          item.tripType,
          <Text style={{ width: "100%", textAlign: "center" }}>
            <TouchableOpacity key={item.email} onPress={() => viewData(item.email)}>
              <FontAwesome name="eye" size={24} color="black" />
            </TouchableOpacity>
          </Text>
        ]);
        setCustomers(customerData);
      } catch (error) {
        Toast.show({
          type: 'error',
          text1: 'Failed',
          text2: error.response?.data?.error || 'An unexpected error occurred',
        });
      } finally {
        setIsLoading(false)
      }
    }

    fetchCustomers();
  }, [])

  // Filter customers based on search term
  const filteredCustomers = customers.filter((customer) =>
    customer.some((field) =>
      field.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  async function viewData(email) {

    try {
      const res = await axios.get(`${API_BASEURL}/api/booking/customer/${email}`, {
        headers: { Authorization: data.token }
      });
      console.log(res.data);

      setCustomerData(res.data);
      setIsView(true);
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "failed",
        text2: error.response.data.error
      })
    }
  }

  return (
    isLoading ? <Loader /> :
      isView ? <CommonModal customerData={customerData} isView={isView} setIsView={setIsView} /> :
        <View style={{ flex: 1 }}>
          <Input
            placeholder="Search by any field..."
            value={searchTerm}
            onChangeText={(text) => setSearchTerm(text)}
            style={styles.searchInput}
            variant="filled"
          />
          <ScrollView horizontal>
            <View style={styles.container}>
              <Table borderStyle={styles.tableBorder}>
                <Row
                  data={tableHead}
                  widthArr={cellWidth}
                  style={styles.tableHead}
                  textStyle={styles.headerText}
                />
                {filteredCustomers.length > 0 ? (
                  <TableWrapper>
                    {filteredCustomers.map((rowData, rowIndex) => (
                      <Row
                        key={rowIndex}
                        widthArr={cellWidth}
                        data={rowData}
                        textStyle={styles.rowText}
                      />
                    ))}
                  </TableWrapper>
                ) : (
                  <Text style={styles.noDataText}>No customers found</Text>
                )}
              </Table>
            </View>
          </ScrollView>
        </View>
  );
}

