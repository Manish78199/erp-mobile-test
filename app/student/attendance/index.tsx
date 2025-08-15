

import React, { useState, useEffect, useContext } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Modal,
    ActivityIndicator,
    RefreshControl,
    Alert
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Link } from 'expo-router';
import { AlertContext } from '@/context/Alert/context';

// Import services
import { 
    getAttendanceSummary, 
    getAttendanceDetails, 
 
} from '@/service/student/attendance';
import { Typography } from '@/components/Typography';

interface AttendanceSummary {
    session: string;
    total_days: number;
    PRESENT: { count: number; percentage: number; change_from_last_session: number };
    ABSENT: { count: number; percentage: number; change_from_last_session: number };
    LEAVE: { count: number; percentage: number; change_from_last_session: number };
    LATE: { count: number; percentage: number; change_from_last_session: number };
}

interface AttendanceData {
    [key: string]: "PRESENT" | "ABSENT" | "LATE" | "LEAVE" | "HALFDAY";
}

interface SubjectAttendance {
    name: string;
    present: number;
    total: number;
    percentage: number;
    color: string;
}

const AttendanceScreen: React.FC = () => {
    const { showAlert } = useContext(AlertContext);
    
    // State management
    const [selectedMonth, setSelectedMonth] = useState(new Date());
    const [selectedView, setSelectedView] = useState<"monthly" | "weekly" | "daily">("monthly");
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [selectedDate, setSelectedDate] = useState<any>(null);
    
    // API Data State
    const [attendanceSummary, setAttendanceSummary] = useState<AttendanceSummary | null>(null);
    const [attendanceData, setAttendanceData] = useState<AttendanceData | null>(null);
    const [subjectAttendance, setSubjectAttendance] = useState<SubjectAttendance[]>([]);
    
    // Loading States
    const [isLoading, setIsLoading] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [calendarLoading, setCalendarLoading] = useState(false);

    // Fetch attendance summary
    const fetchAttendanceSummary = async () => {
        try {
            setIsLoading(true);
            const summary = await getAttendanceSummary();
            setAttendanceSummary(summary);
        } catch (error: any) {
            showAlert("ERROR", error.response?.data?.message || "Failed to fetch attendance summary");
        } finally {
            setIsLoading(false);
        }
    };

    // Fetch attendance details for calendar
    const fetchAttendanceDetails = async (year: number, month: number) => {
        try {
            setCalendarLoading(true);
            const monthStr = String(month + 1).padStart(2, "0");
            const startDate = `${year}-${monthStr}-01`;
            const lastDay = new Date(year, month + 1, 0).getDate();
            const endDate = `${year}-${monthStr}-${String(lastDay).padStart(2, "0")}`;

            const details = await getAttendanceDetails(startDate, endDate);
            setAttendanceData(details);
        } catch (error: any) {
            showAlert("ERROR", error.response?.data?.message || "Failed to fetch attendance details");
            setAttendanceData(null);
        } finally {
            setCalendarLoading(false);
        }
    };


    // Get color for subjects
    const getSubjectColor = (index: number) => {
        const colors = ["#6A5ACD", "#00BCD4", "#2ECC71", "#FFC107", "#E91E63", "#FF5722", "#9C27B0"];
        return colors[index % colors.length];
    };

    // Initial data fetch
    useEffect(() => {
        fetchAttendanceSummary();
      
    }, []);

    // Fetch calendar data when month changes
    useEffect(() => {
        fetchAttendanceDetails(selectedMonth.getFullYear(), selectedMonth.getMonth());
    }, [selectedMonth]);

    // Refresh handler
    const onRefresh = async () => {
        setIsRefreshing(true);
        await Promise.all([
            fetchAttendanceSummary(),
            fetchAttendanceDetails(selectedMonth.getFullYear(), selectedMonth.getMonth()),
        
        ]);
        setIsRefreshing(false);
    };

    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December",
    ];

    const getStatusColor = (status: string) => {
        switch (status) {
            case "PRESENT": return "#2ECC71";
            case "ABSENT": return "#E74C3C";
            case "LATE": return "#F39C12";
            case "LEAVE": return "#9B59B6";
            case "HOLIDAY": return "#95A5A6";
            default: return "#BDC3C7";
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "PRESENT": return "check-circle";
            case "ABSENT": return "cancel";
            case "LATE": return "access-time";
            case "LEAVE": return "schedule";
            case "HOLIDAY": return "event";
            default: return "help";
        }
    };

    const getDaysInMonth = (date: Date) => {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (date: Date) => {
        return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    };

    const formatDateKey = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    };

    const getAttendanceForDate = (date: Date) => {
        const dateKey = formatDateKey(date);
        return attendanceData?.[dateKey] || null;
    };

    const navigateMonth = (direction: number) => {
        const newMonth = new Date(selectedMonth);
        newMonth.setMonth(selectedMonth.getMonth() + direction);
        setSelectedMonth(newMonth);
    };

    const renderCalendarDays = () => {
        const daysInMonth = getDaysInMonth(selectedMonth);
        const firstDay = getFirstDayOfMonth(selectedMonth);
        const weeks = [];
        let currentWeek = [];

        // Empty cells for days before the first day of the month
        for (let i = 0; i < firstDay; i++) {
            currentWeek.push(
                <View key={`empty-${i}`} className="flex-1 aspect-square items-center justify-center m-0.5" />
            );
        }

        // Days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth(), day);
            const attendance = getAttendanceForDate(date);
            const isToday = date.toDateString() === new Date().toDateString();

            currentWeek.push(
                <TouchableOpacity
                    key={day}
                    className={`flex-1 aspect-square items-center justify-center m-0.5 rounded-lg min-h-[45px] ${
                        isToday ? "border-2 border-[#6A5ACD]" : ""
                    }`}
                    style={{
                        backgroundColor: attendance ? `${getStatusColor(attendance)}20` : "transparent",
                    }}
                    onPress={() => {
                        if (attendance) {
                            setSelectedDate({ date, status: attendance });
                            setShowDetailsModal(true);
                        }
                    }}
                >
                    <Typography className={`text-sm font-semibold ${isToday ? "text-[#6A5ACD]" : "text-[#2C3E50]"}`}>
                        {day}
                    </Typography> 
                    {attendance && (
                        <View className="mt-1">
                            <Icon name={getStatusIcon(attendance)} size={12} color={getStatusColor(attendance)} />
                        </View>
                    )}
                </TouchableOpacity>
            );

            if (currentWeek.length === 7) {
                weeks.push(
                    <View key={`week-${weeks.length}`} className="flex-row">
                        {currentWeek}
                    </View>
                );
                currentWeek = [];
            }
        }

        // Fill the last week if it's not complete
        if (currentWeek.length > 0) {
            while (currentWeek.length < 7) {
                currentWeek.push(
                    <View
                        key={`empty-end-${currentWeek.length}`}
                        className="flex-1 aspect-square items-center justify-center m-0.5"
                    />
                );
            }
            weeks.push(
                <View key={`week-${weeks.length}`} className="flex-row">
                    {currentWeek}
                </View>
            );
        }

        return weeks;
    };

    const getMonthlyStats = () => {
        if (!attendanceData) return { present: 0, absent: 0, late: 0, leave: 0, total: 0, percentage: 0 };

        const monthData = Object.entries(attendanceData).filter(([dateKey]) => {
            const recordDate = new Date(dateKey);
            return (
                recordDate.getMonth() === selectedMonth.getMonth() && 
                recordDate.getFullYear() === selectedMonth.getFullYear()
            );
        });

        const present = monthData.filter(([, status]) => status === "PRESENT").length;
        const absent = monthData.filter(([, status]) => status === "ABSENT").length;
        const late = monthData.filter(([, status]) => status === "LATE").length;
        const leave = monthData.filter(([, status]) => status === "LEAVE").length;
        const total = monthData.filter(([, status]) => status !== "HALFDAY").length;

        return { present, absent, late, leave, total, percentage: total > 0 ? (present / total) * 100 : 0 };
    };

    const monthlyStats = getMonthlyStats();

    if (isLoading) {
        return (
            <View className="flex-1 bg-[#F0F4F8] items-center justify-center">
                <ActivityIndicator size="large" color="#6A5ACD" />
                <Typography className="text-[#2C3E50] mt-4">Loading attendance data...</Typography> 
            </View>
        );
    }

    return (
        <ScrollView 
            className="flex-1 bg-[#F0F4F8]" 
            showsVerticalScrollIndicator={false}
            refreshControl={
                <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} colors={["#6A5ACD"]} />
            }
        >
            {/* Header */}
            <View className="flex-row items-center justify-between bg-[#6A5ACD] py-12 px-4 rounded-b-[25px]">
                <Link href="/student" asChild>
                    <TouchableOpacity className="p-2">
                        <Icon name="arrow-back" size={24} color="white" />
                    </TouchableOpacity>
                </Link>
                <View className="flex-1 items-center">
                    <Typography className="text-xl font-bold text-white">Attendance </Typography> 
                </View>
                <TouchableOpacity className="p-2" onPress={onRefresh}>
                    <Icon name="refresh" size={20} color="white" />
                </TouchableOpacity>
            </View>

            {/* Overall Stats Cards */}
            <View className="px-4 -mt-8 mb-5">
                <View className="flex-row justify-between mb-4">
                    <View className="bg-white rounded-2xl p-4 items-center flex-1 mx-1 shadow-lg elevation-5">
                        <View className="w-12 h-12 bg-[#2ECC7120] rounded-full items-center justify-center mb-2">
                            <Icon name="check-circle" size={24} color="#2ECC71" />
                        </View>
                        <Typography className="text-2xl font-extrabold text-[#2C3E50]">
                            {attendanceSummary?.PRESENT.percentage.toFixed(1) || 0}%
                        </Typography> 
                        <Typography className="text-xs text-[#7F8C8D] text-center">Overall Attendance</Typography> 
                    </View>
                    <View className="bg-white rounded-2xl p-4 items-center flex-1 mx-1 shadow-lg elevation-5">
                        <View className="w-12 h-12 bg-[#F39C1220] rounded-full items-center justify-center mb-2">
                            <Icon name="local-fire-department" size={24} color="#F39C12" />
                        </View>
                        <Typography className="text-2xl font-extrabold text-[#2C3E50]">
                            {attendanceSummary?.PRESENT.count || 0}
                        </Typography> 
                        <Typography className="text-xs text-[#7F8C8D] text-center">Present Days</Typography> 
                    </View>
                    <View className="bg-white rounded-2xl p-4 items-center flex-1 mx-1 shadow-lg elevation-5">
                        <View className="w-12 h-12 bg-[#E74C3C20] rounded-full items-center justify-center mb-2">
                            <Icon name="event-busy" size={24} color="#E74C3C" />
                        </View>
                        <Typography className="text-2xl font-extrabold text-[#2C3E50]">
                            {attendanceSummary?.ABSENT.count || 0}
                        </Typography> 
                        <Typography className="text-xs text-[#7F8C8D] text-center">Days Absent</Typography> 
                    </View>
                </View>

                {/* Additional Stats */}
                <View className="flex-row justify-between">
                    <View className="bg-white rounded-2xl p-3 items-center flex-1 mx-1 shadow-lg elevation-5">
                        <Icon name="access-time" size={20} color="#F39C12" />
                        <Typography className="text-lg font-bold text-[#2C3E50] mt-1">
                            {attendanceSummary?.LATE.count || 0}
                        </Typography> 
                        <Typography className="text-[10px] text-[#7F8C8D] text-center">Late Arrivals</Typography> 
                    </View>
                    <View className="bg-white rounded-2xl p-3 items-center flex-1 mx-1 shadow-lg elevation-5">
                        <Icon name="exit-to-app" size={20} color="#9B59B6" />
                        <Typography className="text-lg font-bold text-[#2C3E50] mt-1">
                            {attendanceSummary?.LEAVE.count || 0}
                        </Typography> 
                        <Typography className="text-[10px] text-[#7F8C8D] text-center">Leave Days</Typography> 
                    </View>
                    <View className="bg-white rounded-2xl p-3 items-center flex-1 mx-1 shadow-lg elevation-5">
                        <Icon name="school" size={20} color="#6A5ACD" />
                        <Typography className="text-lg font-bold text-[#2C3E50] mt-1">
                            {attendanceSummary?.total_days || 0}
                        </Typography> 
                        <Typography className="text-[10px] text-[#7F8C8D] text-center">Total Days</Typography> 
                    </View>
                </View>
            </View>

            {/* View Toggle */}
            <View className="px-4 mb-5">
                <View className="flex-row bg-white rounded-2xl p-1 shadow-lg elevation-5">
                    {["monthly"].map((view) => (
                        <TouchableOpacity
                            key={view}
                            className={`flex-1 py-3 items-center rounded-xl ${
                                selectedView === view ? "bg-[#6A5ACD]" : "bg-transparent"
                            }`}
                            onPress={() => setSelectedView(view as any)}
                        >
                            <Typography className={`text-sm font-semibold ${
                                selectedView === view ? "text-white" : "text-[#7F8C8D]"
                            }`}>
                                {view.charAt(0).toUpperCase() + view.slice(1)}
                            </Typography> 
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            {/* Monthly Calendar View */}
            {selectedView === "monthly" && (
                <View className="px-4 mb-5">
                    <View className="bg-white rounded-2xl p-4 shadow-lg elevation-5">
                        {/* Calendar Header */}
                        <View className="flex-row items-center justify-between mb-4">
                            <TouchableOpacity onPress={() => navigateMonth(-1)} className="p-2">
                                <Icon name="chevron-left" size={24} color="#6A5ACD" />
                            </TouchableOpacity>
                            <Typography className="text-lg font-bold text-[#2C3E50]">
                                {monthNames[selectedMonth.getMonth()]} {selectedMonth.getFullYear()}
                            </Typography> 
                            <TouchableOpacity onPress={() => navigateMonth(1)} className="p-2">
                                <Icon name="chevron-right" size={24} color="#6A5ACD" />
                            </TouchableOpacity>
                        </View>

                        {/* Month Stats */}
                        <View className="bg-[#F8F9FA] rounded-xl p-3 mb-4">
                            <View className="flex-row justify-between items-center">
                                <View className="items-center">
                                    <Typography className="text-lg font-bold text-[#2ECC71]">{monthlyStats.present}</Typography> 
                                    <Typography className="text-xs text-[#7F8C8D]">Present</Typography> 
                                </View>
                                <View className="items-center">
                                    <Typography className="text-lg font-bold text-[#E74C3C]">{monthlyStats.absent}</Typography> 
                                    <Typography className="text-xs text-[#7F8C8D]">Absent</Typography> 
                                </View>
                                <View className="items-center">
                                    <Typography className="text-lg font-bold text-[#F39C12]">{monthlyStats.late}</Typography> 
                                    <Typography className="text-xs text-[#7F8C8D]">Late</Typography> 
                                </View>
                                <View className="items-center">
                                    <Typography className="text-lg font-bold text-[#6A5ACD]">
                                        {monthlyStats.percentage.toFixed(1)}%
                                    </Typography> 
                                    <Typography className="text-xs text-[#7F8C8D]">Rate</Typography> 
                                </View>
                            </View>
                        </View>

                        {/* Day Headers */}
                        <View className="flex-row mb-2">
                            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                                <View key={day} className="flex-1 items-center py-2">
                                    <Typography className="text-xs font-semibold text-[#7F8C8D]">{day}</Typography> 
                                </View>
                            ))}
                        </View>

                        {/* Calendar Grid */}
                        {calendarLoading ? (
                            <View className="items-center py-8">
                                <ActivityIndicator size="small" color="#6A5ACD" />
                                <Typography className="text-[#7F8C8D] mt-2">Loading calendar...</Typography> 
                            </View>
                        ) : (
                            <View>{renderCalendarDays()}</View>
                        )}

                        {/* Legend */}
                        <View className="mt-4 pt-4 border-t border-[#EAECEE]">
                            <Typography className="text-sm font-semibold text-[#2C3E50] mb-3">Legend</Typography> 
                            <View className="flex-row flex-wrap">
                                {[
                                    { status: "PRESENT", label: "Present" },
                                    { status: "ABSENT", label: "Absent" },
                                    { status: "LATE", label: "Late" },
                                    { status: "LEAVE", label: "Leave" },
                                    { status: "HALFDAY", label: "Halfday" },
                                ].map((item) => (
                                    <View key={item.status} className="flex-row items-center mr-4 mb-2">
                                        <Icon name={getStatusIcon(item.status)} size={16} color={getStatusColor(item.status)} />
                                        <Typography className="text-xs text-[#7F8C8D] ml-1">{item.label}</Typography> 
                                    </View>
                                ))}
                            </View>
                        </View>
                    </View>
                </View>
            )}

            {/* Subject-wise Attendance */}
            {subjectAttendance.length > 0 && (
                <View className="px-4 mb-5">
                    <Typography className="text-xl font-bold text-[#2C3E50] mb-4">Subject-wise Attendance</Typography> 
                    <View className="gap-3">
                        {subjectAttendance.map((subject, index) => (
                            <View key={index} className="bg-white rounded-2xl p-4 shadow-lg elevation-5">
                                <View className="flex-row items-center justify-between mb-3">
                                    <View className="flex-row items-center">
                                        <View className="w-4 h-4 rounded-full mr-3" style={{ backgroundColor: subject.color }} />
                                        <Typography className="text-base font-bold text-[#2C3E50]">{subject.name}</Typography> 
                                    </View>
                                    <View className="items-end">
                                        <Typography className="text-lg font-bold text-[#6A5ACD]">
                                            {subject.percentage.toFixed(1)}%
                                        </Typography> 
                                        <Typography className="text-xs text-[#7F8C8D]">
                                            {subject.present}/{subject.total}
                                        </Typography> 
                                    </View>
                                </View>

                                {/* Progress Bar */}
                                <View className="h-2 bg-[#EAECEE] rounded-full overflow-hidden mb-2">
                                    <View
                                        className="h-full rounded-full"
                                        style={{
                                            width: `${subject.percentage}%`,
                                            backgroundColor: subject.color,
                                        }}
                                    />
                                </View>

                                {/* Subject Stats */}
                                <View className="flex-row justify-between">
                                    <Typography className="text-xs text-[#2ECC71]">Present: {subject.present}</Typography> 
                                    <Typography className="text-xs text-[#E74C3C]">Absent: {subject.total - subject.present}</Typography> 
                                    <Typography className="text-xs text-[#7F8C8D]">Total: {subject.total}</Typography> 
                                </View>
                            </View>
                        ))}
                    </View>
                </View>
            )}

            {/* Attendance Details Modal */}
            <Modal
                visible={showDetailsModal}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setShowDetailsModal(false)}
            >
                <View className="flex-1 bg-black/50 justify-end">
                    <View className="bg-white rounded-t-[25px] p-5 max-h-[80%]">
                        <View className="flex-row justify-between items-center mb-5">
                            <Typography className="text-xl font-bold text-[#2C3E50]">Attendance Details</Typography> 
                            <TouchableOpacity onPress={() => setShowDetailsModal(false)}>
                                <Icon name="close" size={24} color="#2C3E50" />
                            </TouchableOpacity>
                        </View>

                        {selectedDate && (
                            <ScrollView showsVerticalScrollIndicator={false}>
                                {/* Date Header */}
                                <View className="items-center mb-6">
                                    <View
                                        className="w-16 h-16 rounded-full items-center justify-center mb-3"
                                        style={{ backgroundColor: `${getStatusColor(selectedDate.status)}20` }}
                                    >
                                        <Icon
                                            name={getStatusIcon(selectedDate.status)}
                                            size={32}
                                            color={getStatusColor(selectedDate.status)}
                                        />
                                    </View>
                                    <Typography className="text-xl font-bold text-[#2C3E50] mb-1">
                                        {selectedDate.date.toLocaleDateString("en-US", {
                                            weekday: "long",
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric",
                                        })}
                                    </Typography> 
                                    <View
                                        className="px-4 py-2 rounded-xl"
                                        style={{ backgroundColor: `${getStatusColor(selectedDate.status)}20` }}
                                    >
                                        <Typography className="text-sm font-bold" style={{ color: getStatusColor(selectedDate.status) }}>
                                            {selectedDate.status}
                                        </Typography> 
                                    </View>
                                </View>
                            </ScrollView>
                        )}
                    </View>
                </View>
            </Modal>
        </ScrollView>
    );
};

export default AttendanceScreen;