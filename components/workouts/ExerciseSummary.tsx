import type React from "react"
import { View, Text, StyleSheet, TouchableOpacity } from "react-native"
import { useTheme } from "../../hooks/useTheme"
import { useTranslation } from "react-i18next"
import { Card } from "../ui/Card"
import { Icon } from "../ui/Icon"
import type { Exercise } from "../../types/workout"
import { calculateOneRepMax } from "../../utils/progressionUtils"

interface ExerciseSummaryProps {
  exercise: Exercise
  isExpanded: boolean
  onToggleExpand: () => void
  previousExercise: Exercise | null
}

export const ExerciseSummary: React.FC<ExerciseSummaryProps> = ({
  exercise,
  isExpanded,
  onToggleExpand,
  previousExercise,
}) => {
  const { theme } = useTheme()
  const { t } = useTranslation()

  // Calculate exercise volume
  const calculateVolume = (ex: Exercise): number => {
    return ex.sets.reduce((total, set) => {
      return total + (set.weight || 0) * (set.reps || 0)
    }, 0)
  }

  // Calculate exercise statistics
  const calculateStats = () => {
    // Current exercise stats
    const totalSets = exercise.sets.length
    const totalReps = exercise.sets.reduce((total, set) => total + (set.reps || 0), 0)
    const totalVolume = calculateVolume(exercise)

    // Calculate highest weight and highest reps
    const highestWeight = Math.max(...exercise.sets.map((set) => set.weight || 0))
    const highestReps = Math.max(...exercise.sets.map((set) => set.reps || 0))

    // Calculate estimated one rep max
    const oneRepMax = Math.max(...exercise.sets.map((set) => calculateOneRepMax(set.weight || 0, set.reps || 0)), 0)

    // Previous exercise stats (if available)
    let volumeChange = 0
    let volumePercentage = 0

    if (previousExercise) {
      const previousVolume = calculateVolume(previousExercise)
      volumeChange = totalVolume - previousVolume
      volumePercentage = previousVolume > 0 ? (volumeChange / previousVolume) * 100 : 0
    }

    return {
      totalSets,
      totalReps,
      totalVolume,
      highestWeight,
      highestReps,
      oneRepMax,
      volumeChange,
      volumePercentage,
      hasPrevious: !!previousExercise,
    }
  }

  const stats = calculateStats()

  return (
    <Card style={styles.container}>
      <TouchableOpacity style={styles.header} onPress={onToggleExpand}>
        <View style={styles.exerciseInfo}>
          <Text style={[styles.exerciseName, { color: theme.colors.text }]}>{exercise.name}</Text>
          <Text style={[styles.exerciseCategory, { color: theme.colors.textSecondary }]}>{exercise.category}</Text>
        </View>

        <View style={styles.headerRight}>
          <Text style={[styles.volumeText, { color: theme.colors.textSecondary }]}>
            {stats.totalVolume.toLocaleString()} kg
          </Text>
          <Icon name={isExpanded ? "chevron-up" : "chevron-down"} size={20} color={theme.colors.textSecondary} />
        </View>
      </TouchableOpacity>

      {isExpanded && (
        <View style={styles.content}>
          {/* Exercise Stats */}
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: theme.colors.text }]}>{stats.totalSets}</Text>
              <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>{t("workout.sets")}</Text>
            </View>

            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: theme.colors.text }]}>{stats.totalReps}</Text>
              <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>{t("workout.reps")}</Text>
            </View>

            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: theme.colors.text }]}>{stats.highestWeight}</Text>
              <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>{t("workout.maxWeight")}</Text>
            </View>

            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: theme.colors.text }]}>{Math.round(stats.oneRepMax)}</Text>
              <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>{t("workout.estOneRM")}</Text>
            </View>
          </View>

          {/* Volume Comparison */}
          {stats.hasPrevious && (
            <View
              style={[
                styles.comparisonContainer,
                {
                  backgroundColor: stats.volumeChange >= 0 ? theme.colors.success + "20" : theme.colors.error + "20",
                },
              ]}
            >
              <Icon
                name={stats.volumeChange >= 0 ? "trending-up" : "trending-down"}
                size={16}
                color={stats.volumeChange >= 0 ? theme.colors.success : theme.colors.error}
                style={styles.comparisonIcon}
              />
              <Text
                style={[
                  styles.comparisonText,
                  {
                    color: stats.volumeChange >= 0 ? theme.colors.success : theme.colors.error,
                  },
                ]}
              >
                {stats.volumeChange >= 0 ? "+" : ""}
                {Math.round(stats.volumePercentage)}% {t("workout.volumeVsPrevious")}
              </Text>
            </View>
          )}

          {/* Sets Table */}
          <View style={styles.setsContainer}>
            <View style={[styles.setRow, styles.setHeader]}>
              <Text style={[styles.setHeaderText, { color: theme.colors.textSecondary }]}>{t("workout.set")}</Text>
              <Text style={[styles.setHeaderText, { color: theme.colors.textSecondary }]}>{t("workout.weight")}</Text>
              <Text style={[styles.setHeaderText, { color: theme.colors.textSecondary }]}>{t("workout.reps")}</Text>
              {exercise.sets.some((set) => set.rpe !== null && set.rpe !== undefined) && (
                <Text style={[styles.setHeaderText, { color: theme.colors.textSecondary }]}>{t("workout.rpe")}</Text>
              )}
            </View>

            {exercise.sets.map((set, index) => (
              <View key={index} style={[styles.setRow, { borderBottomColor: theme.colors.border }]}>
                <Text style={[styles.setCell, { color: theme.colors.text }]}>{index + 1}</Text>
                <Text style={[styles.setCell, { color: theme.colors.text }]}>{set.weight || 0} kg</Text>
                <Text style={[styles.setCell, { color: theme.colors.text }]}>{set.reps || 0}</Text>
                {exercise.sets.some((set) => set.rpe !== null && set.rpe !== undefined) && (
                  <Text style={[styles.setCell, { color: theme.colors.text }]}>{set.rpe || "-"}</Text>
                )}
              </View>
            ))}
          </View>

          {/* Notes */}
          {exercise.notes && (
            <View style={styles.notesContainer}>
              <Text style={[styles.notesLabel, { color: theme.colors.textSecondary }]}>{t("workout.notes")}:</Text>
              <Text style={[styles.notesText, { color: theme.colors.text }]}>{exercise.notes}</Text>
            </View>
          )}
        </View>
      )}
    </Card>
  )
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
  },
  exerciseInfo: {
    flex: 1,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: "500",
  },
  exerciseCategory: {
    fontSize: 12,
    marginTop: 2,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  volumeText: {
    fontSize: 14,
    marginRight: 10,
  },
  content: {
    padding: 15,
    paddingTop: 0,
  },
  statsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 15,
    borderRadius: 8,
    overflow: "hidden",
  },
  statItem: {
    width: "25%",
    padding: 10,
    alignItems: "center",
  },
  statValue: {
    fontSize: 18,
    fontWeight: "bold",
  },
  statLabel: {
    fontSize: 12,
    marginTop: 2,
  },
  comparisonContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
  },
  comparisonIcon: {
    marginRight: 8,
  },
  comparisonText: {
    fontSize: 14,
    fontWeight: "500",
  },
  setsContainer: {
    marginBottom: 15,
  },
  setRow: {
    flexDirection: "row",
    paddingVertical: 8,
    borderBottomWidth: 1,
  },
  setHeader: {
    borderBottomWidth: 0,
    marginBottom: 5,
  },
  setHeaderText: {
    fontSize: 12,
    fontWeight: "500",
    flex: 1,
    textAlign: "center",
  },
  setCell: {
    fontSize: 14,
    flex: 1,
    textAlign: "center",
  },
  notesContainer: {
    marginTop: 10,
  },
  notesLabel: {
    fontSize: 14,
    marginBottom: 5,
  },
  notesText: {
    fontSize: 14,
    lineHeight: 20,
  },
})

