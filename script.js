// 1. Анимация свечения за курсором (ТОЛЬКО ДЛЯ УСТРОЙСТВ С МЫШЬЮ)
import "dotenv/config";
const apiKey = process.env.RESEND_API_KEY;

const API_URL = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
  ? "http://localhost:3001" 
  : "https://your-backend-url.onrender.com"; // <-- Сюда вручную вставляется URL задеплоенного бэкенда


const glow = document.getElementById('cursor-glow');
if (glow && window.matchMedia('(pointer: fine)').matches) {
  let isTicking = false;
  window.addEventListener('mousemove', (e) => {
    if (!isTicking) {
      window.requestAnimationFrame(() => {
        glow.style.transform = `translate3d(${e.clientX - 128}px, ${e.clientY - 128}px, 0)`;
        isTicking = false;
      });
      isTicking = true;
    }
  }, { passive: true });
}

// 2. Оптимизированный фоновый эффект звёзд (без создания/удаления элементов в DOM)
function initStars() {
  const isMobile = window.innerWidth < 768;
  const starCount = isMobile ? 10 : 18; // Меньше элементов на мобильных устройствах
  
  const container = document.createElement('div');
  container.className = 'fixed inset-0 pointer-events-none overflow-hidden z-0';
  
  const fragment = document.createDocumentFragment();
  for (let i = 0; i < starCount; i++) {
    const star = document.createElement('div');
    star.className = 'star-effect';
    star.style.left = `${Math.random() * 100}vw`;
    star.style.top = `${Math.random() * 100}vh`;
    star.style.animationDelay = `${Math.random() * 2.5}s`;
    
    const size = Math.floor(Math.random() * 2) + 1;
    star.style.width = `${size}px`;
    star.style.height = `${size}px`;
    
    fragment.appendChild(star);
  }
  
  container.appendChild(fragment);
  document.body.appendChild(container);
}

document.addEventListener("DOMContentLoaded", initStars);

