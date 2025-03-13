import type React from "react"
import { View, Text, StyleSheet } from "react-native"
import { useTranslation } from "react-i18next"
import { useTheme } from "../../hooks/useTheme"
import { Card } from "../ui/Card"
import { Icon } from "../ui/Icon"
import { generateProgressionPlan, ProgressionMethod } from "../../utils/progressionUtils"
import type { Exercise, WorkoutHistory } from "../../types/workout"
import { useWorkoutStore } from "../../stores/workoutStore"

interface ProgressionPlanCardProps {
  exercise: Exercise
  exerciseHistory: WorkoutHistory[]
  progressionMethod: ProgressionMethod
  style?: any
}

export const ProgressionPlanCard: React.FC<ProgressionPlanCardProps> = ({
  exercise,
  exerciseHistory,
  progressionMethod,
  style,
}) => {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const { getUserSettings } = useWorkoutStore()

  // Get user settings
  const userSettings = getUserSettings()

  // Get last performance for the exercise
  const getLastPerformance = () => {
    if (exerciseHistory.length === 0) return []

    const sortedHistory = [...exerciseHistory].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    const lastWorkout = sortedHistory[0]
    const exerciseData = lastWorkout.exercises.find((ex) => ex.id === exercise.id)

    return exerciseData ? exerciseData.sets : []
  }

  const lastPerformance = getLastPerformance()

  // Generate progression plan
  const progressionPlan = generateProgressionPlan(
    exercise,
    lastPerformance,
    progressionMethod,
    userSettings,
    4, // Show next 4 weeks
  )

  // Get progression method name
  const getProgressionMethodName = () => {
    switch (progressionMethod) {
      case ProgressionMethod.LINEAR:
        return t("progress.progressionMethods.linear")
      case ProgressionMethod.DOUBLE_PROGRESSION:
        return t("progress.progressionMethods.doubleProgression")
      case ProgressionMethod.PERCENTAGE_BASED:
        return t("progress.progressionMethods.percentageBased")
      case ProgressionMethod.RPE_BASED:
        return t("progress.progressionMethods.rpeBased")
      case ProgressionMethod.WAVE_LOADING:
        return t("progress.progressionMethods.waveLoading")
      default:
        return t("progress.progressionMethods.linear")
    }
  }

  if (progressionPlan.length === 0) {
    return null
  }

  return (
    <Card style={[styles.container, style]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.text }]}>{t("progress.progressionPlan")}</Text>
        <Icon name="trending-up" size={20} color={theme.colors.success} />
      </View>

      <Text style={[styles.methodText, { color: theme.colors.textSecondary }]}>
        {t("progress.using")} {getProgressionMethodName()}
      </Text>

      <View style={styles.planContainer}>
        {progressionPlan.map((week, index) => (
          <View
            key={index}
            style={[
              styles.weekItem,
              index < progressionPlan.length - 1 && { borderBottomWidth: 1, borderBottomColor: theme.colors.border },
            ]}
          >
            <View style={styles.weekInfo}>
              <Text style={[styles.weekText, { color: theme.colors.text }]}>
                {t("progress.week")} {week.week}
              </Text>

              <Text style={[styles.weekDetail, { color: theme.colors.textSecondary }]}>
                {Array.isArray(week.projectedReps)
                  ? `${week.projectedReps[0]}-${week.projectedReps[week.projectedReps.length - 1]} ${t("progress.reps")}`
                  : `${week.projectedReps} ${t("progress.reps")}`}
              </Text>
            </View>

            <Text style={[styles.weightValue, { color: theme.colors.primary }]}>
              {Math.round(week.projectedWeight)} {t("progress.kg")}
            </Text>
          </View>
        ))}
      </View>
    </Card>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 15,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
  },
  methodText: {
    fontSize: 12,
    marginBottom: 15,
  },
  planContainer: {
    width: "100%",
  },
  weekItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
  },
  weekInfo: {
    flex: 1,
  },
  weekText: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 2,
  },
  weekDetail: {
    fontSize: 12,
  },
  weightValue: {
    fontSize: 16,
    fontWeight: "bold",
  },
})

