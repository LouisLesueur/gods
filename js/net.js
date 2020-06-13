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
    color: {
      background: 'orange',
      border: 'orange',
      highlight: {
        background: '#ffffff',
        border: 'red',
      },

    },
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
  improvedLayout: false,
  randomSeed: undefined,
  hierarchical: {
    enabled:false,
  }
}
};

network = new vis.Network(container, { nodes: nodes, edges: edgesView }, options);


function reset() {
  nodes_reset = []
  for (i=0; i<nodes.length; i++) {
    node = nodes.get(i)
    if (node.hidden == true) {
      node.hidden = false;
      node.physics = true;
      nodes_reset.push(node)
    }
  }

  nodes.update(nodes_reset);
}
