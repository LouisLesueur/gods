function updatespecs() {
  clicked = network.getSelectedNodes()[0];
  document.getElementById('specname').textContent = nodes.get(clicked).label;

}

function getsubtree(from_or_to) {
  depth = document.getElementById('depth').value
  clicked = network.getSelectedNodes()[0];
  connected = network.getConnectedNodes(clicked, from_or_to);

  start = 0
  for (var j=0; j<depth; j++){
    stop = connected.length;
    for (var i=start; i<stop; i++) {
      connected = connected.concat(network.getConnectedNodes(connected[i], from_or_to));
    }
    start = stop;
  }
  connected.push(clicked);

  to_hide = []
  for (i=0; i<nodes.length; i++) {
    node = nodes.get(i)
    if(!connected.includes(i)){
      node.hidden = true;

      to_hide.push(node)

    }
  }
  nodes.update(to_hide);
  nodesView.refresh()
}


function search() {
  searchBar = document.getElementById("site-search")
  to_search = searchBar.value
  found = nodes.getIds({
    filter: function (item) {
      return (levenshtein(item.label.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase(), to_search.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase()) < 3);
    }
  })

  results = document.getElementById("results")
  results.innerHTML=''

  for (let i=0; i<found.length; i++) {
    result = document.createElement("button")
    const foundid = found[i]
    result.textContent = nodes.get(foundid).label
    result.addEventListener('click', () => {
      network.selectNodes([foundid])
      updatespecs()
      results.innerHTML=''})


    results.appendChild(result)
  }

}
