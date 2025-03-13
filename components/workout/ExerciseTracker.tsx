"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native"
import { useTranslation } from "react-i18next"
import { useTheme } from "../../hooks/useTheme"
import { Card } from "../ui/Card"
import { Button } from "../ui/Button"
import { Icon } from "../ui/Icon"
import type { Exercise, ExerciseSet } from "../../types/workout"
import type { RecoveryStatus } from "../../types/health"
import { SetTracker } from "./SetTracker"
import { RpeSelector } from "./RpeSelector"

interface ExerciseTrackerProps {
  exercise: Exercise
  onComplete: (rpe: number) => void
  recoveryStatus?: RecoveryStatus | null
  style?: any
}

export const ExerciseTracker: React.FC<ExerciseTrackerProps> = ({ exercise, onComplete, recoveryStatus, style }) => {
  const { t } = useTranslation()
  const { theme } = useTheme()

  const [sets, setSets] = useState<ExerciseSet[]>([])
  const [currentSetIndex, setCurrentSetIndex] = useState(0)
  const [rpe, setRpe] = useState(7)
  const [showTips, setShowTips] = useState(false)

  useEffect(() => {
    // Initialize sets from the exercise
    setSets(exercise.sets.map((set) => ({ ...set, completed: false })))
  }, [exercise])

  const handleSetComplete = (setIndex: number, updatedSet: ExerciseSet) => {
    // Update the completed set
    setSets((prevSets) => prevSets.map((set, index) => (index === setIndex ? { ...updatedSet, completed: true } : set)))

    // Move to the next set or complete exercise
    if (setIndex < sets.length - 1) {
      setCurrentSetIndex(setIndex + 1)
    }
  }

  const handleExerciseComplete = () => {
    onComplete(rpe)
  }

  // Get wellness-based tips for this exercise
  const getWellnessTips = () => {
    if (!recoveryStatus) return []

    const tips = []

    if (recoveryStatus.status === "poor") {
      tips.push(t("wellness.exerciseTips.reducedWeight", { percent: "10-15%" }))
      tips.push(t("wellness.exerciseTips.focusForm"))

      if (exercise.category === "compound") {
        tips.push(t("wellness.exerciseTips.compoundCaution"))
      }
    } else if (recoveryStatus.status === "fair") {
      tips.push(t("wellness.exerciseTips.moderateIntensity"))
      tips.push(t("wellness.exerciseTips.listenToBody"))
    } else if (recoveryStatus.status === "excellent") {
      tips.push(t("wellness.exerciseTips.pushHarder"))
      tips.push(t("wellness.exerciseTips.progressiveOverload"))
    }

    // Exercise-specific tips
    if (exercise.targetMuscle === "lower_back" && recoveryStatus.status === "poor") {
      tips.push(t("wellness.exerciseTips.lowerBackCaution"))
    }

    return tips
  }

  const wellnessTips = getWellnessTips()

  // Determine if we should recommend weight adjustment based on recovery status
  const getWeightAdjustment = () => {
    if (!recoveryStatus) return null

    switch (recoveryStatus.status) {
      case "poor":
        return { percent: -15, color: theme.colors.error }
      case "fair":
        return { percent: -5, color: theme.colors.warning }
      case "excellent":
        return { percent: 5, color: theme.colors.success }
      default:
        return null
    }
  }

  const weightAdjustment = getWeightAdjustment()

  return (
    <Card style={[styles.container, style]}>
      <View style={styles.exerciseHeader}>
        <View>
          <Text style={[styles.exerciseName, { color: theme.colors.text }]}>{exercise.name}</Text>
          <Text style={[styles.exerciseDetails, { color: theme.colors.textSecondary }]}>
            {exercise.sets.length} sets • {t(`exercise.category.${exercise.category}`)}
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => setShowTips(!showTips)}
          style={[styles.tipsButton, { borderColor: theme.colors.border }]}
        >
          <Icon name={showTips ? "chevron-up" : "chevron-down"} size={16} color={theme.colors.primary} />
          <Text style={[styles.tipsButtonText, { color: theme.colors.primary }]}>
            {showTips ? t("workout.hideTips") : t("workout.showTips")}
          </Text>
        </TouchableOpacity>
      </View>

      {showTips && wellnessTips.length > 0 && (
        <View style={[styles.tipsContainer, { backgroundColor: theme.colors.background }]}>
          {wellnessTips.map((tip, index) => (
            <View key={index} style={styles.tipRow}>
              <Icon name="info" size={16} color={theme.colors.primary} style={styles.tipIcon} />
              <Text style={[styles.tipText, { color: theme.colors.text }]}>{tip}</Text>
            </View>
          ))}
        </View>
      )}

      <View style={styles.setsContainer}>
        <Text style={[styles.setsHeader, { color: theme.colors.text }]}>{t("workout.sets")}</Text>

        {weightAdjustment && (
          <View style={styles.adjustmentContainer}>
            <Icon
              name={weightAdjustment.percent > 0 ? "trending-up" : "trending-down"}
              size={14}
              color={weightAdjustment.color}
              style={styles.adjustmentIcon}
            />
            <Text style={[styles.adjustmentText, { color: weightAdjustment.color }]}>
              {weightAdjustment.percent > 0 ? "+" : ""}
              {weightAdjustment.percent}% {t("workout.weightAdjustment")}
            </Text>
          </View>
        )}
      </View>

      <ScrollView style={styles.setsScrollContainer}>
        {sets.map((set, index) => (
          <SetTracker
            key={index}
            set={set}
            setNumber={index + 1}
            isActive={index === currentSetIndex}
            isCompleted={set.completed}
            onComplete={(updatedSet) => handleSetComplete(index, updatedSet)}
            recoveryStatus={recoveryStatus}
            style={styles.setTracker}
          />
        ))}
      </ScrollView>

      {sets.length > 0 && sets.every((set) => set.completed) && (
        <View style={styles.completionContainer}>
          <Text style={[styles.rpeLabel, { color: theme.colors.text }]}>{t("workout.rpeQuestion")}</Text>

          <RpeSelector value={rpe} onChange={setRpe} style={styles.rpeSelector} />

          <Button variant="primary" onPress={handleExerciseComplete} style={styles.completeButton}>
            {t("workout.completeExercise")}
          </Button>
        </View>
      )}
    </Card>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 15,
  },
  exerciseHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  exerciseName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  exerciseDetails: {
    fontSize: 14,
  },
  tipsButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  tipsButtonText: {
    fontSize: 12,
    marginLeft: 5,
  },
  tipsContainer: {
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
  },
  tipRow: {
    flexDirection: "row",
    marginBottom: 8,
    alignItems: "flex-start",
  },
  tipIcon: {
    marginRight: 10,
    marginTop: 2,
  },
  tipText: {
    flex: 1,
    fontSize: 14,
  },
  setsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  setsHeader: {
    fontSize: 16,
    fontWeight: "bold",
  },
  adjustmentContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 5,
  },
  adjustmentIcon: {
    marginRight: 5,
  },
  adjustmentText: {
    fontSize: 12,
    fontWeight: "bold",
  },
  setsScrollContainer: {
    maxHeight: 300,
  },
  setTracker: {
    marginBottom: 10,
  },
  completionContainer: {
    marginTop: 15,
    alignItems: "center",
  },
  rpeLabel: {
    fontSize: 16,
    marginBottom: 10,
  },
  rpeSelector: {
    marginBottom: 20,
  },
  completeButton: {
    width: "100%",
  },
})

