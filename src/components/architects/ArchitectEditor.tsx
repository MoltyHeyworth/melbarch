'use client'

import { useState } from 'react'

interface ArchitectEditorProps {
  id: string
  biography: string | null
  website: string | null
  nationality: string | null
  activePeriod: string | null
}

export default function ArchitectEditor({
  id,
  biography: initialBio,
  website: initialWebsite,
  nationality: initialNationality,
  activePeriod: initialPeriod,
}: ArchitectEditorProps) {
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [biography, setBiography] = useState(initialBio || '')
  const [website, setWebsite] = useState(initialWebsite || '')
  const [nationality, setNationality] = useState(initialNationality || '')
  const [activePeriod, setActivePeriod] = useState(initialPeriod || '')

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch(`/api/architects/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          biography: biography || null,
          website: website || null,
          nationality: nationality || null,
          activePeriod: activePeriod || null,
        }),
      })
      if (res.ok) {
        setEditing(false)
      }
    } finally {
      setSaving(false)
    }
  }

  if (!editing) {
    return (
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="space-y-3 flex-1">
            {biography && (
              <p className="text-[#1A1A2E] leading-relaxed">{biography}</p>
            )}
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-[#6B7280]">
              {activePeriod && (
                <span>
                  <span className="font-medium text-[#1A1A2E]">Active:</span> {activePeriod}
                </span>
              )}
              {nationality && (
                <span>
                  <span className="font-medium text-[#1A1A2E]">Nationality:</span> {nationality}
                </span>
              )}
              {website && (
                <span>
                  <span className="font-medium text-[#1A1A2E]">Website:</span>{' '}
                  <a
                    href={website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#C9A96E] hover:underline"
                  >
                    {website.replace(/^https?:\/\//, '').replace(/\/$/, '')}
                  </a>
                </span>
              )}
            </div>
            {!biography && !activePeriod && !nationality && !website && (
              <p className="text-[#6B7280] italic">No details yet.</p>
            )}
          </div>
          <button
            onClick={() => setEditing(true)}
            className="ml-4 px-3 py-1.5 text-xs border border-gray-200 rounded bg-white text-[#6B7280] hover:border-[#C9A96E] hover:text-[#1A1A2E] transition-colors shrink-0"
          >
            Edit
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4 bg-gray-50 rounded p-4 border border-gray-200">
      <div>
        <label className="block text-xs font-medium text-[#6B7280] uppercase tracking-wider mb-1">
          Biography
        </label>
        <textarea
          value={biography}
          onChange={(e) => setBiography(e.target.value)}
          rows={4}
          className="w-full px-3 py-2 border border-gray-200 rounded bg-white text-sm focus:outline-none focus:ring-1 focus:ring-[#C9A96E]"
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-medium text-[#6B7280] uppercase tracking-wider mb-1">
            Active Period
          </label>
          <input
            type="text"
            value={activePeriod}
            onChange={(e) => setActivePeriod(e.target.value)}
            placeholder="e.g. 1950-1990"
            className="w-full px-3 py-2 border border-gray-200 rounded bg-white text-sm focus:outline-none focus:ring-1 focus:ring-[#C9A96E]"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-[#6B7280] uppercase tracking-wider mb-1">
            Nationality
          </label>
          <input
            type="text"
            value={nationality}
            onChange={(e) => setNationality(e.target.value)}
            placeholder="e.g. Australian"
            className="w-full px-3 py-2 border border-gray-200 rounded bg-white text-sm focus:outline-none focus:ring-1 focus:ring-[#C9A96E]"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-[#6B7280] uppercase tracking-wider mb-1">
            Website
          </label>
          <input
            type="url"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            placeholder="https://..."
            className="w-full px-3 py-2 border border-gray-200 rounded bg-white text-sm focus:outline-none focus:ring-1 focus:ring-[#C9A96E]"
          />
        </div>
      </div>
      <div className="flex gap-2">
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-4 py-2 text-sm bg-[#1A1A2E] text-white rounded hover:bg-[#2a2a4e] disabled:opacity-50 transition-colors"
        >
          {saving ? 'Saving...' : 'Save'}
        </button>
        <button
          onClick={() => {
            setBiography(initialBio || '')
            setWebsite(initialWebsite || '')
            setNationality(initialNationality || '')
            setActivePeriod(initialPeriod || '')
            setEditing(false)
          }}
          className="px-4 py-2 text-sm border border-gray-200 rounded bg-white text-[#6B7280] hover:border-[#C9A96E] transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  )
}
