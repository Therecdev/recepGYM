"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { View, Text, StyleSheet, AppState } from "react-native"
import { useTranslation } from "react-i18next"
import { useTheme } from "../../hooks/useTheme"
import { Button } from "../ui/Button"
import { Icon } from "../ui/Icon"
import { Card } from "../ui/Card"
import { useWellnessStore } from "../../stores/wellnessStore"
import { formatTime } from "../../utils/timeUtils"

interface EnhancedRestTimerProps {
  initialTime?: number // Rest time in seconds
  onComplete?: () => void
  exerciseIntensity?: "light" | "moderate" | "high"
  previousSetRpe?: number // Rate of Perceived Exertion (1-10)
  onSkip?: () => void
  style?: any
}

export const EnhancedRestTimer: React.FC<EnhancedRestTimerProps> = ({
  initialTime = 90,
  onComplete,
  exerciseIntensity = "moderate",
  previousSetRpe = 7,
  onSkip,
  style,
}) => {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const { recoveryStatus } = useWellnessStore()

  const [timeLeft, setTimeLeft] = useState(initialTime)
  const [isActive, setIsActive] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [tip, setTip] = useState("")

  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const appState = useRef(AppState.currentState)
  const pausedTimeRef = useRef<number | null>(null)

  // Calculate recommended rest time based on recovery status and exercise intensity
  const calculateRecommendedRestTime = () => {
    let baseTime: number

    // Base time depends on exercise intensity
    switch (exerciseIntensity) {
      case "light":
        baseTime = 60
        break
      case "high":
        baseTime = 180
        break
      case "moderate":
      default:
        baseTime = 90
        break
    }

    // Adjust based on RPE
    const rpeAdjustment = (previousSetRpe - 5) * 10 // +/- 10 seconds per RPE point from baseline of 5

    // Adjust based on recovery status
    let recoveryMultiplier = 1.0
    if (recoveryStatus) {
      switch (recoveryStatus.status) {
        case "poor":
          recoveryMultiplier = 1.3
          break
        case "fair":
          recoveryMultiplier = 1.15
          break
        case "good":
          recoveryMultiplier = 1.0
          break
        case "excellent":
          recoveryMultiplier = 0.85
          break
      }
    }

    return Math.round((baseTime + rpeAdjustment) * recoveryMultiplier)
  }

  // Initialize the timer with the recommended rest time
  useEffect(() => {
    const recommendedTime = calculateRecommendedRestTime()
    setTimeLeft(recommendedTime)
    generateTip(recommendedTime)
  }, [recoveryStatus, exerciseIntensity, previousSetRpe])

  // Handle timer functionality
  useEffect(() => {
    if (isActive && !isPaused) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(intervalRef.current!)
            setIsActive(false)
            if (onComplete) onComplete()
            return 0
          }
          return prevTime - 1
        })
      }, 1000)
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isActive, isPaused, onComplete])

  // Handle app state changes (for background timers)
  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (appState.current === "active" && nextAppState.match(/inactive|background/)) {
        // App going to background
        if (isActive && !isPaused) {
          pausedTimeRef.current = Date.now()
        }
      } else if (appState.current.match(/inactive|background/) && nextAppState === "active") {
        // App coming to foreground
        if (isActive && !isPaused && pausedTimeRef.current) {
          const elapsedSeconds = Math.floor((Date.now() - pausedTimeRef.current) / 1000)
          setTimeLeft((prevTime) => {
            const newTime = Math.max(0, prevTime - elapsedSeconds)
            if (newTime === 0 && onComplete) {
              onComplete()
              setIsActive(false)
            }
            return newTime
          })
          pausedTimeRef.current = null
        }
      }

      appState.current = nextAppState
    })

    return () => {
      subscription.remove()
    }
  }, [isActive, isPaused, onComplete])

  // Generate a wellness tip based on recovery status and rest time
  const generateTip = (restTime: number = timeLeft) => {
    const tips: string[] = []

    // Tips based on recovery status
    if (recoveryStatus) {
      if (recoveryStatus.status === "poor") {
        tips.push(t("wellness.tips.poorRecovery"))
        tips.push(t("wellness.tips.hydrate"))
        tips.push(t("wellness.tips.longerRest"))
      } else if (recoveryStatus.status === "fair") {
        tips.push(t("wellness.tips.fairRecovery"))
        tips.push(t("wellness.tips.breathe"))
      } else if (recoveryStatus.status === "good") {
        tips.push(t("wellness.tips.goodRecovery"))
        tips.push(t("wellness.tips.focusForm"))
      } else if (recoveryStatus.status === "excellent") {
        tips.push(t("wellness.tips.excellentRecovery"))
        tips.push(t("wellness.tips.pushHarder"))
      }
    }

    // Tips based on rest time
    if (restTime > 120) {
      tips.push(t("wellness.tips.longRest"))
      tips.push(t("wellness.tips.mobility"))
    } else if (restTime < 60) {
      tips.push(t("wellness.tips.shortRest"))
      tips.push(t("wellness.tips.focusBreathing"))
    }

    // Generic tips
    tips.push(t("wellness.tips.stayHydrated"))
    tips.push(t("wellness.tips.mindfulness"))
    tips.push(t("wellness.tips.visualization"))

    // Select a random tip
    const randomTip = tips[Math.floor(Math.random() * tips.length)]
    setTip(randomTip)
  }

  const handleStart = () => {
    setIsActive(true)
    setIsPaused(false)
  }

  const handlePause = () => {
    setIsPaused(true)
  }

  const handleResume = () => {
    setIsPaused(false)
  }

  const handleReset = () => {
    setTimeLeft(calculateRecommendedRestTime())
    setIsActive(false)
    setIsPaused(false)
    generateTip()
  }

  const handleSkip = () => {
    if (onSkip) onSkip()
  }

  const getTimerColor = () => {
    if (timeLeft <= 10) return theme.colors.error
    if (timeLeft <= 30) return theme.colors.warning
    return theme.colors.primary
  }

  // Calculate progress for the timer circle
  const progress = 1 - timeLeft / calculateRecommendedRestTime()

  return (
    <Card style={[styles.container, style]}>
      <View style={styles.timerContainer}>
        <View style={styles.timerCircle}>
          <View style={[styles.progressBackground, { borderColor: theme.colors.border }]} />
          <View
            style={[
              styles.progressBar,
              {
                borderColor: getTimerColor(),
                transform: [{ rotateZ: `${progress * 360}deg` }],
                opacity: !isActive || isPaused ? 0.5 : 1,
              },
            ]}
          />
          <View style={styles.timerContent}>
            <Text style={[styles.timerText, { color: getTimerColor() }]}>{formatTime(timeLeft)}</Text>
            <Text style={[styles.timerLabel, { color: theme.colors.textSecondary }]}>
              {t("workout.restTimer.label")}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.controlsContainer}>
        {!isActive ? (
          <Button variant="primary" onPress={handleStart} style={styles.button}>
            {t("workout.restTimer.start")}
          </Button>
        ) : (
          <>
            {isPaused ? (
              <Button variant="primary" onPress={handleResume} style={styles.button}>
                {t("workout.restTimer.resume")}
              </Button>
            ) : (
              <Button variant="outline" onPress={handlePause} style={styles.button}>
                {t("workout.restTimer.pause")}
              </Button>
            )}
          </>
        )}

        <Button variant="outline" onPress={handleReset} style={styles.button}>
          {t("workout.restTimer.reset")}
        </Button>

        <Button variant="ghost" onPress={handleSkip} style={styles.button}>
          {t("workout.restTimer.skip")}
        </Button>
      </View>

      {tip && (
        <View style={styles.tipContainer}>
          <Icon name="info" size={16} color={theme.colors.primary} style={styles.tipIcon} />
          <Text style={[styles.tipText, { color: theme.colors.text }]}>{tip}</Text>
        </View>
      )}

      {recoveryStatus && (
        <View style={[styles.recoveryIndicator, { backgroundColor: getStatusColor(recoveryStatus.status, theme) }]}>
          <Text style={styles.recoveryText}>{t(`wellness.recovery.status.${recoveryStatus.status}`)}</Text>
        </View>
      )}
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
    padding: 20,
    alignItems: "center",
  },
  timerContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  timerCircle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  progressBackground: {
    position: "absolute",
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 5,
  },
  progressBar: {
    position: "absolute",
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 5,
    borderLeftColor: "transparent",
    borderBottomColor: "transparent",
  },
  timerContent: {
    alignItems: "center",
    justifyContent: "center",
  },
  timerText: {
    fontSize: 36,
    fontWeight: "bold",
  },
  timerLabel: {
    fontSize: 14,
  },
  controlsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginBottom: 15,
  },
  button: {
    flex: 0.3,
  },
  tipContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.05)",
    borderRadius: 8,
    padding: 10,
    marginTop: 10,
  },
  tipIcon: {
    marginRight: 10,
  },
  tipText: {
    flex: 1,
    fontSize: 14,
  },
  recoveryIndicator: {
    position: "absolute",
    top: 10,
    right: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  recoveryText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
})

