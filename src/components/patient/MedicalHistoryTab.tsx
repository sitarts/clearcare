import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../../lib/supabase'
import { Card, CardHeader, CardTitle, CardContent, Button, Badge, Modal, Input, Select, Textarea, useToast } from '../ui'
import { Plus, Pill, Syringe, Heart, Users, Baby, AlertTriangle, Trash2, Edit } from 'lucide-react'
import { format } from 'date-fns'

interface MedicalHistoryTabProps {
  patientId: string
}

// Types for medical data
interface MedicalCondition {
  id: string
  condition_type: string
  condition_name: string
  diagnosis_date: string | null
  is_current: boolean
  treatment: string | null
  notes: string | null
}

interface SurgicalHistory {
  id: string
  procedure_name: string
  procedure_date: string | null
  surgeon: string | null
  hospital: string | null
  indication: string | null
  outcome: string | null
  complications: string | null
  notes: string | null
}

interface Allergy {
  id: string
  medication: string
  reaction: string | null
  severity: string | null
  notes: string | null
}

interface Medication {
  id: string
  medication_name: string
  dosage: string | null
  frequency: string | null
  route: string | null
  start_date: string | null
  end_date: string | null
  indication: string | null
  is_current: boolean
  notes: string | null
}

interface FamilyHistory {
  id: string
  relative: string
  condition: string
  age_of_onset: number | null
  is_deceased: boolean
  notes: string | null
}

interface ObstetricHistory {
  id: string
  pregnancy_number: number
  year: number | null
  outcome: string | null
  delivery_type: string | null
  gestational_weeks: number | null
  birth_weight: number | null
  complications: string | null
  notes: string | null
}

type ModalType = 'condition' | 'surgery' | 'allergy' | 'medication' | 'family' | 'obstetric' | null

