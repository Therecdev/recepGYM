import type React from "react"
import { View, StyleSheet, Dimensions } from "react-native"
import { LineChart } from "react-native-chart-kit"
import type { MoodData } from "../../types/health"
import { useTheme } from "../../hooks/useTheme"
import { formatDate } from "../../utils/dateUtils"

interface MoodChartProps {
  data: MoodData[]
  style?: any
}

export const MoodChart: React.FC<MoodChartProps> = ({ data, style }) => {
  const { theme } = useTheme()

  // Sort data by date (oldest to newest)
  const sortedData = [...data].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  // Group data by day and calculate average for each day
  const groupedData = sortedData.reduce(
    (acc, item) => {
      const dateStr = formatDate(item.date, "yyyy-MM-dd")
      if (!acc[dateStr]) {
        acc[dateStr] = {
          moodSum: 0,
          moodCount: 0,
          energySum: 0,
          energyCount: 0,
        }
      }
      acc[dateStr].moodSum += item.value
      acc[dateStr].moodCount += 1
      acc[dateStr].energySum += item.energy
      acc[dateStr].energyCount += 1
      return acc
    },
    {} as Record<
      string,
      {
        moodSum: number
        moodCount: number
        energySum: number
        energyCount: number
      }
    >,
  )

  // Create data points for the chart
  const dataPoints = Object.entries(groupedData).map(([dateStr, data]) => ({
    date: new Date(dateStr),
    mood: data.moodSum / data.moodCount,
    energy: data.energySum / data.energyCount,
  }))

  // Format data for the chart
  const chartData = {
    labels: dataPoints.map((item) => formatDate(item.date, "MMM dd")),
    datasets: [
      {
        data: dataPoints.map((item) => item.mood),
        color: (opacity = 1) => theme.colors.primary,
        strokeWidth: 2,
      },
      {
        data: dataPoints.map((item) => item.energy),
        color: (opacity = 1) => theme.colors.warning,
        strokeWidth: 2,
      },
    ],
    legend: ["Mood", "Energy"],
  }

  const chartConfig = {
    backgroundGradientFrom: theme.colors.card,
    backgroundGradientTo: theme.colors.card,
    decimalPlaces: 1,
    color: (opacity = 1) => theme.colors.text,
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
        yAxisInterval={1}
        fromZero
        yAxisMin={0}
        yAxisMax={5}
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

