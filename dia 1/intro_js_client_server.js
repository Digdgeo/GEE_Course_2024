var clientString = 'I am a String';
print(typeof clientString);  // string

var serverString = ee.String('I am not a String!');
print(typeof serverString);  // object
print('Is this an EE object?', serverString instanceof ee.ComputedObject);  // true
    
print(serverString);  // I am not a String

print(serverString.toString());  // ee.String("I am not a String!")

var mystr = serverString.toString();
print(typeof mystr)

var someString = serverString.getInfo(); //notar las diferencias con y sin getINfo()
var strings = someString + '  Am I?';
print(strings);  // I am not a String!  Am I?

//loops
var clientList = [];
for(var i = 0; i < 10; i++) {
  clientList.push(i + 1);
}
print(clientList);

var clientList = [];
for (var i = 0; i < 10; i++) {
  var num = i + 1;
  clientList.push(num % 2 === 0 ? num + 10 : num);
}
console.log(clientList);

var clientList = [];
for (var i = 1; i <= 10; i++) {  // i empieza en 1 y termina en 10
  clientList.push(i % 2 === 0 ? i + 10 : i);
}
print(clientList);

//server side
var serverList = ee.List.sequence(0, 10);
serverList = serverList.map(function(n) {
  return ee.Number(n).add(1);
});
print(serverList);

// Mapear para añadir 10 solo a los números pares
var updatedClientList = clientList.map(function(n) {
  var number = ee.Number(n);
  return ee.Algorithms.If(number.mod(2).eq(0), number.add(100), number.divide(2)); //diferencias con /
});

print(updatedClientList);

//Condicionales
var myList = ee.List([1, 2, 3]);
var serverBoolean = myList.contains(5);
print(serverBoolean);  // false

var clientConditional;
if (serverBoolean) {
  clientConditional = true;
} else {
  clientConditional = false;
}
print('Should be false:', clientConditional);  // True!

var serverConditional = ee.Algorithms.If(serverBoolean, 'True!', 'False!');
print('Should be false:', serverConditional);  // False!


//funciones
var suma = function(a1, a2, a3) {
    var a11 =  a1 + a2 + a3;
    print(a11 + a1 + a2 + a3);
  }
  
  print(suma(10,1,3) + 10)
  