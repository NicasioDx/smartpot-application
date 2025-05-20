-- สร้างตาราง users
CREATE TABLE IF NOT EXISTS users (
   id SERIAL PRIMARY KEY,
   email VARCHAR(255) NOT NULL UNIQUE,
   password VARCHAR(255) NOT NULL,
   nickname VARCHAR(100),
   birth_date DATE,
   created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
   updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- สร้างตาราง plants
CREATE TABLE IF NOT EXISTS plants (
   id SERIAL PRIMARY KEY,
   user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
   name VARCHAR(100) NOT NULL,
   species VARCHAR(100),
   image_url TEXT,
   care_recommendations TEXT,
   created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
   updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- สร้างตาราง sensor_data
CREATE TABLE IF NOT EXISTS sensor_data (
   id SERIAL PRIMARY KEY,
   plant_id INTEGER NOT NULL REFERENCES plants(id) ON DELETE CASCADE,
   moisture_level NUMERIC,
   npk_nitrogen NUMERIC,
   npk_phosphorus NUMERIC,
   npk_potassium NUMERIC,
   light_level NUMERIC,
   temperature NUMERIC,
   recorded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- สร้างตาราง plant_activities
CREATE TABLE IF NOT EXISTS plant_activities (
   id SERIAL PRIMARY KEY,
   plant_id INTEGER NOT NULL REFERENCES plants(id) ON DELETE CASCADE,
   activity_type VARCHAR(50) NOT NULL,
   notes TEXT,
   performed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- สร้าง index เพื่อเพิ่มประสิทธิภาพการค้นหา
CREATE INDEX IF NOT EXISTS idx_plants_user_id ON plants(user_id);
CREATE INDEX IF NOT EXISTS idx_sensor_data_plant_id ON sensor_data(plant_id);
CREATE INDEX IF NOT EXISTS idx_plant_activities_plant_id ON plant_activities(plant_id);
CREATE INDEX IF NOT EXISTS idx_sensor_data_recorded_at ON sensor_data(recorded_at);
CREATE INDEX IF NOT EXISTS idx_plant_activities_performed_at ON plant_activities(performed_at);

-- สร้าง function และ trigger สำหรับอัปเดต updated_at โดยอัตโนมัติ
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = CURRENT_TIMESTAMP;
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- สร้าง trigger สำหรับตาราง users
CREATE TRIGGER update_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- สร้าง trigger สำหรับตาราง plants
CREATE TRIGGER update_plants_updated_at
BEFORE UPDATE ON plants
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
