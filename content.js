function handleClick() {
  alert("¡Hiciste clic en el botón de temporizador!");
}

function attachClickListener() {
  const button = document.getElementById("newly-added-timer");
  if (button && !button.dataset.listenerAttached) {
    button.addEventListener("click", handleClick);
    button.dataset.listenerAttached = "true";
  }
}

// Observa cambios en el DOM por si el botón aparece después (SPA)
const observer = new MutationObserver(() => {
  attachClickListener();
});
observer.observe(document.body, { childList: true, subtree: true });

// Intento inicial
attachClickListener();
