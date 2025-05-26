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
import { useForm, Controller, SubmitHandler } from "react-hook-form"; // Import SubmitHandler
import { zodResolver } from "@hookform/resolvers/zod";
import Toast from "react-native-toast-message";

import { vehicleApi } from "../../lib/api";
import { vehicleSchema, type VehicleFormData } from "../../lib/validations";
import type { Vehicle } from "../../types";

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
  info: "#3B82F6",
  infoBg: "rgba(59, 130, 246, 0.1)",
  borderColor: "#E5E7EB",
  cardBackground: "#FFFFFF",
  cardBorder: "#F3F4F6",
  shadowColor: "rgba(0,0,0,0.05)",
  danger: "#EF4444",
};

const vehicleTypeOptions: PickerOption[] = [
  { label: "Car", value: "Car" },
  { label: "Motorcycle", value: "Motorcycle" },
  { label: "Truck", value: "Truck" },
  { label: "Van", value: "Van" },
];

// Helper to ensure vehicleType is one of the allowed enum values
const getValidVehicleType = (type?: string): VehicleFormData["vehicleType"] => {
  const validTypes: VehicleFormData["vehicleType"][] = [
    "Car",
    "Motorcycle",
    "Truck",
    "Van",
  ];
  if (type && validTypes.includes(type as VehicleFormData["vehicleType"])) {
    return type as VehicleFormData["vehicleType"];
  }
  return "Car"; // Default or first valid option
};

const sortVehicleOptions: PickerOption[] = [
  { label: "License Plate (A-Z)", value: "licensePlate_asc" },
  { label: "License Plate (Z-A)", value: "licensePlate_desc" },
  { label: "Owner Name (A-Z)", value: "ownerName_asc" },
  { label: "Vehicle Type (A-Z)", value: "vehicleType_asc" },
];

