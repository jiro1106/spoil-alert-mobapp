import React, { useEffect, useState, useCallback, useRef } from 'react';
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

interface NotificationData {
  vegetable: string;
  status: 'fresh' | 'mild' | 'spoiled';
  message: string;
  tips: string;
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

const FridgeScreen = () => {
  const [fresh, setFresh] = useState<VegetableData[]>([]);
  const [mildSpoiled, setMildSpoiled] = useState<VegetableData[]>([]);
  const [spoiled, setSpoiled] = useState<VegetableData[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const notifiedSpoiled = useRef(new Set());

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

  const showNotification = async (item: VegetableData) => {
    try {
      if (notifiedSpoiled.current.has(item.vegetable)) return;
      notifiedSpoiled.current.add(item.vegetable);
      const statusEmojis = { spoiled: '🚫' };
      const statusMessages = { spoiled: `Your ${item.vegetable} has spoiled` };
      const tip = getTips(item, 'spoiled');
      const notificationData = {
        vegetable: item.vegetable,
        status: 'spoiled',
        message: statusMessages.spoiled,
        tips: tip,
      };
      await Notifications.scheduleNotificationAsync({
        content: {
          title: `${statusEmojis.spoiled} Vegetable Status Update`,
          body: `${statusMessages.spoiled}\n\nTip: ${tip}`,
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
    console.log('Starting data fetch...');
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
      // Keep only the most recent entry for each vegetable
      const latestByVegetable = new Map();
      data.forEach(item => {
        if (!latestByVegetable.has(item.vegetable)) {
          latestByVegetable.set(item.vegetable, item);
        }
      });
      // Only keep spoiled items
      const spoiledItems: VegetableData[] = Array.from(latestByVegetable.values()).filter(item => item.ethylene > 20 || item.co2 > 800);
      setSpoiled(spoiledItems);
      setLoading(false);
      // Notify for new spoiled items
      spoiledItems.forEach(item => showNotification(item));
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

        {spoiled.length > 0 ? (
          <View style={styles.titleContainer}>
            <Text style={[styles.title, styles.cardTitleSpoiled]}>Spoiled Items</Text>
            {renderItems(spoiled, 'spoiled')}
          </View>
        ) : (
          <View style={styles.titleContainer}>
            <Text style={styles.title}>No spoiled items!</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default FridgeScreen;
