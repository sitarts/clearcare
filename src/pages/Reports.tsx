import { useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  Users,
  GitBranch,
  TrendingUp,
  Activity,
  Download,
} from 'lucide-react'
import { supabase } from '../lib/supabase'
import { Card, CardHeader, CardTitle, CardContent, Button } from '../components/ui'

type DateRange = '7d' | '30d' | '90d' | '1y' | 'all'

interface Stats {
  totalPatients: number
  totalCycles: number
  activeCycles: number
  completedCycles: number
  successfulCycles: number
  totalEmbryos: number
  avgPatientAge: number
}

interface CyclesByType {
  type: string
  count: number
}

interface CyclesByStatus {
  status: string
  count: number
}

interface MonthlyData {
  month: string
  cycles: number
  patients: number
}

export function Reports() {
  const [dateRange, setDateRange] = useState<DateRange>('30d')

  const dateFilter = useMemo(() => {
    const now = new Date()
    switch (dateRange) {
      case '7d':
        return new Date(now.setDate(now.getDate() - 7)).toISOString()
      case '30d':
        return new Date(now.setDate(now.getDate() - 30)).toISOString()
      case '90d':
        return new Date(now.setDate(now.getDate() - 90)).toISOString()
      case '1y':
        return new Date(now.setFullYear(now.getFullYear() - 1)).toISOString()
      default:
        return null
    }
  }, [dateRange])

  // Fetch summary statistics
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['reports-stats', dateFilter],
    queryFn: async () => {
      // Get patients count
      const { count: totalPatients } = await (supabase
        .from('patients_female')
        .select('*', { count: 'exact', head: true }) as any)

      // Get cycles data
      const { data: cycles } = await (supabase
        .from('cycles')
        .select('cycle_status, cycle_type, outcome') as any)

      const cyclesArray = cycles || []
      const totalCycles = cyclesArray.length
      const activeCycles = cyclesArray.filter((c: any) =>
        ['stimulation', 'opu', 'transfer', 'luteal', 'planned', 'monitoring'].includes(c.cycle_status)
      ).length
      const completedCycles = cyclesArray.filter((c: any) =>
        c.cycle_status === 'completed'
      ).length
      const successfulCycles = cyclesArray.filter((c: any) =>
        c.outcome === 'pregnant' || c.outcome === 'clinical_pregnancy'
      ).length

      // Get embryos count
      const { count: totalEmbryos } = await (supabase
        .from('embryos')
        .select('*', { count: 'exact', head: true }) as any)

      // Get average patient age
      const { data: patients } = await (supabase
        .from('patients_female')
        .select('date_of_birth') as any)

      let avgPatientAge = 0
      if (patients && patients.length > 0) {
        const ages = patients
          .filter((p: any) => p.date_of_birth)
          .map((p: any) => {
            const today = new Date()
            const birth = new Date(p.date_of_birth)
            return Math.floor((today.getTime() - birth.getTime()) / (365.25 * 24 * 60 * 60 * 1000))
          })
        avgPatientAge = ages.length > 0 ? Math.round(ages.reduce((a: number, b: number) => a + b, 0) / ages.length) : 0
      }

      return {
        totalPatients: totalPatients || 0,
        totalCycles,
        activeCycles,
        completedCycles,
        successfulCycles,
        totalEmbryos: totalEmbryos || 0,
        avgPatientAge,
      } as Stats
    },
  })

  // Fetch cycles by type
  const { data: cyclesByType = [] } = useQuery({
    queryKey: ['reports-cycles-by-type'],
    queryFn: async () => {
      const { data } = await (supabase
        .from('cycles')
        .select('cycle_type') as any)

      if (!data) return []

      const counts: Record<string, number> = {}
      data.forEach((cycle: any) => {
        counts[cycle.cycle_type] = (counts[cycle.cycle_type] || 0) + 1
      })

      return Object.entries(counts).map(([type, count]) => ({
        type,
        count,
      })) as CyclesByType[]
    },
  })

  // Fetch cycles by status
  const { data: cyclesByStatus = [] } = useQuery({
    queryKey: ['reports-cycles-by-status'],
    queryFn: async () => {
      const { data } = await (supabase
        .from('cycles')
        .select('cycle_status') as any)

      if (!data) return []

      const counts: Record<string, number> = {}
      data.forEach((cycle: any) => {
        const status = cycle.cycle_status || 'unknown'
        counts[status] = (counts[status] || 0) + 1
      })

      return Object.entries(counts).map(([status, count]) => ({
        status,
        count,
      })) as CyclesByStatus[]
    },
  })

  // Fetch monthly trends
  const { data: monthlyData = [] } = useQuery({
    queryKey: ['reports-monthly'],
    queryFn: async () => {
      const months: MonthlyData[] = []
      const now = new Date()

      for (let i = 5; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
        const startOfMonth = date.toISOString().split('T')[0]
        const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).toISOString().split('T')[0]

        const { count: cycleCount } = await (supabase
          .from('cycles')
          .select('*', { count: 'exact', head: true })
          .gte('stimulation_start_date', startOfMonth)
          .lte('stimulation_start_date', endOfMonth) as any)

        const { count: patientCount } = await (supabase
          .from('patients_female')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', startOfMonth)
          .lte('created_at', endOfMonth + 'T23:59:59') as any)

        months.push({
          month: date.toLocaleDateString('en-US', { month: 'short' }),
          cycles: cycleCount || 0,
          patients: patientCount || 0,
        })
      }

      return months
    },
  })

  const successRate = stats && stats.completedCycles > 0
    ? Math.round((stats.successfulCycles / stats.completedCycles) * 100)
    : 0

  const maxMonthlyValue = Math.max(
    ...monthlyData.map((d) => Math.max(d.cycles, d.patients)),
    1
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-display text-slate-900">Reports & Analytics</h1>
          <p className="mt-1 text-body text-slate-500">
            Track performance metrics and outcomes
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value as DateRange)}
            className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
            <option value="all">All time</option>
          </select>
          <Button variant="secondary" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          title="Total Patients"
          value={stats?.totalPatients || 0}
          icon={Users}
          color="blue"
          loading={statsLoading}
        />
        <StatCard
          title="Total Cycles"
          value={stats?.totalCycles || 0}
          icon={GitBranch}
          color="purple"
          loading={statsLoading}
        />
        <StatCard
          title="Active Cycles"
          value={stats?.activeCycles || 0}
          icon={Activity}
          color="green"
          loading={statsLoading}
        />
        <StatCard
          title="Success Rate"
          value={`${successRate}%`}
          icon={TrendingUp}
          color="coral"
          loading={statsLoading}
        />
      </div>

      {/* Charts Row */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Cycles by Type */}
        <Card>
          <CardHeader>
            <CardTitle>Cycles by Type</CardTitle>
          </CardHeader>
          <CardContent>
            {cyclesByType.length === 0 ? (
              <div className="text-center py-8 text-slate-400">
                No cycle data available
              </div>
            ) : (
              <div className="space-y-3">
                {cyclesByType.map((item) => {
                  const total = cyclesByType.reduce((sum, c) => sum + c.count, 0)
                  const percentage = Math.round((item.count / total) * 100)
                  return (
                    <div key={item.type}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium text-slate-700 capitalize">
                          {item.type.replace('_', ' ')}
                        </span>
                        <span className="text-slate-500">
                          {item.count} ({percentage}%)
                        </span>
                      </div>
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary-500 rounded-full transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Cycles by Status */}
        <Card>
          <CardHeader>
            <CardTitle>Cycles by Status</CardTitle>
          </CardHeader>
          <CardContent>
            {cyclesByStatus.length === 0 ? (
              <div className="text-center py-8 text-slate-400">
                No cycle data available
              </div>
            ) : (
              <div className="space-y-3">
                {cyclesByStatus.map((item) => {
                  const total = cyclesByStatus.reduce((sum, c) => sum + c.count, 0)
                  const percentage = Math.round((item.count / total) * 100)
                  const colors: Record<string, string> = {
                    planning: 'bg-slate-400',
                    stimulation: 'bg-blue-500',
                    retrieval: 'bg-purple-500',
                    transfer: 'bg-pink-500',
                    tww: 'bg-orange-500',
                    pregnant: 'bg-green-500',
                    completed: 'bg-teal-500',
                    cancelled: 'bg-red-500',
                  }
                  return (
                    <div key={item.status}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium text-slate-700 capitalize">
                          {item.status === 'tww' ? 'Two Week Wait' : item.status}
                        </span>
                        <span className="text-slate-500">
                          {item.count} ({percentage}%)
                        </span>
                      </div>
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${colors[item.status] || 'bg-slate-400'}`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Monthly Trends */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Trends</CardTitle>
        </CardHeader>
        <CardContent>
          {monthlyData.length === 0 ? (
            <div className="text-center py-8 text-slate-400">
              No trend data available
            </div>
          ) : (
            <div>
              <div className="flex items-center gap-6 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-primary-500 rounded" />
                  <span className="text-sm text-slate-600">New Cycles</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-teal-500 rounded" />
                  <span className="text-sm text-slate-600">New Patients</span>
                </div>
              </div>
              <div className="flex items-end gap-4 h-48">
                {monthlyData.map((data, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center gap-2">
                    <div className="w-full flex items-end justify-center gap-1 h-40">
                      <div
                        className="w-5 bg-primary-500 rounded-t transition-all duration-500"
                        style={{
                          height: `${(data.cycles / maxMonthlyValue) * 100}%`,
                          minHeight: data.cycles > 0 ? '8px' : '0',
                        }}
                        title={`${data.cycles} cycles`}
                      />
                      <div
                        className="w-5 bg-teal-500 rounded-t transition-all duration-500"
                        style={{
                          height: `${(data.patients / maxMonthlyValue) * 100}%`,
                          minHeight: data.patients > 0 ? '8px' : '0',
                        }}
                        title={`${data.patients} patients`}
                      />
                    </div>
                    <span className="text-xs text-slate-500">{data.month}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Additional Metrics */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Patient Demographics</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-4">
              <div className="flex justify-between">
                <dt className="text-sm text-slate-500">Average Age</dt>
                <dd className="text-sm font-medium text-slate-900">
                  {stats?.avgPatientAge || 0} years
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm text-slate-500">Total Patients</dt>
                <dd className="text-sm font-medium text-slate-900">
                  {stats?.totalPatients || 0}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm text-slate-500">With Active Cycles</dt>
                <dd className="text-sm font-medium text-slate-900">
                  {stats?.activeCycles || 0}
                </dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Cycle Outcomes</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-4">
              <div className="flex justify-between">
                <dt className="text-sm text-slate-500">Completed</dt>
                <dd className="text-sm font-medium text-slate-900">
                  {stats?.completedCycles || 0}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm text-slate-500">Successful (Pregnant)</dt>
                <dd className="text-sm font-medium text-green-600">
                  {stats?.successfulCycles || 0}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm text-slate-500">Success Rate</dt>
                <dd className="text-sm font-medium text-slate-900">
                  {successRate}%
                </dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Embryology Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-4">
              <div className="flex justify-between">
                <dt className="text-sm text-slate-500">Total Embryos</dt>
                <dd className="text-sm font-medium text-slate-900">
                  {stats?.totalEmbryos || 0}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm text-slate-500">Avg per Cycle</dt>
                <dd className="text-sm font-medium text-slate-900">
                  {stats?.totalCycles && stats.totalCycles > 0
                    ? (stats.totalEmbryos / stats.totalCycles).toFixed(1)
                    : 0}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm text-slate-500">Total Cycles</dt>
                <dd className="text-sm font-medium text-slate-900">
                  {stats?.totalCycles || 0}
                </dd>
              </div>
            </dl>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

interface StatCardProps {
  title: string
  value: string | number
  icon: React.ComponentType<{ className?: string }>
  color: 'blue' | 'purple' | 'green' | 'coral'
  loading?: boolean
}

function StatCard({ title, value, icon: Icon, color, loading }: StatCardProps) {
  const colors = {
    blue: 'bg-blue-50 text-blue-600',
    purple: 'bg-purple-50 text-purple-600',
    green: 'bg-green-50 text-green-600',
    coral: 'bg-coral-50 text-coral-600',
  }

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-lg ${colors[color]}`}>
            <Icon className="h-5 w-5" />
          </div>
          <div>
            {loading ? (
              <div className="h-8 w-16 bg-slate-200 rounded animate-pulse" />
            ) : (
              <p className="text-2xl font-semibold text-slate-900">{value}</p>
            )}
            <p className="text-sm text-slate-500">{title}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
