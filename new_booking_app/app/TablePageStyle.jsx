import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: { padding: 10, backgroundColor: '#fff', alignItems: "center" },
    searchInput: { marginVertical: 10, paddingHorizontal: 10, fontSize: 16, backgroundColor: "#f5f5f5", borderRadius: 8 },
    tableBorder: { borderWidth: 1, borderColor: "#c8e1ff" },
    tableHead: { height: 50, backgroundColor: "#4CAF50" },
    headerText: { fontSize: 16, fontWeight: "bold", textAlign: "center", color: "#fff" },
    rowText: { fontSize: 14, textAlign: "center", padding: 8 },
    noDataText: { marginTop: 20, textAlign: "center", fontSize: 16, color: "#888" },
    floatingButton: {
        position: "absolute",
        bottom: 20,
        right: 20,
        backgroundColor: "#A0C878",
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#000",
        shadowOpacity: 0.3,
        shadowOffset: { width: 2, height: 2 },
        elevation: 5,
    },
});

export default styles;