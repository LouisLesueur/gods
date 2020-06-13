const palette = ["#ff9398","#87c300","#fe0071","#9dd63d","#d53177","#8cc14d","#f70045","#83a300","#e0004e","#cdcb1d","#ee5990","#719200","#ff4f80","#577b0a","#ff486b","#6e983c","#e4001a","#acd172","#ff3c4d","#98c066","#c83968","#bfb400","#e67198","#dfc529","#ff7da3","#5b832c","#ff6384","#c5cc5c","#d13243","#d0c94f","#bf6180","#909000","#ff9bb9","#c29f00","#b37285","#ff9c06","#8f8a8b","#d72c25","#a3bb80","#ff636a","#65833f","#ff6d43","#85a161","#ff7830","#c1c4bc","#d75b00","#b1b2af","#e17b00","#dabec5","#d28b00","#886e75","#fab946","#b45062","#cbc879","#c04752","#6c7623","#ff837e","#867800","#d390a3","#a18200","#a47783","#ffb34e","#b3979e","#c87a00","#a2a997","#bb5c00","#a5b193","#ff9c42","#7d886d","#ff8865","#778a5c","#b75227","#cec68c","#b25447","#ecbf5a","#a25d5a","#b28300","#ffa7a9","#7e7115","#efb8b1","#a95d0d","#d9c0ad","#8a6c22","#ff9782","#6e7443","#ff916d","#896960","#ff9e5c","#836d4d","#ffa474","#8a6b3a","#ffa991","#92682e","#f6b798","#9d632b","#dbc374","#a95b4a","#f7b976","#a75d3d","#ecbc89"]

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


function colorReset(){
  legendBox = document.getElementById('myChart')
  legendBox.innerHTML = '';
  to_colorize = []
  for (i=0; i<nodes.length; i++) {
    node = nodes.get(i)
    if (node.color.background != 'orange'){
      node.color = {background: 'orange', border: 'orange',}
      node.mass = 1
      to_colorize.push(node)
    }
  }
  nodes.update(to_colorize);
}

function applyPalette(spec){
  colorReset()
  to_colorize = []
  var values = []
  var colors = []
  var labels = []
  var count = 0
  for (i=0; i<nodes.length; i++) {
    node = nodes.get(i)
    if (node.hasOwnProperty(spec)) {
      if (!labels.includes(node[spec])) {
        colors[count] = palette[count]
        labels[count] = node[spec]
        values[count] = 0
        count ++
      }
      else {
        values[labels.indexOf(node[spec])]++
      }
      node.color = {background: colors[labels.indexOf(node[spec])], border: palette[labels.indexOf(node[spec])],}
      legend = true;

      to_colorize.push(node)
    }
  }
  nodes.update(to_colorize);
  for(i=0; i<labels.length; i++){
    li_legend = document.createElement("li");
    li_legend.textContent = labels[i]
    span_legend = document.createElement("span");
    span_legend.style = 'background: '+palette[colors[labels[i]]]+";"

    li_legend.appendChild(span_legend)
    legendBox.appendChild(li_legend)
  }

  chart_options.data = {
        labels: labels,
        datasets: [{
            data: values,
            backgroundColor: colors,
            borderColor: colors,
        }]
    }
    legendChart.update()

}
