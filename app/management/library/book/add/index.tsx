"use client"

import { useState } from "react"
import { View, Text, ScrollView, TouchableOpacity, TextInput, ActivityIndicator, Alert } from "react-native"
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import RNPickerSelect from "react-native-picker-select"
import { cn } from "@/utils/cn"
import { Typography } from "@/components/Typography"
import { useRouter } from "expo-router"
import { add_book } from "@/service/management/library"

interface BookFormData {
  isbn: string
  title: string
  author: string
  category: string
  publisher: string
  publication_year: number
  total_copies: number
  price: number
  shelf_location: string
  description: string
  status: "available" | "out_of_stock" | "discontinued"
}

// Mock API function - replace with actual API call

export default function BookAddForm() {

  const insets = useSafeAreaInsets()
  const [formData, setFormData] = useState<BookFormData>({
    isbn: "",
    title: "",
    author: "",
    category: "Computer Science",
    publisher: "",
    publication_year: new Date().getFullYear(),
    total_copies: 1,
    price: 0,
    shelf_location: "",
    description: "",
    status: "available",
  })

  const router=useRouter()

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
    if (formData.publication_year < 1900 || formData.publication_year > new Date().getFullYear())
      newErrors.publishYear = "Please enter a valid publish year"
    if (formData.total_copies < 1) newErrors.totalCopies = "Total copies must be at least 1"
    if (formData.price <= 0) newErrors.price = "Price must be greater than 0"
    if (!formData.shelf_location.trim()) newErrors.location = "Location is required"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validateForm()) return

    setIsSubmitting(true)
    try {
      await add_book(formData)
      Alert.alert("Success", "Book added successfully")
      setFormData({
        isbn: "",
        title: "",
        author: "",
        category: "Computer Science",
        publisher: "",
        publication_year: new Date().getFullYear(),
        total_copies: 1,
        price: 0,
        shelf_location: "",
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
    <SafeAreaView className="flex-1 bg-background">

      <View className="flex-row items-center p-4">
        <TouchableOpacity
          onPress={() => router.push("/management/library/book")}
          className="flex-row items-center bg-white border border-border rounded-lg px-3 py-2 mr-2"
        >
          <Typography className="text-primary font-semibold">← Back</Typography>
        </TouchableOpacity>

        <Typography className="text-lg font-bold text-foreground">Books</Typography>
      </View>
      <ScrollView
        className="flex-1 bg-background "
     
      >
        <View className="px-4 mt-3  pb-6 space-y-6">
          <View>
            <Typography className="text-2xl font-bold text-gray-900 ">Add New Book</Typography>
            <Typography className="text-sm mt-1 text-gray-600 ">Add a new book to the library inventory</Typography>
          </View>

          <View className="rounded-lg mt-3 p-4 border border-gray-200  bg-white  space-y-4">
            <View className="flex-row items-center gap-2 mb-4">
              <View className="p-2 bg-blue-500 rounded-lg">
                <MaterialCommunityIcons name="book-open" size={18} color="white" />
              </View>
              <Typography className="text-lg font-semibold text-gray-900 ">Book Information</Typography>
            </View>

            <View>
              <Typography className="text-sm font-medium text-gray-700  mb-2">
                ISBN <Typography className="text-red-500">*</Typography>
              </Typography>
              <TextInput
                value={formData.isbn}
                onChangeText={(value) => handleInputChange("isbn", value)}
                placeholder="e.g., 978-0262033848"
                placeholderTextColor="#9ca3af"
                className={cn(
                  "px-3 py-2 rounded-lg border text-gray-900  bg-gray-50 ",
                  errors.isbn ? "border-red-500" : "border-gray-300 ",
                )}
              />
              {errors.isbn && <Typography className="text-red-500 text-xs mt-1">{errors.isbn}</Typography>}
            </View>

            <View className="mt-2">
              <Typography className="text-sm font-medium text-gray-700  mb-2">
                Title <Typography className="text-red-500">*</Typography>
              </Typography>
              <TextInput
                value={formData.title}
                onChangeText={(value) => handleInputChange("title", value)}
                placeholder="Enter book title"
                placeholderTextColor="#9ca3af"
                className={cn(
                  "px-3 py-2 rounded-lg border text-gray-900  bg-gray-50 ",
                  errors.title ? "border-red-500" : "border-gray-300 ",
                )}
              />
              {errors.title && <Typography className="text-red-500 text-xs mt-1">{errors.title}</Typography>}
            </View>

            <View className="mt-2">
              <Typography className="text-sm font-medium text-gray-700  mb-2">
                Author <Typography className="text-red-500">*</Typography>
              </Typography>
              <TextInput
                value={formData.author}
                onChangeText={(value) => handleInputChange("author", value)}
                placeholder="Enter author name"
                placeholderTextColor="#9ca3af"
                className={cn(
                  "px-3 py-2 rounded-lg border text-gray-900  bg-gray-50 ",
                  errors.author ? "border-red-500" : "border-gray-300 ",
                )}
              />
              {errors.author && <Typography className="text-red-500 text-xs mt-1">{errors.author}</Typography>}
            </View>

            <View className="mt-2">
              <Typography className="text-sm font-medium text-gray-700  mb-2">Category</Typography>
              <RNPickerSelect
                items={categories.map((cat) => ({ label: cat, value: cat }))}
                onValueChange={(value) => handleInputChange("category", value)}
                placeholder={{ label: "-- Select category --" }}
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
                    paddingVertical: 0,
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

            <View className="mt-2">
              <Typography className="text-sm font-medium text-gray-700  mb-2">
                Publisher <Typography className="text-red-500">*</Typography>
              </Typography>
              <TextInput
                value={formData.publisher}
                onChangeText={(value) => handleInputChange("publisher", value)}
                placeholder="Enter publisher name"
                placeholderTextColor="#9ca3af"
                className={cn(
                  "px-3 py-2 rounded-lg border text-gray-900  bg-gray-50 ",
                  errors.publisher ? "border-red-500" : "border-gray-300 ",
                )}
              />
              {errors.publisher && <Typography className="text-red-500 text-xs mt-1">{errors.publisher}</Typography>}
            </View>

            <View className="mt-2">
              <Typography className="text-sm font-medium text-gray-700  mb-2">Publish Year</Typography>
              <TextInput
                value={formData.publication_year.toString()}
                onChangeText={(value) =>
                  handleInputChange("publication_year", Number.parseInt(value) || new Date().getFullYear())
                }
                placeholder="Enter publish year"
                placeholderTextColor="#9ca3af"
                keyboardType="numeric"
                className={cn(
                  "px-3 py-2 rounded-lg border text-gray-900  bg-gray-50 ",
                  errors.publishYear ? "border-red-500" : "border-gray-300 ",
                )}
              />
              {errors.publishYear && <Typography className="text-red-500 text-xs mt-1">{errors.publishYear}</Typography>}
            </View>
          </View>

          <View className="rounded-lg mt-3 p-4 border border-gray-200  bg-white  space-y-4">
            <Typography className="text-lg font-semibold text-gray-900 ">Inventory Details</Typography>

            <View className="mt-2">
              <Typography className="text-sm font-medium text-gray-700  mb-2">Total Copies</Typography>
              <View className="flex-row items-center gap-2">
                <TouchableOpacity
                  onPress={() => handleInputChange("total_copies", Math.max(1, formData.total_copies - 1))}
                  className="p-2 border border-gray-300  rounded-lg"
                >
                  <MaterialCommunityIcons name="minus" size={18} color="#6b7280" />
                </TouchableOpacity>
                <TextInput
                  value={formData.total_copies.toString()}
                  onChangeText={(value) => handleInputChange("total_copies", Number.parseInt(value) || 1)}
                  keyboardType="numeric"
                  className="flex-1 px-3 py-2 rounded-lg border border-gray-300  text-center text-gray-900  bg-gray-50 "
                />
                <TouchableOpacity
                  onPress={() => handleInputChange("total_copies", formData.total_copies + 1)}
                  className="p-2 border border-gray-300  rounded-lg"
                >
                  <MaterialCommunityIcons name="plus" size={18} color="#6b7280" />
                </TouchableOpacity>
              </View>
            </View>

            <View className="mt-2">
              <Typography className="text-sm font-medium text-gray-700  mb-2">Price (₹)</Typography>
              <TextInput
                value={formData.price.toString()}
                onChangeText={(value) => handleInputChange("price", Number.parseInt(value) || 0)}
                placeholder="Enter book price"
                placeholderTextColor="#9ca3af"
                keyboardType="numeric"
                className={cn(
                  "px-3 py-2 rounded-lg border text-gray-900  bg-gray-50 ",
                  errors.price ? "border-red-500" : "border-gray-300 ",
                )}
              />
              {formData.price > 0 && (
                <Typography className="text-xs text-gray-600  mt-1">
                  {formatCurrency(formData.price)} per copy
                </Typography>
              )}
              {errors.price && <Typography className="text-red-500 text-xs mt-1">{errors.price}</Typography>}
            </View>

            <View className="mt-2">
              <Typography className="text-sm font-medium text-gray-700  mb-2">Location</Typography>
              <TextInput
                value={formData.shelf_location}
                onChangeText={(value) => handleInputChange("shelf_location", value)}
                placeholder="e.g., CS-A-001"
                placeholderTextColor="#9ca3af"
                className={cn(
                  "px-3 py-2 rounded-lg border text-gray-900  bg-gray-50 ",
                  errors.location ? "border-red-500" : "border-gray-300 ",
                )}
              />
              {errors.location && <Typography className="text-red-500 text-xs mt-1">{errors.location}</Typography>}
            </View>

            <View className="mt-2">
              <Typography className="text-sm font-medium text-gray-700  mb-2">Status</Typography>
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
                    paddingVertical: 0,
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

          <View className="rounded-lg mt-3 p-4 border border-gray-200  bg-white  space-y-3">
            <Typography className="text-lg font-semibold text-gray-900 ">Description</Typography>
            <TextInput
              value={formData.description}
              onChangeText={(value) => handleInputChange("description", value)}
              placeholder="Enter book description (optional)"
              placeholderTextColor="#9ca3af"
              multiline
              numberOfLines={4}
              className="px-3 py-2 rounded-lg border border-gray-300  text-gray-900  bg-gray-50 "
            />
          </View>

          <View className="flex-row mt-3 gap-3">
            <TouchableOpacity className="flex-1 border border-gray-300  rounded-lg p-3">
              <Typography className="text-center font-medium text-gray-700 ">Cancel</Typography>
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
                  <Typography className="text-white font-medium">Add Book</Typography>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
