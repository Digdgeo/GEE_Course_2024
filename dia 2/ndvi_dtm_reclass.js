var geometry2 = ee.Geometry.Point([-6.302875, 37.44111]);

var landsat = ee.ImageCollection("LANDSAT/LC08/C02/T1_L2")
    .filterDate('2023-01-01', '2024-01-01')
    .filterBounds(geometry2)
    
var ndvi = landsat.map(function(image) {
  var result = image.normalizedDifference(["SR_B5", "SR_B4"]).rename("ndvi")
  return image.addBands(result);
})

var maxNDVI = ndvi.max().select("ndvi");


// Buffer de 30 km al punto.
var region = geometry2.buffer(30000)

// DTM
var elevation = ee.Image("USGS/SRTMGL1_003")

// Zonificacion del NDVI
var zones = ee.Image.constant(1)
    .where(maxNDVI.gt(0.1), 1)
    .where(maxNDVI.gt(0.2), 2)
    .where(maxNDVI.gt(0.3), 3)
    .where(maxNDVI.gt(0.4), 4)
    .updateMask(elevation.neq(0))
    .clip(region)
    
// DTM reclasificado.
var elevation_reclass = ee.Image(0)
    .where(elevation.gt(5), 1)
    .where(elevation.gt(10), 2)
    .where(elevation.gt(100), 3)
    .where(elevation.gt(500), 4)
    .where(elevation.gt(1000), 5)
    .updateMask(elevation.neq(0))
    .clip(geometry2.buffer(75000))
    
    
//mascara de mar
// Crear una máscara donde DTM no es cero
var mascara = elevation.neq(0); 
Map.addLayer(mascara)

//ndviMax enmascarado
var masked_ndvi = maxNDVI.updateMask(mascara);

Map.addLayer(masked_ndvi, {min:0, max:0.75}, "Max NDVI")
//Map.addLayer(region, {color: "yellow"}, "Region")
Map.addLayer(elevation_reclass, {palette: ['cyan', 'green', 'orange', 'brown', 'purple']}, "Elevation zones")
Map.addLayer(zones, {palette: ['white', 'green']}, "Elevation zones")
Map.centerObject(geometry2, 10)

var stats = elevation.addBands(zones).reduceRegion({
  reducer: ee.Reducer.mean().group(1),
  geometry: region,
  scale: 30,
  maxPixels: 1e11
})
print(stats)
Map.centerObject(geometry2, 10)