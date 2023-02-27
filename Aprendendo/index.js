const express = require('express');

const server = express();
server.use(express.json());

//Query Params = ?nome=NodeJS
//Route Params = /cursos/2/ativo
//Request Body = {{ nome: 'Nodejs', tipo: 'Backend' }, {}}

//CRUD - Create Read Update Delete

const cursos = ['Node JS', 'JavaScript', 'React Native'];

//middleware Global
server.use((req, res, next) => {
	console.log(`URL Chamada: ${req.url}`);
	return next();
});

function checkCurso(req, res, next) {
	if (!req.body.nome) {
		return res.status(400).json({ erro: 'Nome do curso é obrigatório' });
	}
	return next();
}

function checkIndexCurso(req, res, next) {
	const curso = cursos[req.params.index];
	if (!curso) {
		return res.status(400).json({ error: 'O curso não existe' });
	}
	req.curso = curso;
	return next();
}

server.get('/cursos/:index', checkIndexCurso, (req, res) => {
	return res.json(req.curso);
});

server.get('/cursos', (req, res) => {
	return res.json(cursos);
});

server.post('/cursos', checkCurso, (req, res) => {
	const { nome } = req.body;
	cursos.push(nome);

	return res.json(cursos);
});

server.put('/cursos/:index', checkCurso, checkIndexCurso, (req, res) => {
	const { index } = req.params;
	const { nome } = req.body;
	cursos[index] = nome;

	return res.json(cursos);
});

server.delete('/cursos/:index', checkIndexCurso, (req, res) => {
	const { index } = req.params;
	cursos.splice(index, 1);

	return res.json({ message: 'Curso deletado com sucesso!' });
});

server.listen(4000);