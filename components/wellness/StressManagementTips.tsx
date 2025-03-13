"use client"

import type React from "react"
import { useState } from "react"
import { View, Text, StyleSheet, TouchableOpacity } from "react-native"
import { useTranslation } from "react-i18next"
import { useTheme } from "../../hooks/useTheme"
import { Card } from "../ui/Card"
import { Icon } from "../ui/Icon"

interface StressManagementTipsProps {
  stressLevel: number
  style?: any
}

export const StressManagementTips: React.FC<StressManagementTipsProps> = ({ stressLevel, style }) => {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const [expandedCategory, setExpandedCategory] = useState<string | null>("quick")

  // Define tip categories
  const categories = [
    { id: "quick", icon: "clock", title: t("wellness.stress.tips.quickRelief") },
    { id: "physical", icon: "activity", title: t("wellness.stress.tips.physical") },
    { id: "mental", icon: "brain", title: t("wellness.stress.tips.mental") },
    { id: "lifestyle", icon: "sun", title: t("wellness.stress.tips.lifestyle") },
  ]

  // Get tips based on stress level and category
  const getTips = (category: string) => {
    // Base tips that apply to all stress levels
    const baseTips = {
      quick: [
        t("wellness.stress.tips.quick.deepBreathing"),
        t("wellness.stress.tips.quick.bodyScan"),
        t("wellness.stress.tips.quick.grounding"),
      ],
      physical: [
        t("wellness.stress.tips.physical.exercise"),
        t("wellness.stress.tips.physical.stretch"),
        t("wellness.stress.tips.physical.walk"),
      ],
      mental: [
        t("wellness.stress.tips.mental.meditation"),
        t("wellness.stress.tips.mental.gratitude"),
        t("wellness.stress.tips.mental.reframe"),
      ],
      lifestyle: [
        t("wellness.stress.tips.lifestyle.sleep"),
        t("wellness.stress.tips.lifestyle.nutrition"),
        t("wellness.stress.tips.lifestyle.boundaries"),
      ],
    }

    // Additional tips for higher stress levels
    if (stressLevel >= 60) {
      baseTips.quick.push(t("wellness.stress.tips.quick.timeout"))
      baseTips.physical.push(t("wellness.stress.tips.physical.relaxationExercise"))
      baseTips.mental.push(t("wellness.stress.tips.mental.professionalHelp"))
      baseTips.lifestyle.push(t("wellness.stress.tips.lifestyle.reduceCaffeine"))
    }

    return baseTips[category as keyof typeof baseTips] || []
  }

  const toggleCategory = (categoryId: string) => {
    if (expandedCategory === categoryId) {
      setExpandedCategory(null)
    } else {
      setExpandedCategory(categoryId)
    }
  }

  return (
    <Card style={[styles.container, style]}>
      <Text style={[styles.title, { color: theme.colors.text }]}>{t("wellness.stress.managementTips")}</Text>

      {categories.map((category) => (
        <View key={category.id} style={styles.categoryContainer}>
          <TouchableOpacity
            onPress={() => toggleCategory(category.id)}
            style={[styles.categoryHeader, { borderBottomColor: theme.colors.border }]}
          >
            <View style={styles.categoryTitleContainer}>
              <Icon name={category.icon} size={18} color={theme.colors.primary} style={styles.categoryIcon} />
              <Text style={[styles.categoryTitle, { color: theme.colors.text }]}>{category.title}</Text>
            </View>

            <Icon
              name={expandedCategory === category.id ? "chevron-up" : "chevron-down"}
              size={18}
              color={theme.colors.textSecondary}
            />
          </TouchableOpacity>

          {expandedCategory === category.id && (
            <View style={styles.tipsContainer}>
              {getTips(category.id).map((tip, index) => (
                <View key={index} style={styles.tipItem}>
                  <Icon name="check" size={14} color={theme.colors.success} style={styles.tipIcon} />
                  <Text style={[styles.tipText, { color: theme.colors.text }]}>{tip}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      ))}
    </Card>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  categoryContainer: {
    marginBottom: 10,
  },
  categoryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  categoryTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  categoryIcon: {
    marginRight: 10,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: "500",
  },
  tipsContainer: {
    paddingTop: 10,
    paddingBottom: 5,
  },
  tipItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 10,
    paddingLeft: 5,
  },
  tipIcon: {
    marginRight: 8,
    marginTop: 3,
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
})

