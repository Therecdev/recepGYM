import type React from "react"
import { View, Text, StyleSheet } from "react-native"
import { useTranslation } from "react-i18next"
import { useTheme } from "../../hooks/useTheme"
import { Card } from "../ui/Card"
import { Icon } from "../ui/Icon"
import { getPersonalRecords } from "../../utils/progressionUtils"
import type { WorkoutHistory } from "../../types/workout"
import { formatDate } from "../../utils/dateUtils"

interface PersonalRecordsCardProps {
  exerciseHistory: WorkoutHistory[]
  exerciseId: string
  style?: any
}

export const PersonalRecordsCard: React.FC<PersonalRecordsCardProps> = ({ exerciseHistory, exerciseId, style }) => {
  const { t } = useTranslation()
  const { theme } = useTheme()

  // Get personal records for the exercise
  const personalRecords = getPersonalRecords(exerciseHistory, exerciseId)

  // Filter out records with zero values
  const validRecords = personalRecords.filter((record) => record.weight > 0 || record.reps > 0 || record.volume > 0)

  if (validRecords.length === 0) {
    return null
  }

  return (
    <Card style={[styles.container, style]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.text }]}>{t("progress.personalRecords")}</Text>
        <Icon name="award" size={20} color={theme.colors.warning} />
      </View>

      <View style={styles.recordsContainer}>
        {validRecords.map((record, index) => {
          let recordType = ""
          let recordValue = ""

          if (record.weight > 0) {
            recordType = t("progress.weightRecord")
            recordValue = `${record.weight} ${t("progress.kg")}`
          } else if (record.reps > 0) {
            recordType = t("progress.repsRecord")
            recordValue = `${record.reps} ${t("progress.reps")}`
          } else if (record.volume > 0) {
            recordType = t("progress.volumeRecord")
            recordValue = `${record.volume} ${t("progress.kg")}`
          }

          if (!recordType) return null

          return (
            <View
              key={index}
              style={[
                styles.recordItem,
                index < validRecords.length - 1 && { borderBottomWidth: 1, borderBottomColor: theme.colors.border },
              ]}
            >
              <View style={styles.recordInfo}>
                <Text style={[styles.recordType, { color: theme.colors.text }]}>{recordType}</Text>
                <Text style={[styles.recordDate, { color: theme.colors.textSecondary }]}>
                  {record.date ? formatDate(new Date(record.date)) : ""}
                </Text>
              </View>

              <Text style={[styles.recordValue, { color: theme.colors.primary }]}>{recordValue}</Text>
            </View>
          )
        })}
      </View>
    </Card>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 15,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
  },
  recordsContainer: {
    width: "100%",
  },
  recordItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
  },
  recordInfo: {
    flex: 1,
  },
  recordType: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 2,
  },
  recordDate: {
    fontSize: 12,
  },
  recordValue: {
    fontSize: 16,
    fontWeight: "bold",
  },
})

