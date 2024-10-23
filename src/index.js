import TaskElement from "./components/task";
import "./styles/global.css";
import placeholderIcon from "./assets/images/placeholder.png";

class Task {
  constructor(
    title = "Untitled", // string
    description = "", // string
    icon = placeholderIcon, // string
    dueDate = "", // string
    priority = 0 // number
  ) {
    this._id = "";
    this._title = title;
    this._description = description;
    this._icon = icon;
    this._createdAt = new Date();
    this._updatedAt = this._createdAt;
    this._dueDate = dueDate;
    this._priority = priority;
    this._parentTask = null; // Task || null
    this._subtasks = null; // array || null
    this._complete = false; // boolean
  }
  get id() {
    return this._id;
  }
  get title() {
    return this._title;
  }
  set title(title) {
    this._title = title;
  }
  get description() {
    return this._description;
  }
  set description(description) {
    this._description = description;
  }
  get icon() {
    return this._icon;
  }
  set icon(icon) {
    this._icon = icon;
  }
  get createdAt() {
    return this._createdAt;
  }
  get updatedAt() {
    return this._createdAt;
  }
  get dueDate() {
    return this._dueDate;
  }
  set dueDate(dueDate) {
    this._dueDate = dueDate;
  }
  get priority() {
    return this._priority;
  }
  set priority(priority) {
    this._priority = priority;
  }
  get complete() {
    return this._complete;
  }
  set complete(bool) {
    this._complete = bool;
    if (this.parentTask) {
      this.parentTask.calculateCompletedSubtasks();
    }
  }
  calculateCompletedSubtasks() {
    const completedCount = this.subtasks.filter(
      (subtask) => subtask.complete
    ).length;
    const totalCount = this.subtasks.length;
    if (completedCount === totalCount) {
      this.complete = true;
    }
    const completionPercentage = (completedCount / totalCount) * 100;
    return completionPercentage;
  }
  get parentTask() {
    return this._parentTask;
  }
  set parentTask(parentTask) {
    this._parentTask = parentTask;
  }
  get subtasks() {
    return this._subtasks;
  }
  set subtasks(subtasks) {
    this._subtasks = subtasks;
  }
  delete() {
    console.log("i was called");
    this.parentTask.deleteSubtask(this);
  }
  addSubtask(subtask) {
    subtask.parentTask = this;
    if (!this.subtasks) {
      this.subtasks = [];
    }
    this.subtasks.push(subtask);
  }
  deleteSubtask(subtask) {
    this.subtasks.splice(this.subtasks.indexOf(subtask), 1);
  }
}

class View {
  constructor(task) {
    this._currentTask = task;
    this._currentTab = document.querySelector(
      ".main-header__tabs button[aria-current='true']"
    );
    this._tasks = document.querySelector(".tasks");
    this.renderTasks();
    this.init();
  }
  get currentTask() {
    return this._currentTask;
  }
  set currentTask(task) {
    this._currentTask = task;
  }
  get currentTab() {
    return this._currentTab;
  }
  set currentTab(currentTab) {
    this._currentTab = currentTab;
  }
  get tasks() {
    return this._tasks;
  }
  set tasks(tasks) {
    this._tasks = tasks;
  }
  init() {
    // new task button
    const newTaskDialog = document.querySelector(".new-task-dialog");
    document
      .querySelector(".main-header__new-button")
      .addEventListener("click", (e) => {
        newTaskDialog.showModal();
      });

    // handle new task dialog
    newTaskDialog.querySelectorAll("button").forEach((button) => {
      button.addEventListener("click", (e) => {
        // e.preventDefault();

        if (button.type === "submit") {
          const titleInput = newTaskDialog.querySelector("input[name=title]");
          const descriptionInput = newTaskDialog.querySelector(
            "input[name=description]"
          );
          const dueDateInput = newTaskDialog.querySelector(
            "input[name=dueDate]"
          );
          const prioritySelect = newTaskDialog.querySelector(
            "select[name=priority]"
          );

          // validate form data
          if (newTaskDialog.querySelector("form").checkValidity()) {
            // create new Task from data
            const task = new Task(
              titleInput.value,
              descriptionInput.value,
              dueDateInput.value,
              prioritySelect.value
            );

            // add new Task to currentTask.tasks
            this.currentTask.addTask(task);

            // close
            newTaskDialog.close();
            newTaskDialog.querySelector("form").reset();
          }
        } else {
          // close
          newTaskDialog.close();
          newTaskDialog.querySelector("form").reset();
        }

        // render view
        this.renderTasks();
      });
    });

    // tabs
    const tabs = Array.from(
      document.querySelector(".main-header__tabs").children
    );
    tabs.forEach((tab) => {
      tab.addEventListener("click", (e) => {
        // reset tab highlight
        tabs.forEach((tab) => {
          tab.setAttribute("aria-current", "false");
        });
        e.currentTarget.setAttribute("aria-current", "true");
        this.currentTab = e.currentTarget;
        this.renderTasks();
      });
    });

    // hiding context menu
    document.addEventListener("click", (e) => {
      this.hideContextMenu();
    });
    window.addEventListener("resize", () => {
      this.hideContextMenu();
    });
  }
  hideContextMenu() {
    const contextMenu = document.querySelector(".context-menu");
    if (contextMenu) {
      contextMenu.setAttribute("aria-visible", "false");
      contextMenu.removeAttribute("style");
    }
  }
  renderTasks() {
    // reset
    this.tasks.innerHTML = "";

    // render tasks
    this.currentTask.subtasks.forEach((task) => {
      if (this.currentTab.value === "ongoing" && !task.complete) {
        const taskElement = TaskElement(task);
        this.tasks.appendChild(taskElement);
      } else if (this.currentTab.value === "archive" && task.complete) {
        const taskElement = TaskElement(task);
        this.tasks.appendChild(taskElement);
      }
    });
  }
}

const origin = new Task();

const defaultProject = new Task("First project", "This is my first project.");
origin.addSubtask(defaultProject);

const secondProject = new Task("Second project", "This is my second project.");
const subtask = new Task("Subtask", "This is my subtask.");
const subtask2 = new Task("subtask 2", "This is my subtask 2.");
secondProject.addSubtask(subtask);
secondProject.addSubtask(subtask2);
subtask.complete = true;
subtask2.complete = true;
origin.addSubtask(secondProject);

const view = new View(origin);
