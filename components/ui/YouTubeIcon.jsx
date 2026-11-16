export default function YouTubeIcon({ size = 20, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M23.498 6.186a2.994 2.994 0 0 0-2.107-2.12C19.532 3.55 12 3.55 12 3.55s-7.532 0-9.391.516A2.994 2.994 0 0 0 .502 6.186C0 8.057 0 12 0 12s0 3.943.502 5.814a2.994 2.994 0 0 0 2.107 2.12C4.468 20.45 12 20.45 12 20.45s7.532 0 9.391-.516a2.994 2.994 0 0 0 2.107-2.12C24 15.943 24 12 24 12s0-3.943-.502-5.814ZM9.545 15.568V8.432L15.818 12l-6.273 3.568Z" />
    </svg>
  );
}
