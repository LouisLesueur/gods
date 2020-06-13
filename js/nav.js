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

function hideOrphans() {

  to_hide = []
  for (i=0; i<nodes.length; i++) {
    node = nodes.get(i)
    if (node.color.background == 'orange'){
      if (network.getConnectedNodes(i).length == 0) {
        node.hidden = true;
        node.x = 0
        node.y = 0
        node.fixed = true
        node.physics = false
        to_hide.push(node)
      }
    }
  }
  nodes.update(to_hide);
}


function applyPalette(palette, spec){
  to_colorize = []
  legend = false;
  for (i=0; i<nodes.length; i++) {
    node = nodes.get(i)
    if (node.hasOwnProperty(spec)) {
      if (node.color.background != palette[node[spec]]){
        node.color = {background: palette[node[spec]], border: palette[node[spec]],}
        legend = true;
      }
      else {
        node.color = {background: 'orange', border: 'orange',}
        node.mass = 1
      }
      to_colorize.push(node)
    }
  }
  nodes.update(to_colorize);

  legendBox = document.getElementById("legend-labels")
  legendBox.innerHTML = '';
  if (legend == true){
    labels = Object.keys(palette)
    console.log(labels.length)
    for(i=0; i<labels.length; i++){
      li_legend = document.createElement("li");
      li_legend.textContent = labels[i]
      span_legend = document.createElement("span");
      span_legend.style = 'background: '+palette[labels[i]]+";"

      li_legend.appendChild(span_legend)
      legendBox.appendChild(li_legend)
    }
  }

}
