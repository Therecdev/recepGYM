import type React from "react"
import { View, StyleSheet, Dimensions } from "react-native"
import { LineChart } from "react-native-chart-kit"
import type { SleepData } from "../../types/health"
import { useTheme } from "../../hooks/useTheme"
import { formatDate } from "../../utils/dateUtils"

interface SleepChartProps {
  data: SleepData[]
  style?: any
}

export const SleepChart: React.FC<SleepChartProps> = ({ data, style }) => {
  const { theme } = useTheme()

  // Sort data by date (oldest to newest)
  const sortedData = [...data].sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())

  // Format data for the chart
  const chartData = {
    labels: sortedData.map((item) => formatDate(item.startTime, "MMM dd")),
    datasets: [
      {
        data: sortedData.map((item) => item.duration / 60), // Convert minutes to hours
        color: (opacity = 1) => theme.colors.primary,
        strokeWidth: 2,
      },
    ],
    legend: ["Sleep Duration (hours)"],
  }

  const chartConfig = {
    backgroundGradientFrom: theme.colors.card,
    backgroundGradientTo: theme.colors.card,
    decimalPlaces: 1,
    color: (opacity = 1) => theme.colors.primary,
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
        yAxisSuffix="h"
        yAxisInterval={2}
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

