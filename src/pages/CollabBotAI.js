import React, { useMemo, useState } from 'react';
import { FiSend, FiUsers, FiZap, FiBookOpen } from 'react-icons/fi';
import styles from './CollabBotAI.module.css';

const STARTER_TIPS = [
  {
    title: 'Find teammates fast',
    body: 'Tell me your skills and availability. I will suggest ideal collaborators.',
    icon: <FiUsers />,
  },
  {
    title: 'Shape a project pitch',
    body: 'Share your idea and I will help refine the scope and roles.',
    icon: <FiZap />,
  },
  {
    title: 'Plan your next steps',
    body: 'Ask for a weekly plan or role checklist for your team.',
    icon: <FiBookOpen />,
  },
];

const COLLABORATORS = [
  {
    id: 'collab-aarav',
    name: 'Aarav Mehta',
    role: 'Backend Developer',
    skills: ['Java', 'Spring', 'APIs', 'SQL'],
    availability: 'Weeknights',
  },
  {
    id: 'collab-lina',
    name: 'Lina Brooks',
    role: 'Mobile Engineer',
    skills: ['Java', 'Android', 'Kotlin', 'UI/UX'],
    availability: 'Weekends',
  },
  {
    id: 'collab-sahana',
    name: 'Sahana Rao',
    role: 'Full-stack Developer',
    skills: ['React', 'Node', 'Postgres', 'Java'],
    availability: 'Evenings',
  },
  {
    id: 'collab-noah',
    name: 'Noah Kim',
    role: 'Product Designer',
    skills: ['UI/UX', 'Design Systems', 'Figma', 'User Research'],
    availability: 'Weekends',
  },
  {
    id: 'collab-isha',
    name: 'Isha Verma',
    role: 'Backend Engineer',
    skills: ['Java', 'Spring Boot', 'Microservices', 'Docker'],
    availability: 'Weekdays',
  },
  {
    id: 'collab-elena',
    name: 'Elena Rossi',
    role: 'Frontend Engineer',
    skills: ['React', 'TypeScript', 'UI/UX', 'Testing'],
    availability: 'Evenings',
  },
];

const PROJECTS = [
  {
    id: 'proj-campus-sync',
    title: 'Campus Sync',
    summary: 'Real-time project hub for student teams.',
    skills: ['React', 'Node', 'Postgres', 'UI/UX'],
    topContributors: ['Elena Rossi', 'Zoe Martinez'],
  },
  {
    id: 'proj-mentor-hub',
    title: 'Mentor Hub',
    summary: 'Match juniors with mentors across departments.',
    skills: ['Java', 'Spring Boot', 'SQL', 'APIs'],
    topContributors: ['Aarav Mehta', 'Isha Verma'],
  },
  {
    id: 'proj-study-sprint',
    title: 'Study Sprint',
    summary: 'Sprint planning + accountability for study groups.',
    skills: ['React', 'TypeScript', 'UX Research', 'Analytics'],
    topContributors: ['Noah Kim', 'Elena Rossi'],
  },
];

const KNOWN_SKILLS = [
  'java',
  'spring',
  'springboot',
  'spring boot',
  'react',
  'node',
  'python',
  'ai',
  'ml',
  'ui',
  'ux',
  'android',
  'kotlin',
  'sql',
  'typescript',
];

const normalizeSkill = (skill) => {
  const lower = skill.toLowerCase();
  if (lower === 'springboot' || lower === 'spring boot') return 'Spring Boot';
  if (lower === 'spring') return 'Spring';
  if (lower === 'ui') return 'UI/UX';
  if (lower === 'ux') return 'UI/UX';
  return skill.charAt(0).toUpperCase() + skill.slice(1);
};

const extractSkills = (text) => {
  const normalized = text.toLowerCase();
  const found = KNOWN_SKILLS.filter((skill) => normalized.includes(skill));
  const extra = text
    .split(/,|\\n|\\s+/)
    .map((item) => item.trim().toLowerCase())
    .filter((item) => item && KNOWN_SKILLS.includes(item));
  return Array.from(new Set([...found, ...extra])).map(normalizeSkill);
};

