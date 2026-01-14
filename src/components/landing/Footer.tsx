export default function Footer() {
  return (
    <footer className="border-t border-white/10 py-12 pt-20 px-4 max-w-7xl mx-auto">
      <div className="grid md:grid-cols-4 gap-12 mb-12">
        <div className="md:col-span-2">
          <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-600 bg-clip-text text-transparent">
            SuperCluster
          </h3>
          <p className="text-slate-400 leading-relaxed max-w-md">
            The liquid stablecoin savings protocol enabling productive and
            flexible DeFi participation for everyone.
          </p>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-4">Product</h4>
          <ul className="space-y-3 text-slate-400">
            <li className="hover:text-blue-400 cursor-pointer transition-colors">
              App
            </li>
            <li className="hover:text-blue-400 cursor-pointer transition-colors">
              Docs
            </li>
            <li className="hover:text-blue-400 cursor-pointer transition-colors">
              Security
            </li>
            <li className="hover:text-blue-400 cursor-pointer transition-colors">
              Audits
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-4">Community</h4>
          <ul className="space-y-3 text-slate-400">
            <li className="hover:text-blue-400 cursor-pointer transition-colors">
              Twitter
            </li>
            <li className="hover:text-blue-400 cursor-pointer transition-colors">
              Discord
            </li>
            <li className="hover:text-blue-400 cursor-pointer transition-colors">
              GitHub
            </li>
            <li className="hover:text-blue-400 cursor-pointer transition-colors">
              Blog
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 pt-8 text-center text-slate-400">
        © 2025 SuperCluster Protocol. All rights reserved.
      </div>
    </footer>
  );
}
