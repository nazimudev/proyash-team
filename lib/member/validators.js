// Frontend validation only. The Laravel backend must re-validate everything.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MOBILE_RE = /^(?:\+?88)?01[3-9]\d{8}$/;
const BANGLA_RE = /[\u0980-\u09FF]/;

export const PASSWORD_MIN_LENGTH = 8;
export const PHOTO_MAX_BYTES = 2 * 1024 * 1024;
export const PHOTO_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export function validateProfile(v) {
  const e = {};
  const req = (key, label, value = v[key]) => {
    if (!String(value ?? '').trim()) e[key] = `${label} is required.`;
  };
  req('nameEn', 'English name');
  req('nameBn', 'Bangla name');
  if (!e.nameBn && !BANGLA_RE.test(v.nameBn)) e.nameBn = 'Write the name in Bangla letters.';
  req('fatherName', "Father's name");
  req('motherName', "Mother's name");
  req('dateOfBirth', 'Date of birth');
  if (!e.dateOfBirth && new Date(v.dateOfBirth) > new Date()) e.dateOfBirth = 'Date of birth cannot be in the future.';
  req('gender', 'Gender');
  req('nationality', 'Nationality');
  req('mobile', 'Mobile number');
  if (!e.mobile && !MOBILE_RE.test(v.mobile.replace(/[\s-]/g, ''))) e.mobile = 'Enter a valid Bangladeshi mobile number, e.g. 01712345678.';
  ['permanent', 'present'].forEach((group) => {
    [['village', 'Village'], ['postOffice', 'Post office'], ['upazila', 'Upazila'], ['district', 'District']].forEach(([k, label]) => {
      req(`${group}.${k}`, label, v[group]?.[k]);
    });
  });
  return e;
}

export function validatePhoto(file) {
  if (!file) return null;
  if (!PHOTO_TYPES.includes(file.type)) return 'Choose a JPG, PNG or WebP image.';
  if (file.size > PHOTO_MAX_BYTES) return 'The photo must be smaller than 2 MB.';
  return null;
}

export function validateEmailChange(v, currentEmail) {
  const e = {};
  const next = v.newEmail.trim().toLowerCase();
  if (!next) e.newEmail = 'Enter your new email address.';
  else if (!EMAIL_RE.test(next)) e.newEmail = 'Enter a valid email address.';
  else if (next === (currentEmail || '').toLowerCase()) e.newEmail = 'This is already your current email.';
  if (!v.confirmEmail.trim()) e.confirmEmail = 'Confirm your new email address.';
  else if (v.confirmEmail.trim().toLowerCase() !== next) e.confirmEmail = 'The email addresses do not match.';
  if (!v.currentPassword) e.currentPassword = 'Enter your current password to confirm.';
  return e;
}

export function validatePasswordChange(v) {
  const e = {};
  if (!v.currentPassword) e.currentPassword = 'Enter your current password.';
  if (!v.newPassword) e.newPassword = 'Enter a new password.';
  else if (v.newPassword.length < PASSWORD_MIN_LENGTH) e.newPassword = `Use at least ${PASSWORD_MIN_LENGTH} characters.`;
  else if (v.newPassword === v.currentPassword) e.newPassword = 'The new password must be different from the current one.';
  if (!v.confirmPassword) e.confirmPassword = 'Confirm your new password.';
  else if (v.confirmPassword !== v.newPassword) e.confirmPassword = 'The passwords do not match.';
  return e;
}

export function passwordChecks(pw = '') {
  return [
    { id: 'len', label: `At least ${PASSWORD_MIN_LENGTH} characters`, ok: pw.length >= PASSWORD_MIN_LENGTH },
    { id: 'case', label: 'Upper and lower case letters', ok: /[a-z]/.test(pw) && /[A-Z]/.test(pw) },
    { id: 'num', label: 'A number', ok: /\d/.test(pw) },
    { id: 'sym', label: 'A symbol (e.g. ! @ #)', ok: /[^A-Za-z0-9]/.test(pw) },
  ];
}

export function passwordStrength(pw = '') {
  if (!pw) return { score: 0, label: '' };
  const passed = passwordChecks(pw).filter((c) => c.ok).length;
  const score = pw.length < PASSWORD_MIN_LENGTH ? Math.min(passed, 1) : passed;
  return { score, label: ['Too weak', 'Weak', 'Fair', 'Good', 'Strong'][score] };
}
