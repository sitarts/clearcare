import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import { PageContainer } from '../components/layout'
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Button,
  Badge,
  Input,
  Select,
  useToast,
  Modal,
  ModalFooter,
} from '../components/ui'
import {
  ArrowLeft,
  Edit,
  User,
  Calendar,
  Activity,
  Plus,
  Trash2,
  CheckCircle,
  Baby,
  FlaskConical,
  Syringe,
  Clock,
} from 'lucide-react'
import { format } from 'date-fns'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from 'recharts'
import { EmbryoGrid } from '../components/embryology'
import type { Embryo } from '../types/embryo'

type TabType = 'overview' | 'monitoring' | 'embryology' | 'outcome'

const statusSteps = [
  { id: 'planning', label: 'Planning', icon: Calendar },
  { id: 'stimulation', label: 'Stimulation', icon: Syringe },
  { id: 'trigger', label: 'Trigger', icon: Clock },
  { id: 'retrieval', label: 'Retrieval', icon: FlaskConical },
  { id: 'transfer', label: 'Transfer', icon: Baby },
  { id: 'tww', label: '2WW', icon: Clock },
  { id: 'completed', label: 'Complete', icon: CheckCircle },
]

const statusOptions = [
  { value: 'planning', label: 'Planning' },
  { value: 'stimulation', label: 'Stimulation' },
  { value: 'trigger', label: 'Trigger' },
  { value: 'retrieval', label: 'Retrieval' },
  { value: 'fertilization', label: 'Fertilization' },
  { value: 'culture', label: 'Culture' },
  { value: 'transfer', label: 'Transfer' },
  { value: 'tww', label: '2WW' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
]

export function CycleDetail() {
  const { id } = useParams<{ id: string }>()
  const queryClient = useQueryClient()
  const { addToast } = useToast()
  const [activeTab, setActiveTab] = useState<TabType>('overview')
  const [showAddMonitoring, setShowAddMonitoring] = useState(false)
  const [newMonitoring, setNewMonitoring] = useState({
    visit_date: format(new Date(), 'yyyy-MM-dd'),
    day: 1,
    e2: '',
    lh: '',
    p4: '',
    left_follicles: '',
    right_follicles: '',
    endometrium: '',
    notes: '',
  })

  const { data: cycle, isLoading } = useQuery({
    queryKey: ['cycle', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('cycles')
        .select(`
          *,
          patients_female (id, surname, name, am, dob)
        `)
        .eq('id', id as string)
        .single()
      if (error) throw error
      return data as any
    },
    enabled: !!id,
  })

  // Mock monitoring data - in real app this would come from a monitoring_visits table
  const [monitoringData, setMonitoringData] = useState([
    { day: 1, date: '2026-01-02', e2: 45, lh: 3.2, p4: 0.4, leftFollicles: 5, rightFollicles: 4, endo: 5.2 },
    { day: 3, date: '2026-01-04', e2: 120, lh: 3.5, p4: 0.5, leftFollicles: 6, rightFollicles: 5, endo: 6.1 },
    { day: 5, date: '2026-01-06', e2: 380, lh: 4.1, p4: 0.6, leftFollicles: 7, rightFollicles: 6, endo: 7.8 },
    { day: 7, date: '2026-01-08', e2: 890, lh: 5.2, p4: 0.8, leftFollicles: 8, rightFollicles: 7, endo: 9.2 },
    { day: 9, date: '2026-01-10', e2: 1650, lh: 8.5, p4: 1.1, leftFollicles: 10, rightFollicles: 8, endo: 10.5 },
    { day: 11, date: '2026-01-12', e2: 2800, lh: 45, p4: 1.4, leftFollicles: 12, rightFollicles: 9, endo: 11.2 },
  ])

  // Embryo state - in production this would come from database
  const [embryos, setEmbryos] = useState<Embryo[]>([
    {
      id: '1',
      cycle_id: id || '',
      embryo_number: 1,
      day: 5,
      expansion: 4,
      icm_grade: 'A',
      te_grade: 'A',
      grade: '4AA',
      quality: 'excellent',
      status: 'transferred',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: '2',
      cycle_id: id || '',
      embryo_number: 2,
      day: 5,
      expansion: 4,
      icm_grade: 'A',
      te_grade: 'B',
      grade: '4AB',
      quality: 'good',
      status: 'frozen',
      straw_number: 'S-001',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: '3',
      cycle_id: id || '',
      embryo_number: 3,
      day: 5,
      expansion: 3,
      icm_grade: 'B',
      te_grade: 'B',
      grade: '3BB',
      quality: 'good',
      status: 'frozen',
      straw_number: 'S-002',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: '4',
      cycle_id: id || '',
      embryo_number: 4,
      day: 3,
      cell_count: 8,
      grade: '8-cell',
      quality: 'good',
      status: 'arrested',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: '5',
      cycle_id: id || '',
      embryo_number: 5,
      day: 3,
      cell_count: 6,
      grade: '6-cell',
      quality: 'fair',
      status: 'arrested',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ])

  const handleAddEmbryo = (embryo: Partial<Embryo>) => {
    const newEmbryo: Embryo = {
      ...embryo,
      id: Math.random().toString(36).substring(7),
      cycle_id: id || '',
      embryo_number: embryo.embryo_number || embryos.length + 1,
      day: embryo.day || 0,
      grade: embryo.grade || 'Not graded',
      quality: embryo.quality || 'fair',
      status: embryo.status || 'developing',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    } as Embryo
    setEmbryos([...embryos, newEmbryo])
    addToast({ type: 'success', title: 'Embryo added' })
  }

  const handleUpdateEmbryo = (embryoId: string, updates: Partial<Embryo>) => {
    setEmbryos(embryos.map((e) => (e.id === embryoId ? { ...e, ...updates, updated_at: new Date().toISOString() } : e)))
    addToast({ type: 'success', title: 'Embryo updated' })
  }

  const handleDeleteEmbryo = (embryoId: string) => {
    setEmbryos(embryos.filter((e) => e.id !== embryoId))
    addToast({ type: 'info', title: 'Embryo removed' })
  }

  const updateStatus = useMutation({
    mutationFn: async (newStatus: string) => {
      const { error } = await (supabase
        .from('cycles') as any)
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', id as string)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cycle', id] })
      queryClient.invalidateQueries({ queryKey: ['allCycles'] })
      addToast({ type: 'success', title: 'Status updated' })
    },
    onError: () => {
      addToast({ type: 'error', title: 'Failed to update status' })
    },
  })

  const getCurrentStepIndex = () => {
    const idx = statusSteps.findIndex((s) => s.id === cycle?.status)
    return idx >= 0 ? idx : 0
  }

  const handleAddMonitoring = () => {
    const newEntry = {
      day: parseInt(newMonitoring.day.toString()) || monitoringData.length + 1,
      date: newMonitoring.visit_date,
      e2: parseFloat(newMonitoring.e2) || 0,
      lh: parseFloat(newMonitoring.lh) || 0,
      p4: parseFloat(newMonitoring.p4) || 0,
      leftFollicles: parseInt(newMonitoring.left_follicles) || 0,
      rightFollicles: parseInt(newMonitoring.right_follicles) || 0,
      endo: parseFloat(newMonitoring.endometrium) || 0,
    }
    setMonitoringData([...monitoringData, newEntry].sort((a, b) => a.day - b.day))
    setShowAddMonitoring(false)
    setNewMonitoring({
      visit_date: format(new Date(), 'yyyy-MM-dd'),
      day: monitoringData.length + 2,
      e2: '',
      lh: '',
      p4: '',
      left_follicles: '',
      right_follicles: '',
      endometrium: '',
      notes: '',
    })
    addToast({ type: 'success', title: 'Monitoring visit added' })
  }

  const tabs = [
    { id: 'overview' as const, label: 'Overview', icon: <Activity className="h-4 w-4" /> },
    { id: 'monitoring' as const, label: 'Monitoring', icon: <FlaskConical className="h-4 w-4" /> },
    { id: 'embryology' as const, label: 'Embryology', icon: <Baby className="h-4 w-4" /> },
    { id: 'outcome' as const, label: 'Outcome', icon: <CheckCircle className="h-4 w-4" /> },
  ]

  if (isLoading) {
    return (
      <PageContainer>
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-slate-200 rounded w-48" />
          <div className="h-40 bg-slate-200 rounded" />
        </div>
      </PageContainer>
    )
  }

  if (!cycle) {
    return (
      <PageContainer>
        <Card className="text-center py-12">
          <h3 className="text-h3 text-slate-900 mb-2">Cycle not found</h3>
          <Link to="/cycles">
            <Button variant="secondary">Back to Cycles</Button>
          </Link>
        </Card>
      </PageContainer>
    )
  }

  const patient = cycle.patients_female as any

  return (
    <PageContainer>
      {/* Back button */}
      <Link to="/cycles" className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6">
        <ArrowLeft className="h-4 w-4" />
        <span>Back to Cycles</span>
      </Link>

      {/* Cycle Header */}
      <Card className="mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-teal-100 rounded-full flex items-center justify-center">
              <Activity className="h-7 w-7 text-teal-600" />
            </div>
            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-h1 text-slate-900">
                  {cycle.cycle_type || 'IVF'} Cycle #{cycle.cycle_number || 1}
                </h1>
                <Badge
                  variant={
                    cycle.status === 'completed' ? 'success' :
                    cycle.status === 'cancelled' ? 'error' :
                    cycle.pregnant ? 'teal' : 'info'
                  }
                  size="md"
                >
                  {cycle.pregnant ? 'Pregnant' : cycle.status || 'Active'}
                </Badge>
              </div>
              {patient && (
                <Link
                  to={`/patients/${patient.id}`}
                  className="flex items-center gap-2 mt-1 text-body text-slate-500 hover:text-primary-600"
                >
                  <User className="h-4 w-4" />
                  <span>{patient.surname} {patient.name}</span>
                  <span className="font-mono">(AM: {patient.am || 'N/A'})</span>
                </Link>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            <Select
              options={statusOptions}
              value={cycle.status || 'planning'}
              onChange={(e) => updateStatus.mutate(e.target.value)}
              className="w-40"
            />
            <Button variant="secondary" size="sm" leftIcon={<Edit className="h-4 w-4" />}>
              Edit
            </Button>
          </div>
        </div>
      </Card>

      {/* Timeline Progress */}
      <Card className="mb-6" padding="sm">
        <div className="px-4 py-2">
          <div className="flex items-center justify-between">
            {statusSteps.map((step, idx) => {
              const StepIcon = step.icon
              const currentIdx = getCurrentStepIndex()
              const isCompleted = idx < currentIdx
              const isCurrent = idx === currentIdx
              const isUpcoming = idx > currentIdx

              return (
                <div key={step.id} className="flex items-center flex-1">
                  <div className="flex flex-col items-center">
                    <div
                      className={`
                        w-10 h-10 rounded-full flex items-center justify-center transition-colors
                        ${isCompleted ? 'bg-teal-500 text-white' : ''}
                        ${isCurrent ? 'bg-primary-600 text-white ring-4 ring-primary-100' : ''}
                        ${isUpcoming ? 'bg-slate-100 text-slate-400' : ''}
                      `}
                    >
                      <StepIcon className="h-5 w-5" />
                    </div>
                    <span
                      className={`
                        mt-2 text-tiny font-medium
                        ${isCompleted || isCurrent ? 'text-slate-900' : 'text-slate-400'}
                      `}
                    >
                      {step.label}
                    </span>
                  </div>
                  {idx < statusSteps.length - 1 && (
                    <div
                      className={`
                        flex-1 h-1 mx-2 rounded
                        ${idx < currentIdx ? 'bg-teal-500' : 'bg-slate-200'}
                      `}
                    />
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </Card>

      {/* Tabs */}
      <div className="border-b border-slate-200 mb-6">
        <nav className="flex gap-1 -mb-px overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap
                ${
                  activeTab === tab.id
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                }
              `}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="animate-fade-in">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Cycle Info */}
            <Card>
              <CardHeader>
                <CardTitle>Cycle Details</CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="space-y-4">
                  <div>
                    <dt className="text-small text-slate-500">Cycle Type</dt>
                    <dd className="text-body font-medium">{cycle.cycle_type || 'IVF'}</dd>
                  </div>
                  <div>
                    <dt className="text-small text-slate-500">Protocol</dt>
                    <dd className="text-body font-medium">{cycle.protocol || 'Not specified'}</dd>
                  </div>
                  <div>
                    <dt className="text-small text-slate-500">Start Date</dt>
                    <dd className="text-body font-medium">
                      {cycle.start_date ? format(new Date(cycle.start_date), 'MMMM d, yyyy') : 'Not started'}
                    </dd>
                  </div>
                  {cycle.transfer_date && (
                    <div>
                      <dt className="text-small text-slate-500">Transfer Date</dt>
                      <dd className="text-body font-medium">
                        {format(new Date(cycle.transfer_date), 'MMMM d, yyyy')}
                      </dd>
                    </div>
                  )}
                </dl>
              </CardContent>
            </Card>

            {/* Medication */}
            <Card>
              <CardHeader>
                <CardTitle>Medication Protocol</CardTitle>
              </CardHeader>
              <CardContent>
                {cycle.medication ? (
                  <p className="text-body text-slate-700 whitespace-pre-wrap">{cycle.medication}</p>
                ) : (
                  <p className="text-body text-slate-500 italic">No medication protocol recorded</p>
                )}
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Cycle Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="space-y-4">
                  <div className="flex justify-between">
                    <dt className="text-small text-slate-500">Oocytes Retrieved</dt>
                    <dd className="text-body font-semibold text-teal-600">
                      {cycle.oocytes_retrieved ?? '-'}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-small text-slate-500">Mature (MII)</dt>
                    <dd className="text-body font-semibold">{cycle.mature_oocytes ?? '-'}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-small text-slate-500">Fertilized</dt>
                    <dd className="text-body font-semibold">{cycle.fertilized ?? '-'}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-small text-slate-500">Embryos Transferred</dt>
                    <dd className="text-body font-semibold">{cycle.embryos_transferred ?? '-'}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-small text-slate-500">Embryos Frozen</dt>
                    <dd className="text-body font-semibold">{cycle.embryos_frozen ?? '-'}</dd>
                  </div>
                </dl>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'monitoring' && (
          <div className="space-y-6">
            {/* Hormone Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Estradiol (E2) Levels</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={monitoringData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis
                        dataKey="day"
                        label={{ value: 'Stimulation Day', position: 'bottom', offset: -5 }}
                        tick={{ fontSize: 12 }}
                      />
                      <YAxis
                        label={{ value: 'E2 (pg/mL)', angle: -90, position: 'insideLeft' }}
                        tick={{ fontSize: 12 }}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'white',
                          border: '1px solid #e2e8f0',
                          borderRadius: '8px',
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="e2"
                        stroke="#2563EB"
                        strokeWidth={2}
                        dot={{ fill: '#2563EB', strokeWidth: 2, r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Follicle Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Follicle Development</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monitoringData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'white',
                          border: '1px solid #e2e8f0',
                          borderRadius: '8px',
                        }}
                      />
                      <Legend />
                      <Bar dataKey="leftFollicles" name="Left Ovary" fill="#0D9488" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="rightFollicles" name="Right Ovary" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Monitoring Table */}
            <Card>
              <CardHeader>
                <CardTitle>Monitoring Visits</CardTitle>
                <Button size="sm" leftIcon={<Plus className="h-4 w-4" />} onClick={() => setShowAddMonitoring(true)}>
                  Add Visit
                </Button>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50">
                        <th className="text-left py-3 px-4 text-small font-medium text-slate-500">Day</th>
                        <th className="text-left py-3 px-4 text-small font-medium text-slate-500">Date</th>
                        <th className="text-left py-3 px-4 text-small font-medium text-slate-500">E2 (pg/mL)</th>
                        <th className="text-left py-3 px-4 text-small font-medium text-slate-500">LH</th>
                        <th className="text-left py-3 px-4 text-small font-medium text-slate-500">P4</th>
                        <th className="text-left py-3 px-4 text-small font-medium text-slate-500">Left</th>
                        <th className="text-left py-3 px-4 text-small font-medium text-slate-500">Right</th>
                        <th className="text-left py-3 px-4 text-small font-medium text-slate-500">Endo (mm)</th>
                        <th className="text-left py-3 px-4"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {monitoringData.map((visit, idx) => (
                        <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50">
                          <td className="py-3 px-4 font-medium">Day {visit.day}</td>
                          <td className="py-3 px-4 text-slate-600">
                            {format(new Date(visit.date), 'MMM d')}
                          </td>
                          <td className="py-3 px-4 font-mono">{visit.e2}</td>
                          <td className="py-3 px-4 font-mono">{visit.lh}</td>
                          <td className="py-3 px-4 font-mono">{visit.p4}</td>
                          <td className="py-3 px-4">{visit.leftFollicles}</td>
                          <td className="py-3 px-4">{visit.rightFollicles}</td>
                          <td className="py-3 px-4">{visit.endo}</td>
                          <td className="py-3 px-4">
                            <button
                              onClick={() => {
                                setMonitoringData(monitoringData.filter((_, i) => i !== idx))
                                addToast({ type: 'info', title: 'Visit removed' })
                              }}
                              className="p-1 text-slate-400 hover:text-coral-500 rounded"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'embryology' && (
          <EmbryoGrid
            embryos={embryos}
            cycleId={id || ''}
            onAddEmbryo={handleAddEmbryo}
            onUpdateEmbryo={handleUpdateEmbryo}
            onDeleteEmbryo={handleDeleteEmbryo}
          />
        )}

        {activeTab === 'outcome' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Beta hCG Results</CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="space-y-4">
                  <div>
                    <dt className="text-small text-slate-500">Test Date</dt>
                    <dd className="text-body font-medium">
                      {cycle.beta_hcg_date
                        ? format(new Date(cycle.beta_hcg_date), 'MMMM d, yyyy')
                        : 'Not yet tested'}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-small text-slate-500">Beta hCG Value</dt>
                    <dd className="text-h1 font-semibold text-teal-600">
                      {cycle.beta_hcg_value ?? '-'} <span className="text-body font-normal text-slate-500">mIU/mL</span>
                    </dd>
                  </div>
                  <div>
                    <dt className="text-small text-slate-500">Result</dt>
                    <dd>
                      {cycle.pregnant ? (
                        <Badge variant="teal" size="md">Positive - Pregnant</Badge>
                      ) : cycle.beta_hcg_value !== null ? (
                        <Badge variant="default" size="md">Negative</Badge>
                      ) : (
                        <span className="text-slate-500">Awaiting results</span>
                      )}
                    </dd>
                  </div>
                </dl>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Cycle Outcome</CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="space-y-4">
                  <div>
                    <dt className="text-small text-slate-500">Final Outcome</dt>
                    <dd className="text-body font-medium">{cycle.outcome || 'Pending'}</dd>
                  </div>
                  {cycle.notes && (
                    <div>
                      <dt className="text-small text-slate-500">Notes</dt>
                      <dd className="text-body text-slate-700 mt-1">{cycle.notes}</dd>
                    </div>
                  )}
                </dl>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Add Monitoring Modal */}
      <Modal isOpen={showAddMonitoring} onClose={() => setShowAddMonitoring(false)} title="Add Monitoring Visit" size="lg">
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Visit Date"
            type="date"
            value={newMonitoring.visit_date}
            onChange={(e) => setNewMonitoring({ ...newMonitoring, visit_date: e.target.value })}
          />
          <Input
            label="Stimulation Day"
            type="number"
            value={newMonitoring.day}
            onChange={(e) => setNewMonitoring({ ...newMonitoring, day: parseInt(e.target.value) })}
          />
          <Input
            label="E2 (pg/mL)"
            type="number"
            value={newMonitoring.e2}
            onChange={(e) => setNewMonitoring({ ...newMonitoring, e2: e.target.value })}
          />
          <Input
            label="LH"
            type="number"
            step="0.1"
            value={newMonitoring.lh}
            onChange={(e) => setNewMonitoring({ ...newMonitoring, lh: e.target.value })}
          />
          <Input
            label="P4"
            type="number"
            step="0.1"
            value={newMonitoring.p4}
            onChange={(e) => setNewMonitoring({ ...newMonitoring, p4: e.target.value })}
          />
          <Input
            label="Endometrium (mm)"
            type="number"
            step="0.1"
            value={newMonitoring.endometrium}
            onChange={(e) => setNewMonitoring({ ...newMonitoring, endometrium: e.target.value })}
          />
          <Input
            label="Left Ovary Follicles"
            type="number"
            value={newMonitoring.left_follicles}
            onChange={(e) => setNewMonitoring({ ...newMonitoring, left_follicles: e.target.value })}
          />
          <Input
            label="Right Ovary Follicles"
            type="number"
            value={newMonitoring.right_follicles}
            onChange={(e) => setNewMonitoring({ ...newMonitoring, right_follicles: e.target.value })}
          />
        </div>
        <ModalFooter>
          <Button variant="secondary" onClick={() => setShowAddMonitoring(false)}>
            Cancel
          </Button>
          <Button onClick={handleAddMonitoring}>
            Add Visit
          </Button>
        </ModalFooter>
      </Modal>
    </PageContainer>
  )
}
