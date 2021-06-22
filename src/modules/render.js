import { projectList } from "./todo";
import { newProjectModule, todoCard, currentProject } from "./dom";
function cardRender() {
  let todoList = document.querySelector(".todolist");
  const cards = document.querySelectorAll(".card");
  cards.forEach((card) => todoList.removeChild(card));
  for (
    let i = 0;
    i < projectList[currentProject.getCurrent()].list.length;
    i++
  ) {
    todoCard.createCard(projectList[currentProject.getCurrent()].list[i]);
  }
}

function projectRender() {
  let projectDiv = document.querySelector(".sidebar_projects");
  let projects = document.querySelectorAll("a");

  projects.forEach((project) => projectDiv.removeChild(project));
  for (let i = 0; i < projectList.length; i++) {
    newProjectModule.addProject(projectList[i]);
  }
}

export { cardRender, projectRender };
