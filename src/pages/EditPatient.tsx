import { useParams, useNavigate, Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import { PageContainer } from '../components/layout'
import { useToast } from '../components/ui'
import { PatientForm, type PatientFormData } from '../components/forms'
import { ArrowLeft } from 'lucide-react'

export function EditPatient() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { addToast } = useToast()

  const { data: patient, isLoading } = useQuery({
    queryKey: ['patient', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('patients_female')
        .select('*')
        .eq('id', id as string)
        .single()
      if (error) throw error
      return data as any
    },
    enabled: !!id,
  })

  const updatePatient = useMutation({
    mutationFn: async (data: PatientFormData) => {
      // Clean up empty strings to nulls
      // Note: BMI is a generated column in the database, calculated automatically
      const cleanedData = Object.fromEntries(
        Object.entries(data).map(([key, value]) => [key, value === '' ? null : value])
      )

      const { data: updated, error } = await (supabase
        .from('patients_female') as any)
        .update({
          ...cleanedData,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id as string)
        .select()
        .single()

      if (error) throw error
      return updated as any
    },
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ['patients'] })
      queryClient.invalidateQueries({ queryKey: ['patient', id] })
      queryClient.invalidateQueries({ queryKey: ['recentPatients'] })
      addToast({
        type: 'success',
        title: 'Patient updated',
        message: `${updated.last_name} ${updated.first_name} has been updated successfully.`,
      })
      navigate(`/patients/${id}`)
    },
    onError: (error: Error) => {
      addToast({
        type: 'error',
        title: 'Failed to update patient',
        message: error.message,
      })
    },
  })

  const handleSubmit = async (data: PatientFormData) => {
    await updatePatient.mutateAsync(data)
  }

  const handleCancel = () => {
    navigate(`/patients/${id}`)
  }

  if (isLoading) {
    return (
      <PageContainer>
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-slate-200 rounded w-48" />
          <div className="h-40 bg-slate-200 rounded" />
          <div className="h-40 bg-slate-200 rounded" />
        </div>
      </PageContainer>
    )
  }

  if (!patient) {
    return (
      <PageContainer>
        <div className="text-center py-12">
          <p className="text-slate-500">Patient not found</p>
          <Link to="/patients" className="text-primary-600 hover:underline mt-2 inline-block">
            Back to Patients
          </Link>
        </div>
      </PageContainer>
    )
  }

  // Transform patient data for the form
  const defaultValues: Partial<PatientFormData> = {
    am: patient.am || undefined,
    first_name: patient.first_name || '',
    last_name: patient.last_name || '',
    maiden_name: patient.maiden_name || '',
    date_of_birth: patient.date_of_birth || '',
    nationality: patient.nationality || '',
    mother_name: patient.mother_name || '',
    father_name: patient.father_name || '',
    occupation: patient.occupation || '',
    amka: patient.amka || '',
    eopyy_number: patient.eopyy_number || '',
    insurance_provider: patient.insurance_provider || '',
    insurance_number: patient.insurance_number || '',
    mobile: patient.mobile || '',
    landline: patient.landline || '',
    email: patient.email || '',
    address: patient.address || '',
    city: patient.city || '',
    postal_code: patient.postal_code || '',
    country: patient.country || 'GR',
    blood_group: patient.blood_group || '',
    height_cm: patient.height_cm || undefined,
    weight_kg: patient.weight_kg || undefined,
    smoking: patient.smoking || 'unknown',
    alcohol: patient.alcohol || 'unknown',
    exercise: patient.exercise || 'unknown',
    status: patient.status || 'active',
    request: patient.request || '',
    subfertility_type: patient.subfertility_type || '',
    referral_source: patient.referral_source || '',
    first_visit_date: patient.first_visit_date || '',
    notes: patient.notes || '',
  }

  return (
    <PageContainer>
      {/* Back link */}
      <Link
        to={`/patients/${id}`}
        className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back to Patient</span>
      </Link>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-display text-slate-900">Edit Patient</h1>
        <p className="mt-1 text-body text-slate-500">
          Update information for {patient.last_name} {patient.first_name}
        </p>
      </div>

      {/* Form */}
      <PatientForm
        mode="edit"
        defaultValues={defaultValues}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isLoading={updatePatient.isPending}
      />
    </PageContainer>
  )
}
