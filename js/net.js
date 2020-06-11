// ARBRE ----------------------------------------------------------------
var network;
var container = document.getElementById('mynetwork');

const edgeFilters = document.getElementsByName('edgesFilter')
const edgesFilterValues = {}

edgeFilters.forEach(filter => filter.addEventListener('change', (e) => {
    const { value, checked } = e.target
    edgesFilterValues[value] = checked
    edgesView.refresh()
}))

const edgesFilter = (edge) => {
  return edgesFilterValues[edge.relation]
}


const edgesView = new vis.DataView(edges, { filter: edgesFilter })

network = new vis.Network(container);
reset();


function reset() {
  var options = {

    nodes: {
      shape: 'dot',
      scaling: {
        min: 10,
        max: 30
      },
      font: {
        size: 12,
        face: 'Tahoma',
        color: '#ffffff'
      },
      borderWidth: 2,
    },

    edges: {
      color:{inherit:true},
      width: 0.15,
      smooth: {
        type: 'horizontal'
      }
    },

    interaction: {
      dragNodes: true,
      hideEdgesOnDrag: true,
      tooltipDelay: 200
    },

    physics: {
      stabilization: false,
      barnesHut: {
        gravitationalConstant: -80000,
        springConstant: 0.001,
        springLength: 200
      }
    },
    layout: {
    randomSeed: undefined,
    hierarchical: {
      enabled:false,
      levelSeparation: 150,
      blockShifting: true,
      edgeMinimization: true,
      parentCentralization: true,
      direction: 'UD',        // UD, DU, LR, RL
      sortMethod: 'directed',  // hubsize, directed
      shakeTowards: 'roots'  // roots, leaves
    }
  }
  };

  for (i=0; i<nodes.length; i++) {
    node = nodes.get(i)
    if (node.hidden == true) {
      node.hidden = false;
      nodes.update(node);
    }
  }

  network.setOptions(options);
  network.setData({ nodes: nodes, edges: edgesView });
}
