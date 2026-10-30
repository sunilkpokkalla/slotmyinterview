import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const DATA_FILE = path.join(process.cwd(), "src", "data", "campaign_leads.json");

function getLeads() {
  if (!fs.existsSync(DATA_FILE)) {
    return [
      { id: "lead-1", email: "sarah.j@anthropic.com", source: "Homepage Hero Lead Form", date: "2026-08-17 14:20", status: "New" },
      { id: "lead-2", email: "david.m@scaleai.com", source: "Homepage Hero Lead Form", date: "2026-08-16 09:15", status: "Contacted" },
      { id: "lead-3", email: "alex.tech@stripe.com", source: "Homepage Hero Lead Form", date: "2026-08-15 18:40", status: "Qualified" }
    ];
  }
  try {
    const data = fs.readFileSync(DATA_FILE, "utf-8");
    return JSON.parse(data);
  } catch (e) {
    return [];
  }
}

function saveLeads(leads: any[]) {
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(DATA_FILE, JSON.stringify(leads, null, 2));
}

export async function GET() {
  const leads = getLeads();
  return NextResponse.json({ success: true, leads });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email } = body;

    if (!email || !email.includes("@")) {
      return NextResponse.json({ success: false, message: "Invalid email" }, { status: 400 });
    }

    const leads = getLeads();
    const newLead = {
      id: `lead-${Date.now()}`,
      email,
      source: "Homepage Hero Lead Form",
      date: new Date().toISOString().replace("T", " ").substring(0, 16),
      status: "New"
    };

    leads.unshift(newLead);
    saveLeads(leads);

    return NextResponse.json({ success: true, message: "Lead submitted successfully", lead: newLead });
  } catch (e) {
    return NextResponse.json({ success: false, message: "Error storing lead" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    let leads = getLeads();
    
    if (id) {
      leads = leads.filter((l: any) => l.id !== id);
      saveLeads(leads);
    }
    return NextResponse.json({ success: true, leads });
  } catch (e) {
    return NextResponse.json({ success: false, message: "Error deleting lead" }, { status: 500 });
  }
}
