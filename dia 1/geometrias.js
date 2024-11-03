var huelva_buffer = huelva.buffer(50000)
var sevilla_buffer = sevilla.buffer(50000)
//var marisma_buffer = marisma.buffer(25000)

Map.addLayer(huelva_buffer, {color:'red'}, 'Huelva Buffer')
Map.addLayer(sevilla_buffer, {color:'blue'}, 'Sevilla Buffer')


// Compute the intersection, display it in green.
var intersection = huelva_buffer.intersection(sevilla_buffer);
Map.addLayer(intersection, {color: '00FF00'}, 'intersection HS');

// Compute the union, display it in magenta.
var union = huelva_buffer.union(sevilla_buffer);
Map.addLayer(union, {color: 'FF00FF'}, 'union');


var clip_union = union.intersection(Marisma)
Map.addLayer(clip_union, {color: 'green'}, 'union clip');

// Compute the difference, display in yellow.
var diff1 = huelva_buffer.difference(sevilla_buffer);
Map.addLayer(diff1, {color: 'FFFF00'}, 'diff1');

// Compute symmetric difference, display in black.
var symDiff = huelva_buffer.symmetricDifference(sevilla_buffer).symmetricDifference(Marisma);
Map.addLayer(symDiff, {color: '000000'}, 'symmetric difference');

print('El area de la marisma es', Marisma.area())
print('El centroide se encuentra en', Marisma.centroid()) //.coordinates()

Map.addLayer(Marisma.centroid(), {}, 'Centroide')

//Feature
// Crear un punto en Sevilla con propiedades
var singlePoint = ee.Feature(
  ee.Geometry.Point([-5.9845, 37.3891]), // Coordenadas de Sevilla
  {name: 'Sevilla', population: 688711} // Propiedades del punto
);

print('Un solo Feature (Sevilla):', singlePoint);
Map.addLayer(singlePoint, {color:'green'}, 'Miarmilandia');

//feature collection
// Crear varios puntos como una colección de Features en Huelva y Sevilla
var pointsCollection = ee.FeatureCollection([
  ee.Feature(ee.Geometry.Point([-5.9845, 37.3891]), {name: 'Sevilla', population: 688711}),
  ee.Feature(ee.Geometry.Point([-6.9447, 37.2614]), {name: 'Huelva', population: 144258}),
  ee.Feature(ee.Geometry.Point([-6.0839, 37.3404]), {name: 'Mairena', population: 27493}),
  ee.Feature(ee.Geometry.Point([-6.3074, 37.2563]), {name: 'Villamanrique', population: 21076})
]);

print('FeatureCollection de varios puntos (Sevilla y Huelva):', pointsCollection);


// Definir una función de estilo basada en el nombre
var estilo = function(feature) {
  var nombre = ee.String(feature.get('name'));
  var color = ee.Algorithms.If(
    nombre.equals('Sevilla'), 'red',
    ee.Algorithms.If(
      nombre.equals('Huelva'), 'green',
    ee.Algorithms.If(
      nombre.equals('Mairena'), 'yellow',
      'blue'
    )
  ));
  return feature.set({style: {color: color, pointSize: 10}});
};

// Aplicar el estilo a cada punto
var puntosEstilizados = pointsCollection.map(estilo);

// Agregar la colección estilizada al mapa
Map.addLayer(puntosEstilizados.style({styleProperty: 'style'}), {}, 'Puntos Estilizados');

// Centrar el mapa en la zona
Map.centerObject(pointsCollection, 9);
