export function TemplateDetailSkeleton() {
  return (
    <section className="pt-24 pb-12 relative z-10">
      <div className="container mx-auto px-4">
        <div className="mb-6">
          <div className="h-6 w-32 bg-gray-800 rounded animate-pulse"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <div className="relative rounded-xl overflow-hidden mb-6 bg-gray-900/50 border border-gray-800">
              <div className="aspect-video bg-gray-800 animate-pulse"></div>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {[...Array(4)].map((_, index) => (
                <div key={index} className="rounded-lg overflow-hidden bg-gray-800 aspect-video animate-pulse"></div>
              ))}
            </div>
          </div>

          <div>
            <div className="mb-6">
              <div className="h-4 w-24 bg-gray-800 rounded animate-pulse mb-2"></div>
              <div className="h-10 w-3/4 bg-gray-800 rounded animate-pulse mb-4"></div>

              <div className="flex items-center gap-4 mb-6">
                <div className="h-5 w-32 bg-gray-800 rounded animate-pulse"></div>
                <div className="h-5 w-24 bg-gray-800 rounded animate-pulse"></div>
              </div>

              <div className="mb-8">
                <div className="h-4 w-full bg-gray-800 rounded animate-pulse mb-2"></div>
                <div className="h-4 w-full bg-gray-800 rounded animate-pulse mb-2"></div>
                <div className="h-4 w-3/4 bg-gray-800 rounded animate-pulse mb-4"></div>

                <div className="h-4 w-full bg-gray-800 rounded animate-pulse mb-2"></div>
                <div className="h-4 w-full bg-gray-800 rounded animate-pulse mb-2"></div>
                <div className="h-4 w-full bg-gray-800 rounded animate-pulse mb-2"></div>
                <div className="h-4 w-2/3 bg-gray-800 rounded animate-pulse"></div>
              </div>

              <div className="mb-8">
                <div className="h-6 w-32 bg-gray-800 rounded animate-pulse mb-4"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[...Array(8)].map((_, index) => (
                    <div key={index} className="flex items-start">
                      <div className="h-5 w-5 rounded-full bg-gray-800 flex-shrink-0 mt-0.5 mr-2"></div>
                      <div className="h-5 w-full bg-gray-800 rounded animate-pulse"></div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 h-14 bg-gray-800 rounded animate-pulse"></div>
                <div className="flex-1 h-14 bg-gray-800 rounded animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

