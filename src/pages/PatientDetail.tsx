import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import { PageContainer } from '../components/layout'
import { Card, CardHeader, CardTitle, CardContent, Button, Badge, StatusBadge } from '../components/ui'
import {
  ArrowLeft,
  Edit,
  Phone,
  Mail,
  MapPin,
  User,
  FileText,
  Activity,
  Heart,
  Clipboard,
  Plus,
} from 'lucide-react'
import { format } from 'date-fns'

type TabType = 'overview' | 'demographics' | 'history' | 'cycles' | 'documents'

export function PatientDetail() {
  const { id } = useParams<{ id: string }>()
  const [activeTab, setActiveTab] = useState<TabType>('overview')

  const { data: patient, isLoading } = useQuery({
    queryKey: ['patient', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('patients_female')
        .select('*')
        .eq('id', id as string)
        .single()
      if (error) throw error
      return data as any
    },
    enabled: !!id,
  })

  const { data: cycles } = useQuery({
    queryKey: ['patientCycles', id],
    queryFn: async () => {
      const { data } = await supabase
        .from('cycles')
        .select('*')
        .eq('female_id', id as string)
        .order('start_date', { ascending: false })
      return (data || []) as any[]
    },
    enabled: !!id,
  })

  const calculateAge = (dob: string | null) => {
    if (!dob) return null
    const birthDate = new Date(dob)
    const today = new Date()
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    return age
  }

  const tabs = [
    { id: 'overview' as const, label: 'Overview', icon: <User className="h-4 w-4" /> },
    { id: 'demographics' as const, label: 'Demographics', icon: <Clipboard className="h-4 w-4" /> },
    { id: 'history' as const, label: 'Medical History', icon: <Heart className="h-4 w-4" /> },
    { id: 'cycles' as const, label: 'Cycles', icon: <Activity className="h-4 w-4" /> },
    { id: 'documents' as const, label: 'Documents', icon: <FileText className="h-4 w-4" /> },
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

  if (!patient) {
    return (
      <PageContainer>
        <Card className="text-center py-12">
          <h3 className="text-h3 text-slate-900 mb-2">Patient not found</h3>
          <Link to="/patients">
            <Button variant="secondary">Back to Patients</Button>
          </Link>
        </Card>
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      {/* Back button */}
      <Link to="/patients" className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6">
        <ArrowLeft className="h-4 w-4" />
        <span>Back to Patients</span>
      </Link>

      {/* Patient Header */}
      <Card className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
              <span className="text-2xl font-semibold text-primary-600">
                {patient.name?.[0]}{patient.surname?.[0]}
              </span>
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-h1 text-slate-900">
                  {patient.surname} {patient.name}
                </h1>
                {patient.status && (
                  <StatusBadge status={patient.status as any} />
                )}
              </div>
              <div className="flex items-center gap-4 mt-1 text-body text-slate-500">
                <span className="font-mono">AM: {patient.am || 'N/A'}</span>
                {patient.dob && (
                  <>
                    <span>•</span>
                    <span>{calculateAge(patient.dob)} years old</span>
                    <span>•</span>
                    <span>{format(new Date(patient.dob), 'MMM d, yyyy')}</span>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            {patient.phone && (
              <a href={`tel:${patient.phone}`}>
                <Button variant="secondary" size="sm" leftIcon={<Phone className="h-4 w-4" />}>
                  Call
                </Button>
              </a>
            )}
            {patient.email && (
              <a href={`mailto:${patient.email}`}>
                <Button variant="secondary" size="sm" leftIcon={<Mail className="h-4 w-4" />}>
                  Email
                </Button>
              </a>
            )}
            <Link to={`/patients/${id}/edit`}>
              <Button size="sm" leftIcon={<Edit className="h-4 w-4" />}>
                Edit
              </Button>
            </Link>
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
            {/* Quick Info */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {patient.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-slate-400" />
                    <span className="text-body">{patient.phone}</span>
                  </div>
                )}
                {patient.email && (
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-slate-400" />
                    <span className="text-body">{patient.email}</span>
                  </div>
                )}
                {(patient.address || patient.city) && (
                  <div className="flex items-center gap-3">
                    <MapPin className="h-4 w-4 text-slate-400" />
                    <span className="text-body">
                      {[patient.address, patient.city].filter(Boolean).join(', ')}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Cycles */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Treatment Cycles</CardTitle>
                <Link to={`/cycles/new?patient=${id}`}>
                  <Button variant="ghost" size="sm" leftIcon={<Plus className="h-4 w-4" />}>
                    New Cycle
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                {cycles && cycles.length > 0 ? (
                  <div className="space-y-3">
                    {cycles.slice(0, 5).map((cycle) => (
                      <Link
                        key={cycle.id}
                        to={`/cycles/${cycle.id}`}
                        className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg transition-colors -mx-3"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
                            <Activity className="h-5 w-5 text-teal-600" />
                          </div>
                          <div>
                            <p className="font-medium text-slate-900">
                              {cycle.cycle_type || 'IVF'} - Cycle #{cycle.cycle_number || 1}
                            </p>
                            <p className="text-small text-slate-500">
                              {cycle.start_date ? format(new Date(cycle.start_date), 'MMM d, yyyy') : 'Not started'}
                            </p>
                          </div>
                        </div>
                        <Badge
                          variant={
                            cycle.status === 'completed' ? 'success' :
                            cycle.status === 'cancelled' ? 'error' :
                            cycle.pregnant ? 'teal' : 'info'
                          }
                        >
                          {cycle.pregnant ? 'Pregnant' : cycle.status || 'Active'}
                        </Badge>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-slate-500 py-8">No cycles recorded yet</p>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'demographics' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="space-y-4">
                  <div>
                    <dt className="text-small text-slate-500">Full Name</dt>
                    <dd className="text-body font-medium">{patient.surname} {patient.name}</dd>
                  </div>
                  <div>
                    <dt className="text-small text-slate-500">Date of Birth</dt>
                    <dd className="text-body font-medium">
                      {patient.dob ? format(new Date(patient.dob), 'MMMM d, yyyy') : '-'}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-small text-slate-500">Nationality</dt>
                    <dd className="text-body font-medium">{patient.nationality || '-'}</dd>
                  </div>
                  <div>
                    <dt className="text-small text-slate-500">Occupation</dt>
                    <dd className="text-body font-medium">{patient.occupation || '-'}</dd>
                  </div>
                </dl>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Identification</CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="space-y-4">
                  <div>
                    <dt className="text-small text-slate-500">AM (Patient ID)</dt>
                    <dd className="text-body font-mono font-medium">{patient.am || '-'}</dd>
                  </div>
                  <div>
                    <dt className="text-small text-slate-500">AMKA</dt>
                    <dd className="text-body font-mono font-medium">{patient.amka || '-'}</dd>
                  </div>
                  <div>
                    <dt className="text-small text-slate-500">AFM</dt>
                    <dd className="text-body font-mono font-medium">{patient.afm || '-'}</dd>
                  </div>
                  <div>
                    <dt className="text-small text-slate-500">Insurance</dt>
                    <dd className="text-body font-medium">{patient.insurance || '-'}</dd>
                  </div>
                </dl>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Physical Information</CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="space-y-4">
                  <div>
                    <dt className="text-small text-slate-500">Blood Type</dt>
                    <dd className="text-body font-medium">
                      {patient.blood_type ? `${patient.blood_type}${patient.rhesus || ''}` : '-'}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-small text-slate-500">Height / Weight</dt>
                    <dd className="text-body font-medium">
                      {patient.height ? `${patient.height} cm` : '-'} / {patient.weight ? `${patient.weight} kg` : '-'}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-small text-slate-500">BMI</dt>
                    <dd className="text-body font-medium">{patient.bmi?.toFixed(1) || '-'}</dd>
                  </div>
                </dl>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Contact Details</CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="space-y-4">
                  <div>
                    <dt className="text-small text-slate-500">Mobile Phone</dt>
                    <dd className="text-body font-medium">{patient.mobile || patient.phone || '-'}</dd>
                  </div>
                  <div>
                    <dt className="text-small text-slate-500">Email</dt>
                    <dd className="text-body font-medium">{patient.email || '-'}</dd>
                  </div>
                  <div>
                    <dt className="text-small text-slate-500">Address</dt>
                    <dd className="text-body font-medium">
                      {[patient.address, patient.city, patient.postal_code].filter(Boolean).join(', ') || '-'}
                    </dd>
                  </div>
                </dl>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'history' && (
          <Card>
            <CardContent className="text-center py-12">
              <Heart className="h-12 w-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-h3 text-slate-900 mb-2">Medical History</h3>
              <p className="text-body text-slate-500">
                Coming soon - View gynecological, obstetric, surgical, and family history
              </p>
            </CardContent>
          </Card>
        )}

        {activeTab === 'cycles' && (
          <Card>
            <CardHeader>
              <CardTitle>All Treatment Cycles</CardTitle>
              <Link to={`/cycles/new?patient=${id}`}>
                <Button leftIcon={<Plus className="h-4 w-4" />}>New Cycle</Button>
              </Link>
            </CardHeader>
            <CardContent>
              {cycles && cycles.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-200">
                        <th className="text-left py-3 px-4 text-small font-medium text-slate-500">Cycle #</th>
                        <th className="text-left py-3 px-4 text-small font-medium text-slate-500">Type</th>
                        <th className="text-left py-3 px-4 text-small font-medium text-slate-500">Start Date</th>
                        <th className="text-left py-3 px-4 text-small font-medium text-slate-500">Status</th>
                        <th className="text-left py-3 px-4 text-small font-medium text-slate-500">Outcome</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cycles.map((cycle) => (
                        <tr key={cycle.id} className="border-b border-slate-100 hover:bg-slate-50">
                          <td className="py-3 px-4 font-mono">{cycle.cycle_number || '-'}</td>
                          <td className="py-3 px-4">{cycle.cycle_type || 'IVF'}</td>
                          <td className="py-3 px-4">
                            {cycle.start_date ? format(new Date(cycle.start_date), 'MMM d, yyyy') : '-'}
                          </td>
                          <td className="py-3 px-4">
                            <Badge variant={cycle.status === 'completed' ? 'success' : 'info'}>
                              {cycle.status || 'Active'}
                            </Badge>
                          </td>
                          <td className="py-3 px-4">
                            {cycle.pregnant ? (
                              <Badge variant="teal">Pregnant</Badge>
                            ) : cycle.outcome ? (
                              <span className="text-body">{cycle.outcome}</span>
                            ) : (
                              '-'
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-center text-slate-500 py-8">No cycles recorded yet</p>
              )}
            </CardContent>
          </Card>
        )}

        {activeTab === 'documents' && (
          <Card>
            <CardContent className="text-center py-12">
              <FileText className="h-12 w-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-h3 text-slate-900 mb-2">Documents</h3>
              <p className="text-body text-slate-500 mb-4">
                Coming soon - Upload and manage patient documents
              </p>
              <Button variant="secondary" leftIcon={<Plus className="h-4 w-4" />}>
                Upload Document
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </PageContainer>
  )
}
