import { useState } from 'react'

function Opportunities() {
  const [selectedType, setSelectedType] = useState('all')

  const opportunities = [
    { id: 1, company: 'Google', title: 'SDE Intern', type: 'internship', match: 95, location: 'Bangalore', skills: ['Python', 'JS'] },
    { id: 2, company: 'Microsoft', title: 'Data Scientist', type: 'job', match: 87, location: 'Hyderabad', skills: ['ML', 'Python'] },
    { id: 3, company: 'Amazon', title: 'DevOps Engineer', type: 'internship', match: 92, location: 'Remote', skills: ['AWS', 'Docker'] },
    { id: 4, company: 'TCS', title: 'Full Stack Developer', type: 'job', match: 78, location: 'Delhi', skills: ['React', 'Node.js'] },
  ]

  const filtered = selectedType === 'all' ? opportunities : opportunities.filter(o => o.type === selectedType)

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b"><div className="max-w-7xl mx-auto px-4 py-4"><h1 className="text-2xl font-bold text-indigo-600">EqConnect</h1></div></nav>
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold mb-8">Find Opportunities</h2>
        
        <div className="mb-8 flex gap-4">
          {['all', 'internship', 'job'].map(t => (
            <button key={t} onClick={() => setSelectedType(t)} className={`px-4 py-2 rounded-lg ${selectedType === t ? 'bg-indigo-600 text-white' : 'bg-white border'}`}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {filtered.map(opp => (
            <div key={opp.id} className="bg-white p-6 rounded-xl shadow-sm border">
              <div className="flex justify-between items-start mb-4">
                <div><p className="text-sm text-gray-600">{opp.company}</p><h3 className="font-semibold text-lg">{opp.title}</h3></div>
                <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm">{opp.match}%</span>
              </div>
              <p className="text-gray-600 mb-2">{opp.location}</p>
              <div className="flex gap-2 mb-4">{opp.skills.map((s, i) => <span key={i} className="px-2 py-1 bg-gray-100 text-sm rounded">{s}</span>)}</div>
              <button className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700">Apply</button>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}

export default Opportunities
