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
import innosphereLogo from "./assets/Innosphere_logo.png";
import { useGoogleAnalytics } from "./hooks/useGoogleAnalytics";

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
  // Add Google Analytics hook
  const { trackEvent } = useGoogleAnalytics();
  
  // Animation states
  const heroAnim = useFadeIn(0);
  const infoAnim = useFadeIn(300);
  const eventsAnim = useFadeIn(500);
  const timelineAnim = useFadeIn(700);
  const sponsorsAnim = useFadeIn(1100);
  const footerAnim = useFadeIn(1400);

  // Mobile menu state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState("home");
  // Theme
  const { isDarkMode, toggleTheme } = useTheme();

  // Set default hash route to #home
  useEffect(() => {
    if (!window.location.hash) {
      window.location.hash = 'home';
    }
  }, []);

  // Track menu clicks
  const handleMenuClick = (menu: string) => {
    setActiveMenu(menu);
    setIsMobileMenuOpen(false);
    trackEvent('navigation', 'menu', menu);
  };

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
  const timelineEventRefs = Array(8)
    .fill(null)
    .map((_, i) => useStaggeredAnimation(i * 150));

  // Staggered animation refs for sponsors
  const sponsorRefs = Array(8)
    .fill(null)
    .map((_, i) => useStaggeredAnimation(i * 100));

  // Observe section visibility for active menu highlighting
  useEffect(() => {
    const sectionIds = ["home", "about", "event-registration", "events", "sponsors"];
    const sections = sectionIds
      .map(id => document.getElementById(id))
      .filter(Boolean);

    const observer = new window.IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter(entry => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) {
          setActiveMenu(visible[0].target.id);
        }
      },
      {
        rootMargin: "-10% 0px -70% 0px",
        threshold: 0.05,
      }
    );

    sections.forEach((section) => observer.observe(section!));

    return () => {
      sections.forEach((section) => observer.unobserve(section!));
    };
  }, []);

  return (
    <div className="min-h-screen bg-offwhite dark:bg-gray-900 transition-colors duration-300">
      {/* Navbar */}
      <nav
        className="bg-gradient-to-r to-[#0f3f3a] from-teal-500 shadow-lg w-full fixed z-50"
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex items-center w-1/2 ">
            <div className="w-40 h-16 flex items-center" role="img" aria-label="Innosphere Logo">
              <img 
                src={innosphereLogo} 
                alt="Innosphere Logo" 
                className="w-80 h-80 object-contain animate-pulse-glow drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]" 
                style={{ pointerEvents: 'none' }}
                onClick={() => trackEvent('click', 'logo', 'Innosphere Logo')}
              />
            </div>
          </div>

          {/* Desktop Navigation */}
          <div
            className="hidden md:flex items-center space-x-4"
            role="menubar"
            aria-label="Main menu"
          >
            <a
              href="#"
              className={`${activeMenu === "home" ? "nav-link-active" : "nav-link"} block py-2`}
              role="menuitem"
              aria-current={activeMenu === "home" ? "page" : undefined}
              onClick={() => handleMenuClick("home")}
            >
              Home
            </a>
            <a
              href="#about"
              className={`${activeMenu === "about" ? "nav-link-active" : "nav-link"} block py-2`}
              role="menuitem"
              aria-current={activeMenu === "about" ? "page" : undefined}
              onClick={() => handleMenuClick("about")}
            >
              About
            </a>
            <a
              href="#event-registration"
              className={`${activeMenu === "event-registration" ? "nav-link-active" : "nav-link"} block py-2`}
              role="menuitem"
              onClick={() => handleMenuClick("event-registration")}
            >
              Event Registration
            </a>
            <a
              href="#events"
              className={`${activeMenu === "events" ? "nav-link-active" : "nav-link"} block py-2`}
              role="menuitem"
              onClick={() => handleMenuClick("events")}
            >
              Events
            </a>
            <a
              href="#sponsors"
              className={`${activeMenu === "sponsors" ? "nav-link-active" : "nav-link hidden"} block py-2`}
              role="menuitem"
              onClick={() => handleMenuClick("sponsors")}
            >
              Sponsors
            </a>
            {/* Theme Toggle Button */}
            <div role="menuitem" className="pr-9">
              <button
                onClick={() => {
                  toggleTheme();
                  trackEvent('click', 'theme', isDarkMode ? 'light' : 'dark');
                }}
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
          <div className="flex items-center space-x-4 md:hidden pr-4">
            {/* Theme Toggle Button for Mobile */}
            <div role="menuitem">
              <button
                onClick={() => {
                  toggleTheme();
                  trackEvent('click', 'theme', isDarkMode ? 'light' : 'dark');
                }}
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
              onClick={() => {
                setIsMobileMenuOpen(false);
                trackEvent('navigation', 'menu', 'home');
              }}
            >
              Home
            </a>
            <a
              href="#about"
              className="nav-link block py-2"
              role="menuitem"
              onClick={() => {
                setIsMobileMenuOpen(false);
                trackEvent('navigation', 'menu', 'about');
              }}
            >
              About
            </a>
            <a
              href="#event-registration"
              className="nav-link block py-2"
              role="menuitem"
              onClick={() => {
                setIsMobileMenuOpen(false);
                trackEvent('navigation', 'menu', 'event-registration');
              }}
            >
              Event Registration
            </a>
            <a
              href="#events"
              className="nav-link block py-2"
              role="menuitem"
              onClick={() => {
                setIsMobileMenuOpen(false);
                trackEvent('navigation', 'menu', 'events');
              }}
            >
              Events
            </a>
            <a
              href="#sponsors"
              className="nav-link py-2 hidden"
              role="menuitem"
              onClick={() => {
                setIsMobileMenuOpen(false);
                trackEvent('navigation', 'menu', 'sponsors');
              }}
            >
              Sponsors
            </a>
          </div>
        </div>
      </nav>
      {/* Hero Section */}
      <div className="pt-16">
        <section
          id="home"
          className="relative min-h-[100vh] bg-gradient-to-r from-teal-dark via-teal to-deepgreen flex flex-col items-center justify-center overflow-hidden"
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
              style={{ top: "25%", left: "25%" }}
            />
          </div>

          <div className="z-10 max-w-3xl mx-auto w-full flex flex-col items-center justify-center space-y-8">
            <div className="text-center space-y-6">
              <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white">
                <span className="text-offwhite drop-shadow-[0_10px_38px_rgba(0,209,192,0.8)] animate-pop">
                  Inno
                </span>
                <span>sphere</span>
                <span>  1.0</span>
              </h1>
              <p className="text-xl md:text-2xl font-medium max-w-2xl mx-auto leading-relaxed text-white">
              Where Innovation Meets Imagination
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
        
        {/* About */}
        <section
        id="about"
        className="py-16 bg-f3f7f0 dark:bg-gray-900 min-h-[60vh]"
        role="region"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div
              className={`bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-xl border-2 border-lightgreen/30 dark:border-teal/30 p-8 sm:p-10 lg:p-12 space-y-4`}
            >
              <p className="text-gray-700 dark:text-gray-200 text-base sm:text-lg md:text-xl leading-tight md:leading-normal tracking-wide text-justify">
                <strong className="text-teal-dark dark:text-lightgreen font-semibold">InnoSphere 1.0</strong> is a dynamic one-day technology festival hosted by the <strong> Tech Club at Pokhara University </strong> under the slogan "Where Innovation Meets Imagination." On<strong> June 8, 2025</strong>, undergraduate and high-school students, startups, industry experts, and community
                members will converge to showcase hardware and software innovations, participate in IT
                quizzes, digital poster design, STEM project exhibits, and gaming tournaments. Attendees
                can also join hands-on workshops covering recent trends in ICT, as well as non-tech events
                like idea pitching, musical performances, and the Discovery Expo marketplace. By
                fostering creativity, collaboration, and real-world impact, InnoSphere 1.0 empowers the
                next generation of innovators and sets a new benchmark for student-led tech events
                nationwide.
              </p>
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
                <p className="text-secondary">June 8, 2025</p>
              </div>
            </div>
            <div className="card">
              <div className="p-6">
                <h2 className="heading-secondary">Location</h2>
                <p className="text-secondary">Pokhara University, Pokhara Metropolitan City-30, Kaski</p>
              </div>
            </div>
            <div className="card">
              <div className="p-6">
                <h2 className="heading-secondary">Competitions</h2>
                <p className="text-secondary">Dynamic domains</p>
              </div>
            </div>
          </div>
        </section>
        {/* Events Placeholder */}
        <section
          ref={eventsRef}
          id="event-registration"
          className={`py-16 bg-f3f7f0 dark:bg-gray-900 ${eventsAnim} ${eventsScrollAnim} min-h-[60vh]`}
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
                className={`bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg flex flex-col items-center justify-center h-48 border-2 border-lightgreen/30 dark:border-teal/30 lg:${event1Anim}`}
              >
                <span className="text-xl text-gray-400 dark:text-gray-300 font-semibold">
                  <a 
                    href="https://forms.gle/WAucRqbY9EgWZ21L8" 
                    target="_blank"
                    onClick={() => trackEvent('registration', 'event_registration', 'Hardware Project Exhibition')}
                  >
                    Hardware Project Exhibition 
                  </a>
                </span>
                <span className="text-l text-gray-400 dark:text-gray-300 font-semibold">
                           (For undergraduate students)
                </span>
                <span className="text-l text-gray-400 dark:text-gray-300 font-semibold">
                  <a 
                    href="https://forms.gle/WAucRqbY9EgWZ21L8" 
                    target="_blank"
                    onClick={() => trackEvent('registration', 'event_registration', 'Hardware Project Exhibition')}
                  >
                    Click here to register
                  </a>
                </span>
              </div>
              <div
                ref={event1Ref}
                className={`bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg flex flex-col items-center justify-center h-48 border-2 border-lightgreen/30 dark:border-teal/30 lg:${event1Anim}`}
              >
                <span className="text-xl text-gray-400 dark:text-gray-300 font-semibold">
                  <a 
                    href="https://forms.gle/aCumqCVxbKHowRan9" 
                    target="_blank"
                    onClick={() => trackEvent('registration', 'event_registration', 'Software Project Exhibition')}
                  >
                    Software Project Exhibition
                  </a>
                </span>
                <span className="text-l text-gray-400 dark:text-gray-300 font-semibold">
                           (For undergraduate students)
                </span>
                <span className="text-l text-gray-400 dark:text-gray-300 font-semibold">
                  <a 
                    href="https://forms.gle/aCumqCVxbKHowRan9" 
                    target="_blank"
                    onClick={() => trackEvent('registration', 'event_registration', 'Software Project Exhibition')}
                  >
                    Click here to register
                  </a>
                </span>
              </div>
              <div
                ref={event1Ref}
                className={`bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg flex flex-col items-center justify-center h-48 border-2 border-lightgreen/30 dark:border-teal/30 lg:${event1Anim}`}
              >
                <span className="text-xl text-gray-400 dark:text-gray-300 font-semibold">
                  <a 
                    href="https://forms.gle/gMabdzYFQ5a8kvhc9" 
                    target="_blank"
                    onClick={() => trackEvent('registration', 'event_registration', 'NextGen Innovators Expo')}
                  >
                    NextGen Innovators Expo
                  </a>
                </span>
                <span className="text-l text-gray-400 dark:text-gray-300 font-semibold">
                           (For school-level students)
                </span>
                <span className="text-l text-gray-400 dark:text-gray-300 font-semibold">
                  <a 
                    href="https://forms.gle/gMabdzYFQ5a8kvhc9" 
                    target="_blank"
                    onClick={() => trackEvent('registration', 'event_registration', 'NextGen Innovators Expo')}
                  >
                    Click here to register
                  </a>
                </span>
              </div>
              <div
                ref={event1Ref}
                className={`bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg flex flex-col items-center justify-center h-48 border-2 border-lightgreen/30 dark:border-teal/30 lg:${event1Anim}`}
              >
                <span className="text-xl text-gray-400 dark:text-gray-300 font-semibold">
                  <a 
                    href="https://forms.gle/d6ey8KP3s54AW2Xz8" 
                    target="_blank"
                    onClick={() => trackEvent('registration', 'event_registration', 'InnoCanvas')}
                  >
                    InnoCanvas
                  </a>
                </span>
                <span className="text-l text-gray-400 dark:text-gray-300 font-semibold">
                  <a 
                    href="https://forms.gle/d6ey8KP3s54AW2Xz8" 
                    target="_blank"
                    onClick={() => trackEvent('registration', 'event_registration', 'InnoCanvas')}
                  >
                    Poster Design Competition
                  </a>
                </span>
                <span className="text-l text-gray-400 dark:text-gray-300 font-semibold">
                  <a 
                    href="https://forms.gle/d6ey8KP3s54AW2Xz8" 
                    target="_blank"
                    onClick={() => trackEvent('registration', 'event_registration', 'InnoCanvas')}
                  >
                    Click here to register
                  </a>
                </span>
              </div>
              <div
                ref={event1Ref}
                className={`bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg flex flex-col items-center justify-center h-48 border-2 border-lightgreen/30 dark:border-teal/30 lg:${event1Anim}`}
              >
                <span className="text-xl text-gray-400 dark:text-gray-300 font-semibold">
                  <a 
                    href="https://forms.gle/XmWyMnTnLGxT8Tfo7" 
                    target="_blank"
                    onClick={() => trackEvent('registration', 'event_registration', 'Idea Pitching Competition')}
                  >
                    Idea Pitching Competition
                  </a>
                </span>
                <span className="text-l text-gray-400 dark:text-gray-300 font-semibold">
                  <a 
                    href="https://forms.gle/XmWyMnTnLGxT8Tfo7" 
                    target="_blank"
                    onClick={() => trackEvent('registration', 'event_registration', 'Idea Pitching Competition')}
                  >
                    Click here to register
                  </a>
                </span>
              </div>
              <div
                ref={event1Ref}
                className={`bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg flex flex-col items-center justify-center h-48 border-2 border-lightgreen/30 dark:border-teal/30 lg:${event1Anim}`}
              >
                <span className="text-xl text-gray-400 dark:text-gray-300 font-semibold">
                  <a 
                    href="https://forms.gle/n2GE1DYC1wk55MCeA" 
                    target="_blank"
                    onClick={() => trackEvent('registration', 'event_registration', 'PUBG Mobile LAN Tournament')}
                  >
                    PUBG Mobile LAN Tournament
                  </a>
                </span>
                <span className="text-l text-gray-400 dark:text-gray-300 font-semibold">
                  <a 
                    href="https://forms.gle/n2GE1DYC1wk55MCeA" 
                    target="_blank"
                    onClick={() => trackEvent('registration', 'event_registration', 'PUBG Mobile LAN Tournament')}
                  >
                    Click here to register
                  </a>
                </span>
              </div>
              <div
                ref={event1Ref}
                className={`bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg flex flex-col items-center justify-center h-48 border-2 border-lightgreen/30 dark:border-teal/30 lg:${event1Anim}`}
              >
                <span className="text-xl text-gray-400 dark:text-gray-300 font-semibold">
                  <a 
                    href="https://forms.gle/6ViXNYpMsWQJzwUMA" 
                    target="_blank"
                    onClick={() => trackEvent('registration', 'event_registration', 'E-football Tournament')}
                  >
                    E-football Tournament
                  </a>
                </span>
                <span className="text-l text-gray-400 dark:text-gray-300 font-semibold">
                  <a 
                    href="https://forms.gle/6ViXNYpMsWQJzwUMA" 
                    target="_blank"
                    onClick={() => trackEvent('registration', 'event_registration', 'E-football Tournament')}
                  >
                    Click here to register
                  </a>
                </span>
              </div>
              <div
                ref={event1Ref}
                className={`bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg flex flex-col items-center justify-center h-48 border-2 border-lightgreen/30 dark:border-teal/30 lg:${event1Anim}`}
              >
                <span className="text-xl text-gray-400 dark:text-gray-300 font-semibold">
                  <a 
                    href="https://forms.gle/MiBZnFyJfBqqndHc8" 
                    target="_blank"
                    onClick={() => trackEvent('registration', 'event_registration', 'EchoSphere Unplugged')}
                  >
                    EchoSphere Unplugged
                  </a>
                </span>
                <span className="text-l text-gray-400 dark:text-gray-300 font-semibold">
                    (Musical Event)
                </span>
                <span className="text-l text-gray-400 dark:text-gray-300 font-semibold">
                  <a 
                    href="https://forms.gle/MiBZnFyJfBqqndHc8" 
                    target="_blank"
                    onClick={() => trackEvent('registration', 'event_registration', 'EchoSphere Unplugged')}
                  >
                    Click here to register
                  </a>
                </span>
              </div>
              <div
                ref={event1Ref}
                className={`bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg flex flex-col items-center justify-center h-48 border-2 border-lightgreen/30 dark:border-teal/30 lg:${event1Anim}`}
              >
                <span className="text-xl text-gray-400 dark:text-gray-300 font-semibold">
                  <a 
                    href="#" 
                    target="_blank"
                    onClick={() => trackEvent('registration', 'event_registration', 'Workshops')}
                  >
                    Seminars/Talk Session
                  </a>
                </span>
                <span className="text-l text-gray-400 dark:text-gray-300 font-semibold">
                  <a 
                    href="#" 
                    target="_blank"
                    onClick={() => trackEvent('registration', 'event_registration', 'Workshops')}
                  >
                    Registration Opening Soon
                  </a>
                </span>
              </div>
            </div>
          </div>
        </section>
        {/* Events Section */}
        <section
          ref={timelineRef}
          id="events"
          className={`py-16 bg-white dark:bg-gray-800 min-h-[90vh] ${timelineAnim} ${timelineScrollAnim}`}
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
                {[0, 1, 2, 3, 4, 5, 6, 7].map((step, i) => {
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
                                  ? "PUBG-Mobile Tournament"
                                  : i === 4
                                    ? "Idea Pitching Competition"
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
                                    : i === 7
                                      ? "NEXTGEN INNOVATORS EXPO"
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
          className={`py-16 bg-f3f7f0 dark:bg-gray-900 ${sponsorsAnim} ${sponsorsScrollAnim} hidden`}
          role="region"
          aria-label="Sponsors"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold mb-12 text-teal-dark text-center">
              Our Sponsors
            </h2>
            <div className="grid grid-cols-1 gap-12">
              {/* Title Sponsor */}
              <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-xl p-8 shadow-xl border-4 border-teal dark:border-teal/80 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-teal/5 to-transparent dark:from-teal/10"></div>
                <h3 className="text-2xl font-bold text-teal-dark dark:text-teal mb-6 text-center relative">Title Sponsor</h3>
                <div className="flex justify-center relative">
                  <div className="w-32 h-32 rounded-full bg-white dark:bg-gray-700 border-4 border-teal dark:border-teal/80 flex items-center justify-center shadow-lg">
                    <span className="text-gray-400 dark:text-gray-500">Logo</span>
                  </div>
                </div>
              </div>

              {/* Gold Sponsors */}
              <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-xl p-8 shadow-xl border-4 border-yellow-400 dark:border-yellow-500/80 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/5 to-transparent dark:from-yellow-500/10"></div>
                <h3 className="text-2xl font-bold text-yellow-600 dark:text-yellow-400 mb-6 text-center relative">Gold Sponsors</h3>
                <div className="flex justify-center gap-8 relative">
                  {[1, 2].map((idx) => (
                    <div key={idx} className="w-28 h-28 rounded-full bg-white dark:bg-gray-700 border-4 border-yellow-400 dark:border-yellow-500/80 flex items-center justify-center shadow-lg">
                      <span className="text-gray-400 dark:text-gray-500">Logo</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Silver Sponsors */}
              <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-xl p-8 shadow-xl border-4 border-gray-400 dark:border-gray-500/80 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-400/5 to-transparent dark:from-gray-500/10"></div>
                <h3 className="text-2xl font-bold text-gray-600 dark:text-gray-400 mb-6 text-center relative">Silver Sponsors</h3>
                <div className="flex justify-center gap-6 flex-wrap relative">
                  {[1, 2, 3, 4].map((idx) => (
                    <div key={idx} className="w-24 h-24 rounded-full bg-white dark:bg-gray-700 border-4 border-gray-400 dark:border-gray-500/80 flex items-center justify-center shadow-lg">
                      <span className="text-gray-400 dark:text-gray-500">Logo</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bronze Sponsors */}
              <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-xl p-8 shadow-xl border-4 border-amber-600 dark:border-amber-500/80 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-600/5 to-transparent dark:from-amber-500/10"></div>
                <h3 className="text-2xl font-bold text-amber-700 dark:text-amber-500 mb-6 text-center relative">Bronze Sponsors</h3>
                <div className="flex justify-center gap-6 flex-wrap relative">
                  {[1, 2, 3, 4].map((idx) => (
                    <div key={idx} className="w-20 h-20 rounded-full bg-white dark:bg-gray-700 border-4 border-amber-600 dark:border-amber-500/80 flex items-center justify-center shadow-lg">
                      <span className="text-gray-400 dark:text-gray-500">Logo</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Internet Sponsors */}
              <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-xl p-8 shadow-xl border-4 border-purple-500 dark:border-purple-400/80 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent dark:from-purple-400/10"></div>
                <h3 className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-6 text-center relative">Internet Sponsors</h3>
                <div className="flex justify-center relative">
                  <div className="w-28 h-28 rounded-full bg-white dark:bg-gray-700 border-4 border-purple-500 dark:border-purple-400/80 flex items-center justify-center shadow-lg">
                    <span className="text-gray-400 dark:text-gray-500">Logo</span>
                  </div>
                </div>
              </div>

              {/* Food Sponsors */}
              <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-xl p-8 shadow-xl border-4 border-green-500 dark:border-green-400/80 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent dark:from-green-400/10"></div>
                <h3 className="text-2xl font-bold text-green-600 dark:text-green-400 mb-6 text-center relative">Food Sponsors</h3>
                <div className="flex justify-center gap-6 flex-wrap relative">
                  {[1, 2, 3].map((idx) => (
                    <div key={idx} className="w-24 h-24 rounded-full bg-white dark:bg-gray-700 border-4 border-green-500 dark:border-green-400/80 flex items-center justify-center shadow-lg">
                      <span className="text-gray-400 dark:text-gray-500">Logo</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Drink Sponsors */}
              <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-xl p-8 shadow-xl border-4 border-blue-400 dark:border-blue-500/80 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400/5 to-transparent dark:from-blue-500/10"></div>
                <h3 className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-6 text-center relative">Drink Sponsors</h3>
                <div className="flex justify-center gap-8 relative">
                  {[1, 2].map((idx) => (
                    <div key={idx} className="w-24 h-24 rounded-full bg-white dark:bg-gray-700 border-4 border-blue-400 dark:border-blue-500/80 flex items-center justify-center shadow-lg">
                      <span className="text-gray-400 dark:text-gray-500">Logo</span>
                    </div>
                  ))}
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
                  href="mailto:innosphere.pu@gmail.com "
                  className="text-white hover:text-teal-light transition-colors"
                >
                  innosphere.pu@gmail.com 
                </a>
              </p>
              <p className="flex items-center">
                <div className="flex flex-col space-y-2">
                  <span className="text-white hover:text-teal-light transition-colors">
                    +977-9819295913 (Secretary - Tech Club)
                  </span>
                  <span className="text-white hover:text-teal-light transition-colors">
                    +977-9865379393 (Innosphere Coordinator)
                  </span>
                </div>
              </p>
              <p className="flex items-center">
                <span className="text-white hover:text-teal-light transition-colors">
                  Pokhara University, Pokhara Metropolitan City-30, Kaski

                </span>
              </p>
            </div>
          </div>
          <div>
            <h2 className="text-xl font-bold mb-4 text-white">Quick Links</h2>
            <ul className="space-y-2">
               <li>
                <a
                  href="#about"
                  className="text-white hover:text-teal-light transition-colors"
                >
                  About
                </a>
              </li>
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
