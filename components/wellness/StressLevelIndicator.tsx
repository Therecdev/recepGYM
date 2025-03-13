import type React from "react"
import { View, StyleSheet } from "react-native"
import Svg, { Circle, Text as SvgText } from "react-native-svg"
import { useTheme } from "../../hooks/useTheme"

interface StressLevelIndicatorProps {
  level: number
  size?: number
  style?: any
}

export const StressLevelIndicator: React.FC<StressLevelIndicatorProps> = ({ level, size = 150, style }) => {
  const { theme } = useTheme()

  // Ensure level is within bounds
  const normalizedLevel = Math.min(100, Math.max(0, level))

  // Calculate properties
  const radius = (size - 20) / 2
  const circumference = radius * 2 * Math.PI
  const strokeDashoffset = circumference - (normalizedLevel / 100) * circumference

  // Determine color based on level
  const getColor = (level: number) => {
    if (level < 30) return theme.colors.success
    if (level < 60) return theme.colors.info
    if (level < 80) return theme.colors.warning
    return theme.colors.error
  }

  const color = getColor(normalizedLevel)

  return (
    <View style={[styles.container, style, { width: size, height: size }]}>
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

        {/* Level Text */}
        <SvgText
          x={size / 2}
          y={size / 2 + 8}
          fontSize="24"
          fontWeight="bold"
          fill={theme.colors.text}
          textAnchor="middle"
        >
          {Math.round(normalizedLevel)}
        </SvgText>
      </Svg>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
  },
})

