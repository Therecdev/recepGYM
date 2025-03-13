import type React from "react"
import { View, StyleSheet, Dimensions } from "react-native"
import { BarChart } from "react-native-chart-kit"
import type { HydrationData } from "../../types/health"
import { useTheme } from "../../hooks/useTheme"
import { formatDate } from "../../utils/dateUtils"

interface HydrationChartProps {
  data: HydrationData[]
  style?: any
}

export const HydrationChart: React.FC<HydrationChartProps> = ({ data, style }) => {
  const { theme } = useTheme()

  // Group data by day and calculate total for each day
  const groupedData = data.reduce(
    (acc, item) => {
      const dateStr = formatDate(item.date, "yyyy-MM-dd")
      if (!acc[dateStr]) {
        acc[dateStr] = { total: 0 }
      }
      acc[dateStr].total += item.amount
      return acc
    },
    {} as Record<string, { total: number }>,
  )

  // Get the last 7 days
  const getDaysArray = () => {
    const result = []
    for (let i = 6; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      result.push(date)
    }
    return result
  }

  const last7Days = getDaysArray()

  // Create data points for the chart
  const dataPoints = last7Days.map((date) => {
    const dateStr = formatDate(date, "yyyy-MM-dd")
    return {
      date,
      total: groupedData[dateStr]?.total || 0,
    }
  })

  // Format data for the chart
  const chartData = {
    labels: dataPoints.map((item) => formatDate(item.date, "dd")),
    datasets: [
      {
        data: dataPoints.map((item) => item.total),
      },
    ],
  }

  const chartConfig = {
    backgroundGradientFrom: theme.colors.card,
    backgroundGradientTo: theme.colors.card,
    decimalPlaces: 0,
    color: (opacity = 1) => theme.colors.primary,
    labelColor: (opacity = 1) => theme.colors.text,
    style: {
      borderRadius: 16,
    },
    barPercentage: 0.7,
  }

  const screenWidth = Dimensions.get("window").width - 40 // Padding

  return (
    <View style={[styles.container, style]}>
      <BarChart
        data={chartData}
        width={screenWidth}
        height={220}
        chartConfig={chartConfig}
        style={styles.chart}
        yAxisSuffix="ml"
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

