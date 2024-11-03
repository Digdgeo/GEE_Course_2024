// Crear una colección de puntos con nombres de ciudades y poblaciones en Huelva y Sevilla
var puntos = ee.FeatureCollection([
    ee.Feature(ee.Geometry.Point([-6.0074, 37.3824]), {nombre: 'Sevilla', poblacion: 100000}),
    ee.Feature(ee.Geometry.Point([-6.9447, 37.2614]), {nombre: 'Huelva', poblacion: 200000}),
    ee.Feature(ee.Geometry.Point([-5.9272, 37.3891]), {nombre: 'Otro', poblacion: 50000}),
  ]);
  
  // Asignar tamaño basado en la población
  var asignarEstilo = function(feature) {
    var poblacion = ee.Number(feature.get('poblacion'));
    var pointSize = poblacion.divide(20000).add(5); // Ajusta el divisor y el tamaño base según sea necesario
    return feature.set({style: {color: 'blue', pointSize: pointSize}});
  };
  
  // Aplicar el estilo a cada punto
  var puntosEstilizados = puntos.map(asignarEstilo);
  
  // Agregar la colección estilizada al mapa
  Map.addLayer(puntosEstilizados.style({styleProperty: 'style'}), {}, 'Puntos Estilizados');
  
  // Centrar el mapa en la zona
  Map.centerObject(puntos, 9);
  