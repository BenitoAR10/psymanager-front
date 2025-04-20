import { StyleSheet } from "react-native";

const scheduleDetailStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    padding: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 8,
    color: "#333333",
  },
  profileContainer: {
    alignItems: "center",
    marginBottom: 16,
  },
  avatar: {
    backgroundColor: "#E2E8F0",
  },
  therapistName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#4A5568",
    marginTop: 8,
  },
  therapistSpecialty: {
    fontSize: 14,
    color: "#718096",
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2D3748",
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: "#718096",
    marginBottom: 12,
  },
  sectionText: {
    fontSize: 14,
    color: "#718096",
    marginBottom: 12,
  },
  daysContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 12,
  },
  dayItem: {
    alignItems: "center",
    justifyContent: "center",
    width: 40,
    height: 60,
    borderRadius: 12,
    backgroundColor: "#F7FAFC",
  },
  selectedDayItem: {
    backgroundColor: "#8C9EFF",
  },
  dayNumber: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#4A5568",
  },
  dayName: {
    fontSize: 12,
    color: "#718096",
  },
  selectedDayText: {
    color: "#FFFFFF",
  },
  hoursContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  hourItem: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: "#F7FAFC",
    minWidth: 80,
  },
  selectedHourItem: {
    backgroundColor: "#8C9EFF",
  },
  hourText: {
    fontSize: 14,
    color: "#4A5568",
  },
  selectedHourText: {
    color: "#FFFFFF",
  },
  reserveButton: {
    backgroundColor: "#8C9EFF",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 20,
    marginBottom: 30,
  },
  reserveButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default scheduleDetailStyles;
