"use client";

import { useState, useMemo, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  TextInput,
  ActivityIndicator,
  RefreshControl,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Toast from "react-native-toast-message";

import { parkingSlotApi } from "../../lib/api";
import {
  parkingSlotSchema,
  type ParkingSlotFormData,
} from "../../lib/validations";
import type { ParkingSlot } from "../../types";

import { Header } from "@/components/ui/Header";
import { Modal } from "@/components/ui/modal";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { Picker, type PickerOption } from "@/components/ui/picker";

const THEME_COLORS = {
  primary: "#FF6F00",
  darkBackground: "#181A20",
  lightText: "#FFFFFF",
  darkText: "#1F2937",
  grayText: "#6B7280",
  mediumGrayText: "#9CA3AF",
  lightGrayBg: "#F9FAFB",
  available: "#10B981",
  occupied: "#EF4444",
  availableBg: "rgba(16, 185, 129, 0.1)",
  occupiedBg: "rgba(239, 68, 68, 0.1)",
  borderColor: "#E5E7EB",
  cardBackground: "#FFFFFF",
  cardBorder: "#F3F4F6",
  shadowColor: "rgba(0,0,0,0.05)", // Added
};

const statusOptions: PickerOption[] = [
  { label: "Available", value: "Available" },
  { label: "Occupied", value: "Occupied" },
];

const typeOptions: PickerOption[] = [
  { label: "Standard", value: "Standard" },
  { label: "EV Charger", value: "EV Charger" },
  { label: "Disabled", value: "Disabled" },
];

const sortOptions: PickerOption[] = [
  { label: "Slot Number (A-Z)", value: "slotNumber_asc" },
  { label: "Slot Number (Z-A)", value: "slotNumber_desc" },
  { label: "Status (A-Z)", value: "status_asc" },
  { label: "Type (A-Z)", value: "type_asc" },
];

export default function ParkingSlotsScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddEditModal, setShowAddEditModal] = useState(false);
  const [editingSlot, setEditingSlot] = useState<ParkingSlot | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [slotToDelete, setSlotToDelete] = useState<ParkingSlot | null>(null);
  const [showFilterSortModal, setShowFilterSortModal] = useState(false);

  const [tempSortBy, setTempSortBy] = useState<string>(
    sortOptions[0].value as string
  );
  const [tempFilterStatus, setTempFilterStatus] = useState<string>("");
  const [tempFilterType, setTempFilterType] = useState<string>("");

  const [appliedSortBy, setAppliedSortBy] = useState<string>(
    sortOptions[0].value as string
  );
  const [appliedFilterStatus, setAppliedFilterStatus] = useState<string>("");
  const [appliedFilterType, setAppliedFilterType] = useState<string>("");

  const queryClient = useQueryClient();

  const {
    data: parkingSlotsResponse,
    isLoading: isLoadingSlots,
    isError: isErrorSlots,
    refetch: refetchParkingSlots,
    isRefetching: isRefetchingSlots,
  } = useQuery<{ data: ParkingSlot[] }, Error>({
    queryKey: ["parking-slots"],
    queryFn: parkingSlotApi.getAll,
  });

  const parkingSlots = parkingSlotsResponse?.data;

  const handleError = (error: Error | any, defaultMessage: string) => {
    console.error(defaultMessage, error);
    const message =
      error?.response?.data?.message || error?.message || defaultMessage;
    Toast.show({ type: "error", text1: "Error", text2: message });
  };

  const createMutation = useMutation<
    { data: ParkingSlot },
    Error,
    ParkingSlotFormData
  >({
    mutationFn: (newData) => parkingSlotApi.create(newData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["parking-slots"] });
      setShowAddEditModal(false);
      resetForm();
      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Parking slot added.",
      });
    },
    onError: (error) => handleError(error, "Failed to add parking slot."),
  });

  const updateMutation = useMutation<
    { data: ParkingSlot },
    Error,
    { id: string; data: ParkingSlotFormData }
  >({
    mutationFn: (variables) =>
      parkingSlotApi.update(variables.id, variables.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["parking-slots"] });
      setShowAddEditModal(false);
      resetForm();
      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Parking slot updated.",
      });
    },
    onError: (error) => handleError(error, "Failed to update parking slot."),
  });

  const deleteMutation = useMutation<
    { data: { success: boolean; deletedItem?: ParkingSlot } },
    Error,
    string
  >({
    mutationFn: (id) => parkingSlotApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["parking-slots"] });
      setShowDeleteModal(false);
      setSlotToDelete(null);
      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Parking slot deleted.",
      });
    },
    onError: (error) => handleError(error, "Failed to delete parking slot."),
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ParkingSlotFormData>({
    resolver: zodResolver(parkingSlotSchema),
    defaultValues: {
      slotNumber: "",
      status: "Available",
      type: "Standard",
    },
  });

  const resetForm = useCallback(() => {
    reset({
      slotNumber: "",
      status: "Available",
      type: "Standard",
    });
    setEditingSlot(null);
  }, [reset]);

  const onSubmit = (data: ParkingSlotFormData) => {
    if (editingSlot?.id) {
      updateMutation.mutate({ id: editingSlot.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (slot: ParkingSlot) => {
    setEditingSlot(slot);
    const formData: ParkingSlotFormData = {
      slotNumber: slot.slotNumber,
      status: slot.status as ParkingSlotFormData["status"],
      type: slot.type as ParkingSlotFormData["type"],
    };
    reset(formData);
    setShowAddEditModal(true);
  };

  const openAddNewModal = () => {
    resetForm();
    setShowAddEditModal(true);
  };

  const handleDeleteConfirmation = (slot: ParkingSlot) => {
    setSlotToDelete(slot);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (slotToDelete?.id) {
      deleteMutation.mutate(slotToDelete.id);
    }
  };

  const openFilterSortModal = () => {
    setTempSortBy(appliedSortBy);
    setTempFilterStatus(appliedFilterStatus);
    setTempFilterType(appliedFilterType);
    setShowFilterSortModal(true);
  };

  const applyFiltersAndSort = () => {
    setAppliedSortBy(tempSortBy);
    setAppliedFilterStatus(tempFilterStatus);
    setAppliedFilterType(tempFilterType);
    setShowFilterSortModal(false);
  };

  const resetFiltersAndSortInModal = () => {
    setTempSortBy(sortOptions[0].value as string);
    setTempFilterStatus("");
    setTempFilterType("");
  };

  const filteredAndSortedSlots = useMemo(() => {
    if (!parkingSlots) return [];
    const localParkingSlots = [...parkingSlots];
    return localParkingSlots
      .filter((slot) => {
        const searchLower = searchQuery.toLowerCase();
        const matchesSearch = slot.slotNumber
          .toLowerCase()
          .includes(searchLower);
        const matchesStatusFilter =
          !appliedFilterStatus || slot.status === appliedFilterStatus;
        const matchesTypeFilter =
          !appliedFilterType || slot.type === appliedFilterType;
        return matchesSearch && matchesStatusFilter && matchesTypeFilter;
      })
      .sort((a, b) => {
        switch (appliedSortBy) {
          case "slotNumber_asc":
            return a.slotNumber.localeCompare(b.slotNumber);
          case "slotNumber_desc":
            return b.slotNumber.localeCompare(a.slotNumber);
          case "status_asc":
            return a.status.localeCompare(b.status);
          case "type_asc":
            return a.type.localeCompare(b.type);
          default:
            return 0;
        }
      });
  }, [
    parkingSlots,
    searchQuery,
    appliedSortBy,
    appliedFilterStatus,
    appliedFilterType,
  ]);

  const getStatusColor = (status: ParkingSlot["status"]) => {
    return status === "Available"
      ? THEME_COLORS.available
      : THEME_COLORS.occupied;
  };

  const getStatusBgStyle = (status: ParkingSlot["status"]) => {
    return {
      backgroundColor:
        status === "Available"
          ? THEME_COLORS.availableBg
          : THEME_COLORS.occupiedBg,
    };
  };

  const getTypeIcon = (
    type: ParkingSlot["type"]
  ): keyof typeof Ionicons.glyphMap => {
    switch (type) {
      case "EV Charger":
        return "flash-outline";
      case "Disabled":
        return "accessibility-outline";
      default:
        return "car-sport-outline";
    }
  };

  const renderSlotItem = ({ item }: { item: ParkingSlot }) => (
    <View
      className={`rounded-2xl p-4 mb-4 border shadow-sm bg-[${THEME_COLORS.cardBackground}] border-[${THEME_COLORS.cardBorder}]`}
      style={styles.slotItemCardShadow}
    >
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center flex-1 mr-2">
          <View
            style={getStatusBgStyle(item.status)}
            className="w-10 h-10 rounded-lg items-center justify-center mr-3"
          >
            <Ionicons
              name={getTypeIcon(item.type)}
              size={20}
              color={getStatusColor(item.status)}
            />
          </View>
          <View className="flex-1">
            <Text
              className={`font-dm-sans-bold text-base text-[${THEME_COLORS.darkText}]`}
              numberOfLines={1}
            >
              {item.slotNumber}
            </Text>
            <Text
              className={`font-dm-sans text-xs text-[${THEME_COLORS.grayText}]`}
            >
              {item.type}
            </Text>
          </View>
        </View>
        <View
          style={getStatusBgStyle(item.status)}
          className="px-2 py-0.5 rounded-full"
        >
          <Text
            className="font-dm-sans-bold text-[10px] uppercase tracking-wider"
            style={{ color: getStatusColor(item.status) }}
          >
            {item.status}
          </Text>
        </View>
      </View>
      <View
        className={`flex-row justify-end mt-3 pt-3 border-t border-[${THEME_COLORS.cardBorder}]`}
      >
        <TouchableOpacity
          onPress={() => handleEdit(item)}
          className="p-1.5 mr-1 rounded-md active:bg-gray-100"
        >
          <Ionicons
            name="pencil-outline"
            size={18}
            color={THEME_COLORS.grayText}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleDeleteConfirmation(item)}
          className="p-1.5 rounded-md active:bg-red-50"
        >
          <Ionicons
            name="trash-outline"
            size={18}
            color={THEME_COLORS.occupied}
          />
        </TouchableOpacity>
      </View>
    </View>
  );

  if (isLoadingSlots && !isRefetchingSlots) {
    return (
      <SafeAreaView
        className={`flex-1 justify-center items-center bg-[${THEME_COLORS.darkBackground}]`}
      >
        <ActivityIndicator size="large" color={THEME_COLORS.primary} />
        <Text className={`font-dm-sans text-[${THEME_COLORS.lightText}] mt-2`}>
          Loading Parking Slots...
        </Text>
      </SafeAreaView>
    );
  }

  if (isErrorSlots && !parkingSlotsResponse?.data?.length) {
    return (
      <SafeAreaView
        className={`flex-1 justify-center items-center px-6 bg-[${THEME_COLORS.darkBackground}]`}
      >
        <Ionicons
          name="cloud-offline-outline"
          size={48}
          color={THEME_COLORS.grayText}
        />
        <Text
          className={`font-dm-sans text-center mt-2 mb-4 text-[${THEME_COLORS.lightText}]`}
        >
          Failed to load parking slots. Please check your connection.
        </Text>
        <Button
          onPress={() => refetchParkingSlots()}
          isLoading={isRefetchingSlots}
          size="sm"
          className="mt-4"
        >
          Try Again
        </Button>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      className="flex-1"
      style={{ backgroundColor: THEME_COLORS.darkBackground }}
    >
      <Header title="Parking Slots" />
      <View
        className={`flex-1 rounded-t-[24px] mt-[-10px] pt-1 z-10 bg-[${THEME_COLORS.lightGrayBg}]`}
      >
        <View className="px-5 pt-4 pb-2 flex-row items-center">
          <View
            className={`flex-1 flex-row items-center border rounded-xl px-3 h-11 mr-2.5 shadow-sm bg-[${THEME_COLORS.cardBackground}] border-[${THEME_COLORS.borderColor}]`}
          >
            <Ionicons
              name="search-outline"
              size={18}
              color={THEME_COLORS.mediumGrayText}
              className="ml-1"
            />
            <TextInput
              placeholder="Search slots (e.g., A-001)"
              value={searchQuery}
              onChangeText={setSearchQuery}
              className={`flex-1 ml-2 font-dm-sans text-sm h-full text-[${THEME_COLORS.darkText}]`}
              placeholderTextColor={THEME_COLORS.mediumGrayText}
            />
          </View>
          <TouchableOpacity
            onPress={openFilterSortModal}
            className={`h-11 w-11 border rounded-xl items-center justify-center shadow-sm bg-[${THEME_COLORS.cardBackground}] border-[${THEME_COLORS.borderColor}]`}
          >
            <Ionicons
              name="options-outline"
              size={20}
              color={THEME_COLORS.grayText}
            />
          </TouchableOpacity>
        </View>

        <View className="px-5 mt-1 mb-3">
          <Button
            onPress={openAddNewModal}
            fullWidth
            leftIcon={"plus-circle"}
            size="md"
          >
            Add New Slot
          </Button>
        </View>

        <FlatList
          data={filteredAndSortedSlots}
          renderItem={renderSlotItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingBottom: 120,
            paddingTop: 8,
          }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefetchingSlots}
              onRefresh={refetchParkingSlots}
              tintColor={THEME_COLORS.primary}
              colors={[THEME_COLORS.primary]}
            />
          }
          ListEmptyComponent={
            <View className="flex-1 items-center justify-center mt-16 pt-10">
              <Ionicons
                name="file-tray-stacked-outline"
                size={40}
                color={THEME_COLORS.mediumGrayText}
              />
              <Text
                className={`font-dm-sans mt-3 text-sm text-[${THEME_COLORS.grayText}]`}
              >
                No parking slots found.
              </Text>
              {(appliedFilterStatus || appliedFilterType || searchQuery) && (
                <Text
                  className={`font-dm-sans mt-1 text-xs text-[${THEME_COLORS.mediumGrayText}]`}
                >
                  Try adjusting filters or search.
                </Text>
              )}
            </View>
          }
        />
      </View>

      <Modal
        visible={showFilterSortModal}
        onClose={() => setShowFilterSortModal(false)}
        title="Filter & Sort Slots"
      >
        <View>
          <View className="mb-3">
            <Picker
              label="Sort By"
              value={tempSortBy}
              onValueChange={(val) => setTempSortBy(String(val))}
              options={sortOptions}
            />
          </View>
          <View className="mb-3">
            <Picker
              label="Filter by Status"
              value={tempFilterStatus}
              onValueChange={(val) => setTempFilterStatus(String(val))}
              options={[{ label: "All Statuses", value: "" }, ...statusOptions]}
            />
          </View>
          <View className="mb-5">
            <Picker
              label="Filter by Type"
              value={tempFilterType}
              onValueChange={(val) => setTempFilterType(String(val))}
              options={[{ label: "All Types", value: "" }, ...typeOptions]}
            />
          </View>
          <View className="flex-row space-x-3">
            <Button
              variant="outline"
              onPress={resetFiltersAndSortInModal}
              className="flex-1"
            >
              Reset
            </Button>
            <Button onPress={applyFiltersAndSort} className="flex-1">
              Apply
            </Button>
          </View>
        </View>
      </Modal>

      <Modal
        visible={showAddEditModal}
        onClose={() => {
          setShowAddEditModal(false);
          resetForm();
        }}
        title={editingSlot ? "Edit Parking Slot" : "Add New Slot"}
      >
        <View>
          <Controller
            control={control}
            name="slotNumber"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Slot Number"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.slotNumber?.message}
                placeholder="e.g., A-001"
                containerClassName="mb-3"
              />
            )}
          />
          <Controller
            control={control}
            name="status"
            render={({ field: { onChange, value } }) => (
              <View className="mb-3">
                <Picker
                  label="Status"
                  value={value}
                  onValueChange={onChange}
                  options={statusOptions}
                  error={errors.status?.message}
                />
              </View>
            )}
          />
          <Controller
            control={control}
            name="type"
            render={({ field: { onChange, value } }) => (
              <View className="mb-5">
                <Picker
                  label="Slot Type"
                  value={value}
                  onValueChange={onChange}
                  options={typeOptions}
                  error={errors.type?.message}
                />
              </View>
            )}
          />
          <View className="flex-row space-x-3 mt-1">
            <Button
              variant="outline"
              onPress={() => {
                setShowAddEditModal(false);
                resetForm();
              }}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onPress={handleSubmit(onSubmit)}
              isLoading={
                createMutation.isPending ||
                updateMutation.isPending ||
                isSubmitting
              }
              className="flex-1"
            >
              {editingSlot ? "Save Changes" : "Create Slot"}
            </Button>
          </View>
        </View>
      </Modal>

      <Modal
        visible={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSlotToDelete(null);
        }}
        title="Confirm Deletion"
      >
        <View className="items-center mb-4">
          <Ionicons
            name="trash-outline"
            size={40}
            color={THEME_COLORS.occupied}
          />
        </View>
        <Text
          className={`font-dm-sans text-sm text-center mb-6 px-2 leading-relaxed text-[${THEME_COLORS.grayText}]`}
        >
          Are you sure you want to delete slot "{slotToDelete?.slotNumber}"?
          This action cannot be undone.
        </Text>
        <View className="flex-row space-x-3">
          <Button
            variant="outline"
            onPress={() => {
              setShowDeleteModal(false);
              setSlotToDelete(null);
            }}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            onPress={confirmDelete}
            isLoading={deleteMutation.isPending}
            variant="danger"
            className="flex-1"
          >
            Delete Slot
          </Button>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  slotItemCardShadow: {
    shadowColor: THEME_COLORS.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});
