import { useNavigate, Link } from 'react-router-dom'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import { PageContainer } from '../components/layout'
import { useToast } from '../components/ui'
import { PatientForm, type PatientFormData } from '../components/forms'
import { ArrowLeft } from 'lucide-react'

export function NewPatient() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { addToast } = useToast()

  const createPatient = useMutation({
    mutationFn: async (data: PatientFormData) => {
      // Calculate BMI if height and weight are provided
      let bmi: number | undefined
      if (data.height_cm && data.weight_kg) {
        const heightInMeters = Number(data.height_cm) / 100
        bmi = parseFloat((Number(data.weight_kg) / (heightInMeters * heightInMeters)).toFixed(1))
      }

      // Clean up empty strings to nulls
      const cleanedData = Object.fromEntries(
        Object.entries(data).map(([key, value]) => [key, value === '' ? null : value])
      )

      const { data: patient, error } = await supabase
        .from('patients_female')
        .insert({
          ...cleanedData,
          bmi,
        } as any)
        .select()
        .single()

      if (error) throw error
      return patient as any
    },
    onSuccess: (patient: any) => {
      queryClient.invalidateQueries({ queryKey: ['patients'] })
      queryClient.invalidateQueries({ queryKey: ['patientCount'] })
      queryClient.invalidateQueries({ queryKey: ['recentPatients'] })
      addToast({
        type: 'success',
        title: 'Patient created',
        message: `${patient.last_name} ${patient.first_name} has been added successfully.`,
      })
      navigate(`/patients/${patient.id}`)
    },
    onError: (error: Error) => {
      addToast({
        type: 'error',
        title: 'Failed to create patient',
        message: error.message,
      })
    },
  })

  const handleSubmit = async (data: PatientFormData) => {
    await createPatient.mutateAsync(data)
  }

  const handleCancel = () => {
    navigate('/patients')
  }

  return (
    <PageContainer>
      {/* Back link */}
      <Link
        to="/patients"
        className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back to Patients</span>
      </Link>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-display text-slate-900">New Patient</h1>
        <p className="mt-1 text-body text-slate-500">
          Fill in the patient information below. Fields marked with * are required.
        </p>
      </div>

      {/* Form */}
      <PatientForm
        mode="create"
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isLoading={createPatient.isPending}
      />
    </PageContainer>
  )
}
