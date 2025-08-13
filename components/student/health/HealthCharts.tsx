import { Typography } from "@/components/Typography"
import type React from "react"
import { View, Text, Dimensions } from "react-native"
import { CartesianChart, Line, useChartPressState } from "victory-native"
// import { LinearGradient, vec, useFont } from "@shopify/react-native-skia"

interface ChartData {
  month: string
  height: number
  weight: number
  bmi: number
}

interface HealthChartsProps {
  chart: ChartData[]
}

const { width } = Dimensions.get("window")
const chartWidth = width - 64 // Account for padding

const ChartCard: React.FC<{
  title: string
  dataKey: keyof ChartData
  color: string
  chart: ChartData[]
}> = ({ title, dataKey, color, chart }) => {
  const data = chart?.map((item, index) => ({
    x: index,
    y: item[dataKey] as number,
    month: item.month,
  }))

  const { state, isActive } = useChartPressState({ x: 0, y: { y: 0 } })

  return (
    <View className="bg-white rounded-xl shadow-lg elevation-5 p-4 mb-4">
      <Typography className="text-lg font-semibold text-[#2C3E50] mb-2">{title}</Typography> 
      {isActive && (
        <Typography className="text-sm text-[#7F8C8D] mb-2">
          {chart[Math.round(state?.x?.value?.value)]?.month}: {state?.y?.y?.value?.value.toFixed(1)}
        </Typography> 
      )}
      <View style={{ height: 200 }}>
        <CartesianChart
          data={data}
          xKey="x"
          yKeys={["y"]}
          chartPressState={state}
          axisOptions={{
            
            tickCount: { x: 5, y: 5 },
            labelOffset: { x: 5, y: 8 },
            labelColor: "#7F8C8D",
            formatXLabel: (value) => chart[Math.round(value)]?.month.slice(0, 3) || "",
          }}
        >
          {({ points }) => (
            <Line
              points={points.y}
              color={color}
              strokeWidth={3}
            />
          )}
        </CartesianChart>
      </View>
    </View>
  )
}

const HealthCharts: React.FC<HealthChartsProps> = ({ chart }) => {
  return (
    <View>
      <ChartCard chart={chart} title="Height (cm)" dataKey="height" color="#6366F1" />
      <ChartCard chart={chart} title="Weight (kg)" dataKey="weight" color="#10B981" />
      <ChartCard chart={chart} title="BMI" dataKey="bmi" color="#F59E0B" />
    </View>
  )
}

export default HealthCharts


