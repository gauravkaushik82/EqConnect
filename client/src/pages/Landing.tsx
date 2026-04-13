import { useNavigate } from 'react-router-dom'

function Landing() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-indigo-600">
            EqConnect
          </div>
          <div className="hidden md:flex gap-8 items-center">
            <a href="#features" className="text-gray-600 hover:text-gray-900">Features</a>
            <a href="#how" className="text-gray-600 hover:text-gray-900">How it Works</a>
            <a href="#testimonials" className="text-gray-600 hover:text-gray-900">Testimonials</a>
          </div>
          <div className="flex gap-4 items-center">
            <button 
              onClick={() => navigate('/login')}
              className="px-4 py-2 text-indigo-600 hover:text-indigo-700 font-medium"
            >
              Sign In
            </button>
            <button 
              onClick={() => navigate('/register')}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium"
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center space-y-6">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
            Your Skills. <span className="text-indigo-600">Verified.</span> Connected.
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Fair hiring starts with verified credentials. Connect with opportunities that match your skills, not just your resume.
          </p>
          <div className="flex gap-4 justify-center pt-4">
            <button 
              onClick={() => navigate('/register')}
              className="px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-semibold text-lg"
            >
              Get Started Free
            </button>
            <button 
              onClick={() => document.getElementById('how')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-8 py-3 border-2 border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 font-semibold text-lg"
            >
              See How It Works
            </button>
          </div>
        </div>
      </section>

      {/* Problem Stats */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="text-4xl font-bold text-indigo-600 mb-2">75%</div>
              <p className="text-gray-600">of students miss opportunities due to poor profile visibility</p>
            </div>
            <div className="text-center p-6">
              <div className="text-4xl font-bold text-orange-600 mb-2">30-40%</div>
              <p className="text-gray-600">of CVs contain fake or exaggerated credentials</p>
            </div>
            <div className="text-center p-6">
              <div className="text-4xl font-bold text-red-600 mb-2">3-6 weeks</div>
              <p className="text-gray-600">average time to verify academic credentials</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-4xl font-bold text-center mb-16">Powerful Features</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              icon: '✓',
              title: 'Instant Verification',
              desc: 'Get your credentials verified within hours, not weeks'
            },
            {
              icon: '🎯',
              title: 'AI-Powered Matching',
              desc: 'Find opportunities that match your skills, not just keywords'
            },
            {
              icon: '🔒',
              title: 'Privacy First',
              desc: 'Anonymity controls put you in charge of visibility'
            },
            {
              icon: '💬',
              title: 'Secure Messaging',
              desc: 'Direct communication with verified recruiters'
            },
            {
              icon: '📅',
              title: 'Calendar Integration',
              desc: 'Sync interviews and deadlines with Google Calendar'
            },
            {
              icon: '📊',
              title: 'Smart Dashboard',
              desc: 'Track applications and see your match scores'
            }
          ].map((feature, i) => (
            <div key={i} className="p-6 rounded-xl border border-gray-200 hover:border-indigo-600 hover:shadow-lg transition-all">
              <div className="text-4xl mb-3">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section id="how" className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-16">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '1',
                title: 'Verify',
                desc: 'Upload your credentials and get verified in hours'
              },
              {
                step: '2',
                title: 'Discover',
                desc: 'Browse opportunities matched to your skills'
              },
              {
                step: '3',
                title: 'Connect',
                desc: 'Message recruiters and schedule interviews'
              }
            ].map((item, i) => (
              <div key={i} className="relative text-center">
                <div className="w-16 h-16 bg-indigo-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-2xl font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
                {i < 2 && (
                  <div className="hidden md:block absolute top-8 -right-4 text-3xl text-indigo-600">→</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-4xl font-bold text-center mb-16">Success Stories</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              name: 'Priya Sharma',
              role: 'Student, IIT Delhi',
              quote: 'Got verified in 2 hours and landed my dream internship within a week!'
            },
            {
              name: 'Rajesh Kumar',
              role: 'Campus Recruiter, TCS',
              quote: 'Finally hiring verified candidates. Zero fake CVs, pure quality.'
            },
            {
              name: 'Aisha Patel',
              role: 'Student, BITS Pilani',
              quote: 'The AI matching found me roles I never would have thought to apply for.'
            }
          ].map((testimonial, i) => (
            <div key={i} className="p-6 bg-gray-50 rounded-xl border border-gray-200">
              <div className="flex gap-2 mb-4">
                {[...Array(5)].map((_, j) => (
                  <span key={j} className="text-yellow-400">★</span>
                ))}
              </div>
              <p className="text-gray-600 mb-4">"{testimonial.quote}"</p>
              <p className="font-semibold">{testimonial.name}</p>
              <p className="text-sm text-gray-500">{testimonial.role}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-indigo-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-4xl font-bold">Ready to Get Verified?</h2>
          <p className="text-xl opacity-90">Join thousands of students and recruiters on EqConnect</p>
          <div className="flex gap-4 justify-center">
            <button 
              onClick={() => navigate('/register')}
              className="px-8 py-3 bg-white text-indigo-600 rounded-lg hover:bg-gray-100 font-semibold"
            >
              Sign Up Free
            </button>
            <button 
              onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-8 py-3 border-2 border-white text-white rounded-lg hover:bg-indigo-700 font-semibold"
            >
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <p className="font-semibold text-white mb-4">EqConnect</p>
              <p className="text-sm">Fair hiring starts with verification</p>
            </div>
            <div>
              <p className="font-semibold text-white mb-4">Product</p>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white">Features</a></li>
                <li><a href="#" className="hover:text-white">Pricing</a></li>
              </ul>
            </div>
            <div>
              <p className="font-semibold text-white mb-4">Company</p>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white">About</a></li>
                <li><a href="#" className="hover:text-white">Blog</a></li>
              </ul>
            </div>
            <div>
              <p className="font-semibold text-white mb-4">Legal</p>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white">Privacy</a></li>
                <li><a href="#" className="hover:text-white">Terms</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 pt-8 text-center text-sm">
            <p>&copy; 2026 EqConnect. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Landing
