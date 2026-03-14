import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import styles from './Auth.module.css';

const DEPARTMENTS = ['Computer Science', 'Electronics', 'Mechanical', 'Civil', 'Chemical', 'Business', 'Design', 'Mathematics', 'Physics', 'Other'];
const YEARS = ['1st Year', '2nd Year', '3rd Year', '4th Year', 'Postgraduate'];

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    fullName: '', email: '', password: '', confirmPassword: '',
    college: '', department: '', year: '', username: ''
  });
  const [errors, setErrors] = useState({});

  const validateStep1 = () => {
    const errs = {};
    if (!form.fullName.trim()) errs.fullName = 'Full name is required';
    if (!form.email) errs.email = 'Email is required';
    if (!form.password || form.password.length < 6) errs.password = 'Password must be at least 6 characters';
    if (form.password !== form.confirmPassword) errs.confirmPassword = 'Passwords do not match';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateStep2 = () => {
    const errs = {};
    if (!form.college.trim()) errs.college = 'College name is required';
    if (!form.department) errs.department = 'Department is required';
    if (!form.year) errs.year = 'Year is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (validateStep1()) setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep2()) return;
    setLoading(true);
    try {
      await register({
        fullName: form.fullName,
        email: form.email,
        password: form.password,
        college: form.college,
        department: form.department,
        year: form.year,
        username: form.username || form.email.split('@')[0],
      });
      toast.success('Welcome to CollabSphere! 🎉');
      navigate('/feed');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
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

          <h1 className={styles.title}>Join CollabSphere</h1>
          <p className={styles.subtitle}>Connect, collaborate, and grow with your peers</p>

          {/* Steps indicator */}
          <div className={styles.steps}>
            <div className={`${styles.step} ${step >= 1 ? styles.stepActive : ''}`}>
              <span>1</span> Account
            </div>
            <div className={styles.stepLine} />
            <div className={`${styles.step} ${step >= 2 ? styles.stepActive : ''}`}>
              <span>2</span> College Info
            </div>
          </div>

          {step === 1 && (
            <div className={styles.form}>
              <div className={styles.field}>
                <label>Full Name</label>
                <input placeholder="Your full name" value={form.fullName}
                  onChange={e => setForm({ ...form, fullName: e.target.value })}
                  className={errors.fullName ? styles.inputError : ''} />
                {errors.fullName && <span className={styles.error}>{errors.fullName}</span>}
              </div>

              <div className={styles.field}>
                <label>Email</label>
                <input type="email" placeholder="you@college.edu" value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  className={errors.email ? styles.inputError : ''} />
                {errors.email && <span className={styles.error}>{errors.email}</span>}
              </div>

              <div className={styles.field}>
                <label>Username (optional)</label>
                <input placeholder="@username" value={form.username}
                  onChange={e => setForm({ ...form, username: e.target.value })} />
              </div>

              <div className={styles.field}>
                <label>Password</label>
                <input type="password" placeholder="Min. 6 characters" value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  className={errors.password ? styles.inputError : ''} />
                {errors.password && <span className={styles.error}>{errors.password}</span>}
              </div>

              <div className={styles.field}>
                <label>Confirm Password</label>
                <input type="password" placeholder="Repeat password" value={form.confirmPassword}
                  onChange={e => setForm({ ...form, confirmPassword: e.target.value })}
                  className={errors.confirmPassword ? styles.inputError : ''} />
                {errors.confirmPassword && <span className={styles.error}>{errors.confirmPassword}</span>}
              </div>

              <button type="button" className={styles.submitBtn} onClick={handleNext}>
                Continue →
              </button>
            </div>
          )}

          {step === 2 && (
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.field}>
                <label>College / University</label>
                <input placeholder="e.g. IIT Hyderabad" value={form.college}
                  onChange={e => setForm({ ...form, college: e.target.value })}
                  className={errors.college ? styles.inputError : ''} />
                {errors.college && <span className={styles.error}>{errors.college}</span>}
              </div>

              <div className={styles.field}>
                <label>Department</label>
                <select value={form.department}
                  onChange={e => setForm({ ...form, department: e.target.value })}
                  className={errors.department ? styles.inputError : ''}>
                  <option value="">Select department</option>
                  {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
                {errors.department && <span className={styles.error}>{errors.department}</span>}
              </div>

              <div className={styles.field}>
                <label>Academic Year</label>
                <select value={form.year}
                  onChange={e => setForm({ ...form, year: e.target.value })}
                  className={errors.year ? styles.inputError : ''}>
                  <option value="">Select year</option>
                  {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                </select>
                {errors.year && <span className={styles.error}>{errors.year}</span>}
              </div>

              <div className={styles.btnRow}>
                <button type="button" className={styles.backBtn} onClick={() => setStep(1)}>
                  ← Back
                </button>
                <button type="submit" className={styles.submitBtn} disabled={loading}>
                  {loading ? <span className={styles.btnSpinner} /> : 'Create Account'}
                </button>
              </div>
            </form>
          )}

          <p className={styles.switchText}>
            Already have an account?{' '}
            <Link to="/login" className={styles.switchLink}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
