// Embryo grading types based on Gardner grading system

export interface Embryo {
  id: string
  cycle_id: string
  embryo_number: number
  day: number // Day 0, 1, 2, 3, 4, 5, 6
  cell_count?: number // For cleavage stage (Day 2-3)
  fragmentation?: number // Percentage 0-50+
  symmetry?: 'equal' | 'unequal' | 'severe'

  // Blastocyst grading (Day 5-6)
  expansion?: BlastocystExpansion
  icm_grade?: 'A' | 'B' | 'C' // Inner Cell Mass
  te_grade?: 'A' | 'B' | 'C' // Trophectoderm

  // Combined grade display
  grade: string // e.g., "8-cell Grade 1" or "4AA"
  quality: EmbryoQuality

  status: EmbryoStatus
  disposition?: EmbryoDisposition

  // Dates
  fertilization_date?: string
  freeze_date?: string
  thaw_date?: string
  transfer_date?: string
  biopsy_date?: string

  // PGT (Preimplantation Genetic Testing)
  pgt_result?: 'euploid' | 'aneuploid' | 'mosaic' | 'no_result' | 'pending'
  pgt_details?: string

  // Storage
  straw_number?: string
  tank?: string
  position?: string

  notes?: string
  created_at: string
  updated_at: string
}

export type BlastocystExpansion = 1 | 2 | 3 | 4 | 5 | 6
// 1 = Early blastocyst, cavity < 50%
// 2 = Blastocyst, cavity > 50%
// 3 = Full blastocyst
// 4 = Expanded blastocyst
// 5 = Hatching blastocyst
// 6 = Hatched blastocyst

export type EmbryoQuality = 'excellent' | 'good' | 'fair' | 'poor'

export type EmbryoStatus =
  | 'developing'
  | 'arrested'
  | 'transferred'
  | 'frozen'
  | 'thawed'
  | 'biopsied'
  | 'discarded'

export type EmbryoDisposition =
  | 'fresh_transfer'
  | 'frozen'
  | 'discarded'
  | 'donated'
  | 'research'

// Helper functions for grading
export function getCleavageGrade(cellCount: number, fragmentation: number, symmetry: string): string {
  let grade = 1
  if (fragmentation > 25 || symmetry === 'severe') grade = 3
  else if (fragmentation > 10 || symmetry === 'unequal') grade = 2

  return `${cellCount}-cell Grade ${grade}`
}

export function getBlastocystGrade(expansion: BlastocystExpansion, icm: string, te: string): string {
  return `${expansion}${icm}${te}`
}

export function getQualityFromGrade(grade: string, day: number): EmbryoQuality {
  if (day <= 3) {
    // Cleavage stage
    if (grade.includes('Grade 1')) return 'excellent'
    if (grade.includes('Grade 2')) return 'good'
    if (grade.includes('Grade 3')) return 'fair'
    return 'poor'
  } else {
    // Blastocyst stage
    if (grade.includes('AA')) return 'excellent'
    if (grade.includes('AB') || grade.includes('BA') || grade.includes('BB')) return 'good'
    if (grade.includes('BC') || grade.includes('CB')) return 'fair'
    return 'poor'
  }
}

export function getQualityColor(quality: EmbryoQuality): string {
  switch (quality) {
    case 'excellent': return 'bg-emerald-100 text-emerald-800 border-emerald-200'
    case 'good': return 'bg-blue-100 text-blue-800 border-blue-200'
    case 'fair': return 'bg-amber-100 text-amber-800 border-amber-200'
    case 'poor': return 'bg-slate-100 text-slate-600 border-slate-200'
  }
}

export function getStatusColor(status: EmbryoStatus): string {
  switch (status) {
    case 'developing': return 'bg-blue-100 text-blue-800'
    case 'transferred': return 'bg-teal-100 text-teal-800'
    case 'frozen': return 'bg-cyan-100 text-cyan-800'
    case 'thawed': return 'bg-purple-100 text-purple-800'
    case 'biopsied': return 'bg-indigo-100 text-indigo-800'
    case 'arrested': return 'bg-slate-100 text-slate-600'
    case 'discarded': return 'bg-slate-100 text-slate-500'
  }
}

// Expected cell counts by day
export const expectedCellCounts: Record<number, { min: number; ideal: number; max: number }> = {
  1: { min: 2, ideal: 2, max: 2 }, // Pronuclei stage
  2: { min: 2, ideal: 4, max: 6 },
  3: { min: 6, ideal: 8, max: 10 },
  4: { min: 10, ideal: 16, max: 32 }, // Morula
  5: { min: 0, ideal: 0, max: 0 }, // Blastocyst - use expansion instead
  6: { min: 0, ideal: 0, max: 0 },
}
