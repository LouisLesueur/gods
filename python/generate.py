import pygraphviz as pgv
import numpy as np


class Person:
	def __init__(self, name):
		self.name = name

	def __str__(self):
		return self.name

	def __eq__(self, pers):
		return self.name == pers.name


class Union:
	def __init__(self, father, mother, children, id):
		self.father = Person(father)
		self.mother = Person(mother)
		self.children = [Person(kid) for kid in children[1:-1].split(" ")]
		self.id = id

	def gen_tree(self, G):
		if self.father.name != '?':
			G.add_node(self.father.name)
		if self.mother.name != '?':
			G.add_node(self.mother.name)

		for kid in self.children:
			if kid.name != 'none':
				if self.father.name != '?':
					G.add_edge(self.father.name,kid.name)
				if self.mother.name != '?':
					G.add_edge(self.mother.name,kid.name)


class graph:
	def __init__(self, unions):
		self.Graph=pgv.AGraph(directed=True )
		self.unions = unions
		for u in unions:
			u.gen_tree(self.Graph)

		self.Dict = {}
		for i,n in enumerate(self.Graph.nodes()):
			self.Dict[n]=i


	def to_js(self):
		file = open('../js/global_tree.js', 'w')
		file.write("const nodes = new vis.DataSet([\n")
		for n in self.Graph.nodes():
			file.write("    { id: "+str(self.Dict[n])+", label: '"+n+"', color: 'orange', shape: 'dot'},\n")
		file.write("]);\n")
		file.write("const edges = new vis.DataSet([\n")
		for u in self.unions:
			if u.id == 0:
				color='orange'
			else:
				color='green'
			for child in u.children:
				if child.name != 'none':
					if u.father.name != '?':
						file.write("    { from: "+str(self.Dict[u.father.name])+", to: "+str(self.Dict[child.name])+", relation: 'father', arrows: 'to', color: '"+color+"'},\n")
					if u.mother.name != '?':
						file.write("    { from: "+str(self.Dict[u.mother.name])+", to: "+str(self.Dict[child.name])+", relation: 'mom', arrows: 'to', color: '"+color+"'},\n")
					if u.father.name != '?' and u.mother.name != '?':
						file.write("    { from: "+str(self.Dict[u.mother.name])+", to: "+str(self.Dict[u.father.name])+", relation: 'partner', color: 'red'},\n")
		file.write("]);")
		file.close()


	def to_svg(self):
		self.Graph.draw('../img/out.svg', 'svg', prog='dot')

	def extract_for_label(self,title):
		file_out = open(title+'_persos', 'w')
		for n in np.sort(self.Graph.nodes()):
			file_out.write(n+'\n')
		file_out.close()

	def no_parents(self):
		for n in self.Graph.nodes():
			if len(self.Graph.predecessors(n)) == 0:
				print(n)


class Tree:
	def __init__(self, authors):
		self.unions = []
		for j,a in enumerate(authors):
			with open(a, 'r') as file:
				data = np.loadtxt(file,  dtype='str', comments='#', delimiter=',')
				for i,dat in enumerate(data):
					self.unions.append(Union(*dat, j))
			file.close()

		self.graph = graph(self.unions)


	def find_union(person, unions):
		for u in unions:
			if person == u.father:
				return u
		return None


Apo = Tree(['Apollodore', 'Ajouts'])
Apo.graph.to_js()
Apo.graph.no_parents()
Apo.graph.extract_for_label("Apollodore")
