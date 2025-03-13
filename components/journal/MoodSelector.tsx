import type React from "react"
import { View, Text, StyleSheet, TouchableOpacity } from "react-native"
import { useTranslation } from "react-i18next"
import { useTheme } from "../../hooks/useTheme"
import { Icon } from "../ui/Icon"

interface MoodSelectorProps {
  selectedMood: number
  onChange: (mood: number) => void
  style?: object
}

export const MoodSelector: React.FC<MoodSelectorProps> = ({ selectedMood, onChange, style }) => {
  const { t } = useTranslation()
  const { theme } = useTheme()

  const moods = [
    { value: 1, icon: "frown", label: t("moods.terrible") },
    { value: 2, icon: "meh", label: t("moods.bad") },
    { value: 3, icon: "smile", label: t("moods.okay") },
    { value: 4, icon: "smile", label: t("moods.good") },
    { value: 5, icon: "smile", label: t("moods.great") },
  ]

  return (
    <View style={[styles.container, style]}>
      {moods.map((mood) => (
        <TouchableOpacity
          key={mood.value}
          style={[
            styles.moodItem,
            selectedMood === mood.value && {
              backgroundColor: theme.colors.primaryLight,
            },
          ]}
          onPress={() => onChange(mood.value)}
        >
          <Icon
            name={mood.icon}
            size={24}
            color={selectedMood === mood.value ? theme.colors.primary : theme.colors.textSecondary}
          />
          <Text
            style={[
              styles.moodLabel,
              { color: selectedMood === mood.value ? theme.colors.primary : theme.colors.textSecondary },
            ]}
          >
            {mood.label}
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
  moodItem: {
    alignItems: "center",
    padding: 10,
    borderRadius: 8,
  },
  moodLabel: {
    fontSize: 12,
    marginTop: 5,
  },
})

