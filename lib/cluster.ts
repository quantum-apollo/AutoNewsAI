/*
  Minimal supercluster wrapper (skeleton).
  After installing `@mapbox/supercluster` this module will expose helpers to build
  an index and query clusters for the current viewport + zoom.
*/

import Supercluster from '@mapbox/supercluster';

export type PointFeature = {
  type: 'Feature';
  properties: { [k: string]: any };
  geometry: { type: 'Point'; coordinates: [number, number] };
};

export function createClusterIndex(points: PointFeature[], options?: Partial<Supercluster.Options>) {
  const index = new Supercluster({
    radius: 60,
    maxZoom: 16,
    ...(options || {}),
  });
  index.load(points);
  return index;
}

export function getClusters(index: any, bbox: [number, number, number, number], zoom: number) {
  return index.getClusters(bbox, Math.floor(zoom));
}

export function getLeaves(index: any, clusterId: number, limit = 10) {
  return index.getLeaves(clusterId, limit);
}
