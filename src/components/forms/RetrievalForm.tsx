import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button, Card, CardHeader, CardTitle, CardContent, Input, Select, Textarea, Badge } from '../ui'
import { Syringe, Egg, AlertCircle, CheckCircle } from 'lucide-react'

const retrievalSchema = z.object({
  retrieval_date: z.string().min(1, 'Retrieval date is required'),
  retrieval_time: z.string().min(1, 'Retrieval time is required'),
  physician: z.string().min(1, 'Physician is required'),
  anesthesiologist: z.string().optional(),
  embryologist: z.string().optional(),

  // Procedure details
  sedation_type: z.enum(['general', 'conscious', 'local', 'none']),
  duration_minutes: z.coerce.number().min(1).max(120).optional(),
  difficulty: z.enum(['easy', 'moderate', 'difficult']).optional(),

  // Oocyte results
  left_ovary_oocytes: z.coerce.number().min(0).max(50),
  right_ovary_oocytes: z.coerce.number().min(0).max(50),
  total_oocytes: z.coerce.number().min(0),

  // Oocyte maturity (assessed later)
  mature_mii: z.coerce.number().min(0).optional(),
  immature_mi: z.coerce.number().min(0).optional(),
  immature_gv: z.coerce.number().min(0).optional(),
  degenerated: z.coerce.number().min(0).optional(),

  // Fertilization method
  fertilization_method: z.enum(['ivf', 'icsi', 'split', 'imsi']),
  sperm_source: z.enum(['fresh', 'frozen', 'donor', 'tese']),

  // Complications
  complications: z.array(z.string()).optional(),
  blood_loss_ml: z.coerce.number().min(0).optional(),

  notes: z.string().optional(),
})

type RetrievalFormData = z.infer<typeof retrievalSchema>

interface RetrievalFormProps {
  initialData?: Partial<RetrievalFormData>
  onSubmit: (data: RetrievalFormData) => Promise<void>
  onCancel: () => void
}

const complications = [
  'Vaginal bleeding',
  'Intra-abdominal bleeding',
  'Ovarian torsion',
  'Infection',
  'Bowel injury',
  'Bladder injury',
  'Allergic reaction',
  'OHSS risk',
]

