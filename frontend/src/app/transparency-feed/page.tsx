const feedEvents = [
  {
    id: "AV-992-QX",
    title: "Mercury Spike Detected",
    location: "East River Basin",
    status: "Report Filed",
  },
  {
    id: "AV-422-BT",
    title: "Ciprofloxacin Above Legal Limit",
    location: "Sector 09-Beta",
    status: "Under Review",
  },
  {
    id: "AV-118-LM",
    title: "Lead Contamination Burst",
    location: "Industrial Outlet 4B",
    status: "Escalated",
  },
];

export default function TransparencyFeedPage() {
  return (
    <section className="stack-lg">
      <div className="panel panel--hero">
        <div>
          <p className="kicker">Public Oversight</p>
          <h1 className="headline-lg">Transparency Feed</h1>
          <p className="muted">
            Chronological disclosure of verified alerts, evidence IDs, and
            enforcement activity.
          </p>
        </div>
      </div>

      <article className="stack-sm">
        {feedEvents.map((event) => (
          <div className="panel feed-row" key={event.id}>
            <div>
              <p className="kicker">Evidence ID: {event.id}</p>
              <h2 className="headline-md">{event.title}</h2>
            </div>
            <div className="feed-row__meta">
              <span>{event.location}</span>
              <span>{event.status}</span>
            </div>
          </div>
        ))}
      </article>
    </section>
  );
}
