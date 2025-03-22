import { Box, Button } from 'native-base';
import React from 'react';
import { Alert, Modal, StyleSheet, Text, View, SafeAreaView, ScrollView } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function CommonModal({ customerData, isView, setIsView }) {

    const renderData = (data) => {
        return Object.entries(data).map(([key, value]) => {
            if (key === "_id" || key === "__v") {
                return null
            }
            if (typeof value === "object" && value !== null) {
                return (
                    <View key={key}>
                        <Text style={styles.subHeader}>{key[0].toUpperCase() + key.slice(1)}:</Text>
                        {renderData(value)}
                    </View>
                );
            }
            return (
                <View key={key} style={styles.tableRow}>
                    <Text style={[styles.tableCell, { fontWeight: "bold" }]}>{key[0].toUpperCase() + key.slice(1)}</Text>
                    <Text style={styles.tableCell}>{value}</Text>
                </View>
            );
        });
    };

    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.centeredView}>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={isView}
                    onRequestClose={() => {
                        Alert.alert('Modal has been closed.');
                        setIsView(!isView);
                    }}
                >
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <Text style={styles.tableTitle}>Customer Data</Text>
                            <ScrollView>
                                <View style={styles.table}>
                                    <View style={styles.tableRowHeader}>
                                        <Text style={[styles.tableCell, styles.tableHeaderCell]}>Field</Text>
                                        <Text style={[styles.tableCell, styles.tableHeaderCell]}>Value</Text>
                                    </View>
                                    {renderData(customerData)}

                                </View>

                            </ScrollView>
                            <Button onPress={()=>setIsView(!isView)} style={{marginTop: 10}}>Close</Button>
                        </View>
                    </View>
                </Modal>
            </SafeAreaView>
        </SafeAreaProvider >
    );
}

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)', // Add a dim background
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        width: '90%',
    },
    table: {
        borderWidth: 1,
        borderColor: '#ddd',
        width: '100%',
        marginTop: 10,
    },
    tableRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    tableRowHeader: {
        flexDirection: 'row',
        backgroundColor: '#f0f0f0',
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    tableCell: {
        flex: 1,
        padding: 10,
        textAlign: 'center',
        borderRightWidth: 1,
        borderRightColor: '#ddd',
    },
    tableHeaderCell: {
        fontWeight: 'bold',
        backgroundColor: '#e0e0e0',
    },
    tableTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    subHeader: {
        fontWeight: 'bold',
        fontSize: 16,
        marginVertical: 5,
    },
});
