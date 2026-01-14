import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import { PageContainer } from '../components/layout'
import { Card, Button, Badge } from '../components/ui'
import { Plus, Search, Phone, ArrowRight, Filter } from 'lucide-react'
import { Link } from 'react-router-dom'

export function Patients() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('')

  const { data: patients, isLoading } = useQuery({
    queryKey: ['patients', search, statusFilter],
    queryFn: async () => {
      let query = supabase
        .from('patients_female')
        .select('*')
        .order('last_name', { ascending: true })

      if (search) {
        query = query.or(`last_name.ilike.%${search}%,first_name.ilike.%${search}%,am.eq.${parseInt(search) || 0}`)
      }

      if (statusFilter) {
        query = query.eq('status', statusFilter)
      }

      const { data, error } = await query.limit(50)
      if (error) throw error
      return (data || []) as any[]
    },
  })

  const calculateAge = (date_of_birth: string | null) => {
    if (!date_of_birth) return null
    const birthDate = new Date(date_of_birth)
    const today = new Date()
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    return age
  }

  return (
    <PageContainer
      title="Patients"
      description="Manage your patient records"
      actions={
        <Link to="/patients/new">
          <Button leftIcon={<Plus className="h-4 w-4" />}>New Patient</Button>
        </Link>
      }
    >
      {/* Search and Filters */}
      <Card className="mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name or AM..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="pregnant">Pregnant</option>
              <option value="completed">Completed</option>
              <option value="inactive">Inactive</option>
            </select>
            <Button variant="secondary" leftIcon={<Filter className="h-4 w-4" />}>
              More Filters
            </Button>
          </div>
        </div>
      </Card>

      {/* Patient List */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-slate-200 rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-slate-200 rounded w-3/4" />
                  <div className="h-3 bg-slate-200 rounded w-1/2" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {patients?.map((patient) => (
            <Link key={patient.id} to={`/patients/${patient.id}`}>
              <Card hover className="h-full">
                <div className="flex items-start gap-4">
                  {/* Avatar */}
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-lg font-semibold text-primary-600">
                      {patient.first_name?.[0]}{patient.last_name?.[0]}
                    </span>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <h3 className="font-semibold text-slate-900 truncate">
                        {patient.last_name} {patient.first_name}
                      </h3>
                      <ArrowRight className="h-4 w-4 text-slate-400 flex-shrink-0" />
                    </div>

                    <div className="flex items-center gap-2 text-small text-slate-500 mb-2">
                      <span className="font-mono">AM: {patient.am || 'N/A'}</span>
                      {patient.date_of_birth && (
                        <>
                          <span>•</span>
                          <span>{calculateAge(patient.date_of_birth)} years</span>
                        </>
                      )}
                    </div>

                    {/* Contact */}
                    <div className="flex items-center gap-4 text-small text-slate-500">
                      {patient.mobile && (
                        <span className="flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {patient.mobile}
                        </span>
                      )}
                    </div>

                    {/* Status */}
                    {patient.status && (
                      <div className="mt-3">
                        <Badge
                          variant={
                            patient.status === 'pregnant'
                              ? 'teal'
                              : patient.status === 'active'
                              ? 'info'
                              : patient.status === 'completed'
                              ? 'success'
                              : 'default'
                          }
                        >
                          {patient.status}
                        </Badge>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && (!patients || patients.length === 0) && (
        <Card className="text-center py-12">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="h-8 w-8 text-slate-400" />
          </div>
          <h3 className="text-h3 text-slate-900 mb-2">No patients found</h3>
          <p className="text-body text-slate-500 mb-4">
            {search ? 'Try adjusting your search criteria' : 'Get started by adding your first patient'}
          </p>
          {!search && (
            <Link to="/patients/new">
              <Button leftIcon={<Plus className="h-4 w-4" />}>Add Patient</Button>
            </Link>
          )}
        </Card>
      )}
    </PageContainer>
  )
}
