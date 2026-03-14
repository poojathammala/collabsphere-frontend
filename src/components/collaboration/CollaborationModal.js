import React, { useState } from 'react';
import { collabApi } from '../../api/services';
import toast from 'react-hot-toast';
import { FiX, FiSend } from 'react-icons/fi';
import styles from './CollaborationModal.module.css';

const CollaborationModal = ({ post, onClose }) => {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) { toast.error('Please write a message'); return; }
    setLoading(true);
    try {
      await collabApi.sendRequest({ postId: post.id, message });
      toast.success('Collaboration request sent!');
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <div>
            <h2 className={styles.title}>Request to Collaborate</h2>
            <p className={styles.subtitle}>on "{post.title}"</p>
          </div>
          <button className={styles.closeBtn} onClick={onClose}><FiX /></button>
        </div>

        <div className={styles.postPreview}>
          <div className={styles.authorInfo}>
            <div className={styles.avatar}>
              {post.author?.avatarUrl
                ? <img src={post.author.avatarUrl} alt="" />
                : <span>{post.author?.fullName?.[0]}</span>
              }
            </div>
            <div>
              <p className={styles.authorName}>{post.author?.fullName}</p>
              <p className={styles.authorDept}>{post.author?.department} · {post.author?.college}</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label>Your message</label>
            <textarea
              placeholder={`Hi ${post.author?.fullName?.split(' ')[0]}, I'd love to collaborate on this. Here's what I can contribute...`}
              value={message}
              onChange={e => setMessage(e.target.value)}
              rows={5}
            />
          </div>
          <div className={styles.btnRow}>
            <button type="button" className={styles.cancelBtn} onClick={onClose}>Cancel</button>
            <button type="submit" className={styles.sendBtn} disabled={loading}>
              {loading ? <span className={styles.spinner} /> : <><FiSend /> Send Request</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CollaborationModal;
