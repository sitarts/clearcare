-- ClearCare Seed Data
-- Run this in your Supabase SQL Editor to populate test data

-- Clear existing data (optional - uncomment if you want to reset)
-- TRUNCATE appointments, embryos, cycles, patients RESTART IDENTITY CASCADE;

-- ============================================
-- PATIENTS (10 sample patients)
-- ============================================
INSERT INTO patients (id, first_name, last_name, email, phone, date_of_birth, address, emergency_contact_name, emergency_contact_phone, medical_history, notes, created_at)
VALUES
  ('a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d', 'Sarah', 'Johnson', 'sarah.johnson@email.com', '(555) 123-4567', '1988-03-15', '123 Oak Street, Boston, MA 02101', 'Michael Johnson', '(555) 123-4568', 'No significant medical history. Regular menstrual cycles.', 'First IVF cycle, very motivated patient.', NOW() - INTERVAL '45 days'),

  ('b2c3d4e5-f6a7-5b6c-9d0e-1f2a3b4c5d6e', 'Emily', 'Williams', 'emily.williams@email.com', '(555) 234-5678', '1990-07-22', '456 Maple Ave, Cambridge, MA 02139', 'David Williams', '(555) 234-5679', 'PCOS diagnosed 2020. On metformin.', 'Previous failed IUI x2. Starting IVF.', NOW() - INTERVAL '30 days'),

  ('c3d4e5f6-a7b8-6c7d-0e1f-2a3b4c5d6e7f', 'Jessica', 'Brown', 'jessica.brown@email.com', '(555) 345-6789', '1985-11-08', '789 Pine Road, Brookline, MA 02445', 'Robert Brown', '(555) 345-6780', 'Endometriosis stage II. Laparoscopy 2022.', 'Egg freezing for fertility preservation.', NOW() - INTERVAL '60 days'),

  ('d4e5f6a7-b8c9-7d8e-1f2a-3b4c5d6e7f8a', 'Amanda', 'Davis', 'amanda.davis@email.com', '(555) 456-7890', '1992-04-30', '321 Elm Street, Newton, MA 02458', 'James Davis', '(555) 456-7891', 'Hypothyroidism, well controlled on levothyroxine.', 'Partner has low sperm count. Recommended ICSI.', NOW() - INTERVAL '20 days'),

  ('e5f6a7b8-c9d0-8e9f-2a3b-4c5d6e7f8a9b', 'Rachel', 'Miller', 'rachel.miller@email.com', '(555) 567-8901', '1987-09-12', '654 Cedar Lane, Somerville, MA 02143', 'Thomas Miller', '(555) 567-8902', 'No medical issues. AMH 3.2 ng/mL.', 'Same-sex couple using donor sperm.', NOW() - INTERVAL '15 days'),

  ('f6a7b8c9-d0e1-9f0a-3b4c-5d6e7f8a9b0c', 'Michelle', 'Wilson', 'michelle.wilson@email.com', '(555) 678-9012', '1989-01-25', '987 Birch Ave, Medford, MA 02155', 'Kevin Wilson', '(555) 678-9013', 'Diminished ovarian reserve. AMH 0.8 ng/mL.', 'Discussed donor egg options.', NOW() - INTERVAL '55 days'),

  ('a7b8c9d0-e1f2-0a1b-4c5d-6e7f8a9b0c1d', 'Lauren', 'Moore', 'lauren.moore@email.com', '(555) 789-0123', '1991-06-18', '147 Walnut Street, Arlington, MA 02474', 'Christopher Moore', '(555) 789-0124', 'Recurrent pregnancy loss x3. Thrombophilia workup negative.', 'Starting IVF with PGT-A.', NOW() - INTERVAL '25 days'),

  ('b8c9d0e1-f2a3-1b2c-5d6e-7f8a9b0c1d2e', 'Stephanie', 'Taylor', 'stephanie.taylor@email.com', '(555) 890-1234', '1986-12-03', '258 Spruce Road, Lexington, MA 02420', 'Andrew Taylor', '(555) 890-1235', 'Tubal factor infertility. Bilateral hydrosalpinx s/p salpingectomy.', 'Good prognosis post-surgery.', NOW() - INTERVAL '40 days'),

  ('c9d0e1f2-a3b4-2c3d-6e7f-8a9b0c1d2e3f', 'Nicole', 'Anderson', 'nicole.anderson@email.com', '(555) 901-2345', '1993-08-27', '369 Hickory Lane, Waltham, MA 02451', 'Matthew Anderson', '(555) 901-2346', 'Unexplained infertility. All workup normal.', 'Trying IUI before IVF.', NOW() - INTERVAL '10 days'),

  ('d0e1f2a3-b4c5-3d4e-7f8a-9b0c1d2e3f4a', 'Megan', 'Thomas', 'megan.thomas@email.com', '(555) 012-3456', '1984-02-14', '480 Chestnut Ave, Belmont, MA 02478', 'Daniel Thomas', '(555) 012-3457', 'Advanced maternal age. Previous successful IVF pregnancy 2020.', 'Returning for sibling cycle.', NOW() - INTERVAL '5 days');

