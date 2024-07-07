import { maxLocalStorageSize } from "../appConstants";



/**
 * only use when the ls is clean
 * 
 * @returns El tamaño máximo de almacenamiento en localStorage en bytes
 */
export function getAvailableSpace() {
    const key = "test";
    const max = 1024 * 1024 * 50; // 50 MB, límite razonable
    let min = 0;
    let mid;

    try {
        // Inicialmente intentamos grandes incrementos
        for (let step = max; step > 0; step = Math.floor(step / 2)) {
            mid = min + step;
            try {
                localStorage.setItem(key, "0".repeat(mid));
                min = mid;
            } catch (e) {
                // Error al establecer item, reduce step
            }
        }
        localStorage.removeItem(key);
    } catch (e) {
        localStorage.removeItem(key);
    }
    localStorage.removeItem(key);
    return min; // return the size in bytes
}



export function verifyIfTextCanBeStored(text: string) {
//  test how much space is missing by filling the localStorage and then removing the test data
    let leftSpace = getAvailableSpace()    
    // console.log("msg length: ", text.length);
    // console.log("left space: ", leftSpace);
    
    
    return leftSpace >= text.length;
//   let max = getMaxLocalStorageSize();
//   return usage <= max;
}

function getMissingPercentage() {
    let leftSpace = getAvailableSpace();
    let max = maxLocalStorageSize;

    console.log("left space: ", leftSpace);
    console.log("max: ", max);
    
    return (leftSpace / max) * 100;
}

export function getAvaliableSpacePercentage() {
    return 100 - getMissingPercentage();
}
