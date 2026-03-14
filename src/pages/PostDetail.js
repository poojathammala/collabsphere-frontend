import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { postApi, commentApi } from '../api/services';
import { useAuth } from '../context/AuthContext';
import CollaborationModal from '../components/collaboration/CollaborationModal';
import { formatDistanceToNow } from 'date-fns';
import { FiHeart, FiSend, FiTrash2, FiArrowLeft, FiUsers } from 'react-icons/fi';
import toast from 'react-hot-toast';
import styles from './PostDetail.module.css';

const TYPE_CONFIG = {
  PROJECT: { label: 'Project', color: '#7c6af7', bg: 'rgba(124,106,247,0.12)' },
  SKILL_SHARE: { label: 'Skill Share', color: '#34d399', bg: 'rgba(52,211,153,0.12)' },
  HELP_REQUEST: { label: 'Help Needed', color: '#fb923c', bg: 'rgba(251,146,60,0.12)' },
  MENTORSHIP: { label: 'Mentorship', color: '#60a5fa', bg: 'rgba(96,165,250,0.12)' },
};

const PostDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [liked, setLiked] = useState(false);
  const [showCollab, setShowCollab] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [postRes, commentsRes] = await Promise.all([
          postApi.getById(id),
          commentApi.getByPost(id),
        ]);
        setPost(postRes.data);
        setComments(commentsRes.data);
      } catch {
        toast.error('Post not found');
        navigate('/feed');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, navigate]);

  const handleLike = async () => {
    if (liked) return;
    try {
      const res = await postApi.like(id);
      setPost(res.data);
      setLiked(true);
    } catch {}
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    setSubmitting(true);
    try {
      const res = await commentApi.add(id, { content: commentText });
      setComments([...comments, res.data]);
      setCommentText('');
    } catch {
      toast.error('Failed to add comment');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await commentApi.delete(commentId);
      setComments(comments.filter(c => c.id !== commentId));
      toast.success('Comment deleted');
    } catch {
      toast.error('Failed to delete comment');
    }
  };

  const handleDeletePost = async () => {
    if (!window.confirm('Delete this post?')) return;
    try {
      await postApi.delete(id);
      toast.success('Post deleted');
      navigate('/feed');
    } catch {
      toast.error('Failed to delete post');
    }
  };

  if (loading) {
    return (
      <div className={styles.loadingPage}>
        <div className="spinner" />
      </div>
    );
  }

  if (!post) return null;

  const typeConfig = TYPE_CONFIG[post.type] || TYPE_CONFIG.PROJECT;
  const isOwner = user?.id === post.author?.id;

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <button className={styles.backBtn} onClick={() => navigate(-1)}>
          <FiArrowLeft /> Back
        </button>

        <div className={styles.layout}>
          {/* Main Content */}
          <div className={styles.main}>
            <div className={styles.postCard}>
              {/* Header */}
              <div className={styles.postHeader}>
                <span className={styles.typeBadge}
                  style={{ color: typeConfig.color, background: typeConfig.bg }}>
                  {typeConfig.label}
                </span>
                {post.domain && (
                  <span className={styles.domainBadge}>{post.domain}</span>
                )}
                {isOwner && (
                  <div className={styles.ownerActions}>
                    <button className={styles.deleteBtn} onClick={handleDeletePost}>
                      <FiTrash2 size={14} /> Delete
                    </button>
                  </div>
                )}
              </div>

              <h1 className={styles.postTitle}>{post.title}</h1>
              <p className={styles.postDescription}>{post.description}</p>

              {/* Skills */}
              {(post.skillsRequired?.length > 0 || post.skillsOffered?.length > 0) && (
                <div className={styles.skillsSection}>
                  {post.skillsRequired?.length > 0 && (
                    <div>
                      <p className={styles.skillLabel}>Skills Required</p>
                      <div className={styles.skillList}>
                        {post.skillsRequired.map((s, i) => (
                          <span key={i} className={styles.skillTag}>{s.trim()}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  {post.skillsOffered?.length > 0 && (
                    <div>
                      <p className={styles.skillLabel}>Skills Offered</p>
                      <div className={styles.skillList}>
                        {post.skillsOffered.map((s, i) => (
                          <span key={i} className={`${styles.skillTag} ${styles.offerTag}`}>{s.trim()}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Stats row */}
              <div className={styles.statsRow}>
                <button className={`${styles.statBtn} ${liked ? styles.liked : ''}`} onClick={handleLike}>
                  <FiHeart /> {post.likesCount} likes
                </button>
                <span className={styles.statBtn}>
                  <FiUsers /> {post.collaboratorsCount} collaborators
                </span>
                <span className={styles.time}>
                  {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                </span>
              </div>
            </div>

            {/* Comments */}
            <div className={styles.commentsSection}>
              <h2 className={styles.commentsTitle}>
                Comments <span>{comments.length}</span>
              </h2>

              {/* Comment Input */}
              <form onSubmit={handleComment} className={styles.commentForm}>
                <div className={styles.commentAvatar}>
                  {user?.avatarUrl
                    ? <img src={user.avatarUrl} alt="" />
                    : <span>{user?.fullName?.[0]?.toUpperCase()}</span>
                  }
                </div>
                <div className={styles.commentInputWrap}>
                  <input
                    placeholder="Add a comment..."
                    value={commentText}
                    onChange={e => setCommentText(e.target.value)}
                    className={styles.commentInput}
                  />
                  <button type="submit" className={styles.commentSendBtn} disabled={submitting || !commentText.trim()}>
                    <FiSend />
                  </button>
                </div>
              </form>

              {/* Comments List */}
              <div className={styles.commentList}>
                {comments.length === 0 ? (
                  <p className={styles.noComments}>No comments yet. Be the first!</p>
                ) : (
                  comments.map(comment => (
                    <div key={comment.id} className={styles.comment}>
                      <Link to={`/users/${comment.author?.id}`} className={styles.commentAvatar}>
                        {comment.author?.avatarUrl
                          ? <img src={comment.author.avatarUrl} alt="" />
                          : <span>{comment.author?.fullName?.[0]?.toUpperCase()}</span>
                        }
                      </Link>
                      <div className={styles.commentContent}>
                        <div className={styles.commentHeader}>
                          <Link to={`/users/${comment.author?.id}`} className={styles.commentAuthor}>
                            {comment.author?.fullName}
                          </Link>
                          <span className={styles.commentTime}>
                            {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                          </span>
                        </div>
                        <p className={styles.commentText}>{comment.content}</p>
                      </div>
                      {user?.id === comment.author?.id && (
                        <button className={styles.deleteCommentBtn}
                          onClick={() => handleDeleteComment(comment.id)}>
                          <FiTrash2 size={13} />
                        </button>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <aside className={styles.sidebar}>
            {/* Author Card */}
            <div className={styles.authorCard}>
              <p className={styles.authorCardTitle}>Posted by</p>
              <Link to={`/users/${post.author?.id}`} className={styles.authorLink}>
                <div className={styles.authorAvatar}>
                  {post.author?.avatarUrl
                    ? <img src={post.author.avatarUrl} alt="" />
                    : <span>{post.author?.fullName?.[0]?.toUpperCase()}</span>
                  }
                </div>
                <div>
                  <p className={styles.authorName}>{post.author?.fullName}</p>
                  <p className={styles.authorMeta}>{post.author?.department}</p>
                  <p className={styles.authorMeta}>{post.author?.year} · {post.author?.college}</p>
                </div>
              </Link>
            </div>

            {/* Collaborate */}
            {!isOwner && post.openForCollaboration && (
              <button className={styles.collabBigBtn} onClick={() => setShowCollab(true)}>
                <FiUsers size={18} />
                Request to Collaborate
              </button>
            )}

            {!post.openForCollaboration && (
              <div className={styles.closedBadge}>
                Not accepting collaborations
              </div>
            )}
          </aside>
        </div>
      </div>

      {showCollab && (
        <CollaborationModal post={post} onClose={() => setShowCollab(false)} />
      )}
    </div>
  );
};

export default PostDetail;
