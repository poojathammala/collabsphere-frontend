import React, { useState, useEffect } from 'react';
import { postApi } from '../api/services';
import PostCard from '../components/posts/PostCard';
import CollaborationModal from '../components/collaboration/CollaborationModal';
import { FiFilter, FiRefreshCw } from 'react-icons/fi';
import styles from './Feed.module.css';

const TYPES = ['ALL', 'PROJECT', 'SKILL_SHARE', 'HELP_REQUEST', 'MENTORSHIP'];
const TYPE_LABELS = {
  ALL: 'All Posts', PROJECT: 'Projects', SKILL_SHARE: 'Skill Share',
  HELP_REQUEST: 'Help Needed', MENTORSHIP: 'Mentorship'
};

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeType, setActiveType] = useState('ALL');
  const [selectedPost, setSelectedPost] = useState(null);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      let data;
      if (activeType === 'ALL') {
        const res = await postApi.getAll(0, 50);
        data = res.data;
      } else {
        const res = await postApi.getByType(activeType);
        data = res.data;
      }
      setPosts(data);
    } catch { setPosts([]); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchPosts(); }, [activeType]);

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {/* Sidebar */}
        <aside className={styles.sidebar}>
          <div className={styles.sideCard}>
            <p className={styles.sideTitle}>Filter by Type</p>
            <div className={styles.filterList}>
              {TYPES.map(t => (
                <button
                  key={t}
                  className={`${styles.filterBtn} ${activeType === t ? styles.active : ''}`}
                  onClick={() => setActiveType(t)}
                >
                  {TYPE_LABELS[t]}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.sideCard}>
            <p className={styles.sideTitle}>Quick Tips</p>
            <ul className={styles.tipList}>
              <li>Post your project ideas to find team members</li>
              <li>Share your skills to help peers</li>
              <li>Search for people with specific skills</li>
              <li>Send collaboration requests to connect</li>
            </ul>
          </div>
        </aside>

        {/* Main Feed */}
        <main className={styles.main}>
          <div className={styles.feedHeader}>
            <h1 className={styles.feedTitle}>
              {TYPE_LABELS[activeType]}
            </h1>
            <button className={styles.refreshBtn} onClick={fetchPosts}>
              <FiRefreshCw size={15} />
            </button>
          </div>

          {loading ? (
            <div className={styles.loadingState}>
              {[1,2,3].map(i => <div key={i} className={styles.skeleton} />)}
            </div>
          ) : posts.length === 0 ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>◈</div>
              <h3>No posts yet</h3>
              <p>Be the first to share something!</p>
            </div>
          ) : (
            <div className={styles.postList}>
              {posts.map((post, i) => (
                <div key={post.id} style={{ animationDelay: `${i * 0.05}s` }}>
                  <PostCard post={post} onCollabClick={setSelectedPost} />
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {selectedPost && (
        <CollaborationModal
          post={selectedPost}
          onClose={() => setSelectedPost(null)}
        />
      )}
    </div>
  );
};

export default Feed;
