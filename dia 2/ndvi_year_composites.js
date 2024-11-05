//Año 2016

var inv_16 = ee.ImageCollection('LANDSAT/COMPOSITES/C02/T1_L2_32DAY_NDVI')
                  .filterDate('2016-01-01', '2016-03-31')
                  .select('NDVI').max();

var prim_16 = ee.ImageCollection('LANDSAT/COMPOSITES/C02/T1_L2_32DAY_NDVI')
                  .filterDate('2016-04-01', '2016-06-30')
                  .select('NDVI').max();

var ver_16 = ee.ImageCollection('LANDSAT/COMPOSITES/C02/T1_L2_32DAY_NDVI')
                  .filterDate('2016-07-01', '2016-09-30')
                  .select('NDVI').max();
//Año 2017

var inv_17 = ee.ImageCollection('LANDSAT/COMPOSITES/C02/T1_L2_32DAY_NDVI')
                  .filterDate('2017-01-01', '2017-03-31')
                  .select('NDVI').max();

var prim_17 = ee.ImageCollection('LANDSAT/COMPOSITES/C02/T1_L2_32DAY_NDVI')
                  .filterDate('2017-04-01', '2017-06-30')
                  .select('NDVI').max();

var ver_17 = ee.ImageCollection('LANDSAT/COMPOSITES/C02/T1_L2_32DAY_NDVI')
                  .filterDate('2017-07-01', '2017-09-30')
                  .select('NDVI').max();
//Año 2018

var inv_18 = ee.ImageCollection('LANDSAT/COMPOSITES/C02/T1_L2_32DAY_NDVI')
                  .filterDate('2018-01-01', '2018-03-31')
                  .select('NDVI').max();

var prim_18 = ee.ImageCollection('LANDSAT/COMPOSITES/C02/T1_L2_32DAY_NDVI')
                  .filterDate('2018-04-01', '2018-06-30')
                  .select('NDVI').max();

var ver_18 = ee.ImageCollection('LANDSAT/COMPOSITES/C02/T1_L2_32DAY_NDVI')
                  .filterDate('2018-07-01', '2018-09-30')
                  .select('NDVI').max();
//Año 2019
                  
var inv_19 = ee.ImageCollection('LANDSAT/COMPOSITES/C02/T1_L2_32DAY_NDVI')
                  .filterDate('2019-01-01', '2019-03-31')
                  .select('NDVI').max();

var prim_19 = ee.ImageCollection('LANDSAT/COMPOSITES/C02/T1_L2_32DAY_NDVI')
                  .filterDate('2019-04-01', '2019-06-30')
                  .select('NDVI').max();

var ver_19 = ee.ImageCollection('LANDSAT/COMPOSITES/C02/T1_L2_32DAY_NDVI')
                  .filterDate('2019-07-01', '2019-09-30')
                  .select('NDVI').max();
                  
//Año 2020
                  
var inv_20 = ee.ImageCollection('LANDSAT/COMPOSITES/C02/T1_L2_32DAY_NDVI')
                  .filterDate('2020-01-01', '2020-03-31')
                  .select('NDVI').max()
                  .rename('invierno');

var prim_20 = ee.ImageCollection('LANDSAT/COMPOSITES/C02/T1_L2_32DAY_NDVI')
                  .filterDate('2020-04-01', '2020-06-30')
                  .select('NDVI').max()
                  .rename('primavera');

var ver_20 = ee.ImageCollection('LANDSAT/COMPOSITES/C02/T1_L2_32DAY_NDVI')
                  .filterDate('2020-07-01', '2020-09-30')
                  .select('NDVI').max()
                  .rename('verano');
                  
var oto_20 = ee.ImageCollection('LANDSAT/COMPOSITES/C02/T1_L2_32DAY_NDVI')
                  .filterDate('2020-10-01', '2020-12-31')
                  .select('NDVI').max()
                  .rename('otono');


var year16 = ee.Image.cat(inv_16, prim_16, ver_16).clip(geometry);
var year17 = ee.Image.cat(inv_17, prim_17, ver_17).clip(geometry);
var year18 = ee.Image.cat(inv_18, prim_18, ver_18).clip(geometry);
var year19 = ee.Image.cat(inv_19, prim_19, ver_19).clip(geometry);
var year20 = ee.Image.cat(inv_20, prim_20, ver_20, oto_20).clip(geometry);

var median = year20.reduce(ee.Reducer.mean())
var mask = median.gt(0.20);
var year_2020_masked = year20.mask(mask);
//var collection = ee.ImageCollection(year16).merge(year17).merge(year18).merge(year19);


Map.centerObject(geometry, 9);
//Map.addLayer(year_2016_masked, {'min': 0.1, 'max': 0.7}, '2016');
//Map.addLayer(geometry, {opacity: 0.7}, 'geometria');
//Map.addLayer(year17, {'min': 0.1, 'max': 0.7}, '2017');
//Map.addLayer(year18, {'min': 0.1, 'max': 0.7}, '2018');
//Map.addLayer(year19, {'min': 0.1, 'max': 0.7}, '2019');
Map.addLayer(year20, {'min': 0.1, 'max': 0.7}, '2020');
Map.addLayer(year_2020_masked, {'min': 0.25, 'max': 0.7}, '2020_masked');