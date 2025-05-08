import { useState } from 'react';
import { CheckCircleIcon } from 'lucide-react';
import usePageTitle from '../hooks/usePageTitle';

export default function HelpPage() {
    usePageTitle('Help');

    const [sent, setSent] = useState(false);
    const [form, setForm] = useState({ subject: '', message: '' });

    const handle = (k, v) => setForm({ ...form, [k]: v });

    const fakeSend = () => {
        /* Simulates a network delay */
        setSent(true);
        setTimeout(() => setSent(false), 3000);
        setForm({ subject: '', message: '' });
    };

    return (
        <div className="max-w-3xl mx-auto px-6 space-y-12">
            <h1 className="text-4xl font-bold text-center mt-8">Help &amp; Support</h1>

            {/* ---------- ABOUT ---------- */}
            <section className="bg-white shadow rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">About DiaGuard</h2>
                <p className="text-sm leading-relaxed text-gray-700">
                    DiaGuard is an educational diabetes-risk assistant created as a final Capstone project. It combines machine-learning predictions with explainable AI and actionable recommendations.
                </p>
            </section>

            {/* ---------- FAQ ---------- */}
            <section className="bg-white shadow rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-6">Frequently asked questions</h2>

                <Faq q="Is my data stored securely?">
                    Yes. All requests travel over HTTPS and your health inputs are kept in
                    a protected database. Tokens are encrypted and never exposed.
                </Faq>

                <Faq q="What does the confidence score mean?">
                    It shows how sure the model is about its prediction; higher values (&gt; 80 %) mean the pattern was very clear in the training data.
                </Faq>

                <Faq q="Can I delete my account?">
                    Account and data deletion will be available in a future release. Meanwhile,
                    please e-mail the admin address below and we'll handle it manually.
                </Faq>
            </section>

            {/* ---------- CONTACT ---------- */}
            <section className="bg-white shadow rounded-lg p-6 space-y-4">
                <h2 className="text-xl font-semibold">Contact us</h2>
                <p className="text-sm text-gray-700">
                    Email:&nbsp;
                    <a
                        href="mailto:karlzeeny@gmail.com"
                        className="text-primary hover:underline">
                        karlzeeny@gmail.com
                    </a>
                </p>

                {/* contact form */}
                <div className="space-y-3">
                    <input
                        type="text"
                        placeholder="Subject"
                        className="w-full border rounded p-3 text-sm"
                        value={form.subject}
                        onChange={(e) => handle('subject', e.target.value)} />
                    <textarea
                        rows={4}
                        placeholder="Your message"
                        className="w-full border rounded p-3 text-sm resize-none"
                        value={form.message}
                        onChange={(e) => handle('message', e.target.value)} />

                    <button
                        onClick={fakeSend}
                        disabled={!form.subject || !form.message}
                        className="py-2 px-6 bg-primary text-white rounded disabled:opacity-40">
                        Send message
                    </button>

                    {sent && (
                        <p className="flex items-center gap-1 text-sm text-green-600">
                            <CheckCircleIcon size={16} /> Thanks! We'll get back to you.
                        </p>
                    )}
                </div>
            </section>
        </div>
    );
}

/* ---------- tiny helper ---------- */
function Faq({ q, children }) {
    const [open, setOpen] = useState(false);
    return (
        <details
            open={open}
            onToggle={() => setOpen(!open)}
            className="border-b last:border-0 py-2"
        >
            <summary className="cursor-pointer select-none text-sm font-medium">
                {q}
            </summary>
            <p className="mt-2 text-sm text-gray-700">{children}</p>
        </details>
    );
}
