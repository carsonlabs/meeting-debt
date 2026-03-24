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

  const shipCount = severityLevel === "mild" ? 1 : severityLevel === "painful" ? 2 : 3;
  const couldHaveShipped = pickMultipleRandom(COULD_HAVE_SHIPPED, shipCount);
  const verdict = pickRandom(VERDICTS[severityLevel]);

  const snarkyLineItems: LineItem[] = [
    {
      label: `${input.attendees} humans × ${input.durationMinutes} min`,
      amount: `$${totalCost.toFixed(2)}`,
    },
    {
      label: "Awkward silence (estimated 12%)",
      amount: `$${(totalCost * 0.12).toFixed(2)}`,
    },
    {
      label: '"Can everyone see my screen?"',
      amount: `$${(costPerMinute * 2.5).toFixed(2)}`,
    },
    {
      label: "Waiting for that one person to join",
      amount: `$${(costPerMinute * 3).toFixed(2)}`,
    },
    {
      label: "Someone talking on mute",
      amount: `$${(costPerMinute * 1.5).toFixed(2)}`,
    },
  ];

  if (input.durationMinutes >= 60) {
    snarkyLineItems.push({
      label: '"Let\'s circle back on that"',
      amount: `$${(costPerMinute * 4).toFixed(2)}`,
    });
  }

  if (input.attendees >= 8) {
    snarkyLineItems.push({
      label: "People who didn't need to be here",
      amount: `$${(perPersonCost * Math.floor(input.attendees * 0.4)).toFixed(2)}`,
    });
  }

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
