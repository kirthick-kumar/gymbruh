import { StyleSheet } from 'react-native';

const purple = '#664ac1'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 30,
    backgroundColor: "#121212",
  },
  image: {
    width: 100,
    height: 100, 
    resizeMode: 'contain',
    alignSelf: 'center',
    marginBottom: 10
  },   
  section: {
    backgroundColor: "#09122C",
    padding: 15,
    marginVertical: 5,
    borderRadius: 10,
    marginHorizontal: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#9d85ed",
  },
  userDetail: {
    fontSize: 16,
    color: "white",
    marginTop: 5,
  },
  switchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  logoutSection: {
    backgroundColor: "#ff4d4d",
  },
  logoutText: {
    color: "white",
    textAlign: "center",
  },
  deleteAccountSection: {
    backgroundColor: "#d9534f",
  },
  deleteText: {
    color: "white",
    textAlign: "center",
  },
});

export default styles;
