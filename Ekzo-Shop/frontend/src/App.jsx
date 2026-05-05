import React, { useState, useEffect } from 'react';
import { AlertCircle, Leaf, LogIn, LogOut, X, ShoppingCart } from 'lucide-react';

const API_BASE = 'http://localhost:8000/api';
const BACKEND_URL = 'http://localhost:8000';

export default function App() {
  const [isAuth, setIsAuth] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isRegister, setIsRegister] = useState(true);
  const [user, setUser] = useState({ name: "Гость", balance: 0 });
  const [herbs, setHerbs] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Инициализация при загрузке страницы
  useEffect(() => {
    const initApp = async () => {
      const token = localStorage.getItem('access_token');
      if (token) {
        await fetchProfile(token);
      }
      await fetchItems();
      setLoading(false);
    };
    initApp();
  }, []);

  // 2. Получение списка товаров
  const fetchItems = async () => {
    try {
      const res = await fetch(`${API_BASE}/items/`);
      if (res.ok) {
        const data = await res.json();
        setHerbs(data);
      }
    } catch (err) {
      console.error("Ошибка загрузки товаров:", err);
    }
  };

  // 3. Получение данных профиля (проверка авторизации)
  const fetchProfile = async (token) => {
    try {
      const res = await fetch(`${API_BASE}/profile/me/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (res.ok) {
        const userData = await res.json();
        setUser(userData);
        setIsAuth(true);
      } else {
        handleLogout(); // Токен невалиден
      }
    } catch (err) {
      handleLogout();
    }
  };

  // 4. Авторизация (Вход / Регистрация)
  const handleAuth = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);

    if (isRegister && data.password !== data.conf_password) {
      return alert("Пароли не совпадают!");
    }

    const url = isRegister ? `${API_BASE}/register/` : `${API_BASE}/login/`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (response.ok) {
        if (isRegister) {
          alert("Регистрация успешна! Теперь войдите.");
          setIsRegister(false);
        } else {
          if (result.access) {
            localStorage.setItem('access_token', result.access);
            await fetchProfile(result.access);
            setShowAuthModal(false);
          }
        }
      } else {
        alert("Ошибка: " + JSON.stringify(result));
      }
    } catch (err) {
      alert("Сервер бэкенда недоступен.");
    }
  };

  // 5. Выход
  const handleLogout = () => {
    localStorage.removeItem('access_token');
    setIsAuth(false);
    setUser({ name: "Гость", balance: 0 });
  };

  // 6. Покупка товара
  const handleBuy = async (herb) => {
    if (!isAuth) return setShowAuthModal(true);

    const token = localStorage.getItem('access_token');
    try {
      const response = await fetch(`${API_BASE}/profile/buy/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ item_id: herb.id })
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.message);
        // Обновляем баланс в UI
        setUser(prev => ({ ...prev, balance: data.new_balance }));
      } else {
        alert(data.detail || "Ошибка при покупке");
      }
    } catch (err) {
      alert("Ошибка сети");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* HEADER */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 text-emerald-800 font-black text-xl uppercase tracking-tighter cursor-pointer">
            <Leaf fill="currentColor" size={24} /> <span>Лавка Трав</span>
          </div>

          <div className="flex items-center gap-4">
            {isAuth ? (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3 bg-slate-100 p-1 pr-4 rounded-full border border-slate-200">
                  <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center text-white text-xs font-bold uppercase">
                    {user.name ? user.name[0] : 'U'}
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-slate-400 uppercase leading-none">{user.name}</p>
                    <p className="text-sm font-black text-emerald-700">{user.balance} ₽</p>
                  </div>
                </div>
                <button onClick={handleLogout} className="p-2 text-slate-400 hover:text-red-500 transition-colors">
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <button onClick={() => setShowAuthModal(true)} className="bg-emerald-600 text-white px-5 py-2 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-emerald-700 transition-all">
                <LogIn size={18} /> Войти
              </button>
            )}
          </div>
        </div>
      </header>

      {/* MAIN */}
      <main className="max-w-6xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-black mb-10 tracking-tight">Натуральные сборы</h1>

        {loading ? (
          <div className="text-center py-20 text-slate-400 font-bold">Загрузка товаров...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {herbs.length > 0 ? herbs.map(h => (
              <div key={h.id} className="bg-white p-6 rounded-[32px] border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                <div>
                  <div className="h-48 bg-slate-50 rounded-2xl mb-4 overflow-hidden flex items-center justify-center">
                    {h.image ? (
                      <img
                        src={h.image.startsWith('http') ? h.image : `${BACKEND_URL}${h.image}`}
                        className="w-full h-full object-cover"
                        alt={h.name}
                      />
                    ) : (
                      <span className="text-slate-300 font-bold uppercase text-[10px]">Нет фото</span>
                    )}
                  </div>
                  <h3 className="text-xl font-bold mb-2">{h.name}</h3>
                  <p className="text-slate-500 text-sm mb-4 leading-relaxed">{h.description}</p>
                  <div className="bg-red-50 p-4 rounded-2xl border border-red-100 mb-6">
                    <p className="text-red-700 text-[10px] font-black uppercase mb-1 flex items-center gap-1">
                      <AlertCircle size={14} /> Противопоказания
                    </p>
                    <p className="text-red-600 text-xs font-medium leading-tight">{h.contraindications}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Цена</span>
                    <span className="text-2xl font-black">{h.price} ₽</span>
                  </div>
                  <button onClick={() => handleBuy(h)} className="bg-slate-900 hover:bg-emerald-600 text-white px-6 py-3 rounded-2xl font-bold text-sm transition-all active:scale-95 flex items-center gap-2">
                    <ShoppingCart size={18} /> Купить
                  </button>
                </div>
              </div>
            )) : (
              <p className="text-slate-400 font-bold col-span-3 text-center py-20">В лавке пока пусто...</p>
            )}
          </div>
        )}
      </main>

      {/* MODAL */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[40px] w-full max-w-md p-10 relative shadow-2xl">
            <button onClick={() => setShowAuthModal(false)} className="absolute top-6 right-6 text-slate-300 hover:text-slate-900"><X size={28} /></button>
            <h2 className="text-3xl font-black mb-2">{isRegister ? "Создать аккаунт" : "С возвращением"}</h2>
            <form onSubmit={handleAuth} className="space-y-4 mt-8">
              {isRegister && (
                <>
                  <input name="name" required className="w-full bg-slate-50 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-emerald-500" placeholder="Ваше имя" />
                  <input name="phone" required className="w-full bg-slate-50 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-emerald-500" placeholder="Телефон" />
                </>
              )}
              <input name="email" type="email" required className="w-full bg-slate-50 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-emerald-500" placeholder="Email" />
              <input name="password" type="password" required className="w-full bg-slate-50 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-emerald-500" placeholder="Пароль" />
              {isRegister && <input name="conf_password" type="password" required className="w-full bg-slate-50 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-emerald-500" placeholder="Повторите пароль" />}
              <button type="submit" className="w-full bg-emerald-600 text-white font-black py-5 rounded-3xl mt-4 hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100">
                {isRegister ? "Зарегистрироваться" : "Войти"}
              </button>
            </form>
            <button onClick={() => setIsRegister(!isRegister)} className="w-full mt-6 text-sm font-bold text-slate-400 hover:text-emerald-600 transition-colors">
              {isRegister ? "Уже есть аккаунт? Войти" : "Нет аккаунта? Регистрация"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
