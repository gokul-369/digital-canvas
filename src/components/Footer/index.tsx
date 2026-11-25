import { memo } from "react";
import { FaDev, FaGithub, FaLinkedin } from "react-icons/fa";
import { MdOutlineMailOutline } from "react-icons/md";
import avatar from "../../assets/profile.webp";
import { HashLink } from "react-router-hash-link";
import { manifest } from "../../routes/manifest";
import { scrollWithLenis } from "../../utils/scroll";

function Footer() {
  return (
    <footer className="relative w-full text-slate-800 dark:text-white overflow-hidden bg-transparent pt-16 pb-12">
      {/* Seamless Soft Atmospheric Gradient Blend */}
      <div
        className="absolute inset-0 -z-10 pointer-events-none bg-gradient-to-b from-transparent via-slate-100/30 to-slate-200/40 dark:via-black/40 dark:to-black/80"
      />

      {/* Radiant Top Luminous Accent Border */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-indigo-500/40 dark:via-indigo-400/30 to-transparent" />

      <div className="mx-auto max-w-6xl px-5 sm:px-8 md:px-6">
        {/* Main Grid */}
        <div className="grid gap-10 sm:gap-12 md:grid-cols-4">
          {/* Profile */}
          <div className="md:col-span-2 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-5">
              <div className="relative h-20 w-20 rounded-2xl overflow-hidden border border-slate-200/80 dark:border-white/10 shadow-lg">
                <img
                  src={avatar}
                  alt="Gokul"
                  className="h-full w-full object-cover grayscale hover:grayscale-0 transition-all duration-300"
                />
              </div>

              <div>
                <h3 className="font-space text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                  Gokul Rao
                </h3>
                <p className="mt-1 font-caveat text-xl text-indigo-600 dark:text-indigo-400">
                  "Engineering interfaces that breathe."
                </p>
                <p className="mt-1 text-xs text-slate-600 dark:text-slate-400 max-w-sm leading-relaxed">
                  Building thoughtful digital experiences with clean code, motion, and architectural resilience.
                </p>
              </div>
            </div>

            <p className="flex items-center gap-2.5 text-xs font-mono text-slate-600 dark:text-slate-400">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
              </span>
              Available for fullstack & design engineering opportunities
            </p>
          </div>

          {/* Links */}
          <div className="flex gap-12 md:col-span-1">
            <div className="space-y-3">
              <h4 className="font-mono text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Explore
              </h4>
              <div className="flex flex-col gap-2.5 text-xs font-medium text-slate-600 dark:text-slate-400">
                <HashLink to={manifest.home} scroll={scrollWithLenis} className="hover:text-indigo-600 dark:hover:text-white transition-colors">Home</HashLink>
                <HashLink to={manifest.about} scroll={scrollWithLenis} className="hover:text-indigo-600 dark:hover:text-white transition-colors">About</HashLink>
                <HashLink to={manifest.experience} scroll={scrollWithLenis} className="hover:text-indigo-600 dark:hover:text-white transition-colors">Experience</HashLink>
                <HashLink to={manifest.skills} scroll={scrollWithLenis} className="hover:text-indigo-600 dark:hover:text-white transition-colors">Skills</HashLink>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-mono text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Canvas
              </h4>
              <div className="flex flex-col gap-2.5 text-xs font-medium text-slate-600 dark:text-slate-400">
                <HashLink to={manifest.gallery} scroll={scrollWithLenis} className="hover:text-indigo-600 dark:hover:text-white transition-colors">Gallery</HashLink>
                <HashLink to={manifest.awards} scroll={scrollWithLenis} className="hover:text-indigo-600 dark:hover:text-white transition-colors">Awards</HashLink>
                <HashLink to={manifest.testimonials} scroll={scrollWithLenis} className="hover:text-indigo-600 dark:hover:text-white transition-colors">Testimonials</HashLink>
                <HashLink to={manifest.rolemodels} scroll={scrollWithLenis} className="hover:text-indigo-600 dark:hover:text-white transition-colors">Inspirations</HashLink>
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div className="space-y-3">
            <h4 className="font-mono text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Connect
            </h4>
            <div className="flex flex-col gap-2.5 text-xs font-medium text-slate-600 dark:text-slate-400">
              <a
                href="https://github.com/gokul-369"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 hover:text-indigo-600 dark:hover:text-white transition-colors"
              >
                <FaGithub size={14} />
                <span>GitHub</span>
              </a>
              <a
                href="https://www.linkedin.com/in/gokulrao369"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 hover:text-indigo-600 dark:hover:text-white transition-colors"
              >
                <FaLinkedin size={14} />
                <span>LinkedIn</span>
              </a>
              <a
                href="https://dev.to/gokul369"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 hover:text-indigo-600 dark:hover:text-white transition-colors"
              >
                <FaDev size={14} />
                <span>Dev.to</span>
              </a>
              <a
                href="mailto:gokul369@outlook.com"
                className="inline-flex items-center gap-2 hover:text-indigo-600 dark:hover:text-white transition-colors"
              >
                <MdOutlineMailOutline size={15} />
                <span>Email</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Legal / Timestamp */}
        <div className="mt-12 pt-6 border-t border-slate-200/80 dark:border-white/5 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 font-mono gap-3">
          <p>© {new Date().getFullYear()} Gokul Rao. Designed & engineered with craft.</p>
          <p className="flex items-center gap-1.5">
            <span>Built with React · Three.js · Tailwind</span>
          </p>
        </div>
      </div>
    </footer>
  );
}

export default memo(Footer);
