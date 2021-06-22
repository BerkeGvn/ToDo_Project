import { projectList } from "./todo";
import { cardRender, projectRender } from "./render";

const localMemory = (() => {
  function pushLocalStorage() {
    localStorage.setItem("projectList", JSON.stringify(projectList));
  }

  function pullLocalStorage() {
    if (!localStorage.projectList) {
      projectRender();
      cardRender();
    } else {
      let library = localStorage.getItem("projectList");
      library = JSON.parse(library);
      projectList = library;
      projectRender();
      cardRender();
    }
  }
  return { pushLocalStorage, pullLocalStorage };
})();

export default localMemory;
