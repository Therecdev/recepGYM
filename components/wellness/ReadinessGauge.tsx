import type React from "react"
import { View, Text, StyleSheet } from "react-native"
import Svg, { Circle } from "react-native-svg"
import { useTheme } from "../../hooks/useTheme"

interface ReadinessGaugeProps {
  score: number
  size?: number
  strokeWidth?: number
  style?: any
}

export const ReadinessGauge: React.FC<ReadinessGaugeProps> = ({ score, size = 120, strokeWidth = 10, style }) => {
  const { theme } = useTheme()

  // Ensure score is within bounds
  const normalizedScore = Math.min(100, Math.max(0, score))

  // Calculate properties
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const strokeDashoffset = circumference - (normalizedScore / 100) * circumference

  // Determine color based on score
  const getColor = (score: number) => {
    if (score < 40) return theme.colors.error
    if (score < 60) return theme.colors.warning
    if (score < 80) return theme.colors.success
    return theme.colors.primary
  }

  const color = getColor(normalizedScore)

  return (
    <View style={[styles.container, style, { width: size, height: size }]}>
      <Svg width={size} height={size}>
        {/* Background Circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={theme.colors.border}
          strokeWidth={strokeWidth}
          fill="transparent"
        />

        {/* Progress Arc */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="transparent"
          transform={`rotate(-90, ${size / 2}, ${size / 2})`}
        />
      </Svg>

      <View style={styles.scoreContainer}>
        <Text style={[styles.score, { color: theme.colors.text }]}>{Math.round(normalizedScore)}</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
  },
  scoreContainer: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
  },
  score: {
    fontSize: 24,
    fontWeight: "bold",
  },
})

