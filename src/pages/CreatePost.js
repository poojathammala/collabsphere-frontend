import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { postApi } from '../api/services';
import toast from 'react-hot-toast';
import { FiPlus, FiX } from 'react-icons/fi';
import styles from './CreatePost.module.css';

const POST_TYPES = [
  { value: 'PROJECT', label: '🚀 Project', desc: 'Looking for teammates for a project' },
  { value: 'SKILL_SHARE', label: '🎓 Skill Share', desc: 'Share knowledge or teach others' },
  { value: 'HELP_REQUEST', label: '🆘 Help Needed', desc: 'Need help with something' },
  { value: 'MENTORSHIP', label: '🤝 Mentorship', desc: 'Offer or seek mentorship' },
];

const DOMAINS = ['Web Development', 'Mobile App', 'AI/ML', 'Data Science', 'UI/UX Design',
  'Cybersecurity', 'Cloud Computing', 'Game Development', 'Blockchain', 'IoT', 'Research', 'Other'];

const CreatePost = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: '', description: '', type: '', domain: '',
    openForCollaboration: true,
  });
  const [skillsRequired, setSkillsRequired] = useState([]);
  const [skillsOffered, setSkillsOffered] = useState([]);
  const [skillInput, setSkillInput] = useState('');
  const [offerInput, setOfferInput] = useState('');
  const [errors, setErrors] = useState({});

  const addSkill = (list, setList, input, setInput) => {
    const s = input.trim();
    if (s && !list.includes(s)) {
      setList([...list, s]);
    }
    setInput('');
  };

  const removeSkill = (list, setList, skill) => {
    setList(list.filter(s => s !== skill));
  };

  const validate = () => {
    const errs = {};
    if (!form.title.trim()) errs.title = 'Title is required';
    if (!form.description.trim()) errs.description = 'Description is required';
    if (!form.type) errs.type = 'Post type is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const payload = {
        ...form,
        skillsRequired,
        skillsOffered,
      };
      const res = await postApi.create(payload);
      toast.success('Post created successfully!');
      navigate(`/posts/${res.data.id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Create a Post</h1>
          <p className={styles.subtitle}>Share your project, skills, or ask for help</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Post Type */}
          <div className={styles.section}>
            <label className={styles.sectionLabel}>Post Type *</label>
            <div className={styles.typeGrid}>
              {POST_TYPES.map(t => (
                <button
                  key={t.value}
                  type="button"
                  className={`${styles.typeCard} ${form.type === t.value ? styles.typeActive : ''}`}
                  onClick={() => setForm({ ...form, type: t.value })}
                >
                  <span className={styles.typeLabel}>{t.label}</span>
                  <span className={styles.typeDesc}>{t.desc}</span>
                </button>
              ))}
            </div>
            {errors.type && <span className={styles.error}>{errors.type}</span>}
          </div>

          {/* Title */}
          <div className={styles.field}>
            <label>Title *</label>
            <input
              placeholder="Give your post a clear, descriptive title"
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
              className={errors.title ? styles.inputError : ''}
            />
            {errors.title && <span className={styles.error}>{errors.title}</span>}
          </div>

          {/* Description */}
          <div className={styles.field}>
            <label>Description *</label>
            <textarea
              placeholder="Describe in detail what you're looking for, what you're offering, or what help you need..."
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              rows={6}
              className={errors.description ? styles.inputError : ''}
            />
            {errors.description && <span className={styles.error}>{errors.description}</span>}
          </div>

          {/* Domain */}
          <div className={styles.field}>
            <label>Domain / Category</label>
            <select value={form.domain} onChange={e => setForm({ ...form, domain: e.target.value })}>
              <option value="">Select a domain (optional)</option>
              {DOMAINS.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>

          {/* Skills Required */}
          <div className={styles.field}>
            <label>Skills Required</label>
            <div className={styles.skillInputRow}>
              <input
                placeholder="e.g. React, Python, Figma"
                value={skillInput}
                onChange={e => setSkillInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addSkill(skillsRequired, setSkillsRequired, skillInput, setSkillInput);
                  }
                }}
              />
              <button type="button" className={styles.addSkillBtn}
                onClick={() => addSkill(skillsRequired, setSkillsRequired, skillInput, setSkillInput)}>
                <FiPlus />
              </button>
            </div>
            {skillsRequired.length > 0 && (
              <div className={styles.skillTags}>
                {skillsRequired.map(s => (
                  <span key={s} className={styles.skillTag}>
                    {s}
                    <button type="button" onClick={() => removeSkill(skillsRequired, setSkillsRequired, s)}>
                      <FiX size={12} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Skills Offered */}
          <div className={styles.field}>
            <label>Skills You Offer</label>
            <div className={styles.skillInputRow}>
              <input
                placeholder="e.g. Mentoring, Code Review, Design"
                value={offerInput}
                onChange={e => setOfferInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addSkill(skillsOffered, setSkillsOffered, offerInput, setOfferInput);
                  }
                }}
              />
              <button type="button" className={styles.addSkillBtn}
                onClick={() => addSkill(skillsOffered, setSkillsOffered, offerInput, setOfferInput)}>
                <FiPlus />
              </button>
            </div>
            {skillsOffered.length > 0 && (
              <div className={styles.skillTags}>
                {skillsOffered.map(s => (
                  <span key={s} className={`${styles.skillTag} ${styles.offerTag}`}>
                    {s}
                    <button type="button" onClick={() => removeSkill(skillsOffered, setSkillsOffered, s)}>
                      <FiX size={12} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Open for Collaboration */}
          <div className={styles.toggleRow}>
            <div>
              <p className={styles.toggleLabel}>Open for Collaboration</p>
              <p className={styles.toggleDesc}>Allow others to send you collaboration requests</p>
            </div>
            <button
              type="button"
              className={`${styles.toggle} ${form.openForCollaboration ? styles.toggleOn : ''}`}
              onClick={() => setForm({ ...form, openForCollaboration: !form.openForCollaboration })}
            >
              <span className={styles.toggleThumb} />
            </button>
          </div>

          {/* Submit */}
          <div className={styles.submitRow}>
            <button type="button" className={styles.cancelBtn} onClick={() => navigate(-1)}>
              Cancel
            </button>
            <button type="submit" className={styles.submitBtn} disabled={loading}>
              {loading ? <span className={styles.spinner} /> : 'Publish Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;
