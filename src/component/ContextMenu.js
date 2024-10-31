export default function ContextMenu() {
  const html = `
    <dialog class="context-menu disable-text-highlight">
      <ul>
        <li class="context-menu__option" data-value="duplicate">Duplicate</li>
        <li class="context-menu__option" data-value="delete">Delete</li>
      </ul>
    </dialog>
    `;
  //   document.querySelector("body").insertAdjacentHTML("beforeend", html);
  //   return document.querySelector(".context-menu");
}
