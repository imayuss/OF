import Icon from '../ui/Icon';

const CARDS = [
  { href: 'https://github.com/S3DFX-CYBER', icon: 'person', title: 'GitHub Profile', body: 'Follow the maintainer and check out other projects.' },
  { href: 'https://github.com/S3DFX-CYBER/FindMyGSoC/issues', icon: 'bug_report', title: 'Report Issues', body: 'Found a bug or have a feature request? Open an issue.' },
  { href: 'https://discord.gg/jYrbHKtn8t', icon: 'forum', title: 'Join Discord', body: 'Connect with the community for discussions and support.' },
];

export default function Contact() {
  return (
    <section id="contact" className="py-20 px-6 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-extrabold font-headline tracking-tight mb-4">Get in Touch</h2>
        <p className="text-zinc-600 max-w-2xl mx-auto">Have questions, feedback, or need help? We&apos;d love to hear from you.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
        {CARDS.map((c) => (
          <a
            key={c.title}
            href={c.href}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white border border-zinc-200 rounded-2xl p-6 hover:border-primary hover:shadow-lg transition-all text-center group"
          >
            <div className="w-12 h-12 rounded-xl bg-zinc-100 flex items-center justify-center mx-auto mb-4 group-hover:bg-orange-100 transition-colors">
              <Icon name={c.icon} className="text-zinc-600 group-hover:text-primary-ink" />
            </div>
            <h3 className="font-bold mb-2">{c.title}</h3>
            <p className="text-sm text-zinc-600">{c.body}</p>
          </a>
        ))}
      </div>
    </section>
  );
}
