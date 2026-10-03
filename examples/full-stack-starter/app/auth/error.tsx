export default function AuthError({ error, reset }: { readonly error: Error; readonly reset: () => void }) {
  return <main role="alert" className="activity-status activity-error"><div><h1>Discord connection failed</h1><p>{error.message}</p><button type="button" onClick={reset}>Try again</button></div></main>;
}
