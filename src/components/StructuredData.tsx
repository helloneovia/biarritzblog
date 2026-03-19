'use client'

import { generateProductSchema, generateOrganizationSchema, generateFAQSchema } from "@/lib/structured-data"

interface StructuredDataProps {
  locale?: string
  type?: 'product' | 'organization' | 'faq' | 'all'
}

export function StructuredData({ locale = 'en', type = 'all' }: StructuredDataProps) {
  const schemas = []

  if (type === 'product' || type === 'all') {
    schemas.push(generateProductSchema(locale))
  }

  if (type === 'organization' || type === 'all') {
    schemas.push(generateOrganizationSchema())
  }

  if (type === 'faq' || type === 'all') {
    schemas.push(generateFAQSchema(locale))
  }

  return (
    <>
      {schemas.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  )
}
