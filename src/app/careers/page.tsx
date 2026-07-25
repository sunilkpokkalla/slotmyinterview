import { Button } from "@/components/ui/button";

export default function CareersPage() {
  return (
    <div className="container mx-auto px-4 py-32 max-w-5xl">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-extrabold mb-6 tracking-tight">Join Our Team</h1>
        <p className="text-xl text-slate-500 max-w-2xl mx-auto">
          Help us build the world's most advanced capability-based hiring platform and eliminate the resume forever.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Placeholder Job Listings */}
        <div className="border border-slate-200 rounded-2xl p-6 hover:shadow-lg transition-shadow">
          <div className="text-sm font-semibold text-[#7140DB] mb-2">Engineering</div>
          <h3 className="text-xl font-bold mb-2 text-slate-900">Senior Frontend Engineer</h3>
          <p className="text-slate-500 mb-6 text-sm">Remote (US) · Full-time</p>
          <Button variant="outline" className="w-full">View Role</Button>
        </div>
        
        <div className="border border-slate-200 rounded-2xl p-6 hover:shadow-lg transition-shadow">
          <div className="text-sm font-semibold text-[#7140DB] mb-2">Engineering</div>
          <h3 className="text-xl font-bold mb-2 text-slate-900">Machine Learning Engineer</h3>
          <p className="text-slate-500 mb-6 text-sm">Remote (Global) · Full-time</p>
          <Button variant="outline" className="w-full">View Role</Button>
        </div>

        <div className="border border-slate-200 rounded-2xl p-6 hover:shadow-lg transition-shadow">
          <div className="text-sm font-semibold text-[#7140DB] mb-2">Product</div>
          <h3 className="text-xl font-bold mb-2 text-slate-900">Product Manager, ATS Sync</h3>
          <p className="text-slate-500 mb-6 text-sm">San Francisco or Remote · Full-time</p>
          <Button variant="outline" className="w-full">View Role</Button>
        </div>
      </div>
    </div>
  );
}
