'use client';

export default function ConfigError() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
          <svg
            className="w-6 h-6 text-red-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-4">
          Configuration Required
        </h2>
        <p className="text-gray-600 mb-6 text-center">
          Supabase credentials are not configured. Please set up your environment variables.
        </p>
        <div className="bg-gray-50 rounded-md p-4 mb-6">
          <p className="text-sm font-mono text-gray-800 mb-2">Create a <code className="bg-gray-200 px-1 rounded">.env.local</code> file with:</p>
          <pre className="text-xs text-gray-700 whitespace-pre-wrap break-words">
{`NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
ADMIN_PASSWORD=your_password`}
          </pre>
        </div>
        <div className="text-sm text-gray-600 space-y-2">
          <p className="font-semibold">To get your Supabase credentials:</p>
          <ol className="list-decimal list-inside space-y-1 ml-2">
            <li>Go to <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">supabase.com</a> and create a free account</li>
            <li>Create a new project</li>
            <li>Run the SQL schema from <code className="bg-gray-200 px-1 rounded">supabase-schema.sql</code></li>
            <li>Go to Settings → API and copy your credentials</li>
          </ol>
        </div>
        <p className="text-xs text-gray-500 mt-4 text-center">
          See <code className="bg-gray-200 px-1 rounded">README.md</code> for detailed instructions
        </p>
      </div>
    </div>
  );
}
