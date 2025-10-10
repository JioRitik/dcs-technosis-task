import React, { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

const FormRenderer = ({ form, onSubmit, loading = false }) => {
  const [isPending, startTransition] = useTransition()
  
  // Dynamic validation schema generation
  const validationSchema = React.useMemo(() => {
    const schema = {}
    
    form.fields?.forEach(field => {
      let fieldSchema = yup.string()
      
      if (field.required) {
        fieldSchema = fieldSchema.required(`${field.label} is required`)
      }
      
      switch (field.type) {
        case 'email':
          fieldSchema = fieldSchema.email('Invalid email format')
          break
        case 'number':
          fieldSchema = yup.number().required(`${field.label} must be a number`)
          break
        case 'date':
          fieldSchema = yup.date().required(`${field.label} must be a valid date`)
          break
      }
      
      schema[field.name] = fieldSchema
    })
    
    return yup.object().shape(schema)
  }, [form.fields])

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm({
    resolver: yupResolver(validationSchema)
  })

  const onSubmitHandler = (data) => {
    startTransition(() => {
      onSubmit(data)
    })
  }

  const renderField = (field) => {
    const commonProps = {
      ...register(field.name),
      id: field.name,
      className: `text-black mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
        errors[field.name] ? 'border-red-300' : ''
      }`
    }

    switch (field.type) {
      case 'text':
      case 'email':
        return (
          <input
            type={field.type}
            placeholder={field.placeholder}
            className='text-black'
            {...commonProps}
          />
        )
      
      case 'number':
        return (
          <input
            type="number"
            placeholder={field.placeholder}
            className='text-black'
            {...commonProps}
          />
        )
      
      case 'date':
        return (
          <input
            type="date"
            className='text-black'
            {...commonProps}
          />
        )
      
      case 'select':
        return (
          <select {...commonProps}>
            <option value="">Select {field.label}</option>
            {field.options?.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        )
      
      case 'textarea':
        return (
          <textarea
            rows={4}
            placeholder={field.placeholder}
            {...commonProps}
          />
        )
      
      case 'checkbox':
        return (
          <div className="flex items-center">
            <input
              type="checkbox"
              {...register(field.name)}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label htmlFor={field.name} className="ml-2 block text-sm text-gray-900">
              {field.label}
            </label>
          </div>
        )
      
      default:
        return null
    }
  }

  if (!form.fields?.length) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No form fields available</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmitHandler)} className="space-y-6">
      {form.fields.map((field) => (
        <div key={field.name}>
          {field.type !== 'checkbox' && (
            <label htmlFor={field.name} className="block text-sm font-medium text-gray-700">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
          )}
          
          {renderField(field)}
          
          {errors[field.name] && (
            <p className="mt-1 text-sm text-red-600">
              {errors[field.name].message}
            </p>
          )}
        </div>
      ))}
      
      <div className="pt-4">
        <button
          type="submit"
          disabled={loading || isPending}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {(loading || isPending) ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Processing...
            </div>
          ) : (
            `Submit & Pay ₹${form.amount}`
          )}
        </button>
      </div>
    </form>
  )
}

export default FormRenderer