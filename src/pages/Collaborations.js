import React, { useState, useEffect } from 'react';
import { collabApi } from '../api/services';
import { formatDistanceToNow } from 'date-fns';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FiCheck, FiX, FiInbox, FiSend, FiClock } from 'react-icons/fi';
import styles from './Collaborations.module.css';

const STATUS_CONFIG = {
  PENDING: { label: 'Pending', color: '#fb923c', bg: 'rgba(251,146,60,0.12)', icon: <FiClock /> },
  ACCEPTED: { label: 'Accepted', color: '#34d399', bg: 'rgba(52,211,153,0.12)', icon: <FiCheck /> },
  REJECTED: { label: 'Declined', color: '#f87171', bg: 'rgba(248,113,113,0.12)', icon: <FiX /> },
};

const Collaborations = () => {
  const [tab, setTab] = useState('incoming');
  const [incoming, setIncoming] = useState([]);
  const [sent, setSent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const [inRes, sentRes] = await Promise.all([
          collabApi.getIncoming(),
          collabApi.getSent(),
        ]);
        setIncoming(inRes.data);
        setSent(sentRes.data);
      } catch { toast.error('Failed to load requests'); }
      finally { setLoading(false); }
    };
    fetchAll();
  }, []);

  const handleStatus = async (id, status) => {
    try {
      const res = await collabApi.updateStatus(id, { status });
      setIncoming(prev => prev.map(r => r.id === id ? res.data : r));
      toast.success(status === 'ACCEPTED' ? 'Request accepted!' : 'Request declined');
    } catch { toast.error('Failed to update'); }
  };

  const pendingCount = incoming.filter(r => r.status === 'PENDING').length;

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Collaborations</h1>
          <p className={styles.subtitle}>Manage your collaboration requests</p>
        </div>

        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${tab === 'incoming' ? styles.active : ''}`}
            onClick={() => setTab('incoming')}
          >
            <FiInbox /> Incoming
            {pendingCount > 0 && <span className={styles.badge}>{pendingCount}</span>}
          </button>
          <button
            className={`${styles.tab} ${tab === 'sent' ? styles.active : ''}`}
            onClick={() => setTab('sent')}
          >
            <FiSend /> Sent
          </button>
        </div>

        {loading ? (
          <div className={styles.loadingWrap}><div className="spinner" /></div>
        ) : tab === 'incoming' ? (
          incoming.length === 0 ? (
            <div className={styles.empty}>
              <FiInbox size={36} style={{ marginBottom: 12, opacity: 0.3 }} />
              <p>No incoming requests yet</p>
            </div>
          ) : (
            <div className={styles.list}>
              {incoming.map(req => (
                <IncomingCard key={req.id} req={req} onStatus={handleStatus} />
              ))}
            </div>
          )
        ) : (
          sent.length === 0 ? (
            <div className={styles.empty}>
              <FiSend size={36} style={{ marginBottom: 12, opacity: 0.3 }} />
              <p>You haven't sent any requests yet</p>
            </div>
          ) : (
            <div className={styles.list}>
              {sent.map(req => (
                <SentCard key={req.id} req={req} />
              ))}
            </div>
          )
        )}
      </div>
    </div>
  );
};

const IncomingCard = ({ req, onStatus }) => {
  const statusConf = STATUS_CONFIG[req.status];
  return (
    <div className={styles.card}>
      <div className={styles.cardTop}>
        <Link to={`/users/${req.requester?.id}`} className={styles.requesterRow}>
          <div className={styles.avatar}>
            {req.requester?.avatarUrl
              ? <img src={req.requester.avatarUrl} alt="" />
              : <span>{req.requester?.fullName?.[0]?.toUpperCase()}</span>
            }
          </div>
          <div>
            <p className={styles.requesterName}>{req.requester?.fullName}</p>
            <p className={styles.requesterMeta}>{req.requester?.department} · {req.requester?.year}</p>
          </div>
        </Link>
        <span className={styles.statusBadge} style={{ color: statusConf.color, background: statusConf.bg }}>
          {statusConf.icon} {statusConf.label}
        </span>
      </div>

      <Link to={`/posts/${req.post?.id}`} className={styles.postLink}>
        on: <strong>{req.post?.title}</strong>
      </Link>

      {req.message && (
        <div className={styles.message}>
          <p>{req.message}</p>
        </div>
      )}

      <div className={styles.cardFooter}>
        <span className={styles.time}>
          {formatDistanceToNow(new Date(req.createdAt), { addSuffix: true })}
        </span>
        {req.status === 'PENDING' && (
          <div className={styles.actions}>
            <button className={styles.rejectBtn} onClick={() => onStatus(req.id, 'REJECTED')}>
              <FiX /> Decline
            </button>
            <button className={styles.acceptBtn} onClick={() => onStatus(req.id, 'ACCEPTED')}>
              <FiCheck /> Accept
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const SentCard = ({ req }) => {
  const statusConf = STATUS_CONFIG[req.status];
  return (
    <div className={styles.card}>
      <div className={styles.cardTop}>
        <Link to={`/posts/${req.post?.id}`} className={styles.postTitleLink}>
          <strong>{req.post?.title}</strong>
          <span className={styles.postAuthor}>by {req.post?.author?.fullName}</span>
        </Link>
        <span className={styles.statusBadge} style={{ color: statusConf.color, background: statusConf.bg }}>
          {statusConf.icon} {statusConf.label}
        </span>
      </div>
      {req.message && (
        <div className={styles.message}><p>{req.message}</p></div>
      )}
      <div className={styles.cardFooter}>
        <span className={styles.time}>
          {formatDistanceToNow(new Date(req.createdAt), { addSuffix: true })}
        </span>
      </div>
    </div>
  );
};

export default Collaborations;
