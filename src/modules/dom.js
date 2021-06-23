import { format, formatDistanceToNow } from "date-fns";
import { toDoFactory, projectFactory, projectList } from "./todo";
import { cardRender, projectRender } from "./render";
import localMemory from "./localStorage";

const currentProject = (() => {
  let current = 0;

  function getCurrent() {
    return current;
  }

  function setCurrent(value) {
    return (current = value);
  }

  return { getCurrent, setCurrent };
})();

let formModule = (() => {
  let newTaskBtn = document.querySelector(".add_btn-task");
  let formCancelBtn = document.querySelector(".form_button-cancel");
  let formTitleInput = document.querySelector(".form_input-text");
  let formTextInput = document.querySelector(".form_input-textarea");
  let addBtn = document.querySelector(".form_button-add");
  let prioritySelect = document.querySelector(".form_select");
  let datePick = document.querySelector(".form_date");

  function showForm() {
    let form = document.querySelector(".form");
    form.style.display = "flex";
  }

  function hideForm() {
    let form = document.querySelector(".form");
    form.style.display = "none";
  }

  function addTodo() {
    let title = formTitleInput.value;
    let texInput = formTextInput.value;
    let priority = prioritySelect.value;
    let dueDate = "";

    if (mainFunctions.checkInputText(title, "title")) {
      return;
    }

    if (datePick.value !== "") {
      let date = new Date(datePick.value);
      dueDate = formatDistanceToNow(new Date(date), { addSuffix: true });
    }

    formTitleInput.value = "";
    formTextInput.value = "";

    let todo = toDoFactory(title, texInput, false, priority, dueDate);

    projectList[currentProject.getCurrent()].list.push(todo);

    localMemory.pushLocalStorage();
    cardRender();
    projectRender();

    let form = document.querySelector(".form");
    form.style.display = "none";
  }

  return {
    newTaskBtn,
    formCancelBtn,
    showForm,
    hideForm,
    addBtn,
    addTodo,
  };
})();

let todoCard = (() => {
  function createCard(cards, i, status) {
    let card = document.createElement("div");
    card.classList.add("card");

    let cardTitle = document.createElement("p");
    cardTitle.classList.add("card_title");
    cardTitle.textContent = cards.title;

    let cardDescription = document.createElement("p");
    cardDescription.classList.add("card_description");
    cardDescription.textContent = cards.description;

    let btnDiv = document.createElement("div");
    btnDiv.classList.add("card_btns");

    let delBtn = document.createElement("button");
    delBtn.className = "card_btns_button card_btns_button-delete";
    delBtn.setAttribute("id", i);

    let editBtn = document.createElement("button");
    editBtn.className = "card_btns_button card_btns_button-edit";

    let delBtnIcon = document.createElement("i");
    delBtnIcon.className = "far fa-trash-alt";

    let editBtnIcon = document.createElement("i");
    editBtnIcon.className = "far fa-edit";

    let dueDate = document.createElement("p");
    dueDate.classList.add("card_date");
    dueDate.textContent = cards.date;

    let priority = document.createElement("div");
    priority.classList.add("card_priority");

    mainFunctions.checkIsDone(card, cards);
    mainFunctions.chechPriority(priority, cards.priority);

    delBtn.appendChild(delBtnIcon);

    editBtn.appendChild(editBtnIcon);

    btnDiv.appendChild(editBtn);
    btnDiv.appendChild(dueDate);
    btnDiv.appendChild(delBtn);

    card.appendChild(cardTitle);
    card.appendChild(cardDescription);
    card.appendChild(priority);
    card.appendChild(btnDiv);

    AddCard(card);

    if (status === "main") {
      mainFunctions.allTaskDeleteBtn(delBtn, cards, i);
    } else {
      mainFunctions.deleteBtn(delBtn, cards);
    }
    mainFunctions.doneBtn(editBtn, card, cards);
  }

  function AddCard(card) {
    let todoList = document.querySelector(".todolist");
    todoList.appendChild(card);
  }

  return { createCard };
})();

const mainFunctions = (() => {
  function deleteBtn(btn, item) {
    btn.addEventListener("click", function () {
      projectList[currentProject.getCurrent()].list.splice(
        projectList[currentProject.getCurrent()].list.indexOf(item),
        1
      );

      localMemory.pushLocalStorage();
      cardRender();
    });
  }

  function allTaskDeleteBtn(btn, item, index) {
    btn.addEventListener("click", function () {
      projectList[index].list.splice(projectList[index].list.indexOf(item), 1);

      localMemory.pushLocalStorage();
      cardRender();
      allrender();
    });
  }

  function doneBtn(btn, item, list) {
    btn.addEventListener("click", function () {
      item.classList.toggle("done");
      list.isDone = list.isDone ? false : true;
      localMemory.pushLocalStorage();
    });
  }

  function checkIsDone(item, list) {
    if (list.isDone) {
      item.classList.add("done");
    }
  }

  function chechPriority(item, value) {
    switch (value) {
      case "low":
        item.className += " low";
        break;
      case "med":
        item.className += " medium";
        break;
      case "high":
        item.className += " high";
        break;
      default:
        return;
    }
  }

  function checkInputText(text, type) {
    if (text === "") {
      alert(`Please enter a ${type}`);

      return true;
    }
    return false;
  }

  function createHeader(text) {
    const header = document.querySelector(".main_h2");

    header.innerText = text;
  }

  return {
    deleteBtn,
    allTaskDeleteBtn,
    doneBtn,
    checkIsDone,
    chechPriority,
    createHeader,
    checkInputText,
  };
})();

