import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  weekHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    backgroundColor: "#fff",
  },
  navButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 6,
  },
  navButtonRight: {
    flexDirection: "row-reverse",
  },
  navText: {
    color: "#8C9EFF",
    fontSize: 14,
    fontWeight: "600",
    marginHorizontal: 4,
  },
  weekTextContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F7F7FF",
    padding: 6,
    borderRadius: 20,
  },
  weekIcon: {
    marginRight: 6,
  },
  weekText: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#333",
  },
  legendContainer: {
    flexDirection: "row",
    justifyContent: "center",
    backgroundColor: "#FAFAFA",
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
    padding: 8,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 8,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 4,
  },
  legendText: {
    fontSize: 12,
    color: "#666",
  },
  calendarHeader: {
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
    padding: 8,
  },
  dayHeader: {
    backgroundColor: "#FAFAFA",
    borderBottomWidth: 1,
    borderBottomColor: "#DDD",
    paddingVertical: 4,
  },
  hourRow: {
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
  },
  hourText: {
    fontSize: 12,
    color: "#757575",
    fontWeight: "500",
  },
  simpleEventContainer: {
    padding: 4,
    height: "100%",
    width: "100%",
  },
  simpleEventTitle: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#333",
  },
  simpleEventStatus: {
    fontSize: 10,
    color: "#555",
    marginTop: 2,
  },
});
