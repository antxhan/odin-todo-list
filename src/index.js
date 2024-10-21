import Projects from "./pages/projects";
import "./styles/global.css";

class Task {
  constructor(title, description, icon, dueDate, priority, complete = false) {
    this._title = title;
    this._description = description;
    this._dueDate = dueDate;
    this._priority = priority;
    this._complete = complete;
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
  toggleComplete() {
    this._complete = !this._complete;
  }
}

class Project {
  constructor(title, description, icon, tasks = []) {
    this._title = title;
    this._description = description;
    this._icon = icon;
    this._tasks = tasks;
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
  get tasks() {
    return this._tasks;
  }
  addTask(task) {
    this.tasks.push(task);
  }
  deleteTask(task) {
    this.tasks.splice(this.tasks.indexOf(task), 1);
  }
}

class App {
  constructor() {
    this._projects = [];
  }
  get projects() {
    return this._projects;
  }
  addProject(project) {
    this.projects.push(project);
  }
  deleteProject(project) {
    this.projects.splice(this.projects.indexOf(project), 1);
  }
}

class View {
  constructor() {}
}

const app = new App();
const defaultProject = new Project("Untitled", "My first project.");
app.addProject(defaultProject);

console.log(app.projects);

const thing = document.querySelector("body");
thing.appendChild(Projects());
