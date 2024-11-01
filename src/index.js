import SubTask from "./components/SubTask";
import "./styles/global.css";

const DOING_TAB = "doing";
const DONE_TAB = "done";
const MASTER_TASK_ID = "master";

class Task {
  constructor({
    icon = this._createRandomEmojiIcon(),
    title = "Untitled",
    description = "",
    dueDate = "",
    complete = false,
    id = this._generateId(),
    parentId = "",
    subtasksIds = [],
  } = {}) {
    this.icon = icon;
    this.title = title;
    this.description = description;
    this.dueDate = dueDate;
    this.complete = complete;
    this.id = id;
    this.parentId = parentId;
    this.subtasksIds = subtasksIds;
  }
  _generateId() {
    return Math.random().toString(16).slice(2);
  }
  _createRandomEmojiIcon() {
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
    this.currentTask = undefined;
    this.currentTab = DOING_TAB;
  }
  render(task) {
    this.currentTask = task;
    this.renderParentTask();
    this.renderTitle();
    this.renderDescription();
    this.renderTabs();
    this.renderSubtasks();
  }
  renderParentTask() {
    // Remove the parent task element if it exists
    document.querySelector(".task__parent-task")?.remove();

    // If there is no parent task, exit early
    if (!this.currentTask.parentId) return;

    // Create the HTML for the parent task
    const html = `
      <button class="task__parent-task">
      <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-arrow-left"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M5 12l14 0" /><path d="M5 12l6 6" /><path d="M5 12l6 -6" /></svg>
      ${this.currentTask.parentTask.title}
      `;

    // Insert the HTML into the main header
    document
      .querySelector(".main-header")
      .insertAdjacentHTML("afterbegin", html);
  }
  renderTitle() {
    document.querySelector(".task__title").innerHTML =
      `<span>${this.currentTask.icon}</span>` + this.currentTask.title;
  }
  renderDescription() {
    // Remove the description element if it exists
    document.querySelector(".task__description")?.remove();

    // If there is no description, exit early
    if (!this.currentTask.description) return;

    const html = `
      <p class="task__description">
        ${this.currentTask.description}
      </p>
    `;
    const mainHeader = document.querySelector(".main-header");
    mainHeader?.insertAdjacentHTML("beforeend", html);
  }
  renderTabs() {
    // Remove the tabs element if it exists
    document.querySelector(".main-header__tabs")?.remove();

    // If there are no subtasks, exit early
    if (this.currentTask.subtasksIds.length === 0) return;

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
    const mainHeader = document.querySelector(".main-header");
    mainHeader?.insertAdjacentHTML("beforeend", html);
  }
  renderSubtasks() {
    const subtasksContainer = document.querySelector(".subtasks");

    // clears subtasks
    subtasksContainer.innerHTML = "";

    // if there are no subtasks, render empty state
    if (this.currentTask.subtasks.length === 0) {
      const html = `
      <p>No subtasks, add some by click on the "new" button</p>
      `;
      subtasksContainer.insertAdjacentHTML("beforeend", html);
      return;
    }

    // populates subtasks
    subtasksContainer.innerHTML = `
    ${this.currentTask.subtasks
      .map((subtask) => {
        if (this.currentTab === DOING_TAB && !subtask.complete) {
          return SubTask(subtask);
        } else if (this.currentTab === DONE_TAB && subtask.complete) {
          return SubTask(subtask);
        }
      })
      .join("")}
    `;

    // if there are no subtasks, render empty state
    if (subtasksContainer.children.length === 0) {
      if (this.currentTab === DOING_TAB) {
        const html = `
        <p>All done! Add some more subtasks by clicking the "new" button</p>
        `;
        subtasksContainer.insertAdjacentHTML("beforeend", html);
      } else if (this.currentTab === DONE_TAB) {
        const html = `
        <p>No finished tasks!</p>
        `;
        subtasksContainer.insertAdjacentHTML("beforeend", html);
      }
    }
  }
  bindClickTab(handler) {
    const tabs = document.querySelector(".main-header__tabs");
    if (tabs) {
      const tabButtons = tabs.querySelectorAll("button");
      tabButtons.forEach((tabButton) => {
        tabButton.addEventListener("click", (e) => handler(e));
      });
    }
  }
  bindClickParentTask(handler) {
    const parentTask = document.querySelector(".task__parent-task");
    if (parentTask) {
      parentTask.addEventListener("click", handler);
    }
  }
  bindClickSubtask(handler) {
    const subtasks = document.querySelectorAll(".subtask");
    subtasks.forEach((subtask, index) => {
      subtask.addEventListener("click", (e) =>
        handler(e, index, this.currentTab)
      );
    });
  }
  bindAddSubtask(handler) {
    const addSubtaskButton = document.querySelector(".main-header__new-button");
    if (addSubtaskButton) {
      addSubtaskButton.addEventListener("click", handler);
    }
  }
  bindCompleteSubtask(handler) {
    const subtasks = document.querySelectorAll(".subtask");
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
    const subtasks = document.querySelectorAll(".subtask");
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
    this.storage = storage;
    this.view = view;
    this.task = task;
    this.updateTask(task.id);
    this.updateView();

    // this was adding additional event listeners on every this.UpdateView() function call,
    // since the options in context menu don't change (atm), i keep it here for now in the the initialzation.
    this.view.bindContextMenuClick(this.handleContextMenuClick.bind(this));
  }
  updateView() {
    this.view.render(this.task);
    this.view.bindClickTab(this.handleClickTab.bind(this));
    this.view.bindClickSubtask(this.handleClickSubtask.bind(this));
    this.view.bindClickParentTask(this.handleClickParentTask.bind(this));
    this.view.bindAddSubtask(this.handleAddSubtask.bind(this));
    this.view.bindCompleteSubtask(this.handleCompleteSubtask.bind(this));
    this.view.bindRightClickSubtask(this.handleRightClickSubtask.bind(this));
  }
  updateTask(id) {
    this.task = new Task(storage.getTask(id));
    this.getParentTask();
    this.getSubtasks();
    this.getSubtasksSubtaskCompletion();
    this.view.currentTab = DOING_TAB;
    this.updateView();
  }
  getParentTask() {
    const parentTask = this.storage.getTask(this.task.parentId);
    this.task.parentTask = parentTask;
  }
  getSubtasks() {
    const subtasksIds = this.storage.getTask(this.task.id).subtasksIds;
    const subtasks = subtasksIds.map((subtaskId) =>
      this.storage.getTask(subtaskId)
    );
    this.task.subtasks = subtasks;
  }
  getSubtasksSubtaskCompletion() {
    const subtasks = this.task.subtasks;
    subtasks.forEach((subtask) => {
      if (subtask.subtasksIds.length > 0) {
        const subSubtasks = subtask.subtasksIds.map((subtaskId) =>
          this.storage.getTask(subtaskId)
        );
        const subtaskCompletionPercentage =
          (subSubtasks.reduce((acc, subtask) => acc + subtask.complete, 0) /
            subSubtasks.length) *
          100;
        subtask.subtaskCompletionPercentage = subtaskCompletionPercentage;
      }
    });
    this.task.subtasks = subtasks;
  }
  handleClickParentTask() {
    this.updateTask(this.task.parentId);
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

    // changing to subtask
    this.updateTask(subtask.id);
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
        const title = dialog.querySelector('input[name="title"').value;
        const description = dialog.querySelector(
          'input[name="description"'
        ).value;
        const dueDate = dialog.querySelector('input[name="dueDate"').value;

        // add to storage
        this.storage.addSubtask(
          this.task.id,
          new Task({
            title: title,
            description: description,
            dueDate: dueDate,
          })
        );
        this.updateTask(this.task.id);
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
      if (
        this.task.subtasks.filter((subtask) => !subtask.complete).length === 0
      ) {
        this.task.complete = true;
        this.storage.updateTask(this.task);
      }
    }

