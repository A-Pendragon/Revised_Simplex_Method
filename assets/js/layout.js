function startButton(){
	$("#constraintsFields").html('');
	$("#subjectTo").val('');
	$("#subjectToEquation").val('');
	$("#noOfConstraints").val('');
	$('html').height('100%');

	$("#calculateButton").hide();
 	$("#mainMenu").hide();
 	$("#Calculator").fadeIn();
 	$('#error').hide();
}

function credits(){
	 $("#mainMenu").hide();
	 $("#Credits").fadeIn();
}



function backButton(id){
	$('html').height('100%');
	 $("#"+id).hide();
	 $("#mainMenu").fadeIn();
}

function backToInputData(){
 	$("#Result").hide();
 	$("#Calculator").fadeIn();
}

var noOfConstraints;



$(document).ready(function(){
    $( "#noOfConstraints" ).change(function() {
    	
	  	noOfConstraints = $('#noOfConstraints').val();
	  	var constraintsFields = '';
	  	for (var i = 1; i <=noOfConstraints; i++) {
	  		constraintsFields +=""
		  	+"<div class='form-group'>"
		  	+"<label>Constraint "+i+"</label>"
		  	+"<input id='constraint"+i+"' type='text' class='form-control'"
		  	+"placeholder='Enter constraint following this format total,x1,x2,x3,..xN'></input>"
		  	+"</div>";
	  	}
	  	$("#constraintsFields").html(constraintsFields);
	  	$("#calculateButton").show();
	  	if (noOfConstraints>=4) {
    		$('html').height($("#Calculator").height()+75);
    	}else{
    		$('html').height('100%');
    	}
	});
});

function calculate(){
	var error=false;
	if (!$("#objectiveFunction").val() || !$("#noOfConstraints").val()) {
		$('html, body').animate({scrollTop : 0},800);
		$('#error').fadeIn();
		$('#error').text("Please fill up all fields");
		error=true;
	}else{
		for (var i = 1; i <=noOfConstraints; i++){
			if (!$("#constraint"+i).val()) {
				error=true;
				$('html, body').animate({scrollTop : 0},800);
				$('#error').fadeIn();
				$('#error').text("Please fill up all fields");
				break;
			}
		}
	}

	if(!error){
		$('#error').hide();

		var data=[];

		data.push(extractData($("#objectiveFunction").val()));

		for (var i = 1; i <=noOfConstraints; i++){
			data.push(extractData($("#constraint"+i).val()));
		}

		console.log(data);
		tableau = data;

		// var result=functionName(data)

		$('html').height('100%');
		$("#Calculator").hide();
		$("#Result").fadeIn();
		

	}else{
		if (noOfConstraints>=4) {
    		$('html').height($("#Calculator").height()+75);
    	}else{
    		$('html').height('100%');
    	}
	}
	
	revisedSimplex();
}


function extractData(toExtract){
	var extracted = [];
	var data = "";
	for (var i = 0; i < toExtract.length; i++) {

		if (toExtract.charAt(i)!=",") {
			data += toExtract.charAt(i);
		}
		
		if (toExtract.charAt(i+1)=="," || i == toExtract.length - 1) {
			extracted.push(parseInt(data));
			data = "";
		}
		
	}
	return extracted;
}


