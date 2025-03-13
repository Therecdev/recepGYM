import { View, Text, StyleSheet, TouchableOpacity } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import type { DiscoveryRoutine } from "../../types/importExport"

interface RoutineCardProps {
  routine: DiscoveryRoutine
  onPress: () => void
}

export default function RoutineCard({ routine, onPress }: RoutineCardProps) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>{routine.name}</Text>
          <View style={styles.rating}>
            <Ionicons name="star" size={14} color="#F6E05E" />
            <Text style={styles.ratingText}>{routine.rating.toFixed(1)}</Text>
          </View>
        </View>

        <Text style={styles.author}>By {routine.author.name}</Text>

        <Text style={styles.description} numberOfLines={2}>
          {routine.description}
        </Text>

        <View style={styles.stats}>
          <View style={styles.statItem}>
            <Ionicons name="calendar-outline" size={14} color="#718096" />
            <Text style={styles.statText}>{routine.estimatedWeeks} weeks</Text>
          </View>

          <View style={styles.statItem}>
            <Ionicons name="fitness-outline" size={14} color="#718096" />
            <Text style={styles.statText}>{routine.estimatedSessionsPerWeek} sessions/week</Text>
          </View>

          <View style={styles.statItem}>
            <Ionicons name="trending-up-outline" size={14} color="#718096" />
            <Text style={styles.statText}>{routine.difficulty}</Text>
          </View>
        </View>

        <View style={styles.tagsContainer}>
          {routine.tags.slice(0, 3).map((tag) => (
            <View key={tag} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    marginBottom: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2D3748",
    flex: 1,
  },
  rating: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFAF0",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  ratingText: {
    marginLeft: 4,
    fontSize: 12,
    fontWeight: "600",
    color: "#744210",
  },
  author: {
    fontSize: 12,
    color: "#718096",
    marginBottom: 8,
  },
  description: {
    fontSize: 13,
    color: "#4A5568",
    lineHeight: 18,
    marginBottom: 12,
  },
  stats: {
    flexDirection: "row",
    marginBottom: 12,
    flexWrap: "wrap",
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
    marginBottom: 4,
  },
  statText: {
    marginLeft: 4,
    fontSize: 12,
    color: "#718096",
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  tag: {
    backgroundColor: "#EBF8FF",
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 6,
    marginBottom: 4,
  },
  tagText: {
    fontSize: 10,
    color: "#3182CE",
    fontWeight: "600",
  },
})

