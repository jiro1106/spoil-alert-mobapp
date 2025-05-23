import React, { useEffect, useState, useCallback } from 'react';
import { SafeAreaView, View, Text, ActivityIndicator, ScrollView, RefreshControl } from 'react-native';
import { styles } from '../styles/FridgeScreen';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';

interface VegetableData {
  vegetable: string;
  temperature: number;
  humidity: number;
  co2: number;
  ethylene: number;
  timestamp: string;
}

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

// Per-vegetable thresholds for classification
const VEGETABLE_THRESHOLDS: Record<string, {
  fresh: { ethylene: number; co2: number };
  mild: { ethylene: number; co2: number };
}> = {
  Carrot: {
    fresh: { ethylene: 1, co2: 800 },   // <=1 ppm ethylene, <=800 ppm CO2
    mild:  { ethylene: 10, co2: 1200 }, // <=10 ppm ethylene, <=1200 ppm CO2
  },
  Okra: {
    fresh: { ethylene: 2, co2: 1000 },  // <=2 ppm ethylene, <=1000 ppm CO2
    mild:  { ethylene: 12, co2: 1500 }, // <=12 ppm ethylene, <=1500 ppm CO2
  },
  Lettuce: {
    fresh: { ethylene: 0.5, co2: 600 }, // <=0.5 ppm ethylene, <=600 ppm CO2
    mild:  { ethylene: 5, co2: 1000 },  // <=5 ppm ethylene, <=1000 ppm CO2
  },
};

