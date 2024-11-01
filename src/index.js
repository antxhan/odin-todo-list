import "./styles/global.css";

const DOING_TAB = "doing";
const DONE_TAB = "done";
const MASTER_TASK_ID = "master";

class Task {
  constructor(
    icon = this.createRandomEmojiIcon(),
    title = "Untitled",
    description = "",
    dueDate = "",
    complete = false,
    id = this.generateId(),
    parentId = "",
    subtasksIds = []
  ) {
    this.icon = icon;
    this.title = title;
    this.description = description;
    this.dueDate = dueDate;
    this.complete = complete;
    this.id = id;
    this.parentId = parentId;
    this.subtasksIds = subtasksIds;
  }
  addSubtask({ icon, title, description, dueDate }) {
    // creating subtask
    const task = new Task(icon, title, description, dueDate);
    task.parentId = this.id;
    storage.updateTask(task);

    // updating this task
    this.subtasksIds.push(task.id);
    storage.updateTask(this);
  }
  deleteSubtask(id) {
    // delete from this tasks subtasks
    const task = storage.getTask(this.id);
    task.subtasksIds.splice(task.subtasksIds.indexOf(id), 1);
    storage.updateTask(task);

    const tasksToDelete = [id];

    // collecting all children of the subtask
    for (let id of tasksToDelete) {
      const subtaskIds = storage.getTask(id).subtasksIds;
      subtaskIds.forEach((subtaskId) => {
        tasksToDelete.push(subtaskId);
      });
    }
    // console.log(tasksToDelete);

    // deleting all subtasks
    tasksToDelete.forEach((id) => {
      // const subtask = storage.getTask(id);
      storage.deleteTask(id);
      // this.subtasksIds.splice(this.subtasksIds.indexOf(id), 1);
    });
  }
  duplicateSubtask(id) {
    // const task = storage.getTask(this.id);
  }
  get subtasks() {
    const subtasksIds = storage.tasks[this.id].subtasksIds;
    const subtasks = subtasksIds.map((subtaskId) => {
      const subtask = storage.getTask(subtaskId);
      return subtask;
    });
    console.log(subtasks);
    return subtasks;
  }
  generateId() {
    return Math.random().toString(16).slice(2);
  }
  createRandomEmojiIcon() {
    const emojiRanges = [
      [0x1f600, 0x1f64f], // Emoticons
      [0x1f300, 0x1f5ff], // Miscellaneous Symbols and Pictographs
      [0x1f680, 0x1f6ff], // Transport and Map Symbols
      [0x1f700, 0x1f77f], // Alchemical Symbols
      [0x1f780, 0x1f7ff], // Geometric Shapes Extended
      [0x1f800, 0x1f8ff], // Supplemental Arrows-C
      [0x1f900, 0x1f9ff], // Supplemental Symbols and Pictographs
      [0x2600, 0x26ff], // Miscellaneous Symbols
      [0x2700, 0x27bf], // Dingbats
      [0x2b50, 0x2b55], // Stars
    ];
    const randomRange =
      emojiRanges[Math.floor(Math.random() * emojiRanges.length)];
    const randomCodePoint =
      Math.floor(Math.random() * (randomRange[1] - randomRange[0] + 1)) +
      randomRange[0];
    return String.fromCodePoint(randomCodePoint);
  }
}

