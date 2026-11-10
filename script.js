async function handleWaitlistSubmit(event) {
  event.preventDefault();
  
  const form = event.target;
  const emailInput = form.querySelector('input[type="email"]');
  const submitBtn = form.querySelector('button[type="submit"]');
  const email = emailInput ? emailInput.value.trim() : "";

  if (!email) return;

  // Сохраняем исходные стили и текст кнопки
  const originalText = submitBtn.innerText;
  const originalClasses = submitBtn.className;

  // Состояние: Отправка
  submitBtn.disabled = true;
  submitBtn.innerText = "SENDING...";
  submitBtn.style.opacity = "0.7";

  try {
    const response = await fetch("/api/send-receipt", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email })
    });

    const data = await response.json();

    if (response.ok) {
      // Состояние: Успех
      submitBtn.innerText = "ADDED! ✨";
      submitBtn.style.opacity = "1";
      submitBtn.className = "w-full sm:w-auto bg-[#3DFF9C] text-dark-main font-extrabold text-xs uppercase tracking-wider px-6 py-3.5 rounded-xl transition-all duration-300 shadow-[0_0_20px_rgba(61,255,156,0.6)] cursor-default";
      
      form.reset();

      // Через 3 секунды возвращаем кнопку в исходное состояние
      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerText = originalText;
        submitBtn.className = originalClasses;
        submitBtn.style.opacity = "1";
      }, 3000);

    } else {
      throw new Error(data.error || "Something went wrong");
    }
  } catch (err) {
    console.error("Submit error:", err);
    
    // Состояние: Ошибка
    submitBtn.innerText = "TRY AGAIN";
    submitBtn.style.opacity = "1";
    submitBtn.className = "w-full sm:w-auto bg-rose-500 text-white font-extrabold text-xs uppercase tracking-wider px-6 py-3.5 rounded-xl transition-all duration-300 shadow-[0_0_15px_rgba(244,63,94,0.4)] cursor-pointer";

    // Через 3 секунды даём попробовать снова
    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.innerText = originalText;
      submitBtn.className = originalClasses;
      submitBtn.style.opacity = "1";
    }, 3000);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const heroForm = document.getElementById("hero-form");
  const ctaForm = document.getElementById("cta-form");

  if (heroForm) heroForm.addEventListener("submit", handleWaitlistSubmit);
  if (ctaForm) ctaForm.addEventListener("submit", handleWaitlistSubmit);
});