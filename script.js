const btnCreate = document.querySelector('.btnCreateVertex');
const btnOutMatrix = document.querySelector('.outMatrixs');
const dataEntry = document.querySelector('.dataEntry');
const td = document.querySelectorAll('td');
const tableA = document.querySelector('.tableOfMatrixA');
const vertexValue = document.querySelector('.vertexInput');
const nameOfMatrixA = document.querySelector('.nameOfMatrixA');
const lines = document.querySelector('.lines');

const tableB = document.querySelector('.tableOfMatrixB');
const nameOfMatrixB = document.querySelector('.nameOfMatrixB');


 btnCreate.addEventListener('click', getValue);

function getValue() {
    tableB.textContent = '';
    const valueOfInput = vertexValue.value;
    if (!valueOfInput) {
        alert('Поле пустое');
        return;
    }
    dataEntry.textContent = '';
    for (let i = valueOfInput; i > 0; i--) {
        dataEntry.insertAdjacentHTML('afterbegin', 
        `
        <div class="first"> 
            <div>G<sup>-</sup>(${i}) </div>
            <input type="text" class="inputOfNumbers">
        </div>
        `
        )
    }
    btnOutMatrix.style.display = 'block';
    btnOutMatrix.addEventListener('click', outMatrix);
}

function deleteBlock(e) {
    if (e.target.tagName === 'BUTTON') {
        e.target.parentElement.remove();
    }
}

function division(Gp){//заполнение R, или Q
    let R = [];
    let sub_R = [];
    sub_R.push(1);

    for(let i = 0; i < Gp.length; i++){//заполняем первый уровень
        for(let k = 0; k < Gp[i].length;k++){
            if(i == 0 ){
                if(Gp[i][k] != 0){
                    sub_R.push(k+1);
                }
            }
        }
    }
    R.push(sub_R);
    sub_R = [];
    for (x = 0; x < 20; x++){ //заполняем остальные
        for (let i = 0; i < Gp.length; i++) {
            for (let k = 0; k < Gp[i].length;k++) {
                for (let j = 0; j < R.length; j++){
                    if (R[j].indexOf(i+1) != -1 && Gp[i][k] != 0 && R.flat().indexOf(k+1) == -1){
                        sub_R.push(k+1);
                        // console.log(k+1);
                    }
                }   
            }
        }
        R.push(sub_R);
        if(sub_R.length == 0){
            x = 20;
        }
        sub_R = [];
    }
    R.pop();
    return R;
    console.log(R);
}

