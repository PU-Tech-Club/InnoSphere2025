import React, {
  useState,
  useEffect,
  useRef,
  createContext,
  useContext,
  ReactNode,
  lazy,
  Suspense,
} from "react";
import { FaFacebook, FaInstagram, FaLinkedin, FaGithub } from "react-icons/fa6";
import { FiSun, FiMoon } from "react-icons/fi";
import "./index.css";
import puLogo from "./assets/pu_logo.svg";
import putcLogo from "./assets/putc_logo.png";
import InnosphereLogo from "./assets/Innosphere_logo.png";

// Lazy load components
const Countdown = lazy(() => import("./components/Countdown"));

// Theme context
interface ThemeContextType {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  isDarkMode: false,
  toggleTheme: () => {},
});

// Theme provider component
interface ThemeProviderProps {
  children: ReactNode;
}

function ThemeProvider({ children }: ThemeProviderProps) {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    return savedTheme === "dark";
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// Custom hook to use theme
function useTheme() {
  return useContext(ThemeContext);
}

// Animation util hook for fade/slide-in
function useFadeIn(delay = 0) {
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const timeout = setTimeout(() => setShown(true), delay);
    return () => clearTimeout(timeout);
  }, [delay]);
  return shown
    ? "opacity-100 translate-y-0 transition-all duration-300 ease-out"
    : "opacity-0 translate-y-10";
}

// Scroll animation hook
function useScrollAnimation() {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      {
        root: null,
        rootMargin: "0px",
        threshold: 0.1,
      },
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  return [
    ref,
    isVisible
      ? "opacity-100 translate-y-0 transition-all duration-500 ease-out"
      : "opacity-0 translate-y-10",
  ];
}

// Staggered animation hook
function useStaggeredAnimation(delay = 0) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            setIsVisible(true);
          }, delay);
          observer.unobserve(entry.target);
        }
      },
      {
        root: null,
        rootMargin: "0px",
        threshold: 0.1,
      },
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [delay]);

  return [
    ref,
    isVisible
      ? "opacity-100 translate-y-0 scale-100 transition-all duration-300 ease-out"
      : "opacity-0 translate-y-10 scale-95 transition-all duration-300 ease-out",
  ];
}

// Add smooth scroll behavior to the whole page
if (typeof window !== "undefined") {
  document.documentElement.style.scrollBehavior = "smooth";
}

// Add this CSS class to your index.css
const heroGradientDark =
  "bg-gradient-to-r from-teal/90 via-lightgreen/90 to-deepgreen/90";

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

