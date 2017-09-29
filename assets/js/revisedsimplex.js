
/*	Simplex Tableau
		  x1  x2  x3  x4  x5  x6
	┌───┬───────────────────────┐
	│-d │		 c^(T)x	        │
    ├───┼───────────────────────┤                      
	│	│					    │
    │ b │ 		   A    	    │
    │	│					    │
	└───┴───────────────────────┘	*/

var tableau = [];

function revisedSimplex() {
	/*let M = [
		[-4, 0, 1, -3, 2, -5, 1, 0],
		[2, 1, -1, 1, 1, 2, -1, 0],
		[1, 0, 4, -2, 1, 1, 3, 1]
	];*/

	let M = cloneArray(tableau);
	let Q = [];						// The identity matrix.
	let Ms = [];					// An array holding all instances of M.
	let Qs = [];					// An array holding all instances of Q.
	let Ps = [];					// An array holding all instances of P (Qi+1 * Qi).
	let identityColumns = [];		// An array holding the current identity columns. 

	Q = setIdentityMatrix(getIdentityMatrixSize(M));
	Ms.push(M);													// Push original M matrix to the array.

	let currentM = Ms[Ms.length - 1];

	identityColumns = getIdentityColumns(currentM);		// Push identity columns of first tableau to the array.

	while (arrayHasNegative(sliceFirstElement(currentM[0]))) {
		let neg_d = currentM[0][0];								// The -d in the Simplex Tableau.
		let c = sliceFirstElement(currentM[0]);					// The c^(T)x in the Simplex Tableau.
		let b = sliceFirstElement(getColumn(currentM, 0));		// The b in the Simplex Tableau.
		let A =	sliceFirstElement(currentM);					// The A in the Simplex Tableau.

		for(let i = 0; i < A.length; i++) {
			A[i] = sliceFirstElement(A[i]);
		}

		// 1) Get the pivot and pivot column elements.
		let pivotColumn = getPivotColumn(c);
		let pivotRow = getPivotRow(b, A, pivotColumn);
		let pivot = currentM[pivotRow][pivotColumn];
		let pivotColElems = [];

		for(let i = 0; i < M.length; i++) {
			pivotColElems.push(currentM[i][pivotColumn]);
		}

		// 2) Apply the row operations to the identity matrix.
		let tempQ = cloneArray(Q);

		// Set the pivot equal to 1. Formula: pivotRow * (inverse of pivot).
		for(let i = 0; i < Q.length; i++) {
			tempQ[pivotRow][i] *= inverse(pivot);
		}

		// Set the other values in pivot column equal to 0. Formula: row - (pivot row) * (corresponding pivot column element).
		for(let i = 0; i < Q.length; i++) {
			if(i == pivotRow) {
				continue;	
			}

			for(let j = 0; j < Q.length; j++) {
				tempQ[i][j] -= tempQ[pivotRow][j] * pivotColElems[i];
			}
		}

		Qs.push(tempQ);

		// Determine the outgoing identity column and replace it with the pivot column to set the new identity columns.

		let outgoingIdentityColumn;

		for(let i = 0; i < identityColumns.length; i++) {
			if(getIdentityRows(currentM, identityColumns)[i] == pivotRow) {
				outgoingIdentityColumn = identityColumns[i];
			}
		}

		for(let i = 0; i < identityColumns.length; i++) {
			if(identityColumns[i] == outgoingIdentityColumn) {
				identityColumns[i] = pivotColumn;
			}
		}

		// 3) Multiply (Q or P) and M.
		let currentQ = Qs[Qs.length - 1];
		let previousQ = Qs[Qs.length - 2];
		let currentP = Ps[Ps.length - 1];

		if(Ms.length == 1) {
			Ms.push(revisedMatrixMultiply(currentQ, M, identityColumns));
		} else {
			if(Ms.length == 2) {
				Ps.push(matrixMultiply(currentQ, previousQ));
				currentP = Ps[Ps.length - 1];
			} else {
				Ps.push(matrixMultiply(currentQ, currentP));
				currentP = Ps[Ps.length - 1];
			}

			Ms.push(revisedMatrixMultiply(currentP, M, identityColumns));
		}

		currentM = Ms[Ms.length - 1];
	}

	// Adjust the values. Since javascript cannot handle precisions properly.
	let _Ms = [];	 

	for(let i = 0; i < Ms.length; i++) {
		_Ms.push(fixedTable(Ms[i]));
	}

	for(let i = 0; i < Ms.length; i++) {
		for(let j = 0; j < Ms[0].length; j++) {
			for(let k = 0; k < Ms[0][0].length; k++) {
				_Ms[i][j][k] = removeTrailingZeros(_Ms[i][j][k]);

				if(_Ms[i][j][k].toString().length >= 10) {
					_Ms[i][j][k] = Ms[i][j][k].toString();
				}
			}
		}
	}

	createTable(_Ms);		// Create table with the values in the HTML.
}

