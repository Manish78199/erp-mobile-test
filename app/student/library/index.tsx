"use client"

import type React from "react"
import { useState } from "react"
import { View, Text, ScrollView, TouchableOpacity, TextInput } from "react-native"
import Icon from "react-native-vector-icons/MaterialIcons"

interface LibraryScreenProps {
  navigation: any
}

const LibraryScreen: React.FC<LibraryScreenProps> = ({ navigation }) => {
  const [selectedTab, setSelectedTab] = useState("search")
  const [searchQuery, setSearchQuery] = useState("")

  const libraryData = {
    issuedBooks: [
      {
        id: 1,
        title: "Advanced Mathematics",
        author: "Dr. R.K. Sharma",
        isbn: "978-0123456789",
        issueDate: "2024-11-15",
        dueDate: "2024-12-15",
        status: "issued",
        renewals: 1,
      },
      {
        id: 2,
        title: "Physics Fundamentals",
        author: "Prof. A.K. Singh",
        isbn: "978-0987654321",
        issueDate: "2024-11-20",
        dueDate: "2024-12-20",
        status: "overdue",
        renewals: 0,
      },
    ],
    availableBooks: [
      {
        id: 3,
        title: "Organic Chemistry",
        author: "Dr. M.S. Chauhan",
        isbn: "978-0456789123",
        category: "Science",
        location: "Section A, Shelf 3",
        copies: 5,
        rating: 4.5,
      },
      {
        id: 4,
        title: "World History",
        author: "Prof. K.L. Verma",
        isbn: "978-0789123456",
        category: "History",
        location: "Section B, Shelf 1",
        copies: 3,
        rating: 4.2,
      },
    ],
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const getDaysUntilDue = (dueDate: string) => {
    const today = new Date()
    const due = new Date(dueDate)
    const diffTime = due.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "issued":
        return "#2ECC71"
      case "overdue":
        return "#E74C3C"
      case "reserved":
        return "#F39C12"
      default:
        return "#BDC3C7"
    }
  }

  return (
    <ScrollView className="flex-1 bg-[#F0F4F8]" showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View className="flex-row items-center justify-between bg-[#6A5ACD] pt-12 pb-5 px-4 rounded-b-[25px]">
        <TouchableOpacity onPress={() => navigation.goBack()} className="p-2">
          <Icon name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-white">Library</Text>
        <TouchableOpacity className="p-2">
          <Icon name="qr-code-scanner" size={20} color="white" />
        </TouchableOpacity>
      </View>

      {/* Summary Cards */}
      <View className="flex-row justify-between px-4 -mt-8 mb-5">
        <View className="bg-white rounded-2xl p-4 items-center flex-1 mx-1 shadow-lg elevation-5">
          <Icon name="menu-book" size={28} color="#6A5ACD" />
          <Text className="text-2xl font-extrabold text-[#2C3E50] mt-2">{libraryData.issuedBooks.length}</Text>
          <Text className="text-xs text-[#7F8C8D] mt-1">Issued</Text>
        </View>
        <View className="bg-white rounded-2xl p-4 items-center flex-1 mx-1 shadow-lg elevation-5">
          <Icon name="library-books" size={28} color="#2ECC71" />
          <Text className="text-2xl font-extrabold text-[#2C3E50] mt-2">
            {libraryData.availableBooks.reduce((sum, book) => sum + book.copies, 0)}
          </Text>
          <Text className="text-xs text-[#7F8C8D] mt-1">Available</Text>
        </View>
        <View className="bg-white rounded-2xl p-4 items-center flex-1 mx-1 shadow-lg elevation-5">
          <Icon name="schedule" size={28} color="#E74C3C" />
          <Text className="text-2xl font-extrabold text-[#2C3E50] mt-2">
            {libraryData.issuedBooks.filter((book) => book.status === "overdue").length}
          </Text>
          <Text className="text-xs text-[#7F8C8D] mt-1">Overdue</Text>
        </View>
      </View>

      {/* Tab Navigation */}
      <View className="flex-row px-4 mb-5">
        {["search", "issued", "history"].map((tab) => (
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

      {/* Search Tab */}
      {selectedTab === "search" && (
        <View className="p-4">
          <View className="relative mb-5">
            <TextInput
              className="bg-white border border-[#DDE4EB] rounded-xl pl-12 pr-4 py-3 text-sm text-[#2C3E50]"
              placeholder="Search books, authors, ISBN..."
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            <Icon name="search" size={20} color="#7F8C8D" className="absolute left-4 top-3.5" />
          </View>

          <Text className="text-xl font-bold text-[#2C3E50] mb-4">Available Books</Text>
          <View className="gap-4">
            {libraryData.availableBooks.map((book) => (
              <View key={book.id} className="bg-white rounded-2xl p-4 shadow-lg elevation-5">
                <View className="flex-row justify-between items-start mb-3">
                  <View className="flex-1">
                    <Text className="text-base font-bold text-[#2C3E50] mb-1">{book.title}</Text>
                    <Text className="text-sm text-[#7F8C8D] mb-1">by {book.author}</Text>
                    <Text className="text-xs text-[#6A5ACD]">{book.category}</Text>
                  </View>
                  <View className="items-end">
                    <View className="flex-row items-center mb-1">
                      <Icon name="star" size={14} color="#F39C12" />
                      <Text className="text-xs text-[#7F8C8D] ml-1">{book.rating}</Text>
                    </View>
                    <Text className="text-xs text-[#2ECC71] font-semibold">{book.copies} copies</Text>
                  </View>
                </View>

                <View className="flex-row justify-between items-center mb-3">
                  <View className="flex-row items-center">
                    <Icon name="location-on" size={16} color="#7F8C8D" />
                    <Text className="text-xs text-[#7F8C8D] ml-1">{book.location}</Text>
                  </View>
                  <Text className="text-xs text-[#7F8C8D]">ISBN: {book.isbn}</Text>
                </View>

                <View className="flex-row gap-2">
                  <TouchableOpacity className="flex-1 bg-[#6A5ACD] py-2 rounded-xl items-center">
                    <Text className="text-sm font-semibold text-white">Reserve</Text>
                  </TouchableOpacity>
                  <TouchableOpacity className="flex-1 bg-[#EAECEE] py-2 rounded-xl items-center">
                    <Text className="text-sm font-semibold text-[#2C3E50]">Details</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Issued Tab */}
      {selectedTab === "issued" && (
        <View className="p-4">
          <Text className="text-xl font-bold text-[#2C3E50] mb-4">My Issued Books</Text>
          <View className="gap-4">
            {libraryData.issuedBooks.map((book) => (
              <View key={book.id} className="bg-white rounded-2xl p-4 shadow-lg elevation-5">
                <View className="flex-row justify-between items-center mb-3">
                  <Text className="text-base font-bold text-[#2C3E50] flex-1">{book.title}</Text>
                  <View
                    className="px-2 py-1 rounded-xl"
                    style={{ backgroundColor: `${getStatusColor(book.status)}20` }}
                  >
                    <Text className="text-[10px] font-bold" style={{ color: getStatusColor(book.status) }}>
                      {book.status.toUpperCase()}
                    </Text>
                  </View>
                </View>

                <Text className="text-sm text-[#7F8C8D] mb-3">by {book.author}</Text>

                <View className="flex-row justify-between items-center mb-3">
                  <View>
                    <Text className="text-xs text-[#7F8C8D]">Issued: {formatDate(book.issueDate)}</Text>
                    <Text className="text-xs text-[#7F8C8D]">Due: {formatDate(book.dueDate)}</Text>
                  </View>
                  <View className="items-end">
                    <Text className="text-xs text-[#7F8C8D]">Renewals: {book.renewals}/2</Text>
                    <Text
                      className={`text-xs font-semibold ${
                        getDaysUntilDue(book.dueDate) < 0 ? "text-[#E74C3C]" : "text-[#2ECC71]"
                      }`}
                    >
                      {getDaysUntilDue(book.dueDate) < 0
                        ? `${Math.abs(getDaysUntilDue(book.dueDate))} days overdue`
                        : `${getDaysUntilDue(book.dueDate)} days left`}
                    </Text>
                  </View>
                </View>

                <View className="flex-row gap-2">
                  <TouchableOpacity className="flex-1 bg-[#2ECC71] py-2 rounded-xl items-center">
                    <Text className="text-sm font-semibold text-white">Renew</Text>
                  </TouchableOpacity>
                  <TouchableOpacity className="flex-1 bg-[#F39C12] py-2 rounded-xl items-center">
                    <Text className="text-sm font-semibold text-white">Return</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        </View>
      )}
    </ScrollView>
  )
}

export default LibraryScreen
