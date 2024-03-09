document.addEventListener("DOMContentLoaded", function () {
  const word = document.getElementById("Scroll_to_discover_span");
  function triggerAnimation() {
    word.style.animation = "none";
    void word.offsetWidth;
    word.style.animation = "test 1s forwards";
  }
  setInterval(triggerAnimation, 3000);
});
