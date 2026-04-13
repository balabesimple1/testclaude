import Link from 'next/link';

export default function HeroBanner() {
  return (
    <div className="relative bg-gradient-to-r from-green-700 to-green-500 overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <pattern id="grain" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
              <circle cx="25" cy="25" r="20" fill="white" opacity="0.1" />
              <circle cx="75" cy="75" r="15" fill="white" opacity="0.08" />
              <circle cx="60" cy="20" r="10" fill="white" opacity="0.06" />
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#grain)" />
        </svg>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 relative">
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-4 leading-tight">
            Fresh Groceries,<br />
            <span className="text-green-200">Delivered Fast</span>
          </h1>
          <p className="text-lg md:text-xl text-green-100 mb-8 leading-relaxed">
            Shop from thousands of fresh products. From farm to your table in hours. 
            Get free delivery on orders over $50.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/products"
              className="inline-flex items-center justify-center px-8 py-3 bg-white text-green-700 font-bold rounded-lg hover:bg-green-50 transition-colors text-lg"
            >
              Shop Now
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <Link
              href="/auth/signup"
              className="inline-flex items-center justify-center px-8 py-3 border-2 border-white text-white font-bold rounded-lg hover:bg-white/10 transition-colors text-lg"
            >
              Create Account
            </Link>
          </div>
          <div className="mt-8 flex items-center space-x-6 text-green-100 text-sm">
            <div className="flex items-center space-x-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Free delivery over $50</span>
            </div>
            <div className="flex items-center space-x-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Fresh guarantee</span>
            </div>
            <div className="hidden sm:flex items-center space-x-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Same-day delivery</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