function outMatrix() {
    btnOutMatrix.style.display = 'none';
    let valueOfInput = Number(vertexValue.value);
    


    let dataOfInputs = Array.from(document.querySelectorAll('.inputOfNumbers'), el => el.value);
    let arr = [];

    for (let t = 0; t < dataOfInputs.length; t++) {
        arr[t] = dataOfInputs[t].split(' ');
    }
    for (let el in arr) {
        arr[el] = arr[el].map(parseFloat);
    }

    let c = [];
    for(let i = 0; i < arr.length; i++){
        c.push([]);
    }
    console.log(arr)
    
    for (let i = 0; i < arr.length; i++){ // преобразование множества G+ в G-
        for (let j = 0; j < arr[i].length; j++){
            for (let k = 0; k < arr.length; k++){
                if (arr[i][j] - 1 == k){
                    c[k].push(i+1)
                }
            }
        }
    }
    console.log(c);
;
    //arr = левые
    //c = правые 

    let Gm = [];
    for (let i = 0; i < arr.length; i++){
        Gm.push([]);
        for (let j = 0; j < arr.length; j++){
            Gm[i][j] = 0;
        }
    }

    for (let i = 0; i < c.length; i++){ //преобразование множества G- в матрицу смежности
        for (let j = 0; j < c[i].length +1 ; j++){
            for (let k = 0; k < Gm.length +1; k++){
                if (c[i][j] == k){
                    Gm[i][k-1] = 1;
                }
            }
        }
    }

    let PathLengthArr = [];


    for (let i = 0; i < valueOfInput; i++) {
        for (let j = 0; j < valueOfInput; j++) {
            if (i == j) {
                PathLengthArr.push(0);
            } else {
                PathLengthArr.push(99);
            }
        }
    }

    let mas = [];

    for (let i = 0; i < dataOfInputs.length + 1; i++) {
        for (let c = 0; c < dataOfInputs.length + 1; c++) {
            if (i === 0) { }
            else {
                if (c == 0) { }
                else {
                    if (arr[i - 1].indexOf(c) != -1) {
                        mas.push(1)
                    }
                    else {
                        mas.push(0);
                    }
                }
            }
        }
    }

    mas = mas.map((_, i, a) => a.slice(i * valueOfInput, i * valueOfInput + valueOfInput)).filter((el) => el.length);

    let tmp_arr = [];
    tmp_arr = mas;
    mas = Gm;
    Gm = tmp_arr;

    // mas это матрица смежности из g+ для получения R
    // Gm это матрица смежности из g- для получения Q

     console.log('Gp',mas);
     console.log('arr',arr);
     console.log('Gm',Gm);

    let R1, Q1, G1, arrAll = [];
    let R3, Q3, G3;
    let R4, Q4, G4;
    let R8, Q8, G8;
    let next1, next2, next3;
    let varForNext = [];

    for (let i = 0; i < 5; i++) {

    }

    R1 = division(mas); // находим R1
    Q1 = division(Gm); // находим Q1

    R1 = R1.flat(); // поднимаем все массивы на один уровень в R1
    Q1 = Q1.flat(); // поднимаем все массивы на один уровень в Q1

    // Убираем одинаковые (баг)
    Q1 = Q1.filter( (item, pos) => {
        return Q1.indexOf(item) === pos;
    })

    G1 = subgraph(R1, Q1); // находим сильно связанный подграф
    arrAll.push(G1); // заносим в общий массив
    arrAll = arrAll.flat();

    varForNext.push(G1)
    varForNext = varForNext.flat();

    next1 = nextSmallNumber(G1); // находим следующую вершину с меньшим номером

   
    console.log("R1", R1);
   
    dataEntry.textContent = '';
    dataEntry.insertAdjacentHTML('beforeend', 
    `
    <div class="output_cont"> 
    <p>R(1) = (${R1})</p> </br>
    <p>Q(1) = (${Q1})</p> </br>
    <p>G(1) = (${G1})</p> </br>
    </div>
    `
    )
    
        console.log('\n');
    

    let R, Q, G;
    let arrOfG = [];
    arrOfG.push(G1);

    for(let i = 0; i < 10; i++) {
        if (arrAll.length === valueOfInput) {
            console.log("Конец!");
            break;
        }
        R = getNextR(divisionForRest(mas, next1).flat(), arrAll.flat()); // находим R3
        Q = getNextR(divisionForRest(Gm, next1).flat(), arrAll.flat()); // находим Q3
        G = subgraph(R, Q); // находим G3
        arrAll.push(G); // заносим в общий массив
        arrAll = arrAll.flat();

        varForNext.push(G)
        varForNext = varForNext.flat();

        console.log(`R${next1}`, R);
        console.log(`Q${next1}`, Q);
        console.log(`G${next1}`, G);
        console.log('\n');
        console.log("Next1:", next1);
        console.log('\n');
      
    dataEntry.insertAdjacentHTML('beforeend', 
    `
    <div class="output_cont"> 
    <p>R(${next1}) = (${R})</p> </br>
    <p>Q(${next1}) = (${Q})</p> </br>
    <p>G(${next1}) = (${G})</p> </br>
    </div>
    `
    )
   

        next1 = nextSmallNumber(varForNext); // находим следующую вершину с меньшим номером

        arrOfG.push(G);
    }

    let temp = [];
    let temp2 = [];
    let newTemp = [];
    let newTemp2 = [];

    for (let g = 0; g < arrOfG.length; g++) {
        for (let gg = 0; gg < arrOfG[g].length; gg++) {
            for (let i = 0; i < dataOfInputs.length; i++) {
                if (mas[arrOfG[g][gg] - 1][i] == 1) {
                    temp.push(i + 1);
                }
            }
        }
        temp2.push(temp);
        temp = [];
    }

    for (let i = 0; i < temp2.length; i++) {
        temp2[i] = temp2[i].filter( (item, pos) => {
            return temp2[i].indexOf(item) === pos;
        })
    }

    for (let i = 0; i < arrOfG.length; i++) {
        arrOfG[i].filter(item => {
            if (temp2[i].indexOf(item) !== -1) {
                temp2[i].splice(temp2[i].indexOf(item), 1);
            }
        });
    }

    for (let k = 0; k < arrOfG.length; k++) {
        for (let i = 0; i < arrOfG.length; i++) {
            for (let j = 0; j < arrOfG[i].length; j++) {
                if (arrOfG[i].indexOf(temp2[k][j]) !== -1) {
                    newTemp.push(i + 1)
                }
            }
        }
        newTemp2.push(newTemp);
        newTemp = [];
    }

    for (let i = 0; i < newTemp2.length; i++) {
        newTemp2[i] = newTemp2[i].filter( (item, pos) => {
            return newTemp2[i].indexOf(item) === pos;
        })
    }

    console.log("newTemp2", newTemp2);
    
    

    // Matrix B

    arr = newTemp2;
    console.log(arr);
    sumOfArcs = [].concat(...arr);
    sumOfArcs = sumOfArcs.filter(Number);
    let lineMas = sumOfArcs.filter(Number);
    sumOfArcs = sumOfArcs.length; // количество дуг

    sumOfArcs = 5;

    console.log("sumOfArcsssssssssssssss", sumOfArcs);

    let numberOfArcs = [];
    let iteration = 1;
    numberOfArcs = arr.map(el => {
        return el.map(() => {
            return iteration++;
        });
    })

    console.log("numberOfArcs:::", numberOfArcs);
    const fragment2 = document.createDocumentFragment();
    for (let i = 0; i < newTemp2.length + 1; i++) {
        const tr = document.createElement('tr');
        for (let c = 0; c < sumOfArcs + 1; c++) {
            if (i === 0) { // если первая строчка
                const th = document.createElement('th');
                if (c === 0) {
                    th.textContent = ' '; // если первый лево боковой элемент
                }
                else {
                    th.textContent = c; // верхняя строчка заполняется 1, 2, 3, 4...
                }
                tr.appendChild(th);
            }
            else { // все остальные
                if (c == 0) { // 
                    const th = document.createElement('th');
                    th.textContent = i;
                    tr.appendChild(th);
                }
                else {
                    const td = document.createElement('td');
                    if (numberOfArcs[i - 1].indexOf(c) != -1) { // беру массив данной строчки и проверяю есть ли там нужное число
                        td.textContent = 1;
                    }
                    else if (lineMas[c - 1] == i){
                        td.textContent = -1;
                    }
                    else {
                        td.textContent = 0;
                    }
                    // console.log(lineMas[c - 1], `${i} | ${c}`);
                    tr.appendChild(td);
                }
            }
        }
        fragment2.appendChild(tr); // добавляем вторую таблицу в фрагмент (B)
    }
    nameOfMatrixB.style.display = 'block';
    tableB.textContent = '';
    tableB.appendChild(fragment2);
}


