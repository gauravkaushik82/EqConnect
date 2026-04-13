/**
 * Simple cosine similarity matching algorithm for skill-based recommendations
 * No external AI needed for prototype
 */

export function skillMatchScore(
  studentSkills: string[],
  requiredSkills: string[]
): number {
  if (requiredSkills.length === 0) return 100

  // Create a combined vocabulary
  const allSkills = [...new Set([...studentSkills, ...requiredSkills])]

  // Create binary vectors
  const studentVector = allSkills.map((s) => (studentSkills.includes(s) ? 1 : 0))
  const requiredVector = allSkills.map((s) => (requiredSkills.includes(s) ? 1 : 0))

  // Calculate cosine similarity
  const dotProduct = studentVector.reduce((sum: number, val: number, i: number) => sum + val * requiredVector[i], 0 as number)
  const studentMag = Math.sqrt(studentVector.reduce((sum: number, val: number) => sum + val * val, 0 as number))
  const requiredMag = Math.sqrt(requiredVector.reduce((sum: number, val: number) => sum + val * val, 0 as number))

  if (studentMag === 0 || requiredMag === 0) return 0

  return Math.round((dotProduct / (studentMag * requiredMag)) * 100)
}

/**
 * Get recommended opportunities for a student based on skill match
 */
export function getRecommendedOpportunities(
  studentSkills: string[],
  opportunities: any[]
): any[] {
  return opportunities
    .map((opp) => ({
      ...opp,
      match_score: skillMatchScore(studentSkills, opp.skills_required || []),
    }))
    .sort((a, b) => b.match_score - a.match_score)
    .slice(0, 10)
}
