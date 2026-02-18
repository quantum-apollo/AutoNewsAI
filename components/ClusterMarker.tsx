import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

type Props = {
  count: number;
  onPress?: () => void;
};

export default function ClusterMarker({ count, onPress }: Props) {
  return (
    <TouchableOpacity accessibilityLabel={`Cluster with ${count} items`} onPress={onPress} style={styles.container}>
      <Text style={styles.text}>{count}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ff6b6b',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  text: {
    color: '#fff',
    fontWeight: '700',
  },
});
