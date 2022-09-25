const express = require("express");

const { v4: uuid } = require("uuid");

const app = express();

app.use(express.json());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.status(200).json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body

  const repoExists = repositories.find(repo => repo.title == title)

  if (repoExists) {
    return response.status(400).json({ error: "This repositorie already exists" })
  }

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  };


  repositories.push(repository)

  return response.status(201).json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { title, url, techs } = request.body
  const { id } = request.params;
  // const updatedRepository = request.body;
  // const updatedRepository = [title, url, techs];

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if (repositoryIndex < 0) {
    return response.status(404).json({ error: "Repository not found" });
  }

  // const repository = { ...repositories[repositoryIndex], ...updatedRepository };
  const repository = repositories.find(repository => repository.id === id);

  // repositories[repositoryIndex] = repository;

  if (title) {
    repository.title = title
  }

  if (url) {
    repository.url = url
  }

  if (techs) {
    repository.techs = techs
  }


  return response.json(repository);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.find(repository => repository.id === id);

  if (!repositoryIndex) {
    return response.status(404).json({ error: "Repository not found" });
  }

  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if (repositoryIndex < 0) {
    return response.status(404).json({ error: "Repository not found" });
  }

  const likes = ++repositories[repositoryIndex].likes;

  return response.json(likes);
});

module.exports = app;
