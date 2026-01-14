import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.VITE_SUPABASE_URL!
const supabaseKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY!

const supabase = createClient(supabaseUrl, supabaseKey)

const patients = [
  {
    id: 'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d',
    first_name: 'Sarah',
    last_name: 'Johnson',
    email: 'sarah.johnson@email.com',
    phone: '(555) 123-4567',
    date_of_birth: '1988-03-15',
    address: '123 Oak Street, Boston, MA 02101',
    emergency_contact_name: 'Michael Johnson',
    emergency_contact_phone: '(555) 123-4568',
    medical_history: 'No significant medical history. Regular menstrual cycles.',
    notes: 'First IVF cycle, very motivated patient.',
  },
  {
    id: 'b2c3d4e5-f6a7-5b6c-9d0e-1f2a3b4c5d6e',
    first_name: 'Emily',
    last_name: 'Williams',
    email: 'emily.williams@email.com',
    phone: '(555) 234-5678',
    date_of_birth: '1990-07-22',
    address: '456 Maple Ave, Cambridge, MA 02139',
    emergency_contact_name: 'David Williams',
    emergency_contact_phone: '(555) 234-5679',
    medical_history: 'PCOS diagnosed 2020. On metformin.',
    notes: 'Previous failed IUI x2. Starting IVF.',
  },
  {
    id: 'c3d4e5f6-a7b8-6c7d-0e1f-2a3b4c5d6e7f',
    first_name: 'Jessica',
    last_name: 'Brown',
    email: 'jessica.brown@email.com',
    phone: '(555) 345-6789',
    date_of_birth: '1985-11-08',
    address: '789 Pine Road, Brookline, MA 02445',
    emergency_contact_name: 'Robert Brown',
    emergency_contact_phone: '(555) 345-6780',
    medical_history: 'Endometriosis stage II. Laparoscopy 2022.',
    notes: 'Egg freezing for fertility preservation.',
  },
  {
    id: 'd4e5f6a7-b8c9-7d8e-1f2a-3b4c5d6e7f8a',
    first_name: 'Amanda',
    last_name: 'Davis',
    email: 'amanda.davis@email.com',
    phone: '(555) 456-7890',
    date_of_birth: '1992-04-30',
    address: '321 Elm Street, Newton, MA 02458',
    emergency_contact_name: 'James Davis',
    emergency_contact_phone: '(555) 456-7891',
    medical_history: 'Hypothyroidism, well controlled on levothyroxine.',
    notes: 'Partner has low sperm count. Recommended ICSI.',
  },
  {
    id: 'e5f6a7b8-c9d0-8e9f-2a3b-4c5d6e7f8a9b',
    first_name: 'Rachel',
    last_name: 'Miller',
    email: 'rachel.miller@email.com',
    phone: '(555) 567-8901',
    date_of_birth: '1987-09-12',
    address: '654 Cedar Lane, Somerville, MA 02143',
    emergency_contact_name: 'Thomas Miller',
    emergency_contact_phone: '(555) 567-8902',
    medical_history: 'No medical issues. AMH 3.2 ng/mL.',
    notes: 'Same-sex couple using donor sperm.',
  },
  {
    id: 'f6a7b8c9-d0e1-9f0a-3b4c-5d6e7f8a9b0c',
    first_name: 'Michelle',
    last_name: 'Wilson',
    email: 'michelle.wilson@email.com',
    phone: '(555) 678-9012',
    date_of_birth: '1989-01-25',
    address: '987 Birch Ave, Medford, MA 02155',
    emergency_contact_name: 'Kevin Wilson',
    emergency_contact_phone: '(555) 678-9013',
    medical_history: 'Diminished ovarian reserve. AMH 0.8 ng/mL.',
    notes: 'Discussed donor egg options.',
  },
  {
    id: 'a7b8c9d0-e1f2-0a1b-4c5d-6e7f8a9b0c1d',
    first_name: 'Lauren',
    last_name: 'Moore',
    email: 'lauren.moore@email.com',
    phone: '(555) 789-0123',
    date_of_birth: '1991-06-18',
    address: '147 Walnut Street, Arlington, MA 02474',
    emergency_contact_name: 'Christopher Moore',
    emergency_contact_phone: '(555) 789-0124',
    medical_history: 'Recurrent pregnancy loss x3. Thrombophilia workup negative.',
    notes: 'Starting IVF with PGT-A.',
  },
  {
    id: 'b8c9d0e1-f2a3-1b2c-5d6e-7f8a9b0c1d2e',
    first_name: 'Stephanie',
    last_name: 'Taylor',
    email: 'stephanie.taylor@email.com',
    phone: '(555) 890-1234',
    date_of_birth: '1986-12-03',
    address: '258 Spruce Road, Lexington, MA 02420',
    emergency_contact_name: 'Andrew Taylor',
    emergency_contact_phone: '(555) 890-1235',
    medical_history: 'Tubal factor infertility. Bilateral hydrosalpinx s/p salpingectomy.',
    notes: 'Good prognosis post-surgery.',
  },
  {
    id: 'c9d0e1f2-a3b4-2c3d-6e7f-8a9b0c1d2e3f',
    first_name: 'Nicole',
    last_name: 'Anderson',
    email: 'nicole.anderson@email.com',
    phone: '(555) 901-2345',
    date_of_birth: '1993-08-27',
    address: '369 Hickory Lane, Waltham, MA 02451',
    emergency_contact_name: 'Matthew Anderson',
    emergency_contact_phone: '(555) 901-2346',
    medical_history: 'Unexplained infertility. All workup normal.',
    notes: 'Trying IUI before IVF.',
  },
  {
    id: 'd0e1f2a3-b4c5-3d4e-7f8a-9b0c1d2e3f4a',
    first_name: 'Megan',
    last_name: 'Thomas',
    email: 'megan.thomas@email.com',
    phone: '(555) 012-3456',
    date_of_birth: '1984-02-14',
    address: '480 Chestnut Ave, Belmont, MA 02478',
    emergency_contact_name: 'Daniel Thomas',
    emergency_contact_phone: '(555) 012-3457',
    medical_history: 'Advanced maternal age. Previous successful IVF pregnancy 2020.',
    notes: 'Returning for sibling cycle.',
  },
]

