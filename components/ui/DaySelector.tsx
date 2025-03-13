import type React from "react"
import { View, Text, StyleSheet, TouchableOpacity } from "react-native"
import { useTranslation } from "react-i18next"
import { useTheme } from "../../hooks/useTheme"

interface DaySelectorProps {
  selectedDays: number[]
  onChange: (days: number[]) => void
  style?: object
}

export const DaySelector: React.FC<DaySelectorProps> = ({ selectedDays, onChange, style }) => {
  const { t } = useTranslation()
  const { theme } = useTheme()

  const days = [
    { value: 0, label: t("days.sunday").substring(0, 1) },
    { value: 1, label: t("days.monday").substring(0, 1) },
    { value: 2, label: t("days.tuesday").substring(0, 1) },
    { value: 3, label: t("days.wednesday").substring(0, 1) },
    { value: 4, label: t("days.thursday").substring(0, 1) },
    { value: 5, label: t("days.friday").substring(0, 1) },
    { value: 6, label: t("days.saturday").substring(0, 1) },
  ]

  const handleToggleDay = (day: number) => {
    if (selectedDays.includes(day)) {
      onChange(selectedDays.filter((d) => d !== day))
    } else {
      onChange([...selectedDays, day])
    }
  }

  return (
    <View style={[styles.container, style]}>
      {days.map((day) => (
        <TouchableOpacity
          key={day.value}
          onPress={() => handleToggleDay(day.value)}
          style={[
            styles.dayButton,
            {
              backgroundColor: selectedDays.includes(day.value) ? theme.colors.primary : theme.colors.backgroundLight,
              borderColor: theme.colors.border,
            },
          ]}
        >
          <Text
            style={[
              styles.dayText,
              {
                color: selectedDays.includes(day.value) ? theme.colors.primaryContrast : theme.colors.text,
              },
            ]}
          >
            {day.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  dayButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  dayText: {
    fontSize: 14,
    fontWeight: "bold",
  },
})

