import { View, Text, ScrollView } from "react-native"
import { LineChart } from "react-native-chart-kit"
import { Dimensions } from "react-native"

interface HealthChartProps {
  data: Array<{
    month: string
    height: number
    weight: number
    bmi: number
  }>
}

export default function HealthChart({ data = [] }: HealthChartProps) {
  const screenWidth = Dimensions.get("window").width - 32

  const chartConfig = {
    backgroundColor: "#ffffff",
    backgroundGradientFrom: "#ffffff",
    backgroundGradientTo: "#ffffff",
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.5,
    useShadowColorFromDataset: false,
  }

  // Helper to build dataset safely
  const buildDataset = (values: number[], color: string) => ({
    labels: data.length ? data.map((d) => d.month.slice(0, 3)) : ["No Data"],
    datasets: [
      {
        data: data.length ? values : [0],
        color: () => color,
        strokeWidth: 2,
      },
    ],
  })

  const heightData = buildDataset(data.map((d) => d.height), "#6366F1")
  const weightData = buildDataset(data.map((d) => d.weight), "#10B981")
  const bmiData = buildDataset(data.map((d) => d.bmi), "#F59E0B")

  return (
    <ScrollView className="bg-white rounded-lg p-4">
      <View className="mb-6">
        <Text className="text-lg font-semibold text-slate-900 mb-3">Height (cm)</Text>
        <LineChart
          data={heightData}
          width={screenWidth}
          height={220}
          chartConfig={chartConfig}
          bezier
          style={{ borderRadius: 8 }}
        />
      </View>

      <View className="mb-6">
        <Text className="text-lg font-semibold text-slate-900 mb-3">Weight (kg)</Text>
        <LineChart
          data={weightData}
          width={screenWidth}
          height={220}
          chartConfig={chartConfig}
          bezier
          style={{ borderRadius: 8 }}
        />
      </View>

      <View>
        <Text className="text-lg font-semibold text-slate-900 mb-3">BMI</Text>
        <LineChart
          data={bmiData}
          width={screenWidth}
          height={220}
          chartConfig={chartConfig}
          bezier
          style={{ borderRadius: 8 }}
        />
      </View>
    </ScrollView>
  )
}
