import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Register.css";
import { registerUser } from "../services/authService";


function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  /* =====================================================
     INPUT CHANGE
  ===================================================== */

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  };

  /* =====================================================
     REGISTER
  ===================================================== */

  const handleRegister = async (e) => {
    e.preventDefault();

    if (loading) {
      return;
    }

    setError("");
    setSuccess("");

    /* PASSWORD CHECK */

    if (form.password.length < 6) {
      setError(
        "Password must contain at least 6 characters."
      );
      return;
    }

    /* CONFIRM PASSWORD */

    if (form.password !== form.confirmPassword) {
      setError(
        "Password and confirm password do not match."
      );
      return;
    }

    setLoading(true);

    try {
      /*
        confirmPassword backend ko bhejne ki zarurat
        nahi hoti.
      */

      const payload = {
        name: form.name,
        email: form.email,
        phone: form.phone,
        address: form.address,
        password: form.password,
      };

      console.log("REGISTER PAYLOAD:", payload);

      const res = await registerUser(payload);

      console.log("REGISTER RESPONSE:", res);

      setSuccess(
        "Registration successful! Redirecting to login..."
      );

      /*
        1.5 second ke baad Login page
      */

      setTimeout(() => {
        navigate("/login");
      }, 1500);

    } catch (err) {
      console.error(
        "REGISTER ERROR:",
        err
      );

      const message =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Registration failed. Please try again.";

      setError(message);

    } finally {
      setLoading(false);
    }
  };

  /* =====================================================
     BACK HOME
  ===================================================== */

  const handleBackHome = () => {
    navigate("/");
  };

  /* =====================================================
     LOGIN
  ===================================================== */

  const handleLogin = () => {
    navigate("/login");
  };

  return (
    <div className="register-page">

      {/* BACKGROUND */}

      <div className="register-page__glow register-page__glow--one"></div>

      <div className="register-page__glow register-page__glow--two"></div>

      <div className="register-page__pattern"></div>

      {/* MAIN */}

      <div className="register-container">

        {/* =================================================
            LEFT SHOWCASE
        ================================================= */}

        <div className="register-showcase">

          <div className="register-showcase__overlay"></div>

          <div className="register-showcase__content">

            {/* BRAND */}

            <div className="register-brand">

              <div className="register-brand__symbol">
                ॐ
              </div>

              <div className="register-brand__text">

                <strong>
                  KDLC
                </strong>

                <span>
                  Temple Booking
                </span>

              </div>

            </div>

            {/* HERO */}

            <div className="register-showcase__hero">

              <span className="register-showcase__eyebrow">
                ✦ Join KDLC
              </span>

              <h1>
                Begin your
                <span>
                  divine journey.
                </span>
              </h1>

              <p>
                Create your KDLC account and book darshan,
                puja, seva, prasad and other sacred temple
                experiences with ease.
              </p>

            </div>

            {/* BENEFITS */}

            <div className="register-benefits">

              <div className="register-benefit">

                <div className="register-benefit__icon">
                  🛕
                </div>

                <div>
                  <strong>
                    Temple Services
                  </strong>

                  <span>
                    Darshan, puja, seva & more
                  </span>
                </div>

              </div>

              <div className="register-benefit">

                <div className="register-benefit__icon">
                  🎟️
                </div>

                <div>
                  <strong>
                    Easy Booking
                  </strong>

                  <span>
                    Manage all your bookings
                  </span>
                </div>

              </div>

              <div className="register-benefit">

                <div className="register-benefit__icon">
                  🔐
                </div>

                <div>
                  <strong>
                    Secure Account
                  </strong>

                  <span>
                    Your information stays protected
                  </span>
                </div>

              </div>

            </div>

          </div>

          {/* TEMPLE ART */}

          <div className="register-temple-art">

            <div className="register-sun"></div>

            <div className="register-temple">

              <div className="register-temple__flag">
                ◆
              </div>

              <div className="register-temple__tower register-temple__tower--one">
                <span></span>
                <span></span>
                <span></span>
              </div>

              <div className="register-temple__tower register-temple__tower--two">
                <span></span>
                <span></span>
                <span></span>
              </div>

              <div className="register-temple__main">

                <div className="register-temple__roof"></div>

                <div className="register-temple__pillars">
                  <i></i>
                  <i></i>
                  <i></i>
                </div>

                <div className="register-temple__door">
                  ॐ
                </div>

              </div>

            </div>

            <div className="register-temple__ground"></div>

          </div>

        </div>

        {/* =================================================
            RIGHT FORM
        ================================================= */}

        <div className="register-form-section">

          {/* MOBILE BRAND */}

          <div className="register-mobile-brand">

            <div className="register-brand__symbol">
              ॐ
            </div>

            <div className="register-brand__text">

              <strong>
                KDLC
              </strong>

              <span>
                Temple Booking
              </span>

            </div>

          </div>

          {/* HEADER */}

          <div className="register-form-header">

            <span className="register-form-header__eyebrow">
              Create your account
            </span>

            <h2>
              Join the
              <span>
                KDLC family.
              </span>
            </h2>

            <p>
              Register your account to start booking
              your temple experiences.
            </p>

          </div>

          {/* ERROR */}

          {error && (
            <div className="register-message register-message--error">

              <span className="register-message__icon">
                !
              </span>

              <div>
                <strong>
                  Registration failed
                </strong>

                <p>
                  {error}
                </p>
              </div>

            </div>
          )}

          {/* SUCCESS */}

          {success && (
            <div className="register-message register-message--success">

              <span className="register-message__icon">
                ✓
              </span>

              <div>
                <strong>
                  Success
                </strong>

                <p>
                  {success}
                </p>
              </div>

            </div>
          )}

          {/* FORM */}

          <form
            className="register-form"
            onSubmit={handleRegister}
          >

            {/* NAME */}

            <div className="register-field">

              <label htmlFor="name">
                Full Name
              </label>

              <div className="register-input-wrapper">

                <span className="register-input-icon">
                  👤
                </span>

                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={form.name}
                  onChange={handleChange}
                  autoComplete="name"
                  required
                  disabled={loading}
                />

              </div>

            </div>

            <div className="register-field">

              <label htmlFor="address">
                Address 
              </label>

              <div className="register-input-wrapper">

                <span className="register-input-icon">
                  👤
                </span>

                <input
                  id="address"
                  name="address"
                  type="text"
                  placeholder="Enter your full Address"
                  value={form.address}
                  onChange={handleChange}
                  autoComplete="address"
                  required
                  disabled={loading}
                />

              </div>

            </div>

            {/* EMAIL + PHONE */}

            <div className="register-two-columns">

              <div className="register-field">

                <label htmlFor="email">
                  Email Address
                </label>

                <div className="register-input-wrapper">

                  <span className="register-input-icon">
                    ✉
                  </span>

                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={handleChange}
                    autoComplete="email"
                    required
                    disabled={loading}
                  />

                </div>

              </div>

              <div className="register-field">

                <label htmlFor="phone">
                  Phone Number
                </label>

                <div className="register-input-wrapper">

                  <span className="register-input-icon">
                    📱
                  </span>

                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="Phone"
                    value={form.phone}
                    onChange={handleChange}
                    autoComplete="tel"
                    required
                    disabled={loading}
                  />

                </div>

              </div>

            </div>

            {/* PASSWORD */}

            <div className="register-field">

              <label htmlFor="password">
                Password
              </label>

              <div className="register-input-wrapper">

                <span className="register-input-icon">
                  🔒
                </span>

                <input
                  id="password"
                  name="password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Create password"
                  value={form.password}
                  onChange={handleChange}
                  autoComplete="new-password"
                  required
                  disabled={loading}
                />

                <button
                  type="button"
                  className="register-password-toggle"
                  onClick={() =>
                    setShowPassword(
                      (prev) => !prev
                    )
                  }
                >
                  {showPassword
                    ? "◉"
                    : "○"}
                </button>

              </div>

              <small className="register-hint">
                Use at least 6 characters.
              </small>

            </div>

            {/* CONFIRM PASSWORD */}

            <div className="register-field">

              <label htmlFor="confirmPassword">
                Confirm Password
              </label>

              <div className="register-input-wrapper">

                <span className="register-input-icon">
                  🔐
                </span>

                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Confirm password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  autoComplete="new-password"
                  required
                  disabled={loading}
                />

                <button
                  type="button"
                  className="register-password-toggle"
                  onClick={() =>
                    setShowConfirmPassword(
                      (prev) => !prev
                    )
                  }
                >
                  {showConfirmPassword
                    ? "◉"
                    : "○"}
                </button>

              </div>

            </div>

            {/* SUBMIT */}

            <button
              type="submit"
              className="register-submit"
              disabled={loading}
            >

              {loading ? (
                <>
                  <span className="register-spinner"></span>
                  Creating account...
                </>
              ) : (
                <>
                  Create Account
                  <span>→</span>
                </>
              )}

            </button>

          </form>

          {/* LOGIN */}

          <div className="register-login">

            <span>
              Already have an account?
            </span>

            <button
              type="button"
              onClick={handleLogin}
            >
              Sign In
            </button>

          </div>

          {/* SECURITY */}

          <div className="register-security">

            <span>
              🔐
            </span>

            <div>

              <strong>
                Your privacy matters
              </strong>

              <p>
                Your account information is securely protected.
              </p>

            </div>

          </div>

          {/* BACK HOME */}

          <button
            type="button"
            className="register-back-home"
            onClick={handleBackHome}
          >
            ← Back to Home
          </button>

          {/* COPYRIGHT */}

          <div className="register-copyright">
            © 2026 KDLC Temple Booking
          </div>

        </div>

      </div>

    </div>
  );
}

export default Register;

