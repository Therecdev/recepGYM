import type React from "react"
import { View, StyleSheet, Dimensions } from "react-native"
import { LineChart } from "react-native-chart-kit"
import type { StressData } from "../../types/health"
import { useTheme } from "../../hooks/useTheme"
import { formatDate } from "../../utils/dateUtils"

interface StressChartProps {
  data: StressData[]
  style?: any
}

export const StressChart: React.FC<StressChartProps> = ({ data, style }) => {
  const { theme } = useTheme()

  // Sort data by date (oldest to newest)
  const sortedData = [...data].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  // Group data by day and calculate average for each day
  const groupedData = sortedData.reduce(
    (acc, item) => {
      const dateStr = formatDate(item.date, "yyyy-MM-dd")
      if (!acc[dateStr]) {
        acc[dateStr] = { sum: 0, count: 0 }
      }
      acc[dateStr].sum += item.level
      acc[dateStr].count += 1
      return acc
    },
    {} as Record<string, { sum: number; count: number }>,
  )

  // Create data points for the chart
  const dataPoints = Object.entries(groupedData).map(([dateStr, { sum, count }]) => ({
    date: new Date(dateStr),
    level: sum / count,
  }))

  // Format data for the chart
  const chartData = {
    labels: dataPoints.map((item) => formatDate(item.date, "MMM dd")),
    datasets: [
      {
        data: dataPoints.map((item) => item.level),
        color: (opacity = 1) => theme.colors.warning,
        strokeWidth: 2,
      },
    ],
    legend: ["Stress Level"],
  }

  const chartConfig = {
    backgroundGradientFrom: theme.colors.card,
    backgroundGradientTo: theme.colors.card,
    decimalPlaces: 0,
    color: (opacity = 1) => theme.colors.warning,
    labelColor: (opacity = 1) => theme.colors.text,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: "5",
      strokeWidth: "2",
      stroke: theme.colors.background,
    },
  }

  const screenWidth = Dimensions.get("window").width - 40 // Padding

  return (
    <View style={[styles.container, style]}>
      <LineChart
        data={chartData}
        width={screenWidth}
        height={220}
        chartConfig={chartConfig}
        bezier
        style={styles.chart}
        yAxisSuffix=""
        yAxisInterval={20}
        fromZero
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  chart: {
    borderRadius: 8,
  },
})

