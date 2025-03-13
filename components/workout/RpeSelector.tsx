import type React from "react"
import { View, Text, StyleSheet, TouchableOpacity } from "react-native"
import { useTheme } from "../../hooks/useTheme"

interface RpeSelectorProps {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  style?: any
}

export const RpeSelector: React.FC<RpeSelectorProps> = ({ value, onChange, min = 1, max = 10, style }) => {
  const { theme } = useTheme()

  const getColor = (rating: number) => {
    if (rating <= 3) return theme.colors.success
    if (rating <= 6) return theme.colors.info
    if (rating <= 8) return theme.colors.warning
    return theme.colors.error
  }

  const getLabel = (rating: number) => {
    if (rating <= 2) return "Very Easy"
    if (rating <= 4) return "Easy"
    if (rating <= 6) return "Moderate"
    if (rating <= 8) return "Hard"
    return "Very Hard"
  }

  // Create an array of values from min to max
  const values = Array.from({ length: max - min + 1 }, (_, i) => min + i)

  return (
    <View style={[styles.container, style]}>
      <View style={styles.rpeContainer}>
        {values.map((rating) => (
          <TouchableOpacity
            key={rating}
            onPress={() => onChange(rating)}
            style={[
              styles.rpeButton,
              value === rating && {
                backgroundColor: getColor(rating),
                borderColor: getColor(rating),
              },
              { borderColor: theme.colors.border },
            ]}
          >
            <Text style={[styles.rpeText, { color: value === rating ? "white" : theme.colors.text }]}>{rating}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={[styles.rpeLabel, { color: theme.colors.textSecondary }]}>{getLabel(value)}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "center",
  },
  rpeContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginBottom: 10,
  },
  rpeButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    margin: 4,
  },
  rpeText: {
    fontSize: 12,
    fontWeight: "bold",
  },
  rpeLabel: {
    fontSize: 14,
    marginTop: 5,
  },
})

