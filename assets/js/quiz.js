// Quiz — multiple choice with reveal-on-click feedback.

export function initQuiz() {
  document.querySelectorAll("[data-quiz]").forEach((quiz) => {
    const opts = Array.from(quiz.querySelectorAll(".quiz__option"));
    if (!opts.length) return;

    // Ensure a live region exists — the feedback element only renders
    // when authors include {{< quiz-feedback >}}, but the result should
    // always be announced.
    let live = quiz.querySelector(".quiz__status");
    if (!live) {
      live = document.createElement("div");
      live.className = "quiz__status sr-only";
      live.setAttribute("role", "status");
      live.setAttribute("aria-live", "polite");
      live.setAttribute("aria-atomic", "true");
      quiz.appendChild(live);
    }

    const select = (opt) => {
      if (quiz.classList.contains("is-answered")) return;
      const correct = opt.dataset.correct === "true";
      opt.classList.add(correct ? "is-correct" : "is-wrong");
      let msg = correct ? "Correct" : "Incorrect";
      if (!correct) {
        opts.forEach((o) => {
          if (o.dataset.correct === "true") {
            o.classList.add("is-correct");
            const answerEl = o.querySelector(".quiz__option-text");
            const text = answerEl ? answerEl.textContent.trim() : "";
            if (text) msg += ` — the correct answer is: ${text}`;
          }
        });
      }
      live.textContent = msg;
      quiz.classList.add("is-answered");
    };

    opts.forEach((opt, i) => {
      opt.addEventListener("click", () => select(opt));
      opt.addEventListener("keydown", (e) => {
        let next = null;
        if (e.key === "ArrowDown" || e.key === "ArrowRight") next = opts[(i + 1) % opts.length];
        else if (e.key === "ArrowUp" || e.key === "ArrowLeft") next = opts[(i - 1 + opts.length) % opts.length];
        else if (e.key === "Home") next = opts[0];
        else if (e.key === "End") next = opts[opts.length - 1];
        if (next) { e.preventDefault(); next.focus(); }
      });
    });
  });
}
