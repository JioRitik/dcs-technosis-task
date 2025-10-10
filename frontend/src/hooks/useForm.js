import { useState, useCallback } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../Services/api'

export const useForms = () => {
  return useQuery({
    queryKey: ['forms'],
    queryFn: async () => {
      const response = await api.get('/forms')
      return response.data.forms
    }
  })
}

export const useForm = (formId) => {
  return useQuery({
    queryKey: ['forms', formId],
    queryFn: async () => {
      const response = await api.get(`/forms/${formId}`)
      return response.data.form
    },
    enabled: !!formId
  })
}

export const useSubmitForm = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ formId, data }) => {
      const response = await api.post(`/forms/${formId}/submit`, data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['submissions'])
    }
  })
}