# GEE_Course_2024

Repositorio con el curso del Gabinete de Formación del CSIC de Google Earth Engine 2024. 

Enlace a la presentación (pinchar en la imagen):
[![presentacion](https://i.imgur.com/OHeV2jn.png)](https://slides.com/diegogarciadiaz/google-earth-engine/fullscreen)


## Día 1

Lo mejor, la presentación de los alumnos. Luego, mal que bien, hemos hecho una introducción al "ecosistema" de GEE. Hemos creado las cuentas de usuario, hemos visto algunos ejemplos de *time lapses*, donde buscar documentación de la API y hemos estado trabajando un poco con el [Earth Explorer](https://explorer.earthengine.google.com/#workspace) y viendo uns scripts básicos de introducción a javascript en el code editor. 
Finalmente, hemos cargado una imagen Landsat sobre la que hemos creado algunos índices con las distintas formas de operar sobre rasters en GEE, y hemos acabado cargando una colleción de imagenes Landsat, sobre la que estamos empezando a aplicar filtros para quedarnos con las imágenes de interes. 

Recopilando y siendo optimistas, hemos visto:

* Entorno GEE
* Trabajar con GEE Explorer para cargar y operar sobre las capas
* Combinar varias imágenes (*cat*)
* Algoritmos para derivar información de un DTM
* Creación de umbrales (reclasificación de rasters) 
* Selección y renombre de bandas
* Operaciones aritméticas sobre las bandas


![dia 1](https://i.imgur.com/22sQYon.jpeg)

## Día 2

Finalmente fuimos lentos pero seguros e hicimos el repado de las cosas fundamentales vistas el día anterior, además y como punto fuerte, 
hemos visto como usar los reductores en las colecciones de imágenes. En la misma línea, hemos estado viendo como usar funciones y mapearlas a una colección de imágenes. 

Por último, tras un mini debate, acordamos que vamos a pasar los scritps más o menos terminados, para ir avanzando más rápido. La idea es que eso nos permita comentarlos sin perder 
el tiempo escribiendo (yo no estoy muy seguro de que sea la mejor opción, pero es la que se ha elegido por consenso). 

Para acabar, hicimos una prueba de pasar y ejecutar/comentar el código de las composiciones estacionales de NDVI y creo que más o menos fue bien. 
Por cierto, también hay productos estacionales de NDWI... 😳😳😳


![dia 2](https://i.imgur.com/h9CpJAo.jpeg)

## Día 3

Más o menos hemos acabado con la parte de javascrip. Empezamos viendo un script con datos *censurados* y datos del Global Fishing Watch
para ver como cruzar datos puntuales con datos raster. Continuamos trabajando con series temporales y reductores con Landsat, viendo la evolución en la inundación por periodos de la laguna de Santa Olalla. Y acabmos viendo el script para observqar el tráfico marítimo con Sentinel 1 (por fin! 😊).


![dia 3](https://i.imgur.com/yNT5KMI.jpeg)


## Día 4

Hemos estado viendo, muy por encima, la clasificación de una Sentinel 2 y un ejemplo de como actuar sobre el objeto mapa con
una comparativa de máscaras de nubes en la que dividimos el panel de mapas en 4 elementos *linkeados*. También vios muy brevemente un ejemplo de mini app con máscaras de inundación de la marisma y 
un ejemplo aplicando el script de *seasonality* para caracterizar cada pixel con datos derivados de la curva harmónica de una serie de vegetación, que usamos
para ver el decaimiento de los pinares en el Espacio Natural de Doñana.

Luego pasamos ya a la mini introducción a Python y a ver el entorno de Google Colab. Por último, estuvimos trabajando con la increíblemente 
maravillosa librería de python Ndvi2Gif 😉, con la que vimos como trabajar con las composiciones de índices multi-estacinales como los que estuvimos viendo el día anterior 
desde el code-editor.


![dia 4](https://i.imgur.com/4HIkQ6C.jpeg)


## Día 5

Objetivo: Seguir con Geemap todo el día y que el curso acabe bien 🚀

![dia5](https://i.imgur.com/phVnkAl.jpeg)