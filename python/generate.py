import pygraphviz as pgv
import numpy as np


class Person:
	def __init__(self, name,id,origin=0):
		self.name = name
		self.id = id
		self.origin=origin
		self.specs=[]

	def to_js(self):

		specs_js = ""
		for spec in self.specs:
			specs_js += spec + ', '

		return "    { id: "+str(self.id)+", label: '"+self.name+"',"+specs_js+" shape: 'dot'},\n"

	def __str__(self):
		return self.name

	def __eq__(self, pers):
		return self.name == pers.name

	def add_spec(self, spec):
		self.specs.append(spec)


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
			return "    { from: "+str(self.id1)+", to: "+str(self.id2)+", relation: '"+self.nature+"', color: '"+color+"'},\n"
		if self.nature == "mom" or self.nature=="father":
			return "    { from: "+str(self.id1)+", to: "+str(self.id2)+", relation: '"+self.nature+"', arrows: 'to', color: '"+color+"'},\n"
		if self.nature[:4]=="king":
			return "    { from: "+str(self.id1)+", to: "+str(self.id2)+", relation: '"+self.nature+"', arrows: 'to', color: 'yellow'},\n"


class graph:
	def __init__(self, persons, relations, cities, sides):
		self.persons = persons
		self.relations = relations
		self.cities = cities
		self.sides = sides


	def to_js(self):
		file = open('../js/data.js', 'w')
		file.write("const nodes = new vis.DataSet([\n")
		for pers in self.persons:
			file.write(pers.to_js())
		file.write("]);\n")
		file.write("const edges = new vis.DataSet([\n")
		for rel in self.relations:
			file.write(rel.to_js())
		file.write("]);\n")
		file.close()


class Tree:
	def __init__(self, authors):
		self.names = set({})
		self.persons = {}
		self.relations = []
		self.cities = []
		self.sides = []


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

					add_person(dat[0],j)
					add_person(dat[1],j)
					add_relation(dat[0],dat[1],"partner",j)

					for child in dat[2][1:-1].split(" "):
						add_person(child,j)
						add_relation(dat[0],child,"father",j)
						add_relation(dat[1],child,"mom",j)
			file.close()

		with open('kings', 'r') as file:
			data = np.loadtxt(file,  dtype='str', comments='#', delimiter=',')
			for i,dat in enumerate(data):
				self.cities.append(dat[0])
				city = dat[0]
				kings = dat[1][1:-1].split(" ")
				for j in range(len(kings)-1):
					self.persons[kings[j]].add_spec("king: '"+city+"' ")
					add_relation(kings[j], kings[j+1], "king")
				self.persons[kings[-1]].add_spec("king: '"+city+"' ")
		file.close()

		with open('Troie', 'r') as file:
			data = np.loadtxt(file,  dtype='str', comments='#', delimiter=',')
			for i,dat in enumerate(data):
				self.sides.append(dat[0])
				side = dat[0]
				sides = dat[1][1:-1].split(" ")
				for j in range(len(sides)-1):
					self.persons[sides[j]].add_spec("side: '"+side+"' ")
				self.persons[sides[-1]].add_spec("side: '"+side+"' ")
		file.close()


		self.graph = graph(self.persons.values(), self.relations, self.cities, self.sides)



Apo = Tree(['Apollodore', 'Ajouts'])
Apo.graph.to_js()
