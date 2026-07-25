import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Data arrays to mix and match for generating 100 unique articles
const topics = ["AI Engineering", "Technical Hiring", "Machine Learning", "Software Architecture", "Developer Assessments", "Tech Recruitment", "LLMs", "Future of Work"];
const adjectives = ["The Ultimate Guide to", "Why You Must Rethink", "The Hidden Costs of", "How to Master", "The Future of", "A New Approach to", "Eliminating Bias in", "Scaling"];
const actions = ["Evaluating AI Talent", "Technical Interviews", "Engineering Portfolios", "Hiring Developers", "Building Tech Teams", "Assessing Coders", "Sourcing Top Engineers"];

function generateSlug(title) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
}

function generateContent(title, topic) {
  return `
# ${title}

The landscape of ${topic.toLowerCase()} is shifting rapidly. In 2024, engineering leaders are realizing that traditional methods of evaluation—like static PDF resumes—are no longer sufficient to gauge actual technical ability.

## The Problem with Resumes
Resumes tell you what a candidate *claims* they can do, but they offer zero signal on what they can *actually* execute. This discrepancy leads to the most expensive mistake a tech company can make: a bad hire. The cost of a bad engineering hire can easily exceed $250,000 when factoring in recruitment time, onboarding, lost productivity, and severance.

## A Better Way
Instead of filtering by keywords, modern teams are moving towards capability-based hiring. By analyzing real-world GitHub contributions and verified portfolios, you skip the noise and get straight to the signal.

> "We stopped looking at resumes entirely last year. Since then, our engineering retention and velocity have skyrocketed."

## How SlotMyInterview Helps
SlotMyInterview provides the infrastructure to verify engineering talent at scale. By connecting directly with a candidate's body of work, our platform extracts true technical signal, ensuring you only interview candidates who can actually ship code.

*Ready to transform your hiring pipeline? [Get early access to SlotMyInterview today.](/signup)*
  `.trim();
}

const articles = [];
let idCounter = 1;

// Seed the first 3 exact articles to match the current landing page
articles.push({
  id: String(idCounter++),
  slug: "the-fallacy-of-pdf-resumes",
  title: "The Fallacy of PDF Resumes",
  description: "Why traditional resumes are failing engineering teams and how living portfolios are taking over.",
  tag: "Hiring Trends",
  content: generateContent("The Fallacy of PDF Resumes", "Technical Hiring"),
  publishedAt: new Date(Date.now() - 1000000000).toISOString()
});

articles.push({
  id: String(idCounter++),
  slug: "evaluating-ai-talent-at-scale",
  title: "Evaluating AI Talent at Scale",
  description: "How a purpose-built platform accelerates your ability to secure top AI engineers.",
  tag: "AI Engineering",
  content: generateContent("Evaluating AI Talent at Scale", "AI Engineering"),
  publishedAt: new Date(Date.now() - 2000000000).toISOString()
});

articles.push({
  id: String(idCounter++),
  slug: "smi-a-new-approach-for-eliminating-bad-hires",
  title: "SMI: A New Approach for Eliminating Bad Hires",
  description: "Bad hires are the most expensive problem engineering leaders face. Verified portfolios hold the key.",
  tag: "Platform",
  content: generateContent("SMI: A New Approach for Eliminating Bad Hires", "Platform"),
  publishedAt: new Date(Date.now() - 3000000000).toISOString()
});

// Generate the remaining 97 articles
for (let i = 0; i < 97; i++) {
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const action = actions[Math.floor(Math.random() * actions.length)];
  const topic = topics[Math.floor(Math.random() * topics.length)];
  
  // Mix it up a bit
  const titleFormats = [
    `${adj} ${action}`,
    `${topic}: ${adj} ${action}`,
    `Why ${topic} is Changing ${action}`
  ];
  
  const title = titleFormats[Math.floor(Math.random() * titleFormats.length)];
  
  // Ensure unique slugs
  let slug = generateSlug(title);
  if (articles.some(a => a.slug === slug)) {
    slug = `${slug}-${i}`;
  }

  articles.push({
    id: String(idCounter++),
    slug,
    title,
    description: `Discover actionable insights on ${title.toLowerCase()} and how modern engineering teams are adapting in 2024.`,
    tag: topic,
    content: generateContent(title, topic),
    publishedAt: new Date(Date.now() - Math.random() * 10000000000).toISOString() // Random date in the past
  });
}

// Sort by date descending
articles.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));

const dataDir = path.join(__dirname, '../src/data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

fs.writeFileSync(
  path.join(dataDir, 'blog-posts.json'),
  JSON.stringify(articles, null, 2)
);

console.log(`Successfully generated ${articles.length} SEO-optimized articles in src/data/blog-posts.json`);
