import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useNavigate } from 'react-router-dom';
function Landing() {
    const navigate = useNavigate();
    return (_jsxs("div", { className: "min-h-screen bg-gradient-to-b from-indigo-50 to-white", children: [_jsx("nav", { className: "sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b border-gray-100", children: _jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center", children: [_jsx("div", { className: "text-2xl font-bold text-indigo-600", children: "EqConnect" }), _jsxs("div", { className: "hidden md:flex gap-8 items-center", children: [_jsx("a", { href: "#features", className: "text-gray-600 hover:text-gray-900", children: "Features" }), _jsx("a", { href: "#how", className: "text-gray-600 hover:text-gray-900", children: "How it Works" }), _jsx("a", { href: "#testimonials", className: "text-gray-600 hover:text-gray-900", children: "Testimonials" })] }), _jsxs("div", { className: "flex gap-4 items-center", children: [_jsx("button", { onClick: () => navigate('/login'), className: "px-4 py-2 text-indigo-600 hover:text-indigo-700 font-medium", children: "Sign In" }), _jsx("button", { onClick: () => navigate('/register'), className: "px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium", children: "Get Started" })] })] }) }), _jsx("section", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20", children: _jsxs("div", { className: "text-center space-y-6", children: [_jsxs("h1", { className: "text-5xl md:text-6xl font-bold text-gray-900 leading-tight", children: ["Your Skills. ", _jsx("span", { className: "text-indigo-600", children: "Verified." }), " Connected."] }), _jsx("p", { className: "text-xl text-gray-600 max-w-2xl mx-auto", children: "Fair hiring starts with verified credentials. Connect with opportunities that match your skills, not just your resume." }), _jsxs("div", { className: "flex gap-4 justify-center pt-4", children: [_jsx("button", { onClick: () => navigate('/register'), className: "px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-semibold text-lg", children: "Get Started Free" }), _jsx("button", { onClick: () => document.getElementById('how')?.scrollIntoView({ behavior: 'smooth' }), className: "px-8 py-3 border-2 border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 font-semibold text-lg", children: "See How It Works" })] })] }) }), _jsx("section", { className: "bg-gray-50 py-16", children: _jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: _jsxs("div", { className: "grid md:grid-cols-3 gap-8", children: [_jsxs("div", { className: "text-center p-6", children: [_jsx("div", { className: "text-4xl font-bold text-indigo-600 mb-2", children: "75%" }), _jsx("p", { className: "text-gray-600", children: "of students miss opportunities due to poor profile visibility" })] }), _jsxs("div", { className: "text-center p-6", children: [_jsx("div", { className: "text-4xl font-bold text-orange-600 mb-2", children: "30-40%" }), _jsx("p", { className: "text-gray-600", children: "of CVs contain fake or exaggerated credentials" })] }), _jsxs("div", { className: "text-center p-6", children: [_jsx("div", { className: "text-4xl font-bold text-red-600 mb-2", children: "3-6 weeks" }), _jsx("p", { className: "text-gray-600", children: "average time to verify academic credentials" })] })] }) }) }), _jsxs("section", { id: "features", className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20", children: [_jsx("h2", { className: "text-4xl font-bold text-center mb-16", children: "Powerful Features" }), _jsx("div", { className: "grid md:grid-cols-2 lg:grid-cols-3 gap-8", children: [
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
                        ].map((feature, i) => (_jsxs("div", { className: "p-6 rounded-xl border border-gray-200 hover:border-indigo-600 hover:shadow-lg transition-all", children: [_jsx("div", { className: "text-4xl mb-3", children: feature.icon }), _jsx("h3", { className: "text-xl font-semibold mb-2", children: feature.title }), _jsx("p", { className: "text-gray-600", children: feature.desc })] }, i))) })] }), _jsx("section", { id: "how", className: "bg-gray-50 py-20", children: _jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: [_jsx("h2", { className: "text-4xl font-bold text-center mb-16", children: "How It Works" }), _jsx("div", { className: "grid md:grid-cols-3 gap-8", children: [
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
                            ].map((item, i) => (_jsxs("div", { className: "relative text-center", children: [_jsx("div", { className: "w-16 h-16 bg-indigo-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4", children: item.step }), _jsx("h3", { className: "text-2xl font-semibold mb-2", children: item.title }), _jsx("p", { className: "text-gray-600", children: item.desc }), i < 2 && (_jsx("div", { className: "hidden md:block absolute top-8 -right-4 text-3xl text-indigo-600", children: "\u2192" }))] }, i))) })] }) }), _jsxs("section", { id: "testimonials", className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20", children: [_jsx("h2", { className: "text-4xl font-bold text-center mb-16", children: "Success Stories" }), _jsx("div", { className: "grid md:grid-cols-3 gap-8", children: [
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
                        ].map((testimonial, i) => (_jsxs("div", { className: "p-6 bg-gray-50 rounded-xl border border-gray-200", children: [_jsx("div", { className: "flex gap-2 mb-4", children: [...Array(5)].map((_, j) => (_jsx("span", { className: "text-yellow-400", children: "\u2605" }, j))) }), _jsxs("p", { className: "text-gray-600 mb-4", children: ["\"", testimonial.quote, "\""] }), _jsx("p", { className: "font-semibold", children: testimonial.name }), _jsx("p", { className: "text-sm text-gray-500", children: testimonial.role })] }, i))) })] }), _jsx("section", { className: "bg-indigo-600 text-white py-16", children: _jsxs("div", { className: "max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6", children: [_jsx("h2", { className: "text-4xl font-bold", children: "Ready to Get Verified?" }), _jsx("p", { className: "text-xl opacity-90", children: "Join thousands of students and recruiters on EqConnect" }), _jsxs("div", { className: "flex gap-4 justify-center", children: [_jsx("button", { onClick: () => navigate('/register'), className: "px-8 py-3 bg-white text-indigo-600 rounded-lg hover:bg-gray-100 font-semibold", children: "Sign Up Free" }), _jsx("button", { onClick: () => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' }), className: "px-8 py-3 border-2 border-white text-white rounded-lg hover:bg-indigo-700 font-semibold", children: "Learn More" })] })] }) }), _jsx("footer", { className: "bg-gray-900 text-gray-400 py-12", children: _jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: [_jsxs("div", { className: "grid md:grid-cols-4 gap-8 mb-8", children: [_jsxs("div", { children: [_jsx("p", { className: "font-semibold text-white mb-4", children: "EqConnect" }), _jsx("p", { className: "text-sm", children: "Fair hiring starts with verification" })] }), _jsxs("div", { children: [_jsx("p", { className: "font-semibold text-white mb-4", children: "Product" }), _jsxs("ul", { className: "space-y-2 text-sm", children: [_jsx("li", { children: _jsx("a", { href: "#", className: "hover:text-white", children: "Features" }) }), _jsx("li", { children: _jsx("a", { href: "#", className: "hover:text-white", children: "Pricing" }) })] })] }), _jsxs("div", { children: [_jsx("p", { className: "font-semibold text-white mb-4", children: "Company" }), _jsxs("ul", { className: "space-y-2 text-sm", children: [_jsx("li", { children: _jsx("a", { href: "#", className: "hover:text-white", children: "About" }) }), _jsx("li", { children: _jsx("a", { href: "#", className: "hover:text-white", children: "Blog" }) })] })] }), _jsxs("div", { children: [_jsx("p", { className: "font-semibold text-white mb-4", children: "Legal" }), _jsxs("ul", { className: "space-y-2 text-sm", children: [_jsx("li", { children: _jsx("a", { href: "#", className: "hover:text-white", children: "Privacy" }) }), _jsx("li", { children: _jsx("a", { href: "#", className: "hover:text-white", children: "Terms" }) })] })] })] }), _jsx("div", { className: "border-t border-gray-700 pt-8 text-center text-sm", children: _jsx("p", { children: "\u00A9 2026 EqConnect. All rights reserved." }) })] }) })] }));
}
export default Landing;