let newProjectModule = (() => {
  let newProjectBtn = document.querySelector(".add_btn-project");

  function newProject() {
    let projects = document.querySelector(".sidebar_projects");

    let newProjectBtn = document.querySelector(".add_btn-project");

    let newDiv = document.createElement("div");
    newDiv.className = "sidebar_projects_new";

    let newInput = document.createElement("input");
    newInput.type = "text";
    newInput.className = "sidebar_projects_new_input";

    let newBtnDiv = document.createElement("div");
    newBtnDiv.className = "sidebar_projects_new_buttons";

    let cancelBtn = document.createElement("button");
    cancelBtn.textContent = "Cancel";

    let addBtn = document.createElement("button");
    addBtn.textContent = "Add";
    cancelBtn.className = "sidebar_projects_new_btn sidebar_projects_new_btn-cancel";
    addBtn.className = "sidebar_projects_new_btn sidebar_projects_new_btn-add";
    newProjectBtn.style.display = "none";

    newBtnDiv.appendChild(cancelBtn);
    newBtnDiv.appendChild(addBtn);
    newDiv.appendChild(newInput);
    newDiv.appendChild(newBtnDiv);
    projects.appendChild(newDiv);

    cancelBtn.addEventListener("click", del);
    addBtn.addEventListener("click", add);
  }

  function del() {
    let dov = document.querySelector(".sidebar_projects_new");
    dov.parentNode.removeChild(dov);
    let newProjectBtn = document.querySelector(".add_btn-project");
    newProjectBtn.style.display = "flex";
  }

  function add() {
    let newProjetInput = document.querySelector(".sidebar_projects_new_input");
    let newProject = newProjetInput.value;
    if (mainFunctions.checkInputText(newProject, "name")) {
      return;
    }
    let project = projectFactory(newProject);
    projectList.push(project);
    localMemory.pushLocalStorage();
    projectRender();
  }

  function deleteBtn(btn, item) {
    btn.addEventListener("click", function () {
      projectList.splice(projectList.indexOf(item), 1);
      localMemory.pushLocalStorage();
      projectRender();
    });
  }

  function addProject(el) {
    let projects = document.querySelector(".sidebar_projects");

    let button = document.createElement("a");
    button.className = "sidebar_projects_button";
    button.tabIndex = "0";

    let buttonSpan = document.createElement("span");
    let buttonIcon = document.createElement("i");
    buttonIcon.className = "fas fa-times sidebar_projects_button-icon";
    buttonSpan.textContent = el.name;
    button.setAttribute("id", projectList.indexOf(el));

    button.addEventListener("click", displayProject);

    function displayProject() {
      let btn = document.querySelector(".add_btn-task");
      btn.style.display = "block";
      let todoList = document.querySelector(".todolist");
      let cards = document.querySelectorAll(".card");
      cards.forEach((card) => todoList.removeChild(card));
      currentProject.setCurrent(Number(button.getAttribute("id")));
      mainFunctions.createHeader(el.name);
      localMemory.pushLocalStorage();
      cardRender();
    }

    button.appendChild(buttonSpan);
    button.appendChild(buttonIcon);
    projects.appendChild(button);
    deleteBtn(buttonIcon, el);

    newProjectBtn.style.display = "flex";

    let newProjectDiv = document.querySelector(".sidebar_projects_new");
    if (newProjectDiv) {
      newProjectDiv.parentNode.removeChild(newProjectDiv);
    }
  }

  return { newProjectBtn, newProject, addProject };
})();

const allTasks = (() => {
  let mainBtn = document.querySelector(".main-button");
  function tasks() {
    let btn = document.querySelector(".add_btn-task");
    btn.style.display = "none";
    let todoList = document.querySelector(".todolist");
    let cards = document.querySelectorAll(".card");
    cards.forEach((card) => todoList.removeChild(card));
    mainFunctions.createHeader("All Tasks");
    for (let i = 0; i < projectList.length; i++) {
      projectList[i].list.forEach((val) => todoCard.createCard(val, i, "main"));
    }
  }

  return { mainBtn, tasks };
})();

function allrender() {
  let todoList = document.querySelector(".todolist");
  let cards = document.querySelectorAll(".card");

  cards.forEach((card) => todoList.removeChild(card));
  mainFunctions.createHeader("All Tasks");

  for (let i = 0; i < projectList.length; i++) {
    projectList[i].list.forEach((val) => todoCard.createCard(val, i, "main"));
  }
}

let hamburgerModule = (() => {
  const hamburger = document.querySelector(".hamburger");
  const navMenu = document.querySelector(".sidebar");

  function mobileMenu() {
    hamburger.classList.toggle("active");
    navMenu.classList.toggle("hidden");
  }
  return { hamburger, mobileMenu };
})();

export { formModule, newProjectModule, todoCard, currentProject, allTasks, hamburgerModule };
