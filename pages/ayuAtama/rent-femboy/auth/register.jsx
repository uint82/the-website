import { useState, useEffect } from "react";
import { useRouter } from "next/router";

const RegisterSection = () => {
  const router = useRouter();

  const baseAPIUrl = process.env.NEXT_PUBLIC_API_URL;
  const homeUrl = process.env.NEXT_PUBLIC_FEM_RENT_URL;

  const BACKGROUNDS = {
    RENTER: "/ayuAtama/pengering1.png",
    FEMBOY: "/ayuAtama/pengering2.png",
  };
  const [activeBg, setActiveBg] = useState(BACKGROUNDS.RENTER);
  const [nextBg, setNextBg] = useState(null);
  const [isFading, setIsFading] = useState(false);

  const [role, setRole] = useState("RENTER");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [baseRate, setBaseRate] = useState("");
  const [image, setImage] = useState(null);

  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreePrivacy, setAgreePrivacy] = useState(false);
  const [agreeDisclaimer, setAgreeDisclaimer] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const targetBg = BACKGROUNDS[role];

    if (targetBg === activeBg) return;

    const img = new Image();
    img.src = targetBg;

    img.onload = () => {
      setNextBg(targetBg);
      setIsFading(true);

      // wait for fade animation to finish
      setTimeout(() => {
        setActiveBg(targetBg);
        setNextBg(null);
        setIsFading(false);
      }, 300); // must match CSS duration
    };
  }, [role]);

  async function uploadImage() {
    if (!image) return null;

    const formData = new FormData();
    formData.append("image", image);

    const res = await fetch(`${baseAPIUrl}/upload`, {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      throw new Error("Image upload failed");
    }

    const data = await res.json();
    return data.url;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    if (!agreeTerms || !agreePrivacy || !agreeDisclaimer) {
      setError("You must agree to all legal terms to continue");
      return;
    }

    setLoading(true);

    try {
      const imageUrl = await uploadImage();

      const payload = {
        email,
        password,
        role,
        imageUrl,
        legal: {
          terms: agreeTerms,
          privacy: agreePrivacy,
          disclaimer: agreeDisclaimer,
        },
      };

      if (role === "RENTER") {
        payload.nickname = nickname;
      }

      if (role === "FEMBOY") {
        payload.displayName = displayName;
        payload.bio = bio;
        payload.baseRate = Number(baseRate);
      }

      const res = await fetch(`${baseAPIUrl}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Registration failed");
      }

      router.push(`${homeUrl}/auth/login`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section>
      <div className="grid min-h-screen md:grid-cols-2">
        {/* LEFT */}
        <div className="flex flex-col items-center justify-center bg-white">
          <div className="max-w-lg px-5 py-16 text-center md:px-10 md:py-24 lg:py-32">
            <h2 className="mb-8 text-3xl font-bold md:text-5xl">
              You're entering the rabbit hole!
            </h2>

            <form
              onSubmit={handleSubmit}
              className="mx-auto mb-4 max-w-sm pb-4 text-left"
            >
              {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="mb-4 w-full border border-black bg-[#f2f2f7] px-4 py-3 text-sm"
              >
                <option value="RENTER">Renter</option>
                <option value="FEMBOY">Femboy</option>
              </select>

              <input
                type="email"
                className="mb-4 w-full border border-black bg-[#f2f2f7] px-4 py-3 text-sm"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <input
                type="password"
                className="mb-4 w-full border border-black bg-[#f2f2f7] px-4 py-3 text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              {role === "RENTER" && (
                <input
                  className="mb-4 w-full border border-black bg-[#f2f2f7] px-4 py-3 text-sm"
                  placeholder="Nickname"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  required
                />
              )}

              {role === "FEMBOY" && (
                <>
                  <input
                    className="mb-4 w-full border border-black bg-[#f2f2f7] px-4 py-3 text-sm"
                    placeholder="Display Name"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    required
                  />

                  <textarea
                    className="mb-4 w-full border border-black bg-[#f2f2f7] px-4 py-3 text-sm"
                    placeholder="Bio"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    required
                  />

                  <input
                    type="number"
                    className="mb-4 w-full border border-black bg-[#f2f2f7] px-4 py-3 text-sm"
                    placeholder="Rate per hour"
                    value={baseRate}
                    onChange={(e) => setBaseRate(e.target.value)}
                    required
                  />
                </>
              )}

              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImage(e.target.files[0])}
                className="mb-4 w-full text-sm"
                required
              />

              {/* LEGAL CHECKBOXES */}
              <div className="mb-4 space-y-2 text-sm">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                  />
                  I agree to the Terms & Conditions
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={agreePrivacy}
                    onChange={(e) => setAgreePrivacy(e.target.checked)}
                  />
                  I agree to the Privacy Policy
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={agreeDisclaimer}
                    onChange={(e) => setAgreeDisclaimer(e.target.checked)}
                  />
                  I accept the Disclaimer
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center bg-[#276ef1] px-8 py-4 font-semibold text-white transition disabled:opacity-60
                  [box-shadow:rgb(171,_196,_245)_-8px_8px]
                  hover:[box-shadow:rgb(171,_196,_245)_0px_0px]"
              >
                {loading ? "Registering..." : "Create Account"}
              </button>
            </form>
            <p className="text-sm text-[#636262]">
              Already have an account?{" "}
              <a href="login" className="font-bold text-black">
                Login now
              </a>
            </p>
          </div>
        </div>

        {/* RIGHT */}
        <div className="relative flex items-center justify-center overflow-hidden">
          {/* Current background */}
          <div
            className="absolute inset-0 bg-cover bg-center transition-opacity duration-300"
            style={{
              backgroundImage: `url(${activeBg})`,
              opacity: isFading ? 0 : 1,
            }}
          />

          {/* Incoming background */}
          {nextBg && (
            <div
              className="absolute inset-0 bg-cover bg-center transition-opacity duration-300"
              style={{
                backgroundImage: `url(${nextBg})`,
                opacity: isFading ? 1 : 0,
              }}
            />
          )}

          {/* Overlay */}
          <div className="absolute inset-0 bg-black/50" />

          {/* Content */}
          <div className="relative z-10 max-w-lg px-5 py-16 text-white">
            {/* your text content */}
            <div className="mb-6 ml-2 flex h-14 w-14 items-center justify-center bg-[#276ef1] [box-shadow:rgb(171,_196,_245)_-8px_8px]">
              <img
                src="https://assets.website-files.com/6357722e2a5f19121d37f84d/6358f5ec37c8c32b17d1c725_Vector-9.svg"
                alt=""
                className="inline-block"
              />
            </div>
            <p className="mb-8 md:mb-12 lg:mb-16 text-white/90">
              One date, endless sparks—come meet the companion who knows exactly
              how to make you blush. And don't be afraid to show yourself off,
              many out there want you as companions (๑˘ ³˘)♥ (⁄ ⁄•⁄ω⁄•⁄ ⁄)⁄.
            </p>
            <p className="font-bold">Wahyu Pratama</p>
            <p className="text-sm text-white/80">Astolfo Enjoyer Developer</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RegisterSection;
