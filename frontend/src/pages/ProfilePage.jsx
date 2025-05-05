import { useEffect, useState } from 'react';
import { getMe, updateMe } from '../services/auth';
import Spinner from '../components/Spinner';
import usePageTitle from '../hooks/usePageTitle';

const READ_ONLY = ['username', 'email', 'role'];

export default function ProfilePage() {
    usePageTitle('Profile');

    const [form, setForm] = useState(null);
    const [busy, setBusy] = useState(false);
    const [msg, setMsg] = useState('');

    useEffect(() => {
        getMe().then((r) => setForm(r.data));
    }, []);

    if (!form) return <Spinner />;

    const update = (k, v) => setForm({ ...form, [k]: v });

    const save = async () => {
        setBusy(true);
        try {
            await updateMe(form);
            setMsg('Saved!');
            setTimeout(() => setMsg(''), 2500);
        } finally {
            setBusy(false);
        }
    };

    const fields = [
        ['username', 'Username', true],
        ['email', 'Email', true],
        ['first_name', 'First name'],
        ['last_name', 'Last name'],
        ['date_of_birth', 'Date of birth'],
        ['gender', 'Gender (M/F)'],
        ['address', 'Address', true],
        ['city', 'City'],
        ['state', 'State'],
        ['country', 'Country'],
        ['postal_code', 'Postal code'],
    ];

    return (
        <div className="max-w-4xl mx-auto px-6 space-y-12">
            <h2 className="text-3xl font-bold text-center mt-8">
                Edit Profile
            </h2>

            {/* profile card */}
            <div className="bg-white shadow rounded-lg p-8">
                <div className="grid md:grid-cols-2 gap-6">
                    {fields.map(([key, label, wide]) => (
                        <Field
                            key={key}
                            label={label}
                            value={form[key] ?? ''}
                            onChange={(v) => update(key, v)}
                            readOnly={READ_ONLY.includes(key)}
                            type={key === 'date_of_birth' ? 'date' : 'text'}
                            wide={wide}
                        />
                    ))}
                </div>

                <button
                    onClick={save}
                    disabled={busy}
                    className="mt-8 w-full py-3 bg-primary text-white rounded hover:bg-primary/90 disabled:opacity-50"
                >
                    {busy ? 'Saving…' : 'Save changes'}
                </button>
                {msg && <p className="text-center text-green-600 text-sm mt-3">{msg}</p>}
            </div>
        </div>
    );
}

function Field({ label, value, onChange, readOnly, type, wide }) {
    return (
        <div className={wide ? 'md:col-span-2' : ''}>
            <label className="text-xs text-gray-500">{label}</label>
            <input
                type={type}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                disabled={readOnly}
                className={`mt-1 w-full border rounded p-3 text-sm ${readOnly ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : ''
                    }`}
            />
        </div>
    );
}
