import { useState, useEffect } from "react";
import Icon from "@/components/ui/icon";

const HERO_IMAGE = "https://cdn.poehali.dev/projects/515f9a1c-35f2-400b-9e2b-b28d4e3ff206/files/0d563dcb-d975-4f1b-88c6-f205c8824ddc.jpg";

const NAV_LINKS = [
  { id: "home", label: "Главная" },
  { id: "services", label: "Услуги" },
  { id: "about", label: "О нас" },
  { id: "reviews", label: "Отзывы" },
  { id: "contacts", label: "Контакты" },
];

const SERVICES = [
  { icon: "Smartphone", title: "Ремонт смартфонов", desc: "iPhone, Samsung, Xiaomi и другие. Замена экранов, аккумуляторов, разъёмов.", price: "от 800 ₽", time: "1–3 часа" },
  { icon: "Laptop", title: "Ремонт ноутбуков", desc: "Диагностика, чистка, замена матриц, клавиатур, жёстких дисков.", price: "от 1 500 ₽", time: "1–2 дня" },
  { icon: "Tablet", title: "Ремонт планшетов", desc: "Все марки и модели. Замена стекла, разъёма зарядки, кнопок.", price: "от 1 000 ₽", time: "1–3 часа" },
  { icon: "Headphones", title: "Ремонт наушников", desc: "TWS, проводные, накладные. Замена кабелей, корпусов, динамиков.", price: "от 500 ₽", time: "1 час" },
  { icon: "Watch", title: "Смарт-часы", desc: "Apple Watch, Garmin, Samsung Galaxy Watch и другие модели.", price: "от 1 200 ₽", time: "1–3 часа" },
  { icon: "Gamepad2", title: "Игровые приставки", desc: "PS4/5, Xbox, Nintendo Switch. Замена кнопок, ремонт джойстиков.", price: "от 1 500 ₽", time: "1–2 дня" },
];

const STATUSES: Record<string, { label: string; step: number; cls: string; icon: string }> = {
  "received": { label: "Принято в работу", step: 1, cls: "status-received", icon: "PackageCheck" },
  "diagnosing": { label: "Диагностика", step: 2, cls: "status-diagnosing", icon: "Search" },
  "repairing": { label: "В ремонте", step: 3, cls: "status-repairing", icon: "Wrench" },
  "done": { label: "Готово к выдаче", step: 4, cls: "status-done", icon: "CheckCircle" },
};

const MOCK_ORDERS: Record<string, { device: string; status: string; master: string; date: string }> = {
  "TC-1042": { device: "iPhone 14 Pro — замена экрана", status: "repairing", master: "Алексей М.", date: "12.05.2026" },
  "TC-0987": { device: "Samsung Galaxy S23 — аккумулятор", status: "done", master: "Дмитрий К.", date: "10.05.2026" },
  "TC-1101": { device: "MacBook Air — чистка системы охлаждения", status: "diagnosing", master: "Сергей В.", date: "14.05.2026" },
};

const REVIEWS = [
  { name: "Иван Петров", device: "iPhone 13", rating: 5, text: "Сдал телефон с разбитым экраном — через 2 часа уже забрал. Отличная работа, цена справедливая!", date: "08.05.2026" },
  { name: "Мария Соколова", device: "MacBook Pro", rating: 5, text: "Ноутбук перегревался и тормозил. После чистки летает как новый. Очень внимательный персонал!", date: "02.05.2026" },
  { name: "Алексей Смирнов", device: "Samsung Galaxy", rating: 5, text: "Удобно следить за статусом ремонта онлайн — всегда знаешь на каком этапе твой телефон.", date: "25.04.2026" },
  { name: "Елена Кузнецова", device: "iPad Air", rating: 4, text: "Заменили разбитое стекло за 1,5 часа. Чистая работа, никаких следов ремонта не видно.", date: "20.04.2026" },
];

const STATS = [
  { value: "8 000+", label: "Ремонтов выполнено" },
  { value: "97%", label: "Довольных клиентов" },
  { value: "6 лет", label: "На рынке" },
  { value: "1 час", label: "Средний срок ремонта" },
];

