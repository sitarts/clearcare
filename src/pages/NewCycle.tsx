import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import { PageContainer } from '../components/layout'
import { useToast } from '../components/ui'
import { CycleForm, type CycleFormData } from '../components/forms'
import { ArrowLeft } from 'lucide-react'

export function NewCycle() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const preselectedPatientId = searchParams.get('patient') || undefined
  const queryClient = useQueryClient()
  const { addToast } = useToast()

  // Fetch patients with their couple IDs for dropdown
  const { data: patients } = useQuery({
    queryKey: ['patientsDropdown'],
    queryFn: async () => {
      // Get patients
      const { data: patientsData } = await supabase
        .from('patients_female')
        .select('id, first_name, last_name, am')
        .order('last_name', { ascending: true })

      if (!patientsData || patientsData.length === 0) return []

      // Get couples for these patients
      const patientIds = patientsData.map((p: any) => p.id)
      const { data: couplesData } = await supabase
        .from('couples')
        .select('id, female_id')
        .in('female_id', patientIds)

      const couples = (couplesData || []) as { id: string; female_id: string }[]

      // Merge couple_id into patients
      return patientsData.map((p: any) => ({
        ...p,
        couple_id: couples.find(c => c.female_id === p.id)?.id
      }))
    },
  })

  // Get next cycle number for selected patient
  const { data: nextCycleNumber } = useQuery({
    queryKey: ['nextCycleNumber', preselectedPatientId],
    queryFn: async () => {
      if (!preselectedPatientId) return 1
      const { data } = await supabase
        .from('cycles')
        .select('cycle_number')
        .eq('female_id', preselectedPatientId)
        .order('cycle_number', { ascending: false })
        .limit(1)
      const cycles = (data || []) as any[]
      return (cycles[0]?.cycle_number || 0) + 1
    },
    enabled: !!preselectedPatientId,
  })

  const createCycle = useMutation({
    mutationFn: async (data: CycleFormData) => {
      const { data: cycle, error } = await supabase
        .from('cycles')
        .insert({
          ...data,
          cycle_number: data.cycle_number || nextCycleNumber || 1,
        } as any)
        .select()
        .single()

      if (error) throw error
      return cycle as any
    },
    onSuccess: (cycle: any) => {
      queryClient.invalidateQueries({ queryKey: ['cycles'] })
      queryClient.invalidateQueries({ queryKey: ['allCycles'] })
      queryClient.invalidateQueries({ queryKey: ['activeCycles'] })
      queryClient.invalidateQueries({ queryKey: ['recentCycles'] })
      queryClient.invalidateQueries({ queryKey: ['patientCycles', cycle.female_id] })
      addToast({
        type: 'success',
        title: 'Cycle created',
        message: `Cycle #${cycle.cycle_number} has been created successfully.`,
      })
      navigate(`/cycles/${cycle.id}`)
    },
    onError: (error: Error) => {
      addToast({
        type: 'error',
        title: 'Failed to create cycle',
        message: error.message,
      })
    },
  })

  const handleSubmit = async (data: CycleFormData) => {
    await createCycle.mutateAsync(data)
  }

  const handleCancel = () => {
    if (preselectedPatientId) {
      navigate(`/patients/${preselectedPatientId}`)
    } else {
      navigate('/cycles')
    }
  }

  return (
    <PageContainer>
      {/* Back link */}
      <Link
        to={preselectedPatientId ? `/patients/${preselectedPatientId}` : '/cycles'}
        className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back</span>
      </Link>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-display text-slate-900">New Treatment Cycle</h1>
        <p className="mt-1 text-body text-slate-500">
          Create a new treatment cycle. Select the patient and cycle type to get started.
        </p>
      </div>

      {/* Form */}
      <CycleForm
        mode="create"
        patients={patients || []}
        preselectedPatientId={preselectedPatientId}
        defaultValues={{
          cycle_number: nextCycleNumber,
        }}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isLoading={createCycle.isPending}
      />
    </PageContainer>
  )
}
