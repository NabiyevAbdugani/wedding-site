"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";

export default function Home() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const audioRef = useRef(null);

  // Таймер ҳолати
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  // RSVP форма ҳолатлари
  const [name, setName] = useState("");
  const [status, setStatus] = useState(""); // 'yes' ёки 'no'
  const [guests, setGuests] = useState("1");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Клиент томонга тўлиқ юкланганини аниқлаш (Hydration хатосини олдини олиш учун)
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Ортга ҳисоблаш логикаси (23-Август, 2026)
  useEffect(() => {
    const targetDate = new Date("2026-08-23T18:00:00");

    const calculateTime = () => {
      const now = new Date();
      const difference = targetDate - now;

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const d = Math.floor(difference / (1000 * 60 * 60 * 24));
      const h = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const m = Math.floor((difference / 1000 / 60) % 60);
      const s = Math.floor((difference / 1000) % 60);

      setTimeLeft({ days: d, hours: h, minutes: m, seconds: s });
    };

    calculateTime();
    const timerId = setInterval(calculateTime, 1000);
    return () => clearInterval(timerId);
  }, []);

  // Автоматик мусиқа логикаси
  useEffect(() => {
    const playAudio = () => {
      if (audioRef.current) {
        audioRef.current
          .play()
          .then(() => setIsPlaying(true))
          .catch((err) => console.log("Autoplay кутилмоқда:", err));
      }
    };

    const timer = setTimeout(playAudio, 1000);
    window.addEventListener("click", playAudio, { once: true });

    return () => {
      clearTimeout(timer);
      window.removeEventListener("click", playAudio);
    };
  }, []);

  const toggleMusic = () => {
    if (!isPlaying) {
      audioRef.current.play().catch(() => alert("Экранга бир марта босинг."));
      setIsPlaying(true);
    } else {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  // ТЕЛЕГРАМГА ХАБАР ЮБОРИШ
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !status) {
      alert("Илтимос, исмингизни ёзинг ва танловни белгиланг!");
      return;
    }

    setIsSubmitting(true);

    const attendance =
      status === "yes" ? "Албатта боради 👍" : "Афсуски, бора олмайди 😔";
    const guestCount = status === "yes" ? guests : "0";

    const text =
      "🔔 Янги таклифнома жавоби!\n\n" +
      "👤 Меҳмон: " +
      name +
      "\n" +
      "❓ Ташриф: " +
      attendance +
      "\n" +
      "👥 Неча киши: " +
      guestCount +
      " киши";

    try {
      const response = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: text }),
      });

      if (response.ok) {
        setIsSubmitted(true);
      } else {
        alert("Хабор юборишда хатолик бўлди.");
      }
    } catch (error) {
      alert("Xatolik yuz berdi, qayta urining");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isMounted) return null;

  return (
    <main className="min-h-screen bg-[#0f2922] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#143d33] via-[#0f2922] to-[#071410] flex items-center justify-center p-4 py-12 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')]"></div>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="max-w-md w-full backdrop-blur-md bg-white/[0.03] shadow-[0_0_50px_rgba(0,0,0,0.5)] rounded-[2.5rem] overflow-hidden border border-amber-500/30 p-6 sm:p-10 text-center relative"
      >
        <div className="absolute top-4 left-4 text-amber-400/20 text-xl font-serif">
          ⚜️
        </div>
        <div className="absolute top-4 right-4 text-amber-400/20 text-xl font-serif">
          ⚜️
        </div>

        <div className="text-amber-400 text-3xl mb-2 tracking-widest animate-pulse">
          ⚜️
        </div>

        <h2 className="text-amber-400 font-sans text-[10px] tracking-[0.4em] font-bold mb-6 uppercase">
          ТЎЙГА ТАКЛИФНОМА
        </h2>

        <div className="my-8 space-y-2">
          <h1 className="text-5xl sm:text-6xl font-serif bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-200 bg-clip-text text-transparent font-bold tracking-wide drop-shadow-sm">
            Абдуғани
          </h1>
          <p className="text-2xl text-amber-300/70 font-serif italic">va</p>
          <h1 className="text-5xl sm:text-6xl font-serif bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-200 bg-clip-text text-transparent font-bold tracking-wide drop-shadow-sm">
            Соҳибахон
          </h1>
          <p className="text-amber-100/60 text-xs tracking-wide font-light mt-4 block">
            Ҳаётимиздаги энг қувончли кунда биз билан бирга бўлинг
          </p>
        </div>

        <div className="border border-amber-500/20 py-4 my-6 bg-amber-950/20 rounded-2xl px-4 backdrop-blur-sm">
          <p className="text-base sm:text-lg font-medium tracking-[0.2em] text-amber-300 uppercase">
            23-АВГУСТ, 2026 йил
          </p>
          <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-amber-400 to-transparent mx-auto my-2"></div>
          <p className="text-emerald-100/80 text-xs sm:text-sm font-light tracking-wide">
            Якшанба, соат 18:00 да
          </p>
        </div>

        <div className="mb-8">
          <p className="text-[10px] text-amber-400/60 tracking-[0.25em] uppercase mb-3">
            Тўй бошланишига қолди:
          </p>
          <div className="grid grid-cols-4 gap-2.5 max-w-xs mx-auto">
            <div className="bg-white/[0.04] border border-amber-500/10 rounded-xl p-2.5 backdrop-blur-sm">
              <span className="text-xl font-bold text-amber-200 block tabular-nums drop-shadow">
                {timeLeft.days}
              </span>
              <span className="text-[9px] text-emerald-200/50 uppercase tracking-wider block mt-0.5">
                Кун
              </span>
            </div>
            <div className="bg-white/[0.04] border border-amber-500/10 rounded-xl p-2.5 backdrop-blur-sm">
              <span className="text-xl font-bold text-amber-200 block tabular-nums drop-shadow">
                {timeLeft.hours}
              </span>
              <span className="text-[9px] text-emerald-200/50 uppercase tracking-wider block mt-0.5">
                Соат
              </span>
            </div>
            <div className="bg-white/[0.04] border border-amber-500/10 rounded-xl p-2.5 backdrop-blur-sm">
              <span className="text-xl font-bold text-amber-200 block tabular-nums drop-shadow">
                {timeLeft.minutes}
              </span>
              <span className="text-[9px] text-emerald-200/50 uppercase tracking-wider block mt-0.5">
                Дақиқа
              </span>
            </div>
            <div className="bg-white/[0.04] border border-amber-400/30 rounded-xl p-2.5 backdrop-blur-sm shadow-[0_0_10px_rgba(245,158,11,0.1)]">
              <span className="text-xl font-bold text-amber-400 block tabular-nums drop-shadow animate-pulse">
                {timeLeft.seconds}
              </span>
              <span className="text-[9px] text-amber-400/60 uppercase tracking-wider block mt-0.5">
                Сония
              </span>
            </div>
          </div>
        </div>

        <div className="text-emerald-100/80 text-xs sm:text-sm leading-relaxed mb-8 font-light px-2">
          <span className="font-semibold text-amber-300 block mb-1 tracking-wider uppercase text-[11px]">
            Тантана манзили:
          </span>
          Тошкент, Тақачи кўчаси, 50-уй
          <br />
          <span className="text-amber-200 font-serif font-medium text-base sm:text-lg block mt-1 drop-shadow-sm">
            "Исроил Хожиота" мажмуаси
          </span>
        </div>

        {/* Хариталар ва Мусиқа */}
        <div className="flex flex-col gap-2.5 mb-8">
          <div className="grid grid-cols-2 gap-2">
            <a
              href="https://yandex.ru/maps/org/isroil_xojiota/142127714889"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-amber-500 text-slate-950 font-bold py-2.5 px-4 rounded-xl shadow-md hover:bg-amber-400 active:scale-[0.98] transition-all text-xs tracking-wide flex items-center justify-center gap-1"
            >
              🗺️ Яндекс Харита
            </a>
            <a
              href="https://maps.google.com/?q=Isroil+Xojiota+Toshkent"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-emerald-600 text-white font-bold py-2.5 px-4 rounded-xl shadow-md hover:bg-emerald-500 active:scale-[0.98] transition-all text-xs tracking-wide flex items-center justify-center gap-1"
            >
              📍 Google Maps
            </a>
          </div>

          <button
            onClick={toggleMusic}
            className={`border rounded-xl text-xs font-semibold py-2.5 px-6 active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2 backdrop-blur-sm ${isPlaying ? "border-amber-400 text-amber-400 bg-amber-400/10" : "border-amber-500/30 text-amber-300/80 hover:bg-white/5"}`}
          >
            <span className={isPlaying ? "animate-pulse" : ""}>🎵</span>
            {isPlaying ? "Мусиқани тўхтатиш" : "Мусиқа садоси остида ўқиш"}
          </button>
        </div>

        {/* RSVP СЎРОВНОМА БЛОКИ */}
        <div className="bg-white/[0.02] rounded-2xl p-5 border border-amber-500/10 text-left backdrop-blur-sm">
          <h3 className="text-xs font-bold text-amber-300 mb-4 text-center uppercase tracking-[0.15em]">
            Ташрифингизни тасдиқланг
          </h3>

          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-medium text-emerald-200/60 mb-1 tracking-wider uppercase">
                  Исм ва Фамилиянгиз:
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Масалан: Алиев Вали"
                  className="w-full px-4 py-2.5 bg-slate-950/40 border border-amber-500/20 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-amber-400 text-amber-100 placeholder-emerald-100/20 transition-all"
                />
              </div>

              <div>
                <label className="block text-[10px] font-medium text-emerald-200/60 mb-1 tracking-wider uppercase">
                  Тўйга кела оласизми?
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setStatus("yes")}
                    className={`py-2.5 px-3 rounded-xl text-xs font-semibold border transition-all ${status === "yes" ? "bg-amber-400/20 border-amber-400 text-amber-200 shadow-[0_0_15px_rgba(245,158,11,0.1)]" : "bg-slate-950/20 border-amber-500/10 text-emerald-100/60 hover:bg-white/5"}`}
                  >
                    Албатта бораман 👍
                  </button>
                  <button
                    type="button"
                    onClick={() => setStatus("no")}
                    className={`py-2.5 px-3 rounded-xl text-xs font-semibold border transition-all ${status === "no" ? "bg-rose-950/30 border-rose-500/50 text-rose-300" : "bg-slate-950/20 border-amber-500/10 text-emerald-100/60 hover:bg-white/5"}`}
                  >
                    Бора олмайман 😔
                  </button>
                </div>
              </div>

              {status === "yes" && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <label className="block text-[10px] font-medium text-emerald-200/60 mb-1 tracking-wider uppercase">
                    Меҳмонлар сони:
                  </label>
                  <select
                    value={guests}
                    onChange={(e) => setGuests(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-950/50 border border-amber-500/20 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-amber-400 text-amber-200"
                  >
                    <option value="1" className="bg-[#0f2922]">
                      1 киши
                    </option>
                    <option value="2" className="bg-[#0f2922]">
                      2 киши (Жуфтлик)
                    </option>
                    <option value="3" className="bg-[#0f2922]">
                      3 киши
                    </option>
                    <option value="4" className="bg-[#0f2922]">
                      4 киши
                    </option>
                  </select>
                </motion.div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-bold py-2.5 rounded-xl text-xs sm:text-sm shadow-md hover:from-amber-300 hover:to-amber-400 transition-all active:scale-[0.99] disabled:from-slate-700 disabled:to-slate-800 disabled:text-slate-400 tracking-wider uppercase mt-2"
              >
                {isSubmitting ? "Жавоб юборилмоқда..." : "Жавобни жўнатиш"}
              </button>
            </form>
          ) : (
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center py-6"
            >
              <span className="text-4xl block mb-2 animate-bounce">✨</span>
              <p className="text-xs sm:text-sm font-medium text-amber-300 tracking-wide">
                Жавобингиз қабул қилинди. Катта раҳмат!
              </p>
            </motion.div>
          )}
        </div>

        <div className="mt-8 text-[9px] text-amber-400/40 tracking-[0.5em] uppercase font-light">
          Биз сизни кутамиз
        </div>
      </motion.div>

      <audio ref={audioRef} loop>
        <source
          src="https://raw.githubusercontent.com/abduxana/music-hosting/main/izzatillo_shukurov_gulim.mp3"
          type="audio/mpeg"
        />
      </audio>
    </main>
  );
}
