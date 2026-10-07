import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentUser } from "../../../core/redux/action";

import { all_routes } from "../../../Router/all_routes";
import { getDefaultAuthenticatedRoute } from "../../../untils/permission";
import ImageWithBasePath from "../../../core/img/imagewithbasebath";

const Signin = () => {
  const route = all_routes;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  const userList = useSelector((state) => state.userlist_data);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [emailError, setEmailError] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginAttempts, setLoginAttempts] = useState(0);
  const maxAttempts = 5;

  // Per-account attempt helpers (localStorage) with TTL
  const getAttemptKey = (id) => `login_attempts_${(id || "").trim().toLowerCase()}`;
  const getLockKey = (id) => `login_lock_${(id || "").trim().toLowerCase()}`;
  const ATTEMPT_TTL_MINUTES = 5;
  const getAttempts = (id) => {
    try {
      const key = getAttemptKey(id);
      const raw = localStorage.getItem(key);
      if (!raw) return 0;
      try {
        const obj = JSON.parse(raw);
        const count = Number(obj.count) || 0;
        const firstAt = Number(obj.firstAt) || Date.now();
        if (Date.now() - firstAt >= ATTEMPT_TTL_MINUTES * 60 * 1000) {
          localStorage.removeItem(key);
          return 0;
        }
        return count;
      } catch (e) {
        const n = parseInt(raw, 10);
        if (isNaN(n) || n <= 0) return 0;
        const obj = { count: n, firstAt: Date.now() };
        localStorage.setItem(key, JSON.stringify(obj));
        return n;
      }
    } catch (e) {
      return 0;
    }
  };
  const setAttemptsFor = (id, n) => {
    try {
      const key = getAttemptKey(id);
      const existing = localStorage.getItem(key);
      let firstAt = Date.now();
      if (existing) {
        try {
          const obj = JSON.parse(existing);
          if (obj && obj.firstAt) firstAt = Number(obj.firstAt) || firstAt;
        } catch (e) {}
      }
      localStorage.setItem(key, JSON.stringify({ count: n, firstAt }));
    } catch (e) {}
  };
  const resetAttempts = (id) => {
    try { localStorage.removeItem(getAttemptKey(id)); } catch (e) {}
  };

  // Lock helpers
  const setLockFor = (id, minutes) => {
    try {
      const expiry = Date.now() + (minutes || 5) * 60 * 1000;
      localStorage.setItem(getLockKey(id), String(expiry));
    } catch (e) {}
  };
  const getLockExpiry = (id) => {
    try {
      const v = localStorage.getItem(getLockKey(id));
      const n = parseInt(v, 10);
      return isNaN(n) ? null : n;
    } catch (e) { return null; }
  };
  const getLockRemainingMs = (id) => {
    const expiry = getLockExpiry(id);
    if (!expiry) return 0;
    const rem = expiry - Date.now();
    return rem > 0 ? rem : 0;
  };
  const clearLock = (id) => { try { localStorage.removeItem(getLockKey(id)); } catch (e) {} };
  const isLocked = (id) => {
    const expiry = getLockExpiry(id);
    if (!expiry) return false;
    if (Date.now() >= expiry) {
      try { clearLock(id); resetAttempts(id); } catch (e) {}
      return false;
    }
    return true;
  };
  const formatRemainingMs = (ms) => {
    const totalSec = Math.ceil(ms / 1000);
    const minutes = Math.floor(totalSec / 60);
    const seconds = totalSec % 60;
    return `${minutes} ${t(minutes === 1 ? 'login.minute' : 'login.minutes')} ${seconds} ${t(seconds === 1 ? 'login.second' : 'login.seconds')}`;
  };

  // Kiểm tra định dạng email khi nhập
  const validateEmail = (value) => {
    setEmail(value);
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(value)) {
      setEmailError("Email không hợp lệ. Vui lòng nhập đúng định dạng!");
    } else {
      setEmailError("");
    }
  };


  const handleLogin = (e) => {
    e.preventDefault();
    if (emailError) return;
    const id = (email || "").trim().toLowerCase();

    // Check local lock first
    if (isLocked(id)) {
      const remMs = getLockRemainingMs(id);
      setLoginError(`${t("login.accountLockedMessage")} (${t("login.remainingTime")} ${formatRemainingMs(remMs)})`);
      return;
    }

    const foundUser = userList.find(
      (user) => user.email === email && user.passwords === password
    );

    if (foundUser) {
      dispatch(setCurrentUser(foundUser));
      setLoginError("");
      resetAttempts(id);
      clearLock(id);
      navigate(getDefaultAuthenticatedRoute());
    } else {
      const current = getAttempts(id);
      const updated = current + 1;
      setAttemptsFor(id, updated);
      const remaining = Math.max(0, maxAttempts - current);
      if (current < maxAttempts) {
        // Show countdown from 5 to 1 using translation key
        setLoginError(t("login.incorrectWithCount", { count: remaining }));
      }
      if (updated > maxAttempts) {
        try { setLockFor(id, 5); } catch (e) {}
        const rem = getLockRemainingMs(id);
        setLoginError(`${t("login.accountLockedMessage")} (${t("login.remainingTime")} ${formatRemainingMs(rem)})`);
      }
      setLoginAttempts(updated);
    }
  };


  return (
    <div className="main-wrapper">
      <div className="account-content">
        <div className="login-wrapper bg-img">
          <div className="login-content">
            <form onSubmit={handleLogin}>
              <div className="login-userset">
                
                

                <div className="login-userheading text-center">
                  <h3>Sign In</h3>
                  <h4>
                    Access the Dreamspos panel using your email and passcode.
                  </h4>
                </div>

                {/* Email */}
                <div className="form-login mb-3">
                  <label className="form-label">Email Address</label>
                  <div className="form-addons">
                    <input
                      type="text"
                      className="form-control"
                      value={email}
                      onChange={(e) => validateEmail(e.target.value)}
                      placeholder="Enter your email"
                    />
                    <ImageWithBasePath
                      src="assets/img/icons/mail.svg"
                      alt="img"
                    />
                  </div>
                  {emailError && (
                    <span className="text-danger small">{emailError}</span>
                  )}
                </div>

                {/* Password */}
                <div className="form-login mb-3">
                  <label className="form-label">Password</label>
                  <div className="pass-group">
                    <input
                      type={showPassword ? "text" : "password"}
                      className="pass-input form-control"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                    />
                    <span
                      className={`fas toggle-password ${
                        showPassword ? "fa-eye" : "fa-eye-slash"
                      }`}
                      onClick={() => setShowPassword((prev) => !prev)}
                      style={{ cursor: "pointer" }}
                    />
                  </div>
                </div>

                {loginError && (
                  <div className="mb-3">
                    <span className="text-danger small">{loginError}</span>
                  </div>
                )}

                {/* Remember + Forgot */}
                <div className="form-login authentication-check">
                  <div className="row">
                    <div className="col-12 d-flex align-items-center justify-content-between">
                      <div className="custom-control custom-checkbox">
                        <label className="checkboxs ps-4 mb-0 pb-0 line-height-1">
                          <input type="checkbox" className="form-control" />
                          <span className="checkmarks" />
                          Remember me
                        </label>
                      </div>
                      <div className="text-end">
                        <Link className="forgot-link" to={route.forgotPassword}>
                          Forgot Password?
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Submit */}
                <div className="form-login">
                  <button type="submit" className="btn btn-login w-100">
                    Sign In
                  </button>
                </div>

                <div className="signinform">
                  <h4>
                    New on our platform?
                    <Link to={route.register} className="hover-a">
                      {" "}
                      Create an account
                    </Link>
                  </h4>
                </div>

                <div className="form-setlogin or-text">
                  <h4>OR</h4>
                </div>

                {/* Social login */}
                <div className="form-sociallink">
                  <ul className="d-flex">
                    <li>
                      <Link to="#" className="facebook-logo">
                        <ImageWithBasePath
                          src="assets/img/icons/facebook-logo.svg"
                          alt="Facebook"
                        />
                      </Link>
                    </li>
                    <li>
                      <Link to="#">
                        <ImageWithBasePath
                          src="assets/img/icons/google.png"
                          alt="Google"
                        />
                      </Link>
                    </li>
                    <li>
                      <Link to="#" className="apple-logo">
                        <ImageWithBasePath
                          src="assets/img/icons/apple-logo.svg"
                          alt="Apple"
                        />
                      </Link>
                    </li>
                  </ul>
                  <div className="my-4 d-flex justify-content-center align-items-center copyright-text">
                    <p>Copyright © 2023 DreamsPOS. All rights reserved</p>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signin;
