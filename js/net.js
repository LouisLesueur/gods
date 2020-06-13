// ARBRE ----------------------------------------------------------------
var network;
var container = document.getElementById('mynetwork');

// FILTRES LIENS
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

//FILTRES NOEUDS
const nodesFilter = (node) => {
  return !node.hidden
}

const nodesView = new vis.DataView(nodes, { filter: nodesFilter })


// FILTRES COULEURS
const colorFilters = document.getElementsByName('colorFilter')
const colorFilterValues = {}

colorFilters.forEach(filter => filter.addEventListener('change', (e) => {
    const { value, checked } = e.target
    applyPalette(value)
}))



// CHART
ctx = document.getElementById('myChart');
chart_options = {
  type: 'doughnut',
  options: {
      responsive: true,
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
      animation: {
        animateScale: true,
        animateRotate: true
      },
      tooltips: {
        titleFontSize: 15,
        bodyFontSize: 15,
      }
    }
}
legendChart = new Chart(ctx, chart_options);


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
  improvedLayout: false,
  randomSeed: undefined,
  hierarchical: {
    enabled:false,
  }
}
};

network = new vis.Network(container, { nodes: nodesView, edges: edgesView }, options);

colorize = []
for (i=0; i<nodes.length; i++) {
  node = nodes.get(i)
  node.color = {background: 'orange',
  border: 'orange',
  highlight: {
    background: '#ffffff',
    border: 'red',
  },
}
  colorize.push(node)
}
nodes.update(colorize);



function reset() {
  nodes_reset = []
  for (i=0; i<nodes.length; i++) {
    node = nodes.get(i)
    if (node.hidden == true) {
      node.hidden = false;
      node.physics = true;
      node.fixed = false
      nodes_reset.push(node)
    }
  }

  nodes.update(nodes_reset);

}
