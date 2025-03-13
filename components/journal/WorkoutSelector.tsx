import type React from "react"
import { View, Text, StyleSheet, TouchableOpacity } from "react-native"
import { useTranslation } from "react-i18next"
import { useTheme } from "../../hooks/useTheme"
import { Icon } from "../ui/Icon"
import type { CompletedWorkout } from "../../types/workout"
import { formatTime } from "../../utils/timeUtils"

interface WorkoutSelectorProps {
  workouts: CompletedWorkout[]
  selectedWorkoutIds: string[]
  onToggleWorkout: (workoutId: string) => void
  style?: object
}

export const WorkoutSelector: React.FC<WorkoutSelectorProps> = ({
  workouts,
  selectedWorkoutIds,
  onToggleWorkout,
  style,
}) => {
  const { t } = useTranslation()
  const { theme } = useTheme()

  return (
    <View style={[styles.container, style]}>
      {workouts.map((workout) => (
        <TouchableOpacity
          key={workout.id}
          onPress={() => onToggleWorkout(workout.id)}
          style={[
            styles.workoutItem,
            {
              backgroundColor: selectedWorkoutIds.includes(workout.id)
                ? theme.colors.primaryLight
                : theme.colors.backgroundLight,
            },
          ]}
        >
          <View style={styles.workoutInfo}>
            <Text
              style={[
                styles.workoutName,
                {
                  color: selectedWorkoutIds.includes(workout.id) ? theme.colors.primary : theme.colors.text,
                },
              ]}
            >
              {workout.name}
            </Text>

            <View style={styles.workoutDetails}>
              <View style={styles.detailItem}>
                <Icon
                  name="activity"
                  size={14}
                  color={selectedWorkoutIds.includes(workout.id) ? theme.colors.primary : theme.colors.textSecondary}
                />
                <Text
                  style={[
                    styles.detailText,
                    {
                      color: selectedWorkoutIds.includes(workout.id)
                        ? theme.colors.primary
                        : theme.colors.textSecondary,
                    },
                  ]}
                >
                  {workout.exercises.length} {t("workout.exercises")}
                </Text>
              </View>

              <View style={styles.detailItem}>
                <Icon
                  name="clock"
                  size={14}
                  color={selectedWorkoutIds.includes(workout.id) ? theme.colors.primary : theme.colors.textSecondary}
                />
                <Text
                  style={[
                    styles.detailText,
                    {
                      color: selectedWorkoutIds.includes(workout.id)
                        ? theme.colors.primary
                        : theme.colors.textSecondary,
                    },
                  ]}
                >
                  {formatTime(workout.duration || 0)}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.checkboxContainer}>
            {selectedWorkoutIds.includes(workout.id) ? (
              <Icon name="check-circle" size={24} color={theme.colors.primary} />
            ) : (
              <View style={[styles.checkbox, { borderColor: theme.colors.border }]} />
            )}
          </View>
        </TouchableOpacity>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  workoutItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  workoutInfo: {
    flex: 1,
  },
  workoutName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  workoutDetails: {
    flexDirection: "row",
    alignItems: "center",
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 15,
  },
  detailText: {
    fontSize: 12,
    marginLeft: 5,
  },
  checkboxContainer: {
    marginLeft: 10,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
  },
})

