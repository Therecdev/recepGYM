import type React from "react"
import { View, Text, StyleSheet, TouchableOpacity } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useTranslation } from "react-i18next"
import { useTheme } from "../../hooks/useTheme"
import type { Exercise } from "../../types/exercise"

interface ExerciseCardProps {
  exercise: Exercise
  onPress?: () => void
  onFavoriteToggle?: () => void
  showFavoriteButton?: boolean
  compact?: boolean
}

const ExerciseCard: React.FC<ExerciseCardProps> = ({
  exercise,
  onPress,
  onFavoriteToggle,
  showFavoriteButton = true,
  compact = false,
}) => {
  const { t } = useTranslation()
  const { colors } = useTheme()

  const handleFavoritePress = (e: any) => {
    e.stopPropagation()
    if (onFavoriteToggle) {
      onFavoriteToggle()
    }
  }

  if (compact) {
    return (
      <TouchableOpacity
        style={[styles.compactContainer, { backgroundColor: colors.card }]}
        onPress={onPress}
        activeOpacity={0.7}
      >
        <View style={styles.compactContent}>
          <Text style={[styles.compactName, { color: colors.text }]} numberOfLines={1}>
            {exercise.name}
          </Text>

          <View style={styles.compactTags}>
            {exercise.primaryMuscles.slice(0, 1).map((muscle, index) => (
              <View key={index} style={[styles.compactTag, { backgroundColor: colors.primary }]}>
                <Text style={[styles.compactTagText, { color: colors.onPrimary }]}>{t(`muscleGroups.${muscle}`)}</Text>
              </View>
            ))}
          </View>
        </View>

        {showFavoriteButton && (
          <TouchableOpacity style={styles.compactFavoriteButton} onPress={handleFavoritePress}>
            <Ionicons
              name={exercise.isFavorite ? "star" : "star-outline"}
              size={16}
              color={exercise.isFavorite ? colors.primary : colors.textSecondary}
            />
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    )
  }

  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: colors.card }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <Text style={[styles.name, { color: colors.text }]}>{exercise.name}</Text>

        {showFavoriteButton && (
          <TouchableOpacity style={styles.favoriteButton} onPress={handleFavoritePress}>
            <Ionicons
              name={exercise.isFavorite ? "star" : "star-outline"}
              size={20}
              color={exercise.isFavorite ? colors.primary : colors.textSecondary}
            />
          </TouchableOpacity>
        )}
      </View>

      <Text style={[styles.description, { color: colors.textSecondary }]} numberOfLines={2}>
        {exercise.description}
      </Text>

      <View style={styles.footer}>
        <View style={styles.tags}>
          {exercise.primaryMuscles.slice(0, 2).map((muscle, index) => (
            <View key={index} style={[styles.muscleTag, { backgroundColor: colors.primary }]}>
              <Text style={[styles.tagText, { color: colors.onPrimary }]}>{t(`muscleGroups.${muscle}`)}</Text>
            </View>
          ))}

          {exercise.equipment.slice(0, 1).map((eq, index) => (
            <View key={index} style={[styles.equipmentTag, { backgroundColor: colors.secondary }]}>
              <Text style={[styles.tagText, { color: colors.onSecondary }]}>{t(`equipment.${eq}`)}</Text>
            </View>
          ))}
        </View>

        <View
          style={[
            styles.difficultyBadge,
            {
              backgroundColor:
                exercise.difficulty === "beginner"
                  ? colors.success
                  : exercise.difficulty === "intermediate"
                    ? colors.warning
                    : colors.error,
            },
          ]}
        >
          <Text style={[styles.difficultyText, { color: colors.onPrimary }]}>
            {t(`difficulty.${exercise.difficulty}`)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    flex: 1,
  },
  favoriteButton: {
    padding: 4,
  },
  description: {
    fontSize: 14,
    marginBottom: 12,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  tags: {
    flexDirection: "row",
    flexWrap: "wrap",
    flex: 1,
  },
  muscleTag: {
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 6,
    marginBottom: 4,
  },
  equipmentTag: {
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 6,
    marginBottom: 4,
  },
  tagText: {
    fontSize: 10,
    fontWeight: "bold",
  },
  difficultyBadge: {
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  difficultyText: {
    fontSize: 10,
    fontWeight: "bold",
  },
  compactContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  compactContent: {
    flex: 1,
  },
  compactName: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 4,
  },
  compactTags: {
    flexDirection: "row",
  },
  compactTag: {
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginRight: 4,
  },
  compactTagText: {
    fontSize: 9,
    fontWeight: "bold",
  },
  compactFavoriteButton: {
    padding: 4,
  },
})

export default ExerciseCard

