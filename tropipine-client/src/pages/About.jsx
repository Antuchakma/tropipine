export default function About() {
  return (
    <div className="min-h-screen bg-[#F6F1E8] text-[#1E1E1E]">
      
      {/* ================= HERO ================= */}
      <section className="border-b border-[#E7DBCF] bg-white/60 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <p className="text-[#8B5E3C] tracking-[0.25em] uppercase text-sm mb-4">
            About TropiPine
          </p>

          <h1 className="text-5xl md:text-6xl font-black mb-4">
            Fresh Fruits, <span className="text-[#8B5E3C]">Pure Care</span>
          </h1>

          <p className="text-[#5A5149] max-w-2xl text-lg leading-relaxed">
            We connect farms to homes with a focus on freshness, simplicity,
            and honest quality.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-20 space-y-24">

        {/* ================= OUR STORY ================= */}
        <section className="grid md:grid-cols-2 gap-14 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-5">Our Story</h2>

            <p className="text-[#5A5149] leading-relaxed mb-4">
              TropiPine started with a simple idea — deliver fresh tropical fruits
              directly from farmers to customers without unnecessary complexity or loss of quality.
            </p>

            <p className="text-[#5A5149] leading-relaxed">
              Built in 2023, we now work with local farmers across Bangladesh to
              ensure better pricing for growers and fresher fruits for families.
            </p>
          </div>

          <div className="bg-white border border-[#E7DBCF] rounded-3xl p-10 text-center shadow-sm">
            <div className="text-6xl mb-4">🌾</div>
            <h3 className="font-semibold text-[#8B5E3C]">
              Farm to Table
            </h3>
            <p className="text-[#6A625B] text-sm mt-2">
              Direct sourcing, no middle layers
            </p>
          </div>
        </section>

        {/* ================= MISSION / VISION ================= */}
        <section className="grid md:grid-cols-2 gap-8">
          
          <div className="bg-white border border-[#E7DBCF] rounded-3xl p-8">
            <h3 className="text-2xl font-bold mb-4 text-[#1E1E1E]">
              Our Mission
            </h3>

            <p className="text-[#5A5149] mb-6 leading-relaxed">
              Make fresh tropical fruits accessible through a fair and simple supply chain.
            </p>

            <ul className="space-y-2 text-[#5A5149] text-sm">
              <li>✓ Premium quality fruits</li>
              <li>✓ Fair support for farmers</li>
              <li>✓ Sustainable sourcing</li>
            </ul>
          </div>

          <div className="bg-white border border-[#E7DBCF] rounded-3xl p-8">
            <h3 className="text-2xl font-bold mb-4 text-[#1E1E1E]">
              Our Vision
            </h3>

            <p className="text-[#5A5149] mb-6 leading-relaxed">
              To become a trusted tropical fruit brand in South Asia built on simplicity and quality.
            </p>

            <ul className="space-y-2 text-[#5A5149] text-sm">
              <li>✓ Expand regional reach</li>
              <li>✓ Support 10,000+ farmers</li>
              <li>✓ Eco-friendly operations</li>
            </ul>
          </div>
        </section>

        {/* ================= WHY CHOOSE US ================= */}
        <section>
          <h2 className="text-3xl font-bold mb-10 text-center">
            Why Choose Us
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: '', title: 'Quality First', desc: 'Carefully selected fresh fruits' },
              { icon: '', title: 'Fast Delivery', desc: 'Quick and reliable shipping' },
              { icon: '', title: 'Farm Direct', desc: 'Sourced directly from farmers' },
              { icon: '', title: 'Fair Pricing', desc: 'No unnecessary markups' },
              { icon: '', title: 'Secure Payment', desc: 'Safe checkout system' },
              { icon: '', title: 'Support', desc: 'Simple and responsive help' },
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-white border border-[#E7DBCF] rounded-3xl p-6 text-center hover:shadow-md transition"
              >
                <div className="text-4xl mb-3">{item.icon}</div>
                <h3 className="font-semibold mb-1">{item.title}</h3>
                <p className="text-sm text-[#6A625B]">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ================= FRUITS ================= */}
        <section className="bg-white border border-[#E7DBCF] rounded-3xl p-10">
          <h2 className="text-2xl font-bold mb-8">
            Our Specialty Fruits
          </h2>

          <div className="grid md:grid-cols-4 gap-6 text-center">
            {[
              { name: 'Haribhanga Mango', emoji: '🥭' },
              { name: 'Gopalbhog Mango', emoji: '🥭' },
              { name: 'Pineapple', emoji: '🍍' },
              { name: 'Seasonal Fruits', emoji: '🍊' },
            ].map((f, i) => (
              <div
                key={i}
                className="bg-[#F6F1E8] border border-[#E7DBCF] rounded-2xl p-6"
              >
                <div className="text-4xl mb-3">{f.emoji}</div>
                <p className="font-medium">{f.name}</p>
                <p className="text-xs text-[#6A625B] mt-1">
                  Fresh & premium
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ================= CONTACT ================= */}
        <section className="bg-[#1F1F1F] text-white rounded-3xl p-12 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Get in Touch
          </h2>

          <div className="grid md:grid-cols-3 gap-6 mb-10 text-sm text-gray-300">
            <div>
              <p className="text-white font-medium">Email</p>
              info@tropipine.com
            </div>

            <div>
              <p className="text-white font-medium">Phone</p>
              +880 1234-567890
            </div>

            <div>
              <p className="text-white font-medium">Location</p>
              Dhaka, Bangladesh
            </div>
          </div>

          <button className="bg-[#8B5E3C] hover:bg-[#7A4F33] text-white px-8 py-3 rounded-2xl font-medium transition">
            Contact Us
          </button>
        </section>

        {/* ================= STATS ================= */}
        <section className="grid md:grid-cols-4 gap-6 text-center">
          {[
            { number: '50K+', label: 'Customers' },
            { number: '500+', label: 'Farmers' },
            { number: '100K+', label: 'Orders' },
            { number: '4.9★', label: 'Rating' },
          ].map((s, i) => (
            <div
              key={i}
              className="bg-white border border-[#E7DBCF] rounded-3xl p-6"
            >
              <p className="text-3xl font-bold text-[#8B5E3C]">
                {s.number}
              </p>
              <p className="text-sm text-[#6A625B] mt-1">
                {s.label}
              </p>
            </div>
          ))}
        </section>

      </div>
    </div>
  )
}