import type React from "react"
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native"
import { useTranslation } from "react-i18next"
import { useTheme } from "../../hooks/useTheme"

interface RPESelectorProps {
  onSelect: (rpe: number) => void
  initialValue?: number
}

interface RPEOption {
  value: number
  label: string
  description: string
  color: string
}

export const RPESelector: React.FC<RPESelectorProps> = ({ onSelect, initialValue }) => {
  const { t } = useTranslation()
  const { colors } = useTheme()

  // RPE scale options with descriptions
  const rpeOptions: RPEOption[] = [
    {
      value: 10,
      label: "10",
      description: t("rpe.10"),
      color: colors.error,
    },
    {
      value: 9.5,
      label: "9.5",
      description: t("rpe.9_5"),
      color: colors.error,
    },
    {
      value: 9,
      label: "9",
      description: t("rpe.9"),
      color: colors.errorLight,
    },
    {
      value: 8.5,
      label: "8.5",
      description: t("rpe.8_5"),
      color: colors.warning,
    },
    {
      value: 8,
      label: "8",
      description: t("rpe.8"),
      color: colors.warning,
    },
    {
      value: 7.5,
      label: "7.5",
      description: t("rpe.7_5"),
      color: colors.warningLight,
    },
    {
      value: 7,
      label: "7",
      description: t("rpe.7"),
      color: colors.primary,
    },
    {
      value: 6.5,
      label: "6.5",
      description: t("rpe.6_5"),
      color: colors.primary,
    },
    {
      value: 6,
      label: "6",
      description: t("rpe.6"),
      color: colors.primaryLight,
    },
    {
      value: 5,
      label: "5",
      description: t("rpe.5"),
      color: colors.success,
    },
    {
      value: 4,
      label: "4",
      description: t("rpe.4"),
      color: colors.success,
    },
    {
      value: 3,
      label: "3",
      description: t("rpe.3"),
      color: colors.successLight,
    },
    {
      value: 2,
      label: "2",
      description: t("rpe.2"),
      color: colors.successLight,
    },
    {
      value: 1,
      label: "1",
      description: t("rpe.1"),
      color: colors.successLight,
    },
  ]

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: colors.text }]}>{t("workout.rpeExplanation")}</Text>

      <ScrollView style={styles.optionsScrollView}>
        <View style={styles.optionsContainer}>
          {rpeOptions.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.optionButton,
                {
                  backgroundColor: option.color + "20",
                  borderColor: option.color,
                  borderWidth: initialValue === option.value ? 2 : 0,
                },
              ]}
              onPress={() => onSelect(option.value)}
            >
              <Text style={[styles.optionValue, { color: option.color }]}>{option.label}</Text>
              <Text style={[styles.optionDescription, { color: colors.text }]}>{option.description}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 16,
    textAlign: "center",
  },
  optionsScrollView: {
    maxHeight: 400,
  },
  optionsContainer: {
    gap: 12,
  },
  optionButton: {
    padding: 16,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  optionValue: {
    fontSize: 18,
    fontWeight: "bold",
    width: 40,
    textAlign: "center",
  },
  optionDescription: {
    fontSize: 14,
    flex: 1,
    marginLeft: 12,
  },
})

