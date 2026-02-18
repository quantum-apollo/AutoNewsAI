import React from 'react';
import { ScrollView, StyleSheet, View, Image } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { getPoliticianById, searchNewsByPoliticianId } from '@/lib/meilisearch';
import { ThemedText } from '@/components/ThemedText';

export default function PoliticianProfile() {
  const params = useLocalSearchParams() as { id?: string };
  const [data, setData] = React.useState<any | null>(null);
  const [news, setNews] = React.useState<any[]>([]);

  React.useEffect(() => {
    let mounted = true;
    (async () => {
      if (!params.id) return;
      const p = await getPoliticianById(params.id!);
      if (mounted) setData(p || null);
      const related = await searchNewsByPoliticianId(params.id!, 8);
      if (mounted) setNews(related || []);
    })();
    return () => {
      mounted = false;
    };
  }, [params.id]);

  if (!params.id) return null;

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 16 }}>
      <ThemedText type="title">Politician</ThemedText>
      <View style={styles.header}>
        {data?.photoUrl ? (
          <Image source={{ uri: data.photoUrl }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder} />
        )}
        <View style={{ flex: 1 }}>
          <ThemedText type="title">{data?.name || params.id}</ThemedText>
          <ThemedText>{data?.office || data?.party || ''}</ThemedText>
          <ThemedText>{data?.country || ''}</ThemedText>
        </View>
      </View>

      <View style={styles.section}>
        <ThemedText type="subtitle">Summary</ThemedText>
        <ThemedText>{data?.bio || 'No summary available.'}</ThemedText>
      </View>

      <View style={styles.section}>
        <ThemedText type="subtitle">Recent mentions</ThemedText>
        {news.map((n) => (
          <View key={n.id} style={styles.newsItem}>
            <ThemedText type="defaultSemiBold">{n.title}</ThemedText>
            <ThemedText>{n.sourceName} • {n.publishedAt}</ThemedText>
          </View>
        ))}
        {news.length === 0 && <ThemedText>No recent articles found.</ThemedText>}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', gap: 12, alignItems: 'center', marginTop: 12 },
  avatar: { width: 88, height: 88, borderRadius: 44, backgroundColor: '#eee' },
  avatarPlaceholder: { width: 88, height: 88, borderRadius: 44, backgroundColor: '#ddd' },
  section: { marginTop: 16 },
  newsItem: { marginTop: 8, paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
});