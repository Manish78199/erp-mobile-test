// import React, { useState } from 'react';
// import {
//     View,
//     Text,
//     TextInput,
//     TouchableOpacity,
//     StatusBar,
//     SafeAreaView,
//     Dimensions,
//     Image
// } from 'react-native';
// import { Typography } from '@/components/Typography';
// import { Ionicons } from '@expo/vector-icons';
// import { useRouter } from 'expo-router';

// const { width, height } = Dimensions.get('window');



// export default function Login() {

//     const router = useRouter();

//     const loginImage = require('@/assets/images/login/login_child.png');

//     const [schoolCode, setSchoolCode] = useState('');
//     const [userId, setUserId] = useState('');
//     const [password, setPassword] = useState('');
//     const [showPassword, setShowPassword] = useState(false);

//     return (
//         <SafeAreaView className="flex-1">
//             <StatusBar barStyle="light-content" backgroundColor="#5B7FE5" />

//             {/* Background with gradient effect */}
//             <View className="flex-1 bg-blue-500">



//                 {/* Decorative Elements */}
//                 <View className="absolute top-20 left-8">
//                     <View className="w-12 h-12 bg-yellow-400 rounded-full"></View>
//                 </View>

//                 <View className="absolute top-16 right-12">
//                     <View className="w-2 h-2 bg-white rounded-full"></View>
//                 </View>

//                 <View className="absolute top-32 right-8">
//                     <View className="w-1 h-1 bg-white rounded-full"></View>
//                 </View>

//                 <View className="absolute top-24 left-20">
//                     <View className="w-1 h-1 bg-white rounded-full"></View>
//                 </View>

//                 {/* Clouds */}
//                 <View className="absolute top-28 left-16">
//                     <View className="w-8 h-4 bg-white rounded-full"></View>
//                 </View>

//                 <View className="absolute top-36 right-20">
//                     <View className="w-6 h-3 bg-white rounded-full"></View>
//                 </View>

//                 {/* Paper Planes */}
//                 <View className="absolute top-20 right-24">
//                     {/* Replace with a triangle using react-native-svg or a rotated View */}
//                     <View
//                         style={{
//                             width: 0,
//                             height: 0,
//                             borderLeftWidth: 8,
//                             borderRightWidth: 8,
//                             borderBottomWidth: 16,
//                             borderLeftColor: 'transparent',
//                             borderRightColor: 'transparent',
//                             borderBottomColor: 'white',
//                             transform: [{ rotate: '20deg' }],
//                         }}
//                     />
//                 </View>

//                 {/* Planet */}
//                 <View className="absolute top-16 right-4">
//                     <View className="w-8 h-8 bg-purple-400 rounded-full">
//                         <View className="w-10 h-1 bg-purple-300 absolute top-3 -left-1 rounded-full transform rotate-12"></View>
//                     </View>
//                 </View>

//                 {/* Student Character on Rocket - Simplified */}
//                 <View className="absolute top-32 left-1/2 transform -translate-x-1/2">
//                     <View className="items-center">
//                         {/* Rocket Body */}
//                         <View className="w-16 h-8 bg-yellow-400 rounded-full mb-2"></View>
//                         {/* Character */}
//                         <View className="w-8 h-8 bg-orange-400 rounded-full mb-1"></View>
//                         {/* Flames */}
//                         <View className="w-4 h-6 bg-red-400 rounded-b-full"></View>
//                     </View>
//                 </View>
//                 <View>
//                     <Image source={loginImage} className=' absolute w-56 h-40'></Image>
//                 </View>

//                 {/* Main Content Card */}
//                 <View className="flex-1 mt-52">
//                     <View className="bg-white rounded-t-3xl flex-1 px-6 pt-8">

//                         {/* Title */}
//                         <Typography className="text-3xl font-bold text-gray-900 mb-2">Hi Student</Typography>
//                         <Typography className="text-gray-500 text-base mb-8">Login in to continue</Typography>


//                         <View className="mb-6">
//                             <Typography className="text-gray-500 text-sm mb-2">School Code</Typography>
//                             <TextInput
//                                 value={schoolCode}
                                
//                                 onChangeText={setSchoolCode}
//                                 className="text-gray-900 py-1.5 px-2  rounded-md text-base pb-2 border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500"
//                                 keyboardType="email-address"
//                                 autoCapitalize="none"
//                                 placeholder='Enter your school code'
//                                 placeholderClassName='text-gray-400'
//                             />
//                         </View>

//                         <View className="mb-6">
//                             <Typography className="text-gray-500 text-sm mb-2">User ID</Typography>
//                             <TextInput
//                                 value={userId}
//                                 onChangeText={setUserId}
//                            className="text-gray-900 py-1.5 px-2  rounded-md text-base pb-2 border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500"
//                                 keyboardType="email-address"
//                                 autoCapitalize="none"
//                                 placeholder='Enter your user ID'
//                             />
//                         </View>

//                         {/* Password Input */}
//                         <View className="mb-8">
//                             <Typography className="text-gray-400 text-sm mb-2">Password</Typography>
                           
