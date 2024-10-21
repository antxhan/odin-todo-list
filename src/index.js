import TaskElement from "./components/task";
import "./styles/global.css";
import placeholderIcon from "./assets/images/placeholder.png";

class App {
  constructor(tasks = []) {
    this._tasks = tasks;
  }
  get tasks() {
    return this._tasks;
  }
  set tasks(tasks) {
    this._tasks = tasks;
  }
  addTask(task) {
    this.tasks.push(task);
  }
  deleteTask(task) {
    this.tasks.splice(this.tasks.indexOf(task), 1);
  }
}

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
    this._parentTask = null;
    this._subtasks = null; // array or null
    this._complete = false; // boolean, based on subtasks completedness
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
  constructor() {
    this._currentTab = "ongoing";
    this._tasks = document.querySelector(".tasks");
    this.renderTasks();
    this.init();
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
    // new button
    document
      .querySelector(".main-header__new-button")
      .addEventListener("click", (e) => {
        e.preventDefault();
        const newTaskDialog = document.querySelector(".new-task-dialog");
        newTaskDialog.showModal();

        // validate form data
        //

        // create new Task from data
        const task = new Task();

        // add new Task to app.tasks
        //
        // render view
        //
      });

    // tabs
    Array.from(document.querySelector(".main-header__tabs").children).forEach(
      (tab) => {
        tab.addEventListener("click", (e) => {
          e.preventDefault();
          this.currentTab = e.target.textContent.toLowerCase();
          this.renderTasks();
        });
      }
    );
  }
  renderTasks() {
    // reset
    this.tasks.innerHTML = "";

    // render tasks
    app.tasks.forEach((task) => {
      if (this.currentTab === "ongoing" && !task.complete) {
        const taskElement = TaskElement(task);
        this.tasks.appendChild(taskElement);
      } else if (this.currentTab === "archive" && task.complete) {
        const taskElement = TaskElement(task);
        this.tasks.appendChild(taskElement);
      }
    });
  }
}

const app = new App();

const defaultProject = new Task("First project", "This is my first project.");
app.addTask(defaultProject);

const secondProject = new Task("Second project", "This is my second project.");
const subtask = new Task("Subtask", "This is my subtask.");
const subtask2 = new Task("subtask 2", "This is my subtask 2.");
secondProject.addSubtask(subtask);
secondProject.addSubtask(subtask2);
subtask.complete = true;
subtask2.complete = true;
app.addTask(secondProject);

const view = new View();
