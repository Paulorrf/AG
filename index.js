/**
 * Equação Utilizada:
 * f(x,y) = 2 - (x-2)^2 - (y-3)^2
 */

//retorna um valor aleatorio de 0 a number
function randomNumber(number) {
  return Math.floor(Math.random() * (number + 1));
}

//f(x,y) = 2 - (x-2)^2 - (y-3)^2
function equacao(x, y) {
  return 2 - Math.pow(x - 2, 2) - Math.pow(y - 3, 2);
}

/**
 * Transforma binarios que possuem somente um numero em 3
 * por exemplo 11 fica 011 e 1 fica 001
 *  */
function converter3casas(valueString) {
  if (valueString.length === 1) {
    valueString = "00" + valueString;
  } else if (valueString.length === 2) {
    valueString = "0" + valueString;
  }

  return valueString;
}

//ordena em ordem decrescente
function sortDesc(arr) {
  return arr.sort((a, b) => b[3] - a[3]);
}

function createNewSubject(value, arrCut, valorCorte) {
  let newArr = [];

  for (let i = 0; i < valorCorte; i++) {
    newArr.push(value.concat(arrCut[randomNumber(3)]));
  }

  return newArr;
}

//Cria uma nova população
function createNewPopulation(arr) {
  let newPopulation = [];
  let valorCorte = 5;

  //pega somente os dois ultimos valores do cromossomo. ex: 01 11
  arrayLast2Digits = arr.map((arrValue) => {
    return arrValue[2].slice(4);
  });

  //transforma o array de 10 posições para um array com as 4 primeiras somente
  arr = arr.slice(0, 4);

  /**
   * Para cada valor do array cria um número
   * de cromossomos baseado no valorCorte,
   * neste caso 4 do primeiro, 3 do segundo e assim por diante
   */
  newPopulation = arr.map((value) => {
    valorCorte = valorCorte - 1;
    return createNewSubject(value[2].slice(0, 4), arrayLast2Digits, valorCorte);
  });

  //transforma o array em unidimensional(contem somente os cromossomos)
  return newPopulation.flat(1);
}

//faz a mutação
function mutation(population, leng) {
  let cromossomo = [];
  let randomPopulation;
  let randomCromo;

  for (let i = 0; i < leng; i++) {
    //pega um dos valores do cromossomo de 0 a 5 para mudar
    randomCromo = randomNumber(5);

    //pega um dos valores do array, padrão de 0 a 9
    randomPopulation = randomNumber(population.length - 1);

    cromossomo = population[randomPopulation];

    //transforma em um array de strings
    cromossomo = [...cromossomo];

    //troca o valor do cromossomo selecionado
    cromossomo[randomCromo] = cromossomo[randomCromo] === "0" ? "1" : "0";

    //transforma em string
    population[randomPopulation] = cromossomo.join("");
  }

  return population;
}

//transforma de binario para decimal
function decodification(val) {
  let x = val.slice(0, 3);
  let y = val.slice(3);

  x = parseInt(x, 2);
  y = parseInt(y, 2);

  return [x, y];
}

//mostra os valores na tela(index.html)
function displayArray(arr, tagRef, id) {
  let valor = arr.map((value) => {
    let tag = document.createElement(tagRef);
    let text = document.createTextNode(value.join(" | "));
    //return tag.appendChild(text);
    tag.appendChild(text);
    let element = document.getElementById(id);
    element.appendChild(tag);
  });

  let tag = document.createElement("br");
  let element = document.getElementById(id);
  element.appendChild(tag);
}

//array
let arrayNumbers = [];
let binaryArray = [];
let arrayLast2Digits = [];
let newPopulation = [];
let finalArray = [];

//int
let individuos = 10;
let newPopulationLength;

/**
 * cria x e y, seus respectivos binários, cromossomo e o resultado da equacao
 * posição 0 e 1 do array são o x e y,
 * posição 2 do array é uma string que é o valor do cromossomo
 * posição 3 do array é o resultado da equacao(x, y)
 */
//passo1, passo2, passo3, passo4
function createXYandCromo() {
  let x;
  let y;
  let cromossomo;
  let equacaoResult;

  for (let i = 0; i < individuos; i++) {
    x = randomNumber(7);
    y = randomNumber(7);

    cromossomo =
      converter3casas(x.toString(2)) + converter3casas(y.toString(2));

    equacaoResult = equacao(x, y);

    arrayNumbers.push([x, y, cromossomo, equacaoResult]);
  }

  return arrayNumbers;
}

arrayNumbers = createXYandCromo();

//passo5
arrayNumbers = sortDesc(arrayNumbers);

//passo 6
// arrayNumbers = arrayNumbers.slice(0, 4);

// arrayLast2Digits = arrayNumbers.map((arr) => {
//   return arr[2].slice(4);
// });

//passo7, passo8
newPopulation = createNewPopulation(arrayNumbers);

//12 genes
newPopulationLength = Math.round(newPopulation.join("").length / 12);

//passo9
let mutatedPopulation;
mutatedPopulation = mutation(newPopulation, newPopulationLength);

//passo10
function decode(arr) {
  mutatedPopulation = arr.map((cromo) => {
    let x, y;
    let eqResult;

    [x, y] = decodification(cromo);
    eqResult = equacao(x, y);

    return [x, y, cromo, eqResult];
  });

  return sortDesc(mutatedPopulation);
}

finalArray = decode(mutatedPopulation);

displayArray(finalArray, "p", "original");

console.log("primeiro array");
console.log(finalArray);

let count = 0;
let newPopu = [];
let arrDesc = [];
let popuLength;
let mutantedNewPopu;
let finalArray2 = [];

//numero de epocas
while (count < 5 && finalArray[0][3] !== 2) {
  newPopu = createNewPopulation(finalArray);

  popuLength = Math.round(newPopu.join("").length / 12);

  mutantedNewPopu = mutation(newPopu, popuLength);

  finalArray = decode(mutantedNewPopu);

  displayArray(finalArray, "h4", "new");

  console.log("Novo array");
  console.log(finalArray);
  console.log(count);

  if (finalArray[0][3] === 2) {
    console.log("achou função = 2");
    //console.log(finalArray);
    break;
  }

  count++;
}
