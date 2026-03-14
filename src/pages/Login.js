import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import styles from './Auth.module.css';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!form.email) errs.email = 'Email is required';
    if (!form.password) errs.password = 'Password is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await login(form);
      toast.success('Welcome back!');
      navigate('/feed');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.bg}>
        <div className={styles.orb1} />
        <div className={styles.orb2} />
      </div>

      <div className={styles.container}>
        <div className={styles.card}>
          <div className={styles.logoRow}>
            <span className={styles.logoIcon}>◈</span>
            <span className={styles.logoText}>CollabSphere</span>
          </div>

          <h1 className={styles.title}>Welcome back</h1>
          <p className={styles.subtitle}>Sign in to your student account</p>

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.field}>
              <label>Email address</label>
              <input
                type="email"
                placeholder="you@college.edu"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                className={errors.email ? styles.inputError : ''}
              />
              {errors.email && <span className={styles.error}>{errors.email}</span>}
            </div>

            <div className={styles.field}>
              <label>Password</label>
              <input
                type="password"
                placeholder="Your password"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                className={errors.password ? styles.inputError : ''}
              />
              {errors.password && <span className={styles.error}>{errors.password}</span>}
            </div>

            <button type="submit" className={styles.submitBtn} disabled={loading}>
              {loading ? <span className={styles.btnSpinner} /> : 'Sign In'}
            </button>
          </form>

          <p className={styles.switchText}>
            New to CollabSphere?{' '}
            <Link to="/register" className={styles.switchLink}>Create account</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
