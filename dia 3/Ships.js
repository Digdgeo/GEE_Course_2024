// Load the Sentinel-1 ImageCollection.
var sentinel1 = ee.ImageCollection('COPERNICUS/S1_GRD');

// Filter by metadata properties.
var vh_2020 = sentinel1
  // Filter to get images with VH polarization.
  .filter(ee.Filter.listContains('transmitterReceiverPolarisation', 'VH'))
  // Filter to get images collected in interferometric wide swath mode.
  .filter(ee.Filter.eq('instrumentMode', 'IW'))
  .filterDate("2021-01-01","2021-12-31");

// Filter to get images from different look angles.
var vhAscending = vh_2020.filter(ee.Filter.eq('orbitProperties_pass', 'ASCENDING'));
var vhDescending = vh_2020.filter(ee.Filter.eq('orbitProperties_pass', 'DESCENDING'));

var radar_2020 = vhAscending.select('VH').merge(vhDescending.select('VH')).max()//.mask(water);


// Map composite over the Channel
Map.centerObject(geometry, 12);
Map.addLayer(radar_2020, {min: -15, max: 0}, 'Radar Merge 2020');