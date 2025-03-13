"use client"

import { useState } from "react"
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  type TextInputProps,
  type ViewStyle,
  type TextStyle,
  TouchableOpacity,
} from "react-native"
import { Feather } from "@expo/vector-icons"
import { theme } from "../../theme"

interface InputProps extends TextInputProps {
  label?: string
  error?: string
  leftIcon?: string
  rightIcon?: string
  onRightIconPress?: () => void
  containerStyle?: ViewStyle
  labelStyle?: TextStyle
  inputStyle?: TextStyle
  errorStyle?: TextStyle
}

export default function Input({
  label,
  error,
  leftIcon,
  rightIcon,
  onRightIconPress,
  containerStyle,
  labelStyle,
  inputStyle,
  errorStyle,
  secureTextEntry,
  ...props
}: InputProps) {
  const [isFocused, setIsFocused] = useState(false)
  const [isPasswordVisible, setIsPasswordVisible] = useState(!secureTextEntry)

  const handleFocus = () => {
    setIsFocused(true)
    props.onFocus && props.onFocus()
  }

  const handleBlur = () => {
    setIsFocused(false)
    props.onBlur && props.onBlur()
  }

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible)
  }

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={[styles.label, labelStyle]}>{label}</Text>}

      <View
        style={[styles.inputContainer, isFocused && styles.inputContainerFocused, error && styles.inputContainerError]}
      >
        {leftIcon && (
          <Feather name={leftIcon as any} size={18} color={theme.colors.textSecondary} style={styles.leftIcon} />
        )}

        <TextInput
          style={[
            styles.input,
            leftIcon && styles.inputWithLeftIcon,
            (rightIcon || secureTextEntry) && styles.inputWithRightIcon,
            inputStyle,
          ]}
          placeholderTextColor={theme.colors.textSecondary}
          onFocus={handleFocus}
          onBlur={handleBlur}
          secureTextEntry={secureTextEntry && !isPasswordVisible}
          {...props}
        />

        {secureTextEntry && (
          <TouchableOpacity style={styles.rightIcon} onPress={togglePasswordVisibility}>
            <Feather name={isPasswordVisible ? "eye-off" : "eye"} size={18} color={theme.colors.textSecondary} />
          </TouchableOpacity>
        )}

        {rightIcon && !secureTextEntry && (
          <TouchableOpacity style={styles.rightIcon} onPress={onRightIconPress} disabled={!onRightIconPress}>
            <Feather name={rightIcon as any} size={18} color={theme.colors.textSecondary} />
          </TouchableOpacity>
        )}
      </View>

      {error && <Text style={[styles.error, errorStyle]}>{error}</Text>}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: theme.colors.text,
    marginBottom: 6,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 8,
    backgroundColor: theme.colors.card,
  },
  inputContainerFocused: {
    borderColor: theme.colors.primary,
  },
  inputContainerError: {
    borderColor: theme.colors.error,
  },
  input: {
    flex: 1,
    height: 44,
    paddingHorizontal: 12,
    fontSize: 16,
    color: theme.colors.text,
  },
  inputWithLeftIcon: {
    paddingLeft: 0,
  },
  inputWithRightIcon: {
    paddingRight: 0,
  },
  leftIcon: {
    marginLeft: 12,
  },
  rightIcon: {
    padding: 12,
  },
  error: {
    fontSize: 12,
    color: theme.colors.error,
    marginTop: 4,
  },
})

