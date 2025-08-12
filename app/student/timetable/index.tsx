

import { Typography } from '@/components/Typography';
import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface TimetableScreenProps {
  navigation: any;
}

const TimetableScreen: React.FC<TimetableScreenProps> = ({ navigation }) => {
  const [selectedDay, setSelectedDay] = useState('Monday');

  const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const timetableData = {
    Monday: [
      { time: '08:00 - 08:45', subject: 'Mathematics', teacher: 'Mr. Smith', room: 'Room 101', type: 'lecture' },
      { time: '08:45 - 09:30', subject: 'Physics', teacher: 'Dr. Johnson', room: 'Lab 1', type: 'lab' },
      { time: '09:30 - 10:15', subject: 'Chemistry', teacher: 'Ms. Davis', room: 'Lab 2', type: 'lab' },
      { time: '10:15 - 10:30', subject: 'Break', teacher: '', room: '', type: 'break' },
      { time: '10:30 - 11:15', subject: 'English', teacher: 'Mrs. Wilson', room: 'Room 205', type: 'lecture' },
      { time: '11:15 - 12:00', subject: 'Biology', teacher: 'Dr. Brown', room: 'Lab 3', type: 'lab' },
      { time: '12:00 - 12:45', subject: 'History', teacher: 'Mr. Taylor', room: 'Room 301', type: 'lecture' },
      { time: '12:45 - 01:30', subject: 'Lunch Break', teacher: '', room: '', type: 'break' },
      { time: '01:30 - 02:15', subject: 'Physical Education', teacher: 'Coach Miller', room: 'Gym', type: 'activity' },
    ],
    Tuesday: [
      { time: '08:00 - 08:45', subject: 'Physics', teacher: 'Dr. Johnson', room: 'Room 102', type: 'lecture' },
      { time: '08:45 - 09:30', subject: 'Mathematics', teacher: 'Mr. Smith', room: 'Room 101', type: 'lecture' },
      { time: '09:30 - 10:15', subject: 'English', teacher: 'Mrs. Wilson', room: 'Room 205', type: 'lecture' },
      { time: '10:15 - 10:30', subject: 'Break', teacher: '', room: '', type: 'break' },
      { time: '10:30 - 11:15', subject: 'Chemistry', teacher: 'Ms. Davis', room: 'Lab 2', type: 'lab' },
      { time: '11:15 - 12:00', subject: 'Biology', teacher: 'Dr. Brown', room: 'Room 203', type: 'lecture' },
      { time: '12:00 - 12:45', subject: 'Computer Science', teacher: 'Mr. Anderson', room: 'Computer Lab', type: 'lab' },
      { time: '12:45 - 01:30', subject: 'Lunch Break', teacher: '', room: '', type: 'break' },
      { time: '01:30 - 02:15', subject: 'Art', teacher: 'Ms. Garcia', room: 'Art Room', type: 'activity' },
    ],
    // Add more days as needed
  };

  const getSubjectColor = (type: string) => {
    switch (type) {
      case 'lecture': return '#6A5ACD';
      case 'lab': return '#00BCD4';
      case 'activity': return '#2ECC71';
      case 'break': return '#BDC3C7';
      default: return '#6A5ACD';
    }
  };

  const getSubjectIcon = (type: string) => {
    switch (type) {
      case 'lecture': return 'school';
      case 'lab': return 'science';
      case 'activity': return 'sports';
      case 'break': return 'free-breakfast';
      default: return 'school';
    }
  };

  const currentSchedule = timetableData[selectedDay as keyof typeof timetableData] || timetableData.Monday;

  return (
    <ScrollView className="flex-1 bg-[#F0F4F8]" showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View className="flex-row items-center justify-between bg-[#6A5ACD] pt-12 pb-5 px-4 rounded-b-[25px]">
        <TouchableOpacity onPress={() => navigation.goBack()} className="p-2">
          <Icon name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Typography className="text-xl font-bold text-white">Class Schedule</Typography> 
        <TouchableOpacity className="p-2">
          <Icon name="today" size={20} color="white" />
        </TouchableOpacity>
      </View>

      {/* Day Selector */}
      <View className="px-4 -mt-6 mb-6">
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {weekDays.map((day) => (
            <TouchableOpacity
              key={day}
              className={`px-4 py-3 mr-3 rounded-2xl shadow-lg elevation-5 ${
                selectedDay === day ? 'bg-white border-2 border-[#6A5ACD]' : 'bg-white'
              }`}
              onPress={() => setSelectedDay(day)}
            >
              <Typography className={`text-sm font-semibold ${
                selectedDay === day ? 'text-[#6A5ACD]' : 'text-[#7F8C8D]'
              }`}>
                {day}
              </Typography> 
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Current Day Info */}
      <View className="px-4 mb-6">
        <View className="bg-white rounded-2xl p-4 shadow-lg elevation-5">
          <View className="flex-row items-center justify-between">
            <View>
              <Typography className="text-xl font-bold text-[#2C3E50]">{selectedDay}</Typography> 
              <Typography className="text-sm text-[#7F8C8D]">{currentSchedule.length - 2} classes today</Typography> 
            </View>
            <View className="items-center">
              <Icon name="schedule" size={32} color="#6A5ACD" />
              <Typography className="text-xs text-[#7F8C8D] mt-1">8:00 AM - 2:15 PM</Typography> 
            </View>
          </View>
        </View>
      </View>

      {/* Schedule List */}
      <View className="px-4 mb-6">
        <Typography className="text-xl font-bold text-[#2C3E50] mb-4">Today's Schedule</Typography> 
        <View className="space-y-3">
          {currentSchedule.map((period, index) => (
            <View key={index} className="bg-white rounded-2xl p-4 shadow-lg elevation-5">
              <View className="flex-row items-center">
                <View 
                  className="w-12 h-12 rounded-2xl items-center justify-center mr-4"
                  style={{ backgroundColor: `${getSubjectColor(period.type)}20` }}
                >
                  <Icon name={getSubjectIcon(period.type)} size={24} color={getSubjectColor(period.type)} />
                </View>
                
                <View className="flex-1">
                  <View className="flex-row justify-between items-center mb-1">
                    <Typography className="text-base font-bold text-[#2C3E50]">{period.subject}</Typography> 
                    <Typography className="text-xs font-semibold text-[#6A5ACD]">{period.time}</Typography> 
                  </View>
                  
                  {period.teacher && (
                    <View className="flex-row items-center mb-1">
                      <Icon name="person" size={14} color="#7F8C8D" />
                      <Typography className="text-sm text-[#7F8C8D] ml-1">{period.teacher}</Typography> 
                    </View>
                  )}
                  
                  {period.room && (
                    <View className="flex-row items-center">
                      <Icon name="location-on" size={14} color="#7F8C8D" />
                      <Typography className="text-sm text-[#7F8C8D] ml-1">{period.room}</Typography> 
                    </View>
                  )}
                </View>

                {period.type !== 'break' && (
                  <TouchableOpacity className="p-2">
                    <Icon name="more-vert" size={20} color="#BDC3C7" />
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* Quick Stats */}
      <View className="px-4 mb-8">
        <Typography className="text-xl font-bold text-[#2C3E50] mb-4">Weekly Overview</Typography> 
        <View className="flex-row justify-between">
          <View className="bg-white rounded-2xl p-4 items-center flex-1 mx-1 shadow-lg elevation-5">
            <Icon name="school" size={24} color="#6A5ACD" />
            <Typography className="text-lg font-extrabold text-[#2C3E50] mt-2">35</Typography> 
            <Typography className="text-xs text-[#7F8C8D] mt-1">Total Classes</Typography> 
          </View>
          <View className="bg-white rounded-2xl p-4 items-center flex-1 mx-1 shadow-lg elevation-5">
            <Icon name="science" size={24} color="#00BCD4" />
            <Typography className="text-lg font-extrabold text-[#2C3E50] mt-2">12</Typography> 
            <Typography className="text-xs text-[#7F8C8D] mt-1">Lab Sessions</Typography> 
          </View>
          <View className="bg-white rounded-2xl p-4 items-center flex-1 mx-1 shadow-lg elevation-5">
            <Icon name="sports" size={24} color="#2ECC71" />
            <Typography className="text-lg font-extrabold text-[#2C3E50] mt-2">5</Typography> 
            <Typography className="text-xs text-[#7F8C8D] mt-1">Activities</Typography> 
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default TimetableScreen;
