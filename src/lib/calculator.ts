export interface MeetingInput {
  attendees: number;
  durationMinutes: number;
  avgSalary: number; // annual
  meetingTitle: string;
}

export interface MeetingReceipt {
  title: string;
  attendees: number;
  durationMinutes: number;
  costPerMinute: number;
  totalCost: number;
  perPersonCost: number;
  devHoursConsumed: number;
  couldHaveShipped: string[];
  verdict: string;
  severityLevel: "mild" | "painful" | "brutal" | "catastrophic";
  snarkyLineItems: LineItem[];
}

export interface LineItem {
  label: string;
  amount: string;
}

const WORKING_HOURS_PER_YEAR = 2080;

// ── DYNAMIC LINE ITEM POOL ──
// Each item has a condition function and a cost function.
// Only items whose condition matches the meeting inputs are eligible.
// From the eligible pool, we randomly select 5-7 items per receipt.

interface LineItemTemplate {
  label: string | ((input: MeetingInput) => string);
  costMultiplier: (input: MeetingInput, costPerMinute: number, totalCost: number) => number;
  condition: (input: MeetingInput) => boolean;
}

const LINE_ITEM_POOL: LineItemTemplate[] = [
  // ── ALWAYS ELIGIBLE (universal meeting pain) ──
  {
    label: "Awkward silence while someone finds the mute button",
    costMultiplier: (_i, cpm) => cpm * 1.5,
    condition: () => true,
  },
  {
    label: '"Can everyone see my screen?"',
    costMultiplier: (_i, cpm) => cpm * 2.5,
    condition: () => true,
  },
  {
    label: "Waiting for the host to admit people from the lobby",
    costMultiplier: (_i, cpm) => cpm * 2,
    condition: () => true,
  },
  {
    label: "Someone typing loudly on an unmuted mic",
    costMultiplier: (_i, cpm) => cpm * 1,
    condition: () => true,
  },
  {
    label: '"Sorry, you go ahead — no, you go"',
    costMultiplier: (_i, cpm) => cpm * 1.5,
    condition: () => true,
  },
  {
    label: '"Can you repeat that? I was on mute"',
    costMultiplier: (_i, cpm) => cpm * 2,
    condition: () => true,
  },
  {
    label: "Dog barking in someone's background",
    costMultiplier: (_i, cpm) => cpm * 1,
    condition: () => true,
  },
  {
    label: "Pretending to take notes (actually on Twitter)",
    costMultiplier: (_i, _cpm, total) => total * 0.08,
    condition: () => true,
  },
  {
    label: "Collective staring at a shared screen in silence",
    costMultiplier: (_i, cpm) => cpm * 3,
    condition: () => true,
  },
  {
    label: '"Quick question" that was not quick',
    costMultiplier: (_i, cpm) => cpm * 5,
    condition: () => true,
  },
  {
    label: "Nodding while having absolutely no idea what's happening",
    costMultiplier: (_i, _cpm, total) => total * 0.1,
    condition: () => true,
  },
  {
    label: '"I think you\'re still on mute"',
    costMultiplier: (_i, cpm) => cpm * 1.5,
    condition: () => true,
  },
  {
    label: "Zoom fatigue (pre-existing condition)",
    costMultiplier: (_i, _cpm, total) => total * 0.05,
    condition: () => true,
  },
  {
    label: "Recycled talking points from last week's meeting",
    costMultiplier: (_i, cpm) => cpm * 4,
    condition: () => true,
  },
  {
    label: '"Let me share something real quick" (it was not quick)',
    costMultiplier: (_i, cpm) => cpm * 3.5,
    condition: () => true,
  },

  // ── SHORT MEETINGS (< 20 min) ──
  {
    label: "Scheduling overhead that took longer than the meeting itself",
    costMultiplier: (_i, cpm) => cpm * 8,
    condition: (i) => i.durationMinutes < 20,
  },
  {
    label: "Calendar invite that could've been a Slack message",
    costMultiplier: (_i, cpm) => cpm * 2,
    condition: (i) => i.durationMinutes <= 15,
  },
  {
    label: "Context switching cost for a meeting shorter than a coffee break",
    costMultiplier: (i, cpm) => cpm * i.attendees * 0.5,
    condition: (i) => i.durationMinutes <= 15,
  },

  // ── MEDIUM MEETINGS (20-45 min) ──
  {
    label: '"We should schedule a follow-up to discuss this further"',
    costMultiplier: (_i, _cpm, total) => total * 0.15,
    condition: (i) => i.durationMinutes >= 20 && i.durationMinutes <= 45,
  },
  {
    label: "Last 5 minutes spent scheduling the next meeting",
    costMultiplier: (_i, cpm) => cpm * 5,
    condition: (i) => i.durationMinutes >= 25,
  },
  {
    label: "Action items that everyone will forget by tomorrow",
    costMultiplier: (_i, _cpm, total) => total * 0.12,
    condition: (i) => i.durationMinutes >= 20,
  },

  // ── LONG MEETINGS (45+ min) ──
  {
    label: '"Let\'s circle back on that"',
    costMultiplier: (_i, cpm) => cpm * 4,
    condition: (i) => i.durationMinutes >= 45,
  },
  {
    label: "People secretly checking email for the last 20 minutes",
    costMultiplier: (i, cpm) => cpm * 20 * (i.attendees > 5 ? 0.6 : 0.3),
    condition: (i) => i.durationMinutes >= 45,
  },
  {
    label: "Collective energy crash at the 40-minute mark",
    costMultiplier: (_i, cpm) => cpm * 10,
    condition: (i) => i.durationMinutes >= 45,
  },
  {
    label: "The meeting that should have ended 20 minutes ago",
    costMultiplier: (_i, cpm) => cpm * 20,
    condition: (i) => i.durationMinutes >= 50,
  },
  {
    label: "Bathroom break someone is too polite to ask for",
    costMultiplier: (_i, cpm) => cpm * 3,
    condition: (i) => i.durationMinutes >= 50,
  },

  // ── MARATHON MEETINGS (90+ min) ──
  {
    label: "Third person to say 'just to piggyback on that'",
    costMultiplier: (_i, cpm) => cpm * 3,
    condition: (i) => i.durationMinutes >= 90,
  },
  {
    label: "Someone's laptop dying mid-presentation",
    costMultiplier: (_i, cpm) => cpm * 5,
    condition: (i) => i.durationMinutes >= 90,
  },
  {
    label: "Existential dread setting in around minute 75",
    costMultiplier: (i, cpm) => cpm * i.attendees,
    condition: (i) => i.durationMinutes >= 90,
  },
  {
    label: '"Can we take a 5-minute break?" (it was 15 minutes)',
    costMultiplier: (_i, cpm) => cpm * 15,
    condition: (i) => i.durationMinutes >= 90,
  },
  {
    label: "Second wind of off-topic conversation",
    costMultiplier: (_i, cpm) => cpm * 8,
    condition: (i) => i.durationMinutes >= 90,
  },

  // ── SMALL MEETINGS (2-3 people) ──
  {
    label: "Uncomfortable eye contact in a 2-person video call",
    costMultiplier: (_i, cpm) => cpm * 3,
    condition: (i) => i.attendees <= 3,
  },
  {
    label: "This could have been a DM",
    costMultiplier: (_i, cpm) => cpm * 2,
    condition: (i) => i.attendees === 2,
  },
  {
    label: "Two people agreeing with each other for 30 minutes",
    costMultiplier: (_i, _cpm, total) => total * 0.4,
    condition: (i) => i.attendees === 2 && i.durationMinutes >= 30,
  },

  // ── MEDIUM GROUPS (4-8 people) ──
  {
    label: "One person doing 80% of the talking",
    costMultiplier: (_i, _cpm, total) => total * 0.15,
    condition: (i) => i.attendees >= 4 && i.attendees <= 8,
  },
  {
    label: "Two side conversations happening simultaneously",
    costMultiplier: (_i, cpm) => cpm * 4,
    condition: (i) => i.attendees >= 5,
  },
  {
    label: "Someone presenting slides nobody read beforehand",
    costMultiplier: (_i, cpm) => cpm * 6,
    condition: (i) => i.attendees >= 4,
  },
  {
    label: '"I\'ll send the deck after this" (they never did)',
    costMultiplier: (_i, cpm) => cpm * 2,
    condition: (i) => i.attendees >= 4,
  },

  // ── LARGE MEETINGS (8+ people) ──
  {
    label: (i) => `${Math.floor(i.attendees * 0.4)} people who didn't need to be here`,
    costMultiplier: (i, _cpm, total) => (total / i.attendees) * Math.floor(i.attendees * 0.4),
    condition: (i) => i.attendees >= 8,
  },
  {
    label: '"Does anyone have any questions?" (nobody responds for 8 seconds)',
    costMultiplier: (_i, cpm) => cpm * 0.15,
    condition: (i) => i.attendees >= 8,
  },
  {
    label: "Half the attendees are on their phones",
    costMultiplier: (_i, _cpm, total) => total * 0.25,
    condition: (i) => i.attendees >= 10,
  },
  {
    label: "Three managers agreeing in slightly different words",
    costMultiplier: (_i, cpm) => cpm * 6,
    condition: (i) => i.attendees >= 8,
  },
  {
    label: "Someone joining 15 minutes late and asking what they missed",
    costMultiplier: (_i, cpm) => cpm * 5,
    condition: (i) => i.attendees >= 6,
  },

  // ── ALL-HANDS / HUGE MEETINGS (15+ people) ──
  {
    label: "Motivational speech that motivated no one",
    costMultiplier: (_i, cpm) => cpm * 10,
    condition: (i) => i.attendees >= 15,
  },
  {
    label: '"Exciting announcements" that were in last week\'s email',
    costMultiplier: (_i, cpm) => cpm * 8,
    condition: (i) => i.attendees >= 15,
  },
  {
    label: (i) => `${i.attendees} people watching 1 person read a slide deck out loud`,
    costMultiplier: (_i, _cpm, total) => total * 0.3,
    condition: (i) => i.attendees >= 15,
  },
  {
    label: "Forced Q&A where only the CEO's favorite asks questions",
    costMultiplier: (_i, cpm) => cpm * 5,
    condition: (i) => i.attendees >= 20,
  },
  {
    label: "Applause break for a metric nobody understands",
    costMultiplier: (_i, cpm) => cpm * 2,
    condition: (i) => i.attendees >= 20,
  },

  // ── HIGH SALARY (tech company energy) ──
  {
    label: "Senior engineers silently calculating this meeting's cost",
    costMultiplier: (_i, cpm) => cpm * 3,
    condition: (i) => i.avgSalary >= 150000,
  },
  {
    label: "Opportunity cost of not shipping code right now",
    costMultiplier: (_i, _cpm, total) => total * 0.2,
    condition: (i) => i.avgSalary >= 150000,
  },
  {
    label: "A standup that turned into a planning session",
    costMultiplier: (_i, cpm) => cpm * 10,
    condition: (i) => i.avgSalary >= 120000 && i.durationMinutes >= 20,
  },
  {
    label: "VC-funded minutes going up in smoke",
    costMultiplier: (_i, _cpm, total) => total * 0.1,
    condition: (i) => i.avgSalary >= 180000,
  },
  {
    label: "Stock options vesting during this meeting (not yours though)",
    costMultiplier: (_i, cpm) => cpm * 2,
    condition: (i) => i.avgSalary >= 200000,
  },

  // ── LOW SALARY (startup / nonprofit energy) ──
  {
    label: "An hour of labor that costs more than the office coffee budget",
    costMultiplier: (_i, cpm) => cpm * 5,
    condition: (i) => i.avgSalary < 60000 && i.durationMinutes >= 60,
  },
  {
    label: "Budget meeting that cost more than the thing being budgeted",
    costMultiplier: (_i, _cpm, total) => total * 0.15,
    condition: (i) => i.avgSalary < 70000,
  },

  // ── REMOTE WORK SPECIFIC ──
  {
    label: "Frozen screen while someone says something important",
    costMultiplier: (_i, cpm) => cpm * 2,
    condition: () => true,
  },
  {
    label: '"You\'re breaking up" (they weren\'t)',
    costMultiplier: (_i, cpm) => cpm * 1.5,
    condition: () => true,
  },
  {
    label: "Echo feedback loop that took 2 minutes to troubleshoot",
    costMultiplier: (_i, cpm) => cpm * 2,
    condition: () => true,
  },
  {
    label: "Background child/pet cameo derailing the conversation",
    costMultiplier: (_i, cpm) => cpm * 3,
    condition: () => true,
  },
  {
    label: "Someone clearly in a car pretending they're not driving",
    costMultiplier: (_i, cpm) => cpm * 2,
    condition: (i) => i.attendees >= 4,
  },
  {
    label: "Virtual background glitching to reveal an unmade bed",
    costMultiplier: (_i, cpm) => cpm * 1,
    condition: () => true,
  },
  {
    label: "Doorbell ringing at the worst possible moment",
    costMultiplier: (_i, cpm) => cpm * 1.5,
    condition: () => true,
  },

  // ── CORPORATE CULTURE ──
  {
    label: '"Let\'s take this offline" (it will never be taken offline)',
    costMultiplier: (_i, cpm) => cpm * 4,
    condition: (i) => i.attendees >= 5,
  },
  {
    label: '"Just to align on next steps"',
    costMultiplier: (_i, cpm) => cpm * 3,
    condition: (i) => i.durationMinutes >= 30,
  },
  {
    label: '"Per my last email" said with barely concealed rage',
    costMultiplier: (_i, cpm) => cpm * 2,
    condition: (i) => i.attendees >= 4,
  },
  {
    label: "Passive-aggressive disagreement disguised as a question",
    costMultiplier: (_i, cpm) => cpm * 3,
    condition: (i) => i.attendees >= 5,
  },
  {
    label: "Someone screen-sharing and accidentally revealing their Spotify",
    costMultiplier: (_i, cpm) => cpm * 1,
    condition: () => true,
  },
  {
    label: "Agenda that was abandoned within the first 3 minutes",
    costMultiplier: (_i, cpm) => cpm * 3,
    condition: (i) => i.durationMinutes >= 30,
  },
  {
    label: '"Synergy" used unironically',
    costMultiplier: (_i, cpm) => cpm * 2,
    condition: (i) => i.attendees >= 6,
  },
  {
    label: "Debate that could have been resolved with a 2-line Slack poll",
    costMultiplier: (_i, cpm) => cpm * 8,
    condition: (i) => i.attendees >= 4 && i.durationMinutes >= 30,
  },
  {
    label: "Manager reading the room and deciding to extend by 15 minutes",
    costMultiplier: (_i, cpm) => cpm * 15,
    condition: (i) => i.durationMinutes >= 30 && i.attendees >= 4,
  },
  {
    label: '"Great discussion everyone" (it was not great)',
    costMultiplier: (_i, cpm) => cpm * 1,
    condition: (i) => i.durationMinutes >= 20,
  },
];

