-- ClearCare Initial Schema
-- Run this first to create all base tables

-- ============================================
-- PATIENTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS patients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE,
  phone VARCHAR(50),
  date_of_birth DATE,
  address TEXT,
  emergency_contact_name VARCHAR(200),
  emergency_contact_phone VARCHAR(50),
  medical_history TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Enable read access for authenticated users" ON patients
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Enable insert for authenticated users" ON patients
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Enable update for authenticated users" ON patients
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Enable delete for authenticated users" ON patients
  FOR DELETE TO authenticated USING (true);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_patients_email ON patients(email);
CREATE INDEX IF NOT EXISTS idx_patients_name ON patients(last_name, first_name);

-- ============================================
-- CYCLES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS cycles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  cycle_number INTEGER NOT NULL DEFAULT 1,
  cycle_type VARCHAR(50) NOT NULL DEFAULT 'ivf' CHECK (cycle_type IN ('ivf', 'iui', 'fet', 'egg_freezing', 'embryo_freezing', 'donor_egg', 'donor_sperm', 'surrogacy')),
  status VARCHAR(50) NOT NULL DEFAULT 'planning' CHECK (status IN ('planning', 'stimulation', 'retrieval', 'fertilization', 'transfer', 'tww', 'pregnant', 'not_pregnant', 'cancelled', 'completed')),
  start_date DATE,
  end_date DATE,
  protocol VARCHAR(100),
  medications JSONB DEFAULT '{}',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE cycles ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Enable read access for authenticated users" ON cycles
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Enable insert for authenticated users" ON cycles
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Enable update for authenticated users" ON cycles
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Enable delete for authenticated users" ON cycles
  FOR DELETE TO authenticated USING (true);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_cycles_patient ON cycles(patient_id);
CREATE INDEX IF NOT EXISTS idx_cycles_status ON cycles(status);

-- ============================================
-- EMBRYOS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS embryos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cycle_id UUID NOT NULL REFERENCES cycles(id) ON DELETE CASCADE,
  embryo_number INTEGER NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'developing' CHECK (status IN ('developing', 'frozen', 'transferred', 'discarded', 'arrested', 'donated')),
  cell_count INTEGER,
  grade VARCHAR(20),
  quality_score VARCHAR(50) CHECK (quality_score IN ('excellent', 'good', 'fair', 'poor')),
  development_stage VARCHAR(50) CHECK (development_stage IN ('zygote', 'cleavage', 'morula', 'blastocyst')),
  biopsy_status VARCHAR(50) DEFAULT 'not_biopsied' CHECK (biopsy_status IN ('not_biopsied', 'pending', 'completed')),
  genetic_status VARCHAR(50) CHECK (genetic_status IN ('euploid', 'aneuploid', 'mosaic', 'no_result')),
  notes TEXT,
  day INTEGER,
  freeze_date DATE,
  thaw_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE embryos ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Enable read access for authenticated users" ON embryos
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Enable insert for authenticated users" ON embryos
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Enable update for authenticated users" ON embryos
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Enable delete for authenticated users" ON embryos
  FOR DELETE TO authenticated USING (true);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_embryos_cycle ON embryos(cycle_id);
CREATE INDEX IF NOT EXISTS idx_embryos_status ON embryos(status);

-- ============================================
-- APPOINTMENTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  duration_minutes INTEGER NOT NULL DEFAULT 30,
  type VARCHAR(50) NOT NULL DEFAULT 'consultation' CHECK (type IN ('consultation', 'procedure', 'followup', 'ultrasound', 'lab')),
  status VARCHAR(50) NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'confirmed', 'completed', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Enable read access for authenticated users" ON appointments
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Enable insert for authenticated users" ON appointments
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Enable update for authenticated users" ON appointments
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Enable delete for authenticated users" ON appointments
  FOR DELETE TO authenticated USING (true);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(appointment_date);
CREATE INDEX IF NOT EXISTS idx_appointments_patient ON appointments(patient_id);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);

-- ============================================
-- UPDATED_AT TRIGGERS
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_patients_updated_at
  BEFORE UPDATE ON patients
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cycles_updated_at
  BEFORE UPDATE ON cycles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_embryos_updated_at
  BEFORE UPDATE ON embryos
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_appointments_updated_at
  BEFORE UPDATE ON appointments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
