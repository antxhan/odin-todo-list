export default function SubTask(subtask) {
  return `
    <li class="subtask">
        <h3 class="subtask__title"><span>${subtask.icon}</span>${
    subtask.title
  }</h3>
    ${
      subtask.subtasksIds.length > 0
        ? `<p class="subtask__status">${subtask.subtaskCompletionPercentage}%</p>`
        : `<input class="subtask__status" type="checkbox" ${
            subtask.complete ? "checked" : ""
          } >`
    }
    </li>
    `;
}
