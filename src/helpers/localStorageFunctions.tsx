import { maxLocalStorageSize } from "../appConstants";



/**
 * only use when the ls is clean
 * 
 * @returns El tamaño máximo de almacenamiento en localStorage en bytes
 */
export function getAvaliableSpace() {
    
    let testKey = 'test';
    let testData = 'x';
    try {
        // Intentar llenar el localStorage
        while (true) {
            localStorage.setItem(testKey, testData);
            testData += testData; // Duplica el tamaño del dato en cada iteración
        }
    } catch (e) {
        // Se ha alcanzado el límite
        let max = testData.length / 2; // La última operación fallida duplicó el tamaño de datos
        localStorage.removeItem(testKey);
        return max;
    }
}


export function verifyIfTextCanBeStored(text: string) {
//  test how much space is missing by filling the localStorage and then removing the test data
    let leftSpace = getAvaliableSpace()    
    // console.log("msg length: ", text.length);
    // console.log("left space: ", leftSpace);
    
    
    return leftSpace >= text.length;
//   let max = getMaxLocalStorageSize();
//   return usage <= max;
}

function getMissingPercentage() {
    let leftSpace = getAvaliableSpace();
    let max = maxLocalStorageSize;
    return (leftSpace / max) * 100;
}

export function getAvaliableSpacePercentage() {
    return 100 - getMissingPercentage();
}
