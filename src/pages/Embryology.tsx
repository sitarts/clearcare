import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { PageContainer } from '../components/layout'
import { Card, CardHeader, CardTitle, CardContent, Button, Badge, Select, Modal, ModalFooter } from '../components/ui'
import { Microscope, Search, Filter, Snowflake, Egg, Baby, TrendingUp, ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { format } from 'date-fns'
import { type Embryo, getQualityColor, getStatusColor } from '../types/embryo'

type FilterStatus = 'all' | 'frozen' | 'developing' | 'transferred'
type FilterQuality = 'all' | 'excellent' | 'good' | 'fair' | 'poor'

// Extended type for embryo with patient info
interface EmbryoWithPatient extends Embryo {
  patient_name: string
  cycle_number: number
}

export function Embryology() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('all')
  const [qualityFilter, setQualityFilter] = useState<FilterQuality>('all')
  const [selectedEmbryo, setSelectedEmbryo] = useState<EmbryoWithPatient | null>(null)

  // Fetch all embryos with cycle and patient data
  const { data: embryosData, isLoading } = useQuery({
    queryKey: ['allEmbryos'],
    queryFn: async () => {
      // For now, return mock data - in production this would query the embryos table
      const mockEmbryos: EmbryoWithPatient[] = [
        {
          id: '1',
          cycle_id: 'c1',
          embryo_number: 1,
          day: 5,
          expansion: 4,
          icm_grade: 'A',
          te_grade: 'A',
          grade: '4AA',
          quality: 'excellent',
          status: 'frozen',
          pgt_result: 'euploid',
          freeze_date: '2024-01-15',
          straw_number: 'STR-001',
          tank: 'Tank A',
          position: 'A1',
          created_at: '2024-01-10',
          updated_at: '2024-01-15',
          patient_name: 'Maria Papadopoulou',
          cycle_number: 1,
        },
        {
          id: '2',
          cycle_id: 'c1',
          embryo_number: 2,
          day: 5,
          expansion: 4,
          icm_grade: 'A',
          te_grade: 'B',
          grade: '4AB',
          quality: 'excellent',
          status: 'frozen',
          pgt_result: 'euploid',
          freeze_date: '2024-01-15',
          straw_number: 'STR-002',
          tank: 'Tank A',
          position: 'A2',
          created_at: '2024-01-10',
          updated_at: '2024-01-15',
          patient_name: 'Maria Papadopoulou',
          cycle_number: 1,
        },
        {
          id: '3',
          cycle_id: 'c2',
          embryo_number: 1,
          day: 5,
          expansion: 3,
          icm_grade: 'B',
          te_grade: 'B',
          grade: '3BB',
          quality: 'good',
          status: 'transferred',
          transfer_date: '2024-02-01',
          created_at: '2024-01-25',
          updated_at: '2024-02-01',
          patient_name: 'Elena Georgiou',
          cycle_number: 2,
        },
        {
          id: '4',
          cycle_id: 'c3',
          embryo_number: 1,
          day: 3,
          cell_count: 8,
          fragmentation: 5,
          symmetry: 'equal',
          grade: '8-cell Grade 1',
          quality: 'excellent',
          status: 'developing',
          created_at: '2024-02-10',
          updated_at: '2024-02-10',
          patient_name: 'Sofia Nikolaou',
          cycle_number: 1,
        },
        {
          id: '5',
          cycle_id: 'c3',
          embryo_number: 2,
          day: 3,
          cell_count: 6,
          fragmentation: 15,
          symmetry: 'unequal',
          grade: '6-cell Grade 2',
          quality: 'good',
          status: 'developing',
          created_at: '2024-02-10',
          updated_at: '2024-02-10',
          patient_name: 'Sofia Nikolaou',
          cycle_number: 1,
        },
      ]
      return mockEmbryos
    },
  })

  const embryos = embryosData || []

  // Apply filters
  const filteredEmbryos = embryos.filter((embryo) => {
    if (searchTerm && !embryo.patient_name.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false
    }
    if (statusFilter !== 'all' && embryo.status !== statusFilter) {
      return false
    }
    if (qualityFilter !== 'all' && embryo.quality !== qualityFilter) {
      return false
    }
    return true
  })

  // Stats
  const stats = {
    total: embryos.length,
    frozen: embryos.filter((e) => e.status === 'frozen').length,
    developing: embryos.filter((e) => e.status === 'developing').length,
    transferred: embryos.filter((e) => e.status === 'transferred').length,
    euploid: embryos.filter((e) => e.pgt_result === 'euploid').length,
  }

  return (
    <PageContainer
      title="Embryology Lab"
      description="Track and manage all embryos across cycles"
    >
      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <Card padding="sm" className="text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <Egg className="h-4 w-4 text-slate-600" />
            <span className="text-small text-slate-600">Total Embryos</span>
          </div>
          <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
        </Card>
        <Card padding="sm" className="text-center bg-cyan-50 border-cyan-200">
          <div className="flex items-center justify-center gap-2 mb-1">
            <Snowflake className="h-4 w-4 text-cyan-600" />
            <span className="text-small text-cyan-600">Frozen</span>
          </div>
          <p className="text-2xl font-bold text-cyan-700">{stats.frozen}</p>
        </Card>
        <Card padding="sm" className="text-center bg-blue-50 border-blue-200">
          <div className="flex items-center justify-center gap-2 mb-1">
            <Microscope className="h-4 w-4 text-blue-600" />
            <span className="text-small text-blue-600">Developing</span>
          </div>
          <p className="text-2xl font-bold text-blue-700">{stats.developing}</p>
        </Card>
        <Card padding="sm" className="text-center bg-teal-50 border-teal-200">
          <div className="flex items-center justify-center gap-2 mb-1">
            <Baby className="h-4 w-4 text-teal-600" />
            <span className="text-small text-teal-600">Transferred</span>
          </div>
          <p className="text-2xl font-bold text-teal-700">{stats.transferred}</p>
        </Card>
        <Card padding="sm" className="text-center bg-emerald-50 border-emerald-200">
          <div className="flex items-center justify-center gap-2 mb-1">
            <TrendingUp className="h-4 w-4 text-emerald-600" />
            <span className="text-small text-emerald-600">Euploid</span>
          </div>
          <p className="text-2xl font-bold text-emerald-700">{stats.euploid}</p>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="py-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by patient name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-slate-400" />
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as FilterStatus)}
                className="w-40"
              >
                <option value="all">All Status</option>
                <option value="frozen">Frozen</option>
                <option value="developing">Developing</option>
                <option value="transferred">Transferred</option>
              </Select>
              <Select
                value={qualityFilter}
                onChange={(e) => setQualityFilter(e.target.value as FilterQuality)}
                className="w-40"
              >
                <option value="all">All Quality</option>
                <option value="excellent">Excellent</option>
                <option value="good">Good</option>
                <option value="fair">Fair</option>
                <option value="poor">Poor</option>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Embryo Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            Embryo Inventory
            <Badge variant="info" className="ml-2">
              {filteredEmbryos.length} embryos
            </Badge>
          </CardTitle>
        </CardHeader>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="text-left py-3 px-4 text-small font-medium text-slate-500">Patient</th>
                <th className="text-left py-3 px-4 text-small font-medium text-slate-500">Cycle</th>
                <th className="text-left py-3 px-4 text-small font-medium text-slate-500">Embryo</th>
                <th className="text-left py-3 px-4 text-small font-medium text-slate-500">Day</th>
                <th className="text-left py-3 px-4 text-small font-medium text-slate-500">Grade</th>
                <th className="text-left py-3 px-4 text-small font-medium text-slate-500">Quality</th>
                <th className="text-left py-3 px-4 text-small font-medium text-slate-500">Status</th>
                <th className="text-left py-3 px-4 text-small font-medium text-slate-500">PGT</th>
                <th className="text-left py-3 px-4 text-small font-medium text-slate-500">Storage</th>
                <th className="text-left py-3 px-4"></th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="border-b border-slate-100">
                    <td colSpan={10} className="py-4 px-4">
                      <div className="h-4 bg-slate-200 rounded animate-pulse" />
                    </td>
                  </tr>
                ))
              ) : filteredEmbryos.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-slate-500">
                    No embryos match your filters
                  </td>
                </tr>
              ) : (
                filteredEmbryos.map((embryo) => (
                  <tr
                    key={embryo.id}
                    className="border-b border-slate-100 hover:bg-slate-50 cursor-pointer"
                    onClick={() => setSelectedEmbryo(embryo)}
                  >
                    <td className="py-3 px-4">
                      <span className="font-medium text-slate-900">{embryo.patient_name}</span>
                    </td>
                    <td className="py-3 px-4 font-mono text-small">
                      #{embryo.cycle_number}
                    </td>
                    <td className="py-3 px-4 font-mono font-semibold">
                      E{embryo.embryo_number}
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant="info" size="sm">Day {embryo.day}</Badge>
                    </td>
                    <td className="py-3 px-4 font-mono font-medium">
                      {embryo.grade}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium border ${getQualityColor(embryo.quality)}`}>
                        {embryo.quality}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(embryo.status)}`}>
                        {embryo.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {embryo.pgt_result ? (
                        <Badge
                          variant={
                            embryo.pgt_result === 'euploid' ? 'success' :
                            embryo.pgt_result === 'aneuploid' ? 'error' :
                            embryo.pgt_result === 'mosaic' ? 'warning' : 'info'
                          }
                          size="sm"
                        >
                          {embryo.pgt_result}
                        </Badge>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-small text-slate-600">
                      {embryo.status === 'frozen' && embryo.tank ? (
                        <span>{embryo.tank} / {embryo.position}</span>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <ChevronRight className="h-4 w-4 text-slate-400" />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Embryo Detail Modal */}
      <Modal
        isOpen={!!selectedEmbryo}
        onClose={() => setSelectedEmbryo(null)}
        title={`Embryo E${selectedEmbryo?.embryo_number} Details`}
        size="lg"
      >
        {selectedEmbryo && (
          <div className="space-y-4">
            {/* Header Info */}
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <div>
                <p className="font-medium text-slate-900">{selectedEmbryo.patient_name}</p>
                <p className="text-small text-slate-500">Cycle #{selectedEmbryo.cycle_number}</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold font-mono">{selectedEmbryo.grade}</p>
                <span className={`px-2 py-1 rounded text-xs font-medium border ${getQualityColor(selectedEmbryo.quality)}`}>
                  {selectedEmbryo.quality}
                </span>
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-slate-50 rounded-lg">
                <p className="text-small text-slate-500">Development Day</p>
                <p className="font-medium">Day {selectedEmbryo.day}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg">
                <p className="text-small text-slate-500">Status</p>
                <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(selectedEmbryo.status)}`}>
                  {selectedEmbryo.status}
                </span>
              </div>

              {selectedEmbryo.day <= 3 && (
                <>
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <p className="text-small text-slate-500">Cell Count</p>
                    <p className="font-medium">{selectedEmbryo.cell_count || '-'}</p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <p className="text-small text-slate-500">Fragmentation</p>
                    <p className="font-medium">{selectedEmbryo.fragmentation ? `${selectedEmbryo.fragmentation}%` : '-'}</p>
                  </div>
                </>
              )}

              {selectedEmbryo.day >= 5 && (
                <>
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <p className="text-small text-slate-500">Expansion</p>
                    <p className="font-medium">{selectedEmbryo.expansion || '-'}</p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <p className="text-small text-slate-500">ICM / TE</p>
                    <p className="font-medium">{selectedEmbryo.icm_grade || '-'} / {selectedEmbryo.te_grade || '-'}</p>
                  </div>
                </>
              )}

              {selectedEmbryo.pgt_result && (
                <div className="p-3 bg-slate-50 rounded-lg col-span-2">
                  <p className="text-small text-slate-500">PGT Result</p>
                  <Badge
                    variant={
                      selectedEmbryo.pgt_result === 'euploid' ? 'success' :
                      selectedEmbryo.pgt_result === 'aneuploid' ? 'error' :
                      selectedEmbryo.pgt_result === 'mosaic' ? 'warning' : 'info'
                    }
                    className="mt-1"
                  >
                    {selectedEmbryo.pgt_result}
                  </Badge>
                  {selectedEmbryo.pgt_details && (
                    <p className="text-small text-slate-600 mt-1">{selectedEmbryo.pgt_details}</p>
                  )}
                </div>
              )}
            </div>

            {/* Storage Info */}
            {selectedEmbryo.status === 'frozen' && (
              <div className="p-4 bg-cyan-50 rounded-lg border border-cyan-200">
                <div className="flex items-center gap-2 mb-2">
                  <Snowflake className="h-4 w-4 text-cyan-600" />
                  <span className="font-medium text-cyan-800">Storage Location</span>
                </div>
                <div className="grid grid-cols-3 gap-4 text-small">
                  <div>
                    <p className="text-cyan-600">Tank</p>
                    <p className="font-medium text-cyan-900">{selectedEmbryo.tank || '-'}</p>
                  </div>
                  <div>
                    <p className="text-cyan-600">Position</p>
                    <p className="font-medium text-cyan-900">{selectedEmbryo.position || '-'}</p>
                  </div>
                  <div>
                    <p className="text-cyan-600">Straw #</p>
                    <p className="font-medium text-cyan-900">{selectedEmbryo.straw_number || '-'}</p>
                  </div>
                </div>
                {selectedEmbryo.freeze_date && (
                  <p className="text-small text-cyan-600 mt-2">
                    Frozen on {format(new Date(selectedEmbryo.freeze_date), 'MMM d, yyyy')}
                  </p>
                )}
              </div>
            )}

            {/* Dates */}
            <div className="grid grid-cols-2 gap-4 text-small">
              {selectedEmbryo.transfer_date && (
                <div>
                  <p className="text-slate-500">Transferred</p>
                  <p className="font-medium">{format(new Date(selectedEmbryo.transfer_date), 'MMM d, yyyy')}</p>
                </div>
              )}
              {selectedEmbryo.biopsy_date && (
                <div>
                  <p className="text-slate-500">Biopsied</p>
                  <p className="font-medium">{format(new Date(selectedEmbryo.biopsy_date), 'MMM d, yyyy')}</p>
                </div>
              )}
            </div>

            {/* Notes */}
            {selectedEmbryo.notes && (
              <div className="p-3 bg-slate-50 rounded-lg">
                <p className="text-small text-slate-500 mb-1">Notes</p>
                <p className="text-slate-700">{selectedEmbryo.notes}</p>
              </div>
            )}

            <ModalFooter>
              <Button variant="secondary" onClick={() => setSelectedEmbryo(null)}>
                Close
              </Button>
              <Link to={`/cycles/${selectedEmbryo.cycle_id}`}>
                <Button>
                  View Cycle
                </Button>
              </Link>
            </ModalFooter>
          </div>
        )}
      </Modal>
    </PageContainer>
  )
}
