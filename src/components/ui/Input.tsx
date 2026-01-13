import { forwardRef, type InputHTMLAttributes, type TextareaHTMLAttributes, type ReactNode, type SelectHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, className = '', id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="label">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`
            input
            ${error ? 'border-coral-500 focus:ring-coral-500 focus:border-coral-500' : ''}
            ${className}
          `}
          {...props}
        />
        {error && <p className="mt-1 text-small text-coral-600">{error}</p>}
        {hint && !error && <p className="mt-1 text-small text-slate-500">{hint}</p>}
      </div>
    )
  }
)

Input.displayName = 'Input'

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  hint?: string
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, hint, className = '', id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="label">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={inputId}
          className={`
            input min-h-[100px] resize-y
            ${error ? 'border-coral-500 focus:ring-coral-500 focus:border-coral-500' : ''}
            ${className}
          `}
          {...props}
        />
        {error && <p className="mt-1 text-small text-coral-600">{error}</p>}
        {hint && !error && <p className="mt-1 text-small text-slate-500">{hint}</p>}
      </div>
    )
  }
)

Textarea.displayName = 'Textarea'

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  hint?: string
  options?: { value: string; label: string }[]
  children?: ReactNode
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, hint, options, children, className = '', id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="label">
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={inputId}
          className={`
            input
            ${error ? 'border-coral-500 focus:ring-coral-500 focus:border-coral-500' : ''}
            ${className}
          `}
          {...props}
        >
          {children ? children : (
            <>
              <option value="">Select...</option>
              {options?.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </>
          )}
        </select>
        {error && <p className="mt-1 text-small text-coral-600">{error}</p>}
        {hint && !error && <p className="mt-1 text-small text-slate-500">{hint}</p>}
      </div>
    )
  }
)

Select.displayName = 'Select'