function subgraph(array1, array2) {
    let array3 = [];

    for (let i = 0; i < array2.length; i++) {
        if (array1.indexOf(array2[i]) !== -1) {
            array3.push(array2[i]);
        }
    }

    return array3;
}

function divisionForRest(Gp, num){//заполнение R, или Q
    let R = [];
    let sub_R = [];
    sub_R.push(num);
    R.push([num]);

    sub_R = [];
    for (x = 0; x < 20; x++){ //заполняем остальные
        for (let i = 0; i < Gp.length; i++) {
            for (let k = 0; k < Gp[i].length;k++) {
                for (let j = 0; j < R.length; j++){
                    if (R[j].indexOf(i+1) != -1 && Gp[i][k] != 0 && R.flat().indexOf(k+1) == -1){
                        sub_R.push(k+1);
                        // console.log(k+1);
                    }
                }   
            }
        }
        R.push(sub_R);
        if(sub_R.length == 0){
            x = 20;
        }
        sub_R = [];
    }
    R.pop();
    return R;
}

function getNextR(arr1, arr2) {
    let arr3 = [];

    arr1 = arr1.filter( (item, pos) => {
        return arr1.indexOf(item) === pos;
    })

    arr1.filter(item => {
        if (arr2.indexOf(item) === -1) {
            arr3.push(item);
        }
    });

    return arr3;
}


function nextSmallNumber(arr) {
    let arrOfNumbers = [];

    arr.sort(function (a, b) {
        return a - b;
    });

    for (let i = 0; i < arr[arr.length - 1]; i++) {
        arrOfNumbers.push(i + 1);
    }

    for (let i = 0; i < arrOfNumbers.length; i++) {
        if (arr.indexOf(arrOfNumbers[i]) === -1) {
            return arrOfNumbers[i];
        }
    }

    return arr[arr.length - 1] + 1;
}