// Creates a new table in the html.
function createTable(array) {
	let result_body = document.getElementById("result_body");

	// Display all M tables.
	for(let i = 0; i < array.length; i++) {
	    let p = document.createElement("p");
	    let paragraph = document.createTextNode("M" + i);
	    p.appendChild(paragraph);
	    result_body.appendChild(p);

		let table = document.createElement("TABLE");
	    table.setAttribute("id", "table" + i);
	    table.setAttribute("style", "width: 100%; table-layout: fixed; border: 1px solid #ddd; text-align: center;");
	    result_body.appendChild(table);

	    for(let j = 0; j < array[0].length; j++) {	
	    	let tr = document.createElement("TR");

	    	tr.setAttribute("id", "tr" + i + j);
		    document.getElementById("table" + i).appendChild(tr);

		    for(let k = 0; k < array[0][0].length; k++) {	
		    	let td = document.createElement("TD");

		    	if(j == 0 && k == 0) {
		    		td.setAttribute("style", "border-bottom: 1px solid #ddd; border-right: 1px solid #ddd;");
		    	} else if(j == 0) {
		    		td.setAttribute("style", "border-bottom: 1px solid #ddd;");
		    	} else if(k == 0) {
		    		td.setAttribute("style", "border-right: 1px solid #ddd;");
		    	}

			    let cell = document.createTextNode(array[i][j][k]);

			    td.appendChild(cell);
			    document.getElementById("tr" + i + j).appendChild(td);
		    }
	    }

	    let br = document.createElement("br");
	    result_body.appendChild(br);
	}

	// Create 'x*' paragraph in the HTML.
	let x = document.createElement("p");
    let x_paragraph = document.createTextNode("x*");
    x.appendChild(x_paragraph);
    result_body.appendChild(x);

	let table = document.createElement("TABLE");
    table.setAttribute("id", "table_x");
    table.setAttribute("style", "width: 50px; table-layout: fixed; border: 1px solid #ddd; text-align: center;");
    result_body.appendChild(table);

    let lastM = array[array.length - 1];
    let identityColumns = getIdentityColumns(lastM);
    let c = sliceFirstElement(lastM[0]);						// The c^(T)x in the Simplex Tableau.
    let b = sliceFirstElement(getColumn(lastM, 0));				// The b in the Simplex Tableau.
    let pivotRows = getIdentityRows(lastM, identityColumns);;

    console.log("IDENTITY COLUMNS " + identityColumns);
    console.log("PIVOT ROWS " + pivotRows);

    // Set x values in array.
    let xs = [];

    for(let i = 0; i < c.length; i++) {
    	for(let j = 0; j < identityColumns.length; j++) {
    		if(identityColumns[j] - 1 == i) {
    			let pivotRow = pivotRows[j] - 1;	// - 1 excludes -d and c row.
    			xs[i] = b[pivotRow];
    			break;
    		} else {
    			xs[i] = 0;
    		}
    	}
    }
    
    console.log("xs " + xs);	

    // Create x table in the HTML.
    for(let i = 0; i < c.length; i++) {	    	    	    
    	let tr = document.createElement("TR");

    	tr.setAttribute("id", "tr_x" + i);
	    document.getElementById("table_x").appendChild(tr);

    	let td = document.createElement("TD");
    	let cell = document.createTextNode(xs[i]);

		td.setAttribute("style", "border: 1px solid #ddd;");
	    td.appendChild(cell);
	    document.getElementById("tr_x" + i).appendChild(td);
    }

    // Create Z(x*) in the HTML
    let br = document.createElement("br");
    result_body.appendChild(br);

    let z = document.createElement("p");
    let z_paragraph = document.createTextNode("Z(x*) = " + array[array.length - 1][0][0] * -1);
    z.appendChild(z_paragraph);
    result_body.appendChild(z);
    $('html').height($("#Result").height()+75);
}

