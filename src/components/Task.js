import placeholderIcon from "../assets/images/placeholder.png";
import duplicateIcon from "../assets/icons/copy.svg";
import deleteIcon from "../assets/icons/trash.svg";

export default function Task(task) {
  const container = document.createElement("div");
  container.className = "task";

  //   title
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

  // buttons
  const buttonsContainer = document.createElement("div");
  buttonsContainer.className = "task__buttons";

  // duplicate button
  const duplicateButton = document.createElement("button");
  const duplicateButtonIcon = document.createElement("img");
  duplicateButtonIcon.src = duplicateIcon;
  duplicateButtonIcon.alt = "duplicate";
  duplicateButton.appendChild(duplicateButtonIcon);
  buttonsContainer.appendChild(duplicateButton);

  // delete button
  const deleteButton = document.createElement("button");
  const deleteButtonIcon = document.createElement("img");
  deleteButtonIcon.src = deleteIcon;
  deleteButtonIcon.alt = "delete";
  deleteButton.appendChild(deleteButtonIcon);
  buttonsContainer.appendChild(deleteButton);

  container.appendChild(titleContainer);
  container.appendChild(description);
  container.appendChild(status);
  container.appendChild(buttonsContainer);
  return container;
}
