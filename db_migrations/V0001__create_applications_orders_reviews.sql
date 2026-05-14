-- Заявки клиентов (с формы на сайте)
CREATE TABLE applications (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    device VARCHAR(200),
    comment TEXT,
    status VARCHAR(20) DEFAULT 'new',
    created_at TIMESTAMP DEFAULT NOW()
);

-- Заказы на ремонт (с номером для отслеживания)
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    order_number VARCHAR(20) UNIQUE NOT NULL,
    client_name VARCHAR(100) NOT NULL,
    client_phone VARCHAR(20) NOT NULL,
    device VARCHAR(200) NOT NULL,
    problem TEXT,
    status VARCHAR(20) DEFAULT 'received',
    master VARCHAR(100),
    price INTEGER,
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Отзывы клиентов
CREATE TABLE reviews (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    device VARCHAR(200),
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    text TEXT NOT NULL,
    is_published BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
);