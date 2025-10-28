
import RNPickerSelect from "react-native-picker-select"
import { View } from "react-native"
import { cn } from "@/utils/cn"

interface StyledPickerSelectProps {
  items: any[]
  onValueChange: (value: any) => void
  value: any
  placeholder?: any
  className?: string
}

export function StyledPickerSelect({ items, onValueChange, value, placeholder, className }: StyledPickerSelectProps) {
  return (
    <View className={cn("rounded-lg overflow-hidden", className)}>
      <RNPickerSelect
        items={items}
        onValueChange={onValueChange}
        value={value}
        placeholder={placeholder}
        style={{
          inputIOS: {
            paddingVertical: 12,
            paddingHorizontal: 12,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: "#e5e7eb",
            backgroundColor: "#f9fafb",
            color: "#111827",
            fontSize: 14,
          },
          inputAndroid: {
            paddingVertical: 12,
            paddingHorizontal: 12,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: "#e5e7eb",
            backgroundColor: "#f9fafb",
            color: "#111827",
            fontSize: 14,
          },
          placeholder: {
            color: "#9ca3af",
          },
        }}
      />
    </View>
  )
}
