// Cargar la colección de características
var andalucia = ee.FeatureCollection("users/digdgeografo/curso_GEE/Andalucia");
//var and_dissolve = andalucia.union()
// Añadir la colección al mapa
//Map.addLayer(and_dissolve, {}, "Andalucía");
print(andalucia.first().propertyNames());


// Centrar el mapa en la región de Andalucía
Map.centerObject(andalucia);

//cargamos el datset como variable
var dataset = ee.Image('CGIAR/SRTM90_V4');

//seleccionamos la banda 'elevation'
var elevation = dataset.select('elevation');

//usamos las herramientas slope y aspect de la api disponibles en ee.Terrain (buscar en Docs)
var slope = ee.Terrain.slope(elevation);
var aspect = ee.Terrain.aspect(elevation);

//creamos una imagen compuesta con las 3 variables
var full = ee.Image.cat([elevation, slope, aspect]).clip(andalucia);

// Añadir el dtm full al mapa
Map.addLayer(full, {}, "dtm_full"); //probar el clip y hacerlo como variable
Map.addLayer(andalucia, {}, "Andalucía");

/*No podemos manipular el orden de las capas, solo por el orden en que se mandan. 
Lo que sí se puede hacer es un Map.clear() que nos borrará los elementos del mapa
*/

//ESTADISTICAS ZONALES A UN ROI
var roiStats = full.reduceRegion({
  reducer: ee.Reducer.max(),
  geometry: roi,
  scale: 90,
  maxPixels: 1e9
});
print(roiStats)

//seleccionamos un municipio
//Estadisticas zonales a un municipio
var Almonte = andalucia.filter("nombre == 'Almonte'");
Map.addLayer(Almonte, {color: 'green'}, 'Almonte');


//Estadisticas municpio seleccionado
var AlmonteStats = full.select(['elevation', 'slope']).reduceRegion({
  reducer: ee.Reducer.max(),
  geometry: Almonte,
  scale: 90,
  maxPixels: 1e9
});
print('Almonte', AlmonteStats);


//Estadísticas zonales a la selección
var filtro = ee.Filter.inList('nombre', ['Almonte', 'Monachil', 'Cazorla']);
var munis = andalucia.filter(filtro);
Map.addLayer(munis, {color: 'purple'}, 'Municipios selected');

var selStats = full.reduceRegions({
    collection: munis.select(['nombre']), 
    reducer: ee.Reducer.max(), //ee.Reducer.percentile([90, 95, 99]), 
    scale: 30})
    
print('Seleccion', selStats);


// Filtrar municipios cuya provincia sea Huelva
var municipiosHuelva = andalucia.filter(ee.Filter.eq('provincia', 'Huelva'));

// Añadir al mapa para visualización (opcional)
Map.addLayer(municipiosHuelva, {color: 'blue'}, "Municipios de Huelva");
Map.centerObject(municipiosHuelva);

var HStats = full.reduceRegions({
    collection: municipiosHuelva.select(['nombre']), 
    reducer: ee.Reducer.max(), //ee.Reducer.percentile([90, 95, 99]), 
    scale: 30})

/*
Export.table.toDrive({
  collection: HStats,
  description: 'Huelva data',
  folder: 'GEE_CSIC_2024',
  fileFormat: 'CSV'
});
*/

// Convertir todas las bandas de la imagen a Float32
var full_dtm_float = full.toFloat();

/*
// Exportar la imagen convertida
Export.image.toDrive({
  image: full_dtm_float,
  description: 'full_dtm_export',   // Nombre de la tarea de exportación
  folder: 'GEE_CSIC_2024',          // Carpeta en Google Drive donde se guardará la imagen
  region: roi,                      // Región de exportación
  scale: 30,                        // Resolución en metros
  crs: 'EPSG:32629',                 // Definir el CRS (aquí, WGS 84 como ejemplo)
  maxPixels: 1e13                   // Máximo número de píxeles permitidos
});
*/


Export.table.toDrive({
  collection: municipiosHuelva,           // Tu FeatureCollection
  description: 'municipios_huelva_export', // Nombre de la tarea de exportación
  folder: 'GEE_CSIC_2024',                   // Carpeta en Google Drive donde se guardará el archivo
  fileNamePrefix: 'municipios_huelva',     // Prefijo del nombre del archivo exportado
  fileFormat: 'SHP'                        // Formato de exportación (SHP para shapefile)
});