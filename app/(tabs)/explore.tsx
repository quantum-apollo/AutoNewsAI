import { Image } from 'expo-image';
import React from 'react';
import { Platform, StyleSheet, useWindowDimensions, View } from 'react-native';
import MapView from '@/components/MapView';
import useMapData from '@/hooks/useMapData';
import { useRouter } from 'expo-router';

import SearchPanel from '@/components/SearchPanel';
import EconomicsPanel from '@/components/EconomicsPanel';
import BreakingCallout from '@/components/BreakingCallout';
import { Collapsible } from '@/components/Collapsible';
import { ExternalLink } from '@/components/ExternalLink';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';

export default function TabTwoScreen() {
  const { data } = useMapData();
  const { width } = useWindowDimensions();
  const isNarrow = width < 900;
  const [focused, setFocused] = React.useState<{ id?: string; latitude: number; longitude: number } | null>(null);
  const [breakingArticle, setBreakingArticle] = React.useState<any | null>(null);
  const router = useRouter();

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
      headerImage={
        <IconSymbol
          size={310}
          color="#808080"
          name="chevron.left.forwardslash.chevron.right"
          style={styles.headerImage}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Explore</ThemedText>
      </ThemedView>

      {/* Responsive 3-column layout: left=search, center=map, right=economics */}
      <View style={[styles.responsiveContainer, isNarrow && styles.responsiveStack]}>
        {/** left / search **/}
        <View style={[styles.leftColumn, isNarrow && styles.columnFull]}>
          <SearchPanel
            data={data}
            onSelect={(item) => {
              // center map on selected item
              setFocused({ id: item.id, latitude: item.latitude, longitude: item.longitude });
            }}
          />
        </View>

        {/** center / map **/}
        <View style={[styles.centerColumn, isNarrow && styles.columnFull]}>
          <MapView
            style={[styles.mapFull, isNarrow && { height: 420 }]}
            markers={data}
            focusMarker={focused ?? undefined}
            onMarkerPress={(id) => {
              const item = data.find((d) => d.id === id);
              if (!item) return;
              if (item.breaking && item.breakingArticles && item.breakingArticles.length > 0) {
                setBreakingArticle(item.breakingArticles[0]);
                return;
              }
              if (item?.type === 'politician') {
                // open politician profile
                router.push(`/politician/${id}`);
                return;
              }
            }}
            initialRegion={{ latitude: 20, longitude: 0, latitudeDelta: 80, longitudeDelta: 160 }}
          />
        </View>

        {/** right / economics **/}
        <View style={[styles.rightColumn, isNarrow && styles.columnFull]}>
          <EconomicsPanel />
        </View>
      </View>

      {breakingArticle && (
        <BreakingCallout article={breakingArticle} onClose={() => setBreakingArticle(null)} />
      )}

      <ThemedText style={{ marginTop: 12 }}>This app includes example code to help you get started.</ThemedText>
      <Collapsible title="File-based routing">
        <ThemedText>
          This app has two screens:{' '}
          <ThemedText type="defaultSemiBold">app/(tabs)/index.tsx</ThemedText> and{' '}
          <ThemedText type="defaultSemiBold">app/(tabs)/explore.tsx</ThemedText>
        </ThemedText>
        <ThemedText>
          The layout file in <ThemedText type="defaultSemiBold">app/(tabs)/_layout.tsx</ThemedText>{' '}
          sets up the tab navigator.
        </ThemedText>
        <ExternalLink href="https://docs.expo.dev/router/introduction">
          <ThemedText type="link">Learn more</ThemedText>
        </ExternalLink>
      </Collapsible>
      <Collapsible title="Android, iOS, and web support">
        <ThemedText>
          You can open this project on Android, iOS, and the web. To open the web version, press{' '}
          <ThemedText type="defaultSemiBold">w</ThemedText> in the terminal running this project.
        </ThemedText>
      </Collapsible>
      <Collapsible title="Images">
        <ThemedText>
          For static images, you can use the <ThemedText type="defaultSemiBold">@2x</ThemedText> and{' '}
          <ThemedText type="defaultSemiBold">@3x</ThemedText> suffixes to provide files for
          different screen densities
        </ThemedText>
        <Image source={require('@/assets/images/react-logo.png')} style={{ alignSelf: 'center' }} />
        <ExternalLink href="https://reactnative.dev/docs/images">
          <ThemedText type="link">Learn more</ThemedText>
        </ExternalLink>
      </Collapsible>
      <Collapsible title="Custom fonts">
        <ThemedText>
          Open <ThemedText type="defaultSemiBold">app/_layout.tsx</ThemedText> to see how to load{' '}
          <ThemedText style={{ fontFamily: 'SpaceMono' }}>
            custom fonts such as this one.
          </ThemedText>
        </ThemedText>
        <ExternalLink href="https://docs.expo.dev/versions/latest/sdk/font">
          <ThemedText type="link">Learn more</ThemedText>
        </ExternalLink>
      </Collapsible>
      <Collapsible title="Light and dark mode components">
        <ThemedText>
          This template has light and dark mode support. The{' '}
          <ThemedText type="defaultSemiBold">useColorScheme()</ThemedText> hook lets you inspect
          what the user&apos;s current color scheme is, and so you can adjust UI colors accordingly.
        </ThemedText>
        <ExternalLink href="https://docs.expo.dev/develop/user-interface/color-themes/">
          <ThemedText type="link">Learn more</ThemedText>
        </ExternalLink>
      </Collapsible>
      <Collapsible title="Animations">
        <ThemedText>
          This template includes an example of an animated component. The{' '}
          <ThemedText type="defaultSemiBold">components/HelloWave.tsx</ThemedText> component uses
          the powerful <ThemedText type="defaultSemiBold">react-native-reanimated</ThemedText>{' '}
          library to create a waving hand animation.
        </ThemedText>
        {Platform.select({
          ios: (
            <ThemedText>
              The <ThemedText type="defaultSemiBold">components/ParallaxScrollView.tsx</ThemedText>{' '}
              component provides a parallax effect for the header image.
            </ThemedText>
          ),
        })}
      </Collapsible>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  responsiveContainer: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
    marginTop: 8,
  },
  leftColumn: {
    width: 300,
    minWidth: 260,
    maxWidth: 360,
  },
  rightColumn: {
    width: 300,
    minWidth: 260,
    maxWidth: 360,
  },
  centerColumn: {
    flex: 1,
    minHeight: 360,
  },
  mapFull: {
    height: 520,
    borderRadius: 8,
    overflow: 'hidden',
  },
  responsiveStack: {
    flexDirection: 'column',
    gap: 8,
  },
  columnFull: {
    width: '100%',
  },
});
