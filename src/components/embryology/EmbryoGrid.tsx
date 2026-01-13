import { useState } from 'react'
import { Card, Button, Modal, ModalFooter, Input, Select } from '../ui'
import { Plus, Snowflake, ArrowRight, FlaskConical, Trash2, Dna } from 'lucide-react'
import {
  type Embryo,
  type EmbryoQuality,
  type EmbryoStatus,
  getQualityColor,
  getStatusColor,
} from '../../types/embryo'

interface EmbryoGridProps {
  embryos: Embryo[]
  onAddEmbryo: (embryo: Partial<Embryo>) => void
  onUpdateEmbryo: (id: string, updates: Partial<Embryo>) => void
  onDeleteEmbryo: (id: string) => void
  cycleId: string
  readOnly?: boolean
}

const qualityOptions = [
  { value: 'excellent', label: 'Excellent' },
  { value: 'good', label: 'Good' },
  { value: 'fair', label: 'Fair' },
  { value: 'poor', label: 'Poor' },
]

const statusOptions = [
  { value: 'developing', label: 'Developing' },
  { value: 'transferred', label: 'Transferred' },
  { value: 'frozen', label: 'Frozen' },
  { value: 'thawed', label: 'Thawed' },
  { value: 'biopsied', label: 'Biopsied' },
  { value: 'arrested', label: 'Arrested' },
  { value: 'discarded', label: 'Discarded' },
]

const dayOptions = [
  { value: '0', label: 'Day 0 (Retrieval)' },
  { value: '1', label: 'Day 1 (Fertilization)' },
  { value: '2', label: 'Day 2' },
  { value: '3', label: 'Day 3' },
  { value: '4', label: 'Day 4 (Morula)' },
  { value: '5', label: 'Day 5 (Blastocyst)' },
  { value: '6', label: 'Day 6 (Blastocyst)' },
]

const expansionOptions = [
  { value: '1', label: '1 - Early blastocyst' },
  { value: '2', label: '2 - Blastocyst' },
  { value: '3', label: '3 - Full blastocyst' },
  { value: '4', label: '4 - Expanded' },
  { value: '5', label: '5 - Hatching' },
  { value: '6', label: '6 - Hatched' },
]

const gradeOptions = [
  { value: 'A', label: 'A - Excellent' },
  { value: 'B', label: 'B - Good' },
  { value: 'C', label: 'C - Fair' },
]

const pgtOptions = [
  { value: 'pending', label: 'Pending' },
  { value: 'euploid', label: 'Euploid (Normal)' },
  { value: 'aneuploid', label: 'Aneuploid (Abnormal)' },
  { value: 'mosaic', label: 'Mosaic' },
  { value: 'no_result', label: 'No Result' },
]

