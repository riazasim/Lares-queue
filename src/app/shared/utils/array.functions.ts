export const getIndexByIdObjectArray = (id: number, array: any[]): number|null => {
    let index = null;
    const length = array.length;
    for (let i = 0; i < length; i++) {
        if (id === array[i].id) {
            index = i;
            break;
        }
    }

    return index;
}