export default function VehiclesScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddEditModal, setShowAddEditModal] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [vehicleToDelete, setVehicleToDelete] = useState<Vehicle | null>(null);
  const [showFilterSortModal, setShowFilterSortModal] = useState(false);

  const [tempSortBy, setTempSortBy] = useState<string>(
    sortVehicleOptions[0].value as string
  );
  const [tempFilterType, setTempFilterType] = useState<string>("");

  const [appliedSortBy, setAppliedSortBy] = useState<string>(
    sortVehicleOptions[0].value as string
  );
  const [appliedFilterType, setAppliedFilterType] = useState<string>("");

  const queryClient = useQueryClient();

  const {
    data: vehiclesResponse,
    isLoading: isLoadingVehicles,
    isError: isErrorVehicles,
    refetch: refetchVehicles,
    isRefetching: isRefetchingVehicles,
  } = useQuery<{ data: Vehicle[] }, Error>({
    queryKey: ["vehicles"],
    queryFn: vehicleApi.getAll,
  });

  const vehicles = vehiclesResponse?.data;

  const handleError = (error: Error | any, defaultMessage: string) => {
    console.error(defaultMessage, error);
    const message =
      error?.response?.data?.message || error?.message || defaultMessage;
    Toast.show({ type: "error", text1: "Error", text2: message });
  };

  const createMutation = useMutation<{ data: Vehicle }, Error, VehicleFormData>(
    {
      mutationFn: (newData) => vehicleApi.create(newData),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["vehicles"] });
        setShowAddEditModal(false);
        resetForm();
        Toast.show({
          type: "success",
          text1: "Success",
          text2: "Vehicle added successfully.",
        });
      },
      onError: (error) => handleError(error, "Failed to add vehicle."),
    }
  );

  const updateMutation = useMutation<
    { data: Vehicle },
    Error,
    { id: string; data: VehicleFormData }
  >({
    mutationFn: (variables) => vehicleApi.update(variables.id, variables.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vehicles"] });
      setShowAddEditModal(false);
      resetForm();
      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Vehicle updated successfully.",
      });
    },
    onError: (error) => handleError(error, "Failed to update vehicle."),
  });

  const deleteMutation = useMutation<
    { data: { success: boolean; deletedItem?: Vehicle } },
    Error,
    string
  >({
    mutationFn: (id) => vehicleApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vehicles"] });
      setShowDeleteModal(false);
      setVehicleToDelete(null);
      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Vehicle deleted successfully.",
      });
    },
    onError: (error) => handleError(error, "Failed to delete vehicle."),
  });

  const {
    control,
    handleSubmit, // This is correctly typed by useForm<VehicleFormData>
    reset,
    formState: { errors, isSubmitting },
  } = useForm<VehicleFormData>({
    resolver: zodResolver(vehicleSchema),
    defaultValues: {
      // Ensure these match VehicleFormData strictly
      licensePlate: "",
      vehicleType: "Car", // Use a valid default from the enum
      ownerName: "",
      contactNumber: "",
    },
  });

  const resetForm = useCallback(() => {
    reset({
      // Ensure reset values match VehicleFormData strictly
      licensePlate: "",
      vehicleType: "Car", // CORRECTED: Use a default valid enum value
      ownerName: "",
      contactNumber: "",
    });
    setEditingVehicle(null);
  }, [reset]);

  // Explicitly type onSubmit with SubmitHandler
  const onSubmit: SubmitHandler<VehicleFormData> = (data) => {
    if (editingVehicle?.id) {
      updateMutation.mutate({ id: editingVehicle.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle);
    const formData: VehicleFormData = {
      licensePlate: vehicle.licensePlate,
      // CORRECTED: Use the helper or ensure vehicle.vehicleType is valid
      vehicleType: getValidVehicleType(vehicle.vehicleType),
      ownerName: vehicle.ownerName,
      contactNumber: vehicle.contactNumber,
    };
    reset(formData);
    setShowAddEditModal(true);
  };

  const openAddNewModal = () => {
    resetForm();
    setShowAddEditModal(true);
  };

  const handleDeleteConfirmation = (vehicle: Vehicle) => {
    setVehicleToDelete(vehicle);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (vehicleToDelete?.id) {
      deleteMutation.mutate(vehicleToDelete.id);
    }
  };

  const openFilterSortModal = () => {
    setTempSortBy(appliedSortBy);
    setTempFilterType(appliedFilterType);
    setShowFilterSortModal(true);
  };

  const applyFiltersAndSort = () => {
    setAppliedSortBy(tempSortBy);
    setAppliedFilterType(tempFilterType);
    setShowFilterSortModal(false);
  };

  const resetFiltersAndSortInModal = () => {
    setTempSortBy(sortVehicleOptions[0].value as string);
    setTempFilterType("");
  };

  const filteredAndSortedVehicles = useMemo(() => {
    if (!vehicles) return [];
    const localVehicles = [...vehicles];

    return localVehicles
      .filter((vehicle) => {
        const searchLower = searchQuery.toLowerCase();
        const matchesSearch =
          vehicle.licensePlate.toLowerCase().includes(searchLower) ||
          vehicle.ownerName.toLowerCase().includes(searchLower);
        const matchesTypeFilter =
          !appliedFilterType || vehicle.vehicleType === appliedFilterType;
        return matchesSearch && matchesTypeFilter;
      })
      .sort((a, b) => {
        switch (appliedSortBy) {
          case "licensePlate_asc":
            return a.licensePlate.localeCompare(b.licensePlate);
          case "licensePlate_desc":
            return b.licensePlate.localeCompare(a.licensePlate);
          case "ownerName_asc":
            return a.ownerName.localeCompare(b.ownerName);
          case "vehicleType_asc":
            return a.vehicleType.localeCompare(b.vehicleType);
          default:
            return 0;
        }
      });
  }, [vehicles, searchQuery, appliedSortBy, appliedFilterType]);

  const getVehicleTypeIcon = (
    type: Vehicle["vehicleType"]
  ): keyof typeof Ionicons.glyphMap => {
    const typeLower = String(type).toLowerCase(); // Ensure type is string for toLowerCase
    if (
      typeLower.includes("car") ||
      typeLower.includes("sedan") ||
      typeLower.includes("suv")
    )
      return "car-sport-outline";
    if (typeLower.includes("motorcycle") || typeLower.includes("bike"))
      return "bicycle-outline";
    if (typeLower.includes("truck")) return "bus-outline";
    if (typeLower.includes("van")) return "bus-outline";
    return "help-circle-outline";
  };

  const renderVehicleItem = ({ item }: { item: Vehicle }) => (
    <View
      className={`rounded-2xl p-4 mb-4 border shadow-sm bg-[${THEME_COLORS.cardBackground}] border-[${THEME_COLORS.cardBorder}]`}
      style={styles.cardShadow}
    >
      <View className="flex-row items-center justify-between mb-3">
        <View className="flex-row items-center flex-1 mr-2">
          <View
            className="w-10 h-10 rounded-lg items-center justify-center mr-3"
            style={{ backgroundColor: THEME_COLORS.infoBg }}
          >
            <Ionicons
              name={getVehicleTypeIcon(item.vehicleType)}
              size={20}
              color={THEME_COLORS.info}
            />
          </View>
          <View className="flex-1">
            <Text
              className={`font-dm-sans-bold text-base text-[${THEME_COLORS.darkText}]`}
              numberOfLines={1}
            >
              {item.licensePlate}
            </Text>
            <Text
              className={`font-dm-sans text-xs text-[${THEME_COLORS.grayText}]`}
            >
              {item.vehicleType}
            </Text>
          </View>
        </View>
        <View className="flex-row items-center">
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
              color={THEME_COLORS.danger}
            />
          </TouchableOpacity>
        </View>
      </View>

      <View className={`border-t pt-3 border-[${THEME_COLORS.cardBorder}]`}>
        <View className="flex-row justify-between mb-1">
          <Text
            className={`font-dm-sans text-xs text-[${THEME_COLORS.grayText}]`}
          >
            Owner:
          </Text>
          <Text
            className={`font-dm-sans-medium text-xs text-right text-[${THEME_COLORS.darkText}]`}
            numberOfLines={1}
          >
            {item.ownerName}
          </Text>
        </View>
        <View className="flex-row justify-between">
          <Text
            className={`font-dm-sans text-xs text-[${THEME_COLORS.grayText}]`}
          >
            Contact:
          </Text>
          <Text
            className={`font-dm-sans-medium text-xs text-right text-[${THEME_COLORS.darkText}]`}
          >
            {item.contactNumber}
          </Text>
        </View>
      </View>
    </View>
  );

  if (isLoadingVehicles && !isRefetchingVehicles) {
    return (
      <SafeAreaView
        className={`flex-1 justify-center items-center bg-[${THEME_COLORS.darkBackground}]`}
      >
        <ActivityIndicator size="large" color={THEME_COLORS.primary} />
        <Text className={`font-dm-sans text-[${THEME_COLORS.lightText}] mt-2`}>
          Loading Vehicles...
        </Text>
      </SafeAreaView>
    );
  }

  if (isErrorVehicles && !vehiclesResponse?.data?.length) {
    return (
      <SafeAreaView
        className={`flex-1 justify-center items-center px-6 bg-[${THEME_COLORS.darkBackground}]`}
      >
        <Ionicons
          name="car-sport-outline"
          size={48}
          color={THEME_COLORS.grayText}
        />
        <Text
          className={`font-dm-sans text-center mt-2 mb-4 text-[${THEME_COLORS.lightText}]`}
        >
          Failed to load vehicles. Please check your connection.
        </Text>
        <Button
          onPress={() => refetchVehicles()}
          isLoading={isRefetchingVehicles}
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
      <Header title="Vehicle Management" />
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
              placeholder="Search license or owner..."
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
            Add New Vehicle
          </Button>
        </View>

        <FlatList
          data={filteredAndSortedVehicles}
          renderItem={renderVehicleItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingBottom: 120,
            paddingTop: 8,
          }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefetchingVehicles}
              onRefresh={refetchVehicles}
              tintColor={THEME_COLORS.primary}
              colors={[THEME_COLORS.primary]}
            />
          }
          ListEmptyComponent={
            <View className="flex-1 items-center justify-center mt-16 pt-10">
              <Ionicons
                name="car-outline"
                size={40}
                color={THEME_COLORS.mediumGrayText}
              />
              <Text
                className={`font-dm-sans mt-3 text-sm text-[${THEME_COLORS.grayText}]`}
              >
                No vehicles found.
              </Text>
              {(appliedFilterType || searchQuery) && (
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
        title="Filter & Sort Vehicles"
      >
        <View>
          <View className="mb-3">
            <Picker
              label="Sort By"
              value={tempSortBy}
              onValueChange={(val) => setTempSortBy(String(val))}
              options={sortVehicleOptions}
            />
          </View>
          <View className="mb-5">
            <Picker
              label="Filter by Vehicle Type"
              value={tempFilterType}
              onValueChange={(val) => setTempFilterType(String(val))}
              options={[
                { label: "All Types", value: "" },
                ...vehicleTypeOptions,
              ]}
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
        title={editingVehicle ? "Edit Vehicle" : "Add New Vehicle"}
      >
        <View>
          <Controller
            control={control}
            name="licensePlate"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="License Plate"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.licensePlate?.message}
                placeholder="e.g., ABC-123"
                containerClassName="mb-3"
              />
            )}
          />
          <Controller
            control={control}
            name="vehicleType" // This is type VehicleFormData['vehicleType']
            render={({ field: { onChange, value } }) => (
              <View className="mb-3">
                <Picker
                  label="Vehicle Type"
                  value={value} // Value is strictly "Car" | "Motorcycle" | "Truck" | "Van"
                  onValueChange={(val) =>
                    onChange(val as VehicleFormData["vehicleType"])
                  } // Ensure val is cast if Picker's onValueChange is less specific
                  options={vehicleTypeOptions} // Options values should match VehicleFormData['vehicleType']
                  error={errors.vehicleType?.message}
                />
              </View>
            )}
          />
          <Controller
            control={control}
            name="ownerName"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Owner Name"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.ownerName?.message}
                placeholder="Enter owner's full name"
                containerClassName="mb-3"
              />
            )}
          />
          <Controller
            control={control}
            name="contactNumber"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Contact Number"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.contactNumber?.message}
                placeholder="+1234567890"
                keyboardType="phone-pad"
                containerClassName="mb-5"
              />
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
              onPress={handleSubmit(onSubmit)} // handleSubmit is correctly typed
              isLoading={
                createMutation.isPending ||
                updateMutation.isPending ||
                isSubmitting
              }
              className="flex-1"
            >
              {editingVehicle ? "Save Changes" : "Add Vehicle"}
            </Button>
          </View>
        </View>
      </Modal>

      <Modal
        visible={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setVehicleToDelete(null);
        }}
        title="Confirm Deletion"
      >
        <View className="items-center mb-4">
          <Ionicons
            name="car-sport-outline"
            size={40}
            color={THEME_COLORS.danger}
          />
        </View>
        <Text
          className={`font-dm-sans text-sm text-center mb-6 px-2 leading-relaxed text-[${THEME_COLORS.grayText}]`}
        >
          Are you sure you want to delete vehicle "
          {vehicleToDelete?.licensePlate}"? This action cannot be undone.
        </Text>
        <View className="flex-row space-x-3">
          <Button
            variant="outline"
            onPress={() => {
              setShowDeleteModal(false);
              setVehicleToDelete(null);
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
            Delete Vehicle
          </Button>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  cardShadow: {
    shadowColor: THEME_COLORS.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});
