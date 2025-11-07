import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

export async function parseResume(resumeText: string) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' })
    
    const prompt = `Extract the following information from this resume text in JSON format:
{
  "name": "string",
  "email": "string",
  "phone": "string",
  "education": [{"degree": "string", "institution": "string", "year": "string"}],
  "experience": [{"company": "string", "role": "string", "duration": "string", "description": "string"}],
  "skills": ["string"],
  "projects": [{"name": "string", "description": "string"}],
  "achievements": ["string"]
}

Resume text:
${resumeText}

Return only valid JSON, no additional text.`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()
    
    // Clean the response to extract JSON
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0])
    }
    
    return JSON.parse(text)
  } catch (error) {
    console.error('Error parsing resume:', error)
    return null
  }
}

export async function generateResumeSuggestions(resumeData: any, jobDescription: string) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' })
    
    const prompt = `Analyze this resume data and job description, then provide suggestions to improve the resume for this job:

Resume Data:
${JSON.stringify(resumeData, null, 2)}

Job Description:
${jobDescription}

Provide suggestions in JSON format:
{
  "jobFitScore": number (0-100),
  "suggestions": ["string"],
  "missingSkills": ["string"],
  "strengths": ["string"],
  "weaknesses": ["string"]
}

Return only valid JSON.`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()
    
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0])
    }
    
    return JSON.parse(text)
  } catch (error) {
    console.error('Error generating suggestions:', error)
    return null
  }
}

export async function generateEmailTemplate(
  type: 'selection' | 'rejection' | 'round' | 'drive',
  data: any
) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' })
    
    const prompt = `Generate a professional email template for a college placement notification.

Type: ${type}
Context: ${JSON.stringify(data, null, 2)}

Generate a professional, courteous email with:
- Appropriate subject line
- Greeting
- Clear message
- Next steps (if applicable)
- Professional closing

Return JSON:
{
  "subject": "string",
  "body": "string"
}`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()
    
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0])
    }
    
    return JSON.parse(text)
  } catch (error) {
    console.error('Error generating email:', error)
    return null
  }
}

