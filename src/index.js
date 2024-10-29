import "./styles/global.css";

class Task {
  constructor(
    title,
    description = "",
    dueDate = null,
    completed = false,
    parentTask = null,
    subtasks = [],
    id = new Date()
  ) {
    this.title = title;
    this.description = description;
    this.dueDate = dueDate;
    this.completed = completed;
    this.parentTask = parentTask;
    this.subtasks = subtasks;
    this.id = id;
  }
  addSubtask(task) {
    task.parentTask = this;
    this.subtasks.push(task);
  }
  deleteSubtask(taskId) {
    this.subtasks = this.subtasks.filter((task) => task.id !== taskId);
  }
  getSubtasks() {
    return this.subtasks;
  }
}

class View {
  constructor() {
    this.task = undefined;
    this.currentTab = "ongoing";
    this.taskHeader = document.querySelector(".main-header");
    this.taskTitleContainer = document.querySelector(".task__title");
    this.taskDescriptionContainer =
      document.querySelector(".task__description");
    this.subtasksContainer = document.querySelector(".subtasks");
  }
  render(task) {
    this.task = task;
    this.renderParentTask();
    this.renderTitle();
    this.renderDescription();
    this.renderSubtasks();
  }
  renderParentTask() {
    const parentTaskElements = document.querySelector(".task__parent-task");
    if (parentTaskElements) {
      parentTaskElements.remove();
    }
    if (this.task.parentTask) {
      const html = `
      <button class="task__parent-task">
      <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-arrow-left"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M5 12l14 0" /><path d="M5 12l6 6" /><path d="M5 12l6 -6" /></svg>
      ${this.task.parentTask.title}
      `;
      this.taskHeader.insertAdjacentHTML("afterbegin", html);
    }
  }
  renderTitle() {
    this.taskTitleContainer.innerHTML = this.task.title;
  }
  renderDescription() {
    this.taskDescriptionContainer.style.display = "block";
    this.taskDescriptionContainer.innerHTML = this.task.description;
    if (!this.task.description) {
      this.taskDescriptionContainer.style.display = "none";
    }
  }
  renderSubtasks() {
    if (!this.task.subtasks) {
      return;
    }
    this.subtasksContainer.innerHTML = "";
    this.subtasksContainer.innerHTML = `
      ${this.task.subtasks
        .map(
          (subtask) => `
        <li class="subtask">
          <h3 class="subtask__title">${subtask.title}</h3>
        ${
          subtask.subtasks.length > 0
            ? `<p class="subtask__status">${
                (subtask.subtasks.reduce(
                  (acc, subtask) => acc + subtask.completed,
                  0
                ) /
                  subtask.subtasks.length) *
                100
              }%</p>`
            : `<input class="subtask__status" type="checkbox" ${
                subtask.completed ? "checked" : ""
              } >`
        }
        </li>
        `
        )
        .join("")}
    `;
  }
  bindClickParentTask(handler) {
    const parentTask = this.taskHeader.querySelector(".task__parent-task");
    if (parentTask) {
      parentTask.addEventListener("click", handler);
    }
  }
  bindClickSubtask(handler) {
    const subtasks = this.subtasksContainer.querySelectorAll(".subtask");
    subtasks.forEach((subtask, index) => {
      subtask.addEventListener("click", (e) => handler(e, index));
    });
  }
}

class Controller {
  constructor(task, view) {
    this.task = task;
    this.view = view;
    this.updateView();
  }
  updateView() {
    this.view.render(this.task);
    this.view.bindClickParentTask(this.handleClickParentTask.bind(this));
    this.view.bindClickSubtask(this.handleClickSubtask.bind(this));
  }
  handleClickParentTask() {
    this.task = this.task.parentTask;
    this.updateView();
  }
  handleClickSubtask(e, subtaskIndex) {
    if (e.target.type === "checkbox") {
      return;
    }
    const subtask = this.task.subtasks[subtaskIndex];
    this.task = subtask;
    this.updateView();
  }
}

const task = new Task("Home", "", new Date());

// just for development testing
task.addSubtask(new Task("task 1", "lorem", new Date()));
task.addSubtask(new Task("task 2", "", new Date()));
task.subtasks[0].addSubtask(new Task("task 1", "desc", new Date()));
task.subtasks[0].addSubtask(new Task("task 2", "desc", new Date(), true));

const view = new View();
const controller = new Controller(task, view);
