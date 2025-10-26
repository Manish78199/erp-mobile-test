"use client"

import { useState } from "react"
import { View, Text, ScrollView, TouchableOpacity, TextInput, ActivityIndicator, Alert } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import RNPickerSelect from "react-native-picker-select"
import { cn } from "@/utils/cn"

interface BookFormData {
  isbn: string
  title: string
  author: string
  category: string
  publisher: string
  publishYear: number
  totalCopies: number
  price: number
  location: string
  description: string
  status: "available" | "out_of_stock" | "discontinued"
}

// Mock API function - replace with actual API call
const createBook = async (data: BookFormData) => {
  return { success: true, id: "new-book-id" }
}

export default function BookAddForm() {
  const insets = useSafeAreaInsets()
  const [formData, setFormData] = useState<BookFormData>({
    isbn: "",
    title: "",
    author: "",
    category: "Computer Science",
    publisher: "",
    publishYear: new Date().getFullYear(),
    totalCopies: 1,
    price: 0,
    location: "",
    description: "",
    status: "available",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const categories = [
    "Computer Science",
    "Mathematics",
    "Physics",
    "Chemistry",
    "Electronics",
    "Mechanical",
    "Civil",
    "Electrical",
    "General",
  ]

  const handleInputChange = (field: keyof BookFormData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))

    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.isbn.trim()) newErrors.isbn = "ISBN is required"
    if (!formData.title.trim()) newErrors.title = "Title is required"
    if (!formData.author.trim()) newErrors.author = "Author is required"
    if (!formData.publisher.trim()) newErrors.publisher = "Publisher is required"
    if (formData.publishYear < 1900 || formData.publishYear > new Date().getFullYear())
      newErrors.publishYear = "Please enter a valid publish year"
    if (formData.totalCopies < 1) newErrors.totalCopies = "Total copies must be at least 1"
    if (formData.price <= 0) newErrors.price = "Price must be greater than 0"
    if (!formData.location.trim()) newErrors.location = "Location is required"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validateForm()) return

    setIsSubmitting(true)
    try {
      await createBook(formData)
      Alert.alert("Success", "Book added successfully")
      setFormData({
        isbn: "",
        title: "",
        author: "",
        category: "Computer Science",
        publisher: "",
        publishYear: new Date().getFullYear(),
        totalCopies: 1,
        price: 0,
        location: "",
        description: "",
        status: "available",
      })
    } catch (error) {
      Alert.alert("Error", "Failed to add book")
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <ScrollView
      className="flex-1 bg-white dark:bg-gray-900"
      contentContainerStyle={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
    >
      <View className="px-4 py-6 space-y-6">
        <View>
          <Text className="text-2xl font-bold text-gray-900 dark:text-white">Add New Book</Text>
          <Text className="text-sm mt-1 text-gray-600 dark:text-gray-400">Add a new book to the library inventory</Text>
        </View>

        <View className="rounded-lg p-4 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 space-y-4">
          <View className="flex-row items-center gap-2 mb-4">
            <View className="p-2 bg-blue-500 rounded-lg">
              <MaterialCommunityIcons name="book-open" size={18} color="white" />
            </View>
            <Text className="text-lg font-semibold text-gray-900 dark:text-white">Book Information</Text>
          </View>

          <View>
            <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              ISBN <Text className="text-red-500">*</Text>
            </Text>
            <TextInput
              value={formData.isbn}
              onChangeText={(value) => handleInputChange("isbn", value)}
              placeholder="e.g., 978-0262033848"
              placeholderTextColor="#9ca3af"
              className={cn(
                "px-3 py-2 rounded-lg border text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700",
                errors.isbn ? "border-red-500" : "border-gray-300 dark:border-gray-600",
              )}
            />
            {errors.isbn && <Text className="text-red-500 text-xs mt-1">{errors.isbn}</Text>}
          </View>

          <View>
            <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Title <Text className="text-red-500">*</Text>
            </Text>
            <TextInput
              value={formData.title}
              onChangeText={(value) => handleInputChange("title", value)}
              placeholder="Enter book title"
              placeholderTextColor="#9ca3af"
              className={cn(
                "px-3 py-2 rounded-lg border text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700",
                errors.title ? "border-red-500" : "border-gray-300 dark:border-gray-600",
              )}
            />
            {errors.title && <Text className="text-red-500 text-xs mt-1">{errors.title}</Text>}
          </View>

          <View>
            <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Author <Text className="text-red-500">*</Text>
            </Text>
            <TextInput
              value={formData.author}
              onChangeText={(value) => handleInputChange("author", value)}
              placeholder="Enter author name"
              placeholderTextColor="#9ca3af"
              className={cn(
                "px-3 py-2 rounded-lg border text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700",
                errors.author ? "border-red-500" : "border-gray-300 dark:border-gray-600",
              )}
            />
            {errors.author && <Text className="text-red-500 text-xs mt-1">{errors.author}</Text>}
          </View>

          <View>
            <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Category</Text>
            <RNPickerSelect
              items={categories.map((cat) => ({ label: cat, value: cat }))}
              onValueChange={(value) => handleInputChange("category", value)}
              value={formData.category}
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

          <View>
            <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Publisher <Text className="text-red-500">*</Text>
            </Text>
            <TextInput
              value={formData.publisher}
              onChangeText={(value) => handleInputChange("publisher", value)}
              placeholder="Enter publisher name"
              placeholderTextColor="#9ca3af"
              className={cn(
                "px-3 py-2 rounded-lg border text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700",
                errors.publisher ? "border-red-500" : "border-gray-300 dark:border-gray-600",
              )}
            />
            {errors.publisher && <Text className="text-red-500 text-xs mt-1">{errors.publisher}</Text>}
          </View>

          <View>
            <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Publish Year</Text>
            <TextInput
              value={formData.publishYear.toString()}
              onChangeText={(value) =>
                handleInputChange("publishYear", Number.parseInt(value) || new Date().getFullYear())
              }
              placeholder="Enter publish year"
              placeholderTextColor="#9ca3af"
              keyboardType="numeric"
              className={cn(
                "px-3 py-2 rounded-lg border text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700",
                errors.publishYear ? "border-red-500" : "border-gray-300 dark:border-gray-600",
              )}
            />
            {errors.publishYear && <Text className="text-red-500 text-xs mt-1">{errors.publishYear}</Text>}
          </View>
        </View>

        <View className="rounded-lg p-4 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 space-y-4">
          <Text className="text-lg font-semibold text-gray-900 dark:text-white">Inventory Details</Text>

          <View>
            <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Total Copies</Text>
            <View className="flex-row items-center gap-2">
              <TouchableOpacity
                onPress={() => handleInputChange("totalCopies", Math.max(1, formData.totalCopies - 1))}
                className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg"
              >
                <MaterialCommunityIcons name="minus" size={18} color="#6b7280" />
              </TouchableOpacity>
              <TextInput
                value={formData.totalCopies.toString()}
                onChangeText={(value) => handleInputChange("totalCopies", Number.parseInt(value) || 1)}
                keyboardType="numeric"
                className="flex-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-center text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700"
              />
              <TouchableOpacity
                onPress={() => handleInputChange("totalCopies", formData.totalCopies + 1)}
                className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg"
              >
                <MaterialCommunityIcons name="plus" size={18} color="#6b7280" />
              </TouchableOpacity>
            </View>
          </View>

          <View>
            <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Price (₹)</Text>
            <TextInput
              value={formData.price.toString()}
              onChangeText={(value) => handleInputChange("price", Number.parseInt(value) || 0)}
              placeholder="Enter book price"
              placeholderTextColor="#9ca3af"
              keyboardType="numeric"
              className={cn(
                "px-3 py-2 rounded-lg border text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700",
                errors.price ? "border-red-500" : "border-gray-300 dark:border-gray-600",
              )}
            />
            {formData.price > 0 && (
              <Text className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                {formatCurrency(formData.price)} per copy
              </Text>
            )}
            {errors.price && <Text className="text-red-500 text-xs mt-1">{errors.price}</Text>}
          </View>

          <View>
            <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Location</Text>
            <TextInput
              value={formData.location}
              onChangeText={(value) => handleInputChange("location", value)}
              placeholder="e.g., CS-A-001"
              placeholderTextColor="#9ca3af"
              className={cn(
                "px-3 py-2 rounded-lg border text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700",
                errors.location ? "border-red-500" : "border-gray-300 dark:border-gray-600",
              )}
            />
            {errors.location && <Text className="text-red-500 text-xs mt-1">{errors.location}</Text>}
          </View>

          <View>
            <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Status</Text>
            <RNPickerSelect
              items={[
                { label: "Available", value: "available" },
                { label: "Out of Stock", value: "out_of_stock" },
                { label: "Discontinued", value: "discontinued" },
              ]}
              onValueChange={(value) => handleInputChange("status", value)}
              value={formData.status}
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

        <View className="rounded-lg p-4 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 space-y-3">
          <Text className="text-lg font-semibold text-gray-900 dark:text-white">Description</Text>
          <TextInput
            value={formData.description}
            onChangeText={(value) => handleInputChange("description", value)}
            placeholder="Enter book description (optional)"
            placeholderTextColor="#9ca3af"
            multiline
            numberOfLines={4}
            className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700"
          />
        </View>

        <View className="flex-row gap-3">
          <TouchableOpacity className="flex-1 border border-gray-300 dark:border-gray-600 rounded-lg p-3">
            <Text className="text-center font-medium text-gray-700 dark:text-gray-300">Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleSubmit}
            disabled={isSubmitting}
            className="flex-1 bg-indigo-600 rounded-lg p-3 flex-row items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <>
                <MaterialCommunityIcons name="check" size={18} color="white" />
                <Text className="text-white font-medium">Add Book</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  )
}
