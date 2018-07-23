var s3Info = [];
var counter = 0;
var total;

function addS3Info(pdfName, address, term, squareFootage){
  var s3object = [pdfName, address, term, squareFootage];
  s3Info.push(s3object);
}

function setTotal(totalPdfs){
  total = totalPdfs;
}


function populate(counter){
  var pdfName = document.getElementById('pdfName');
  var address = document.getElementById('address');
  var squareFootage = document.getElementById('squareFootage');
  var pdfIndex = document.getElementById('pdfIndex');
  var displayCounter = counter+1;
  pdfName.innerHTML = s3Info[counter][0];
  address.value = s3Info[counter][1];
  squareFootage.value = s3Info[counter][3];
  pdfIndex.innerHTML = "("+displayCounter+" out of "+total+")";

  var term = s3Info[counter][2];
  if(term == "Sale"){
    document.getElementById('sale').checked = true;
    document.getElementById('lease').checked = false;

  }else{
    // squareFootage.value = term;
    document.getElementById('lease').checked = true;
    document.getElementById('sale').checked = false;
  }
}

function increment(){
  counter += 1;
  if(counter<total){
    populate(counter);
  }else{
    document.getElementById('finish').innerHTML = "<button onclick='finish()'>Finish</button>";
  }
}

function decrement(){
  if(counter > 0){
    counter -= 1;
    populate(counter);
  }
}

function finish(){
  document.getElementById('pdfDataForm').innerHTML = "<h2>All PDFs covered</h2><br><h4><a href='upload.php'>Upload more</h4>";
}
