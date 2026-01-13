import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import { PageContainer } from '../components/layout'
import { Card, CardHeader, CardTitle, Button, Badge } from '../components/ui'
import { Plus, ArrowRight, User } from 'lucide-react'
import { Link } from 'react-router-dom'
import { format } from 'date-fns'

const statusColumns = [
  { id: 'planning', label: 'Planning', color: 'bg-slate-100' },
  { id: 'stimulation', label: 'Stimulation', color: 'bg-blue-100' },
  { id: 'trigger', label: 'Trigger', color: 'bg-purple-100' },
  { id: 'retrieval', label: 'Retrieval', color: 'bg-amber-100' },
  { id: 'transfer', label: 'Transfer', color: 'bg-teal-100' },
  { id: 'tww', label: '2WW', color: 'bg-pink-100' },
]

export function Cycles() {
  const { data: cycles, isLoading } = useQuery({
    queryKey: ['allCycles'],
    queryFn: async () => {
      const { data } = await supabase
        .from('cycles')
        .select(`
          *,
          patients_female (id, surname, name, am)
        `)
        .order('created_at', { ascending: false })
      return data || []
    },
  })

  const getCyclesByStatus = (status: string) => {
    return cycles?.filter((c: any) => c.status === status) || []
  }

  return (
    <PageContainer
      title="Active Cycles"
      description="Visual workflow management for treatment cycles"
      actions={
        <Link to="/cycles/new">
          <Button leftIcon={<Plus className="h-4 w-4" />}>New Cycle</Button>
        </Link>
      }
    >
      {/* Kanban Board */}
      <div className="flex gap-4 overflow-x-auto pb-4">
        {statusColumns.map((column) => {
          const columnCycles = getCyclesByStatus(column.id)
          return (
            <div
              key={column.id}
              className="flex-shrink-0 w-72"
            >
              {/* Column Header */}
              <div className={`px-4 py-3 rounded-t-lg ${column.color}`}>
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-slate-900">{column.label}</h3>
                  <span className="text-small text-slate-600 bg-white/50 px-2 py-0.5 rounded-full">
                    {columnCycles.length}
                  </span>
                </div>
              </div>

              {/* Column Content */}
              <div className="bg-slate-50 rounded-b-lg p-3 min-h-[400px] space-y-3">
                {isLoading ? (
                  [...Array(2)].map((_, i) => (
                    <div key={i} className="bg-white rounded-lg p-4 animate-pulse">
                      <div className="h-4 bg-slate-200 rounded w-3/4 mb-2" />
                      <div className="h-3 bg-slate-200 rounded w-1/2" />
                    </div>
                  ))
                ) : columnCycles.length > 0 ? (
                  columnCycles.map((cycle: any) => (
                    <Link key={cycle.id} to={`/cycles/${cycle.id}`}>
                      <Card hover padding="sm" className="cursor-pointer">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="font-medium text-slate-900">
                              {cycle.patients_female?.surname} {cycle.patients_female?.name}
                            </p>
                            <p className="text-small text-slate-500 font-mono">
                              AM: {cycle.patients_female?.am || 'N/A'}
                            </p>
                          </div>
                          <Badge variant="info" size="sm">
                            {cycle.cycle_type || 'IVF'}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between text-small text-slate-500">
                          <span>Cycle #{cycle.cycle_number || 1}</span>
                          {cycle.start_date && (
                            <span>{format(new Date(cycle.start_date), 'MMM d')}</span>
                          )}
                        </div>
                      </Card>
                    </Link>
                  ))
                ) : (
                  <div className="text-center py-8 text-slate-400 text-small">
                    No cycles
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* All Cycles List */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>All Cycles</CardTitle>
        </CardHeader>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-3 px-6 text-small font-medium text-slate-500">Patient</th>
                <th className="text-left py-3 px-6 text-small font-medium text-slate-500">Type</th>
                <th className="text-left py-3 px-6 text-small font-medium text-slate-500">Cycle #</th>
                <th className="text-left py-3 px-6 text-small font-medium text-slate-500">Start Date</th>
                <th className="text-left py-3 px-6 text-small font-medium text-slate-500">Status</th>
                <th className="text-left py-3 px-6 text-small font-medium text-slate-500">Outcome</th>
                <th className="text-left py-3 px-6"></th>
              </tr>
            </thead>
            <tbody>
              {cycles?.slice(0, 20).map((cycle: any) => (
                <tr key={cycle.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="py-3 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                        <User className="h-4 w-4 text-primary-600" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">
                          {cycle.patients_female?.surname} {cycle.patients_female?.name}
                        </p>
                        <p className="text-small text-slate-500 font-mono">
                          AM: {cycle.patients_female?.am || 'N/A'}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-6">{cycle.cycle_type || 'IVF'}</td>
                  <td className="py-3 px-6 font-mono">{cycle.cycle_number || '-'}</td>
                  <td className="py-3 px-6">
                    {cycle.start_date ? format(new Date(cycle.start_date), 'MMM d, yyyy') : '-'}
                  </td>
                  <td className="py-3 px-6">
                    <Badge
                      variant={
                        cycle.status === 'completed' ? 'success' :
                        cycle.status === 'cancelled' ? 'error' : 'info'
                      }
                    >
                      {cycle.status || 'Active'}
                    </Badge>
                  </td>
                  <td className="py-3 px-6">
                    {cycle.pregnant ? (
                      <Badge variant="teal">Pregnant</Badge>
                    ) : (
                      cycle.outcome || '-'
                    )}
                  </td>
                  <td className="py-3 px-6">
                    <Link to={`/cycles/${cycle.id}`}>
                      <Button variant="ghost" size="sm">
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </PageContainer>
  )
}