class View {
  constructor() {
    this.task = undefined;
    this.currentTab = DOING_TAB;
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
    // this.renderContextMenu();
  }
  renderParentTask() {
    const parentTaskElement = document.querySelector(".task__parent-task");
    if (parentTaskElement) {
      parentTaskElement.remove();
    }

    if (this.task.parentId) {
      const parentTask = storage.getTask(this.task.parentId);
      const html = `
      <button class="task__parent-task">
      <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-arrow-left"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M5 12l14 0" /><path d="M5 12l6 6" /><path d="M5 12l6 -6" /></svg>
      ${parentTask.title}
      `;
      this.taskHeader.insertAdjacentHTML("afterbegin", html);
    }
  }
  renderTitle() {
    this.taskTitleContainer.innerHTML =
      `<span>${this.task.icon}</span>` + this.task.title;
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
    if (this.task.subtasksIds.length !== 0) {
      const html = `
      <span class="main-header__tabs">
        <button value="${DOING_TAB}" aria-current="${
        this.currentTab === DOING_TAB ? "true" : "false"
      }">
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
        <button value="${DONE_TAB}" aria-current="${
        this.currentTab === DONE_TAB ? "true" : "false"
      }">
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
    // clears subtasks
    this.subtasksContainer.innerHTML = "";

    console.log("me:", this.task.subtasks);

    // if there are no subtasks, render empty state
    if (!this.task.subtasks || this.task.subtasks.length === 0) {
      const html = `
      <p>No subtasks, add some by click on the "new" button</p>
      `;
      this.subtasksContainer.insertAdjacentHTML("beforeend", html);
      return;
    }

    const subtaskComponent = (subtask) => {
      return `
        <li class="subtask">
          <h3 class="subtask__title"><span>${subtask.icon}</span>${
        subtask.title
      }</h3>
        ${
          subtask.subtasksIds.length > 0
            ? `<p class="subtask__status">${
                (subtask.subtasksIds
                  .map((subtaskId) => storage.getTask(subtaskId))
                  .reduce((acc, subtask) => acc + subtask.complete, 0) /
                  subtask.subtasksIds.length) *
                100
              }%</p>`
            : `<input class="subtask__status" type="checkbox" ${
                subtask.complete ? "checked" : ""
              } >`
        }
        </li>
        `;
    };

    // populates subtasks
    this.subtasksContainer.innerHTML = `
      ${this.task.subtasksIds
        .map((id) => storage.getTask(id))
        .map((subtask) => {
          if (this.currentTab === DOING_TAB && !subtask.complete) {
            return subtaskComponent(subtask);
          } else if (this.currentTab === DONE_TAB && subtask.complete) {
            return subtaskComponent(subtask);
          }
        })
        .join("")}
    `;

    if (this.subtasksContainer.children.length === 0) {
      if (this.currentTab === DOING_TAB) {
        const html = `
        <p>All done! Add some more subtasks by clicking the "new" button</p>
        `;
        this.subtasksContainer.insertAdjacentHTML("beforeend", html);
      } else if (this.currentTab === DONE_TAB) {
        const html = `
        <p>No finished tasks!</p>
        `;
        this.subtasksContainer.insertAdjacentHTML("beforeend", html);
      }
    }
  }
  bindClickTab(handler) {
    const tabs = this.taskHeader.querySelector(".main-header__tabs");
    if (!tabs) {
      return;
    }
    const tabButtons = tabs.querySelectorAll("button");
    tabButtons.forEach((tabButton) => {
      tabButton.addEventListener("click", (e) => handler(e));
    });
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
      subtask.addEventListener("click", (e) =>
        handler(e, index, this.currentTab)
      );
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
  bindCompleteSubtask(handler) {
    const subtasks = this.subtasksContainer.querySelectorAll(".subtask");
    subtasks.forEach((subtask, index) => {
      const checkbox = subtask.querySelector('input[type="checkbox"');
      if (checkbox) {
        checkbox.addEventListener("change", (e) =>
          handler(e, index, this.currentTab)
        );
      }
    });
  }
  bindRightClickSubtask(handler) {
    const subtasks = this.subtasksContainer.querySelectorAll(".subtask");
    subtasks.forEach((subtask, index) => {
      subtask.addEventListener("contextmenu", (e) =>
        handler(e, index, this.currentTab)
      );
    });
  }
  bindContextMenuClick(handler) {
    const options = document.querySelectorAll(".context-menu ul li");
    options.forEach((option) => {
      option.addEventListener("click", (e) => handler(e));
    });
  }
}

class Controller {
  constructor(task, view, storage) {
    this.task = task;
    this.view = view;
    this.storage = storage;
    this.updateView();

    // this was adding additional event listeners on every this.UpdateView() function call,
    // since the options in context menu don't change (atm), i keep it here for now in the the initialzation.
    this.view.bindContextMenuClick(this.handleContextMenuClick.bind(this));
  }
  updateView() {
    this.view.render(this.task);
    this.view.bindClickParentTask(this.handleClickParentTask.bind(this));
    this.view.bindClickSubtask(this.handleClickSubtask.bind(this));
    this.view.bindClickTab(this.handleClickTab.bind(this));
    this.view.bindAddSubtask(this.handleAddSubtask.bind(this));
    this.view.bindCompleteSubtask(this.handleCompleteSubtask.bind(this));
    this.view.bindRightClickSubtask(this.handleRightClickSubtask.bind(this));
  }
  handleClickParentTask() {
    const parentTask = storage.getTask(this.task.parentId);
    this.task = new Task(
      parentTask.icon,
      parentTask.title,
      parentTask.description,
      parentTask.dueDate,
      parentTask.complete,
      parentTask.id,
      parentTask.parentId,
      parentTask.subtasksIds
    );
    this.view.currentTab = DOING_TAB;
    this.updateView();
  }
  handleClickSubtask(e, subtaskIndex, currentTab) {
    if (e.target.type === "checkbox") {
      return;
    }

    let subtask;
    if (currentTab === DONE_TAB) {
      const completedSubtasks = this.task.subtasks.filter(
        (subtask) => subtask.complete
      );
      subtask = completedSubtasks[subtaskIndex];
    } else if (currentTab === DOING_TAB) {
      const notCompletedSubtasks = this.task.subtasks.filter(
        (subtask) => !subtask.complete
      );
      subtask = notCompletedSubtasks[subtaskIndex];
    }

    const storedSubtask = storage.getTask(subtask.id);
    this.task = new Task(
      storedSubtask.icon,
      storedSubtask.title,
      storedSubtask.description,
      storedSubtask.dueDate,
      storedSubtask.complete,
      storedSubtask.id,
      storedSubtask.parentId,
      storedSubtask.subtasksIds
    );

    // updating view
    this.view.currentTab = DOING_TAB;
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
    addButton.addEventListener("click", (e) => {
      const form = dialog.querySelector("form");
      if (!form.checkValidity()) {
        return;
      } else {
        // const icon = dialog.querySelector('input[name="icon"').value;
        const icon = "";
        const title = dialog.querySelector('input[name="title"').value;
        const description = dialog.querySelector(
          'input[name="description"'
        ).value;
        const dueDate = dialog.querySelector('input[name="dueDate"').value;
        this.task.addSubtask({ icon, title, description, dueDate });
        this.updateView();
        form.reset();
        dialog.close();
      }
    });
  }
  handleCompleteSubtask(e, subtaskIndex, currentTab) {
    let subtask;
    if (currentTab === DONE_TAB) {
      const completedSubtasks = this.task.subtasks.filter(
        (subtask) => subtask.complete
      );
      subtask = completedSubtasks[subtaskIndex];
    } else if (currentTab === DOING_TAB) {
      const notCompletedSubtasks = this.task.subtasks.filter(
        (subtask) => !subtask.complete
      );
      subtask = notCompletedSubtasks[subtaskIndex];
    }

    // toggle subtask complete
    subtask.complete = !subtask.complete;
    this.storage.updateTask(subtask);

    // check if entire task is complete
    if (subtask.complete) {
      if (this.task) {
        if (
          this.task.subtasks.filter((subtask) => !subtask.complete).length === 0
        ) {
          this.task.complete = true;
          this.storage.updateTask(this.task);
        }
      }
    }

    this.updateView();
  }
  handleClickTab(e) {
    const tab = e.target.value;
    this.view.currentTab = tab;
    this.updateView();
  }
  handleRightClickSubtask(e, index, currentTab) {
    e.preventDefault();
    if (e.target.type === "checkbox") {
      return;
    }

    // this.view.toggleContextMenu();
    const contextMenu = document.querySelector(".context-menu");
    contextMenu.setAttribute("data-subtask-index", index);
    contextMenu.showModal();
    contextMenu.style.left = e.clientX + "px";
    contextMenu.style.top = e.clientY + "px";

    // if user right clicks again when context menu already open.
    contextMenu.addEventListener("contextmenu", (e) => {
      e.preventDefault();

      // close if user right clicks outside of context menu dialog
      const rect = contextMenu.getBoundingClientRect();
      const isInDialog =
        rect.top <= e.clientY &&
        e.clientY <= rect.top + rect.height &&
        rect.left <= e.clientX &&
        e.clientX <= rect.left + rect.width;
      if (!isInDialog) {
        contextMenu.close();
        // this.view.toggleContextMenu();
        // this.updateView();
      }
    });

    // if user clicks somewhere: close the context menu.
    contextMenu.addEventListener("click", (e) => {
      contextMenu.close();
      // this.view.toggleContextMenu();
      // this.updateView();
    });
  }
  handleContextMenuClick(e) {
    const index =
      e.target.parentNode.parentNode.getAttribute("data-subtask-index");
    const subtask =
      this.view.currentTab === DOING_TAB
        ? this.task.subtasks.filter((subtask) => !subtask.complete)[index]
        : this.task.subtasks.filter((subtask) => subtask.complete)[index];
    const value = e.target.getAttribute("data-value");
    switch (value) {
      case "duplicate": {
        this.task.duplicateSubtask(subtask.id);
        this.updateView();
        break;
      }
      case "delete": {
        this.task.deleteSubtask(subtask.id);
        this.updateView();
        break;
      }
    }
  }
}

class Storage {
  constructor() {
    this.init();
  }
  init() {
    // REMOVE the line below when not in development
    // localStorage.setItem("tasks", JSON.stringify({}));

    // keep this
    if (!this.tasks[MASTER_TASK_ID]) {
      const masterTask = new Task();
      masterTask.icon = "🏠";
      masterTask.title = "Home";
      masterTask.id = MASTER_TASK_ID;
      const tasks = this.tasks;
      tasks[MASTER_TASK_ID] = masterTask;
      this.tasks = tasks;
    }
  }
  get tasks() {
    return JSON.parse(localStorage.getItem("tasks"));
  }
  set tasks(tasks) {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }
  getTask(taskId) {
    return this.tasks[taskId];
  }
  updateTask(task) {
    const tasks = this.tasks;
    tasks[task.id] = task;
    this.tasks = tasks;
  }
  deleteTask(taskId) {
    const tasks = storage.tasks;
    delete tasks[taskId];
    storage.tasks = tasks;
  }
}

const storage = new Storage();
const masterTask = storage.getTask(MASTER_TASK_ID);
const task = new Task(
  masterTask.icon,
  masterTask.title,
  masterTask.description,
  masterTask.dueDate,
  masterTask.complete,
  masterTask.id,
  masterTask.parentId,
  masterTask.subtasksIds
);

const view = new View();
const controller = new Controller(task, view, storage);
