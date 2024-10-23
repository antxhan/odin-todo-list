export default function ContextMenu(options) {
  const menu = document.querySelector(".context-menu");
  menu.innerHTML = "";

  menu.addEventListener("contextmenu", (e) => {
    e.preventDefault();
  });

  options.forEach((option) => {
    const menuItem = document.createElement("li");
    menuItem.innerHTML = option.icon;
    const textContent = document.createTextNode(option.text);
    menuItem.appendChild(textContent);
    menuItem.addEventListener("click", option.onClick);
    menu.appendChild(menuItem);
  });

  return menu;
}
