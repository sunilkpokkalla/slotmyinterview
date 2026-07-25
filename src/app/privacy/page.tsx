export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-32 max-w-4xl">
      <h1 className="text-4xl font-extrabold mb-8">Privacy Policy</h1>
      <div className="prose prose-slate max-w-none">
        <p className="text-lg text-slate-600 mb-6">Last updated: {new Date().toLocaleDateString()}</p>
        <p className="text-slate-600 mb-4">
          At SlotMyInterview, we take your privacy seriously. This policy explains how we collect, use, and protect your personal data when you use our platform.
        </p>
        <h2 className="text-2xl font-bold mt-8 mb-4">1. Data Collection</h2>
        <p className="text-slate-600 mb-4">
          We collect information you provide directly to us, such as when you create an account, connect your GitHub profile, or communicate with us.
        </p>
        <h2 className="text-2xl font-bold mt-8 mb-4">2. Use of Data</h2>
        <p className="text-slate-600 mb-4">
          We use the information we collect to provide, maintain, and improve our services, as well as to match candidates with potential employers based on verified skills.
        </p>
      </div>
    </div>
  );
}
