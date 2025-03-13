import type React from "react"
import { View, Text, StyleSheet, TouchableOpacity } from "react-native"
import { useTranslation } from "react-i18next"
import { useTheme } from "../../hooks/useTheme"
import { Card } from "../ui/Card"
import { Icon } from "../ui/Icon"
import type { RecoveryStatus } from "../../types/health"

interface PersonalizedWorkoutRecommendationsProps {
  recoveryStatus: RecoveryStatus
  onSelectWorkout?: (type: string) => void
  style?: any
}

export const PersonalizedWorkoutRecommendations: React.FC<PersonalizedWorkoutRecommendationsProps> = ({
  recoveryStatus,
  onSelectWorkout,
  style,
}) => {
  const { t } = useTranslation()
  const { theme } = useTheme()

  // Get recommended workout types based on recovery status
  const getRecommendedWorkouts = () => {
    const { status } = recoveryStatus

    if (status === "poor") {
      return [
        {
          type: "mobility",
          title: t("workout.types.mobility"),
          description: t("workout.recommendations.mobilityDesc"),
          icon: "move",
          color: theme.colors.info,
        },
        {
          type: "light_cardio",
          title: t("workout.types.lightCardio"),
          description: t("workout.recommendations.lightCardioDesc"),
          icon: "heart",
          color: theme.colors.success,
        },
        {
          type: "recovery",
          title: t("workout.types.recovery"),
          description: t("workout.recommendations.recoveryDesc"),
          icon: "refresh-cw",
          color: theme.colors.primary,
        },
      ]
    } else if (status === "fair") {
      return [
        {
          type: "moderate_strength",
          title: t("workout.types.moderateStrength"),
          description: t("workout.recommendations.moderateStrengthDesc"),
          icon: "activity",
          color: theme.colors.warning,
        },
        {
          type: "cardio",
          title: t("workout.types.cardio"),
          description: t("workout.recommendations.cardioDesc"),
          icon: "heart",
          color: theme.colors.success,
        },
        {
          type: "mobility",
          title: t("workout.types.mobility"),
          description: t("workout.recommendations.mobilityDesc"),
          icon: "move",
          color: theme.colors.info,
        },
      ]
    } else if (status === "good") {
      return [
        {
          type: "strength",
          title: t("workout.types.strength"),
          description: t("workout.recommendations.strengthDesc"),
          icon: "trending-up",
          color: theme.colors.primary,
        },
        {
          type: "hiit",
          title: t("workout.types.hiit"),
          description: t("workout.recommendations.hiitDesc"),
          icon: "zap",
          color: theme.colors.warning,
        },
        {
          type: "cardio",
          title: t("workout.types.cardio"),
          description: t("workout.recommendations.cardioDesc"),
          icon: "heart",
          color: theme.colors.success,
        },
      ]
    } else {
      // excellent
      return [
        {
          type: "high_intensity",
          title: t("workout.types.highIntensity"),
          description: t("workout.recommendations.highIntensityDesc"),
          icon: "zap",
          color: theme.colors.error,
        },
        {
          type: "strength",
          title: t("workout.types.strength"),
          description: t("workout.recommendations.strengthDesc"),
          icon: "trending-up",
          color: theme.colors.primary,
        },
        {
          type: "hiit",
          title: t("workout.types.hiit"),
          description: t("workout.recommendations.hiitDesc"),
          icon: "zap",
          color: theme.colors.warning,
        },
      ]
    }
  }

  const recommendedWorkouts = getRecommendedWorkouts()

  return (
    <Card style={[styles.container, style]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.text }]}>{t("workout.recommendations.title")}</Text>

        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(recoveryStatus.status, theme) }]}>
          <Text style={styles.statusText}>{t(`wellness.recovery.status.${recoveryStatus.status}`)}</Text>
        </View>
      </View>

      <Text style={[styles.description, { color: theme.colors.textSecondary }]}>{recoveryStatus.recommendation}</Text>

      <View style={styles.workoutsContainer}>
        {recommendedWorkouts.map((workout, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => onSelectWorkout && onSelectWorkout(workout.type)}
            style={[styles.workoutItem, { borderColor: theme.colors.border }]}
          >
            <View style={[styles.workoutIconContainer, { backgroundColor: workout.color + "20" }]}>
              <Icon name={workout.icon} size={20} color={workout.color} />
            </View>

            <View style={styles.workoutContent}>
              <Text style={[styles.workoutTitle, { color: theme.colors.text }]}>{workout.title}</Text>

              <Text style={[styles.workoutDescription, { color: theme.colors.textSecondary }]}>
                {workout.description}
              </Text>
            </View>

            <Icon name="chevron-right" size={20} color={theme.colors.textSecondary} />
          </TouchableOpacity>
        ))}
      </View>
    </Card>
  )
}

// Helper function to get color based on recovery status
const getStatusColor = (status: string, theme: any) => {
  switch (status) {
    case "poor":
      return theme.colors.error
    case "fair":
      return theme.colors.warning
    case "good":
      return theme.colors.success
    case "excellent":
      return theme.colors.primary
    default:
      return theme.colors.primary
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 15,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  statusText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  description: {
    fontSize: 14,
    marginBottom: 20,
  },
  workoutsContainer: {
    gap: 15,
  },
  workoutItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderWidth: 1,
    borderRadius: 10,
  },
  workoutIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  workoutContent: {
    flex: 1,
  },
  workoutTitle: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 5,
  },
  workoutDescription: {
    fontSize: 12,
  },
})

