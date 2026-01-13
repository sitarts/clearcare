import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button, Card, CardHeader, CardTitle, CardContent, Input, Textarea, Select } from '../ui'
import { Save, X } from 'lucide-react'

const cycleSchema = z.object({
  female_id: z.string().min(1, 'Patient is required'),
  cycle_number: z.coerce.number().min(1).optional(),
  cycle_type: z.string().min(1, 'Cycle type is required'),
  start_date: z.string().optional(),
  status: z.string().optional(),
  protocol: z.string().optional(),
  medication: z.string().optional(),
  notes: z.string().optional(),
})

export type CycleFormData = z.infer<typeof cycleSchema>

interface CycleFormProps {
  defaultValues?: Partial<CycleFormData>
  onSubmit: (data: CycleFormData) => Promise<void>
  onCancel: () => void
  isLoading?: boolean
  mode: 'create' | 'edit'
  patients?: Array<{ id: string; surname: string; name: string; am: number | null }>
  preselectedPatientId?: string
}

const cycleTypeOptions = [
  { value: 'IVF', label: 'IVF' },
  { value: 'ICSI', label: 'ICSI' },
  { value: 'IUI', label: 'IUI' },
  { value: 'FRET', label: 'FRET (Frozen Embryo Transfer)' },
  { value: 'OI', label: 'Ovulation Induction' },
  { value: 'Egg Freezing', label: 'Egg Freezing' },
  { value: 'Natural', label: 'Natural Cycle' },
]

const statusOptions = [
  { value: 'planning', label: 'Planning' },
  { value: 'stimulation', label: 'Stimulation' },
  { value: 'trigger', label: 'Trigger' },
  { value: 'retrieval', label: 'Retrieval' },
  { value: 'fertilization', label: 'Fertilization' },
  { value: 'culture', label: 'Culture' },
  { value: 'transfer', label: 'Transfer' },
  { value: 'tww', label: '2WW (Two Week Wait)' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
]

const protocolOptions = [
  { value: 'Long Agonist', label: 'Long Agonist' },
  { value: 'Short Agonist', label: 'Short Agonist' },
  { value: 'Antagonist', label: 'Antagonist' },
  { value: 'Mini IVF', label: 'Mini IVF' },
  { value: 'Natural', label: 'Natural Cycle' },
  { value: 'Modified Natural', label: 'Modified Natural' },
  { value: 'Dual Stim', label: 'Dual Stimulation' },
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
    formState: { errors },
  } = useForm<CycleFormData>({
    resolver: zodResolver(cycleSchema) as any,
    defaultValues: {
      status: 'planning',
      female_id: preselectedPatientId || '',
      ...defaultValues,
    },
  })

  const patientOptions = patients.map((p) => ({
    value: p.id,
    label: `${p.surname} ${p.name} (AM: ${p.am || 'N/A'})`,
  }))

  return (
    <form onSubmit={handleSubmit(onSubmit as any)} className="space-y-6">
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Cycle Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Select
              label="Patient *"
              options={patientOptions}
              {...register('female_id')}
              error={errors.female_id?.message}
              disabled={!!preselectedPatientId}
            />
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
            />
            <Input
              label="Start Date"
              type="date"
              {...register('start_date')}
            />
            <Select
              label="Status"
              options={statusOptions}
              {...register('status')}
            />
            <Select
              label="Protocol"
              options={protocolOptions}
              {...register('protocol')}
            />
          </div>
        </CardContent>
      </Card>

      {/* Medication */}
      <Card>
        <CardHeader>
          <CardTitle>Medication Protocol</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            label="Medications"
            {...register('medication')}
            placeholder="Enter medication protocol details..."
            hint="e.g., Gonal-F 225 IU daily, Cetrotide 0.25mg from Day 6"
          />
        </CardContent>
      </Card>

      {/* Notes */}
      <Card>
        <CardHeader>
          <CardTitle>Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            label="Additional Notes"
            {...register('notes')}
            placeholder="Any additional notes about this cycle..."
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
