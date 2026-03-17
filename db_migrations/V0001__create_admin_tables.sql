
CREATE TABLE admin_users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'manager',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE salons (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    city VARCHAR(255),
    owner_name VARCHAR(255),
    phone VARCHAR(50),
    email VARCHAR(255),
    description TEXT,
    techniques TEXT,
    tariff VARCHAR(100) DEFAULT 'basic',
    status VARCHAR(50) DEFAULT 'new',
    rating DECIMAL(3,2) DEFAULT 0,
    is_published BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE specialists (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    salon_id INTEGER REFERENCES salons(id) ON UPDATE CASCADE,
    experience_years INTEGER DEFAULT 0,
    training_status VARCHAR(50) DEFAULT 'added',
    attestation_status VARCHAR(50) DEFAULT 'none',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE dok_dialog_access (
    id SERIAL PRIMARY KEY,
    specialist_id INTEGER REFERENCES specialists(id) ON UPDATE CASCADE,
    salon_id INTEGER REFERENCES salons(id) ON UPDATE CASCADE,
    email VARCHAR(255) NOT NULL,
    status VARCHAR(50) DEFAULT 'issued',
    issued_at TIMESTAMP DEFAULT NOW(),
    activated_at TIMESTAMP
);

CREATE TABLE leads (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    salon_name VARCHAR(255),
    phone VARCHAR(50),
    email VARCHAR(255),
    source VARCHAR(100),
    status VARCHAR(50) DEFAULT 'new',
    comment TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE salon_comments (
    id SERIAL PRIMARY KEY,
    salon_id INTEGER REFERENCES salons(id) ON UPDATE CASCADE,
    author_id INTEGER REFERENCES admin_users(id) ON UPDATE CASCADE,
    text TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE analytics (
    id SERIAL PRIMARY KEY,
    salon_id INTEGER REFERENCES salons(id) ON UPDATE CASCADE,
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    development_index DECIMAL(5,2) DEFAULT 0,
    revenue DECIMAL(12,2) DEFAULT 0,
    avg_check DECIMAL(10,2) DEFAULT 0,
    procedure_course DECIMAL(5,2) DEFAULT 0,
    specialist_load DECIMAL(5,2) DEFAULT 0,
    client_return_rate DECIMAL(5,2) DEFAULT 0,
    calculations_count INTEGER DEFAULT 0,
    tests_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE tools (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    is_enabled BOOLEAN DEFAULT TRUE,
    hints TEXT,
    formula TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE content_posts (
    id SERIAL PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    body TEXT,
    category VARCHAR(100),
    status VARCHAR(50) DEFAULT 'draft',
    is_pinned BOOLEAN DEFAULT FALSE,
    author_id INTEGER REFERENCES admin_users(id) ON UPDATE CASCADE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE tariffs (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    description TEXT,
    features TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE rating_settings (
    id SERIAL PRIMARY KEY,
    formula TEXT DEFAULT '(training + attestation + techniques) / 3',
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE activity_log (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES admin_users(id) ON UPDATE CASCADE,
    action VARCHAR(255) NOT NULL,
    entity_type VARCHAR(100),
    entity_id INTEGER,
    details TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

INSERT INTO tools (name, slug, description, is_enabled) VALUES
('Калькулятор дохода', 'income-calculator', 'Расчёт потенциального дохода салона', true),
('Диагностика салона', 'salon-diagnostics', 'Комплексная диагностика состояния салона', true),
('Тест оценки', 'assessment-test', 'Тест для оценки уровня специалистов', true),
('Прогноз дохода', 'income-forecast', 'Прогнозирование дохода на основе данных', true);

INSERT INTO rating_settings (formula) VALUES ('(training + attestation + techniques) / 3');

INSERT INTO admin_users (email, password_hash, name, role) VALUES
('admin@massopro.ru', 'temp_hash_change_me', 'Администратор', 'admin');
