"use client"

import type React from "react"
import { View, StyleSheet } from "react-native"
import NativeSlider from "@react-native-community/slider"
import { useTheme } from "../../hooks/useTheme"

interface SliderProps {
  value: number
  onValueChange: (value: number) => void
  minimumValue?: number
  maximumValue?: number
  step?: number
  style?: any
}

export const Slider: React.FC<SliderProps> = ({
  value,
  onValueChange,
  minimumValue = 0,
  maximumValue = 100,
  step = 1,
  style,
}) => {
  const { theme } = useTheme()

  return (
    <View style={[styles.container, style]}>
      <NativeSlider
        value={value}
        onValueChange={onValueChange}
        minimumValue={minimumValue}
        maximumValue={maximumValue}
        step={step}
        minimumTrackTintColor={theme.colors.primary}
        maximumTrackTintColor={theme.colors.border}
        thumbTintColor={theme.colors.primary}
        style={styles.slider}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  slider: {
    width: "100%",
    height: 40,
  },
})

