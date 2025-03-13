"use client"

import type React from "react"
import { useState } from "react"
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native"
import { useTranslation } from "react-i18next"
import { useTheme } from "../../hooks/useTheme"
import { Input } from "../ui/Input"
import { Icon } from "../ui/Icon"

interface TagSelectorProps {
  selectedTags: string[]
  onChange: (tags: string[]) => void
  style?: object
}

export const TagSelector: React.FC<TagSelectorProps> = ({ selectedTags, onChange, style }) => {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const [newTag, setNewTag] = useState("")

  // Common tags suggestions
  const suggestedTags = [
    t("tags.motivation"),
    t("tags.progress"),
    t("tags.nutrition"),
    t("tags.recovery"),
    t("tags.goals"),
    t("tags.challenges"),
  ]

  const handleAddTag = () => {
    if (newTag.trim() && !selectedTags.includes(newTag.trim())) {
      onChange([...selectedTags, newTag.trim()])
      setNewTag("")
    }
  }

  const handleRemoveTag = (tag: string) => {
    onChange(selectedTags.filter((t) => t !== tag))
  }

  const handleAddSuggestedTag = (tag: string) => {
    if (!selectedTags.includes(tag)) {
      onChange([...selectedTags, tag])
    }
  }

  return (
    <View style={[styles.container, style]}>
      <View style={styles.inputContainer}>
        <Input
          value={newTag}
          onChangeText={setNewTag}
          placeholder={t("journal.addTag")}
          returnKeyType="done"
          onSubmitEditing={handleAddTag}
          style={styles.input}
        />
        <TouchableOpacity style={[styles.addButton, { backgroundColor: theme.colors.primary }]} onPress={handleAddTag}>
          <Icon name="plus" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      {selectedTags.length > 0 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.tagsContainer}
          contentContainerStyle={styles.tagsContent}
        >
          {selectedTags.map((tag) => (
            <View key={tag} style={[styles.tag, { backgroundColor: theme.colors.primaryLight }]}>
              <Text style={[styles.tagText, { color: theme.colors.primary }]}>{tag}</Text>
              <TouchableOpacity onPress={() => handleRemoveTag(tag)} style={styles.removeButton}>
                <Icon name="x" size={14} color={theme.colors.primary} />
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      )}

      <Text style={[styles.suggestedTitle, { color: theme.colors.textSecondary }]}>{t("journal.suggestedTags")}</Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.suggestedContainer}
        contentContainerStyle={styles.suggestedContent}
      >
        {suggestedTags.map((tag) => (
          <TouchableOpacity
            key={tag}
            onPress={() => handleAddSuggestedTag(tag)}
            style={[
              styles.suggestedTag,
              {
                backgroundColor: selectedTags.includes(tag) ? theme.colors.primaryLight : theme.colors.backgroundLight,
              },
            ]}
          >
            <Text
              style={[
                styles.suggestedTagText,
                {
                  color: selectedTags.includes(tag) ? theme.colors.primary : theme.colors.textSecondary,
                },
              ]}
            >
              {tag}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  input: {
    flex: 1,
    marginRight: 10,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  tagsContainer: {
    maxHeight: 40,
    marginBottom: 15,
  },
  tagsContent: {
    flexDirection: "row",
    flexWrap: "nowrap",
  },
  tag: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    marginRight: 8,
  },
  tagText: {
    fontSize: 14,
    marginRight: 5,
  },
  removeButton: {
    width: 16,
    height: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  suggestedTitle: {
    fontSize: 14,
    marginBottom: 10,
  },
  suggestedContainer: {
    maxHeight: 40,
  },
  suggestedContent: {
    flexDirection: "row",
    flexWrap: "nowrap",
  },
  suggestedTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    marginRight: 8,
  },
  suggestedTagText: {
    fontSize: 14,
  },
})

