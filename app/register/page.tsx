"use client";
import { startTransition, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Building2 } from "lucide-react";
import { signIn, useSession } from "next-auth/react";
import { toast } from "sonner"
import { useRouter } from "next/navigation";
function Modal({ open, onClose, title, children }: { open: boolean, onClose: () => void, title: string, children: React.ReactNode }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-2xl relative max-h-[80vh] overflow-y-auto border border-gray-200"
      >
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-blue-600 text-2xl"
          onClick={onClose}
          aria-label="Close"
        >
          ✕
        </button>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">{title}</h2>
        <div className="text-gray-600 text-sm">{children}</div>
      </motion.div>
    </div>
  );
}

export default function RegisterPage() {
const { data: session } = useSession();
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
    const router = useRouter(); 
    const [mounted, setMounted] = useState(false);
    
    useEffect(() => {
    startTransition(() => {
        setMounted(true);
    });
    }, []);

    useEffect(() => {
    if (session) {
        router.push("/home");
    }
    }, [session, router]);
    if (!mounted) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex items-center gap-3">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-lg font-medium text-slate-700">Loading the app...</span>
        </div>
        </div>
    );
    }
  const handleOAuthSignIn = async (provider: string) => {
    setIsLoading(true)
    try {
      const result = await signIn(provider, { 
        callbackUrl: '/home',
        redirect: false 
      });
      
      if (result?.error) {
        toast.error(`Error signing in with ${provider}: ${result.error}`);
      } else if (result?.url) {
        router.push(result.url);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      toast.error(`Error signing in with ${provider}: ${message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-cyan-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 15 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-blue-400/10"
            animate={{
              y: [0, -30, 0],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: Math.random() * 15 + 10,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 bg-white/80 backdrop-blur-xl rounded-3xl border-2 border-white/40 shadow-2xl max-w-md w-full p-8"
      >
        <div className="text-center mb-8">
          <div className="inline-block mb-6">
            <div className="relative">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full blur-2xl opacity-20"
              />
              <div className="relative bg-gradient-to-r from-blue-600 to-indigo-600 p-5 rounded-2xl">
                <Building2 className="w-12 h-12 text-white" />
              </div>
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-3">
            Business Advisor AI
          </h1>
          <p className="text-gray-600 text-lg">
            Create your account to get started
          </p>
        </div>

        <div className="flex flex-col gap-4 mb-8">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleOAuthSignIn('google')}
            disabled={isLoading}
            className="flex items-center cursor-pointer justify-center gap-3 w-full py-4 px-6 bg-white border-2 border-gray-200 hover:border-blue-400 rounded-xl text-gray-700 font-semibold shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            {isLoading ? 'Signing up...' : 'Continue with Google'}
          </motion.button>

        </div>

        <div className="text-center text-xs text-gray-500 mb-6">
          By continuing, you agree to our{' '}
          <button
            type="button"
            className="text-blue-600 hover:text-blue-700 underline"
            onClick={() => setShowTerms(true)}
          >
            Terms of Service
          </button>
          {' '}and{' '}
          <button
            type="button"
            className="text-blue-600 hover:text-blue-700 underline"
            onClick={() => setShowPrivacy(true)}
          >
            Privacy Policy
          </button>
        </div>

        <div className="text-center pt-6 border-t border-gray-200">
          <p className="text-gray-600 text-sm">
            Already have an account?{' '}
            <a href="/login" className="text-blue-600 hover:text-blue-700 font-semibold underline">
              Sign in
            </a>
          </p>
        </div>
      </motion.div>

      <Modal open={showTerms} onClose={() => setShowTerms(false)} title="Terms of Service">
        <div className="space-y-4 text-left">
          <div>
            <span className="block font-bold text-lg mb-1">Effective Date:</span>
            <span className="text-gray-500">November 15, 2025</span>
          </div>
          <p>
            Welcome to the Espoo Business Advisor Platform. These Terms of Service govern your use of our platform and services. By accessing or using our platform, you agree to these terms.
          </p>
          <div>
            <h3 className="font-bold text-blue-600 mb-2">1. Eligibility</h3>
            <ul className="list-disc list-inside ml-4 text-gray-600 space-y-1">
              <li>You must be at least 18 years old to use this platform</li>
              <li>By registering, you confirm that you meet this age requirement</li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-blue-600 mb-2">2. User Accounts</h3>
            <ul className="list-disc list-inside ml-4 text-gray-600 space-y-1">
              <li>You are responsible for maintaining the confidentiality of your account credentials</li>
              <li>All information provided during registration must be accurate</li>
              <li>You must not share your account with others</li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-blue-600 mb-2">3. Service Usage</h3>
            <ul className="list-disc list-inside ml-4 text-gray-600 space-y-1">
              <li>The platform provides business guidance and advisory services</li>
              <li>Information provided is for guidance purposes only</li>
              <li>Users should verify all information with official sources</li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-blue-600 mb-2">4. Privacy and Data</h3>
            <ul className="list-disc list-inside ml-4 text-gray-600 space-y-1">
              <li>Your data is protected under GDPR regulations</li>
              <li>We collect only necessary information to provide services</li>
              <li>Data is stored securely and not shared without consent</li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-blue-600 mb-2">5. Governing Law</h3>
            <ul className="list-disc list-inside ml-4 text-gray-600 space-y-1">
              <li>These terms are governed by the laws of Finland</li>
              <li>Any disputes will be resolved in Finnish courts</li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-blue-600 mb-2">6. Contact</h3>
            <p className="text-gray-600 ml-4">
              For questions about these Terms of Service, contact us at:{' '}
              <span className="text-blue-600">support@espoo-business.fi</span>
            </p>
          </div>
        </div>
      </Modal>

      <Modal open={showPrivacy} onClose={() => setShowPrivacy(false)} title="Privacy Policy">
        <div className="space-y-4 text-left">
          <div>
            <span className="block font-bold text-lg mb-1">Effective Date:</span>
            <span className="text-gray-500">November 15, 2025</span>
          </div>
          <p>
            This Privacy Policy explains how the Espoo Business Advisor Platform collects, uses, and protects your personal data in compliance with the EU General Data Protection Regulation (GDPR).
          </p>
          <div>
            <h3 className="font-bold text-blue-600 mb-2">1. Information We Collect</h3>
            <ul className="list-disc list-inside ml-4 text-gray-600 space-y-1">
              <li><span className="font-semibold">Account Data:</span> Name, email address, business information</li>
              <li><span className="font-semibold">Usage Data:</span> IP address, device info, browser type</li>
              <li><span className="font-semibold">Business Data:</span> Information about your business journey and needs</li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-blue-600 mb-2">2. How We Use Your Information</h3>
            <ul className="list-disc list-inside ml-4 text-gray-600 space-y-1">
              <li>To provide and maintain the platform</li>
              <li>For user authentication and account security</li>
              <li>To personalize your business guidance</li>
              <li>To improve our services</li>
              <li>To comply with legal obligations</li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-blue-600 mb-2">3. Data Sharing</h3>
            <ul className="list-disc list-inside ml-4 text-gray-600 space-y-1">
              <li>With business advisors (only with your consent)</li>
              <li>With service providers for platform operations</li>
              <li>We do not sell personal data</li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-blue-600 mb-2">4. Your Rights Under GDPR</h3>
            <ul className="list-disc list-inside ml-4 text-gray-600 space-y-1">
              <li>Access your data</li>
              <li>Request correction or deletion</li>
              <li>Object to processing</li>
              <li>Request data portability</li>
              <li>Withdraw consent at any time</li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-blue-600 mb-2">5. Data Security</h3>
            <ul className="list-disc list-inside ml-4 text-gray-600 space-y-1">
              <li>We implement industry-standard security measures</li>
              <li>Data is encrypted in transit and at rest</li>
              <li>Regular security audits are conducted</li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-blue-600 mb-2">6. Contact</h3>
            <p className="text-gray-600 ml-4">
              For privacy concerns or data requests, contact:{' '}
              <span className="text-blue-600">privacy@espoo-business.fi</span>
            </p>
          </div>
        </div>
      </Modal>
    </div>
  );
}