-- ============================================
-- CYCLES (12 sample cycles in various stages)
-- ============================================
INSERT INTO cycles (id, patient_id, cycle_number, cycle_type, status, start_date, protocol, medications, notes, created_at)
VALUES
  -- Sarah Johnson - Active IVF cycle in stimulation
  ('11111111-1111-1111-1111-111111111111', 'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d', 1, 'ivf', 'stimulation', CURRENT_DATE - INTERVAL '5 days', 'Antagonist', '{"medications": ["Gonal-F 300 IU", "Menopur 150 IU", "Cetrotide 0.25mg"]}', 'Day 5 of stims. Good follicular response. E2: 890 pg/mL.', NOW() - INTERVAL '5 days'),

  -- Emily Williams - Ready for retrieval
  ('22222222-2222-2222-2222-222222222222', 'b2c3d4e5-f6a7-5b6c-9d0e-1f2a3b4c5d6e', 1, 'ivf', 'retrieval', CURRENT_DATE - INTERVAL '1 day', 'Long Lupron', '{"medications": ["Follistim 250 IU", "Low-dose hCG", "Lupron trigger"]}', 'Triggered last night. 18 follicles >14mm. Retrieval tomorrow.', NOW() - INTERVAL '14 days'),

  -- Jessica Brown - Egg freezing completed
  ('33333333-3333-3333-3333-333333333333', 'c3d4e5f6-a7b8-6c7d-0e1f-2a3b4c5d6e7f', 1, 'egg_freezing', 'completed', CURRENT_DATE - INTERVAL '30 days', 'Antagonist', '{"medications": ["Gonal-F 225 IU", "Ganirelix"]}', '12 mature oocytes vitrified. Excellent outcome.', NOW() - INTERVAL '45 days'),

  -- Amanda Davis - Post transfer TWW
  ('44444444-4444-4444-4444-444444444444', 'd4e5f6a7-b8c9-7d8e-1f2a-3b4c5d6e7f8a', 1, 'ivf', 'tww', CURRENT_DATE - INTERVAL '8 days', 'Antagonist with ICSI', '{"medications": ["Menopur 225 IU", "Orgalutran", "PIO", "Estrace"]}', 'SET of 5AA blastocyst on day 5. Beta scheduled in 6 days.', NOW() - INTERVAL '20 days'),

  -- Rachel Miller - Pregnant!
  ('55555555-5555-5555-5555-555555555555', 'e5f6a7b8-c9d0-8e9f-2a3b-4c5d6e7f8a9b', 1, 'iui', 'pregnant', CURRENT_DATE - INTERVAL '28 days', 'Clomid + IUI', '{"medications": ["Clomid 100mg CD3-7", "Ovidrel trigger"]}', 'Positive beta! hCG 245. Repeat in 48hrs. Congratulations!', NOW() - INTERVAL '42 days'),

  -- Michelle Wilson - Planning stage
  ('66666666-6666-6666-6666-666666666666', 'f6a7b8c9-d0e1-9f0a-3b4c-5d6e7f8a9b0c', 1, 'ivf', 'planning', NULL, 'Mini IVF', '{"medications": []}', 'Discussed mini-IVF protocol due to DOR. Starting next cycle.', NOW() - INTERVAL '3 days'),

  -- Lauren Moore - Transfer day
  ('77777777-7777-7777-7777-777777777777', 'a7b8c9d0-e1f2-0a1b-4c5d-6e7f8a9b0c1d', 1, 'ivf', 'transfer', CURRENT_DATE, 'Antagonist with PGT-A', '{"medications": ["Gonal-F 300 IU", "Menopur 75 IU", "Cetrotide"]}', 'Transferring 1 euploid embryo today. 2 additional euploid frozen.', NOW() - INTERVAL '18 days'),

  -- Stephanie Taylor - FET cycle
  ('88888888-8888-8888-8888-888888888888', 'b8c9d0e1-f2a3-1b2c-5d6e-7f8a9b0c1d2e', 2, 'fet', 'stimulation', CURRENT_DATE - INTERVAL '10 days', 'Programmed FET', '{"medications": ["Estrace 2mg TID", "PIO starting soon"]}', 'Lining 9.2mm trilaminar. Adding progesterone, transfer in 5 days.', NOW() - INTERVAL '10 days'),

  -- Nicole Anderson - IUI cycle
  ('99999999-9999-9999-9999-999999999999', 'c9d0e1f2-a3b4-2c3d-6e7f-8a9b0c1d2e3f', 1, 'iui', 'stimulation', CURRENT_DATE - INTERVAL '7 days', 'Letrozole + IUI', '{"medications": ["Letrozole 5mg CD3-7"]}', 'Monitoring today. 2 follicles at 16mm and 14mm.', NOW() - INTERVAL '7 days'),

  -- Megan Thomas - Starting soon
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'd0e1f2a3-b4c5-3d4e-7f8a-9b0c1d2e3f4a', 2, 'ivf', 'planning', NULL, 'Antagonist', '{"medications": []}', 'Baseline scheduled for CD2. Previous protocol worked well.', NOW() - INTERVAL '2 days'),

  -- Previous cancelled cycle for Emily
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'b2c3d4e5-f6a7-5b6c-9d0e-1f2a3b4c5d6e', 0, 'iui', 'cancelled', CURRENT_DATE - INTERVAL '60 days', 'Clomid IUI', '{"medications": ["Clomid 50mg"]}', 'Poor response. Only 1 follicle. Converted to timed intercourse.', NOW() - INTERVAL '75 days'),

  -- Previous successful cycle for Megan
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'd0e1f2a3-b4c5-3d4e-7f8a-9b0c1d2e3f4a', 1, 'ivf', 'completed', CURRENT_DATE - INTERVAL '400 days', 'Antagonist', '{"medications": ["Gonal-F 225 IU", "Menopur 75 IU"]}', 'Successful! Delivered healthy baby boy 2023.', NOW() - INTERVAL '450 days');

