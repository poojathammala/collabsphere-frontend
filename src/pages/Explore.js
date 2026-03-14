import React, { useState, useCallback } from 'react';
import { userApi, postApi } from '../api/services';
import PostCard from '../components/posts/PostCard';
import CollaborationModal from '../components/collaboration/CollaborationModal';
import { FiSearch, FiUser, FiFileText } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import styles from './Explore.module.css';

const Explore = () => {
  const [query, setQuery] = useState('');
  const [tab, setTab] = useState('posts'); // posts | people
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setSearched(true);
    try {
      const [postsRes, usersRes] = await Promise.all([
        postApi.search(query),
        userApi.search(query),
      ]);
      setPosts(postsRes.data);
      setUsers(usersRes.data);
    } catch { }
    finally { setLoading(false); }
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.heroSearch}>
          <h1 className={styles.heroTitle}>Find your collaborators</h1>
          <p className={styles.heroSub}>Search skills, projects, or people across your campus</p>

          <form onSubmit={handleSearch} className={styles.searchForm}>
            <div className={styles.searchBox}>
              <FiSearch className={styles.searchIcon} />
              <input
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="e.g. React, Machine Learning, UI Design..."
                className={styles.searchInput}
              />
              <button type="submit" className={styles.searchBtn}>Search</button>
            </div>
          </form>

          {!searched && (
            <div className={styles.suggestions}>
              <span className={styles.suggestLabel}>Popular:</span>
              {['Python', 'React', 'AI/ML', 'Web Dev', 'UI/UX', 'Data Science'].map(s => (
                <button key={s} className={styles.suggestTag}
                  onClick={() => { setQuery(s); }}>
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>

        {searched && (
          <>
            <div className={styles.tabs}>
              <button
                className={`${styles.tab} ${tab === 'posts' ? styles.active : ''}`}
                onClick={() => setTab('posts')}
              >
                <FiFileText /> Posts ({posts.length})
              </button>
              <button
                className={`${styles.tab} ${tab === 'people' ? styles.active : ''}`}
                onClick={() => setTab('people')}
              >
                <FiUser /> People ({users.length})
              </button>
            </div>

            {loading ? (
              <div className={styles.loadingWrap}>
                <div className="spinner" />
              </div>
            ) : tab === 'posts' ? (
              posts.length === 0 ? (
                <div className={styles.empty}>No posts found for "{query}"</div>
              ) : (
                <div className={styles.postGrid}>
                  {posts.map(post => (
                    <PostCard key={post.id} post={post} onCollabClick={setSelectedPost} />
                  ))}
                </div>
              )
            ) : (
              users.length === 0 ? (
                <div className={styles.empty}>No people found for "{query}"</div>
              ) : (
                <div className={styles.peopleGrid}>
                  {users.map(user => (
                    <Link key={user.id} to={`/users/${user.id}`} className={styles.personCard}>
                      <div className={styles.personAvatar}>
                        {user.avatarUrl
                          ? <img src={user.avatarUrl} alt={user.fullName} />
                          : <span>{user.fullName?.[0]?.toUpperCase()}</span>
                        }
                      </div>
                      <div className={styles.personInfo}>
                        <p className={styles.personName}>{user.fullName}</p>
                        <p className={styles.personMeta}>{user.department} · {user.year}</p>
                        {user.college && <p className={styles.personCollege}>{user.college}</p>}
                        {user.skills?.length > 0 && (
                          <div className={styles.personSkills}>
                            {user.skills.slice(0, 3).map((s, i) => (
                              <span key={i} className={styles.skillPill}>{s.trim()}</span>
                            ))}
                            {user.skills.length > 3 && (
                              <span className={styles.skillMore}>+{user.skills.length - 3}</span>
                            )}
                          </div>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              )
            )}
          </>
        )}
      </div>

      {selectedPost && (
        <CollaborationModal post={selectedPost} onClose={() => setSelectedPost(null)} />
      )}
    </div>
  );
};

export default Explore;
