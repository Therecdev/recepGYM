"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { View, Text, StyleSheet, TouchableOpacity, Animated } from "react-native"
import { useTranslation } from "react-i18next"
import { useTheme } from "../../hooks/useTheme"
import { Card } from "../ui/Card"
import { Button } from "../ui/Button"
import { Icon } from "../ui/Icon"
import type { RecoveryStatus } from "../../types/health"

interface RestTimerProps {
  duration: number
  onComplete: () => void
  recoveryStatus?: RecoveryStatus | null
}

export const RestTimer: React.FC<RestTimerProps> = ({ duration, onComplete, recoveryStatus }) => {
  const { t } = useTranslation()
  const { theme } = useTheme()

  const [timeLeft, setTimeLeft] = useState(duration)
  const [isPaused, setIsPaused] = useState(false)
  const [showTip, setShowTip] = useState(true)

  const progressAnimation = useRef(new Animated.Value(1)).current
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    startTimer()
    startProgressAnimation()

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [])

  const startTimer = () => {
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (timerRef.current) {
            clearInterval(timerRef.current)
          }
          onComplete()
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const startProgressAnimation = () => {
    Animated.timing(progressAnimation, {
      toValue: 0,
      duration: duration * 1000,
      useNativeDriver: false,
    }).start()
  }

  const handlePauseResume = () => {
    if (isPaused) {
      startTimer()
      Animated.timing(progressAnimation, {
        toValue: 0,
        duration: timeLeft * 1000,
        useNativeDriver: false,
      }).start()
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
      progressAnimation.stopAnimation()
    }

    setIsPaused((prev) => !prev)
  }

  const handleSkip = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
    }
    onComplete()
  }

  // Format time left
  const formatTimeLeft = () => {
    const minutes = Math.floor(timeLeft / 60)
    const seconds = timeLeft % 60

    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  // Get rest tip based on recovery status
  const getRestTip = () => {
    if (!recoveryStatus) return null

    const { status } = recoveryStatus

    if (status === "poor") {
      return t("workout.restTips.poorRecovery")
    } else if (status === "fair") {
      return t("workout.restTips.fairRecovery")
    } else if (status === "good") {
      return t("workout.restTips.goodRecovery")
    } else {
      // excellent
      return t("workout.restTips.excellentRecovery")
    }
  }

  const restTip = getRestTip()

  return (
    <View style={[styles.overlay, { backgroundColor: "rgba(0, 0, 0, 0.5)" }]}>
      <Card style={styles.container}>
        <Text style={[styles.title, { color: theme.colors.text }]}>{t("workout.restTimer.title")}</Text>

        <View style={styles.timerContainer}>
          <Animated.View
            style={[
              styles.progressCircle,
              {
                borderColor: theme.colors.primary,
                borderWidth: 4,
                transform: [
                  {
                    scale: progressAnimation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, 1],
                    }),
                  },
                ],
                opacity: progressAnimation,
              },
            ]}
          />

          <Text style={[styles.timerText, { color: theme.colors.text }]}>{formatTimeLeft()}</Text>
        </View>

        {showTip && restTip && (
          <View style={styles.tipContainer}>
            <Icon name="info" size={16} color={theme.colors.primary} style={styles.tipIcon} />
            <Text style={[styles.tipText, { color: theme.colors.textSecondary }]}>{restTip}</Text>
            <TouchableOpacity onPress={() => setShowTip(false)} style={styles.closeTipButton}>
              <Icon name="x" size={14} color={theme.colors.textSecondary} />
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.buttonsContainer}>
          <Button variant="outline" onPress={handlePauseResume} style={styles.actionButton}>
            <Icon name={isPaused ? "play" : "pause"} size={16} color={theme.colors.primary} style={styles.buttonIcon} />
            {isPaused ? t("workout.restTimer.resume") : t("workout.restTimer.pause")}
          </Button>

          <Button variant="primary" onPress={handleSkip} style={styles.actionButton}>
            <Icon name="skip-forward" size={16} color="white" style={styles.buttonIcon} />
            {t("workout.restTimer.skip")}
          </Button>
        </View>
      </Card>
    </View>
  )
}

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  container: {
    width: "80%",
    padding: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
  timerContainer: {
    position: "relative",
    width: 120,
    height: 120,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  progressCircle: {
    position: "absolute",
    width: "100%",
    height: "100%",
    borderRadius: 60,
  },
  timerText: {
    fontSize: 32,
    fontWeight: "bold",
  },
  tipContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: 10,
    marginBottom: 20,
    borderRadius: 8,
    backgroundColor: "rgba(0, 0, 0, 0.05)",
  },
  tipIcon: {
    marginRight: 10,
    marginTop: 2,
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
  closeTipButton: {
    padding: 5,
    marginLeft: 5,
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  actionButton: {
    flex: 0.48,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonIcon: {
    marginRight: 8,
  },
})