// Returns a specific column of an array.
function getColumn(array, column) {
	let arrayCol = [array.length];

	for(let i = 0; i < array.length; i++) {
		arrayCol[i] = array[i][column];
	}

	return arrayCol;
}

// Returns the index of the pivot column. (Pivot column has the most negative c).
function getPivotColumn(c) {
	let mostNeg;
	let negExist = false;

	// Find a negative number.
	for (let i = 0; i < c.length; i++) {
		if(c[i] < 0) {
			mostNeg = c[i];
			negExist = true;
			break;
		}
	}

	if(!negExist) {
		return -1;
	}

	// Find the most negative c.
	for(let i = 0; i < c.length; i++) {
		if(parseFloat(c[i]) < mostNeg) {
			mostNeg = c[i];
		}
	}

	return c.indexOf(mostNeg) + 1;	// + 1 includes the column of b.
}

// Returns the array of the pivot row. (Pivot row has the least ratio. Formula: b / (corresponding pivot column element)).
function getPivotRow(b, A, pivotColumn) {
	let leastRatio = 0;
	let index = 0;
	pivotColumn -= 1;	// -1, since b is excluded in A.

	// Initialize leastRatio value.
	for (let i = 0; i < b.length; i++) {
		if(A[i][pivotColumn] > 0) {
			leastRatio = b[i] / A[i][pivotColumn];
			index = i;
			break;
		}
	}

	// Find the least ratio.
	for(let i = 0; i < b.length; i++) {
		if(A[i][pivotColumn] <= 0) {
			continue;
		}

		if(b[i] / A[i][pivotColumn] < leastRatio) {
			leastRatio = b[i] / A[i][pivotColumn];
			index = i;
		}
	}

	return index + 1;	// + 1 includes the row of c^(T)x.
}

// Returns an array of n x n identity matrix.
function setIdentityMatrix(size) {
	let Q = [];

	for(let i = 0; i < size; i++) {
		let tempQ = [];

		for(let j = 0; j < size; j++) {
			if(j == i) {
				tempQ.push(1);
			} else {
				tempQ.push(0);
			}
		}

		Q.push(tempQ);
	}

	return Q;
}

// Returns the size of the identity matrix based on the given tableau.
function getIdentityMatrixSize(array) {
	return sliceFirstElement(getColumn(array, 0)).length + 1;
}

// Returns an array containing indexes of identity columns.
function getIdentityColumns(array) {
	let identityColumns = [];
	let probableColumns = [];

	for (let i = 0; i < array[0].length; i++) {
		if(array[0][i] == 0) {
			probableColumns.push(i);
		}
	}

	for(let i = 0; i < probableColumns.length; i++) {
		let numOfOnes = 0;
		let isIdentity = true;

		for(let j = 0; j < array.length; j++) {		
			if(array[j][probableColumns[i]] == 1) {
				numOfOnes++;

				if(numOfOnes > 1) {
					isIdentity = false;
					break;
				}

				continue;
			}

			if(array[j][probableColumns[i]] != 0) {
				isIdentity = false;
				break;
			}
		}

		if(isIdentity) {
			identityColumns.push(probableColumns[i]);
		}
	}

	return identityColumns;
}

// Returns an array containing indexes of identity rows.
function getIdentityRows(array, identityColumns) {
	let identityRows = [];

	for(let i = 0; i < identityColumns.length; i++) {
		for(let j = 0; j < array.length; j++) {		
			if(array[j][identityColumns[i]] == 1) {
				identityRows.push(j);
			}
		}		
	}

	return identityRows;
} 

