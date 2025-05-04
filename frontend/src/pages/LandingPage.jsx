/* eslint-disable no-irregular-whitespace */
import heroImg from '../assets/landing/hero.jpg';
import f1 from '../assets/landing/feature1.jpg';
import f2 from '../assets/landing/feature2.jpg';
import h1 from '../assets/landing/headshot1.jpeg';
import h2 from '../assets/landing/headshot2.jpeg';
import h3 from '../assets/landing/headshot3.jpeg';
import { NavLink } from 'react-router-dom';
import FeatureCard from '../components/FeatureCard';
import StepCard from '../components/StepCard';
import TestimonialCard from '../components/TestimonialCard';
import FAQItem from '../components/FAQItem';

export default function LandingPage() {
  return (
    <>
      {/* ---------- HERO SECTION ---------- */}
      <section className="bg-white" data-aos="fade-down">
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
              alt="Doctor illustration"
              className="rounded-lg shadow-lg"
              data-aos="zoom-in"
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
              data-aos="fade-right"
            />
            <FeatureCard
              imgSrc={f2}
              title="Transparent Explanations"
              desc="Powered by SHAP & LIME technologies, DiaGuard shows which factors drive your score so you know exactly what to improve."
              data-aos="fade-left"
            />
          </div>
        </div>
      </section>

      {/* ---------- HOW IT WORKS SECTION ---------- */}
      <section className="bg-white" data-aos="fade-up">
        <div className="max-w-6xl mx-auto px-6 py-24">
          <h2 className="text-3xl font-bold text-center mb-12">How DiaGuard Works</h2>

          <div className="grid lg:grid-cols-3 gap-10">
            <StepCard
              num="1"
              title="Enter Your Health Data"
              desc="Fill out a quick form with age, BMI, glucose & lifestyle info."
              data-aos="fade-right"
            />
            <StepCard
              num="2"
              title="Get an Instant Risk Score"
              desc="Our ML model analyses your inputs and predicts diabetes risk."
              data-aos="fade-up"
            />
            <StepCard
              num="3"
              title="See Why & What to Do"
              desc="SHAP & LIME explain the drivers, while our engine suggests actions."
              data-aos="fade-left"
            />
          </div>
        </div>
      </section>

      {/* ---------- TESTIMONIALS SECTION ---------- */}
      <section className="bg-light" data-aos="fade-up">
        <div className="max-w-6xl mx-auto px-6 py-24">
          <h2 className="text-3xl font-bold text-center mb-12">
            People reversing risk with DiaGuard
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <TestimonialCard
              quote="My risk dropped from high to low in just 8 weeks!"
              name="Brandon R."
              result="-35% risk score"
              img={h1}
              data-aos="zoom-in"
            />
            <TestimonialCard
              quote="Finally understand what my numbers mean—so empowering."
              name="Allison W."
              result="HbA1C down 1.2%"
              img={h2}
              data-aos="zoom-in"
            />
            <TestimonialCard
              quote="The explanations made it crystal‑clear what to change."
              name="Rodney P."
              result="Lost 8 lbs"
              img={h3}
              data-aos="zoom-in"
            />
          </div>
        </div>
      </section>

      {/* ---------- FAQ SECTION ---------- */}
      <section className="bg-white" data-aos="fade-up">
        <div className="max-w-4xl mx-auto px-6 py-24">
          <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>

          <FAQItem
            q="Is DiaGuard clinically validated?"
            a="Our model is trained on peer‑reviewed datasets and benchmarks comparable to published studies on diabetes risk prediction." 
          />
          <FAQItem
            q="How much does it cost?"
            a="DiaGuard is free during beta. Premium features will launch later at less than $5/month."
          />
          <FAQItem
            q="Will my data stay private?"
            a="Absolutely. All information is encrypted and never shared without your consent."
          />
        </div>
      </section>

      {/* ---------- CTA SECTION ---------- */}
      <section className="bg-primary text-white" data-aos="fade-up">
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