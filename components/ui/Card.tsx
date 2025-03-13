import type React from "react"
import { View, StyleSheet, type ViewStyle } from "react-native"
import { theme } from "../../theme"

interface CardProps {
  children: React.ReactNode
  style?: ViewStyle
  elevation?: "none" | "sm" | "md" | "lg"
}

export default function Card({ children, style, elevation = "sm" }: CardProps) {
  const getElevationStyle = (): ViewStyle => {
    switch (elevation) {
      case "none":
        return theme.shadows.none
      case "sm":
        return theme.shadows.sm
      case "md":
        return theme.shadows.md
      case "lg":
        return theme.shadows.lg
      default:
        return theme.shadows.sm
    }
  }

  return <View style={[styles.card, getElevationStyle(), style]}>{children}</View>
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
})

