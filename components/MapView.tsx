import React from 'react';
import { Platform, StyleSheet, View, Text, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';

// NOTE: expo-maps requires a development build (EAS) to test native features on device.
// On iOS we'll use AppleMaps (expo-maps). On Android we currently render a MapLibre WebView fallback
// to avoid requiring a Google Maps API key for the MVP.

type Marker = {
  id: string;
  latitude: number;
  longitude: number;
  title?: string;
  subtitle?: string;
  type?: string;
  breaking?: boolean;
  breakingArticles?: any[];
};

type Region = {
  latitude: number;
  longitude: number;
  latitudeDelta?: number;
  longitudeDelta?: number;
};

type Props = {
  markers?: Marker[];
  initialRegion?: Region;
  style?: any;
  onMarkerPress?: (id: string) => void;
  onClusterPress?: (clusterId: number) => void;
  focusMarker?: { id?: string; latitude: number; longitude: number; zoom?: number } | null;
};

export default function MapView({ markers = [], initialRegion, style, onMarkerPress, onClusterPress, focusMarker }: Props) {
  if (Platform.OS === 'ios') {
    // Lazy import to avoid runtime errors when `expo-maps` isn't installed yet.
    try {
      // @ts-ignore Expo Maps types (optional runtime import)
      const { AppleMaps } = require('expo-maps');
      const mapRef = React.useRef<any>(null);

      React.useEffect(() => {
        if (mapRef.current && focusMarker) {
          // @ts-ignore - call native method when available
          mapRef.current.setCameraPosition?.({ coordinates: { latitude: focusMarker.latitude, longitude: focusMarker.longitude }, zoom: focusMarker.zoom ?? 8 });
        }
      }, [focusMarker]);

      const iosMarkers = markers.map((m) => ({
        id: m.id,
        coordinates: { latitude: m.latitude, longitude: m.longitude },
        title: m.title || '',
      }));

      return (
        // @ts-ignore
        <AppleMaps.View ref={mapRef} style={[styles.container, style]} markers={iosMarkers} cameraPosition={initialRegion} />
      );
    } catch (err) {
      return (
        <View style={[styles.container, style, styles.center]}>
          <Text>expo-maps not installed or dev-build not available.</Text>
          <Text style={{ marginTop: 8 }}>Run an EAS dev-build to test native maps.</Text>
        </View>
      );
    }
  }

  // Android: try native `expo-maps` GoogleMaps.View with official permission flow.
  // Fallback to the WebView MapLibre implementation if native API or permissions are unavailable.
  if (Platform.OS === 'android') {
    // runtime import so code still runs in environments without native dev-client
    try {
      // @ts-ignore
      const { GoogleMaps, Maps } = require('expo-maps');
      const mapRef = React.useRef<any>(null);
      const [locationPermission, setLocationPermission] = React.useState<boolean | null>(null);

      React.useEffect(() => {
        let mounted = true;
        (async () => {
          try {
            const status = await Maps.getPermissionsAsync();
            if (status?.granted) {
              mounted && setLocationPermission(true);
              return;
            }
            const req = await Maps.requestPermissionsAsync();
            mounted && setLocationPermission(!!req?.granted);
          } catch (err) {
            mounted && setLocationPermission(false);
          }
        })();
        return () => {
          mounted = false;
        };
      }, []);

      React.useEffect(() => {
        if (mapRef.current && focusMarker) {
          // @ts-ignore - setCameraPosition available on native map refs
          mapRef.current.setCameraPosition?.({ coordinates: { latitude: focusMarker.latitude, longitude: focusMarker.longitude }, zoom: focusMarker.zoom ?? 8 });
        }
      }, [focusMarker]);

      if (locationPermission === null) {
        return (
          <View style={[styles.container, style, styles.center]}>
            <ActivityIndicator />
          </View>
        );
      }

      const androidMarkers = markers.map((m) => ({
        id: m.id,
        coordinates: { latitude: m.latitude, longitude: m.longitude },
        title: m.title || '',
        showCallout: !!m.breaking, // only popup native callout for breaking news
      }));

      // @ts-ignore
      return (
        <GoogleMaps.View
          ref={mapRef}
          style={[styles.container, style]}
          markers={androidMarkers}
          cameraPosition={initialRegion}
          onMarkerClick={(event: any) => {
            const id = event?.id ?? event?.properties?.id;
            onMarkerPress?.(id);
          }}
          onMapClick={() => { /* placeholder */ }}
        />
      );
    } catch (err) {
      // runtime import failed (expo-maps not available) — fall back to WebView below
    }
  }

  // Fallback WebView (MapLibre) for Android or if native maps unavailable
  const webviewHtml = `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>html,body,#map{height:100%;margin:0;padding:0} .marker{width:18px;height:18px;border-radius:9px;background:#11b4da;border:2px solid #fff}</style>
    <link href="https://unpkg.com/maplibre-gl@2.4.0/dist/maplibre-gl.css" rel="stylesheet" />
  </head>
  <body>
    <div id="map"></div>
    <script src="https://unpkg.com/maplibre-gl@2.4.0/dist/maplibre-gl.js"></script>
    <script>
      const map = new maplibregl.Map({
        container: 'map',
        style: 'https://demotiles.maplibre.org/style.json',
        center: [0, 20],
        zoom: 1.5
      });

      map.on('load', () => {
        map.addSource('markers', {
          type: 'geojson',
          data: { type: 'FeatureCollection', features: [] },
          cluster: true,
          clusterMaxZoom: 14,
          clusterRadius: 50
        });

        map.addLayer({
          id: 'clusters',
          type: 'circle',
          source: 'markers',
          filter: ['has', 'point_count'],
          paint: {
            'circle-color': ['step', ['get', 'point_count'], '#51bbd6', 10, '#f1f075', 30, '#f28cb1'],
            'circle-radius': ['step', ['get', 'point_count'], 16, 10, 20, 30, 26]
          }
        });

        map.addLayer({
          id: 'cluster-count',
          type: 'symbol',
          source: 'markers',
          filter: ['has', 'point_count'],
          layout: {
            'text-field': ['get', 'point_count_abbreviated'],
            'text-font': ['Open Sans Bold', 'Arial Unicode MS Bold'],
            'text-size': 12
          }
        });

        map.addLayer({
          id: 'unclustered-point',
          type: 'circle',
          source: 'markers',
          filter: ['!', ['has', 'point_count']],
          paint: {
            'circle-color': '#11b4da',
            'circle-radius': 8,
            'circle-stroke-width': 1,
            'circle-stroke-color': '#fff'
          }
        });

        map.on('click', 'clusters', (e) => {
          const features = map.queryRenderedFeatures(e.point, { layers: ['clusters'] });
          const clusterId = features[0].properties.cluster_id;
          map.getSource('markers').getClusterExpansionZoom(clusterId, (err, zoom) => {
            if (err) return;
            map.easeTo({ center: features[0].geometry.coordinates, zoom });
          });
          window.ReactNativeWebView && window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'clusterPress', clusterId }));
        });

        map.on('click', 'unclustered-point', (e) => {
          const props = e.features[0].properties;
          window.ReactNativeWebView && window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'markerPress', id: props.id }));
        });

        map.on('mouseenter', 'clusters', () => map.getCanvas().style.cursor = 'pointer');
        map.on('mouseleave', 'clusters', () => map.getCanvas().style.cursor = '');

        window.setMarkers = function(markers){
          const features = (markers || []).map(m => ({
            type: 'Feature',
            geometry: { type: 'Point', coordinates: [m.longitude, m.latitude] },
            properties: { id: m.id || m.key || '', title: m.title || '' }
          }));
          const geojson = { type: 'FeatureCollection', features };
          const src = map.getSource('markers');
          if (src) src.setData(geojson);
        };

        window.ReactNativeWebView && window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'ready' }));
      });

      window.addEventListener('message', (ev) => {
        try {
          const msg = typeof ev.data === 'string' ? JSON.parse(ev.data) : ev.data;
          if (msg?.type === 'markers') {
            window.setMarkers(msg.markers || []);
          }
        } catch (err) {
          // ignore
        }
      });
    </script>
  </body>
</html>`;

  const webviewRef = React.useRef(null as any);
  const [ready, setReady] = React.useState(false);

  const onWebMessage = (event: any) => {
    try {
      const msg = JSON.parse(event.nativeEvent.data);
      if (msg.type === 'ready') {
        setReady(true);
        // push initial markers
        webviewRef.current?.postMessage(JSON.stringify({ type: 'markers', markers }));
      } else if (msg.type === 'markerPress') {
        onMarkerPress?.(msg.id);
      } else if (msg.type === 'clusterPress') {
        onClusterPress?.(msg.clusterId);
      }
    } catch (err) {
      // ignore
    }
  };

  React.useEffect(() => {
    if (ready) {
      webviewRef.current?.postMessage(JSON.stringify({ type: 'markers', markers }));
    }
  }, [markers, ready]);

  // when focusMarker changes, send a flyTo to the WebView map
  React.useEffect(() => {
    if (ready && focusMarker) {
      webviewRef.current?.postMessage(JSON.stringify({ type: 'flyTo', coords: { latitude: focusMarker.latitude, longitude: focusMarker.longitude, zoom: focusMarker.zoom ?? 8 } }));
      webviewRef.current?.postMessage(JSON.stringify({ type: 'selectMarker', id: focusMarker.id }));
    } else if (ready && !focusMarker) {
      webviewRef.current?.postMessage(JSON.stringify({ type: 'clearSelection' }));
    }
  }, [focusMarker, ready]);

  return (
    <View style={[styles.container, style]}>
      <WebView
        ref={webviewRef}
        originWhitelist={["about:blank"]}
        source={{ html: webviewHtml }}
        onMessage={onWebMessage}
        javaScriptEnabled
        mixedContentMode="never"
        allowFileAccess={false}
        style={{ flex: 1 }}
      />
      {!ready && (
        <View style={[StyleSheet.absoluteFill, { alignItems: 'center', justifyContent: 'center' }]}> 
          <ActivityIndicator size="small" />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: '#e6e6e6',
    borderRadius: 8,
    overflow: 'hidden',
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
});
