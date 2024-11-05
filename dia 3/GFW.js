
//-------------------------
//imports??
//-------------------------

//usamos la librería recomendada por Manuel para importar colorbars
var palettes = require('users/gena/packages:palettes');
var palette = palettes.matplotlib.viridis[7];

//recortamos los puntos con la geometría
var seaP = seaPts//.*********(geometry);
print(seaP.size())

//dataset Global Fishing Water
var dataset = ee.ImageCollection('GFW/GFF/V1/vessel_hours')
                  .filter(ee.Filter.date('2016-06-01', '2016-06-30'));
//Seleccioanmos la variable de interes
var oth_fishing = dataset.select('******');
//Nos quedamos con el estadistico de interes
var suma_oth_fishing = oth_fishing//*********/

//diccionario para la visualizacion
var imgVis = {
  min: 0.0,
  max: 5.0,
  palette: ******
};

// Cargar un conjunto de datos de masas terrestres para enmascarar la tierra
var landMask = ee.Image('MODIS/MOD44W/MOD44W_005_2000_02_24').select('water_mask');

// Aplicar la máscara de tierra a los datos de barcos
var suma_oth_fishing_msk = suma_oth_fishing//.********

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


// Exportar la colección de puntos como tabla CSV, especificando los campos que deseas incluir
//****************({
  collection: sampledPoints,
  description: 'FishingValuesExport',
  fileFormat: 'CSV',
  //selectors: ['property_name1', 'property_name2', 'mean'] // Cambia estos nombres a los de las propiedades que deseas exportar
});