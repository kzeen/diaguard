import { useEffect, useState } from 'react';
import { fetchAllPredictions } from '../services/predictions';
import Spinner from './Spinner';

export default function InputsTable() {
  const [rows, setRows] = useState(null);

  useEffect(() => {
    fetchAllPredictions().then((arr) =>
      setRows(
        arr
          .slice(-5)
          .reverse()
          .map((p) => ({
            id: p.id,
            ...p.health_input,          
          }))
      )
    );
  }, []);

  if (!rows) return <Spinner />;

  return (
    <div className="bg-white shadow rounded-lg p-6 overflow-auto mx-auto max-w-3xl">
      <h3 className="text-lg font-semibold mb-4 text-center">Recent Inputs</h3>
      <table className="min-w-full text-sm">
        <thead>
          <tr className="text-left text-gray-500">
            <th className="pr-4">Date</th>
            <th className="pr-4">BMI</th>
            <th className="pr-4">HbA1c</th>
            <th className="pr-4">Glucose</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id} className="border-t">
              <td className="pr-4 py-2">
                {new Date(r.created_at).toLocaleDateString()}
              </td>
              <td className="pr-4">{r.bmi}</td>
              <td className="pr-4">{r.hba1c}</td>
              <td className="pr-4">{r.blood_glucose}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}