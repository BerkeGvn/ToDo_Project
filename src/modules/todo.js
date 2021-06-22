function toDoFactory(title, description, isDone, priority, date) {
  return { title, description, isDone, priority, date };
}

function projectFactory(name) {
  let list = [];

  return { name, list };
}

let projectList = [];

export { toDoFactory, projectFactory, projectList };
