//imports

// Definir el rango de fechas y la región de interés
var fechaInicio = '1984-01-01';
var fechaFin = '2023-12-31';


// Función para seleccionar y renombrar las bandas comunes
function seleccionarBandasColeccion(imagen, satelite) {
  var bandasOriginales, bandasRenombradas;
  if (satelite === 'L5') {
    bandasOriginales = ['SR_B1', 'SR_B2', 'SR_B3', 'SR_B4', 'SR_B5', 'SR_B7']; // Azul, Verde, Rojo, NIR, SWIR1, SWIR2
    bandasRenombradas = ['blue', 'green', 'red', 'nir', 'swir1', 'swir2'];
  } else if () {} 
  else {}
  return imagen.select(bandasOriginales, bandasRenombradas);
}

// Función para recortar una imagen con la geometría
function recortarImagen(imagen) {
  return ****;
}

//var crs = 'EPSG:32629'

// Función para calcular el MNDWI y devolver solo esa banda
function calcularMNDWI(imagen) {
  // Calcular MNDWI usando las bandas renombradas ('green' y 'swir1')
  var mndwi = *****;
  
  // Recortar, seleccionar y devolver solo la banda MNDWI
  return mndwi.clip(extent).select('MNDWI')//.reproject({crs: crs, scale: 30});
}


// Cargar y procesar cada colección de Landsat de la Colección 2
var landsat5 = ee.ImageCollection('LANDSAT/LT05/C02/T1_L2')
                .filterDate(fechaInicio, fechaFin)
                .filterBounds(region)
                .filter(ee.Filter.lt('CLOUD_COVER', 20)) 
                .map(function(img) { return seleccionarBandasColeccion(img, 'L5').clip(extent); });

var landsat7 = ***

var landsat8 = ***

var landsat9 = ***

// Combinar todas las colecciones en un solo conjunto de datos
var landsatCombinado = landsat5.merge(landsat7).merge(landsat8).merge(landsat9);

// Mostrar en el mapa una imagen de ejemplo (opcional)
//Map.centerObject(region, 6);
//Map.addLayer(landsatCombinado.median(), {min: 0, max: 3000, bands: ['red', 'green', 'blue']}, 'Landsat Combinado');

// Imprimir para verificar la colección combinada
print("Colección combinada Landsat:", landsatCombinado);

// Función para aplicar los coeficientes específicos de calibración
function aplicarCoeficientesReflectividad(imagen) {
  // Aplicar los coeficientes de multiplicación y suma a cada banda
  return ******.copyProperties(imagen, imagen.propertyNames());
}

// Aplicar la función a la colección combinada
var landsatCombinadoReflectividad = landsatCombinado.map(aplicarCoeficientesReflectividad);

// Mostrar una imagen de ejemplo para verificar el resultado
//Map.addLayer(landsatCombinadoReflectividad.median(), {min: 0.05, max: 0.65, bands: ['swir1', 'nir', 'blue']}, 'Reflectividad Landsat Combinado');

// Imprimir para verificar la colección transformada
//print("Colección Landsat en Reflectividad:", landsatCombinadoReflectividad);

// Filtrar la colección para cada uno de los períodos
var periodo_1984_1994 = landsatCombinadoReflectividad.filterDate('1984-09-01', '1994-08-31');
var periodo_1994_2004 = landsatCombinadoReflectividad.filterDate('1994-09-01', '2004-08-31');
var periodo_2004_2014 = landsatCombinadoReflectividad.filterDate('2004-09-01', '2014-08-31');
var periodo_2014_2024 = landsatCombinadoReflectividad.filterDate('2014-09-01', '2024-10-31');

// Aplicar el cálculo de MNDWI y obtener la mediana de cada período
var mndwi_1984_1994 = *****;
//var mndwi_1994_2004 = *****;
//var mndwi_2004_2014 = *****;
//var mndwi_2014_2024 = *****;

// Visualizar cada período en el mapa
Map.centerObject(extent);
//Map.addLayer(mndwi_1984_1994, {min: -1, max: 1, palette: ['white', 'blue']}, 'MNDWI Periodo 1984-1994');
//Map.addLayer(mndwi_1994_2004, {min: -1, max: 1, palette: ['white', 'blue']}, 'MNDWI Periodo 1994-2004');
//Map.addLayer(mndwi_2004_2014, {min: -1, max: 1, palette: ['white', 'blue']}, 'MNDWI Periodo 2004-2014');
//Map.addLayer(mndwi_2014_2024, {min: -1, max: 1, palette: ['white', 'blue']}, 'MNDWI Periodo 2014-2024');

//Map.addLayer(periodo_1984_1994.median(), {min: 0.1, max: 0.6, bands: ['swir1', 'nir', 'blue']}, 'Periodo 1984-1994');
//Map.addLayer(periodo_2014_2024.median(), {min: 0.1, max: 0.6, bands: ['swir1', 'nir', 'blue']}, 'periodo_2014_2024');


// Exportar MNDWI a los assetpara el período 1984-1994
Export.image.toAsset({
  image: mndwi_1984_1994,
  description: 'Exportar_MNDWI_Periodo_1984_1994_median',
  assetId: 'users/ee-digdgeografo/MNDWI_Periodo_1984_1994_median',
  region: extent,
  scale: 30,
  crs: crs,
  maxPixels: 1e13
});