import React, { useState, useEffect } from 'react';
import { ShoppingCart, AlertCircle, Leaf, User as UserIcon, LogIn, X, Lock, Mail, ShieldCheck } from 'lucide-react';

export default function App() {
  const [isAuth, setIsAuth] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isRegister, setIsRegister] = useState(true);
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user_data');
    return saved ? JSON.parse(saved) : { name: "Гость", balance: 0 };
  });

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) setIsAuth(true);
  }, []);

  const herbs = [
    { id: 1, name: "Шалфей лекарственный", price: 350, description: "Сбор 2024 года. Помогает при кашле.", contraindications: "Беременность, кормление, гипертония." },
    { id: 2, name: "Мята перечная", price: 150, description: "Успокаивает нервную систему и улучшает сон.", contraindications: "Низкое давление, детский возраст до 3 лет." },
    { id: 3, name: "Зверобой", price: 220, description: "Природный антисептик и антидепрессант.", contraindications: "Повышенная светочувствительность, прием антибиотиков." }
  ];

  const handleAuth = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    if (isRegister && data.password !== data.re_password) return alert("Пароли не совпадают!");
    
    const mockUser = { name: data.name || "User", email: data.email, balance: 1000 };
    localStorage.setItem('access_token', 'fake-jwt-token');
    localStorage.setItem('user_data', JSON.stringify(mockUser));
    setUser(mockUser);
    setIsAuth(true);
    setShowAuthModal(false);
  };

  const handleBuy = (herb) => {
    if (!isAuth) return setShowAuthModal(true);
    if (user.balance < herb.price) return alert("Недостаточно средств!");
    const updatedUser = { ...user, balance: user.balance - herb.price };
    setUser(updatedUser);
    localStorage.setItem('user_data', JSON.stringify(updatedUser));
    alert(`${herb.name} успешно куплен!`);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 text-emerald-800 font-black text-xl uppercase tracking-tighter">
            <Leaf fill="currentColor" size={24} /> <span>Лавка Трав</span>
          </div>
          <div className="flex items-center gap-4">
            {isAuth ? (
              <div className="flex items-center gap-3 bg-slate-100 p-1 pr-4 rounded-full border border-slate-200">
                <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center text-white text-[10px] font-bold">{user.name[0]}</div>
                <div className="text-right">
                  <p className="text-[10px] font-bold text-slate-400 uppercase leading-none">{user.name}</p>
                  <p className="text-sm font-black text-emerald-700">{user.balance} ₽</p>
                </div>
              </div>
            ) : (
              <button onClick={() => setShowAuthModal(true)} className="bg-emerald-600 text-white px-5 py-2 rounded-xl font-bold text-sm shadow-lg shadow-emerald-100 flex items-center gap-2">
                <LogIn size={18} /> Войти
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-black mb-10 tracking-tight">Натуральные сборы</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {herbs.map(h => (
            <div key={h.id} className="bg-white p-6 rounded-[32px] border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="h-40 bg-slate-50 rounded-2xl mb-4 flex items-center justify-center text-slate-300 font-bold uppercase text-xs">Фото товара</div>
                <h3 className="text-xl font-bold mb-2">{h.name}</h3>
                <p className="text-slate-500 text-sm mb-4 leading-relaxed">{h.description}</p>
                <div className="bg-red-50 p-4 rounded-2xl border border-red-100 mb-6">
                  <p className="text-red-700 text-[10px] font-black uppercase mb-1 flex items-center gap-1">
                    <AlertCircle size={14}/> Противопоказания
                  </p>
                  <p className="text-red-600 text-xs font-medium leading-tight">{h.contraindications}</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-black">{h.price} ₽</span>
                <button onClick={() => handleBuy(h)} className="bg-slate-900 hover:bg-emerald-600 text-white px-6 py-3 rounded-2xl font-bold text-sm transition-all active:scale-95">Купить</button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {showAuthModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[40px] w-full max-w-md p-10 relative shadow-2xl">
            <button onClick={() => setShowAuthModal(false)} className="absolute top-6 right-6 text-slate-300 hover:text-slate-900"><X size={28} /></button>
            <h2 className="text-3xl font-black mb-2">{isRegister ? "Создать аккаунт" : "С возвращением"}</h2>
            <form onSubmit={handleAuth} className="space-y-4 mt-8">
              {isRegister && <input name="name" required className="w-full bg-slate-50 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="Ваше имя" />}
              <input name="email" type="email" required className="w-full bg-slate-50 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="Email" />
              <input name="password" type="password" required className="w-full bg-slate-50 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="Пароль" />
              {isRegister && <input name="re_password" type="password" required className="w-full bg-slate-50 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="Повторите пароль" />}
              <button type="submit" className="w-full bg-emerald-600 text-white font-black py-5 rounded-3xl hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-100 mt-4">
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