const matchBySkills = (items, skills) => {
  if (skills.length === 0) return items;
  return items
    .map((item) => {
      const overlap = item.skills.filter((s) =>
        skills.some((skill) => s.toLowerCase().includes(skill.toLowerCase()))
      ).length;
      return { ...item, score: overlap };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score);
};

const buildBotReply = (message) => {
  const text = message.toLowerCase();
  const skills = extractSkills(text);
  const wantsToLearn = text.includes('learn') || text.includes('learning');
  const wantsProject = text.includes('project') || text.includes('develop') || text.includes('build');

  if (wantsToLearn && skills.length > 0) {
    const matches = matchBySkills(COLLABORATORS, skills);
    if (matches.length === 0) {
      return `I could not find collaborators for ${skills.join(', ')} yet. Want me to suggest learning resources or broaden the match?`;
    }
    const list = matches
      .map((person) => `${person.name} (${person.role}) — ${person.skills.join(', ')}`)
      .join(' | ');
    return `Here are collaborators who know ${skills.join(', ')}: ${list}. Want me to draft an intro message?`;
  }

  if (wantsProject && skills.length > 0) {
    const projectMatches = matchBySkills(PROJECTS, skills);
    if (projectMatches.length === 0) {
      return `I could not find projects using ${skills.join(', ')} yet. Want ideas or a new project brief?`;
    }
    const list = projectMatches
      .map((project) => `${project.title} — ${project.summary} (Top: ${project.topContributors.join(', ')})`)
      .join(' | ');
    return `Here are strong project examples using ${skills.join(', ')}: ${list}. Want a tailored project suggestion?`;
  }

  if (text.includes('skill') || text.includes('stack')) {
    return 'Great. Share your top skills (comma-separated) and I will match collaborators and relevant projects.';
  }
  if (text.includes('idea') || text.includes('project')) {
    return 'Love it. What is the problem, target users, and timeline? I can propose a clear scope, milestones, and roles.';
  }
  if (text.includes('team') || text.includes('collab')) {
    return 'Tell me the team size you want and any gaps. I can recommend roles, teammates, and outreach tips.';
  }
  if (text.includes('plan') || text.includes('timeline')) {
    return 'Got it. Share your deadline and weekly hours. I will draft a sprint plan and tasks.';
  }
  return 'I can help with matching collaborators, refining project scope, or building a sprint plan. What do you need first?';
};

const CollabBotAI = () => {
  const [messages, setMessages] = useState([
    {
      id: 'bot-welcome',
      role: 'bot',
      text: 'Hi, I am CollabBot AI. Share your skills, project ideas, or team goals and I will help you match and plan.',
    },
  ]);
  const [input, setInput] = useState('');

  const suggestions = useMemo(() => STARTER_TIPS, []);

  const sendMessage = (text) => {
    if (!text.trim()) return;
    const userMessage = { id: `user-${Date.now()}`, role: 'user', text };
    const botMessage = { id: `bot-${Date.now() + 1}`, role: 'bot', text: buildBotReply(text) };
    setMessages((prev) => [...prev, userMessage, botMessage]);
    setInput('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div>
            <p className={styles.kicker}>CollabBot AI</p>
            <h1 className={styles.title}>Your collaboration copilot</h1>
            <p className={styles.subtitle}>
              Get help matching teammates, shaping ideas, and planning your project workflow.
            </p>
          </div>
          <div className={styles.headerCard}>
            <FiUsers className={styles.headerIcon} />
            <div>
              <p className={styles.headerTitle}>Match ready</p>
              <p className={styles.headerCopy}>Built for faster team formation and project clarity.</p>
            </div>
          </div>
        </div>

        <div className={styles.grid}>
          <div className={styles.chatCard}>
            <div className={styles.chatWindow}>
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`${styles.message} ${msg.role === 'user' ? styles.userMessage : styles.botMessage}`}
                >
                  <span>{msg.text}</span>
                </div>
              ))}
            </div>

            <form onSubmit={handleSubmit} className={styles.inputRow}>
              <input
                className={styles.input}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about skills, teammates, or project planning"
              />
              <button type="submit" className={styles.sendBtn}>
                <FiSend />
              </button>
            </form>
          </div>

          <div className={styles.tipsCard}>
            <h2 className={styles.tipsTitle}>How CollabBot can help</h2>
            <div className={styles.tipList}>
              {suggestions.map((tip) => (
                <button
                  key={tip.title}
                  className={styles.tipItem}
                  onClick={() => sendMessage(tip.body)}
                  type="button"
                >
                  <span className={styles.tipIcon}>{tip.icon}</span>
                  <div>
                    <p className={styles.tipTitle}>{tip.title}</p>
                    <p className={styles.tipText}>{tip.body}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollabBotAI;
