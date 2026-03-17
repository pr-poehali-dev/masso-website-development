-- Добавляем дату выездной проверки персонала в salons
ALTER TABLE salons ADD COLUMN IF NOT EXISTS inspection_date DATE DEFAULT NULL;
