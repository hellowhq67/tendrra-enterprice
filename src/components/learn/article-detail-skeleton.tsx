export function ArticleDetailSkeleton() {
    return (
      <section className="pt-24 pb-12 relative z-10">
        <div className="container mx-auto px-4">
          <div className="mb-6">
            <div className="h-6 w-32 bg-gray-800 rounded animate-pulse"></div>
          </div>
  
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-8 w-24 bg-gray-800 rounded-full animate-pulse"></div>
              <div className="h-8 w-20 bg-gray-800 rounded-full animate-pulse"></div>
              <div className="h-8 w-16 bg-gray-800 rounded-full animate-pulse"></div>
            </div>
  
            <div className="h-12 w-3/4 bg-gray-800 rounded animate-pulse mb-4"></div>
            <div className="h-6 w-2/3 bg-gray-800 rounded animate-pulse mb-6"></div>
  
            <div className="flex flex-col md:flex-row md:items-center gap-6 mb-8">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 bg-gray-800 rounded-full animate-pulse"></div>
                <div>
                  <div className="h-5 w-32 bg-gray-800 rounded animate-pulse mb-2"></div>
                  <div className="h-4 w-24 bg-gray-800 rounded animate-pulse"></div>
                </div>
              </div>
  
              <div className="flex flex-wrap gap-4">
                <div className="h-5 w-32 bg-gray-800 rounded animate-pulse"></div>
                <div className="h-5 w-24 bg-gray-800 rounded animate-pulse"></div>
                <div className="h-5 w-28 bg-gray-800 rounded animate-pulse"></div>
              </div>
            </div>
          </div>
  
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            <div className="lg:col-span-2">
              <div className="aspect-video bg-gray-800 rounded animate-pulse mb-8"></div>
  
              <div className="space-y-4">
                {[...Array(10)].map((_, i) => (
                  <div key={i} className="h-4 bg-gray-800 rounded animate-pulse"></div>
                ))}
              </div>
            </div>
  
            <div className="lg:col-span-1">
              <div className="bg-gray-800 rounded-xl p-6 animate-pulse mb-6">
                <div className="h-6 w-32 bg-gray-700 rounded mb-4"></div>
                <div className="space-y-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="flex gap-3">
                      <div className="h-6 w-6 bg-gray-700 rounded-full"></div>
                      <div className="flex-1">
                        <div className="h-4 w-full bg-gray-700 rounded mb-2"></div>
                        <div className="h-3 w-20 bg-gray-700 rounded"></div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="h-10 w-full bg-gray-700 rounded mt-6"></div>
              </div>
  
              <div className="bg-gray-800 rounded-xl p-6 animate-pulse">
                <div className="h-6 w-32 bg-gray-700 rounded mb-4"></div>
                <div className="flex items-center gap-4 mb-4">
                  <div className="h-16 w-16 bg-gray-700 rounded-full"></div>
                  <div>
                    <div className="h-5 w-32 bg-gray-700 rounded mb-2"></div>
                    <div className="h-4 w-24 bg-gray-700 rounded"></div>
                  </div>
                </div>
                <div className="h-4 w-full bg-gray-700 rounded mb-2"></div>
                <div className="h-4 w-full bg-gray-700 rounded mb-2"></div>
                <div className="h-4 w-2/3 bg-gray-700 rounded mb-4"></div>
                <div className="h-10 w-full bg-gray-700 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  }
  
  