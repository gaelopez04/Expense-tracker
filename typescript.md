# Apuntes TS

Se caracteriza por tener tipado tipo Java

El tipado en TS basicamente se basa en asignar un tipo de tipado en una variable desde un unicio a la cual posteiormente en su reasignacion no acepta otros tipados por ejemplo:

type strinArray = string[];

Posteriormente:

let fruits: strinArray = ["Apple", "Orange"]; 

Que es lo mismo que: 

let fruits: string[] = ["Apple", "Orange"]; 

Simplemente se le da un nombre al tipado.

Como se menciona basicamente haciendo la assign del tipado guardado es decir "stringArray" nos aseguramos que solo tenga ese tipado y no acepte otros tipados por ejemplo:

fruits = ["apple", "Orange", "Pear"]; BIEN
fruits = "Apple"; MAL ES TIPADO string NO string[]

Ejemplos comunes de estos:

tipado en forma de clase, es decir cuando se asigne este tipado a una variable cuando se reasigne un contenido debe coincidir explicitamente con esto:

type Movie = {
    id: number;
    name: string;
    rating: number;
    poster: string;
};

let interestellar: Movie = {
    id: 0,
    name: "Interestellar",
    rating: 8.2,
    poster: "http://image_path....",
};

Entonces con let interestellar: Movie, la variable interestellar solo acepta el formato Movie

En las funciones es algo diferente: 

interface Point {
  x: number;
  y: number;
}
 
function logPoint(p: Point) {
  console.log(`${p.x}, ${p.y}`);
}
 
// logs "12, 26"
const point = { x: 12, y: 26 };
logPoint(point);

Esto normalmente pasa, pero cuando pasa por ejemplo cn: 
const point = { x: 12, y: 26, z: 30 };

Se podria pensar que marcaria error pero el type-check lo deja pasar pero es porque solamente toma en cuenta el x, y simplemente el log usando z, hace lo mismo es decir: 

// logs "12, 26"

Otra react pattern en ts es el de props

function UserApp({user} : Props)

Aqui se le pasa el argument user al componente y tiene tipado Props donde anteiormente se debo haber declarado props algo asi:

type Props = {
    name: string;
    age: number;
};

Entonces el arg user debe coincidir con el tipado Prop, 

Por otro lado cuando se ocupe varios args en un componente es decir:

function UserApp({ user, pet, car}) {...}

Se utiliza de un tipado "diferente":

type Prop = {
    user: user;
    pet: pet;
    car: car;
};

entonces: 


function UserApp({ user, pet, car}: Prop) {...}

Por lo tanto en el type-check debe pasar