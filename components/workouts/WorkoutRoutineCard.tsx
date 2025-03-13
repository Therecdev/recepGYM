import { View, Text, StyleSheet, TouchableOpacity } from "react-native"
import { ChevronRight } from "lucide-react-native"
import { useTheme } from "../../styles/ThemeContext"

interface Exercise {
  name: string
  sets: number
  reps: string
}

interface Day {
  name: string
  exercises: Exercise[]
}

interface Routine {
  id: string
  name: string
  days: Day[]
}

interface WorkoutRoutineCardProps {
  routine: Routine
  onPress: () => void
}

const WorkoutRoutineCard = ({ routine, onPress }: WorkoutRoutineCardProps) => {
  const { colors } = useTheme()

  const styles = StyleSheet.create({
    container: {
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 16,
      marginBottom: 16,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 12,
    },
    title: {
      fontSize: 18,
      fontWeight: "bold",
      color: colors.text,
    },
    dayContainer: {
      marginBottom: 12,
    },
    dayTitle: {
      fontSize: 16,
      fontWeight: "bold",
      color: colors.text,
      marginBottom: 8,
    },
    exerciseList: {
      marginLeft: 8,
    },
    exerciseItem: {
      flexDirection: "row",
      justifyContent: "space-between",
      paddingVertical: 4,
    },
    exerciseName: {
      fontSize: 14,
      color: colors.text,
    },
    exerciseDetail: {
      fontSize: 14,
      color: colors.textSecondary,
    },
  })

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.header}>
        <Text style={styles.title}>{routine.name}</Text>
        <ChevronRight size={20} color={colors.icon} />
      </View>

      {routine.days.map((day, index) => (
        <View key={index} style={styles.dayContainer}>
          <Text style={styles.dayTitle}>{day.name}</Text>
          <View style={styles.exerciseList}>
            {day.exercises.slice(0, 2).map((exercise, exIndex) => (
              <View key={exIndex} style={styles.exerciseItem}>
                <Text style={styles.exerciseName}>{exercise.name}</Text>
                <Text style={styles.exerciseDetail}>
                  {exercise.sets} × {exercise.reps}
                </Text>
              </View>
            ))}
            {day.exercises.length > 2 && (
              <Text style={styles.exerciseDetail}>+{day.exercises.length - 2} more exercises</Text>
            )}
          </View>
        </View>
      ))}
    </TouchableOpacity>
  )
}

export default WorkoutRoutineCard

