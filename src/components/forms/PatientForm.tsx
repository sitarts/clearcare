import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button, Card, CardHeader, CardTitle, CardContent, Input, Textarea, Select } from '../ui'
import { Save, X } from 'lucide-react'

const patientSchema = z.object({
  // Required Fields
  am: z.coerce.number().min(1, 'AM is required'),
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().min(1, 'Last name is required'),
  date_of_birth: z.string().min(1, 'Date of birth is required'),

  // Personal Info
  maiden_name: z.string().optional(),
  nationality: z.string().optional(),
  mother_name: z.string().optional(),
  father_name: z.string().optional(),
  occupation: z.string().optional(),

  // Identification
  amka: z.string().optional(),
  eopyy_number: z.string().optional(),
  insurance_provider: z.string().optional(),
  insurance_number: z.string().optional(),

  // Contact
  mobile: z.string().optional(),
  landline: z.string().optional(),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  address: z.string().optional(),
  city: z.string().optional(),
  postal_code: z.string().optional(),
  country: z.string().optional(),

  // Physical
  blood_group: z.string().optional(),
  height_cm: z.coerce.number().optional().or(z.literal('')),
  weight_kg: z.coerce.number().optional().or(z.literal('')),

  // Lifestyle
  smoking: z.string().optional(),
  alcohol: z.string().optional(),
  exercise: z.string().optional(),

  // Clinical
  status: z.string().optional(),
  request: z.string().optional(),
  subfertility_type: z.string().optional(),
  referral_source: z.string().optional(),
  first_visit_date: z.string().optional(),
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
  { value: '', label: 'Select...' },
  { value: 'GR', label: 'Greek' },
  { value: 'CY', label: 'Cypriot' },
  { value: 'AL', label: 'Albanian' },
  { value: 'BG', label: 'Bulgarian' },
  { value: 'RO', label: 'Romanian' },
  { value: 'GB', label: 'British' },
  { value: 'DE', label: 'German' },
  { value: 'FR', label: 'French' },
  { value: 'IT', label: 'Italian' },
  { value: 'Other', label: 'Other' },
]

const bloodGroupOptions = [
  { value: '', label: 'Select...' },
  { value: 'A+', label: 'A+' },
  { value: 'A-', label: 'A-' },
  { value: 'B+', label: 'B+' },
  { value: 'B-', label: 'B-' },
  { value: 'AB+', label: 'AB+' },
  { value: 'AB-', label: 'AB-' },
  { value: 'O+', label: 'O+' },
  { value: 'O-', label: 'O-' },
]

const statusOptions = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'archived', label: 'Archived' },
]

const requestOptions = [
  { value: '', label: 'Select...' },
  { value: 'IVF', label: 'IVF' },
  { value: 'ICSI', label: 'ICSI' },
  { value: 'IUI', label: 'IUI' },
  { value: 'FET', label: 'Frozen Embryo Transfer' },
  { value: 'Egg Freezing', label: 'Egg Freezing' },
  { value: 'Fertility Preservation', label: 'Fertility Preservation' },
  { value: 'Consultation', label: 'Consultation' },
  { value: 'Second Opinion', label: 'Second Opinion' },
  { value: 'Other', label: 'Other' },
]

const subfertilityTypeOptions = [
  { value: '', label: 'Select...' },
  { value: 'Primary', label: 'Primary' },
  { value: 'Secondary', label: 'Secondary' },
]

const insuranceOptions = [
  { value: '', label: 'Select...' },
  { value: 'EOPYY', label: 'EOPYY' },
  { value: 'Private', label: 'Private Insurance' },
  { value: 'Self-pay', label: 'Self-pay' },
  { value: 'Other', label: 'Other' },
]

const yesNoUnknownOptions = [
  { value: 'unknown', label: 'Unknown' },
  { value: 'yes', label: 'Yes' },
  { value: 'no', label: 'No' },
]

const referralOptions = [
  { value: '', label: 'Select...' },
  { value: 'Doctor Referral', label: 'Doctor Referral' },
  { value: 'Internet', label: 'Internet Search' },
  { value: 'Friend/Family', label: 'Friend/Family' },
  { value: 'Social Media', label: 'Social Media' },
  { value: 'Previous Patient', label: 'Previous Patient' },
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
      status: 'active',
      smoking: 'unknown',
      alcohol: 'unknown',
      exercise: 'unknown',
      country: 'GR',
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
              label="AM (Patient ID) *"
              type="number"
              {...register('am')}
              error={errors.am?.message}
              hint="Unique patient number"
            />
            <Input
              label="Last Name *"
              {...register('last_name')}
              error={errors.last_name?.message}
            />
            <Input
              label="First Name *"
              {...register('first_name')}
              error={errors.first_name?.message}
            />
            <Input
              label="Maiden Name"
              {...register('maiden_name')}
            />
            <Input
              label="Date of Birth *"
              type="date"
              {...register('date_of_birth')}
              error={errors.date_of_birth?.message}
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

      {/* Identification & Insurance */}
      <Card>
        <CardHeader>
          <CardTitle>Identification & Insurance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Input
              label="AMKA"
              {...register('amka')}
              hint="Social Security Number"
            />
            <Input
              label="EOPYY Number"
              {...register('eopyy_number')}
            />
            <Select
              label="Insurance Provider"
              options={insuranceOptions}
              {...register('insurance_provider')}
            />
            <Input
              label="Insurance Number"
              {...register('insurance_number')}
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Select
              label="Blood Group"
              options={bloodGroupOptions}
              {...register('blood_group')}
            />
            <Input
              label="Height (cm)"
              type="number"
              {...register('height_cm')}
            />
            <Input
              label="Weight (kg)"
              type="number"
              step="0.1"
              {...register('weight_kg')}
            />
          </div>

          {/* Lifestyle */}
          <div className="mt-6 pt-6 border-t border-slate-100">
            <h4 className="text-sm font-medium text-slate-700 mb-4">Lifestyle</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Select
                label="Smoking"
                options={yesNoUnknownOptions}
                {...register('smoking')}
              />
              <Select
                label="Alcohol"
                options={yesNoUnknownOptions}
                {...register('alcohol')}
              />
              <Select
                label="Exercise"
                options={yesNoUnknownOptions}
                {...register('exercise')}
              />
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
            <Select
              label="Referral Source"
              options={referralOptions}
              {...register('referral_source')}
            />
            <Input
              label="First Visit Date"
              type="date"
              {...register('first_visit_date')}
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
