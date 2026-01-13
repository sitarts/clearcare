import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button, Card, CardHeader, CardTitle, CardContent, Input, Select, Textarea, Badge } from '../ui'
import { Baby, ArrowRight, CheckCircle, AlertTriangle } from 'lucide-react'
import type { Embryo } from '../../types/embryo'

const transferSchema = z.object({
  transfer_date: z.string().min(1, 'Transfer date is required'),
  transfer_time: z.string().min(1, 'Transfer time is required'),
  physician: z.string().min(1, 'Physician is required'),
  embryologist: z.string().optional(),
  nurse: z.string().optional(),

  // Embryos selected for transfer
  embryo_ids: z.array(z.string()).min(1, 'Select at least one embryo'),
  embryos_transferred: z.coerce.number().min(1).max(3),

  // Transfer details
  transfer_day: z.coerce.number().min(2).max(6),
  transfer_type: z.enum(['fresh', 'frozen']),
  catheter_type: z.string().optional(),
  catheter_load: z.enum(['easy', 'moderate', 'difficult']).optional(),

  // Procedure details
  bladder_fullness: z.enum(['empty', 'partial', 'full', 'overfull']).optional(),
  uterine_position: z.enum(['anteverted', 'retroverted', 'axial']).optional(),
  cervix_difficulty: z.enum(['easy', 'moderate', 'difficult', 'tenaculum']).optional(),

  // Quality checks
  ultrasound_guidance: z.boolean().default(true),
  flash_seen: z.boolean().optional(),
  mucus_present: z.boolean().optional(),
  blood_on_catheter: z.boolean().optional(),
  retained_embryos: z.boolean().optional(),

  // Medication
  valium_given: z.boolean().optional(),
  progesterone_support: z.enum(['vaginal', 'im', 'both']).optional(),

  notes: z.string().optional(),
})

type TransferFormData = z.infer<typeof transferSchema>

interface TransferFormProps {
  availableEmbryos: Embryo[]
  initialData?: Partial<TransferFormData>
  onSubmit: (data: TransferFormData) => Promise<void>
  onCancel: () => void
}

