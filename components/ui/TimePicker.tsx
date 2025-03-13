"use client"

import type React from "react"
import { useState } from "react"
import { View, Text, StyleSheet, TouchableOpacity } from "react-native"
import { useTranslation } from "react-i18next"
import { useTheme } from "../../hooks/useTheme"
import { Icon } from "./Icon"
import DateTimePicker from "@react-native-community/datetimepicker"

interface TimePickerProps {
  value: Date
  onChange: (date: Date) => void
  label?: string
  style?: object
}

export const TimePicker: React.FC<TimePickerProps> = ({ value, onChange, label, style }) => {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const [showPicker, setShowPicker] = useState(false)

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  const handleChange = (event: any, selectedDate?: Date) => {
    if (selectedDate) {
      onChange(selectedDate)
    }
    setShowPicker(false)
  }

  return (
    <View style={[styles.container, style]}>
      {label && <Text style={[styles.label, { color: theme.colors.text }]}>{label}</Text>}

      <TouchableOpacity
        onPress={() => setShowPicker(true)}
        style={[
          styles.button,
          {
            backgroundColor: theme.colors.backgroundLight,
            borderColor: theme.colors.border,
          },
        ]}
      >
        <Text style={[styles.timeText, { color: theme.colors.text }]}>{formatTime(value)}</Text>
        <Icon name="clock" size={20} color={theme.colors.textSecondary} />
      </TouchableOpacity>

      {showPicker && (
        <DateTimePicker value={value} mode="time" is24Hour={false} display="default" onChange={handleChange} />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  timeText: {
    fontSize: 16,
  },
})

