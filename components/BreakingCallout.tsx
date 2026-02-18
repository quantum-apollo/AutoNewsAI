import React from 'react';
import { Linking, StyleSheet, TouchableOpacity, View } from 'react-native';
import { ThemedText } from './ThemedText';

export default function BreakingCallout({ article, onClose }: { article?: any; onClose?: () => void }) {
  if (!article) return null;
  return (
    <View style={styles.container} pointerEvents="box-none">
      <View style={styles.card}>
        <ThemedText type="defaultSemiBold">{article.title}</ThemedText>
        {article.sourceName && <ThemedText>{article.sourceName}</ThemedText>}
        {article.publishedAt && <ThemedText>{new Date(article.publishedAt).toLocaleString()}</ThemedText>}
        <ThemedText style={{ marginTop: 8 }}>{article.description}</ThemedText>
        <View style={styles.actions}>
          <TouchableOpacity onPress={() => Linking.openURL(article.url)} style={styles.button}>
            <ThemedText type="defaultSemiBold">Open source</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity onPress={onClose} style={styles.button}>
            <ThemedText>Close</ThemedText>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { position: 'absolute', left: 12, right: 12, bottom: 18, alignItems: 'center' },
  card: { backgroundColor: '#fff', padding: 12, borderRadius: 10, width: '100%', shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8 },
  actions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 8, marginTop: 8 },
  button: { paddingHorizontal: 8, paddingVertical: 6 },
});