-- ============================================
-- EMBRYOS (Sample embryos for active cycles)
-- ============================================
INSERT INTO embryos (id, cycle_id, embryo_number, status, cell_count, grade, quality_score, development_stage, biopsy_status, genetic_status, notes, day, created_at)
VALUES
  -- Emily Williams retrieval - Day 3 embryos
  ('e1111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', 1, 'developing', 8, '8A', 'excellent', 'cleavage', 'not_biopsied', NULL, 'Excellent 8-cell, no fragmentation', 3, NOW()),
  ('e2222222-2222-2222-2222-222222222222', '22222222-2222-2222-2222-222222222222', 2, 'developing', 8, '8A-', 'good', 'cleavage', 'not_biopsied', NULL, 'Good 8-cell, <10% fragmentation', 3, NOW()),
  ('e3333333-3333-3333-3333-333333333333', '22222222-2222-2222-2222-222222222222', 3, 'developing', 7, '7B', 'good', 'cleavage', 'not_biopsied', NULL, '7-cell, slight asymmetry', 3, NOW()),
  ('e4444444-4444-4444-4444-444444444444', '22222222-2222-2222-2222-222222222222', 4, 'developing', 6, '6B', 'fair', 'cleavage', 'not_biopsied', NULL, '6-cell, moderate fragmentation', 3, NOW()),
  ('e5555555-5555-5555-5555-555555555555', '22222222-2222-2222-2222-222222222222', 5, 'arrested', 4, '4C', 'poor', 'cleavage', 'not_biopsied', NULL, 'Arrested at 4-cell', 3, NOW()),

  -- Lauren Moore - Blastocysts with PGT-A results
  ('e6666666-6666-6666-6666-666666666666', '77777777-7777-7777-7777-777777777777', 1, 'transferred', NULL, '5AA', 'excellent', 'blastocyst', 'completed', 'euploid', 'Expanded blastocyst, excellent ICM and TE. Transferred today.', 5, NOW() - INTERVAL '1 day'),
  ('e7777777-7777-7777-7777-777777777777', '77777777-7777-7777-7777-777777777777', 2, 'frozen', NULL, '4AB', 'good', 'blastocyst', 'completed', 'euploid', 'Good blastocyst, euploid. Vitrified.', 5, NOW() - INTERVAL '1 day'),
  ('e8888888-8888-8888-8888-888888888888', '77777777-7777-7777-7777-777777777777', 3, 'frozen', NULL, '4BA', 'good', 'blastocyst', 'completed', 'euploid', 'Good blastocyst, euploid. Vitrified.', 5, NOW() - INTERVAL '1 day'),
  ('e9999999-9999-9999-9999-999999999999', '77777777-7777-7777-7777-777777777777', 4, 'discarded', NULL, '3BB', 'fair', 'blastocyst', 'completed', 'aneuploid', 'Aneuploid (Trisomy 21). Discarded per patient consent.', 5, NOW() - INTERVAL '1 day'),
  ('eaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '77777777-7777-7777-7777-777777777777', 5, 'discarded', NULL, '2BC', 'poor', 'blastocyst', 'completed', 'aneuploid', 'Aneuploid (complex). Discarded.', 6, NOW() - INTERVAL '1 day'),

  -- Amanda Davis - Transferred embryo
  ('ebbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '44444444-4444-4444-4444-444444444444', 1, 'transferred', NULL, '5AA', 'excellent', 'blastocyst', 'not_biopsied', NULL, 'Hatching blastocyst. Transferred day 5.', 5, NOW() - INTERVAL '8 days'),
  ('ecccccc-cccc-cccc-cccc-cccccccccccc', '44444444-4444-4444-4444-444444444444', 2, 'frozen', NULL, '4AB', 'good', 'blastocyst', 'not_biopsied', NULL, 'Good blast, frozen for future use.', 5, NOW() - INTERVAL '8 days'),

  -- Stephanie Taylor - Frozen embryos from previous cycle
  ('edddddd-dddd-dddd-dddd-dddddddddddd', '88888888-8888-8888-8888-888888888888', 1, 'frozen', NULL, '4AA', 'excellent', 'blastocyst', 'not_biopsied', NULL, 'From fresh cycle. Thawing for transfer.', 5, NOW() - INTERVAL '60 days'),
  ('eeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', '88888888-8888-8888-8888-888888888888', 2, 'frozen', NULL, '4AB', 'good', 'blastocyst', 'not_biopsied', NULL, 'Backup embryo.', 5, NOW() - INTERVAL '60 days');

-- ============================================
-- APPOINTMENTS (20 sample appointments)
-- ============================================
INSERT INTO appointments (id, patient_id, title, description, appointment_date, appointment_time, duration_minutes, type, status, created_at)
VALUES
  -- Today's appointments
  ('ap111111-1111-1111-1111-111111111111', 'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d', 'Monitoring Ultrasound', 'Day 8 stim check. Measure follicles and E2.', CURRENT_DATE, '08:00:00', 30, 'ultrasound', 'scheduled', NOW()),
  ('ap222222-2222-2222-2222-222222222222', 'b2c3d4e5-f6a7-5b6c-9d0e-1f2a3b4c5d6e', 'Egg Retrieval', 'OR scheduled. NPO after midnight.', CURRENT_DATE, '09:30:00', 60, 'procedure', 'confirmed', NOW()),
  ('ap333333-3333-3333-3333-333333333333', 'a7b8c9d0-e1f2-0a1b-4c5d-6e7f8a9b0c1d', 'Embryo Transfer', 'SET of euploid embryo. Full bladder.', CURRENT_DATE, '11:00:00', 45, 'procedure', 'confirmed', NOW()),
  ('ap444444-4444-4444-4444-444444444444', 'c9d0e1f2-a3b4-2c3d-6e7f-8a9b0c1d2e3f', 'IUI Monitoring', 'Check follicle growth. May trigger today.', CURRENT_DATE, '14:00:00', 30, 'ultrasound', 'scheduled', NOW()),

  -- Tomorrow's appointments
  ('ap555555-5555-5555-5555-555555555555', 'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d', 'Stim Check', 'Day 9 monitoring', CURRENT_DATE + INTERVAL '1 day', '08:30:00', 30, 'ultrasound', 'scheduled', NOW()),
  ('ap666666-6666-6666-6666-666666666666', 'f6a7b8c9-d0e1-9f0a-3b4c-5d6e7f8a9b0c', 'New Patient Consult', 'Discuss treatment options for DOR', CURRENT_DATE + INTERVAL '1 day', '10:00:00', 60, 'consultation', 'confirmed', NOW()),
  ('ap777777-7777-7777-7777-777777777777', 'b8c9d0e1-f2a3-1b2c-5d6e-7f8a9b0c1d2e', 'Lining Check', 'FET prep ultrasound', CURRENT_DATE + INTERVAL '1 day', '13:00:00', 30, 'ultrasound', 'scheduled', NOW()),

  -- This week
  ('ap888888-8888-8888-8888-888888888888', 'd4e5f6a7-b8c9-7d8e-1f2a-3b4c5d6e7f8a', 'Beta hCG', 'Pregnancy test - 14 days post transfer', CURRENT_DATE + INTERVAL '6 days', '09:00:00', 15, 'lab', 'scheduled', NOW()),
  ('ap999999-9999-9999-9999-999999999999', 'e5f6a7b8-c9d0-8e9f-2a3b-4c5d6e7f8a9b', 'First Ultrasound', 'Confirm viability at 6 weeks', CURRENT_DATE + INTERVAL '4 days', '10:30:00', 30, 'ultrasound', 'scheduled', NOW()),
  ('apaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'c9d0e1f2-a3b4-2c3d-6e7f-8a9b0c1d2e3f', 'IUI Procedure', 'Intrauterine insemination', CURRENT_DATE + INTERVAL '2 days', '09:00:00', 30, 'procedure', 'scheduled', NOW()),

  -- Next week
  ('apbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'd0e1f2a3-b4c5-3d4e-7f8a-9b0c1d2e3f4a', 'Baseline Ultrasound', 'CD2 baseline for IVF #2', CURRENT_DATE + INTERVAL '8 days', '08:00:00', 30, 'ultrasound', 'scheduled', NOW()),
  ('apcccccc-cccc-cccc-cccc-cccccccccccc', 'b8c9d0e1-f2a3-1b2c-5d6e-7f8a9b0c1d2e', 'FET Transfer', 'Frozen embryo transfer', CURRENT_DATE + INTERVAL '5 days', '11:00:00', 45, 'procedure', 'scheduled', NOW()),
  ('apdddddd-dddd-dddd-dddd-dddddddddddd', 'a7b8c9d0-e1f2-0a1b-4c5d-6e7f8a9b0c1d', 'Post-Transfer Follow-up', 'Check in after transfer', CURRENT_DATE + INTERVAL '7 days', '14:00:00', 30, 'followup', 'scheduled', NOW()),

  -- Past appointments (completed)
  ('apeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d', 'Initial Consultation', 'New patient intake', CURRENT_DATE - INTERVAL '45 days', '10:00:00', 60, 'consultation', 'completed', NOW() - INTERVAL '45 days'),
  ('apffffff-ffff-ffff-ffff-ffffffffffff', 'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d', 'Baseline Ultrasound', 'Start of IVF cycle', CURRENT_DATE - INTERVAL '7 days', '08:00:00', 30, 'ultrasound', 'completed', NOW() - INTERVAL '7 days'),
  ('ap000001-0001-0001-0001-000000000001', 'b2c3d4e5-f6a7-5b6c-9d0e-1f2a3b4c5d6e', 'Stim Day 1', 'Teaching injection technique', CURRENT_DATE - INTERVAL '12 days', '09:00:00', 45, 'followup', 'completed', NOW() - INTERVAL '12 days'),
  ('ap000002-0002-0002-0002-000000000002', 'c3d4e5f6-a7b8-6c7d-0e1f-2a3b4c5d6e7f', 'Egg Freezing Retrieval', '12 oocytes retrieved', CURRENT_DATE - INTERVAL '30 days', '08:00:00', 60, 'procedure', 'completed', NOW() - INTERVAL '30 days'),
  ('ap000003-0003-0003-0003-000000000003', 'e5f6a7b8-c9d0-8e9f-2a3b-4c5d6e7f8a9b', 'IUI Procedure', 'Successful insemination', CURRENT_DATE - INTERVAL '28 days', '09:00:00', 30, 'procedure', 'completed', NOW() - INTERVAL '28 days'),
  ('ap000004-0004-0004-0004-000000000004', 'e5f6a7b8-c9d0-8e9f-2a3b-4c5d6e7f8a9b', 'Positive Beta!', 'hCG 245 - Pregnant!', CURRENT_DATE - INTERVAL '14 days', '10:00:00', 15, 'lab', 'completed', NOW() - INTERVAL '14 days'),

  -- Cancelled appointment
  ('ap000005-0005-0005-0005-000000000005', 'f6a7b8c9-d0e1-9f0a-3b4c-5d6e7f8a9b0c', 'Monitoring', 'Patient rescheduled', CURRENT_DATE - INTERVAL '3 days', '08:00:00', 30, 'ultrasound', 'cancelled', NOW() - INTERVAL '5 days');

-- ============================================
-- Summary
-- ============================================
-- Run this query to verify the seed data:
-- SELECT
--   (SELECT COUNT(*) FROM patients) as patients,
--   (SELECT COUNT(*) FROM cycles) as cycles,
--   (SELECT COUNT(*) FROM embryos) as embryos,
--   (SELECT COUNT(*) FROM appointments) as appointments;
