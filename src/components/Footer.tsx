import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Copyright and Link */}
          <div className="flex items-center gap-1 text-sm text-gray-600">
            <span>Copyright © </span>
            <Link
              href="https://davy.build"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-blue-600 hover:text-blue-800 transition-colors"
            >
              davy.build
            </Link>
          </div>

          {/* Mission Statement */}
          <div className="text-sm text-gray-500 italic">
            &quot;Making other people shine&quot;
          </div>

          {/* Twitter Link */}
          <div>
            <Link
              href="https://x.com/davybuild"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 transition-colors"
            >
              <svg
                className="w-4 h-4"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              Follow @davybuild
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}