// Unir las características dibujadas a mano en una sola FeatureCollection.
var newfc = ee.FeatureCollection('projects/ee-digdgeografo/assets/newfc') //sand.merge(greenhouse).merge(agua).merge(arrozal).merge(pinares).merge(eucaliptos);

// Creamos el conjunto de imágenes (stack) con las bandas y con el NDVI estacional
var sentinel2_winter = ee.ImageCollection("COPERNICUS/S2_SR")
    .filterDate('2020-01-01', '2020-03-31')
    .map(function(image) {
  return image.select(['B2', 'B3', 'B4', 'B5', 'B6', 'B7', 'B8', 'B8A', 'B11', 'B12']).addBands(image.normalizedDifference(['B8', 'B4']).rename(['ndvi']))});
    
var sentinel2_spring = ee.ImageCollection("COPERNICUS/S2_SR")
    .filterDate('2020-04-01', '2020-06-30')
    .map(function(image) {
  return image.select(['B2', 'B3', 'B4', 'B5', 'B6', 'B7', 'B8', 'B8A', 'B11', 'B12']).addBands(image.normalizedDifference(['B8', 'B4']).rename(['ndvi']))});
    
var sentinel2_summer = ee.ImageCollection("COPERNICUS/S2_SR")
    .filterDate('2020-07-01', '2020-09-30')
    .map(function(image) {
  return image.select(['B2', 'B3', 'B4', 'B5', 'B6', 'B7', 'B8', 'B8A', 'B11', 'B12']).addBands(image.normalizedDifference(['B8', 'B4']).rename(['ndvi']))});

var sentinel2_autumn = ee.ImageCollection("COPERNICUS/S2_SR")
    .filterDate('2020-10-01', '2020-12-31')
    .map(function(image) {
  return image.select(['B2', 'B3', 'B4', 'B5', 'B6', 'B7', 'B8', 'B8A', 'B11', 'B12']).addBands(image.normalizedDifference(['B8', 'B4']).rename(['ndvi']))});
    
var ndvi_2020 = ee.Image.cat(sentinel2_winter.median(), sentinel2_spring.median(), sentinel2_summer.median(), sentinel2_autumn.median()).clip(geometry);

var vis = {min: 0, max: 0.8, palette: [
  'FFFFFF', 'CE7E45', 'FCD163', '66A000', '207401',
  '056201', '004C00', '023B01', '012E01', '011301'
]};

Map.addLayer(ndvi_2020, {min:0, max:3000, bands:['B8_2', 'B4_2', 'B3_2']}, 'Compuesto Sentinel 2');
Map.setCenter(-6.34497, 37.01918, 12);

// Comenzamos la clasificación
// Bandas a usar para el clasificador
var bands = ['B2', 'B3', 'B4', 'B5', 'B6', 'B7', 'B8', 'B8A', 'B11', 'B12', 'ndvi', 
  'B2_1', 'B3_1', 'B4_1', 'B5_1', 'B6_1', 'B7_1', 'B8_1', 'B8A_1', 'B11_1', 'B12_1', 'ndvi_1',
  'B2_2', 'B3_2', 'B4_2', 'B5_2', 'B6_2', 'B7_2', 'B8_2', 'B8A_2', 'B11_2', 'B12_2', 'ndvi_2'];

// Tomamos los valores de las bandas en los puntos
var training = ndvi_2020.select(bands).sampleRegions({
  collection: newfc, 
  properties: ['class'], 
  scale: 10
});

// Obtener un clasificador CART y entrenarlo.
var classifier = ee.Classifier.smileCart().train({
  features: training, 
  classProperty: 'class', 
  inputProperties: bands
});

// Clasificar la imagen.
var classified = ndvi_2020.select(bands).classify(classifier);

// Variable de visualización para las clasificaciones
var visParams = {min: 1, max: 6, palette: ['#d6b21c', '#7edeff', '#0406a8', '#4cff0a', '#193417', '#7bc25a']};

// Mostrar los resultados de la clasificación.
Map.addLayer(classified, visParams, 'Clasificación');

// Matriz de confusión

// Opcionalmente, hacer una evaluación de precisión. Primero, agregar una columna
// de valores aleatorios uniformes al conjunto de datos de entrenamiento.
var withRandom = training.randomColumn('random');

// Queremos reservar algunos datos para pruebas, para evitar sobreajuste del modelo.
var split = 0.7;  // Aproximadamente 70% entrenamiento, 30% prueba.
var trainingPartition = withRandom.filter(ee.Filter.lt('random', split));
var testingPartition = withRandom.filter(ee.Filter.gte('random', split));

// Entrenado con el 70% de nuestros datos.
var trainedClassifier = ee.Classifier.smileCart().train({
  features: trainingPartition,
  classProperty: 'class',
  inputProperties: bands
});
var classified2 = ndvi_2020.classify(trainedClassifier);
Map.addLayer(classified2, visParams, 'Clasificación entrenada');

// Clasificar la colección de prueba.
var test = testingPartition.classify(trainedClassifier);

// Imprimir la matriz de confusión.
var confusionMatrix = test.errorMatrix('class', 'classification');
print('Matriz de confusión:', confusionMatrix);
print('Precisión general:', confusionMatrix.accuracy());
print('Precisión del productor:', confusionMatrix.producersAccuracy());
print('Precisión del consumidor:', confusionMatrix.consumersAccuracy());

Map.centerObject(geometry);
