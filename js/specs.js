function updatespecs() {
  clicked = network.getSelectedNodes()[0];
  document.getElementById('specname').textContent = nodes.get(clicked).label;

}

function getsubtree() {
  depth = document.getElementById('depth').value
  clicked = network.getSelectedNodes()[0];
  connected = network.getConnectedNodes(clicked, 'from');

  start = 0
  for (var j=0; j<depth; j++){
    stop = connected.length;
    for (var i=start; i<stop; i++) {
      connected = connected.concat(network.getConnectedNodes(connected[i], 'from'));
    }
    start = stop;
  }
  connected.push(clicked);

  to_hide = []
  for (i=0; i<nodes.length; i++) {
    node = nodes.get(i)
    if(!connected.includes(i)){
      node.hidden = true;
      node.physics = false
      to_hide.push(node)

    }
  }


  nodes.update(to_hide);
}
