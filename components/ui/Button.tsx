import type React from "react"
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  type ViewStyle,
  type TextStyle,
  type TouchableOpacityProps,
} from "react-native"
import { Feather } from "@expo/vector-icons"
import { theme } from "../../theme"

export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger"
export type ButtonSize = "sm" | "md" | "lg"

interface ButtonProps extends TouchableOpacityProps {
  children: React.ReactNode
  variant?: ButtonVariant
  size?: ButtonSize
  leftIcon?: string
  rightIcon?: string
  isLoading?: boolean
  disabled?: boolean
  fullWidth?: boolean
  style?: ViewStyle
  textStyle?: TextStyle
}

export default function Button({
  children,
  variant = "primary",
  size = "md",
  leftIcon,
  rightIcon,
  isLoading = false,
  disabled = false,
  fullWidth = false,
  style,
  textStyle,
  ...props
}: ButtonProps) {
  const getButtonStyle = (): ViewStyle => {
    switch (variant) {
      case "primary":
        return styles.primaryButton
      case "secondary":
        return styles.secondaryButton
      case "outline":
        return styles.outlineButton
      case "ghost":
        return styles.ghostButton
      case "danger":
        return styles.dangerButton
      default:
        return styles.primaryButton
    }
  }

  const getTextStyle = (): TextStyle => {
    switch (variant) {
      case "primary":
        return styles.primaryText
      case "secondary":
        return styles.secondaryText
      case "outline":
        return styles.outlineText
      case "ghost":
        return styles.ghostText
      case "danger":
        return styles.dangerText
      default:
        return styles.primaryText
    }
  }

  const getSizeStyle = (): ViewStyle => {
    switch (size) {
      case "sm":
        return styles.smallButton
      case "md":
        return styles.mediumButton
      case "lg":
        return styles.largeButton
      default:
        return styles.mediumButton
    }
  }

  const getTextSizeStyle = (): TextStyle => {
    switch (size) {
      case "sm":
        return styles.smallText
      case "md":
        return styles.mediumText
      case "lg":
        return styles.largeText
      default:
        return styles.mediumText
    }
  }

  const buttonStyles = [
    styles.button,
    getButtonStyle(),
    getSizeStyle(),
    fullWidth && styles.fullWidth,
    disabled && styles.disabledButton,
    style,
  ]

  const textStyles = [styles.text, getTextStyle(), getTextSizeStyle(), disabled && styles.disabledText, textStyle]

  const iconColor = (() => {
    if (disabled) return theme.colors.textSecondary

    switch (variant) {
      case "primary":
        return theme.colors.background
      case "secondary":
        return theme.colors.background
      case "outline":
        return theme.colors.primary
      case "ghost":
        return theme.colors.primary
      case "danger":
        return theme.colors.background
      default:
        return theme.colors.background
    }
  })()

  const iconSize = (() => {
    switch (size) {
      case "sm":
        return 14
      case "md":
        return 16
      case "lg":
        return 18
      default:
        return 16
    }
  })()

  return (
    <TouchableOpacity style={buttonStyles} disabled={disabled || isLoading} activeOpacity={0.7} {...props}>
      {isLoading ? (
        <ActivityIndicator
          size="small"
          color={variant === "outline" || variant === "ghost" ? theme.colors.primary : theme.colors.background}
        />
      ) : (
        <>
          {leftIcon && <Feather name={leftIcon as any} size={iconSize} color={iconColor} style={styles.leftIcon} />}
          <Text style={textStyles}>{children}</Text>
          {rightIcon && <Feather name={rightIcon as any} size={iconSize} color={iconColor} style={styles.rightIcon} />}
        </>
      )}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
  },
  primaryButton: {
    backgroundColor: theme.colors.primary,
  },
  secondaryButton: {
    backgroundColor: theme.colors.secondary,
  },
  outlineButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },
  ghostButton: {
    backgroundColor: "transparent",
  },
  dangerButton: {
    backgroundColor: theme.colors.error,
  },
  smallButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  mediumButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  largeButton: {
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  fullWidth: {
    width: "100%",
  },
  disabledButton: {
    opacity: 0.5,
  },
  text: {
    fontWeight: "500",
  },
  primaryText: {
    color: theme.colors.background,
  },
  secondaryText: {
    color: theme.colors.background,
  },
  outlineText: {
    color: theme.colors.primary,
  },
  ghostText: {
    color: theme.colors.primary,
  },
  dangerText: {
    color: theme.colors.background,
  },
  smallText: {
    fontSize: 14,
  },
  mediumText: {
    fontSize: 16,
  },
  largeText: {
    fontSize: 18,
  },
  disabledText: {
    color: theme.colors.textSecondary,
  },
  leftIcon: {
    marginRight: 8,
  },
  rightIcon: {
    marginLeft: 8,
  },
})

