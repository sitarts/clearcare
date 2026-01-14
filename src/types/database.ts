export interface Database {
  public: {
    Tables: {
      patients_female: {
        Row: PatientFemale
        Insert: Omit<PatientFemale, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<PatientFemale, 'id'>>
      }
      patients_male: {
        Row: PatientMale
        Insert: Omit<PatientMale, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<PatientMale, 'id'>>
      }
      cycles: {
        Row: Cycle
        Insert: Omit<Cycle, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Cycle, 'id'>>
      }
    }
  }
}

export interface PatientFemale {
  id: string
  am: number
  first_name: string
  last_name: string
  maiden_name: string | null
  date_of_birth: string
  nationality: string | null
  address: string | null
  city: string | null
  postal_code: string | null
  country: string | null
  mobile: string | null
  landline: string | null
  email: string | null
  height_cm: number | null
  weight_kg: number | null
  bmi: number | null
  blood_group: string | null
  insurance_provider: string | null
  insurance_number: string | null
  eopyy_number: string | null
  amka: string | null
  smoking: string | null
  alcohol: string | null
  exercise: string | null
  status: string | null
  status_reason: string | null
  notes: string | null
  mother_name: string | null
  father_name: string | null
  occupation: string | null
  referral_source: string | null
  first_visit_date: string | null
  created_at: string
  updated_at: string
}

export interface PatientMale {
  id: string
  am: number | null
  surname: string
  name: string
  dob: string | null
  father_name: string | null
  nationality: string | null
  id_number: string | null
  afm: string | null
  amka: string | null
  address: string | null
  city: string | null
  postal_code: string | null
  phone: string | null
  mobile: string | null
  email: string | null
  occupation: string | null
  blood_type: string | null
  rhesus: string | null
  allergies: string | null
  medications: string | null
  smoking: boolean | null
  alcohol: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

export interface Cycle {
  id: string
  female_id: string
  male_id: string | null
  couple_id: string
  cycle_number: number
  am_female: number
  am_male: number | null
  cycle_type: string
  cycle_status: string | null
  lmp_date: string | null
  cycle_day_1: string | null
  stimulation_start_date: string | null
  trigger_date: string | null
  opu_date: string | null
  et_date: string | null
  pregnancy_test_date: string | null
  protocol: string | null
  fsh_type: string | null
  fsh_starting_dose: number | null
  total_fsh_units: number | null
  stimulation_days: number | null
  trigger_type: string | null
  n_cocs: number | null
  n_miis: number | null
  n_2pn: number | null
  n_transferred: number | null
  transfer_day: number | null
  n_frozen: number | null
  pregnancy_test_result: string | null
  bhcg_value: number | null
  bhcg_date: string | null
  outcome: string | null
  doctor: string | null
  embryologist: string | null
  stimulation_notes: string | null
  transfer_notes: string | null
  outcome_notes: string | null
  created_at: string
  updated_at: string
}

export type CycleStatus =
  | 'planning'
  | 'stimulation'
  | 'trigger'
  | 'retrieval'
  | 'fertilization'
  | 'culture'
  | 'transfer'
  | 'tww'
  | 'completed'
  | 'cancelled'

export type CycleOutcome =
  | 'ongoing'
  | 'positive'
  | 'negative'
  | 'biochemical'
  | 'clinical'
  | 'ectopic'
  | 'miscarriage'
  | 'delivery'
