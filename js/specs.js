function updatespecs() {
  clicked = network.getSelectedNodes()[0];
  document.getElementById('specname').textContent = nodes.get(clicked).label;

}

function getsubtree() {
  depth = document.getElementById('depth').value
  clicked = network.getSelectedNodes()[0];
  connected = network.getConnectedNodes(clicked, 'from');

  var tree_options = {
    layout: {
    randomSeed: undefined,
    hierarchical: {
      enabled:true,
      levelSeparation: 150,
      blockShifting: true,
      edgeMinimization: true,
      parentCentralization: true,
      direction: 'UD',        // UD, DU, LR, RL
      sortMethod: 'directed',  // hubsize, directed
      shakeTowards: 'roots'  // roots, leaves
    }
  }
}

  start = 0
  for (var j=0; j<depth; j++){
    stop = connected.length;
    for (var i=start; i<stop; i++) {
      connected = connected.concat(network.getConnectedNodes(connected[i], 'from'));
    }
    start = stop;
  }
  connected.push(clicked);

  nodesFilter = (node) => {
    if(connected.includes(node.id)){

      return true;
    }
    else {
      return false;
    }
  }
  nodesView = new vis.DataView(nodes, { filter: nodesFilter });
  network.setData({ nodes: nodesView, edges: edgesView });
  network.setOptions(tree_options)
}
