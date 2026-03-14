import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { FiHeart, FiMessageCircle, FiUsers, FiTag } from 'react-icons/fi';
import { postApi } from '../../api/services';
import styles from './PostCard.module.css';

const TYPE_CONFIG = {
  PROJECT: { label: 'Project', color: '#7c6af7', bg: 'rgba(124,106,247,0.12)' },
  SKILL_SHARE: { label: 'Skill Share', color: '#34d399', bg: 'rgba(52,211,153,0.12)' },
  HELP_REQUEST: { label: 'Help Needed', color: '#fb923c', bg: 'rgba(251,146,60,0.12)' },
  MENTORSHIP: { label: 'Mentorship', color: '#60a5fa', bg: 'rgba(96,165,250,0.12)' },
};

const PostCard = ({ post, onCollabClick }) => {
  const [likes, setLikes] = useState(post.likesCount);
  const [liked, setLiked] = useState(false);
  const typeConfig = TYPE_CONFIG[post.type] || TYPE_CONFIG.PROJECT;

  const handleLike = async (e) => {
    e.preventDefault();
    if (liked) return;
    try {
      await postApi.like(post.id);
      setLikes(l => l + 1);
      setLiked(true);
    } catch {}
  };

  const allSkills = [
    ...(post.skillsRequired || []),
    ...(post.skillsOffered || [])
  ].filter(Boolean).slice(0, 4);

  return (
    <div className={styles.card}>
      {/* Header */}
      <div className={styles.header}>
        <Link to={`/users/${post.author?.id}`} className={styles.authorRow}>
          <div className={styles.avatar}>
            {post.author?.avatarUrl
              ? <img src={post.author.avatarUrl} alt={post.author.fullName} />
              : <span>{post.author?.fullName?.[0]?.toUpperCase()}</span>
            }
          </div>
          <div>
            <p className={styles.authorName}>{post.author?.fullName}</p>
            <p className={styles.authorMeta}>
              {post.author?.department} · {post.author?.year}
            </p>
          </div>
        </Link>

        <span
          className={styles.typeBadge}
          style={{ color: typeConfig.color, background: typeConfig.bg }}
        >
          {typeConfig.label}
        </span>
      </div>

      {/* Body */}
      <Link to={`/posts/${post.id}`} className={styles.body}>
        <h3 className={styles.title}>{post.title}</h3>
        <p className={styles.description}>{post.description}</p>
      </Link>

      {/* Domain */}
      {post.domain && (
        <div className={styles.domain}>
          <FiTag size={12} /> {post.domain}
        </div>
      )}

      {/* Skills */}
      {allSkills.length > 0 && (
        <div className={styles.skills}>
          {allSkills.map((skill, i) => (
            <span key={i} className={styles.skillTag}>{skill.trim()}</span>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className={styles.footer}>
        <div className={styles.stats}>
          <button
            className={`${styles.statBtn} ${liked ? styles.liked : ''}`}
            onClick={handleLike}
          >
            <FiHeart /> {likes}
          </button>
          <Link to={`/posts/${post.id}`} className={styles.statBtn}>
            <FiMessageCircle /> {post.commentCount || 0}
          </Link>
          <span className={styles.statBtn}>
            <FiUsers /> {post.collaboratorsCount || 0}
          </span>
        </div>

        <div className={styles.rightFooter}>
          <span className={styles.time}>
            {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
          </span>
          {post.openForCollaboration && (
            <button
              className={styles.collabBtn}
              onClick={() => onCollabClick && onCollabClick(post)}
            >
              Collaborate
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostCard;
