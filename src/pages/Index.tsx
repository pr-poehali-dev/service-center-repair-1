import { useState, useEffect } from "react";
import Icon from "@/components/ui/icon";

const API = {
  applications: "https://functions.poehali.dev/0fb80a10-6aa5-44cc-a5dc-06e8681319f0",
  orders: "https://functions.poehali.dev/37b0c3fa-790a-4f92-a8b7-81cb24b39951",
};

const HERO_IMAGE = "https://cdn.poehali.dev/projects/515f9a1c-35f2-400b-9e2b-b28d4e3ff206/files/0d563dcb-d975-4f1b-88c6-f205c8824ddc.jpg";
const IMG_REPAIR = "https://cdn.poehali.dev/projects/515f9a1c-35f2-400b-9e2b-b28d4e3ff206/files/2478fb63-bc3a-43a4-8041-d59db6cb3c71.jpg";
const IMG_APPLIANCE = "https://cdn.poehali.dev/projects/515f9a1c-35f2-400b-9e2b-b28d4e3ff206/files/353a5cf7-3e78-4075-8dd1-87b0acf8d813.jpg";
const IMG_RECEPTION = "https://cdn.poehali.dev/projects/515f9a1c-35f2-400b-9e2b-b28d4e3ff206/files/b5f184d3-ceff-4241-8682-8433255b1b65.jpg";

const NAV_LINKS = [
  { id: "home", label: "Главная" },
  { id: "services", label: "Услуги" },
  { id: "about", label: "О нас" },
  { id: "reviews", label: "Отзывы" },
  { id: "contacts", label: "Контакты" },
];

const SERVICE_CATEGORIES = [
  {
    category: "Электроника и гаджеты",
    items: [
      { icon: "Smartphone", title: "Ремонт смартфонов", desc: "iPhone, Samsung, Xiaomi и другие. Замена экранов, аккумуляторов, разъёмов.", price: "от 800 ₽", time: "1–3 часа" },
      { icon: "Laptop", title: "Ремонт ноутбуков", desc: "Диагностика, чистка, замена матриц, клавиатур, жёстких дисков.", price: "от 1 500 ₽", time: "1–2 дня" },
      { icon: "Tablet", title: "Ремонт планшетов", desc: "Все марки и модели. Замена стекла, разъёма зарядки, кнопок.", price: "от 1 000 ₽", time: "1–3 часа" },
      { icon: "Headphones", title: "Ремонт наушников", desc: "TWS, проводные, накладные. Замена кабелей, корпусов, динамиков.", price: "от 500 ₽", time: "1 час" },
      { icon: "Watch", title: "Смарт-часы", desc: "Apple Watch, Garmin, Samsung Galaxy Watch и другие модели.", price: "от 1 200 ₽", time: "1–3 часа" },
      { icon: "Gamepad2", title: "Игровые приставки", desc: "PS4/5, Xbox, Nintendo Switch. Замена кнопок, ремонт джойстиков.", price: "от 1 500 ₽", time: "1–2 дня" },
    ],
  },
  {
    category: "Бытовая техника",
    items: [
      { icon: "WashingMachine", title: "Стиральные машины", desc: "Замена подшипников, насосов, ТЭНов. Все марки: Bosch, Samsung, LG и другие.", price: "от 1 500 ₽", time: "1–2 дня" },
      { icon: "Refrigerator", title: "Холодильники", desc: "Заправка фреоном, замена компрессора, ремонт термостата.", price: "от 2 000 ₽", time: "1–3 дня" },
      { icon: "Microwave", title: "Микроволновые печи", desc: "Замена магнетрона, трансформатора, дверцы. Устранение искрения.", price: "от 800 ₽", time: "1–2 часа" },
      { icon: "Wind", title: "Кондиционеры", desc: "Чистка, заправка, замена плат управления и компрессоров.", price: "от 2 500 ₽", time: "1–2 дня" },
      { icon: "Flame", title: "Кухонные плиты", desc: "Ремонт газовых и электрических плит, духовок, варочных поверхностей.", price: "от 1 000 ₽", time: "1–2 дня" },
      { icon: "Zap", title: "Мелкая бытовая техника", desc: "Утюги, пылесосы, кофемашины, блендеры и другие приборы.", price: "от 500 ₽", time: "1–3 часа" },
    ],
  },
];

