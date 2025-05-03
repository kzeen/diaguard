/* eslint-disable no-irregular-whitespace */
import heroImg from '../assets/landing/hero.jpg';
import f1 from '../assets/landing/feature1.jpg';
import f2 from '../assets/landing/feature2.jpg';
import { NavLink } from 'react-router-dom';
import FeatureCard from '../components/FeatureCard';

export default function LandingPage() {
  return (
    <>
      {/* ---------- HERO SECTION ---------- */}
      <section className="bg-white">
        <div className="max-w-6xl mx-auto px-6 py-20 grid lg:grid-cols-2 gap-12 items-center">
          {/* Text */}
          <div>
            <h1 className="text-4xl font-bold leading-tight text-dark">
              Understand Your <span className="text-primary">Diabetes Risk</span>{' '}
              <br />— in Seconds, with Transparency
            </h1>
            <p className="mt-6 text-gray-600 text-lg">
              DiaGuard predicts your diabetes risk, explains <em>why</em>, and
              gives you clear action steps — all in one simple dashboard.
            </p>

            <div className="mt-10 space-x-4">
              <NavLink
                to="/signup"
                className="px-6 py-3 text-white bg-primary rounded-md text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                Get Started Free
              </NavLink>
              <NavLink
                to="/login"
                className="px-6 py-3 text-primary border border-primary rounded-md text-sm font-medium hover:bg-primary hover:text-white transition-colors"
              >
                I already have an account
              </NavLink>
            </div>
          </div>

          {/* Illustration */}
          <div className="relative">
            <img
              src={heroImg}
              alt="DiaGuard illustration"
              className="rounded-lg shadow-lg"
            />
          </div>
        </div>
      </section>

      {/* ---------- FEATURES SECTION ---------- */}
      <section className="bg-light">
        <div className="max-w-6xl mx-auto px-6 py-24">
          <h2 className="text-3xl font-bold text-center mb-12">
            Why DiaGuard?
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            <FeatureCard
              imgSrc={f1}
              title="Instant, Accurate Predictions"
              desc="Robust machine‑learning models trained on curated datasets give you a science‑backed risk score in seconds."
            />
            <FeatureCard
              imgSrc={f2}
              title="Transparent Explanations"
              desc="Powered by SHAP & LIME, DiaGuard shows which factors drive your score so you know exactly what to improve."
            />
          </div>
        </div>
      </section>

      {/* ---------- CTA SECTION ---------- */}
      <section className="bg-primary text-white">
        <div className="max-w-6xl mx-auto px-6 py-20 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Ready to take control of your health?
          </h2>
          <p className="mb-8 text-lg">
            Join DiaGuard for free and get your first prediction in under a
            minute.
          </p>
          <NavLink
            to="/signup"
            className="inline-block px-10 py-4 bg-white text-primary font-semibold rounded-md hover:bg-white/90"
          >
            Sign up now
          </NavLink>
        </div>
      </section>
    </>
  );
}