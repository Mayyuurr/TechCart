import { useState } from 'react';

const RegistrationForm = () => {
    const [isLogin, setIsLogin] = useState(false);
    const [formData, setFormData] = useState({ username: '', email: '', password: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        if (isLogin) {
            // Simulate Login
            setTimeout(() => {
                alert('Logged in successfully!');
                setIsSubmitting(false);
            }, 1000);
            return;
        }

        // Scenario 1 Bug: Intentionally NOT handling the 500 error and keeping button in spinning state.
        // There is no try-catch, and if response is not ok, it throws an error that crashes the function,
        // leaving isSubmitting as true indefinitely.
        const res = await fetch('http://localhost:5000/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });

        if (!res.ok) {
            // This throw will cause an unhandled promise rejection in React, 
            // the error goes to the console, and setIsSubmitting(false) is never called!
            throw new Error(`Server Error: ${res.status}`);
        }

        const data = await res.json();
        alert('Registered successfully!');
        setIsSubmitting(false);
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-8 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl text-white">
            
            {/* Toggle tabs */}
            <div className="flex border-b border-white/10 mb-6">
                <button 
                    type="button"
                    onClick={() => setIsLogin(false)}
                    className={`flex-1 pb-3 text-center font-medium tracking-wide transition-all ${!isLogin ? 'border-b-2 border-blue-500 text-white' : 'text-white/50 hover:text-white/80'}`}
                >
                    Register
                </button>
                <button 
                    type="button"
                    onClick={() => setIsLogin(true)}
                    className={`flex-1 pb-3 text-center font-medium tracking-wide transition-all ${isLogin ? 'border-b-2 border-blue-500 text-white' : 'text-white/50 hover:text-white/80'}`}
                >
                    Login
                </button>
            </div>

            <h2 className="text-3xl font-light mb-6 tracking-wider">{isLogin ? 'Login' : 'Register'}</h2>
            
            <form onSubmit={handleSubmit} className="space-y-5">
                {!isLogin && (
                    <div>
                        <label className="block text-sm font-medium text-white/80 mb-1">Username</label>
                        <input 
                            type="text" 
                            name="username" 
                            value={formData.username} 
                            onChange={handleChange}
                            className="block w-full p-3 bg-black/20 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-300/50"
                            required 
                        />
                    </div>
                )}
                <div>
                    <label className="block text-sm font-medium text-white/80 mb-1">Email</label>
                    <input 
                        type="email" 
                        name="email" 
                        value={formData.email} 
                        onChange={handleChange}
                        className="block w-full p-3 bg-black/20 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-300/50"
                        required 
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-white/80 mb-1">Password</label>
                    <input 
                        type="password" 
                        name="password" 
                        value={formData.password} 
                        onChange={handleChange}
                        className="block w-full p-3 bg-black/20 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-300/50"
                        required 
                    />
                </div>
                
                {isLogin ? (
                    <button 
                        id="login-btn"
                        type="submit" 
                        disabled={isSubmitting}
                        className="w-full bg-blue-500/80 backdrop-blur-sm text-white p-3 rounded-lg font-medium shadow-lg hover:bg-blue-600/80 transition disabled:opacity-50 disabled:cursor-not-allowed mt-4"
                    >
                        {isSubmitting ? 'Logging in...' : 'Login'}
                    </button>
                ) : (
                    <button 
                        id="register-btn-v2"
                        type="submit" 
                        disabled={isSubmitting}
                        className="w-full bg-blue-500/80 backdrop-blur-sm text-white p-3 rounded-lg font-medium shadow-lg hover:bg-blue-600/80 transition disabled:opacity-50 disabled:cursor-not-allowed mt-4"
                    >
                        {isSubmitting ? 'Submitting...' : 'Register'}
                    </button>
                )}
            </form>
        </div>
    );
};

export default RegistrationForm;
