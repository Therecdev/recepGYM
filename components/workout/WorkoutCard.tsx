import type React from "react"
import { View, Text, StyleSheet } from "react-native"
import { useTranslation } from "react-i18next"
import { useTheme } from "../../hooks/useTheme"
import { Icon } from "../ui/Icon"
import type { Workout } from "../../types/workout"

interface WorkoutCardProps {
  workout: Workout
  compact?: boolean
  style?: any
}

export const WorkoutCard: React.FC<WorkoutCardProps> = ({ workout, compact = false, style }) => {
  const { t } = useTranslation()
  const { theme } = useTheme()

  // Get workout type icon
  const getWorkoutTypeIcon = () => {
    const type = workout.type?.toLowerCase() || "strength"

    switch (type) {
      case "cardio":
        return "heart"
      case "hiit":
        return "zap"
      case "mobility":
        return "move"
      case "recovery":
        return "refresh-cw"
      default:
        return "trending-up" // strength
    }
  }

  // Get workout type color
  const getWorkoutTypeColor = () => {
    const type = workout.type?.toLowerCase() || "strength"

    switch (type) {
      case "cardio":
        return theme.colors.success
      case "hiit":
        return theme.colors.warning
      case "mobility":
        return theme.colors.info
      case "recovery":
        return theme.colors.primary
      default:
        return theme.colors.primary // strength
    }
  }

  const typeIcon = getWorkoutTypeIcon()
  const typeColor = getWorkoutTypeColor()

  // Calculate estimated duration
  const calculateEstimatedDuration = () => {
    // Simple estimation: 3 minutes per set + 1 minute rest between exercises
    const totalSets = workout.exercises.reduce((sum, exercise) => sum + exercise.sets.length, 0)
    const totalExercises = workout.exercises.length

    return totalSets * 3 + (totalExercises - 1)
  }

  const estimatedDuration = workout.duration || calculateEstimatedDuration()

  return (
    <View style={[styles.container, style]}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <View style={[styles.typeIconContainer, { backgroundColor: typeColor + "20" }]}>
            <Icon name={typeIcon} size={16} color={typeColor} />
          </View>

          <Text style={[styles.title, { color: theme.colors.text }]}>{workout.name}</Text>
        </View>

        {workout.difficulty && (
          <View style={styles.difficultyContainer}>
            {Array.from({ length: 5 }).map((_, index) => (
              <Icon
                key={index}
                name="circle"
                size={8}
                color={index < workout.difficulty! ? theme.colors.primary : theme.colors.border}
                style={styles.difficultyDot}
              />
            ))}
          </View>
        )}
      </View>

      {!compact && (
        <>
          {workout.description && (
            <Text style={[styles.description, { color: theme.colors.textSecondary }]}>{workout.description}</Text>
          )}

          <View style={styles.statsContainer}>
            <View style={styles.stat}>
              <Icon name="activity" size={14} color={theme.colors.textSecondary} style={styles.statIcon} />
              <Text style={[styles.statText, { color: theme.colors.textSecondary }]}>
                {workout.exercises.length} {t("workout.exercises")}
              </Text>
            </View>

            <View style={styles.stat}>
              <Icon name="clock" size={14} color={theme.colors.textSecondary} style={styles.statIcon} />
              <Text style={[styles.statText, { color: theme.colors.textSecondary }]}>
                ~{estimatedDuration} {t("workout.minutes")}
              </Text>
            </View>

            {workout.type && (
              <View style={styles.stat}>
                <Icon name={typeIcon} size={14} color={typeColor} style={styles.statIcon} />
                <Text style={[styles.statText, { color: theme.colors.textSecondary }]}>
                  {t(`workout.types.${workout.type.toLowerCase()}`)}
                </Text>
              </View>
            )}
          </View>

          {workout.exercises.length > 0 && (
            <View style={styles.exercisesContainer}>
              {workout.exercises.slice(0, 3).map((exercise, index) => (
                <View
                  key={index}
                  style={[
                    styles.exerciseItem,
                    index < workout.exercises.slice(0, 3).length - 1 && {
                      borderBottomWidth: 1,
                      borderBottomColor: theme.colors.border,
                    },
                  ]}
                >
                  <Text style={[styles.exerciseName, { color: theme.colors.text }]}>{exercise.name}</Text>

                  <Text style={[styles.exerciseSets, { color: theme.colors.textSecondary }]}>
                    {exercise.sets.length} {t("workout.sets")}
                  </Text>
                </View>
              ))}

              {workout.exercises.length > 3 && (
                <Text style={[styles.moreExercises, { color: theme.colors.textSecondary }]}>
                  +{workout.exercises.length - 3} {t("workout.moreExercises")}
                </Text>
              )}
            </View>
          )}
        </>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  typeIconContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
  },
  difficultyContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  difficultyDot: {
    marginLeft: 3,
  },
  description: {
    fontSize: 14,
    marginBottom: 15,
  },
  statsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 15,
  },
  stat: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 15,
    marginBottom: 5,
  },
  statIcon: {
    marginRight: 5,
  },
  statText: {
    fontSize: 12,
  },
  exercisesContainer: {
    borderRadius: 8,
    overflow: "hidden",
  },
  exerciseItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  exerciseName: {
    fontSize: 14,
  },
  exerciseSets: {
    fontSize: 12,
  },
  moreExercises: {
    fontSize: 12,
    textAlign: "center",
    paddingVertical: 8,
  },
})

