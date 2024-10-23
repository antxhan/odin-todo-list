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
        icon: `<svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-copy"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M7 7m0 2.667a2.667 2.667 0 0 1 2.667 -2.667h8.666a2.667 2.667 0 0 1 2.667 2.667v8.666a2.667 2.667 0 0 1 -2.667 2.667h-8.666a2.667 2.667 0 0 1 -2.667 -2.667z" /><path d="M4.012 16.737a2.005 2.005 0 0 1 -1.012 -1.737v-10c0 -1.1 .9 -2 2 -2h10c.75 0 1.158 .385 1.5 1" /></svg>`,
        onClick: () => {
          console.log("duplicate");
        },
      },
      {
        text: "Delete",
        icon: `<svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-trash"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M4 7l16 0" /><path d="M10 11l0 6" /><path d="M14 11l0 6" /><path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" /><path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" /></svg>`,
        onClick: () => {
          task.delete();
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
