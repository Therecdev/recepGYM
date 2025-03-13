import { View, Text, StyleSheet, TouchableOpacity } from "react-native"
import { ChevronRight } from "lucide-react-native"
import { useTheme } from "../../styles/ThemeContext"

interface JournalEntry {
  id: string
  date: string
  title: string
  content: string
  tags: string[]
  mood: "great" | "good" | "okay" | "bad"
}

interface JournalEntryCardProps {
  entry: JournalEntry
  onPress: () => void
}

const JournalEntryCard = ({ entry, onPress }: JournalEntryCardProps) => {
  const { colors } = useTheme()

  const styles = StyleSheet.create({
    container: {
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
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
      marginBottom: 8,
    },
    date: {
      fontSize: 14,
      color: colors.textSecondary,
    },
    title: {
      fontSize: 18,
      fontWeight: "bold",
      color: colors.text,
      marginBottom: 8,
    },
    content: {
      fontSize: 14,
      color: colors.text,
      marginBottom: 12,
      lineHeight: 20,
    },
    footer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    tagsContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
    },
    tag: {
      backgroundColor: colors.muted,
      borderRadius: 12,
      paddingHorizontal: 8,
      paddingVertical: 4,
      marginRight: 6,
      marginBottom: 6,
    },
    tagText: {
      fontSize: 12,
      color: colors.textSecondary,
    },
    moodIndicator: {
      width: 12,
      height: 12,
      borderRadius: 6,
      marginLeft: 8,
    },
  })

  // Get mood color
  const getMoodColor = (mood: string) => {
    switch (mood) {
      case "great":
        return colors.success
      case "good":
        return colors.primary
      case "okay":
        return colors.warning
      case "bad":
        return colors.error
      default:
        return colors.textSecondary
    }
  }

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.header}>
        <Text style={styles.date}>{entry.date}</Text>
        <ChevronRight size={18} color={colors.icon} />
      </View>

      <Text style={styles.title}>{entry.title}</Text>
      <Text style={styles.content} numberOfLines={3}>
        {entry.content}
      </Text>

      <View style={styles.footer}>
        <View style={styles.tagsContainer}>
          {entry.tags.slice(0, 2).map((tag, index) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText}>#{tag}</Text>
            </View>
          ))}
          {entry.tags.length > 2 && (
            <View style={styles.tag}>
              <Text style={styles.tagText}>+{entry.tags.length - 2}</Text>
            </View>
          )}
        </View>

        <View style={[styles.moodIndicator, { backgroundColor: getMoodColor(entry.mood) }]} />
      </View>
    </TouchableOpacity>
  )
}

export default JournalEntryCard

