import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'

export type SearchResultType = 'patient' | 'cycle'

export interface SearchResult {
  id: string
  type: SearchResultType
  title: string
  subtitle: string
  path: string
}

async function searchPatients(query: string): Promise<SearchResult[]> {
  if (!query.trim()) return []

  const { data, error } = await (supabase
    .from('patients')
    .select('id, first_name, last_name, email, phone')
    .or(`first_name.ilike.%${query}%,last_name.ilike.%${query}%,email.ilike.%${query}%`)
    .limit(5) as any)

  if (error || !data) return []

  return data.map((patient: any) => ({
    id: patient.id,
    type: 'patient' as SearchResultType,
    title: `${patient.first_name} ${patient.last_name}`,
    subtitle: patient.email || patient.phone || 'Patient',
    path: `/patients/${patient.id}`,
  }))
}

async function searchCycles(query: string): Promise<SearchResult[]> {
  if (!query.trim()) return []

  // Search cycles by cycle number or patient name
  const { data, error } = await (supabase
    .from('cycles')
    .select(`
      id,
      cycle_number,
      cycle_type,
      status,
      patients!inner (
        first_name,
        last_name
      )
    `)
    .or(`cycle_type.ilike.%${query}%,status.ilike.%${query}%`)
    .limit(5) as any)

  if (error || !data) return []

  return data.map((cycle: any) => ({
    id: cycle.id,
    type: 'cycle' as SearchResultType,
    title: `Cycle #${cycle.cycle_number} - ${cycle.cycle_type}`,
    subtitle: `${cycle.patients.first_name} ${cycle.patients.last_name} • ${cycle.status}`,
    path: `/cycles/${cycle.id}`,
  }))
}

async function performSearch(query: string): Promise<SearchResult[]> {
  const [patients, cycles] = await Promise.all([
    searchPatients(query),
    searchCycles(query),
  ])

  return [...patients, ...cycles]
}

export function useSearch(query: string, enabled = true) {
  const debouncedQuery = useDebounce(query, 200)

  return useQuery({
    queryKey: ['search', debouncedQuery],
    queryFn: () => performSearch(debouncedQuery),
    enabled: enabled && debouncedQuery.length >= 2,
    staleTime: 1000 * 60, // 1 minute
  })
}

// Simple debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])

  return debouncedValue
}
