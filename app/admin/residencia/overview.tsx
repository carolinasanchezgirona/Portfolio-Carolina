import type {Entry, Kind, Resident} from './model';
import {nextReview, sections, today} from './model';

type Props = {
  residents: Resident[];
  onDirectory: () => void;
  onSchedule: () => void;
  onOpen: (resident: Resident, kind?: Kind | 'profile', entry?: Entry | null) => void;
};

export default function ResidenceOverview({residents, onDirectory, onSchedule, onOpen}: Props) {
  const now = today();
  const active = residents.filter(r => r.status === 'active');
  const reviews = active.filter(r => !nextReview(r) || nextReview(r) <= now)
    .sort((a, b) => nextReview(a).localeCompare(nextReview(b)));
  const goals = active.flatMap(r => r.data.goals
    .filter(e => !['Alcanzado', 'Cerrado', 'Reformulado'].includes(e.state) && e.next && e.next <= now)
    .map(entry => ({resident: r, entry})))
    .sort((a, b) => a.entry.next.localeCompare(b.entry.next));
  const actions = active.flatMap(r => (['followups', 'interviews', 'scales', 'meetings', 'incidents', 'documents'] as Kind[])
    .flatMap(kind => r.data[kind].filter(e => e.next && e.next <= now)
      .map(entry => ({resident: r, kind, entry}))))
    .sort((a, b) => a.entry.next.localeCompare(b.entry.next));
  const upcoming = active.filter(r => nextReview(r) > now)
    .sort((a, b) => nextReview(a).localeCompare(nextReview(b)));
  return <section className="res-overview" aria-labelledby="res-overview-title">
    <div className="res-heading">
      <div><h2 id="res-overview-title">Tu trabajo en residencia</h2><p className="res-help">Revisa lo pendiente y accede al historial de cada persona.</p></div>
      <button type="button" onClick={onSchedule}>Ver horario</button>
    </div>
    <div className="res-stats res-no-print">
      <button type="button" onClick={onDirectory}><strong>{active.length}</strong> residentes activos</button>
      <a href="#res-pending-reviews"><strong>{reviews.length}</strong> valoraciones por programar o revisar</a>
      <a href="#res-pending-goals"><strong>{goals.length}</strong> objetivos por revisar</a>
    </div>
    <div className="res-overview-grid">
      <section className="res-content" id="res-pending-reviews" aria-labelledby="res-review-title">
        <h3 id="res-review-title">Valoraciones pendientes</h3>
        {reviews.length ? reviews.map(r => <article className="res-review-item" key={r.id}>
          <div><strong>{r.data.profile.name || r.code}</strong><p>{r.center}</p><small>{nextReview(r) ? 'Revisión prevista: ' + nextReview(r) : 'Sin revisión programada'}</small></div>
          <button type="button" onClick={() => onOpen(r, 'assessments')}>Revisar valoración</button>
        </article>) : <p>No hay valoraciones pendientes.</p>}
      </section>
      <section className="res-content" id="res-pending-goals" aria-labelledby="res-goals-title">
        <h3 id="res-goals-title">Objetivos PIAI por revisar</h3>
        {goals.length ? goals.map(({resident: r, entry: e}) => <article className="res-review-item" key={r.id + e.id}>
          <div><strong>{r.data.profile.name || r.code}</strong><p>{e.objective || e.area || 'Objetivo PIAI'}</p><small>Revisión: {e.next}</small></div>
          <button type="button" onClick={() => onOpen(r, 'goals', e)}>Revisar objetivo</button>
        </article>) : <p>No hay objetivos pendientes de revisión.</p>}
      </section>
      <section className="res-content" aria-labelledby="res-actions-title">
        <h3 id="res-actions-title">Actuaciones pendientes</h3>
        {actions.length ? actions.map(({resident: r, kind, entry: e}) => <article className="res-review-item" key={r.id + kind + e.id}>
          <div><strong>{r.data.profile.name || r.code}</strong><p>{sections.find(s => s.key === kind)?.title}</p><small>Previsto: {e.next}</small></div>
          <button type="button" onClick={() => onOpen(r, kind, e)}>Ver actuación</button>
        </article>) : <p>No hay actuaciones pendientes con fecha de revisión.</p>}
      </section>
      <section className="res-content" aria-labelledby="res-upcoming-title">
        <h3 id="res-upcoming-title">Próximas revisiones</h3>
        {upcoming.length ? upcoming.map(r => <article className="res-review-item" key={r.id}>
          <div><strong>{r.data.profile.name || r.code}</strong><p>{r.center}</p><small>{nextReview(r)}</small></div>
          <button type="button" onClick={() => onOpen(r, 'assessments')}>Ver valoración</button>
        </article>) : <p>No hay próximas revisiones programadas.</p>}
      </section>
    </div>
  </section>;
}
