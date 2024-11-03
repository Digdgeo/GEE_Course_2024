//--------------------------------------------SRTM-----------------------------------------------

//cargamos el datset como variable
var dataset = ee.Image('CGIAR/SRTM90_V4');

//seleccionamos la banda 'elevation'
var elevation = dataset.select('elevation');

//usamos las herramientas slope y aspect de la api disponibles en ee.Terrain (buscar en Docs)
var slope = ee.Terrain.slope(elevation);
var aspect = ee.Terrain.aspect(elevation);

//Añadimos el mapa y cargamos los rasters con su visualización. Cuidado de cargar la capa que es y cambiar los máximos y mínimos
Map.setCenter(-5.8598, 36.8841, 10);

/*Map.addLayer(elevation, {min: 0, max: 3000, palette: ['green', 'yellow', 'orange', 'brown', 'white']}, 'elevation');
Map.addLayer(slope, {min: 0, max: 45, palette: ['white', 'red']}, 'slope');
Map.addLayer(aspect, {min: 0, max: 360, palette: ['yellow', 'red', 'green', 'purple']}, 'aspect');
*/

var full = ee.Image.cat([elevation, slope, aspect, ndvi]);

//Map.addLayer(full, {} , "Full")

//ESTADISTICAS ZONALES A UN ROI
var roiStats = full.reduceRegion({
  reducer: ee.Reducer.max(),
  geometry: roi,
  scale: 30,
  maxPixels: 1e9
});
print(roiStats)


//--------------------------------------------------Landsat NDVI---------------------------------------------
// Parámetros de filtro temporal y espacial
var start = '2022-01-01';
var end = '2022-12-31';
//var roi = ee.Geometry.Point([-6.94, 37.27]);  // Reemplaza con tu área de interés

// Definir una función para calcular la reflectancia
function applyReflectanceConversion(image) {
  // Obtener las bandas que necesitas en el cálculo
  var bands = ['SR_B2', 'SR_B3', 'SR_B4', 'SR_B5', 'SR_B6', 'SR_B7'];

  // Aplicar el coeficiente de multiplicación y de adición a cada banda
  var reflectance = image.select(bands).multiply(0.0000275).add(-0.2)
                         .rename(['Blue', 'Green', 'Red', 'Nir', 'Swir', 'Mir']);
  
  // Devolver la imagen con las bandas originales y las bandas de reflectancia añadidas
  return image.addBands(reflectance);
}

var collection = ee.ImageCollection("LANDSAT/LC08/C02/T1_L2")
                   .filterBounds(roi)
                   .filterDate(start, end)
                   .filter(ee.Filter.eq('WRS_PATH', 202))
                   .filter(ee.Filter.eq('WRS_ROW', 34));

// Aplicar la función a toda la colección
var correctedCollection = collection.map(applyReflectanceConversion);

// Visualizar la primera imagen corregida con las bandas de reflectancia
var firstImage = ee.Image(correctedCollection.first().clip(geometry));


// Ordenar la colección por el porcentaje de nubes en orden ascendente
var sortedCollection = correctedCollection.sort('CLOUD_COVER');
print(sortedCollection)

// Reducir la colección para obtener las listas de IDs y porcentajes de nubes
var cloudCoverList = sortedCollection.reduceColumns(ee.Reducer.toList(), ['CLOUD_COVER']).get('list');
var idList = sortedCollection.reduceColumns(ee.Reducer.toList(), ['system:index']).get('list');

// Crear un diccionario combinando ambas listas
var cloudCoverDict = ee.Dictionary.fromLists(idList, cloudCoverList);
print('Diccionario de IDs y porcentaje de nubes:', cloudCoverDict);


// Seleccionar la imagen con menos nubes
var leastCloudyImage = ee.Image(sortedCollection.first().clip(geometry));


Map.centerObject(roi, 10);
//Map.addLayer(firstImage, {bands: ['Nir', 'Red', 'Green'], min: 0, max: 0.3}, 'Reflectancia corregida 1 Imagen');
//Map.addLayer(leastCloudyImage, {bands: ['Nir', 'Red', 'Green'], min: 0, max: 0.3}, 'Reflectancia corregida menos nubosa');
// Crear la imagen compuesta utilizando la media de la colección enmascarada
var composite = collection.mean();

// Visualizar la imagen compuesta
Map.centerObject(roi, 8);


// Calcular NDVI
var b5 = composite.select("SR_B5");
var b4 = composite.select("SR_B4");
var ndvi = b5.subtract(b4).divide(b5.add(b4)).rename(['ndvi']);

// Definir los rangos de altitud y el umbral para NDVI
var minElevation = 0;
var maxElevation = 100;
var ndviThreshold = 0.1;

// Crear una máscara que seleccione los píxeles dentro del rango de elevación
var elevationMask = elevation.gte(minElevation).and(elevation.lte(maxElevation));

// Aplicar la máscara de elevación a la imagen NDVI
var ndviInRange = ndvi.updateMask(elevationMask);

// Aplicar el umbral de NDVI a los valores en el rango de elevación
var ndviFiltered = ndviInRange.updateMask(ndviInRange.gte(ndviThreshold));

// Visualizar el resultado
Map.addLayer(ndviInRange, {min: 0, max: 1, palette: ['blue', 'green', 'red']}, 'NDVI In Range');
Map.addLayer(ndviFiltered, {min: 0, max: 1, palette: ['blue', 'green', 'red']}, 'NDVI filtrado');

// Centrar el mapa en un área de interés (ajusta estas coordenadas según tu región)
Map.setCenter(-6.3, 37.4, 8);  // Coordenadas aproximadas para Huelva y Sevilla




//Map.addLayer(ndvi_masked, {min:-0.2, max:0.8} , "NDVI 1500")
//Map.addLayer(ndvi_masked_masked, {min:0.4, max:0.8} , "NDVI 1500 Healthy")