// ----- Элементы DOM -----
const startBtn = document.getElementById('startMatchingBtn');
const matchSection = document.getElementById('matchSection');
const fetchMatchBtn = document.getElementById('fetchMatchBtn');
const matchResult = document.getElementById('matchResult');
const matchName = document.getElementById('matchName');
const matchAge = document.getElementById('matchAge');
const matchBio = document.getElementById('matchBio');
const loadingIndicator = document.getElementById('loadingIndicator');
const newSearchBtn = document.getElementById('newSearchBtn');

const registerDialog = document.getElementById('registerDialog');
const loginDialog = document.getElementById('loginDialog');
const showRegisterBtn = document.getElementById('showRegisterBtn');
const showLoginBtn = document.getElementById('showLoginBtn');
const registerForm = document.getElementById('registerForm');
const loginForm = document.getElementById('loginForm');

// ----- Инициализация Pico (скрытие модалок) -----
document.querySelectorAll('[data-close]').forEach(btn => {
  btn.addEventListener('click', () => {
    btn.closest('dialog').close();
  });
});

// ----- Управление модалками -----
showRegisterBtn.addEventListener('click', (e) => {
  e.preventDefault();
  registerDialog.showModal();
});

showLoginBtn.addEventListener('click', (e) => {
  e.preventDefault();
  loginDialog.showModal();
});

// ----- Обработка форм (демо) -----
registerForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = document.getElementById('regName').value;
  alert(`🎉 ${name}, ты зарегистрирован(а)! Теперь можешь искать мэтч.`);
  registerDialog.close();
  // Можно сохранить в localStorage
});

loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  alert('🔓 Демо-вход выполнен!');
  loginDialog.close();
});

// ----- Показать секцию поиска -----
startBtn.addEventListener('click', () => {
  matchSection.style.display = 'block';
  matchSection.scrollIntoView({ behavior: 'smooth' });
});

// ----- Fetch: получение мэтча (усложнённая версия) -----
async function fetchMatch() {
  const cuisine = document.getElementById('cuisineSelect').value;
  const intent = document.getElementById('intentSelect').value;
  
  // Показываем индикатор загрузки
  loadingIndicator.style.display = 'block';
  matchResult.style.display = 'none';
  fetchMatchBtn.setAttribute('aria-busy', 'true');
  fetchMatchBtn.disabled = true;

  try {
    // 1. Получаем случайного пользователя с RandomUser API
    const userResponse = await fetch('https://randomuser.me/api/');
    if (!userResponse.ok) throw new Error('Ошибка сети');
    const userData = await userResponse.json();
    const user = userData.results[0];
    
    // 2. Получаем "пост" с кулинарной темой с JSONPlaceholder (для био)
    const postsResponse = await fetch('https://jsonplaceholder.typicode.com/posts/1');
    const postData = await postsResponse.json();
    
    // Формируем данные
    const firstName = user.name.first;
    const lastName = user.name.last;
    const age = user.dob.age;
    const city = user.location.city;
    const country = user.location.country;
    
    // Био: комбинируем выбранную кухню + случайный пост (обрезаем)
    const shortBio = `Любит ${cuisine} кухню. "${postData.body.slice(0, 60)}..." · ${city}, ${country}`;
    
    // Отображаем результат
    matchName.textContent = `${firstName} ${lastName}`;
    matchAge.textContent = `${age} лет`;
    matchBio.textContent = shortBio;
    
    matchResult.style.display = 'block';
  } catch (error) {
    console.error('Ошибка при получении мэтча:', error);
    // Запасной вариант (хардкод, чтобы не ломать UI)
    matchName.textContent = 'Анна С.';
    matchAge.textContent = '34 года';
    matchBio.textContent = 'Обожает готовить пасту и пробовать новое. Живёт в Москве.';
    matchResult.style.display = 'block';
  } finally {
    loadingIndicator.style.display = 'none';
    fetchMatchBtn.setAttribute('aria-busy', 'false');
    fetchMatchBtn.disabled = false;
  }
}

fetchMatchBtn.addEventListener('click', fetchMatch);

// Кнопка "Попробовать ещё"
newSearchBtn.addEventListener('click', () => {
  matchResult.style.display = 'none';
  // Можно сбросить селекты, но необязательно
});

// ----- Дополнительный вайб: кнопка "Начать" из хедера (если есть id=startBtn) -----
const headerStartBtn = document.getElementById('startBtn');
if (headerStartBtn) {
  headerStartBtn.addEventListener('click', () => {
    matchSection.style.display = 'block';
    matchSection.scrollIntoView({ behavior: 'smooth' });
  });
}
