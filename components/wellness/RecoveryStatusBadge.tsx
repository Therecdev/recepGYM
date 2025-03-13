import type React from "react"
import { View, Text, StyleSheet, TouchableOpacity } from "react-native"
import { useTranslation } from "react-i18next"
import { useTheme } from "../../hooks/useTheme"

interface RecoveryStatusBadgeProps {
  status: "poor" | "fair" | "good" | "excellent"
  score: number
  showScore?: boolean
  size?: "small" | "medium" | "large"
  onPress?: () => void
  style?: any
}

export const RecoveryStatusBadge: React.FC<RecoveryStatusBadgeProps> = ({
  status,
  score,
  showScore = false,
  size = "medium",
  onPress,
  style,
}) => {
  const { t } = useTranslation()
  const { theme } = useTheme()

  // Get color based on status
  const getStatusColor = () => {
    switch (status) {
      case "poor":
        return theme.colors.error
      case "fair":
        return theme.colors.warning
      case "good":
        return theme.colors.success
      case "excellent":
        return theme.colors.primary
      default:
        return theme.colors.primary
    }
  }

  // Get size styles
  const getSizeStyles = () => {
    switch (size) {
      case "small":
        return {
          container: {
            paddingHorizontal: 8,
            paddingVertical: 4,
            borderRadius: 12,
          },
          text: {
            fontSize: 10,
          },
          scoreText: {
            fontSize: 10,
          },
        }
      case "large":
        return {
          container: {
            paddingHorizontal: 16,
            paddingVertical: 8,
            borderRadius: 20,
          },
          text: {
            fontSize: 16,
          },
          scoreText: {
            fontSize: 14,
          },
        }
      default: // medium
        return {
          container: {
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 16,
          },
          text: {
            fontSize: 12,
          },
          scoreText: {
            fontSize: 12,
          },
        }
    }
  }

  const sizeStyles = getSizeStyles()
  const color = getStatusColor()

  const Container = onPress ? TouchableOpacity : View

  return (
    <Container style={[styles.container, sizeStyles.container, { backgroundColor: color }, style]} onPress={onPress}>
      <Text style={[styles.text, sizeStyles.text]}>{t(`wellness.recovery.status.${status}`)}</Text>

      {showScore && <Text style={[styles.scoreText, sizeStyles.scoreText]}>{score}</Text>}
    </Container>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  text: {
    color: "white",
    fontWeight: "bold",
  },
  scoreText: {
    color: "white",
    marginLeft: 5,
    opacity: 0.9,
  },
})

