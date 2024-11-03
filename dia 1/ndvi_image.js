var image = ee.Image("LANDSAT/LC08/C02/T1_L2/LC08_202034_20240722");

// Definir una función para calcular la reflectancia
function applyReflectanceConversion(image) {
  // Obtener las bandas que necesitas en el cálculo
  var bands = ['SR_B2', 'SR_B3', 'SR_B4', 'SR_B5', 'SR_B6', 'SR_B7'];

  // Aplicar el coeficiente de multiplicación y de adición a cada banda
  var reflectance = image.select(bands).multiply(0.0000275).add(-0.2);
  
  return reflectance;
}

// Aplicar la conversión y renombrar las bandas con "_reflectance"
var composite = applyReflectanceConversion(image).rename(['Blue', 'Green', 'Red', 'Nir', 'Swir', 'Mir']);

// Mostrar la imagen en el mapa
Map.centerObject(image, 8);
Map.addLayer(composite, {bands: ['Swir', 'Nir', 'Blue'], min: 0.2, max: 0.75}, 'Reflectance Image');


// Method 1)
var b5 = composite.select("Nir")
var b4 = composite.select("Red")
var ndvi_1 = b5.subtract(b4).divide(b5.add(b4))

// Method 2)
var ndvi_2 = composite.normalizedDifference(["Nir", "Red"])

// Method 3)
var ndvi_3 = composite.expression("(b5 - b4) / (b5 + b4)", {
    b5: composite.select("Nir"),
    b4: composite.select("Red")
})

//Umbrales
// Clasificación de NDVI en categorías
var ndvi_classes = ndvi_1.updateMask(ndvi_1.mask())  // Usar la máscara original de la imagen NDVI
  .where(ndvi_1.lt(0.2), 1)   // Vegetación escasa
  .where(ndvi_1.gte(0.2).and(ndvi_1.lt(0.5)), 2) // Vegetación moderada
  .where(ndvi_1.gte(0.5), 3);  // Vegetación densa

// Añadir al mapa para visualización
Map.centerObject(image, 8);
Map.addLayer(ndvi_classes, {min: 1, max: 3, palette: ['yellow', 'orange', 'green']}, 'NDVI Classes');



// Calculate Modified Normalized Difference Water Index (MNDWI)
// 'GREEN' (B3) and 'SWIR1' (B11)
var mndwi = composite.normalizedDifference(['Green', 'Swir']).rename(['mndwi']); 

// Aplicar la máscara al MNDWI: mayor o igual a 0 (agua)
var mndwi_masked = mndwi.updateMask(mndwi.gte(0));


// Calculate Soil-adjusted Vegetation Index (SAVI)
// 1.5 * ((NIR - RED) / (NIR + RED + 0.5))

// For more complex indices, you can use the expression() function
var savi = composite.expression(
    '1.5 * ((NIR - RED) / (NIR + RED + 0.5))', {
      'NIR': composite.select('Nir'),
      'RED': composite.select('Red'),
}).rename('savi');

//var rgbVis = {min: 0.0, max: 350, bands: ['B5', 'B4', 'B3']};
var ndviVis = {min:0, max:1, palette: ['#a8d5e2', '#f9a620', '#ffd449', '#548c2f', '#104911']}
var ndwiVis = {min:0, max:1, palette: ['white', 'blue']}

Map.addLayer(mndwi, ndwiVis, 'mndwi')
Map.addLayer(mndwi_masked, ndwiVis, 'mndwi masked')
Map.addLayer(savi, ndviVis, 'savi')
Map.addLayer(ndvi_1, ndviVis, 'ndvi') 
Map.addLayer(ndvi_classes, {min: 1, max: 3, palette: ['yellow', 'orange', 'green']}, 'NDVI Classes')