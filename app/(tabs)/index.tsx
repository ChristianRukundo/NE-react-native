import { View, Text, ScrollView, TouchableOpacity, StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { vehicleApi, parkingSlotApi } from "../../lib/api";
import { router } from "expo-router";


interface ParkingSlot {
    id: string;
    status: "Occupied" | "Available";
    slotNumber: string,
    type: String,
    vehicleId: string,

}


export default function Dashboard() {
  const { data: vehicles } = useQuery({
    queryKey: ["vehicles"],
    queryFn: vehicleApi.getAll,
  });

  const { data: parkingSlots } = useQuery({
    queryKey: ["parking-slots"],
    queryFn: parkingSlotApi.getAll,
  });


  const totalVehicles = vehicles?.data?.length || 0;
  const totalSlots = parkingSlots?.data?.length || 0;
  const occupiedSlots =
    parkingSlots?.data?.filter((slot: ParkingSlot) => slot.status === "Occupied").length ||
    0;
  const availableSlots = totalSlots - occupiedSlots;

  const stats = [
    {
      title: "Vehicles",
      count: totalVehicles,
      icon: "car",
      color: "bg-pink-100",
      iconColor: "#EC4899",
      route: "/(tabs)/vehicles" as const,
    },
    {
      title: "Parking\nSlots",
      count: totalSlots,
      icon: "business",
      color: "bg-orange-100",
      iconColor: "#F97316",
      route: "/(tabs)/parking-slots" as const,
    },
    {
      title: "Available\nSlots",
      count: availableSlots,
      icon: "checkmark-circle",
      color: "bg-blue-100",
      iconColor: "#3B82F6",
      route: "/(tabs)/parking-slots" as const,
    },
  ];

  const services = [
    {
      name: "Cleaning",
      icon: "leaf",
      color: "bg-green-100",
      iconColor: "#10B981",
      badge: "New",
    },
    {
      name: "Security",
      icon: "shield-checkmark",
      color: "bg-blue-100",
      iconColor: "#3B82F6",
    },
    {
      name: "Maintenance",
      icon: "construct",
      color: "bg-purple-100",
      iconColor: "#8B5CF6",
    },
    {
      name: "Reports",
      icon: "document-text",
      color: "bg-red-100",
      iconColor: "#EF4444",
    },
  ];

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#2D2D2D" />
      <SafeAreaView className="flex-1 bg-dark-200" edges={["top"]}>
   <View className="flex-row items-center justify-between px-6 py-4">
        <TouchableOpacity>
          <Ionicons name="grid" size={24} color="black" />
        </TouchableOpacity>
        <View className="flex-row items-center">
          <Ionicons name="business" size={24} color="black" />
          <Text className="text-black font-dm-sans-bold text-lg ml-2">
            ParkEasy
          </Text>
        </View>
        <TouchableOpacity className="relative">
          <Ionicons name="notifications" size={24} color="black" />
          <View className="absolute -top-1 -right-1 w-3 h-3 bg-primary-500 rounded-full" />
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View className="flex-1 bg-white rounded-t-[40px] mt-4">
        <ScrollView className="flex-1 px-6 pt-8">
          {/* Welcome Section */}
          <View className="mb-8">
            <Text className="text-4xl font-dm-sans-bold text-gray-900 mb-2">
              Welcome 👋
            </Text>
            <Text className="text-lg font-dm-sans text-gray-500">
              Need parking management today?
            </Text>
          </View>

          {/* Stats Cards */}
          <View className="flex-row justify-between mb-8">
            {stats.map((stat, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => router.push(stat.route)}
                className={`${stat.color}  rounded-3xl p-6 flex-1 ${
                  index < stats.length - 1 ? "mr-3" : ""
                }`}
              >
                <View
                  className={`w-12 h-12 rounded-2xl items-center justify-center mb-4`}
                  style={{ backgroundColor: stat.iconColor + "20" }}
                >
                  <Ionicons
                    name={stat.icon as any}
                    size={24}
                    color={stat.iconColor}
                  />
                </View>
                <Text className="font-dm-sans-bold text-lg text-gray-900 mb-1">
                  {stat.count}
                </Text>
                <Text className="font-dm-sans text-sm text-gray-600 leading-4">
                  {stat.title}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Offers & News */}
          <View className="mb-8">
            <Text className="text-2xl font-dm-sans-bold text-gray-900 mb-4">
              Offers & News
            </Text>

            <View className="flex-row mb-4">
              <TouchableOpacity className="bg-primary-500 px-6 py-3 rounded-full mr-4">
                <Text className="text-white font-dm-sans-medium">Trending</Text>
              </TouchableOpacity>
              <TouchableOpacity className="border border-gray-200 px-6 py-3 rounded-full mr-4">
                <Text className="text-gray-600 font-dm-sans-medium">
                  Promotion
                </Text>
              </TouchableOpacity>
              <TouchableOpacity className="border border-gray-200 px-6 py-3 rounded-full">
                <Text className="text-gray-600 font-dm-sans-medium">New</Text>
              </TouchableOpacity>
            </View>

            {/* Promotional Cards */}
            <View className="flex-row">
              <View className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-3xl p-6 flex-1 mr-4">
                <View className="flex-row items-center mb-2">
                  <Ionicons name="business" size={20} color="white" />
                  <Text className="text-white font-dm-sans-bold ml-2">
                    ParkEasy
                  </Text>
                </View>
                <View className="bg-white/20 px-3 py-1 rounded-full self-start mb-3">
                  <Text className="text-white font-dm-sans text-xs">
                    Limited Offer
                  </Text>
                </View>
                <Text className="text-white font-dm-sans-bold text-2xl mb-1">
                  40% OFF
                </Text>
                <Text className="text-white font-dm-sans text-sm">
                  On First Month Parking
                </Text>
              </View>

              <View className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-3xl p-6 flex-1">
                <View className="flex-row items-center mb-2">
                  <Ionicons name="business" size={20} color="white" />
                  <Text className="text-white font-dm-sans-bold ml-2">
                    ParkEasy
                  </Text>
                </View>
                <View className="bg-white/20 px-3 py-1 rounded-full self-start mb-3">
                  <Text className="text-white font-dm-sans text-xs">
                    New User
                  </Text>
                </View>
                <Text className="text-white font-dm-sans-bold text-2xl mb-1">
                  15% OFF
                </Text>
                <Text className="text-white font-dm-sans text-sm">
                  Online Payment
                </Text>
              </View>
            </View>
          </View>

          {/* Other Services */}
          <View className="mb-8">
            <Text className="text-2xl font-dm-sans-bold text-gray-900 mb-4">
              Other Services
            </Text>

            <View className="flex-row flex-wrap">
              {services.map((service, index) => (
                <TouchableOpacity
                  key={index}
                  className="w-1/4 items-center mb-6"
                >
                  <View className="relative">
                    <View
                      className={`w-16 h-16 rounded-2xl items-center justify-center ${service.color} mb-2`}
                    >
                      <Ionicons
                        name={service.icon as any}
                        size={24}
                        color={service.iconColor}
                      />
                    </View>
                    {service.badge && (
                      <View className="absolute -top-2 -right-2 bg-green-500 px-2 py-1 rounded-full">
                        <Text className="text-white font-dm-sans text-xs">
                          {service.badge}
                        </Text>
                      </View>
                    )}
                  </View>
                  <Text className="font-dm-sans text-sm text-gray-900 text-center">
                    {service.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

        </ScrollView>
        </View>
      </SafeAreaView>
    </>
  );
}
