import { Modal, View, Text, TouchableOpacity, Pressable, StyleSheet, useColorScheme } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { useTranslation } from "react-i18next"
import type { MessageAction } from "../../lib/message-actions"

interface Props {
  visible: boolean
  actions: MessageAction[]
  onSelect: (action: MessageAction) => void
  onClose: () => void
  // Pre-translated action labels from the parent (needs session-scoped i18n
  // keys); Cancel is translated internally via common.cancel.
  labels: Record<MessageAction, string>
}

// Bottom-sheet action list for a long-pressed message. Replaces the old
// Alert.alert multi-button popup: on Android that modal list rendered as a
// confusing system dialog, and there was no room for an Undo action.
//
// Rendered inside a transparent <Modal> (same approach as SelectableTextModal)
// so it isn't subject to the transcript FlatList's quirks.
export function MessageActionsSheet({ visible, actions, onSelect, onClose, labels }: Props) {
  const isDark = useColorScheme() === "dark"
  const { t } = useTranslation()
  const insets = useSafeAreaInsets()

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      {/* The backdrop is a pressable so tapping outside dismisses the sheet. */}
      <Pressable style={s.backdrop} onPress={onClose} testID="message-actions-backdrop">
        <Pressable style={[s.sheet, isDark && s.sheetDark]} testID="message-actions-sheet">
          {actions.map((action) => (
            <TouchableOpacity
              key={action}
              onPress={() => onSelect(action)}
              style={[s.actionRow, isDark && s.actionRowDark]}
              testID={`message-action-${action}`}
            >
              <Text style={[s.actionLabel, isDark && s.actionLabelDark]}>{labels[action]}</Text>
            </TouchableOpacity>
          ))}

          {/* Divider between actions and Cancel */}
          <View style={[s.divider, isDark && s.dividerDark]} />

          <TouchableOpacity onPress={onClose} style={[s.actionRow, isDark && s.actionRowDark]} testID="message-action-cancel">
            <Text style={[s.cancelLabel, isDark && s.cancelLabelDark]}>{t("common.cancel")}</Text>
          </TouchableOpacity>

          {/* Pad by the real bottom safe-area inset under edge-to-edge. */}
          <View style={{ height: insets.bottom }} />
        </Pressable>
      </Pressable>
    </Modal>
  )
}

const s = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" },
  sheet: {
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingTop: 4,
    paddingBottom: 4,
  },
  sheetDark: { backgroundColor: "#141420" },

  actionRow: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  actionRowDark: {},
  actionLabel: { fontSize: 16, color: "#0a0a0a" },
  actionLabelDark: { color: "#ffffff" },

  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: "#e5e5e5",
    marginVertical: 4,
    marginHorizontal: 20,
  },
  dividerDark: { backgroundColor: "#2a2a2a" },

  cancelLabel: { fontSize: 16, color: "#8b5cf6", fontWeight: "600" },
  cancelLabelDark: { color: "#a78bfa" },
})
