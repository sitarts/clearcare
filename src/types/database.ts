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
  am: number | null
  surname: string
  name: string
  dob: string | null
  age: number | null
  email: string | null
  phone: string | null
  mobile: string | null
  landline: string | null
  address: string | null
  city: string | null
  postal_code: string | null
  nationality: string | null
  mother_name: string | null
  father_name: string | null
  occupation: string | null
  insurance: string | null
  amka: string | null
  afm: string | null
  blood_type: string | null
  rhesus: string | null
  height: number | null
  weight: number | null
  bmi: number | null
  smoking: boolean | null
  alcohol: boolean | null
  status: string | null
  status_reason: string | null
  partner_id: string | null
  request: string | null
  subfertility_type: string | null
  notes: string | null
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
  cycle_number: number | null
  cycle_type: string | null
  start_date: string | null
  end_date: string | null
  status: string | null
  outcome: string | null
  protocol: string | null
  medication: string | null
  oocytes_retrieved: number | null
  mature_oocytes: number | null
  fertilized: number | null
  embryos_transferred: number | null
  embryos_frozen: number | null
  transfer_date: string | null
  beta_hcg_date: string | null
  beta_hcg_value: number | null
  pregnant: boolean | null
  notes: string | null
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
