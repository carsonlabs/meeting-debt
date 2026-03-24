import { MeetingForm } from "@/components/MeetingForm";

export default function Home() {
  return (
    <main id="top" className="min-h-screen scroll-smooth">
      {/* Hero */}
      <section className="pt-20 pb-16 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="inline-block px-3 py-1 mb-6 text-xs font-medium tracking-wider uppercase bg-red-950 text-red-400 rounded-full border border-red-900">
            Free &middot; No signup &middot; Maximum guilt
          </div>
          <h1 className="text-5xl sm:text-6xl font-black tracking-tight leading-[1.1] mb-6">
            Your meetings have a{" "}
            <span className="text-red-500">price tag.</span>
          </h1>
          <p className="text-lg text-neutral-400 max-w-md mx-auto leading-relaxed">
            Calculate the true dollar cost of any meeting. Get a receipt.
            Feel the pain. Share it with your team so they feel it too.
          </p>
        </div>
      </section>

      {/* Calculator */}
      <section className="pb-20 px-4">
        <MeetingForm />
      </section>

      {/* Social proof / stats */}
      <section className="py-16 px-4 border-t border-neutral-800">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
            <div>
              <p className="text-3xl font-black text-red-500">$37B+</p>
              <p className="text-sm text-neutral-400 mt-1">
                Wasted on unnecessary meetings annually in the US alone
              </p>
            </div>
            <div>
              <p className="text-3xl font-black text-red-500">31 hrs</p>
              <p className="text-sm text-neutral-400 mt-1">
                Average time spent in unproductive meetings per month
              </p>
            </div>
            <div>
              <p className="text-3xl font-black text-red-500">73%</p>
              <p className="text-sm text-neutral-400 mt-1">
                Of professionals do other work during meetings
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 px-4 border-t border-neutral-800">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-10">How it works</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div>
              <div className="text-3xl mb-3">1.</div>
              <h3 className="font-bold mb-1">Input your meeting</h3>
              <p className="text-sm text-neutral-400">
                Attendees, duration, avg salary. Takes 10 seconds.
              </p>
            </div>
            <div>
              <div className="text-3xl mb-3">2.</div>
              <h3 className="font-bold mb-1">Get your receipt</h3>
              <p className="text-sm text-neutral-400">
                See the total cost, snarky line items, and a verdict.
              </p>
            </div>
            <div>
              <div className="text-3xl mb-3">3.</div>
              <h3 className="font-bold mb-1">Share the pain</h3>
              <p className="text-sm text-neutral-400">
                Copy it. Screenshot it. Post it in Slack. Cancel the next one.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 border-t border-neutral-800">
        <div className="max-w-lg mx-auto text-center">
          <p className="text-2xl font-bold mb-3">
            This page could have been a meeting.
          </p>
          <p className="text-neutral-400 mb-6">
            But then it would have cost $847.
          </p>
          <a
            href="#top"
            className="inline-block px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-colors"
          >
            Calculate a meeting
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-neutral-800 text-center text-sm text-neutral-500">
        <p>
          Built by{" "}
          <a
            href="https://github.com/carsonlabs"
            className="text-neutral-400 hover:text-white transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            Carson Roell
          </a>{" "}
          &middot; This meeting is adjourned.
        </p>
      </footer>
    </main>
  );
}