//                                 <TextInput
//                                     value={password}
//                                     onChangeText={setPassword}
//                                     secureTextEntry={!showPassword}
//                                     className="flex-1 py-1.5  outline-none   rounded-md focus:ring-2 focus:ring-indigo-500 px-2  text-gray-900 text-base"
//                                     placeholder="••••••••"
//                                 />
                             
                         
//                         </View>

//                         {/* Sign In Button */}
//                         <TouchableOpacity
//                         onPress={() => router.push('./student')}
//                             className="bg-blue-500 rounded-xl py-4 mb-6 flex-row items-center justify-center"
//                             style={{ backgroundColor: '#5B7FE5' }}
//                         >
//                             <Typography className="text-white font-semibold text-base mr-2">Login</Typography>
//                             <Ionicons name="arrow-forward" size={20} color="white" />
//                         </TouchableOpacity>




//                     </View>
//                 </View>
//             </View>
//         </SafeAreaView>
//     );
// }



import React, { useState, useEffect, useContext } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StatusBar,
    SafeAreaView,
    Dimensions,
    Image,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    ScrollView
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFormik } from 'formik';
import { Typography } from '@/components/Typography';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

// Import your services
import { studentLoginRequest } from '@/service/student/login';
import { savefcmToken } from '@/service/student/fcm';
import { LoginSchema } from '@/schema/login';
import { AlertContext } from '@/context/Alert/context';
// import useFcmToken from '@/lib/notification';

const { width, height } = Dimensions.get('window');

interface LoginFormData {
    userId: string;
    school_code: string;
    password: string;
}

