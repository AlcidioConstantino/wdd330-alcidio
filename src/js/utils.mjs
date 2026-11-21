// wrapper for querySelector...returns matching element
export function qs(selector, parent = document) {
  return parent.querySelector(selector);
}

export function getParam(param) {
  return new URLSearchParams(window.location.search).get(param);
}

// or a more concise version if you are into that sort of thing:
// export const qs = (selector, parent = document) => parent.querySelector(selector);

// retrieve data from localstorage
export function getLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key));
}
// save data to local storage
export function setLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}
// set a listener for both touchend and click
export function setClick(selector, callback) {
  qs(selector).addEventListener("touchend", (event) => {
    event.preventDefault();
    callback();
  });
  qs(selector).addEventListener("click", callback);
}

export function alertMessage(message, scroll = true) {
  const main = qs("main");
  if (!main) return;
  let alert = qs("[data-alert-message]", main);
  if (!alert) {
    alert = document.createElement("div");
    alert.dataset.alertMessage = "";
    alert.className = "alert-message";
    alert.setAttribute("role", "alert");
    main.prepend(alert);
  }
  alert.textContent = typeof message === "string" ? message : JSON.stringify(message);
  if (scroll) window.scrollTo({ top: 0, behavior: "smooth" });
}
