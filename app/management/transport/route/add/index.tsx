
import { useState } from "react"
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert, ActivityIndicator } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { useRouter } from "expo-router"
import RNPickerSelect from "react-native-picker-select"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { useFormik } from "formik"
import * as Yup from "yup"
import { createRoute } from "@/service/management/transport"

const RouteSchema = Yup.object().shape({
  name: Yup.string().required("Route name is required"),
  code: Yup.string().required("Route code is required"),
  start_location: Yup.string().required("Start location is required"),
  end_location: Yup.string().required("End location is required"),
})

export default function RouteAddForm() {
  const insets = useSafeAreaInsets()
  const router = useRouter()
  const [isCreating, setIsCreating] = useState(false)
  const [pickupPoints, setPickupPoints] = useState([{ name: "", address: "", sequence: 1 }])

  const { values, errors, handleChange, handleSubmit, setFieldValue } = useFormik({
    initialValues: {
      name: "",
      code: "",
      route_type: "BOTH",
      description: "",
      start_location: "",
      end_location: "",
      total_distance_km: "",
      estimated_duration_minutes: "",
      monthly_fuel_budget: "",
      daily_toll_charges: "",
      notes: "",
    },
    validationSchema: RouteSchema,
    onSubmit: async (values) => {
      setIsCreating(true)
      try {
        await createRoute({ ...values, pickup_points: pickupPoints })
        Alert.alert("Success", "Route created successfully!")
        router.back()
      } catch (error: any) {
        Alert.alert("Error", error?.message || "Failed to create route")
      } finally {
        setIsCreating(false)
      }
    },
  })

  const addPickupPoint = () => {
    setPickupPoints([...pickupPoints, { name: "", address: "", sequence: pickupPoints.length + 1 }])
  }

  const removePickupPoint = (index: number) => {
    if (pickupPoints.length > 1) {
      setPickupPoints(pickupPoints.filter((_, i) => i !== index))
    }
  }

  const FormField = ({ label, placeholder, value, onChangeText, error }: any) => (
    <View className="mb-4">
      <Text className="text-sm font-medium mb-2 text-gray-700 ">{label}</Text>
      <TextInput
        placeholder={placeholder}
        placeholderTextColor="#9ca3af"
        value={value}
        onChangeText={onChangeText}
        className="p-3 rounded-lg border border-gray-300  bg-white  text-gray-900 "
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
            <MaterialCommunityIcons name="map-marker" size={24} color="#2563eb" />
          </View>
          <View>
            <Text className="text-2xl font-bold text-gray-900 ">Create New Route</Text>
            <Text className="text-sm mt-1 text-gray-600 ">
              Set up a new transport route with stops
            </Text>
          </View>
        </View>

        <View className="rounded-lg p-4 border border-gray-200  bg-white  space-y-4">
          <Text className="text-lg font-semibold text-gray-900 ">Basic Information</Text>
          <FormField
            label="Route Name"
            placeholder="e.g., Anna Nagar - T.Nagar Route"
            value={values.name}
            onChangeText={(text) => handleChange({ target: { name: "name", value: text } })}
            error={errors.name}
          />
          <FormField
            label="Route Code"
            placeholder="e.g., RT-A1"
            value={values.code}
            onChangeText={(text) => handleChange({ target: { name: "code", value: text } })}
            error={errors.code}
          />
          <View className="mb-4">
            <Text className="text-sm font-medium mb-2 text-gray-700 ">Route Type</Text>
            <RNPickerSelect
              items={[
                { label: "Pickup Only", value: "PICKUP" },
                { label: "Drop Only", value: "DROP" },
                { label: "Pickup & Drop", value: "BOTH" },
              ]}
              onValueChange={(value) => setFieldValue("route_type", value)}
              value={values.route_type}
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

        <View className="rounded-lg p-4 border border-gray-200  bg-white  space-y-4">
          <Text className="text-lg font-semibold text-gray-900 ">Route Details</Text>
          <FormField
            label="Start Location"
            placeholder="Starting point"
            value={values.start_location}
            onChangeText={(text) => handleChange({ target: { name: "start_location", value: text } })}
            error={errors.start_location}
          />
          <FormField
            label="End Location"
            placeholder="Destination"
            value={values.end_location}
            onChangeText={(text) => handleChange({ target: { name: "end_location", value: text } })}
            error={errors.end_location}
          />
          <FormField
            label="Total Distance (km)"
            placeholder="Distance in kilometers"
            value={values.total_distance_km}
            onChangeText={(text) => handleChange({ target: { name: "total_distance_km", value: text } })}
          />
          <FormField
            label="Estimated Duration (minutes)"
            placeholder="Duration in minutes"
            value={values.estimated_duration_minutes}
            onChangeText={(text) => handleChange({ target: { name: "estimated_duration_minutes", value: text } })}
          />
        </View>

        <View className="rounded-lg p-4 border border-gray-200  bg-white  space-y-4">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-lg font-semibold text-gray-900 ">Pickup Points</Text>
            <TouchableOpacity onPress={addPickupPoint} className="bg-emerald-600 px-3 py-2 rounded-lg">
              <Text className="text-white text-sm font-medium">Add Point</Text>
            </TouchableOpacity>
          </View>
          {pickupPoints.map((point, index) => (
            <View
              key={index}
              className="p-3 rounded-lg border border-gray-200  bg-gray-50 "
            >
              <View className="flex-row items-center justify-between mb-3">
                <Text className="font-medium text-gray-900 ">Pickup Point {index + 1}</Text>
                {pickupPoints.length > 1 && (
                  <TouchableOpacity onPress={() => removePickupPoint(index)}>
                    <MaterialCommunityIcons name="trash-can" size={20} color="#ef4444" />
                  </TouchableOpacity>
                )}
              </View>
              <TextInput
                placeholder="Point name"
                placeholderTextColor="#9ca3af"
                value={point.name}
                onChangeText={(text) => {
                  const updated = [...pickupPoints]
                  updated[index].name = text
                  setPickupPoints(updated)
                }}
                className="p-2 rounded-lg border border-gray-300  bg-white  text-gray-900  mb-2"
              />
              <TextInput
                placeholder="Address"
                placeholderTextColor="#9ca3af"
                value={point.address}
                onChangeText={(text) => {
                  const updated = [...pickupPoints]
                  updated[index].address = text
                  setPickupPoints(updated)
                }}
                className="p-2 rounded-lg border border-gray-300  bg-white  text-gray-900 "
              />
            </View>
          ))}
        </View>

        <View className="flex-row gap-3 pt-4">
          <TouchableOpacity
            onPress={() => router.back()}
            className="flex-1 p-3 rounded-lg border border-gray-300 "
          >
            <Text className="text-center font-medium text-gray-700 ">Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleSubmit()}
            disabled={isCreating}
            className="flex-1 p-3 rounded-lg bg-blue-600"
          >
            {isCreating ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-center font-medium text-white">Create Route</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  )
}
