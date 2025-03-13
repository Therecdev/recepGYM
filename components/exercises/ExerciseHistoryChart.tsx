import type React from "react"
import { View, Text, StyleSheet, Dimensions } from "react-native"
import { LineChart } from "react-native-chart-kit"
import { useTranslation } from "react-i18next"
import { useTheme } from "../../hooks/useTheme"

interface ExerciseHistoryData {
  date: string
  weight: number
  reps: number
  volume: number
}

interface ExerciseHistoryChartProps {
  data: ExerciseHistoryData[]
  metric: "weight" | "reps" | "volume"
  title?: string
}

const ExerciseHistoryChart: React.FC<ExerciseHistoryChartProps> = ({ data, metric, title }) => {
  const { t } = useTranslation()
  const { colors } = useTheme()

  if (!data || data.length === 0) {
    return (
      <View style={[styles.emptyContainer, { backgroundColor: colors.card }]}>
        <Text style={[styles.emptyText, { color: colors.textSecondary }]}>{t("exercises.noHistoryData")}</Text>
      </View>
    )
  }

  // Sort data by date
  const sortedData = [...data].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  // Format dates for display
  const formattedDates = sortedData.map((item) => {
    const date = new Date(item.date)
    return `${date.getMonth() + 1}/${date.getDate()}`
  })

  // Get values for the selected metric
  const metricValues = sortedData.map((item) => item[metric])

  // Calculate min and max for better chart scaling
  const minValue = Math.min(...metricValues)
  const maxValue = Math.max(...metricValues)
  const padding = maxValue * 0.1 // 10% padding

  return (
    <View style={styles.container}>
      {title && <Text style={[styles.title, { color: colors.text }]}>{title}</Text>}

      <LineChart
        data={{
          labels: formattedDates,
          datasets: [
            {
              data: [Math.max(0, minValue - padding), ...metricValues, maxValue + padding],
              color: () => colors.primary,
              strokeWidth: 2,
            },
          ],
          legend: [t(`exercises.${metric}`)],
        }}
        width={Dimensions.get("window").width - 32}
        height={220}
        chartConfig={{
          backgroundColor: colors.card,
          backgroundGradientFrom: colors.card,
          backgroundGradientTo: colors.card,
          decimalPlaces: metric === "reps" ? 0 : 1,
          color: () => colors.primary,
          labelColor: () => colors.text,
          style: {
            borderRadius: 16,
          },
          propsForDots: {
            r: "6",
            strokeWidth: "2",
            stroke: colors.primary,
          },
          propsForLabels: {
            fontSize: 10,
          },
        }}
        bezier
        style={{
          marginVertical: 8,
          borderRadius: 16,
        }}
        fromZero={metric === "reps"}
        yAxisSuffix={metric === "weight" ? " " + t("common.lbs") : ""}
        yAxisInterval={1}
        segments={5}
      />

      <View style={styles.legendContainer}>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: colors.primary }]} />
          <Text style={[styles.legendText, { color: colors.text }]}>{t(`exercises.${metric}`)}</Text>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  emptyContainer: {
    height: 220,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 8,
  },
  emptyText: {
    fontSize: 14,
  },
  legendContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 8,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 4,
  },
  legendText: {
    fontSize: 12,
  },
})

export default ExerciseHistoryChart

