import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { userApi } from '../api/services';
import { useAuth } from '../context/AuthContext';
import PostCard from '../components/posts/PostCard';
import CollaborationModal from '../components/collaboration/CollaborationModal';
import toast from 'react-hot-toast';
import { FiEdit2, FiGithub, FiLinkedin, FiGlobe, FiPlus, FiX } from 'react-icons/fi';
import styles from './Profile.module.css';

const DEPARTMENTS = ['Computer Science', 'Electronics', 'Mechanical', 'Civil', 'Chemical', 'Business', 'Design', 'Mathematics', 'Physics', 'Other'];
const YEARS = ['1st Year', '2nd Year', '3rd Year', '4th Year', 'Postgraduate'];

const Profile = () => {
  const { id } = useParams();
  const { user: authUser, refreshUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [skillInput, setSkillInput] = useState('');
  const [editForm, setEditForm] = useState({});

  const isMe = !id || String(id) === String(authUser?.id);
  const profileId = isMe ? authUser?.id : id;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [profileRes, postsRes] = await Promise.all([
          isMe ? userApi.getMe() : userApi.getById(profileId),
          userApi.getPostsByUser(profileId),
        ]);
        setProfile(profileRes.data);
        setPosts(postsRes.data);
        if (isMe) {
          setEditForm({
            fullName: profileRes.data.fullName || '',
            username: profileRes.data.username || '',
            college: profileRes.data.college || '',
            department: profileRes.data.department || '',
            year: profileRes.data.year || '',
            bio: profileRes.data.bio || '',
            avatarUrl: profileRes.data.avatarUrl || '',
            linkedinUrl: profileRes.data.linkedinUrl || '',
            githubUrl: profileRes.data.githubUrl || '',
            portfolioUrl: profileRes.data.portfolioUrl || '',
            skills: profileRes.data.skills || [],
          });
        }
      } catch { toast.error('Failed to load profile'); }
      finally { setLoading(false); }
    };
    if (profileId) fetchData();
  }, [profileId, isMe]);

  const addSkill = () => {
    const s = skillInput.trim();
    if (s && !editForm.skills.includes(s)) {
      setEditForm({ ...editForm, skills: [...editForm.skills, s] });
    }
    setSkillInput('');
  };

  const removeSkill = (skill) => {
    setEditForm({ ...editForm, skills: editForm.skills.filter(s => s !== skill) });
  };

  const handleSave = async () => {
    try {
      const res = await userApi.updateMe(editForm);
      setProfile(res.data);
      setEditing(false);
      await refreshUser();
      toast.success('Profile updated!');
    } catch { toast.error('Failed to update profile'); }
  };

  if (loading) return (
    <div className={styles.loadingPage}><div className="spinner" /></div>
  );

  if (!profile) return null;

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {/* Profile Header */}
        <div className={styles.profileCard}>
          <div className={styles.profileTop}>
            <div className={styles.avatarWrap}>
              <div className={styles.avatar}>
                {profile.avatarUrl
                  ? <img src={profile.avatarUrl} alt={profile.fullName} />
                  : <span>{profile.fullName?.[0]?.toUpperCase()}</span>
                }
              </div>
            </div>
            <div className={styles.profileInfo}>
              <div className={styles.nameRow}>
                <div>
                  <h1 className={styles.fullName}>{profile.fullName}</h1>
                  {profile.username && (
                    <p className={styles.username}>@{profile.username}</p>
                  )}
                </div>
                {isMe && !editing && (
                  <button className={styles.editBtn} onClick={() => setEditing(true)}>
                    <FiEdit2 size={14} /> Edit Profile
                  </button>
                )}
              </div>

              <div className={styles.metaRow}>
                {profile.department && <span className={styles.metaChip}>{profile.department}</span>}
                {profile.year && <span className={styles.metaChip}>{profile.year}</span>}
                {profile.college && <span className={styles.metaChip}>{profile.college}</span>}
              </div>

              {profile.bio && <p className={styles.bio}>{profile.bio}</p>}

              <div className={styles.linksRow}>
                {profile.githubUrl && (
                  <a href={profile.githubUrl} target="_blank" rel="noreferrer" className={styles.socialLink}>
                    <FiGithub /> GitHub
                  </a>
                )}
                {profile.linkedinUrl && (
                  <a href={profile.linkedinUrl} target="_blank" rel="noreferrer" className={styles.socialLink}>
                    <FiLinkedin /> LinkedIn
                  </a>
                )}
                {profile.portfolioUrl && (
                  <a href={profile.portfolioUrl} target="_blank" rel="noreferrer" className={styles.socialLink}>
                    <FiGlobe /> Portfolio
                  </a>
                )}
              </div>

              {profile.skills?.length > 0 && (
                <div className={styles.skillsWrap}>
                  {profile.skills.map((s, i) => (
                    <span key={i} className={styles.skillTag}>{s.trim()}</span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Edit Form */}
        {editing && (
          <div className={styles.editCard}>
            <h2 className={styles.editTitle}>Edit Profile</h2>
            <div className={styles.editGrid}>
              <div className={styles.editField}>
                <label>Full Name</label>
                <input value={editForm.fullName}
                  onChange={e => setEditForm({ ...editForm, fullName: e.target.value })} />
              </div>
              <div className={styles.editField}>
                <label>Username</label>
                <input value={editForm.username}
                  onChange={e => setEditForm({ ...editForm, username: e.target.value })} />
              </div>
              <div className={styles.editField}>
                <label>College</label>
                <input value={editForm.college}
                  onChange={e => setEditForm({ ...editForm, college: e.target.value })} />
              </div>
              <div className={styles.editField}>
                <label>Department</label>
                <select value={editForm.department}
                  onChange={e => setEditForm({ ...editForm, department: e.target.value })}>
                  <option value="">Select</option>
                  {DEPARTMENTS.map(d => <option key={d}>{d}</option>)}
                </select>
              </div>
              <div className={styles.editField}>
                <label>Year</label>
                <select value={editForm.year}
                  onChange={e => setEditForm({ ...editForm, year: e.target.value })}>
                  <option value="">Select</option>
                  {YEARS.map(y => <option key={y}>{y}</option>)}
                </select>
              </div>
              <div className={styles.editField}>
                <label>Avatar URL</label>
                <input value={editForm.avatarUrl}
                  onChange={e => setEditForm({ ...editForm, avatarUrl: e.target.value })}
                  placeholder="https://..." />
              </div>
              <div className={`${styles.editField} ${styles.fullWidth}`}>
                <label>Bio</label>
                <textarea value={editForm.bio} rows={3}
                  onChange={e => setEditForm({ ...editForm, bio: e.target.value })}
                  placeholder="Tell others about yourself..." />
              </div>
              <div className={styles.editField}>
                <label>GitHub URL</label>
                <input value={editForm.githubUrl}
                  onChange={e => setEditForm({ ...editForm, githubUrl: e.target.value })}
                  placeholder="https://github.com/..." />
              </div>
              <div className={styles.editField}>
                <label>LinkedIn URL</label>
                <input value={editForm.linkedinUrl}
                  onChange={e => setEditForm({ ...editForm, linkedinUrl: e.target.value })}
                  placeholder="https://linkedin.com/in/..." />
              </div>
              <div className={styles.editField}>
                <label>Portfolio URL</label>
                <input value={editForm.portfolioUrl}
                  onChange={e => setEditForm({ ...editForm, portfolioUrl: e.target.value })}
                  placeholder="https://..." />
              </div>
              <div className={`${styles.editField} ${styles.fullWidth}`}>
                <label>Skills</label>
                <div className={styles.skillInputRow}>
                  <input value={skillInput} onChange={e => setSkillInput(e.target.value)}
                    placeholder="Add a skill and press Enter"
                    onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addSkill(); }}} />
                  <button type="button" className={styles.addSkillBtn} onClick={addSkill}><FiPlus /></button>
                </div>
                <div className={styles.skillTagsEdit}>
                  {editForm.skills?.map((s, i) => (
                    <span key={i} className={styles.skillTagEdit}>
                      {s.trim()}
                      <button type="button" onClick={() => removeSkill(s)}><FiX size={11} /></button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className={styles.editActions}>
              <button className={styles.cancelEditBtn} onClick={() => setEditing(false)}>Cancel</button>
              <button className={styles.saveBtn} onClick={handleSave}>Save Changes</button>
            </div>
          </div>
        )}

        {/* Posts */}
        <div className={styles.postsSection}>
          <h2 className={styles.sectionTitle}>
            {isMe ? 'My Posts' : `Posts by ${profile.fullName?.split(' ')[0]}`}
            <span className={styles.postCount}>{posts.length}</span>
          </h2>

          {isMe && (
            <Link to="/create" className={styles.createPostBtn}>
              <FiPlus /> Create New Post
            </Link>
          )}

          {posts.length === 0 ? (
            <div className={styles.noPosts}>
              <p>No posts yet.</p>
              {isMe && <Link to="/create" className={styles.createLink}>Create your first post →</Link>}
            </div>
          ) : (
            <div className={styles.postGrid}>
              {posts.map(post => (
                <PostCard key={post.id} post={post} onCollabClick={!isMe ? setSelectedPost : null} />
              ))}
            </div>
          )}
        </div>
      </div>

      {selectedPost && (
        <CollaborationModal post={selectedPost} onClose={() => setSelectedPost(null)} />
      )}
    </div>
  );
};

export default Profile;
