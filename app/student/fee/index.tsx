
import type React from "react"
import { useState } from "react"
import { View, Text, ScrollView, TouchableOpacity, Modal } from "react-native"
import Icon from "react-native-vector-icons/MaterialIcons"

interface FeesScreenProps {
  navigation: any
}

const FeesScreen: React.FC<FeesScreenProps> = ({ navigation }) => {
  const [selectedTab, setSelectedTab] = useState("overview")
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [selectedFee, setSelectedFee] = useState<any>(null)

  const feeStructure = {
    totalAnnualFee: 45000,
    paidAmount: 30000,
    pendingAmount: 15000,
    nextDueDate: "2024-12-31",
  }

  const feeBreakdown = [
    { category: "Tuition Fee", amount: 25000, status: "paid", dueDate: "2024-09-30" },
    { category: "Lab Fee", amount: 5000, status: "paid", dueDate: "2024-09-30" },
    { category: "Library Fee", amount: 2000, status: "paid", dueDate: "2024-09-30" },
    { category: "Sports Fee", amount: 3000, status: "pending", dueDate: "2024-12-31" },
    { category: "Exam Fee", amount: 5000, status: "pending", dueDate: "2024-12-31" },
    { category: "Development Fee", amount: 5000, status: "pending", dueDate: "2024-12-31" },
  ]

  const formatCurrency = (amount: number) => `₹${amount.toLocaleString()}`
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
      case "completed":
        return "#2ECC71"
      case "pending":
        return "#F39C12"
      case "overdue":
        return "#E74C3C"
      default:
        return "#BDC3C7"
    }
  }

  const handlePayNow = (fee: any) => {
    setSelectedFee(fee)
    setShowPaymentModal(true)
  }

  return (
    <ScrollView className="flex-1 bg-[#F0F4F8]" showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View className="flex-row items-center justify-between bg-[#6A5ACD] pt-12 pb-5 px-4 rounded-b-[25px]">
        <TouchableOpacity onPress={() => navigation.goBack()} className="p-2">
          <Icon name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-white">Fees & Payments</Text>
        <TouchableOpacity className="p-2">
          <Icon name="help" size={20} color="white" />
        </TouchableOpacity>
      </View>

      {/* Fee Summary Cards */}
      <View className="flex-row justify-between px-4 -mt-8 mb-5">
        <View className="bg-white rounded-2xl p-4 items-center flex-1 mx-1 shadow-lg elevation-5">
          <Icon name="account-balance-wallet" size={28} color="#6A5ACD" />
          <Text className="text-base font-extrabold text-[#2C3E50] mt-2">
            {formatCurrency(feeStructure.totalAnnualFee)}
          </Text>
          <Text className="text-xs text-[#7F8C8D] mt-1">Total Fee</Text>
        </View>
        <View className="bg-white rounded-2xl p-4 items-center flex-1 mx-1 shadow-lg elevation-5">
          <Icon name="check-circle" size={28} color="#2ECC71" />
          <Text className="text-base font-extrabold text-[#2C3E50] mt-2">
            {formatCurrency(feeStructure.paidAmount)}
          </Text>
          <Text className="text-xs text-[#7F8C8D] mt-1">Paid</Text>
        </View>
        <View className="bg-white rounded-2xl p-4 items-center flex-1 mx-1 shadow-lg elevation-5">
          <Icon name="schedule" size={28} color="#F39C12" />
          <Text className="text-base font-extrabold text-[#2C3E50] mt-2">
            {formatCurrency(feeStructure.pendingAmount)}
          </Text>
          <Text className="text-xs text-[#7F8C8D] mt-1">Pending</Text>
        </View>
      </View>

      {/* Progress Bar */}
      <View className="bg-white mx-4 rounded-2xl p-4 mb-5 shadow-lg elevation-5">
        <View className="flex-row justify-between items-center mb-3">
          <Text className="text-base font-semibold text-[#2C3E50]">Payment Progress</Text>
          <Text className="text-base font-bold text-[#6A5ACD]">
            {Math.round((feeStructure.paidAmount / feeStructure.totalAnnualFee) * 100)}%
          </Text>
        </View>
        <View className="h-2 bg-[#EAECEE] rounded-sm overflow-hidden mb-2">
          <View
            className="h-full bg-[#2ECC71] rounded-sm"
            style={{ width: `${(feeStructure.paidAmount / feeStructure.totalAnnualFee) * 100}%` }}
          />
        </View>
        <Text className="text-xs text-[#7F8C8D] text-center">
          Next due date: {formatDate(feeStructure.nextDueDate)}
        </Text>
      </View>

      {/* Tab Navigation */}
      <View className="flex-row px-4 mb-5">
        {["overview", "payments", "receipts"].map((tab) => (
          <TouchableOpacity
            key={tab}
            className={`flex-1 py-3 items-center mx-1 rounded-xl border ${
              selectedTab === tab ? "bg-[#6A5ACD] border-[#6A5ACD]" : "bg-white border-[#DDE4EB]"
            }`}
            onPress={() => setSelectedTab(tab)}
          >
            <Text className={`text-sm font-semibold ${selectedTab === tab ? "text-white" : "text-[#7F8C8D]"}`}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Fee Breakdown */}
      {selectedTab === "overview" && (
        <View className="p-4">
          <Text className="text-xl font-bold text-[#2C3E50] mb-4">Fee Breakdown</Text>
          <View className="gap-3">
            {feeBreakdown.map((fee, index) => (
              <View key={index} className="bg-white rounded-2xl p-4 shadow-lg elevation-5">
                <View className="flex-row justify-between items-center mb-2">
                  <Text className="text-base font-semibold text-[#2C3E50]">{fee.category}</Text>
                  <View className="flex-row items-center">
                    <Icon
                      name={fee.status === "paid" ? "check-circle" : "schedule"}
                      size={16}
                      color={getStatusColor(fee.status)}
                    />
                    <Text className="text-[10px] font-bold ml-1" style={{ color: getStatusColor(fee.status) }}>
                      {fee.status.toUpperCase()}
                    </Text>
                  </View>
                </View>

                <View className="flex-row justify-between items-center mb-3">
                  <Text className="text-lg font-bold text-[#2C3E50]">{formatCurrency(fee.amount)}</Text>
                  <Text className="text-xs text-[#7F8C8D]">Due: {formatDate(fee.dueDate)}</Text>
                </View>

                {fee.status === "pending" && (
                  <TouchableOpacity
                    className="flex-row items-center justify-center bg-[#6A5ACD] py-3 rounded-xl"
                    onPress={() => handlePayNow(fee)}
                  >
                    <Icon name="payment" size={16} color="white" />
                    <Text className="text-sm font-semibold text-white ml-2">Pay Now</Text>
                  </TouchableOpacity>
                )}
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Payment Modal */}
      <Modal
        visible={showPaymentModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowPaymentModal(false)}
      >
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-white rounded-t-[25px] p-5 max-h-[80%]">
            <View className="flex-row justify-between items-center mb-5">
              <Text className="text-xl font-bold text-[#2C3E50]">Make Payment</Text>
              <TouchableOpacity onPress={() => setShowPaymentModal(false)}>
                <Icon name="close" size={24} color="#2C3E50" />
              </TouchableOpacity>
            </View>

            {selectedFee && (
              <>
                <View className="bg-[#EAECEE] p-4 rounded-2xl items-center mb-5">
                  <Text className="text-base font-semibold text-[#2C3E50] mb-2">{selectedFee.category}</Text>
                  <Text className="text-2xl font-extrabold text-[#6A5ACD] mb-1">
                    {formatCurrency(selectedFee.amount)}
                  </Text>
                  <Text className="text-xs text-[#7F8C8D]">Due: {formatDate(selectedFee.dueDate)}</Text>
                </View>

                <View className="mb-5">
                  <Text className="text-base font-semibold text-[#2C3E50] mb-4">Select Payment Method</Text>

                  <TouchableOpacity className="flex-row items-center py-4 px-4 bg-[#EAECEE] rounded-xl mb-2">
                    <Icon name="account-balance" size={24} color="#6A5ACD" />
                    <Text className="text-sm text-[#2C3E50] font-medium flex-1 ml-3">Net Banking</Text>
                    <Icon name="chevron-right" size={20} color="#BDC3C7" />
                  </TouchableOpacity>

                  <TouchableOpacity className="flex-row items-center py-4 px-4 bg-[#EAECEE] rounded-xl mb-2">
                    <Icon name="credit-card" size={24} color="#00BCD4" />
                    <Text className="text-sm text-[#2C3E50] font-medium flex-1 ml-3">Credit/Debit Card</Text>
                    <Icon name="chevron-right" size={20} color="#BDC3C7" />
                  </TouchableOpacity>

                  <TouchableOpacity className="flex-row items-center py-4 px-4 bg-[#EAECEE] rounded-xl">
                    <Icon name="account-balance-wallet" size={24} color="#2ECC71" />
                    <Text className="text-sm text-[#2C3E50] font-medium flex-1 ml-3">UPI Payment</Text>
                    <Icon name="chevron-right" size={20} color="#BDC3C7" />
                  </TouchableOpacity>
                </View>

                <TouchableOpacity className="bg-[#6A5ACD] rounded-xl py-4 items-center">
                  <Text className="text-base font-bold text-white">Proceed to Pay</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </ScrollView>
  )
}

export default FeesScreen
