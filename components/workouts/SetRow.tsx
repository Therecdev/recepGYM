"use client"

import type React from "react"
import { useState } from "react"
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from "react-native"
import { useTranslation } from "react-i18next"
import { useTheme } from "../../hooks/useTheme"
import type { Set } from "../../types/workout"
import { Icon } from "../ui/Icon"

interface SetRowProps {
  set: Set
  setIndex: number
  onComplete: () => void
  onWeightChange: (weight: number) => void
  onRepsChange: (reps: number) => void
  onRemove: () => void
  recoveryStatus?: "excellent" | "good" | "fair" | "poor"
}

export const SetRow: React.FC<SetRowProps> = ({
  set,
  setIndex,
  onComplete,
  onWeightChange,
  onRepsChange,
  onRemove,
  recoveryStatus = "good",
}) => {
  const { t } = useTranslation()
  const { colors } = useTheme()

  const [weight, setWeight] = useState(set.actualWeight?.toString() || set.weight?.toString() || "")
  const [reps, setReps] = useState(set.actualReps?.toString() || set.reps?.toString() || "")

  const handleWeightChange = (text: string) => {
    setWeight(text)
    const numValue = Number.parseFloat(text)
    if (!isNaN(numValue)) {
      onWeightChange(numValue)
    }
  }

  const handleRepsChange = (text: string) => {
    setReps(text)
    const numValue = Number.parseInt(text, 10)
    if (!isNaN(numValue)) {
      onRepsChange(numValue)
    }
  }

  // Determine if we should show a recovery adjustment indicator
  const showRecoveryAdjustment = recoveryStatus === "poor" || recoveryStatus === "fair"

  // Calculate suggested weight adjustment based on recovery status
  const getWeightAdjustment = () => {
    if (recoveryStatus === "poor") return -10 // 10% reduction
    if (recoveryStatus === "fair") return -5 // 5% reduction
    return 0
  }

  const weightAdjustment = getWeightAdjustment()
  const adjustedWeight = set.weight ? Math.round(set.weight * (1 + weightAdjustment / 100)) : 0

  return (
    <View style={styles.container}>
      <View style={styles.setIndexContainer}>
        <Text style={[styles.setIndex, { color: colors.textSecondary }]}>{setIndex + 1}</Text>
      </View>

      <View style={styles.weightContainer}>
        <TextInput
          style={[
            styles.input,
            {
              color: colors.text,
              borderColor: colors.border,
              backgroundColor: set.completed ? colors.backgroundSecondary : colors.background,
            },
          ]}
          value={weight}
          onChangeText={handleWeightChange}
          keyboardType="numeric"
          placeholder={set.weight?.toString() || "0"}
          placeholderTextColor={colors.textSecondary}
          editable={!set.completed}
        />
        {showRecoveryAdjustment && set.weight && !set.completed && (
          <View style={[styles.adjustmentBadge, { backgroundColor: colors.warningLight }]}>
            <Text style={[styles.adjustmentText, { color: colors.warning }]}>
              {adjustedWeight} {t("workout.kg")}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.repsContainer}>
        <TextInput
          style={[
            styles.input,
            {
              color: colors.text,
              borderColor: colors.border,
              backgroundColor: set.completed ? colors.backgroundSecondary : colors.background,
            },
          ]}
          value={reps}
          onChangeText={handleRepsChange}
          keyboardType="numeric"
          placeholder={set.reps?.toString() || "0"}
          placeholderTextColor={colors.textSecondary}
          editable={!set.completed}
        />
        {set.targetReps && !set.completed && (
          <Text style={[styles.targetReps, { color: colors.textSecondary }]}>/ {set.targetReps}</Text>
        )}
      </View>

      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={[
            styles.completeButton,
            {
              backgroundColor: set.completed ? colors.successLight : colors.backgroundSecondary,
            },
          ]}
          onPress={onComplete}
        >
          {set.completed ? (
            <Icon name="check" size={18} color={colors.success} />
          ) : (
            <View style={styles.emptyCheckbox} />
          )}
        </TouchableOpacity>

        {set.rpe !== undefined && set.rpe !== null && (
          <View style={[styles.rpeBadge, { backgroundColor: colors.primaryLight }]}>
            <Text style={[styles.rpeText, { color: colors.primary }]}>RPE {set.rpe}</Text>
          </View>
        )}

        <TouchableOpacity style={styles.removeButton} onPress={onRemove}>
          <Icon name="trash-2" size={16} color={colors.error} />
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  setIndexContainer: {
    width: 30,
    alignItems: "center",
  },
  setIndex: {
    fontSize: 14,
    fontWeight: "500",
  },
  weightContainer: {
    flex: 1,
    marginHorizontal: 5,
    position: "relative",
  },
  repsContainer: {
    flex: 1,
    marginHorizontal: 5,
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 10,
    textAlign: "center",
    fontSize: 14,
  },
  targetReps: {
    fontSize: 12,
    marginLeft: 4,
  },
  actionsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    width: 80,
  },
  completeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  emptyCheckbox: {
    width: 16,
    height: 16,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  removeButton: {
    padding: 5,
  },
  rpeBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    position: "absolute",
    top: -18,
    right: 20,
  },
  rpeText: {
    fontSize: 10,
    fontWeight: "500",
  },
  adjustmentBadge: {
    position: "absolute",
    bottom: -16,
    left: 0,
    right: 0,
    paddingVertical: 2,
    borderRadius: 4,
    alignItems: "center",
  },
  adjustmentText: {
    fontSize: 10,
    fontWeight: "500",
  },
})