function AppContent() {
  // Animation states
  const heroAnim = useFadeIn(0);
  const infoAnim = useFadeIn(300);
  const eventsAnim = useFadeIn(500);
  const timelineAnim = useFadeIn(700);
  const sponsorsAnim = useFadeIn(1100);
  const footerAnim = useFadeIn(1400);

  // Mobile menu state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Theme
  const { isDarkMode, toggleTheme } = useTheme();

  // Scroll animation refs
  const [infoRef, infoScrollAnim] = useScrollAnimation();
  const [eventsRef, eventsScrollAnim] = useScrollAnimation();
  const [timelineRef, timelineScrollAnim] = useScrollAnimation();
  const [sponsorsRef, sponsorsScrollAnim] = useScrollAnimation();
  const [footerRef, footerScrollAnim] = useScrollAnimation();

  // Staggered animation refs for events
  const [event1Ref, event1Anim] = useStaggeredAnimation(100);
  const [event2Ref, event2Anim] = useStaggeredAnimation(200);
  const [event3Ref, event3Anim] = useStaggeredAnimation(300);

  // Staggered animation refs for timeline events
  const timelineEventRefs = Array(7)
    .fill(null)
    .map((_, i) => useStaggeredAnimation(i * 150));

  // Staggered animation refs for sponsors
  const sponsorRefs = Array(8)
    .fill(null)
    .map((_, i) => useStaggeredAnimation(i * 100));

  return (
    <div className="min-h-screen bg-offwhite dark:bg-gray-900 transition-colors duration-300">
      {/* Navbar */}
      <nav
        className="bg-teal-dark shadow-lg w-full fixed z-50"
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between h-16 items-center">
          {/* Logo Placeholder */}
          <div className="flex items-center space-x-2">
            <div
              className="w-11 h-11 rounded-full bg-deepgreen flex items-center justify-center text-white font-bold text-lg"
              role="img"
              aria-label="Innosphere Logo"
            >
              <img src={InnosphereLogo} alt="Innosphere Logo" />
            </div>
            <span className="text-white font-bold text-lg">
              <span className="relative inline-block animate-pop text-offwhite">
                <span className="drop-shadow-[0_8px_24px_rgba(0,209,192,0.8)]">
                  Inno
                </span>
              </span>
              <span>sphere</span>
            </span>
          </div>

          {/* Desktop Navigation */}
          <div
            className="hidden md:flex items-center space-x-8"
            role="menubar"
            aria-label="Main menu"
          >
            <a
              href="#"
              className="nav-link-active"
              role="menuitem"
              aria-current="page"
            >
              Home
            </a>
            <a href="#event-registration" className="nav-link" role="menuitem">
              Event Registration
            </a>
            <a href="#events" className="nav-link" role="menuitem">
              Events
            </a>
            <a href="#sponsors" className="nav-link" role="menuitem">
              Sponsors
            </a>
            {/* Theme Toggle Button */}
            <div role="menuitem">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full text-white hover:bg-white/20 transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-teal"
                aria-label="Toggle theme"
                aria-pressed={isDarkMode}
              >
                {isDarkMode ? (
                  <FiSun className="w-5 h-5" />
                ) : (
                  <FiMoon className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center space-x-4 md:hidden">
            {/* Theme Toggle Button for Mobile */}
            <div role="menuitem">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full text-white hover:bg-white/20 transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-teal"
                aria-label="Toggle theme"
                aria-pressed={isDarkMode}
              >
                {isDarkMode ? (
                  <FiSun className="w-5 h-5" />
                ) : (
                  <FiMoon className="w-5 h-5" />
                )}
              </button>
            </div>
            <button
              className="text-white p-2 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-teal rounded-md"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
              aria-haspopup="true"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                {isMobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        <div
          id="mobile-menu"
          className={`md:hidden bg-teal transition-all duration-300 ease-in-out ${
            isMobileMenuOpen ? "max-h-48 opacity-100" : "max-h-0 opacity-0"
          } overflow-hidden`}
          role="menu"
          aria-label="Mobile menu"
          aria-hidden={!isMobileMenuOpen}
        >
          <div className="px-4 py-2 space-y-2">
            <a
              href="#"
              className="nav-link-active block py-2"
              role="menuitem"
              aria-current="page"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </a>
            <a
              href="#event-registration"
              className="nav-link block py-2"
              role="menuitem"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Event Registration
            </a>
            <a
              href="#events"
              className="nav-link block py-2"
              role="menuitem"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Events
            </a>
            <a
              href="#sponsors"
              className="nav-link block py-2"
              role="menuitem"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Sponsors
            </a>
          </div>
        </div>
      </nav>
      {/* Hero Section */}
      <div className="pt-16">
        <section
          className={`relative h-[70vh] md:h-[80vh] bg-gradient-to-r from-teal-dark via-teal to-deepgreen flex flex-col items-center justify-center overflow-hidden ${heroAnim}`}
          role="banner"
        >
          {/* Floating Elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {/* Floating Dots */}
            <div
              className="absolute w-2 h-2 bg-white/30 rounded-full animate-float-slow"
              style={{ top: "20%", left: "15%" }}
            ></div>
            <div
              className="absolute w-3 h-3 bg-white/20 rounded-full animate-float-medium"
              style={{ top: "40%", left: "25%" }}
            ></div>
            <div
              className="absolute w-2 h-2 bg-white/30 rounded-full animate-float-fast"
              style={{ top: "60%", left: "35%" }}
            ></div>
            <div
              className="absolute w-3 h-3 bg-white/20 rounded-full animate-float-slow"
              style={{ top: "30%", right: "20%" }}
            ></div>
            <div
              className="absolute w-2 h-2 bg-white/30 rounded-full animate-float-medium"
              style={{ top: "50%", right: "30%" }}
            ></div>
            <div
              className="absolute w-3 h-3 bg-white/20 rounded-full animate-float-fast"
              style={{ top: "70%", right: "25%" }}
            ></div>

            {/* Floating Shapes */}
            <div
              className="absolute w-8 h-8 border-2 border-white/20 rounded-lg animate-float-slow rotate-45"
              style={{ top: "25%", left: "40%" }}
            ></div>
            <div
              className="absolute w-6 h-6 border-2 border-white/20 rounded-full animate-float-medium"
              style={{ top: "45%", right: "40%" }}
            ></div>
            <div
              className="absolute w-10 h-10 border-2 border-white/20 rounded-lg animate-float-fast -rotate-12"
              style={{ top: "65%", left: "30%" }}
            ></div>

            {/* Floating PU Logos */}
            <img
              src={puLogo}
              alt="PU Logo"
              className="absolute w-12 h-12 opacity-80 animate-float-slow"
              style={{ top: "15%", right: "15%" }}
            />
            {/* Floating PUTC Logos */}
            <img
              src={putcLogo}
              alt="PUTC Logo"
              className="absolute w-14 h-14 opacity-80 animate-float-medium"
              style={{ top: "25%", left: "30%" }}
            />
          </div>

          <div className="z-10 max-w-3xl mx-auto w-full flex flex-col items-center justify-center space-y-8">
            <div className="text-center space-y-6">
              <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white">
                <span className="text-offwhite drop-shadow-[0_10px_38px_rgba(0,209,192,0.8)] animate-pop">
                  Inno
                </span>
                <span>sphere</span>
              </h1>
              <p className="text-xl md:text-2xl font-medium max-w-2xl mx-auto leading-relaxed text-white">
                Empowered by Innovation
              </p>
              <div className="flex flex-wrap justify-center gap-6">
                <a
                  className="btn-primary focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-teal"
                  href="#event-registration"
                >
                  Explore Events
                </a>
                <a
                  className="btn-secondary focus:outline-none focus:ring-2 focus:ring-teal focus:ring-offset-2 focus:ring-offset-white"
                  href="#events"
                >
                  View Events
                </a>
              </div>
              <Suspense
                fallback={
                  <div
                    className="h-24"
                    role="status"
                    aria-label="Loading countdown"
                  />
                }
              >
                <Countdown />
              </Suspense>
            </div>
          </div>
        </section>
        {/* Info cards */}
        <section
          ref={infoRef}
          className={`py-12 bg-offwhite dark:bg-gray-800 ${infoAnim} ${infoScrollAnim}`}
          role="region"
          aria-label="Event Information"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card">
              <div className="p-6">
                <h2 className="heading-secondary">Date</h2>
                <p className="text-secondary">June 8</p>
              </div>
            </div>
            <div className="card">
              <div className="p-6">
                <h2 className="heading-secondary">Location</h2>
                <p className="text-secondary">Pokhara University, Khudi</p>
              </div>
            </div>
            <div className="card">
              <div className="p-6">
                <h2 className="heading-secondary">Competitions</h2>
                <p className="text-secondary">Different domains</p>
              </div>
            </div>
          </div>
        </section>
        {/* Events Placeholder */}
        <section
          ref={eventsRef}
          id="event-registration"
          className={`py-16 bg-f3f7f0 dark:bg-gray-900 ${eventsAnim} ${eventsScrollAnim}`}
          role="region"
          aria-label="Event Registration"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold mb-8 text-teal-dark">
              Event Registration
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div
                ref={event1Ref}
                className={`bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg flex flex-col items-center justify-center h-48 border-2 border-lightgreen/30 dark:border-teal/30 ${event1Anim}`}
              >
                <span className="text-xl text-gray-400 dark:text-gray-300 font-semibold">
                  <a href="https://forms.gle/KD1yyW22Uds3K1xo7">
                    Event Placeholder
                  </a>
                </span>
                <span className="text-xl text-gray-400 dark:text-gray-300 font-semibold"></span>
              </div>
              <div
                ref={event2Ref}
                className={`bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg flex flex-col items-center justify-center h-48 border-2 border-lightgreen/30 dark:border-teal/30 ${event2Anim}`}
              >
                <span className="text-xl text-gray-400 dark:text-gray-300 font-semibold">
                  Event Placeholder
                </span>
              </div>
              <div
                ref={event3Ref}
                className={`bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg flex flex-col items-center justify-center h-48 border-2 border-lightgreen/30 dark:border-teal/30 ${event3Anim}`}
              >
                <span className="text-xl text-gray-400 dark:text-gray-300 font-semibold">
                  Event Placeholder
                </span>
              </div>
            </div>
          </div>
        </section>
        {/* Timeline - Schedule at a Glance */}
        <section
          ref={timelineRef}
          id="events"
          className={`py-16 bg-white dark:bg-gray-800 ${timelineAnim} ${timelineScrollAnim}`}
          role="region"
          aria-label="Events"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold mb-12 text-center text-deepgreen dark:text-teal-light">
              Events
            </h2>
            <div className="relative flex flex-col items-center">
              <div
                className="absolute left-1/2 -translate-x-1/2 top-0 h-full w-2 bg-gradient-to-b from-teal via-lightgreen to-teal dark:from-teal/80 dark:via-lightgreen/80 dark:to-teal/80 rounded-full z-0"
                style={{ minHeight: "600px" }}
              />
              <div className="w-full">
                {[0, 1, 2, 3, 4, 5, 6].map((step, i) => {
                  const [ref, anim] = timelineEventRefs[i];
                  return (
                    <div className="flex w-full mb-12 relative" key={i}>
                      {i % 2 === 0 ? (
                        <div className="flex-1 flex justify-end pr-2 sm:pr-8">
                          <div
                            ref={ref}
                            className={`bg-white dark:bg-gray-700 border-l-4 border-teal dark:border-teal/80 rounded-xl w-[85%] sm:w-80 h-28 flex items-center justify-center shadow-lg ${anim}`}
                          >
                            <span className="text-gray-600 dark:text-gray-300 font-semibold text-center px-2">
                              {i === 0
                                ? "HARDWARE PROJECT EXHIBITION"
                                : i === 2
                                  ? "IT QUIZ"
                                  : i === 4
                                    ? "BUSINESS IDEA PITCHING"
                                    : i === 6
                                      ? "E-FOOTBALL TOURNAMENT"
                                      : ""}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className="flex-1" />
                      )}
                      <div className="flex flex-col items-center z-10">
                        <div
                          className="w-12 h-12 rounded-full bg-white dark:bg-gray-700 border-4 border-teal dark:border-teal/80 flex items-center justify-center shadow-lg animate-pulse-glow"
                          style={{
                            animationDelay: `${0.2 * i}s`,
                            animationFillMode: "both",
                          }}
                        >
                          <div className="w-6 h-6 rounded-full bg-teal/20 dark:bg-teal/30"></div>
                        </div>
                      </div>
                      {i % 2 !== 0 ? (
                        <div className="flex-1 flex justify-start pl-2 sm:pl-8">
                          <div
                            ref={ref}
                            className={`bg-white dark:bg-gray-700 border-r-4 border-teal dark:border-teal/80 rounded-xl w-[85%] sm:w-80 h-28 flex items-center justify-center shadow-lg ${anim}`}
                          >
                            <span className="text-gray-600 dark:text-gray-300 font-semibold text-center px-2">
                              {i === 1
                                ? "SOFTWARE PROJECT EXHIBITION"
                                : i === 3
                                  ? "INNOCANVAS"
                                  : i === 5
                                    ? "ECHOSPHERE UNPLUGGED"
                                    : ""}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className="flex-1" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
        {/* Sponsors Section */}
        <section
          ref={sponsorsRef}
          id="sponsors"
          className={`py-16 bg-f3f7f0 dark:bg-gray-900 ${sponsorsAnim} ${sponsorsScrollAnim}`}
          role="region"
          aria-label="Sponsors"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold mb-12 text-teal-dark text-center">
              Our Sponsors
            </h2>
            <div className="grid grid-cols-1 gap-12">
              {/* Title Sponsor */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg border-2 border-teal/30 dark:border-teal/50">
                <h3 className="text-2xl font-bold text-teal-dark dark:text-teal mb-6 text-center">Title Sponsor</h3>
                <div className="flex justify-center">
                  <div className="w-32 h-32 rounded-full bg-gray-100 dark:bg-gray-700 border-2 border-teal/30 dark:border-teal/50 flex items-center justify-center">
                    <span className="text-gray-400 dark:text-gray-500">Logo</span>
                  </div>
                </div>
              </div>

              {/* Gold Sponsors */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg border-2 border-teal/30 dark:border-teal/50">
                <h3 className="text-2xl font-bold text-teal-dark dark:text-teal mb-6 text-center">Gold Sponsors</h3>
                <div className="flex justify-center gap-8">
                  {[1, 2].map((idx) => (
                    <div key={idx} className="w-28 h-28 rounded-full bg-gray-100 dark:bg-gray-700 border-2 border-teal/30 dark:border-teal/50 flex items-center justify-center">
                      <span className="text-gray-400 dark:text-gray-500">Logo</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Silver Sponsors */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg border-2 border-teal/30 dark:border-teal/50">
                <h3 className="text-2xl font-bold text-teal-dark dark:text-teal mb-6 text-center">Silver Sponsors</h3>
                <div className="flex justify-center gap-6 flex-wrap">
                  {[1, 2, 3, 4].map((idx) => (
                    <div key={idx} className="w-24 h-24 rounded-full bg-gray-100 dark:bg-gray-700 border-2 border-teal/30 dark:border-teal/50 flex items-center justify-center">
                      <span className="text-gray-400 dark:text-gray-500">Logo</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bronze Sponsors */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg border-2 border-teal/30 dark:border-teal/50">
                <h3 className="text-2xl font-bold text-teal-dark dark:text-teal mb-6 text-center">Bronze Sponsors</h3>
                <div className="flex justify-center gap-6 flex-wrap">
                  {[1, 2, 3, 4].map((idx) => (
                    <div key={idx} className="w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-700 border-2 border-teal/30 dark:border-teal/50 flex items-center justify-center">
                      <span className="text-gray-400 dark:text-gray-500">Logo</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Food Sponsors */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg border-2 border-teal/30 dark:border-teal/50">
                <h3 className="text-2xl font-bold text-teal-dark dark:text-teal mb-6 text-center">Food Sponsors</h3>
                <div className="flex justify-center gap-6 flex-wrap">
                  {[1, 2, 3].map((idx) => (
                    <div key={idx} className="w-24 h-24 rounded-full bg-gray-100 dark:bg-gray-700 border-2 border-teal/30 dark:border-teal/50 flex items-center justify-center">
                      <span className="text-gray-400 dark:text-gray-500">Logo</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Drink Sponsors */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg border-2 border-teal/30 dark:border-teal/50">
                <h3 className="text-2xl font-bold text-teal-dark dark:text-teal mb-6 text-center">Drink Sponsors</h3>
                <div className="flex justify-center gap-8">
                  {[1, 2].map((idx) => (
                    <div key={idx} className="w-24 h-24 rounded-full bg-gray-100 dark:bg-gray-700 border-2 border-teal/30 dark:border-teal/50 flex items-center justify-center">
                      <span className="text-gray-400 dark:text-gray-500">Logo</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Internet Sponsors */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg border-2 border-teal/30 dark:border-teal/50">
                <h3 className="text-2xl font-bold text-teal-dark dark:text-teal mb-6 text-center">Internet Sponsors</h3>
                <div className="flex justify-center">
                  <div className="w-28 h-28 rounded-full bg-gray-100 dark:bg-gray-700 border-2 border-teal/30 dark:border-teal/50 flex items-center justify-center">
                    <span className="text-gray-400 dark:text-gray-500">Logo</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
      {/* Footer */}
      <footer
        ref={footerRef}
        className={`bg-deepgreen text-white py-12 mt-12 ${footerAnim} ${footerScrollAnim}`}
        role="contentinfo"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h2 className="text-xl font-bold mb-4 text-white">Contact Us</h2>
            <div className="space-y-2">
              <p className="flex items-center">
                <a
                  href="mailto:putechclub@gmail.com"
                  className="text-white hover:text-teal-light transition-colors"
                >
                  putechclub@gmail.com
                </a>
              </p>
              <p className="flex items-center">
                <span className="text-white hover:text-teal-light transition-colors">
                  +977-981295913
                </span>
              </p>
              <p className="flex items-center">
                <span className="text-white hover:text-teal-light transition-colors">
                  Pokhara University, Khudi
                </span>
              </p>
            </div>
          </div>
          <div>
            <h2 className="text-xl font-bold mb-4 text-white">Quick Links</h2>
            <ul className="space-y-2">
              <li>
                <a
                  href="#event-registration"
                  className="text-white hover:text-teal-light transition-colors"
                >
                  Event Registration
                </a>
              </li>
              <li>
                <a
                  href="#events"
                  className="text-white hover:text-teal-light transition-colors"
                >
                  Events
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h2 className="text-xl font-bold mb-4 text-white">Follow Us</h2>
            <div className="flex space-x-6 items-center">
              <a
                href="https://www.facebook.com/putechclub"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-teal-light transition-colors text-2xl flex items-center"
                aria-label="Follow us on Facebook"
              >
                <FaFacebook />
                <span className="sr-only">Facebook</span>
              </a>
              <a
                href="https://www.instagram.com/techclubpu/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-teal-light transition-colors text-2xl flex items-center"
                aria-label="Follow us on Instagram"
              >
                <FaInstagram />
                <span className="sr-only">Instagram</span>
              </a>
              <a
                href="https://www.linkedin.com/company/tech-club-of-pokhara-university"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-teal-light transition-colors text-2xl flex items-center"
                aria-label="Follow us on LinkedIn"
              >
                <FaLinkedin />
                <span className="sr-only">LinkedIn</span>
              </a>
              <a
                href="https://github.com/PU-Tech-Club"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-teal-light transition-colors text-2xl flex items-center"
                aria-label="Follow us on GitHub"
              >
                <FaGithub />
                <span className="sr-only">GitHub</span>
              </a>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-teal-light/30 text-center text-white">
          <p>© 2025, PU Tech Club. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
