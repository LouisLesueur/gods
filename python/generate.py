import pygraphviz as pgv
import numpy as np


class Person:
	def __init__(self, name,id,origin=0):
		self.name = name
		self.id = id
		self.origin=origin

	def to_js(self):
		if self.origin==0:
			return "    { id: "+str(self.id)+", label: '"+self.name+"', color: 'orange', shape: 'dot'},\n"
		else:
			return "    { id: "+str(self.id)+", label: '"+self.name+"', color: 'green', shape: 'dot'},\n"

	def __str__(self):
		return self.name

	def __eq__(self, pers):
		return self.name == pers.name


class Relation:
	def __init__(self, nature, id1, id2, origin=0):
		self.nature = nature
		self.id1 = id1
		self.id2 = id2
		self.origin = origin

	def to_js(self):
		color = "orange"
		if self.nature == "partner":
			color = "red"
			if self.origin != 0:
				color = "green"
			return "    { from: "+str(self.id1)+", to: "+str(self.id2)+", relation: '"+self.nature+"', color: '"+color+"'},\n"
		else:
			if self.origin != 0:
				color = "green"
			return "    { from: "+str(self.id1)+", to: "+str(self.id2)+", relation: '"+self.nature+"', arrows: 'to', color: '"+color+"'},\n"



class graph:
	def __init__(self, persons, relations):
		self.persons = persons
		self.relations = relations


	def to_js(self):
		file = open('../js/global_tree.js', 'w')
		file.write("const nodes = new vis.DataSet([\n")
		for pers in self.persons:
			file.write(pers.to_js())
		file.write("]);\n")
		file.write("const edges = new vis.DataSet([\n")
		for rel in self.relations:
			file.write(rel.to_js())
		file.write("]);")
		file.close()


class Tree:
	def __init__(self, authors):
		self.names = set({})
		self.persons = {}
		self.relations = []

		def add_person(name, origin):
			idx = len(self.names)
			if name != '?':
				if name != 'none':
					self.names.add(name)
					if len(self.names)>idx:
						self.persons[name] = (Person(name,idx,origin))

		def add_relation(name1, name2, nature,origin=0):
			if name1 in self.names and name2 in self.names:
				id1 = self.persons[name1].id
				id2 = self.persons[name2].id
				self.relations.append(Relation(nature,id1,id2,origin))



		for j,a in enumerate(authors):
			with open(a, 'r') as file:
				data = np.loadtxt(file,  dtype='str', comments='#', delimiter=',')
				for i,dat in enumerate(data):
					idx = len(self.names)

					add_person(dat[0],j)
					add_person(dat[1],j)
					add_relation(dat[0],dat[1],"partner",j)

					for child in dat[2][1:-1].split(" "):
						add_person(child,j)
						add_relation(dat[0],child,"father",j)
						add_relation(dat[1],child,"mother",j)

			file.close()


		self.graph = graph(self.persons.values(), self.relations)



Apo = Tree(['Apollodore', 'Ajouts'])
Apo.graph.to_js()