export function TransferForm({ availableEmbryos, initialData, onSubmit, onCancel }: TransferFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<TransferFormData>({
    resolver: zodResolver(transferSchema) as any,
    defaultValues: {
      transfer_date: initialData?.transfer_date || new Date().toISOString().split('T')[0],
      transfer_time: initialData?.transfer_time || '',
      physician: initialData?.physician || '',
      embryo_ids: initialData?.embryo_ids || [],
      embryos_transferred: initialData?.embryos_transferred || 1,
      transfer_day: initialData?.transfer_day || 5,
      transfer_type: initialData?.transfer_type || 'fresh',
      ultrasound_guidance: initialData?.ultrasound_guidance ?? true,
      progesterone_support: initialData?.progesterone_support || 'vaginal',
      ...initialData,
    },
  })

  const selectedEmbryoIds = watch('embryo_ids') || []

  // Filter embryos available for transfer
  const transferableEmbryos = availableEmbryos.filter(
    (e) => e.status === 'developing' || e.status === 'frozen' || e.status === 'thawed'
  )

  const selectedEmbryos = transferableEmbryos.filter((e) => selectedEmbryoIds.includes(e.id))

  const handleEmbryoToggle = (embryoId: string) => {
    const current = selectedEmbryoIds
    if (current.includes(embryoId)) {
      setValue('embryo_ids', current.filter((id) => id !== embryoId))
      setValue('embryos_transferred', current.length - 1)
    } else if (current.length < 3) {
      setValue('embryo_ids', [...current, embryoId])
      setValue('embryos_transferred', current.length + 1)
    }
  }

  const getQualityColor = (quality: string) => {
    switch (quality) {
      case 'excellent': return 'border-emerald-400 bg-emerald-50'
      case 'good': return 'border-blue-400 bg-blue-50'
      case 'fair': return 'border-amber-400 bg-amber-50'
      default: return 'border-slate-300 bg-slate-50'
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit as any)} className="space-y-6">
      {/* Procedure Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Baby className="h-5 w-5 text-teal-600" />
            Transfer Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Input
              label="Transfer Date"
              type="date"
              {...register('transfer_date')}
              error={errors.transfer_date?.message}
            />
            <Input
              label="Time"
              type="time"
              {...register('transfer_time')}
              error={errors.transfer_time?.message}
            />
            <Input
              label="Physician"
              {...register('physician')}
              error={errors.physician?.message}
            />
            <Input
              label="Embryologist"
              {...register('embryologist')}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <Select
              label="Transfer Type"
              {...register('transfer_type')}
            >
              <option value="fresh">Fresh Transfer</option>
              <option value="frozen">Frozen Embryo Transfer (FET)</option>
            </Select>
            <Select
              label="Transfer Day"
              {...register('transfer_day')}
            >
              <option value={3}>Day 3 (Cleavage)</option>
              <option value={5}>Day 5 (Blastocyst)</option>
              <option value={6}>Day 6 (Blastocyst)</option>
            </Select>
            <Input
              label="Catheter Type"
              placeholder="e.g., Wallace, Cook"
              {...register('catheter_type')}
            />
          </div>
        </CardContent>
      </Card>

      {/* Embryo Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Select Embryos for Transfer
            <Badge variant={selectedEmbryoIds.length > 0 ? 'info' : 'warning'}>
              {selectedEmbryoIds.length} selected
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {transferableEmbryos.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              <AlertTriangle className="h-8 w-8 mx-auto mb-2 text-amber-500" />
              <p>No embryos available for transfer</p>
              <p className="text-small">Add embryos in the Embryology tab first</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {transferableEmbryos.map((embryo) => {
                  const isSelected = selectedEmbryoIds.includes(embryo.id)
                  return (
                    <button
                      key={embryo.id}
                      type="button"
                      onClick={() => handleEmbryoToggle(embryo.id)}
                      className={`
                        p-3 rounded-lg border-2 text-left transition-all
                        ${isSelected
                          ? 'border-primary-500 bg-primary-50 ring-2 ring-primary-200'
                          : getQualityColor(embryo.quality)
                        }
                        ${selectedEmbryoIds.length >= 3 && !isSelected ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-md'}
                      `}
                      disabled={selectedEmbryoIds.length >= 3 && !isSelected}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-mono font-semibold">E{embryo.embryo_number}</span>
                        {isSelected && (
                          <CheckCircle className="h-4 w-4 text-primary-600" />
                        )}
                      </div>
                      <p className="text-small font-medium">{embryo.grade}</p>
                      <p className="text-xs text-slate-500 capitalize">{embryo.quality}</p>
                      <Badge size="sm" variant="info" className="mt-1">
                        Day {embryo.day}
                      </Badge>
                    </button>
                  )
                })}
              </div>

              {selectedEmbryos.length > 0 && (
                <div className="mt-4 p-4 bg-slate-50 rounded-lg">
                  <h4 className="font-medium mb-2">Selected for Transfer:</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedEmbryos.map((embryo) => (
                      <Badge key={embryo.id} variant="info" size="md">
                        E{embryo.embryo_number} - {embryo.grade} ({embryo.quality})
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <input type="hidden" {...register('embryo_ids')} />
              <input type="hidden" {...register('embryos_transferred')} />
              {errors.embryo_ids && (
                <p className="text-small text-red-600 mt-2">{errors.embryo_ids.message}</p>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Procedure Assessment */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ArrowRight className="h-5 w-5 text-slate-600" />
            Procedure Assessment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Select
              label="Bladder Fullness"
              {...register('bladder_fullness')}
            >
              <option value="">Select...</option>
              <option value="empty">Empty</option>
              <option value="partial">Partially Full</option>
              <option value="full">Full</option>
              <option value="overfull">Overfull</option>
            </Select>
            <Select
              label="Uterine Position"
              {...register('uterine_position')}
            >
              <option value="">Select...</option>
              <option value="anteverted">Anteverted</option>
              <option value="retroverted">Retroverted</option>
              <option value="axial">Axial</option>
            </Select>
            <Select
              label="Cervix Difficulty"
              {...register('cervix_difficulty')}
            >
              <option value="">Select...</option>
              <option value="easy">Easy</option>
              <option value="moderate">Moderate</option>
              <option value="difficult">Difficult</option>
              <option value="tenaculum">Required Tenaculum</option>
            </Select>
            <Select
              label="Catheter Load"
              {...register('catheter_load')}
            >
              <option value="">Select...</option>
              <option value="easy">Easy</option>
              <option value="moderate">Moderate</option>
              <option value="difficult">Difficult</option>
            </Select>
          </div>

          {/* Quality Checks */}
          <div className="mt-6">
            <h4 className="text-small font-medium text-slate-700 mb-3">Quality Checks</h4>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              <label className="flex items-center gap-2 p-3 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer">
                <input
                  type="checkbox"
                  {...register('ultrasound_guidance')}
                  className="rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-small">US Guidance</span>
              </label>
              <label className="flex items-center gap-2 p-3 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer">
                <input
                  type="checkbox"
                  {...register('flash_seen')}
                  className="rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-small">Flash Seen</span>
              </label>
              <label className="flex items-center gap-2 p-3 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer">
                <input
                  type="checkbox"
                  {...register('mucus_present')}
                  className="rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-small">Mucus Present</span>
              </label>
              <label className="flex items-center gap-2 p-3 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer">
                <input
                  type="checkbox"
                  {...register('blood_on_catheter')}
                  className="rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-small">Blood on Catheter</span>
              </label>
              <label className="flex items-center gap-2 p-3 rounded-lg border border-red-200 hover:bg-red-50 cursor-pointer">
                <input
                  type="checkbox"
                  {...register('retained_embryos')}
                  className="rounded border-red-300 text-red-600 focus:ring-red-500"
                />
                <span className="text-small text-red-700">Retained Embryo</span>
              </label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Medication */}
      <Card>
        <CardHeader>
          <CardTitle>Post-Transfer Support</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                {...register('valium_given')}
                className="rounded border-slate-300 text-primary-600 focus:ring-primary-500"
              />
              <span>Valium Given</span>
            </label>
            <Select
              label="Progesterone Support"
              {...register('progesterone_support')}
            >
              <option value="vaginal">Vaginal Only</option>
              <option value="im">IM Only</option>
              <option value="both">Both Vaginal + IM</option>
            </Select>
          </div>

          <div className="mt-4">
            <Textarea
              label="Transfer Notes"
              rows={3}
              placeholder="Additional notes about the transfer procedure..."
              {...register('notes')}
            />
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-end gap-3">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting || selectedEmbryoIds.length === 0}>
          {isSubmitting ? 'Saving...' : 'Complete Transfer'}
        </Button>
      </div>
    </form>
  )
}
