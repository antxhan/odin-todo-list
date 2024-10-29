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
    this.renderTabs();
    this.renderSubtasks();
  }
  renderParentTask() {
    const parentTaskElement = document.querySelector(".task__parent-task");
    if (parentTaskElement) {
      parentTaskElement.remove();
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
    const descriptionElement = document.querySelector(".task__description");
    if (descriptionElement) {
      descriptionElement.remove();
    }
    if (this.task.description) {
      const html = `
      <p class="task__description">
        ${this.task.description}
      </p>
      `;
      this.taskHeader.insertAdjacentHTML("beforeend", html);
    }
  }
  renderTabs() {
    const tabs = document.querySelector(".main-header__tabs");
    if (tabs) {
      tabs.remove();
    }
    if (this.task.subtasks.length !== 0) {
      const html = `
      <span class="main-header__tabs">
        <button value="ongoing" aria-current="true">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="icon icon-tabler icons-tabler-outline icon-tabler-player-play"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M7 4v16l13 -8z" />
          </svg>
          Doing
        </button>
        <button value="archive">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="icon icon-tabler icons-tabler-outline icon-tabler-checkbox"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M9 11l3 3l8 -8" />
            <path
              d="M20 12v6a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2h9"
            />
          </svg>
          Done
        </button>
      </span>
      `;
      this.taskHeader.insertAdjacentHTML("beforeend", html);
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
  bindAddSubtask(handler) {
    const addSubtaskButton = this.taskHeader.querySelector(
      ".main-header__new-button"
    );
    if (addSubtaskButton) {
      addSubtaskButton.addEventListener("click", handler);
    }
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
    this.view.bindAddSubtask(this.handleAddSubtask.bind(this));
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
  handleAddSubtask() {
    const dialog = document.querySelector(".new-task-dialog");
    dialog.showModal();

    const closeButton = dialog.querySelector('button[type="reset"');
    closeButton.addEventListener("click", () => {
      dialog.close();
    });

    const addButton = dialog.querySelector('button[type="submit"');
    addButton.addEventListener("click", () => {
      if (dialog.querySelector("form").checkValidity() === false) {
        return;
      }
      const title = dialog.querySelector('input[name="title"').value;
      const description = dialog.querySelector(
        'input[name="description"'
      ).value;
      const dueDate = dialog.querySelector('input[name="dueDate"').value;
      const task = new Task(title, description, dueDate);
      this.task.addSubtask(task);
      this.updateView();
      dialog.close();
    });
  }
}

const task = new Task("Home", "", new Date());

// just for development testing
task.addSubtask(new Task("task 1", "lorem", new Date()));
task.addSubtask(new Task("task 2", "thingy", new Date()));
task.subtasks[0].addSubtask(new Task("task 1", "desc", new Date()));
task.subtasks[0].addSubtask(new Task("task 2", "desc", new Date(), true));

const view = new View();
const controller = new Controller(task, view);
