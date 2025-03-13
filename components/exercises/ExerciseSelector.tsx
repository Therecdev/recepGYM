"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Modal, ActivityIndicator } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useTranslation } from "react-i18next"
import { useTheme } from "../../hooks/useTheme"
import exerciseService from "../../services/exerciseService"
import type { Exercise, ExerciseFilter, MuscleGroup } from "../../types/exercise"

interface ExerciseSelectorProps {
  isVisible: boolean
  onClose: () => void
  onSelectExercise: (exercise: Exercise) => void
  initialFilter?: ExerciseFilter
  excludeExerciseIds?: string[]
  title?: string
}

const ExerciseSelector: React.FC<ExerciseSelectorProps> = ({
  isVisible,
  onClose,
  onSelectExercise,
  initialFilter = {},
  excludeExerciseIds = [],
  title,
}) => {
  const { t } = useTranslation()
  const { colors } = useTheme()

  const [exercises, setExercises] = useState<Exercise[]>([])
  const [filteredExercises, setFilteredExercises] = useState<Exercise[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [showFilters, setShowFilters] = useState(false)

  const [filter, setFilter] = useState<ExerciseFilter>(initialFilter)

  useEffect(() => {
    if (isVisible) {
      loadExercises()
    }
  }, [isVisible])

  useEffect(() => {
    applyFilters()
  }, [exercises, filter, searchQuery, excludeExerciseIds])

  const loadExercises = async () => {
    setLoading(true)
    try {
      const allExercises = await exerciseService.getAllExercises()
      setExercises(allExercises)
    } catch (error) {
      console.error("Error loading exercises:", error)
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = () => {
    if (exercises.length === 0) return

    let filtered = [...exercises]

    // Apply excludeExerciseIds filter
    if (excludeExerciseIds.length > 0) {
      filtered = filtered.filter((exercise) => !excludeExerciseIds.includes(exercise.id))
    }

    // Apply search filter
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase().trim()
      filtered = filtered.filter(
        (exercise) =>
          exercise.name.toLowerCase().includes(query) ||
          exercise.description.toLowerCase().includes(query) ||
          exercise.alternativeNames?.some((name) => name.toLowerCase().includes(query)),
      )
    }

    // Apply muscle group filter
    if (filter.muscleGroups && filter.muscleGroups.length > 0) {
      filtered = filtered.filter((exercise) =>
        filter.muscleGroups!.some(
          (muscleGroup) =>
            exercise.primaryMuscles.includes(muscleGroup) || exercise.secondaryMuscles.includes(muscleGroup),
        ),
      )
    }

    // Apply equipment filter
    if (filter.equipment && filter.equipment.length > 0) {
      filtered = filtered.filter((exercise) => filter.equipment!.some((eq) => exercise.equipment.includes(eq)))
    }

    // Apply category filter
    if (filter.categories && filter.categories.length > 0) {
      filtered = filtered.filter((exercise) => filter.categories!.includes(exercise.category))
    }

    // Apply favorites filter
    if (filter.favorites) {
      filtered = filtered.filter((exercise) => exercise.isFavorite)
    }

    // Apply custom filter
    if (filter.custom) {
      filtered = filtered.filter((exercise) => exercise.isCustom)
    }

    setFilteredExercises(filtered)
  }

  const toggleMuscleGroupFilter = (muscleGroup: MuscleGroup) => {
    setFilter((prevFilter) => {
      const muscleGroups = prevFilter.muscleGroups || []

      if (muscleGroups.includes(muscleGroup)) {
        return {
          ...prevFilter,
          muscleGroups: muscleGroups.filter((mg) => mg !== muscleGroup),
        }
      } else {
        return {
          ...prevFilter,
          muscleGroups: [...muscleGroups, muscleGroup],
        }
      }
    })
  }

  const resetFilters = () => {
    setFilter({})
    setSearchQuery("")
  }

  const handleSelectExercise = (exercise: Exercise) => {
    onSelectExercise(exercise)
    onClose()
  }

  const renderExerciseItem = ({ item }: { item: Exercise }) => (
    <TouchableOpacity
      style={[styles.exerciseItem, { backgroundColor: colors.card }]}
      onPress={() => handleSelectExercise(item)}
    >
      <View style={styles.exerciseContent}>
        <Text style={[styles.exerciseName, { color: colors.text }]}>{item.name}</Text>
        <Text style={[styles.exerciseDescription, { color: colors.textSecondary }]} numberOfLines={2}>
          {item.description}
        </Text>

        <View style={styles.tagsContainer}>
          {item.primaryMuscles.slice(0, 3).map((muscle, index) => (
            <View key={index} style={[styles.muscleTag, { backgroundColor: colors.primary }]}>
              <Text style={[styles.tagText, { color: colors.onPrimary }]}>{t(`muscleGroups.${muscle}`)}</Text>
            </View>
          ))}

          {item.equipment.slice(0, 2).map((eq, index) => (
            <View key={index} style={[styles.equipmentTag, { backgroundColor: colors.secondary }]}>
              <Text style={[styles.tagText, { color: colors.onSecondary }]}>{t(`equipment.${eq}`)}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.exerciseActions}>
        {item.isFavorite && <Ionicons name="star" size={16} color={colors.primary} style={styles.favoriteIcon} />}
        <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
      </View>
    </TouchableOpacity>
  )

  const renderFilterSection = () => (
    <View style={[styles.filterSection, { backgroundColor: colors.background }]}>
      <View style={styles.filterHeader}>
        <Text style={[styles.filterTitle, { color: colors.text }]}>{t("exercises.quickFilters")}</Text>
        <TouchableOpacity onPress={resetFilters}>
          <Text style={[styles.resetButton, { color: colors.primary }]}>{t("common.reset")}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.muscleGroupFilters}>
        <Text style={[styles.filterSubtitle, { color: colors.text }]}>{t("exercises.muscleGroups")}</Text>
        <View style={styles.filterTags}>
          {["chest", "back", "shoulders", "biceps", "triceps", "quadriceps", "hamstrings", "abs"].map((muscle) => (
            <TouchableOpacity
              key={muscle}
              style={[
                styles.filterTag,
                filter.muscleGroups?.includes(muscle as MuscleGroup)
                  ? { backgroundColor: colors.primary }
                  : { backgroundColor: colors.card },
              ]}
              onPress={() => toggleMuscleGroupFilter(muscle as MuscleGroup)}
            >
              <Text
                style={[
                  styles.filterTagText,
                  filter.muscleGroups?.includes(muscle as MuscleGroup)
                    ? { color: colors.onPrimary }
                    : { color: colors.text },
                ]}
              >
                {t(`muscleGroups.${muscle}`)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.favoriteFilter}>
        <Text style={[styles.filterSubtitle, { color: colors.text }]}>{t("exercises.showOnlyFavorites")}</Text>
        <TouchableOpacity
          style={[
            styles.favoriteFilterButton,
            filter.favorites ? { backgroundColor: colors.primary } : { backgroundColor: colors.card },
          ]}
          onPress={() => setFilter((prev) => ({ ...prev, favorites: !prev.favorites }))}
        >
          <Ionicons
            name={filter.favorites ? "star" : "star-outline"}
            size={16}
            color={filter.favorites ? colors.onPrimary : colors.text}
          />
          <Text
            style={[styles.favoriteFilterText, filter.favorites ? { color: colors.onPrimary } : { color: colors.text }]}
          >
            {t("exercises.favorites")}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  )

  return (
    <Modal visible={isVisible} animationType="slide" transparent={false} onRequestClose={onClose}>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.title, { color: colors.text }]}>{title || t("exercises.selectExercise")}</Text>
          <View style={styles.placeholder} />
        </View>

        <View style={styles.searchContainer}>
          <View style={[styles.searchInputContainer, { backgroundColor: colors.card }]}>
            <Ionicons name="search" size={20} color={colors.textSecondary} style={styles.searchIcon} />
            <TextInput
              style={[styles.searchInput, { color: colors.text }]}
              placeholder={t("exercises.searchPlaceholder")}
              placeholderTextColor={colors.textSecondary}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery("")}>
                <Ionicons name="close-circle" size={20} color={colors.textSecondary} />
              </TouchableOpacity>
            )}
          </View>

          <TouchableOpacity
            style={[styles.filterButton, { backgroundColor: colors.card }]}
            onPress={() => setShowFilters(!showFilters)}
          >
            <Ionicons
              name={showFilters ? "options" : "options-outline"}
              size={20}
              color={showFilters ? colors.primary : colors.textSecondary}
            />
          </TouchableOpacity>
        </View>

        {showFilters && renderFilterSection()}

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : (
          <>
            <Text style={[styles.resultCount, { color: colors.textSecondary }]}>
              {t("exercises.resultsCount", { count: filteredExercises.length })}
            </Text>

            <FlatList
              data={filteredExercises}
              renderItem={renderExerciseItem}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.exerciseList}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Ionicons name="fitness-outline" size={64} color={colors.textSecondary} />
                  <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                    {t("exercises.noExercisesFound")}
                  </Text>
                </View>
              }
            />
          </>
        )}
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  closeButton: {
    padding: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  placeholder: {
    width: 32,
  },
  searchContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 8,
    paddingHorizontal: 12,
    marginRight: 8,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
  },
  filterButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  filterSection: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  filterHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  resetButton: {
    fontSize: 14,
  },
  filterSubtitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 8,
  },
  muscleGroupFilters: {
    marginBottom: 12,
  },
  filterTags: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  filterTag: {
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
  },
  filterTagText: {
    fontSize: 12,
  },
  favoriteFilter: {
    marginBottom: 8,
  },
  favoriteFilterButton: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignSelf: "flex-start",
  },
  favoriteFilterText: {
    fontSize: 12,
    marginLeft: 4,
  },
  resultCount: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontSize: 14,
  },
  exerciseList: {
    padding: 16,
  },
  exerciseItem: {
    flexDirection: "row",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  exerciseContent: {
    flex: 1,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  exerciseDescription: {
    fontSize: 14,
    marginBottom: 8,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
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
  },
  exerciseActions: {
    justifyContent: "center",
    alignItems: "center",
    paddingLeft: 8,
  },
  favoriteIcon: {
    marginBottom: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
  },
  emptyText: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 16,
  },
})

export default ExerciseSelector

