import { Typography } from '@/components/Typography';
import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Modal } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface ProfileScreenProps {
  navigation: any;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);

  const studentProfile = {
    name: "John Doe",
    rollNumber: "2024001",
    class: "Class 12-A",
    section: "Science",
    admissionNumber: "ADM2024001",
    dateOfBirth: "15/03/2006",
    gender: "Male",
    bloodGroup: "O+",
    address: "123 Main Street, City, State - 123456",
    phone: "+91 9876543210",
    email: "john.doe@school.edu",
    parentName: "Robert Doe",
    parentPhone: "+91 9876543211",
    emergencyContact: "+91 9876543212"
  };

  const academicInfo = {
    academicYear: "2024-25",
    admissionDate: "01/04/2024",
    house: "Red House",
    transport: "Bus Route 5",
    hostel: "Block A, Room 205"
  };

  return (
    <ScrollView className="flex-1 bg-[#F0F4F8]" showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View className="flex-row items-center justify-between bg-[#6A5ACD] pt-12 pb-5 px-4 rounded-b-[25px]">
        <TouchableOpacity onPress={() => navigation.goBack()} className="p-2">
          <Icon name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Typography className="text-xl font-bold text-white">Profile</Typography> 
        <TouchableOpacity onPress={() => setIsEditing(!isEditing)} className="p-2">
          <Icon name={isEditing ? "save" : "edit"} size={20} color="white" />
        </TouchableOpacity>
      </View>

      {/* Profile Picture & Basic Info */}
      <View className="items-center -mt-8 mb-6">
        <View className="w-24 h-24 bg-white rounded-full items-center justify-center shadow-lg elevation-5 mb-4">
          <Icon name="person" size={48} color="#6A5ACD" />
        </View>
        <Typography className="text-2xl font-bold text-[#2C3E50]">{studentProfile.name}</Typography> 
        <Typography className="text-sm text-[#7F8C8D]">{studentProfile.class} • Roll: {studentProfile.rollNumber}</Typography> 
      </View>

      {/* Personal Information */}
      <View className="px-4 mb-6">
        <Typography className="text-xl font-bold text-[#2C3E50] mb-4">Personal Information</Typography> 
        <View className="bg-white rounded-2xl p-4 shadow-lg elevation-5">
          <View className="space-y-4">
            <View className="flex-row justify-between items-center py-3 border-b border-[#EAECEE]">
              <Typography className="text-sm text-[#7F8C8D]">Full Name</Typography> 
              {isEditing ? (
                <TextInput 
                  className="text-sm font-semibold text-[#2C3E50] border-b border-[#6A5ACD] min-w-[150px] text-right"
                  value={studentProfile.name}
                />
              ) : (
                <Typography className="text-sm font-semibold text-[#2C3E50]">{studentProfile.name}</Typography> 
              )}
            </View>
            <View className="flex-row justify-between items-center py-3 border-b border-[#EAECEE]">
              <Typography className="text-sm text-[#7F8C8D]">Date of Birth</Typography> 
              <Typography className="text-sm font-semibold text-[#2C3E50]">{studentProfile.dateOfBirth}</Typography> 
            </View>
            <View className="flex-row justify-between items-center py-3 border-b border-[#EAECEE]">
              <Typography className="text-sm text-[#7F8C8D]">Gender</Typography> 
              <Typography className="text-sm font-semibold text-[#2C3E50]">{studentProfile.gender}</Typography> 
            </View>
            <View className="flex-row justify-between items-center py-3 border-b border-[#EAECEE]">
              <Typography className="text-sm text-[#7F8C8D]">Blood Group</Typography> 
              <Typography className="text-sm font-semibold text-[#2C3E50]">{studentProfile.bloodGroup}</Typography> 
            </View>
            <View className="flex-row justify-between items-start py-3">
              <Typography className="text-sm text-[#7F8C8D]">Address</Typography> 
              <Typography className="text-sm font-semibold text-[#2C3E50] text-right flex-1 ml-4">{studentProfile.address}</Typography> 
            </View>
          </View>
        </View>
      </View>

      {/* Contact Information */}
      <View className="px-4 mb-6">
        <Typography className="text-xl font-bold text-[#2C3E50] mb-4">Contact Information</Typography> 
        <View className="bg-white rounded-2xl p-4 shadow-lg elevation-5">
          <View className="space-y-4">
            <View className="flex-row justify-between items-center py-3 border-b border-[#EAECEE]">
              <Typography className="text-sm text-[#7F8C8D]">Phone</Typography> 
              <Typography className="text-sm font-semibold text-[#2C3E50]">{studentProfile.phone}</Typography> 
            </View>
            <View className="flex-row justify-between items-center py-3 border-b border-[#EAECEE]">
              <Typography className="text-sm text-[#7F8C8D]">Email</Typography> 
              <Typography className="text-sm font-semibold text-[#2C3E50]">{studentProfile.email}</Typography> 
            </View>
            <View className="flex-row justify-between items-center py-3 border-b border-[#EAECEE]">
              <Typography className="text-sm text-[#7F8C8D]">Parent Name</Typography> 
              <Typography className="text-sm font-semibold text-[#2C3E50]">{studentProfile.parentName}</Typography> 
            </View>
            <View className="flex-row justify-between items-center py-3">
              <Typography className="text-sm text-[#7F8C8D]">Parent Phone</Typography> 
              <Typography className="text-sm font-semibold text-[#2C3E50]">{studentProfile.parentPhone}</Typography> 
            </View>
          </View>
        </View>
      </View>

      {/* Academic Information */}
      <View className="px-4 mb-6">
        <Typography className="text-xl font-bold text-[#2C3E50] mb-4">Academic Information</Typography> 
        <View className="bg-white rounded-2xl p-4 shadow-lg elevation-5">
          <View className="space-y-4">
            <View className="flex-row justify-between items-center py-3 border-b border-[#EAECEE]">
              <Typography className="text-sm text-[#7F8C8D]">Academic Year</Typography> 
              <Typography className="text-sm font-semibold text-[#2C3E50]">{academicInfo.academicYear}</Typography> 
            </View>
            <View className="flex-row justify-between items-center py-3 border-b border-[#EAECEE]">
              <Typography className="text-sm text-[#7F8C8D]">Admission Number</Typography> 
              <Typography className="text-sm font-semibold text-[#2C3E50]">{studentProfile.admissionNumber}</Typography> 
            </View>
            <View className="flex-row justify-between items-center py-3 border-b border-[#EAECEE]">
              <Typography className="text-sm text-[#7F8C8D]">House</Typography> 
              <Typography className="text-sm font-semibold text-[#2C3E50]">{academicInfo.house}</Typography> 
            </View>
            <View className="flex-row justify-between items-center py-3">
              <Typography className="text-sm text-[#7F8C8D]">Transport</Typography> 
              <Typography className="text-sm font-semibold text-[#2C3E50]">{academicInfo.transport}</Typography> 
            </View>
          </View>
        </View>
      </View>

      {/* Action Buttons */}
      <View className="px-4 mb-8">
        <TouchableOpacity 
          className="bg-[#6A5ACD] rounded-xl py-4 items-center mb-3"
          onPress={() => setShowChangePassword(true)}
        >
          <Typography className="text-base font-bold text-white">Change Password</Typography> 
        </TouchableOpacity>
        
        <TouchableOpacity className="bg-white border border-[#E74C3C] rounded-xl py-4 items-center">
          <Typography className="text-base font-bold text-[#E74C3C]">Logout</Typography> 
        </TouchableOpacity>
      </View>

      {/* Change Password Modal */}
      <Modal
        visible={showChangePassword}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowChangePassword(false)}
      >
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-white rounded-t-[25px] p-5">
            <View className="flex-row justify-between items-center mb-5">
              <Typography className="text-xl font-bold text-[#2C3E50]">Change Password</Typography> 
              <TouchableOpacity onPress={() => setShowChangePassword(false)}>
                <Icon name="close" size={24} color="#2C3E50" />
              </TouchableOpacity>
            </View>

            <TextInput
              className="border border-[#DDE4EB] rounded-xl p-3 text-sm text-[#2C3E50] mb-4"
              placeholder="Current Password"
              secureTextEntry
            />
            <TextInput
              className="border border-[#DDE4EB] rounded-xl p-3 text-sm text-[#2C3E50] mb-4"
              placeholder="New Password"
              secureTextEntry
            />
            <TextInput
              className="border border-[#DDE4EB] rounded-xl p-3 text-sm text-[#2C3E50] mb-6"
              placeholder="Confirm New Password"
              secureTextEntry
            />

            <TouchableOpacity className="bg-[#6A5ACD] rounded-xl py-4 items-center">
              <Typography className="text-base font-bold text-white">Update Password</Typography> 
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

export default ProfileScreen;