export function MedicalHistoryTab({ patientId }: MedicalHistoryTabProps) {
  const [activeModal, setActiveModal] = useState<ModalType>(null)
  const [editingItem, setEditingItem] = useState<any>(null)
  const queryClient = useQueryClient()
  const { addToast } = useToast()

  // Fetch all medical data
  const { data: conditions } = useQuery({
    queryKey: ['medicalHistory', patientId],
    queryFn: async () => {
      const { data } = await supabase
        .from('medical_history')
        .select('*')
        .eq('patient_female_id', patientId)
        .order('created_at', { ascending: false })
      return (data || []) as MedicalCondition[]
    },
  })

  const { data: surgeries } = useQuery({
    queryKey: ['surgicalHistory', patientId],
    queryFn: async () => {
      const { data } = await supabase
        .from('surgical_history')
        .select('*')
        .eq('patient_female_id', patientId)
        .order('procedure_date', { ascending: false })
      return (data || []) as SurgicalHistory[]
    },
  })

  const { data: allergies } = useQuery({
    queryKey: ['allergies', patientId],
    queryFn: async () => {
      const { data } = await supabase
        .from('allergies')
        .select('*')
        .eq('patient_female_id', patientId)
        .order('created_at', { ascending: false })
      return (data || []) as Allergy[]
    },
  })

  const { data: medications } = useQuery({
    queryKey: ['medications', patientId],
    queryFn: async () => {
      const { data } = await supabase
        .from('medications')
        .select('*')
        .eq('patient_female_id', patientId)
        .order('is_current', { ascending: false })
      return (data || []) as Medication[]
    },
  })

  const { data: familyHistory } = useQuery({
    queryKey: ['familyHistory', patientId],
    queryFn: async () => {
      const { data } = await supabase
        .from('family_history')
        .select('*')
        .eq('patient_female_id', patientId)
        .order('created_at', { ascending: false })
      return (data || []) as FamilyHistory[]
    },
  })

  const { data: obstetricHistory } = useQuery({
    queryKey: ['obstetricHistory', patientId],
    queryFn: async () => {
      const { data } = await supabase
        .from('obstetric_history')
        .select('*')
        .eq('patient_id', patientId)
        .order('pregnancy_number', { ascending: true })
      return (data || []) as ObstetricHistory[]
    },
  })

  // Delete mutations
  const deleteMutation = useMutation({
    mutationFn: async ({ table, id }: { table: string; id: string }) => {
      const { error } = await supabase.from(table).delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medicalHistory', patientId] })
      queryClient.invalidateQueries({ queryKey: ['surgicalHistory', patientId] })
      queryClient.invalidateQueries({ queryKey: ['allergies', patientId] })
      queryClient.invalidateQueries({ queryKey: ['medications', patientId] })
      queryClient.invalidateQueries({ queryKey: ['familyHistory', patientId] })
      queryClient.invalidateQueries({ queryKey: ['obstetricHistory', patientId] })
      addToast({ type: 'success', title: 'Deleted', message: 'Record deleted successfully' })
    },
    onError: (error: Error) => {
      addToast({ type: 'error', title: 'Error', message: error.message })
    },
  })

  const handleDelete = (table: string, id: string) => {
    if (confirm('Are you sure you want to delete this record?')) {
      deleteMutation.mutate({ table, id })
    }
  }

  const openAddModal = (type: ModalType) => {
    setEditingItem(null)
    setActiveModal(type)
  }

  const openEditModal = (type: ModalType, item: any) => {
    setEditingItem(item)
    setActiveModal(type)
  }

  const closeModal = () => {
    setActiveModal(null)
    setEditingItem(null)
  }

  return (
    <div className="space-y-6">
      {/* Allergies - Important, show first */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            <CardTitle>Allergies</CardTitle>
          </div>
          <Button size="sm" variant="ghost" leftIcon={<Plus className="h-4 w-4" />} onClick={() => openAddModal('allergy')}>
            Add
          </Button>
        </CardHeader>
        <CardContent>
          {allergies && allergies.length > 0 ? (
            <div className="space-y-3">
              {allergies.map((allergy) => (
                <div key={allergy.id} className="flex items-start justify-between p-3 bg-red-50 rounded-lg border border-red-100">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-red-900">{allergy.medication}</span>
                      {allergy.severity && (
                        <Badge variant={allergy.severity === 'severe' ? 'error' : allergy.severity === 'moderate' ? 'warning' : 'info'}>
                          {allergy.severity}
                        </Badge>
                      )}
                    </div>
                    {allergy.reaction && <p className="text-sm text-red-700 mt-1">Reaction: {allergy.reaction}</p>}
                    {allergy.notes && <p className="text-sm text-slate-600 mt-1">{allergy.notes}</p>}
                  </div>
                  <div className="flex gap-1">
                    <Button size="sm" variant="ghost" onClick={() => openEditModal('allergy', allergy)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => handleDelete('allergies', allergy.id)}>
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-500 text-center py-4">No known allergies</p>
          )}
        </CardContent>
      </Card>

      {/* Current Medications */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Pill className="h-5 w-5 text-blue-500" />
            <CardTitle>Current Medications</CardTitle>
          </div>
          <Button size="sm" variant="ghost" leftIcon={<Plus className="h-4 w-4" />} onClick={() => openAddModal('medication')}>
            Add
          </Button>
        </CardHeader>
        <CardContent>
          {medications && medications.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-2 px-3 text-sm font-medium text-slate-500">Medication</th>
                    <th className="text-left py-2 px-3 text-sm font-medium text-slate-500">Dosage</th>
                    <th className="text-left py-2 px-3 text-sm font-medium text-slate-500">Frequency</th>
                    <th className="text-left py-2 px-3 text-sm font-medium text-slate-500">Status</th>
                    <th className="text-left py-2 px-3 text-sm font-medium text-slate-500">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {medications.map((med) => (
                    <tr key={med.id} className="border-b border-slate-100">
                      <td className="py-2 px-3 font-medium">{med.medication_name}</td>
                      <td className="py-2 px-3">{med.dosage || '-'}</td>
                      <td className="py-2 px-3">{med.frequency || '-'}</td>
                      <td className="py-2 px-3">
                        <Badge variant={med.is_current ? 'success' : 'default'}>
                          {med.is_current ? 'Current' : 'Past'}
                        </Badge>
                      </td>
                      <td className="py-2 px-3">
                        <div className="flex gap-1">
                          <Button size="sm" variant="ghost" onClick={() => openEditModal('medication', med)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => handleDelete('medications', med.id)}>
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-slate-500 text-center py-4">No medications recorded</p>
          )}
        </CardContent>
      </Card>

      {/* Medical Conditions */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-pink-500" />
            <CardTitle>Medical Conditions</CardTitle>
          </div>
          <Button size="sm" variant="ghost" leftIcon={<Plus className="h-4 w-4" />} onClick={() => openAddModal('condition')}>
            Add
          </Button>
        </CardHeader>
        <CardContent>
          {conditions && conditions.length > 0 ? (
            <div className="space-y-3">
              {conditions.map((condition) => (
                <div key={condition.id} className="flex items-start justify-between p-3 bg-slate-50 rounded-lg">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{condition.condition_name}</span>
                      <Badge variant={condition.is_current ? 'warning' : 'default'}>
                        {condition.is_current ? 'Active' : 'Resolved'}
                      </Badge>
                      {condition.condition_type && (
                        <Badge variant="info">{condition.condition_type}</Badge>
                      )}
                    </div>
                    {condition.diagnosis_date && (
                      <p className="text-sm text-slate-500 mt-1">
                        Diagnosed: {format(new Date(condition.diagnosis_date), 'MMM d, yyyy')}
                      </p>
                    )}
                    {condition.treatment && <p className="text-sm text-slate-600 mt-1">Treatment: {condition.treatment}</p>}
                  </div>
                  <div className="flex gap-1">
                    <Button size="sm" variant="ghost" onClick={() => openEditModal('condition', condition)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => handleDelete('medical_history', condition.id)}>
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-500 text-center py-4">No medical conditions recorded</p>
          )}
        </CardContent>
      </Card>

      {/* Surgical History */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Syringe className="h-5 w-5 text-purple-500" />
            <CardTitle>Surgical History</CardTitle>
          </div>
          <Button size="sm" variant="ghost" leftIcon={<Plus className="h-4 w-4" />} onClick={() => openAddModal('surgery')}>
            Add
          </Button>
        </CardHeader>
        <CardContent>
          {surgeries && surgeries.length > 0 ? (
            <div className="space-y-3">
              {surgeries.map((surgery) => (
                <div key={surgery.id} className="flex items-start justify-between p-3 bg-slate-50 rounded-lg">
                  <div>
                    <span className="font-medium">{surgery.procedure_name}</span>
                    <div className="flex gap-4 text-sm text-slate-500 mt-1">
                      {surgery.procedure_date && <span>{format(new Date(surgery.procedure_date), 'MMM d, yyyy')}</span>}
                      {surgery.hospital && <span>{surgery.hospital}</span>}
                    </div>
                    {surgery.indication && <p className="text-sm text-slate-600 mt-1">Indication: {surgery.indication}</p>}
                    {surgery.complications && <p className="text-sm text-red-600 mt-1">Complications: {surgery.complications}</p>}
                  </div>
                  <div className="flex gap-1">
                    <Button size="sm" variant="ghost" onClick={() => openEditModal('surgery', surgery)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => handleDelete('surgical_history', surgery.id)}>
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-500 text-center py-4">No surgical history recorded</p>
          )}
        </CardContent>
      </Card>

      {/* Obstetric History */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Baby className="h-5 w-5 text-teal-500" />
            <CardTitle>Obstetric History</CardTitle>
          </div>
          <Button size="sm" variant="ghost" leftIcon={<Plus className="h-4 w-4" />} onClick={() => openAddModal('obstetric')}>
            Add
          </Button>
        </CardHeader>
        <CardContent>
          {obstetricHistory && obstetricHistory.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-2 px-3 text-sm font-medium text-slate-500">#</th>
                    <th className="text-left py-2 px-3 text-sm font-medium text-slate-500">Year</th>
                    <th className="text-left py-2 px-3 text-sm font-medium text-slate-500">Outcome</th>
                    <th className="text-left py-2 px-3 text-sm font-medium text-slate-500">Delivery</th>
                    <th className="text-left py-2 px-3 text-sm font-medium text-slate-500">Weeks</th>
                    <th className="text-left py-2 px-3 text-sm font-medium text-slate-500">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {obstetricHistory.map((obs) => (
                    <tr key={obs.id} className="border-b border-slate-100">
                      <td className="py-2 px-3 font-medium">G{obs.pregnancy_number}</td>
                      <td className="py-2 px-3">{obs.year || '-'}</td>
                      <td className="py-2 px-3">
                        <Badge variant={obs.outcome === 'live_birth' ? 'success' : obs.outcome === 'miscarriage' ? 'error' : 'default'}>
                          {obs.outcome?.replace('_', ' ') || '-'}
                        </Badge>
                      </td>
                      <td className="py-2 px-3">{obs.delivery_type?.replace('_', ' ') || '-'}</td>
                      <td className="py-2 px-3">{obs.gestational_weeks || '-'}</td>
                      <td className="py-2 px-3">
                        <div className="flex gap-1">
                          <Button size="sm" variant="ghost" onClick={() => openEditModal('obstetric', obs)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => handleDelete('obstetric_history', obs.id)}>
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-slate-500 text-center py-4">No obstetric history recorded</p>
          )}
        </CardContent>
      </Card>

      {/* Family History */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-indigo-500" />
            <CardTitle>Family History</CardTitle>
          </div>
          <Button size="sm" variant="ghost" leftIcon={<Plus className="h-4 w-4" />} onClick={() => openAddModal('family')}>
            Add
          </Button>
        </CardHeader>
        <CardContent>
          {familyHistory && familyHistory.length > 0 ? (
            <div className="space-y-3">
              {familyHistory.map((fh) => (
                <div key={fh.id} className="flex items-start justify-between p-3 bg-slate-50 rounded-lg">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{fh.relative}</span>
                      <span className="text-slate-600">-</span>
                      <span>{fh.condition}</span>
                    </div>
                    {fh.age_of_onset && <p className="text-sm text-slate-500 mt-1">Age of onset: {fh.age_of_onset}</p>}
                    {fh.notes && <p className="text-sm text-slate-600 mt-1">{fh.notes}</p>}
                  </div>
                  <div className="flex gap-1">
                    <Button size="sm" variant="ghost" onClick={() => openEditModal('family', fh)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => handleDelete('family_history', fh.id)}>
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-500 text-center py-4">No family history recorded</p>
          )}
        </CardContent>
      </Card>

      {/* Modals */}
      <AllergyModal
        isOpen={activeModal === 'allergy'}
        onClose={closeModal}
        patientId={patientId}
        editingItem={editingItem}
      />
      <MedicationModal
        isOpen={activeModal === 'medication'}
        onClose={closeModal}
        patientId={patientId}
        editingItem={editingItem}
      />
      <ConditionModal
        isOpen={activeModal === 'condition'}
        onClose={closeModal}
        patientId={patientId}
        editingItem={editingItem}
      />
      <SurgeryModal
        isOpen={activeModal === 'surgery'}
        onClose={closeModal}
        patientId={patientId}
        editingItem={editingItem}
      />
      <FamilyHistoryModal
        isOpen={activeModal === 'family'}
        onClose={closeModal}
        patientId={patientId}
        editingItem={editingItem}
      />
      <ObstetricModal
        isOpen={activeModal === 'obstetric'}
        onClose={closeModal}
        patientId={patientId}
        editingItem={editingItem}
      />
    </div>
  )
}

// Individual Modal Components
function AllergyModal({ isOpen, onClose, patientId, editingItem }: { isOpen: boolean; onClose: () => void; patientId: string; editingItem: any }) {
  const queryClient = useQueryClient()
  const { addToast } = useToast()
  const [formData, setFormData] = useState({
    medication: editingItem?.medication || '',
    reaction: editingItem?.reaction || '',
    severity: editingItem?.severity || '',
    notes: editingItem?.notes || '',
  })

  const mutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      if (editingItem) {
        const { error } = await (supabase.from('allergies') as any).update(data).eq('id', editingItem.id)
        if (error) throw error
      } else {
        const { error } = await (supabase.from('allergies') as any).insert({ ...data, patient_female_id: patientId, patient_type: 'female' })
        if (error) throw error
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allergies', patientId] })
      addToast({ type: 'success', title: 'Saved', message: 'Allergy saved successfully' })
      onClose()
    },
    onError: (error: Error) => {
      addToast({ type: 'error', title: 'Error', message: error.message })
    },
  })

  // Reset form when editingItem changes
  useState(() => {
    setFormData({
      medication: editingItem?.medication || '',
      reaction: editingItem?.reaction || '',
      severity: editingItem?.severity || '',
      notes: editingItem?.notes || '',
    })
  })

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={editingItem ? 'Edit Allergy' : 'Add Allergy'}>
      <form onSubmit={(e) => { e.preventDefault(); mutation.mutate(formData) }} className="space-y-4">
        <Input
          label="Medication/Substance *"
          value={formData.medication}
          onChange={(e) => setFormData({ ...formData, medication: e.target.value })}
          required
        />
        <Input
          label="Reaction"
          value={formData.reaction}
          onChange={(e) => setFormData({ ...formData, reaction: e.target.value })}
          placeholder="e.g., rash, anaphylaxis"
        />
        <Select
          label="Severity"
          value={formData.severity}
          onChange={(e) => setFormData({ ...formData, severity: e.target.value })}
          options={[
            { value: '', label: 'Select severity...' },
            { value: 'mild', label: 'Mild' },
            { value: 'moderate', label: 'Moderate' },
            { value: 'severe', label: 'Severe' },
          ]}
        />
        <Textarea
          label="Notes"
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
        />
        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit" loading={mutation.isPending}>Save</Button>
        </div>
      </form>
    </Modal>
  )
}

function MedicationModal({ isOpen, onClose, patientId, editingItem }: { isOpen: boolean; onClose: () => void; patientId: string; editingItem: any }) {
  const queryClient = useQueryClient()
  const { addToast } = useToast()
  const [formData, setFormData] = useState({
    medication_name: editingItem?.medication_name || '',
    dosage: editingItem?.dosage || '',
    frequency: editingItem?.frequency || '',
    route: editingItem?.route || '',
    indication: editingItem?.indication || '',
    is_current: editingItem?.is_current ?? true,
    notes: editingItem?.notes || '',
  })

  const mutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      if (editingItem) {
        const { error } = await (supabase.from('medications') as any).update(data).eq('id', editingItem.id)
        if (error) throw error
      } else {
        const { error } = await (supabase.from('medications') as any).insert({ ...data, patient_female_id: patientId, patient_type: 'female' })
        if (error) throw error
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medications', patientId] })
      addToast({ type: 'success', title: 'Saved', message: 'Medication saved successfully' })
      onClose()
    },
    onError: (error: Error) => {
      addToast({ type: 'error', title: 'Error', message: error.message })
    },
  })

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={editingItem ? 'Edit Medication' : 'Add Medication'}>
      <form onSubmit={(e) => { e.preventDefault(); mutation.mutate(formData) }} className="space-y-4">
        <Input
          label="Medication Name *"
          value={formData.medication_name}
          onChange={(e) => setFormData({ ...formData, medication_name: e.target.value })}
          required
        />
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Dosage"
            value={formData.dosage}
            onChange={(e) => setFormData({ ...formData, dosage: e.target.value })}
            placeholder="e.g., 10mg"
          />
          <Input
            label="Frequency"
            value={formData.frequency}
            onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
            placeholder="e.g., twice daily"
          />
        </div>
        <Select
          label="Route"
          value={formData.route}
          onChange={(e) => setFormData({ ...formData, route: e.target.value })}
          options={[
            { value: '', label: 'Select route...' },
            { value: 'oral', label: 'Oral' },
            { value: 'subcutaneous', label: 'Subcutaneous' },
            { value: 'intramuscular', label: 'Intramuscular' },
            { value: 'intravenous', label: 'Intravenous' },
            { value: 'topical', label: 'Topical' },
            { value: 'vaginal', label: 'Vaginal' },
            { value: 'other', label: 'Other' },
          ]}
        />
        <Input
          label="Indication"
          value={formData.indication}
          onChange={(e) => setFormData({ ...formData, indication: e.target.value })}
          placeholder="Reason for medication"
        />
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={formData.is_current}
            onChange={(e) => setFormData({ ...formData, is_current: e.target.checked })}
            className="rounded border-slate-300"
          />
          <span className="text-sm">Currently taking this medication</span>
        </label>
        <Textarea
          label="Notes"
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
        />
        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit" loading={mutation.isPending}>Save</Button>
        </div>
      </form>
    </Modal>
  )
}

function ConditionModal({ isOpen, onClose, patientId, editingItem }: { isOpen: boolean; onClose: () => void; patientId: string; editingItem: any }) {
  const queryClient = useQueryClient()
  const { addToast } = useToast()
  const [formData, setFormData] = useState({
    condition_name: editingItem?.condition_name || '',
    condition_type: editingItem?.condition_type || '',
    diagnosis_date: editingItem?.diagnosis_date || '',
    is_current: editingItem?.is_current ?? true,
    treatment: editingItem?.treatment || '',
    notes: editingItem?.notes || '',
  })

  const mutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const cleanData = { ...data, diagnosis_date: data.diagnosis_date || null }
      if (editingItem) {
        const { error } = await (supabase.from('medical_history') as any).update(cleanData).eq('id', editingItem.id)
        if (error) throw error
      } else {
        const { error } = await (supabase.from('medical_history') as any).insert({ ...cleanData, patient_female_id: patientId, patient_type: 'female' })
        if (error) throw error
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medicalHistory', patientId] })
      addToast({ type: 'success', title: 'Saved', message: 'Condition saved successfully' })
      onClose()
    },
    onError: (error: Error) => {
      addToast({ type: 'error', title: 'Error', message: error.message })
    },
  })

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={editingItem ? 'Edit Condition' : 'Add Medical Condition'}>
      <form onSubmit={(e) => { e.preventDefault(); mutation.mutate(formData) }} className="space-y-4">
        <Input
          label="Condition Name *"
          value={formData.condition_name}
          onChange={(e) => setFormData({ ...formData, condition_name: e.target.value })}
          required
        />
        <Select
          label="Condition Type"
          value={formData.condition_type}
          onChange={(e) => setFormData({ ...formData, condition_type: e.target.value })}
          options={[
            { value: '', label: 'Select type...' },
            { value: 'gynecological', label: 'Gynecological' },
            { value: 'endocrine', label: 'Endocrine' },
            { value: 'cardiovascular', label: 'Cardiovascular' },
            { value: 'autoimmune', label: 'Autoimmune' },
            { value: 'infectious', label: 'Infectious' },
            { value: 'genetic', label: 'Genetic' },
            { value: 'psychiatric', label: 'Psychiatric' },
            { value: 'other', label: 'Other' },
          ]}
        />
        <Input
          label="Diagnosis Date"
          type="date"
          value={formData.diagnosis_date}
          onChange={(e) => setFormData({ ...formData, diagnosis_date: e.target.value })}
        />
        <Input
          label="Treatment"
          value={formData.treatment}
          onChange={(e) => setFormData({ ...formData, treatment: e.target.value })}
        />
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={formData.is_current}
            onChange={(e) => setFormData({ ...formData, is_current: e.target.checked })}
            className="rounded border-slate-300"
          />
          <span className="text-sm">Currently active condition</span>
        </label>
        <Textarea
          label="Notes"
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
        />
        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit" loading={mutation.isPending}>Save</Button>
        </div>
      </form>
    </Modal>
  )
}

function SurgeryModal({ isOpen, onClose, patientId, editingItem }: { isOpen: boolean; onClose: () => void; patientId: string; editingItem: any }) {
  const queryClient = useQueryClient()
  const { addToast } = useToast()
  const [formData, setFormData] = useState({
    procedure_name: editingItem?.procedure_name || '',
    procedure_date: editingItem?.procedure_date || '',
    surgeon: editingItem?.surgeon || '',
    hospital: editingItem?.hospital || '',
    indication: editingItem?.indication || '',
    outcome: editingItem?.outcome || '',
    complications: editingItem?.complications || '',
    notes: editingItem?.notes || '',
  })

  const mutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const cleanData = { ...data, procedure_date: data.procedure_date || null }
      if (editingItem) {
        const { error } = await (supabase.from('surgical_history') as any).update(cleanData).eq('id', editingItem.id)
        if (error) throw error
      } else {
        const { error } = await (supabase.from('surgical_history') as any).insert({ ...cleanData, patient_female_id: patientId, patient_type: 'female' })
        if (error) throw error
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['surgicalHistory', patientId] })
      addToast({ type: 'success', title: 'Saved', message: 'Surgery saved successfully' })
      onClose()
    },
    onError: (error: Error) => {
      addToast({ type: 'error', title: 'Error', message: error.message })
    },
  })

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={editingItem ? 'Edit Surgery' : 'Add Surgery'}>
      <form onSubmit={(e) => { e.preventDefault(); mutation.mutate(formData) }} className="space-y-4">
        <Input
          label="Procedure Name *"
          value={formData.procedure_name}
          onChange={(e) => setFormData({ ...formData, procedure_name: e.target.value })}
          required
        />
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Date"
            type="date"
            value={formData.procedure_date}
            onChange={(e) => setFormData({ ...formData, procedure_date: e.target.value })}
          />
          <Input
            label="Hospital"
            value={formData.hospital}
            onChange={(e) => setFormData({ ...formData, hospital: e.target.value })}
          />
        </div>
        <Input
          label="Surgeon"
          value={formData.surgeon}
          onChange={(e) => setFormData({ ...formData, surgeon: e.target.value })}
        />
        <Input
          label="Indication"
          value={formData.indication}
          onChange={(e) => setFormData({ ...formData, indication: e.target.value })}
        />
        <Input
          label="Outcome"
          value={formData.outcome}
          onChange={(e) => setFormData({ ...formData, outcome: e.target.value })}
        />
        <Input
          label="Complications"
          value={formData.complications}
          onChange={(e) => setFormData({ ...formData, complications: e.target.value })}
        />
        <Textarea
          label="Notes"
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
        />
        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit" loading={mutation.isPending}>Save</Button>
        </div>
      </form>
    </Modal>
  )
}

function FamilyHistoryModal({ isOpen, onClose, patientId, editingItem }: { isOpen: boolean; onClose: () => void; patientId: string; editingItem: any }) {
  const queryClient = useQueryClient()
  const { addToast } = useToast()
  const [formData, setFormData] = useState({
    relative: editingItem?.relative || '',
    condition: editingItem?.condition || '',
    age_of_onset: editingItem?.age_of_onset || '',
    is_deceased: editingItem?.is_deceased || false,
    notes: editingItem?.notes || '',
  })

  const mutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const cleanData = { ...data, age_of_onset: data.age_of_onset ? Number(data.age_of_onset) : null }
      if (editingItem) {
        const { error } = await (supabase.from('family_history') as any).update(cleanData).eq('id', editingItem.id)
        if (error) throw error
      } else {
        const { error } = await (supabase.from('family_history') as any).insert({ ...cleanData, patient_female_id: patientId, patient_type: 'female' })
        if (error) throw error
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['familyHistory', patientId] })
      addToast({ type: 'success', title: 'Saved', message: 'Family history saved successfully' })
      onClose()
    },
    onError: (error: Error) => {
      addToast({ type: 'error', title: 'Error', message: error.message })
    },
  })

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={editingItem ? 'Edit Family History' : 'Add Family History'}>
      <form onSubmit={(e) => { e.preventDefault(); mutation.mutate(formData) }} className="space-y-4">
        <Select
          label="Relative *"
          value={formData.relative}
          onChange={(e) => setFormData({ ...formData, relative: e.target.value })}
          options={[
            { value: '', label: 'Select relative...' },
            { value: 'Mother', label: 'Mother' },
            { value: 'Father', label: 'Father' },
            { value: 'Sister', label: 'Sister' },
            { value: 'Brother', label: 'Brother' },
            { value: 'Maternal Grandmother', label: 'Maternal Grandmother' },
            { value: 'Maternal Grandfather', label: 'Maternal Grandfather' },
            { value: 'Paternal Grandmother', label: 'Paternal Grandmother' },
            { value: 'Paternal Grandfather', label: 'Paternal Grandfather' },
            { value: 'Aunt', label: 'Aunt' },
            { value: 'Uncle', label: 'Uncle' },
            { value: 'Other', label: 'Other' },
          ]}
        />
        <Input
          label="Condition *"
          value={formData.condition}
          onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
          required
        />
        <Input
          label="Age of Onset"
          type="number"
          value={formData.age_of_onset}
          onChange={(e) => setFormData({ ...formData, age_of_onset: e.target.value })}
        />
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={formData.is_deceased}
            onChange={(e) => setFormData({ ...formData, is_deceased: e.target.checked })}
            className="rounded border-slate-300"
          />
          <span className="text-sm">Deceased</span>
        </label>
        <Textarea
          label="Notes"
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
        />
        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit" loading={mutation.isPending}>Save</Button>
        </div>
      </form>
    </Modal>
  )
}

function ObstetricModal({ isOpen, onClose, patientId, editingItem }: { isOpen: boolean; onClose: () => void; patientId: string; editingItem: any }) {
  const queryClient = useQueryClient()
  const { addToast } = useToast()
  const [formData, setFormData] = useState({
    pregnancy_number: editingItem?.pregnancy_number || '',
    year: editingItem?.year || '',
    outcome: editingItem?.outcome || '',
    delivery_type: editingItem?.delivery_type || '',
    gestational_weeks: editingItem?.gestational_weeks || '',
    birth_weight: editingItem?.birth_weight || '',
    complications: editingItem?.complications || '',
    notes: editingItem?.notes || '',
  })

  const mutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const cleanData = {
        ...data,
        pregnancy_number: data.pregnancy_number ? Number(data.pregnancy_number) : null,
        year: data.year ? Number(data.year) : null,
        gestational_weeks: data.gestational_weeks ? Number(data.gestational_weeks) : null,
        birth_weight: data.birth_weight ? Number(data.birth_weight) : null,
      }
      if (editingItem) {
        const { error } = await (supabase.from('obstetric_history') as any).update(cleanData).eq('id', editingItem.id)
        if (error) throw error
      } else {
        const { error } = await (supabase.from('obstetric_history') as any).insert({ ...cleanData, patient_id: patientId })
        if (error) throw error
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['obstetricHistory', patientId] })
      addToast({ type: 'success', title: 'Saved', message: 'Obstetric history saved successfully' })
      onClose()
    },
    onError: (error: Error) => {
      addToast({ type: 'error', title: 'Error', message: error.message })
    },
  })

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={editingItem ? 'Edit Pregnancy' : 'Add Pregnancy'}>
      <form onSubmit={(e) => { e.preventDefault(); mutation.mutate(formData) }} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Pregnancy # *"
            type="number"
            min={1}
            value={formData.pregnancy_number}
            onChange={(e) => setFormData({ ...formData, pregnancy_number: e.target.value })}
            required
          />
          <Input
            label="Year"
            type="number"
            min={1950}
            max={2030}
            value={formData.year}
            onChange={(e) => setFormData({ ...formData, year: e.target.value })}
          />
        </div>
        <Select
          label="Outcome"
          value={formData.outcome}
          onChange={(e) => setFormData({ ...formData, outcome: e.target.value })}
          options={[
            { value: '', label: 'Select outcome...' },
            { value: 'live_birth', label: 'Live Birth' },
            { value: 'miscarriage', label: 'Miscarriage' },
            { value: 'stillbirth', label: 'Stillbirth' },
            { value: 'ectopic', label: 'Ectopic' },
            { value: 'termination', label: 'Termination' },
            { value: 'ongoing', label: 'Ongoing' },
          ]}
        />
        <Select
          label="Delivery Type"
          value={formData.delivery_type}
          onChange={(e) => setFormData({ ...formData, delivery_type: e.target.value })}
          options={[
            { value: '', label: 'Select delivery type...' },
            { value: 'vaginal', label: 'Vaginal' },
            { value: 'cesarean', label: 'Cesarean Section' },
            { value: 'assisted', label: 'Assisted (Vacuum/Forceps)' },
            { value: 'not_applicable', label: 'Not Applicable' },
          ]}
        />
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Gestational Weeks"
            type="number"
            min={1}
            max={45}
            value={formData.gestational_weeks}
            onChange={(e) => setFormData({ ...formData, gestational_weeks: e.target.value })}
          />
          <Input
            label="Birth Weight (g)"
            type="number"
            value={formData.birth_weight}
            onChange={(e) => setFormData({ ...formData, birth_weight: e.target.value })}
          />
        </div>
        <Input
          label="Complications"
          value={formData.complications}
          onChange={(e) => setFormData({ ...formData, complications: e.target.value })}
        />
        <Textarea
          label="Notes"
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
        />
        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit" loading={mutation.isPending}>Save</Button>
        </div>
      </form>
    </Modal>
  )
}
