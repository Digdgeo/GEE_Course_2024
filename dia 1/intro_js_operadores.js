print('Hello, GEE world!');
console.log('Hello, GEE world!')

var gee = 'Hello, GEE world!'
print(gee)

print("'let's go'")

var a = 10;
var b = 3;
var c = 5;
var x = 5;
var y = "5";
var isAdult = true;
var hasTicket = false;
var age = 18;



//Artimeticos
print("Suma:", a + b);         // 13
print("Resta:", a - b);        // 7
print("Multiplicación:", a * b); // 30
print("División:", a / b);     // 3.3333
print("Módulo:", a % b);       // 1
print("Incremento:", ++a);     // 11
print("Decremento:", --b);     // 2


//Asignacion
c += 3;  // Equivale a c = c + 3
print("+=:", c); // 8
c -= 2;  // Equivale a c = c - 2
print("-=:", c); // 6
c *= 2;  // Equivale a c = c * 2
print("*=:", c); // 12
c /= 3;  // Equivale a c = c / 3
print("/=:", c); // 4
c %= 3;  // Equivale a c = c % 3
print("%=:", c); // 1


//Comparacion
print("== :", x == y);       // true (compara solo valor)
print("===:", x === y);      // false (compara valor y tipo)
print("!= :", x != y);       // false (compara solo valor)
print("!==:", x !== y);      // true (compara valor y tipo)
print(">  :", x > 3);        // true
print("<  :", x < 10);       // true
print(">= :", x >= 5);       // true
print("<= :", x <= 4);       // false


//Logicos
print("AND (&&):", isAdult && hasTicket); // false
print("OR (||):", isAdult || hasTicket);  // true
print("NOT (!):", !isAdult);              // false


var access = age >= 18 ? "Acceso permitido" : "Acceso denegado";
print("Acceso:", access); // "Acceso permitido"