export default function Index() {
  const [activeSection, setActiveSection] = useState("home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [orderInput, setOrderInput] = useState("");
  const [orderResult, setOrderResult] = useState<null | { found: boolean; order?: typeof MOCK_ORDERS[string]; id?: string }>(null);
  const [contactForm, setContactForm] = useState({ name: "", phone: "", device: "", comment: "" });
  const [contactSent, setContactSent] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY + 80;
      for (let i = NAV_LINKS.length - 1; i >= 0; i--) {
        const el = document.getElementById(NAV_LINKS[i].id);
        if (el && el.offsetTop <= scrollY) {
          setActiveSection(NAV_LINKS[i].id);
          break;
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMobileMenuOpen(false);
  };

  const checkOrder = () => {
    const id = orderInput.trim().toUpperCase();
    const order = MOCK_ORDERS[id];
    setOrderResult(order ? { found: true, order, id } : { found: false });
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContactSent(true);
  };

  return (
    <div className="min-h-screen gradient-bg grid-pattern font-body text-white">

      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-green-400 flex items-center justify-center">
              <Icon name="Zap" size={16} className="text-black" />
            </div>
            <span className="font-display text-lg font-bold tracking-wider neon-text-blue">ТЕХНО<span className="text-white">СЕРВИС</span></span>
          </div>
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(link => (
              <button key={link.id} onClick={() => scrollTo(link.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeSection === link.id ? "text-cyan-400 bg-cyan-400/10" : "text-white/60 hover:text-white hover:bg-white/5"
                }`}>
                {link.label}
              </button>
            ))}
          </div>
          <a href="tel:+74951234567" className="hidden md:flex items-center gap-2 btn-neon px-4 py-2 rounded-lg text-sm">
            <Icon name="Phone" size={14} />
            +7 (495) 123-45-67
          </a>
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden text-white/70 hover:text-white">
            <Icon name={mobileMenuOpen ? "X" : "Menu"} size={24} />
          </button>
        </div>
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-white/5 px-4 py-3 flex flex-col gap-1">
            {NAV_LINKS.map(link => (
              <button key={link.id} onClick={() => scrollTo(link.id)}
                className="text-left px-4 py-2 rounded-lg text-sm text-white/70 hover:text-white hover:bg-white/5 transition-all">
                {link.label}
              </button>
            ))}
            <a href="tel:+74951234567" className="mt-2 btn-neon px-4 py-2 rounded-lg text-sm text-center">
              +7 (495) 123-45-67
            </a>
          </div>
        )}
      </nav>

      {/* HERO */}
      <section id="home" className="pt-16 min-h-screen flex items-center relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={HERO_IMAGE} alt="Сервисный центр" className="w-full h-full object-cover opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0d12] via-[#0a0d12]/80 to-transparent" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-20 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-400/10 border border-cyan-400/20 text-cyan-400 text-xs font-semibold uppercase tracking-widest mb-6">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse-slow" />
              Работаем сегодня до 21:00
            </div>
            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight mb-6">
              РЕМОНТ<br />
              <span className="neon-text-blue">ЭЛЕКТРО</span><br />
              <span className="text-white/20">НИКИ</span>
            </h1>
            <p className="text-white/60 text-lg mb-8 leading-relaxed max-w-md">
              Профессиональный ремонт смартфонов, ноутбуков и гаджетов. Следите за статусом ремонта онлайн в реальном времени.
            </p>
            <div className="flex flex-wrap gap-3">
              <button onClick={() => scrollTo("contacts")} className="btn-neon px-6 py-3 rounded-xl font-semibold text-sm">
                Оставить заявку
              </button>
              <button onClick={() => scrollTo("services")} className="btn-outline-neon px-6 py-3 rounded-xl text-sm">
                Наши услуги
              </button>
            </div>
          </div>

          {/* Order tracking widget */}
          <div className="glass-card rounded-2xl p-6 neon-border">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-cyan-400/10 flex items-center justify-center">
                <Icon name="Search" size={20} className="text-cyan-400" />
              </div>
              <div>
                <h3 className="font-semibold text-white">Отследить ремонт</h3>
                <p className="text-white/40 text-xs">Введите номер заказа</p>
              </div>
            </div>
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                placeholder="Например: TC-1042"
                value={orderInput}
                onChange={e => { setOrderInput(e.target.value); setOrderResult(null); }}
                onKeyDown={e => e.key === "Enter" && checkOrder()}
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/25 focus:outline-none focus:border-cyan-400/50 transition-all"
              />
              <button onClick={checkOrder} className="btn-neon px-4 py-2.5 rounded-xl">
                <Icon name="Search" size={16} />
              </button>
            </div>

            {orderResult === null && (
              <div className="text-white/30 text-xs text-center py-3">Попробуйте: TC-1042 / TC-0987 / TC-1101</div>
            )}
            {orderResult?.found === false && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-red-400 text-sm text-center">
                Заказ не найден. Проверьте номер.
              </div>
            )}
            {orderResult?.found && orderResult.order && (
              <div className="space-y-3">
                <div className="bg-white/3 rounded-xl p-4 border border-white/8">
                  <p className="text-white font-medium text-sm mb-1">{orderResult.order.device}</p>
                  <p className="text-white/40 text-xs">Мастер: {orderResult.order.master} · {orderResult.order.date}</p>
                </div>
                <span className={`status-badge ${STATUSES[orderResult.order.status].cls}`}>
                  <Icon name={STATUSES[orderResult.order.status].icon} size={12} />
                  {STATUSES[orderResult.order.status].label}
                </span>
                <div className="flex gap-1">
                  {[1, 2, 3, 4].map(step => (
                    <div key={step} className={`flex-1 h-1.5 rounded-full transition-all ${
                      step <= STATUSES[orderResult.order!.status].step ? "bg-cyan-400" : "bg-white/10"
                    }`} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="py-12 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-2 md:grid-cols-4 gap-6">
          {STATS.map((s, i) => (
            <div key={i} className="text-center">
              <div className="font-display text-3xl sm:text-4xl font-bold neon-text-blue mb-1">{s.value}</div>
              <div className="text-white/40 text-sm">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <p className="text-cyan-400 text-xs font-semibold uppercase tracking-widest mb-3">Что мы чиним</p>
            <h2 className="font-display text-4xl sm:text-5xl font-bold">НАШИ УСЛУГИ</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {SERVICES.map((s, i) => (
              <div key={i} className="glass-card rounded-2xl p-6 group hover:neon-border transition-all duration-300 border border-white/5 hover:border-cyan-400/20">
                <div className="w-12 h-12 rounded-xl bg-cyan-400/10 flex items-center justify-center mb-4 group-hover:bg-cyan-400/20 transition-all">
                  <Icon name={s.icon} size={22} className="text-cyan-400" />
                </div>
                <h3 className="font-semibold text-white text-lg mb-2">{s.title}</h3>
                <p className="text-white/45 text-sm leading-relaxed mb-4">{s.desc}</p>
                <div className="flex items-center justify-between pt-3 border-t border-white/8">
                  <span className="neon-text-green text-sm font-semibold">{s.price}</span>
                  <span className="flex items-center gap-1 text-white/35 text-xs">
                    <Icon name="Clock" size={12} />
                    {s.time}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="py-20 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid md:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-cyan-400 text-xs font-semibold uppercase tracking-widest mb-3">Наша история</p>
            <h2 className="font-display text-4xl sm:text-5xl font-bold mb-6">О НАС</h2>
            <p className="text-white/55 leading-relaxed mb-5">
              Мы работаем с 2018 года и за это время выполнили более 8 000 ремонтов. Наша команда — это сертифицированные специалисты с опытом работы на официальных сервисных станциях.
            </p>
            <p className="text-white/55 leading-relaxed mb-8">
              Используем только оригинальные запчасти или аналоги высокого качества. На все виды ремонта даём гарантию до 12 месяцев.
            </p>
            <div className="space-y-3">
              {[
                { icon: "ShieldCheck", text: "Гарантия на все виды ремонта до 12 месяцев" },
                { icon: "Zap", text: "Экспресс-ремонт — от 1 часа" },
                { icon: "BadgeCheck", text: "Сертифицированные мастера" },
                { icon: "RefreshCw", text: "Онлайн-отслеживание статуса ремонта" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-green-400/10 flex items-center justify-center flex-shrink-0">
                    <Icon name={item.icon} size={16} className="text-green-400" />
                  </div>
                  <span className="text-white/70 text-sm">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: "Users", label: "Опытная команда", val: "12 мастеров" },
              { icon: "MapPin", label: "Удобное расположение", val: "Центр города" },
              { icon: "Star", label: "Рейтинг", val: "4.9 / 5.0" },
              { icon: "Clock", label: "Режим работы", val: "9:00 – 21:00" },
            ].map((card, i) => (
              <div key={i} className="glass-card rounded-2xl p-5 border border-white/5 scan-line">
                <Icon name={card.icon} size={24} className="text-cyan-400 mb-3" />
                <div className="font-semibold text-white text-lg mb-0.5">{card.val}</div>
                <div className="text-white/40 text-xs">{card.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      <section id="reviews" className="py-20 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <p className="text-cyan-400 text-xs font-semibold uppercase tracking-widest mb-3">Что говорят клиенты</p>
            <h2 className="font-display text-4xl sm:text-5xl font-bold">ОТЗЫВЫ</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {REVIEWS.map((r, i) => (
              <div key={i} className="glass-card rounded-2xl p-5 border border-white/5 hover:border-white/10 transition-all">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(r.rating)].map((_, j) => (
                    <Icon key={j} name="Star" size={14} className="text-yellow-400" />
                  ))}
                </div>
                <p className="text-white/65 text-sm leading-relaxed mb-5">"{r.text}"</p>
                <div className="pt-3 border-t border-white/8">
                  <div className="font-medium text-white text-sm">{r.name}</div>
                  <div className="flex items-center justify-between mt-0.5">
                    <span className="text-white/35 text-xs">{r.device}</span>
                    <span className="text-white/25 text-xs">{r.date}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACTS */}
      <section id="contacts" className="py-20 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <p className="text-cyan-400 text-xs font-semibold uppercase tracking-widest mb-3">Свяжитесь с нами</p>
            <h2 className="font-display text-4xl sm:text-5xl font-bold">КОНТАКТЫ</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-10">
            <div className="space-y-5">
              {[
                { icon: "Phone", label: "Телефон", value: "+7 (495) 123-45-67", link: "tel:+74951234567" },
                { icon: "MessageCircle", label: "WhatsApp / Telegram", value: "@technoservice_msk", link: "#" },
                { icon: "Mail", label: "Email", value: "info@technoservice.ru", link: "mailto:info@technoservice.ru" },
                { icon: "MapPin", label: "Адрес", value: "Москва, ул. Тверская, 12", link: "#" },
                { icon: "Clock", label: "Режим работы", value: "Пн–Вс: 9:00 – 21:00", link: null },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-cyan-400/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Icon name={item.icon} size={18} className="text-cyan-400" />
                  </div>
                  <div>
                    <div className="text-white/35 text-xs mb-0.5">{item.label}</div>
                    {item.link ? (
                      <a href={item.link} className="text-white font-medium hover:text-cyan-400 transition-colors">{item.value}</a>
                    ) : (
                      <span className="text-white font-medium">{item.value}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="glass-card rounded-2xl p-6 neon-border">
              {contactSent ? (
                <div className="h-full flex flex-col items-center justify-center py-8 text-center">
                  <div className="w-16 h-16 rounded-full bg-green-400/15 flex items-center justify-center mb-4">
                    <Icon name="CheckCircle" size={32} className="text-green-400" />
                  </div>
                  <h3 className="font-semibold text-white text-lg mb-2">Заявка отправлена!</h3>
                  <p className="text-white/45 text-sm">Мы перезвоним вам в течение 15 минут</p>
                  <button onClick={() => { setContactSent(false); setContactForm({ name: "", phone: "", device: "", comment: "" }); }}
                    className="mt-6 btn-outline-neon px-5 py-2 rounded-xl text-sm">
                    Отправить ещё
                  </button>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <h3 className="font-semibold text-white text-lg mb-5">Оставить заявку</h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-white/40 text-xs mb-1.5 block">Ваше имя</label>
                      <input required value={contactForm.name} onChange={e => setContactForm(p => ({ ...p, name: e.target.value }))}
                        placeholder="Иван"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-cyan-400/50 transition-all" />
                    </div>
                    <div>
                      <label className="text-white/40 text-xs mb-1.5 block">Телефон</label>
                      <input required value={contactForm.phone} onChange={e => setContactForm(p => ({ ...p, phone: e.target.value }))}
                        placeholder="+7 (___) ___-__-__"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-cyan-400/50 transition-all" />
                    </div>
                  </div>
                  <div>
                    <label className="text-white/40 text-xs mb-1.5 block">Устройство</label>
                    <input value={contactForm.device} onChange={e => setContactForm(p => ({ ...p, device: e.target.value }))}
                      placeholder="Например: iPhone 13, Samsung Galaxy S22"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-cyan-400/50 transition-all" />
                  </div>
                  <div>
                    <label className="text-white/40 text-xs mb-1.5 block">Опишите проблему</label>
                    <textarea value={contactForm.comment} onChange={e => setContactForm(p => ({ ...p, comment: e.target.value }))}
                      rows={3} placeholder="Разбит экран, не заряжается..."
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-cyan-400/50 transition-all resize-none" />
                  </div>
                  <button type="submit" className="w-full btn-neon py-3 rounded-xl font-semibold text-sm">
                    Отправить заявку
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/5 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-gradient-to-br from-cyan-400 to-green-400 flex items-center justify-center">
              <Icon name="Zap" size={12} className="text-black" />
            </div>
            <span className="font-display text-sm font-bold tracking-wider text-white/60">ТЕХНОСЕРВИС</span>
          </div>
          <p className="text-white/25 text-xs">© 2026 ТехноСервис. Все права защищены.</p>
          <div className="flex gap-4">
            {[
              { icon: "Phone", link: "tel:+74951234567" },
              { icon: "MessageCircle", link: "#" },
              { icon: "Mail", link: "mailto:info@technoservice.ru" },
            ].map((item, i) => (
              <a key={i} href={item.link} className="text-white/30 hover:text-cyan-400 transition-colors">
                <Icon name={item.icon} size={18} />
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
