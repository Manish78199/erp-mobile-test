"use client"

import type React from "react"
import { useState } from "react"
import { View, Text, ScrollView, TouchableOpacity } from "react-native"
import Icon from "react-native-vector-icons/MaterialIcons"

interface SyllabusScreenProps {
  navigation: any
}

const SyllabusScreen: React.FC<SyllabusScreenProps> = ({ navigation }) => {
  const [selectedSubject, setSelectedSubject] = useState("Mathematics")

  const syllabusData = {
    Mathematics: {
      chapters: [
        {
          id: 1,
          title: "Real Numbers",
          topics: ["Euclid's Division Lemma", "Fundamental Theorem of Arithmetic", "Rational and Irrational Numbers"],
          status: "completed",
          progress: 100,
        },
        {
          id: 2,
          title: "Polynomials",
          topics: ["Degree of Polynomial", "Zeros of Polynomial", "Relationship between Zeros and Coefficients"],
          status: "in-progress",
          progress: 75,
        },
        {
          id: 3,
          title: "Linear Equations",
          topics: ["Pair of Linear Equations", "Graphical Method", "Algebraic Methods"],
          status: "pending",
          progress: 0,
        },
      ],
    },
    Physics: {
      chapters: [
        {
          id: 1,
          title: "Light - Reflection and Refraction",
          topics: ["Laws of Reflection", "Spherical Mirrors", "Refraction of Light", "Lenses"],
          status: "completed",
          progress: 100,
        },
        {
          id: 2,
          title: "Human Eye and Colourful World",
          topics: ["Structure of Human Eye", "Defects of Vision", "Dispersion of Light"],
          status: "in-progress",
          progress: 60,
        },
      ],
    },
    Chemistry: {
      chapters: [
        {
          id: 1,
          title: "Acids, Bases and Salts",
          topics: ["Properties of Acids and Bases", "pH Scale", "Preparation of Salts"],
          status: "completed",
          progress: 100,
        },
        {
          id: 2,
          title: "Metals and Non-metals",
          topics: ["Physical Properties", "Chemical Properties", "Occurrence and Extraction"],
          status: "pending",
          progress: 0,
        },
      ],
    },
  }

  const subjects = Object.keys(syllabusData)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "#2ECC71"
      case "in-progress":
        return "#F39C12"
      case "pending":
        return "#BDC3C7"
      default:
        return "#BDC3C7"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return "check-circle"
      case "in-progress":
        return "schedule"
      case "pending":
        return "radio-button-unchecked"
      default:
        return "help"
    }
  }

  const getSubjectColor = (subject: string) => {
    const colorMap: { [key: string]: string } = {
      Mathematics: "#6A5ACD",
      Physics: "#00BCD4",
      Chemistry: "#2ECC71",
      Biology: "#FFC107",
      English: "#5B4BBD",
    }
    return colorMap[subject] || "#BDC3C7"
  }

  const currentSyllabus = syllabusData[selectedSubject as keyof typeof syllabusData]
  const overallProgress = Math.round(
    currentSyllabus.chapters.reduce((sum, chapter) => sum + chapter.progress, 0) / currentSyllabus.chapters.length,
  )

  return (
    <ScrollView className="flex-1 bg-[#F0F4F8]" showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View className="flex-row items-center justify-between bg-[#6A5ACD] pt-12 pb-5 px-4 rounded-b-[25px]">
        <TouchableOpacity onPress={() => navigation.goBack()} className="p-2">
          <Icon name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-white">Syllabus Viewer</Text>
        <TouchableOpacity className="p-2">
          <Icon name="download" size={20} color="white" />
        </TouchableOpacity>
      </View>

      {/* Progress Card */}
      <View className="px-4 -mt-8 mb-5">
        <View className="bg-white rounded-2xl p-4 shadow-lg elevation-5">
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-lg font-bold text-[#2C3E50]">{selectedSubject} Progress</Text>
            <Text className="text-2xl font-bold text-[#6A5ACD]">{overallProgress}%</Text>
          </View>
          <View className="h-2 bg-[#EAECEE] rounded-sm overflow-hidden mb-2">
            <View className="h-full bg-[#2ECC71] rounded-sm" style={{ width: `${overallProgress}%` }} />
          </View>
          <Text className="text-xs text-[#7F8C8D] text-center">
            {currentSyllabus.chapters.filter((c) => c.status === "completed").length} of{" "}
            {currentSyllabus.chapters.length} chapters completed
          </Text>
        </View>
      </View>

      {/* Subject Selector */}
      <View className="px-4 mb-5">
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {subjects.map((subject) => (
            <TouchableOpacity
              key={subject}
              className={`px-5 py-2.5 mr-3 rounded-[20px] border ${
                selectedSubject === subject ? "bg-[#6A5ACD] border-[#6A5ACD]" : "bg-white border-[#DDE4EB]"
              }`}
              onPress={() => setSelectedSubject(subject)}
            >
              <Text
                className={`text-sm font-semibold ${selectedSubject === subject ? "text-white" : "text-[#7F8C8D]"}`}
              >
                {subject}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Chapters List */}
      <View className="p-4">
        <Text className="text-xl font-bold text-[#2C3E50] mb-4">{selectedSubject} Syllabus</Text>
        <View className="gap-4">
          {currentSyllabus.chapters.map((chapter) => (
            <View key={chapter.id} className="bg-white rounded-2xl p-4 shadow-lg elevation-5">
              <View className="flex-row justify-between items-center mb-3">
                <View className="flex-row items-center flex-1">
                  <View
                    className="w-1 h-4 rounded-sm mr-3"
                    style={{ backgroundColor: getSubjectColor(selectedSubject) }}
                  />
                  <Text className="text-base font-bold text-[#2C3E50] flex-1">{chapter.title}</Text>
                </View>
                <View className="flex-row items-center">
                  <Icon name={getStatusIcon(chapter.status)} size={16} color={getStatusColor(chapter.status)} />
                  <Text className="text-xs font-bold ml-1" style={{ color: getStatusColor(chapter.status) }}>
                    {chapter.status.toUpperCase()}
                  </Text>
                </View>
              </View>

              <View className="mb-3">
                <Text className="text-sm font-semibold text-[#2C3E50] mb-2">Topics Covered:</Text>
                {chapter.topics.map((topic, index) => (
                  <View key={index} className="flex-row items-center mb-1">
                    <View className="w-1.5 h-1.5 bg-[#6A5ACD] rounded-full mr-2" />
                    <Text className="text-sm text-[#7F8C8D] flex-1">{topic}</Text>
                  </View>
                ))}
              </View>

              <View className="flex-row justify-between items-center">
                <View className="flex-1 mr-4">
                  <View className="flex-row justify-between items-center mb-1">
                    <Text className="text-xs text-[#7F8C8D]">Progress</Text>
                    <Text className="text-xs font-bold text-[#6A5ACD]">{chapter.progress}%</Text>
                  </View>
                  <View className="h-1.5 bg-[#EAECEE] rounded-sm overflow-hidden">
                    <View
                      className="h-full rounded-sm"
                      style={{
                        width: `${chapter.progress}%`,
                        backgroundColor: getStatusColor(chapter.status),
                      }}
                    />
                  </View>
                </View>
                <TouchableOpacity className="bg-[#6A5ACD] px-4 py-2 rounded-xl">
                  <Text className="text-xs font-semibold text-white">View Details</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  )
}

export default SyllabusScreen