const SERVICES = SERVICE_CATEGORIES.flatMap(c => c.items);

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
  const [activeCategory, setActiveCategory] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [orderInput, setOrderInput] = useState("");
  const [orderResult, setOrderResult] = useState<null | { found: boolean; order?: typeof MOCK_ORDERS[string]; id?: string }>(null);
  const [contactForm, setContactForm] = useState({ name: "", phone: "", device: "", comment: "" });
  const [contactSent, setContactSent] = useState(false);
  const [contactLoading, setContactLoading] = useState(false);
  const [orderLoading, setOrderLoading] = useState(false);

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

  const checkOrder = async () => {
    const id = orderInput.trim().toUpperCase();
    setOrderLoading(true);
    try {
      const res = await fetch(`${API.orders}?number=${id}`);
      if (res.status === 404) {
        setOrderResult({ found: false });
      } else {
        const data = await res.json();
        setOrderResult({ found: true, order: { device: data.device, status: data.status, master: data.master || '—', date: data.created_at?.slice(0, 10) }, id });
      }
    } catch {
      setOrderResult({ found: false });
    } finally {
      setOrderLoading(false);
    }
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setContactLoading(true);
    try {
      await fetch(API.applications, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contactForm),
      });
      setContactSent(true);
    } finally {
      setContactLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white font-body text-gray-900">

      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#e8251a] flex items-center justify-center">
              <Icon name="Zap" size={16} className="text-white" />
            </div>
            <span className="font-display text-lg font-bold tracking-wider text-[#e8251a]">СЕРВИСНЫЙ<span className="text-gray-900"> ЦЕНТР</span></span>
          </div>
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(link => (
              <button key={link.id} onClick={() => scrollTo(link.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeSection === link.id
                    ? "text-[#e8251a] bg-red-50"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}>
                {link.label}
              </button>
            ))}
          </div>
          <a href="tel:+79038544433" className="hidden md:flex items-center gap-2 btn-neon px-4 py-2 rounded-lg text-sm">
            <Icon name="Phone" size={14} />
            +7 (903) 854-44-33
          </a>
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden text-gray-600 hover:text-gray-900">
            <Icon name={mobileMenuOpen ? "X" : "Menu"} size={24} />
          </button>
        </div>
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-100 px-4 py-3 flex flex-col gap-1 bg-white">
            {NAV_LINKS.map(link => (
              <button key={link.id} onClick={() => scrollTo(link.id)}
                className="text-left px-4 py-2 rounded-lg text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-all">
                {link.label}
              </button>
            ))}
            <a href="tel:+79038544433" className="mt-2 btn-neon px-4 py-2 rounded-lg text-sm text-center">
              +7 (903) 854-44-33
            </a>
          </div>
        )}
      </nav>

      {/* HERO */}
      <section id="home" className="pt-16 min-h-screen flex items-center relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={HERO_IMAGE} alt="Сервисный центр" className="w-full h-full object-cover opacity-10" />
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/90 to-white/40" />
        </div>
        {/* Yellow accent bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#e8251a] via-[#ffc107] to-[#e8251a]" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-20 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-50 border border-green-200 text-green-700 text-xs font-semibold uppercase tracking-widest mb-6">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse-slow" />
              Работаем сегодня до 21:00
            </div>
            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight mb-6 text-gray-900">
              РЕМОНТ<br />
              <span className="text-[#e8251a]">ЭЛЕКТРО</span><br />
              <span className="text-[#ffc107]">НИКИ</span>
            </h1>
            <p className="text-gray-500 text-lg mb-8 leading-relaxed max-w-md">
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
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-lg">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
                <Icon name="Search" size={20} className="text-[#e8251a]" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Отследить ремонт</h3>
                <p className="text-gray-400 text-xs">Введите номер заказа</p>
              </div>
            </div>
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                placeholder="Например: TC-1042"
                value={orderInput}
                onChange={e => { setOrderInput(e.target.value); setOrderResult(null); }}
                onKeyDown={e => e.key === "Enter" && checkOrder()}
                className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#e8251a]/50 transition-all"
              />
              <button onClick={checkOrder} disabled={orderLoading} className="btn-neon px-4 py-2.5 rounded-xl disabled:opacity-60">
                <Icon name={orderLoading ? "Loader" : "Search"} size={16} className={orderLoading ? "animate-spin" : ""} />
              </button>
            </div>

            {orderResult === null && (
              <div className="text-gray-400 text-xs text-center py-3">Попробуйте: TC-1042 / TC-0987 / TC-1101</div>
            )}
            {orderResult?.found === false && (
              <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3 text-red-600 text-sm text-center">
                Заказ не найден. Проверьте номер.
              </div>
            )}
            {orderResult?.found && orderResult.order && (
              <div className="space-y-3">
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                  <p className="text-gray-900 font-medium text-sm mb-1">{orderResult.order.device}</p>
                  <p className="text-gray-400 text-xs">Мастер: {orderResult.order.master} · {orderResult.order.date}</p>
                </div>
                <span className={`status-badge ${STATUSES[orderResult.order.status].cls}`}>
                  <Icon name={STATUSES[orderResult.order.status].icon} size={12} />
                  {STATUSES[orderResult.order.status].label}
                </span>
                <div className="flex gap-1">
                  {[1, 2, 3, 4].map(step => (
                    <div key={step} className={`flex-1 h-1.5 rounded-full transition-all ${
                      step <= STATUSES[orderResult.order!.status].step ? "bg-[#e8251a]" : "bg-gray-100"
                    }`} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="py-12 bg-[#e8251a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-2 md:grid-cols-4 gap-6">
          {STATS.map((s, i) => (
            <div key={i} className="text-center">
              <div className="font-display text-3xl sm:text-4xl font-bold text-white mb-1">{s.value}</div>
              <div className="text-red-200 text-sm">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" className="py-20 bg-gray-50 grid-pattern">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <p className="text-[#e8251a] text-xs font-semibold uppercase tracking-widest mb-3">Что мы чиним</p>
            <h2 className="font-display text-4xl sm:text-5xl font-bold text-gray-900">НАШИ УСЛУГИ</h2>
          </div>
          {/* Category tabs */}
          <div className="flex gap-3 justify-center mb-10 flex-wrap">
            {SERVICE_CATEGORIES.map((cat, i) => (
              <button key={i} onClick={() => setActiveCategory(i)}
                className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${
                  activeCategory === i
                    ? "bg-[#e8251a] text-white shadow-md"
                    : "bg-white text-gray-600 border border-gray-200 hover:border-red-200 hover:text-[#e8251a]"
                }`}>
                {cat.category}
              </button>
            ))}
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {SERVICE_CATEGORIES[activeCategory].items.map((s, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 group hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-red-100 cursor-pointer">
                <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center mb-4 group-hover:bg-red-100 transition-all">
                  <Icon name={s.icon} size={22} className="text-[#e8251a]" />
                </div>
                <h3 className="font-semibold text-gray-900 text-lg mb-2">{s.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-4">{s.desc}</p>
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <span className="text-[#e8251a] text-sm font-bold">{s.price}</span>
                  <span className="flex items-center gap-1 text-gray-400 text-xs">
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
      <section id="about" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid md:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-[#e8251a] text-xs font-semibold uppercase tracking-widest mb-3">Наша история</p>
            <h2 className="font-display text-4xl sm:text-5xl font-bold text-gray-900 mb-6">О НАС</h2>
            <p className="text-gray-500 leading-relaxed mb-5">
              Мы работаем с 2018 года и за это время выполнили более 8 000 ремонтов. Наша команда — это сертифицированные специалисты с опытом работы на официальных сервисных станциях.
            </p>
            <p className="text-gray-500 leading-relaxed mb-8">
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
                  <div className="w-8 h-8 rounded-lg bg-yellow-50 flex items-center justify-center flex-shrink-0">
                    <Icon name={item.icon} size={16} className="text-[#ffc107]" style={{ filter: "brightness(0.7)" }} />
                  </div>
                  <span className="text-gray-700 text-sm">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2 rounded-2xl overflow-hidden h-52">
              <img src={IMG_RECEPTION} alt="Наш сервисный центр" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
            </div>
            <div className="rounded-2xl overflow-hidden h-40">
              <img src={IMG_REPAIR} alt="Ремонт электроники" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
            </div>
            <div className="rounded-2xl overflow-hidden h-40">
              <img src={IMG_APPLIANCE} alt="Ремонт бытовой техники" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
            </div>
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      <section id="reviews" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <p className="text-[#e8251a] text-xs font-semibold uppercase tracking-widest mb-3">Что говорят клиенты</p>
            <h2 className="font-display text-4xl sm:text-5xl font-bold text-gray-900">ОТЗЫВЫ</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {REVIEWS.map((r, i) => (
              <div key={i} className="bg-white rounded-2xl p-5 border border-gray-100 hover:shadow-md transition-all">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(r.rating)].map((_, j) => (
                    <Icon key={j} name="Star" size={14} className="text-[#ffc107]" />
                  ))}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-5">"{r.text}"</p>
                <div className="pt-3 border-t border-gray-100">
                  <div className="font-medium text-gray-900 text-sm">{r.name}</div>
                  <div className="flex items-center justify-between mt-0.5">
                    <span className="text-gray-400 text-xs">{r.device}</span>
                    <span className="text-gray-300 text-xs">{r.date}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACTS */}
      <section id="contacts" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <p className="text-[#e8251a] text-xs font-semibold uppercase tracking-widest mb-3">Свяжитесь с нами</p>
            <h2 className="font-display text-4xl sm:text-5xl font-bold text-gray-900">КОНТАКТЫ</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-10">
            <div className="space-y-5">
              {[
                { icon: "Phone", label: "Телефон", value: "+7 (903) 854-44-33", link: "tel:+79038544433" },
                { icon: "MessageCircle", label: "WhatsApp / Telegram", value: "@technoservice_msk", link: "#" },
                { icon: "Mail", label: "Email", value: "info@technoservice.ru", link: "mailto:info@technoservice.ru" },
                { icon: "MapPin", label: "Адрес", value: "Москва, ул. Тверская, 12", link: "#" },
                { icon: "Clock", label: "Режим работы", value: "Пн–Вс: 9:00 – 21:00", link: null },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Icon name={item.icon} size={18} className="text-[#e8251a]" />
                  </div>
                  <div>
                    <div className="text-gray-400 text-xs mb-0.5">{item.label}</div>
                    {item.link ? (
                      <a href={item.link} className="text-gray-900 font-medium hover:text-[#e8251a] transition-colors">{item.value}</a>
                    ) : (
                      <span className="text-gray-900 font-medium">{item.value}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-lg">
              {contactSent ? (
                <div className="h-full flex flex-col items-center justify-center py-8 text-center">
                  <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mb-4">
                    <Icon name="CheckCircle" size={32} className="text-green-500" />
                  </div>
                  <h3 className="font-semibold text-gray-900 text-lg mb-2">Заявка отправлена!</h3>
                  <p className="text-gray-500 text-sm">Мы перезвоним вам в течение 15 минут</p>
                  <button onClick={() => { setContactSent(false); setContactForm({ name: "", phone: "", device: "", comment: "" }); }}
                    className="mt-6 btn-outline-neon px-5 py-2 rounded-xl text-sm">
                    Отправить ещё
                  </button>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <h3 className="font-semibold text-gray-900 text-lg mb-5">Оставить заявку</h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-gray-500 text-xs mb-1.5 block">Ваше имя</label>
                      <input required value={contactForm.name} onChange={e => setContactForm(p => ({ ...p, name: e.target.value }))}
                        placeholder="Иван"
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#e8251a]/50 transition-all" />
                    </div>
                    <div>
                      <label className="text-gray-500 text-xs mb-1.5 block">Телефон</label>
                      <input required value={contactForm.phone} onChange={e => setContactForm(p => ({ ...p, phone: e.target.value }))}
                        placeholder="+7 (___) ___-__-__"
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#e8251a]/50 transition-all" />
                    </div>
                  </div>
                  <div>
                    <label className="text-gray-500 text-xs mb-1.5 block">Устройство</label>
                    <input value={contactForm.device} onChange={e => setContactForm(p => ({ ...p, device: e.target.value }))}
                      placeholder="Например: iPhone 13, Samsung Galaxy S22"
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#e8251a]/50 transition-all" />
                  </div>
                  <div>
                    <label className="text-gray-500 text-xs mb-1.5 block">Опишите проблему</label>
                    <textarea value={contactForm.comment} onChange={e => setContactForm(p => ({ ...p, comment: e.target.value }))}
                      rows={3} placeholder="Разбит экран, не заряжается..."
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#e8251a]/50 transition-all resize-none" />
                  </div>
                  <button type="submit" disabled={contactLoading} className="w-full btn-neon py-3 rounded-xl font-semibold text-sm disabled:opacity-60 flex items-center justify-center gap-2">
                    {contactLoading && <Icon name="Loader" size={16} className="animate-spin" />}
                    {contactLoading ? "Отправляем..." : "Отправить заявку"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-900 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-[#e8251a] flex items-center justify-center">
              <Icon name="Zap" size={12} className="text-white" />
            </div>
            <span className="font-display text-sm font-bold tracking-wider text-white">СЕРВИСНЫЙ ЦЕНТР</span>
          </div>
          <p className="text-gray-500 text-xs">© 2026 Сервисный центр. Все права защищены.</p>
          <div className="flex gap-4">
            {[
              { icon: "Phone", link: "tel:+79038544433" },
              { icon: "MessageCircle", link: "#" },
              { icon: "Mail", link: "mailto:info@technoservice.ru" },
            ].map((item, i) => (
              <a key={i} href={item.link} className="text-gray-500 hover:text-[#e8251a] transition-colors">
                <Icon name={item.icon} size={18} />
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}