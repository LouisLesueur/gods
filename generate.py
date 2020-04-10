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

		G.add_node('u'+str(self.id), shape='point')
		if self.father.name != '?':
			G.add_node(self.father.name)
			G.add_edge(self.father.name,'u'+str(self.id),arrowhead='none')
		if self.mother.name != '?':
			G.add_node(self.mother.name)
			G.add_edge(self.mother.name,'u'+str(self.id),arrowhead='none')

		for kid in self.children:
			if kid.name != 'none':
				if self.father.name != '?':
					G.add_edge('u'+str(self.id),kid.name)
				if self.mother.name != '?':
					G.add_edge('u'+str(self.id),kid.name)



with open('Apollodore', 'r') as file:
    data = np.loadtxt(file,  dtype='str', comments='#', delimiter=',')


persons = [Person(dat[0]) for dat in data]
unions = [Union(*dat, i) for i,dat in enumerate(data)]

def find_union(person, unions):
	for u in unions:
		if person in u.father:
			return u


G=pgv.AGraph(directed=True )
for u in unions:
	u.gen_tree(G)

def too_many_ancestors(G):
	for n in G.nodes():
		if len(G.predecessors(n)) > 1 and n[0] != 'u':
			print(n)

def many_unions(G):
	for n in G.nodes():
		if len(G.successors(n)) > 1 and n[0] != 'u':
			print(n)

G.draw('out.svg', 'svg', prog='dot')
