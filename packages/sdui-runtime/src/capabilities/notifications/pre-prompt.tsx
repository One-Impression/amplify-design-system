/**
 * Pre-prompt UI component for notification permission requests.
 *
 * Shown before the OS permission dialog to explain why notifications
 * are needed, increasing the grant rate. This is a React Native component
 * that renders a simple bottom sheet or modal overlay.
 */
import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Modal } from "react-native";

interface PrePromptProps {
  onAccept: () => void;
  onDecline: () => void;
  title?: string;
  body?: string;
  acceptLabel?: string;
  declineLabel?: string;
}

export function NotificationPrePrompt({
  onAccept,
  onDecline,
  title = "Enable Notifications",
  body = "Stay updated with campaign updates, earnings, and important messages.",
  acceptLabel = "Enable",
  declineLabel = "Not Now",
}: PrePromptProps): React.ReactElement {
  const [visible, setVisible] = useState(true);

  const handleAccept = () => {
    setVisible(false);
    onAccept();
  };

  const handleDecline = () => {
    setVisible(false);
    onDecline();
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.body}>{body}</Text>
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.declineButton} onPress={handleDecline}>
              <Text style={styles.declineText}>{declineLabel}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.acceptButton} onPress={handleAccept}>
              <Text style={styles.acceptText}>{acceptLabel}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    width: "100%",
    maxWidth: 340,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
    textAlign: "center",
  },
  body: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 20,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 12,
  },
  declineButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: "#f0f0f0",
    alignItems: "center",
  },
  declineText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#666",
  },
  acceptButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: "#6531FF",
    alignItems: "center",
  },
  acceptText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fff",
  },
});
