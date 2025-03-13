import { View, Text, StyleSheet } from "react-native"
import { useTheme } from "../../styles/ThemeContext"

interface Exercise {
  name: string
  sets: number
  reps: string
}

interface WorkoutSummaryProps {
  workoutName: string
  exercises: Exercise[]
}

const WorkoutSummary = ({ workoutName, exercises }: WorkoutSummaryProps) => {
  const { colors } = useTheme()

  const styles = StyleSheet.create({
    container: {
      width: "100%",
    },
    title: {
      fontSize: 18,
      fontWeight: "bold",
      marginBottom: 8,
      color: colors.text,
    },
    exerciseList: {
      marginTop: 8,
    },
    exerciseItem: {
      flexDirection: "row",
      justifyContent: "space-between",
      paddingVertical: 6,
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
    <View style={styles.container}>
      <Text style={styles.title}>{workoutName}</Text>
      <View style={styles.exerciseList}>
        {exercises.map((exercise, index) => (
          <View key={index} style={styles.exerciseItem}>
            <Text style={styles.exerciseName}>{exercise.name}</Text>
            <Text style={styles.exerciseDetail}>
              {exercise.sets} sets × {exercise.reps}
            </Text>
          </View>
        ))}
      </View>
    </View>
  )
}

export default WorkoutSummary