export function EmbryoGrid({
  embryos,
  onAddEmbryo,
  onUpdateEmbryo,
  onDeleteEmbryo,
  cycleId,
  readOnly = false,
}: EmbryoGridProps) {
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingEmbryo, setEditingEmbryo] = useState<Embryo | null>(null)
  const [newEmbryo, setNewEmbryo] = useState({
    day: '3',
    cell_count: '',
    expansion: '',
    icm_grade: '',
    te_grade: '',
    quality: 'good' as EmbryoQuality,
    status: 'developing' as EmbryoStatus,
    pgt_result: '',
    notes: '',
  })

  const handleAdd = () => {
    const nextNumber = embryos.length + 1
    const day = parseInt(newEmbryo.day)

    let grade = ''
    if (day <= 3 && newEmbryo.cell_count) {
      grade = `${newEmbryo.cell_count}-cell`
    } else if (day >= 5 && newEmbryo.expansion) {
      grade = `${newEmbryo.expansion}${newEmbryo.icm_grade || ''}${newEmbryo.te_grade || ''}`
    }

    onAddEmbryo({
      cycle_id: cycleId,
      embryo_number: nextNumber,
      day,
      cell_count: newEmbryo.cell_count ? parseInt(newEmbryo.cell_count) : undefined,
      expansion: newEmbryo.expansion ? parseInt(newEmbryo.expansion) as any : undefined,
      icm_grade: newEmbryo.icm_grade as any || undefined,
      te_grade: newEmbryo.te_grade as any || undefined,
      grade: grade || 'Not graded',
      quality: newEmbryo.quality,
      status: newEmbryo.status,
      pgt_result: newEmbryo.pgt_result as any || undefined,
      notes: newEmbryo.notes || undefined,
    })

    setShowAddModal(false)
    setNewEmbryo({
      day: '3',
      cell_count: '',
      expansion: '',
      icm_grade: '',
      te_grade: '',
      quality: 'good',
      status: 'developing',
      pgt_result: '',
      notes: '',
    })
  }

  const handleUpdate = () => {
    if (!editingEmbryo) return

    const day = editingEmbryo.day
    let grade = editingEmbryo.grade

    if (day <= 3 && editingEmbryo.cell_count) {
      grade = `${editingEmbryo.cell_count}-cell`
    } else if (day >= 5 && editingEmbryo.expansion) {
      grade = `${editingEmbryo.expansion}${editingEmbryo.icm_grade || ''}${editingEmbryo.te_grade || ''}`
    }

    onUpdateEmbryo(editingEmbryo.id, { ...editingEmbryo, grade })
    setEditingEmbryo(null)
  }

  const getStatusIcon = (status: EmbryoStatus) => {
    switch (status) {
      case 'frozen': return <Snowflake className="h-3 w-3" />
      case 'transferred': return <ArrowRight className="h-3 w-3" />
      case 'biopsied': return <Dna className="h-3 w-3" />
      default: return <FlaskConical className="h-3 w-3" />
    }
  }

  const getPgtColor = (result?: string) => {
    switch (result) {
      case 'euploid': return 'bg-emerald-100 text-emerald-800'
      case 'aneuploid': return 'bg-coral-100 text-coral-800'
      case 'mosaic': return 'bg-amber-100 text-amber-800'
      case 'pending': return 'bg-blue-100 text-blue-800'
      default: return 'bg-slate-100 text-slate-600'
    }
  }

  // Group embryos by day for display
  const embryosByDay = embryos.reduce((acc, embryo) => {
    const day = embryo.day
    if (!acc[day]) acc[day] = []
    acc[day].push(embryo)
    return acc
  }, {} as Record<number, Embryo[]>)

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card padding="sm">
          <p className="text-small text-slate-500">Total</p>
          <p className="text-h2 font-semibold text-slate-900">{embryos.length}</p>
        </Card>
        <Card padding="sm">
          <p className="text-small text-slate-500">Developing</p>
          <p className="text-h2 font-semibold text-blue-600">
            {embryos.filter((e) => e.status === 'developing').length}
          </p>
        </Card>
        <Card padding="sm">
          <p className="text-small text-slate-500">Transferred</p>
          <p className="text-h2 font-semibold text-teal-600">
            {embryos.filter((e) => e.status === 'transferred').length}
          </p>
        </Card>
        <Card padding="sm">
          <p className="text-small text-slate-500">Frozen</p>
          <p className="text-h2 font-semibold text-cyan-600">
            {embryos.filter((e) => e.status === 'frozen').length}
          </p>
        </Card>
        <Card padding="sm">
          <p className="text-small text-slate-500">Excellent/Good</p>
          <p className="text-h2 font-semibold text-emerald-600">
            {embryos.filter((e) => e.quality === 'excellent' || e.quality === 'good').length}
          </p>
        </Card>
      </div>

      {/* Add Button */}
      {!readOnly && (
        <div className="flex justify-end">
          <Button leftIcon={<Plus className="h-4 w-4" />} onClick={() => setShowAddModal(true)}>
            Add Embryo
          </Button>
        </div>
      )}

      {/* Embryo Grid by Day */}
      {embryos.length === 0 ? (
        <Card className="text-center py-12">
          <FlaskConical className="h-12 w-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-h3 text-slate-900 mb-2">No embryos recorded</h3>
          <p className="text-body text-slate-500 mb-4">
            Start tracking embryo development after retrieval
          </p>
          {!readOnly && (
            <Button leftIcon={<Plus className="h-4 w-4" />} onClick={() => setShowAddModal(true)}>
              Add First Embryo
            </Button>
          )}
        </Card>
      ) : (
        <div className="space-y-6">
          {[0, 1, 2, 3, 4, 5, 6].map((day) => {
            const dayEmbryos = embryosByDay[day] || []
            if (dayEmbryos.length === 0) return null

            return (
              <div key={day}>
                <h3 className="text-h3 text-slate-900 mb-3">
                  Day {day}
                  <span className="text-small font-normal text-slate-500 ml-2">
                    {day === 0 && '(Retrieval)'}
                    {day === 1 && '(Fertilization Check)'}
                    {day === 3 && '(Cleavage)'}
                    {day === 5 && '(Blastocyst)'}
                  </span>
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                  {dayEmbryos.map((embryo) => (
                    <div
                      key={embryo.id}
                      className={`
                        relative p-4 rounded-lg border-2 transition-all
                        ${getQualityColor(embryo.quality)}
                        ${!readOnly ? 'cursor-pointer hover:shadow-md' : ''}
                      `}
                      onClick={() => !readOnly && setEditingEmbryo(embryo)}
                    >
                      {/* Embryo Number */}
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-lg font-bold">#{embryo.embryo_number}</span>
                        <span className={`text-tiny px-1.5 py-0.5 rounded ${getStatusColor(embryo.status)}`}>
                          {getStatusIcon(embryo.status)}
                        </span>
                      </div>

                      {/* Grade */}
                      <p className="font-semibold text-sm mb-1">{embryo.grade}</p>

                      {/* Status */}
                      <p className="text-tiny capitalize">{embryo.status}</p>

                      {/* PGT Result */}
                      {embryo.pgt_result && (
                        <div className={`mt-2 text-tiny px-2 py-0.5 rounded ${getPgtColor(embryo.pgt_result)}`}>
                          PGT: {embryo.pgt_result}
                        </div>
                      )}

                      {/* Frozen indicator */}
                      {embryo.status === 'frozen' && (
                        <Snowflake className="absolute top-2 right-2 h-4 w-4 text-cyan-500" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Add Embryo Modal */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Add Embryo" size="lg">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Development Day"
              options={dayOptions}
              value={newEmbryo.day}
              onChange={(e) => setNewEmbryo({ ...newEmbryo, day: e.target.value })}
            />
            <Select
              label="Status"
              options={statusOptions}
              value={newEmbryo.status}
              onChange={(e) => setNewEmbryo({ ...newEmbryo, status: e.target.value as EmbryoStatus })}
            />
          </div>

          {parseInt(newEmbryo.day) <= 3 ? (
            <Input
              label="Cell Count"
              type="number"
              value={newEmbryo.cell_count}
              onChange={(e) => setNewEmbryo({ ...newEmbryo, cell_count: e.target.value })}
              hint="Expected: Day 2 = 4 cells, Day 3 = 8 cells"
            />
          ) : (
            <div className="grid grid-cols-3 gap-4">
              <Select
                label="Expansion"
                options={expansionOptions}
                value={newEmbryo.expansion}
                onChange={(e) => setNewEmbryo({ ...newEmbryo, expansion: e.target.value })}
              />
              <Select
                label="ICM Grade"
                options={gradeOptions}
                value={newEmbryo.icm_grade}
                onChange={(e) => setNewEmbryo({ ...newEmbryo, icm_grade: e.target.value })}
              />
              <Select
                label="TE Grade"
                options={gradeOptions}
                value={newEmbryo.te_grade}
                onChange={(e) => setNewEmbryo({ ...newEmbryo, te_grade: e.target.value })}
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Quality"
              options={qualityOptions}
              value={newEmbryo.quality}
              onChange={(e) => setNewEmbryo({ ...newEmbryo, quality: e.target.value as EmbryoQuality })}
            />
            <Select
              label="PGT Result"
              options={pgtOptions}
              value={newEmbryo.pgt_result}
              onChange={(e) => setNewEmbryo({ ...newEmbryo, pgt_result: e.target.value })}
            />
          </div>

          <Input
            label="Notes"
            value={newEmbryo.notes}
            onChange={(e) => setNewEmbryo({ ...newEmbryo, notes: e.target.value })}
            placeholder="Any observations..."
          />
        </div>

        <ModalFooter>
          <Button variant="secondary" onClick={() => setShowAddModal(false)}>
            Cancel
          </Button>
          <Button onClick={handleAdd}>Add Embryo</Button>
        </ModalFooter>
      </Modal>

      {/* Edit Embryo Modal */}
      <Modal
        isOpen={!!editingEmbryo}
        onClose={() => setEditingEmbryo(null)}
        title={`Edit Embryo #${editingEmbryo?.embryo_number}`}
        size="lg"
      >
        {editingEmbryo && (
          <>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Select
                  label="Development Day"
                  options={dayOptions}
                  value={editingEmbryo.day.toString()}
                  onChange={(e) =>
                    setEditingEmbryo({ ...editingEmbryo, day: parseInt(e.target.value) })
                  }
                />
                <Select
                  label="Status"
                  options={statusOptions}
                  value={editingEmbryo.status}
                  onChange={(e) =>
                    setEditingEmbryo({ ...editingEmbryo, status: e.target.value as EmbryoStatus })
                  }
                />
              </div>

              {editingEmbryo.day <= 3 ? (
                <Input
                  label="Cell Count"
                  type="number"
                  value={editingEmbryo.cell_count?.toString() || ''}
                  onChange={(e) =>
                    setEditingEmbryo({
                      ...editingEmbryo,
                      cell_count: e.target.value ? parseInt(e.target.value) : undefined,
                    })
                  }
                />
              ) : (
                <div className="grid grid-cols-3 gap-4">
                  <Select
                    label="Expansion"
                    options={expansionOptions}
                    value={editingEmbryo.expansion?.toString() || ''}
                    onChange={(e) =>
                      setEditingEmbryo({
                        ...editingEmbryo,
                        expansion: e.target.value ? (parseInt(e.target.value) as any) : undefined,
                      })
                    }
                  />
                  <Select
                    label="ICM Grade"
                    options={gradeOptions}
                    value={editingEmbryo.icm_grade || ''}
                    onChange={(e) =>
                      setEditingEmbryo({
                        ...editingEmbryo,
                        icm_grade: e.target.value as any || undefined,
                      })
                    }
                  />
                  <Select
                    label="TE Grade"
                    options={gradeOptions}
                    value={editingEmbryo.te_grade || ''}
                    onChange={(e) =>
                      setEditingEmbryo({
                        ...editingEmbryo,
                        te_grade: e.target.value as any || undefined,
                      })
                    }
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <Select
                  label="Quality"
                  options={qualityOptions}
                  value={editingEmbryo.quality}
                  onChange={(e) =>
                    setEditingEmbryo({ ...editingEmbryo, quality: e.target.value as EmbryoQuality })
                  }
                />
                <Select
                  label="PGT Result"
                  options={pgtOptions}
                  value={editingEmbryo.pgt_result || ''}
                  onChange={(e) =>
                    setEditingEmbryo({
                      ...editingEmbryo,
                      pgt_result: e.target.value as any || undefined,
                    })
                  }
                />
              </div>

              <Input
                label="Notes"
                value={editingEmbryo.notes || ''}
                onChange={(e) => setEditingEmbryo({ ...editingEmbryo, notes: e.target.value })}
              />
            </div>

            <ModalFooter>
              <Button
                variant="danger"
                onClick={() => {
                  onDeleteEmbryo(editingEmbryo.id)
                  setEditingEmbryo(null)
                }}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
              <Button variant="secondary" onClick={() => setEditingEmbryo(null)}>
                Cancel
              </Button>
              <Button onClick={handleUpdate}>Save Changes</Button>
            </ModalFooter>
          </>
        )}
      </Modal>
    </div>
  )
}
