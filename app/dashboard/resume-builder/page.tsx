'use client'

import DashboardLayout from '@/components/layout/DashboardLayout'
import { useState, useEffect } from 'react'
import { useAuth } from '@/components/providers/AuthProvider'
import { Save, Download, Sparkles } from 'lucide-react'

export default function ResumeBuilderPage() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [suggestions, setSuggestions] = useState<any>(null)
  const [resumeData, setResumeData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    education: [{ degree: '', institution: '', year: '', cgpa: '' }],
    experience: [{ company: '', role: '', duration: '', description: '' }],
    skills: [''],
    projects: [{ name: '', description: '', tech: '' }],
    achievements: [''],
  })

  useEffect(() => {
    if (user) {
      fetch('/api/student/profile')
        .then(res => res.json())
        .then(data => {
          if (data.profile) {
            setResumeData(prev => ({
              ...prev,
              name: data.profile.user?.name || '',
              email: data.profile.user?.email || '',
              phone: data.profile.phone || '',
              address: data.profile.address || '',
            }))
          }
        })
    }
  }, [user])

  const handleGetSuggestions = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/resume/suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeData }),
      })
      const data = await res.json()
      if (data.suggestions) {
        setSuggestions(data.suggestions)
      }
    } catch (error) {
      alert('Failed to get suggestions')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/resume/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeData }),
      })
      if (res.ok) {
        alert('Resume saved successfully!')
      }
    } catch (error) {
      alert('Failed to save resume')
    } finally {
      setLoading(false)
    }
  }

  const addEducation = () => {
    setResumeData({
      ...resumeData,
      education: [...resumeData.education, { degree: '', institution: '', year: '', cgpa: '' }],
    })
  }

  const addExperience = () => {
    setResumeData({
      ...resumeData,
      experience: [...resumeData.experience, { company: '', role: '', duration: '', description: '' }],
    })
  }

  const addSkill = () => {
    setResumeData({
      ...resumeData,
      skills: [...resumeData.skills, ''],
    })
  }

  const addProject = () => {
    setResumeData({
      ...resumeData,
      projects: [...resumeData.projects, { name: '', description: '', tech: '' }],
    })
  }

  const addAchievement = () => {
    setResumeData({
      ...resumeData,
      achievements: [...resumeData.achievements, ''],
    })
  }

  return (
    <DashboardLayout>
      <div className="px-4 py-6 sm:px-0">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Resume Builder</h1>
          <div className="flex space-x-3">
            <button
              onClick={handleGetSuggestions}
              disabled={loading}
              className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              AI Suggestions
            </button>
            <button
              onClick={handleSave}
              disabled={loading}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              <Save className="w-5 h-5 mr-2" />
              Save
            </button>
          </div>
        </div>

        {suggestions && (
          <div className="mb-6 bg-purple-50 border border-purple-200 rounded-lg p-4">
            <h3 className="font-semibold text-purple-900 mb-2">AI Suggestions</h3>
            <p className="text-sm text-purple-700 mb-2">
              Job Fit Score: {suggestions.jobFitScore}%
            </p>
            {suggestions.suggestions && suggestions.suggestions.length > 0 && (
              <div className="mb-2">
                <p className="text-sm font-medium text-purple-900">Suggestions:</p>
                <ul className="list-disc list-inside text-sm text-purple-700">
                  {suggestions.suggestions.map((s: string, i: number) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </div>
            )}
            {suggestions.missingSkills && suggestions.missingSkills.length > 0 && (
              <div>
                <p className="text-sm font-medium text-purple-900">Missing Skills:</p>
                <p className="text-sm text-purple-700">{suggestions.missingSkills.join(', ')}</p>
              </div>
            )}
          </div>
        )}

        <div className="bg-white shadow rounded-lg p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
              <input
                type="text"
                value={resumeData.name}
                onChange={(e) => setResumeData({ ...resumeData, name: e.target.value })}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
              <input
                type="email"
                value={resumeData.email}
                onChange={(e) => setResumeData({ ...resumeData, email: e.target.value })}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
              <input
                type="tel"
                value={resumeData.phone}
                onChange={(e) => setResumeData({ ...resumeData, phone: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
              <input
                type="text"
                value={resumeData.address}
                onChange={(e) => setResumeData({ ...resumeData, address: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Education</h3>
              <button
                onClick={addEducation}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                + Add
              </button>
            </div>
            {resumeData.education.map((edu, idx) => (
              <div key={idx} className="grid grid-cols-2 gap-4 mb-4 p-4 border rounded-lg">
                <input
                  type="text"
                  placeholder="Degree"
                  value={edu.degree}
                  onChange={(e) => {
                    const newEdu = [...resumeData.education]
                    newEdu[idx].degree = e.target.value
                    setResumeData({ ...resumeData, education: newEdu })
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg"
                />
                <input
                  type="text"
                  placeholder="Institution"
                  value={edu.institution}
                  onChange={(e) => {
                    const newEdu = [...resumeData.education]
                    newEdu[idx].institution = e.target.value
                    setResumeData({ ...resumeData, education: newEdu })
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg"
                />
                <input
                  type="text"
                  placeholder="Year"
                  value={edu.year}
                  onChange={(e) => {
                    const newEdu = [...resumeData.education]
                    newEdu[idx].year = e.target.value
                    setResumeData({ ...resumeData, education: newEdu })
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg"
                />
                <input
                  type="text"
                  placeholder="CGPA"
                  value={edu.cgpa}
                  onChange={(e) => {
                    const newEdu = [...resumeData.education]
                    newEdu[idx].cgpa = e.target.value
                    setResumeData({ ...resumeData, education: newEdu })
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            ))}
          </div>

          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Experience</h3>
              <button
                onClick={addExperience}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                + Add
              </button>
            </div>
            {resumeData.experience.map((exp, idx) => (
              <div key={idx} className="mb-4 p-4 border rounded-lg space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Company"
                    value={exp.company}
                    onChange={(e) => {
                      const newExp = [...resumeData.experience]
                      newExp[idx].company = e.target.value
                      setResumeData({ ...resumeData, experience: newExp })
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-lg"
                  />
                  <input
                    type="text"
                    placeholder="Role"
                    value={exp.role}
                    onChange={(e) => {
                      const newExp = [...resumeData.experience]
                      newExp[idx].role = e.target.value
                      setResumeData({ ...resumeData, experience: newExp })
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <input
                  type="text"
                  placeholder="Duration"
                  value={exp.duration}
                  onChange={(e) => {
                    const newExp = [...resumeData.experience]
                    newExp[idx].duration = e.target.value
                    setResumeData({ ...resumeData, experience: newExp })
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
                <textarea
                  placeholder="Description"
                  value={exp.description}
                  onChange={(e) => {
                    const newExp = [...resumeData.experience]
                    newExp[idx].description = e.target.value
                    setResumeData({ ...resumeData, experience: newExp })
                  }}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            ))}
          </div>

          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Skills</h3>
              <button
                onClick={addSkill}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                + Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {resumeData.skills.map((skill, idx) => (
                <input
                  key={idx}
                  type="text"
                  value={skill}
                  onChange={(e) => {
                    const newSkills = [...resumeData.skills]
                    newSkills[idx] = e.target.value
                    setResumeData({ ...resumeData, skills: newSkills })
                  }}
                  placeholder="Skill"
                  className="px-4 py-2 border border-gray-300 rounded-lg"
                />
              ))}
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Projects</h3>
              <button
                onClick={addProject}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                + Add
              </button>
            </div>
            {resumeData.projects.map((project, idx) => (
              <div key={idx} className="mb-4 p-4 border rounded-lg space-y-3">
                <input
                  type="text"
                  placeholder="Project Name"
                  value={project.name}
                  onChange={(e) => {
                    const newProjects = [...resumeData.projects]
                    newProjects[idx].name = e.target.value
                    setResumeData({ ...resumeData, projects: newProjects })
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
                <textarea
                  placeholder="Description"
                  value={project.description}
                  onChange={(e) => {
                    const newProjects = [...resumeData.projects]
                    newProjects[idx].description = e.target.value
                    setResumeData({ ...resumeData, projects: newProjects })
                  }}
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
                <input
                  type="text"
                  placeholder="Technologies"
                  value={project.tech}
                  onChange={(e) => {
                    const newProjects = [...resumeData.projects]
                    newProjects[idx].tech = e.target.value
                    setResumeData({ ...resumeData, projects: newProjects })
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            ))}
          </div>

          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Achievements</h3>
              <button
                onClick={addAchievement}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                + Add
              </button>
            </div>
            {resumeData.achievements.map((achievement, idx) => (
              <input
                key={idx}
                type="text"
                value={achievement}
                onChange={(e) => {
                  const newAchievements = [...resumeData.achievements]
                  newAchievements[idx] = e.target.value
                  setResumeData({ ...resumeData, achievements: newAchievements })
                }}
                placeholder="Achievement"
                className="w-full mb-2 px-4 py-2 border border-gray-300 rounded-lg"
              />
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

