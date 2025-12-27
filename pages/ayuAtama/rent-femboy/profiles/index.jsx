import Link from "next/link";

const MOCK = [
  { id: "1", name: "Luna", rate: "$30/hr", bio: "Cute & friendly" },
  { id: "2", name: "Mika", rate: "$25/hr", bio: "Soft voice, chill vibes" },
];

export default function Profiles() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Available Companions</h2>

      <div className="grid md:grid-cols-3 gap-6">
        {MOCK.map((p) => (
          <Link
            key={p.id}
            href={`/ayuAtama/rent-femboy/profiles/${p.id}`}
            className="bg-white rounded-xl shadow border p-4 hover:shadow-lg"
          >
            <div className="h-40 bg-pinky-100 rounded mb-4" />
            <h3 className="font-semibold text-pinky-600">{p.name}</h3>
            <p className="text-sm text-gray-600">{p.bio}</p>
            <p className="mt-2 font-medium">{p.rate}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
