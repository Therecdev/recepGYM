import type React from "react"
import { View, Text, StyleSheet } from "react-native"
import { useTheme } from "../../hooks/useTheme"
import type { SleepData } from "../../types/health"
import { formatDuration, formatTimeOnly } from "../../utils/timeUtils"

interface SleepSummaryProps {
  sleepData: SleepData
  style?: any
}

export const SleepSummary: React.FC<SleepSummaryProps> = ({ sleepData, style }) => {
  const { theme } = useTheme()

  // Calculate percentages for the sleep phases
  const totalDuration = sleepData.duration
  const deepSleepPercentage = (sleepData.deepSleepDuration / totalDuration) * 100
  const remSleepPercentage = (sleepData.remSleepDuration / totalDuration) * 100
  const lightSleepPercentage = (sleepData.lightSleepDuration / totalDuration) * 100
  const awakePercentage = (sleepData.awakeTime / totalDuration) * 100

  return (
    <View style={[styles.container, style]}>
      <View style={styles.timeInfo}>
        <View style={styles.timeColumn}>
          <Text style={[styles.timeLabel, { color: theme.colors.textSecondary }]}>Bedtime</Text>
          <Text style={[styles.timeValue, { color: theme.colors.text }]}>{formatTimeOnly(sleepData.startTime)}</Text>
        </View>

        <View style={styles.durationColumn}>
          <View style={[styles.durationBar, { backgroundColor: theme.colors.border }]}>
            <View style={[styles.durationLine, { backgroundColor: theme.colors.border }]} />
          </View>
          <Text style={[styles.durationText, { color: theme.colors.text }]}>{formatDuration(sleepData.duration)}</Text>
        </View>

        <View style={styles.timeColumn}>
          <Text style={[styles.timeLabel, { color: theme.colors.textSecondary }]}>Wake up</Text>
          <Text style={[styles.timeValue, { color: theme.colors.text }]}>{formatTimeOnly(sleepData.endTime)}</Text>
        </View>
      </View>

      <View style={styles.phasesContainer}>
        <View style={styles.phasesBar}>
          <View
            style={[
              styles.phaseSegment,
              {
                backgroundColor: theme.colors.primary,
                width: `${deepSleepPercentage}%`,
              },
            ]}
          />
          <View
            style={[
              styles.phaseSegment,
              {
                backgroundColor: "purple",
                width: `${remSleepPercentage}%`,
              },
            ]}
          />
          <View
            style={[
              styles.phaseSegment,
              {
                backgroundColor: theme.colors.info,
                width: `${lightSleepPercentage}%`,
              },
            ]}
          />
          <View
            style={[
              styles.phaseSegment,
              {
                backgroundColor: theme.colors.warning,
                width: `${awakePercentage}%`,
              },
            ]}
          />
        </View>

        <View style={styles.phaseLabels}>
          <View style={styles.phaseLabel}>
            <View style={[styles.phaseDot, { backgroundColor: theme.colors.primary }]} />
            <Text style={[styles.phaseLabelText, { color: theme.colors.textSecondary }]}>
              Deep ({Math.round(deepSleepPercentage)}%)
            </Text>
          </View>

          <View style={styles.phaseLabel}>
            <View style={[styles.phaseDot, { backgroundColor: "purple" }]} />
            <Text style={[styles.phaseLabelText, { color: theme.colors.textSecondary }]}>
              REM ({Math.round(remSleepPercentage)}%)
            </Text>
          </View>

          <View style={styles.phaseLabel}>
            <View style={[styles.phaseDot, { backgroundColor: theme.colors.info }]} />
            <Text style={[styles.phaseLabelText, { color: theme.colors.textSecondary }]}>
              Light ({Math.round(lightSleepPercentage)}%)
            </Text>
          </View>

          <View style={styles.phaseLabel}>
            <View style={[styles.phaseDot, { backgroundColor: theme.colors.warning }]} />
            <Text style={[styles.phaseLabelText, { color: theme.colors.textSecondary }]}>
              Awake ({Math.round(awakePercentage)}%)
            </Text>
          </View>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  timeInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  timeColumn: {
    alignItems: "center",
    width: "25%",
  },
  timeLabel: {
    fontSize: 12,
    marginBottom: 5,
  },
  timeValue: {
    fontSize: 16,
    fontWeight: "bold",
  },
  durationColumn: {
    flex: 1,
    alignItems: "center",
  },
  durationBar: {
    position: "relative",
    width: "100%",
    height: 4,
    borderRadius: 2,
    marginBottom: 8,
  },
  durationLine: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 1,
  },
  durationText: {
    fontSize: 14,
  },
  phasesContainer: {
    width: "100%",
  },
  phasesBar: {
    flexDirection: "row",
    height: 12,
    borderRadius: 6,
    overflow: "hidden",
    marginBottom: 10,
  },
  phaseSegment: {
    height: "100%",
  },
  phaseLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
  },
  phaseLabel: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 10,
    marginBottom: 5,
  },
  phaseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 5,
  },
  phaseLabelText: {
    fontSize: 12,
  },
})

