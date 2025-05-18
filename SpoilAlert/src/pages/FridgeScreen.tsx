import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, Text, ActivityIndicator, ScrollView } from 'react-native';
import { styles } from '../styles/FridgeScreen';
import * as Notifications from 'expo-notifications';

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
      } as Record<string, unknown>;

      await Notifications.scheduleNotificationAsync({
        content: {
          title: `${statusEmojis[status]} Vegetable Status Update`,
          body: `${statusMessages[status]}\n\nTip: ${tip}`,
          data: notificationData,
        },
        trigger: null, // Send immediately
      });

      // Schedule the next check
      setTimeout(() => {
        showNotification(item, status).catch(console.error);
      }, 300000); // 5 minutes
    } catch (error) {
      console.error('Error showing notification:', error);
    }
  };

  useEffect(() => {
    const setupNotifications = async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        console.log('Notification permissions not granted');
        return;
      }
    };

    setupNotifications();

    const fetchData = async () => {
      console.log('Starting data fetch...');
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      try {
        const response = await fetch('http://192.168.1.31:3000/api/sensor-data', { // Edit your IP address here change the 192.168.1.31 to your IP address
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
        
        const freshItems: VegetableData[] = [];
        const mildItems: VegetableData[] = [];
        const spoiledItems: VegetableData[] = [];

        for (const item of data) {
          const { ethylene, co2 } = item;

          if (ethylene <= 10 && co2 <= 400) {
            freshItems.push(item);
            await showNotification(item, 'fresh');
          } else if ((ethylene > 10 && ethylene <= 20) || (co2 > 400 && co2 <= 800)) {
            mildItems.push(item);
            await showNotification(item, 'mild');
          } else {
            spoiledItems.push(item);
            await showNotification(item, 'spoiled');
          }
        }

        setFresh(freshItems);
        setMildSpoiled(mildItems);
        setSpoiled(spoiledItems);
        setLoading(false);

      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      } finally {
        clearTimeout(timeoutId);
      }
    };

    fetchData();
    const intervalId = setInterval(fetchData, 300000); // 5 minutes

    return () => {
      clearInterval(intervalId);
      Notifications.cancelAllScheduledNotificationsAsync();
    };
  }, []);

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
      </ScrollView>
    </SafeAreaView>
  );
};

export default FridgeScreen;
