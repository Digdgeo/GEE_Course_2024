// Cargar las imágenes exportadas desde tus Assets
var mndwi_1984_1994 = ee.Image('projects/ee-digdgeografo/assets/MNDWI_Periodo_1984_1994_median');
var mndwi_1994_2004 = ee.Image('projects/ee-digdgeografo/assets/MNDWI_Periodo_1994_2004_median');
var mndwi_2004_2014 = ee.Image('projects/ee-digdgeografo/assets/MNDWI_Periodo_2004_2014_median');
var mndwi_2014_2024 = ee.Image('projects/ee-digdgeografo/assets/MNDWI_Periodo_2014_2024_median');

// Definir parámetros de visualización para MNDWI
var vizParams = {min: -1, max: 1, palette: ['white', 'blue']};

// Añadir cada imagen al mapa con una etiqueta para distinguir los períodos
Map.addLayer(mndwi_1984_1994, vizParams, 'MNDWI 1984-1994');
Map.addLayer(mndwi_1994_2004, vizParams, 'MNDWI 1994-2004');
Map.addLayer(mndwi_2004_2014, vizParams, 'MNDWI 2004-2014');
Map.addLayer(mndwi_2014_2024, vizParams, 'MNDWI 2014-2024');

// Centrar el mapa en tu área de interés
Map.centerObject(mndwi_1984_1994, 6);

// Función para recortar, aplicar umbral y calcular área de agua
function calcularSuperficieAgua(imagen, nombrePeriodo) {
  // Recortar la imagen al nuevo extent
  var recortada = imagen.clip(extent);

  // Crear una máscara de agua (donde MNDWI >= 0)
  var mascaraAgua = recortada.gte(0);

  // Calcular el área de agua en metros cuadrados
  var areaAgua = mascaraAgua.multiply(ee.Image.pixelArea()).reduceRegion({
    reducer: ee.Reducer.sum(),
    geometry: extent,
    scale: 30,
    maxPixels: 1e13
  });

  // Obtener el área de agua en hectáreas (1 ha = 10,000 m²)
  var areaAguaHa = ee.Number(areaAgua.get('MNDWI')).divide(10000);

  // Imprimir el área de agua para el período especificado
  print('Área de agua en hectáreas para', nombrePeriodo, ':', areaAguaHa);

  // Devolver la imagen recortada con la máscara de agua aplicada
  return recortada.updateMask(mascaraAgua);
}

// Calcular la superficie de agua para cada período
var agua_1984_1994 = calcularSuperficieAgua(mndwi_1984_1994, '1984-1994');
var agua_1994_2004 = calcularSuperficieAgua(mndwi_1994_2004, '1994-2004');
var agua_2004_2014 = calcularSuperficieAgua(mndwi_2004_2014, '2004-2014');
var agua_2014_2024 = calcularSuperficieAgua(mndwi_2014_2024, '2014-2024');

// Visualizar cada período en el mapa
var vizParamsAgua = {min: 0, max: 1, palette: ['white', 'blue']};
Map.addLayer(agua_1984_1994, vizParamsAgua, 'Agua 1984-1994');
Map.addLayer(agua_1994_2004, vizParamsAgua, 'Agua 1994-2004');
Map.addLayer(agua_2004_2014, vizParamsAgua, 'Agua 2004-2014');
Map.addLayer(agua_2014_2024, vizParamsAgua, 'Agua 2014-2024');

// Centrar el mapa en el nuevo extent
Map.centerObject(extent, 8);

// Función para calcular la superficie de agua y convertirla en polígonos
function poligonizarAgua(imagen, nombrePeriodo) {
  // Crear una máscara de agua (donde MNDWI >= 0) y recortar
  var mascaraAgua = imagen.clip(extent).gte(0);

  // Convertir las áreas de agua a polígonos
  var aguaPoligonos = mascaraAgua.selfMask().reduceToVectors({
    geometryType: 'polygon',
    reducer: ee.Reducer.countEvery(),
    scale: 30,
    maxPixels: 1e13,
    geometry: extent,
    bestEffort: true,
    eightConnected: true
  });

  // Renombrar la propiedad para identificar el período
  aguaPoligonos = aguaPoligonos.map(function(feature) {
    return feature.set('Periodo', nombrePeriodo);
  });

  // Visualizar los polígonos en el mapa
  Map.addLayer(aguaPoligonos, {color: 'blue'}, 'Cuerpos de Agua ' + nombrePeriodo);
  
  // Retornar el resultado
  return aguaPoligonos;
}

// Poligonizar cuerpos de agua para cada período
var aguaPoligonos_1984_1994 = poligonizarAgua(mndwi_1984_1994, '1984-1994');
var aguaPoligonos_1994_2004 = poligonizarAgua(mndwi_1994_2004, '1994-2004');
var aguaPoligonos_2004_2014 = poligonizarAgua(mndwi_2004_2014, '2004-2014');
var aguaPoligonos_2014_2024 = poligonizarAgua(mndwi_2014_2024, '2014-2024');

// Centrar el mapa en el nuevo extent
Map.centerObject(extent, 8);


// Exportar los polígonos de agua de cada período a Google Drive
Export.table.toDrive({
  collection: aguaPoligonos_1984_1994,
  description: 'Poligonos_Agua_1984_1994',
  folder: 'GEE_CSIC_2024',  // Opcional: nombre de la carpeta en Google Drive
  fileNamePrefix: 'Cuerpos_Agua_1984_1994', // Prefijo del nombre del archivo
  fileFormat: 'SHP'  // Puedes cambiar a 'GeoJSON' si lo prefieres
});