export function RetrievalForm({ initialData, onSubmit, onCancel }: RetrievalFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<RetrievalFormData>({
    resolver: zodResolver(retrievalSchema) as any,
    defaultValues: {
      retrieval_date: initialData?.retrieval_date || new Date().toISOString().split('T')[0],
      retrieval_time: initialData?.retrieval_time || '',
      physician: initialData?.physician || '',
      sedation_type: initialData?.sedation_type || 'conscious',
      left_ovary_oocytes: initialData?.left_ovary_oocytes || 0,
      right_ovary_oocytes: initialData?.right_ovary_oocytes || 0,
      total_oocytes: initialData?.total_oocytes || 0,
      fertilization_method: initialData?.fertilization_method || 'icsi',
      sperm_source: initialData?.sperm_source || 'fresh',
      complications: initialData?.complications || [],
      ...initialData,
    },
  })

  const leftOocytes = watch('left_ovary_oocytes') || 0
  const rightOocytes = watch('right_ovary_oocytes') || 0
  const totalOocytes = leftOocytes + rightOocytes

  const matureMII = watch('mature_mii') || 0
  const immatureMI = watch('immature_mi') || 0
  const immatureGV = watch('immature_gv') || 0
  const degenerated = watch('degenerated') || 0
  const assessedTotal = matureMII + immatureMI + immatureGV + degenerated

  // Auto-update total when left/right changes
  const handleOocyteChange = () => {
    setValue('total_oocytes', leftOocytes + rightOocytes)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit as any)} className="space-y-6">
      {/* Procedure Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Syringe className="h-5 w-5 text-primary-600" />
            Procedure Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Input
              label="Retrieval Date"
              type="date"
              {...register('retrieval_date')}
              error={errors.retrieval_date?.message}
            />
            <Input
              label="Time"
              type="time"
              {...register('retrieval_time')}
              error={errors.retrieval_time?.message}
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
              label="Sedation Type"
              {...register('sedation_type')}
              error={errors.sedation_type?.message}
            >
              <option value="general">General Anesthesia</option>
              <option value="conscious">Conscious Sedation</option>
              <option value="local">Local Anesthesia</option>
              <option value="none">None</option>
            </Select>
            <Input
              label="Duration (minutes)"
              type="number"
              {...register('duration_minutes')}
            />
            <Select
              label="Difficulty"
              {...register('difficulty')}
            >
              <option value="">Select...</option>
              <option value="easy">Easy</option>
              <option value="moderate">Moderate</option>
              <option value="difficult">Difficult</option>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Oocyte Retrieval Results */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Egg className="h-5 w-5 text-amber-600" />
            Oocyte Retrieval
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-4">
              <Input
                label="Left Ovary"
                type="number"
                min={0}
                {...register('left_ovary_oocytes', {
                  onChange: handleOocyteChange,
                })}
              />
              <Input
                label="Right Ovary"
                type="number"
                min={0}
                {...register('right_ovary_oocytes', {
                  onChange: handleOocyteChange,
                })}
              />
            </div>

            <div className="flex items-center justify-center">
              <div className="text-center p-6 bg-amber-50 rounded-xl border-2 border-amber-200">
                <p className="text-small text-amber-700 mb-1">Total Oocytes</p>
                <p className="text-4xl font-bold text-amber-600">{totalOocytes}</p>
                <input type="hidden" {...register('total_oocytes')} value={totalOocytes} />
              </div>
            </div>

            <div className="space-y-4">
              <Select
                label="Fertilization Method"
                {...register('fertilization_method')}
              >
                <option value="ivf">Conventional IVF</option>
                <option value="icsi">ICSI</option>
                <option value="split">Split IVF/ICSI</option>
                <option value="imsi">IMSI</option>
              </Select>
              <Select
                label="Sperm Source"
                {...register('sperm_source')}
              >
                <option value="fresh">Fresh Ejaculate</option>
                <option value="frozen">Frozen Sperm</option>
                <option value="donor">Donor Sperm</option>
                <option value="tese">TESE/MESA</option>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Oocyte Maturity Assessment */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-emerald-600" />
            Maturity Assessment
            {assessedTotal > 0 && (
              <Badge variant={assessedTotal === totalOocytes ? 'success' : 'warning'} className="ml-2">
                {assessedTotal}/{totalOocytes} assessed
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
              <Input
                label="Mature (MII)"
                type="number"
                min={0}
                className="bg-white"
                {...register('mature_mii')}
              />
              <p className="text-xs text-emerald-600 mt-1">Ready for fertilization</p>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <Input
                label="Immature (MI)"
                type="number"
                min={0}
                className="bg-white"
                {...register('immature_mi')}
              />
              <p className="text-xs text-blue-600 mt-1">May mature in culture</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
              <Input
                label="Immature (GV)"
                type="number"
                min={0}
                className="bg-white"
                {...register('immature_gv')}
              />
              <p className="text-xs text-slate-600 mt-1">Germinal vesicle</p>
            </div>
            <div className="p-4 bg-red-50 rounded-lg border border-red-200">
              <Input
                label="Degenerated"
                type="number"
                min={0}
                className="bg-white"
                {...register('degenerated')}
              />
              <p className="text-xs text-red-600 mt-1">Not viable</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Complications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-500" />
            Complications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
            {complications.map((complication) => (
              <label
                key={complication}
                className="flex items-center gap-2 p-2 rounded border border-slate-200 hover:bg-slate-50 cursor-pointer"
              >
                <input
                  type="checkbox"
                  value={complication}
                  {...register('complications')}
                  className="rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-small">{complication}</span>
              </label>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Blood Loss (ml)"
              type="number"
              min={0}
              {...register('blood_loss_ml')}
            />
            <div />
          </div>

          <div className="mt-4">
            <Textarea
              label="Procedure Notes"
              rows={3}
              placeholder="Additional notes about the procedure..."
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
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save Retrieval'}
        </Button>
      </div>
    </form>
  )
}
