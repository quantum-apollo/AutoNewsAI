import React, { useMemo, useState } from 'react';
import { FlatList, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';

type Marker = {
  id: string;
  latitude: number;
  longitude: number;
  title?: string;
  type?: string;
  party?: string;
  breaking?: boolean;
  breakingArticles?: any[];
};

import useSearch from '@/hooks/useSearch';

export default function SearchPanel({ data, onSelect }: { data?: Marker[]; onSelect?: (m: Marker) => void }) {
  const { query, setQuery, results, loading } = useSearch();
  const [localQuery, setLocalQuery] = useState('');

  // If user hasn't typed, fall back to local `data` (map points). Otherwise show Meilisearch results.
  const items = localQuery.trim() === '' ? data || [] : results;

  return (
    <View style={styles.container}>
      <ThemedText type="subtitle">Search</ThemedText>
      <TextInput
        placeholder="Search politicians, countries, topics..."
        value={localQuery}
        onChangeText={(t) => {
          setLocalQuery(t);
          setQuery(t);
        }}
        style={styles.input}
        accessibilityLabel="Search news and politicians"
      />

      <FlatList
        data={items}
        keyExtractor={(i) => i.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => onSelect?.(item)} style={styles.row}>
            <ThemedText type="defaultSemiBold">{item.title}</ThemedText>
            {item.party && <ThemedText>{` • ${item.party}`}</ThemedText>}
          </TouchableOpacity>
        )}
        ItemSeparatorComponent={() => <View style={styles.sep} />}
        style={styles.list}
        ListEmptyComponent={<ThemedText>{loading ? 'Searching…' : 'No results'}</ThemedText>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 12,
    backgroundColor: 'transparent',
  },
  input: {
    marginTop: 8,
    marginBottom: 8,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    backgroundColor: '#fff',
  },
  list: {
    maxHeight: 420,
  },
  row: {
    paddingVertical: 10,
  },
  sep: {
    height: 1,
    backgroundColor: '#f0f0f0',
  },
});
