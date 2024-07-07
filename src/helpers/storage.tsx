
export const maxSizeInBytes = .1 * (1024 * 1024 * 1024); // 100MB

const maxWebsocketMessageSize = 9083009 // 9MB buffer size of websocket message

export function getVarSizeInBytes (obj:any) {
    return new Blob([JSON.stringify(obj)]).size;
}

export function getAvailableSpaceInBytes(db: any) {
    return maxSizeInBytes - getVarSizeInBytes(db);
}

export function getAvaliableSpacePercentage(db: any) {
    const avaliable = getAvailableSpaceInBytes(db) / maxSizeInBytes;
    return avaliable;
}

export function verifyIfTextCanBeStored(db: any, text: string) {
    return getVarSizeInBytes(text) < getAvailableSpaceInBytes(db) && text.length < maxWebsocketMessageSize;
}