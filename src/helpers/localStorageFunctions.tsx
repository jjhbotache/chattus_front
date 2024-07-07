export function getLocalStorageUsage() {
  let total = 0;
  for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
          const item = localStorage.getItem(key);
          if (item !== null) {
              total += item.length;
          }
      }
  }
  return total;
}


/**
 * only use when the ls is clean
 * 
 * @returns El tamaño máximo de almacenamiento en localStorage en bytes
 */
export function getMaxLocalStorageSize() {
    
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


export function verifyIfTextCanBeStored(text: string, currentUsage: number = getLocalStorageUsage()) {
  let usage = currentUsage + text.length;
  let max = getMaxLocalStorageSize();
  return usage <= max;
}