// Returns the inverse of a number.
function inverse(n) {
	return Math.pow(n, -1);
}

// Returns the product of 2 matrices.
function matrixMultiply(array1, array2) {
	let productMatrix = new Array(array1.length);
	let tempArray = new Array(array2[0].length);

	for(let i = 0; i < array1.length; i++) {				
		tempArray.fill(0);

		for(let j = 0; j < array2[0].length; j++) {		
			for(let k = 0; k < array1[0].length; k++) {
				tempArray[j] += array1[i][k] * array2[k][j];
			}

			//tempArray[j] = tempArray[j].toFixed(10);
		}

		productMatrix[i] = tempArray.slice();
	}

	return productMatrix;
}

// Returns the product of 2 matrices.
function revisedMatrixMultiply(array1, array2, identityColumns) {
	let productMatrix = new Array(array1.length);
	let tempArray = new Array(array2[0].length);
	let isIdentity = false;

	tempArray.fill(0);

	// Solve the first row (objective function) first.
	for(let i = 0; i < array2[0].length; i++) {
		for(let k = 0; k < array1[0].length; k++) {
			tempArray[i] += array1[0][k] * array2[k][i];
		}
	}

	productMatrix[0] = tempArray.slice();

	// Then solve the constraints.
	let c = sliceFirstElement(productMatrix[0]);
	let pivotColumn = getPivotColumn(c);

	for(let i = 1; i < array1.length; i++) {			
		tempArray.fill(0);

		for(let j = 0; j < array2[0].length; j++) {		
			for(let k = 0; k < array1[0].length; k++) {
				for(let l = 0; l < identityColumns.length; l++) {
					if(i != 0 && j == identityColumns[l]) {
						isIdentity = true;
						break;
					}
				}

				if(isIdentity || j == pivotColumn || j == 0) {
					tempArray[j] += array1[i][k] * array2[k][j];
				} else {
					tempArray[j] = "*";
				}
				
			}

			isIdentity = false;		
		}

		productMatrix[i] = tempArray.slice();
	}	

	return productMatrix;
}

// Returns a copy of array of objects (Since in javascript assigning or using slice() only copies the reference).
function cloneArray(array) {
	var newObj = (array instanceof Array) ? [] : {};
	
	for (i in array) {
		if (i == 'cloneArray') continue;

		if (array[i] && typeof array[i] == "object") {
     		newObj[i] = cloneArray(array[i]);
		} else {
			newObj[i] = array[i]
		}
	}

	return newObj;
}

// Removes trailing zeros from a string. Returns a string.
function removeTrailingZeros(string) {
	let dotIndex = string.indexOf('.');
	let firstZeroIndex;
	let isAllZero = true;

	for(let i = dotIndex + 1; i < string.length; i++) {
		if(string.charAt(i) == '0') {
			firstZeroIndex = i;
			break;
		}
	}

	for(let i = firstZeroIndex; i < string.length; i++) {
		if(string.charAt(i) != '0') {
			isAllZero = false;
		}
	}

	if(isAllZero && dotIndex == firstZeroIndex - 1) {
		return string.slice(0, dotIndex);
	}

	if(isAllZero) {
		return string.slice(0, firstZeroIndex);
	}

	return string;
}

// Converts the table values into values with 10 decimal places. Returns an array of string.
function fixedTable(array) {
	let table = cloneArray(array);
	let newTable = new Array(array.length);
	let tempArray = new Array(array[0].length);

	for(let i = 0; i < array.length; i++) {
		for(let j = 0; j < array[0].length; j++) {
			if(table[i][j] == '*') {
				tempArray[j] = '*';				
			} else {
				tempArray[j] = table[i][j].toFixed(10);
			}
		}

		newTable[i] = tempArray.slice();
	}

	return newTable;
}

// Returns true if array has negative value.
function arrayHasNegative(array) {
	for(let i = 0; i < array.length; i++) {
		if(array[i] < 0) {
			return true;
		}
	}

	return false;
}

// Returns an array with the first element removed.
function sliceFirstElement(array) {
	return array.slice(1, array.length);
}