// 3. Локализация и словари
const dict = {
  ru: {
    slogan: "SKILLS MOVE YOU FORWARD",
    nav_roles: "Две роли",
    nav_process: "Как устроен P2P",
    nav_faq: "FAQ",
    btn_start: "НАЧАТЬ ОБМЕН",
    hero_badge: "SKILLS MOVE YOU FORWARD • P2P ПЛАТФОРМА",
    hero_title: 'Делись знаниями&nbsp;— <br class="hidden sm:inline"><span class="text-transparent bg-clip-text bg-gradient-to-r from-white via-[#e0e0ff] to-[#a5a3f0]">получай знания</span>',
    hero_desc: "Первая P2P-платформа, где студенты и старшеклассники помогают друг другу сдавать экзамены, разбираться в коде, дизайне или высшей математике. Без занудства и строгих профессоров.",
    ph_email: "you@email.com",
    btn_waitlist: "JOIN THE WAITLIST",
    roles_title: "Две роли — одна платформа",
    roles_desc: "На SkillOrbit каждый и учит, и учится. Выбирай свой путь или совмещай обе роли.",
    role1_title: "Хочу научиться",
    role1_i1_title: "Объяснение на пальцах:",
    role1_i1_desc: " Сложные темы, высшая математика или код объясняются понятным языком ровесников.",
    role1_i2_title: "Честный рейтинг:",
    role1_i2_desc: " Находи напарника по реальным отзывам и оценкам других студентов.",
    role1_i3_title: "Быстрый буст:",
    role1_i3_desc: " Экстренная подготовка к контрольным, лабораторным и сессии за 1-2 созвона.",
    role2_title: "Хочу делиться знаниями",
    role2_i1_title: "Укрепление материала:",
    role2_i1_desc: " Объясняя тему другим, ты сам усваиваешь материал на 100%.",
    role2_i2_title: "Софт-скиллы:",
    role2_i2_desc: " Прокачивай навыки коммуникации и наставничества для будущей работы.",
    role2_i3_title: "Монетизация:",
    role2_i3_desc: " Зарабатывай на своих знаниях или копи внутренний рейтинг платформы.",
    proc_title: "Как устроен P2P-процесс",
    proc_desc: "4 простых и безопасных шага от вопроса к решению",
    proc_s1_title: "Поиск темы",
    proc_s1_desc: "Вбиваешь нужный предмет или задачу и выбираешь подходящего напарника.",
    proc_s2_title: "Безопасная сделка",
    proc_s2_desc: "Платформа замораживает средства на время сессии, защищая обе стороны.",
    proc_s3_title: "Созвон и практика",
    proc_s3_desc: "Общение во встроенном пространстве с интерактивной доской и код-шерингом.",
    proc_s4_title: "Подтверждение",
    proc_s4_desc: "После успешного занятия ментор получает оплату и балл к рейтингу.",
    faq_title: "Часто задаваемые вопросы",
    faq_desc: "Ответы на главные сомнения перед стартом",
    faq_q1: "Может ли школьник или первокурсник быть ментором?",
    faq_a1: "Да! Если ты сдал предмет на отлично или разобрался в теме лучше других, ты имеешь полное право помогать другим и зарабатывать на своих знаниях.",
    faq_q2: "Что делать, если созвон не состоялся или ментор не помог?",
    faq_a2: "Платформа удерживает средства на безопасном счете до вашего подтверждения. В случае отмены или некачественной сессии деньги возвращаются на ваш баланс.",
    faq_q3: "Как формируется стоимость занятий?",
    faq_a3: "Каждый ментор устанавливает свою ставку за созвон в зависимости от уровня сложности темы и своего внутреннего рейтинга.",
    cta_title: "Займи место в waitlist до официального запуска",
    cta_desc: "Первые зарегистрированные пользователи получат бонусные баллы на бесплатные сессии с менторами.",
    footer_rights: "© 2026. SKILLS MOVE YOU FORWARD",
    footer_l1: "Privacy Policy",
    footer_l2: "Terms of Service",
    footer_l3: "Поддержка"
  },
  en: {
    slogan: "SKILLS MOVE YOU FORWARD",
    nav_roles: "Two roles",
    nav_process: "How P2P works",
    nav_faq: "FAQ",
    btn_start: "START EXCHANGE",
    hero_badge: "SKILLS MOVE YOU FORWARD • P2P PLATFORM",
    hero_title: 'Share knowledge&nbsp;— <br class="hidden sm:inline"><span class="text-transparent bg-clip-text bg-gradient-to-r from-white via-[#e0e0ff] to-[#a5a3f0]">get knowledge</span>',
    hero_desc: "The first P2P platform where students and high schoolers help each other pass exams, understand code, design, or higher math. No boring lectures or strict professors.",
    ph_email: "you@email.com",
    btn_waitlist: "JOIN THE WAITLIST",
    roles_title: "Two roles — one platform",
    roles_desc: "On SkillOrbit, everyone both teaches and learns. Choose your path or combine both roles.",
    role1_title: "I want to learn",
    role1_i1_title: "Simple explanation:",
    role1_i1_desc: " Complex topics, higher math, or code explained in peer language.",
    role1_i2_title: "Honest rating:",
    role1_i2_desc: " Find a partner based on real reviews and ratings from other students.",
    role1_i3_title: "Quick boost:",
    role1_i3_desc: " Emergency prep for tests, labs, and finals in 1-2 sessions.",
    role2_title: "I want to share knowledge",
    role2_i1_title: "Strengthening material:",
    role2_i1_desc: " By explaining to others, you absorb 100% of the material yourself.",
    role2_i2_title: "Soft skills:",
    role2_i2_desc: " Level up communication and mentoring skills for future jobs.",
    role2_i3_title: "Monetization:",
    role2_i3_desc: " Earn from your knowledge or accumulate internal platform ratings.",
    proc_title: "How the P2P process works",
    proc_desc: "4 simple and safe steps from question to solution",
    proc_s1_title: "Search topic",
    proc_s1_desc: "Type in the subject or task and choose a suitable partner.",
    proc_s2_title: "Safe deal",
    proc_s2_desc: "The platform holds funds during the session, protecting both sides.",
    proc_s3_title: "Call and practice",
    proc_s3_desc: "Communication in a built-in workspace with a whiteboard and code-sharing.",
    proc_s4_title: "Confirmation",
    proc_s4_desc: "After a successful session, the mentor receives payment and a rating point.",
    faq_title: "Frequently Asked Questions",
    faq_desc: "Answers to main doubts before starting",
    faq_q1: "Can a school or first-year student be a mentor?",
    faq_a1: "Yes! If you passed the subject perfectly or understand it better than others, you have every right to help others and earn from your knowledge.",
    faq_q2: "What if the call didn't happen or the mentor didn't help?",
    faq_a2: "The platform holds funds in a safe account until your confirmation. If canceled or low quality, money is refunded to your balance.",
    faq_q3: "How is the cost of sessions determined?",
    faq_a3: "Each mentor sets their own rate per call depending on the topic's difficulty and their internal rating.",
    cta_title: "Secure your spot in the waitlist before official launch",
    cta_desc: "First registered users will receive bonus points for free mentor sessions.",
    footer_rights: "© 2026. SKILLS MOVE YOU FORWARD",
    footer_l1: "Privacy Policy",
    footer_l2: "Terms of Service",
    footer_l3: "Support"
  },
  uz: {
    slogan: "SKILLS MOVE YOU FORWARD",
    nav_roles: "Ikki rol",
    nav_process: "P2P qanday ishlaydi",
    nav_faq: "FAQ",
    btn_start: "ALMASHISHNI BOSHLASH",
    hero_badge: "SKILLS MOVE YOU FORWARD • P2P PLATFORMASI",
    hero_title: 'Bilim ulash&nbsp;— <br class="hidden sm:inline"><span class="text-transparent bg-clip-text bg-gradient-to-r from-white via-[#e0e0ff] to-[#a5a3f0]">bilim ol</span>',
    hero_desc: "Talabalar va o'quvchilar bir-biriga imtihonlarni topshirish, kod, dizayn yoki oliy matematikani tushunishga yordam beradigan birinchi P2P platformasi. Zerikarli ma'ruzalar va qattiqqo'l professorlarsiz.",
    ph_email: "siz@email.com",
    btn_waitlist: "KUTISH RO'YXATIGA QO'SHILISH",
    roles_title: "Ikki rol — bitta platforma",
    roles_desc: "SkillOrbit-da hamma o'rgatadi va o'rganadi. O'z yo'lingizni tanlang yoki ikkala rolni birlashtiring.",
    role1_title: "O'rganmoqchiman",
    role1_i1_title: "Oddiy tushuntirish:",
    role1_i1_desc: " Murakkab mavzular, oliy matematika yoki kod tengdoshlar tilida tushuntiriladi.",
    role1_i2_title: "Haqiqiy reyting:",
    role1_i2_desc: " Boshqa talabalarning sharhlari va baholari asosida sherik toping.",
    role1_i3_title: "Tezkor yordam:",
    role1_i3_desc: " Nazorat, laboratoriya va sessiyalarga 1-2 suhbatda shoshilinch tayyorgarlik.",
    role2_title: "Bilim ulashmoqchiman",
    role2_i1_title: "Materialni mustahkamlash:",
    role2_i1_desc: " Mavzuni boshqalarga tushuntirib, o'zingiz uni 100% o'zlashtirasiz.",
    role2_i2_title: "Soft-skillar:",
    role2_i2_desc: " Kelajakdagi ish uchun muloqot va ustozlik ko'nikmalarini oshiring.",
    role2_i3_title: "Monetizatsiya:",
    role2_i3_desc: " O'z bilimlaringizdan pul ishlang yoki ichki reytingini yig'ing.",
    proc_title: "P2P jarayoni qanday ishlaydi",
    proc_desc: "Savoldan yechimgacha 4 ta oddiy va xavfsiz qadam",
    proc_s1_title: "Mavzuni qidirish",
    proc_s1_desc: "Kerakli fan yoki vazifani kiriting va mos sherikni tanlang.",
    proc_s2_title: "Xavfsiz kelishuv",
    proc_s2_desc: "Platforma seans davomida mablag'larni saqlaydi va har ikki tomonni himoya qiladi.",
    proc_s3_title: "Suhbat va amaliyot",
    proc_s3_desc: "Interaktiv doska va kod almashish imkoniyati mavjud ichki muhitda muloqot.",
    proc_s4_title: "Tasdiqlash",
    proc_s4_desc: "Muvaffaqiyatli darsdan so'ng mentor to'lov va reyting baliga ega bo'ladi.",
    faq_title: "Ko'p beriladigan savollar",
    faq_desc: "Boshlashdan oldin asosiy shubhalarga javoblar",
    faq_q1: "Maktab o'quvchisi yoki birinchi kurs talabasi mentor bo'la oladimi?",
    faq_a1: "Ha! Agar fanni a'lo darajada topshirgan bo'lsangiz yoki mavzuni boshqalardan ko'ra yaxshiroq tushunsangiz, yordam berish va pul ishlashga to'liq haqlisiz.",
    faq_q2: "Suhbat amalga oshmasa yoki mentor yordam bermasa nima bo'ladi?",
    faq_a2: "Platforma mablag'larni xavfsiz hisobda saqlaydi. Bekor qilingan yoki sifatsiz seans holatida pul balansingizga qaytariladi.",
    faq_q3: "Darslar narxi qanday belgilanadi?",
    faq_a3: "Har bir mentor mavzuning qiyinligi va o'zining ichki reytingiga qarab o'z stavkasini belgilaydi.",
    cta_title: "Rasmiy ishga tushirishdan oldin ro'yxatdan joy oling",
    cta_desc: "Birinchi ro'yxatdan o'tgan foydalanuvchilar bepul seanslar uchun bonus ballarini oladilar.",
    footer_rights: "© 2026. SKILLS MOVE YOU FORWARD",
    footer_l1: "Maxfiylik siyosati",
    footer_l2: "Xizmat ko'rsatish shartlari",
    footer_l3: "Qo'llab-quvvatlash"
  }
};

