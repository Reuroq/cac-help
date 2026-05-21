export const metadata = {
  title: 'Military Help Desk Phone Numbers',
  description: 'Official help desk numbers for every branch when CAC.help can\'t solve your problem.',
};

const DESKS = [
  { branch: 'Army (AESD)', phone: '866-335-2769', hours: '24/7', notes: 'Army Enterprise Service Desk. For Army365, AKO replacement systems, ArmyIgnitED.' },
  { branch: 'Navy (Navy 311)', phone: '855-628-9311', hours: '24/7', notes: 'For NMCI, Navy webmail, NavyEMS.' },
  { branch: 'Air Force / Space Force', phone: '210-925-2900', hours: 'M-F 0600-2000 CT', notes: 'AFNet help. Also: af.servicenowservices.com.' },
  { branch: 'Marine Corps (MCEN)', phone: '855-373-8762', hours: '24/7', notes: 'For MCEN, MOL, MCTIMS.' },
  { branch: 'Coast Guard (CGFIXIT)', phone: '855-243-4948', hours: '24/7', notes: 'For CG OneNet, Direct Access.' },
  { branch: 'DISA Global Service Desk', phone: '844-347-2457', hours: '24/7', notes: 'For DoD-wide systems (DoDEMR, DTS, DEERS).' },
  { branch: 'DMDC Support', phone: '800-538-9552', hours: 'M-F 0500-1700 PT', notes: 'For RAPIDS, DEERS, milConnect, PIV activation.' },
  { branch: 'DTS (Defense Travel System)', phone: '888-435-7146', hours: '24/7', notes: 'Travel-specific help.' },
];

export default function HelpDesksPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-4xl font-bold text-mil-900 mb-2">Help Desk Phone Numbers</h1>
      <p className="text-mil-700 mb-8 text-lg">
        When you've tried everything and your problem is bigger than a CAC issue — call the people who can reset accounts and unstick accounts on the back end.
      </p>
      <div className="space-y-3">
        {DESKS.map((d) => (
          <div key={d.branch} className="bg-white border border-mil-200 rounded-xl p-5">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <h2 className="text-lg font-bold text-mil-900">{d.branch}</h2>
                <p className="text-sm text-mil-600 mt-1">{d.notes}</p>
              </div>
              <div className="text-right">
                <a href={`tel:${d.phone.replace(/-/g, '')}`} className="text-xl font-mono font-bold text-mil-700 hover:text-mil-900 block">
                  {d.phone}
                </a>
                <p className="text-xs text-mil-400">{d.hours}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
