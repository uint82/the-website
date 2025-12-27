import Link from "next/link";

export default function ProfileDetail() {
  return (
    <div className="grid md:grid-cols-2 gap-8">
      <div className="h-80 bg-pinky-100 rounded-xl" />

      <div>
        <h1 className="text-3xl font-bold text-pinky-600">Luna</h1>
        <p className="text-gray-600 mt-2">
          Friendly, cute, online or offline sessions.
        </p>

        <p className="mt-4 font-semibold">Rate: $30 / hour</p>

        <Link
          href="/ayuAtama/rent-femboy/booking/1"
          className="inline-block mt-6 bg-pinky-500 text-white px-6 py-3 rounded-lg"
        >
          Book Now
        </Link>
      </div>
    </div>
  );
}
