import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';

export default function EconomicsPanel() {
  // Skeleton / placeholder for economics widgets — replace with real data visualizations later
  return (
    <View style={styles.container}>
      <ThemedText type="subtitle">Economics</ThemedText>
      <View style={styles.card}>
        <ThemedText type="defaultSemiBold">Global GDP growth</ThemedText>
        <ThemedText>Latest: 2.8% (YoY)</ThemedText>
      </View>
      <View style={styles.card}>
        <ThemedText type="defaultSemiBold">Inflation (sample)</ThemedText>
        <ThemedText>US: 3.4% • EU: 2.1% • JP: 0.9%</ThemedText>
      </View>
      <View style={styles.card}>
        <ThemedText type="defaultSemiBold">Markets</ThemedText>
        <ThemedText>Equities: mixed • FX: USD strengthened</ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 12,
  },
  card: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
});
