
import { useState } from "react"
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert, ActivityIndicator } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { useRouter } from "expo-router"
import RNPickerSelect from "react-native-picker-select"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { useFormik } from "formik"
import * as Yup from "yup"

const VehicleSchema = Yup.object().shape({
  registrationNumber: Yup.string().required("Registration number is required"),
  make: Yup.string().required("Make is required"),
  model: Yup.string().required("Model is required"),
  year: Yup.number().required("Year is required"),
  type: Yup.string().required("Type is required"),
})

export default function VehicleAddForm() {
  const insets = useSafeAreaInsets()
  const router = useRouter()
  const [isCreating, setIsCreating] = useState(false)

  const { values, errors, handleChange, handleSubmit, setFieldValue } = useFormik({
    initialValues: {
      registrationNumber: "",
      make: "",
      model: "",
      year: new Date().getFullYear().toString(),
      type: "bus",
      capacity: "",
      fuelType: "diesel",
      fuelEfficiency: "",
      insuranceExpiry: "",
      fitnessExpiry: "",
      pollutionExpiry: "",
      gpsEnabled: false,
    },
    validationSchema: VehicleSchema,
    onSubmit: async (values) => {
      setIsCreating(true)
      try {
        // Replace with actual API call
        Alert.alert("Success", "Vehicle added successfully!")
        router.back()
      } catch (error: any) {
        Alert.alert("Error", error?.message || "Failed to add vehicle")
      } finally {
        setIsCreating(false)
      }
    },
  })

  const FormField = ({ label, placeholder, value, onChangeText, error, keyboardType = "default" }: any) => (
    <View className="mb-4">
      <Text className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">{label}</Text>
      <TextInput
        placeholder={placeholder}
        placeholderTextColor="#9ca3af"
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        className="p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
      />
      {error && <Text className="text-xs mt-1 text-red-600">{error}</Text>}
    </View>
  )

  return (
    <ScrollView
      className="flex-1 bg-white dark:bg-gray-900"
      contentContainerStyle={{ paddingTop: insets.top, paddingBottom: insets.bottom, paddingHorizontal: 16 }}
    >
      <View className="py-6 space-y-6">
        <View className="flex-row items-center gap-3">
          <View className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
            <MaterialCommunityIcons name="truck" size={24} color="#2563eb" />
          </View>
          <View>
            <Text className="text-2xl font-bold text-gray-900 dark:text-white">Add New Vehicle</Text>
            <Text className="text-sm mt-1 text-gray-600 dark:text-gray-400">Register a new vehicle in the fleet</Text>
          </View>
        </View>

        <View className="rounded-lg p-4 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 space-y-4">
          <Text className="text-lg font-semibold text-gray-900 dark:text-white">Vehicle Information</Text>
          <FormField
            label="Registration Number"
            placeholder="e.g., TN-01-AB-1234"
            value={values.registrationNumber}
            onChangeText={(text) => handleChange({ target: { name: "registrationNumber", value: text } })}
            error={errors.registrationNumber}
          />
          <FormField
            label="Make"
            placeholder="e.g., Tata"
            value={values.make}
            onChangeText={(text) => handleChange({ target: { name: "make", value: text } })}
            error={errors.make}
          />
          <FormField
            label="Model"
            placeholder="e.g., Starbus"
            value={values.model}
            onChangeText={(text) => handleChange({ target: { name: "model", value: text } })}
            error={errors.model}
          />
          <FormField
            label="Year"
            placeholder="e.g., 2023"
            value={values.year}
            onChangeText={(text) => handleChange({ target: { name: "year", value: text } })}
            keyboardType="numeric"
            error={errors.year}
          />
          <View className="mb-4">
            <Text className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Type</Text>
            <RNPickerSelect
              items={[
                { label: "Bus", value: "bus" },
                { label: "Van", value: "van" },
                { label: "Car", value: "car" },
              ]}
              onValueChange={(value) => setFieldValue("type", value)}
              value={values.type}
              style={{
                inputIOS: {
                  paddingVertical: 12,
                  paddingHorizontal: 10,
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: "#e5e7eb",
                  backgroundColor: "#f9fafb",
                  color: "#000",
                },
                inputAndroid: {
                  paddingVertical: 12,
                  paddingHorizontal: 10,
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: "#e5e7eb",
                  backgroundColor: "#f9fafb",
                  color: "#000",
                },
              }}
            />
          </View>
        </View>

        <View className="rounded-lg p-4 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 space-y-4">
          <Text className="text-lg font-semibold text-gray-900 dark:text-white">Specifications</Text>
          <FormField
            label="Capacity (Passengers)"
            placeholder="e.g., 50"
            value={values.capacity}
            onChangeText={(text) => handleChange({ target: { name: "capacity", value: text } })}
            keyboardType="numeric"
          />
          <View className="mb-4">
            <Text className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Fuel Type</Text>
            <RNPickerSelect
              items={[
                { label: "Diesel", value: "diesel" },
                { label: "Petrol", value: "petrol" },
                { label: "CNG", value: "cng" },
                { label: "Electric", value: "electric" },
              ]}
              onValueChange={(value) => setFieldValue("fuelType", value)}
              value={values.fuelType}
              style={{
                inputIOS: {
                  paddingVertical: 12,
                  paddingHorizontal: 10,
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: "#e5e7eb",
                  backgroundColor: "#f9fafb",
                  color: "#000",
                },
                inputAndroid: {
                  paddingVertical: 12,
                  paddingHorizontal: 10,
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: "#e5e7eb",
                  backgroundColor: "#f9fafb",
                  color: "#000",
                },
              }}
            />
          </View>
          <FormField
            label="Fuel Efficiency (km/l)"
            placeholder="e.g., 8.5"
            value={values.fuelEfficiency}
            onChangeText={(text) => handleChange({ target: { name: "fuelEfficiency", value: text } })}
            keyboardType="decimal-pad"
          />
        </View>

        <View className="rounded-lg p-4 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 space-y-4">
          <Text className="text-lg font-semibold text-gray-900 dark:text-white">Documentation</Text>
          <FormField
            label="Insurance Expiry Date"
            placeholder="YYYY-MM-DD"
            value={values.insuranceExpiry}
            onChangeText={(text) => handleChange({ target: { name: "insuranceExpiry", value: text } })}
          />
          <FormField
            label="Fitness Expiry Date"
            placeholder="YYYY-MM-DD"
            value={values.fitnessExpiry}
            onChangeText={(text) => handleChange({ target: { name: "fitnessExpiry", value: text } })}
          />
          <FormField
            label="Pollution Expiry Date"
            placeholder="YYYY-MM-DD"
            value={values.pollutionExpiry}
            onChangeText={(text) => handleChange({ target: { name: "pollutionExpiry", value: text } })}
          />
        </View>

        <View className="flex-row gap-3 pt-4">
          <TouchableOpacity
            onPress={() => router.back()}
            className="flex-1 p-3 rounded-lg border border-gray-300 dark:border-gray-600"
          >
            <Text className="text-center font-medium text-gray-700 dark:text-gray-300">Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleSubmit()}
            disabled={isCreating}
            className="flex-1 p-3 rounded-lg bg-blue-600"
          >
            {isCreating ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-center font-medium text-white">Add Vehicle</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  )
}
