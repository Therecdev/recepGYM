import { View, Text, StyleSheet, TouchableOpacity } from "react-native"
import { TrendingUp, TrendingDown, ChevronRight } from "lucide-react-native"
import { useTheme } from "../../styles/ThemeContext"

interface StrengthMetric {
  id: string
  exercise: string
  currentMax: string
  progress: string
  trend: "up" | "down" | "neutral"
  history: number[]
}

interface StrengthMetricCardProps {
  metric: StrengthMetric
  onPress: () => void
}

const StrengthMetricCard = ({ metric, onPress }: StrengthMetricCardProps) => {
  const { colors } = useTheme()

  const styles = StyleSheet.create({
    container: {
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    title: {
      fontSize: 16,
      fontWeight: "bold",
      color: colors.text,
    },
    content: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginTop: 8,
    },
    maxValue: {
      fontSize: 20,
      fontWeight: "bold",
      color: colors.text,
    },
    progressContainer: {
      flexDirection: "row",
      alignItems: "center",
    },
    progressText: {
      fontSize: 14,
      marginLeft: 4,
      color: metric.trend === "up" ? colors.success : metric.trend === "down" ? colors.error : colors.textSecondary,
    },
    miniChart: {
      height: 30,
      flexDirection: "row",
      alignItems: "flex-end",
      marginTop: 8,
    },
    chartBar: {
      width: 4,
      marginRight: 2,
      borderRadius: 2,
      backgroundColor: colors.primary,
    },
  })

  // Calculate relative heights for mini chart bars
  const maxValue = Math.max(...metric.history)
  const getBarHeight = (value: number) => {
    return (value / maxValue) * 30 // 30 is the max height
  }

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.header}>
        <Text style={styles.title}>{metric.exercise}</Text>
        <ChevronRight size={18} color={colors.icon} />
      </View>

      <View style={styles.content}>
        <View>
          <Text style={styles.maxValue}>{metric.currentMax}</Text>
          <View style={styles.progressContainer}>
            {metric.trend === "up" ? (
              <TrendingUp size={16} color={colors.success} />
            ) : metric.trend === "down" ? (
              <TrendingDown size={16} color={colors.error} />
            ) : null}
            <Text style={styles.progressText}>{metric.progress}</Text>
          </View>
        </View>

        <View style={styles.miniChart}>
          {metric.history.map((value, index) => (
            <View key={index} style={[styles.chartBar, { height: getBarHeight(value) }]} />
          ))}
        </View>
      </View>
    </TouchableOpacity>
  )
}

export default StrengthMetricCard

