import type React from "react"
import { View, Text, StyleSheet } from "react-native"
import Svg, { Circle, Text as SvgText } from "react-native-svg"
import { useTheme } from "../../hooks/useTheme"
import { useTranslation } from "react-i18next"

interface HydrationProgressProps {
  percentage: number
  current: number
  goal: number
  size?: number
  style?: any
}

export const HydrationProgress: React.FC<HydrationProgressProps> = ({
  percentage,
  current,
  goal,
  size = 180,
  style,
}) => {
  const { theme } = useTheme()
  const { t } = useTranslation()

  // Ensure percentage is within bounds
  const normalizedPercentage = Math.min(100, Math.max(0, percentage))

  // Calculate properties
  const radius = (size - 20) / 2
  const circumference = radius * 2 * Math.PI
  const strokeDashoffset = circumference - (normalizedPercentage / 100) * circumference

  // Determine color based on percentage
  const getColor = (percentage: number) => {
    if (percentage < 30) return theme.colors.error
    if (percentage < 60) return theme.colors.warning
    if (percentage < 90) return theme.colors.info
    return theme.colors.success
  }

  const color = getColor(normalizedPercentage)

  return (
    <View style={[styles.container, style]}>
      <Svg width={size} height={size}>
        {/* Background Circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={theme.colors.border}
          strokeWidth={10}
          fill="transparent"
        />

        {/* Progress Arc */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={10}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="transparent"
          transform={`rotate(-90, ${size / 2}, ${size / 2})`}
        />

        {/* Percentage Text */}
        <SvgText
          x={size / 2}
          y={size / 2 - 10}
          fontSize="24"
          fontWeight="bold"
          fill={theme.colors.text}
          textAnchor="middle"
        >
          {Math.round(normalizedPercentage)}%
        </SvgText>

        {/* Label Text */}
        <SvgText x={size / 2} y={size / 2 + 20} fontSize="14" fill={theme.colors.textSecondary} textAnchor="middle">
          {t("wellness.hydration.progress")}
        </SvgText>
      </Svg>

      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: theme.colors.text }]}>{current}ml</Text>
          <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
            {t("wellness.hydration.current")}
          </Text>
        </View>

        <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />

        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: theme.colors.text }]}>{goal}ml</Text>
          <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>{t("wellness.hydration.goal")}</Text>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginTop: 20,
  },
  statItem: {
    alignItems: "center",
  },
  statValue: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
  },
  divider: {
    width: 1,
    height: "100%",
  },
})