export default function Login() {
    const router = useRouter();
    const { showAlert } = useContext(AlertContext);
    
    const loginImage = require('@/assets/images/login/login_child.png');
    
    const [requesting, setRequesting] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    // FCM Token Save Function
    const saveFcmTokenRequest = async () => {
        // try {
        //     const newToken = await useFcmToken();
        //     console.log(newToken, 'newToken');
        //     if (newToken) {
        //         const savedToken = await savefcmToken({ fcm_token: String(newToken) });
        //         console.log('FCM token saved successfully');
        //     }
        // } catch (error) {
        //     console.log("FCM token save error", error);
        // }
    };

    // Request notification permission on component mount
    useEffect(() => {
        const requestPermission = async () => {
            try {
                // For React Native, you might need to use a different approach
                // This is a placeholder - adjust based on your notification library
                console.log('Requesting notification permission...');
            } catch (error) {
                console.log('Permission request error:', error);
            }
        };
        
        requestPermission();
    }, []);

    // Submit Form Function
    const submitForm = async (values: LoginFormData) => {
        setRequesting(true);

        try {
            const response = await studentLoginRequest(values);
            
            showAlert("SUCCESS", response?.data.message);
            await AsyncStorage.setItem("access_token", response?.data?.data.access_token);
            
            // Save FCM token after successful login
            await saveFcmTokenRequest();
            
            router.push('/student');
        } catch (error: any) {
            console.log(error);
            showAlert("ERROR", error.response?.data?.message || "Login failed");
        } finally {
            setRequesting(false);
        }
    };

    // Formik Configuration
    const { handleChange, values, errors, touched, handleSubmit, setFieldValue, handleBlur } = useFormik<LoginFormData>({
        initialValues: {
            userId: "",
            school_code: "",
            password: ""
        },
        validationSchema: LoginSchema,
        onSubmit: submitForm
    });

    // Debug log (remove in production)
    useEffect(() => {
        console.log({ values, errors, touched });
    }, [values, errors, touched]);

    return (
        <SafeAreaView className="flex-1">
            <StatusBar barStyle="light-content" backgroundColor="#5B7FE5" />
            
            <KeyboardAvoidingView 
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1"
            >
                <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                    {/* Background with gradient effect */}
                    <View className="flex-1 bg-blue-500">

                        {/* Decorative Elements */}
                        <View className="absolute top-20 left-8">
                            <View className="w-12 h-12 bg-yellow-400 rounded-full"></View>
                        </View>

                        <View className="absolute top-16 right-12">
                            <View className="w-2 h-2 bg-white rounded-full"></View>
                        </View>

                        <View className="absolute top-32 right-8">
                            <View className="w-1 h-1 bg-white rounded-full"></View>
                        </View>

                        <View className="absolute top-24 left-20">
                            <View className="w-1 h-1 bg-white rounded-full"></View>
                        </View>

                        {/* Clouds */}
                        <View className="absolute top-28 left-16">
                            <View className="w-8 h-4 bg-white rounded-full"></View>
                        </View>

                        <View className="absolute top-36 right-20">
                            <View className="w-6 h-3 bg-white rounded-full"></View>
                        </View>

                        {/* Paper Planes */}
                        <View className="absolute top-20 right-24">
                            <View
                                style={{
                                    width: 0,
                                    height: 0,
                                    borderLeftWidth: 8,
                                    borderRightWidth: 8,
                                    borderBottomWidth: 16,
                                    borderLeftColor: 'transparent',
                                    borderRightColor: 'transparent',
                                    borderBottomColor: 'white',
                                    transform: [{ rotate: '20deg' }],
                                }}
                            />
                        </View>

                        {/* Planet */}
                        <View className="absolute top-16 right-4">
                            <View className="w-8 h-8 bg-purple-400 rounded-full">
                                <View className="w-10 h-1 bg-purple-300 absolute top-3 -left-1 rounded-full transform rotate-12"></View>
                            </View>
                        </View>

                        {/* Student Character Image */}
                        <View className="items-center mt-16">
                            <Image source={loginImage} className="w-56 h-40" resizeMode="contain" />
                        </View>

                        {/* Main Content Card */}
                        <View className="flex-1 mt-8">
                            <View className="bg-white rounded-t-3xl flex-1 px-6 pt-8">

                                {/* Title */}
                                <Typography className="text-3xl font-bold text-gray-900 mb-2">Hi Student</Typography>
                                <Typography className="text-gray-500 text-base mb-8">Login to continue</Typography>

                                {/* Form */}
                                <View>
                                    {/* School Code Input */}
                                    <View className="mb-4">
                                        <Typography className="text-gray-700 text-sm mb-2 font-medium">School Code</Typography>
                                        <TextInput
                                            value={values.school_code}
                                            onChangeText={handleChange('school_code')}
                                            onBlur={handleBlur('school_code')}
                                            className={`text-gray-900 py-3 px-4 rounded-lg text-base border ${
                                                errors.school_code && touched.school_code ? 'border-red-500' : 'border-gray-200'
                                            } bg-gray-50`}
                                            placeholder="Enter your school code"
                                            placeholderTextColor="#9CA3AF"
                                            autoCapitalize="none"
                                        />
                                        {errors.school_code && touched.school_code && (
                                            <Typography className="text-red-500 text-xs mt-1">{errors.school_code}</Typography>
                                        )}
                                    </View>

                                    {/* User ID Input */}
                                    <View className="mb-4">
                                        <Typography className="text-gray-700 text-sm mb-2 font-medium">User ID</Typography>
                                        <TextInput
                                            value={values.userId}
                                            onChangeText={handleChange('userId')}
                                            onBlur={handleBlur('userId')}
                                            className={`text-gray-900 py-3 px-4 rounded-lg text-base border ${
                                                errors.userId && touched.userId ? 'border-red-500' : 'border-gray-200'
                                            } bg-gray-50`}
                                            placeholder="Enter your user ID"
                                            placeholderTextColor="#9CA3AF"
                                            autoCapitalize="none"
                                        />
                                        {errors.userId && touched.userId && (
                                            <Typography className="text-red-500 text-xs mt-1">{errors.userId}</Typography>
                                        )}
                                    </View>

                                    {/* Password Input */}
                                    <View className="mb-6">
                                        <Typography className="text-gray-700 text-sm mb-2 font-medium">Password</Typography>
                                        <View className="relative">
                                            <TextInput
                                                value={values.password}
                                                onChangeText={handleChange('password')}
                                                onBlur={handleBlur('password')}
                                                secureTextEntry={!showPassword}
                                                className={`text-gray-900 py-3 px-4 pr-12 rounded-lg text-base border ${
                                                    errors.password && touched.password ? 'border-red-500' : 'border-gray-200'
                                                } bg-gray-50`}
                                                placeholder="Enter your password"
                                                placeholderTextColor="#9CA3AF"
                                            />
                                            <TouchableOpacity
                                                onPress={() => setShowPassword(!showPassword)}
                                                className="absolute right-4 top-3"
                                            >
                                                <Ionicons 
                                                    name={showPassword ? "eye-off" : "eye"} 
                                                    size={20} 
                                                    color="#9CA3AF" 
                                                />
                                            </TouchableOpacity>
                                        </View>
                                        {errors.password && touched.password && (
                                            <Typography className="text-red-500 text-xs mt-1">{errors.password}</Typography>
                                        )}
                                    </View>

                                    {/* Login Button */}
                                    {requesting ? (
                                        <TouchableOpacity
                                            disabled={true}
                                            className="rounded-xl py-4 mb-6 flex-row items-center justify-center bg-gray-400"
                                        >
                                            <ActivityIndicator size="small" color="white" />
                                            <Typography className="text-white font-semibold text-base ml-2">
                                                Login
                                            </Typography>
                                        </TouchableOpacity>
                                    ) : (
                                        <TouchableOpacity
                                            onPress={() => handleSubmit()}
                                            className="rounded-xl py-4 mb-6 flex-row items-center justify-center bg-blue-500"
                                            style={{ backgroundColor: '#5B7FE5' }}
                                        >
                                            <Typography className="text-white font-semibold text-base mr-2">
                                                Login
                                            </Typography>
                                            <Ionicons name="arrow-forward" size={20} color="white" />
                                        </TouchableOpacity>
                                    )}
                                </View>

                                {/* Footer */}
                                <View className="items-center pb-6">
                                    <Typography className="text-gray-400 text-xs">
                                        © 2024 VEDATRON. All rights reserved.
                                    </Typography>
                                </View>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}