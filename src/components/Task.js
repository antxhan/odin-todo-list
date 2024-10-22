import placeholderIcon from "../assets/images/placeholder.png";
import duplicateIcon from "../assets/icons/copy.svg";
import deleteIcon from "../assets/icons/trash.svg";
import ContextMenu from "./ContextMenu";

export default function Task(task) {
  const container = document.createElement("div");
  container.className = "task";
  container.classList.add("disable-text-highlight");

  // context menu
  container.addEventListener("contextmenu", (e) => {
    e.preventDefault();

    const menu = ContextMenu([
      {
        text: "Duplicate",
        icon: duplicateIcon,
        onClick: () => {
          console.log("duplicate");
        },
      },
      {
        text: "Delete",
        icon: deleteIcon,
        onClick: () => {
          console.log("delete");
        },
      },
    ]);

    menu.setAttribute("aria-visible", "true");

    if (window.innerWidth > 600) {
      console.log(window.innerWidth);
      menu.style.left = `${e.clientX}px`;
      menu.style.top = `${e.clientY}px`;
    } else {
      menu.removeAttribute("style");
    }
  });

  // title
  const titleContainer = document.createElement("div");
  titleContainer.className = "task__title";
  const titleIcon = document.createElement("img");
  titleIcon.src = placeholderIcon;
  titleIcon.alt = "placeholder image";
  titleContainer.appendChild(titleIcon);
  const titleText = document.createElement("h3");
  titleText.textContent = task.title;
  titleContainer.appendChild(titleText);

  // description
  const description = document.createElement("p");
  description.className = "task__description";
  description.textContent = task.description;

  // status
  let status;
  if (!task.subtasks || task.subtasks.length === 0) {
    status = document.createElement("input");
    status.className = "task__status";
    status.type = "checkbox";
    status.checked = task.complete;
    status.addEventListener("change", (e) => {
      task.complete = !task.complete;
      container.style.display = "none";
    });
  } else {
    status = document.createElement("div");
    status.className = "task__status";
    const completionPercentage = task.calculateCompletedSubtasks();
    status.textContent = `${completionPercentage}%`;
  }

  container.appendChild(titleContainer);
  container.appendChild(description);
  container.appendChild(status);
  return container;
}
