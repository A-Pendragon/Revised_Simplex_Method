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



i = 0;
$(document).ready(function(){
    $( "#noOfConstraints" ).change(function() {
    	
	  	noOfConstraints = $('#noOfConstraints').val();
	  	var constraintsFields = '';
	  	for (var i = 1; i <=noOfConstraints; i++) {
	  		constraintsFields +=""
		  	+"<div class='form-group'>"
		  	+"<label>Constraint "+i+"</label>"
		  	+"<input id='constraint"+i+"' type='text' class='form-control' ></input>"
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
	if (!$("#subjectTo").val() || !$("#subjectToEquation").val() || !$("#noOfConstraints").val()) {
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
		// Minimized - 0
		// Maximized - 1
		$('#error').hide();
		var subjectTo=$("#subjectTo").val();
		var subjectToEquation=$("#subjectToEquation").val();
		var constraints=[];
		for (var i = 1; i <=noOfConstraints; i++){
			constraints.push([
				$("#constraint"+i).val()
			]);
		}
		$("#Calculator").hide();
		$("#Result").fadeIn();
		// functionName(subjectTo,subjectToEquation,constraints)
	}
	$('html').height($("#Calculator").height()+75);
}


