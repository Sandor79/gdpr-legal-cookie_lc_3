
export default function (items, index, direction = "descending") {
    return [...items].sort((rowA, rowB) => {
        if (rowA[index].toLowerCase() < rowB[index].toLowerCase()) return direction === 'descending' ? -1 : +1
        if (rowA[index].toLowerCase() > rowB[index].toLowerCase()) return direction === 'descending' ? +1 : -1
        else return 0
    });
}
