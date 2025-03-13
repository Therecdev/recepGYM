import type React from "react"
import { View, StyleSheet, Dimensions } from "react-native"
import { LineChart } from "react-native-chart-kit"
import type { SleepData } from "../../types/health"
import { useTheme } from "../../hooks/useTheme"
import { formatDate } from "../../utils/dateUtils"

interface SleepQualityChartProps {
  data: SleepData[]
  style?: any
}

export const SleepQualityChart: React.FC<SleepQualityChartProps> = ({ data, style }) => {
  const { theme } = useTheme()

  // Sort data by date (oldest to newest)
  const sortedData = [...data].sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())

  // Format data for the chart
  const chartData = {
    labels: sortedData.map((item) => formatDate(item.startTime, "MMM dd")),
    datasets: [
      {
        data: sortedData.map((item) => item.quality),
        color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`,
        strokeWidth: 2,
      },
    ],
    legend: ["Sleep Quality (%)"],
  }

  const chartConfig = {
    backgroundGradientFrom: theme.colors.card,
    backgroundGradientTo: theme.colors.card,
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`,
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
        yAxisSuffix="%"
        yAxisInterval={10}
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

