export default function Booking() {
  return (
    <form className="max-w-lg bg-white p-6 rounded-xl shadow">
      <h2 className="text-xl font-bold mb-4">Booking Request</h2>

      <input className="input" placeholder="Date" />
      <input className="input" placeholder="Time" />
      <input className="input" placeholder="Duration (hours)" />
      <input className="input" placeholder="Location / Online" />

      <button className="mt-4 w-full bg-pinky-500 text-white py-2 rounded">
        Submit Request
      </button>
    </form>
  );
}
