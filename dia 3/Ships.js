// Cargar la colección de imágenes Landsat 8
var l8 = ee.ImageCollection("LANDSAT/LC08/C01/T1_SR");

// Función para enmascarar nubes usando la banda pixel_qa de los datos SR de Landsat 8.
function maskL8sr(image) {
  // Los bits 3 y 5 representan sombra de nubes y nubes, respectivamente.
  var cloudShadowBitMask = 1 << 3;
  var cloudsBitMask = 1 << 5;

  // Obtener la banda QA de píxeles.
  var qa = image.select('QA_PIXEL');

  // Ambos indicadores deben estar en cero, indicando condiciones despejadas.
  var mask = qa.bitwiseAnd(cloudShadowBitMask).eq(0)
      .and(qa.bitwiseAnd(cloudsBitMask).eq(0));

  // Devolver la imagen enmascarada, escalada a reflectancia, sin las bandas QA.
  return image.updateMask(mask).divide(10000)
      .select("B[0-9]*")
      .copyProperties(image, ["system:time_start"]);
}

// Aplicar la función a un año de datos.
var collection = ee.ImageCollection('LANDSAT/LC09/C02/T1_L2')
    .filterDate('2024-01-01', '2024-07-31')
    //.map(maskL8sr)

var composite = collection.median();

// Mostrar los resultados.


// Obtener la mediana en el tiempo, en cada banda y cada píxel.
//var median = l8.filterDate('2020-01-01', '2020-12-31').median();
// Crear una variable práctica para los parámetros de visualización.
var visParams = {bands: ['SR_B6', 'SR_B5', 'SR_B4'], min: 100, max: 3500};

// Cargar el conjunto de datos de cambio forestal de Hansen et al.
var hansenImage = ee.Image('UMD/hansen/global_forest_change_2015');

// Seleccionar la máscara de tierra/agua.
var datamask = hansenImage.select('datamask');

// Crear una máscara binaria.
var mask = datamask.eq(1);

// Actualizar la máscara del compuesto con la máscara de agua.
var maskedComposite = composite.updateMask(mask);
//Map.addLayer(maskedComposite, visParams, 'enmascarado');

// Crear una imagen de agua a partir de la máscara.
var water = mask.not();
var land = mask.eq(1);

// Enmascarar el agua consigo misma para enmascarar todos los ceros (no-agua).
water = water.mask(water);
land = land.mask(land);

// Cargar la colección de imágenes de Sentinel-1.
var sentinel1 = ee.ImageCollection('COPERNICUS/S1_GRD');

// Filtrar por propiedades de metadatos.
var vh_2020 = sentinel1
  // Filtrar para obtener imágenes con polarización VH.
  .filter(ee.Filter.listContains('transmitterReceiverPolarisation', 'VH'))
  // Filtrar para obtener imágenes recolectadas en modo de banda ancha interferométrica.
  .filter(ee.Filter.eq('instrumentMode', 'IW'))
  .filterDate("2021-01-01","2021-12-31");

// Filtrar para obtener imágenes desde diferentes ángulos de vista.
var vhAscending = vh_2020.filter(ee.Filter.eq('orbitProperties_pass', 'ASCENDING'));
var vhDescending = vh_2020.filter(ee.Filter.eq('orbitProperties_pass', 'DESCENDING'));

var radar_2020 = vhAscending.select('VH').merge(vhDescending.select('VH')).max().mask(water);


// Mapear el compuesto sobre el Canal
Map.centerObject(geometry, 12);
Map.addLayer(radar_2020, {min: -15, max: 0}, 'Radar Merge 2020');

// Aplicar la máscara de tierra al compuesto
composite = composite.mask(land);
Map.addLayer(composite, {bands: ['SR_B5', 'SR_B4', 'SR_B3'], min: 3000, max: 20000}, 'Landsat composite');

});

