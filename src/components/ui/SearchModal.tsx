import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, User, GitBranch, Loader2 } from 'lucide-react'
import { useSearch, type SearchResult } from '../../hooks/useSearch'
import { useEscapeKey } from '../../hooks'

interface SearchModalProps {
  isOpen: boolean
  onClose: () => void
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()

  const { data: results = [], isLoading } = useSearch(query, isOpen)

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setQuery('')
      setSelectedIndex(0)
      // Focus input after a brief delay to ensure modal is rendered
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [isOpen])

  // Reset selection when results change
  useEffect(() => {
    setSelectedIndex(0)
  }, [results])

  // Handle escape key
  useEscapeKey(onClose, isOpen)

  // Handle keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault()
          setSelectedIndex((prev) => (prev + 1) % Math.max(results.length, 1))
          break
        case 'ArrowUp':
          e.preventDefault()
          setSelectedIndex((prev) => (prev - 1 + results.length) % Math.max(results.length, 1))
          break
        case 'Enter':
          e.preventDefault()
          if (results[selectedIndex]) {
            navigate(results[selectedIndex].path)
            onClose()
          }
          break
      }
    },
    [results, selectedIndex, navigate, onClose]
  )

  const handleResultClick = (result: SearchResult) => {
    navigate(result.path)
    onClose()
  }

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-x-4 top-[20%] md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-lg z-50">
        <div className="bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden">
          {/* Search input */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-100">
            <Search className="h-5 w-5 text-slate-400 shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search patients, cycles..."
              className="flex-1 text-base text-slate-900 placeholder-slate-400 outline-none"
              autoComplete="off"
            />
            {isLoading && <Loader2 className="h-5 w-5 text-slate-400 animate-spin" />}
          </div>

          {/* Results */}
          <div className="max-h-80 overflow-y-auto">
            {query.length < 2 ? (
              <div className="px-4 py-8 text-center">
                <p className="text-sm text-slate-400">Type at least 2 characters to search</p>
              </div>
            ) : results.length === 0 && !isLoading ? (
              <div className="px-4 py-8 text-center">
                <p className="text-sm text-slate-500">No results found for "{query}"</p>
              </div>
            ) : (
              <ul className="py-2">
                {results.map((result, index) => (
                  <li key={`${result.type}-${result.id}`}>
                    <button
                      onClick={() => handleResultClick(result)}
                      onMouseEnter={() => setSelectedIndex(index)}
                      className={`
                        w-full flex items-center gap-3 px-4 py-3 text-left transition-colors
                        ${index === selectedIndex ? 'bg-primary-50' : 'hover:bg-slate-50'}
                      `}
                    >
                      <div
                        className={`
                          w-10 h-10 rounded-lg flex items-center justify-center shrink-0
                          ${result.type === 'patient' ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'}
                        `}
                      >
                        {result.type === 'patient' ? (
                          <User className="h-5 w-5" />
                        ) : (
                          <GitBranch className="h-5 w-5" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-900 truncate">
                          {result.title}
                        </p>
                        <p className="text-xs text-slate-500 truncate">{result.subtitle}</p>
                      </div>
                      <span className="text-xs text-slate-400 capitalize shrink-0">
                        {result.type}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Footer */}
          <div className="px-4 py-2 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-[10px]">↑</kbd>
                <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-[10px]">↓</kbd>
                <span className="ml-1">to navigate</span>
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-[10px]">↵</kbd>
                <span className="ml-1">to select</span>
              </span>
            </div>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-[10px]">esc</kbd>
              <span className="ml-1">to close</span>
            </span>
          </div>
        </div>
      </div>
    </>
  )
}
