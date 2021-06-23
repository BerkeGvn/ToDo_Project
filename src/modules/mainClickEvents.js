import { formModule, newProjectModule, allTasks, hamburgerModule } from "./dom";

export default function events() {
  formModule.newTaskBtn.addEventListener("click", formModule.showForm);

  formModule.formCancelBtn.addEventListener("click", formModule.hideForm);

  formModule.addBtn.addEventListener("click", formModule.addTodo);

  allTasks.mainBtn.addEventListener("click", allTasks.tasks);

  newProjectModule.newProjectBtn.addEventListener("click", newProjectModule.newProject);

  hamburgerModule.hamburger.addEventListener("click", hamburgerModule.mobileMenu);

  document.addEventListener("DOMContentLoaded", allTasks.tasks);
}
