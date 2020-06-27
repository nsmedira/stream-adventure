let array = ['line 1', 'line 2', 'line 3']
var blob = ''
for ( var i = array.length - 1 ; i >= 0 ; i-- ) {

    // console.log(array[i])

    var string = ''
    for ( var j = array[i].length - 1 ; j >= 0 ; j-- ) {
        string += array[i][j]
        // console.log(string)
    }
    blob += string + '\n'

}
console.log(blob)