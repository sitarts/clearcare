import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button, Card, CardHeader, CardTitle, CardContent, Input, Textarea, Select } from '../ui'
import { Save, X } from 'lucide-react'

const patientSchema = z.object({
  // Personal Info
  surname: z.string().min(1, 'Surname is required'),
  name: z.string().min(1, 'Name is required'),
  dob: z.string().optional(),
  nationality: z.string().optional(),
  mother_name: z.string().optional(),
  father_name: z.string().optional(),
  occupation: z.string().optional(),

  // Identification
  am: z.coerce.number().optional(),
  amka: z.string().optional(),
  afm: z.string().optional(),
  insurance: z.string().optional(),

  // Contact
  phone: z.string().optional(),
  mobile: z.string().optional(),
  landline: z.string().optional(),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  address: z.string().optional(),
  city: z.string().optional(),
  postal_code: z.string().optional(),

  // Physical
  blood_type: z.string().optional(),
  rhesus: z.string().optional(),
  height: z.coerce.number().optional(),
  weight: z.coerce.number().optional(),

  // Lifestyle
  smoking: z.boolean().optional(),
  alcohol: z.boolean().optional(),

  // Clinical
  status: z.string().optional(),
  request: z.string().optional(),
  subfertility_type: z.string().optional(),
  notes: z.string().optional(),
})

export type PatientFormData = z.infer<typeof patientSchema>

interface PatientFormProps {
  defaultValues?: Partial<PatientFormData>
  onSubmit: (data: PatientFormData) => Promise<void>
  onCancel: () => void
  isLoading?: boolean
  mode: 'create' | 'edit'
}

const nationalityOptions = [
  { value: 'Greek', label: 'Greek' },
  { value: 'Cypriot', label: 'Cypriot' },
  { value: 'Albanian', label: 'Albanian' },
  { value: 'Bulgarian', label: 'Bulgarian' },
  { value: 'Romanian', label: 'Romanian' },
  { value: 'British', label: 'British' },
  { value: 'German', label: 'German' },
  { value: 'French', label: 'French' },
  { value: 'Italian', label: 'Italian' },
  { value: 'Other', label: 'Other' },
]

const bloodTypeOptions = [
  { value: 'A', label: 'A' },
  { value: 'B', label: 'B' },
  { value: 'AB', label: 'AB' },
  { value: 'O', label: 'O' },
]

const rhesusOptions = [
  { value: '+', label: 'Positive (+)' },
  { value: '-', label: 'Negative (-)' },
]

const statusOptions = [
  { value: 'active', label: 'Active' },
  { value: 'pregnant', label: 'Pregnant' },
  { value: 'completed', label: 'Completed' },
  { value: 'inactive', label: 'Inactive' },
]

const requestOptions = [
  { value: 'IVF', label: 'IVF' },
  { value: 'ICSI', label: 'ICSI' },
  { value: 'IUI', label: 'IUI' },
  { value: 'Egg Freezing', label: 'Egg Freezing' },
  { value: 'Fertility Preservation', label: 'Fertility Preservation' },
  { value: 'Consultation', label: 'Consultation' },
  { value: 'Second Opinion', label: 'Second Opinion' },
  { value: 'Other', label: 'Other' },
]

const subfertilityTypeOptions = [
  { value: 'Primary', label: 'Primary' },
  { value: 'Secondary', label: 'Secondary' },
]

const insuranceOptions = [
  { value: 'EOPYY', label: 'EOPYY' },
  { value: 'Private', label: 'Private Insurance' },
  { value: 'Self-pay', label: 'Self-pay' },
  { value: 'Other', label: 'Other' },
]

export function PatientForm({ defaultValues, onSubmit, onCancel, isLoading, mode }: PatientFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PatientFormData>({
    resolver: zodResolver(patientSchema) as any,
    defaultValues: {
      smoking: false,
      alcohol: false,
      ...defaultValues,
    },
  })

  return (
    <form onSubmit={handleSubmit(onSubmit as any)} className="space-y-6">
      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Input
              label="Surname *"
              {...register('surname')}
              error={errors.surname?.message}
            />
            <Input
              label="Name *"
              {...register('name')}
              error={errors.name?.message}
            />
            <Input
              label="Date of Birth"
              type="date"
              {...register('dob')}
              error={errors.dob?.message}
            />
            <Select
              label="Nationality"
              options={nationalityOptions}
              {...register('nationality')}
            />
            <Input
              label="Father's Name"
              {...register('father_name')}
            />
            <Input
              label="Mother's Name"
              {...register('mother_name')}
            />
            <Input
              label="Occupation"
              {...register('occupation')}
            />
          </div>
        </CardContent>
      </Card>

      {/* Identification */}
      <Card>
        <CardHeader>
          <CardTitle>Identification</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Input
              label="AM (Patient ID)"
              type="number"
              {...register('am')}
              error={errors.am?.message}
            />
            <Input
              label="AMKA"
              {...register('amka')}
              hint="Social Security Number"
            />
            <Input
              label="AFM"
              {...register('afm')}
              hint="Tax ID"
            />
            <Select
              label="Insurance"
              options={insuranceOptions}
              {...register('insurance')}
            />
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Input
              label="Mobile Phone"
              type="tel"
              {...register('mobile')}
            />
            <Input
              label="Phone"
              type="tel"
              {...register('phone')}
            />
            <Input
              label="Landline"
              type="tel"
              {...register('landline')}
            />
            <Input
              label="Email"
              type="email"
              {...register('email')}
              error={errors.email?.message}
            />
            <Input
              label="Address"
              {...register('address')}
            />
            <Input
              label="City"
              {...register('city')}
            />
            <Input
              label="Postal Code"
              {...register('postal_code')}
            />
          </div>
        </CardContent>
      </Card>

      {/* Physical Information */}
      <Card>
        <CardHeader>
          <CardTitle>Physical Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Select
              label="Blood Type"
              options={bloodTypeOptions}
              {...register('blood_type')}
            />
            <Select
              label="Rhesus"
              options={rhesusOptions}
              {...register('rhesus')}
            />
            <Input
              label="Height (cm)"
              type="number"
              {...register('height')}
            />
            <Input
              label="Weight (kg)"
              type="number"
              step="0.1"
              {...register('weight')}
            />
          </div>

          {/* Lifestyle */}
          <div className="mt-6 pt-6 border-t border-slate-100">
            <h4 className="text-sm font-medium text-slate-700 mb-4">Lifestyle</h4>
            <div className="flex gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  {...register('smoking')}
                  className="w-4 h-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm text-slate-700">Smoking</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  {...register('alcohol')}
                  className="w-4 h-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm text-slate-700">Alcohol</span>
              </label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Clinical Information */}
      <Card>
        <CardHeader>
          <CardTitle>Clinical Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Select
              label="Status"
              options={statusOptions}
              {...register('status')}
            />
            <Select
              label="Reason for Visit"
              options={requestOptions}
              {...register('request')}
            />
            <Select
              label="Subfertility Type"
              options={subfertilityTypeOptions}
              {...register('subfertility_type')}
            />
          </div>
          <div className="mt-4">
            <Textarea
              label="Notes"
              {...register('notes')}
              placeholder="Additional notes about the patient..."
            />
          </div>
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
          {mode === 'create' ? 'Create Patient' : 'Save Changes'}
        </Button>
      </div>
    </form>
  )
}
