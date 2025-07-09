function handleClick() {
  alert("You clicked the timer button!");
}

function attachClickListener() {
  const button = document.getElementById("newly-added-timer");
  if (button && !button.dataset.listenerAttached) {
    button.addEventListener("click", handleClick);
    button.dataset.listenerAttached = "true";
  }
}

// Observe DOM changes in case the button appears later (SPA)
const observer = new MutationObserver(() => {
  attachClickListener();
});
observer.observe(document.body, { childList: true, subtree: true });

// Initial attempt
attachClickListener();