function setLang(lang) {
  document.querySelectorAll('.lang-btn').forEach(btn => {
    if(btn.dataset.lang === lang) {
      btn.className = 'lang-btn px-3 py-1.5 bg-accent text-dark-main shadow-[0_0_10px_rgba(61,255,156,0.3)] transition-all font-bold rounded-full cursor-pointer';
    } else {
      btn.className = 'lang-btn px-3 py-1.5 text-[#7f7e9c] hover:text-white transition-all font-medium rounded-full cursor-pointer';
    }
  });

  const textEls = document.querySelectorAll('[data-i18n]');
  const phEls = document.querySelectorAll('[data-i18n-placeholder]');
  
  textEls.forEach(el => el.style.opacity = '0');
  phEls.forEach(el => el.style.opacity = '0');

  setTimeout(() => {
    textEls.forEach(el => {
      const key = el.dataset.i18n;
      if (dict[lang] && dict[lang][key]) el.innerHTML = dict[lang][key];
      el.style.opacity = '1';
    });
    
    phEls.forEach(el => {
      const key = el.dataset.i18nPlaceholder;
      if (dict[lang] && dict[lang][key]) el.placeholder = dict[lang][key];
      el.style.opacity = '1';
    });
  }, 300);
}

// 4. Пауза анимаций элементов вне зоны видимости (IntersectionObserver)
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => en.target.classList.toggle('off', !en.isIntersecting));
  }, { rootMargin: '100px' });
  
  document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll('[data-anim]').forEach((el) => io.observe(el));
  });
}

