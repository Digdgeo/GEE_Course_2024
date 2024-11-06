
var palettes = require('users/gena/packages:palettes');
var palette = palettes.matplotlib.viridis[7];

//clip a los puntos
var seaP = seaPts.filterBounds(geometry);
print(seaP.size())


var dataset = ee.ImageCollection('GFW/GFF/V1/vessel_hours')
                  .filter(ee.Filter.date('2016-06-01', '2016-06-30'));
var oth_fishing = dataset.select('purse_seines');
var suma_oth_fishing = oth_fishing.reduce(ee.Reducer.sum()).clip(geometry)

var imgVis = {
  min: 0.0,
  max: 5.0,
  palette: palette
};

// Cargar un conjunto de datos de masas terrestres para enmascarar la tierra
var landMask = ee.Image('MODIS/MOD44W/MOD44W_005_2000_02_24').select('water_mask');

// Aplicar la máscara de tierra a los datos de barcos
var suma_oth_fishing_msk = suma_oth_fishing.updateMask(landMask);

// Centrar el mapa y agregar capas
Map.centerObject(geometry);
Map.addLayer(suma_oth_fishing_msk, imgVis, 'Other Fishing Sum');
Map.addLayer(seaP, {color: 'blue', pointSize: 1, opacity: 0.3}, 'Sea Points');

// Extraer valores de la imagen de pesca en los puntos de 'seaP' usando sample
var sampledPoints = suma_oth_fishing_msk.sample({
  region: seaP,
  scale: 1000, // Ajusta la escala según la resolución de tu imagen
  geometries: true // Para mantener la geometría de cada punto en la salida
});

// Imprimir los puntos con los valores extraídos
print('Valores de pesca en puntos de interés (usando sample)', sampledPoints.limit(10));

/*
Con reduce regions
// Ajustar el tamaño de los píxeles manualmente a 1 km (1000 metros)
var sampledPointsWithReduceRegions = oceanOnlyTrawlers.reduceRegions({
  collection: seaPts,  
  reducer: ee.Reducer.mean(), 
  scale: 1000,  // Escala ajustada a 1 km
});
*/

// Exportar la colección de puntos como tabla CSV, especificando los campos que deseas incluir
Export.table.toDrive({
  collection: sampledPoints,
  description: 'FishingValuesExport',
  fileFormat: 'CSV',
  //selectors: ['property_name1', 'property_name2', 'mean'] // Cambia estos nombres a los de las propiedades que deseas exportar
});