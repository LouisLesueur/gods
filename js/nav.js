function opencloseNav() {

  if (document.getElementById("mySidenav").style.width=="0px" || document.getElementById("mySidenav").style.width==""){
    document.getElementById("mySidenav").style.width = "250px";
    document.getElementById("main").style.marginLeft = "250px";
  } else {
    document.getElementById("mySidenav").style.width = "0px";
    document.getElementById("main").style.marginLeft= "0px";
  }
}

function opencloseSpecs() {

  if (document.getElementById("specs").style.width=="0px" || document.getElementById("specs").style.width==""){
    document.getElementById("specs").style.width = "500px";
    document.getElementById("main").style.marginRight = "500px";
  } else {
    document.getElementById("specs").style.width = "0px";
    document.getElementById("main").style.marginRight= "0px";
  }
}

var kingship = document.getElementById('kingship');
for (city in cities) {
  var lab_li = document.createElement("li");
  var lab_city = document.createElement("label");
  lab_city.class = "form-check-label";
  lab_city.textContent = "Rois "+cities[city]+": "

  var lab_box = document.createElement("input");
  lab_box.type = "checkbox"
  lab_box.name = "edgesFilter"
  lab_box.class = "form-check-input"
  lab_box.value = "king_"+cities[city]


  lab_city.appendChild(lab_box)
  lab_li.appendChild(lab_city)
  kingship.appendChild(lab_li);
}
