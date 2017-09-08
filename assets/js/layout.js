function startButton(){
	 $("#mainMenu").hide();
	 $("#Calculator").fadeIn();
}

function credits(){
	 $("#mainMenu").hide();
	 $("#Credits").fadeIn();
}

function backButton(id){
	 $("#"+id).hide();
	 $("#mainMenu").fadeIn();
}