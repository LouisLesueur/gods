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
			file.write("    { id: "+str(self.Dict[n])+", label: '"+n+"', color: 'blue', shape: 'dot'},\n")
		file.write("]);\n")
		file.write("const edges = new vis.DataSet([\n")
		for u in self.unions:
			for child in u.children:
				if child.name != 'none':
					if u.father.name != '?':
						file.write("    { from: "+str(self.Dict[u.father.name])+", to: "+str(self.Dict[child.name])+", relation: 'father', arrows: 'to'},\n")
					if u.mother.name != '?':
						file.write("    { from: "+str(self.Dict[u.mother.name])+", to: "+str(self.Dict[child.name])+", relation: 'mom', arrows: 'to'},\n")
					if u.father.name != '?' and u.mother.name != '?':
						file.write("    { from: "+str(self.Dict[u.mother.name])+", to: "+str(self.Dict[u.father.name])+", relation: 'partner', color: 'red'},\n")
		file.write("]);")
		file.close()


	def to_svg(self):
		self.Graph.draw('../img/out.svg', 'svg', prog='dot')


class Tree:
	def __init__(self, author):
		with open(author, 'r') as file:
			data = np.loadtxt(file,  dtype='str', comments='#', delimiter=',')

		self.unions = [Union(*dat, i) for i,dat in enumerate(data)]
		self.graph = graph(self.unions)


	def find_union(person, unions):
		for u in unions:
			if person == u.father:
				return u
		return None


def extract_for_label(title):
	file_out = open(title+'_persos', 'w')
	with open(title, 'r') as file:
		data = np.loadtxt(file,  dtype='str', comments='#', delimiter=',')

	for d in data:
		file_out.write(d[0]+'\n')
		for c in d[2][1:-1].split(" "):
			file_out.write(c+'\n')

	file_out.close()


Apo = Tree('Apollodore')
Apo.graph.to_js()
extract_for_label("Apollodore")
