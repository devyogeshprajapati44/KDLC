
import React, { useState } from "react";
import { loginUser } from "../services/authService";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");


  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (error) {
      setError("");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (loading) {
      return;
    }

    setError("");
    setLoading(true);

    try {
      const res = await loginUser(form);

      console.log("LOGIN RESPONSE:", res);

      if (res?.accessToken) {
        localStorage.setItem(
          "accessToken",
          res.accessToken
        );
      }

      if (res?.refreshToken) {
        localStorage.setItem(
          "refreshToken",
          res.refreshToken
        );
      }

      if (res?.user) {
        localStorage.setItem(
          "user",
          JSON.stringify(res.user)
        );
      }

      console.log("LOGIN USER:", res?.user);

      const pendingProduct =
        localStorage.getItem("pendingProduct");

      if (pendingProduct) {
        try {
          const product = JSON.parse(pendingProduct);

          console.log(
            "PENDING PRODUCT:",
            product
          );

          localStorage.removeItem("pendingProduct");

          navigate("/dashboard");

          return;

        } catch (pendingError) {
          console.error(
            "PENDING PRODUCT ERROR:",
            pendingError
          );

          localStorage.removeItem(
            "pendingProduct"
          );
        }
      }

      if (
        res?.user?.role === "ADMIN" ||
        res?.user?.role === "SUPER_ADMIN"
      ) {
        navigate("/dashboard");
      } else {
        navigate("/dashboard");
      }

    } catch (err) {
      console.error(
        "LOGIN ERROR:",
        err
      );

      const message =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Invalid email or password. Please try again.";

      setError(message);

    } finally {
      setLoading(false);
    }
  };

  const handleBackHome = () => {
    navigate("/");
  };

  return (
    <div className="login-page">

      <div className="login-page__glow login-page__glow--one"></div>
      <div className="login-page__glow login-page__glow--two"></div>

      <div className="login-page__pattern"></div>

      <div className="login-container">
        <div className="login-showcase">

          <div className="login-showcase__overlay"></div>

          <div className="login-showcase__content">

            {/* LOGO */}

            <div className="login-brand">

              <div className="login-brand__symbol">
                ॐ
              </div>

              <div className="login-brand__text">

                <strong>
                  KDLC
                </strong>

                <span>
                  Temple Booking
                </span>

              </div>

            </div>

            {/* HERO */}

            <div className="login-showcase__hero">

              <span className="login-showcase__eyebrow">
                ✦ Divine Temple Experience
              </span>

              <h1>
                Welcome back to your
                <span>
                  spiritual journey.
                </span>
              </h1>

              <p>
                Sign in to manage your temple bookings,
                darshan, puja, seva and sacred experiences
                with KDLC.
              </p>

            </div>

            {/* FEATURES */}

            <div className="login-benefits">

              <div className="login-benefit">

                <div className="login-benefit__icon">
                  🎟️
                </div>

                <div>
                  <strong>
                    Easy Booking
                  </strong>

                  <span>
                    Book your temple visit easily
                  </span>
                </div>

              </div>

              <div className="login-benefit">

                <div className="login-benefit__icon">
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

              <div className="login-benefit">

                <div className="login-benefit__icon">
                  🙏
                </div>

                <div>
                  <strong>
                    Peaceful Experience
                  </strong>

                  <span>
                    Plan your divine journey
                  </span>
                </div>

              </div>

            </div>

          </div>

          {/* TEMPLE ART */}

          <div className="login-temple-art">

            <div className="login-sun"></div>

            <div className="login-temple">

              <div className="login-temple__flag">
                ◆
              </div>

              <div className="login-temple__tower login-temple__tower--one">
                <span></span>
                <span></span>
                <span></span>
              </div>

              <div className="login-temple__tower login-temple__tower--two">
                <span></span>
                <span></span>
                <span></span>
              </div>

              <div className="login-temple__main">

                <div className="login-temple__roof"></div>

                <div className="login-temple__pillars">
                  <i></i>
                  <i></i>
                  <i></i>
                </div>

                <div className="login-temple__door">
                  ॐ
                </div>

              </div>

            </div>

            <div className="login-temple__ground"></div>

          </div>

        </div>

        {/* =================================================
            RIGHT SIDE
        ================================================= */}

        <div className="login-form-section">

          {/* MOBILE LOGO */}

          <div className="login-mobile-brand">

            <div className="login-brand__symbol">
              ॐ
            </div>

            <div className="login-brand__text">

              <strong>
                KDLC
              </strong>

              <span>
                Temple Booking
              </span>

            </div>

          </div>

          {/* FORM HEADER */}

          <div className="login-form-header">

            <span className="login-form-header__eyebrow">
              Welcome back
            </span>

            <h2>
              Sign in to your
              <span>
                account.
              </span>
            </h2>

            <p>
              Enter your details to continue your
              temple booking journey.
            </p>

          </div>

          {/* ERROR */}

          {error && (

            <div className="login-error">

              <span className="login-error__icon">
                !
              </span>

              <div>
                <strong>
                  Login failed
                </strong>

                <p>
                  {error}
                </p>
              </div>

            </div>

          )}

          <form
            className="login-form"
            onSubmit={handleLogin}
          >
            <div className="login-field">

              <label htmlFor="email">
                Email Address
              </label>

              <div className="login-input-wrapper">

                <span className="login-input-icon">
                  ✉
                </span>

                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  value={form.email}
                  onChange={handleChange}
                  autoComplete="email"
                  required
                  disabled={loading}
                />

              </div>

            </div>

            {/* PASSWORD */}

            <div className="login-field">

              <div className="login-label-row">

                <label htmlFor="password">
                  Password
                </label>

                <button
                  type="button"
                  className="forgot-password"
                  onClick={() => {
                    alert(
                      "Forgot password feature will be available soon."
                    );
                  }}
                >
                  Forgot password?
                </button>

              </div>

              <div className="login-input-wrapper">

                <span className="login-input-icon">
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
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                  required
                  disabled={loading}
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowPassword(
                      (prev) => !prev
                    )
                  }
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showPassword
                    ? "◉"
                    : "○"}
                </button>

              </div>

            </div>

            {/* REMEMBER */}

            <div className="login-options">

              <label className="remember-me">

                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) =>
                    setRememberMe(
                      e.target.checked
                    )
                  }
                />

                <span className="custom-checkbox"></span>

                <span>
                  Remember me
                </span>

              </label>

            </div>

            <div className="login-buttons">
                <button
                  type="submit"
                  className="login-submit"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="login-spinner"></span>
                      Signing in...
                    </>
                  ) : (
                    <>
                      Sign In
                      <span>→</span>
                    </>
                  )}
                </button>

                {/* SIGNUP */}
                <button
                  type="button"
                  className="login-signup"
                  disabled={loading}
                   onClick={() => navigate("/register")}
                >
                  Create Account
                  <span>→</span>
                </button>

              </div>

          </form>
          <div className="login-divider">
            <span></span>
            <small>
              Secure temple booking
            </small>
            <span></span>
          </div>
          <div className="login-security">
            <span>
              🔐
            </span>
            <div>
              <strong>
                Your privacy matters
              </strong>
              <p>
                Your account information is securely
                protected.
              </p>
            </div>
          </div>
          <button
            type="button"
            className="login-back-home"
            onClick={handleBackHome}
          >
            ← Back to Home
          </button>

          {/* COPYRIGHT */}

          <div className="login-copyright">
            © 2026 KDLC Temple Booking
          </div>

        </div>

      </div>

    </div>
  );
}

export default Login;

