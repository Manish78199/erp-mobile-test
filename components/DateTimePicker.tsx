import React, { useState } from "react";
import { View, Text, TouchableOpacity, Platform } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Calendar, Clock } from "lucide-react-native";

interface DateTimeInputProps {
  value: Date;
  onChange: (date: Date) => void;
  mode?: "date" | "time" | "datetime";
  label?: string;
}

const DateTimeInput: React.FC<DateTimeInputProps> = ({
  value,
  onChange,
  mode = "date",
  label,
}) => {
  const [show, setShow] = useState(false);

  const handleChange = (_event: any, selectedDate?: Date) => {
    if (Platform.OS === "android") setShow(false);
    if (selectedDate) onChange(selectedDate);
  };

  const formatted =
    mode === "time"
      ? value.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      : value.toLocaleDateString();

  return (
    <View className="mb-4">
      {label && <Text className="text-sm text-muted-foreground mb-1">{label}</Text>}

      <TouchableOpacity
        onPress={() => setShow(true)}
        className="flex-row items-center justify-between border border-border rounded-xl px-4 py-3 bg-input"
      >
        <Text className="text-base text-foreground">{formatted}</Text>
        {mode === "time" ? (
          <Clock size={20} className="text-muted-foreground" />
        ) : (
          <Calendar size={20} className="text-muted-foreground" />
        )}
      </TouchableOpacity>

      {show && (
        <DateTimePicker
          value={value}
          mode={mode === "datetime" ? "date" : mode} // "datetime" handled manually
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={handleChange}
        />
      )}
    </View>
  );
};

export default DateTimeInput;
