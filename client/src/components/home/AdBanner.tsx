export default function AdBanner() {
  return (
    <div className="py-4 bg-gray-100">
      <div className="container mx-auto px-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4 flex justify-center items-center">
          <div className="text-center" data-mock="true">
            <div className="text-gray-400 text-xs uppercase tracking-wider mb-2">Advertisement</div>
            <div className="bg-gray-200 w-full h-16 sm:h-20 md:h-24 flex items-center justify-center rounded">
              <span className="text-gray-500">728x90 Banner Ad</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
