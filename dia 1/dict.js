// Crear un diccionario para almacenar datos de una persona
var persona = {
    nombre: "Juan",
    edad: 30,
    ciudad: "Madrid",
    profesion: "Ingeniero"
  };
  
  print(persona)
  
  // Acceder a los valores del diccionario
  print(persona.nombre); // Salida: Juan
  print(persona["edad"]); // Salida: 30
  
  // Añadir una nueva propiedad al diccionario
  persona.pais = "España";
  print(persona.pais); // Salida: España
  
  // Modificar una propiedad existente
  persona.edad = 31;
  print(persona.edad); // Salida: 31
  
  // Eliminar una propiedad
  delete persona.ciudad;
  print(persona); // Muest