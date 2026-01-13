import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import { PageContainer } from '../components/layout'
import { Card, CardHeader, CardTitle, CardContent, Badge, Button } from '../components/ui'
import {
  Users,
  GitBranch,
  Calendar,
  CheckCircle,
  Plus,
  ArrowRight,
  Activity,
} from 'lucide-react'
import { format } from 'date-fns'
import { Link } from 'react-router-dom'

export function Dashboard() {
  const { data: patientCount } = useQuery({
    queryKey: ['patientCount'],
    queryFn: async () => {
      const { count } = await supabase
        .from('patients_female')
        .select('*', { count: 'exact', head: true })
      return count || 0
    },
  })

  const { data: activeCycles } = useQuery({
    queryKey: ['activeCycles'],
    queryFn: async () => {
      const { count } = await supabase
        .from('cycles')
        .select('*', { count: 'exact', head: true })
        .in('status', ['stimulation', 'trigger', 'retrieval', 'transfer', 'tww'])
      return count || 0
    },
  })

  const { data: recentPatients } = useQuery({
    queryKey: ['recentPatients'],
    queryFn: async () => {
      const { data } = await supabase
        .from('patients_female')
        .select('id, am, surname, name, phone, created_at')
        .order('created_at', { ascending: false })
        .limit(5)
      return (data || []) as any[]
    },
  })

  const { data: recentCycles } = useQuery({
    queryKey: ['recentCycles'],
    queryFn: async () => {
      const { data } = await supabase
        .from('cycles')
        .select(`
          id,
          cycle_number,
          cycle_type,
          status,
          start_date,
          female_id,
          patients_female (surname, name)
        `)
        .order('created_at', { ascending: false })
        .limit(5)
      return data || []
    },
  })

  const stats = [
    {
      name: 'Total Patients',
      value: patientCount ?? '...',
      icon: <Users className="h-5 w-5" />,
      color: 'bg-primary-100 text-primary-600',
    },
    {
      name: 'Active Cycles',
      value: activeCycles ?? '...',
      icon: <GitBranch className="h-5 w-5" />,
      color: 'bg-teal-100 text-teal-600',
    },
    {
      name: "Today's Appointments",
      value: 8,
      icon: <Calendar className="h-5 w-5" />,
      color: 'bg-amber-100 text-amber-600',
    },
    {
      name: 'Completed This Month',
      value: 12,
      icon: <CheckCircle className="h-5 w-5" />,
      color: 'bg-emerald-100 text-emerald-600',
    },
  ]

  const today = new Date()
  const greeting = today.getHours() < 12 ? 'Good morning' : today.getHours() < 18 ? 'Good afternoon' : 'Good evening'

  return (
    <PageContainer>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-display text-slate-900">
          {greeting}, Dr. Smith
        </h1>
        <p className="mt-1 text-body text-slate-500">
          {format(today, 'EEEE, MMMM d, yyyy')}
        </p>
      </div>

      {/* Quick Actions */}
      <div className="flex gap-3 mb-8">
        <Link to="/patients/new">
          <Button leftIcon={<Plus className="h-4 w-4" />}>
            New Patient
          </Button>
        </Link>
        <Link to="/cycles/new">
          <Button variant="secondary" leftIcon={<Plus className="h-4 w-4" />}>
            New Cycle
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <Card key={stat.name} hover>
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-xl ${stat.color}`}>{stat.icon}</div>
              <div>
                <p className="text-small text-slate-500">{stat.name}</p>
                <p className="text-h1 text-slate-900">{stat.value}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Patients */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Patients</CardTitle>
            <Link to="/patients">
              <Button variant="ghost" size="sm" rightIcon={<ArrowRight className="h-4 w-4" />}>
                View all
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentPatients?.map((patient) => (
                <Link
                  key={patient.id}
                  to={`/patients/${patient.id}`}
                  className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg transition-colors -mx-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-primary-600">
                        {patient.name?.[0]}{patient.surname?.[0]}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">
                        {patient.surname} {patient.name}
                      </p>
                      <p className="text-small text-slate-500">
                        AM: {patient.am || 'N/A'}
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-slate-400" />
                </Link>
              ))}
              {(!recentPatients || recentPatients.length === 0) && (
                <p className="text-center text-slate-500 py-4">No patients yet</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Active Cycles */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Cycles</CardTitle>
            <Link to="/cycles">
              <Button variant="ghost" size="sm" rightIcon={<ArrowRight className="h-4 w-4" />}>
                View all
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentCycles?.map((cycle: any) => (
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
                        {cycle.patients_female?.surname} {cycle.patients_female?.name}
                      </p>
                      <p className="text-small text-slate-500">
                        {cycle.cycle_type || 'IVF'} - Cycle #{cycle.cycle_number || 1}
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant={
                      cycle.status === 'completed'
                        ? 'success'
                        : cycle.status === 'cancelled'
                        ? 'error'
                        : 'info'
                    }
                  >
                    {cycle.status || 'Active'}
                  </Badge>
                </Link>
              ))}
              {(!recentCycles || recentCycles.length === 0) && (
                <p className="text-center text-slate-500 py-4">No cycles yet</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  )
}
