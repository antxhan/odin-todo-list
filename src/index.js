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
  addTask(task) {
    this._tasks.push(task);
  }
  deleteTask(task) {
    this._tasks.splice(this._tasks.indexOf(task), 1);
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
  }
  toggleComplete() {
    this._complete = !this._complete;
  }
  get subtasks() {
    return this._subtasks;
  }
  addSubtask(subtask) {
    this._subtasks.push(subtask);
  }
  deleteSubtask(subtask) {
    this._subtasks.splice(this._subtasks.indexOf(subtask), 1);
  }
}

class View {
  constructor() {
    this._tasks = document.querySelector(".tasks");
    this.renderTasks();
    this.init();
  }
  init() {
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
  }
  renderTasks() {
    // reset tasks
    this._tasks.innerHTML = "";

    // render tasks
    app.tasks.forEach((task) => {
      const taskElement = TaskElement(task);
      this._tasks.appendChild(taskElement);
    });
  }
}

const app = new App();
const defaultProject = new Task("First project", "This is my first project.");
app.addTask(defaultProject);
// console.log(app.tasks);

const view = new View();
