import { View, StyleSheet, ScrollView, Text, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Table, TableWrapper, Row, Rows } from 'react-native-table-component';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import { Input } from 'native-base';
import CommonModal from '../../components/CommonModal';

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState(''); // For search functionality
  const url = process.env.API_BASEURL;
  const [customerData, setCustomerData] = useState({});
  const [isView, setIsView] = useState(false);
  const tableHead = ['Name', 'Contact', 'Email', 'Pickup', 'Destination', 'TripType'];

  useEffect(() => {
    async function fetchCustomers() {
      try {
        const response = await axios.get(`${url}/api/booking/customers`);
        const customerData = response.data.customers.map((data) => [
          data.customerName,
          data.customerContact,
          data.email,
          data.pickupLocation,
          data.destination,
          data.tripType,
        ]);
        setCustomers(customerData);
      } catch (error) {
        Toast.show({
          type: 'error',
          text1: 'Failed',
          text2: error.response?.data?.error || 'An unexpected error occurred',
        });
      }
    }

    fetchCustomers();
  }, []);


  // Filter customers based on search term
  const filteredCustomers = customers.filter((customer) =>
    customer.some((field) =>
      field.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  async function viewData(data) {
    try {
      const res = await axios.get(`${url}/api/booking/customer/${data[2]}`);
      setCustomerData(res.data);
      setIsView(true)
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "failed",
        text2: error.response.data.error
      })
    }
  }

  return (
    isView ? <CommonModal customerData={customerData} isView={isView} setIsView={setIsView} /> :
      <View style={styles.container}>
        <Input
          placeholder="Search by any field..."
          value={searchTerm}
          onChangeText={(text) => setSearchTerm(text)}
          style={styles.searchInput}
          variant="filled"
        />
        <ScrollView horizontal>
          <Table borderStyle={styles.tableBorder}>
            <Row
              data={tableHead}
              style={styles.tableHead}
              textStyle={styles.headerText}
            />
            {filteredCustomers.length > 0 ? (
              <TableWrapper>
                {filteredCustomers.map((rowData, rowIndex) => (
                  <TouchableOpacity onPress={() => viewData(rowData)} >
                    <Row
                      key={rowIndex}
                      data={rowData}
                      textStyle={styles.rowText}

                    />
                  </TouchableOpacity>
                ))}
              </TableWrapper>
            ) : (
              <Text style={styles.noDataText}>No customers found</Text>
            )}
          </Table>
        </ScrollView>
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
    marginVertical: 20
  },
  searchInput: {
    marginVertical: 10,
    paddingHorizontal: 10,
    fontSize: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
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
