import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPrediction } from '../services/predictions';
import { FormInput, FormSelect } from '../components/FormInput';
import Spinner from '../components/Spinner';
import ButtonSpinner from '../components/ButtonSpinner';
import { useAuth } from '../context/AuthContext';
import usePageTitle from '../hooks/usePageTitle';
import toast from 'react-hot-toast';

const genderOpts = ['Male', 'Female', 'Other'];
const smokeOpts = [
  'current',
  'ever',
  'former',
  'never',
  'not current',
  'No Info',
];

function calcAge(dob) {
  if (!dob) return '';
  const diff = Date.now() - new Date(dob).getTime();
  return Math.floor(diff / 31557600000);
}

export default function PredictPage() {
  usePageTitle('New Prediction');

  const { user } = useAuth();
  const nav = useNavigate();

  const [values, setValues] = useState({
    gender: user.gender === 'M' ? 'Male' : user.gender === 'F' ? 'Female' : '',
    age: user.date_of_birth ? calcAge(user.date_of_birth) : '',
    hypertension: false,
    heart_disease: false,
    smoking_history: '',
    bmi: '',
    hba1c: '',
    blood_glucose: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Prefill gender and age if user profile updates
  useEffect(() => {
    setValues(v => ({
      ...v,
      gender: user.gender === 'M' ? 'Male' : user.gender === 'F' ? 'Female' : '',
      age: user.date_of_birth ? calcAge(user.date_of_birth) : v.age,
    }));
  }, [user.gender, user.date_of_birth]);

  const onChange = (e) => {
    const { name, type, value, checked } = e.target;
    setValues((v) => ({ ...v, [name]: type === 'checkbox' ? checked : value }));
  };

  const validate = () => {
    const e = {};
    if (!values.gender) e.gender = 'Select gender';
    if (!values.age || values.age < 1 || values.age > 120) e.age = '1‑120';
    if (!values.smoking_history) e.smoking_history = 'Required';
    if (!values.bmi) e.bmi = 'Required';
    if (!values.hba1c) e.hba1c = 'Required';
    if (!values.blood_glucose) e.blood_glucose = 'Required';
    setErrors(e);
    return !Object.keys(e).length;
  };

  const handleBackendErrors = (data) => {
    const e = {};
    Object.entries(data).forEach(([field, msgs]) => {
      e[field] = Array.isArray(msgs) ? msgs.join(' ') : msgs;
    });
    setErrors(e);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      setLoading(true);
      const payload = {
        ...values,
        age: Number(values.age),
        bmi: Number(values.bmi),
        hba1c: Number(values.hba1c),
        blood_glucose: Number(values.blood_glucose),
      };
      const pred = await createPrediction(payload);
      nav(`/predict/${pred.id}/result`);
    } catch (err) {
      if (err.response?.status === 400) handleBackendErrors(err.response.data);
      else toast.error('Submission failed');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !Object.keys(errors).length) return <Spinner />;

  return (
    <div className="max-w-screen-md mx-auto bg-white shadow rounded-lg p-8">
      <h2 className="text-xl font-bold mb-6 text-center">
        New Prediction Input
      </h2>

      <form onSubmit={onSubmit} className="grid sm:grid-cols-2 gap-4">
        <FormSelect
          label="Gender"
          name="gender"
          value={values.gender}
          onChange={onChange}
          options={genderOpts}
          error={errors.gender}
        />

        <FormInput
          label="Age"
          name="age"
          type="number"
          value={values.age}
          onChange={onChange}
          error={errors.age}
        />

        {/* centered check‑boxes */}
        <div className="sm:col-span-2 flex justify-center gap-8 mb-2">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="hypertension"
              checked={values.hypertension}
              onChange={onChange}
            />
            Hypertension
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="heart_disease"
              checked={values.heart_disease}
              onChange={onChange}
            />
            Heart disease
          </label>
        </div>

        <div className="sm:col-span-2">
          <FormSelect
            label="Smoking history"
            name="smoking_history"
            value={values.smoking_history}
            onChange={onChange}
            options={smokeOpts}
            error={errors.smoking_history} />
        </div>

        <div className="sm:col-span-1">
          <FormInput
            label="BMI"
            name="bmi"
            type="number"
            step="0.1"
            unit="kg/m²"
            value={values.bmi}
            onChange={onChange}
            error={errors.bmi}
            className="sm:col-span-1" />
        </div>

        <div className="sm:col-span-1">
          <FormInput
            label="HbA1c (%)"
            name="hba1c"
            type="number"
            step="0.1"
            unit="%"
            value={values.hba1c}
            onChange={onChange}
            error={errors.hba1c} />
        </div>

        <div className="sm:col-span-2">
          <FormInput
            label="Blood glucose"
            name="blood_glucose"
            type="number"
            step="1"
            unit="mg/dL"
            value={values.blood_glucose}
            onChange={onChange}
            error={errors.blood_glucose}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="sm:col-span-2 w-full bg-primary text-white py-2 rounded hover:bg-primary/90 transition disabled:opacity-60 flex items-center justify-center gap-2"
        >
          {loading && <ButtonSpinner />}
          Predict Risk
        </button>
      </form>
    </div>
  );
}