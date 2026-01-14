import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full h-32 text-slate-300">
      <div className="mx-auto max-w-11/12 h-24 border-t border-slate-700 flex items-center justify-between gap-6 px-4 py-16 md:px-8">
        <div className="flex flex-wrap items-center gap-4 md:gap-12">
          <div className="flex items-center gap-4">
            <Image src="/logo1.png" alt="SuperCluster" width={32} height={32} />
            <span className="text-lg tracking-wide">
              S U P E R C L U S T E R
            </span>
          </div>

          <div className="flex items-center gap-3 text-lg text-slate-500">
            <Link href="/terms" className="transition-colors hover:text-white">
              Terms of Use
            </Link>
            <span className="h-4 w-px bg-slate-700" aria-hidden />
            <Link
              href="/privacy"
              className="transition-colors hover:text-white"
            >
              Privacy Notice
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-3 text-md text-slate-400">
          <span className="text-slate-400 shadow-sm">V 0.1.0</span>
        </div>
      </div>
    </footer>
  );
}
