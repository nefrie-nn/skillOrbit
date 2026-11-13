async function handleWaitlistSubmit(event) {
  event.preventDefault();

  const form = event.target;
  const emailInput = form.querySelector('input[type="email"]');
  const submitBtn = form.querySelector('button[type="submit"]');
  const email = emailInput ? emailInput.value.trim().toLowerCase() : "";

  if (!email) return;

  const originalText = submitBtn.innerText;
  const originalClasses = submitBtn.className;

  const resetButton = () => {
    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.innerText = originalText;
      submitBtn.className = originalClasses;
      submitBtn.style.opacity = "1";
    }, 3000);
  };

  // Проверка повторной отправки в браузере
  const submittedEmails = JSON.parse(localStorage.getItem("so_waitlist") || "[]");
  if (submittedEmails.includes(email)) {
    submitBtn.disabled = true;
    submitBtn.innerText = "ALREADY IN! ✓";
    submitBtn.className =
      "w-full sm:w-auto bg-indigo-500 text-white font-extrabold text-xs uppercase tracking-wider px-7 py-4 rounded-xl transition-all duration-300 shadow-[0_0_15px_rgba(99,102,241,0.4)] cursor-default whitespace-nowrap";
    resetButton();
    return;
  }

  // Состояние: Отправка
  submitBtn.disabled = true;
  submitBtn.innerText = "SENDING...";
  submitBtn.style.opacity = "0.7";

  try {
    const response = await fetch("/api/send-receipt", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();

    if (response.ok) {
      localStorage.setItem("so_waitlist", JSON.stringify([...submittedEmails, email]));

      submitBtn.innerText = "ADDED! ✨";
      submitBtn.style.opacity = "1";
      submitBtn.className =
        "w-full sm:w-auto bg-[#3DFF9C] text-dark-main font-extrabold text-xs uppercase tracking-wider px-7 py-4 rounded-xl transition-all duration-300 shadow-[0_0_25px_rgba(61,255,156,0.7)] cursor-default whitespace-nowrap";

      form.reset();
      resetButton();
    } else if (response.status === 409) {
      localStorage.setItem("so_waitlist", JSON.stringify([...submittedEmails, email]));

      submitBtn.innerText = "ALREADY IN! ✓";
      submitBtn.style.opacity = "1";
      submitBtn.className =
        "w-full sm:w-auto bg-indigo-500 text-white font-extrabold text-xs uppercase tracking-wider px-7 py-4 rounded-xl transition-all duration-300 shadow-[0_0_15px_rgba(99,102,241,0.4)] cursor-default whitespace-nowrap";

      resetButton();
    } else {
      throw new Error(data.error || "Something went wrong");
    }
  } catch (err) {
    console.error("Submit error:", err);

    submitBtn.innerText = "TRY AGAIN";
    submitBtn.style.opacity = "1";
    submitBtn.className =
      "w-full sm:w-auto bg-rose-500 text-white font-extrabold text-xs uppercase tracking-wider px-7 py-4 rounded-xl transition-all duration-300 shadow-[0_0_15px_rgba(244,63,94,0.4)] cursor-pointer whitespace-nowrap";

    resetButton();
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const heroForm = document.getElementById("hero-form");
  const ctaForm = document.getElementById("cta-form");

  if (heroForm) heroForm.addEventListener("submit", handleWaitlistSubmit);
  if (ctaForm) ctaForm.addEventListener("submit", handleWaitlistSubmit);
});