// 5. Обработка отправки waitlist
document.addEventListener("DOMContentLoaded", () => {
  const API_URL = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
    ? "http://localhost:3001" 
    : "https://your-backend-url.onrender.com";

  const forms = document.querySelectorAll("form");

  forms.forEach((form) => {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const input = form.querySelector("input[type='email']");
      const button = form.querySelector("button[type='submit']");
      
      if (!input || !button) return;

      const email = input.value.trim();
      if (!email) return;

      // Блокируем кнопку
      button.disabled = true;
      const currentLangBtnText = button.textContent;
      button.textContent = "JOINING...";

      let statusDiv = form.querySelector(".form-status");
      if (!statusDiv) {
        statusDiv = document.createElement("div");
        statusDiv.className = "form-status text-xs mt-2 w-full text-left";
        form.appendChild(statusDiv);
      }
      statusDiv.textContent = "";

      try {
        const response = await fetch(`${API_URL}/api/send-receipt`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email })
        });

        const data = await response.json();

        if (!response.ok) {
          statusDiv.className = "form-status text-xs mt-2 w-full text-left text-red-400";
          statusDiv.textContent = data.error || "An error occurred";
          return;
        }

        statusDiv.className = "form-status text-xs mt-2 w-full text-left text-green-400";
        statusDiv.textContent = "You have been successfully added to the waitlist!";
        input.value = "";
      } catch (err) {
        statusDiv.className = "form-status text-xs mt-2 w-full text-left text-red-400";
        statusDiv.textContent = "Could not connect to the server";
      } finally {
        button.disabled = false;
        // Если текст был переведен через data-i18n, он останется актуальным
        button.textContent = currentLangBtnText;
      }
    });
  });
});