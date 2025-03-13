import type React from "react"
import { View, Text, StyleSheet, TouchableOpacity } from "react-native"
import { useTheme } from "../../hooks/useTheme"
import { Icon } from "../ui/Icon"
import { Card } from "../ui/Card"

interface WellnessTipProps {
  title: string
  description: string
  icon: string
  color: string
  onPress?: () => void
  style?: any
}

export const WellnessTip: React.FC<WellnessTipProps> = ({ title, description, icon, color, onPress, style }) => {
  const { theme } = useTheme()

  const Container = onPress ? TouchableOpacity : View

  return (
    <Card style={[styles.container, style]}>
      <Container style={styles.content} onPress={onPress}>
        <View style={[styles.iconContainer, { backgroundColor: color + "20" }]}>
          <Icon name={icon} size={20} color={color} />
        </View>

        <View style={styles.textContainer}>
          <Text style={[styles.title, { color: theme.colors.text }]}>{title}</Text>

          <Text style={[styles.description, { color: theme.colors.textSecondary }]}>{description}</Text>
        </View>
      </Container>
    </Card>
  )
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  content: {
    flexDirection: "row",
    padding: 15,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
  },
})

