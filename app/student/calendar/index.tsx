
import React, { useState, useEffect, useContext } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Modal, RefreshControl } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Link } from 'expo-router';
import { getCallenderEvent } from '@/service/student/callenderEvent';
import { AlertContext } from '@/context/Alert/context';

interface CalendarEvent {
  _id?: string;
  title: string;
  description: string;
  event_date: string;
  is_holiday: boolean;
  event_type?: string;
  location?: string;
  time?: string;
}

const CalendarScreen: React.FC = () => {
  const { showAlert } = useContext(AlertContext);
  
  // State management
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("all");
  
  // Modal states
  const [showEventModal, setShowEventModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

  const eventTypes = [
    { id: "all", label: "All Events", color: "#6A5ACD" },
    { id: "holiday", label: "Holidays", color: "#E74C3C" },
    { id: "academic", label: "Academic", color: "#6A5ACD" },
    { id: "sports", label: "Sports", color: "#2ECC71" },
    { id: "cultural", label: "Cultural", color: "#F39C12" },
    { id: "meeting", label: "Meetings", color: "#00BCD4" },
    { id: "exam", label: "Exams", color: "#9C27B0" },
  ];

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Fetch calendar events
  const fetchCalendarEvents = async () => {
    setIsLoading(true);
    try {
      const year = currentMonth.getFullYear();
      const month = String(currentMonth.getMonth() + 1).padStart(2, "0");
      const eventsData = await getCallenderEvent(year, month);
      setEvents(eventsData);
    } catch (error) {
      showAlert("ERROR", "Failed to fetch calendar events");
      console.error('Calendar events fetch error:', error);
      setEvents([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Pull to refresh
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchCalendarEvents();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchCalendarEvents();
  }, [currentMonth]);

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

  const getEventsForDate = (date: Date) => {
    const dateKey = formatDateKey(date);
    return events.filter((event) => {
      const matchesDate = event.event_date === dateKey;
      const matchesFilter = selectedFilter === "all" || 
        (event.is_holiday && selectedFilter === "holiday") ||
        (event.event_type === selectedFilter);
      return matchesDate && matchesFilter;
    });
  };

  const getAllEventsForDate = (date: Date) => {
    const dateKey = formatDateKey(date);
    return events.filter((event) => event.event_date === dateKey);
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isSelectedDate = (date: Date) => {
    return date.toDateString() === selectedDate.toDateString();
  };

  const navigateMonth = (direction: number) => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(currentMonth.getMonth() + direction);
    setCurrentMonth(newMonth);
  };

  const getEventColor = (event: CalendarEvent) => {
    if (event.is_holiday) return "#E74C3C";
    
    const typeColor = eventTypes.find(type => type.id === event.event_type)?.color;
    return typeColor || "#6A5ACD";
  };

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);
    const weeks = [];
    let currentWeek = [];

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      currentWeek.push(<View key={`empty-${i}`} className="flex-1 aspect-square items-center justify-center m-0.5" />);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      const allEvents = getAllEventsForDate(date);
      const filteredEvents = getEventsForDate(date);
      const hasEvents = allEvents.length > 0;
      const hasHoliday = allEvents.some((event) => event.is_holiday);

      currentWeek.push(
        <TouchableOpacity
          key={day}
          className={`flex-1 aspect-square items-center justify-center m-0.5 rounded-lg min-h-[45px] ${
            isSelectedDate(date)
              ? "bg-[#6A5ACD]"
              : isToday(date)
                ? "bg-[#6A5ACD20] border border-[#6A5ACD]"
                : hasHoliday
                  ? "bg-[#E74C3C20]"
                  : hasEvents
                    ? "bg-[#2ECC7120]"
                    : "bg-transparent"
          }`}
          onPress={() => {
            setSelectedDate(date);
            if (allEvents.length > 0) {
              setSelectedEvent(allEvents[0]);
              setShowEventModal(true);
            }
          }}
        >
          <Text
            className={`text-sm font-semibold ${
              isSelectedDate(date)
                ? "text-white"
                : isToday(date)
                  ? "text-[#6A5ACD]"
                  : hasHoliday
                    ? "text-[#E74C3C]"
                    : "text-[#2C3E50]"
            }`}
          >
            {day}
          </Text>
          {hasEvents && (
            <View className="flex-row mt-1 flex-wrap justify-center max-w-[90%]">
              {allEvents.slice(0, 3).map((event, index) => (
                <View
                  key={`${event._id || event.title}-${index}`}
                  className="w-1.5 h-1.5 rounded-full mx-0.5 mb-0.5"
                  style={{ backgroundColor: getEventColor(event) }}
                />
              ))}
              {allEvents.length > 3 && (
                <Text className="text-[8px] text-[#7F8C8D] ml-1 font-bold">+{allEvents.length - 3}</Text>
              )}
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

  const todayEvents = getEventsForDate(selectedDate);
  const upcomingEvents = events
    .filter((event) => {
      const eventDate = new Date(event.event_date);
      const today = new Date();
      const matchesFilter = selectedFilter === "all" || 
        (event.is_holiday && selectedFilter === "holiday") ||
        (event.event_type === selectedFilter);
      return eventDate >= today && matchesFilter;
    })
    .sort((a, b) => new Date(a.event_date).getTime() - new Date(b.event_date).getTime())
    .slice(0, 5);

  const getCalendarStats = () => {
    const totalEvents = events.length;
    const holidays = events.filter((e) => e.is_holiday).length;
    const regularEvents = totalEvents - holidays;
    const todayEvents = getAllEventsForDate(new Date()).length;

    return { totalEvents, holidays, regularEvents, todayEvents };
  };

  const stats = getCalendarStats();

  return (
    <ScrollView 
      className="flex-1 bg-[#F0F4F8]" 
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
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
          <Text className="text-xl font-bold text-white">Calendar</Text>
        </View>
        <TouchableOpacity className="p-2" onPress={fetchCalendarEvents}>
          <Icon name="refresh" size={20} color="white" />
        </TouchableOpacity>
      </View>

      {/* Stats Cards */}
      <View className="px-4 -mt-8 mb-5">
        <View className="flex-row justify-between">
          <View className="bg-white rounded-2xl p-4 items-center flex-1 mx-1 shadow-lg elevation-5">
            <View className="w-12 h-12 bg-[#6A5ACD20] rounded-full items-center justify-center mb-2">
              <Icon name="event" size={24} color="#6A5ACD" />
            </View>
            <Text className="text-2xl font-extrabold text-[#2C3E50]">{stats.totalEvents}</Text>
            <Text className="text-xs text-[#7F8C8D] text-center">Total Events</Text>
          </View>
          <View className="bg-white rounded-2xl p-4 items-center flex-1 mx-1 shadow-lg elevation-5">
            <View className="w-12 h-12 bg-[#E74C3C20] rounded-full items-center justify-center mb-2">
              <Icon name="celebration" size={24} color="#E74C3C" />
            </View>
            <Text className="text-2xl font-extrabold text-[#2C3E50]">{stats.holidays}</Text>
            <Text className="text-xs text-[#7F8C8D] text-center">Holidays</Text>
          </View>
          <View className="bg-white rounded-2xl p-4 items-center flex-1 mx-1 shadow-lg elevation-5">
            <View className="w-12 h-12 bg-[#2ECC7120] rounded-full items-center justify-center mb-2">
              <Icon name="school" size={24} color="#2ECC71" />
            </View>
            <Text className="text-2xl font-extrabold text-[#2C3E50]">{stats.regularEvents}</Text>
            <Text className="text-xs text-[#7F8C8D] text-center">Academic</Text>
          </View>
          <View className="bg-white rounded-2xl p-4 items-center flex-1 mx-1 shadow-lg elevation-5">
            <View className="w-12 h-12 bg-[#F39C1220] rounded-full items-center justify-center mb-2">
              <Icon name="today" size={24} color="#F39C12" />
            </View>
            <Text className="text-2xl font-extrabold text-[#2C3E50]">{stats.todayEvents}</Text>
            <Text className="text-xs text-[#7F8C8D] text-center">Today</Text>
          </View>
        </View>
      </View>

      {/* Calendar Header */}
      <View className="px-4 mb-5">
        <View className="bg-white rounded-2xl p-4 shadow-lg elevation-5">
          <View className="flex-row items-center justify-between mb-4">
            <TouchableOpacity onPress={() => navigateMonth(-1)} className="p-2">
              <Icon name="chevron-left" size={24} color="#6A5ACD" />
            </TouchableOpacity>
            <Text className="text-lg font-bold text-[#2C3E50]">
              {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </Text>
            <TouchableOpacity onPress={() => navigateMonth(1)} className="p-2">
              <Icon name="chevron-right" size={24} color="#6A5ACD" />
            </TouchableOpacity>
          </View>

          {/* Loading State */}
          {isLoading && (
            <View className="text-center py-6">
              <Icon name="refresh" size={32} color="#6A5ACD" />
              <Text className="text-[#7F8C8D] mt-2">Loading calendar events...</Text>
            </View>
          )}

          {/* Calendar */}
          {!isLoading && (
            <>
              {/* Day Headers */}
              <View className="flex-row mb-2">
                {dayNames.map((day) => (
                  <View key={day} className="flex-1 items-center py-2">
                    <Text className="text-xs font-semibold text-[#7F8C8D]">{day}</Text>
                  </View>
                ))}
              </View>

              {/* Calendar Grid */}
              <View>{renderCalendarDays()}</View>
            </>
          )}
        </View>
      </View>

      {/* Event Type Filter */}
      <View className="px-4 mb-5">
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {eventTypes.map((type) => (
            <TouchableOpacity
              key={type.id}
              className={`flex-row items-center px-4 py-2.5 mr-3 rounded-[20px] border ${
                selectedFilter === type.id ? "border-[#6A5ACD]" : "bg-white border-[#DDE4EB]"
              }`}
              style={selectedFilter === type.id ? { backgroundColor: `${type.color}20` } : {}}
              onPress={() => setSelectedFilter(type.id)}
            >
              <View className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: type.color }} />
              <Text
                className={`text-sm font-semibold ${selectedFilter === type.id ? "text-[#2C3E50]" : "text-[#7F8C8D]"}`}
              >
                {type.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Selected Date Events */}
      {todayEvents.length > 0 && (
        <View className="px-4 mb-5">
          <Text className="text-xl font-bold text-[#2C3E50] mb-4">
            Events on{" "}
            {selectedDate.toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </Text>
          <View className="gap-3">
            {todayEvents.map((event, index) => (
              <TouchableOpacity
                key={event._id || `${event.title}-${index}`}
                className="bg-white rounded-2xl p-4 shadow-lg elevation-5"
                onPress={() => {
                  setSelectedEvent(event);
                  setShowEventModal(true);
                }}
              >
                <View className="flex-row items-center justify-between mb-2">
                  <View className="flex-row items-center flex-1">
                    <View className="w-4 h-4 rounded-full mr-3" style={{ backgroundColor: getEventColor(event) }} />
                    <Text className="text-base font-bold text-[#2C3E50] flex-1">{event.title}</Text>
                  </View>
                  <View className="flex-row items-center">
                    {event.is_holiday && (
                      <View className="bg-[#E74C3C20] px-2 py-1 rounded-lg mr-2">
                        <Text className="text-[10px] font-bold text-[#E74C3C]">HOLIDAY</Text>
                      </View>
                    )}
                    <View className="px-2 py-1 rounded-lg" style={{ backgroundColor: `${getEventColor(event)}20` }}>
                      <Text className="text-[10px] font-bold" style={{ color: getEventColor(event) }}>
                        {event.event_type?.toUpperCase() || "EVENT"}
                      </Text>
                    </View>
                  </View>
                </View>
                <Text className="text-sm text-[#7F8C8D]" numberOfLines={2}>
                  {event.description}
                </Text>
                {event.time && (
                  <View className="flex-row items-center mt-2">
                    <Icon name="access-time" size={16} color="#7F8C8D" />
                    <Text className="text-xs text-[#7F8C8D] ml-1">{event.time}</Text>
                  </View>
                )}
                {event.location && (
                  <View className="flex-row items-center mt-1">
                    <Icon name="location-on" size={16} color="#7F8C8D" />
                    <Text className="text-xs text-[#7F8C8D] ml-1">{event.location}</Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* Upcoming Events */}
      <View className="px-4 mb-8">
        <Text className="text-xl font-bold text-[#2C3E50] mb-4">Upcoming Events</Text>
        {upcomingEvents.length > 0 ? (
          <View className="gap-3">
            {upcomingEvents.map((event, index) => (
              <TouchableOpacity
                key={event._id || `${event.title}-${index}`}
                className="bg-white rounded-2xl p-4 shadow-lg elevation-5"
                onPress={() => {
                  setSelectedEvent(event);
                  setShowEventModal(true);
                }}
              >
                <View className="flex-row items-center justify-between mb-2">
                  <View className="flex-row items-center flex-1">
                    <View className="w-4 h-4 rounded-full mr-3" style={{ backgroundColor: getEventColor(event) }} />
                    <View className="flex-1">
                      <Text className="text-base font-bold text-[#2C3E50]">{event.title}</Text>
                      <Text className="text-xs text-[#7F8C8D]">
                        {new Date(event.event_date).toLocaleDateString("en-US", {
                          weekday: "long",
                          month: "short",
                          day: "numeric",
                        })}
                      </Text>
                    </View>
                  </View>
                  <View className="flex-row items-center">
                    {event.is_holiday && (
                      <View className="bg-[#E74C3C20] px-2 py-1 rounded-lg mr-2">
                        <Text className="text-[10px] font-bold text-[#E74C3C]">HOLIDAY</Text>
                      </View>
                    )}
                    <View className="px-2 py-1 rounded-lg" style={{ backgroundColor: `${getEventColor(event)}20` }}>
                      <Text className="text-[10px] font-bold" style={{ color: getEventColor(event) }}>
                        {event.event_type?.toUpperCase() || "EVENT"}
                      </Text>
                    </View>
                  </View>
                </View>
                <Text className="text-sm text-[#7F8C8D]" numberOfLines={2}>
                  {event.description}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <View className="text-center py-8">
            <Icon name="event" size={48} color="#BDC3C7" />
            <Text className="text-[#7F8C8D] mt-4">No upcoming events found.</Text>
          </View>
        )}
      </View>

      {/* Event Detail Modal */}
      <Modal
        visible={showEventModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowEventModal(false)}
      >
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-white rounded-t-[25px] p-5 max-h-[70%]">
            <View className="flex-row justify-between items-center mb-5">
              <Text className="text-xl font-bold text-[#2C3E50] flex-1 mr-4">Event Details</Text>
              <TouchableOpacity onPress={() => setShowEventModal(false)}>
                <Icon name="close" size={24} color="#2C3E50" />
              </TouchableOpacity>
            </View>

            {selectedEvent && (
              <ScrollView showsVerticalScrollIndicator={false}>
                <View className="items-center mb-6">
                  <View
                    className="w-16 h-16 rounded-full items-center justify-center mb-4"
                    style={{ backgroundColor: `${getEventColor(selectedEvent)}20` }}
                  >
                    <Icon
                      name={selectedEvent.is_holiday ? "celebration" : "event"}
                      size={32}
                      color={getEventColor(selectedEvent)}
                    />
                  </View>
                  <Text className="text-xl font-bold text-[#2C3E50] text-center mb-2">{selectedEvent.title}</Text>
                  <View className="flex-row items-center">
                    {selectedEvent.is_holiday && (
                      <View className="bg-[#E74C3C20] px-3 py-1 rounded-xl mr-2">
                        <Text className="text-sm font-bold text-[#E74C3C]">HOLIDAY</Text>
                      </View>
                    )}
                    <View className="px-3 py-1 rounded-xl" style={{ backgroundColor: `${getEventColor(selectedEvent)}20` }}>
                      <Text className="text-sm font-bold" style={{ color: getEventColor(selectedEvent) }}>
                        {selectedEvent.event_type?.toUpperCase() || "EVENT"}
                      </Text>
                    </View>
                  </View>
                </View>

                <View className="bg-[#F8F9FA] rounded-2xl p-4 mb-6">
                  <View className="flex-row items-center mb-3">
                    <Icon name="event" size={20} color="#6A5ACD" />
                    <Text className="text-base font-semibold text-[#2C3E50] ml-3">
                      {new Date(selectedEvent.event_date).toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </Text>
                  </View>
                  {selectedEvent.time && (
                    <View className="flex-row items-center mb-3">
                      <Icon name="access-time" size={20} color="#6A5ACD" />
                      <Text className="text-base font-semibold text-[#2C3E50] ml-3">{selectedEvent.time}</Text>
                    </View>
                  )}
                  {selectedEvent.location && (
                    <View className="flex-row items-center mb-3">
                      <Icon name="location-on" size={20} color="#6A5ACD" />
                      <Text className="text-base font-semibold text-[#2C3E50] ml-3">{selectedEvent.location}</Text>
                    </View>
                  )}
                  <Text className="text-sm text-[#2C3E50] leading-6">{selectedEvent.description}</Text>
                </View>

                {selectedEvent.is_holiday && (
                  <View className="bg-[#E74C3C10] border border-[#E74C3C30] rounded-2xl p-4 mb-4">
                    <View className="flex-row items-center">
                      <Icon name="info" size={20} color="#E74C3C" />
                      <Text className="text-sm font-semibold text-[#E74C3C] ml-2">
                        School Holiday - No classes scheduled
                      </Text>
                    </View>
                  </View>
                )}

               
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

export default CalendarScreen;
