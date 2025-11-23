
import { useContext, useEffect, useState } from "react"
import { View, Text, ScrollView, TouchableOpacity, TextInput, FlatList, ActivityIndicator } from "react-native"
import { useLocalSearchParams, useRouter } from "expo-router"
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons"
import { useFormik } from "formik"
import { SafeAreaView } from "react-native-safe-area-context"
import { Typography } from "@/components/Typography"
import { getFeeStructureByClass, updateFeeStructure } from "@/service/management/feeStructure"
import { AlertContext } from "@/context/Alert/context"

interface FeeComponent {
  head_name: string
  amount: number
}

interface FormValues {
  class_id: string
  components: FeeComponent[]
}

export default function UpdateFeeStructureScreen() {
  const router = useRouter()
  const { class_id } = useLocalSearchParams()
  const [feeStructure, setFeeStructure] = useState<any>(null)
  const [totalAmount, setTotalAmount] = useState(0)
  const [updating, setUpdating] = useState(false)
  const [loading, setLoading] = useState(true)



  const { showAlert } = useContext(AlertContext)

  useEffect(() => {
    const get_fee_structure_request = async () => {


      const mockData = await getFeeStructureByClass(class_id)
      setFeeStructure(mockData)
      setFieldValue("components", mockData.components)
      setTotalAmount(mockData.total_amount)
      setLoading(false)
    }
    get_fee_structure_request()
  }, [class_id])



  const updateFeeStructureRequest = async (values: any) => {
    setLoading(true)
    updateFeeStructure(values)
      .then((res) => {
        showAlert("SUCCESS", res.data.message)
        router.push("/management/fee/structure")
      })
      .catch((error) => {
        showAlert("ERROR", error.response.data.message)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const { values, handleChange, handleSubmit, setFieldValue } = useFormik<FormValues>({
    initialValues: {
      class_id: String(class_id),
      components: [],
    },
    onSubmit: updateFeeStructureRequest
  })

  const addNewFee = () => {
    const newFee = [...values.components, { head_name: "", amount: 0 }]
    setFieldValue("components", newFee)
  }

  const removeComponent = (index: number) => {
    const newComponents = values.components.filter((_, i) => i !== index)
    setFieldValue("components", newComponents)
    calculateTotalFee(newComponents)
  }

  const calculateTotalFee = (components = values.components) => {
    const total = components.reduce((sum, comp) => sum + (Number(comp.amount) || 0), 0)
    setTotalAmount(total)
  }

  const handleAmountChange = (text: string, index: number) => {
    const newComponents = [...values.components]
    newComponents[index].amount = Number(text) || 0
    setFieldValue("components", newComponents)
    calculateTotalFee(newComponents)
  }

  const renderComponentItem = ({ item, index }: { item: FeeComponent; index: number }) => (
    <View className="bg-white border border-gray-200 rounded-xl p-4 mb-3">
      <View className="mb-3">
        <Text className="text-nav-text text-sm font-medium mb-2">Fee Particular</Text>
        <TextInput
          value={item.head_name}
          onChangeText={(text) => {
            const newComponents = [...values.components]
            newComponents[index].head_name = text
            setFieldValue("components", newComponents)
          }}
          placeholder="e.g., Tuition Fee"
          className="bg-card-bg border border-gray-200 rounded-lg px-3 py-2 text-text-color"
          placeholderTextColor="#9ca3af"
        />
      </View>

      <View className="flex-row items-center gap-2">
        <View className="flex-1">
          <Text className="text-nav-text text-sm font-medium mb-2">Amount (₹)</Text>
          <View className="flex-row items-center bg-card-bg border border-gray-200 rounded-lg px-3">
            <MaterialCommunityIcons name="currency-inr" size={16} color="#6b7280" />
            <TextInput
              value={String(item.amount)}
              onChangeText={(text) => handleAmountChange(text, index)}
              placeholder="0"
              keyboardType="numeric"
              className="flex-1 ml-2 py-2 text-text-color"
              placeholderTextColor="#9ca3af"
            />
          </View>
        </View>

        {index > 0 && (
          <TouchableOpacity
            onPress={() => removeComponent(index)}
            className="bg-red-50 border border-red-200 rounded-lg p-2 mt-6"
          >
            <MaterialIcons name="delete" size={20} color="#dc2626" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  )

  if (loading) {
    return (
      <View className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    )
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-row items-center p-4">
        <TouchableOpacity
          onPress={() => router.push("/management/fee/structure")}
          className="flex-row items-center bg-white border border-border rounded-lg px-3 py-2 mr-2"
        >
          <Typography className="text-primary font-semibold">← Back</Typography>
        </TouchableOpacity>

        <Typography className="text-xl font-bold text-foreground"> Fee Structure</Typography>
      </View>
      <ScrollView className="flex-1 " showsVerticalScrollIndicator={false}>

        <View className=" px-4 pt-6 pb-4 ">


          <View>
            <Text className="text-2xl font-bold text-text-color">Update Fee Structure</Text>
            <Text className="text-nav-text text-sm mt-1">Modify fee components</Text>
          </View>

        </View>


        <View className="px-4 py-6">

          <View className="mb-6 ">
            <Text className="text-nav-text text-sm font-medium mb-2">Class</Text>
            <View className="bg-white border border-gray-200 rounded-xl px-3 py-3">
              <Text className="text-text-color font-medium">{feeStructure?.class_name}</Text>
            </View>
          </View>


          <View className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
            <Text className="text-nav-text text-sm font-medium mb-2">Total Fee Amount</Text>
            <View className="flex-row items-center">
              <View className="bg-green-100 p-2 rounded-lg mr-3">
                <MaterialCommunityIcons name="currency-inr" size={24} color="#16a34a" />
              </View>
              <Text className="text-green-700 font-bold text-2xl">₹{totalAmount.toLocaleString()}</Text>
            </View>
          </View>

          {/* Fee Components */}
          <View className="mb-6">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-lg font-bold text-text-color">Fee Components</Text>
              <TouchableOpacity onPress={addNewFee} className="bg-blue-600 rounded-lg py-2 px-3 flex-row items-center">
                <MaterialIcons name="add" size={18} color="white" />
                <Text className="text-white font-medium text-sm ml-1">Add</Text>
              </TouchableOpacity>
            </View>

            <FlatList
              data={values.components}
              renderItem={renderComponentItem}
              keyExtractor={(_, index) => String(index)}
              scrollEnabled={false}
            />
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            onPress={() => handleSubmit()}
            disabled={updating}
            className={`rounded-xl py-3 px-4 flex-row items-center justify-center mb-6 ${updating ? "bg-blue-400" : "bg-blue-600"
              }`}
          >
            {updating ? (
              <>
                <ActivityIndicator size="small" color="white" />
                <Text className="text-white font-semibold ml-2">Updating...</Text>
              </>
            ) : (
              <>
                <MaterialIcons name="save" size={20} color="white" />
                <Text className="text-white font-semibold ml-2">Update Fee Structure</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>

  )
}
