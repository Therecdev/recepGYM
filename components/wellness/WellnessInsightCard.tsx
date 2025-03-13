import type React from "react"
import { View, Text, StyleSheet } from "react-native"
import { Card } from "../ui/Card"
import { Icon } from "../ui/Icon"
import { useTheme } from "../../hooks/useTheme"

interface WellnessInsightCardProps {
  title: string
  description: string
  icon: string
  color: string
  style?: any
}

export const WellnessInsightCard: React.FC<WellnessInsightCardProps> = ({ title, description, icon, color, style }) => {
  const { theme } = useTheme()

  return (
    <Card style={[styles.container, style]}>
      <View style={styles.header}>
        <View style={[styles.iconContainer, { backgroundColor: color + "20" }]}>
          <Icon name={icon} size={18} color={color} />
        </View>

        <Text style={[styles.title, { color: theme.colors.text }]}>{title}</Text>
      </View>

      <Text style={[styles.description, { color: theme.colors.textSecondary }]}>{description}</Text>
    </Card>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 15,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    flex: 1,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
  },
})

