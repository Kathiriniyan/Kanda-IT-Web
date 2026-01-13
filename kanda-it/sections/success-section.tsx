import { successMetrics } from "@/data/success-metrics";

export default function SuccessSection() {
  return (
    <section
      id="success"
      className="bg-white px-4 md:px-16 lg:px-24 xl:px-32 py-24"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-4xl md:text-5xl font-semibold text-black">
            Success In Numbers
          </h2>
          <p className="mt-4 text-base md:text-lg text-gray-600">
            High-performance solutions engineered for your business growth.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {successMetrics.map((item, index) => {
            const Icon = item.icon;

            return (
              <div
                key={index}
                className=" border border-gray-200 bg-white p-8 "
              >
                {/* Icon */}
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl border border-[#FF5F15]">
                  <Icon className="h-5 w-5 text-[#FF5F15]" />
                </div>

                {/* Title */}
                <h3 className="text-xl font-semibold text-black">
                  {item.title}
                </h3>

                {/* Description */}
                <p className="mt-3 text-sm leading-relaxed text-gray-600">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