const cycles = [
  {
    id: '11111111-1111-1111-1111-111111111111',
    patient_id: 'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d',
    cycle_number: 1,
    cycle_type: 'ivf',
    status: 'stimulation',
    start_date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    protocol: 'Antagonist',
    medications: { medications: ['Gonal-F 300 IU', 'Menopur 150 IU', 'Cetrotide 0.25mg'] },
    notes: 'Day 5 of stims. Good follicular response.',
  },
  {
    id: '22222222-2222-2222-2222-222222222222',
    patient_id: 'b2c3d4e5-f6a7-5b6c-9d0e-1f2a3b4c5d6e',
    cycle_number: 1,
    cycle_type: 'ivf',
    status: 'retrieval',
    start_date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    protocol: 'Long Lupron',
    medications: { medications: ['Follistim 250 IU', 'Low-dose hCG', 'Lupron trigger'] },
    notes: '18 follicles >14mm. Retrieval tomorrow.',
  },
  {
    id: '33333333-3333-3333-3333-333333333333',
    patient_id: 'c3d4e5f6-a7b8-6c7d-0e1f-2a3b4c5d6e7f',
    cycle_number: 1,
    cycle_type: 'egg_freezing',
    status: 'completed',
    start_date: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    protocol: 'Antagonist',
    medications: { medications: ['Gonal-F 225 IU', 'Ganirelix'] },
    notes: '12 mature oocytes vitrified. Excellent outcome.',
  },
  {
    id: '44444444-4444-4444-4444-444444444444',
    patient_id: 'd4e5f6a7-b8c9-7d8e-1f2a-3b4c5d6e7f8a',
    cycle_number: 1,
    cycle_type: 'ivf',
    status: 'tww',
    start_date: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    protocol: 'Antagonist with ICSI',
    medications: { medications: ['Menopur 225 IU', 'PIO', 'Estrace'] },
    notes: 'SET of 5AA blastocyst on day 5.',
  },
  {
    id: '55555555-5555-5555-5555-555555555555',
    patient_id: 'e5f6a7b8-c9d0-8e9f-2a3b-4c5d6e7f8a9b',
    cycle_number: 1,
    cycle_type: 'iui',
    status: 'pregnant',
    start_date: new Date(Date.now() - 42 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    protocol: 'Clomid + IUI',
    medications: { medications: ['Clomid 100mg', 'Ovidrel trigger'] },
    notes: 'Positive beta! hCG 245. Congratulations!',
  },
  {
    id: '66666666-6666-6666-6666-666666666666',
    patient_id: 'f6a7b8c9-d0e1-9f0a-3b4c-5d6e7f8a9b0c',
    cycle_number: 1,
    cycle_type: 'ivf',
    status: 'planning',
    start_date: null,
    protocol: 'Mini IVF',
    medications: { medications: [] },
    notes: 'Discussed mini-IVF protocol due to DOR.',
  },
  {
    id: '77777777-7777-7777-7777-777777777777',
    patient_id: 'a7b8c9d0-e1f2-0a1b-4c5d-6e7f8a9b0c1d',
    cycle_number: 1,
    cycle_type: 'ivf',
    status: 'transfer',
    start_date: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    protocol: 'Antagonist with PGT-A',
    medications: { medications: ['Gonal-F 300 IU', 'Menopur 75 IU'] },
    notes: 'Transferring 1 euploid embryo today.',
  },
  {
    id: '88888888-8888-8888-8888-888888888888',
    patient_id: 'b8c9d0e1-f2a3-1b2c-5d6e-7f8a9b0c1d2e',
    cycle_number: 2,
    cycle_type: 'fet',
    status: 'stimulation',
    start_date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    protocol: 'Programmed FET',
    medications: { medications: ['Estrace 2mg TID'] },
    notes: 'Lining 9.2mm trilaminar.',
  },
  {
    id: '99999999-9999-9999-9999-999999999999',
    patient_id: 'c9d0e1f2-a3b4-2c3d-6e7f-8a9b0c1d2e3f',
    cycle_number: 1,
    cycle_type: 'iui',
    status: 'stimulation',
    start_date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    protocol: 'Letrozole + IUI',
    medications: { medications: ['Letrozole 5mg'] },
    notes: '2 follicles at 16mm and 14mm.',
  },
  {
    id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    patient_id: 'd0e1f2a3-b4c5-3d4e-7f8a-9b0c1d2e3f4a',
    cycle_number: 2,
    cycle_type: 'ivf',
    status: 'planning',
    start_date: null,
    protocol: 'Antagonist',
    medications: { medications: [] },
    notes: 'Baseline scheduled for CD2.',
  },
]

const embryos = [
  { id: 'e1111111-1111-1111-1111-111111111111', cycle_id: '22222222-2222-2222-2222-222222222222', embryo_number: 1, status: 'developing', cell_count: 8, grade: '8A', quality_score: 'excellent', development_stage: 'cleavage', biopsy_status: 'not_biopsied', genetic_status: null, notes: 'Excellent 8-cell', day: 3 },
  { id: 'e2222222-2222-2222-2222-222222222222', cycle_id: '22222222-2222-2222-2222-222222222222', embryo_number: 2, status: 'developing', cell_count: 8, grade: '8A-', quality_score: 'good', development_stage: 'cleavage', biopsy_status: 'not_biopsied', genetic_status: null, notes: 'Good 8-cell', day: 3 },
  { id: 'e3333333-3333-3333-3333-333333333333', cycle_id: '22222222-2222-2222-2222-222222222222', embryo_number: 3, status: 'developing', cell_count: 7, grade: '7B', quality_score: 'good', development_stage: 'cleavage', biopsy_status: 'not_biopsied', genetic_status: null, notes: '7-cell', day: 3 },
  { id: 'e4444444-4444-4444-4444-444444444444', cycle_id: '22222222-2222-2222-2222-222222222222', embryo_number: 4, status: 'developing', cell_count: 6, grade: '6B', quality_score: 'fair', development_stage: 'cleavage', biopsy_status: 'not_biopsied', genetic_status: null, notes: '6-cell', day: 3 },
  { id: 'e5555555-5555-5555-5555-555555555555', cycle_id: '22222222-2222-2222-2222-222222222222', embryo_number: 5, status: 'arrested', cell_count: 4, grade: '4C', quality_score: 'poor', development_stage: 'cleavage', biopsy_status: 'not_biopsied', genetic_status: null, notes: 'Arrested', day: 3 },
  { id: 'e6666666-6666-6666-6666-666666666666', cycle_id: '77777777-7777-7777-7777-777777777777', embryo_number: 1, status: 'transferred', cell_count: null, grade: '5AA', quality_score: 'excellent', development_stage: 'blastocyst', biopsy_status: 'completed', genetic_status: 'euploid', notes: 'Transferred', day: 5 },
  { id: 'e7777777-7777-7777-7777-777777777777', cycle_id: '77777777-7777-7777-7777-777777777777', embryo_number: 2, status: 'frozen', cell_count: null, grade: '4AB', quality_score: 'good', development_stage: 'blastocyst', biopsy_status: 'completed', genetic_status: 'euploid', notes: 'Vitrified', day: 5 },
  { id: 'e8888888-8888-8888-8888-888888888888', cycle_id: '77777777-7777-7777-7777-777777777777', embryo_number: 3, status: 'frozen', cell_count: null, grade: '4BA', quality_score: 'good', development_stage: 'blastocyst', biopsy_status: 'completed', genetic_status: 'euploid', notes: 'Vitrified', day: 5 },
  { id: 'ebbbbbb0-bbbb-bbbb-bbbb-bbbbbbbbbbbb', cycle_id: '44444444-4444-4444-4444-444444444444', embryo_number: 1, status: 'transferred', cell_count: null, grade: '5AA', quality_score: 'excellent', development_stage: 'blastocyst', biopsy_status: 'not_biopsied', genetic_status: null, notes: 'Transferred day 5', day: 5 },
  { id: 'ecccccc0-cccc-cccc-cccc-cccccccccccc', cycle_id: '44444444-4444-4444-4444-444444444444', embryo_number: 2, status: 'frozen', cell_count: null, grade: '4AB', quality_score: 'good', development_stage: 'blastocyst', biopsy_status: 'not_biopsied', genetic_status: null, notes: 'Frozen for future', day: 5 },
]

const today = new Date().toISOString().split('T')[0]
const tomorrow = new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
const in2days = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
const in5days = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

const appointments = [
  { id: 'ap111111-1111-1111-1111-111111111111', patient_id: 'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d', title: 'Monitoring Ultrasound', description: 'Day 8 stim check', appointment_date: today, appointment_time: '08:00:00', duration_minutes: 30, type: 'ultrasound', status: 'scheduled' },
  { id: 'ap222222-2222-2222-2222-222222222222', patient_id: 'b2c3d4e5-f6a7-5b6c-9d0e-1f2a3b4c5d6e', title: 'Egg Retrieval', description: 'OR scheduled', appointment_date: today, appointment_time: '09:30:00', duration_minutes: 60, type: 'procedure', status: 'confirmed' },
  { id: 'ap333333-3333-3333-3333-333333333333', patient_id: 'a7b8c9d0-e1f2-0a1b-4c5d-6e7f8a9b0c1d', title: 'Embryo Transfer', description: 'SET of euploid embryo', appointment_date: today, appointment_time: '11:00:00', duration_minutes: 45, type: 'procedure', status: 'confirmed' },
  { id: 'ap444444-4444-4444-4444-444444444444', patient_id: 'c9d0e1f2-a3b4-2c3d-6e7f-8a9b0c1d2e3f', title: 'IUI Monitoring', description: 'Check follicle growth', appointment_date: today, appointment_time: '14:00:00', duration_minutes: 30, type: 'ultrasound', status: 'scheduled' },
  { id: 'ap555555-5555-5555-5555-555555555555', patient_id: 'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d', title: 'Stim Check', description: 'Day 9 monitoring', appointment_date: tomorrow, appointment_time: '08:30:00', duration_minutes: 30, type: 'ultrasound', status: 'scheduled' },
  { id: 'ap666666-6666-6666-6666-666666666666', patient_id: 'f6a7b8c9-d0e1-9f0a-3b4c-5d6e7f8a9b0c', title: 'New Patient Consult', description: 'Discuss treatment options', appointment_date: tomorrow, appointment_time: '10:00:00', duration_minutes: 60, type: 'consultation', status: 'confirmed' },
  { id: 'ap777777-7777-7777-7777-777777777777', patient_id: 'b8c9d0e1-f2a3-1b2c-5d6e-7f8a9b0c1d2e', title: 'Lining Check', description: 'FET prep ultrasound', appointment_date: tomorrow, appointment_time: '13:00:00', duration_minutes: 30, type: 'ultrasound', status: 'scheduled' },
  { id: 'apaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', patient_id: 'c9d0e1f2-a3b4-2c3d-6e7f-8a9b0c1d2e3f', title: 'IUI Procedure', description: 'Intrauterine insemination', appointment_date: in2days, appointment_time: '09:00:00', duration_minutes: 30, type: 'procedure', status: 'scheduled' },
  { id: 'apcccccc-cccc-cccc-cccc-cccccccccccc', patient_id: 'b8c9d0e1-f2a3-1b2c-5d6e-7f8a9b0c1d2e', title: 'FET Transfer', description: 'Frozen embryo transfer', appointment_date: in5days, appointment_time: '11:00:00', duration_minutes: 45, type: 'procedure', status: 'scheduled' },
  { id: 'ap000001-0001-0001-0001-000000000001', patient_id: 'e5f6a7b8-c9d0-8e9f-2a3b-4c5d6e7f8a9b', title: 'First Ultrasound', description: 'Confirm viability', appointment_date: in5days, appointment_time: '10:30:00', duration_minutes: 30, type: 'ultrasound', status: 'scheduled' },
]

async function seed() {
  console.log('🌱 Seeding database...\n')

  // Insert patients
  console.log('👥 Inserting patients...')
  const { error: patientsError } = await supabase.from('patients').upsert(patients, { onConflict: 'id' })
  if (patientsError) {
    console.error('Error inserting patients:', patientsError.message)
  } else {
    console.log(`   ✓ ${patients.length} patients inserted`)
  }

  // Insert cycles
  console.log('🔄 Inserting cycles...')
  const { error: cyclesError } = await supabase.from('cycles').upsert(cycles, { onConflict: 'id' })
  if (cyclesError) {
    console.error('Error inserting cycles:', cyclesError.message)
  } else {
    console.log(`   ✓ ${cycles.length} cycles inserted`)
  }

  // Insert embryos
  console.log('🧬 Inserting embryos...')
  const { error: embryosError } = await supabase.from('embryos').upsert(embryos, { onConflict: 'id' })
  if (embryosError) {
    console.error('Error inserting embryos:', embryosError.message)
  } else {
    console.log(`   ✓ ${embryos.length} embryos inserted`)
  }

  // Insert appointments
  console.log('📅 Inserting appointments...')
  const { error: appointmentsError } = await supabase.from('appointments').upsert(appointments, { onConflict: 'id' })
  if (appointmentsError) {
    console.error('Error inserting appointments:', appointmentsError.message)
  } else {
    console.log(`   ✓ ${appointments.length} appointments inserted`)
  }

  console.log('\n✅ Seeding complete!')
}

seed().catch(console.error)
