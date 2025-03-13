import type React from "react"
import { View, Text, StyleSheet } from "react-native"
import { Card } from "../ui/Card"
import { Icon } from "../ui/Icon"
import { useTheme } from "../../hooks/useTheme"

interface WellnessMetricCardProps {
  title: string
  value: string
  icon: string
  color: string
  style?: any
}

export const WellnessMetricCard: React.FC<WellnessMetricCardProps> = ({ title, value, icon, color, style }) => {
  const { theme } = useTheme()

  return (
    <Card style={[styles.container, style]}>
      <View style={[styles.iconContainer, { backgroundColor: color + "20" }]}>
        <Icon name={icon} size={20} color={color} />
      </View>

      <Text style={[styles.value, { color: theme.colors.text }]}>{value}</Text>

      <Text style={[styles.title, { color: theme.colors.textSecondary }]}>{title}</Text>
    </Card>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 15,
    alignItems: "center",
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  value: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  title: {
    fontSize: 12,
    textAlign: "center",
  },
})

