"use client";

import { useState, useEffect } from "react";
import { 
  Users, Mail, Calendar, Trash2, Download, Search, 
  CheckCircle2, RefreshCw, Sparkles, Filter, ArrowUpRight, 
  ShieldCheck, LayoutDashboard, Send
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [emailSubject, setEmailSubject] = useState("Exclusive Early Access: SlotMyInterview Campaign");
  const [emailBody, setEmailBody] = useState("Hi there,\n\nThank you for signing up on SlotMyInterview! We're excited to invite you to our platform preview.");

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/leads");
      const data = await res.json();
      if (data.success) {
        setLeads(data.leads);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/leads?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setLeads(data.leads);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleExportCSV = () => {
    const headers = ["ID,Email,Source,Date,Status"];
    const rows = leads.map(l => `${l.id},${l.email},${l.source},${l.date},${l.status}`);
    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `slotmyinterview_campaign_leads_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredLeads = leads.filter(l => 
    l.email.toLowerCase().includes(filter.toLowerCase()) || 
    l.source.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#f8f9fc] pt-24 pb-16 text-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge className="bg-purple-100 text-purple-700 font-mono text-[10px]">
                <ShieldCheck className="w-3 h-3 mr-1" /> Admin Panel
              </Badge>
              <span className="text-xs text-slate-400 font-mono">slotmyinterview.com/admin</span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900">Homepage Campaign Leads Database</h1>
            <p className="text-xs text-slate-500 mt-1">Manage and export all work email lead submissions from the homepage hero form.</p>
          </div>

          <div className="flex items-center gap-3">
            <Button onClick={fetchLeads} variant="outline" size="sm" className="h-10 text-xs font-semibold">
              <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${loading ? "animate-spin" : ""}`} /> Refresh
            </Button>
            <Button onClick={handleExportCSV} className="bg-[#6B47ED] hover:bg-[#5839C7] text-white h-10 text-xs font-semibold px-4 rounded-xl">
              <Download className="w-3.5 h-3.5 mr-1.5" /> Export CSV
            </Button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <Card className="bg-white border-slate-200">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <div className="text-2xl font-bold">{leads.length}</div>
                <div className="text-xs text-slate-500">Total Campaign Leads</div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-slate-200">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <div className="text-2xl font-bold">{leads.filter(l => l.email.endsWith(".com") || l.email.endsWith(".ai")).length}</div>
                <div className="text-xs text-slate-500">Corporate Domains</div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-slate-200">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <div className="text-2xl font-bold">100%</div>
                <div className="text-xs text-slate-500">Direct Captures Active</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Leads Table Card */}
        <Card className="bg-white border-slate-200 mb-8">
          <CardContent className="p-6">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                <Input 
                  placeholder="Filter by email or source..." 
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="pl-9 h-10 text-xs bg-slate-50 border-slate-200"
                />
              </div>
              <span className="text-xs text-slate-500 font-mono">{filteredLeads.length} entries found</span>
            </div>

            {/* Table */}
            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 uppercase font-mono text-[10px] tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="p-3.5">Email Address</th>
                    <th className="p-3.5">Capture Source</th>
                    <th className="p-3.5">Date Added</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredLeads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-3.5 font-bold text-slate-900 font-mono">
                        {lead.email}
                      </td>
                      <td className="p-3.5 text-slate-600">
                        <Badge variant="outline" className="text-[10px] font-normal">
                          {lead.source}
                        </Badge>
                      </td>
                      <td className="p-3.5 text-slate-500 font-mono">
                        {lead.date}
                      </td>
                      <td className="p-3.5">
                        <Badge className="bg-emerald-100 text-emerald-800 text-[10px]">
                          {lead.status || "New"}
                        </Badge>
                      </td>
                      <td className="p-3.5 text-right">
                        <Button 
                          onClick={() => handleDelete(lead.id)}
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                  {filteredLeads.length === 0 && (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-slate-400 italic">
                        No leads matched your filter.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

          </CardContent>
        </Card>

        {/* Campaign Email Broadcast Builder */}
        <Card className="bg-white border-slate-200">
          <CardContent className="p-6">
            <h2 className="text-base font-bold text-slate-900 mb-1 flex items-center gap-2">
              <Send className="w-4 h-4 text-indigo-600" /> Broadcast Campaign Email to Leads
            </h2>
            <p className="text-xs text-slate-500 mb-4">Send product updates or early access invitations directly to captured emails.</p>

            <div className="space-y-4 max-w-2xl">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Subject Line</label>
                <Input 
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  className="h-10 text-xs bg-slate-50 border-slate-200"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Email Body</label>
                <textarea 
                  rows={4}
                  value={emailBody}
                  onChange={(e) => setEmailBody(e.target.value)}
                  className="w-full p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-900 outline-none font-sans"
                />
              </div>

              <Button 
                onClick={() => alert(`Campaign broadcast triggered for ${leads.length} lead recipients!`)} 
                className="bg-slate-900 hover:bg-slate-800 text-white text-xs h-10 px-6 font-semibold rounded-xl"
              >
                Broadcast to {leads.length} Leads
              </Button>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