const FridgeScreen = () => {
  const [fresh, setFresh] = useState<VegetableData[]>([]);
  const [mildSpoiled, setMildSpoiled] = useState<VegetableData[]>([]);
  const [spoiled, setSpoiled] = useState<VegetableData[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const getTips = (item: VegetableData, status: 'fresh' | 'mild' | 'spoiled'): string => {
    const tips = {
      fresh: [
        `Store ${item.vegetable} at ${item.temperature}°C to maintain freshness`,
        `Current humidity (${item.humidity}%) is ideal - maintain this level`,
        'Place in the crisper drawer to extend shelf life',
        'Keep away from ethylene-producing fruits',
      ],
      mild: [
        `${item.vegetable} needs attention - use within 48 hours`,
        `Lower the temperature by 2-3°C to slow spoilage`,
        `High ethylene (${item.ethylene}) detected - separate from other produce`,
        `CO₂ levels (${item.co2} ppm) rising - improve ventilation`,
      ],
      spoiled: [
        'Remove from fridge to prevent affecting other vegetables',
        `High readings suggest composting ${item.vegetable}`,
        'Clean the storage area to prevent contamination',
        'Review storage conditions for future items',
      ],
    };
    const availableTips = tips[status];
    return availableTips[Math.floor(Math.random() * availableTips.length)];
  };

  const showNotification = async (item: VegetableData, status: 'fresh' | 'mild' | 'spoiled') => {
    try {
      const statusEmojis = {
        fresh: '✅',
        mild: '⚠️',
        spoiled: '🚫',
      };
      const statusMessages = {
        fresh: `Your ${item.vegetable} is fresh and good to eat!`,
        mild: `Your ${item.vegetable} is showing signs of spoilage`,
        spoiled: `Your ${item.vegetable} has spoiled`,
      };
      const tip = getTips(item, status);
      const notificationData = {
        vegetable: item.vegetable,
        status,
        message: statusMessages[status],
        tips: tip,
      };
      await Notifications.scheduleNotificationAsync({
        content: {
          title: `${statusEmojis[status]} Vegetable Status Update`,
          body: `${statusMessages[status]}\n\nTip: ${tip}`,
          data: notificationData,
        },
        trigger: null,
      });
    } catch (error) {
      console.error('Error showing notification:', error);
    }
  };

  const fetchData = useCallback(async () => {
    setRefreshing(true);
    setLoading(true);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    try {
      const response = await fetch('http://192.168.1.2:3000/api/sensor-data', {
        signal: controller.signal,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: VegetableData[] = await response.json();
      // If the most recent entry is 'none', show no vegetables
      if (data.length > 0) {
        // Sort by timestamp descending
        const sorted = [...data].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        if (sorted[0].vegetable.toLowerCase() === 'none') {
          setFresh([]);
          setMildSpoiled([]);
          setSpoiled([]);
          setLoading(false);
          return;
        }
      }
      // Filter out entries where vegetable is 'none' (case-insensitive)
      const filteredData = data.filter(item => item.vegetable.toLowerCase() !== 'none');
      // Keep only the most recent entry for each vegetable
      const latestByVegetable = new Map<string, VegetableData>();
      filteredData.forEach(item => {
        if (!latestByVegetable.has(item.vegetable) || new Date(item.timestamp) > new Date(latestByVegetable.get(item.vegetable)!.timestamp)) {
          latestByVegetable.set(item.vegetable, item);
        }
      });
      const freshItems: VegetableData[] = [];
      const mildItems: VegetableData[] = [];
      const spoiledItems: VegetableData[] = [];
      Array.from(latestByVegetable.values()).forEach(item => {
        const thresholds = VEGETABLE_THRESHOLDS[item.vegetable];
        if (!thresholds) {
          spoiledItems.push(item); // Unknown vegetable, treat as spoiled
          return;
        }
        if (item.ethylene <= thresholds.fresh.ethylene && item.co2 <= thresholds.fresh.co2) {
          freshItems.push(item);
        } else if (
          (item.ethylene > thresholds.fresh.ethylene && item.ethylene <= thresholds.mild.ethylene) ||
          (item.co2 > thresholds.fresh.co2 && item.co2 <= thresholds.mild.co2)
        ) {
          mildItems.push(item);
        } else {
          spoiledItems.push(item);
          showNotification(item, 'spoiled');
        }
      });
      setFresh(freshItems);
      setMildSpoiled(mildItems);
      setSpoiled(spoiledItems);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    } finally {
      clearTimeout(timeoutId);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    const setupNotifications = async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        console.log('Notification permissions not granted');
        return;
      }
    };
    setupNotifications();
    fetchData();
    const intervalId = setInterval(fetchData, 300000); // 5 minutes
    return () => {
      clearInterval(intervalId);
      Notifications.cancelAllScheduledNotificationsAsync();
    };
  }, [fetchData]);

  const handleRefresh = useCallback(() => {
    fetchData();
  }, [fetchData]);

  const renderItems = (items: VegetableData[], type: 'fresh' | 'mild' | 'spoiled') => {
    const cardStyle = [
      styles.card,
      type === 'fresh' 
        ? styles.cardFresh 
        : type === 'mild' 
          ? styles.cardMildSpoiled 
          : styles.cardSpoiled
    ];
    const titleStyle = [
      styles.cardTitle,
      type === 'fresh'
        ? styles.cardTitleFresh
        : type === 'mild'
          ? styles.cardTitleMild
          : styles.cardTitleSpoiled
    ];
    const statusStyle = [
      styles.statusIndicator,
      type === 'fresh'
        ? styles.statusFresh
        : type === 'mild'
          ? styles.statusMild
          : styles.statusSpoiled
    ];
    return items.map((item: VegetableData, index: number) => (
      <View key={index} style={cardStyle}>
        <View style={statusStyle} />
        <Text style={titleStyle}>{item.vegetable}</Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Temperature:</Text>
          <Text style={styles.infoValue}>{item.temperature}°C</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Humidity:</Text>
          <Text style={styles.infoValue}>{item.humidity}%</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>CO₂:</Text>
          <Text style={styles.infoValue}>{item.co2} ppm</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Ethylene:</Text>
          <Text style={styles.infoValue}>{item.ethylene}</Text>
        </View>
        <Text style={styles.timestamp}>
          Last updated: {new Date(item.timestamp).toLocaleString()}
        </Text>
      </View>
    ));
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.mainContainer}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2c3e50" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.mainContainer}>
      <ScrollView
        style={styles.screenContainer}
        contentContainerStyle={styles.contentContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Vegetable Status</Text>
        </View>
        {fresh.length > 0 && (
          <View style={styles.titleContainer}>
            <Text style={[styles.title, styles.cardTitleFresh]}>Fresh Items</Text>
            {renderItems(fresh, 'fresh')}
          </View>
        )}
        {mildSpoiled.length > 0 && (
          <View style={styles.titleContainer}>
            <Text style={[styles.title, styles.cardTitleMild]}>Mildly Spoiled Items</Text>
            {renderItems(mildSpoiled, 'mild')}
          </View>
        )}
        {spoiled.length > 0 && (
          <View style={styles.titleContainer}>
            <Text style={[styles.title, styles.cardTitleSpoiled]}>Spoiled Items</Text>
            {renderItems(spoiled, 'spoiled')}
          </View>
        )}
        {fresh.length === 0 && mildSpoiled.length === 0 && spoiled.length === 0 && (
          <View style={styles.titleContainer}>
            <Text style={styles.title}>No vegetables found!</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default FridgeScreen;