const COULD_HAVE_SHIPPED = [
  "3 bug fixes",
  "a landing page redesign",
  "that feature request from 6 months ago",
  "an entire MVP",
  "a working prototype",
  "the deployment pipeline everyone's been asking about",
  "automated tests for the checkout flow",
  "a coffee run for the entire office",
  "a proper README",
  "that migration nobody wants to do",
  "an onboarding flow",
  "a Slack bot that auto-declines meetings",
  "the API documentation",
  "a competitive analysis",
  "literally anything else",
  "a nap (which would've been more productive)",
  "an intern's entire first week of work",
  "the refactor you've been putting off since Q2",
  "a working demo for the investor meeting",
  "two pull requests and a code review",
];

const VERDICTS = {
  mild: [
    "Not great, not terrible. Like a meeting about meetings — wait.",
    "You got off easy this time. The meeting gods showed mercy.",
    "Could've been an email, but at least it was a short email.",
  ],
  painful: [
    "This meeting cost more than most people's monthly grocery bill.",
    "Somewhere, a PM is adding 'attended meeting' to their OKRs.",
    "You just burned through enough cash to hire a freelancer for a week.",
    "That's a lot of money for something that could've been a Slack thread.",
  ],
  brutal: [
    "This meeting cost more than your company's monthly coffee budget. And we all know how much you spend on coffee.",
    "You could have literally paid someone's rent with this meeting.",
    "The ROI on this meeting is what economists call 'aggressively negative.'",
    "This is the kind of meeting that makes people update their LinkedIn.",
  ],
  catastrophic: [
    "This meeting cost more than a used car. A USED CAR.",
    "Congratulations, you've achieved Meeting Bankruptcy.",
    "At this burn rate, you're not running a company — you're running a very expensive book club.",
    "Whoever scheduled this should be required to venmo every attendee.",
    "This meeting just became a line item that Finance is going to ask about.",
  ],
};

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function pickMultipleRandom<T>(arr: T[], count: number): T[] {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

function buildLineItems(
  input: MeetingInput,
  costPerMinute: number,
  totalCost: number
): LineItem[] {
  // Always include the base cost line
  const items: LineItem[] = [
    {
      label: `${input.attendees} humans × ${input.durationMinutes} min`,
      amount: `$${totalCost.toFixed(2)}`,
    },
  ];

  // Filter pool to eligible items
  const eligible = LINE_ITEM_POOL.filter((t) => t.condition(input));

  // Pick 5-7 random items from eligible pool
  const count = input.durationMinutes >= 60 ? 7 : input.attendees >= 10 ? 7 : 5;
  const selected = pickMultipleRandom(eligible, Math.min(count, eligible.length));

  for (const template of selected) {
    const label =
      typeof template.label === "function"
        ? template.label(input)
        : template.label;
    const cost = template.costMultiplier(input, costPerMinute, totalCost);
    items.push({
      label,
      amount: `$${cost.toFixed(2)}`,
    });
  }

  return items;
}

export function calculateMeeting(input: MeetingInput): MeetingReceipt {
  const hourlyRate = input.avgSalary / WORKING_HOURS_PER_YEAR;
  const minuteRate = hourlyRate / 60;
  const costPerMinute = minuteRate * input.attendees;
  const totalCost = costPerMinute * input.durationMinutes;
  const perPersonCost = totalCost / input.attendees;
  const devHoursConsumed = (input.durationMinutes * input.attendees) / 60;

  let severityLevel: MeetingReceipt["severityLevel"];
  if (totalCost < 200) severityLevel = "mild";
  else if (totalCost < 800) severityLevel = "painful";
  else if (totalCost < 2000) severityLevel = "brutal";
  else severityLevel = "catastrophic";

  const shipCount =
    severityLevel === "mild" ? 1 : severityLevel === "painful" ? 2 : 3;
  const couldHaveShipped = pickMultipleRandom(COULD_HAVE_SHIPPED, shipCount);
  const verdict = pickRandom(VERDICTS[severityLevel]);

  const snarkyLineItems = buildLineItems(input, costPerMinute, totalCost);

  return {
    title: input.meetingTitle || "Untitled Meeting",
    attendees: input.attendees,
    durationMinutes: input.durationMinutes,
    costPerMinute,
    totalCost,
    perPersonCost,
    devHoursConsumed,
    couldHaveShipped,
    verdict,
    severityLevel,
    snarkyLineItems,
  };
}
