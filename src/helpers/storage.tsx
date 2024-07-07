
export const maxSizeInBytes = .005 * (1024 * 1024 * 1024); // 5MB max size of files in variable

const maxWebsocketMessageSize = 9083009 // 9MB buffer size of websocket message

export function getVarSizeInBytes (obj:any) {
    return new Blob([JSON.stringify(obj)]).size;
}

export function getAvailableSpaceInBytes(db: any) {
    return maxSizeInBytes - getVarSizeInBytes(db);
}

export function getAvaliableSpacePercentage(db: any) {
    const avaliable = getAvailableSpaceInBytes(db) / maxSizeInBytes;
    console.log("Avaliable space: ", avaliable, " %");
    
    return avaliable;
}

export function verifyIfTextCanBeStored(db: any, text: string) {
    return getVarSizeInBytes(text) < getAvailableSpaceInBytes(db) && text.length < maxWebsocketMessageSize;
}