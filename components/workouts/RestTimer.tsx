"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { View, Text, StyleSheet, TouchableOpacity, Animated } from "react-native"
import { useTranslation } from "react-i18next"
import { Ionicons } from "@expo/vector-icons"
import { useTipService } from "../../hooks/useTipService"
import type { Exercise, Set } from "../../types/workout"
import { useTheme } from "../../hooks/useTheme"
import { formatTime } from "../../utils/dateUtils"
import { vibrate } from "../../utils/haptics"
import { useUserProfile } from "../../hooks/useUserProfile"

interface RestTimerProps {
  duration: number
  onComplete: () => void
  onSkip: () => void
  currentExercise: Exercise
  lastCompletedSet: Set | null
  nextSet: Set | null
  isVisible: boolean
}

export const RestTimer: React.FC<RestTimerProps> = ({
  duration,
  onComplete,
  onSkip,
  currentExercise,
  lastCompletedSet,
  nextSet,
  isVisible,
}) => {
  const { t } = useTranslation()
  const { colors } = useTheme()
  const [timeLeft, setTimeLeft] = useState(duration)
  const [isRunning, setIsRunning] = useState(true)
  const [showTip, setShowTip] = useState(true)
  const progressAnim = useRef(new Animated.Value(0)).current
  const { userProfile } = useUserProfile()

  // Get contextual tips based on the current exercise, last completed set, and user profile
  const { getTipForRestPeriod } = useTipService()
  const tip = getTipForRestPeriod({
    exercise: currentExercise,
    lastSet: lastCompletedSet,
    nextSet: nextSet,
    restDuration: duration,
    userProfile,
  })

  useEffect(() => {
    setTimeLeft(duration)
    setIsRunning(true)

    // Reset and start the progress animation
    progressAnim.setValue(0)
    Animated.timing(progressAnim, {
      toValue: 1,
      duration: duration * 1000,
      useNativeDriver: false,
    }).start()
  }, [duration])

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => {
          const newTime = prevTime - 1
          if (newTime <= 0) {
            if (interval) clearInterval(interval)
            onComplete()
            vibrate("heavy")
          }
          return newTime
        })
      }, 1000)
    } else if (!isRunning && interval) {
      clearInterval(interval)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isRunning, timeLeft, onComplete])

  const toggleTimer = () => {
    setIsRunning(!isRunning)

    // Pause or resume the progress animation
    if (isRunning) {
      Animated.timing(progressAnim).stop()
    } else {
      Animated.timing(progressAnim, {
        toValue: 1,
        duration: timeLeft * 1000,
        useNativeDriver: false,
      }).start()
    }
  }

  const handleSkip = () => {
    onSkip()
  }

  const toggleTip = () => {
    setShowTip(!showTip)
  }

  if (!isVisible) return null

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  })

  return (
    <View style={[styles.container, { backgroundColor: colors.cardBackground }]}>
      <View style={styles.timerContainer}>
        <Text style={[styles.timerLabel, { color: colors.text }]}>{t("workouts.restTimer.title")}</Text>
        <Text style={[styles.timer, { color: colors.primary }]}>{formatTime(timeLeft)}</Text>
        <View style={styles.progressBarContainer}>
          <Animated.View
            style={[
              styles.progressBar,
              {
                width: progressWidth,
                backgroundColor: timeLeft < 5 ? colors.error : colors.primary,
              },
            ]}
          />
        </View>
      </View>

      <View style={styles.controlsContainer}>
        <TouchableOpacity
          style={[styles.controlButton, { backgroundColor: colors.primaryLight }]}
          onPress={toggleTimer}
        >
          <Ionicons name={isRunning ? "pause" : "play"} size={24} color={colors.primary} />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.controlButton, { backgroundColor: colors.secondaryLight }]}
          onPress={handleSkip}
        >
          <Ionicons name="play-skip-forward" size={24} color={colors.secondary} />
        </TouchableOpacity>
      </View>

      {tip && (
        <View style={[styles.tipContainer, { backgroundColor: colors.primaryLight }]}>
          <View style={styles.tipHeader}>
            <Text style={[styles.tipTitle, { color: colors.primary }]}>{t("workouts.restTimer.tipTitle")}</Text>
            <TouchableOpacity onPress={toggleTip}>
              <Ionicons name={showTip ? "chevron-up" : "chevron-down"} size={20} color={colors.primary} />
            </TouchableOpacity>
          </View>

          {showTip && <Text style={[styles.tipText, { color: colors.text }]}>{tip}</Text>}
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 12,
    margin: 8,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  timerContainer: {
    alignItems: "center",
    marginBottom: 16,
  },
  timerLabel: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  timer: {
    fontSize: 48,
    fontWeight: "bold",
    marginBottom: 16,
  },
  progressBarContainer: {
    width: "100%",
    height: 8,
    backgroundColor: "#E0E0E0",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
  },
  controlsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 16,
  },
  controlButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 8,
  },
  tipContainer: {
    padding: 12,
    borderRadius: 8,
  },
  tipHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  tipText: {
    fontSize: 14,
    lineHeight: 20,
  },
})

