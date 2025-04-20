import { StyleSheet } from "react-native";

const appointmentStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#424242",
  },
  filterButton: {
    padding: 8,
  },
  loader: {
    marginTop: 40,
  },
  errorText: {
    color: "#E53935",
    textAlign: "center",
    marginTop: 16,
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 80,
  },
  emptyText: {
    color: "#757575",
    textAlign: "center",
    marginTop: 16,
    fontSize: 16,
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  dateHeader: {
    fontSize: 16,
    fontWeight: "500",
    color: "#424242",
    marginTop: 16,
    marginBottom: 12,
    paddingLeft: 4,
  },
  card: {
    marginBottom: 12,
    borderRadius: 16,
    backgroundColor: "#EEF2FF",
    elevation: 0,
  },
  cardContent: {
    padding: 16,
  },
  therapistInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  avatar: {
    backgroundColor: "#D1D9FF",
    marginRight: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#424242",
  },
  cardSubtitle: {
    fontSize: 14,
    color: "#757575",
  },
  divider: {
    backgroundColor: "#D1D9FF",
    height: 1,
    marginVertical: 12,
  },
  appointmentActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
  },
  sessionButton: {
    borderColor: "#8C9EFF",
    borderRadius: 20,
    height: 36,
    paddingHorizontal: 8,
  },
  sessionButtonLabel: {
    fontSize: 12,
    color: "#8C9EFF",
    marginLeft: 12,
  },
  contactButtons: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconButton: {
    padding: 8,
    marginLeft: 8,
  },
  cardTime: {
    fontSize: 14,
    color: "#424242",
  },
});

export default appointmentStyles;