    this.updateTask(this.task.id);
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
        console.log("duplicating...");
        this.storage.duplicateSubtask(subtask.id, this.task.id);
        this.updateTask(this.task.id);
        this.updateView();
        break;
      }
      case "delete": {
        this.storage.deleteSubtask(this.task.id, subtask.id);
        this.updateTask(this.task.id);
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
    // REMOVE below when in production
    // localStorage.setItem("tasks", JSON.stringify({}));

    if (!localStorage.getItem("tasks")) {
      localStorage.setItem("tasks", JSON.stringify({}));
    }

    // if there is no master task, create one
    if (!this.tasks[MASTER_TASK_ID]) {
      const masterTask = new Task({
        icon: "🏠",
        title: "Home",
        id: MASTER_TASK_ID,
      });
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
    // creates or updates task
    const tasks = this.tasks;
    tasks[task.id] = task;
    this.tasks = tasks;
  }
  deleteTask(taskId) {
    const tasks = storage.tasks;
    delete tasks[taskId];
    storage.tasks = tasks;
  }
  deleteSubtask(parentId, subtaskId) {
    // delete from parenttask's subtasks
    const parentTask = storage.getTask(parentId);
    parentTask.subtasksIds.splice(parentTask.subtasksIds.indexOf(subtaskId), 1);
    storage.updateTask(parentTask);

    // collecting all children of the subtask
    const tasksToDelete = [subtaskId];
    for (let id of tasksToDelete) {
      const subtaskIds = storage.getTask(id).subtasksIds;
      subtaskIds.forEach((subtaskId) => {
        tasksToDelete.push(subtaskId);
      });
    }
    console.log(tasksToDelete);

    // deleting all subtasks
    tasksToDelete.forEach((id) => {
      this.deleteTask(id);
    });
  }
  addSubtask(parentId, subtask) {
    // creating subtask
    subtask.parentId = parentId;
    storage.updateTask(subtask);

    // updating parent task
    const parentTask = storage.getTask(parentId);
    parentTask.subtasksIds.push(subtask.id);
    storage.updateTask(parentTask);
  }
  duplicateSubtask(id, parentId) {
    // const tasks = this.tasks;
    let newTaskId = this._duplicateTaskRecursive(id, parentId);

    const tasks = this.tasks;
    const parentTask = tasks[parentId];
    parentTask.subtasksIds.push(newTaskId);
    this.tasks = tasks;

    // Return the new main task ID
    return newTaskId;
  }
  _duplicateTaskRecursive(taskId, parentId) {
    let tasks = this.tasks;

    // Check if the task exists
    if (!tasks[taskId]) {
      console.error("Task not found in localStorage");
      return null;
    }

    // Get the original task to duplicate
    let originalTask = tasks[taskId];

    // Create and store new task with a new ID
    let newTaskId = task._generateId(); // TODO: shouldn't do it like this.
    let newTask = {
      ...originalTask,
      id: newTaskId,
      subtasksIds: [],
      parentId: parentId,
      title: originalTask.title + " (copy)",
    };
    tasks[newTaskId] = newTask;
    this.tasks = tasks;

    // Duplicate each subtask recursively
    originalTask.subtasksIds.forEach((subtaskId) => {
      if (tasks[subtaskId]) {
        // Recursively duplicate the subtask and get the new ID
        let newSubtaskId = this._duplicateTaskRecursive(subtaskId, newTaskId);
        if (newSubtaskId) {
          // Add the new subtask ID to the newTask's subtasksIds
          newTask.subtasksIds.push(newSubtaskId);
        }
      }
    });

    tasks = this.tasks;
    tasks[newTaskId] = newTask;
    this.tasks = tasks;

    // Return the new task ID
    return newTaskId;
  }
}

const storage = new Storage();

// storage.addSubtask(
//   MASTER_TASK_ID,
//   new Task({
//     title: "Task 1",
//   })
// );

// storage.addSubtask(
//   MASTER_TASK_ID,
//   new Task({
//     title: "Test subtask",
//   })
// );

// storage.addSubtask(
//   MASTER_TASK_ID,
//   new Task({
//     title: "Test subtask 2",
//     id: "test-subtask-2",
//   })
// );

// storage.addSubtask(
//   "test-subtask-2",
//   new Task({
//     title: "Test subtask 3",
//     // complete: true,
//   })
// );

const task = new Task(storage.getTask(MASTER_TASK_ID));
const view = new View();
const controller = new Controller(task, view, storage);
