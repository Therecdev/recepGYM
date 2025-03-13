import { View, Text, StyleSheet, Dimensions } from "react-native"
import { LineChart } from "react-native-chart-kit"
import { useTranslation } from "../../hooks/useTranslation"
import { theme } from "../../theme"

interface ProgressionPoint {
  date: string
  value: number
}

interface ProgressionChartProps {
  title: string
  data: ProgressionPoint[]
  unit: string
  color?: string
  timeframe?: "week" | "month" | "year" | "all"
}

export default function ProgressionChart({
  title,
  data,
  unit,
  color = theme.colors.primary,
  timeframe = "month",
}: ProgressionChartProps) {
  const { t } = useTranslation()
  const screenWidth = Dimensions.get("window").width - 32 // Padding

  // Format dates based on timeframe
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)

    switch (timeframe) {
      case "week":
        return date.toLocaleDateString(undefined, { weekday: "short" })
      case "month":
        return date.toLocaleDateString(undefined, { day: "numeric" })
      case "year":
        return date.toLocaleDateString(undefined, { month: "short" })
      case "all":
        return date.toLocaleDateString(undefined, { month: "short", year: "2-digit" })
      default:
        return date.toLocaleDateString()
    }
  }

  // Calculate min and max values for better visualization
  const values = data.map((point) => point.value)
  const minValue = Math.min(...values)
  const maxValue = Math.max(...values)
  const range = maxValue - minValue

  // Adjust y-axis to show a bit more context
  const yAxisMin = Math.max(0, minValue - range * 0.1)
  const yAxisMax = maxValue + range * 0.1

  const chartData = {
    labels: data.map((point) => formatDate(point.date)),
    datasets: [
      {
        data: data.map((point) => point.value),
        color: () => color,
        strokeWidth: 2,
      },
    ],
  }

  const chartConfig = {
    backgroundGradientFrom: theme.colors.card,
    backgroundGradientTo: theme.colors.card,
    decimalPlaces: 1,
    color: () => color,
    labelColor: () => theme.colors.textSecondary,
    propsForDots: {
      r: "5",
      strokeWidth: "2",
      stroke: color,
    },
    propsForBackgroundLines: {
      stroke: theme.colors.border,
      strokeWidth: 1,
    },
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.unit}>{unit}</Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{maxValue.toFixed(1)}</Text>
          <Text style={styles.statLabel}>{t("progression.max")}</Text>
        </View>

        <View style={styles.statItem}>
          <Text style={styles.statValue}>{(values.reduce((a, b) => a + b, 0) / values.length).toFixed(1)}</Text>
          <Text style={styles.statLabel}>{t("progression.avg")}</Text>
        </View>

        <View style={styles.statItem}>
          <Text
            style={[
              styles.statValue,
              { color: values[values.length - 1] > values[0] ? theme.colors.success : theme.colors.error },
            ]}
          >
            {(((values[values.length - 1] - values[0]) / values[0]) * 100).toFixed(1)}%
          </Text>
          <Text style={styles.statLabel}>{t("progression.change")}</Text>
        </View>
      </View>

      {data.length > 1 ? (
        <LineChart
          data={chartData}
          width={screenWidth}
          height={220}
          chartConfig={chartConfig}
          bezier
          fromZero={yAxisMin === 0}
          yAxisSuffix={` ${unit}`}
          yAxisInterval={1}
          withInnerLines={true}
          withOuterLines={true}
          withVerticalLines={false}
          withHorizontalLines={true}
          withVerticalLabels={true}
          withHorizontalLabels={true}
          yLabelsOffset={10}
          segments={5}
          style={styles.chart}
        />
      ) : (
        <View style={styles.noDataContainer}>
          <Text style={styles.noDataText}>{t("progression.not_enough_data")}</Text>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    ...theme.shadows.sm,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: theme.colors.text,
  },
  unit: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  statsContainer: {
    flexDirection: "row",
    marginBottom: 16,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: theme.colors.text,
  },
  statLabel: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 8,
  },
  noDataContainer: {
    height: 220,
    justifyContent: "center",
    alignItems: "center",
  },
  noDataText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: "center",
  },
})

