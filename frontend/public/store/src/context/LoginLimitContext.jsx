import { createContext, useContext, useCallback } from "react";

export const LoginLimitContext = createContext();

export const LoginLimitProvider = ({ children }) => {
  const MAX_LOGIN_ATTEMPTS = 8;

  const LOCKOUT_DURATIONS = {
    FIRST: 15 * 60 * 1000,
    SECOND: 60 * 60 * 1000,
    THIRD: 5 * 60 * 60 * 1000,
  };

  const getLoginAttempts = (email) => {
    const attempts = localStorage.getItem(`loginAttempts_${email}`);
    return attempts
      ? JSON.parse(attempts)
      : { count: 0, lastAttempt: null, lockedUntil: null, lockoutLevel: 0 };
  };

  const setLoginAttempts = (email, attempts) => {
    localStorage.setItem(`loginAttempts_${email}`, JSON.stringify(attempts));
  };

  const clearLoginAttempts = (email) => {
    localStorage.removeItem(`loginAttempts_${email}`);
  };

  const resetLockoutLevel = (email) => {
    setLoginAttempts(email, { count: 0, lastAttempt: null, lockedUntil: null, lockoutLevel: 0 });
  };

  const getLockoutDuration = (lockoutLevel) => {
    switch (lockoutLevel) {
      case 1: return LOCKOUT_DURATIONS.FIRST;
      case 2: return LOCKOUT_DURATIONS.SECOND;
      case 3: return LOCKOUT_DURATIONS.THIRD;
      default: return LOCKOUT_DURATIONS.FIRST;
    }
  };

  const getNextLockoutLevel = (currentLevel) => {
    return currentLevel < 3 ? currentLevel + 1 : 1;
  };

  const isAccountLocked = (email) => {
    const attempts = getLoginAttempts(email);
    if (!attempts.lockedUntil) return false;
    const now = new Date().getTime();
    if (now > attempts.lockedUntil) {
      setLoginAttempts(email, { count: 0, lastAttempt: null, lockedUntil: null, lockoutLevel: attempts.lockoutLevel });
      return false;
    }
    return true;
  };

  const getRemainingLockoutTime = (email) => {
    const attempts = getLoginAttempts(email);
    if (!attempts.lockedUntil) return 0;
    const remaining = attempts.lockedUntil - new Date().getTime();
    return remaining > 0 ? remaining : 0;
  };

  const formatLockoutTime = (milliseconds) => {
    const hours = Math.floor(milliseconds / (1000 * 60 * 60));
    const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
    if (hours > 0) return `${hours} hora${hours > 1 ? "s" : ""} y ${minutes} minuto${minutes > 1 ? "s" : ""}`;
    return `${minutes} minuto${minutes > 1 ? "s" : ""}`;
  };

  const getAccountLockInfo = useCallback((email) => {
    if (!email) return null;
    const isLocked = isAccountLocked(email);
    const remainingTime = getRemainingLockoutTime(email);
    const attempts = getLoginAttempts(email);
    return {
      isLocked,
      remainingTime,
      formattedTime: remainingTime > 0 ? formatLockoutTime(remainingTime) : null,
      attemptCount: attempts.count,
      remainingAttempts: Math.max(0, MAX_LOGIN_ATTEMPTS - attempts.count),
      lockoutLevel: attempts.lockoutLevel || 0,
    };
  }, []);

  const recordFailedAttempt = (email) => {
    const attempts = getLoginAttempts(email);
    const newCount = attempts.count + 1;
    const now = new Date().getTime();

    let newAttempts = { count: newCount, lastAttempt: now, lockedUntil: null, lockoutLevel: attempts.lockoutLevel || 0 };

    if (newCount >= MAX_LOGIN_ATTEMPTS) {
      const nextLockoutLevel = getNextLockoutLevel(attempts.lockoutLevel || 0);
      const lockoutDuration = getLockoutDuration(nextLockoutLevel);
      newAttempts = { count: 0, lastAttempt: now, lockedUntil: now + lockoutDuration, lockoutLevel: nextLockoutLevel };
      setLoginAttempts(email, newAttempts);

      const messages = { 1: "bloqueada por 15 minutos", 2: "bloqueada por 1 hora", 3: "bloqueada por 5 horas" };
      return { success: false, message: `Demasiados intentos fallidos. Cuenta ${messages[nextLockoutLevel]}.`, isLocked: true, remainingTime: lockoutDuration, lockoutLevel: nextLockoutLevel };
    }

    setLoginAttempts(email, newAttempts);
    const remainingAttempts = MAX_LOGIN_ATTEMPTS - newCount;
    return { success: false, remainingAttempts, message: `Te quedan ${remainingAttempts} intento${remainingAttempts > 1 ? "s" : ""}.` };
  };

  const checkAccountLock = (email) => {
    if (isAccountLocked(email)) {
      const remainingTime = getRemainingLockoutTime(email);
      const attempts = getLoginAttempts(email);
      return { success: false, message: `Cuenta bloqueada. Intenta en ${formatLockoutTime(remainingTime)}.`, isLocked: true, remainingTime, lockoutLevel: attempts.lockoutLevel || 0 };
    }
    return { success: true };
  };

  return (
    <LoginLimitContext.Provider value={{ recordFailedAttempt, checkAccountLock, clearLoginAttempts, resetLockoutLevel, isAccountLocked, getRemainingLockoutTime, getAccountLockInfo, formatLockoutTime, MAX_LOGIN_ATTEMPTS, LOCKOUT_DURATIONS, getLoginAttempts, setLoginAttempts }}>
      {children}
    </LoginLimitContext.Provider>
  );
};

export const useLoginLimit = () => {
  const context = useContext(LoginLimitContext);
  if (!context) throw new Error("useLoginLimit debe usarse dentro de LoginLimitProvider");
  return context;
};