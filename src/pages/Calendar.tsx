import { useState, useMemo } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Loader2,
} from 'lucide-react'
import { supabase } from '../lib/supabase'
import { Button, Modal, ModalFooter } from '../components/ui'

interface Appointment {
  id: string
  patient_id: string
  title: string
  description: string | null
  appointment_date: string
  appointment_time: string
  duration_minutes: number
  type: 'consultation' | 'procedure' | 'followup' | 'ultrasound' | 'lab'
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled'
  patient?: {
    first_name: string
    last_name: string
  }
}

interface Patient {
  id: string
  first_name: string
  last_name: string
}

const APPOINTMENT_TYPES = [
  { value: 'consultation', label: 'Consultation', color: 'bg-blue-500' },
  { value: 'procedure', label: 'Procedure', color: 'bg-purple-500' },
  { value: 'followup', label: 'Follow-up', color: 'bg-green-500' },
  { value: 'ultrasound', label: 'Ultrasound', color: 'bg-pink-500' },
  { value: 'lab', label: 'Lab Work', color: 'bg-orange-500' },
]

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

export function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null)

  const queryClient = useQueryClient()

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  // Fetch appointments for the current month
  const { data: appointments = [], isLoading } = useQuery({
    queryKey: ['appointments', year, month],
    queryFn: async () => {
      const startOfMonth = new Date(year, month, 1).toISOString().split('T')[0]
      const endOfMonth = new Date(year, month + 1, 0).toISOString().split('T')[0]

      const { data, error } = await (supabase
        .from('appointments')
        .select(`
          *,
          patient:patients(first_name, last_name)
        `)
        .gte('appointment_date', startOfMonth)
        .lte('appointment_date', endOfMonth)
        .order('appointment_time') as any)

      if (error) throw error
      return (data || []) as Appointment[]
    },
  })

  // Fetch patients for the dropdown
  const { data: patients = [] } = useQuery({
    queryKey: ['patients-list'],
    queryFn: async () => {
      const { data, error } = await (supabase
        .from('patients')
        .select('id, first_name, last_name')
        .order('last_name') as any)

      if (error) throw error
      return (data || []) as Patient[]
    },
  })

  // Generate calendar days
  const calendarDays = useMemo(() => {
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const startPadding = firstDay.getDay()
    const totalDays = lastDay.getDate()

    const days: Array<{ date: Date; isCurrentMonth: boolean }> = []

    // Previous month padding
    for (let i = startPadding - 1; i >= 0; i--) {
      const date = new Date(year, month, -i)
      days.push({ date, isCurrentMonth: false })
    }

    // Current month days
    for (let i = 1; i <= totalDays; i++) {
      days.push({ date: new Date(year, month, i), isCurrentMonth: true })
    }

    // Next month padding
    const remaining = 42 - days.length // 6 rows * 7 days
    for (let i = 1; i <= remaining; i++) {
      days.push({ date: new Date(year, month + 1, i), isCurrentMonth: false })
    }

    return days
  }, [year, month])

  // Group appointments by date
  const appointmentsByDate = useMemo(() => {
    const grouped: Record<string, Appointment[]> = {}
    appointments.forEach((apt) => {
      if (!grouped[apt.appointment_date]) {
        grouped[apt.appointment_date] = []
      }
      grouped[apt.appointment_date].push(apt)
    })
    return grouped
  }, [appointments])

  const goToPrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1))
  }

  const goToNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1))
  }

  const goToToday = () => {
    setCurrentDate(new Date())
  }

  const handleDayClick = (date: Date) => {
    setSelectedDate(date)
    setEditingAppointment(null)
    setIsModalOpen(true)
  }

  const handleAppointmentClick = (apt: Appointment, e: React.MouseEvent) => {
    e.stopPropagation()
    setEditingAppointment(apt)
    setSelectedDate(new Date(apt.appointment_date))
    setIsModalOpen(true)
  }

  const isToday = (date: Date) => {
    const today = new Date()
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    )
  }

  const formatDateKey = (date: Date) => {
    return date.toISOString().split('T')[0]
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-display text-slate-900">Calendar</h1>
          <p className="mt-1 text-body text-slate-500">Manage appointments and schedules</p>
        </div>
        <Button onClick={() => { setSelectedDate(new Date()); setEditingAppointment(null); setIsModalOpen(true); }}>
          <Plus className="h-4 w-4 mr-2" />
          New Appointment
        </Button>
      </div>

      {/* Calendar Controls */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <button
            onClick={goToPrevMonth}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <ChevronLeft className="h-5 w-5 text-slate-600" />
          </button>
          <button
            onClick={goToNextMonth}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <ChevronRight className="h-5 w-5 text-slate-600" />
          </button>
          <h2 className="text-lg font-semibold text-slate-900 ml-2">
            {MONTHS[month]} {year}
          </h2>
        </div>
        <Button variant="secondary" size="sm" onClick={goToToday}>
          Today
        </Button>
      </div>

      {/* Calendar Grid */}
      <div className="flex-1 bg-white rounded-xl border border-slate-200 overflow-hidden">
        {/* Day headers */}
        <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50">
          {DAYS.map((day) => (
            <div
              key={day}
              className="py-3 text-center text-xs font-medium text-slate-500 uppercase tracking-wider"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar days */}
        {isLoading ? (
          <div className="flex items-center justify-center h-96">
            <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
          </div>
        ) : (
          <div className="grid grid-cols-7 divide-x divide-y divide-slate-100">
            {calendarDays.map(({ date, isCurrentMonth }, index) => {
              const dateKey = formatDateKey(date)
              const dayAppointments = appointmentsByDate[dateKey] || []
              const isCurrentDay = isToday(date)

              return (
                <div
                  key={index}
                  onClick={() => handleDayClick(date)}
                  className={`
                    min-h-[100px] md:min-h-[120px] p-1 md:p-2 cursor-pointer transition-colors
                    ${isCurrentMonth ? 'bg-white hover:bg-slate-50' : 'bg-slate-50/50'}
                  `}
                >
                  <div
                    className={`
                      text-sm font-medium mb-1 w-7 h-7 flex items-center justify-center rounded-full
                      ${isCurrentDay ? 'bg-primary-600 text-white' : ''}
                      ${!isCurrentMonth ? 'text-slate-300' : 'text-slate-700'}
                    `}
                  >
                    {date.getDate()}
                  </div>

                  {/* Appointments */}
                  <div className="space-y-1">
                    {dayAppointments.slice(0, 3).map((apt) => {
                      const typeConfig = APPOINTMENT_TYPES.find((t) => t.value === apt.type)
                      return (
                        <button
                          key={apt.id}
                          onClick={(e) => handleAppointmentClick(apt, e)}
                          className={`
                            w-full text-left px-1.5 py-0.5 rounded text-xs truncate
                            ${typeConfig?.color || 'bg-slate-500'} text-white
                            hover:opacity-90 transition-opacity
                          `}
                        >
                          <span className="hidden md:inline">{apt.appointment_time.slice(0, 5)} </span>
                          {apt.title}
                        </button>
                      )
                    })}
                    {dayAppointments.length > 3 && (
                      <div className="text-xs text-slate-400 pl-1">
                        +{dayAppointments.length - 3} more
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Appointment Modal */}
      <AppointmentModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingAppointment(null)
        }}
        selectedDate={selectedDate}
        appointment={editingAppointment}
        patients={patients}
        onSuccess={() => {
          queryClient.invalidateQueries({ queryKey: ['appointments'] })
          setIsModalOpen(false)
          setEditingAppointment(null)
        }}
      />
    </div>
  )
}

interface AppointmentModalProps {
  isOpen: boolean
  onClose: () => void
  selectedDate: Date | null
  appointment: Appointment | null
  patients: Patient[]
  onSuccess: () => void
}

function AppointmentModal({
  isOpen,
  onClose,
  selectedDate,
  appointment,
  patients,
  onSuccess,
}: AppointmentModalProps) {
  const [formData, setFormData] = useState({
    patient_id: '',
    title: '',
    description: '',
    appointment_date: '',
    appointment_time: '09:00',
    duration_minutes: 30,
    type: 'consultation' as Appointment['type'],
    status: 'scheduled' as Appointment['status'],
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Reset form when modal opens
  useState(() => {
    if (isOpen) {
      if (appointment) {
        setFormData({
          patient_id: appointment.patient_id,
          title: appointment.title,
          description: appointment.description || '',
          appointment_date: appointment.appointment_date,
          appointment_time: appointment.appointment_time.slice(0, 5),
          duration_minutes: appointment.duration_minutes,
          type: appointment.type,
          status: appointment.status,
        })
      } else {
        setFormData({
          patient_id: '',
          title: '',
          description: '',
          appointment_date: selectedDate?.toISOString().split('T')[0] || '',
          appointment_time: '09:00',
          duration_minutes: 30,
          type: 'consultation',
          status: 'scheduled',
        })
      }
    }
  })

  // Update form when selectedDate or appointment changes
  if (isOpen && selectedDate && !appointment && formData.appointment_date !== selectedDate.toISOString().split('T')[0]) {
    setFormData((prev) => ({
      ...prev,
      appointment_date: selectedDate.toISOString().split('T')[0],
    }))
  }

  if (isOpen && appointment && formData.patient_id !== appointment.patient_id) {
    setFormData({
      patient_id: appointment.patient_id,
      title: appointment.title,
      description: appointment.description || '',
      appointment_date: appointment.appointment_date,
      appointment_time: appointment.appointment_time.slice(0, 5),
      duration_minutes: appointment.duration_minutes,
      type: appointment.type,
      status: appointment.status,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const data = {
        ...formData,
        appointment_time: formData.appointment_time + ':00',
      }

      if (appointment) {
        const { error } = await (supabase
          .from('appointments') as any)
          .update(data)
          .eq('id', appointment.id)

        if (error) throw error
      } else {
        const { error } = await (supabase
          .from('appointments') as any)
          .insert(data)

        if (error) throw error
      }

      onSuccess()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!appointment || !confirm('Are you sure you want to delete this appointment?')) return

    setLoading(true)
    try {
      const { error } = await (supabase
        .from('appointments')
        .delete()
        .eq('id', appointment.id) as any)

      if (error) throw error
      onSuccess()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={appointment ? 'Edit Appointment' : 'New Appointment'}
    >
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Patient
            </label>
            <select
              value={formData.patient_id}
              onChange={(e) => setFormData({ ...formData, patient_id: e.target.value })}
              required
              className="block w-full px-3 py-2.5 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">Select a patient</option>
              {patients.map((patient) => (
                <option key={patient.id} value={patient.id}>
                  {patient.first_name} {patient.last_name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              placeholder="e.g., Initial Consultation"
              className="block w-full px-3 py-2.5 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Date
              </label>
              <input
                type="date"
                value={formData.appointment_date}
                onChange={(e) => setFormData({ ...formData, appointment_date: e.target.value })}
                required
                className="block w-full px-3 py-2.5 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Time
              </label>
              <input
                type="time"
                value={formData.appointment_time}
                onChange={(e) => setFormData({ ...formData, appointment_time: e.target.value })}
                required
                className="block w-full px-3 py-2.5 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Type
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as Appointment['type'] })}
                className="block w-full px-3 py-2.5 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                {APPOINTMENT_TYPES.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Duration
              </label>
              <select
                value={formData.duration_minutes}
                onChange={(e) => setFormData({ ...formData, duration_minutes: parseInt(e.target.value) })}
                className="block w-full px-3 py-2.5 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value={15}>15 minutes</option>
                <option value={30}>30 minutes</option>
                <option value={45}>45 minutes</option>
                <option value={60}>1 hour</option>
                <option value={90}>1.5 hours</option>
                <option value={120}>2 hours</option>
              </select>
            </div>
          </div>

          {appointment && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as Appointment['status'] })}
                className="block w-full px-3 py-2.5 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="scheduled">Scheduled</option>
                <option value="confirmed">Confirmed</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Notes (optional)
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              placeholder="Add any notes..."
              className="block w-full px-3 py-2.5 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
            />
          </div>
        </div>

        <ModalFooter>
          <div className="flex justify-between w-full">
            <div>
              {appointment && (
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleDelete}
                  disabled={loading}
                  className="text-red-600 hover:bg-red-50"
                >
                  Delete
                </Button>
              )}
            </div>
            <div className="flex gap-3">
              <Button type="button" variant="secondary" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Saving...
                  </>
                ) : appointment ? (
                  'Update Appointment'
                ) : (
                  'Create Appointment'
                )}
              </Button>
            </div>
          </div>
        </ModalFooter>
      </form>
    </Modal>
  )
}
