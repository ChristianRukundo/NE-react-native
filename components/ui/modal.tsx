import type React from "react"
import { View, Text, TouchableOpacity, Modal as RNModal } from "react-native"
import { Ionicons } from "@expo/vector-icons"

interface ModalProps {
  visible: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
}

export function Modal({ visible, onClose, title, children }: ModalProps) {
  return (
    <RNModal visible={visible} transparent animationType="fade">
      <View className="flex-1 bg-black/50 justify-center items-center px-6">
        <View className="bg-white rounded-3xl w-full max-h-[80%] overflow-hidden">
          {/* Header */}
          <View className="flex-row items-center justify-between p-6 border-b border-gray-100">
            <Text className="text-xl font-dm-sans-bold text-gray-900">{title}</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>

          {/* Content */}
          <View className="p-6">{children}</View>
        </View>
      </View>
    </RNModal>
  )
}
