import { FaDev, FaGithub, FaInstagram, FaLinkedin } from "react-icons/fa";
import { MdOutlineMailOutline } from "react-icons/md";
import avatar from "../../assets/profile.png";
import { HashLink } from "react-router-hash-link";

function Footer() {
  return (
    <footer className="relative w-full text-white">
      {/* Top Gradient Divider */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      {/* fade */}
      <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-black/40 to-transparent pointer-events-none" />
      <div className="mx-auto max-w-6xl px-8 md:px-6  py-16">
        {/* Main Grid */}
        <div className="grid gap-12 md:grid-cols-4">
          {/* Profile Section */}
          <div className="md:col-span-2 space-y-6">
            <div className="flex items-center gap-5">
              <img
                src={avatar}
                alt="Gokul"
                className="h-20 w-20 rounded-xl object-cover grayscale bg-white/10"
              />

              <div>
                <h3 className="text-2xl font-mono font-semibold tracking-tight">
                  Gokul
                </h3>
                <p className="mt-2 text-sm text-white/60 max-w-sm leading-relaxed">
                  Building thoughtful digital experiences with clean code and
                  modern design.
                </p>
              </div>
            </div>

            <p className="flex items-center gap-2 text-sm text-white/60">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400"></span>
              </span>
              Available for freelance work
            </p>
          </div>

          {/* Links */}
          <div className="flex gap-12 md:col-span-1">
            <div className="space-y-3">
              <h4 className="text-sm font-semibold uppercase tracking-wider text-white/80">
                Know Me
              </h4>
              <div className="flex flex-col gap-2 text-sm text-white/60">
                <HashLink to="/">Home</HashLink>
                <HashLink to="/about">About</HashLink>
                <HashLink to="/experience">Experience</HashLink>
                <HashLink to="/skills">Skills</HashLink>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-sm font-semibold uppercase tracking-wider text-white/80">
                Canvas
              </h4>
              <div className="flex flex-col gap-2 text-sm text-white/60">
                <HashLink to="/gallery">Gallery</HashLink>
                <HashLink to="/awards">Awards</HashLink>
                <HashLink to="/testimonials">Testimonials</HashLink>
                <HashLink to="/inspirations">Inspirations</HashLink>
              </div>
            </div>
          </div>

          {/* Social */}
          <div className="space-y-6">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white/80">
              Social
            </h4>

            <div className="flex gap-5 text-white/70">
              <a
                href="https://linkedin.com/in/gokul-c-40773a1b6"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors duration-300 hover:-translate-y-0.5 transform"
              >
                <FaLinkedin size={18} />
              </a>
              <a
                href="https://github.com/gokul-369"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors duration-300 hover:-translate-y-0.5 transform"
              >
                <FaGithub size={18} />
              </a>
              <a
                href="mailto:gokul369@outlook.com"
                className="hover:text-white transition-colors duration-300 hover:-translate-y-0.5 transform"
              >
                <MdOutlineMailOutline size={18} />
              </a>
              <a
                href="https://www.instagram.com/gokul__369/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors duration-300 hover:-translate-y-0.5 transform"
              >
                <FaInstagram size={18} />
              </a>
            </div>

            <div className="text-sm flex flex-col gap-4 text-white/60">
              Latest Dev article
              <a
                href="https://dev.to/gokul369"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/70 hover:text-white transition"
              >
                <FaDev size={20} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Divider */}
        <div className="mt-16 h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        {/* Bottom Row */}
        <div className="mt-6 flex flex-col md:flex-row justify-between items-center text-xs text-white/40 gap-3">
          <span>© {new Date().getFullYear()} Gokul. No rights reserved.</span>
          <span>
            Made with <span className="text-white/70"> React + TypeScript</span>
          </span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

//TODO: add links from manifest
