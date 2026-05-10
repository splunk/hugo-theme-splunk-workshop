// Quiz — multiple choice with reveal-on-click feedback.

export function initQuiz() {
  document.querySelectorAll("[data-quiz]").forEach((quiz) => {
    const opts = quiz.querySelectorAll(".quiz__option");
    opts.forEach((opt) => {
      opt.addEventListener("click", () => {
        if (quiz.classList.contains("is-answered")) return;
        const correct = opt.dataset.correct === "true";
        opt.classList.add(correct ? "is-correct" : "is-wrong");
        // Reveal the correct one if user got it wrong
        if (!correct) {
          opts.forEach(o => { if (o.dataset.correct === "true") o.classList.add("is-correct"); });
        }
        quiz.classList.add("is-answered");
      });
    });
  });
}
