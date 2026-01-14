import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button, Card, CardHeader, CardTitle, CardContent, Input, Textarea, Select } from '../ui'
import { Save, X } from 'lucide-react'

const cycleSchema = z.object({
  // Required fields
  female_id: z.string().min(1, 'Patient is required'),
  cycle_type: z.string().min(1, 'Cycle type is required'),

  // Auto-populated from patient
  am_female: z.coerce.number().optional(),

  // Optional fields
  cycle_number: z.coerce.number().min(1).optional(),
  cycle_status: z.string().optional(),

  // Dates
  lmp_date: z.string().optional(),
  stimulation_start_date: z.string().optional(),

  // Protocol details
  protocol: z.string().optional(),
  fsh_type: z.string().optional(),
  fsh_starting_dose: z.coerce.number().optional().or(z.literal('')),

  // Staff
  doctor: z.string().optional(),
  embryologist: z.string().optional(),

  // Notes
  stimulation_notes: z.string().optional(),
})

export type CycleFormData = z.infer<typeof cycleSchema>

interface Patient {
  id: string
  first_name: string
  last_name: string
  am: number
}

interface CycleFormProps {
  defaultValues?: Partial<CycleFormData>
  onSubmit: (data: CycleFormData) => Promise<void>
  onCancel: () => void
  isLoading?: boolean
  mode: 'create' | 'edit'
  patients?: Patient[]
  preselectedPatientId?: string
}

const cycleTypeOptions = [
  { value: '', label: 'Select cycle type...' },
  { value: 'ivf_icsi', label: 'IVF-ICSI' },
  { value: 'ivf_conventional', label: 'IVF Conventional' },
  { value: 'iui', label: 'IUI' },
  { value: 'fret', label: 'FRET (Frozen Embryo Transfer)' },
  { value: 'oocyte_freezing', label: 'Oocyte Freezing' },
  { value: 'natural_cycle', label: 'Natural Cycle' },
  { value: 'donor_oocyte', label: 'Donor Oocyte' },
]

const cycleStatusOptions = [
  { value: 'planned', label: 'Planned' },
  { value: 'stimulation', label: 'Stimulation' },
  { value: 'trigger', label: 'Trigger' },
  { value: 'opu', label: 'OPU (Egg Retrieval)' },
  { value: 'fertilization', label: 'Fertilization' },
  { value: 'transfer', label: 'Transfer' },
  { value: 'luteal', label: 'Luteal Phase' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
]

const protocolOptions = [
  { value: '', label: 'Select protocol...' },
  { value: 'antagonist', label: 'Antagonist' },
  { value: 'long_agonist', label: 'Long Agonist' },
  { value: 'short_agonist', label: 'Short Agonist' },
  { value: 'mini_ivf', label: 'Mini IVF' },
  { value: 'natural', label: 'Natural Cycle' },
  { value: 'modified_natural', label: 'Modified Natural' },
  { value: 'dual_stim', label: 'Dual Stimulation' },
  { value: 'freeze_all', label: 'Freeze All' },
]

const fshTypeOptions = [
  { value: '', label: 'Select FSH type...' },
  { value: 'Gonal-F', label: 'Gonal-F' },
  { value: 'Puregon', label: 'Puregon' },
  { value: 'Menopur', label: 'Menopur' },
  { value: 'Elonva', label: 'Elonva' },
  { value: 'Bemfola', label: 'Bemfola' },
  { value: 'Rekovelle', label: 'Rekovelle' },
  { value: 'Pergoveris', label: 'Pergoveris' },
  { value: 'Other', label: 'Other' },
]

export function CycleForm({
  defaultValues,
  onSubmit,
  onCancel,
  isLoading,
  mode,
  patients = [],
  preselectedPatientId,
}: CycleFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CycleFormData>({
    resolver: zodResolver(cycleSchema) as any,
    defaultValues: {
      cycle_status: 'planned',
      female_id: preselectedPatientId || '',
      ...defaultValues,
    },
  })

  const selectedPatientId = watch('female_id')
  const selectedPatient = patients.find(p => p.id === selectedPatientId)

  // Update am_female when patient changes
  const handlePatientChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const patientId = e.target.value
    const patient = patients.find(p => p.id === patientId)
    if (patient) {
      setValue('am_female', patient.am)
    }
  }

  const patientOptions = [
    { value: '', label: 'Select patient...' },
    ...patients.map((p) => ({
      value: p.id,
      label: `${p.last_name} ${p.first_name} (AM: ${p.am})`,
    })),
  ]

  return (
    <form onSubmit={handleSubmit(onSubmit as any)} className="space-y-6">
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Cycle Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Patient *
              </label>
              <select
                {...register('female_id')}
                onChange={(e) => {
                  register('female_id').onChange(e)
                  handlePatientChange(e)
                }}
                disabled={!!preselectedPatientId}
                className="block w-full px-3 py-2.5 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-slate-50 disabled:text-slate-500"
              >
                {patientOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              {errors.female_id && (
                <p className="mt-1 text-sm text-red-600">{errors.female_id.message}</p>
              )}
              {selectedPatient && (
                <p className="mt-1 text-xs text-slate-500">
                  AM: {selectedPatient.am}
                </p>
              )}
            </div>

            <Select
              label="Cycle Type *"
              options={cycleTypeOptions}
              {...register('cycle_type')}
              error={errors.cycle_type?.message}
            />

            <Input
              label="Cycle Number"
              type="number"
              min={1}
              {...register('cycle_number')}
              hint="Auto-assigned if empty"
            />

            <Select
              label="Status"
              options={cycleStatusOptions}
              {...register('cycle_status')}
            />

            <Input
              label="LMP Date"
              type="date"
              {...register('lmp_date')}
              hint="Last Menstrual Period"
            />

            <Input
              label="Stimulation Start Date"
              type="date"
              {...register('stimulation_start_date')}
            />
          </div>

          {/* Hidden field for am_female */}
          <input type="hidden" {...register('am_female')} />
        </CardContent>
      </Card>

      {/* Protocol Details */}
      <Card>
        <CardHeader>
          <CardTitle>Protocol Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Select
              label="Protocol"
              options={protocolOptions}
              {...register('protocol')}
            />

            <Select
              label="FSH Type"
              options={fshTypeOptions}
              {...register('fsh_type')}
            />

            <Input
              label="FSH Starting Dose (IU)"
              type="number"
              min={0}
              step={25}
              {...register('fsh_starting_dose')}
              hint="e.g., 150, 225, 300"
            />
          </div>
        </CardContent>
      </Card>

      {/* Staff */}
      <Card>
        <CardHeader>
          <CardTitle>Staff Assignment</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Doctor"
              {...register('doctor')}
              placeholder="Attending physician"
            />

            <Input
              label="Embryologist"
              {...register('embryologist')}
              placeholder="Assigned embryologist"
            />
          </div>
        </CardContent>
      </Card>

      {/* Notes */}
      <Card>
        <CardHeader>
          <CardTitle>Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            label="Stimulation Notes"
            {...register('stimulation_notes')}
            placeholder="Any notes about the stimulation protocol, patient response, etc..."
          />
        </CardContent>
      </Card>

      {/* Form Actions */}
      <div className="flex items-center justify-end gap-3 pt-4">
        <Button type="button" variant="secondary" onClick={onCancel}>
          <X className="h-4 w-4 mr-2" />
          Cancel
        </Button>
        <Button type="submit" loading={isLoading}>
          <Save className="h-4 w-4 mr-2" />
          {mode === 'create' ? 'Create Cycle' : 'Save Changes'}
        </Button>
      </div>
    </form>
  )
}
