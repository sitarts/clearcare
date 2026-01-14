-- Seed test patients for ClearCare IVF Clinic
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/_/sql

INSERT INTO patients_female (am, first_name, last_name, date_of_birth, nationality, mobile, email, city, blood_group, status, request, subfertility_type)
VALUES
  (1001, 'Maria', 'Papadopoulou', '1990-05-15', 'GR', '+30 694 123 4567', 'maria.papadopoulou@example.com', 'Athens', 'A+', 'active', 'IVF', 'Primary'),
  (1002, 'Elena', 'Georgiou', '1988-11-22', 'GR', '+30 697 234 5678', 'elena.georgiou@example.com', 'Thessaloniki', 'O+', 'active', 'ICSI', 'Secondary'),
  (1003, 'Sofia', 'Nikolaou', '1992-03-08', 'GR', '+30 693 345 6789', 'sofia.nikolaou@example.com', 'Patras', 'B+', 'active', 'Egg Freezing', NULL),
  (1004, 'Anna', 'Konstantinou', '1985-07-30', 'CY', '+357 99 123 456', 'anna.konstantinou@example.com', 'Nicosia', 'AB+', 'active', 'FET', NULL),
  (1005, 'Christina', 'Alexandrou', '1991-09-12', 'GR', '+30 698 456 7890', 'christina.alexandrou@example.com', 'Heraklion', 'O-', 'active', 'IUI', NULL),
  (1006, 'Katerina', 'Dimitriou', '1987-01-25', 'GR', '+30 695 567 8901', 'katerina.dimitriou@example.com', 'Larissa', 'A-', 'active', 'IVF', 'Primary'),
  (1007, 'Georgia', 'Vasileiou', '1993-06-18', 'GR', '+30 699 678 9012', 'georgia.vasileiou@example.com', 'Volos', 'B-', 'active', 'Consultation', NULL),
  (1008, 'Ioanna', 'Papageorgiou', '1989-12-03', 'GR', '+30 691 789 0123', 'ioanna.papageorgiou@example.com', 'Rhodes', 'O+', 'active', 'Fertility Preservation', NULL),
  (1009, 'Dimitra', 'Karagianni', '1994-04-27', 'GR', '+30 692 890 1234', 'dimitra.karagianni@example.com', 'Chania', 'AB-', 'active', 'IVF', 'Secondary'),
  (1010, 'Eleni', 'Stavrou', '1986-08-11', 'CY', '+357 96 234 567', 'eleni.stavrou@example.com', 'Limassol', 'A+', 'active', 'ICSI', 'Primary')
ON CONFLICT (am) DO NOTHING;

-- Verify inserted data
SELECT am, last_name, first_name, date_of_birth, city, request
FROM patients_female
WHERE am BETWEEN 1001 AND 1010
ORDER BY am;
