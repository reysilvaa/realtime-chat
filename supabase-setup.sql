-- SQL Script untuk setup database Supabase - Rey & Annisa App
-- Jalankan script ini di Supabase SQL Editor

-- ============================================
-- MESSAGES TABLE (Chat Feature)
-- ============================================

-- 1. Buat tabel messages untuk chat
CREATE TABLE IF NOT EXISTS messages (
    id BIGSERIAL PRIMARY KEY,
    sender_name VARCHAR(100) NOT NULL,
    recipient_name VARCHAR(100) NOT NULL,
    message TEXT NOT NULL,
    read_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Enable Row Level Security untuk messages
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- 3. Buat policy untuk messages
CREATE POLICY "Anyone can read messages" ON messages
    FOR SELECT USING (true);

CREATE POLICY "Anyone can insert messages" ON messages
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can update messages" ON messages
    FOR UPDATE USING (true);

-- 4. Buat index untuk performa messages
CREATE INDEX IF NOT EXISTS messages_created_at_idx ON messages (created_at DESC);
CREATE INDEX IF NOT EXISTS messages_sender_idx ON messages (sender_name);
CREATE INDEX IF NOT EXISTS messages_recipient_idx ON messages (recipient_name);
CREATE INDEX IF NOT EXISTS messages_read_at_idx ON messages (read_at);

-- 5. Enable Realtime untuk messages
ALTER PUBLICATION supabase_realtime ADD TABLE messages;

-- ============================================
-- LETTERS TABLE (Izin Keluar Feature)
-- ============================================

-- 1. Buat tabel letters untuk menyimpan surat izin
CREATE TABLE IF NOT EXISTS letters (
    id BIGSERIAL PRIMARY KEY,
    sender_name VARCHAR(100) NOT NULL,
    recipient_name VARCHAR(100) NOT NULL,
    exit_date DATE NOT NULL,
    exit_time TIME NOT NULL,
    return_date DATE NOT NULL,
    return_time TIME NOT NULL,
    destination VARCHAR(200) NOT NULL,
    purpose TEXT NOT NULL,
    companions VARCHAR(200),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE letters ENABLE ROW LEVEL SECURITY;

-- 3. Buat policy untuk memungkinkan semua user membaca surat
CREATE POLICY "Anyone can read letters" ON letters
    FOR SELECT USING (true);

-- 4. Buat policy untuk memungkinkan semua user membuat surat
CREATE POLICY "Anyone can insert letters" ON letters
    FOR INSERT WITH CHECK (true);

-- 5. Buat policy untuk memungkinkan semua user mengupdate surat
CREATE POLICY "Anyone can update letters" ON letters
    FOR UPDATE USING (true);

-- 6. Buat index untuk performa yang lebih baik
CREATE INDEX IF NOT EXISTS letters_created_at_idx ON letters (created_at DESC);
CREATE INDEX IF NOT EXISTS letters_sender_idx ON letters (sender_name);
CREATE INDEX IF NOT EXISTS letters_recipient_idx ON letters (recipient_name);
CREATE INDEX IF NOT EXISTS letters_exit_date_idx ON letters (exit_date);

-- 7. Buat function untuk update timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 8. Buat trigger untuk auto-update timestamp
CREATE TRIGGER update_letters_updated_at 
    BEFORE UPDATE ON letters 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- 9. Optional: Buat function untuk membersihkan surat lama (lebih dari 1 tahun)
CREATE OR REPLACE FUNCTION cleanup_old_letters()
RETURNS void AS $$
BEGIN
    DELETE FROM letters 
    WHERE created_at < NOW() - INTERVAL '1 year';
END;
$$ LANGUAGE plpgsql;

-- 10. Buat view untuk statistik surat
CREATE OR REPLACE VIEW letter_stats AS
SELECT 
    COUNT(*) as total_letters,
    COUNT(DISTINCT sender_name) as unique_senders,
    COUNT(DISTINCT recipient_name) as unique_recipients,
    DATE_TRUNC('month', created_at) as month,
    COUNT(*) as monthly_count
FROM letters 
GROUP BY DATE_TRUNC('month', created_at)
ORDER BY month DESC;

-- 11. Insert sample data (optional)
INSERT INTO letters (
    sender_name, 
    recipient_name, 
    exit_date, 
    exit_time, 
    return_date, 
    return_time, 
    destination, 
    purpose, 
    companions
) VALUES 
(
    'Ahmad Rizki', 
    'Siti Nurhaliza', 
    CURRENT_DATE, 
    '19:00', 
    CURRENT_DATE + INTERVAL '1 day', 
    '22:00', 
    'Mall Central Park', 
    'Menonton film dan makan malam bersama', 
    'Teman-teman dari kampus'
),
(
    'Budi Santoso', 
    'Dewi Sartika', 
    CURRENT_DATE + INTERVAL '2 days', 
    '18:30', 
    CURRENT_DATE + INTERVAL '2 days', 
    '23:00', 
    'Pantai Ancol', 
    'Refreshing dan menikmati sunset', 
    NULL
);

-- Verifikasi setup
SELECT 'Surat Izin Keluar database setup completed successfully!' as status;

-- Tampilkan informasi tabel
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'letters' 
ORDER BY ordinal_position;
