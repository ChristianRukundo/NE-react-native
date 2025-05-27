"use client";
import { View, Animated, Easing } from "react-native";
import { useEffect, useRef } from "react";

interface SkeletonLoaderProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: any;
}

export function SkeletonLoader({
  width = "100%",
  height = 20,
  borderRadius = 8,
  style,
}: SkeletonLoaderProps) {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1000,
          easing: Easing.ease,
          useNativeDriver: false,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 1000,
          easing: Easing.ease,
          useNativeDriver: false,
        }),
      ])
    );
    animation.start();

    return () => animation.stop();
  }, [animatedValue]);

  const backgroundColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["#f3f4f6", "#e5e7eb"],
  });

  return (
    <Animated.View
      style={[
        {
          width,
          height,
          borderRadius,
          backgroundColor,
        },
        style,
      ]}
    />
  );
}

export function ExpenseItemSkeleton() {
  return (
    <View className="bg-white p-5 mx-4 my-2 rounded-2xl shadow-sm border border-gray-100">
      <View className="flex-row justify-between items-start mb-3">
        <View className="flex-1 mr-3">
          <SkeletonLoader
            width="80%"
            height={20}
            borderRadius={6}
            style={{ marginBottom: 8 }}
          />
          <SkeletonLoader
            width="60%"
            height={16}
            borderRadius={4}
            style={{ marginBottom: 8 }}
          />
          <SkeletonLoader width="40%" height={12} borderRadius={4} />
        </View>
        <View className="items-end">
          <SkeletonLoader width={80} height={24} borderRadius={6} />
        </View>
      </View>
      <View className="flex-row justify-end items-center border-t border-gray-100 pt-3 mt-3">
        <SkeletonLoader
          width={32}
          height={32}
          borderRadius={16}
          style={{ marginRight: 12 }}
        />
        <SkeletonLoader width={80} height={32} borderRadius={16} />
      </View>
    </View>
  );
}

export function SummaryCardSkeleton() {
  return (
    <View className="mx-4 mt-4 mb-2">
      <View className="bg-white p-6 rounded-3xl shadow-lg border border-gray-100">
        <View className="flex-row items-center justify-between">
          <View>
            <SkeletonLoader
              width={100}
              height={14}
              borderRadius={4}
              style={{ marginBottom: 8 }}
            />
            <SkeletonLoader width={60} height={32} borderRadius={6} />
          </View>
          <SkeletonLoader width={64} height={64} borderRadius={32} />
        </View>
      </View>
    </View>
  );
}
