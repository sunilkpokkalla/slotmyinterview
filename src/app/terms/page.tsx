export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-32 max-w-4xl">
      <h1 className="text-4xl font-extrabold mb-8">Terms of Service</h1>
      <div className="prose prose-slate max-w-none">
        <p className="text-lg text-slate-600 mb-6">Last updated: {new Date().toLocaleDateString()}</p>
        <p className="text-slate-600 mb-4">
          Welcome to SlotMyInterview. These Terms of Service govern your use of our platform. 
          By accessing or using our service, you agree to be bound by these terms.
        </p>
        <h2 className="text-2xl font-bold mt-8 mb-4">1. Acceptance of Terms</h2>
        <p className="text-slate-600 mb-4">
          By creating an account or accessing the SlotMyInterview platform, you accept and agree to be bound by these Terms and our Privacy Policy.
        </p>
        <h2 className="text-2xl font-bold mt-8 mb-4">2. User Accounts</h2>
        <p className="text-slate-600 mb-4">
          You must provide accurate and complete information when creating an account. You are responsible for maintaining the security of your account credentials.
        </p>
        <h2 className="text-2xl font-bold mt-8 mb-4">3. Platform Usage</h2>
        <p className="text-slate-600 mb-4">
          SlotMyInterview provides a marketplace for technical talent and employers. You agree not to misuse our services or help anyone else do so.
        </p>
      </div>
    </div>
  );
}
